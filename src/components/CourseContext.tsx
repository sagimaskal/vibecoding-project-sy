"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Course, Major } from "@/lib/types";
import { evaluateRequirements, EvaluationResult } from "@/utils/requirementEvaluator";
import requirementRules from "@/data/requirementRules.json";
import { logEvent } from "@/lib/logger";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./providers/AuthProvider";

interface Stats {
  total: number;
  categories: Record<string, number>;
  validTotal: number;
  validCategories: Record<string, number>;
  plannedTotal: number;
  plannedCategories: Record<string, number>;
  hasThresholdFailures: boolean;
  gpa: number | null;
}

interface CourseContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, "id">) => Promise<boolean>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<boolean>;
  deleteCourse: (id: string) => Promise<void>;
  resetData: () => Promise<void>;
  isLoaded: boolean;
  userName: string;
  userEmail: string;
  econStats: Stats;
  bizStats: Stats;
  evaluation: EvaluationResult | null;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch courses from Supabase
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setCourses([]);
      setIsLoaded(true);
      return;
    }

    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        setCourses(data || []);
      }
      setIsLoaded(true);
    };

    fetchCourses();
  }, [user, authLoading]);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "סטודנט";
  const userEmail = user?.email || "";

  const getMinGradeForRule = (courseId: string): number => {
    if (!requirementRules || !requirementRules.transitions) return 60;
    
    const id = String(courseId);
    const rules = (requirementRules as any).transitions.YearAtoB.regularPass.groups;
    
    for (const group of rules) {
        if (group.courses) {
            const match = group.courses.find((c: any) => String(c.courseId) === id);
            if (match) return match.minGrade;
        }
        if (group.required) {
            const match = group.required.find((c: any) => String(c.courseId) === id);
            if (match) return match.minGrade;
        }
    }
    return 60; // Default
  };

  const calculateStats = useCallback((major: Major): Stats => {
    const majorCourses = courses.filter(c => c.major === major);
    
    let total = 0;
    let validTotal = 0;
    let plannedTotal = 0;
    const categories: Record<string, number> = {};
    const validCategories: Record<string, number> = {};
    const plannedCategories: Record<string, number> = {};
    let hasThresholdFailures = false;

    let totalGradePoints = 0;
    let totalCreditsWithGrades = 0;

    majorCourses.forEach(c => {
      total += c.credits;
      categories[c.category] = (categories[c.category] || 0) + c.credits;

      const hasGrade = c.grade !== undefined && c.grade !== null;

      if (hasGrade && c.credits > 0) {
        totalGradePoints += c.grade! * c.credits;
        totalCreditsWithGrades += c.credits;
      }

      const isPlanned = c.status === 'not_completed' || (c.status === 'completed_with_grade' && !hasGrade);

      if (isPlanned) {
        plannedTotal += c.credits;
        plannedCategories[c.category] = (plannedCategories[c.category] || 0) + c.credits;
      } else if (c.status === 'completed_without_grade') {
        validTotal += c.credits;
        validCategories[c.category] = (validCategories[c.category] || 0) + c.credits;
      } else if (c.status === 'completed_with_grade' && hasGrade) {
        const minGrade = getMinGradeForRule(c.number);
        if (c.grade! >= minGrade) {
          validTotal += c.credits;
          validCategories[c.category] = (validCategories[c.category] || 0) + c.credits;
        } else {
          hasThresholdFailures = true;
        }
      } else {
        if (!hasGrade) {
          plannedTotal += c.credits;
          plannedCategories[c.category] = (plannedCategories[c.category] || 0) + c.credits;
        } else if (c.grade! >= 60) {
          validTotal += c.credits;
          validCategories[c.category] = (validCategories[c.category] || 0) + c.credits;
        } else {
          hasThresholdFailures = true;
        }
      }
    });
    
    const gpa = totalCreditsWithGrades > 0 ? totalGradePoints / totalCreditsWithGrades : null;

    return { 
      total, 
      categories, 
      validTotal, 
      validCategories,
      plannedTotal,
      plannedCategories,
      hasThresholdFailures,
      gpa
    };
  }, [courses]);

  const econStats = useMemo(() => calculateStats('Economics'), [calculateStats]);
  const bizStats = useMemo(() => calculateStats('Business'), [calculateStats]);

  const evaluation = useMemo(() => {
    if (!isLoaded) return null;
    const result = evaluateRequirements(courses);
    return result;
  }, [courses, isLoaded]);

  const addCourse = useCallback(async (courseData: Omit<Course, "id">) => {
    if (!user) return false;

    const isDuplicate = courses.some((c) => c.number === courseData.number);
    if (isDuplicate) {
      const msg = "קורס זה כבר הוזן למערכת ולא ניתן לספור אותו פעמיים";
      alert(msg);
      logEvent('validation_error', courseData, undefined, 'failure', msg);
      return false;
    }
    
    const { data, error } = await supabase
      .from('courses')
      .insert({
        ...courseData,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding course:", error);
      alert("אירעה שגיאה בהוספת הקורס");
      return false;
    }

    logEvent('course_added', data, { success: true });
    setCourses(prev => [data, ...prev]);
    return true;
  }, [courses, user]);

  const updateCourse = useCallback(async (id: string, updatedFields: Partial<Course>) => {
    if (!user) return false;

    if (updatedFields.number) {
      const isDuplicate = courses.some(
        (c) => c.number === updatedFields.number && c.id !== id
      );
      if (isDuplicate) {
        const msg = "מספר קורס זה כבר קיים במערכת";
        alert(msg);
        logEvent('validation_error', updatedFields, undefined, 'failure', msg);
        return false;
      }
    }

    const oldCourse = courses.find(c => c.id === id);
    
    const { data, error } = await supabase
      .from('courses')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating course:", error);
      alert("אירעה שגיאה בעדכון הקורס");
      return false;
    }

    logEvent('course_edited', { id, updatedFields }, { oldCourse });
    setCourses(prev => prev.map((c) => (c.id === id ? data : c)));
    return true;
  }, [courses, user]);

  const deleteCourse = useCallback(async (id: string) => {
    if (!user) return;
    
    const courseToDelete = courses.find(c => c.id === id);
    if (confirm("האם אתה בטוח שברצונך למחוק קורס זה?")) {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting course:", error);
        alert("אירעה שגיאה במחיקת הקורס");
        return;
      }

      logEvent('course_deleted', { id, courseToDelete }, { success: true });
      setCourses(prev => prev.filter((c) => c.id !== id));
    }
  }, [courses, user]);

  const resetData = useCallback(async () => {
    if (!user) return;
    if (confirm("האם אתה בטוח שברצונך למחוק את כל הנתונים?")) {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error("Error resetting data:", error);
        alert("אירעה שגיאה באיפוס הנתונים");
        return;
      }

      logEvent('data_reset', undefined, { success: true });
      setCourses([]);
    }
  }, [user]);

  const value = useMemo(() => ({
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    resetData,
    isLoaded,
    userName,
    userEmail,
    econStats,
    bizStats,
    evaluation
  }), [courses, addCourse, updateCourse, deleteCourse, resetData, isLoaded, userName, userEmail, econStats, bizStats, evaluation]);

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (context === undefined) throw new Error("useCourses must be used within a CourseProvider");
  return context;
}

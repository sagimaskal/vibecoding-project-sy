"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Course, Major } from "@/lib/types";
import { evaluateRequirements, EvaluationResult } from "@/utils/requirementEvaluator";
import requirementRules from "@/data/requirementRules.json";
import { logEvent } from "@/lib/logger";

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
  addCourse: (course: Omit<Course, "id">) => boolean;
  updateCourse: (id: string, course: Partial<Course>) => boolean;
  deleteCourse: (id: string) => void;
  resetData: () => void;
  isLoaded: boolean;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  econStats: Stats;
  bizStats: Stats;
  evaluation: EvaluationResult | null;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userName, setUserNameInternal] = useState<string>("");
  const [userEmail, setUserEmailInternal] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCourses = localStorage.getItem("huji_degree_courses");
    const savedName = localStorage.getItem("huji_user_name");
    const savedEmail = localStorage.getItem("huji_user_email");
    
    if (savedCourses) {
      try {
        const parsedCourses = JSON.parse(savedCourses);
        if (!Array.isArray(parsedCourses)) throw new Error("Saved data is not an array");

        // Ensure every course has a unique stable ID (Migration)
        const usedIds = new Set<string>();
        const migratedCourses = parsedCourses.map((c: any) => {
          let id = c.id;
          if (!id || usedIds.has(id)) {
            id = typeof crypto?.randomUUID === 'function' 
              ? crypto.randomUUID() 
              : Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
          }
          usedIds.add(id);
          return { ...c, id };
        });
        setCourses(migratedCourses);
      } catch (e) {
        console.error("Failed to parse courses", e);
        alert("נראה שיש בעיה בטעינת הנתונים השמורים. אם הבעיה נמשכת, ייתכן שיהיה צורך באיפוס נתונים.");
      }
    }
    if (savedName) setUserNameInternal(savedName);
    if (savedEmail) setUserEmailInternal(savedEmail);
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("huji_degree_courses", JSON.stringify(courses));
        localStorage.setItem("huji_user_name", userName);
        localStorage.setItem("huji_user_email", userEmail);
      } catch (e) {
        console.error("Failed to save to localStorage", e);
        if (e instanceof Error && e.name === 'QuotaExceededError') {
          alert("אין מספיק מקום באחסון הדפדפן כדי לשמור את השינויים.");
        }
      }
    }
  }, [courses, userName, userEmail, isLoaded]);

  const setUserName = useCallback((name: string) => setUserNameInternal(name), []);
  const setUserEmail = useCallback((email: string) => setUserEmailInternal(email), []);

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
      // 1. Add to entered totals
      total += c.credits;
      categories[c.category] = (categories[c.category] || 0) + c.credits;

      const hasGrade = c.grade !== undefined && c.grade !== null;

      // GPA calculation includes all courses with grades (even failed ones, per formula sum(grade*credits)/sum(credits))
      if (hasGrade && c.credits > 0) {
        totalGradePoints += c.grade! * c.credits;
        totalCreditsWithGrades += c.credits;
      }

      // 2. Determine status (Valid vs Planned vs Failed)
      
      // A course is "Planned" if it's explicitly not completed OR if it's completed with grade but has no grade yet
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
        // Fallback for older data or edge cases
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
    console.log("Requirement Evaluation Result:", result);
    return result;
  }, [courses, isLoaded]);

  const addCourse = useCallback((courseData: Omit<Course, "id">) => {
    const isDuplicate = courses.some((c) => c.number === courseData.number);
    if (isDuplicate) {
      const msg = "קורס זה כבר הוזן למערכת ולא ניתן לספור אותו פעמיים";
      alert(msg);
      logEvent('validation_error', courseData, undefined, 'failure', msg);
      return false;
    }
    
    const id = typeof crypto?.randomUUID === 'function' 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

    const newCourse: Course = { 
      ...courseData, 
      id
    };
    
    logEvent('course_added', newCourse, { success: true });

    setCourses(prev => [...prev, newCourse]);
    return true;
  }, [courses]);

  const updateCourse = useCallback((id: string, updatedFields: Partial<Course>) => {
    const courseExists = courses.some(c => c.id === id);
    if (!courseExists) {
      const msg = "שגיאה: הקורס לא נמצא במערכת.";
      alert(msg);
      logEvent('validation_error', { id, updatedFields }, undefined, 'error', msg);
      return false;
    }

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
    logEvent('course_edited', { id, updatedFields }, { oldCourse });

    setCourses(prev => prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)));
    return true;
  }, [courses]);

  const deleteCourse = useCallback((id: string) => {
    const courseToDelete = courses.find(c => c.id === id);
    if (confirm("האם אתה בטוח שברצונך למחוק קורס זה?")) {
      logEvent('course_deleted', { id, courseToDelete }, { success: true });
      setCourses(prev => prev.filter((c) => c.id !== id));
    }
  }, [courses]);

  const resetData = useCallback(() => {
    if (confirm("האם אתה בטוח שברצונך למחוק את כל הנתונים?")) {
      logEvent('data_reset', undefined, { success: true });
      setCourses([]);
      setUserNameInternal("");
      setUserEmailInternal("");
      localStorage.clear();
    }
  }, []);

  const value = useMemo(() => ({
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    resetData,
    isLoaded,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    econStats,
    bizStats,
    evaluation
  }), [courses, addCourse, updateCourse, deleteCourse, resetData, isLoaded, userName, setUserName, userEmail, setUserEmail, econStats, bizStats, evaluation]);

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (context === undefined) throw new Error("useCourses must be used within a CourseProvider");
  return context;
}

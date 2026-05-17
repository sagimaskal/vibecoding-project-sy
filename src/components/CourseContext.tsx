"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Course, Major } from "@/lib/types";
import { evaluateRequirements, EvaluationResult } from "@/utils/requirementEvaluator";

interface Stats {
  total: number;
  categories: Record<string, number>;
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
        setCourses(JSON.parse(savedCourses));
      } catch (e) {
        console.error("Failed to parse courses", e);
      }
    }
    if (savedName) setUserNameInternal(savedName);
    if (savedEmail) setUserEmailInternal(savedEmail);
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("huji_degree_courses", JSON.stringify(courses));
      localStorage.setItem("huji_user_name", userName);
      localStorage.setItem("huji_user_email", userEmail);
    }
  }, [courses, userName, userEmail, isLoaded]);

  const setUserName = useCallback((name: string) => setUserNameInternal(name), []);
  const setUserEmail = useCallback((email: string) => setUserEmailInternal(email), []);

  const calculateStats = (major: Major): Stats => {
    // Only count credits for courses that are completed (with or without grade) and not failed
    const majorCourses = courses.filter(c => {
      if (c.major !== major) return false;
      
      // Basic grade check for stats (complements evaluator)
      if (c.grade !== undefined && c.grade !== null && c.grade < 60) {
          // We need to check rules for specific minGrade later, 
          // but 60 is the default in evaluator too.
          return false;
      }
      
      return true;
    });

    const total = majorCourses.reduce((sum, c) => sum + c.credits, 0);
    const categories = majorCourses.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + c.credits;
      return acc;
    }, {} as Record<string, number>);
    
    return { total, categories };
  };

  const econStats = useMemo(() => calculateStats('Economics'), [courses]);
  const bizStats = useMemo(() => calculateStats('Business'), [courses]);

  const evaluation = useMemo(() => {
    if (!isLoaded) return null;
    const result = evaluateRequirements(courses);
    console.log("Requirement Evaluation Result:", result);
    return result;
  }, [courses, isLoaded]);

  const addCourse = useCallback((courseData: Omit<Course, "id">) => {
    const isDuplicate = courses.some((c) => c.number === courseData.number);
    if (isDuplicate) {
      alert("קורס זה כבר הוזן למערכת ולא ניתן לספור אותו פעמיים");
      return false;
    }
    
    const newCourse: Course = { 
      ...courseData, 
      id: Math.random().toString(36).substr(2, 9)
    };
    
    console.log("Adding Course:", {
        id: newCourse.id,
        course_id: newCourse.number,
        name: newCourse.name,
        grade: newCourse.grade,
        credits: newCourse.credits
    });

    setCourses(prev => [...prev, newCourse]);
    return true;
  }, [courses]);

  const updateCourse = useCallback((id: string, updatedFields: Partial<Course>) => {
    if (updatedFields.number) {
      const isDuplicate = courses.some(
        (c) => c.number === updatedFields.number && c.id !== id
      );
      if (isDuplicate) {
        alert("מספר קורס זה כבר קיים במערכת");
        return false;
      }
    }

    setCourses(prev => prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)));
    return true;
  }, [courses]);

  const deleteCourse = useCallback((id: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק קורס זה?")) {
      setCourses(prev => prev.filter((c) => c.id !== id));
    }
  }, []);

  const resetData = useCallback(() => {
    if (confirm("האם אתה בטוח שברצונך למחוק את כל הנתונים?")) {
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

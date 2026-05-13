"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Course, Major } from "@/lib/types";

interface Stats {
  total: number;
  categories: Record<string, number>;
}

interface CourseContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, "id">) => boolean;
  updateCourse: (id: string, course: Partial<Course>) => boolean;
  deleteCourse: (id: string) => void;
  toggleStar: (id: string) => void;
  resetData: () => void;
  isLoaded: boolean;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  econStats: Stats;
  bizStats: Stats;
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
    const majorCourses = courses.filter(c => c.major === major);
    const total = majorCourses.reduce((sum, c) => sum + c.credits, 0);
    const categories = majorCourses.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + c.credits;
      return acc;
    }, {} as Record<string, number>);
    
    return { total, categories };
  };

  const econStats = useMemo(() => calculateStats('Economics'), [courses]);
  const bizStats = useMemo(() => calculateStats('Business'), [courses]);

  const addCourse = useCallback((courseData: Omit<Course, "id">) => {
    const isDuplicate = courses.some((c) => c.number === courseData.number);
    if (isDuplicate) {
      alert("קורס זה כבר הוזן למערכת ולא ניתן לספור אותו פעמיים");
      return false;
    }
    
    const newCourse: Course = { 
      ...courseData, 
      id: Math.random().toString(36).substr(2, 9),
      starred: false 
    };
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

  const toggleStar = useCallback((id: string) => {
    setCourses(prev => {
      const course = prev.find(c => c.id === id);
      if (!course) return prev;
      
      const starredCount = prev.filter(c => c.starred).length;
      if (!course.starred && starredCount >= 5) {
        alert("ניתן לסמן עד 5 קורסים בלבד לקורות החיים");
        return prev;
      }
      
      return prev.map(c => c.id === id ? { ...c, starred: !c.starred } : c);
    });
  }, []);

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
    toggleStar,
    resetData,
    isLoaded,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    econStats,
    bizStats
  }), [courses, addCourse, updateCourse, deleteCourse, toggleStar, resetData, isLoaded, userName, setUserName, userEmail, setUserEmail, econStats, bizStats]);

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (context === undefined) throw new Error("useCourses must be used within a CourseProvider");
  return context;
}

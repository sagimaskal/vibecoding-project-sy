"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Course } from "@/lib/types";

interface CourseContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, "id">) => boolean;
  updateCourse: (course: Course) => boolean;
  deleteCourse: (id: string) => void;
  resetData: () => void;
  isLoaded: boolean;
  userName: string;
  setUserName: (name: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userName, setUserNameInternal] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCourses = localStorage.getItem("huji_degree_courses");
    const savedName = localStorage.getItem("huji_user_name");
    
    if (savedCourses) {
      try {
        const parsed = JSON.parse(savedCourses);
        setCourses(parsed);
      } catch (e) {
        console.error("Failed to parse courses", e);
      }
    }
    
    if (savedName) {
      setUserNameInternal(savedName);
    }
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("huji_degree_courses", JSON.stringify(courses));
      localStorage.setItem("huji_user_name", userName);
    }
  }, [courses, userName, isLoaded]);

  const setUserName = useCallback((name: string) => {
    setUserNameInternal(name);
  }, []);

  const addCourse = useCallback((courseData: Omit<Course, "id">) => {
    let duplicate = false;
    setCourses(prev => {
      const isDuplicate = prev.some((c) => c.number === courseData.number);
      if (isDuplicate) {
        duplicate = true;
        return prev;
      }
      return [...prev, { ...courseData, id: Math.random().toString(36).substr(2, 9) }];
    });
    
    if (duplicate) {
      alert("קורס זה כבר הוזן למערכת ולא ניתן לספור אותו פעמיים");
      return false;
    }
    return true;
  }, []);

  const updateCourse = useCallback((updatedCourse: Course) => {
    let duplicate = false;
    setCourses(prev => {
      const isDuplicate = prev.some(
        (c) => c.number === updatedCourse.number && c.id !== updatedCourse.id
      );
      if (isDuplicate) {
        duplicate = true;
        return prev;
      }
      return prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
    });

    if (duplicate) {
      alert("קורס זה כבר הוזן למערכת ולא ניתן לספור אותו פעמיים");
      return false;
    }
    return true;
  }, []);

  const deleteCourse = useCallback((id: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק קורס זה?")) {
      setCourses(prev => prev.filter((c) => c.id !== id));
    }
  }, []);

  const resetData = useCallback(() => {
    if (confirm("האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו אינה ניתנת לביטול.")) {
      setCourses([]);
      localStorage.removeItem("huji_degree_courses");
    }
  }, []);

  const value = useMemo(
    () => ({
      courses,
      addCourse,
      updateCourse,
      deleteCourse,
      resetData,
      isLoaded,
      userName,
      setUserName,
    }),
    [courses, addCourse, updateCourse, deleteCourse, resetData, isLoaded, userName, setUserName]
  );

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
}

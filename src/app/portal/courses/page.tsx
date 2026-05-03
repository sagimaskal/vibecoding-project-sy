"use client";

import { useState, useMemo } from "react";
import { useCourses } from "@/components/CourseContext";
import { AddCourseModal } from "@/components/AddCourseModal";
import { ECONOMICS_REQUIREMENTS, BUSINESS_REQUIREMENTS, Course } from "@/lib/types";

export default function CoursesPage() {
  const { courses, addCourse, updateCourse, deleteCourse, isLoaded } = useCourses();
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    return courses.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.number.includes(searchTerm)
    );
  }, [courses, searchTerm]);

  const handleAddOrEdit = (courseData: Omit<Course, 'id'>) => {
    let success = false;
    if (editingCourse) {
      success = updateCourse({ ...courseData, id: editingCourse.id });
    } else {
      success = addCourse(courseData);
    }

    if (success) {
      setIsAddingCourse(false);
      setEditingCourse(null);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
           <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-4">רשימת קורסים</h1>
           <p className="text-lg text-zinc-500 font-medium">ניהול, עריכה והוספת קורסים לתואר</p>
        </div>
        <button 
          onClick={() => {
            setEditingCourse(null);
            setIsAddingCourse(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 text-lg"
        >
          <span className="text-2xl leading-none">+</span>
          הוספת קורס
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-8 py-8 border-b border-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-zinc-50/30">
          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              {courses.length} קורסים הוזנו
            </div>
          </div>
          <div className="relative w-full sm:w-80">
            <input 
              type="text"
              placeholder="חיפוש קורס..."
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-zinc-200 bg-white text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-4 top-3.5 text-xl">🔍</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-400 text-xs font-black uppercase tracking-[0.1em]">
                <th className="px-8 py-5 text-right font-black">שנה/סמסטר</th>
                <th className="px-4 py-5 text-right font-black">שם הקורס</th>
                <th className="px-4 py-5 text-right font-black">מספר</th>
                <th className="px-4 py-5 text-right font-black">נ&quot;ז</th>
                <th className="px-4 py-5 text-right font-black">חוג/קטגוריה</th>
                <th className="px-4 py-5 text-right font-black">ציון</th>
                <th className="px-8 py-5 text-center font-black">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredCourses.length > 0 ? filteredCourses.map(course => (
                <tr key={course.id} className="group hover:bg-zinc-50/80 transition-all duration-300">
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-zinc-400 group-hover:text-zinc-600 transition-colors">
                      שנה {course.year} · סמסטר {course.semester}
                    </span>
                  </td>
                  <td className="px-4 py-6 font-black text-zinc-800 text-lg leading-tight">{course.name}</td>
                  <td className="px-4 py-6 text-sm text-zinc-400 font-mono font-bold">{course.number}</td>
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-2">
                       <span className="text-lg font-black text-zinc-900">{course.credits}</span>
                       <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter">נ&quot;ז</span>
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black w-fit uppercase tracking-wider ${
                        course.major === 'Economics' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {course.major === 'Economics' ? 'כלכלה' : 'מנהל עסקים'}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-black pr-1">
                        {course.major === 'Economics' 
                          ? ECONOMICS_REQUIREMENTS.categories.find(cat => cat.key === course.category)?.name 
                          : BUSINESS_REQUIREMENTS.categories.find(cat => cat.key === course.category)?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <div className={`text-lg font-black font-mono ${course.grade && course.grade >= 60 ? 'text-zinc-900' : 'text-zinc-300'}`}>
                      {course.grade !== undefined ? course.grade : '--'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingCourse(course);
                          setIsAddingCourse(true);
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-white text-blue-600 border border-zinc-100 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-90"
                        title="עריכה"
                      >
                        <span className="text-lg">✏️</span>
                      </button>
                      <button 
                        onClick={() => deleteCourse(course.id)}
                        className="w-10 h-10 flex items-center justify-center bg-white text-red-500 border border-zinc-100 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm active:scale-90"
                        title="מחיקה"
                      >
                        <span className="text-lg">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <span className="text-5xl opacity-20">📂</span>
                       <p className="text-xl font-black text-zinc-300">
                         {searchTerm ? 'לא נמצאו קורסים התואמים את החיפוש' : 'טרם הוזנו קורסים למערכת'}
                       </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddingCourse && (
        <AddCourseModal 
          onClose={() => {
            setIsAddingCourse(false);
            setEditingCourse(null);
          }} 
          onAdd={handleAddOrEdit}
          editData={editingCourse || undefined}
        />
      )}
    </div>
  );
}

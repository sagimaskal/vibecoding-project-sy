"use client";

import { useState, useMemo } from "react";
import { useCourses } from "@/components/CourseContext";
import { AddCourseModal } from "@/components/AddCourseModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
  const { courses, deleteCourse } = useCourses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    return courses.filter(c => 
      c.name.includes(searchTerm) || c.number.includes(searchTerm)
    ).sort((a, b) => b.year.localeCompare(a.year));
  }, [courses, searchTerm]);

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="רשימת קורסים" 
        description="נהלו את הקורסים שביצעתם או שתבצעו במהלך התואר."
      >
        <Button onClick={handleAdd} className="rounded-2xl h-12 gap-2 px-6 shadow-xl shadow-blue-100">
          <Plus size={20} />
          הוספת קורס חדש
        </Button>
      </PageHeader>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="חיפוש לפי שם קורס או מספר..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-2xl py-3.5 pr-12 pl-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-zinc-300"
          />
        </div>
        <Button variant="outline" className="rounded-2xl h-12 gap-2 px-6 w-full md:w-auto">
          <Filter size={18} />
          סינון
        </Button>
      </div>

      <div className="space-y-4">
        {filteredCourses.length > 0 ? (
          <div className="grid gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
              >
                <Card className="group border-none shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 ring-1 ring-zinc-100/50 transition-all duration-300 overflow-hidden">
                  <div className="p-1 flex flex-col md:flex-row md:items-center">
                    {/* Left color bar based on major */}
                    <div className={cn(
                      "w-full md:w-1.5 h-1.5 md:h-20 rounded-full my-auto md:ml-6",
                      course.major === 'Economics' ? "bg-blue-600" : "bg-emerald-500"
                    )} />
                    
                    <div className="p-6 md:p-0 flex-1 grid md:grid-cols-[1fr_auto_auto_auto_auto] items-center gap-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">
                            {course.number}
                          </span>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded leading-none",
                            course.major === 'Economics' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                          )}>
                            {course.major === 'Economics' ? "כלכלה" : "מנהל עסקים"}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-zinc-900 group-hover:text-blue-600 transition-colors">
                          {course.name}
                        </h4>
                      </div>

                      <div className="flex flex-col md:items-center">
                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">שנה/סמסטר</span>
                        <span className="font-black text-zinc-700 text-sm">שנה {course.year} ׳ {course.semester}</span>
                      </div>

                      <div className="flex flex-col md:items-center">
                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">נ"ז</span>
                        <span className="font-black text-zinc-700 text-sm">{course.credits}</span>
                      </div>

                      <div className="flex flex-col md:items-center">
                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">ציון</span>
                        <span className={cn(
                          "font-black text-sm",
                          course.grade ? "text-zinc-900" : "text-zinc-300"
                        )}>
                          {course.grade || "--"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-3 rounded-xl text-zinc-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="p-3 rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="py-32 flex flex-col items-center text-center space-y-6"
          >
            <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-200">
              <BookOpen size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-zinc-900">טרם נוספו קורסים</h3>
              <p className="text-zinc-500 font-medium">הוסיפו את הקורס הראשון שלכם כדי להתחיל לעקוב אחרי התואר.</p>
            </div>
            <Button onClick={handleAdd} className="rounded-2xl h-12 gap-2 px-8">
              <Plus size={20} />
              הוספת קורס ראשון
            </Button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddCourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingCourse={editingCourse}
        />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useCourses } from "./CourseContext";
import { Major, EconomicsCategory, BusinessCategory } from "@/lib/types";
import { ECONOMICS_REQUIREMENTS, BUSINESS_REQUIREMENTS } from "@/lib/types";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCourse?: any;
}

export function AddCourseModal({ isOpen, onClose, editingCourse }: AddCourseModalProps) {
  const { addCourse, updateCourse } = useCourses();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [credits, setCredits] = useState<number>(2);
  const [year, setYear] = useState("א");
  const [semester, setSemester] = useState<"א" | "ב" | "קיץ">("א");
  const [major, setMajor] = useState<Major>("Economics");
  const [category, setCategory] = useState<EconomicsCategory | BusinessCategory>("Mandatory");
  const [grade, setGrade] = useState<string>("");

  useEffect(() => {
    if (editingCourse) {
      setName(editingCourse.name);
      setNumber(editingCourse.number);
      setCredits(editingCourse.credits);
      setYear(editingCourse.year);
      setSemester(editingCourse.semester);
      setMajor(editingCourse.major);
      setCategory(editingCourse.category);
      setGrade(editingCourse.grade?.toString() || "");
    } else {
      setName("");
      setNumber("");
      setCredits(2);
      setYear("א");
      setSemester("א");
      setMajor("Economics");
      setCategory("Mandatory");
      setGrade("");
    }
  }, [editingCourse, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseData = {
      name,
      number,
      credits,
      year,
      semester,
      major,
      category,
      grade: grade ? parseInt(grade) : undefined,
    };

    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
    } else {
      addCourse(courseData);
    }
    onClose();
  };

  const categories = major === "Economics" 
    ? ECONOMICS_REQUIREMENTS.categories 
    : BUSINESS_REQUIREMENTS.categories;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl"
      >
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-zinc-100 flex flex-row items-center justify-between bg-white">
            <CardTitle className="text-2xl font-black text-zinc-900">
              {editingCourse ? "עריכת קורס" : "הוספת קורס חדש"}
            </CardTitle>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400">
              <X size={24} />
            </button>
          </CardHeader>
          <CardContent className="p-8 max-h-[80vh] overflow-y-auto bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">שם הקורס</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="למשל: מבוא למיקרו-כלכלה"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-zinc-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">מספר קורס</label>
                  <input
                    type="text"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="למשל: 57101"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-zinc-300"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">נקודות זכות (נ"ז)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={credits}
                    onChange={(e) => setCredits(parseFloat(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">שנה</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  >
                    {["א", "ב", "ג", "ד+"].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">סמסטר</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as any)}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  >
                    {["א", "ב", "קיץ"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">חוג</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'Economics', label: 'כלכלה' },
                    { id: 'Business', label: 'מנהל עסקים' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setMajor(m.id as Major);
                        setCategory("Mandatory");
                      }}
                      className={cn(
                        "py-4 px-6 rounded-2xl font-black text-sm transition-all border-2",
                        major === m.id 
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                          : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">קטגוריה</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                >
                  {categories.map(cat => <option key={cat.key} value={cat.key}>{cat.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">ציון (אופציונלי)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="למשל: 95"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-zinc-300"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button type="submit" className="flex-1 rounded-2xl h-14 text-lg gap-2 shadow-xl shadow-blue-100">
                  <Check size={20} />
                  {editingCourse ? "שמור שינויים" : "הוסף קורס"}
                </Button>
                <Button type="button" variant="outline" onClick={onClose} className="rounded-2xl h-14 px-8 text-zinc-400">
                  ביטול
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Major,
  Course,
  ECONOMICS_REQUIREMENTS,
  BUSINESS_REQUIREMENTS,
  EconomicsCategory,
  BusinessCategory,
} from "@/lib/types";

interface AddCourseModalProps {
  onClose: () => void;
  onAdd: (course: Omit<Course, "id">) => void;
  editData?: Course;
}

export function AddCourseModal({ onClose, onAdd, editData }: AddCourseModalProps) {
  const [name, setName] = useState(editData?.name || "");
  const [number, setNumber] = useState(editData?.number || "");
  const [credits, setCredits] = useState(editData?.credits || 2);
  const [major, setMajor] = useState<Major>(editData?.major || "Economics");
  const [category, setCategory] = useState(editData?.category || "Mandatory");
  const [year, setYear] = useState(editData?.year || "א");
  const [semester, setSemester] = useState<Course["semester"]>(editData?.semester || "א");
  const [grade, setGrade] = useState<string>(editData?.grade?.toString() || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      number,
      credits: Number(credits),
      major,
      category: category as EconomicsCategory | BusinessCategory,
      year,
      semester,
      grade: grade ? Number(grade) : undefined,
    });
  };

  const categories =
    major === "Economics" ? ECONOMICS_REQUIREMENTS.categories : BUSINESS_REQUIREMENTS.categories;

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <h3 className="text-xl font-bold">{editData ? "עריכת קורס" : "הוספת קורס חדש"}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto text-right">
          <div className="grid grid-cols-2 gap-4 text-right">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-zinc-700 mb-1">שם הקורס</label>
              <input
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="לדוגמה: מבוא למיקרו"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1">מספר קורס</label>
              <input
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono text-right"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="57101"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1">
                נקודות זכות (נ&quot;ז)
              </label>
              <input
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-bold text-right"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1">שנת לימוד</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm text-right"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="א">שנה א</option>
                <option value="ב">שנה ב</option>
                <option value="ג">שנה ג</option>
                <option value="ד">שנה ד+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1">סמסטר</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm text-right"
                value={semester}
                onChange={(e) => setSemester(e.target.value as Course["semester"])}
              >
                <option value="א">סמסטר א</option>
                <option value="ב">סמסטר ב</option>
                <option value="קיץ">סמסטר קיץ</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-zinc-700 mb-1">ציון (אופציונלי)</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-bold text-right"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="הכנס ציון..."
                min="0"
                max="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2">חוג שיוך</label>
            <div className="grid grid-cols-2 gap-2">
              {(["Economics", "Business"] as Major[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMajor(m);
                    setCategory("Mandatory");
                  }}
                  className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                    major === m
                      ? m === "Economics"
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {m === "Economics" ? "כלכלה" : "מנהל עסקים"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1">קטגוריה</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm text-right"
              value={category}
              onChange={(e) => setCategory(e.target.value as EconomicsCategory | BusinessCategory)}
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className={`flex-1 ${
                major === "Economics" ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"
              } text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]`}
            >
              {editData ? "עדכון קורס" : "הוספה לרשימה"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-xl border border-zinc-200 font-bold text-zinc-500 hover:bg-zinc-50 transition-all"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

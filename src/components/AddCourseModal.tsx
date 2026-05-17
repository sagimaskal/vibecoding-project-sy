"use client";

import { useState, useEffect, useRef } from "react";
import { useCourses } from "./CourseContext";
import { Major, EconomicsCategory, BusinessCategory } from "@/lib/types";
import { ECONOMICS_REQUIREMENTS, BUSINESS_REQUIREMENTS } from "@/lib/types";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { X, Check, Search, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import courseCatalog from "@/data/courseCatalog.json";
import requirementRules from "@/data/requirementRules.json";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCourse?: any;
}

export function AddCourseModal({ isOpen, onClose, editingCourse }: AddCourseModalProps) {
  const { addCourse, updateCourse } = useCourses();
  
  // Search and selection state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [credits, setCredits] = useState<number>(2);
  const [year, setYear] = useState("א");
  const [semester, setSemester] = useState<"א" | "ב" | "קיץ">("א");
  const [major, setMajor] = useState<Major>("Economics");
  const [category, setCategory] = useState<EconomicsCategory | BusinessCategory>("Mandatory");
  const [grade, setGrade] = useState<string>("");
  const [status, setStatus] = useState<"not_completed" | "completed_without_grade" | "completed_with_grade">("completed_with_grade");
  const [isCatalogCourse, setIsCatalogCourse] = useState(false);

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
      setStatus(editingCourse.grade !== undefined ? "completed_with_grade" : "completed_without_grade");
      setIsCatalogCourse(true); // Treat editing as catalog course to lock fields
    } else {
      resetForm();
    }
  }, [editingCourse, isOpen]);

  // Handle clicks outside of dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetForm = () => {
    setName("");
    setNumber("");
    setCredits(2);
    setYear("א");
    setSemester("א");
    setMajor("Economics");
    setCategory("Mandatory");
    setGrade("");
    setStatus("completed_with_grade");
    setSearchTerm("");
    setSearchResults([]);
    setShowDropdown(false);
    setIsCatalogCourse(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const filtered = courseCatalog.filter(c => 
      c.course_name.includes(term) || c.course_id.includes(term)
    ).slice(0, 10);

    setSearchResults(filtered);
    setShowDropdown(true);
  };

  const selectCatalogCourse = (course: any) => {
    setName(course.course_name);
    setNumber(course.course_id);
    setCredits(course.credits);
    setMajor(course.department as Major === 'Business Administration' ? 'Business' : 'Economics');
    
    // Map catalog category to system category
    if (course.category === "חובה") setCategory("Mandatory");
    else if (course.category === "בחירה") setCategory("Elective");
    else if (course.category === "אבני פינה") setCategory("Avnei Pina");
    
    setSearchTerm(course.course_name);
    setShowDropdown(false);
    setIsCatalogCourse(true);
  };

  const getMinGrade = (courseId: string): number => {
    const rules = requirementRules.transitions.YearAtoB.regularPass.groups;
    for (const group of rules) {
        if (group.courses) {
            const match = group.courses.find(c => c.courseId === courseId);
            if (match) return match.minGrade;
        }
        if (group.required) {
            const match = group.required.find(c => c.courseId === courseId);
            if (match) return match.minGrade;
        }
    }
    return 60; // Default
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!number) {
        alert("נא לבחור קורס מהשנתון");
        return;
    }

    let numericGrade: number | undefined = undefined;
    if (status === "completed_with_grade") {
        if (!grade) {
            alert("נא להזין ציון");
            return;
        }
        numericGrade = parseInt(grade);
    }

    const courseData = {
      name,
      number,
      credits,
      year,
      semester,
      major,
      category,
      grade: status === "completed_with_grade" ? numericGrade : undefined,
      status,
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
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
      />
      <div
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
              
              {/* Search / Autocomplete */}
              {!editingCourse && (
                <div className="relative space-y-2" ref={dropdownRef}>
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">חיפוש קורס בשנתון</label>
                  <div className="relative">
                    <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
                      placeholder="הקלד שם קורס או מספר קורס..."
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-12 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                  
                  {showDropdown && searchResults.length > 0 && (
                    <div 
                      className="absolute z-[60] w-full bg-white border border-zinc-100 rounded-2xl shadow-2xl mt-2 overflow-hidden max-h-60 overflow-y-auto"
                    >
                      {searchResults.map((c) => (
                        <button
                          key={`${c.course_id}-${c.department}`}
                          type="button"
                          onClick={() => selectCatalogCourse(c)}
                          className="w-full text-right px-6 py-4 hover:bg-blue-50 border-b border-zinc-50 last:border-none flex justify-between items-center group transition-colors"
                        >
                          <div className="flex flex-col">
                              <span className="font-bold text-zinc-800 group-hover:text-blue-700">{c.course_name}</span>
                              <span className="text-[10px] text-zinc-400 font-black uppercase">{c.department}</span>
                          </div>
                          <span className="text-xs font-black text-zinc-400 bg-zinc-100 px-2 py-1 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600">{c.course_id}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">שם הקורס</label>
                  <input
                    type="text"
                    required
                    readOnly={isCatalogCourse}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn(
                        "w-full border rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none transition-all",
                        isCatalogCourse ? "bg-zinc-50 border-zinc-100 text-zinc-500 cursor-not-allowed" : "bg-zinc-50 border-zinc-100 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">מספר קורס</label>
                  <input
                    type="text"
                    required
                    readOnly={isCatalogCourse}
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className={cn(
                        "w-full border rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none transition-all",
                        isCatalogCourse ? "bg-zinc-50 border-zinc-100 text-zinc-500 cursor-not-allowed" : "bg-zinc-50 border-zinc-100 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    )}
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
                    readOnly={isCatalogCourse}
                    value={credits}
                    onChange={(e) => setCredits(parseFloat(e.target.value))}
                    className={cn(
                        "w-full border rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none transition-all",
                        isCatalogCourse ? "bg-zinc-50 border-zinc-100 text-zinc-500 cursor-not-allowed" : "bg-zinc-50 border-zinc-100 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    )}
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
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">חוג וסטטוס</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: 'Economics', label: 'כלכלה' },
                    { id: 'Business', label: 'מנהל עסקים' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      disabled={isCatalogCourse}
                      onClick={() => {
                        setMajor(m.id as Major);
                        setCategory("Mandatory");
                      }}
                      className={cn(
                        "py-3 px-6 rounded-2xl font-black text-sm transition-all border-2",
                        major === m.id 
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                          : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200",
                        isCatalogCourse && major !== m.id && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">קטגוריה</label>
                        <select
                        value={category}
                        disabled={isCatalogCourse}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className={cn(
                            "w-full border rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none transition-all",
                            isCatalogCourse ? "bg-zinc-50 border-zinc-100 text-zinc-500 cursor-not-allowed appearance-none" : "bg-zinc-50 border-zinc-100 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        )}
                        >
                        {categories.map(cat => <option key={cat.key} value={cat.key}>{cat.name}</option>)}
                        </select>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">סטטוס השלמה</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                        >
                            <option value="completed_with_grade">הושלם עם ציון</option>
                            <option value="completed_without_grade">עובר (ללא ציון)</option>
                            <option value="not_completed">טרם הושלם</option>
                        </select>
                    </div>
                  </div>

                  {status === "completed_with_grade" && (
                    <div 
                        className="space-y-2"
                    >
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">ציון סופי</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            placeholder="הזן ציון בין 0 ל-100"
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-zinc-300"
                        />
                        <p className="text-[10px] font-bold text-amber-500 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            ציון מתחת ל-60 (או סף אחר שנקבע) לא יזכה בנ״ז.
                        </p>
                    </div>
                  )}
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
      </div>
    </div>
  );
}

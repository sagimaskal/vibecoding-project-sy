"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Major, 
  Course, 
  ECONOMICS_REQUIREMENTS, 
  BUSINESS_REQUIREMENTS, 
  EconomicsCategory, 
  BusinessCategory,
  DegreeRequirement
} from "@/lib/types";

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Persistence: Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("huji_degree_courses");
    if (saved) {
      try {
        setCourses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse courses", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Persistence: Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("huji_degree_courses", JSON.stringify(courses));
    }
  }, [courses, isLoaded]);

  // Stats calculation
  const stats = useMemo(() => {
    const econStats = {
      total: 0,
      categories: {
        Mandatory: 0,
        Core: 0,
        Elective: 0,
        Research: 0,
        'Avnei Pina': 0,
      } as Record<EconomicsCategory, number>
    };

    const businessStats = {
      total: 0,
      categories: {
        Mandatory: 0,
        Elective: 0,
        'Mandatory Elective': 0,
        Research: 0,
        'Avnei Pina': 0,
      } as Record<BusinessCategory, number>
    };

    courses.forEach(course => {
      if (course.major === 'Economics') {
        const cat = course.category as EconomicsCategory;
        if (econStats.categories[cat] !== undefined) {
          econStats.categories[cat] += course.credits;
          econStats.total += course.credits;
        }
      } else if (course.major === 'Business') {
        const cat = course.category as BusinessCategory;
        if (businessStats.categories[cat] !== undefined) {
          businessStats.categories[cat] += course.credits;
          businessStats.total += course.credits;
        }
      }
    });

    return { econStats, businessStats };
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.number.includes(searchTerm)
    );
  }, [courses, searchTerm]);

  const handleAddOrEdit = (courseData: Omit<Course, 'id'>) => {
    // Duplicate check (exclude current editing course)
    const duplicate = courses.find(c => c.number === courseData.number && (!editingCourse || c.id !== editingCourse.id));
    if (duplicate) {
      alert("קורס זה כבר הוזן למערכת ולא ניתן לספור אותו פעמיים");
      return;
    }

    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...courseData, id: c.id } : c));
      setEditingCourse(null);
    } else {
      setCourses([...courses, { ...courseData, id: Math.random().toString(36).substr(2, 9) }]);
    }
    setIsAddingCourse(false);
  };

  const deleteCourse = (id: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק קורס זה?")) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const resetData = () => {
    if (confirm("האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו אינה ניתנת לביטול.")) {
      setCourses([]);
      localStorage.removeItem("huji_degree_courses");
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              H
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">HUJI Degree Tracker</h1>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">כלכלה ומנהל עסקים</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={resetData}
              className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition-all ml-2"
            >
              איפוס נתונים
            </button>
            <button 
              onClick={() => {
                setEditingCourse(null);
                setIsAddingCourse(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100 flex items-center gap-2 active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              הוספת קורס
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* About Section */}
        <section className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              על המערכת
            </h2>
            <p className="text-zinc-600 leading-relaxed max-w-4xl font-medium">
              מערכת זו נועדה לסייע לסטודנטים בתכנית הדו-חוגית של <strong>כלכלה ומנהל עסקים</strong> באוניברסיטה העברית לעקוב אחר התקדמותם האקדמית. 
              המערכת מחשבת בזמן אמת את נקודות הזכות שהושלמו בכל קטגוריה, מזהה חוסרים ומתריעה על חריגות. 
              הנתונים נשמרים מקומית על המחשב שלך.
            </p>
          </div>
        </section>

        {/* Dashboards Container */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Economics Dashboard */}
          <MajorDashboard 
            title="כלכלה" 
            stats={stats.econStats} 
            requirements={ECONOMICS_REQUIREMENTS} 
            accentColor="blue"
          />

          {/* Business Dashboard */}
          <MajorDashboard 
            title="מנהל עסקים" 
            stats={stats.businessStats} 
            requirements={BUSINESS_REQUIREMENTS} 
            accentColor="emerald"
          />

        </div>

        {/* Alerts Section */}
        <AlertsSection stats={stats} />

        {/* Courses Table Container */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-50/50 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">רשימת קורסים</h2>
              <span className="bg-zinc-200 text-zinc-700 px-3 py-1 rounded-full text-xs font-bold">
                {courses.length} קורסים
              </span>
            </div>
            <div className="relative">
              <input 
                type="text"
                placeholder="חיפוש לפי שם או מספר קורס..."
                className="pl-4 pr-10 py-2 rounded-xl border border-zinc-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead className="bg-zinc-50 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-4 text-right">שם הקורס</th>
                  <th className="px-4 py-4 text-right">מספר</th>
                  <th className="px-4 py-4 text-right">נ&quot;ז</th>
                  <th className="px-4 py-4 text-right">חוג</th>
                  <th className="px-4 py-4 text-right">קטגוריה</th>
                  <th className="px-4 py-4 text-center">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredCourses.length > 0 ? filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-8 py-5 font-bold text-zinc-800">{course.name}</td>
                    <td className="px-4 py-5 text-sm text-zinc-500 font-mono">{course.number}</td>
                    <td className="px-4 py-5 text-sm font-bold">{course.credits}</td>
                    <td className="px-4 py-5 text-right">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold inline-block ${
                        course.major === 'Economics' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {course.major === 'Economics' ? 'כלכלה' : 'מנע&quot;ס'}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-sm text-zinc-600 text-right">
                      {course.major === 'Economics' 
                        ? ECONOMICS_REQUIREMENTS.categories.find(cat => cat.key === course.category)?.name 
                        : BUSINESS_REQUIREMENTS.categories.find(cat => cat.key === course.category)?.name}
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2 justify-center">
                        <button 
                          onClick={() => {
                            setEditingCourse(course);
                            setIsAddingCourse(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="עריכה"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => deleteCourse(course.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="מחיקה"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-10 text-center text-zinc-400 font-medium">
                      {searchTerm ? 'לא נמצאו קורסים התואמים את החיפוש' : 'טרם הוזנו קורסים למערכת'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Course Modal */}
      {isAddingCourse && (
        <AddCourseModal 
          onClose={() => setIsAddingCourse(false)} 
          onAdd={handleAddOrEdit}
          editData={editingCourse || undefined}
        />
      )}
    </div>
  );
}

// --- Sub-components ---

interface MajorDashboardProps {
  title: string;
  stats: { total: number; categories: Record<string, number> };
  requirements: DegreeRequirement;
  accentColor: 'blue' | 'emerald';
}

function MajorDashboard({ title, stats, requirements, accentColor }: MajorDashboardProps) {
  const percentage = Math.min(100, Math.round((stats.total / requirements.total) * 100));
  
  const colorClass = accentColor === 'blue' ? 'bg-blue-600' : 'bg-emerald-500';
  const lightColorClass = accentColor === 'blue' ? 'bg-blue-50' : 'bg-emerald-50';
  const textColorClass = accentColor === 'blue' ? 'text-blue-700' : 'text-emerald-700';

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
      <div className={`p-8 border-b border-zinc-100 ${lightColorClass}`}>
        <div className="flex items-end justify-between mb-6">
          <div className="text-right">
            <span className={`text-xs font-bold uppercase tracking-widest ${textColorClass} mb-1 block`}>תואר ראשון ב-</span>
            <h3 className="text-3xl font-black tracking-tight">{title}</h3>
          </div>
          <div className="text-left">
            <span className="text-4xl font-black">{stats.total}</span>
            <span className="text-zinc-400 font-bold text-lg"> / {requirements.total} נ&quot;ז</span>
          </div>
        </div>
        
        <div className="relative h-4 w-full bg-zinc-200/50 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`absolute top-0 right-0 h-full ${colorClass} transition-all duration-1000 ease-out shadow-lg`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs font-bold text-zinc-500">{percentage}% הושלמו</span>
          <span className="text-xs font-bold text-zinc-500">{Math.max(0, requirements.total - stats.total)} נ&quot;ז נותרו</span>
        </div>
      </div>

      <div className="p-8 space-y-6 flex-1">
        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 text-right">פירוט קטגוריות</h4>
        {requirements.categories.map((cat) => {
          const completed = stats.categories[cat.key] || 0;
          const catPercentage = Math.min(100, Math.round((completed / cat.required) * 100));
          const isMissing = completed < cat.required;

          return (
            <div key={cat.key} className="space-y-2">
              <div className="flex justify-between text-sm items-center">
                <span className="font-bold text-zinc-700">{cat.name}</span>
                <span className={`font-mono font-bold ${isMissing ? 'text-orange-600' : 'text-green-600'}`}>
                  {completed} / {cat.required}
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${
                    catPercentage >= 100 ? 'bg-green-500' : catPercentage > 50 ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${catPercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AlertsSectionProps {
  stats: {
    econStats: { categories: Record<string, number> };
    businessStats: { categories: Record<string, number> };
  };
}

function AlertsSection({ stats }: AlertsSectionProps) {
  const alerts = [];

  if (stats.econStats.categories.Mandatory < ECONOMICS_REQUIREMENTS.categories[0].required) {
    alerts.push({ type: 'warning', text: 'כלכלה: חסרים קורסי חובה להשלמת התואר' });
  }
  
  if (stats.businessStats.categories.Mandatory < BUSINESS_REQUIREMENTS.categories[0].required) {
    alerts.push({ type: 'warning', text: 'מנהל עסקים: חסרים קורסי חובה להשלמת התואר' });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-4">
      {alerts.map((alert, i) => (
        <div key={i} className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3 text-orange-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-bold text-sm">{alert.text}</span>
        </div>
      ))}
    </div>
  );
}

interface AddCourseModalProps {
  onClose: () => void;
  onAdd: (course: Omit<Course, 'id'>) => void;
  editData?: Course;
}

function AddCourseModal({ onClose, onAdd, editData }: AddCourseModalProps) {
  const [name, setName] = useState(editData?.name || "");
  const [number, setNumber] = useState(editData?.number || "");
  const [credits, setCredits] = useState(editData?.credits || 2);
  const [major, setMajor] = useState<Major>(editData?.major || "Economics");
  const [category, setCategory] = useState(editData?.category || "Mandatory");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      number,
      credits: Number(credits),
      major,
      category: category as EconomicsCategory | BusinessCategory
    });
  };

  const categories = major === 'Economics' ? ECONOMICS_REQUIREMENTS.categories : BUSINESS_REQUIREMENTS.categories;

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <h3 className="text-xl font-bold">{editData ? 'עריכת קורס' : 'הוספת קורס חדש'}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-bold text-zinc-700 mb-1 text-right">מספר קורס</label>
              <input 
                required 
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono text-right"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="57101"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1 text-right">נקודות זכות (נ&quot;ז)</label>
              <input 
                type="number" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-bold text-right"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2 text-right">חוג שיוך</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Economics', 'Business'] as Major[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMajor(m);
                    setCategory("Mandatory");
                  }}
                  className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                    major === m 
                    ? (m === 'Economics' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-emerald-600 border-emerald-600 text-white')
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {m === 'Economics' ? 'כלכלה' : 'מנהל עסקים'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1 text-right">קטגוריה</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm text-right"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(c => <option key={c.key} value={c.key}>{c.name}</option>)}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
              className={`flex-1 ${major === 'Economics' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]`}
            >
              {editData ? 'עדכון קורס' : 'הוספה לרשימה'}
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

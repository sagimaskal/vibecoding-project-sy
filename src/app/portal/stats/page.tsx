"use client";

import { useState } from "react";
import { MajorDashboard } from "@/components/MajorDashboard";
import { useCourses } from "@/components/CourseContext";
import { ECONOMICS_REQUIREMENTS, BUSINESS_REQUIREMENTS } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { AddCourseModal } from "@/components/AddCourseModal";
import { Award, Target, BookOpen, Clock, Plus } from "lucide-react";

export default function StatsPage() {
  const { econStats, bizStats, evaluation } = useCourses();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalCredits = econStats.total + bizStats.total;
  const targetCredits = ECONOMICS_REQUIREMENTS.total + BUSINESS_REQUIREMENTS.total;
  const totalPercentage = Math.round((totalCredits / targetCredits) * 100);

  return (
    <div className="space-y-12 pb-20">
      <PageHeader 
        title="מבט על" 
        description="סיכום ההתקדמות שלך בתואר הדו-חוגי."
      >
        <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl h-12 gap-2 px-6 shadow-xl shadow-blue-100">
          <Plus size={20} />
          הוספת קורס חדש
        </Button>
      </PageHeader>

      {/* Evaluation Summary */}
      {evaluation && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-6"
        >
            <Card className={cn(
                "border-none shadow-xl rounded-[2.5rem] p-8 flex flex-col justify-between",
                evaluation.status === 'regular_pass' ? "bg-emerald-50" : evaluation.status === 'conditional_pass' ? "bg-amber-50" : "bg-red-50"
            )}>
                <div>
                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">סטטוס מעבר שנה א׳ ⮕ ב׳</h3>
                    <p className={cn(
                        "text-2xl font-black",
                        evaluation.status === 'regular_pass' ? "text-emerald-700" : evaluation.status === 'conditional_pass' ? "text-amber-700" : "text-red-700"
                    )}>
                        {evaluation.status === 'regular_pass' ? "עמידה מלאה בתנאים" : 
                         evaluation.status === 'conditional_pass' ? "מעבר על תנאי" : "טרם עמדת בתנאי המעבר"}
                    </p>
                </div>
                <div className="mt-6">
                    {evaluation.status === 'not_passed' ? (
                        <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                            <AlertCircle size={16} />
                            יש להשלים קורסי חובה וציוני סף
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                            <Check size={16} />
                            ניתן להמשיך לשנה ב׳
                        </div>
                    )}
                </div>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] p-8 bg-white lg:col-span-2">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">דרישות חסרות או ציוני סף שלא הושגו</h3>
                    <div className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-black">כלכלה בלבד</div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {evaluation.missingRequirements.length === 0 && evaluation.failedRequirements.length === 0 ? (
                        <div className="py-4 text-zinc-400 font-medium italic">אין דרישות חסרות כרגע.</div>
                    ) : (
                        <>
                            {evaluation.missingRequirements.map((req, i) => (
                                <div key={i} className="px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-500 font-bold text-sm">
                                    חסר: {req}
                                </div>
                            ))}
                            {evaluation.failedRequirements.map((req, i) => (
                                <div key={i} className="px-4 py-2 rounded-xl bg-red-50 border border-red-100 text-red-600 font-bold text-sm">
                                    נכשל: {req} (ציון נמוך מהסף)
                                </div>
                            ))}
                        </>
                    )}
                </div>
                
                {evaluation.notes.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-zinc-50">
                        <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                            {evaluation.notes[0]}
                        </p>
                    </div>
                )}
            </Card>
        </motion.div>
      )}

      {/* Advanced Eligibility Badge */}
      {evaluation && (
        <div className="flex gap-4">
            <div className={cn(
                "px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all border",
                evaluation.canMoveToYearC ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-zinc-50 border-zinc-100 text-zinc-400"
            )}>
                <ShieldCheck size={16} />
                כשירות לרישום לשנה ג׳: {evaluation.canMoveToYearC ? "כן" : "לא"}
            </div>
            <div className={cn(
                "px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all border",
                evaluation.eligibleForMicro ? "bg-purple-50 border-purple-100 text-purple-600" : "bg-zinc-50 border-zinc-100 text-zinc-400"
            )}>
                <BookOpen size={16} />
                אישור לרישום למיקרו-כלכלה: {evaluation.eligibleForMicro ? "כן" : "לא"}
            </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="סה״כ נ״ז" 
          value={totalCredits} 
          subValue={`/ ${targetCredits}`}
          icon={<Award size={28} />}
          color="blue"
        />
        <StatCard 
          label="אחוזי השלמה" 
          value={`${totalPercentage}%`} 
          icon={<Target size={28} />}
          color="emerald"
        />
        <StatCard 
          label="נ״ז נותרו" 
          value={Math.max(0, targetCredits - totalCredits)} 
          icon={<Clock size={28} />}
          color="amber"
        />
        <StatCard 
          label="ממוצע משוקלל" 
          value="--" 
          icon={<BookOpen size={28} />}
          color="purple"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <MajorDashboard
          title="כלכלה"
          stats={econStats}
          requirements={ECONOMICS_REQUIREMENTS}
          accentColor="blue"
        />
        <MajorDashboard
          title="מנהל עסקים"
          stats={bizStats}
          requirements={BUSINESS_REQUIREMENTS}
          accentColor="emerald"
        />
      </div>
      
      {isModalOpen && (
        <AddCourseModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCourses } from "@/components/CourseContext";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GraduationCap, ArrowRight, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const DEPARTMENTS = [
  { id: "econ", name: "כלכלה", icon: "📊", description: "תואר דו-חוגי (64 נ\"ז)" },
  { id: "biz", name: "מנהל עסקים", icon: "💼", description: "תואר דו-חוגי (60 נ\"ז)" },
];

export default function SetupPage() {
  const router = useRouter();
  const { userName } = useCourses();
  const [selected, setSelected] = useState<string[]>(["econ", "biz"]);

  const toggleMajor = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleCompleteSetup = () => {
    if (selected.length === 2 && selected.includes("econ") && selected.includes("biz")) {
      router.push("/portal/stats");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 py-20" dir="rtl">
      <div
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            שלב 2 מתוך 2
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900">ברוך הבא, {userName}</h1>
          <p className="text-zinc-500 font-medium text-lg">בוא נגדיר את מסלול הלימודים שלך.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {DEPARTMENTS.map((major, i) => {
            const isSelected = selected.includes(major.id);
            return (
              <div
                key={major.id}
              >
                <Card 
                  onClick={() => toggleMajor(major.id)}
                  className={cn(
                    "relative cursor-pointer transition-all duration-300 border-2 rounded-[2.5rem] overflow-hidden group h-full",
                    isSelected 
                      ? "border-blue-600 ring-4 ring-blue-50 bg-white" 
                      : "border-zinc-100 hover:border-zinc-200 bg-white/50"
                  )}
                >
                  <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                    <div className={cn(
                      "w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl shadow-lg transition-transform group-hover:scale-110",
                      isSelected ? "bg-blue-50" : "bg-zinc-50"
                    )}>
                      {major.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-zinc-900 mb-2">{major.name}</h3>
                      <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest leading-relaxed">
                        {major.description}
                      </p>
                    </div>
                    <div className="absolute top-6 left-6">
                      {isSelected ? (
                        <CheckCircle2 className="text-blue-600" size={24} />
                      ) : (
                        <Circle size={24} className="text-zinc-100" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center space-y-6">
          <Button 
            size="lg" 
            onClick={handleCompleteSetup}
            disabled={selected.length < 2}
            className="w-full max-w-md rounded-[2rem] h-16 gap-3 text-xl shadow-2xl shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            סיום הגדרה וכניסה לפורטל
            <ArrowRight size={24} className="rotate-180" />
          </Button>
          <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <GraduationCap size={16} />
            מסלול כלכלה ומנהל עסקים נבחר כברירת מחדל
          </p>
        </div>
      </div>
    </div>
  );
}

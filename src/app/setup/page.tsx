"use client";

import { useRouter } from "next/navigation";
import { useCourses } from "@/components/CourseContext";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GraduationCap, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SetupPage() {
  const router = useRouter();
  const { userName } = useCourses();

  const handleCompleteSetup = () => {
    router.push("/portal/stats");
  };

  const majors = [
    { 
      id: "econ", 
      name: "כלכלה", 
      icon: "📊", 
      description: "תואר דו-חוגי (64 נ\"ז)",
      color: "blue",
      selected: true
    },
    { 
      id: "biz", 
      name: "מנהל עסקים", 
      icon: "💼", 
      description: "תואר דו-חוגי (60 נ\"ז)",
      color: "emerald",
      selected: true
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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
          {majors.map((major, i) => (
            <motion.div
              key={major.id}
              initial={{ opacity: 0, x: i === 0 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Card className={cn(
                "relative cursor-pointer transition-all duration-300 border-2 rounded-[2.5rem] overflow-hidden group h-full",
                major.selected 
                  ? major.color === "blue" ? "border-blue-600 ring-4 ring-blue-50" : "border-emerald-600 ring-4 ring-emerald-50"
                  : "border-zinc-100 hover:border-zinc-200"
              )}>
                <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                  <div className={cn(
                    "w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl shadow-lg transition-transform group-hover:scale-110",
                    major.color === "blue" ? "bg-blue-50" : "bg-emerald-50"
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
                    {major.selected ? (
                      <CheckCircle2 className={cn(major.color === "blue" ? "text-blue-600" : "text-emerald-600")} size={24} />
                    ) : (
                      <Circle size={24} className="text-zinc-200" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-6">
          <Button 
            size="lg" 
            onClick={handleCompleteSetup}
            className="w-full max-w-md rounded-[2rem] h-16 gap-3 text-xl shadow-2xl shadow-blue-100"
          >
            סיום הגדרה וכניסה לפורטל
            <ArrowRight size={24} className="rotate-180" />
          </Button>
          <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <GraduationCap size={16} />
            מסלול כלכלה ומנהל עסקים נבחר כברירת מחדל
          </p>
        </div>
      </motion.div>
    </div>
  );
}

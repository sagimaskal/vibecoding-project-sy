"use client";

import { DegreeRequirement } from "@/lib/types";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { ProgressBar } from "./ui/ProgressBar";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Circle } from "lucide-react";

interface MajorDashboardProps {
  title: string;
  stats: { 
    total: number; 
    categories: Record<string, number>;
    validTotal: number;
    validCategories: Record<string, number>;
    plannedTotal: number;
    plannedCategories: Record<string, number>;
    hasThresholdFailures: boolean;
  };
  requirements: DegreeRequirement;
  accentColor: "blue" | "emerald";
}

export function MajorDashboard({ title, stats, requirements, accentColor }: MajorDashboardProps) {
  const percentage = Math.min(100, Math.round((stats.total / requirements.total) * 100));
  const validPercentage = Math.min(100, Math.round((stats.validTotal / requirements.total) * 100));
  const plannedPercentage = Math.min(100, Math.round(((stats.validTotal + stats.plannedTotal) / requirements.total) * 100));
  
  const accentHex = accentColor === "blue" ? "bg-blue-600" : "bg-emerald-600";
  const lightAccentHex = accentColor === "blue" ? "bg-blue-50/50" : "bg-emerald-50/50";
  const textAccentHex = accentColor === "blue" ? "text-blue-600" : "text-emerald-600";

  return (
    <Card className="overflow-hidden border-none shadow-xl shadow-zinc-200/50 flex flex-col h-full bg-white ring-1 ring-zinc-100">
      <CardHeader className={cn("p-8 space-y-6", lightAccentHex)}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", textAccentHex)}>
              מבנה אקדמי
            </span>
            <h3 className="text-3xl font-black tracking-tight text-zinc-900">{title}</h3>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-zinc-900">{stats.total}</span>
              <span className="text-zinc-400 font-bold text-sm">/ {requirements.total} נ&quot;ז</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn("text-xs font-black px-2 py-1 rounded-lg", lightAccentHex, textAccentHex)}>
                {percentage}% הוזנו
              </span>
              {stats.hasThresholdFailures && (
                <div className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                  <AlertCircle size={10} />
                  {stats.validTotal} נ&quot;ז תקפות
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative h-3 w-full bg-zinc-200/50 rounded-full overflow-hidden">
            {/* Valid credits bar (darker) */}
            <div 
              className={cn("absolute top-0 right-0 h-full transition-all duration-500 z-20", accentHex)}
              style={{ width: `${validPercentage}%` }}
            />
            {/* Planned credits bar (gray) */}
            <div 
              className="absolute top-0 right-0 h-full transition-all duration-500 bg-zinc-400 z-10"
              style={{ width: `${plannedPercentage}%` }}
            />
            {/* Entered bar (lighter/opacity) */}
            <div 
              className={cn("absolute top-0 right-0 h-full transition-all duration-500 opacity-30", accentHex)}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", accentHex)}></div>
                <span className="text-[10px] font-bold text-zinc-500">הושלמו</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-zinc-400"></div>
                <span className="text-[10px] font-bold text-zinc-500">מתוכננים (ללא ציון)</span>
              </div>
              {stats.hasThresholdFailures && (
                <div className="flex items-center gap-1.5">
                  <div className={cn("w-2 h-2 rounded-full opacity-30", accentHex)}></div>
                  <span className="text-[10px] font-bold text-zinc-500">מתחת לסף</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span>{Math.max(0, requirements.total - stats.total)} נ&quot;ז נותרו</span>
            </div>
          </div>
        </div>
        
        {stats.hasThresholdFailures && (
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 flex items-start gap-3">
            <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[10px] font-bold text-amber-700 leading-normal">
              שימו לב: חלק מהקורסים שהוזנו אינם עומדים בציון הסף הנדרש. הם נכללים בסיכום הכללי אך לא יחשבו לצורך השלמת התואר.
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-8 space-y-5 flex-1 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-[1px] flex-1 bg-zinc-100"></div>
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">דרישות חובה ובחירה</span>
          <div className="h-[1px] flex-1 bg-zinc-100"></div>
        </div>
        
        {requirements.categories.map((cat) => {
          const completed = stats.categories[cat.key] || 0;
          const validCompleted = stats.validCategories[cat.key] || 0;
          const plannedCompleted = stats.plannedCategories[cat.key] || 0;
          const hasFailureInCat = (validCompleted + plannedCompleted) < completed;
          
          const catPercentage = Math.min(100, Math.round((completed / cat.required) * 100));
          const validCatPercentage = Math.min(100, Math.round((validCompleted / cat.required) * 100));
          const plannedCatPercentage = Math.min(100, Math.round(((validCompleted + plannedCompleted) / cat.required) * 100));
          
          const isValidDone = validCompleted >= cat.required;
          const isEnteredDone = completed >= cat.required;
          const isStarted = completed > 0;
          
          return (
            <div key={cat.key} className="group">
              <div className="flex justify-between text-sm items-center mb-2">
                <div className="flex items-center gap-2">
                  {isValidDone ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : hasFailureInCat ? (
                    <AlertCircle size={16} className="text-amber-500" />
                  ) : isEnteredDone ? (
                    <AlertCircle size={16} className="text-orange-400" />
                  ) : isStarted ? (
                    <AlertCircle size={16} className="text-orange-400" />
                  ) : (
                    <Circle size={16} className="text-zinc-200" />
                  )}
                  <span className="font-bold text-zinc-700 group-hover:text-zinc-900 transition-colors">
                    {cat.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={cn(
                    "font-black text-sm",
                    isValidDone ? "text-emerald-600" : hasFailureInCat ? "text-amber-600" : isStarted ? "text-orange-500" : "text-zinc-400"
                  )}>
                    {completed}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-300">/ {cat.required}</span>
                </div>
              </div>
              <div className="relative h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                {/* Valid bar */}
                <div 
                  className={cn(
                    "absolute top-0 right-0 h-full transition-all duration-500 z-20",
                    isValidDone ? "bg-emerald-500" : hasFailureInCat ? "bg-amber-500" : "bg-orange-400"
                  )}
                  style={{ width: `${validCatPercentage}%` }}
                />
                {/* Planned bar */}
                <div 
                  className="absolute top-0 right-0 h-full transition-all duration-500 bg-zinc-300 z-10"
                  style={{ width: `${plannedCatPercentage}%` }}
                />
                {/* Total bar */}
                <div 
                  className={cn(
                    "absolute top-0 right-0 h-full transition-all duration-500 opacity-30",
                    isValidDone ? "bg-emerald-500" : hasFailureInCat ? "bg-amber-500" : "bg-orange-400"
                  )}
                  style={{ width: `${catPercentage}%` }}
                />
              </div>
              {hasFailureInCat && (
                <p className="text-[9px] font-bold text-amber-600 mt-1">
                  מכיל קורסים מתחת לסף (רק {validCompleted} נ&quot;ז תקפות)
                </p>
              )}
              {plannedCompleted > 0 && (
                <p className="text-[9px] font-bold text-zinc-400 mt-0.5">
                  כולל {plannedCompleted} נ&quot;ז בתכנון
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}



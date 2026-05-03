"use client";

import { DegreeRequirement } from "@/lib/types";

interface MajorDashboardProps {
  title: string;
  stats: { total: number; categories: Record<string, number> };
  requirements: DegreeRequirement;
  accentColor: "blue" | "emerald";
}

export function MajorDashboard({ title, stats, requirements, accentColor }: MajorDashboardProps) {
  const percentage = Math.min(100, Math.round((stats.total / requirements.total) * 100));
  const colorClass = accentColor === "blue" ? "bg-blue-600" : "bg-emerald-500";
  const lightColorClass = accentColor === "blue" ? "bg-blue-50" : "bg-emerald-50";
  const textColorClass = accentColor === "blue" ? "text-blue-700" : "text-emerald-700";

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md h-full">
      <div className={`p-8 border-b border-zinc-100 ${lightColorClass}`}>
        <div className="flex items-end justify-between mb-6">
          <div className="text-right">
            <span className={`text-xs font-bold uppercase tracking-widest ${textColorClass} mb-1 block`}>
              תואר ראשון ב-
            </span>
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
          <span className="text-xs font-bold text-zinc-500">
            {Math.max(0, requirements.total - stats.total)} נ&quot;ז נותרו
          </span>
        </div>
      </div>
      <div className="p-8 space-y-6 flex-1">
        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 text-right">
          פירוט קטגוריות
        </h4>
        {requirements.categories.map((cat) => {
          const completed = stats.categories[cat.key] || 0;
          const catPercentage = Math.min(100, Math.round((completed / cat.required) * 100));
          const isMissing = completed < cat.required;
          return (
            <div key={cat.key} className="space-y-2">
              <div className="flex justify-between text-sm items-center">
                <span className="font-bold text-zinc-700">{cat.name}</span>
                <span className={`font-mono font-bold ${isMissing ? "text-orange-600" : "text-green-600"}`}>
                  {completed} / {cat.required}
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    catPercentage >= 100 ? "bg-green-500" : catPercentage > 50 ? "bg-orange-400" : "bg-red-400"
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

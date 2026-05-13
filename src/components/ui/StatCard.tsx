"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  color: "blue" | "emerald" | "amber" | "purple";
  className?: string;
}

export function StatCard({ label, value, subValue, icon, color, className }: StatCardProps) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
  };

  return (
    <Card className={cn("border-none shadow-xl shadow-zinc-200/40 ring-1 ring-zinc-100/50 p-8 flex items-center gap-6 group hover:-translate-y-1 transition-all duration-300", className)}>
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center ring-4 group-hover:scale-110 transition-transform", colors[color])}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-zinc-900 leading-none">{value}</span>
          {subValue && (
            <span className="text-zinc-400 font-bold text-sm tracking-tight">{subValue}</span>
          )}
        </div>
      </div>
    </Card>
  );
}

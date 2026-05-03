"use client";

import { useMemo } from "react";
import { useCourses } from "@/components/CourseContext";
import { MajorDashboard } from "@/components/MajorDashboard";
import { 
  ECONOMICS_REQUIREMENTS, 
  BUSINESS_REQUIREMENTS, 
  EconomicsCategory, 
  BusinessCategory 
} from "@/lib/types";

export default function StatsPage() {
  const { courses, isLoaded } = useCourses();

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

  if (!isLoaded) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
         <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-4">מעקב נ״ז</h1>
         <p className="text-lg text-zinc-500 font-medium">תמונת מצב עדכנית של ההתקדמות בתואר</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
         <MajorDashboard 
            title="כלכלה" 
            stats={stats.econStats} 
            requirements={ECONOMICS_REQUIREMENTS} 
            accentColor="blue"
         />
         <MajorDashboard 
            title="מנהל עסקים" 
            stats={stats.businessStats} 
            requirements={BUSINESS_REQUIREMENTS} 
            accentColor="emerald"
         />
      </div>

      <AlertsSection stats={stats} />
    </div>
  );
}

interface AlertsSectionProps {
  stats: {
    econStats: { categories: Record<EconomicsCategory, number> };
    businessStats: { categories: Record<BusinessCategory, number> };
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
    <div className="mt-12 space-y-4">
      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mr-2">התראות מערכת</h3>
      {alerts.map((alert, i) => (
        <div key={i} className="bg-white border border-red-100 rounded-3xl p-6 flex items-center gap-4 text-red-600 shadow-sm animate-in slide-in-from-right-4 duration-500">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-xl">⚠️</div>
          <span className="font-black">{alert.text}</span>
        </div>
      ))}
    </div>
  );
}

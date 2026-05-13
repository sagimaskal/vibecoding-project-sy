"use client";

import { MajorDashboard } from "@/components/MajorDashboard";
import { useCourses } from "@/components/CourseContext";
import { ECONOMICS_REQUIREMENTS, BUSINESS_REQUIREMENTS } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Award, Target, BookOpen, Clock } from "lucide-react";

export default function StatsPage() {
  const { econStats, bizStats } = useCourses();

  const totalCredits = econStats.total + bizStats.total;
  const targetCredits = ECONOMICS_REQUIREMENTS.total + BUSINESS_REQUIREMENTS.total;
  const totalPercentage = Math.round((totalCredits / targetCredits) * 100);

  return (
    <div className="space-y-12">
      <PageHeader 
        title="מבט על" 
        description="סיכום ההתקדמות שלך בתואר הדו-חוגי."
      />

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
      
      {/* Alert for missing requirements if any specific category is critical could go here */}
    </div>
  );
}

"use client";

import { useCourses } from "./CourseContext";
import { Card } from "./ui/Card";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

export function ResumePreview() {
  const { userName, userEmail, courses } = useCourses();
  const starredCourses = courses.filter(c => c.starred);

  return (
    <Card className="bg-white shadow-2xl border-none w-full max-w-[800px] mx-auto min-h-[1000px] p-12 text-zinc-950 font-serif" dir="ltr">
      <div className="space-y-10">
        {/* Header */}
        <header className="border-b-2 border-zinc-900 pb-8 flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase font-sans">{userName || "Your Name"}</h1>
            <p className="text-zinc-500 font-bold tracking-[0.2em] text-sm uppercase font-sans">Economics & Business Administration Student</p>
          </div>
          <div className="flex flex-col items-end gap-1 text-[10px] font-bold text-zinc-500 font-sans uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span>{userEmail || "email@huji.ac.il"}</span>
              <Mail size={12} className="text-zinc-300" />
            </div>
            <div className="flex items-center gap-2">
              <span>Jerusalem, Israel</span>
              <MapPin size={12} className="text-zinc-300" />
            </div>
          </div>
        </header>

        {/* Education */}
        <section className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100 pb-2 font-sans">Education</h2>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-bold text-xl text-zinc-900 font-sans">The Hebrew University of Jerusalem</h3>
              <p className="italic text-zinc-600">B.A. in Economics and Business Administration</p>
            </div>
            <span className="font-bold text-zinc-400 text-sm font-sans">2024 — Present</span>
          </div>
        </section>

        {/* Key Coursework */}
        <section className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100 pb-2 font-sans">Key Coursework</h2>
          {starredCourses.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {starredCourses.map((course) => (
                <div key={course.id} className="flex justify-between items-baseline border-b border-zinc-50 pb-2">
                  <span className="font-bold text-zinc-800 text-sm font-sans">{course.name}</span>
                  <span className="font-black text-zinc-900 text-xs font-sans">{course.grade || "A"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-300 italic text-sm">No courses selected. Star up to 5 courses in the Course List to display them here.</p>
          )}
        </section>

        {/* Experience - Placeholder */}
        <section className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100 pb-2 font-sans">Experience</h2>
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-zinc-900 font-sans">Academic Research Assistant</h3>
                <span className="text-zinc-400 text-xs font-bold font-sans">2025</span>
              </div>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Assisted in data collection and statistical analysis for economic development projects. 
                Utilized R and STATA for regression modeling and visualization.
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100 pb-2 font-sans">Technical Skills</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-black text-zinc-900 font-sans uppercase text-[10px] tracking-widest">Analysis:</span>
              <span className="text-zinc-600 font-serif italic">Quantitative Modeling, STATA, Excel Expert</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-zinc-900 font-sans uppercase text-[10px] tracking-widest">Finance:</span>
              <span className="text-zinc-600 font-serif italic">Financial Statement Analysis, Valuation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-zinc-900 font-sans uppercase text-[10px] tracking-widest">Languages:</span>
              <span className="text-zinc-600 font-serif italic">English (Native), Hebrew (Fluent)</span>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-20 pt-10 border-t border-zinc-100 flex justify-between items-center opacity-30">
        <span className="text-[8px] font-black uppercase tracking-[0.3em] font-sans">Generated via HUJI Student Portal</span>
        <span className="text-[8px] font-bold font-sans">2026</span>
      </footer>
    </Card>
  );
}

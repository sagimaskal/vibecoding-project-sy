"use client";

import Link from "next/link";
import { 
  GraduationCap, 
  Target, 
  Zap, 
  ShieldCheck, 
  ChevronLeft,
  ArrowRight,
  PlusCircle,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fdfdfd] text-zinc-950 overflow-x-hidden" dir="rtl">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-10">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100 group-hover:rotate-6 transition-transform">
              <GraduationCap size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-zinc-900 leading-none">HUJI</span>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">Tracker</span>
            </div>
          </div>
          
          <Link href="/login">
            <Button variant="secondary" className="gap-2 rounded-2xl px-6">
              כניסה למערכת
              <ChevronLeft size={16} />
            </Button>
          </Link>
        </nav>

        {/* Hero Section */}
        <section className="pt-16 pb-32">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div 
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest">
                <Zap size={14} fill="currentColor" />
                הגרסה החדשה לסטודנטים ב-2026
              </div>
              
              <h1 className="text-7xl sm:text-8xl font-black leading-[0.95] tracking-tighter text-zinc-900">
                נהלו את התואר <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-blue-500">בצורה חכמה.</span>
              </h1>
              
              <p className="text-xl text-zinc-500 leading-relaxed max-w-lg font-medium">
                המערכת המתקדמת ביותר למעקב אקדמי באוניברסיטה העברית.
                חישוב נ"ז בזמן אמת וניהול קורסים - הכל במקום אחד.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto rounded-[2rem] px-10 gap-3 text-lg h-16 shadow-2xl shadow-blue-200">
                    מתחילים עכשיו
                    <ArrowRight size={20} className="rotate-180" />
                  </Button>
                </Link>
                
                <div className="flex items-center gap-4 px-6 py-4 rounded-[2rem] bg-white border border-zinc-100 shadow-sm">
                   <div className="flex -space-x-3 space-x-reverse">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-zinc-100 shadow-inner overflow-hidden flex items-center justify-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          {i === 4 ? "+50" : ""}
                        </div>
                      ))}
                   </div>
                   <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">סטודנטים כבר הצטרפו</span>
                </div>
              </div>
            </div>

            <div 
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-[120px] -z-10 transform scale-125"></div>
              
              <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-[0_40px_100px_-10px_rgba(0,0,0,0.1)] p-4 ring-1 ring-zinc-200/50">
                 <div className="rounded-[2.5rem] overflow-hidden border border-zinc-100 bg-zinc-50/30">
                    <div className="bg-white p-6 border-b border-zinc-100 flex items-center justify-between">
                       <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-zinc-200"></div>
                          <div className="w-3 h-3 rounded-full bg-zinc-200"></div>
                          <div className="w-3 h-3 rounded-full bg-zinc-200"></div>
                       </div>
                       <div className="h-4 w-32 bg-zinc-50 rounded-full border border-zinc-100"></div>
                    </div>
                    <div className="p-10 space-y-8">
                       <div className="flex justify-between items-end">
                         <div className="space-y-3 w-1/2">
                           <div className="h-3 w-12 bg-blue-100 rounded-full"></div>
                           <div className="h-10 w-full bg-zinc-900 rounded-2xl"></div>
                         </div>
                         <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black">
                           82%
                         </div>
                       </div>
                       
                       <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
                         <div className="h-full w-[82%] bg-blue-600 rounded-full"></div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-6">
                          <div className="h-32 bg-white rounded-3xl border border-zinc-100 shadow-sm p-5 space-y-3">
                             <div className="h-2 w-8 bg-emerald-100 rounded-full"></div>
                             <div className="h-8 w-full bg-zinc-50 rounded-xl"></div>
                          </div>
                          <div className="h-32 bg-white rounded-3xl border border-zinc-100 shadow-sm p-5 space-y-3">
                             <div className="h-2 w-8 bg-blue-100 rounded-full"></div>
                             <div className="h-8 w-full bg-zinc-50 rounded-xl"></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Floating badges */}
              <div 
                className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-zinc-100 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">סטטוס תואר</p>
                  <p className="font-black text-zinc-900 text-lg">תקין לחלוטין</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 relative">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900">הכלים הנכונים להצלחה.</h2>
            <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto">המערכת עוצבה במיוחד עבור צרכי הסטודנטים לכלכלה ומנהל עסקים באוניברסיטה העברית.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: "מעקב דרישות תואר", 
                desc: "סיכום נ\"ז אוטומטי לפי קטגוריות החובה והבחירה של החוגים.", 
                icon: Target,
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              { 
                title: "ניהול קורסים חכם", 
                desc: "הוסיפו קורסים שתכננתם או סיימתם, וראו את ההתקדמות בזמן אמת.", 
                icon: PlusCircle,
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-white p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 transition-all group"
              >
                <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-4 text-zinc-900">{feature.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white">
                <GraduationCap size={16} />
              </div>
              <span className="font-black text-zinc-900 tracking-tighter">HUJI Student Portal &copy; 2026</span>
           </div>
           
           <div className="flex gap-8 text-sm font-bold text-zinc-400 uppercase tracking-widest">
              <a href="#" className="hover:text-zinc-900 transition-colors">פרטיות</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">תנאי שימוש</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">עזרה</a>
           </div>
        </footer>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-hidden">
      {/* Hero Section */}
      <header className="relative py-20 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <nav className="flex justify-between items-center mb-24 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-200">
                H
              </div>
              <span className="text-2xl font-black tracking-tight text-zinc-900 uppercase">HUJI Tracker</span>
            </div>
            <Link
              href="/login"
              className="bg-zinc-900 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
            >
              כניסה למערכת
            </Link>
          </nav>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <h1 className="text-6xl sm:text-7xl font-black leading-[1.1] tracking-tight mb-8">
                נהלו את התואר שלכם <br />
                <span className="text-blue-600">בצורה חכמה.</span>
              </h1>
              <p className="text-xl text-zinc-500 leading-relaxed max-w-xl mb-12 font-medium">
                המערכת המתקדמת ביותר למעקב אקדמי באוניברסיטה העברית. 
                חישוב נקודות זכות בזמן אמת, ניהול קורסים ומעקב אחר דרישות התואר - הכל במקום אחד.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95"
                >
                  מתחילים עכשיו
                </Link>
                <div className="flex items-center gap-4 px-6 py-5 rounded-2xl border border-zinc-100 bg-zinc-50/50">
                   <div className="flex -space-x-2 space-x-reverse">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 shadow-sm overflow-hidden"></div>
                      ))}
                   </div>
                   <span className="text-sm font-bold text-zinc-600">הצטרפו למאות סטודנטים</span>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-left-8 duration-1000 delay-500">
              <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-3xl -z-10 transform scale-150 translate-x-20"></div>
              <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-2xl overflow-hidden shadow-blue-900/5 rotate-3 hover:rotate-0 transition-transform duration-700 p-2 bg-gradient-to-br from-white to-zinc-50">
                 <div className="rounded-[2rem] overflow-hidden border border-zinc-200/50">
                    <div className="bg-zinc-50 p-4 border-b border-zinc-200/50 flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-400"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                       <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="p-8 space-y-6">
                       <div className="h-4 w-1/3 bg-blue-100 rounded-full"></div>
                       <div className="h-10 w-full bg-zinc-100 rounded-2xl"></div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="h-32 bg-zinc-50 rounded-2xl border border-zinc-100"></div>
                          <div className="h-32 bg-zinc-50 rounded-2xl border border-zinc-100"></div>
                       </div>
                       <div className="h-40 w-full bg-zinc-50 rounded-2xl border border-zinc-100"></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { label: "דיוק מקסימלי", desc: "חישוב נ״ז בהתאם לתקנון המדויק של החוגים", icon: "🎯" },
              { label: "ממשק מהיר", desc: "הוספת קורסים וציונים תוך שניות בודדות", icon: "⚡" },
              { label: "אבטחה מלאה", desc: "הנתונים שלכם נשמרים רק על המחשב האישי", icon: "🔒" }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-black mb-3">{feature.label}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100 text-center">
         <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">HUJI Student Portal &copy; 2026</p>
      </footer>
    </div>
  );
}

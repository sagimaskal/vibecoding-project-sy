"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SetupPage() {
  const [major1, setMajor1] = useState("");
  const [major2, setMajor2] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    const isEcon = major1 === "כלכלה" || major2 === "כלכלה";
    const isBusiness = major1 === "מנהל עסקים" || major2 === "מנהל עסקים";

    if (isEcon && isBusiness && major1 !== major2) {
      router.push("/portal/stats");
    } else {
      setError("המערכת עדיין לא תומכת בשילוב זה. אנו עובדים על עדכון דרישות לכלל החוגים.");
    }
  };

  const majors = [
    { name: "כלכלה", icon: "📈" },
    { name: "מנהל עסקים", icon: "💼" },
    { name: "חשבונאות", icon: "🧾" },
    { name: "פסיכולוגיה", icon: "🧠" },
    { name: "מדעי המחשב", icon: "💻" },
    { name: "משפטים", icon: "⚖️" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-12">
           <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-4">בחירת שילוב חוגים</h1>
           <p className="text-lg text-zinc-500 font-medium">כדי להתאים לכם את דרישות התואר, עלינו לדעת מה אתם לומדים</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-600 p-6 rounded-[1.5rem] mb-8 flex items-center gap-4 animate-in shake duration-500">
             <span className="text-2xl">⚠️</span>
             <p className="font-bold">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12 mb-12">
           {/* Major 1 */}
           <div className="space-y-6">
              <h2 className="text-xl font-bold text-zinc-800 mr-2 flex items-center gap-2">
                 <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-black">1</span>
                 חוג ראשון
              </h2>
              <div className="grid grid-cols-2 gap-3">
                 {majors.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => { setMajor1(m.name); setError(""); }}
                      className={`p-6 rounded-[2rem] border-2 transition-all text-right group ${
                        major1 === m.name 
                        ? "border-blue-600 bg-white shadow-xl shadow-blue-900/5 translate-y-[-4px]" 
                        : "border-transparent bg-white hover:border-zinc-200"
                      }`}
                    >
                       <div className="text-3xl mb-3">{m.icon}</div>
                       <div className={`font-black ${major1 === m.name ? "text-blue-600" : "text-zinc-500"}`}>{m.name}</div>
                    </button>
                 ))}
              </div>
           </div>

           {/* Major 2 */}
           <div className="space-y-6">
              <h2 className="text-xl font-bold text-zinc-800 mr-2 flex items-center gap-2">
                 <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-black">2</span>
                 חוג שני
              </h2>
              <div className="grid grid-cols-2 gap-3">
                 {majors.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => { setMajor2(m.name); setError(""); }}
                      className={`p-6 rounded-[2rem] border-2 transition-all text-right group ${
                        major2 === m.name 
                        ? "border-emerald-500 bg-white shadow-xl shadow-emerald-900/5 translate-y-[-4px]" 
                        : "border-transparent bg-white hover:border-zinc-200"
                      }`}
                    >
                       <div className="text-3xl mb-3">{m.icon}</div>
                       <div className={`font-black ${major2 === m.name ? "text-emerald-500" : "text-zinc-500"}`}>{m.name}</div>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="flex flex-col items-center gap-6">
           <button
             onClick={handleContinue}
             disabled={!major1 || !major2}
             className="bg-zinc-900 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
           >
             יצירת אזור אישי
           </button>
           <Link href="/login" className="text-zinc-400 font-bold hover:text-zinc-600 transition-colors uppercase tracking-widest text-sm">חזרה לפרטים אישיים</Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("huji_user_name", name);
    }
    router.push("/setup");
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-6 shadow-xl shadow-blue-200">
            <span className="text-3xl font-black">H</span>
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">כניסה לאזור האישי</h1>
          <p className="mt-3 text-zinc-500 font-medium">הזינו את הפרטים כדי להתחיל במעקב</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-2xl shadow-zinc-200/50">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-zinc-700 mb-2 mr-1">שם מלא</label>
              <input
                id="name"
                type="text"
                required
                className="w-full px-5 py-4 rounded-2xl border border-zinc-100 bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                placeholder="ישראל ישראלי"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-zinc-700 mb-2 mr-1">אימייל</label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-5 py-4 rounded-2xl border border-zinc-100 bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                placeholder="israel@mail.huji.ac.il"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
            >
              המשך לאזור האישי
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-zinc-400 text-sm font-bold uppercase tracking-widest">
           האוניברסיטה העברית בירושלים
        </p>
      </div>
    </div>
  );
}

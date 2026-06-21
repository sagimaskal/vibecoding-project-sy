"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GraduationCap, ArrowRight, User, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (signUpError) throw signUpError;
        alert("נרשמת בהצלחה! במידה והוגדרה אימות אימייל, אנא בדוק את תיבת הדואר שלך.");
        setIsSignUp(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/setup");
      }
    } catch (err: any) {
      setError(err.message || "אירעה שגיאה בתהליך ההתחברות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10 space-y-4">
          <div className="w-16 h-16 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-200">
            <GraduationCap size={32} />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">ברוכים הבאים</h1>
            <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest mt-1">HUJI Student Portal</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-2xl font-black text-zinc-900">
              {isSignUp ? "הרשמה למערכת" : "התחברות"}
            </CardTitle>
            <CardDescription className="text-zinc-500 font-medium">
              {isSignUp ? "צור חשבון כדי לשמור את נתוני התואר שלך בענן." : "התחבר כדי לגשת לנתונים שלך מכל מכשיר."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-8">
            <form onSubmit={handleAuth} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}
              
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">שם מלא</label>
                  <div className="relative">
                    <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ישראל ישראלי"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-12 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-zinc-300"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">כתובת אימייל</label>
                <div className="relative">
                  <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="israel@mail.huji.ac.il"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-12 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-zinc-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">סיסמה</label>
                <div className="relative">
                  <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-12 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-zinc-300"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                disabled={loading}
                className="w-full rounded-2xl h-14 gap-3 text-lg mt-4 shadow-xl shadow-blue-100"
              >
                {loading ? "טוען..." : (isSignUp ? "צור חשבון" : "התחברות")}
                {!loading && <ArrowRight size={20} className="rotate-180" />}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {isSignUp ? "כבר יש לך חשבון? התחבר" : "אין לך חשבון? הירשם עכשיו"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center mt-10 text-zinc-400 text-xs font-bold uppercase tracking-widest">
          המידע נשמר בענן בצורה מאובטחת &copy; 2026
        </p>
      </div>
    </div>
  );
}

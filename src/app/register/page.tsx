"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "../auth/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GraduationCap, ArrowRight, Mail, Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10 space-y-4">
          <Link href="/">
            <div className="w-16 h-16 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-200">
              <GraduationCap size={32} />
            </div>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">הרשמה למערכת</h1>
            <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest mt-1">HUJI Student Portal</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-2xl font-black text-zinc-900">יצירת חשבון</CardTitle>
            <CardDescription className="text-zinc-500 font-medium">הירשם כדי לשמור את נתוני התואר שלך בענן.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-8">
            <form action={signup} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 font-bold text-sm">
                  <AlertCircle size={18} />
                  {decodeURIComponent(error)}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">כתובת אימייל</label>
                <div className="relative">
                  <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    name="email"
                    type="email"
                    required
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
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-12 py-4 font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-zinc-300"
                  />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full rounded-2xl h-14 gap-3 text-lg mt-4 shadow-xl shadow-blue-100">
                צור חשבון
                <ArrowRight size={20} className="rotate-180" />
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-zinc-500 text-sm font-medium">
                כבר יש לך חשבון?{" "}
                <Link href="/login" className="text-blue-600 font-bold hover:underline">
                  היכנס כאן
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

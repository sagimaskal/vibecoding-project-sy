"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Info, ShieldCheck, Mail, Code2, ExternalLink, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="space-y-12 pb-20">
      <PageHeader 
        title="על המערכת" 
        description="קצת רקע על הפרויקט ועל האופן שבו הוא שומר על הנתונים שלכם."
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-10 bg-blue-600 text-white">
            <CardTitle className="text-3xl font-black">HUJI Degree Tracker</CardTitle>
            <p className="text-blue-100 font-bold opacity-80 uppercase tracking-widest text-xs mt-2">הגרסה המקצועית 2026</p>
          </CardHeader>
          <CardContent className="p-10 space-y-8 text-zinc-600 leading-relaxed font-medium">
            <p className="text-xl text-zinc-900 font-black">
              פרויקט זה נוצר במטרה להקל על סטודנטים לכלכלה ומנהל עסקים באוניברסיטה העברית בניהול מסלול הלימודים שלהם.
            </p>
            
            <div className="space-y-4">
              <h4 className="text-zinc-900 font-black text-lg flex items-center gap-3">
                <HelpCircle size={20} className="text-blue-600" />
                איך זה עובד?
              </h4>
              <p>
                המערכת משתמשת במנוע חוקים דטרמיניסטי שמכיר את דרישות התואר המעודכנות של החוגים לכלכלה ומנהל עסקים (נכון לשנת 2024-2025). 
                ברגע שאתם מזינים קורס, המערכת משייכת אותו לקטגוריה הנכונה ומחשבת עבורכם כמה נ"ז נשארו לכם עד לסיום התואר.
              </p>
            </div>

            <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-4">
               <h4 className="text-zinc-900 font-black flex items-center gap-3">
                  <ShieldCheck size={20} className="text-emerald-600" />
                  פרטיות ואבטחת נתונים
               </h4>
               <p className="text-sm">
                 כל הנתונים שאתם מזינים במערכת - שמות, ציונים וקורסים - **נשמרים על הדפדפן שלכם בלבד** (Local Storage).
                 שום דבר לא נשלח לשרת חיצוני ושום דבר לא נשמר בענן. המשמעות היא שהנתונים שלכם פרטיים לחלוטין, 
                 אך הם זמינים רק מהמכשיר והדפדפן שבו השתמשתם.
               </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="text-xl font-black text-zinc-900">צור קשר</h3>
            <div className="space-y-4">
               <a href="mailto:support@hujitracker.ac.il" className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-600 hover:bg-zinc-100 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-zinc-400 group-hover:text-blue-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <span className="font-bold text-sm">support@hujitracker.ac.il</span>
               </a>
               <a href="https://github.com/sagimaskal" className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-600 hover:bg-zinc-100 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-zinc-400 group-hover:text-zinc-900 transition-colors">
                    <Code2 size={18} />
                  </div>
                  <span className="font-bold text-sm">GitHub Repository</span>
               </a>
            </div>
          </Card>

          <div className="p-8 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-[2.5rem] shadow-2xl text-white space-y-4">
            <h4 className="font-black text-lg">תרומה לפרויקט</h4>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
              הפרויקט הוא קוד פתוח. אם מצאתם טעות בחישוב הנ"ז או שיש לכם הצעה לשיפור, נשמח שתפתחו Issue ב-GitHub.
            </p>
            <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-100 rounded-2xl mt-4">
              צפייה בקוד המקור
              <ExternalLink size={16} className="mr-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

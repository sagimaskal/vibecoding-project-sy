"use client";

import { ResumePreview } from "@/components/ResumePreview";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Printer, Download, Eye, FileEdit } from "lucide-react";

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 pb-20">
      <div dir="rtl">
        <PageHeader 
          title="בונה קורות חיים" 
          description="הפיקו קורות חיים אקדמיים באנגלית על סמך הקורסים המצטיינים שלכם."
        >
          <Button onClick={handlePrint} className="rounded-2xl h-12 gap-2 px-6 shadow-xl shadow-blue-100">
            <Printer size={18} />
            הדפסה / שמירה כ-PDF
          </Button>
        </PageHeader>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Editor Info Side */}
        <div className="w-full lg:w-1/3 space-y-6" dir="rtl">
          <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
                <FileEdit size={20} className="text-blue-600" />
                עריכת תוכן
              </h3>
              <p className="text-zinc-500 text-sm font-medium">
                קורות החיים נוצרים אוטומטית. באפשרותך לסמן עד 5 קורסים בגרסה האנגלית שלהם מתוך רשימת הקורסים.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100/50">
              <p className="text-blue-700 text-xs font-bold leading-relaxed">
                טיפ: מומלץ לסמן קורסים עם ציונים גבוהים או קורסים רלוונטיים למשרה אליה אתם מגישים.
              </p>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-zinc-500">פורמט:</span>
                <span className="font-black text-zinc-900">Academic Standard (LTR)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-zinc-500">שפה:</span>
                <span className="font-black text-zinc-900">English</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100/50">
             <h4 className="text-emerald-800 font-black mb-2">מוכן להגשה?</h4>
             <p className="text-emerald-700 text-sm font-medium mb-4">קורות החיים מעוצבים לפי הסטנדרט האקדמי המקובל.</p>
             <Button variant="outline" onClick={handlePrint} className="w-full bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                תצוגה מקדימה להדפסה
             </Button>
          </div>
        </div>

        {/* Preview Side */}
        <div className="flex-1 w-full bg-zinc-200/30 rounded-[3rem] p-4 sm:p-10 border border-zinc-200/50 overflow-hidden shadow-inner">
           <div className="flex items-center justify-center gap-2 mb-8" dir="rtl">
              <Eye size={16} className="text-zinc-400" />
              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">תצוגה מקדימה חיה</span>
           </div>
           <ResumePreview />
        </div>
      </div>

      <style jsx global>{`
        @media print {
          nav, aside, header, .no-print, [dir="rtl"] {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          .max-w-6xl {
            max-width: none !important;
            padding: 0 !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}

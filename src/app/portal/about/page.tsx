"use client";

export default function AboutPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
         <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-4">על המערכת</h1>
         <p className="text-lg text-zinc-500 font-medium">מידע, הנחיות וכללים לשימוש בפורטל הסטודנטים</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <h2 className="text-2xl font-black text-blue-600 mb-6 flex items-center gap-3">
               <span>🎯</span>
               מטרת המערכת
            </h2>
            <div className="space-y-4 text-zinc-600 font-medium leading-relaxed">
               <p>המערכת נועדה לסייע לסטודנטים בניהול ובמעקב אחר התקדמותם האקדמית בצורה עצמאית ומדויקת.</p>
               <p>גרסה זו תומכת באופן מלא בשילוב הדו-חוגי של <strong>כלכלה ומנהל עסקים</strong> באוניברסיטה העברית, בהתאם לדרישות הנ״ז המעודכנות לשנת 2026.</p>
            </div>
         </div>

         <div className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <h2 className="text-2xl font-black text-emerald-600 mb-6 flex items-center gap-3">
               <span>🛠️</span>
               איך משתמשים?
            </h2>
            <ol className="space-y-4 text-zinc-600 font-medium list-decimal list-inside pr-2 leading-relaxed">
               <li>עוברים לטאב <strong>&quot;רשימת קורסים&quot;</strong>.</li>
               <li>מזינים את כל הקורסים שכבר השלמתם (או שאתם לומדים כרגע).</li>
               <li>בוחרים עבור כל קורס לאיזה חוג וקטגוריה הוא שייך.</li>
               <li>המערכת תחשב עבורכם אוטומטית את המצב בטאב <strong>&quot;מעקב נ״ז&quot;</strong>.</li>
            </ol>
         </div>

         <div className="bg-zinc-900 text-white p-10 rounded-[2.5rem] md:col-span-2 shadow-2xl shadow-zinc-200">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
               <span>⚠️</span>
               כללים חשובים (חשוב לקרוא!)
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
               <div>
                  <h3 className="font-black text-blue-400 mb-3">אין כפל קורסים</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">כל קורס נספר פעם אחת בלבד. לא ניתן לשייך קורס אחד לשני חוגים שונים בו-זמנית במערכת זו.</p>
               </div>
               <div>
                  <h3 className="font-black text-emerald-400 mb-3">אבני פינה</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">יש להזין קורסי אבני פינה תחת החוג שבו תרצו שהם ייספרו (כלכלה או מנהל עסקים) תחת קטגוריית &quot;אבני פינה&quot;.</p>
               </div>
               <div>
                  <h3 className="font-black text-yellow-400 mb-3">שמירת נתונים</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">הנתונים שלכם נשמרים בדפדפן המקומי בלבד. מחיקת היסטוריית הגלישה עלולה למחוק את הנתונים שהזנתם.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

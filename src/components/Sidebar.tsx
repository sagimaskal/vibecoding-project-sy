"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCourses } from "./CourseContext";

export function Sidebar() {
  const pathname = usePathname();
  const { userName, resetData } = useCourses();

  const navItems = [
    { name: "מעקב נ״ז", href: "/portal/stats", icon: "📊" },
    { name: "רשימת קורסים", href: "/portal/courses", icon: "📚" },
    { name: "על המערכת", href: "/portal/about", icon: "ℹ️" },
  ];

  return (
    <aside className="w-64 bg-white border-l border-zinc-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-zinc-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">
            H
          </div>
          <span className="font-bold text-zinc-900 tracking-tight">HUJI Portal</span>
        </div>
        
        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">סטודנט/ית</p>
          <p className="font-bold text-zinc-800 truncate">{userName || "אורח/ת"}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-100">
        <button
          onClick={resetData}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <span>🗑️</span>
          איפוס נתונים
        </button>
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-4 py-3 mt-1 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-all"
        >
          <span>🚪</span>
          יציאה
        </Link>
      </div>
    </aside>
  );
}

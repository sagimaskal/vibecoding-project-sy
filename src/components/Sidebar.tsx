"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCourses } from "./CourseContext";
import { 
  LayoutDashboard, 
  BookOpen, 
  Info, 
  LogOut, 
  RefreshCcw,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";

import { logout } from "@/app/auth/actions";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { userName, resetData } = useCourses();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      }
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { name: "מבט על", href: "/portal/stats", icon: LayoutDashboard },
    { name: "רשימת קורסים", href: "/portal/courses", icon: BookOpen },
    { name: "על המערכת", href: "/portal/about", icon: Info },
  ];

  return (
    <aside className="w-72 bg-white border-l border-zinc-200 flex flex-col h-screen sticky top-0 z-40">
      <div className="p-8">
        <Link href="/portal/stats" className="flex items-center gap-3 mb-10 group">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
            <GraduationCap size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-zinc-900 tracking-tight text-lg leading-none">HUJI</span>
            <span className="font-bold text-zinc-400 text-xs uppercase tracking-widest mt-1">Tracker</span>
          </div>
        </Link>

        <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100/50">
          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-2">סטודנט/ית</p>    
          <p className="font-black text-zinc-800 truncate text-sm">{userEmail || userName || "אורח/ת"}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                isActive
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-100"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <Icon size={18} className={cn(isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 space-y-2">
        <Button
          variant="ghost"
          onClick={resetData}
          className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 px-5"
        >
          <RefreshCcw size={16} />
          איפוס נתונים
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-zinc-400 hover:text-zinc-900 px-5"
        >
          <LogOut size={16} />
          יציאה
        </Button>
      </div>
    </aside>
  );
}

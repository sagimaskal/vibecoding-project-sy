"use client";

import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-white" dir="rtl">
      <Sidebar />
      <main className="flex-1 bg-zinc-50/50 relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
          <div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

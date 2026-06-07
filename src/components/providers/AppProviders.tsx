"use client";

import { CourseProvider } from "@/components/CourseContext";
import { GlobalLogger } from "@/components/GlobalLogger";

console.log("[LOG:APP_PROVIDERS_LOADED]");

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CourseProvider>
      <GlobalLogger />
      {children}
    </CourseProvider>
  );
}

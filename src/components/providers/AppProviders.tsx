"use client";

import { CourseProvider } from "@/components/CourseContext";
import { GlobalLogger } from "@/components/GlobalLogger";
import { AuthProvider } from "./AuthProvider";

console.log("[LOG:APP_PROVIDERS_LOADED]");

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CourseProvider>
        <GlobalLogger />
        {children}
      </CourseProvider>
    </AuthProvider>
  );
}

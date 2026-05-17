"use client";

import { CourseProvider } from "@/components/CourseContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <CourseProvider>{children}</CourseProvider>;
}

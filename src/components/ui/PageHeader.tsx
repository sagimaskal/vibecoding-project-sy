"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10", className)}>
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight text-zinc-900">{title}</h1>
        {description && (
          <p className="text-zinc-500 font-medium text-lg">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
}

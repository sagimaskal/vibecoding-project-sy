import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  indicatorClassName,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-zinc-100",
        className
      )}
    >
      <div
        className={cn(
          "h-full w-full flex-1 bg-blue-600 transition-all duration-500 ease-in-out",
          indicatorClassName
        )}
        style={{ transform: `translateX(${100 - percentage}%)` }}
      />
    </div>
  );
}

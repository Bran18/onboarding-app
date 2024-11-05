"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ value, max, showLabel = true, className = '' }: ProgressBarProps) {
    // Ensure value is between 0 and max
    const safeValue = Math.min(Math.max(0, value), max);
    // Calculate percentage
    const percentage = Math.floor((safeValue / max) * 100);
  return (
      <div className={cn("w-full", className)}>
      <Progress value={percentage} max={100} />
      <p className="mt-1 text-xs text-muted-foreground">
        Progress: {percentage}%
      </p>
    </div>
  );
}
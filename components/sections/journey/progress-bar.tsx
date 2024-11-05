"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ value, max, showLabel = true, className = '' }: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={`space-y-2 ${className}`}>
      <Progress value={percentage} className="h-2" />
      {showLabel && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{value} / {max}</span>
        </div>
      )}
    </div>
  );
}
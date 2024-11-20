"use client";

import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StreakCounterProps {
  count: number;
}

export function StreakCounter({ count }: StreakCounterProps) {
  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <Flame className="h-4 w-4 text-orange-500" />
      <span>{count} Day Streak!</span>
    </Badge>
  );
}
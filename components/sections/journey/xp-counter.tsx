"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface XPCounterProps {
  xp: number;
  size?: "sm" | "default";
}

export function XPCounter({ xp, size = "default" }: XPCounterProps) {
  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center gap-1 ${size === "sm" ? "text-xs" : ""}`}
    >
      <Star className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} text-yellow-500`} />
      <span>{xp} XP</span>
    </Badge>
  );
}
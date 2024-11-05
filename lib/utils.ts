import type { DBStatus, UIStatus } from "@/types/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function transformDBStatusToUI(status: DBStatus): UIStatus {
  switch (status) {
    case 'published':
      return 'available';
    case 'draft':
    case 'archived':
      return 'locked';
    default:
      return 'locked';
  }
}
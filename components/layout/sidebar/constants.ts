import { Calendar, Home, Bot, BookOpen, Activity, Boxes } from 'lucide-react';
import type { NavigationItem } from './types';

export const navigationItems: NavigationItem[] = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Start Journey",
    url: "/journey",
    icon: BookOpen,
  },
  {
    title: "AI Assistant",
    url: "/ai-assistant",
    icon: Bot,
  },
  {
    title: "Sandbox",
    url: "/sandbox",
    icon: Boxes,
  },
  {
    title: "Progress",
    url: "/progress",
    icon: Activity,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
];
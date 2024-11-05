"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SupabaseProvider } from "@/context/use-supabase";
import { LearningProgressProvider } from "@/context/use-learning-progress";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <LearningProgressProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </LearningProgressProvider>
    </SupabaseProvider>
  );
}

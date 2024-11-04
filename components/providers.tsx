"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SupabaseProvider } from "@/context/use-supabase";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </SupabaseProvider>
  );
}

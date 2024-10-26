"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/hooks/user-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserProvider>
          <SidebarProvider>{children}</SidebarProvider>
          </UserProvider>
    </ThemeProvider>
  );
}

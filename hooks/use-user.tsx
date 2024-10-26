// hooks/use-user.tsx
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

interface UserContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }, [supabase]);

  // Initial session check
  useEffect(() => {
    setIsLoading(true);
    
    const initializeAuth = async () => {
      await refreshSession();
      setIsLoading(false);
    };

    initializeAuth();
  }, [refreshSession]);

  // Auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, !!currentSession); // Debug log
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN') {
          await refreshSession(); // Force refresh session
          router.refresh();
          if (pathname === '/sign-in' || pathname === '/sign-up') {
            router.push('/journey');
          }
        }

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          router.refresh();
          router.push('/sign-in');
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname, refreshSession]);

  const value = {
    user,
    session,
    isLoading,
    refreshSession,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Add this export at the end of the file
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

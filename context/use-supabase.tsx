'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { SupabaseClient, User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface SupabaseContextType {
  supabase: SupabaseClient;
  user: User | null;
  session: Session | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (event === 'SIGNED_IN') {
        router.refresh();
      }
      if (event === 'SIGNED_OUT') {
        router.refresh();
        router.push('/sign-in');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <SupabaseContext.Provider 
      value={{ 
        supabase, 
        user, 
        session, 
        loading,
        refreshSession
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

// You can still export useAuth as an alias if you want to maintain existing code
export const useAuth = useSupabase;
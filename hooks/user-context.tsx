'use client'

import { createClient } from "@/utils/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface UserStats {
  total_xp: number;
  current_level: number;
  streak_count: number;
  last_active_at: string;
}

interface UserContextType {
  user: User | null;
  userStats: UserStats | null;
  isLoading: boolean;
  error: Error | null;
  refreshUserStats: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Get initial auth state
    const getInitialUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
          await fetchUserStats(user.id);
        }
      } catch (error) {
        console.error('Error getting initial user:', error);
        setError(error instanceof Error ? error : new Error('Failed to get user'));
      } finally {
        setIsLoading(false);
      }
    };

    getInitialUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserStats(session.user.id);
        } else {
          setUserStats(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserStats = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('total_xp, current_level, streak_count, last_active_at')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast.error('Failed to fetch user stats');
    }
  };

  const refreshUserStats = async () => {
    if (user) {
      await fetchUserStats(user.id);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userStats,
        isLoading,
        error,
        refreshUserStats,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

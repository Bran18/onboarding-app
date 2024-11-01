// hooks/use-auth-actions.ts
'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAuthActions() {
  const router = useRouter();
  const supabase = createClient();

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      // Successfully signed in
      toast.success('Signed in successfully');
      router.push('/journey');
      router.refresh();

      return { data };
    } catch (error) {
      toast.error('Failed to sign in');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Signed out successfully');
      router.push('/sign-in');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return {
    signIn,
    signOut,
  };
}
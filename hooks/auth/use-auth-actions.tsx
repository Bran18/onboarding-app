"use client";

import { useSupabase } from "@/context/use-supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuthActions() {
  const router = useRouter();
  const { supabase } = useSupabase();

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Signed in successfully");
      router.push("/journey");

      return { data };
    } catch (error) {
      toast.error("Failed to sign in");
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Check your email to confirm your account");
      router.push("/check-email");

      return { data };
    } catch (error) {
      toast.error("Failed to sign up");
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Signed out successfully");
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Check your email for the password reset link");
      return { success: true };
    } catch (error) {
      toast.error("Failed to send reset email");
      return { error };
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}

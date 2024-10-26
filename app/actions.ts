"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Helper function for email validation
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function for password validation
const isValidPassword = (password: string) => {
  return password.length >= 6; // Add more requirements as needed
};

export const signUpAction = async (formData: FormData) => {
  try {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    // Validate inputs
    if (!email || !password) {
      return encodedRedirect("error", "/sign-up", "Email and password are required");
    }

    if (!isValidEmail(email)) {
      return encodedRedirect("error", "/sign-up", "Please enter a valid email address");
    }

    if (!isValidPassword(password)) {
      return encodedRedirect(
        "error",
        "/sign-up",
        "Password must be at least 6 characters long"
      );
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          created_at: new Date().toISOString(),
        },
      },
    });

    if (error) {
      console.error(`Sign up error: ${error.code} - ${error.message}`);
      return encodedRedirect("error", "/sign-up", error.message);
    }

    return encodedRedirect(
      "success",
      "/sign-up",
      `Verification email sent to ${email}. Please check your inbox.`
    );
  } catch (error) {
    console.error("Unexpected error during sign up:", error);
    return encodedRedirect("error", "/sign-up", "An unexpected error occurred");
  }
};

export const signInAction = async (formData: FormData) => {
  try {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const supabase = await createClient();

    if (!email || !password) {
      return encodedRedirect("error", "/sign-in", "Email and password are required");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login")) {
        return encodedRedirect("error", "/sign-in", "Invalid email or password");
      }
      return encodedRedirect("error", "/sign-in", error.message);
    }

    // Add a small delay to ensure the session is properly set
    await new Promise(resolve => setTimeout(resolve, 100));

    // Use revalidatePath to force a server re-render
    revalidatePath('/', 'layout');
    
    return redirect("/journey");
  } catch (error) {
    console.error("Unexpected error during sign in:", error);
    return encodedRedirect("error", "/sign-in", "An unexpected error occurred");
  }
};

export const forgotPasswordAction = async (formData: FormData) => {
  try {
    const email = formData.get("email")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    if (!email) {
      return encodedRedirect("error", "/forgot-password", "Email is required");
    }

    if (!isValidEmail(email)) {
      return encodedRedirect("error", "/forgot-password", "Please enter a valid email address");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
    });

    if (error) {
      console.error("Password reset error:", error);
      return encodedRedirect(
        "error",
        "/forgot-password",
        "Unable to send reset email. Please try again later."
      );
    }

    return encodedRedirect(
      "success",
      "/forgot-password",
      `Reset link sent to ${email}`
    );
  } catch (error) {
    console.error("Unexpected error during password reset:", error);
    return encodedRedirect("error", "/forgot-password", "An unexpected error occurred");
  }
};

export const resetPasswordAction = async (formData: FormData) => {
  try {
    const supabase = await createClient();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!password || !confirmPassword) {
      return encodedRedirect(
        "error",
        "/reset-password",
        "Please fill in all fields"
      );
    }

    if (password !== confirmPassword) {
      return encodedRedirect(
        "error",
        "/reset-password",
        "Passwords do not match"
      );
    }

    if (!isValidPassword(password)) {
      return encodedRedirect(
        "error",
        "/reset-password",
        "Password must be at least 6 characters long"
      );
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return encodedRedirect(
        "error",
        "/reset-password",
        "Failed to update password. Please try again."
      );
    }

    return encodedRedirect(
      "success", 
      "/sign-in", 
      "Password updated successfully. Please sign in with your new password."
    );
  } catch (error) {
    console.error("Unexpected error during password reset:", error);
    return encodedRedirect("error", "/reset-password", "An unexpected error occurred");
  }
};

export const signOutAction = async () => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Sign out error:", error);
    }
    
    return redirect("/sign-in");
  } catch (error) {
    console.error("Unexpected error during sign out:", error);
    return redirect("/sign-in");
  }
};
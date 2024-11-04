// contexts/LearningProgressContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type {
  UserProgress,
  ChapterProgress,
  LessonProgress,
  LessonStatus,
} from "@/types/learning";
import { useSupabase } from "./use-supabase";

interface LearningProgressContextType {
  userProgress: UserProgress | null;
  loadingProgress: boolean;
  refreshProgress: () => Promise<void>;
  markLessonComplete: (lessonId: string) => Promise<void>;
  getChapterProgress: (chapterId: string) => ChapterProgress | null;
  getLessonStatus: (lessonId: string) => LessonStatus;
}

const LearningProgressContext = createContext<
  LearningProgressContextType | undefined
>(undefined);

export function LearningProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, session } = useSupabase();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);

  const refreshProgress = async () => {
    if (!session?.user) return;

    try {
      setLoadingProgress(true);

      // Fetch user progress
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setUserProgress(profileData);
      }

      // Fetch chapter progress
      const { data: chaptersData } = await supabase
        .from("user_chapter_progress")
        .select("*")
        .eq("user_id", session.user.id);

      if (chaptersData) {
        setChapterProgress(chaptersData);
      }

      // Fetch lesson progress
      const { data: lessonsData } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", session.user.id);

      if (lessonsData) {
        setLessonProgress(lessonsData);
      }
    } finally {
      setLoadingProgress(false);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!session?.user) return;

    const { data: lesson } = await supabase.rpc("complete_lesson", {
      p_user_id: session.user.id,
      p_lesson_id: lessonId,
    });

    await refreshProgress();
  };

  const getChapterProgress = (chapterId: string) => {
    return (
      chapterProgress.find((progress) => progress.chapter_id === chapterId) ??
      null
    );
  };

  const getLessonStatus = (lessonId: string): LessonStatus => {
    const progress = lessonProgress.find((p) => p.lesson_id === lessonId);

    if (progress?.is_completed) return "completed";
    if (progress?.started_at) return "in_progress";
    // You'll need to implement the logic to check if a lesson is available
    // based on prerequisites
    return "locked";
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    refreshProgress();

    // Set up real-time subscriptions
    const progressChannel = supabase
      .channel("learning_progress")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_lesson_progress",
          filter: `user_id=eq.${session?.user.id}`,
        },
        () => {
          refreshProgress();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(progressChannel);
    };
  }, [session?.user.id]);

  return (
    <LearningProgressContext.Provider
      value={{
        userProgress,
        loadingProgress,
        refreshProgress,
        markLessonComplete,
        getChapterProgress,
        getLessonStatus,
      }}
    >
      {children}
    </LearningProgressContext.Provider>
  );
}

export const useLearningProgress = () => {
  const context = useContext(LearningProgressContext);
  if (context === undefined) {
    throw new Error(
      "useLearningProgress must be used within a LearningProgressProvider"
    );
  }
  return context;
};
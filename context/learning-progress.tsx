"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type {
  UserProgress,
  ChapterProgress,
  LessonProgress,
  LessonStatus,
} from "@/types/learning";
import { toast } from "sonner";
import { useSupabase } from "./use-supabase";

interface LearningProgressContextType {
  userProgress: UserProgress | null;
  loadingProgress: boolean;
  refreshProgress: () => Promise<void>;
  markLessonComplete: (lessonId: string) => Promise<void>;
  startLessonProgress: (lessonId: string) => Promise<void>;
  getChapterProgress: (chapterId: string) => ChapterProgress | null;
  getLessonStatus: (lessonId: string) => LessonStatus;
}

const LearningProgressContext = createContext<LearningProgressContextType | undefined>(undefined);

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

      // Fetch user progress and all lesson progress in parallel
      const [profileResult, lessonsResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single(),
        supabase
          .from("user_lesson_progress")
          .select(`
            *,
            lessons (
              id,
              chapter_id
            )
          `)
          .eq("user_id", session.user.id)
      ]);

      if (profileResult.data) {
        setUserProgress(profileResult.data);
      }

      if (lessonsResult.data) {
        setLessonProgress(lessonsResult.data);
        
        // Calculate chapter progress based on completed lessons
        const chaptersMap = new Map<string, ChapterProgress>();
        
        // biome-ignore lint/complexity/noForEach: <explanation>
                lessonsResult.data.forEach(progress => {
          if (progress.lessons?.chapter_id && progress.is_completed) {
            const chapterId = progress.lessons.chapter_id;
            const existing = chaptersMap.get(chapterId) || {
              chapter_id: chapterId,
              completed_lessons: 0,
              user_id: session.user.id
            };
            existing.completed_lessons += 1;
            chaptersMap.set(chapterId, existing);
          }
        });
        
        setChapterProgress(Array.from(chaptersMap.values()));
      }
    } catch (error) {
      toast.error("Error refreshing progress");
      console.error(error);
    } finally {
      setLoadingProgress(false);
    }
  };

  const startLessonProgress = async (lessonId: string) => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from("user_lesson_progress")
        .upsert({
          user_id: session.user.id,
          lesson_id: lessonId,
          started_at: new Date().toISOString(),
          is_completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      setLessonProgress((prev) => [
        ...prev.filter((p) => p.lesson_id !== lessonId),
        data,
      ]);

      return data;
    } catch (error) {
      console.error("Error starting lesson:", error);
      toast.error("Failed to start lesson");
      throw error;
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!session?.user) return;

    try {
      const timestamp = new Date().toISOString();
      
      const { data, error } = await supabase
        .from("user_lesson_progress")
        .upsert({
          user_id: session.user.id,
          lesson_id: lessonId,
          is_completed: true,
          completed_at: timestamp,
          started_at: timestamp
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh progress to update chapter progress
      await refreshProgress();
      toast.success("Lesson completed!");
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast.error("Failed to complete lesson");
      throw error;
    }
  };

  const getChapterProgress = (chapterId: string): ChapterProgress | null => {
    return chapterProgress.find((progress) => progress.chapter_id === chapterId) ?? null;
  };

  const getLessonStatus = (lessonId: string): LessonStatus => {
    const progress = lessonProgress.find((p) => p.lesson_id === lessonId);

    if (progress?.is_completed) return "completed";
    if (progress?.started_at) return "in_progress";
    return "available"; // Changed from "locked" to match your current implementation
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
        startLessonProgress,
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
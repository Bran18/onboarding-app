import type { Chapter, Lesson } from "./types";

// types/learning.ts
export type UserProgress = {
    id: string;
    current_level: number;
    total_xp: number;
    streak_count: number;
    last_activity_date: string | null;
  };
  
  export type ChapterProgress = {
    id: string;
    user_id: string;
    chapter_id: string;
    completed_lessons: number;
    is_completed: boolean;
    started_at: string;
    completed_at: string | null;
  };
  
  export type LessonProgress = {
    id: string;
    user_id: string;
    lesson_id: string;
    started_at: string;
    completed_at: string | null;
    is_completed: boolean;
  };
  
  export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed';
  
  export interface ChapterWithProgress extends Chapter {
    progress?: ChapterProgress;
    totalLessons: number;
    completedLessons: number;
  }
  
  export interface LessonWithProgress extends Lesson {
    progress?: LessonProgress;
    status: LessonStatus;
  }
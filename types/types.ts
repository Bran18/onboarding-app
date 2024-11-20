export interface Chapter {
  id: string;
  slug: string;
  title: string;
  description: string;
  order_sequence: number; // Changed from order to match DB
  category: string;
  xp_reward: number; // Changed from xpReward to match DB
  total_lessons: number; // Changed from totalLessons to match DB
  content_path: string;
  status?: "locked" | "available" | "completed";
  created_at?: string;
  updated_at?: string;
  error?: string | null;
}

export interface Lesson {
  id: string;
  slug: string;
  chapter_id: string;
  title: string;
  description: string;
  content: string;
  estimated_time: number;
  order_sequence: number;
  xp_reward: number;
  content_path: string;
  status: "available" | "locked" | "in_progress" | "completed";
  progress?: LessonProgress;
  created_at?: string;
  updated_at?: string;
  error?: string | null;

}

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  description: string;
  chapterId: string;
  chapterTitle: string;
  estimatedTime: number;
  xpReward: number;
  status: string;
  isCompleted: boolean;
  similarity: number;
}

// Add Database types to match Supabase schema// types/database.types.ts
export interface ChapterJson {
  id: string;
  title: string;
  description: string;
  order: number;
  category: string;
  xpReward: number;
}

export interface LessonFrontmatter {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  order: number;
  xpReward: number;
}
export interface DBLesson {
  id: string;
  slug: string;
  chapter_id: string;
  title: string;
  description: string;
  estimated_time: number;
  order_sequence: number;
  xp_reward: number;
  content_path: string;
  status: "published" | "draft" | "archived";
  created_at?: string;
  updated_at?: string;
  lesson_contents?: Array<{ content: string }>;
}

export interface DBLessonContent {
  lesson_id: string;
  content: string;
  version: number;
}


export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  description: string;
  chapterId: string;
  chapterTitle: string;
  estimatedTime: number;
  xpReward: number;
  status: string;
  isCompleted: boolean;
  similarity: number;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  started_at: string;
  completed_at: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  lesson?: {
    id: string;
    title: string;
    description: string;
    estimated_time: number;
    xp_reward: number;
    status: string;
  };
}

export interface DBChapter {
  id: string;
  slug: string;
  title: string;
  description: string;
  order_sequence: number;
  category: string;
  xp_reward: number;
  total_lessons: number;
  content_path: string;
  status: "published" | "draft" | "archived";
  created_at?: string;
  updated_at?: string;
}

export type DBStatus = 'published' | 'draft' | 'archived';
export type UIStatus = 'available' | 'locked' | 'completed' | 'in_progress';

export interface ProgressWithLesson extends LessonProgress {
  lesson: NonNullable<LessonProgress['lesson']>;
}

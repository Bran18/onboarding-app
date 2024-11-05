
export interface DBChapter {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  lessons?: DBLesson[];
}

export interface DBLesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  estimated_time: number;
  order_sequence: number;
  status: string;
  xp_reward: number;
  chapter_id: string;
}

// UI Types
export interface Chapter {
  id: string;
  slug: string;
  title: string;
  description: string;
  order_sequence: number;
  category: string;
  xp_reward: number;
  total_lessons: number;
  completed_lessons: number;
  status: 'available' | 'locked' | 'completed';
  content_path: string;
  created_at?: string;
  updated_at?: string;
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
  status: 'available' | 'locked' | 'in_progress' | 'completed';
  progress?: LessonProgress;
  created_at?: string;
  updated_at?: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  started_at: string;
  completed_at: string | null;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ChapterWithLessons extends DBChapter {
  lessons: DBLesson[];
  completed_lessons: number;
  status: 'available' | 'locked';
}
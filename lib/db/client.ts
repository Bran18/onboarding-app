// lib/db/client.ts
import { createClient } from "@/utils/supabase/server";
import type { DBChapter, DBLesson, DBLessonContent } from "@/types/types";
import type {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

interface LessonAvailability {
  is_available: boolean;
  reason: string;
}

interface NextLesson {
  chapterSlug: string;
  lessonSlug: string;
}

interface ChapterWithLessonsCount extends DBChapter {
  lessons: { count: number }[];
}

interface LessonWithContent extends DBLesson {
  lesson_contents: { content: string }[];
}

export const db = {
  chapters: {
    async upsert(
      chapter: Partial<DBChapter>
    ): Promise<PostgrestSingleResponse<DBChapter>> {
      const supabase = await createClient();
      return supabase.from("chapters").upsert(chapter).select().single();
    },

    async update(
      id: string,
      data: Partial<DBChapter>
    ): Promise<PostgrestResponse<DBChapter>> {
      const supabase = await createClient();
      return supabase.from("chapters").update(data).eq("id", id).select();
    },

    async getAll(): Promise<PostgrestResponse<DBChapter>> {
      const supabase = await createClient();
      return supabase.from("chapters").select("*").order("order_sequence");
    },

    async getBySlug(
      slug: string
    ): Promise<PostgrestSingleResponse<ChapterWithLessonsCount>> {
      const supabase = await createClient();
      return supabase
        .from("chapters")
        .select(
          `
          *,
          lessons:lessons(count)
        `
        )
        .eq("slug", slug)
        .single();
    },
  },

  lessons: {
    async upsert(
      lesson: Partial<DBLesson>
    ): Promise<PostgrestSingleResponse<DBLesson>> {
      const supabase = await createClient();
      return supabase.from("lessons").upsert(lesson).select().single();
    },

    async getByChapter(
      chapterSlug: string
    ): Promise<PostgrestResponse<LessonWithContent>> {
      const supabase = await createClient();
      return supabase
        .from("lessons")
        .select(
          `
          *,
          lesson_contents(content)
        `
        )
        .eq("chapter_id", chapterSlug)
        .order("order_sequence");
    },

    async getBySlug(
      chapterSlug: string,
      lessonSlug: string
    ): Promise<PostgrestSingleResponse<LessonWithContent>> {
      const supabase = await createClient();
      return supabase
        .from("lessons")
        .select(
          `
          *,
          lesson_contents(content)
        `
        )
        .eq("slug", lessonSlug)
        .eq("chapter_id", chapterSlug)
        .single();
    },

    async getNext(
      currentChapterSlug: string,
      currentLessonSlug: string
    ): Promise<NextLesson | null> {
      const supabase = await createClient();

      try {
        // Get current lesson
        const { data: currentLesson } = await supabase
          .from("lessons")
          .select("order_sequence, chapter_id")
          .eq("slug", currentLessonSlug)
          .eq("chapter_id", currentChapterSlug)
          .single();

        if (!currentLesson) return null;

        // Try next lesson in same chapter
        const { data: nextLesson } = await supabase
          .from("lessons")
          .select("slug, chapter_id")
          .eq("chapter_id", currentChapterSlug)
          .gt("order_sequence", currentLesson.order_sequence)
          .order("order_sequence")
          .limit(1)
          .single();

        if (nextLesson) {
          return {
            chapterSlug: currentChapterSlug,
            lessonSlug: nextLesson.slug,
          };
        }

        // Try first lesson of next chapter
        const { data: nextChapter } = await supabase
          .from("chapters")
          .select("slug")
          .gt("order_sequence", currentLesson.order_sequence)
          .order("order_sequence")
          .limit(1)
          .single();

        if (nextChapter) {
          const { data: firstLesson } = await supabase
            .from("lessons")
            .select("slug")
            .eq("chapter_id", nextChapter.slug)
            .order("order_sequence")
            .limit(1)
            .single();

          if (firstLesson) {
            return {
              chapterSlug: nextChapter.slug,
              lessonSlug: firstLesson.slug,
            };
          }
        }

        return null;
      } catch (error) {
        console.error("Error getting next lesson:", error);
        return null;
      }
    },

    async checkAvailability(
      userId: string,
      lessonId: string
    ): Promise<PostgrestSingleResponse<LessonAvailability>> {
      const supabase = await createClient();
      return supabase
        .rpc("check_lesson_availability", {
          p_user_id: userId,
          p_lesson_id: lessonId,
        })
        .single();
    },
  },

  contents: {
    async upsert(
      lessonId: string,
      content: string
    ): Promise<PostgrestResponse<DBLessonContent>> {
      const supabase = await createClient();
      return supabase
        .from("lesson_contents")
        .upsert({
          lesson_id: lessonId,
          content,
          version: 1,
        })
        .select();
    },
  },

  search: {
    async searchLessons(
      query: string,
      userId?: string
    ): Promise<PostgrestResponse<LessonWithContent>> {
      const supabase = await createClient();

      const searchQuery = query
        .trim()
        .split(/\s+/)
        .map((term) => `${term}:*`)
        .join(" & ");

      return supabase
        .rpc("search_lessons", {
          search_query: searchQuery,
          p_user_id: userId,
        })
        .select();
    },
  },

  progress: {
    async upsert(progress: {
      user_id: string;
      lesson_id: string;
      started_at: string;
      completed_at: string | null;
      is_completed: boolean;
    }) {
      const supabase = await createClient();
      return supabase.from("user_lesson_progress").upsert(progress).select();
    },

    async get(userId: string, lessonId: string) {
      const supabase = await createClient();
      return supabase
        .from("user_lesson_progress")
        .select(
          `
        *,
        lesson:lessons!inner(
          id,
          title,
          description,
          estimated_time,
          xp_reward,
          status
        )
      `
        )
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .single();
    },

    async getAll(userId: string) {
      const supabase = await createClient();
      return supabase
        .from("user_lesson_progress")
        .select(
          `
        *,
        lesson:lessons!inner(
          id,
          title,
          description,
          estimated_time,
          xp_reward,
          status
        )
      `
        )
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
    },
  },
};

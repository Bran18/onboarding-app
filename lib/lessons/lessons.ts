import { createClient } from "@/utils/supabase/client";
import type {
  DBChapter,
  DBLesson,
  Chapter,
  Lesson,
  LessonProgress,
} from "@/types/learning";

// Helper to transform DB status to UI status
function transformStatus(dbStatus: string, progress?: LessonProgress) {
  if (progress?.is_completed) return "completed";
  if (progress?.started_at) return "in_progress";
  return dbStatus === "published" ? "available" : "locked";
}

// Transform DB chapter to UI chapter
function transformChapter(
  chapter: DBChapter,
  completedLessonsCount: number
): Chapter {
  return {
    ...chapter,
    completed_lessons: completedLessonsCount,
    status: chapter.status === "published" ? "available" : "locked",
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } as any
}

// Transform DB lesson to UI lesson
function transformLesson(
  lesson: DBLesson & { lesson_contents?: Array<{ content: string }> },
  progress?: LessonProgress
): Lesson {
  return {
    ...lesson,
    content: lesson.lesson_contents?.[0]?.content ?? "",
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    status: transformStatus(lesson.status as any, progress),
    progress,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } as any // Add this to fix the type error
}

// Fetch all chapters with progress
export async function getChapters(userId: string) {
  const supabase = await createClient();

  try {
    // Get chapters and user progress in parallel
    const [chaptersResult, progressResult] = await Promise.all([
      supabase.from("chapters").select("*").order("order_sequence"),
      supabase
        .from("user_lesson_progress")
        .select("lesson_id, is_completed")
        .eq("user_id", userId)
        .eq("is_completed", true),
    ]);

    if (chaptersResult.error) throw chaptersResult.error;

    // Count completed lessons per chapter
    const completedLessonsByChapter = new Map<string, number>();

    if (progressResult.data) {
      const lessonResults = await supabase
        .from("lessons")
        .select("id, chapter_id")
        .in(
          "id",
          progressResult.data.map((p) => p.lesson_id)
        );

      if (lessonResults.data) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        lessonResults.data.forEach((lesson) => {
          const count = completedLessonsByChapter.get(lesson.chapter_id) ?? 0;
          completedLessonsByChapter.set(lesson.chapter_id, count + 1);
        });
      }
    }

    const chapters = chaptersResult.data.map((chapter) =>
      transformChapter(chapter, completedLessonsByChapter.get(chapter.id) ?? 0)
    );

    return { data: chapters, error: null };
  } catch (error) {
    console.error("Error in getChapters:", error);
    return { data: null, error };
  }
}

// Fetch single chapter with progress
export async function getChapter(userId: string, chapterSlug: string) {
  const supabase = await createClient();

  try {
    // Get chapter data with proper formatting
    const { data: chapter, error: chapterError } = await supabase
      .from("chapters")
      .select(
        `
        *,
        lessons!inner (
          id,
          slug,
          title,
          description,
          estimated_time,
          order_sequence,
          status,
          xp_reward,
          chapter_id
        )
      `
      )
      .eq("slug", chapterSlug)
      .single();

    if (chapterError) {
      console.error("Error fetching chapter:", chapterError);
      return { data: null, error: chapterError };
    }

    const { data: lessonProgress } = await supabase
      .from("user_lesson_progress")
      .select("*")
      .eq("user_id", userId)
      .in(
        "lesson_id",
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        chapter.lessons.map((l: any) => l.id)
      );

    // Transform lessons with progress
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const lessonsWithProgress = chapter.lessons.map((lesson: any) => {
      const progress = lessonProgress?.find((p) => p.lesson_id === lesson.id);
      let status = lesson.status;

      if (progress?.is_completed) {
        status = "completed";
      } else if (progress?.started_at) {
        status = "in_progress";
      } else if (lesson.status === "published") {
        status = "available";
      } else {
        status = "locked";
      }

      return {
        ...lesson,
        status,
        progress,
      };
    });

    return {
      data: {
        ...chapter,
        lessons: lessonsWithProgress,
        completed_lessons:
          lessonProgress?.filter((p) => p.is_completed).length || 0,
        status: chapter.status === "published" ? "available" : "locked",
      },
      error: null,
    };
  } catch (error) {
    console.error("Error in getChapter:", error);
    return { data: null, error };
  }
}

// Fetch lessons for a chapter with progress
export async function getLessonsByChapter(userId: string, chapterSlug: string) {
  const supabase = await createClient();

  try {
    // First get the chapter to get its ID
    const { data: chapter } = await supabase
      .from("chapters")
      .select("id")
      .eq("slug", chapterSlug)
      .single();

    if (!chapter) throw new Error("Chapter not found");

    // Get lessons and progress in parallel
    const [lessonsResult, progressResult] = await Promise.all([
      supabase
        .from("lessons")
        .select(
          `
          *,
          lesson_contents (content)
        `
        )
        .eq("chapter_id", chapter.id) // Use chapter.id instead of slug
        .order("order_sequence"),
      supabase.from("user_lesson_progress").select("*").eq("user_id", userId),
    ]);

    if (lessonsResult.error) throw lessonsResult.error;

    const lessons = lessonsResult.data.map((lesson) =>
      transformLesson(
        lesson,
        progressResult.data?.find((p) => p.lesson_id === lesson.id)
      )
    );

    return { data: lessons, error: null };
  } catch (error) {
    console.error("Error in getLessonsByChapter:", error);
    return { data: null, error };
  }
}

// Fetch single lesson with progress
export async function getLesson(
  userId: string,
  chapterSlug: string,
  lessonSlug: string
) {
  const supabase = await createClient();

  try {
    // First get the chapter to get its ID
    const { data: chapter } = await supabase
      .from("chapters")
      .select("id")
      .eq("slug", chapterSlug)
      .single();

    if (!chapter) throw new Error("Chapter not found");

    // Then get lesson and progress in parallel
    const [lessonResult, progressResult] = await Promise.all([
      supabase
        .from("lessons")
        .select(
          `
          *,
          lesson_contents (content)
        `
        )
        .eq("chapter_id", chapter.id)
        .eq("slug", lessonSlug)
        .single(),
      supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("lesson_id", lessonSlug)
        .maybeSingle(), // Use maybeSingle() instead of single()
    ]);

    if (lessonResult.error) throw lessonResult.error;

    // Add chapter_id to the lesson data for navigation
    const lessonData = {
      ...lessonResult.data,
      chapter_id: chapterSlug, // Add this for navigation
    };

    return {
      data: transformLesson(lessonData, progressResult.data),
      error: null,
    };
  } catch (error) {
    console.error("Error in getLesson:", error);
    return { data: null, error };
  }
}

// Track lesson progress
export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  isCompleted: boolean = false
) {
  const supabase = await createClient();
  const timestamp = new Date().toISOString();

  try {
    // Use upsert with ON CONFLICT DO UPDATE
    const { data, error } = await supabase
      .from("user_lesson_progress")
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          is_completed: isCompleted,
          completed_at: isCompleted ? timestamp : null,
          started_at: timestamp,
          updated_at: timestamp,
        },
        {
          onConflict: "user_id,lesson_id",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error in updateLessonProgress:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error in updateLessonProgress:", error);
    return { data: null, error };
  }
}

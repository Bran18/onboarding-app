import { createClient } from '@/utils/supabase/server';
import type { Chapter, Lesson } from '@/types/types';

export async function getChapterProgress(userId: string, chapterSlug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_chapter_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('chapter_id', chapterSlug)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function unlockChapter(userId: string, chapterSlug: string) {
  const supabase = await createClient();
  
  // Start a transaction to update chapter status and create initial progress
  const { data, error } = await supabase.rpc('unlock_chapter', {
    p_user_id: userId,
    p_chapter_id: chapterSlug
  });

  if (error) throw error;
  return data;
}

export async function syncChaptersWithSupabase(chapters: Chapter[]) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('chapters')
    .upsert(
      chapters.map(chapter => ({
        id: chapter.id,
        slug: chapter.slug,
        title: chapter.title,
        description: chapter.description,
        order_sequence: chapter.order_sequence,
        status: chapter.status,
        category: chapter.category,
        xp_reward: chapter.xp_reward,
        content_path: chapter.content_path
      })),
      { onConflict: 'id' }
    );

  if (error) throw error;
  return data;
}

export async function syncLessonsWithSupabase(lessons: Lesson[], chapterSlug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('lessons')
    .upsert(
      lessons.map(lesson => ({
        id: lesson.id,
        slug: lesson.slug,
        chapter_id: chapterSlug,
        title: lesson.title,
        description: lesson.description,
        xp_reward: lesson.xp_reward,
        estimated_time: lesson.estimated_time,
        order_sequence: lesson.order_sequence,
        content_path: lesson.content_path
      })),
      { onConflict: 'id' }
    );

  if (error) throw error;
  return data;
}

export async function getLessonProgress(userId: string, lessonId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function startLesson(userId: string, lessonId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      started_at: new Date().toISOString(),
      is_completed: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeLesson(userId: string, lessonId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .rpc('complete_lesson', {
      p_user_id: userId,
      p_lesson_id: lessonId
    });

  if (error) throw error;
  return data;
}
// actions/learning.ts
import { createClient } from '@/utils/supabase/server';

export async function getUserProgress(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      current_level,
      total_xp,
      streak_count,
      last_activity_date
    `)
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getChapterProgress(userId: string, chapterId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_chapter_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('chapter_id', chapterId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
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
  
  // This will use our complete_lesson function we created in the database
  const { data, error } = await supabase
    .rpc('complete_lesson', {
      p_user_id: userId,
      p_lesson_id: lessonId
    });

  if (error) throw error;
  return data;
}
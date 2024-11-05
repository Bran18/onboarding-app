import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { LessonContent } from "@/components/sections/journey/lesson-content";
import { getLesson } from "@/lib/lessons/lessons";
import { Loader2 } from "lucide-react";

interface LessonPageProps {
  params: {
    chapterSlug: string;
    lessonSlug: string;
  };
}

async function LessonContentWrapper({ 
  chapterSlug, 
  lessonSlug 
}: { 
  chapterSlug: string; 
  lessonSlug: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/sign-in");
  }

  // First get the chapter
  const { data: chapter } = await supabase
    .from("chapters")
    .select("id")
    .eq("slug", chapterSlug)
    .single();

  if (!chapter) {
    return notFound();
  }

  // Get lesson
  const { data: lesson, error } = await getLesson(
    user.id,
    chapterSlug,
    lessonSlug
  );

  if (error || !lesson) {
    return notFound();
  }

  // Get next lesson info using chapter.id
  const { data: nextLesson } = await supabase
    .from('lessons')
    .select('slug')
    .eq('chapter_id', chapter.id)  // Use chapter.id instead of chapterSlug
    .gt('order_sequence', lesson.order_sequence)
    .order('order_sequence')
    .limit(1)
    .single();

  return (
    <LessonContent
      lesson={lesson}
      userId={user.id}
      nextLessonSlug={nextLesson?.slug}
    />
  );
}

export default function LessonPage({ params }: LessonPageProps) {
  return (
    <div className="container max-w-4xl py-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <LessonContentWrapper 
          chapterSlug={params.chapterSlug}
          lessonSlug={params.lessonSlug}
        />
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { LessonList } from "@/components/sections/journey/lesson-list";
import { getChapter, getLessonsByChapter } from "@/lib/lessons/lessons";
import { Loader2 } from "lucide-react";

interface ChapterPageProps {
  params: {
    chapterSlug: string;
  };
}

async function ChapterContent({ chapterSlug }: { chapterSlug: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const chapterResponse = await getChapter(user.id, chapterSlug);

  if (!chapterResponse.data || chapterResponse.error) {
    console.error("Error loading chapter:", chapterResponse.error);
    return notFound();
  }

  // Check if chapter is available
  if (chapterResponse.data.status === "locked") {
    return redirect("/journey");
  }

  // Transform the lessons from the chapter response
  const lessons = chapterResponse.data.lessons?.map((lesson: { status: string; }) => ({
    ...lesson,
    status: lesson.status === "published" ? "available" : "locked",
  })) || [];

  return (
    <LessonList
      chapterTitle={chapterResponse.data.title}
      chapterSlug={chapterSlug}
      lessons={lessons}
    />
  );
}

export default function ChapterPage({ params }: ChapterPageProps) {
  return (
    <div className="container max-w-4xl py-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <ChapterContent chapterSlug={params.chapterSlug} />
      </Suspense>
    </div>
  );
}

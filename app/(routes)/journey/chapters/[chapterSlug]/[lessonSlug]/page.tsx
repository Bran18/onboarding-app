import { LessonContent } from "@/components/sections/learning/lesson-content";
import { getLesson } from "@/lib/lessons/lessons";
import { notFound } from "next/navigation";

interface LessonPageProps {
  params: {
    chapterSlug: string;
    lessonSlug: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const lesson = await getLesson(params.chapterSlug, params.lessonSlug);
  
  if (!lesson) {
    notFound();
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <LessonContent lesson={lesson} />
    </div>
  );
}
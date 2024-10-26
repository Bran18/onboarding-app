// webapp/app/(routes)/journey/chapters/[chapterSlug]/page.tsx
import { getLessonsByChapter, getChapter } from '@/lib/lessons/lessons';
import { LessonList } from '@/components/sections/learning/lesson-list';
import { notFound } from 'next/navigation';

interface ChapterPageProps {
  params: {
    chapterSlug: string;
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const chapter = await getChapter(params.chapterSlug);
  if (!chapter) return notFound();
  
  const lessons = await getLessonsByChapter(params.chapterSlug);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <LessonList 
        lessons={lessons} 
        chapterSlug={params.chapterSlug}
        chapterTitle={chapter.title}
      />
    </div>
  );
}
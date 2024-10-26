import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Lesson } from "@/types/types";
import { LessonCard } from "./lesson-card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface LessonListProps {
  lessons: Lesson[];
  chapterSlug: string;
  chapterTitle: string;
}

export function LessonList({ lessons, chapterSlug, chapterTitle }: LessonListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link 
          href="/journey" 
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Journey
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{chapterTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <LessonCard 
                key={lesson.id}
                lesson={lesson}
                chapterSlug={chapterSlug}
                isFirst={index === 0}
                isLast={index === lessons.length - 1}
                previousLessonCompleted={
                  index === 0 ? true : lessons[index - 1].status === 'completed'
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
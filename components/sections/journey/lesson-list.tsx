"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { LessonCard } from "./lesson-card";
import type { Lesson } from "@/types/learning";
import { ProgressBar } from "./progress-bar";

interface LessonListProps {
  chapterTitle: string;
  chapterSlug: string;
  lessons: Lesson[];
  completedLessons: number;
}

export function LessonList({ chapterTitle, chapterSlug, lessons }: LessonListProps) {
  const completedLessons = lessons.filter(lesson => lesson.status === 'completed').length;
  const progress = (completedLessons / lessons.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link 
          href="/journey" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Journey
        </Link>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle>{chapterTitle}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {completedLessons} of {lessons.length} completed
            </div>
          </div>
          <ProgressBar 
            value={progress} 
            max={100}
            className="w-full"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              chapterSlug={chapterSlug}
              isLocked={
                index > 0 && 
                lessons[index - 1].status !== 'completed'
              }
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
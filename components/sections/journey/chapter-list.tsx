"use client";

import { ChapterCard } from "./chapter-card";
import type { Chapter } from "@/types/learning";

interface ChapterListProps {
  chapters: Chapter[];
}

export function ChapterList({ chapters }: ChapterListProps) {
  // Find the first unlocked and incomplete chapter
  const activeChapter = chapters.find(
    chapter => chapter.status === 'available' && 
    chapter.completed_lessons < chapter.total_lessons
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {chapters.map((chapter) => (
        <ChapterCard
          key={chapter.id}
          chapter={chapter}
          isActive={chapter.id === activeChapter?.id}
        />
      ))}
    </div>
  );
}
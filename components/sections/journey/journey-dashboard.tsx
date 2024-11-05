"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProgressBar } from "./progress-bar";
import { ChapterList } from "./chapter-list";
import { StreakCounter } from "./streak-counter";
import type { Chapter } from "@/types/learning";

interface JourneyDashboardProps {
  chapters: Chapter[];
  totalXP: number;
  requiredXP: number;
  streakCount: number;
  currentLevel: number;
}

export function JourneyDashboard({
  chapters,
  totalXP,
  requiredXP,
  streakCount,
  currentLevel
}: JourneyDashboardProps) {
  // Calculate total progress
  const totalLessons = chapters.reduce((sum, ch) => sum + ch.total_lessons, 0);
  const completedLessons = chapters.reduce((sum, ch) => sum + ch.completed_lessons, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Progress</CardTitle>
            <StreakCounter count={streakCount} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {currentLevel}</span>
              <span>{totalXP} / {requiredXP} XP</span>
            </div>
            <ProgressBar 
              value={totalXP} 
              max={requiredXP} 
              showLabel={false} 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{completedLessons} / {totalLessons} Lessons</span>
            </div>
            <ProgressBar 
              value={completedLessons} 
              max={totalLessons} 
              showLabel={false} 
            />
          </div>
        </CardContent>
      </Card>

      <ChapterList chapters={chapters} />
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "./progress-bar";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { XPCounter } from "./xp-counter";
import { CustomMarkdown } from "@/components/shared/markdown";
import type { Lesson } from "@/types/learning";
import { updateLessonProgress } from "@/lib/lessons/lessons";

interface LessonContentProps {
  lesson: Lesson;
  userId: string;
  nextLessonSlug?: string;
}

export function LessonContent({ 
  lesson, 
  userId,
  nextLessonSlug 
}: LessonContentProps) {
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (lesson.status === 'in_progress') {
      const startTime = new Date(lesson.progress?.started_at || Date.now()).getTime();
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeSpent(elapsed);
        
        const progressPercentage = Math.min(
          (elapsed / (lesson.estimated_time * 60)) * 100,
          100
        );
        setProgress(progressPercentage);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lesson]);

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await updateLessonProgress(userId, lesson.id, true);
      // You might want to add a toast notification here
      window.location.href = nextLessonSlug 
        ? `/journey/chapters/${lesson.chapter_id}/${nextLessonSlug}`
        : `/journey/chapters/${lesson.chapter_id}`;
    } catch (error) {
      console.error('Error completing lesson:', error);
      // Add error notification here
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/journey/chapters/${lesson.chapter_id}`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Chapter
        </Link>
        <XPCounter xp={lesson.xp_reward} />
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>{lesson.title}</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{lesson.estimated_time} min</span>
            </Badge>
          </div>
          {lesson.status === 'in_progress' && (
            <ProgressBar value={progress} max={100} />
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <CustomMarkdown content={lesson.content} />
          </div>

          <div className="flex justify-between pt-6">
            <Link href={`/journey/chapters/${lesson.chapter_id}`}>
              <Button variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Chapter
              </Button>
            </Link>
            
            {lesson.status !== 'completed' && (
              <Button 
                onClick={handleComplete}
                disabled={isCompleting || progress < 90}
              >
                {isCompleting ? "Completing..." : "Complete Lesson"}
                {nextLessonSlug && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
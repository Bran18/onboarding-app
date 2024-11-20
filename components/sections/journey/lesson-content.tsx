"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { XPCounter } from "./xp-counter";
import { CustomMarkdown } from "@/components/shared/markdown";
import type { Lesson } from "@/types/learning";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLearningProgress } from "@/context/learning-progress";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

interface LessonContentProps {
  lesson: Lesson;
  userId: string;
  nextLessonSlug?: string;
}

export function LessonContent({
  lesson,
  userId,
  nextLessonSlug,
}: LessonContentProps) {
  const router = useRouter();
  const { markLessonComplete, startLessonProgress, getLessonStatus } =
    useLearningProgress();
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const currentStatus = getLessonStatus(lesson.id);
  const startTimeRef = useRef<number | null>(null);
  const [hasFinishedReading, setHasFinishedReading] = useState(false);
  const initializationAttempted = useRef(false);

  // Initialize start time once
  useEffect(() => {
    if (currentStatus === "in_progress" && !startTimeRef.current) {
      startTimeRef.current = lesson.progress?.started_at
        ? new Date(lesson.progress.started_at).getTime()
        : Date.now();
    }
  }, [currentStatus, lesson.progress?.started_at]);

 // Start lesson when first viewing - with cleanup
 useEffect(() => {
  const initializeLesson = async () => {
    // Prevent multiple initialization attempts
    if (initializationAttempted.current) return;
    
    if (currentStatus === "available") {
      try {
        initializationAttempted.current = true;
        await startLessonProgress(lesson.id);
        startTimeRef.current = Date.now();
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        // Ignore duplicate key errors as they're expected in some cases
        if (error?.code !== '23505') {
          console.error("Error starting lesson:", error);
          toast.error("Failed to start lesson");
        }
      }
    }
  };

  initializeLesson();

  // Cleanup function
  return () => {
    initializationAttempted.current = false;
  };
}, [lesson.id, currentStatus, startLessonProgress]);

  // Track progress
  useEffect(() => {
    if (currentStatus !== "in_progress" || !startTimeRef.current) return;

    const updateProgress = () => {
      const now = Date.now();
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const elapsed = Math.floor((now - startTimeRef.current!) / 1000);
      setTimeSpent(elapsed);

      const totalTimeInSeconds = lesson.estimated_time * 60;
      const progressPercentage = Math.min(
        Math.floor((elapsed / totalTimeInSeconds) * 100),
        100
      );

      setProgress(progressPercentage);
    };

    updateProgress();
    const timer = setInterval(updateProgress, 1000);

    return () => clearInterval(timer);
  }, [currentStatus, lesson.estimated_time]);

// * Handle completion of lesson
const handleComplete = async () => {
  if (isCompleting) return;

  try {
    setIsCompleting(true);
    await markLessonComplete(lesson.id);
    
    toast.success('Lesson completed! 🎉', {
      description: `You've earned ${lesson.xp_reward} XP!`
    });

    // Navigate to next lesson or chapter
    if (nextLessonSlug) {
      router.push(`/journey/chapters/${lesson.chapter_id}/${nextLessonSlug}`);
    } else {
      router.push(`/journey/chapters/${lesson.chapter_id}`);
    }
  } catch (error) {
    console.error('Error completing lesson:', error);
    toast.error("Failed to complete lesson. Please try again.");
  } finally {
    setIsCompleting(false);
  }
};

  const canComplete =
    progress >= 90 || currentStatus === "completed" || hasFinishedReading;

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
        <div className="flex items-center gap-4">
          {currentStatus === "completed" && (
            <Badge variant="success">Completed</Badge>
          )}
          <XPCounter xp={lesson.xp_reward} />
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>{lesson.title}</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{lesson.estimated_time} min</span>
            </Badge>
            <XPCounter xp={lesson.xp_reward} />
          </div>
          {currentStatus === "in_progress" && (
            <div className="space-y-2">
              <div className="w-full">
                <Progress value={progress} className="h-2" />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Progress: {progress}%</span>
                  <span>
                    Time: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                  </span>
                </div>
              </div>
              {/* Early completion option */}
              {progress < 90 && (
                <div className="mt-4 flex items-center space-x-2 p-4 bg-muted rounded-lg">
                  <Checkbox
                    id="finished-reading"
                    checked={hasFinishedReading}
                    onCheckedChange={(checked) => {
                      setHasFinishedReading(checked === true);
                      if (checked) {
                        toast.success(
                          "Great! You can now complete the lesson",
                          {
                            description:
                              "Feel free to review the content or move forward",
                          }
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor="finished-reading"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I've finished reading and understood the content
                  </label>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {!canComplete ? (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {hasFinishedReading
                      ? "You can complete this lesson now!"
                      : `${
                          90 - progress
                        }% more to automatically unlock completion`}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Ready to complete!
                  </span>
                )}
              </p>
            </div>
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
            {currentStatus !== "completed" && (
              <Button
                onClick={handleComplete}
                disabled={isCompleting || !canComplete}
                variant={canComplete ? "default" : "outline"}
              >
                {isCompleting ? (
                  "Completing..."
                ) : canComplete ? (
                  <>
                    Complete Lesson
                    {nextLessonSlug && (
                      <ChevronRight className="ml-2 h-4 w-4" />
                    )}
                  </>
                ) : (
                  "Keep Reading..."
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

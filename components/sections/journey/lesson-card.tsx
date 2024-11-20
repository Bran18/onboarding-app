"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, CheckCircle, BookOpen, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { XPCounter } from "./xp-counter";
import type { Lesson, LessonStatus } from "@/types/learning";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useLearningProgress } from "@/context/learning-progress";
import { useRouter } from "next/navigation"; // Changed from 'next/router' to 'next/navigation'
import { toast } from "sonner";

interface LessonCardProps {
  lesson: Lesson;
  chapterSlug: string;
  isLocked?: boolean;
  showProgress?: boolean;
}

export function LessonCard({
  lesson,
  chapterSlug,
  isLocked = false,
  showProgress = true,
}: LessonCardProps) {
  const router = useRouter(); // This is now correctly initialized
  const { getLessonStatus, startLessonProgress } = useLearningProgress();
  const [progressValue, setProgressValue] = useState(0);
  const [isStarting, setIsStarting] = useState(false);

  const currentStatus = getLessonStatus(lesson.id);

  const StatusIcon = {
    completed: CheckCircle,
    in_progress: BookOpen,
    available: BookOpen,
    locked: Lock,
  } as const;

  const statusColor = {
    completed: "text-green-500",
    in_progress: "text-blue-500",
    available: "text-gray-400",
    locked: "text-gray-400",
  } as const;

  const CurrentStatusIcon = StatusIcon[currentStatus as LessonStatus];
  const currentStatusColor = statusColor[currentStatus as LessonStatus];

  useEffect(() => {
    if (currentStatus === "in_progress" && lesson.progress?.started_at) {
      const startTime = new Date(lesson.progress.started_at).getTime();
      const totalTime = lesson.estimated_time * 60 * 1000;

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / totalTime) * 100, 100);
        setProgressValue(progress);
      };

      updateProgress();
      const interval = setInterval(updateProgress, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStatus, lesson.progress?.started_at, lesson.estimated_time]);

  const handleStartLesson = async (e: React.MouseEvent) => {
    if (!lesson.slug || isLocked || isStarting) return;

    try {
      setIsStarting(true);
      e.preventDefault();
      await startLessonProgress(lesson.id);
      router.push(`/journey/chapters/${chapterSlug}/${lesson.slug}`);
    } catch (error) {
      console.error("Failed to start lesson:", error);
      toast.error("Failed to start lesson. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const getButtonText = () => {
    if (isStarting) return "Starting...";
    if (isLocked) return "Locked";
    switch (lesson.status) {
      case "completed":
        return "Review Lesson";
      case "in_progress":
        return "Continue Lesson";
      default:
        return "Start Lesson";
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <CurrentStatusIcon className={`h-5 w-5 ${currentStatusColor}`} />{" "}
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <div className="flex items-start justify-between">
                <h3 className="font-medium leading-none">{lesson.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    <span>{lesson.estimated_time}min</span>
                  </Badge>
                  <XPCounter xp={lesson.xp_reward} size="sm" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {lesson.description}
              </p>
            </div>

            {showProgress && currentStatus === "in_progress" && (
              <div className="w-full">
                <Progress value={progressValue} className="h-1" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {Math.round(progressValue)}% Complete
                </p>
              </div>
            )}
            {isLocked ? (
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  Complete previous lesson to unlock
                </Badge>
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
            ) : (
              <div className="flex justify-end">
                <Button
                  onClick={handleStartLesson}
                  variant={
                    currentStatus === "completed" ? "outline" : "default"
                  }
                  size="sm"
                  disabled={isStarting || isLocked}
                >
                  {getButtonText()}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

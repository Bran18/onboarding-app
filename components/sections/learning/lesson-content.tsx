/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
  CheckCircle,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { CustomMarkdown } from "@/components/shared/markdown/index";
import type { Lesson } from "@/types/types";

interface LessonContentProps {
  lesson: Lesson;
}

export function LessonContent({ lesson }: LessonContentProps) {
  const router = useRouter();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "not_started" | "in_progress" | "completed"
  >(
    lesson.status === "completed"
      ? "completed"
      : lesson.status === "in_progress"
      ? "in_progress"
      : "not_started"
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === "in_progress" && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor(
          (new Date().getTime() - startTime.getTime()) / 1000
        );
        setTimeSpent(elapsed);
        // Calculate progress based on estimated time
        const progressPercentage = Math.min(
          (elapsed / (lesson.estimatedTime * 60)) * 100,
          100
        );
        setProgress(progressPercentage);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startTime, status, lesson.estimatedTime]);

  const handleStart = () => {
    setStartTime(new Date());
    setStatus("in_progress");
    // Here you would typically update the lesson status in your backend
  };

  const handleComplete = () => {
    setStatus("completed");
    setProgress(100);
    // Here you would typically update the lesson status and award XP in your backend
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/journey/chapters/${lesson.chapterId}`}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Chapter
        </Link>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Star className="w-3 h-3" />
          <span>{lesson.xpReward} XP</span>
        </Badge>
      </div>

      {/* Lesson Content Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{lesson.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {lesson.estimatedTime} min
              </span>
            </div>
          </div>
          {status === "in_progress" && startTime && (
            <div className="text-sm text-gray-500">
              Time spent: {formatTime(timeSpent)}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Lesson Description */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              {lesson.description}
            </p>
            <Separator className="my-4" />
          </div>

          {/* Main Content */}
          <div className="prose dark:prose-invert max-w-none mb-8">
            <CustomMarkdown content={lesson.content} />
          </div>
          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center space-x-2">
              {status === "in_progress" && (
                <div className="flex items-center text-sm text-gray-500">
                  <PlayCircle className="w-4 h-4 mr-1" />
                  In Progress
                </div>
              )}
              {status === "completed" && (
                <div className="flex items-center text-sm text-green-500">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Completed
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              {status === "not_started" && (
                <Button onClick={handleStart}>Begin Lesson</Button>
              )}
              {status === "in_progress" && (
                <Button onClick={handleComplete}>Mark as Complete</Button>
              )}
              {status === "completed" && (
                <Button className="flex items-center space-x-2">
                  <span>Next Lesson</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

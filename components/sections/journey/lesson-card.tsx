"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, CheckCircle, BookOpen, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { XPCounter } from "./xp-counter";
import type { Lesson } from "@/types/learning";
import { Progress } from "@/components/ui/progress";

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
  showProgress = true 
}: LessonCardProps) {
  console.log('Lesson in LessonCard:', {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    chapterSlug
  });
  const StatusIcon = {
    completed: CheckCircle,
    'in_progress': BookOpen,
    available: BookOpen,
    locked: Lock
  }[lesson.status];

  const statusColor = {
    completed: "text-green-500",
    'in_progress': "text-blue-500",
    available: "text-gray-400",
    locked: "text-gray-400"
  }[lesson.status];

  return (
    <Card className="relative overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <StatusIcon className={`h-5 w-5 ${statusColor}`} />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <div className="flex items-start justify-between">
                <h3 className="font-medium leading-none">
                  {lesson.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
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

            {showProgress && lesson.status === 'in_progress' && (
              <div className="w-full">
                <Progress value={75} className="h-1" />
                <p className="mt-2 text-xs text-muted-foreground">
                  75% Complete
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
              {lesson.slug ? (
                <Link href={`/journey/chapters/${chapterSlug}/${lesson.slug}`}>
                  <Button variant="outline" size="sm">
                    {lesson.status === 'completed' ? 'Review' : 'Start'} Lesson
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Error: Missing Lesson ID
                </Button>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
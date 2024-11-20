"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock, CheckCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "./progress-bar";
import { XPCounter } from "./xp-counter";
import type { Chapter } from "@/types/learning";

interface ChapterCardProps {
  chapter: Chapter;
  isActive?: boolean;
}

export function ChapterCard({ chapter, isActive = false }: ChapterCardProps) {
  const isLocked = chapter.status === 'locked';
  const isCompleted = chapter.completed_lessons === chapter.total_lessons;
  
  return (
    <Card className={`
      relative overflow-hidden transition-colors
      ${isActive ? 'border-primary' : ''}
      ${isLocked ? 'opacity-75' : ''}
    `}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {isLocked ? (
              <Lock className="h-5 w-5 text-gray-400" />
            ) : isCompleted ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <BookOpen className="h-5 w-5 text-blue-500" />
            )}
            <CardTitle className="text-lg">{chapter.title}</CardTitle>
          </div>
          <XPCounter xp={chapter.xp_reward} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {chapter.description}
        </p>

        <div className="space-y-2">
          <ProgressBar 
            value={chapter.completed_lessons} 
            max={chapter.total_lessons}
          />
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {chapter.category}
            </Badge>
            {isLocked ? (
              <Badge variant="outline">
                Complete previous chapter to unlock
              </Badge>
            ) : (
              <Link href={`/journey/chapters/${chapter.slug}`}>
                <Button variant="outline" size="sm">
                  {isCompleted ? 'Review' : 'Continue'}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Lock, CheckCircle2, PlayCircle } from "lucide-react";
import Link from "next/link";
import type { Lesson } from "@/types/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LessonCardProps {
  lesson: Lesson;
  chapterSlug: string;
  isFirst: boolean;
  isLast: boolean;
  previousLessonCompleted: boolean;
}

export function LessonCard({ 
  lesson, 
  chapterSlug, 
  isFirst,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLast,
  previousLessonCompleted 
}: LessonCardProps) {
  const isLocked = !previousLessonCompleted && !isFirst;
  const isAvailable = previousLessonCompleted || isFirst;

  const getStatusIcon = () => {
    if (isLocked) return <Lock className="w-5 h-5 text-gray-400" />;
    if (lesson.status === 'completed') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (lesson.status === 'in_progress') return <PlayCircle className="w-5 h-5 text-blue-500" />;
    return null;
  };

  const getStatusBadge = () => {
    if (lesson.status === 'completed') {
      return <Badge variant="success">Completed</Badge>;
    }
    if (lesson.status === 'in_progress') {
      return <Badge variant="secondary">In Progress</Badge>;
    }
    if (isLocked) {
      return <Badge variant="outline">Locked</Badge>;
    }
    return <Badge variant="outline">Available</Badge>;
  };

  return (
    <TooltipProvider>
      <Link 
        href={isAvailable ? `/journey/chapters/${chapterSlug}/${lesson.slug}` : '#'}
        className={!isAvailable ? 'cursor-not-allowed' : ''}
      >
        <Card 
          className={`
            transition-all duration-200
            ${isAvailable ? 'hover:shadow-md' : 'opacity-50'}
            ${lesson.status === 'completed' ? 'bg-gray-50 dark:bg-gray-800' : ''}
          `}
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getStatusIcon()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{lesson.title}</h3>
                    {getStatusBadge()}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                </div>
              </div>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>{lesson.xpReward} XP</span>
              </Badge>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.estimatedTime} min</span>
                </div>
              </div>

              {lesson.prerequisites.length > 0 && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-xs">
                      Prerequisites: {lesson.prerequisites.length}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-medium">Required lessons:</p>
                      <ul className="list-disc list-inside text-sm">
                        {lesson.prerequisites.map((prereq) => (
                          <li key={prereq}>{prereq}</li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {isLocked && (
              <div className="mt-3 text-sm text-gray-500">
                Complete the previous lesson to unlock
              </div>
            )}
          </div>
        </Card>
      </Link>
    </TooltipProvider>
  );
}

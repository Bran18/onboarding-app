/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Calendar as CalendarIcon, Flame, Star, Trophy } from "lucide-react";
import { CalendarTask, StreakInfo } from "./types";
import { addDays, format, isSameDay } from "date-fns";
import { TaskDialog } from '@/components/sections/calendar/task-dialog';


export const LearningCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<CalendarTask[]>([
    {
      id: "1",
      title: "Set up MetaMask Wallet",
      description: "Initial wallet setup and security configuration",
      date: new Date(),
      xpReward: 50,
      isCompleted: false,
      type: 'TUTORIAL'
    },
    {
      id: "2",
      title: "DeFi Basics Quiz",
      description: "Test your knowledge of DeFi fundamentals",
      date: addDays(new Date(), 2),
      xpReward: 100,
      isCompleted: false,
      isXPBoostDay: true,
      type: 'QUIZ'
    }
  ]);

  const streakInfo: StreakInfo = {
    currentStreak: 5,
    nextMilestone: 7,
    lastCompletedDate: new Date()
  };

  // Custom day content renderer
  const renderDay = (day: Date) => {
    const dayTasks = tasks.filter(task => isSameDay(task.date, day));
    const isXPBoostDay = dayTasks.some(task => task.isXPBoostDay);
    const isStreakDay = isSameDay(day, streakInfo.lastCompletedDate);

    return (
      <div className="relative w-full h-full p-2">
        <time dateTime={format(day, 'yyyy-MM-dd')} className="text-sm">
          {format(day, 'd')}
        </time>
        {dayTasks.length > 0 && (
          <div className="absolute bottom-1 left-1 right-1">
            <div className="flex gap-1">
              {isXPBoostDay && (
                <Star className="w-3 h-3 text-yellow-500" />
              )}
              {isStreakDay && (
                <Flame className="w-3 h-3 text-orange-500" />
              )}
              {dayTasks.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Streak Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Current Learning Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{streakInfo.currentStreak} days</span>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <Badge variant="secondary">
              {streakInfo.nextMilestone - streakInfo.currentStreak} days to milestone!
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Learning Schedule
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <TaskDialog 
                date={selectedDate || new Date()} 
                onSave={(task) => setTasks([...tasks, task])}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            components={{
              Day: ({ date, ...props }) => (
                <div {...props}>
                  {renderDay(date)}
                </div>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Daily Tasks */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks
                .filter(task => isSameDay(task.date, selectedDate))
                .map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.isXPBoostDay && (
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                          1.5x XP
                        </Badge>
                      )}
                      <Badge>
                        {task.xpReward} XP
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
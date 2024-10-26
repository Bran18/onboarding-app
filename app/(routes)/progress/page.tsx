'use client'

import { ActivityChart } from "@/components/sections/progress/activity-chart";
import { LevelCard } from "@/components/sections/progress/level-card";
import { TasksCompletedCard, TimeInvestedCard } from "@/components/sections/progress/stats-row";
import { StreakCard } from "@/components/sections/progress/streak-card";
import { UpcomingRewards } from "@/components/sections/progress/upcoming-rewards";


export default function ProgressPage() {
    return (
      <div className="w-full space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StreakCard />
          <LevelCard />
        </div>
  
        {/* Time and Tasks Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TimeInvestedCard />
          <TasksCompletedCard />
        </div>
  
        {/* Charts and Rewards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActivityChart />
          <UpcomingRewards />
        </div>
      </div>
    );
  }
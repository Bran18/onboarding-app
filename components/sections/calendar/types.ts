export interface CalendarTask {
    id: string;
    title: string;
    description: string;
    date: Date;
    xpReward: number;
    isCompleted: boolean;
    isXPBoostDay?: boolean;
    type: 'TUTORIAL' | 'QUIZ' | 'PROJECT' | 'MILESTONE';
  }
  
  export interface StreakInfo {
    currentStreak: number;
    nextMilestone: number;
    lastCompletedDate: Date;
  }
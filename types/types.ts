export interface Chapter {
    id: string;
    slug: string;
    title: string;
    description: string;
    order: number;
    totalLessons: number;
    completedLessons: number;
    xpReward: number;
    category: 'Web3 Basics' | 'Smart Contracts' | 'Security Fundamentals' | 'DeFi Essentials';
    status: 'locked' | 'available' | 'in_progress' | 'completed';
  }
  
  export interface Lesson {
    id: string;
    slug: string;
    chapterId: string;
    title: string;
    description: string;
    content: string;
    xpReward: number;
    status: 'locked' | 'available' | 'in_progress' | 'completed';
    estimatedTime: number;
    prerequisites: string[];
    order: number;
  }
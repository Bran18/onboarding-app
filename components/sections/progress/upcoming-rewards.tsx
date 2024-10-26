'use client'

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const GradientProgress = ({ value }: { value: number }) => (
  <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
    />
  </div>
);

interface Reward {
  title: string;
  description: string;
  progress: number;
  reward: string;
}

const rewards: Reward[] = [
  {
    title: "10-Day Streak NFT Badge",
    description: "3 days remaining",
    progress: 70,
    reward: "+50 XP"
  },
  {
    title: "Level 6 - DeFi Master",
    description: "250 XP remaining",
    progress: 75,
    reward: "Unlock Advanced Tutorials"
  },
  {
    title: "Weekly Challenge",
    description: "Complete 5 more tasks",
    progress: 40,
    reward: "+100 XP"
  }
];

export const UpcomingRewards = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Upcoming Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.title}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-1">
                <h4 className="font-medium">{reward.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {reward.description}
                </p>
                <GradientProgress value={reward.progress} />
              </div>
              <Badge variant="secondary">{reward.reward}</Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
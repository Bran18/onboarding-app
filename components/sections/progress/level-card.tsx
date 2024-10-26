'use client'

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

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

export const LevelCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Current Level</CardTitle>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.8 }}
        >
          <Trophy className="h-4 w-4 text-yellow-500" />
        </motion.div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">Level 5</div>
        <GradientProgress value={75} />
        <p className="text-xs text-muted-foreground mt-2">
          750/1000 XP to Level 6
        </p>
      </CardContent>
    </Card>
  );
};
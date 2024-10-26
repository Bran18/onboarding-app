'use client'

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Target } from "lucide-react";

export const TimeInvestedCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
        <Clock className="h-4 w-4 text-blue-500" />
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-2xl font-bold">460 mins</div>
          <p className="text-xs text-muted-foreground">
            Average 65 mins/day
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export const TasksCompletedCard = () => {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          <Target className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-2xl font-bold">30/42</div>
            <p className="text-xs text-muted-foreground">
              71% completion rate
            </p>
          </motion.div>
        </CardContent>
      </Card>
    );
  };
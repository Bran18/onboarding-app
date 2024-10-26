'use client'

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

export const StreakCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 15 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Flame className="h-4 w-4 text-orange-500" />
        </motion.div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="text-2xl font-bold">7 Days</div>
            <p className="text-xs text-muted-foreground">
              3 days until 50XP bonus!
            </p>
          </div>
          <Badge variant="secondary" className="ml-auto">
            +5 XP/day
          </Badge>
        </motion.div>
      </CardContent>
    </Card>
  );
};
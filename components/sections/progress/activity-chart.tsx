'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";

interface ActivityData {
  period: string;
  xp: number;
  tasks: number;
  timeSpent: number;
}

const activityData = {
  weekly: [
    { period: 'Mon', xp: 120, tasks: 3, timeSpent: 45 },
    { period: 'Tue', xp: 180, tasks: 4, timeSpent: 60 },
    { period: 'Wed', xp: 150, tasks: 3, timeSpent: 55 },
    { period: 'Thu', xp: 220, tasks: 5, timeSpent: 75 },
    { period: 'Fri', xp: 190, tasks: 4, timeSpent: 65 },
    { period: 'Sat', xp: 250, tasks: 6, timeSpent: 90 },
    { period: 'Sun', xp: 210, tasks: 5, timeSpent: 70 },
  ],
  monthly: [
    // ... monthly data
  ],
  yearly: [
    // ... yearly data
  ],
};

export const ActivityChart = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Activity Overview
        </CardTitle>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          </TabsList>
          
          {/* Bar Chart */}
          <TabsContent value="bar" className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={activityData[timeframe as keyof typeof activityData]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="xp" 
                  fill="url(#colorGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(168, 85, 247)" />
                    <stop offset="100%" stopColor="rgb(236, 72, 153)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Line Chart */}
          <TabsContent value="line" className="h-[300px]">
            {/* ... Line chart implementation ... */}
          </TabsContent>

          {/* Pie Chart */}
          <TabsContent value="pie" className="h-[300px]">
            {/* ... Pie chart implementation ... */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
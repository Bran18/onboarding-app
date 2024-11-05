import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Milestone,
  Brain,
  Code,
  Shield,
  Wallet,
  ChevronRight,
} from "lucide-react";

export const LearningPathOverview = () => {
  const milestones = [
    {
      id: 1,
      title: "Web3 Basics",
      status: "in-progress",
      icon: Brain,
      completed: 2,
      total: 3,
    },
    {
      id: 2,
      title: "Smart Contracts",
      status: "upcoming",
      icon: Code,
      completed: 0,
      total: 4,
    },
    {
      id: 3,
      title: "Security Fundamentals",
      status: "upcoming",
      icon: Shield,
      completed: 0,
      total: 3,
    },
    {
      id: 4,
      title: "DeFi Essentials",
      status: "upcoming",
      icon: Wallet,
      completed: 0,
      total: 4,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Milestone className="w-5 h-5 text-purple-500" />
          Learning Path
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`flex items-center gap-3 ${
                milestone.status === "in-progress"
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <div
                className={`
                p-1.5 rounded-full 
                ${
                  milestone.status === "in-progress"
                    ? "bg-purple-100 dark:bg-purple-900"
                    : "bg-gray-100 dark:bg-gray-800"
                }
              `}
              >
                <milestone.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">
                    {milestone.title}
                  </p>
                  {milestone.status === "in-progress" && (
                    <span className="text-xs text-gray-500">
                      {milestone.completed}/{milestone.total}
                    </span>
                  )}
                </div>
                {milestone.status === "in-progress" && (
                  <div className="mt-1 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-1 bg-purple-500 rounded-full"
                      style={{
                        width: `${
                          (milestone.completed / milestone.total) * 100
                        }%`,
                      }}
                    />
                  </div>
                )}
              </div>
              {index < milestones.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

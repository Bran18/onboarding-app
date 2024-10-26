import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Trophy, Award, Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MilestoneRewards = () => {
  const rewards = [
    {
      id: 1,
      title: "Web3 Pioneer",
      description: "Complete Web3 Basics module",
      reward: "Exclusive NFT Badge",
      icon: Trophy,
      status: "in-progress",
      progress: 66, // percentage
      unlocksAt: "3/3 tasks",
    },
    {
      id: 2,
      title: "Smart Contract Specialist",
      description: "Master smart contract fundamentals",
      reward: "Advanced Tutorial Access",
      icon: Award,
      status: "locked",
      progress: 0,
      unlocksAt: "4/4 tasks",
    },
    {
      id: 3,
      title: "Security Guardian",
      description: "Complete security essentials",
      reward: "Security Best Practices Guide",
      icon: Download,
      status: "locked",
      progress: 0,
      unlocksAt: "3/3 tasks",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Gift className="w-5 h-5 text-pink-500" />
          Milestone Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rewards.map((reward) => (
            <TooltipProvider key={reward.id}>
              <div
                className={`
                  relative p-4 rounded-lg border 
                  ${
                    reward.status === "in-progress"
                      ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border-purple-200 dark:border-purple-800"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`
                      p-2 rounded-full
                      ${
                        reward.status === "in-progress"
                          ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }
                    `}
                  >
                    <reward.icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{reward.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {reward.description}
                        </p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant={
                              reward.status === "in-progress"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {reward.unlocksAt}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Complete {reward.unlocksAt} to unlock this reward
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-300">
                          {reward.reward}
                        </span>
                        {reward.progress > 0 && (
                          <span className="text-gray-500">
                            {reward.progress}%
                          </span>
                        )}
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            reward.status === "in-progress"
                              ? "bg-gradient-to-r from-purple-500 to-pink-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                          style={{ width: `${reward.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

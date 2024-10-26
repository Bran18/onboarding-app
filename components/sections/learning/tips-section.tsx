import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
export const TipOfTheDay = () => {
  const tips = [
    {
      id: 1,
      tip: "Smart contracts are self-executing contracts with the terms directly written into code.",
      category: "Smart Contracts",
    },
    {
      id: 2,
      tip: "The Ethereum blockchain processes over 1 million transactions daily!",
      category: "Blockchain",
    },
    {
      id: 3,
      tip: "Never share your private keys - they're like the password to your digital vault.",
      category: "Security",
    },
  ];

  // In production, you'd want to determine which tip to show based on the date
  const todaysTip = tips[0];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Tip of the Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {todaysTip.tip}
          </p>
          <Badge variant="secondary" className="text-xs">
            {todaysTip.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

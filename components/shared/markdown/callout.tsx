import { cn } from "@/lib/utils";
import { Info, AlertCircle, XCircle, CheckCircle, Lightbulb } from "lucide-react";
import type { CalloutProps, CalloutType } from "./types";

type IconComponent = React.ComponentType<{ className?: string }>;

const calloutStyles: Record<CalloutType, { icon: React.ComponentType; styles: string }> = {
  info: {
    icon: Info,
    styles: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/30",
  },
  warning: {
    icon: AlertCircle,
    styles: "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/30",
  },
  error: {
    icon: XCircle,
    styles: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/30",
  },
  success: {
    icon: CheckCircle,
    styles: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/30",
  },
  tip: {
    icon: Lightbulb,
    styles: "border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-900/30",
  },
};

// Create a wrapper component for the Icon
function IconWrapper({ Icon, className }: { Icon: IconComponent; className?: string }) {
    return <Icon className={className} />;
  }

export function Callout({ type, title, children }: CalloutProps) {
  const { icon: Icon, styles } = calloutStyles[type];

  return (
    <div
      className={cn(
        "my-6 flex gap-2 rounded-lg border p-4",
        styles
      )}
    >
      <IconWrapper Icon={Icon} className="h-5 w-5 mt-1 flex-shrink-0" />
      <div className="flex-1">
        {title && (
          <h5 className="mb-1 font-medium leading-none tracking-tight">
            {title}
          </h5>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}

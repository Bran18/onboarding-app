'use client';

import { Button } from "@/components/ui/button";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container max-w-6xl py-6">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load your learning journey.
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
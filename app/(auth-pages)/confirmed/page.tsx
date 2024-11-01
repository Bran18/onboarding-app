"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmationSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to journey after 5 seconds
    const timer = setTimeout(() => {
      router.push("/journey");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background/50 to-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Email Confirmed Successfully!
          </h1>
          <p className="text-sm text-muted-foreground">
            Your email has been verified. You can now sign in to your account.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Button 
              className="w-full" 
              onClick={() => router.push("/journey")}
            >
              Go now
            </Button>
            <p className="text-sm text-muted-foreground">
              You will be redirected to the your journey page in 5 seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
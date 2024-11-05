import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { JourneyDashboard } from "@/components/sections/journey/journey-dashboard";
import { getChapters } from "@/lib/lessons/lessons";
import { Loader2 } from "lucide-react";

async function JourneyContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/sign-in");
  }

  // Get chapters with progress
  const { data: chapters, error } = await getChapters(user.id);
  
  if (error) {
    throw error;
  }

  // Get user profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_level, total_xp, streak_count')
    .eq('id', user.id)
    .single();

  // Calculate required XP (you can adjust the formula)
  const requiredXP = (profile?.current_level || 1) * 200;

  return (
    <JourneyDashboard
      chapters={chapters || []}
      totalXP={profile?.total_xp || 0}
      requiredXP={requiredXP}
      streakCount={profile?.streak_count || 0}
      currentLevel={profile?.current_level || 1}
    />
  );
}

export default function JourneyPage() {
  return (
    <div className="container max-w-6xl py-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <JourneyContent />
      </Suspense>
    </div>
  );
}

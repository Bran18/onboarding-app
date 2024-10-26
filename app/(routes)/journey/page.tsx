import { MilestoneRewards } from "@/components/sections/learning/milestone-section";
import { LearningPathOverview } from "@/components/sections/learning/path-section";
import { TipOfTheDay } from "@/components/sections/learning/tips-section";
import JourneyDashboard from "@/components/sections/routes/journey-section";
import { getChapters, getLessonsByChapter } from "@/lib/lessons/lessons";
import type { Lesson } from "@/types/types";

export default async function JourneyPage() {

  const chapters = await getChapters();
  const lessonsMap: { [key: string]: Lesson[] } = {};
  
  // Get lessons for each chapter
  await Promise.all(
    chapters.map(async (chapter) => {
      lessonsMap[chapter.slug] = await getLessonsByChapter(chapter.slug);
    })
  );
  return (
    <div className="w-full mx-auto space-y-6 p-6">
      {/* Journey Dashboard */}
      <JourneyDashboard 
        initialChapters={chapters}
        initialLessons={lessonsMap}
      />
      {/* Learning Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LearningPathOverview />
        <TipOfTheDay />
        <MilestoneRewards />
      </div>
    </div>
  );
}

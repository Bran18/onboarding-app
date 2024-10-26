import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Chapter, Lesson } from "@/types/types";

const CONTENT_DIR = path.join(process.cwd(), "content/lessons");

export async function getChapters(): Promise<Chapter[]> {
  const chaptersPath = path.join(CONTENT_DIR, "chapters");
  const chapters = await fs.readdir(chaptersPath);

  const chapterData = await Promise.all(
    chapters.map(async (chapterDir) => {
      const chapterConfigPath = path.join(
        chaptersPath,
        chapterDir,
        "chapter.json"
      );
      const configContent = await fs.readFile(chapterConfigPath, "utf8");
      return { ...JSON.parse(configContent), slug: chapterDir };
    })
  );

  return chapterData.sort((a, b) => a.order - b.order);
}

export async function getChapter(chapterSlug: string): Promise<Chapter | null> {
  try {
    const chapterConfigPath = path.join(
      CONTENT_DIR,
      "chapters",
      chapterSlug,
      "chapter.json"
    );
    const configContent = await fs.readFile(chapterConfigPath, "utf8");
    const chapterData = JSON.parse(configContent);

    // Get the lessons to count completed ones
    const lessons = await getLessonsByChapter(chapterSlug);
    const completedLessons = lessons.filter(
      (lesson) => lesson.status === "completed"
    ).length;

    return {
      ...chapterData,
      slug: chapterSlug,
      completedLessons,
      totalLessons: lessons.length,
    };
  } catch (error) {
    console.error(`Error loading chapter ${chapterSlug}:`, error);
    return null;
  }
}

export async function getLessonsByChapter(
  chapterSlug: string
): Promise<Lesson[]> {
  const chapterPath = path.join(CONTENT_DIR, "chapters", chapterSlug);
  const files = await fs.readdir(chapterPath);

  const lessons = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const fullPath = path.join(chapterPath, file);
        const fileContents = await fs.readFile(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          ...data,
          slug: file.replace(".md", ""),
          chapterId: chapterSlug,
          content,
        } as Lesson;
      })
  );

  return lessons.sort((a, b) => a.order - b.order);
}

export async function getLesson(
  chapterSlug: string,
  lessonSlug: string
): Promise<Lesson | null> {
  try {
    const lessonPath = path.join(
      CONTENT_DIR,
      "chapters",
      chapterSlug,
      `${lessonSlug}.md`
    );
    const fileContents = await fs.readFile(lessonPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      ...data,
      slug: lessonSlug,
      chapterId: chapterSlug,
      content,
    } as Lesson;
  } catch (error) {
    console.error(`Error loading lesson ${lessonSlug}:`, error);
    return null;
  }
}

// Utility function to get next lesson in a chapter
export async function getNextLesson(
  currentChapterSlug: string,
  currentLessonSlug: string
): Promise<{ chapterSlug: string; lessonSlug: string } | null> {
  try {
    const lessons = await getLessonsByChapter(currentChapterSlug);
    const currentIndex = lessons.findIndex(
      (lesson) => lesson.slug === currentLessonSlug
    );

    // If there's a next lesson in the current chapter
    if (currentIndex < lessons.length - 1) {
      return {
        chapterSlug: currentChapterSlug,
        lessonSlug: lessons[currentIndex + 1].slug,
      };
    }

    // If we're at the end of the current chapter, get the next chapter
    const chapters = await getChapters();
    const currentChapterIndex = chapters.findIndex(
      (chapter) => chapter.slug === currentChapterSlug
    );

    if (currentChapterIndex < chapters.length - 1) {
      const nextChapter = chapters[currentChapterIndex + 1];
      const nextChapterLessons = await getLessonsByChapter(nextChapter.slug);
      
      if (nextChapterLessons.length > 0) {
        return {
          chapterSlug: nextChapter.slug,
          lessonSlug: nextChapterLessons[0].slug,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting next lesson:", error);
    return null;
  }
}
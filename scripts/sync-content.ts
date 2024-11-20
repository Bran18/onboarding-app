// scripts/sync-content.ts
import { createClient } from "@supabase/supabase-js";
import fs, { readdir, readFile } from "node:fs/promises";
import path, { join } from "node:path";
import matter from "gray-matter";
import dotenv from "dotenv";

interface ChapterData {
  id: string;
  title: string;
  description: string;
  order: number;
  category: string;
  xpReward: number;
}

// Load environment variables
dotenv.config({ path: ".env.local" });

const CONTENT_DIR = path.join(process.cwd(), "content/lessons");

// Create Supabase client
const supabase = createClient(
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Note: Use service role key for admin access
);

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function validateChapterData(
  chapterData: ChapterData,
  chapterDir: string
) {
  // Log the incoming data for debugging
  console.log("Validating chapter data:", chapterData);

  const required = [
    "id",
    "title",
    "description",
    "order",
    "category",
    "xpReward",
  ];
  const missing = required.filter(
    (field) => !chapterData[field as keyof ChapterData]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required fields in ${chapterDir}/chapter.json: ${missing.join(
        ", "
      )}`
    );
  }

  // Ensure order is a number and not null
  if (typeof chapterData.order !== "number") {
    throw new Error(
      `Invalid order value in ${chapterDir}/chapter.json: must be a number`
    );
  }

  return true;
}

async function syncContent() {
  try {
    console.log("Starting content sync...");

    // Get all chapter directories
    const chaptersPath = join(CONTENT_DIR, "chapters");
    const chapters = await readdir(chaptersPath);

    for (const chapterDir of chapters) {
      console.log(`Processing chapter: ${chapterDir}`);

      try {
        // Read chapter config
        const chapterConfigPath = join(
          chaptersPath,
          chapterDir,
          "chapter.json"
        );
        const configContent = await readFile(chapterConfigPath, "utf8");
        const chapterData = JSON.parse(configContent) as ChapterData;

        // Validate chapter data
        await validateChapterData(chapterData, chapterDir);

        // Prepare chapter data with explicit order_sequence
        const chapterPayload = {
          id: chapterData.id || chapterDir,
          slug: chapterDir,
          title: chapterData.title,
          description: chapterData.description,
          order_sequence: chapterData.order, // Make sure this matches your chapter.json field
          category: chapterData.category,
          xp_reward: chapterData.xpReward,
          content_path: `/content/lessons/chapters/${chapterDir}`,
          status: "published",
        };

        console.log("Upserting chapter with data:", chapterPayload);

        // Upsert chapter
        // Upsert chapter
        const { data: chapterResult, error: chapterError } = await supabase
          .from("chapters")
          .upsert(chapterPayload)
          .select()
          .single();

        if (chapterError) {
          console.error("Chapter upsert error:", chapterError);
          throw new Error(
            `Error upserting chapter ${chapterDir}: ${chapterError.message}`
          );
        }

        console.log("Successfully upserted chapter:", chapterResult);
        // Process lessons in the chapter
        const files = await readdir(join(chaptersPath, chapterDir));
        const lessonFiles = files.filter((file) => file.endsWith(".md"));

        console.log(`Found ${lessonFiles.length} lessons in ${chapterDir}`);

        for (const file of lessonFiles) {
          console.log(`Processing lesson: ${file}`);

          const fullPath = join(chaptersPath, chapterDir, file);
          const fileContents = await readFile(fullPath, "utf8");
          const { data: frontMatter, content } = matter(fileContents);

          if (!frontMatter.order) {
            throw new Error(`Missing order in frontmatter for ${file}`);
          }

          const lessonSlug = file.replace(".md", "");

          // Upsert lesson
          const { error: lessonError } = await supabase.from("lessons").upsert({
            id: frontMatter.id,
            slug: lessonSlug,
            chapter_id: chapterData.id || chapterDir,
            title: frontMatter.title,
            description: frontMatter.description,
            estimated_time: frontMatter.estimatedTime,
            order_sequence: frontMatter.order,
            xp_reward: frontMatter.xpReward,
            content_path: `/content/lessons/chapters/${chapterDir}/${file}`,
            status: "published",
          });

          if (lessonError) {
            throw new Error(
              `Error upserting lesson ${file}: ${lessonError.message}`
            );
          }

          // Upsert lesson content
          const { error: contentError } = await supabase
            .from("lesson_contents")
            .upsert({
              lesson_id: frontMatter.id,
              content: content,
              version: 1,
            });

          if (contentError) {
            throw new Error(
              `Error upserting lesson content ${file}: ${contentError.message}`
            );
          }

          console.log(`Successfully processed lesson: ${file}`);
        }

        // Update chapter with total lessons
        const { error: updateError } = await supabase
          .from("chapters")
          .update({ total_lessons: lessonFiles.length })
          .eq("id", chapterData.id || chapterDir);

        if (updateError) {
          throw new Error(
            `Error updating chapter lesson count: ${updateError.message}`
          );
        }
      } catch (error) {
        console.error(`Error processing chapter ${chapterDir}:`, error);
        throw error;
      }
    }

    console.log("Content sync completed successfully!");
  } catch (error) {
    console.error("Error during content sync:", error);
    process.exit(1);
  }
}

// Run the sync
syncContent();

import type { LessonFrontmatter } from "@/types/types";

export function validateAndParseLessonFrontmatter(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  frontMatter: any
): LessonFrontmatter {
  if (!frontMatter.id || typeof frontMatter.id !== "string") {
    throw new Error("Invalid or missing lesson id in frontmatter");
  }
  if (!frontMatter.title || typeof frontMatter.title !== "string") {
    throw new Error("Invalid or missing lesson title in frontmatter");
  }
  if (!frontMatter.description || typeof frontMatter.description !== "string") {
    throw new Error("Invalid or missing lesson description in frontmatter");
  }
  if (
    !frontMatter.estimatedTime ||
    typeof frontMatter.estimatedTime !== "number"
  ) {
    throw new Error("Invalid or missing estimatedTime in frontmatter");
  }
  if (typeof frontMatter.order !== "number") {
    throw new Error("Invalid or missing order in frontmatter");
  }
  if (!frontMatter.xpReward || typeof frontMatter.xpReward !== "number") {
    throw new Error("Invalid or missing xpReward in frontmatter");
  }

  return {
    id: frontMatter.id,
    title: frontMatter.title,
    description: frontMatter.description,
    estimatedTime: frontMatter.estimatedTime,
    order: frontMatter.order,
    xpReward: frontMatter.xpReward,
  };
}

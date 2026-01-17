import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export type RenderedContent = {
  html: string;
  frontmatter: Record<string, unknown>;
};

export async function renderProjectMdx(sourceFile: string): Promise<RenderedContent> {
  const abs = path.join(process.cwd(), "src", "content", "projects", sourceFile);
  const raw = await fs.readFile(abs, "utf8");

  const parsed = matter(raw);

  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(parsed.content);

  return {
    html: String(file),
    frontmatter: parsed.data as Record<string, unknown>,
  };
}

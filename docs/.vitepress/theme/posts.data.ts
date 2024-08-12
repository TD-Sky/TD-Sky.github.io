import { createContentLoader } from "vitepress";

interface Post {
  title: string;
  url: string;
  date: DateInfo;
  lastUpdated: DateInfo | undefined;
  category: string;
  tags: string[];
  excerpt: string | undefined;
}

interface DateInfo {
  time: number;
  string: string;
}

declare const data: Post[];
export { Post, data };

export default createContentLoader("posts/*.md", {
  excerpt: true,
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter, excerpt }) => {
        let lastUpdated: DateInfo | undefined;
        if (frontmatter.lastUpdated !== undefined) {
          lastUpdated = formatDate(frontmatter.lastUpdated);
        }

        return {
          title: frontmatter.title,
          url,
          excerpt,
          category: frontmatter.category,
          tags: frontmatter.tags,
          date: formatDate(frontmatter.date),
          lastUpdated,
        };
      })
      .sort((a, b) => b.date.time - a.date.time);
  },
});

function formatDate(raw: string): DateInfo {
  const date = new Date(raw);
  return {
    time: date.getTime(),
    string: date.toISOString().slice(0, 10),
  };
}

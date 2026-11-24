export interface Content {
  slug: string;
  title: string;
  category: string;
  description: string;
  minutes: number;
  level: string;
  version: string;
  updated: string;
  author: string;
  source: string;
  sourceLabel: string;
  keywords: string[];
  shortcuts?: string[];
  body: string;
}
const parse = (modules: Record<string, string>): Content[] =>
  Object.entries(modules).map(([path, raw]) => {
    const end = raw.indexOf("\n");
    return {
      ...JSON.parse(raw.slice(0, end)),
      slug: path.split("/").pop()!.replace(".md", ""),
      body: raw.slice(end + 1),
    } as Content;
  });
export const guides = parse(
  import.meta.glob("../content/guides/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
).sort((a, b) => a.title.localeCompare(b.title, "fr"));
export const articles = parse(
  import.meta.glob("../content/articles/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
);
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const ignored = new Set([
  "un",
  "une",
  "le",
  "la",
  "les",
  "de",
  "des",
  "du",
  "a",
  "au",
  "aux",
  "et",
  "en",
  "sur",
  "mon",
  "ma",
  "mes",
  "je",
  "veux",
  "comment",
  "faire",
  "dans",
  "pour",
]);
export function search<
  T extends Pick<Content, "title" | "description" | "keywords" | "category">,
>(items: T[], query: string): T[] {
  const tokens = normalize(query)
    .split(" ")
    .filter((t) => t && !ignored.has(t));
  if (!tokens.length) return items;
  return items
    .map((item) => {
      const title = normalize(item.title);
      const keywords = normalize(item.keywords.join(" "));
      const all = normalize(item.description + " " + item.category);
      const scores = tokens.map((t) =>
        title.includes(t)
          ? 5
          : keywords.includes(t)
            ? 4
            : all.includes(t)
              ? 1
              : 0,
      );
      return {
        item,
        score: scores.every((s) => s > 0)
          ? scores.reduce<number>((a, b) => a + b, 0)
          : 0,
      };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}

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
const aliases: Record<string, string> = {
  fichiers: "fichier",
  documents: "document",
  dossiers: "dossier",
  copier: "copie",
  dupliquer: "copie",
  duplication: "copie",
  copies: "copie",
  copié: "copie",
  deplacer: "deplace",
  transferer: "deplace",
  ranger: "dossier",
  classer: "tri",
  trier: "tri",
  filtrer: "filtre",
  filtres: "filtre",
  mails: "mail",
  email: "mail",
  emails: "mail",
  courriels: "mail",
  rediger: "redaction",
  ecrire: "redaction",
  agenda: "calendrier",
  reunion: "reunion",
  reunions: "reunion",
  rdv: "rendez",
  imprimer: "impression",
  captures: "capture",
};
const canonical = (s: string) =>
  aliases[s] || (s.length > 4 && s.endsWith("s") ? s.slice(0, -1) : s);
export function distance(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return 2;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const old = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      prev = old;
    }
  }
  return row[b.length];
}
const words = (s: string) =>
  normalize(s).split(" ").filter(Boolean).map(canonical);
export function search<
  T extends Pick<Content, "title" | "description" | "keywords" | "category">,
>(items: T[], query: string): T[] {
  if (!normalize(query)) return items;
  const tokens = words(query).filter(
    (t) =>
      !ignored.has(t) &&
      !new Set([
        "besoin",
        "souhaite",
        "voudrais",
        "peux",
        "puis",
        "moi",
        "avec",
        "est",
        "sont",
        "une",
        "j",
        "ai",
        "dois",
        "savoir",
        "pouvoir",
        "aide",
        "aider",
        "svp",
        "vous",
        "pouvez",
      ]).has(t),
  );
  if (!tokens.length) return [];
  return items
    .map((item) => {
      const title = words(item.title),
        keys = words(item.keywords.join(" ")),
        rest = words(item.description + " " + item.category);
      const scores = tokens.map((t) =>
        title.includes(t)
          ? 5
          : keys.includes(t)
            ? 4
            : rest.includes(t)
              ? 2
              : [...title, ...keys].some(
                    (w) =>
                      t.length >= 5 && w.length >= 5 && distance(t, w) <= 1,
                  )
                ? 1
                : 0,
      );
      return {
        item,
        score: scores.every(Boolean)
          ? scores.reduce<number>((a, b) => a + b, 0)
          : 0,
      };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}

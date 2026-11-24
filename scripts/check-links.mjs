import fs from "node:fs";
const urls = new Set();
for (const dir of ["src/content/guides", "src/content/articles"])
  for (const name of fs.readdirSync(dir)) {
    const raw = fs.readFileSync(`${dir}/${name}`, "utf8");
    urls.add(JSON.parse(raw.slice(0, raw.indexOf("\n"))).source);
  }
for (const m of fs
  .readFileSync("src/content/tools.ts", "utf8")
  .matchAll(/url:'(https[^']+)'/g))
  urls.add(m[1]);
const results = [];
const list = [...urls];
for (let i = 0; i < list.length; i += 4) {
  const batch = await Promise.all(
    list.slice(i, i + 4).map(async (url) => {
      try {
        const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
        await r.body?.cancel();
        return { url, status: r.status, finalUrl: r.url };
      } catch (e) {
        return { url, error: e.message };
      }
    }),
  );
  results.push(...batch);
}
fs.writeFileSync(
  "docs/qa/external-links.json",
  JSON.stringify({ date: new Date().toISOString(), results }, null, 2),
);
console.log(
  JSON.stringify(
    results.filter((r) => !r.status || r.status >= 400),
    null,
    2,
  ),
);
console.log(`${results.length} références contrôlées`);

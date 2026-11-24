import fs from "node:fs";
const report = JSON.parse(fs.readFileSync("docs/qa/benchmark.json", "utf8"));
const reference =
  "Bonjour la réunion commence à neuf heures nous préparons les documents pour demain";
const words = (text) =>
  text
    .normalize("NFC")
    .toLocaleLowerCase("fr")
    .match(/[\p{L}\p{N}]+/gu) || [];
function distance(a, b) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    const next = [i + 1];
    for (let j = 0; j < b.length; j++)
      next.push(
        Math.min(
          next.at(-1) + 1,
          row[j + 1] + 1,
          row[j] + (a[i] !== b[j] ? 1 : 0),
        ),
      );
    row = next;
  }
  return row.at(-1);
}
report.fixture =
  "Synthèse vocale Windows Hortense — 7,359 secondes, français, phrase non sensible.";
for (const run of report.runs) {
  const text = run.result.inference?.result?.text || "";
  run.quality = {
    reference,
    wordErrorRate:
      distance(words(reference), words(text)) / words(reference).length,
    interpretation:
      "Concordance sur cette seule phrase synthétique ; ne mesure pas la qualité en réunion réelle.",
  };
  run.decision = run.mode.includes("webgpu")
    ? "Exclu de l’interface : sortie incohérente et beaucoup plus lente."
    : "CPU retenu pour le pilote expérimental.";
}
fs.writeFileSync("docs/qa/benchmark.json", JSON.stringify(report, null, 2));
console.log(
  report.runs.map((r) => ({ mode: r.mode, wer: r.quality.wordErrorRate })),
);

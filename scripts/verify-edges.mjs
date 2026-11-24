import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs";
const report = { date: new Date().toISOString(), checks: [] };
const browser = await chromium.launch({
  executablePath:
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
try {
  let context = await browser.newContext();
  let page = await context.newPage();
  await page.addInitScript(() =>
    Object.defineProperty(window, "AudioContext", { value: undefined }),
  );
  await page.goto("http://127.0.0.1:4175/studio");
  await page.getByRole("checkbox").check();
  assert.equal(
    await page
      .getByRole("button", { name: "Charger le moteur local" })
      .isDisabled(),
    true,
  );
  assert.match(
    await page.getByRole("alert").innerText(),
    /fonctions locales requises/,
  );
  report.checks.push(
    "Navigateur sans AudioContext : message explicite et chargement désactivé",
  );
  await context.close();
  context = await browser.newContext({ serviceWorkers: "block" });
  page = await context.newPage();
  await page.route("https://huggingface.co/**", (r) => r.abort());
  await page.goto("http://127.0.0.1:4175/studio");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Charger le moteur local" }).click();
  await page.getByRole("alert").waitFor({ timeout: 45000 });
  assert.match(await page.getByRole("alert").innerText(), /Erreur du moteur/);
  assert.equal(
    await page.getByLabel("Transcription à relire et corriger").count(),
    0,
  );
  report.checks.push(
    "Téléchargement bloqué : erreur explicite, aucun résultat fabriqué",
  );
  await context.close();
  context = await browser.newContext();
  page = await context.newPage();
  const methods = [];
  page.on("request", (r) => methods.push(r.method()));
  await page.goto("http://127.0.0.1:4175/studio");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Charger le moteur local" }).click();
  await page.waitForFunction(
    () =>
      document
        .querySelector(".engine-status")
        ?.textContent?.includes("Moteur CPU prêt"),
    {},
    { timeout: 180000 },
  );
  await page.locator("#audio-file").setInputFiles({
    name: "corrompu.wav",
    mimeType: "audio/wav",
    buffer: Buffer.from("bad wav"),
  });
  await page
    .getByRole("button", { name: "Transcrire cet audio", exact: true })
    .click();
  await page.getByRole("alert").waitFor();
  assert.match(await page.getByRole("alert").innerText(), /Impossible de lire/);
  report.checks.push("Fichier au codec invalide : erreur, texte vide");
  await page.locator("#audio-file").setInputFiles(".runtime/test-long.wav");
  await page
    .getByRole("button", { name: "Transcrire cet audio", exact: true })
    .click();
  await page.waitForFunction(() =>
    document
      .querySelector(".engine-status")
      ?.textContent?.includes("Reconnaissance locale en cours"),
  );
  await page.getByRole("button", { name: "Annuler", exact: true }).click();
  await page.waitForTimeout(2000);
  assert.match(
    await page.locator(".engine-status").innerText(),
    /Opération annulée/,
  );
  assert.equal(
    await page.getByLabel("Transcription à relire et corriger").count(),
    0,
  );
  report.checks.push(
    "Audio de 73 secondes : annulation pendant reconnaissance, aucun résultat tardif",
  );
  await page.getByRole("button", { name: "Charger le moteur local" }).click();
  await page.waitForFunction(
    () =>
      document
        .querySelector(".engine-status")
        ?.textContent?.includes("Moteur CPU prêt"),
    {},
    { timeout: 180000 },
  );
  await page.locator("#audio-file").setInputFiles(".runtime/test-fr.wav");
  await page
    .getByRole("button", { name: "Transcrire cet audio", exact: true })
    .click();
  await page
    .getByLabel("Transcription à relire et corriger")
    .waitFor({ timeout: 60000 });
  assert.match(
    await page.getByLabel("Transcription à relire et corriger").inputValue(),
    /réunion/,
  );
  report.checks.push(
    "Après annulation : rechargement du moteur et nouvelle transcription réussis",
  );
  assert.equal(
    methods.some((m) => !["GET", "HEAD", "OPTIONS"].includes(m)),
    false,
  );
  report.checks.push("Aucun POST ni téléversement dans ces parcours");
  await context.close();
  fs.writeFileSync("docs/qa/edge-cases.json", JSON.stringify(report, null, 2));
  console.log(report);
} catch (e) {
  report.failure = e.stack;
  fs.writeFileSync("docs/qa/edge-cases.json", JSON.stringify(report, null, 2));
  throw e;
} finally {
  await browser.close();
}

import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
const report = {
  date: new Date().toISOString(),
  environment: "Edge / Windows, production localhost:4175",
  runs: [],
};
const browser = await chromium.launch({
  executablePath:
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
try {
  for (const mode of ["desktop", "mobile-emulation"]) {
    const context = await browser.newContext({
      ...(mode === "mobile-emulation"
        ? devices["Pixel 7"]
        : { viewport: { width: 1440, height: 1000 } }),
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage();
    const requests = [];
    const errors = [];
    const failed = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("request", (r) =>
      requests.push({
        method: r.method(),
        url: new URL(r.url()).origin + new URL(r.url()).pathname,
        bytes: r.postDataBuffer()?.length || 0,
      }),
    );
    page.on("requestfailed", (r) =>
      failed.push({
        url: new URL(r.url()).pathname,
        error: r.failure()?.errorText,
      }),
    );
    await page.goto("http://127.0.0.1:4175/");
    await page.waitForTimeout(1000);
    const home = await page.evaluate(() => ({
      navigation: performance.getEntriesByType("navigation").map((e) => ({
        domReady: e.domContentLoadedEventEnd,
        load: e.loadEventEnd,
        transfer: e.transferSize,
      })),
      resources: performance.getEntriesByType("resource").map((e) => ({
        name: new URL(e.name).pathname,
        transfer: e.transferSize,
        size: e.decodedBodySize,
        duration: e.duration,
      })),
    }));
    assert.equal(
      requests.some((r) => r.url.includes("huggingface.co")),
      false,
      "no model on home",
    );
    await page.screenshot({
      path: `docs/qa/viewport-${mode}.png`,
      scale: "css",
    });
    await page.goto("http://127.0.0.1:4175/studio");
    await page.locator("#audio-file").setInputFiles(".runtime/test-fr.wav");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Charger le moteur local" }).click();
    await page.waitForFunction(
      () =>
        document
          .querySelector(".engine-status")
          ?.textContent?.includes("Moteur CPU prêt") ||
        document.querySelector("[role=alert]"),
      {},
      { timeout: 240000 },
    );
    assert.equal(
      await page.getByRole("alert").count(),
      0,
      await page.locator("body").innerText(),
    );
    const load = await page.locator(".engine-status").innerText();
    await page
      .getByRole("button", { name: "Transcrire cet audio", exact: true })
      .click();
    await page
      .getByLabel("Transcription à relire et corriger")
      .waitFor({ timeout: 180000 });
    const output = await page
      .getByLabel("Transcription à relire et corriger")
      .inputValue();
    assert.match(output, /réunion/i);
    const status = await page.locator(".engine-status").innerText();
    const edited = output + "\nCorrection de test : validation humaine.";
    await page.getByLabel("Transcription à relire et corriger").fill(edited);
    await page.getByRole("searchbox").fill("réunion");
    assert.match(
      await page.getByRole("status").last().innerText(),
      /1 repères trouvés/,
    );
    const txtPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Exporter TXT" }).click();
    const txt = await txtPromise;
    await txt.saveAs(`.runtime/${mode}.txt`);
    assert.equal(fs.readFileSync(`.runtime/${mode}.txt`, "utf8"), edited);
    const docxPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Exporter DOCX" }).click();
    const docx = await docxPromise;
    await docx.saveAs(`.runtime/${mode}.docx`);
    assert.equal(
      fs.readFileSync(`.runtime/${mode}.docx`).subarray(0, 2).toString(),
      "PK",
    );
    await page.getByRole("button", { name: "Copier", exact: true }).click();
    assert.equal(
      (await page.evaluate(() => navigator.clipboard.readText())).replace(
        /\r\n/g,
        "\n",
      ),
      edited,
    );
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    assert.equal(axe.violations.length, 0, JSON.stringify(axe.violations));
    await page.getByRole("tab", { name: "Notes manuelles" }).click();
    await page
      .getByLabel("Votre compte rendu de travail")
      .fill("Notes manuelles — sans génération IA.");
    const notesPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Exporter TXT" }).click();
    const notes = await notesPromise;
    await notes.saveAs(`.runtime/${mode}-notes.txt`);
    assert.match(
      fs.readFileSync(`.runtime/${mode}-notes.txt`, "utf8"),
      /NOTES MANUELLES/,
    );
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Effacer la session" }).click();
    await page.getByRole("tab", { name: "Transcription", exact: true }).click();
    assert.equal(
      await page.getByLabel("Transcription à relire et corriger").count(),
      0,
    );
    assert.equal(
      requests.filter((r) => !["GET", "HEAD", "OPTIONS"].includes(r.method))
        .length,
      0,
      "no audio or transcript upload",
    );
    await page.goto("http://127.0.0.1:4175/guides/copier-un-fichier");
    await page.getByRole("checkbox").first().check();
    assert.match(
      await page.locator(".step-checklist [role=status]").innerText(),
      /1 étape sur/,
    );
    await page.locator("video").evaluate((v) => {
      v.load();
      return new Promise((res, rej) => {
        v.onloadeddata = () => res(true);
        v.onerror = () => rej(new Error("video failed"));
      });
    });
    const video = await page.locator("video").evaluate((v) => ({
      duration: v.duration,
      width: v.videoWidth,
      captions: v.textTracks.length,
    }));
    assert.ok(video.duration > 5);
    assert.equal(video.captions, 1);
    await page.goto("http://127.0.0.1:4175/");
    await page.evaluate(async () => await navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await context.setOffline(true);
    await page.goto("http://127.0.0.1:4175/guides");
    assert.equal(await page.locator(".content-card").count(), 17);
    await page.goto("http://127.0.0.1:4175/prompts");
    assert.equal(await page.locator(".prompt-card").count(), 20);
    const offline =
      "Guides et prompts chargés hors ligne après installation du service worker";
    await context.setOffline(false);
    const run = {
      mode,
      home,
      load,
      status,
      output,
      exports: { txtExact: true, docxZip: true, notesSeparated: true },
      video,
      offline,
      requests,
      failed,
      errors,
      uploads: requests.filter(
        (r) => !["GET", "HEAD", "OPTIONS"].includes(r.method),
      ),
    };
    report.runs.push(run);
    fs.writeFileSync(
      "docs/qa/production.json",
      JSON.stringify(report, null, 2),
    );
    console.log(
      mode,
      JSON.stringify({ load, status, video, offline, errors, failed }),
    );
    assert.deepEqual(errors, []);
    await context.close();
  }
} catch (e) {
  report.failure = e.stack;
  fs.writeFileSync("docs/qa/production.json", JSON.stringify(report, null, 2));
  throw e;
} finally {
  await browser.close();
}

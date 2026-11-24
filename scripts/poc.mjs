import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
const executablePath =
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const report = fs.existsSync("docs/transcription-poc.json")
  ? JSON.parse(fs.readFileSync("docs/transcription-poc.json", "utf8"))
  : {
      date: new Date().toISOString(),
      engine: "Transformers.js 3.8.1 / Xenova whisper-tiny q8",
      fixture:
        "Synthèse vocale Windows Hortense, phrase administrative non sensible",
      runs: [],
    };
const browser = await chromium.launch({ executablePath, headless: true });
try {
  for (const mode of (
    process.env.POC_MODES || "desktop,mobile-emulation"
  ).split(",")) {
    const context = await browser.newContext(
      mode === "desktop" ? {} : { ...devices["Pixel 7"] },
    );
    const page = await context.newPage();
    const events = [];
    const failures = [];
    page.on("request", (r) =>
      events.push({
        method: r.method(),
        url: new URL(r.url()).origin + new URL(r.url()).pathname,
        bytes: r.postDataBuffer()?.length || 0,
      }),
    );
    page.on("pageerror", (e) => failures.push(e.message));
    await page.goto(
      "http://127.0.0.1:5173/src/poc/index.html?device=" +
        (mode === "webgpu" ? "webgpu" : "wasm"),
    );
    const capability = await page.evaluate(async () => ({
      gpu: !!(navigator.gpu && (await navigator.gpu.requestAdapter())),
      cores: navigator.hardwareConcurrency,
      userAgent: navigator.userAgent,
    }));
    await page.waitForTimeout(1500);
    const start = Date.now();
    await page.locator("#load").click();
    let result;
    try {
      await page.waitForFunction(
        () => ["ready", "error"].includes(window.lastMessage?.type),
        {},
        { timeout: 240000 },
      );
      const load = await page.evaluate(() => window.lastMessage);
      if (load.type === "ready") {
        await page.locator("#audio").setInputFiles(".runtime/test-fr.wav");
        await page.locator("#run").click();
        await page.waitForFunction(
          () => ["result", "error"].includes(window.lastMessage?.type),
          {},
          { timeout: 180000 },
        );
        result = {
          loadMs: load.ms,
          output: await page.evaluate(() => window.lastMessage),
        };
      } else result = { load };
    } catch (e) {
      result = {
        error: e.message,
        screen: await page.locator("#result").innerText(),
      };
    }
    report.runs.push({
      mode,
      capability,
      totalMs: Date.now() - start,
      result,
      requests: events,
      failures,
      uploads: events.filter(
        (e) => !["GET", "HEAD", "OPTIONS"].includes(e.method),
      ),
    });
    fs.writeFileSync(
      "docs/transcription-poc.json",
      JSON.stringify(report, null, 2),
    );
    console.log(mode, JSON.stringify(result));
    await context.close();
  }
} finally {
  await browser.close();
}

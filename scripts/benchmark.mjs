import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
const report = {
  date: new Date().toISOString(),
  fixture:
    "Synthèse vocale Windows Hortense — 6,8 secondes environ, français, phrase non sensible. Aucun fichier professionnel.",
  engine:
    "Transformers.js 3.8.1 / Xenova whisper-tiny q8, revision 5332fcc35e32a33b86612b9a57a89be7906102b1",
  runs: [],
};
const path =
  "/assets/" +
  fs.readdirSync("dist/assets").find((n) => /^worker-.*\.js$/.test(n));
const browser = await chromium.launch({
  executablePath:
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
try {
  for (const mode of [
    "desktop-cpu",
    "mobile-emulation-cpu",
    "desktop-webgpu",
  ]) {
    const context = await browser.newContext(
      mode.includes("mobile") ? devices["Pixel 7"] : {},
    );
    const page = await context.newPage();
    const network = [];
    page.on("request", (r) =>
      network.push({
        method: r.method(),
        url: new URL(r.url()).origin + new URL(r.url()).pathname,
        bytes: r.postDataBuffer()?.length || 0,
      }),
    );
    await page.goto("http://127.0.0.1:4175/studio");
    const capability = await page.evaluate(async () => ({
      webgpu: !!(navigator.gpu && (await navigator.gpu.requestAdapter())),
      cores: navigator.hardwareConcurrency,
      userAgent: navigator.userAgent,
    }));
    const start = Date.now();
    let result;
    try {
      await page.evaluate(
        ({ path, device }) => {
          window.benchmarkWorker = new Worker(path, { type: "module" });
          window.lastBenchmark = null;
          window.benchmarkWorker.onmessage = ({ data }) => {
            window.lastBenchmark = data;
          };
          window.benchmarkWorker.onerror = (e) => {
            window.lastBenchmark = { type: "error", message: e.message };
          };
          window.benchmarkWorker.postMessage({ type: "load", device });
        },
        { path, device: mode.includes("webgpu") ? "webgpu" : "wasm" },
      );
      await page.waitForFunction(
        () => ["ready", "error"].includes(window.lastBenchmark?.type),
        {},
        { timeout: 120000 },
      );
      const load = await page.evaluate(() => window.lastBenchmark);
      if (load.type === "ready") {
        await page.evaluate(async (base64) => {
          const a = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
          const ac = new AudioContext();
          try {
            const decoded = await ac.decodeAudioData(a.buffer);
            const offline = new OfflineAudioContext(
              1,
              Math.ceil(decoded.duration * 16000),
              16000,
            );
            const s = offline.createBufferSource();
            s.buffer = decoded;
            s.connect(offline.destination);
            s.start();
            const rendered = await offline.startRendering();
            const audio = rendered.getChannelData(0);
            window.lastBenchmark = null;
            window.benchmarkWorker.postMessage({ type: "transcribe", audio }, [
              audio.buffer,
            ]);
          } finally {
            await ac.close();
          }
        }, fs.readFileSync(".runtime/test-fr.wav").toString("base64"));
        await page.waitForFunction(
          () => ["result", "error"].includes(window.lastBenchmark?.type),
          {},
          { timeout: 120000 },
        );
        result = {
          loadMs: load.ms,
          inference: await page.evaluate(() => window.lastBenchmark),
        };
      } else result = { load };
    } catch (e) {
      result = {
        error: e.message,
        last: await page.evaluate(() => window.lastBenchmark),
      };
    }
    await page.evaluate(() => window.benchmarkWorker?.terminate());
    report.runs.push({
      mode,
      capability,
      totalMs: Date.now() - start,
      result,
      network,
      uploads: network.filter(
        (r) => !["GET", "HEAD", "OPTIONS"].includes(r.method),
      ),
    });
    fs.writeFileSync("docs/qa/benchmark.json", JSON.stringify(report, null, 2));
    console.log(mode, JSON.stringify(result));
    await context.close();
  }
} finally {
  await browser.close();
}

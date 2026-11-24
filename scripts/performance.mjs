import { chromium } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch({
  executablePath:
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
const results = [];
try {
  for (const mode of ["desktop-local", "mobile-4g-emulation"]) {
    const context = await browser.newContext({
      viewport: mode.includes("mobile")
        ? { width: 390, height: 844 }
        : { width: 1440, height: 1000 },
      serviceWorkers: "block",
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    if (mode.includes("mobile")) {
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: 200000,
        uploadThroughput: 93750,
      });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    await page.addInitScript(() => {
      window.metrics = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.metrics.lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (!e.hadRecentInput) window.metrics.cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("http://127.0.0.1:4175/");
    await page.waitForTimeout(3000);
    const data = await page.evaluate(() => ({
      ...window.metrics,
      paint: performance
        .getEntriesByType("paint")
        .map((e) => ({ name: e.name, ms: e.startTime })),
      navigation: performance.getEntriesByType("navigation").map((e) => ({
        domReadyMs: e.domContentLoadedEventEnd,
        loadMs: e.loadEventEnd,
      })),
      bytes: performance
        .getEntriesByType("resource")
        .reduce((sum, r) => sum + r.transferSize, 0),
      modelRequests: performance
        .getEntriesByType("resource")
        .filter((r) => r.name.includes("huggingface.co")).length,
    }));
    results.push({
      mode,
      conditions: mode.includes("mobile")
        ? "150 ms RTT, 1.6 Mbit/s descendant, CPU ×4, cache navigateur et SW désactivés"
        : "Boucle locale sans bridage, SW désactivé",
      ...data,
    });
    console.log(mode, data);
    await context.close();
  }
} finally {
  await browser.close();
  fs.writeFileSync(
    "docs/qa/performance.json",
    JSON.stringify({ date: new Date().toISOString(), results }, null, 2),
  );
}

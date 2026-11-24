import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.e2e.ts",
  timeout: 90000,
  expect: { timeout: 8000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://127.0.0.1:4175",
    launchOptions: fs.existsSync(edge) ? { executablePath: edge } : {},
    trace: process.env.PW_TRACE ? "retain-on-failure" : "off",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-edge", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile-edge-emulation", use: { ...devices["Pixel 7"] } },
  ],
});

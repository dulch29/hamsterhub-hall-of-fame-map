import { defineConfig } from "@playwright/test";
const preview = process.env.TEST_PREVIEW === "1";
const baseURL = `http://127.0.0.1:${preview ? 4174 : 5174}`;
export default defineConfig({
  testDir: "./tests",
  timeout: 45000,
  // Software WebGL initialization is variable on this shared Windows host.
  // This is a readiness allowance, not the product's load-time performance gate.
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL,
    viewport: { width: 1440, height: 1100 },
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      args: ["--enable-unsafe-swiftshader"],
    },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: preview
      ? "npm run preview -- --port 4174 --strictPort"
      : "npm run dev -- --port 5174 --strictPort",
    url: baseURL,
    reuseExistingServer: false,
  },
});

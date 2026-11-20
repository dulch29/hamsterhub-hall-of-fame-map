import { defineConfig } from "@playwright/test";
import config from "./playwright.config";
export default defineConfig({
  ...config,
  use: { ...config.use, baseURL: "http://127.0.0.1:4174" },
  webServer: {
    command: `npm run preview -- --port 4174 --strictPort${process.env.PLAYWRIGHT_REVIEW_BUILD === "1" ? " --outDir .review-build" : ""}`,
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
  },
});

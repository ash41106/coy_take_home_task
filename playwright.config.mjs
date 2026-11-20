import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  timeout: 60000,
  use: { baseURL: process.env.BASE || "http://localhost:3000", ...devices["Pixel 7"], screenshot: "only-on-failure" },
  webServer: { command: "npm run build && npm run start", url: "http://localhost:3000", reuseExistingServer: true, timeout: 240000 },
});

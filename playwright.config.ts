import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "e2e.spec.ts",
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3456",
    trace: "off",
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: "npx next start -p 3456 -H 127.0.0.1",
    url: "http://127.0.0.1:3456",
    reuseExistingServer: false,
    timeout: 60000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

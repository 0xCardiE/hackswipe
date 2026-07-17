import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@playwright/test";
import {
  landingTestEnv,
  landingUrl,
  licenseServerTestEnv,
  licenseServerUrl,
  repoRoot,
} from "./lib/env.js";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const useExternalServers = Boolean(process.env.E2E_EXTERNAL_SERVERS);

const webServers = [
  {
    command: "npm run dev",
    cwd: path.join(repoRoot, "license-server"),
    url: `${licenseServerUrl}/health`,
    reuseExistingServer: true,
    timeout: 120000,
    env: licenseServerTestEnv(),
  },
  {
    command: `npx next dev --port ${process.env.E2E_LANDING_PORT ?? "3001"}`,
    cwd: path.join(repoRoot, "landing"),
    url: landingUrl,
    reuseExistingServer: true,
    timeout: 180000,
    env: landingTestEnv(),
  },
];

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 120000,
  expect: { timeout: 30000 },
  reporter: process.env.CI ? "github" : "list",
  globalSetup: path.join(configDir, "global-setup.ts"),
  use: {
    baseURL: landingUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: useExternalServers ? undefined : webServers,
});

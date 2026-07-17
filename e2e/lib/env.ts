import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const e2eDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.join(e2eDir, "..");

dotenv.config({ path: path.join(e2eDir, ".env") });

// Pull Stripe test keys from landing dev env only — do not inherit LICENSE_SERVER_URL
// (dev default 3847 would break isolated E2E servers on 13847).
const landingEnvPath = path.join(repoRoot, "landing/.env");
if (fs.existsSync(landingEnvPath)) {
  const landingEnv = dotenv.parse(fs.readFileSync(landingEnvPath));
  for (const key of ["STRIPE_SECRET_KEY", "STRIPE_PRICE_ID"] as const) {
    if (landingEnv[key] && !process.env[key]) {
      process.env[key] = landingEnv[key];
    }
  }
}

export const e2eRootDir = e2eDir;
export { repoRoot };

const licenseServerPort = process.env.E2E_LICENSE_SERVER_PORT ?? "13847";
const landingPort = process.env.E2E_LANDING_PORT ?? "3001";

export const landingUrl = (
  process.env.LANDING_URL ?? `http://localhost:${landingPort}`
).replace(/\/$/, "");
export const licenseServerUrl = (
  process.env.LICENSE_SERVER_URL ?? `http://127.0.0.1:${licenseServerPort}`
).replace(/\/$/, "");

export const adminApiKey =
  process.env.E2E_ADMIN_KEY ?? "e2e-test-admin-key-not-for-production";

export const webhookSecret =
  process.env.E2E_WEBHOOK_SECRET ?? "whsec_e2e_test_signing_secret_32chars";

export const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
export const stripePriceId = process.env.STRIPE_PRICE_ID;

export const isStripeCheckoutConfigured = Boolean(stripeSecretKey && stripePriceId);

export const testDatabasePath = path.join(e2eDir, ".data", "licenses-e2e.db");

export function landingTestEnv(): Record<string, string> {
  return {
    NEXT_PUBLIC_APP_URL: landingUrl,
    LICENSE_SERVER_URL: licenseServerUrl,
    LICENSE_SERVER_ADMIN_KEY: adminApiKey,
    STRIPE_WEBHOOK_SECRET: webhookSecret,
    EMAIL_PROVIDER: "log",
    ...(stripeSecretKey ? { STRIPE_SECRET_KEY: stripeSecretKey } : {}),
    ...(stripePriceId ? { STRIPE_PRICE_ID: stripePriceId } : {}),
  };
}

export function licenseServerTestEnv(): Record<string, string> {
  return {
    PORT: licenseServerPort,
    DATABASE_PATH: testDatabasePath,
    ADMIN_API_KEY: adminApiKey,
    NODE_ENV: "test",
  };
}

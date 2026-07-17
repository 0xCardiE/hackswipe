import { expect, test } from "@playwright/test";
import { isStripeCheckoutConfigured } from "../lib/env.js";
import {
  findLicenseByEmail,
  licenseKeyPattern,
  listLicenses,
} from "../lib/license-server.js";
import { completeStripeCheckout } from "../lib/stripe-checkout.js";

test.describe("Checkout smoke", () => {
  test.skip(
    !isStripeCheckoutConfigured,
    "Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in e2e/.env (or landing/.env)"
  );

  test("pricing → Stripe Checkout → success page shows license key", async ({ page }) => {
    test.setTimeout(180000);
    const email = `checkout-e2e+${Date.now()}@example.com`;

    await page.goto("/pricing");
    await page.getByRole("button", { name: /Buy Pro/i }).click();

    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 });

    await completeStripeCheckout(page, email);

    await page.waitForURL(/\/purchase\/success/, { timeout: 90000 });

    await expect(page.getByText("Payment successful")).toBeVisible({ timeout: 30000 });

    const licenseCode = page.locator("code").filter({ hasText: licenseKeyPattern });
    await expect(licenseCode).toBeVisible({ timeout: 30000 });

    const licenseKey = (await licenseCode.textContent())?.trim();
    expect(licenseKey).toMatch(licenseKeyPattern);

    const licenses = await listLicenses();
    const license = findLicenseByEmail(licenses, email);
    expect(license?.license_key).toBe(licenseKey);
  });
});

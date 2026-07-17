import { expect, test } from "@playwright/test";
import {
  findLicenseByEmail,
  findLicenseBySession,
  licenseKeyPattern,
  listLicenses,
} from "../lib/license-server.js";
import { buildCheckoutCompletedEvent, postSignedWebhook } from "../lib/stripe-fixture.js";

test.describe("Stripe webhook", () => {
  test("checkout.session.completed creates license and is idempotent", async () => {
    const email = `webhook-e2e+${Date.now()}@example.com`;
    const sessionId = `cs_test_e2e_${Date.now()}`;
    const event = buildCheckoutCompletedEvent({ sessionId, email });

    const firstResponse = await postSignedWebhook(event);
    expect(firstResponse.status).toBe(200);

    const firstBody = (await firstResponse.json()) as { received?: boolean; licenseId?: number };
    expect(firstBody.received).toBe(true);
    expect(firstBody.licenseId).toBeGreaterThan(0);

    const licensesAfterFirst = await listLicenses();
    const license = findLicenseBySession(licensesAfterFirst, sessionId);

    expect(license).toBeDefined();
    expect(license?.email).toBe(email);
    expect(license?.license_key).toMatch(licenseKeyPattern);
    expect(license?.notes).toContain(`stripe:${sessionId}`);

    const secondResponse = await postSignedWebhook(event);
    expect(secondResponse.status).toBe(200);

    const licensesAfterSecond = await listLicenses();
    const matchesForEmail = licensesAfterSecond.filter(
      (row) => row.email.toLowerCase() === email.toLowerCase()
    );

    expect(matchesForEmail).toHaveLength(1);
    expect(findLicenseByEmail(licensesAfterSecond, email)?.license_key).toBe(license?.license_key);
  });

  test("rejects requests with invalid signature", async () => {
    const { landingUrl } = await import("../lib/env.js");
    const event = buildCheckoutCompletedEvent({
      sessionId: `cs_test_bad_${Date.now()}`,
      email: `bad-sig+${Date.now()}@example.com`,
    });
    const payload = JSON.stringify(event);

    const response = await fetch(`${landingUrl}/api/webhooks/stripe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": "t=0,v1=invalid",
      },
      body: payload,
    });

    expect(response.status).toBe(400);
  });
});

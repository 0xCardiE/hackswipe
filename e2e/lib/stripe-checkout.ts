import type { Page } from "@playwright/test";

const TEST_CARD = "4242 4242 4242 4242";

/**
 * Completes Stripe Hosted Checkout with a test card.
 * Selectors may need updates if Stripe changes their checkout UI.
 */
export async function completeStripeCheckout(page: Page, email: string): Promise<void> {
  await page.waitForLoadState("domcontentloaded");

  await page.getByLabel("Email").fill(email);
  await selectCardPaymentMethod(page);

  await page.getByRole("textbox", { name: "Card number" }).fill(TEST_CARD);
  await page.getByRole("textbox", { name: "Expiration" }).fill("12 / 34");
  await page.getByRole("textbox", { name: "CVC" }).fill("123");
  await page.getByRole("textbox", { name: "Cardholder name" }).fill("E2E Test User");

  const submit = page.getByTestId("hosted-payment-submit-button");
  if (await submit.isVisible({ timeout: 2000 }).catch(() => false)) {
    await submit.click();
    return;
  }

  await page.getByRole("button", { name: /^pay$/i }).last().click();
}

async function selectCardPaymentMethod(page: Page): Promise<void> {
  const cardAccordion = page.getByTestId("card-accordion-item-button");
  if (await cardAccordion.isVisible({ timeout: 10000 }).catch(() => false)) {
    await cardAccordion.click();
  } else {
    await page.getByRole("radio", { name: "Card" }).click({ force: true });
  }

  await page.getByRole("textbox", { name: "Card number" }).waitFor({ state: "visible", timeout: 20000 });
}

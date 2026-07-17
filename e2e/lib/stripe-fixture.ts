import Stripe from "stripe";
import { webhookSecret } from "./env.js";

export function signWebhookPayload(payload: string): string {
  return Stripe.webhooks.generateTestHeaderString({
    payload,
    secret: webhookSecret,
  });
}

export function buildCheckoutCompletedEvent(input: {
  sessionId: string;
  email: string;
}): Stripe.Event {
  const now = Math.floor(Date.now() / 1000);

  return {
    id: `evt_e2e_${now}`,
    object: "event",
    api_version: "2020-08-27",
    created: now,
    livemode: false,
    pending_webhooks: 1,
    request: { id: `req_e2e_${now}`, idempotency_key: null },
    type: "checkout.session.completed",
    data: {
      object: {
        id: input.sessionId,
        object: "checkout.session",
        payment_status: "paid",
        customer_details: { email: input.email },
        customer_email: input.email,
        metadata: { product: "hackswipe-lifetime" },
      } as Stripe.Checkout.Session,
    },
  };
}

export async function postSignedWebhook(event: Stripe.Event): Promise<Response> {
  const { landingUrl } = await import("./env.js");
  const payload = JSON.stringify(event);
  const signature = signWebhookPayload(payload);

  return fetch(`${landingUrl}/api/webhooks/stripe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": signature,
    },
    body: payload,
  });
}

import Stripe from "stripe";
import { env, isStripeConfigured } from "./env";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID.");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });
  }
  return stripeClient;
}

export async function createCheckoutSession(): Promise<{ url: string; sessionId: string }> {
  const stripe = getStripe();
  const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/purchase/cancel`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    customer_creation: "always",
    metadata: {
      product: "hackswipe-lifetime",
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  return { url: session.url, sessionId: session.id };
}

export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });
}

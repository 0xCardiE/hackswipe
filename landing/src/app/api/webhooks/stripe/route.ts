import { NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillPurchase } from "@/lib/fulfillment";
import { env, isLicenseServerConfigured, isStripeConfigured } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  if (!isStripeConfigured() || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("[webhook] signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, skipped: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, skipped: "not_paid" });
  }

  const email =
    session.customer_details?.email ||
    session.customer_email ||
    (typeof session.metadata?.email === "string" ? session.metadata.email : null);

  if (!email) {
    console.error("[webhook] paid session without email:", session.id);
    return NextResponse.json({ error: "Missing customer email" }, { status: 422 });
  }

  if (!isLicenseServerConfigured()) {
    console.error("[webhook] license server not configured for session:", session.id);
    return NextResponse.json({ error: "License server not configured" }, { status: 503 });
  }

  try {
    const result = await fulfillPurchase({
      email,
      sessionId: session.id,
      sendEmail: true,
    });

    console.log("[webhook] fulfilled", session.id, result.license.email, {
      created: result.created,
      emailed: result.emailed,
    });

    return NextResponse.json({ received: true, licenseId: result.license.id });
  } catch (error) {
    console.error("[webhook] fulfillment failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fulfillment failed" },
      { status: 500 }
    );
  }
}

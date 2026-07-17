import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/env";

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID." },
      { status: 503 }
    );
  }

  try {
    const session = await createCheckoutSession();
    return NextResponse.json(session);
  } catch (error) {
    console.error("[checkout]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    );
  }
}

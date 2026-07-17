import { NextResponse } from "next/server";
import { fulfillPurchase } from "@/lib/fulfillment";
import { isLicenseServerConfigured, isStripeConfigured } from "@/lib/env";
import { getCheckoutSession } from "@/lib/stripe";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const session = await getCheckoutSession(sessionId);
    const paid = session.payment_status === "paid";

    if (!paid) {
      return NextResponse.json({
        ok: false,
        paid: false,
        status: session.payment_status,
      });
    }

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      (typeof session.metadata?.email === "string" ? session.metadata.email : null);

    if (!email) {
      return NextResponse.json({ ok: false, paid: true, error: "missing_email" }, { status: 422 });
    }

    if (!isLicenseServerConfigured()) {
      return NextResponse.json({
        ok: true,
        paid: true,
        email,
        licenseKey: null,
        message: "Payment received. License will be emailed shortly.",
      });
    }

    const result = await fulfillPurchase({
      email,
      sessionId,
      sendEmail: true, // emails only when license is newly created (webhook may not have run yet)
    });

    return NextResponse.json({
      ok: true,
      paid: true,
      email: result.license.email,
      licenseKey: result.license.license_key,
      created: result.created,
      emailed: result.emailed,
      emailProvider: process.env.EMAIL_PROVIDER || "log",
    });
  } catch (error) {
    console.error("[verify]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 }
    );
  }
}

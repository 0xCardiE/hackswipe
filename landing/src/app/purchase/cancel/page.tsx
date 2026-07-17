import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Checkout Canceled",
  description: "Your HackSwipe checkout was canceled. No charge was made.",
  path: "/purchase/cancel",
  noIndex: true,
});

export default function PurchaseCancelPage() {
  return (
    <section className="relative z-10 mx-auto max-w-2xl px-5 py-20">
      <div className="card p-8 md:p-10 text-center">
        <h1 className="section-title mb-3">Checkout canceled</h1>
        <p className="section-lead mx-auto mb-8">
          No charge was made. You can still use the free trial or come back when you are ready for Lifetime.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/pricing" className="btn-primary">
            View pricing
          </Link>
          <Link href="/" className="btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}

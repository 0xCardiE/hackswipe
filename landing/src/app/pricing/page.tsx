import type { Metadata } from "next";
import Link from "next/link";
import { AddToChromeLink } from "@/components/add-to-chrome-link";
import { BrandName } from "@/components/brand-name";
import { BuyButton } from "@/components/buy-button";
import { ComparisonTable } from "@/components/comparison-table";
import { PriceDisplay } from "@/components/price-display";
import { competitors, oneTimePitch } from "@/config/comparison";
import { platformsShort, product } from "@/config/product";
import { isStripeConfigured } from "@/lib/env";
import { pricing } from "@/lib/pricing";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Pricing: Free trial & Lifetime, one-time payment",
  description: `HackSwipe Lifetime is ${pricing.saleDisplay} once (${pricing.launchOfferLabel.toLowerCase()}), after a ${product.freeTrialDays}-day free trial. Auto-swipe ${platformsShort} with no subscription. Compare vs Auto Swiper and Matched.`,
  path: "/pricing",
});

const freeFeatures = [
  `${product.freeTrialDays}-day free trial`,
  "Filters: age, distance, photos, keywords",
  "Human-like swipe delays",
  "Session stats (swipes, matches, time saved)",
  "No credit card required to install",
] as const;

const proFeatures = [
  "Unlimited auto-swipe on this browser",
  "Everything in the free trial",
  `One-time ${pricing.saleDisplay} (${pricing.launchOfferLabel.toLowerCase()}), no subscription`,
  "No monthly renewal or run quotas",
  "One license per browser install · free updates included",
] as const;

export default function PricingPage() {
  const checkoutReady = isStripeConfigured();

  return (
    <>
      <section className="relative z-10 mx-auto max-w-5xl px-5 py-16 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="section-title mb-3">Pay once. Not every month.</h1>
          <p className="section-lead mx-auto">
            Start with a {product.freeTrialDays}-day free trial. Upgrade to Lifetime for unlimited {platformsShort} auto-swipe:
            one payment instead of the $5 to $18 a month competitors charge for the same feature.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="card flex flex-col p-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Free trial</p>
            <p className="mb-1 text-5xl font-bold">$0</p>
            <p className="mb-6 text-[var(--muted)]">
              Try <BrandName /> for {product.freeTrialDays} days
            </p>
            <ul className="mb-8 flex-1 space-y-3 text-left text-sm text-[var(--muted)]">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="text-[var(--accent)]">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <AddToChromeLink className="btn-secondary w-full text-center">
              Add to Chrome (free trial)
            </AddToChromeLink>
          </article>

          <article className="card flex flex-col border-[rgba(255,45,85,0.35)] p-8 ring-1 ring-[rgba(255,45,85,0.15)]">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">Lifetime · one-time</p>
            <PriceDisplay className="mb-1" />
            <p className="mb-6 text-[var(--muted)]">
              Unlimited auto-swipe on one browser. Comparable tools cost $60 to $180+ per year in subscriptions.
            </p>
            <ul className="mb-8 flex-1 space-y-3 text-left text-sm text-[var(--muted)]">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="text-[var(--accent)]">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {checkoutReady ? (
              <BuyButton label={`Buy Lifetime: ${pricing.saleDisplay} once`} className="w-full" />
            ) : (
              <p className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--muted)]">
                Checkout is being configured. Try the free trial in Chrome while we finish setup, or read the{" "}
                <Link href="/faq" className="text-[var(--accent)] hover:underline">
                  FAQ
                </Link>
                .
              </p>
            )}
          </article>
        </div>

        <div className="mx-auto mt-10 max-w-2xl text-center text-sm text-[var(--muted)]">
          <p className="mb-2">
            Auto-swipe works on {platformsShort} web (tinder.com) only. Your filters and session data stay in your
            browser.
          </p>
          <p>
            Questions? Read the{" "}
            <Link href="/faq" className="text-[var(--accent)] hover:underline">
              FAQ
            </Link>{" "}
            or{" "}
            <Link href="/refund-policy" className="text-[var(--accent)] hover:underline">
              refund policy
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="section-title mb-3">How we compare</h2>
          <p className="section-lead">{oneTimePitch.body}</p>
        </div>
        <ComparisonTable showCostOverTime />
        <p className="mt-6 text-xs text-[var(--muted)]">{oneTimePitch.footnote}</p>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Detailed write-ups:{" "}
          <Link href={competitors.autoSwiper.comparePath} className="text-[var(--accent)] hover:underline">
            vs Auto Swiper
          </Link>
          {" · "}
          <Link href={competitors.swipeMate.comparePath} className="text-[var(--accent)] hover:underline">
            vs SwipeMate
          </Link>
          {" · "}
          <Link href={competitors.matchedAutoSwiper.comparePath} className="text-[var(--accent)] hover:underline">
            vs Matched
          </Link>
          {" · "}
          <Link href="/compare" className="text-[var(--accent)] hover:underline">
            all comparisons
          </Link>
        </p>
      </section>
    </>
  );
}

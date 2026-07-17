import type { Metadata } from "next";
import Link from "next/link";
import { AddToChromeLink } from "@/components/add-to-chrome-link";
import { AppLogo } from "@/components/app-logo";
import { BrandName } from "@/components/brand-name";
import { BuyButton } from "@/components/buy-button";
import { ComparisonTable } from "@/components/comparison-table";
import { JsonLd } from "@/components/json-ld";
import { PriceDisplay } from "@/components/price-display";
import { ExtensionPreview } from "@/components/extension-preview";
import { competitors, oneTimePitch } from "@/config/comparison";
import { goodFitItems, notFitItems, problemItems } from "@/config/homepage";
import { platformsShort, product } from "@/config/product";
import { isStripeConfigured } from "@/lib/env";
import { pricing } from "@/lib/pricing";
import { createHomeMetadata, homePageJsonLd } from "@/lib/seo";

export const metadata: Metadata = createHomeMetadata();

export default function HomePage() {
  const checkoutReady = isStripeConfigured();

  return (
    <>
      <JsonLd data={homePageJsonLd()} />

      {/* HERO — brand-first, one composition */}
      <section className="relative z-10 overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24">
          <div>
            <p className="hero-brand mb-6">
              Hack<span className="slash">Swipe</span>
            </p>
            <h1 className="font-display mb-5 max-w-xl text-2xl font-bold leading-snug tracking-tight text-[var(--ink)] md:text-3xl lg:text-[2.15rem]">
              Tinder isn&apos;t in the matching business.
              <span className="text-[var(--accent)]"> They&apos;re in the billing business.</span>
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-[var(--muted)]">
              Auto-swipe with your filters. When someone likes you back, you choose.
              Skip Gold. Skip Boosts. Get the result.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <AddToChromeLink className="btn-primary">
                Start {product.freeTrialDays}-day free trial
              </AddToChromeLink>
              <Link href="/pricing" className="btn-secondary">
                Lifetime {pricing.saleDisplay}
              </Link>
            </div>
            <p className="mt-5 text-sm text-[var(--muted)]">
              Chrome extension · {platformsShort} web only · Pay once, keep updates
            </p>
          </div>

          <ExtensionPreview />
        </div>
      </section>

      {/* PROBLEM — story */}
      <section className="relative z-10 border-y border-[var(--surface-border)] bg-[var(--surface)]/70 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
            The con
          </p>
          <h2 className="manifesto mb-6 max-w-3xl">
            Every Boost, every Super Like, every Gold paywall exists because manual swiping feels hopeless.
          </h2>
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            You&apos;re not bad at dating. You&apos;re being sold impatience.{" "}
            <BrandName /> flips the script: filters do the screening, you only show up for mutual interest.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {problemItems.map((item) => (
              <article
                key={item.title}
                className="border-l-2 border-[var(--accent)] bg-[var(--bg)] px-5 py-5"
              >
                <h3 className="font-display mb-2 text-lg font-bold tracking-tight">{item.title}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
            How it works
          </p>
          <h2 className="section-title mb-3">Three moves. Then you&apos;re done swiping.</h2>
          <p className="section-lead">
            Install, set the bar once, let the session run while you do literally anything else.
          </p>
        </div>
        <div className="step-rail grid gap-6 md:grid-cols-3">
          {product.steps.map((step) => (
            <article key={step.step} className="relative pl-12 md:pl-0">
              <span className="font-display absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-lg font-bold text-white md:relative md:mb-5">
                {step.step}
              </span>
              <h3 className="font-display mb-2 text-xl font-bold tracking-tight">{step.title}</h3>
              <p className="text-[var(--muted)] leading-relaxed">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 bg-[var(--ink)] py-16 text-white md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#ff6b8a]">
              What you get
            </p>
            <h2 className="font-display mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              Smart enough to skip the noise. Dumb enough to leave the choice to you.
            </h2>
            <p className="text-lg leading-relaxed text-white/55">
              Filters, human-like delays, session stats, and lifetime updates when Tinder moves its buttons again.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <h3 className="font-display mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-white/55">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="section-title mb-3">Built for one job</h2>
          <p className="section-lead">
            Auto-swipe {platformsShort} on Chrome. Nothing else.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="card p-8">
            <h3 className="font-display mb-4 text-lg font-bold">You&apos;ll love it if</h3>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              {goodFitItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="font-semibold text-[var(--ok)]">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="card p-8">
            <h3 className="font-display mb-4 text-lg font-bold">Skip it if</h3>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              {notFitItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-[var(--muted)]">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* PRICING PUNCH */}
      <section id="pricing" className="relative z-10 mx-auto max-w-6xl px-5 py-8 md:py-12">
        <div className="overflow-hidden rounded-[1.75rem] bg-[var(--accent)] px-6 py-10 text-white md:px-12 md:py-14">
          <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-white/75">
                Simple pricing
              </p>
              <h2 className="font-display mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                {product.freeTrialDays} days free. Then {pricing.saleDisplay} once. Forever.
              </h2>
              <p className="mb-6 max-w-xl text-lg leading-relaxed text-white/85">
                No monthly Gold. No subscription auto-swiper bill. One payment unlocks lifetime access and updates.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <AddToChromeLink className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[var(--accent)] shadow-lg transition hover:bg-white/95">
                  Start free trial
                </AddToChromeLink>
                {checkoutReady ? (
                  <BuyButton
                    label={`Buy Lifetime · ${pricing.saleDisplay}`}
                    className="!bg-[var(--ink)] !shadow-none hover:!bg-black"
                  />
                ) : (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    See pricing details
                  </Link>
                )}
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--ink)]/25 p-6 backdrop-blur-sm">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/70">
                Lifetime · one-time
              </p>
              <PriceDisplay className="mb-3 text-white [&_*]:text-white" />
              <p className="text-sm leading-relaxed text-white/75">
                Unlimited auto-swipe on one browser. Filters, delays, stats, and free updates for the life of the
                license.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section id="compare" className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
            Why one-time wins
          </p>
          <h2 className="section-title mb-3">{oneTimePitch.headline}</h2>
          <p className="section-lead">{oneTimePitch.body}</p>
        </div>
        <ComparisonTable />
        <p className="mt-6 text-xs text-[var(--muted)]">{oneTimePitch.footnote}</p>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Full write-ups:{" "}
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

      {/* FINAL CTA + MANIFESTO FOOTER MOMENT */}
      <section id="get-started" className="relative z-10 mx-auto max-w-6xl px-5 pb-20">
        <div className="card overflow-hidden">
          <div className="grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-10">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <AppLogo size={48} />
                <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                  Stop funding the paywall
                </h2>
              </div>
              <p className="section-lead mb-5">
                {product.freeTrialDays}-day free trial on {platformsShort}. Lifetime is {pricing.saleDisplay} once.
              </p>
              <ul className="mb-6 space-y-2 text-sm text-[var(--muted)]">
                <li>Works in Chrome on desktop · runs on tinder.com</li>
                <li>Filters and stats stay in your browser</li>
                <li>
                  Questions?{" "}
                  <Link href="/faq" className="text-[var(--accent)] hover:underline">
                    FAQ
                  </Link>{" "}
                  ·{" "}
                  <Link href="/refund-policy" className="text-[var(--accent)] hover:underline">
                    Refund policy
                  </Link>
                </li>
              </ul>
              <div className="flex flex-wrap items-center gap-3">
                <AddToChromeLink className="btn-primary">Add to Chrome — free trial</AddToChromeLink>
                {checkoutReady ? (
                  <BuyButton label={`Buy Lifetime: ${pricing.saleDisplay}`} />
                ) : (
                  <Link href="/pricing" className="btn-secondary">
                    View pricing
                  </Link>
                )}
              </div>
            </div>
            <blockquote className="rounded-2xl border border-[rgba(255,45,85,0.2)] bg-[rgba(255,45,85,0.05)] p-6">
              <p className="font-display text-xl font-bold leading-snug tracking-tight text-[var(--ink)]">
                &ldquo;Match people? Cute story. Charge people who are lonely and busy? That&apos;s the product.&rdquo;
              </p>
              <p className="mt-4 text-sm text-[var(--muted)]">
                — Why <BrandName /> exists
              </p>
            </blockquote>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-[var(--muted)]">
          Not affiliated with Tinder or Match Group. Automation may violate Tinder&apos;s terms — use at your own risk.
        </p>
      </section>
    </>
  );
}

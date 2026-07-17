import type { Metadata } from "next";
import Link from "next/link";
import { BrandName } from "@/components/brand-name";
import { JsonLd } from "@/components/json-ld";
import { comparePages } from "@/config/compare-pages";
import { competitors } from "@/config/comparison";
import { product } from "@/config/product";
import { breadcrumbJsonLd, createMetadata, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Compare HackSwipe to Other Tinder Auto-Swipers",
  description:
    "See how HackSwipe compares to Auto Swiper, SwipeMate, and Matched: filters, human-like delays, and one-time pricing vs subscriptions.",
  path: "/compare",
  keywords: [
    "HackSwipe comparison",
    "Auto Swiper alternative",
    "SwipeMate alternative",
    "Matched auto swiper alternative",
    "Tinder auto swiper alternatives",
    "Tinder auto swiper comparison",
    "one-time Tinder auto swiper license",
  ],
});

const compareBreadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Compare", path: "/compare" },
]);

const compareList = itemListJsonLd(
  comparePages.map((page) => ({
    name: page.title,
    path: `/compare/${page.slug}`,
    description: page.description,
  })),
);

export default function CompareIndexPage() {
  return (
    <>
      <JsonLd data={[compareBreadcrumb, compareList]} />
      <section className="relative z-10 mx-auto max-w-3xl px-5 py-16 md:py-20">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Compare</p>
          <h1 className="section-title mb-3">
            How <BrandName /> compares
          </h1>
          <p className="section-lead">
            {product.name} is a one-time license for unlimited Tinder auto-swipe. These pages explain what you get here
            versus other Tinder auto-swipers: Auto Swiper, SwipeMate, and Matched.
          </p>
        </div>

        <div className="card mb-8 border-[rgba(255,45,85,0.25)] bg-[var(--surface-muted)] p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Quick answer</p>
          <p className="text-[var(--text)] leading-relaxed">
            Auto Swiper and Matched charge $5 to $18 per month to keep auto-swipe unlocked. SwipeMate sells a one-time
            license like {product.proName} does, but doesn't publish its price up front. {product.proName} is a single,
            published payment with filters, human-like delays, and session stats, and no monthly run quota.
          </p>
        </div>

        <ul className="card divide-y divide-[rgba(94,234,212,0.12)] p-2">
          {comparePages.map((page) => {
            const competitor = competitors[page.competitorId];
            return (
              <li key={page.slug}>
                <Link
                  href={`/compare/${page.slug}`}
                  className="block rounded-lg px-6 py-5 transition hover:bg-[rgba(94,234,212,0.04)]"
                >
                  <h2 className="mb-1 text-lg font-semibold text-[var(--text)]">{page.title}</h2>
                  <p className="mb-2 text-sm leading-relaxed text-[var(--muted)]">{page.description}</p>
                  <p className="text-xs text-[var(--muted)]">
                    vs{" "}
                    <span className="text-[var(--text)]">{competitor.name}</span>
                    {" · "}
                    {competitor.billing}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-sm text-[var(--muted)]">
          Also see{" "}
          <Link href="/guides" className="text-[var(--accent)] hover:underline">
            Guides
          </Link>
          {" · "}
          <Link href="/pricing" className="text-[var(--accent)] hover:underline">
            Pricing
          </Link>
          {" · "}
          <Link href="/faq" className="text-[var(--accent)] hover:underline">
            FAQ
          </Link>
          {" · "}
          <Link href="/#compare" className="text-[var(--accent)] hover:underline">
            Homepage comparison table
          </Link>
        </p>
      </section>
    </>
  );
}

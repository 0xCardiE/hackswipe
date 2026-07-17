import Link from "next/link";
import { AddToChromeLink } from "@/components/add-to-chrome-link";
import { BrandName } from "@/components/brand-name";
import { ComparisonTable, CompareTwoColumnTable } from "@/components/comparison-table";
import { competitors, oneTimePitch } from "@/config/comparison";
import type { ComparePage } from "@/config/compare-pages";
import { product } from "@/config/product";
import { pricing } from "@/lib/pricing";

type ComparePageDocumentProps = {
  page: ComparePage;
  relatedLinks?: { href: string; label: string }[];
};

function OfferList({ title, items, accent }: { title: string; items: readonly string[]; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-6 ${accent ? "border-[rgba(255,45,85,0.35)] bg-[rgba(255,45,85,0.04)]" : "border-[var(--surface-border)] bg-[var(--surface-muted)]"}`}>
      <h3 className={`mb-4 text-base font-semibold ${accent ? "text-[var(--accent)]" : "text-[var(--text)]"}`}>{title}</h3>
      <ul className="space-y-2 text-sm text-[var(--muted)]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className={accent ? "text-[var(--accent)]" : "text-[var(--text)]"}>✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ComparePageDocument({ page, relatedLinks }: ComparePageDocumentProps) {
  const competitor = competitors[page.competitorId];

  return (
    <section className="relative z-10 mx-auto max-w-3xl px-5 py-16 md:py-20">
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          <Link href="/compare" className="hover:text-[var(--accent)]">
            Compare
          </Link>
        </p>
        <h1 className="section-title mb-3">{page.title}</h1>
        <p className="section-lead">{page.intro}</p>
      </div>

      <div className="card mb-8 border-[rgba(255,45,85,0.25)] bg-[var(--surface-muted)] p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Quick answer</p>
        <p className="text-[var(--text)] leading-relaxed">{page.tldr}</p>
      </div>

      <article className="card mb-8 space-y-8 p-8 text-[var(--muted)] leading-relaxed">
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">{section.title}</h2>
            <div className="space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      <div className="mb-10">
        <h2 className="section-title mb-3">What you get with each tool</h2>
        <p className="section-lead mb-6">
          Side-by-side summary of options on{" "}
          <a href={competitor.url} className="text-[var(--accent)] hover:underline" target="_blank" rel="noopener noreferrer">
            {competitor.name}
          </a>{" "}
          versus {product.proName}.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          <OfferList title={competitor.name} items={page.competitorOffers} />
          <OfferList title={product.proName} items={page.hackSwipeOffers} accent />
        </div>
      </div>

      <div className="mb-10">
        <h2 className="section-title mb-3">When to choose which</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <OfferList title={`Choose ${competitor.name} when…`} items={page.chooseCompetitorWhen} />
          <OfferList title={`Choose ${product.name} when…`} items={page.chooseHackSwipeWhen} accent />
        </div>
      </div>

      <div className="mb-10 max-w-none">
        <h2 className="section-title mb-3">Feature comparison table</h2>
        <p className="section-lead mb-6">{oneTimePitch.body}</p>
        {page.useMainComparisonTable ? (
          <ComparisonTable showCostOverTime />
        ) : (
          <CompareTwoColumnTable
            competitorName={competitor.name}
            rows={page.tableRows ?? []}
            costOverTime={page.costOverTime}
            costFootnote={page.costFootnote}
          />
        )}
        <p className="mt-4 text-xs text-[var(--muted)]">{oneTimePitch.footnote}</p>
      </div>

      <div className="card mb-8 space-y-6 p-8">
        <h2 className="text-lg font-semibold text-[var(--text)]">Common questions</h2>
        {page.faqs.map((faq) => (
          <section key={faq.question}>
            <h3 className="mb-2 text-base font-semibold text-[var(--text)]">{faq.question}</h3>
            <p className="text-[var(--muted)] leading-relaxed">{faq.answer}</p>
          </section>
        ))}
      </div>

      <div className="card border-[rgba(255,45,85,0.25)] bg-[var(--surface-muted)] p-8 text-center">
        <h2 className="mb-3 text-xl font-bold text-[var(--text)] md:text-2xl">
          Try <BrandName /> on your next session
        </h2>
        <p className="mx-auto mb-6 max-w-lg text-[var(--muted)] leading-relaxed">
          {product.freeTrialDays}-day free trial. Lifetime is {pricing.saleDisplay} once.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <AddToChromeLink className="btn-primary">
            Add to Chrome
          </AddToChromeLink>
          <Link href="/pricing" className="btn-secondary">
            See pricing
          </Link>
        </div>
      </div>

      {relatedLinks && relatedLinks.length > 0 ? (
        <p className="mt-6 text-sm text-[var(--muted)]">
          See also:{" "}
          {relatedLinks.map((link, index) => (
            <span key={link.href}>
              {index > 0 ? ", " : null}
              <Link href={link.href} className="text-[var(--accent)] hover:underline">
                {link.label}
              </Link>
            </span>
          ))}
        </p>
      ) : null}

      <p className="mt-8 text-sm text-[var(--muted)]">
        <Link href="/compare" className="text-[var(--accent)] hover:underline">
          ← All comparisons
        </Link>
        {" · "}
        <Link href="/" className="text-[var(--accent)] hover:underline">
          Homepage
        </Link>
      </p>
    </section>
  );
}

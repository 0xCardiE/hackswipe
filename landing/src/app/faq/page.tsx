import type { Metadata } from "next";
import Link from "next/link";
import { AddToChromeLink } from "@/components/add-to-chrome-link";
import { BrandName } from "@/components/brand-name";
import { JsonLd } from "@/components/json-ld";
import { faqItems } from "@/config/faq";
import { createMetadata, faqPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "FAQ: HackSwipe pricing, filters, and safety",
  description:
    "Answers about HackSwipe: the free trial vs Lifetime, Tinder filters, ToS risk, activation, and privacy.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd([...faqItems])} />
      <section className="relative z-10 mx-auto max-w-3xl px-5 py-16 md:py-20">
        <div className="mb-10">
          <h1 className="section-title mb-3">FAQ</h1>
          <p className="section-lead">
            How <BrandName /> works, free trial vs Lifetime, and what filters you can set.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <article key={item.question} className="card p-6">
              <h2 className="mb-2 text-lg font-semibold">{item.question}</h2>
              <p className="text-[var(--muted)] leading-relaxed">{item.answer}</p>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-[var(--muted)]">
          Ready to try it?{" "}
          <AddToChromeLink className="text-[var(--accent)] hover:underline">
            Install the extension
          </AddToChromeLink>
        </p>
      </section>
    </>
  );
}

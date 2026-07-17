import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { guides } from "@/config/guides";
import { product } from "@/config/product";
import { breadcrumbJsonLd, createMetadata, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Guides for Auto-Swiping on Tinder",
  description:
    "Guides for auto-swiping on Tinder: how auto-swipe works, which filters actually work, how to stop paying for Gold, and what to look for in a Tinder auto-swiper extension.",
  path: "/guides",
  keywords: [
    "how to auto swipe on tinder",
    "tinder auto swiper guide",
    "tinder filters that work",
    "stop paying for tinder gold",
    "tinder auto swiper chrome extension",
  ],
});

const guidesBreadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Guides", path: "/guides" },
]);

const guidesList = itemListJsonLd(
  guides.map((guide) => ({
    name: guide.title,
    path: `/guides/${guide.slug}`,
    description: guide.description,
  })),
);

export default function GuidesPage() {
  return (
    <>
      <JsonLd data={[guidesBreadcrumb, guidesList]} />
      <section className="relative z-10 mx-auto max-w-3xl px-5 py-16 md:py-20">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Resources</p>
          <h1 className="section-title mb-3">Guides</h1>
          <p className="section-lead">
            Guides for auto-swiping on Tinder: setting up filters, cutting swipe time, avoiding Gold, and picking an
            auto-swiper extension, using {product.name} in your workflow.
          </p>
        </div>

        <ul className="card divide-y divide-[rgba(94,234,212,0.12)] p-2">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="block rounded-lg px-6 py-5 transition hover:bg-[rgba(94,234,212,0.04)]"
              >
                <h2 className="mb-1 text-lg font-semibold text-[var(--text)]">{guide.title}</h2>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{guide.description}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-[var(--muted)]">
          Also see{" "}
          <Link href="/compare" className="text-[var(--accent)] hover:underline">
            Compare
          </Link>
          {" · "}
          <Link href="/faq" className="text-[var(--accent)] hover:underline">
            FAQ
          </Link>
          {" · "}
          <Link href="/pricing" className="text-[var(--accent)] hover:underline">
            Pricing
          </Link>
          {" · "}
          <Link href="/" className="text-[var(--accent)] hover:underline">
            Homepage
          </Link>
        </p>
      </section>
    </>
  );
}

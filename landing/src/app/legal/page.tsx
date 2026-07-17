import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { legal, legalPlatforms } from "@/config/legal";
import { product } from "@/config/product";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Legal & Trademark Notice",
  description:
    "Trademark, affiliation, ToS risk, and compatibility notice for HackSwipe and its relationship to Tinder and Match Group.",
  path: "/legal",
});

const legalBreadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Legal", path: "/legal" },
]);

export default function LegalPage() {
  return (
    <>
      <JsonLd data={legalBreadcrumb} />
      <section className="relative z-10 mx-auto max-w-3xl px-5 py-16 md:py-20">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Legal</p>
          <h1 className="section-title mb-3">Legal & trademark notice</h1>
          <p className="section-lead">
            How {product.name} relates to {legal.platformNamesLabel} and third-party services.
          </p>
        </div>

        <div className="card space-y-6 p-8 text-[var(--muted)] leading-relaxed">
          {legal.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <div className="border-t border-[var(--surface-border)] pt-6">
            <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">Compatibility references</h2>
            <p className="mb-4">
              We refer to {legal.platformNamesLabel} to explain that this extension automates swiping on the Tinder web
              app you open in your browser. We do not use Tinder logos or branding, and we do not represent ourselves as
              Tinder or Match Group.
            </p>
            <ul className="space-y-3">
              {legalPlatforms.map((platform) => (
                <li key={platform.name}>
                  <strong className="text-[var(--text)]">{platform.name}</strong> —{" "}
                  <a
                    href={`https://${platform.url}`}
                    className="text-[var(--accent)] hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {platform.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[var(--surface-border)] pt-6">
            <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">Your responsibilities</h2>
            <p>{legal.userResponsibility}</p>
          </div>

          <div className="border-t border-[var(--surface-border)] pt-6">
            <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">Related policies</h2>
            <p>
              <Link href="/privacy" className="text-[var(--accent)] hover:underline">
                Privacy policy
              </Link>
              {" · "}
              <Link href="/terms" className="text-[var(--accent)] hover:underline">
                Terms of service
              </Link>
              {" · "}
              <Link href="/refund-policy" className="text-[var(--accent)] hover:underline">
                Refund policy
              </Link>
            </p>
          </div>

          <div className="border-t border-[var(--surface-border)] pt-6">
            <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">Questions</h2>
            <p>
              See the{" "}
              <Link href="/faq" className="text-[var(--accent)] hover:underline">
                FAQ
              </Link>{" "}
              and{" "}
              <Link href="/guides" className="text-[var(--accent)] hover:underline">
                guides
              </Link>{" "}
              for product and licensing details.
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm text-[var(--muted)]">
          <Link href="/" className="text-[var(--accent)] hover:underline">
            ← Back to homepage
          </Link>
        </p>
      </section>
    </>
  );
}

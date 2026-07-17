import Link from "next/link";
import { policyMeta } from "@/config/policies";
import { product } from "@/config/product";

type PolicySection = {
  title: string;
  paragraphs: readonly string[];
};

interface PolicyDocumentProps {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly PolicySection[];
  relatedLinks?: { href: string; label: string }[];
  contactEmail?: string;
}

export function PolicyDocument({
  eyebrow,
  title,
  intro,
  sections,
  relatedLinks,
  contactEmail,
}: PolicyDocumentProps) {
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-5 py-16 md:py-20">
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">{eyebrow}</p>
        <h1 className="section-title mb-3">{title}</h1>
        <p className="section-lead">{intro}</p>
        <p className="mt-4 text-sm text-[var(--muted)]">Last updated: {policyMeta.lastUpdated}</p>
      </div>

      <div className="card space-y-8 p-8 text-[var(--muted)] leading-relaxed">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">{section.title}</h2>
            <div className="space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}

        <div className="border-t border-[var(--surface-border)] pt-6">
          <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">Questions</h2>
          <p>
            See the{" "}
            <Link href="/faq" className="text-[var(--accent)] hover:underline">
              FAQ
            </Link>{" "}
            for how {product.name} works, licensing, and privacy.
            {contactEmail ? (
              <>
                {" "}
                For licensing questions, email{" "}
                <a href={`mailto:${contactEmail}`} className="text-[var(--accent)] hover:underline">
                  {contactEmail}
                </a>
                .
              </>
            ) : null}
          </p>
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
        <Link href="/" className="text-[var(--accent)] hover:underline">
          ← Back to homepage
        </Link>
      </p>
    </section>
  );
}

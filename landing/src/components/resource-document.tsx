import Link from "next/link";
import { AddToChromeLink } from "@/components/add-to-chrome-link";
import { product } from "@/config/product";

type ResourceSection = {
  title: string;
  paragraphs: readonly string[];
};

interface ResourceDocumentProps {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly ResourceSection[];
  relatedLinks?: { href: string; label: string }[];
  showContact?: boolean;
  showExportCta?: boolean;
}

export function ResourceDocument({
  eyebrow,
  title,
  intro,
  sections,
  relatedLinks,
  showContact = true,
  showExportCta = false,
}: ResourceDocumentProps) {
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-5 py-16 md:py-20">
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          {eyebrow === "Guides" ? (
            <Link href="/guides" className="hover:text-[var(--accent)]">
              {eyebrow}
            </Link>
          ) : (
            eyebrow
          )}
        </p>
        <h1 className="section-title mb-3">{title}</h1>
        <p className="section-lead">{intro}</p>
      </div>

      <article className="card space-y-8 p-8 text-[var(--muted)] leading-relaxed">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">{section.title}</h2>
            <div className="space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

        {showContact ? (
          <div className="border-t border-[var(--surface-border)] pt-6">
            <h2 className="mb-3 text-lg font-semibold text-[var(--text)]">Need help?</h2>
            <p>
              See the{" "}
              <Link href="/faq" className="text-[var(--accent)] hover:underline">
                FAQ
              </Link>{" "}
              and{" "}
              <Link href="/guides" className="text-[var(--accent)] hover:underline">
                guides
              </Link>{" "}
              for setup, export formats, and licensing.
            </p>
          </div>
        ) : null}
      </article>

      {showExportCta ? (
        <div className="card mt-8 border-[rgba(255,45,85,0.25)] bg-[var(--surface-muted)] p-8 text-center">
          <h2 className="mb-3 text-xl font-bold text-[var(--text)] md:text-2xl">Ready to auto-swipe?</h2>
          <p className="mx-auto mb-6 max-w-lg text-[var(--muted)] leading-relaxed">
            Install {product.name}, set your filters, and let it auto-swipe Tinder while you review matches.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <AddToChromeLink className="btn-primary">
              Add to Chrome
            </AddToChromeLink>
            <Link href="/faq" className="btn-secondary">
              Read the FAQ
            </Link>
          </div>
        </div>
      ) : null}

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

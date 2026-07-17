import Link from "next/link";
import { AddToChromeLink } from "@/components/add-to-chrome-link";
import { BrandName } from "@/components/brand-name";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { platformsShort, product } from "@/config/product";
import { site } from "@/config/site";

const legalLinks = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
  { href: "/refund-policy", label: "Refund policy" },
  { href: "/legal", label: "Legal & trademark notice" },
] as const;

const productLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare" },
  { href: "/faq", label: "FAQ" },
  { href: "/changelog", label: "Changelog" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-[var(--surface-border)] bg-[var(--surface-muted)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <p className="mb-1 text-sm font-semibold text-[var(--text)]">
            <BrandName />: auto-swipe {platformsShort} without paying for Gold.
          </p>
          <p className="mb-1 text-sm text-[var(--muted)]">
            Operated by {site.operatorName} · {site.operatorLocation}
          </p>
          <p className="mb-3 text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} {product.name}
          </p>
          <p className="mb-3 text-sm text-[var(--muted)]">
            <a href={`mailto:${site.licenseEmail}`} className="text-[var(--accent)] hover:underline">
              {site.licenseEmail}
            </a>
          </p>
          <LegalDisclaimer />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text)]">Product</p>
            <div className="flex flex-col gap-2 text-sm text-[var(--muted)]">
              {productLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-[var(--accent)] hover:underline">
                  {link.label}
                </Link>
              ))}
              <AddToChromeLink className="text-[var(--accent)] hover:underline">Install</AddToChromeLink>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text)]">Legal</p>
            <div className="flex flex-col gap-2 text-sm text-[var(--muted)]">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-[var(--accent)] hover:underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { AddToChromeLink } from "@/components/add-to-chrome-link";
import { AppLogo } from "@/components/app-logo";
import { BrandName } from "@/components/brand-name";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-[var(--surface-border)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <AppLogo size={40} priority />
          <div>
            <p className="font-display text-base font-bold tracking-tight">
              <BrandName />
            </p>
            <p className="text-xs text-[var(--muted)]">Skip the Gold tax</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[var(--text)]">
              {link.label}
            </Link>
          ))}
        </nav>

        <AddToChromeLink className="btn-primary px-4 py-2 text-sm">
          Free trial
        </AddToChromeLink>
      </div>
    </header>
  );
}

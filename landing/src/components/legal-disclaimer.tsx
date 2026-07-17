import Link from "next/link";
import { legal } from "@/config/legal";

type LegalDisclaimerProps = {
  variant?: "compact" | "inline";
  className?: string;
};

export function LegalDisclaimer({ variant = "compact", className = "" }: LegalDisclaimerProps) {
  if (variant === "inline") {
    return (
      <p className={`text-xs leading-relaxed text-[var(--muted)] ${className}`}>
        {legal.shortDisclaimer}{" "}
        <Link href="/legal" className="text-[var(--accent)] hover:underline">
          Legal & trademark notice
        </Link>
      </p>
    );
  }

  return (
    <div className={`space-y-2 text-xs leading-relaxed text-[var(--muted)] ${className}`}>
      <p>{legal.shortDisclaimer}</p>
      {legal.trademarkNotices.map((notice) => (
        <p key={notice}>{notice}</p>
      ))}
      <p>
        <Link href="/legal" className="text-[var(--accent)] hover:underline">
          Full legal & trademark notice
        </Link>
      </p>
    </div>
  );
}

import { pricing } from "@/lib/pricing";

type PriceDisplayProps = {
  size?: "sm" | "lg";
  showBadge?: boolean;
  className?: string;
};

export function PriceDisplay({ size = "lg", showBadge = true, className = "" }: PriceDisplayProps) {
  const { onSale, originalDisplay, saleDisplay, launchOfferLabel } = pricing;

  const priceClass = size === "lg" ? "text-4xl md:text-5xl" : "text-2xl";
  const originalClass = size === "lg" ? "text-xl md:text-2xl" : "text-base";

  return (
    <div className={className}>
      {onSale && showBadge ? (
        <span className="mb-3 inline-flex rounded-full bg-[rgba(251,113,133,0.14)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#fb7185]">
          {launchOfferLabel}
        </span>
      ) : null}
      <div className="flex flex-wrap items-baseline gap-3">
        {onSale ? (
          <span className={`${originalClass} relative inline-block font-semibold text-[var(--muted)]`}>
            {originalDisplay}
            <span
              className="pointer-events-none absolute inset-x-[-4px] top-1/2 z-10 h-[3px] -translate-y-1/2 rounded-full bg-[#fb7185]"
              aria-hidden
            />
          </span>
        ) : null}
        <span className={`${priceClass} font-bold tracking-tight ${onSale ? "text-[var(--accent)]" : ""}`}>
          {saleDisplay}
        </span>
      </div>
    </div>
  );
}

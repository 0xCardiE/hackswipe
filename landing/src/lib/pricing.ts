function parsePriceAmount(raw: string | undefined, fallback: number): number {
  if (!raw?.trim()) return fallback;

  const trimmed = raw.trim();

  // Broken env expansion: $9.99 → ".99" (shell/dotenv eats $9)
  if (/^\.\d+$/.test(trimmed)) return fallback;

  const cleaned = trimmed.replace(/^\$/, "");
  const parsed = Number(cleaned);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const saleAmount = parsePriceAmount(process.env.NEXT_PUBLIC_PRODUCT_PRICE, 20);
const originalAmount = parsePriceAmount(process.env.NEXT_PUBLIC_PRODUCT_ORIGINAL_PRICE, 49);
const savingsAmount = Math.max(0, originalAmount - saleAmount);
const savingsPercent =
  originalAmount > 0 && savingsAmount > 0 ? Math.floor((savingsAmount / originalAmount) * 100) : 0;

export const pricing = {
  saleAmount,
  originalAmount,
  saleDisplay: formatUsd(saleAmount),
  originalDisplay: formatUsd(originalAmount),
  onSale: originalAmount > saleAmount,
  savingsAmount,
  savingsDisplay: formatUsd(savingsAmount),
  savingsPercent,
  launchOfferLabel: savingsPercent > 0 ? `Launch offer: ${savingsPercent}% off` : "Launch offer",
} as const;

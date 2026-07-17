import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { product } from "@/config/product";

export const metadata: Metadata = createMetadata({
  title: "Purchase Complete",
  description:
    `Your ${product.proName} license key is ready. Activate unlimited auto-swipe in the ${product.name} Chrome extension.`,
  path: "/purchase/success",
  noIndex: true,
});

export default function PurchaseSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}

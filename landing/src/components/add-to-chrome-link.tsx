import Link from "next/link";
import type { ComponentProps } from "react";
import { product } from "@/config/product";

type AddToChromeLinkProps = Omit<ComponentProps<typeof Link>, "href">;

export function AddToChromeLink({ children, ...props }: AddToChromeLinkProps) {
  return (
    <Link href={product.chromeStoreUrl} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </Link>
  );
}

import { product } from "@/config/product";

type BrandNameProps = {
  className?: string;
  plusClassName?: string;
};

export function BrandName({ className = "" }: BrandNameProps) {
  return <span className={`inline-flex items-baseline whitespace-nowrap ${className}`}>{product.name}</span>;
}

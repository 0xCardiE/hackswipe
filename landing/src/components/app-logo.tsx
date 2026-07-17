import Image from "next/image";
import { product } from "@/config/product";

type AppLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function AppLogo({ size = 40, className = "", priority = false }: AppLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt={product.name}
      width={size}
      height={size}
      priority={priority}
      className={`rounded-xl shadow-[0_4px_16px_rgba(255,45,85,0.28)] ${className}`}
    />
  );
}

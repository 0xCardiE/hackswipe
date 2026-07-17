import type { Metadata } from "next";
import { platformsShort, product } from "@/config/product";
import { site } from "@/config/site";
import { env } from "@/lib/env";
export const siteUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

export type OgImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export const ogImages = {
  logo: {
    url: "/logo.png",
    width: 512,
    height: 512,
    alt: `${product.name}: auto-swipe ${platformsShort} with your filters and get matches without buying Gold`,
  },
} satisfies Record<string, OgImage>;

const defaultKeywords = [
  "HackSwipe",
  "hackswipe.app",
  "Tinder auto swiper",
  "auto swipe Tinder",
  "Tinder auto swipe Chrome extension",
  "Tinder bot",
  "Tinder Gold alternative",
  "Tinder auto liker",
  "automate Tinder swiping",
  "Tinder filters extension",
  "Chrome extension",
  "Tinder matches without Gold",
];

export const homePageTitle = product.metaTitle;

export const defaultPageTitle = homePageTitle;

export function formatPageTitle(pageTitle?: string): string {
  if (!pageTitle) return defaultPageTitle;
  return `${pageTitle} | ${product.name}`;
}

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  ogImage?: OgImage;
};

export function createMetadata({
  title,
  description = product.description,
  path = "/",
  keywords = defaultKeywords,
  noIndex = false,
  ogImage = ogImages.logo,
}: CreateMetadataOptions = {}): Metadata {
  const fullTitle = formatPageTitle(title);
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(ogImage.url);

  return {
    ...(title ? { title } : {}),
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
    },
    applicationName: product.name,
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: product.name,
      locale: "en_US",
      type: "website",
      images: [{ ...ogImage, url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export const rootMetadata: Metadata = {
  ...createMetadata(),
  title: {
    default: defaultPageTitle,
    template: `%s | ${product.name}`,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: product.name,
    url: siteUrl,
    logo: absoluteUrl("/logo.png"),
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: product.name,
    url: siteUrl,
    description: product.description,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function homePageJsonLd() {
  return [organizationJsonLd(), webSiteJsonLd()];
}

export function createHomeMetadata(): Metadata {
  return {
    ...createMetadata({
      description: product.description,
      path: "/",
    }),
    title: { absolute: homePageTitle },
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleJsonLd({
  headline,
  description,
  path,
}: {
  headline: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    author: {
      "@type": "Organization",
      name: product.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: product.name,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
    mainEntityOfPage: absoluteUrl(path),
    image: absoluteUrl(ogImages.logo.url),
  };
}

export function itemListJsonLd(items: { name: string; path: string; description?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

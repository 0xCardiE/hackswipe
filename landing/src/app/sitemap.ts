import type { MetadataRoute } from "next";
import { comparePages } from "@/config/compare-pages";
import { guides } from "@/config/guides";
import { siteUrl } from "@/lib/seo";

/** Pillar guides target head terms; give them slightly higher sitemap priority. */
const pillarGuideSlugs = new Set([
  "how-to-auto-swipe-on-tinder",
  "tinder-auto-swiper-chrome-extension",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/pricing`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/compare`, lastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/guides`, lastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteUrl}/faq`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/changelog`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/legal`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/refund-policy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${siteUrl}/guides/${guide.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: pillarGuideSlugs.has(guide.slug) ? 0.85 : 0.7,
  }));

  const compareDetailPages: MetadataRoute.Sitemap = comparePages.map((page) => ({
    url: `${siteUrl}/compare/${page.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...guidePages, ...compareDetailPages];
}

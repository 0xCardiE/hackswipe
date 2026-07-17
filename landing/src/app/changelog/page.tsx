import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ResourceDocument } from "@/components/resource-document";
import { changelogEntries } from "@/config/changelog";
import { product } from "@/config/product";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Changelog & Release Notes",
  description:
    "Release history, bug fixes, and feature updates for the HackSwipe Chrome extension.",
  path: "/changelog",
  keywords: ["HackSwipe changelog", "Tinder auto swiper updates"],
});

const changelogBreadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Changelog", path: "/changelog" },
]);

export default function ChangelogPage() {
  return (
    <>
      <JsonLd data={changelogBreadcrumb} />
      <ResourceDocument
        eyebrow="Resources"
        title="Changelog"
        intro={`What's new in ${product.name}. We update this page with each extension release.`}
        sections={changelogEntries.map((entry) => ({
          title: `Version ${entry.version} (${entry.date})`,
          paragraphs: [entry.summary, ...entry.changes],
        }))}
        relatedLinks={[
          { href: "/guides", label: "Guides" },
          { href: "/faq", label: "FAQ" },
        ]}
        showContact={false}
      />
    </>
  );
}

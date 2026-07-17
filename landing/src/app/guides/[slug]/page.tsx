import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ResourceDocument } from "@/components/resource-document";
import { getGuideBySlug, getRelatedGuides, guides } from "@/config/guides";
import { breadcrumbJsonLd, articleJsonLd, createMetadata } from "@/lib/seo";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return createMetadata({ title: "Guide not found", noIndex: true });
  }

  return createMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    keywords: [...guide.keywords],
  });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const related = getRelatedGuides(slug);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path: `/guides/${guide.slug}` },
  ]);

  const article = articleJsonLd({
    headline: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
  });

  return (
    <>
      <JsonLd data={[breadcrumb, article]} />
      <ResourceDocument
        eyebrow="Guides"
        title={guide.title}
        intro={guide.intro}
        sections={guide.sections}
        showExportCta
        relatedLinks={[
          { href: "/guides", label: "All guides" },
          { href: "/faq", label: "FAQ" },
          { href: "/pricing", label: "Pricing" },
          ...related.map((item) => ({
            href: `/guides/${item.slug}`,
            label: item.title,
          })),
        ]}
      />
    </>
  );
}

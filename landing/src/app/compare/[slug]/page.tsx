import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComparePageDocument } from "@/components/compare-page-document";
import { JsonLd } from "@/components/json-ld";
import { comparePages, getComparePageBySlug, getRelatedComparePages } from "@/config/compare-pages";
import { articleJsonLd, breadcrumbJsonLd, createMetadata, faqPageJsonLd } from "@/lib/seo";

type ComparePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return comparePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparePageBySlug(slug);

  if (!page) {
    return createMetadata({ title: "Comparison not found", noIndex: true });
  }

  return createMetadata({
    title: page.title,
    description: page.description,
    path: `/compare/${page.slug}`,
    keywords: [...page.keywords],
  });
}

export default async function CompareDetailPage({ params }: ComparePageProps) {
  const { slug } = await params;
  const page = getComparePageBySlug(slug);

  if (!page) {
    notFound();
  }

  const related = getRelatedComparePages(slug);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Compare", path: "/compare" },
    { name: page.title, path: `/compare/${page.slug}` },
  ]);

  const article = articleJsonLd({
    headline: page.title,
    description: page.description,
    path: `/compare/${page.slug}`,
  });

  const faq = faqPageJsonLd([...page.faqs]);

  return (
    <>
      <JsonLd data={[breadcrumb, article, faq]} />
      <ComparePageDocument
        page={page}
        relatedLinks={[
          { href: "/compare", label: "All comparisons" },
          { href: "/pricing", label: "Pricing" },
          { href: "/faq", label: "FAQ" },
          ...related.map((item) => ({
            href: `/compare/${item.slug}`,
            label: item.title,
          })),
        ]}
      />
    </>
  );
}

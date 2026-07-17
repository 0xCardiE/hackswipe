import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PolicyDocument } from "@/components/policy-document";
import { termsOfService } from "@/config/policies";
import { site } from "@/config/site";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description:
    "Terms of service for HackSwipe: license grant, acceptable use, ToS risk, purchases, disclaimers, and liability.",
  path: "/terms",
});

const termsBreadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Terms", path: "/terms" },
]);

export default function TermsPage() {
  return (
    <>
      <JsonLd data={termsBreadcrumb} />
      <PolicyDocument
        eyebrow="Legal"
        title="Terms of service"
        intro={termsOfService.intro}
        sections={termsOfService.sections}
        relatedLinks={[
          { href: "/privacy", label: "Privacy policy" },
          { href: "/refund-policy", label: "Refund policy" },
          { href: "/legal", label: "Legal & trademark notice" },
        ]}
        contactEmail={site.licenseEmail}
      />
    </>
  );
}

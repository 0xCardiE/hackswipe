import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PolicyDocument } from "@/components/policy-document";
import { privacyPolicy } from "@/config/policies";
import { product } from "@/config/product";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "How HackSwipe handles Chrome permissions, local storage, analytics, and third-party services.",
  path: "/privacy",
});

const privacyBreadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Privacy", path: "/privacy" },
]);

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={privacyBreadcrumb} />
      <PolicyDocument
        eyebrow="Legal"
        title="Privacy policy"
        intro={privacyPolicy.intro}
        sections={privacyPolicy.sections}
        relatedLinks={[
          { href: "/refund-policy", label: "Refund & license policy" },
          { href: "/terms", label: "Terms of service" },
          { href: "/legal", label: "Legal & trademark notice" },
        ]}
      />
    </>
  );
}

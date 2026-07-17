import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PolicyDocument } from "@/components/policy-document";
import { refundPolicy } from "@/config/policies";
import { product } from "@/config/product";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Refund & License Policy",
  description:
    "Refund terms, one-browser license activation rules, chargebacks, and free trial details for HackSwipe Lifetime.",
  path: "/refund-policy",
});

const refundBreadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Refund policy", path: "/refund-policy" },
]);

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd data={refundBreadcrumb} />
      <PolicyDocument
        eyebrow="Legal"
        title="Refund & license policy"
        intro={refundPolicy.intro}
        sections={refundPolicy.sections}
        relatedLinks={[
          { href: "/privacy", label: "Privacy policy" },
          { href: "/terms", label: "Terms of service" },
          { href: "/legal", label: "Legal & trademark notice" },
        ]}
      />
    </>
  );
}

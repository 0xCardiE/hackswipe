import { product } from "./product";

export const policyMeta = {
  lastUpdated: "July 1, 2026",
  operatorName: product.name,
} as const;

export const privacyPolicy = {
  intro:
    "This policy describes what information we collect when you use hackswipe.app, purchase a HackSwipe Lifetime license, or use the HackSwipe Chrome extension, and what we do not collect.",
  sections: [
    {
      title: "Summary",
      paragraphs: [
        `${product.name} is designed so your Tinder filters and swipe activity stay on your computer. We do not upload, store, or process your Tinder activity on our servers.`,
        "We collect only what is needed to sell and activate a Lifetime license, deliver your license key, and keep the service running.",
      ],
    },
    {
      title: "Information we collect",
      paragraphs: [
        "When you buy Lifetime on this website, Stripe processes your payment. We receive your email address, payment status, and a Stripe checkout session ID so we can create your license and email your key.",
        "Our license server stores your email address, a license key, and activation metadata (such as when the license was created and which browser installation activated it). This enforces the one-license-per-browser rule.",
        "The Chrome extension stores your filters, trial status, and Lifetime activation status locally in your browser via Chrome storage. It does not send your Tinder activity to us.",
      ],
    },
    {
      title: "Information we do not collect",
      paragraphs: [
        "We do not collect, upload, or store your Tinder profile data, swipe history, matches, or messages.",
        "We do not require an account on this website to browse or purchase.",
        "We do not sell your personal information.",
      ],
    },
    {
      title: "How we use your information",
      paragraphs: [
        "To create and deliver your Lifetime license key after purchase.",
        "To verify activation in the Chrome extension and prevent the same license from being used on multiple browser installations.",
        "To comply with payment, tax, and fraud-prevention obligations handled by Stripe.",
      ],
    },
    {
      title: "Third-party services",
      paragraphs: [
        "Stripe: payment processing. See Stripe's privacy policy for how they handle payment data.",
        "Resend: transactional email delivery for license keys.",
        "Our license server: hosted infrastructure we operate to store license and activation records.",
        "Tinder: the extension automates swipes on tinder.com pages you have open. We are not affiliated with Tinder or Match Group, LLC.",
      ],
    },
    {
      title: "Chrome extension permissions",
      paragraphs: [
        "The extension requests permissions needed to read and interact with Tinder web pages you visit, save your filters and stats locally, and communicate with the license server for Lifetime activation. It does not read data from unrelated sites.",
      ],
    },
    {
      title: "Cookies and analytics",
      paragraphs: [
        "This website does not use advertising cookies. Stripe may set cookies during checkout on their hosted payment page.",
        "We may add privacy-friendly analytics in the future; if we do, this policy will be updated.",
      ],
    },
    {
      title: "Data retention",
      paragraphs: [
        "License records are kept for as long as your license is valid and as needed for support, fraud prevention, and legal obligations.",
        "If you request deletion and we can verify your identity, we will remove or anonymize personal data where we are not required to retain it (for example, completed payment records may be retained as required by law).",
      ],
    },
    {
      title: "Your choices",
      paragraphs: [
        `You can use the ${product.freeTrialDays}-day free trial without purchasing or providing an email to us.`,
        "For product and licensing questions, see the FAQ on this website.",
        "You can uninstall the extension at any time, which removes locally stored extension data from your browser.",
      ],
    },
    {
      title: "Changes",
      paragraphs: [
        "We may update this policy from time to time. The \"Last updated\" date at the top of this page will change when we do.",
      ],
    },
  ],
} as const;

export const refundPolicy = {
  intro:
    `${product.proName} is a one-time software license, not a subscription. Please read this before purchasing.`,
  sections: [
    {
      title: "What you are buying",
      paragraphs: [
        "A one-time Lifetime license that unlocks unlimited auto-swipe on Tinder in the Chrome extension, after your free trial ends.",
        "One license activates on one Chrome browser installation. It is not a floating license shared across multiple computers or browser profiles.",
        "Free updates for the life of the license are included. There is no recurring fee.",
      ],
    },
    {
      title: "Free trial",
      paragraphs: [
        `Every install starts with a ${product.freeTrialDays}-day free trial. Use it to test your filters and auto-swipe on real Tinder sessions before you buy.`,
        "The free trial does not require payment and is not eligible for refunds.",
      ],
    },
    {
      title: "Activation rules",
      paragraphs: [
        "After checkout, you receive a license key by email. Enter your email and license key in the extension Settings tab to activate Lifetime.",
        "Each license can be activated once. If you reinstall Chrome or move to a new computer, see the FAQ for what to expect.",
        "Sharing a license key with others is not permitted and may result in revocation without refund.",
      ],
    },
    {
      title: "Refund policy",
      paragraphs: [
        "If you have not activated your license yet, you may request a full refund within 14 days of purchase through Stripe.",
        "If your license has already been activated, we generally do not offer refunds because the software has been delivered and used.",
        "Approved refunds are processed through Stripe and may take 5 to 10 business days to appear on your statement.",
        "If a refund is issued, the associated license key is revoked and Lifetime access ends.",
      ],
    },
    {
      title: "Chargebacks",
      paragraphs: [
        "Please review this refund policy and the FAQ before opening a payment dispute.",
        "Fraudulent chargebacks on activated licenses may result in permanent revocation of the license.",
      ],
    },
    {
      title: "Service availability",
      paragraphs: [
        `${product.name} depends on tinder.com remaining accessible in your browser and on Tinder's web app structure. We do not guarantee compatibility if Tinder changes its site. Automating swipes may also violate Tinder's terms of service; you use HackSwipe at your own risk. See our legal notice for trademark and affiliation details.`,
        `${product.name} is provided "as is" without warranty. This does not affect your statutory consumer rights where applicable.`,
      ],
    },
  ],
} as const;

export const termsOfService = {
  intro:
    `These terms govern your use of hackswipe.app and the ${product.name} Chrome extension. By installing the extension, browsing this website, or purchasing a Lifetime license, you agree to these terms.`,
  sections: [
    {
      title: "The service",
      paragraphs: [
        `${product.name} is a Chrome extension that automates swiping on the Tinder web app (tinder.com) using filters you configure, and lets you review mutual likes yourself.`,
        "We are an independent third-party tool. We are not affiliated with, endorsed by, or operated by Tinder or its parent company, Match Group, LLC.",
        `Every install includes a ${product.freeTrialDays}-day free trial. Lifetime is a one-time license that unlocks unlimited auto-swipe on one browser installation.`,
      ],
    },
    {
      title: "License grant",
      paragraphs: [
        "We grant you a personal, non-exclusive, non-transferable license to install and use the extension for lawful purposes.",
        "A Lifetime license activates on one Chrome browser installation. Sharing, reselling, or publishing license keys is not permitted.",
        "We may provide updates to the extension. Updates are included with Lifetime for the life of the license unless these terms change materially.",
      ],
    },
    {
      title: "Your responsibilities",
      paragraphs: [
        "Automating swipes may violate Tinder's terms of service. You are responsible for reading and complying with Tinder's terms of service and applicable laws before using this extension.",
        "You must not use the extension to harass others, bypass access controls, or use it in any way that violates Tinder's rules beyond the automation itself.",
        "You are responsible for the consequences of using automation on your Tinder account, including possible account restrictions or bans.",
      ],
    },
    {
      title: "Purchases and refunds",
      paragraphs: [
        "Lifetime purchases are processed by Stripe. Prices shown on this website are the prices charged at checkout unless otherwise stated.",
        "Refund terms are described in our refund policy. Please read that policy before purchasing.",
      ],
    },
    {
      title: "Privacy",
      paragraphs: [
        "Your filters and swipe activity are stored locally in your browser. We do not upload or store your Tinder activity on our servers.",
        "Our privacy policy explains what we collect when you purchase a license or use this website.",
      ],
    },
    {
      title: "Disclaimer",
      paragraphs: [
        `${product.name} is provided "as is" and "as available" without warranties of any kind, whether express or implied.`,
        "We do not guarantee uninterrupted access if Tinder or Chrome changes how pages load or how extensions work.",
        `${product.name} automates swiping for your own use. It does not guarantee matches, and it does not provide legal or compliance advice about Tinder's terms of service.`,
      ],
    },
    {
      title: "Limitation of liability",
      paragraphs: [
        "To the fullest extent permitted by law, we are not liable for indirect, incidental, special, consequential, or punitive damages, including account restrictions, shadowbans, or bans on Tinder, arising from your use of the extension or this website.",
        "Our total liability for any claim relating to the service is limited to the amount you paid us for Lifetime in the twelve months before the claim, or zero if you use only the free trial.",
        "Nothing in these terms limits rights that cannot be excluded under applicable consumer law.",
      ],
    },
    {
      title: "Termination",
      paragraphs: [
        "You may stop using the extension at any time by uninstalling it from Chrome.",
        "We may revoke a Lifetime license if you violate these terms, share a license key, or abuse the license server.",
      ],
    },
    {
      title: "Changes",
      paragraphs: [
        "We may update these terms from time to time. The \"Last updated\" date at the top of this page will change when we do.",
        "Continued use of the extension or website after changes become effective constitutes acceptance of the updated terms.",
      ],
    },
  ],
} as const;

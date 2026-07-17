import { competitors, oneTimePitch, type TwoColumnComparisonRow } from "@/config/comparison";
import { product } from "@/config/product";
import { pricing } from "@/lib/pricing";

export type ComparePageSection = {
  title: string;
  paragraphs: readonly string[];
};

export type ComparePageFaq = {
  question: string;
  answer: string;
};

export type ComparePage = {
  slug: string;
  competitorId: keyof typeof competitors;
  title: string;
  description: string;
  keywords: readonly string[];
  tldr: string;
  intro: string;
  sections: readonly ComparePageSection[];
  competitorOffers: readonly string[];
  hackSwipeOffers: readonly string[];
  chooseCompetitorWhen: readonly string[];
  chooseHackSwipeWhen: readonly string[];
  faqs: readonly ComparePageFaq[];
  useMainComparisonTable?: boolean;
  tableRows?: readonly TwoColumnComparisonRow[];
  costOverTime?: readonly { period: string; hackSwipe: string; competitor: string }[];
  costFootnote?: string;
};

export const comparePages: readonly ComparePage[] = [
  {
    slug: "hackswipe-vs-auto-swiper",
    competitorId: "autoSwiper",
    useMainComparisonTable: true,
    title: "HackSwipe vs Auto Swiper",
    description:
      "Compare HackSwipe and Auto Swiper for Tinder auto-swiping: pricing, platform coverage, filters, and whether a one-time license or monthly subscription fits your workflow.",
    keywords: [
      "HackSwipe vs Auto Swiper",
      "Auto Swiper alternative",
      "auto-swiper.ch comparison",
      "Tinder auto swiper one-time payment",
      "Tinder auto swipe Chrome extension",
    ],
    tldr: `Auto Swiper (auto-swiper.ch) auto-swipes across Tinder, Bumble, Hinge, and other apps on a subscription from $6 to $18/month. HackSwipe focuses on Tinder only, with the same filter and delay controls, for a one-time ${pricing.saleDisplay} payment after a ${product.freeTrialDays}-day free trial.`,
    intro:
      "If you're deciding between Auto Swiper and HackSwipe, the choice comes down to platform breadth versus billing. Auto Swiper covers Tinder plus Bumble, Hinge, Badoo, and more on a recurring plan. HackSwipe goes deep on Tinder only, with filters, human-like delays, and session stats, for a single payment.",
    sections: [
      {
        title: "What is Auto Swiper?",
        paragraphs: [
          "Auto Swiper (auto-swiper.ch) is a browser extension and Android app that automates swiping across Tinder, Bumble, Hinge, Badoo, Lovoo, Zoosk, OkCupid, and Match. Its free version allows up to 100 swipes per run and 500 per day, with basic age and photo filters.",
          "Paid tiers unlock more swipes and features on their public pricing page: Pro is $6/month ($12 for 3 months, $36 billed yearly), and Ultimate is $18/month ($45 for 3 months, $144 billed yearly). Subscribers also get access to their Android app as a bonus.",
        ],
      },
      {
        title: "What does HackSwipe offer for Tinder?",
        paragraphs: [
          `${product.name} is built for Tinder web (tinder.com) only. Set your age range, distance, minimum photo count, and bio keyword bans once, then start auto-swipe. Human-like delays keep swiping natural, and every session shows swipes, matches, and time saved.`,
          `Every install starts with a ${product.freeTrialDays}-day free trial. ${product.proName} is a one-time ${pricing.saleDisplay} payment (regular ${pricing.originalDisplay}) for unlimited auto-swipe on one browser install. No monthly run counter, no renewal invoice.`,
        ],
      },
      {
        title: "How does pricing compare?",
        paragraphs: [
          "Auto Swiper Pro: $36/year if you commit to yearly billing, or $6/month if you don't. Ultimate: $144/year or $18/month. You keep paying to maintain unlimited swipes.",
          `HackSwipe Lifetime: ${pricing.saleDisplay} once. Year two costs $0. Year three costs $0. Over three years, Auto Swiper Pro at yearly pricing is about $108; HackSwipe stays at ${pricing.saleDisplay} total for unlimited Tinder auto-swipe on that browser.`,
          oneTimePitch.footnote,
        ],
      },
      {
        title: "Platform breadth vs Tinder depth",
        paragraphs: [
          "Auto Swiper's strength is breadth: one extension for Tinder, Bumble, Hinge, and several other dating apps. If you're active on multiple platforms, that's genuinely useful.",
          "HackSwipe does one thing: Tinder. If Tinder web is the only platform you use, that focus means simpler filters and a UI built around one workflow instead of a settings page shared across nine different sites.",
        ],
      },
      {
        title: "Filters and human-like delays",
        paragraphs: [
          "Auto Swiper's free tier includes age range, minimum photo requirement, and up to 10 banned words, with swipe speed around 2.5 to 4.5 seconds per swipe.",
          "HackSwipe includes age range, distance, minimum photos, and bio keyword bans on every plan, with randomized human-like delays you control, plus per-session stats so you can see whether your filters are actually working.",
        ],
      },
    ],
    competitorOffers: [
      "Auto-swipes Tinder, Bumble, Hinge, Badoo, and more",
      "Free tier: 100 swipes/run, 500/day",
      "Pro from $6/mo ($36/yr) to Ultimate $18/mo ($144/yr)",
      "Free Android app bonus for paid subscribers",
      "Age, photo, and keyword filters",
      "Ongoing subscription required for unlimited swipes",
    ],
    hackSwipeOffers: [
      "Tinder-only focus: filters built around one platform",
      `${product.freeTrialDays}-day free trial, no card required to install`,
      `Lifetime: ${pricing.saleDisplay} once, unlimited Tinder auto-swipe`,
      "Age, distance, photo, and bio keyword filters",
      "Human-like delays and per-session stats",
      "One-time license, no monthly renewal",
    ],
    chooseCompetitorWhen: [
      "You actively swipe on Bumble, Hinge, or other apps in addition to Tinder",
      "You want a companion Android app included with your subscription",
      "A monthly budget of $6 to $18 fits your routine",
    ],
    chooseHackSwipeWhen: [
      "Tinder is the only platform you use",
      "You want unlimited Tinder auto-swipe without a recurring bill",
      "You want session stats to see if your filters are working",
      "You prefer owning a license instead of managing another subscription",
    ],
    faqs: [
      {
        question: "Is HackSwipe cheaper than Auto Swiper?",
        answer: `Auto Swiper Pro is $6/month (~$36/year billed yearly); Ultimate is $18/month (~$144/year). HackSwipe Lifetime is ${pricing.saleDisplay} once. After the first year, HackSwipe costs nothing extra for unlimited Tinder auto-swipe on that browser. Auto Swiper requires ongoing payment to keep swiping unlocked.`,
      },
      {
        question: "Can Auto Swiper filter as precisely as HackSwipe on Tinder?",
        answer:
          "Auto Swiper's free tier includes age range, minimum photos, and up to 10 banned words shared across all the platforms it supports. HackSwipe's filters are built specifically for Tinder, with the same core controls plus per-session stats to check they're working.",
      },
      {
        question: "Do both tools keep data in the browser?",
        answer:
          "HackSwipe stores your filters and session stats locally in Chrome storage on your device. Auto Swiper is account-based across its supported platforms; check their privacy policy for details on data handling.",
      },
    ],
  },
  {
    slug: "hackswipe-vs-swipemate",
    competitorId: "swipeMate",
    title: "HackSwipe vs SwipeMate",
    description:
      "Compare HackSwipe and SwipeMate for Tinder auto-swiping: filter transparency, human-like delays, session stats, and one-time pricing.",
    keywords: [
      "HackSwipe vs SwipeMate",
      "SwipeMate alternative",
      "SwipeMate Tinder auto swiper",
      "Tinder auto swiper Chrome extension",
      "Tinder auto liker comparison",
    ],
    tldr: `SwipeMate is a Tinder-only Chrome extension marketed as a one-time purchase, with AI-driven swiping and a location-change feature. HackSwipe is also Tinder-only and one-time (${pricing.saleDisplay} after a ${product.freeTrialDays}-day free trial), with transparent filters, human-like delays, and per-session stats.`,
    intro:
      "SwipeMate and HackSwipe both auto-swipe Tinder and both sell a one-time license instead of a subscription. The real differences are in filter transparency, what you can see about each session, and how each tool explains what it's doing on your account.",
    sections: [
      {
        title: "What is SwipeMate?",
        paragraphs: [
          "SwipeMate (Tinder Auto Swiper) is a Chrome extension listed on the Chrome Web Store that automates swiping on Tinder. Its listing highlights AI-driven swiping, a location-change feature (set a custom latitude and longitude to swipe in other cities), and custom controls for age range, speed, and swipe frequency.",
          "SwipeMate is marketed as a one-time payment for lifetime access rather than a subscription, similar to HackSwipe's billing model. The specific price is shown at checkout on their Chrome Web Store listing rather than published on a pricing page.",
        ],
      },
      {
        title: "What does HackSwipe offer?",
        paragraphs: [
          `${product.name} auto-swipes Tinder using filters you set: age range, distance, minimum photo count, and bio keyword bans. Human-like delays between swipes are on by default, and every session shows swipes, matches, and time saved.`,
          `Every install includes a ${product.freeTrialDays}-day free trial before you need ${product.proName}, which is ${pricing.saleDisplay} once (regular ${pricing.originalDisplay}).`,
        ],
      },
      {
        title: "One-time payment vs one-time payment",
        paragraphs: [
          "Both tools avoid a monthly subscription for the core auto-swipe feature, which puts them in the same billing category. The difference is what you get for that one-time payment and how clearly it's explained before you buy.",
          `HackSwipe publishes its price (${pricing.saleDisplay}) and free trial length up front. SwipeMate's price is shown at checkout on the Chrome Web Store rather than on a public pricing page, so you'll want to confirm the current price on their listing before buying.`,
        ],
      },
      {
        title: "Filters and location features",
        paragraphs: [
          "SwipeMate's listing highlights age range, swipe speed and frequency controls, and a location-change feature to swipe as if you were in a different city.",
          "HackSwipe focuses on filters that reduce time wasted on profiles you'd reject anyway: age range, distance, minimum photos, and bio keyword bans, plus session stats so you can see the filters working.",
        ],
      },
      {
        title: "Being honest about the risk",
        paragraphs: [
          "Both tools automate actions on Tinder, which can violate Tinder's terms of service regardless of which extension you use. Location spoofing is an additional layer of automation on top of auto-swipe and carries its own risk.",
          "HackSwipe uses randomized, human-like delays to reduce (not eliminate) the risk of being flagged as automated. Read Tinder's terms of service and our legal notice before using any auto-swiper on your account.",
        ],
      },
    ],
    tableRows: [
      {
        feature: "Billing model",
        hackSwipe: `${pricing.saleDisplay} once, published price`,
        competitor: "One-time purchase, price shown at checkout",
        highlight: true,
      },
      {
        feature: "Free trial",
        hackSwipe: `${product.freeTrialDays}-day free trial`,
        competitor: "Not published",
      },
      {
        feature: "Filters: age, distance, photos, keywords",
        hackSwipe: true,
        competitor: "Age and speed controls",
      },
      {
        feature: "Human-like swipe delays",
        hackSwipe: true,
        competitor: "AI-driven swiping (details not published)",
      },
      {
        feature: "Location change / spoofing",
        hackSwipe: false,
        competitor: true,
      },
      {
        feature: "Session stats (swipes, matches, time saved)",
        hackSwipe: true,
        competitor: "Not published",
      },
      {
        feature: "Data stays in your browser",
        hackSwipe: true,
        competitor: "Not published",
      },
    ],
    competitorOffers: [
      "Tinder-only Chrome extension",
      "AI-driven swiping (per their listing)",
      "Location change: swipe from a custom latitude/longitude",
      "Age range, swipe speed, and frequency controls",
      "Marketed as one-time payment, lifetime access",
      "Price shown at checkout, not published on a pricing page",
    ],
    hackSwipeOffers: [
      "Tinder-only Chrome extension",
      `${product.freeTrialDays}-day free trial, published ${pricing.saleDisplay} Lifetime price`,
      "Age, distance, photo, and bio keyword filters",
      "Human-like delays and per-session stats",
      "No location spoofing, filters and delays only",
      "One-time license, no monthly renewal",
    ],
    chooseCompetitorWhen: [
      "You want to swipe as if you were in a different city (location spoofing)",
      "You prefer AI-driven swipe decisions over explicit keyword filters",
      "You're comfortable confirming price at checkout rather than on a public page",
    ],
    chooseHackSwipeWhen: [
      "You want a published price and free trial before you buy",
      "You want explicit control over age, distance, photos, and banned keywords",
      "You want session stats to check your filters are actually working",
      "You'd rather avoid location spoofing on top of auto-swipe",
    ],
    faqs: [
      {
        question: "Is HackSwipe cheaper than SwipeMate?",
        answer: `HackSwipe Lifetime is a published ${pricing.saleDisplay} one-time payment after a ${product.freeTrialDays}-day free trial. SwipeMate's price is shown at checkout on the Chrome Web Store rather than published on a pricing page, so you'll need to check their listing directly to compare.`,
      },
      {
        question: "Does SwipeMate use human-like delays like HackSwipe?",
        answer:
          "SwipeMate's listing mentions AI-driven swiping and custom speed and frequency controls, but does not publish specifics on delay randomization. HackSwipe uses randomized, human-like delays between swipes by default and lets you adjust the speed in Settings.",
      },
      {
        question: "Which is better for filtering out profiles you don't want?",
        answer:
          "HackSwipe filters on age range, distance, minimum photo count, and bio keyword bans, all visible and adjustable in Settings. SwipeMate's public listing highlights age range and swipe controls; keyword filtering is not part of their published feature list.",
      },
    ],
  },
  {
    slug: "hackswipe-vs-matched",
    competitorId: "matchedAutoSwiper",
    useMainComparisonTable: true,
    title: "HackSwipe vs Matched",
    description:
      "Compare HackSwipe and Matched (Matched Auto Swiper) for Tinder auto-swiping: free swipe limits, monthly pricing, filters, and one-time vs subscription billing.",
    keywords: [
      "HackSwipe vs Matched",
      "Matched auto swiper alternative",
      "Matched Tinder extension comparison",
      "Tinder auto swiper subscription vs one-time",
    ],
    tldr: `Matched gives you 25 free swipes per day, then $5/month for unlimited swipes on Tinder. HackSwipe gives you a full ${product.freeTrialDays}-day free trial to test your filters, then a one-time ${pricing.saleDisplay} payment instead of an ongoing monthly charge.`,
    intro:
      "Matched and HackSwipe are both Tinder-only Chrome extensions with smart filters and auto-swipe. The main difference is billing: Matched resets your free swipes every day and charges monthly for unlimited use, while HackSwipe gives you a longer trial window and then a single payment.",
    sections: [
      {
        title: "What is Matched?",
        paragraphs: [
          "Matched (Matched: Auto-swiper for Tinder) is a Chrome extension listed on the Chrome Web Store. It automates swiping on Tinder with filters for minimum photos, banned terms, and swipe limits.",
          "Their published pricing gives you 25 free swipes per day on the free version. Matched Premium is $5 per month for unlimited swipes, advanced profile filters, and \"human-like interaction\" claims on their listing.",
        ],
      },
      {
        title: "What does HackSwipe offer?",
        paragraphs: [
          `${product.name} auto-swipes Tinder using filters you configure: age range, distance, minimum photo count, and bio keyword bans, with human-like delays and per-session stats.`,
          `Every install starts with a ${product.freeTrialDays}-day free trial instead of a daily swipe cap that resets. ${product.proName} is then a one-time ${pricing.saleDisplay} payment (regular ${pricing.originalDisplay}) for unlimited auto-swipe on one browser install.`,
        ],
      },
      {
        title: "Daily swipe cap vs a full trial window",
        paragraphs: [
          "Matched's free tier resets to 25 swipes every day, which works for light use but means you're capped again tomorrow even if you didn't use all 25 swipes today.",
          `HackSwipe's ${product.freeTrialDays}-day free trial gives you unlimited auto-swipe during the trial itself, so you can properly test your filters on real sessions before deciding to buy.`,
        ],
      },
      {
        title: "How does pricing compare over time?",
        paragraphs: [
          "Matched Premium: $5/month, or about $60/year if you stay subscribed. Year two and year three cost the same again.",
          `HackSwipe Lifetime: ${pricing.saleDisplay} one-time. Over three years, Matched Premium is roughly $180 in subscription fees versus ${pricing.saleDisplay} total for HackSwipe on that browser.`,
          oneTimePitch.footnote,
        ],
      },
      {
        title: "Filters and age range",
        paragraphs: [
          "Matched's published filters include minimum photos, banned terms, and swipe limits, with age range and distance not called out specifically in their listing.",
          "HackSwipe filters on age range, distance, minimum photos, and bio keyword bans together, so you can narrow who gets swiped right on all four dimensions at once.",
        ],
      },
    ],
    competitorOffers: [
      "Tinder-only auto-swiper with smart filters",
      "Free: 25 swipes/day (resets daily)",
      "Premium: $5/month for unlimited swipes",
      "Filters: minimum photos, banned terms, swipe limits",
      "Claims \"human-like interaction\" on their listing",
      "Ongoing subscription required for unlimited swipes",
    ],
    hackSwipeOffers: [
      "Tinder-only auto-swiper with filters and delays",
      `${product.freeTrialDays}-day free trial, unlimited swipes during trial`,
      `Lifetime: ${pricing.saleDisplay} once, unlimited Tinder auto-swipe`,
      "Filters: age range, distance, minimum photos, bio keywords",
      "Randomized human-like delays you control",
      "One-time license, no monthly renewal",
    ],
    chooseCompetitorWhen: [
      "Light, occasional swiping fits inside 25 free swipes per day",
      "A $5/month budget is fine indefinitely",
      "You don't need age range or distance filtering specifically",
    ],
    chooseHackSwipeWhen: [
      "You want to test unlimited auto-swipe during a real trial, not a daily cap",
      "You want age range and distance filters alongside photos and keywords",
      "You'd rather pay once than manage a $5/month subscription long-term",
      "You want session stats showing swipes, matches, and time saved",
    ],
    faqs: [
      {
        question: "Is HackSwipe cheaper than Matched?",
        answer: `Matched Premium is $5/month (about $60/year). HackSwipe Lifetime is ${pricing.saleDisplay} once. After the first year, HackSwipe has no recurring fee for unlimited Tinder auto-swipe on that browser, while Matched keeps billing monthly.`,
      },
      {
        question: "Does Matched's free tier compare to HackSwipe's free trial?",
        answer: `Matched's free tier gives you 25 swipes per day, resetting daily but capped each day. HackSwipe's ${product.freeTrialDays}-day free trial gives you unlimited auto-swipe for the full trial window, so you can test your exact filters on a real session instead of a capped daily allowance.`,
      },
      {
        question: "Which has better filters for narrowing down matches?",
        answer:
          "Matched's public filters cover minimum photos, banned terms, and swipe limits. HackSwipe adds age range and distance to that list, so you can filter on all four at once: age, distance, photos, and keywords.",
      },
    ],
  },
] as const;

export function getComparePageBySlug(slug: string): ComparePage | undefined {
  return comparePages.find((page) => page.slug === slug);
}

export function getRelatedComparePages(slug: string): ComparePage[] {
  return comparePages.filter((page) => page.slug !== slug);
}

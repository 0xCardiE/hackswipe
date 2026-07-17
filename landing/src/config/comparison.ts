import { pricing } from "@/lib/pricing";
import { product } from "./product";

export const competitors = {
  autoSwiper: {
    name: "Auto Swiper",
    url: "https://auto-swiper.ch/",
    comparePath: "/compare/hackswipe-vs-auto-swiper",
    focus: "Multi-platform auto-swiper (Tinder, Bumble, Hinge, Badoo, and more)",
    freeTier: "100 swipes/run, 500 swipes/day",
    paidTier: "Pro from $6/mo ($36/yr) to Ultimate $18/mo ($144/yr)",
    billing: "Monthly or yearly subscription",
  },
  swipeMate: {
    name: "SwipeMate",
    url: "https://chromewebstore.google.com/detail/swipemate-tinder-auto-swi/malfoopogndabepliinjjiebdepaphkn",
    comparePath: "/compare/hackswipe-vs-swipemate",
    focus: "Tinder-only Chrome extension with AI-driven swiping and location spoofing",
    freeTier: "No published free tier",
    paidTier: "Marketed as a one-time purchase (price shown at checkout on their listing)",
    billing: "One-time payment, per their Chrome Web Store listing",
  },
  matchedAutoSwiper: {
    name: "Matched",
    url: "https://chromewebstore.google.com/detail/matched-auto-swiper-for-t/dfdbjcpahkjialghelodmmclcalppdmk",
    comparePath: "/compare/hackswipe-vs-matched",
    focus: "Tinder-only Chrome extension with smart filters and auto-swipe",
    freeTier: "25 swipes/day free",
    paidTier: "Premium $5/month for unlimited swipes",
    billing: "Monthly subscription",
  },
} as const;

export type ComparisonCell = boolean | string;

export type TwoColumnComparisonRow = {
  feature: string;
  hackSwipe: ComparisonCell;
  competitor: ComparisonCell;
  highlight?: boolean;
};

export type ComparisonRow = {
  feature: string;
  hackSwipe: ComparisonCell;
  autoSwiper: ComparisonCell;
  matchedAutoSwiper: ComparisonCell;
  highlight?: boolean;
};

export const comparisonIntro =
  "Auto Swiper and Matched charge every month to keep auto-swipe unlocked. HackSwipe Lifetime is a one-time license: pay once, keep auto-swiping Tinder for as long as you use the extension.";

export const comparisonRows: readonly ComparisonRow[] = [
  {
    feature: "Lifetime pricing",
    hackSwipe: `${pricing.saleDisplay} once (after free trial)`,
    autoSwiper: "$6 to $18/mo",
    matchedAutoSwiper: "$5/mo",
    highlight: true,
  },
  {
    feature: "Billing model",
    hackSwipe: "One-time license",
    autoSwiper: "Subscription",
    matchedAutoSwiper: "Subscription",
    highlight: true,
  },
  {
    feature: "Platforms supported",
    hackSwipe: "Tinder only",
    autoSwiper: "Tinder, Bumble, Hinge, Badoo, and more",
    matchedAutoSwiper: "Tinder only",
  },
  {
    feature: "Free trial",
    hackSwipe: `${product.freeTrialDays}-day free trial`,
    autoSwiper: "100 swipes/run, 500/day free",
    matchedAutoSwiper: "25 swipes/day free",
  },
  {
    feature: "Filters: age, distance, photos, keywords",
    hackSwipe: true,
    autoSwiper: true,
    matchedAutoSwiper: "Photos and keywords",
  },
  {
    feature: "Human-like swipe delays",
    hackSwipe: true,
    autoSwiper: true,
    matchedAutoSwiper: true,
  },
  {
    feature: "Session stats (swipes, matches, time saved)",
    hackSwipe: true,
    autoSwiper: "Swipe counts only",
    matchedAutoSwiper: false,
  },
  {
    feature: "Data stays in your browser",
    hackSwipe: true,
    autoSwiper: false,
    matchedAutoSwiper: false,
  },
  {
    feature: "Subscription to manage",
    hackSwipe: "None. You own the license",
    autoSwiper: "Cancel or keep paying",
    matchedAutoSwiper: "Cancel or keep paying",
    highlight: true,
  },
] as const;

export const costOverTime = [
  {
    period: "Year 1",
    hackSwipe: pricing.saleDisplay,
    autoSwiper: "~$36 (Pro, yearly)",
    matchedAutoSwiper: "~$60 ($5/mo)",
  },
  {
    period: "Year 2",
    hackSwipe: "$0",
    autoSwiper: "~$36",
    matchedAutoSwiper: "~$60",
  },
  {
    period: "3-year total",
    hackSwipe: pricing.saleDisplay,
    autoSwiper: "~$108",
    matchedAutoSwiper: "~$180",
  },
] as const;

export const oneTimePitch = {
  headline: "Pay once. Swipe forever.",
  body: `${product.proName} is ${pricing.saleDisplay} after a ${product.freeTrialDays}-day free trial (regular ${pricing.originalDisplay}). No monthly invoice, no subscription to remember to cancel. Auto Swiper and Matched charge every month for the same auto-swipe feature.`,
  footnote:
    "Competitor pricing based on public pages at auto-swiper.ch and the SwipeMate and Matched Chrome Web Store listings as of 2026. Their plans and prices may change.",
};

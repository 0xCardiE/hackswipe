import { platformsShort, product } from "./product";
import { pricing } from "@/lib/pricing";

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: readonly FaqItem[] = [
  {
    question: "What is HackSwipe?",
    answer:
      "HackSwipe is a Chrome extension that auto-swipes on Tinder using filters you set: age range, distance, minimum photo count, and bio keywords to ban. It swipes right on profiles that pass your filters so you can spend less time swiping and more time picking who to actually talk to.",
  },
  {
    question: "How does the free trial work?",
    answer: `You get a ${product.freeTrialDays}-day free trial after installing the extension. Set your filters and run auto-swipe on real Tinder sessions during the trial. After ${product.freeTrialDays} days, activate ${product.proName} to keep auto-swiping.`,
  },
  {
    question: "How much does HackSwipe cost?",
    answer: `${product.proName} is a one-time payment of ${pricing.saleDisplay} (regular ${pricing.originalDisplay}). No monthly subscription. Pay once, keep using auto-swipe on Tinder for as long as you use the extension.`,
  },
  {
    question: "What filters can I set?",
    answer:
      "Age range, maximum distance, minimum number of photos, and a list of bio keywords to ban (spam accounts, OnlyFans plugs, dealbreaker phrases). HackSwipe only swipes right on profiles that pass every filter you turn on.",
  },
  {
    question: "Will using an auto-swiper get my Tinder account banned?",
    answer:
      "Automating swipes may violate Tinder's terms of service, and Tinder can restrict or ban accounts it flags as automated. HackSwipe uses randomized, human-like delays between swipes to reduce that risk, but no auto-swiper can guarantee your account is safe. Use it at your own risk and read Tinder's terms of service first.",
  },
  {
    question: "Is HackSwipe affiliated with Tinder?",
    answer:
      "No. HackSwipe is an independent tool built by a third party. It is not affiliated with, endorsed by, or operated by Tinder or its parent company, Match Group, LLC.",
  },
  {
    question: "How do I activate my HackSwipe Lifetime license?",
    answer:
      "After checkout, you receive a license key by email. Open the extension, go to Settings, enter your email and license key, and click Activate. One license works on one browser installation.",
  },
  {
    question: "Does HackSwipe work on Bumble, Hinge, or other apps?",
    answer:
      `No. ${product.name} supports ${platformsShort} web only, at tinder.com. It does not support Bumble, Hinge, Match, or any other dating app.`,
  },
  {
    question: "What happens when Tinder changes its website?",
    answer:
      "Tinder updates its web app periodically, which can break auto-swipe selectors temporarily. HackSwipe Lifetime includes free updates for the life of your license, and we ship fixes when Tinder changes its UI.",
  },
  {
    question: "Does HackSwipe swipe with human-like delays?",
    answer:
      "Yes. HackSwipe adds randomized delays between swipes instead of swiping at a fixed, obviously automated interval. You can adjust the swipe speed in Settings.",
  },
  {
    question: "Does HackSwipe message my matches for me?",
    answer:
      "No. HackSwipe only automates the swipe. When someone likes you back, you see the mutual like and decide yourself whether to message them. We do not auto-message anyone on your behalf.",
  },
  {
    question: "Where does my filter and activity data live?",
    answer:
      "Your filters and swipe activity are stored locally in your browser using Chrome storage. We do not upload your Tinder activity to our servers.",
  },
  {
    question: "Why is a one-time payment better than a subscription?",
    answer: `Competitors like Auto Swiper (auto-swiper.ch) charge $6 to $18 per month, and Matched charges $5 per month, just to keep auto-swipe unlocked. ${product.proName} is a single payment of ${pricing.saleDisplay}: no recurring bill, no reason to remember to cancel.`,
  },
  {
    question: "How does HackSwipe compare to Auto Swiper?",
    answer:
      "Auto Swiper (auto-swiper.ch) auto-swipes across Tinder, Bumble, Hinge, and several other apps on a monthly or yearly subscription ($6 to $18/mo). HackSwipe focuses on Tinder only, with the same filter and delay controls, for a one-time payment instead of a recurring bill. See our full comparison for details.",
  },
  {
    question: "How does HackSwipe compare to SwipeMate?",
    answer:
      "SwipeMate is a Tinder-only Chrome extension with AI-driven swiping and a location-change feature, sold as a one-time purchase on the Chrome Web Store. HackSwipe focuses on transparent filters (age, distance, photos, keywords), human-like delays, and per-session stats, also as a one-time payment. See our SwipeMate comparison for a full breakdown.",
  },
  {
    question: "How does HackSwipe compare to Matched?",
    answer:
      "Matched offers 25 free swipes per day, then $5 per month for unlimited swipes on Tinder. HackSwipe gives you a full free trial to test your filters, then a one-time payment instead of an ongoing monthly charge. See our Matched comparison for details.",
  },
] as const;

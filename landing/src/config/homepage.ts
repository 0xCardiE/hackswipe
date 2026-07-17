import { platformsShort, product } from "./product";

export type ProblemItem = {
  title: string;
  body: string;
};

export const problemItems: readonly ProblemItem[] = [
  {
    title: "Wasting hours swiping every night",
    body: "Manually swiping through hundreds of profiles just to find a handful worth matching with isn't a hobby, it's a chore.",
  },
  {
    title: "Paying for Gold just to see who liked you",
    body: `${product.name} auto-swipes with your filters for free during the trial, then a one-time payment. No monthly Gold, Boost, or Super Like bill.`,
  },
  {
    title: "Decision fatigue after the first fifty profiles",
    body: "Your filters don't get tired. Set them once and let HackSwipe keep swiping at the same standard, profile two or two hundred.",
  },
  {
    title: `${platformsShort} makes money from your impatience`,
    body: "Every Boost and Super Like exists to make swiping manually feel slower. Auto-swipe removes the reason to buy them.",
  },
];

export const goodFitItems: readonly string[] = [
  `Active on ${platformsShort} web (tinder.com) and tired of manual swiping`,
  "Want filters (age, distance, photos, bio keywords) to do the screening for you",
  "Would rather review mutual likes than swipe on every profile",
  "Want to stop paying for Gold, Boosts, or Super Likes just to move faster",
];

export const notFitItems: readonly string[] = [
  "Looking for Bumble, Hinge, or another dating app (Tinder web only)",
  "Want an app that also auto-messages matches for you",
  "Prefer to hand-review every single profile before swiping",
  "Need a mobile app instead of a Chrome extension on desktop",
];

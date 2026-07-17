export const platformsShort = "Tinder";
export const platformsLabel = "Tinder";

export const product = {
  name: "HackSwipe",
  proName: "HackSwipe Lifetime",
  metaTitle: "HackSwipe | Auto-Swipe Tinder Without Paying for Gold",
  tagline: "Get matches without buying Gold.",
  description:
    "HackSwipe is a Chrome extension that auto-swipes Tinder using your filters: age, distance, minimum photos, and bio keywords. Human-like delays keep swiping natural. When someone likes you back, you choose who you actually want. Not affiliated with Tinder or Match Group.",
  chromeStoreUrl: "#",
  /** Free trial length before Lifetime purchase is required */
  freeTrialDays: 3,
  features: [
    {
      title: "Filters that do the work",
      description:
        "Set age range, distance, minimum photo count, and bio keyword bans once. HackSwipe only swipes right on profiles that pass your filters.",
    },
    {
      title: "Human-like swipe delays",
      description:
        "Random delays between swipes so activity looks like a person browsing, not a script. You control the speed.",
    },
    {
      title: "Keyword bans, not guesswork",
      description:
        "Ban bio keywords you don't want to see (OnlyFans plugs, spam accounts, dealbreaker phrases) and HackSwipe skips those profiles automatically.",
    },
    {
      title: "Stats on every session",
      description:
        "See swipes, matches, and time saved for each session, so you know the filters are actually working before you commit to a night of swiping.",
    },
    {
      title: "Free updates for life",
      description:
        "Tinder changes its web UI often. HackSwipe Lifetime includes updates that keep auto-swipe working, with no renewal fee.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Install the Chrome extension",
      description:
        "Add HackSwipe to Chrome. No account or API keys needed, just Tinder open in a tab at tinder.com.",
    },
    {
      step: "2",
      title: "Set your filters",
      description:
        "Age range, distance, minimum photos, and bio keywords to ban. Takes under a minute to configure once.",
    },
    {
      step: "3",
      title: "Start auto-swipe, come back to matches",
      description:
        "Click start and let HackSwipe swipe right on profiles that pass your filters. When someone likes you back, you pick who you actually want to talk to.",
    },
  ],
} as const;

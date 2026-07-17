export type ChangelogEntry = {
  version: string;
  date: string;
  summary: string;
  changes: readonly string[];
};

export const changelogEntries: readonly ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "July 2026",
    summary: "Initial public release of HackSwipe.",
    changes: [
      "Auto-swipe on Tinder web (tinder.com) using your filters.",
      "Filters: age range, distance, minimum photo count, and bio keyword bans.",
      "Randomized, human-like delays between swipes.",
      "Session stats: swipes, matches, and time saved.",
      "3-day free trial and HackSwipe Lifetime license for unlimited auto-swipe.",
      "All filters and session data stored locally in your browser.",
    ],
  },
] as const;

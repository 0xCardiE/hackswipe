export type GuideSection = {
  title: string;
  paragraphs: readonly string[];
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  keywords: readonly string[];
  intro: string;
  sections: readonly GuideSection[];
  relatedSlugs?: readonly string[];
};

export const guides: readonly Guide[] = [
  {
    slug: "how-to-auto-swipe-on-tinder",
    title: "How to Auto-Swipe on Tinder",
    description:
      "A practical walkthrough for auto-swiping on Tinder web: installing an extension, setting filters, and reviewing matches instead of swiping manually.",
    keywords: [
      "how to auto swipe on tinder",
      "auto swipe tinder",
      "tinder auto swiper",
      "automate tinder swiping",
      "tinder bot swipe",
    ],
    intro:
      "Auto-swiping on Tinder means letting a Chrome extension swipe right on profiles that pass your filters, so you only have to review the people who like you back. Here's how the workflow actually works, step by step, using HackSwipe as the example.",
    relatedSlugs: [
      "tinder-filters-that-actually-work",
      "stop-paying-for-tinder-gold",
      "tinder-auto-swiper-chrome-extension",
    ],
    sections: [
      {
        title: "What auto-swiping actually does",
        paragraphs: [
          "An auto-swiper reads the profile on your screen on tinder.com and decides whether to swipe right or left based on filters you set: age range, distance, minimum photo count, and bio keywords to avoid. It doesn't message anyone or make decisions about who you'll actually date.",
          "The point isn't to \"win\" Tinder. It's to stop spending an hour a night swiping through profiles you'd reject in half a second anyway, so you can spend that time on the mutual likes that are actually worth a conversation.",
        ],
      },
      {
        title: "Step 1: Install the extension",
        paragraphs: [
          "Install HackSwipe from the Chrome Web Store. No account is required to install, and it works on tinder.com in a normal Chrome tab on desktop.",
          "You get a free trial before you need to buy anything, so you can test the whole workflow on your real Tinder account first.",
        ],
      },
      {
        title: "Step 2: Set your filters",
        paragraphs: [
          "Open the extension on tinder.com and set your age range, maximum distance, minimum photo count, and any bio keywords you want to ban (spam accounts, OnlyFans plugs, dealbreaker phrases).",
          "This step takes under a minute, but it's the part that matters most. Loose filters mean more swipes but less relevant matches; tight filters mean fewer, more relevant matches. Start reasonably tight and loosen if you're not getting enough activity.",
        ],
      },
      {
        title: "Step 3: Start auto-swipe and review matches",
        paragraphs: [
          "Click start. HackSwipe swipes right on profiles that pass your filters, with randomized delays between swipes so activity looks like a person browsing.",
          "When someone likes you back, that's a mutual like: a real match. You review it yourself and decide whether to say hello. The extension never messages anyone for you.",
          "Check the session stats when you come back: swipes made, matches found, and time saved compared to swiping manually.",
        ],
      },
      {
        title: "Is this against Tinder's rules?",
        paragraphs: [
          "Automating swipes may violate Tinder's terms of service, and Tinder can restrict or ban accounts flagged as automated. No auto-swiper can guarantee your account is safe.",
          "Human-like delays reduce the risk of your activity looking scripted, but they don't eliminate it. Read Tinder's terms of service and decide for yourself whether the trade-off is worth it before you turn on auto-swipe.",
        ],
      },
    ],
  },
  {
    slug: "tinder-filters-that-actually-work",
    title: "Tinder Filters That Actually Work",
    description:
      "Which Tinder auto-swipe filters actually cut down bad matches: age range, distance, minimum photos, and bio keyword bans, and how to tune each one.",
    keywords: [
      "tinder filters that work",
      "tinder auto swipe filters",
      "tinder bio keyword filter",
      "tinder distance filter",
      "best tinder filter settings",
    ],
    intro:
      "Auto-swipe filters are only as good as the settings behind them. Loose filters swipe right on almost everyone; overly tight filters barely swipe at all. Here's what each HackSwipe filter actually does and how to tune it.",
    relatedSlugs: [
      "how-to-auto-swipe-on-tinder",
      "stop-paying-for-tinder-gold",
      "tinder-auto-swiper-chrome-extension",
    ],
    sections: [
      {
        title: "Age range",
        paragraphs: [
          "This is the most obvious filter, but people often set it too wide out of fear of missing someone. A narrower range means fewer, more relevant matches; a wider range means more swipes and more mutual likes to sort through.",
          "If you're getting mutual likes you're not interested in, tighten the age range before touching anything else. It's usually the single biggest lever.",
        ],
      },
      {
        title: "Distance",
        paragraphs: [
          "Distance filters out profiles too far away to realistically meet up with. If you don't drive or don't want a long commute for a first date, set this tighter than Tinder's own default.",
          "A common mistake is leaving distance wide open \"just in case.\" Unless you're actively planning to travel, tighter distance means less swiping on profiles that were never realistic matches in the first place.",
        ],
      },
      {
        title: "Minimum photo count",
        paragraphs: [
          "Profiles with one blurry photo are a bad signal more often than not, whether that's an inactive account, a fake profile, or someone who just isn't putting effort in. Requiring at least 3 to 4 photos filters most of those out automatically.",
          "This filter alone tends to noticeably improve match quality with very little tuning required.",
        ],
      },
      {
        title: "Bio keyword bans",
        paragraphs: [
          "Ban specific words or phrases that show up in bios you don't want: OnlyFans or subscription plugs, spam account patterns, or plain dealbreaker phrases specific to what you're looking for.",
          "Keep this list short and specific at first. A handful of well-chosen banned words does more than a huge list of vague terms that might accidentally exclude people you'd actually like.",
        ],
      },
      {
        title: "Tuning your filters over a few sessions",
        paragraphs: [
          "Run a session, check your stats (swipes, matches, time saved), and look at who you matched with. If matches feel off, adjust one filter at a time rather than all four at once, so you can tell what actually changed the outcome.",
          "Filters that work well after a week of tuning are worth more than a \"perfect\" set of filters guessed on day one.",
        ],
      },
    ],
  },
  {
    slug: "stop-paying-for-tinder-gold",
    title: "How to Stop Paying for Tinder Gold",
    description:
      "Why Tinder Gold, Boosts, and Super Likes exist, what they actually solve, and how filters plus auto-swipe replace most of what people pay for.",
    keywords: [
      "stop paying for tinder gold",
      "tinder gold alternative",
      "tinder gold worth it",
      "avoid tinder gold",
      "tinder subscription alternative",
    ],
    intro:
      "Tinder's paid features (Gold, Platinum, Boosts, Super Likes) are priced to make manual swiping feel slower than it needs to be. Here's what each one actually does, and what replaces the underlying problem without a subscription.",
    relatedSlugs: [
      "how-to-auto-swipe-on-tinder",
      "tinder-filters-that-actually-work",
      "tinder-auto-swiper-chrome-extension",
    ],
    sections: [
      {
        title: "What Tinder Gold and Platinum actually sell",
        paragraphs: [
          "Gold's headline feature is seeing who already liked you. Platinum adds seeing likes plus priority visibility. Both exist to solve the same underlying problem: manual swiping is slow, so seeing your existing likes feels valuable.",
          "The problem isn't that you can't see your likes. It's that getting to a reasonable number of mutual likes in the first place takes far more manual swiping than most people have patience for.",
        ],
      },
      {
        title: "Boosts and Super Likes: paying to skip the queue",
        paragraphs: [
          "A Boost temporarily puts your profile in front of more people. A Super Like tells someone you liked them before they've even seen your profile in their queue. Both are ways to pay for visibility instead of waiting for it.",
          "These features are priced attractively because the alternative (swiping consistently over time to build visibility organically) feels slow. That slowness is the business model, not an accident.",
        ],
      },
      {
        title: "What actually replaces the need to pay",
        paragraphs: [
          "The core problem Gold solves is volume: getting through enough profiles to generate a meaningful number of mutual likes. Auto-swipe with good filters solves the same volume problem directly, without paying for visibility features.",
          "You still see every mutual like for free once it happens. HackSwipe doesn't unlock a paid \"see who liked you\" feature; it just gets you to more mutual likes faster by swiping right on profiles that match your filters while you do something else.",
        ],
      },
      {
        title: "Where a subscription still makes sense",
        paragraphs: [
          "If you want priority placement in a specific city for a short trip, a one-off Boost might still be the right tool for that specific moment. Auto-swipe doesn't replace visibility features, it replaces the need to manually grind through profiles for volume.",
          "The honest comparison: Gold is roughly $20 to $40 per month depending on your market and age bracket, recurring every month you keep it active. HackSwipe Lifetime is a one-time payment, and it doesn't require you to keep paying to keep the auto-swipe feature you already have.",
        ],
      },
    ],
  },
  {
    slug: "tinder-auto-swiper-chrome-extension",
    title: "Tinder Auto Swiper Chrome Extension: What to Look For",
    description:
      "What actually matters when picking a Tinder auto-swiper Chrome extension: filters, delay randomization, pricing model, and safety trade-offs.",
    keywords: [
      "tinder auto swiper chrome extension",
      "best tinder auto swiper",
      "tinder swipe bot extension",
      "chrome extension auto swipe tinder",
      "tinder auto liker extension",
    ],
    intro:
      "There are several Chrome extensions that auto-swipe Tinder, with different filters, pricing models, and delay behavior. Here's what actually matters when you're comparing them, beyond \"does it swipe.\"",
    relatedSlugs: [
      "how-to-auto-swipe-on-tinder",
      "tinder-filters-that-actually-work",
      "stop-paying-for-tinder-gold",
    ],
    sections: [
      {
        title: "Filters: the difference between volume and quality",
        paragraphs: [
          "Any extension can swipe right on everything. The useful ones let you filter by age range, distance, minimum photo count, and bio keywords, so you're only swiping right on profiles that actually pass your standards.",
          "Look for filters you can see and adjust yourself, not a black-box \"AI matching\" claim you can't inspect or tune. Being able to see exactly why a profile was swiped right or left matters when you're troubleshooting match quality.",
        ],
      },
      {
        title: "Human-like delays",
        paragraphs: [
          "Extensions that swipe at a fixed, mechanical interval are easier for Tinder to flag as automated. Randomized delays between swipes, closer to how a person actually browses, reduce that risk without eliminating it entirely.",
          "If an extension doesn't mention delay behavior at all, assume it's swiping at a fixed rate and factor that into your risk tolerance.",
        ],
      },
      {
        title: "One-time payment vs subscription",
        paragraphs: [
          "Some Tinder auto-swipers charge a recurring monthly fee ($5 to $18/month across different tools), often across multiple platforms you may not use. Others sell a one-time license for Tinder specifically.",
          "If you're only using the tool on Tinder, a one-time payment for a Tinder-specific tool usually costs less over a year or more than a multi-platform subscription you're only using for one app.",
        ],
      },
      {
        title: "Session visibility",
        paragraphs: [
          "A good extension shows you what happened in a session: how many swipes, how many matches, and roughly how much time it saved compared to manual swiping. Without that, you're trusting the tool blindly instead of confirming your filters are actually doing their job.",
          "If you can't see your own session stats, you can't tell whether tightening or loosening a filter actually changed your results.",
        ],
      },
      {
        title: "The trade-off you're accepting either way",
        paragraphs: [
          "Every auto-swiper, regardless of brand, automates an action Tinder's terms of service don't explicitly permit. That risk exists no matter which extension you pick.",
          "Pick a tool with transparent filters, visible delay behavior, and a pricing model you're comfortable with, then decide for yourself whether the time saved is worth the risk. That's a decision worth making deliberately, not by default.",
        ],
      },
    ],
  },
] as const;

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getRelatedGuides(slug: string): Guide[] {
  const current = getGuideBySlug(slug);
  if (current?.relatedSlugs?.length) {
    return current.relatedSlugs
      .map((relatedSlug) => getGuideBySlug(relatedSlug))
      .filter((guide): guide is Guide => guide !== undefined);
  }
  return guides.filter((guide) => guide.slug !== slug).slice(0, 4);
}

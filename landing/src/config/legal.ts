import { product } from "./product";

export const legalPlatforms = [
  {
    name: "Tinder",
    entity: "Match Group, LLC",
    url: "tinder.com",
    trademark:
      '"Tinder" is a trademark of Match Group, LLC. References to Tinder are used solely to describe compatibility with the platform. No endorsement is implied.',
  },
] as const;

export const legal = {
  platformNamesLabel: "Tinder",

  shortDisclaimer:
    `${product.name} is an independent third-party tool. Not affiliated with, endorsed by, or sponsored by Tinder or Match Group.`,

  trademarkNotices: legalPlatforms.map((platform) => platform.trademark),

  userResponsibility:
    "Automating swipes may violate Tinder's terms of service. You are responsible for reviewing Tinder's terms and using this extension at your own risk. We are not responsible for account restrictions, shadowbans, or bans that result from using automation on Tinder.",

  paragraphs: [
    `${product.name} is an independent third-party Chrome extension. It is not affiliated with, endorsed by, or sponsored by Tinder or its parent company, Match Group, LLC.`,
    ...legalPlatforms.map((platform) => platform.trademark),
    "This tool automates swiping on the Tinder web app (tinder.com) you have open in your browser, using filters you configure. Nothing is uploaded to our servers; your filters and activity stay in your browser.",
    "Automating actions on Tinder may violate Tinder's terms of service. Using HackSwipe is at your own risk, including the risk of account restrictions or bans. Read Tinder's terms of service before using any automation tool on your account.",
    `${product.name} is provided "as is" without warranty. We do not guarantee uninterrupted access if Tinder changes its website.`,
  ],
} as const;

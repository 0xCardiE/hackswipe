# HackSwipe

Chrome extension that auto-swipes Tinder with your filters — so you get matches without buying Gold or spending hours swiping.

**3-day free trial → $20 one-time Lifetime** (includes updates when Tinder changes its UI).

> Not affiliated with Tinder or Match Group. Automation may violate Tinder's terms of service — use at your own risk.

## Repo layout

| Path | Role |
|------|------|
| `extension/` | Chrome MV3 extension (Tinder auto-swipe, filters, trial + license) |
| `landing/` | Next.js marketing site + Stripe Checkout + license email |
| `license-server/` | Express + SQLite license activation API |
| `e2e/` | Playwright checkout + webhook tests |
| `scripts/` | Build, deploy, webhook helpers |
| `store-assets/` | Chrome Web Store screenshots / promo art |

## Quick start

```bash
# License server
cd license-server && cp .env.example .env && npm install && npm run dev

# Landing
cd landing && cp .env.example .env && npm install && npm run dev

# Extension
# Chrome → chrome://extensions → Load unpacked → select extension/
```

Full setup: [SETUP.md](./SETUP.md). Stack decisions: [STACK.md](./STACK.md). Backlog: [TODO.md](./TODO.md).

## Product story

Tinder monetizes impatience (Gold, Boosts, Super Likes). HackSwipe lets you set filters once, auto-swipe with human-like delays, then pick who you actually want when they like you back.

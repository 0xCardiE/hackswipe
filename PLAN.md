# PLAN — HackSwipe (implemented)

Original repurposing plan for this repo: turn a Reddit/X scraper project into a **Tinder auto-swiper** product. This has been implemented — see below for what shipped and where.

## Product summary

**HackSwipe** is a Chrome extension that auto-swipes Tinder using your own filters (age, distance, minimum photos, bio keyword bans), so you get matches without paying for Tinder Gold or spending hours swiping. Human-like delays keep activity looking natural. When someone likes you back, you choose who you actually want to match with — HackSwipe doesn't message or match on your behalf, it only swipes.

**Model:** 3-day free trial, then a one-time $20 Lifetime unlock (includes updates as Tinder's site changes).

## What shipped

| Part | Status | Docs |
|------|--------|------|
| Chrome extension (auto-swipe engine, filters, side panel, trial + license activation) | ✅ Done | [SETUP.md](./SETUP.md) §3 |
| License server (SQLite, one activation per purchase, admin CLI/API) | ✅ Done | [license-server/README.md](./license-server/README.md) |
| Landing site (Next.js, Stripe Checkout, Resend email, guides/compare/FAQ) | ✅ Done | [landing/README.md](./landing/README.md) |
| E2E tests (checkout + webhook → license) | ✅ Done | [e2e/README.md](./e2e/README.md) |
| Domain, service names, Stripe metadata rebranded to HackSwipe | ✅ Done | [STACK.md](./STACK.md) |

## Reference used during the rebuild

Competitor products reviewed for copy/feature ideas (Tinder auto-swipers): SwipeMate, Matched Auto Swiper, Free Auto Swiper for Tinder (Chrome Web Store), auto-swiper.ch, autoswipe.net. Scope stayed **Tinder-only** — no other dating apps in v1.

## Remaining work

See [TODO.md](./TODO.md) for the live backlog (analytics, Sentry, Chrome Web Store publish, live purchase smoke test).

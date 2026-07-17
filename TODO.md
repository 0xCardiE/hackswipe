# HackSwipe — Future TODO

Trackable backlog for the landing + extension product. Focused on what matters for **our** shape (one-time license, Chrome extension, third-party tool that auto-swipes Tinder).

For stack decisions, see [STACK.md](./STACK.md). For install and deployment, see [SETUP.md](./SETUP.md).

---

## Table of contents

1. [Priority legend](#1-priority-legend)
2. [High — before or at launch](#2-high--before-or-at-launch)
3. [Medium — after first sales](#3-medium--after-first-sales)
4. [Low — if product grows](#4-low--if-product-grows)
5. [Already done](#5-already-done)
6. [Quick reference by phase](#6-quick-reference-by-phase)

---

## 1. Priority legend

| Priority | When | Meaning |
|----------|------|---------|
| 🔴 **High** | Before or at launch | Blocks trust, compliance, or revenue if missing |
| 🟡 **Medium** | After first sales | Improves ops, conversion, or discoverability |
| 🟢 **Low** | If product grows | Nice-to-have or only relevant at scale |

Mark done items: `- [x]`. Leave open: `- [ ]`.

---

## 2. High — before or at launch

Trust, compliance, and core funnel gaps.

- [x] **FAQ page** — `/faq` covers filters, affiliation, free trial vs Lifetime, refunds
- [x] **Privacy policy page** — `/privacy`; required for Chrome Web Store and Stripe
- [x] **Refund / license policy page** — `/refund-policy`
- [ ] **Analytics** — PostHog, Plausible, or Vercel Analytics; track `/pricing` → checkout → success
- [ ] **Error monitoring (Sentry)** — webhook failures, checkout errors, email send failures
- [x] **Resend domain + sender** — `licenses@xlcommerce.hr` (shared Resend domain for all products)
- [ ] **Resend deliverability check** — one live purchase or dashboard test → inbox (not spam)
- [ ] **Stripe live mode + production webhook**
- [ ] **Chrome Web Store publish** — live listing; `product.chromeStoreUrl` set
- [ ] **Live purchase smoke test** — real card → email + success key → activate in extension → refund
- [ ] **Production env values** — landing + license server URLs, Resend sender
- [x] **Domain in repo** — `hackswipe.app` in extension, manifest, landing config
- [ ] **Tinder DOM selector monitoring** — Tinder changes its web UI often; watch for auto-swipe breakage

---

## 3. Medium — after first sales

Ops, quality, and growth — not launch blockers.

- [ ] **Rate limiting** — on `/api/purchase/checkout` and webhook
- [x] **Webhook idempotency** — `e2e/tests/webhook.spec.ts`
- [x] **E2E checkout test** — Playwright: checkout → license → success page (`e2e/`)
- [x] **Uptime monitoring** — `license-server/scripts/health-check.sh`
- [x] **DB backup cron** — `license-server/scripts/backup-db.sh`
- [ ] **Testimonials / social proof** — 2–3 quotes on homepage
- [ ] **Blog or how-to content** — e.g. "how to get more Tinder matches without Gold"
- [ ] **Cookie / analytics consent banner** — if analytics added and EU traffic matters
- [ ] **Structured logging** — pino on license server + landing API routes
- [ ] **CI wiring for e2e** — run `npm run test:local` on checkout-related PRs

---

## 4. Low — if product grows

- [ ] **Customer portal (auth)** — self-service license lookup, device reset
- [ ] **Postgres migration** — license server outgrows SQLite
- [ ] **i18n** — non-English markets
- [ ] **MoR payments (Paddle / Lemon Squeezy)** — EU VAT complexity
- [ ] **Subscriptions** — monthly/annual plan alongside Lifetime
- [ ] **Web admin UI for licenses** — replace CLI for day-to-day ops
- [ ] **More dating apps** — Bumble, Hinge, etc., behind the same license model
- [ ] **Smarter filters** — interest/prompt keyword matching, photo quality scoring

---

## 5. Already done

- [x] Next.js landing + Stripe Checkout + webhooks + Resend
- [x] License server (SQLite, activation limits)
- [x] Chrome extension — Tinder auto-swipe engine with age/distance/photo/keyword filters
- [x] 3-day free trial, one-time Lifetime unlock via license activation
- [x] Human-like swipe delays and per-session stats (swipes, likes, nopes, skipped)
- [x] Extension release script (`./scripts/build-extension.sh` → dist / releases / root)
- [x] Legal / trademark disclaimer (`/legal`) — not affiliated with Tinder or Match Group
- [x] Privacy + refund policy pages
- [x] SEO: `lib/seo.ts`, JSON-LD, sitemap, robots
- [x] Compare + guides pages
- [x] E2E Playwright suite (`e2e/`) — checkout + webhook
- [x] Production deploy templates (nginx, systemd, PM2)
- [x] DB backup + health monitor scripts

---

## 6. Quick reference by phase

| Phase | Focus | Status |
|-------|-------|--------|
| **Launch** | Chrome Web Store, live purchase test, analytics/Sentry | Product ✅ — store + polish pending |
| **First sales** | Testimonials, rate limits, CI for e2e | Infra ✅ |
| **Growth** | Blog, more dating apps, structured logging | Not started |

---

*Last updated: July 2026 — HackSwipe (Tinder auto-swiper).*

# HackSwipe — Stack & Technology Choices

What we use today, why we use it, and what we deliberately left out.

This is a **decision log**, not a setup guide. For install and deployment, see [SETUP.md](./SETUP.md). For the prioritized backlog, see [TODO.md](./TODO.md).

---

## Table of contents

1. [Context](#1-context)
2. [What we use now](#2-what-we-use-now)
3. [What we could use but don't](#3-what-we-could-use-but-dont)

---

## 1. Context

The landing site started from **ShipFree-style patterns** (Next.js + Stripe Checkout + webhooks + Resend), not a fork of the full ShipFree boilerplate.

Our product is:

- a **Chrome extension** that auto-swipes on **Tinder** using the user's own filters (age, distance, minimum photos, bio keyword bans)
- a **license server** that stores keys and enforces one activation per purchase
- a **marketing + checkout site** that sells a one-time Lifetime license after a 3-day free trial
- **E2E tests** (`e2e/`) that verify the full paid flow across landing + license server + Stripe

That shape drives most choices: we kept the checkout pipeline, dropped auth/dashboard/database-in-the-landing-app, and built the extension + license backend ourselves. The E2E suite is the automated gate for the revenue path.

---

## 2. What we use now

### Chrome extension (`extension/`)

| Technology | Why we use it |
|------------|---------------|
| **Chrome Manifest V3** | Required platform for a modern Chrome extension |
| **Vanilla JS** | Small surface area; content script and side panel without a build step |
| **`chrome.storage`** | Trial start timestamp, filters, session stats, license/activation state |
| **Side panel UI** | Configure filters and watch live stats while Tinder stays open in the tab |
| **Content script** | `content/tinder.js` — reads swipe cards from the DOM, applies filters, clicks Like/Nope |
| **On-device filtering** | Age, distance, minimum photo count, bio keyword bans — profile data never leaves the browser |

**Job it does:** Auto-swipe right on profiles that pass the user's filters, track swipes/matches/time saved per session, enforce the 3-day free trial, unlock unlimited use via license server activation.

Release builds: `./scripts/build-extension.sh` (sets `HACKSWIPE_ENV=production` in the zip only).

---

### License server (`license-server/`)

| Technology | Why we use it |
|------------|---------------|
| **Node.js + TypeScript** | Same language as landing; easy to maintain |
| **Express** | Simple HTTP API — health, activation, admin |
| **SQLite** (`better-sqlite3`) | One file, no separate DB server |
| **Zod** | Validate env vars and request bodies |
| **Admin CLI + Bearer API** | Create/revoke licenses without a web admin UI |

**Job it does:** Store licenses, activate once per browser install, expose admin endpoints for the landing webhook.

---

### Landing & checkout (`landing/`)

| Technology | Why we use it |
|------------|---------------|
| **Next.js 15 (App Router)** | Marketing pages + API routes in one deploy |
| **React 19** | Next.js default |
| **Tailwind CSS 4** | Fast styling for marketing site |
| **Stripe Checkout** | Hosted payment — PCI handled by Stripe |
| **Stripe webhooks** | Reliable fulfillment on `checkout.session.completed` |
| **Resend** | Transactional email for license keys |
| **Zod** | Typed env validation in `lib/env.ts` |
| **`lib/seo.ts`** | Metadata, canonical URLs, Open Graph, JSON-LD |

**Pages:** `/`, `/pricing`, `/faq`, `/compare`, `/guides`, `/legal`, `/privacy`, `/refund-policy`, `/terms`, `/changelog`, `/purchase/success`, `/purchase/cancel`

**Job it does:** Explain the product (auto-swipe Tinder without paying for Gold), take payment, create license, email key, show key on success page.

---

### E2E tests (`e2e/`)

| Technology | Why we use it |
|------------|---------------|
| **Playwright** | Real Stripe Checkout browser test + HTTP webhook tests |
| **`run.sh`** | Isolated landing (3001) + license-server (13847), tear down after |
| **Signed webhook fixtures** | Webhook tests without Stripe CLI |
| **Isolated SQLite DB** | `e2e/.data/` — never touches dev or production license data |

**Run before shipping checkout changes:** `cd e2e && npm run test:local`

See [e2e/README.md](./e2e/README.md).

---

### Third-party services (production)

| Service | Role |
|---------|------|
| **Stripe** | One-time Lifetime payment |
| **Resend** | License key email |
| **VPS + nginx + PM2/systemd** | Host landing + license server |

---

## 3. What we could use but don't

Grouped by what problem each would solve for **this** product.

### Auth & customer portal

| Could use | Why we skip it now |
|-----------|-------------------|
| **Better-Auth / NextAuth** | License key + email is the credential |
| **Customer dashboard** | Admin CLI/API + email covers v1 |

**Add when:** Self-service license management at scale.

### Database

| Could use | Why we skip it now |
|-----------|-------------------|
| **Postgres on license server** | SQLite is enough for early volume |

### Payments

| Could use | Why we skip it now |
|-----------|-------------------|
| **Stripe Billing / subscriptions** | Product is one-time purchase |
| **MoR (Paddle, Lemon Squeezy)** | Stripe works for a simple global SKU |

### Extension architecture

| Could use | Why we skip it now |
|-----------|-------------------|
| **React/Vite in extension** | Vanilla JS keeps MV3 surface small |
| **Remote/config-driven selectors** | Short, easy-to-extend selector lists are enough while Tinder's DOM changes |

**Add when:** Tinder DOM changes often enough that a remote selector config beats an extension update.

### Observability

| Could use | Why we skip it now |
|-----------|-------------------|
| **Sentry** | Manual logs + Stripe dashboard for v1 |
| **Analytics (PostHog, Plausible)** | Not wired yet — see [TODO.md](./TODO.md) |

---

## Related docs

| File | Contents |
|------|----------|
| [SETUP.md](./SETUP.md) | Install, env vars, deployment |
| [TODO.md](./TODO.md) | Prioritized backlog |
| [e2e/README.md](./e2e/README.md) | E2E test suite |
| [landing/README.md](./landing/README.md) | Landing routes, Stripe flow |
| [license-server/README.md](./license-server/README.md) | License API and admin |

---

*Last updated: July 2026 — HackSwipe (Tinder auto-swiper).*

# HackSwipe — Setup Guide

Complete setup for the Chrome extension, license server, landing/checkout site, and third-party services (Stripe, Resend).

---

## Table of contents

1. [Overview](#1-overview)
2. [Repository layout](#2-repository-layout)
3. [Chrome extension](#3-chrome-extension)
4. [License server](#4-license-server)
5. [Landing page & checkout](#5-landing-page--checkout)
6. [Third-party services](#6-third-party-services)
7. [Local development — full stack](#7-local-development--full-stack)
8. [Production deployment](#8-production-deployment)
9. [E2E tests](#9-e2e-tests)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Overview

**HackSwipe** is a Chrome extension that auto-swipes on **Tinder** using filters you set: age range, distance, minimum photo count, and bio keyword bans. Human-like delays keep swiping natural. When someone likes you back, you choose who you actually want to match with.

| Part | Folder | Purpose |
|------|--------|---------|
| **Extension** | `extension/` | Auto-swipes Tinder, local session stats, license activation |
| **License server** | `license-server/` | Stores licenses, one activation per purchase |
| **Landing site** | `landing/` | Marketing + Stripe checkout → license + email |

### How they connect

```
Customer
  │
  ├─► Landing site (/pricing)
  │     └─► Stripe Checkout (one-time payment)
  │           └─► Webhook (or success-page verify)
  │                 ├─► license-server POST /admin/licenses
  │                 └─► landing → Resend email with license key
  │
  └─► Chrome extension (side panel)
        ├─► Free trial: 3 days of auto-swiping
        └─► Lifetime: unlimited — activate with email + license key
              └─► license-server POST /api/v1/license/activate
```

### Tiers

| Tier | Limit | How to unlock |
|------|-------|---------------|
| **Free trial** | 3 days of auto-swiping | Install extension, no license needed |
| **Lifetime** | Unlimited, forever | Buy on landing site → activate in extension Settings |

---

## 2. Repository layout

```
Tinder Scraper/
├── extension/           Chrome extension (Manifest V3)
│   ├── config.js        URLs and trial length (HACKSWIPE_ENV)
│   ├── content/         tinder.js — auto-swipe engine
│   ├── lib/              storage, license
│   └── ui/              Side panel
├── license-server/      Node.js + TypeScript + SQLite
├── landing/             Next.js marketing + Stripe checkout
├── e2e/                 Playwright checkout + webhook tests
├── scripts/
│   └── build-extension.sh   Store-ready zip (production config)
├── dist/                Build output (gitignored)
├── releases/            Release zips (gitignored)
├── SETUP.md             ← this file
├── STACK.md             Technology decisions
└── TODO.md              Backlog
```

---

## 3. Chrome extension

### 3.1 Load unpacked (development)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select the **`extension/`** folder
4. Open Tinder (`tinder.com`) in a tab
5. Open the side panel from the toolbar icon to set filters and start auto-swipe

### 3.2 Configuration — `extension/config.js`

```javascript
const HACKSWIPE_ENV = "development"; // or "production" in store builds

const HACKSWIPE_CONFIG = Object.freeze({
  ...ENDPOINTS[HACKSWIPE_ENV],
  FREE_TRIAL_DAYS: 3,
});
```

| Setting | Local dev | Production |
|---------|-----------|------------|
| `LICENSE_SERVER_URL` | `http://127.0.0.1:3847` | `https://license.hackswipe.app` |
| `PRO_PURCHASE_URL` | `http://localhost:3000/pricing` | `https://hackswipe.app/pricing` |

Keep **`HACKSWIPE_ENV = "development"`** in source for local work. Release zips from `./scripts/build-extension.sh` patch production automatically.

### 3.3 Host permissions — `extension/manifest.json`

Includes `tinder.com` and license server URLs. Reload the extension after manifest changes.

### 3.4 Package for Chrome Web Store

```bash
./scripts/build-extension.sh
```

Outputs (v1.0.0 example):

- `dist/hackswipe-v1.0.0.zip`
- `releases/hackswipe-v1.0.0.zip`
- `hackswipe-v1.0.0.zip` (repo root)

Upload the zip from `releases/` to the [Chrome Web Store developer dashboard](https://chrome.google.com/webstore/devconsole). Bump `"version"` in `manifest.json` for each release.

After approval, set `chromeStoreUrl` in `landing/src/config/product.ts`.

---

## 4. License server

### 4.1 Local setup

```bash
cd license-server
cp .env.example .env
npm install
npm run dev
```

Runs at **http://127.0.0.1:3847**. Verify: `curl http://127.0.0.1:3847/health`

### 4.2 Environment — `license-server/.env`

| Variable | Required | Description |
|----------|----------|--------------|
| `ADMIN_API_KEY` | **Yes** | Secret for `/admin/*` — must match landing `LICENSE_SERVER_ADMIN_KEY` |
| `PORT` | No | Default `3847` |
| `DATABASE_PATH` | No | Default `./data/licenses.db` |

Create a test license:

```bash
npm run admin -- create user@example.com --notes "manual test"
```

See [license-server/README.md](./license-server/README.md) for production systemd/nginx setup.

---

## 5. Landing page & checkout

### 5.1 Local setup

```bash
cd landing
cp .env.example .env
npm install
npm run dev
```

Site at **http://localhost:3000**

### 5.2 Key env vars — `landing/.env`

See `landing/.env.example`. Minimum for checkout:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
LICENSE_SERVER_URL=http://127.0.0.1:3847
LICENSE_SERVER_ADMIN_KEY=<same as license-server ADMIN_API_KEY>
EMAIL_PROVIDER=log
```

### 5.3 Fulfillment after payment

| Path | Trigger |
|------|---------|
| **Primary** | Stripe webhook → `POST /api/webhooks/stripe` |
| **Backup** | Success page → `GET /api/purchase/verify?session_id=...` |

Both call `fulfillPurchase`: create license via admin API, email key once if newly created.

---

## 6. Third-party services

### Stripe

1. Create a **one-time** product + price in test mode
2. `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID` in `landing/.env`
3. Local webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Test card: `4242 4242 4242 4242`
5. Production webhook: `https://hackswipe.app/api/webhooks/stripe` → `checkout.session.completed`
6. Checkout sets `metadata.product = "hackswipe-lifetime"` on the session (see `landing/src/lib/stripe.ts`)

### Resend

Production:

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_...
EMAIL_FROM=licenses@xlcommerce.hr
EMAIL_FROM_NAME=HackSwipe
```

Dev: `EMAIL_PROVIDER=log` prints license emails to the terminal.

---

## 7. Local development — full stack

**Terminal 1 — License server**

```bash
cd license-server && npm run dev
```

**Terminal 2 — Landing**

```bash
cd landing && npm run dev
```

**Terminal 3 — Stripe webhooks (optional)**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Extension:** Load unpacked from `extension/` with `HACKSWIPE_ENV = "development"`.

### End-to-end test (manual)

1. Open http://localhost:3000/pricing → **Buy Lifetime Access** → pay with test card
2. Success page shows license key
3. Extension → Settings → Lifetime license → enter email + key → **Activate**
4. Auto-swipe Tinder without the 3-day trial limit

### Test without Stripe

```bash
cd license-server
npm run admin -- create you@example.com --notes "local test"
```

Use the printed key in the extension.

---

## 8. Production deployment

| Area | Typical setup |
|------|----------------|
| Landing | PM2 on port 3010 + nginx + SSL → `hackswipe.app` |
| License server | systemd on port 3847 + nginx → `license.hackswipe.app` |
| Stripe | Live keys + webhook to production URL |
| Resend | Shared verified domain `xlcommerce.hr`, `licenses@xlcommerce.hr` |
| Extension | `./scripts/build-extension.sh` → upload zip to Chrome Web Store |

### Pre-launch checklist

- [ ] `./scripts/build-extension.sh` — verify zip has `HACKSWIPE_ENV=production`
- [ ] Chrome Web Store listing (privacy URL, screenshots, Tinder auto-swipe description)
- [ ] Set `product.chromeStoreUrl` after store approval
- [ ] Live purchase smoke test (card → email → activate in extension)
- [ ] `npm run test:local` in `e2e/` green before checkout changes

---

## 9. E2E tests

Automated smoke tests for **checkout + webhook → license**. Does not drive the extension UI.

```bash
cd e2e
npm install
npx playwright install chromium   # first time

npm run test:local                # starts servers + runs all tests
npm run test:webhook              # webhook only (no Stripe keys)
```

Requires Stripe test keys in `e2e/.env` or `landing/.env` for checkout tests.

See [e2e/README.md](./e2e/README.md).

---

## 10. Troubleshooting

### Extension

| Problem | Fix |
|---------|-----|
| Nothing happens on Tinder | Make sure `tinder.com` is open and active in the tab |
| Activation fails | Check license server running; `LICENSE_SERVER_URL` + manifest `host_permissions` |
| Auto-swipe stops working | Tinder changed its DOM — update selectors in `extension/content/tinder.js` |

### Landing / Stripe

| Problem | Fix |
|---------|-----|
| Buy button: payments not configured | Set `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` |
| Payment OK, no license | `LICENSE_SERVER_ADMIN_KEY` must match; server reachable over HTTPS in prod |
| No email | Dev: check terminal (`EMAIL_PROVIDER=log`); prod: Resend domain + `EMAIL_FROM` |

### Useful commands

```bash
curl http://127.0.0.1:3847/health
cd license-server && npm run admin -- list
cd landing && npm run build
cd e2e && npm run test:local
./scripts/build-extension.sh
```

---

## Quick reference — which file to edit

| Goal | File |
|------|------|
| Free trial length | `extension/config.js` → `FREE_TRIAL_DAYS` |
| License server URL in extension | `extension/config.js` + `manifest.json` host_permissions |
| Purchase link in extension | `extension/config.js` → `PRO_PURCHASE_URL` |
| Stripe / email / landing | `landing/.env` |
| Marketing copy & product config | `landing/src/config/product.ts` |
| Store-ready zip | `./scripts/build-extension.sh` |

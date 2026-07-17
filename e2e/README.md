# HackSwipe E2E tests

Playwright smoke tests for the **paid purchase path** across `landing/` and `license-server/`. The Chrome extension is not driven in-browser here — these tests prove checkout, webhook fulfillment, and license creation still work after changes.

## What is covered

| Test | Needs Stripe API? | Proves |
|------|-------------------|--------|
| `tests/webhook.spec.ts` | No | Signed `checkout.session.completed` webhook creates a license; replays are idempotent; bad signatures are rejected |
| `tests/checkout.spec.ts` | Yes | `/pricing` → Stripe Hosted Checkout (test card) → success page shows license key → license exists in license-server |

Webhook fixtures use `metadata.product: "hackswipe-lifetime"`, matching the live checkout flow.

## Quick start

```bash
cd e2e
npm install
npx playwright install chromium   # first time only

# Webhook tests only (no Stripe keys required)
npm run test:webhook

# Full suite — starts isolated servers on ports 3001 / 13847
npm run test:local
```

For checkout tests, copy Stripe **test mode** keys into `e2e/.env` or reuse `landing/.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
```

## Isolation

`run.sh` and `global-setup.ts` use a dedicated SQLite database at `e2e/.data/licenses-e2e.db`. Dev and production license data are never touched.

Default ports (override with env vars):

| Service | Port |
|---------|------|
| Landing | 3001 |
| License server | 13847 |

## When to run

Run `npm run test:local` before shipping changes to:

- Stripe checkout or webhook routes (`landing/src/app/api/`)
- License fulfillment (`landing/src/lib/fulfillment.ts`)
- License server admin or activation API (`license-server/src/`)

## CI note

Set `CI=1` for GitHub reporter and one retry. Checkout tests require Stripe test keys in the environment.

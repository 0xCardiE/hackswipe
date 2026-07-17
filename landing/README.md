# HackSwipe — Landing & Checkout

Marketing site and Stripe checkout for the **HackSwipe** Chrome extension (Tinder auto-swiper). On successful payment it creates a license on the [license-server](../license-server) and emails the key to the customer.

Built with Next.js (ShipFree-style patterns: Stripe Checkout, webhooks, Resend email) without the full SaaS stack — no Postgres, no user accounts.

## Quick start (local)

```bash
cd landing
cp .env.example .env
# Edit .env — at minimum set LICENSE_SERVER_ADMIN_KEY to match license-server

npm install
npm run dev
```

Open http://localhost:3000

Also run the license server (separate terminal):

```bash
cd license-server
npm run dev
```

## Stripe setup

1. Create a **one-time** Product + Price in [Stripe Dashboard](https://dashboard.stripe.com/products) (not a subscription).
2. Add to `.env`:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID`
3. For local webhooks, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

4. Test checkout with card `4242 4242 4242 4242`.

## Production checklist

| Step | Action |
|------|--------|
| Deploy landing | Vercel, Railway, or VPS — set all env vars |
| Stripe webhook | Point to `https://hackswipe.app/api/webhooks/stripe` |
| License server | Public URL `https://license.hackswipe.app` + `ADMIN_API_KEY` — set `LICENSE_SERVER_URL` on landing |
| Email | Set `EMAIL_PROVIDER=resend` + `EMAIL_FROM=licenses@xlcommerce.hr` (shared Resend domain) |
| Extension | Set `HACKSWIPE_ENV = "production"` in `extension/config.js` before Web Store upload |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage — features, how it works |
| `/pricing` | Free trial vs Lifetime comparison + Buy button |
| `/purchase/success` | Post-checkout — shows license key |
| `/purchase/cancel` | Checkout canceled |

## API

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/purchase/checkout` | POST | Creates Stripe Checkout session |
| `/api/purchase/verify` | GET | Confirms payment + returns license key |
| `/api/webhooks/stripe` | POST | Stripe webhook → create license + email |

## Flow

```
Customer → /pricing → Stripe Checkout
         → webhook → POST /admin/licenses (license-server)
         → Resend email with license key
         → /purchase/success shows key
Customer → Extension side panel → Activate Lifetime (email + key)
```

## Environment variables

See [.env.example](./.env.example) for the full list.

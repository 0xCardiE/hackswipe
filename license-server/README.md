# License server

Node.js + TypeScript backend for HackSwipe license activation (Tinder auto-swiper Chrome extension).

## What it does

- Stores paid licenses in SQLite (email + license key)
- Lets the Chrome extension **activate once per license** (one browser installation)
- Blocks reuse of the same license on a different installation
- Exposes health and admin endpoints for operations

Payment integration can be added later by creating licenses through the admin API or CLI when a purchase completes.

The **`landing/`** app handles Stripe checkout and calls `POST /admin/licenses` automatically via webhook. See [landing/README.md](../landing/README.md).

## Quick start (local)

All commands below run from the **`license-server`** folder (not the repo root):

```bash
cd license-server
cp .env.example .env
# Edit .env and set ADMIN_API_KEY to a long random string

npm install
npm run build
npm start
```

Dev mode with auto-reload:

```bash
npm run dev
```

Health check:

```bash
curl http://127.0.0.1:3847/health
```

## Create a license

From **`license-server`** (same folder as `package.json`):

CLI:

```bash
cd license-server
npm run admin -- create user@example.com --notes "manual test license"
```

Note: the subcommand is **`create`** (not `create-user`), and the email must include `@` (e.g. `user@example.com`).

Admin HTTP API (requires `Authorization: Bearer <ADMIN_API_KEY>`):

```bash
curl -X POST http://127.0.0.1:3847/admin/licenses \
  -H "Authorization: Bearer YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","notes":"paid customer"}'
```

Response includes a generated `license_key` to send to the customer.

List licenses:

```bash
npm run admin -- list
```

Reset activation (move license to a new device):

```bash
npm run admin -- reset 1
```

## Extension API

Base URL: `http://your-server:3847/api/v1/license`

### POST `/activate`

Bind a license to one extension installation.

```json
{
  "email": "user@example.com",
  "licenseKey": "ABCD1234...",
  "installationId": "uuid-from-chrome-storage",
  "deviceLabel": "Marko's MacBook"
}
```

Success: `200` with `{ ok: true, activated: true }`

Already active on same install: `200` with `{ ok: true, activated: false }`

Already used elsewhere: `403` with `reason: "already_activated_elsewhere"`

### POST `/verify`

Check that the stored license is still valid for this installation (call on extension startup and periodically).

Same body as `/activate` (without `deviceLabel`).

### POST `/deactivate`

Release activation on the current installation so the user can move to another browser (optional UX).

## Installation ID (extension side)

Generate once and persist in `chrome.storage.local`:

```javascript
async function getInstallationId() {
  const { installationId } = await chrome.storage.local.get("installationId");
  if (installationId) return installationId;
  const id = crypto.randomUUID();
  await chrome.storage.local.set({ installationId: id });
  return id;
}
```

This is how one-license-one-device is enforced without passwords.

## Production with PM2

```bash
npm run build
mkdir -p logs data
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # follow printed instructions for boot persistence
```

Optional health monitor (cron every minute):

```bash
chmod +x scripts/health-check.sh
crontab -e
# * * * * * /var/www/hackswipe/license-server/scripts/health-check.sh
```

Uses systemd (`hackswipe-license`) when installed, otherwise PM2 (`hackswipe-license-server`).

Daily SQLite backup:

```bash
chmod +x scripts/backup-db.sh
crontab -e
# 0 3 * * * /var/www/hackswipe/license-server/scripts/backup-db.sh
```

Backups: `data/backups/licenses-YYYYMMDDTHHMMSSZ.db` (30-day retention).

## Production with systemd (Linux)

1. Copy and edit `deploy/hackswipe-license.service` (update `User`, `WorkingDirectory`, `EnvironmentFile`, `ExecStart` node path)
2. Install:

```bash
sudo cp deploy/hackswipe-license.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now hackswipe-license
sudo systemctl status hackswipe-license
```

3. Monitor:

```bash
curl -fsS http://127.0.0.1:3847/health
journalctl -u hackswipe-license -f
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3847` | HTTP port |
| `DATABASE_PATH` | `./data/licenses.db` | SQLite file path |
| `ADMIN_API_KEY` | _(empty)_ | Protects `/admin/*` routes |
| `ALLOWED_ORIGINS` | _(empty = allow all)_ | Comma-separated CORS origins |

## Database

SQLite file at `DATABASE_PATH`. Back it up regularly:

```bash
cp data/licenses.db data/licenses.db.bak
```

## Extension integration

The Chrome extension reads `extension/config.js`:

| Setting | Purpose |
|---------|---------|
| `LICENSE_SERVER_URL` | Base URL of this service (default `http://127.0.0.1:3847`) |
| `FREE_TRIAL_DAYS` | Length of the free trial (set in `extension/config.js`, default `3`) |
| `PRO_PURCHASE_URL` | Link to the Lifetime purchase page shown after the trial ends |

When deploying to production, update both `extension/config.js` and `extension/manifest.json` `host_permissions` with your public license server URL.

**Free trial:** 3 days of unlimited auto-swiping, no license needed.

**Lifetime:** unlimited auto-swiping forever after `/api/v1/license/activate` with email + license key.

The `landing/` app calls `POST /admin/licenses` from its Stripe webhook after successful payment, then emails the customer their `license_key`.

#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$ROOT/.." && pwd)"

export E2E_WEBHOOK_SECRET="${E2E_WEBHOOK_SECRET:-whsec_e2e_test_signing_secret_32chars}"
export E2E_ADMIN_KEY="${E2E_ADMIN_KEY:-e2e-test-admin-key-not-for-production}"
export E2E_LANDING_PORT="${E2E_LANDING_PORT:-3001}"
export E2E_LICENSE_SERVER_PORT="${E2E_LICENSE_SERVER_PORT:-13847}"

LANDING_URL="http://localhost:${E2E_LANDING_PORT}"
LICENSE_URL="http://127.0.0.1:${E2E_LICENSE_SERVER_PORT}"
DB_PATH="$ROOT/.data/licenses-e2e.db"

load_env_file() {
  local file="$1"
  if [[ -f "$file" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$file"
    set +a
  fi
}

load_env_file "$ROOT/.env"

if [[ -f "$REPO/landing/.env" ]]; then
  STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY:-$(grep -E '^STRIPE_SECRET_KEY=' "$REPO/landing/.env" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")}"
  STRIPE_PRICE_ID="${STRIPE_PRICE_ID:-$(grep -E '^STRIPE_PRICE_ID=' "$REPO/landing/.env" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")}"
fi

export STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY:-}"
export STRIPE_PRICE_ID="${STRIPE_PRICE_ID:-}"

mkdir -p "$(dirname "$DB_PATH")"
rm -f "$DB_PATH" "${DB_PATH}-wal" "${DB_PATH}-shm"

free_port() {
  local port="$1"
  if lsof -ti ":$port" >/dev/null 2>&1; then
    lsof -ti ":$port" | xargs kill -9 2>/dev/null || true
    sleep 0.5
  fi
}

cleanup() {
  if [[ -n "${LICENSE_PID:-}" ]]; then kill "$LICENSE_PID" 2>/dev/null || true; fi
  if [[ -n "${LANDING_PID:-}" ]]; then kill "$LANDING_PID" 2>/dev/null || true; fi
  free_port "$E2E_LICENSE_SERVER_PORT"
  free_port "$E2E_LANDING_PORT"
}
trap cleanup EXIT

free_port "$E2E_LICENSE_SERVER_PORT"
free_port "$E2E_LANDING_PORT"

(
  cd "$REPO/license-server"
  PORT="$E2E_LICENSE_SERVER_PORT" \
    DATABASE_PATH="$DB_PATH" \
    ADMIN_API_KEY="$E2E_ADMIN_KEY" \
    NODE_ENV=test \
    npm run dev
) &
LICENSE_PID=$!

(
  cd "$REPO/landing"
  export NEXT_PUBLIC_APP_URL="$LANDING_URL"
  export LICENSE_SERVER_URL="$LICENSE_URL"
  export LICENSE_SERVER_ADMIN_KEY="$E2E_ADMIN_KEY"
  export STRIPE_WEBHOOK_SECRET="$E2E_WEBHOOK_SECRET"
  export EMAIL_PROVIDER=log
  if [[ -n "${STRIPE_SECRET_KEY:-}" ]]; then export STRIPE_SECRET_KEY; fi
  if [[ -n "${STRIPE_PRICE_ID:-}" ]]; then export STRIPE_PRICE_ID; fi
  npx next dev --port "$E2E_LANDING_PORT"
) &
LANDING_PID=$!

wait_for() {
  local url="$1"
  local label="$2"
  for _ in $(seq 1 120); do
    if curl -sf "$url" >/dev/null; then
      echo "ready: $label ($url)"
      return 0
    fi
    sleep 1
  done
  echo "timeout waiting for $label ($url)" >&2
  return 1
}

wait_for "${LICENSE_URL}/health" "license-server"
wait_for "$LANDING_URL" "landing"

cd "$ROOT"
export E2E_EXTERNAL_SERVERS=1
export LANDING_URL="$LANDING_URL"
export LICENSE_SERVER_URL="$LICENSE_URL"
npm test -- "${@:-}"

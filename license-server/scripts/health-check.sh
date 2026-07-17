#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
URL="${LICENSE_HEALTH_URL:-http://127.0.0.1:3847/health}"
LOG_FILE="${ROOT}/logs/health-monitor.log"
SYSTEMD_UNIT="${LICENSE_SYSTEMD_UNIT:-hackswipe-license}"
PM2_APP="${LICENSE_PM2_APP:-hackswipe-license-server}"

mkdir -p "${ROOT}/logs"

if curl -fsS --max-time 5 "$URL" >/dev/null; then
  echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") OK ${URL}" >> "$LOG_FILE"
  exit 0
fi

echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") FAIL ${URL}" >> "$LOG_FILE"

if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files "${SYSTEMD_UNIT}.service" &>/dev/null; then
  systemctl restart "${SYSTEMD_UNIT}" || true
elif command -v pm2 >/dev/null 2>&1; then
  pm2 restart "${PM2_APP}" || pm2 start "${ROOT}/ecosystem.config.cjs"
fi

exit 1

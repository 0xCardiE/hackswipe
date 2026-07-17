#!/usr/bin/env bash
# Pull latest code and rebuild/restart HackSwipe production services.
# Triggered manually or by scripts/github-deploy-webhook.js on GitHub push.
set -euo pipefail

ROOT="/var/www/hackswipe"
LOG_DIR="$ROOT/scripts/logs"
LOG_FILE="$LOG_DIR/deploy.log"
LOCK_FILE="/tmp/hackswipe-deploy.lock"
BRANCH="${DEPLOY_BRANCH:-master}"
NODE_BIN="${NODE_BIN:-/root/.nvm/versions/node/v22.14.0/bin/node}"
NPM_BIN="${NPM_BIN:-/root/.nvm/versions/node/v22.14.0/bin/npm}"
NODE_DIR="$(dirname "$NODE_BIN")"
export PATH="$NODE_DIR:$PATH"
PM2_APP="hackswipe-landing"
LICENSE_SERVICE="hackswipe-license.service"

mkdir -p "$LOG_DIR"

log() {
  printf '[%s] %s\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$*" | tee -a "$LOG_FILE"
}

run_locked() {
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    log "Deploy already running; skipping."
    exit 0
  fi
  "$@"
}

deploy() {
  log "Deploy started (branch=$BRANCH)"

  cd "$ROOT"

  log "Fetching and pulling latest changes"
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull --ff-only origin "$BRANCH"

  log "Deploying landing (Next.js)"
  cd "$ROOT/landing"
  "$NPM_BIN" ci
  rm -rf .next
  "$NPM_BIN" run build
  pm2 restart "$PM2_APP" --update-env
  pm2 save

  log "Deploying license server"
  cd "$ROOT/license-server"
  "$NPM_BIN" ci
  "$NPM_BIN" run build
  systemctl restart "$LICENSE_SERVICE"

  log "Health checks"
  curl -fsS --max-time 15 http://127.0.0.1:3011/ >/dev/null
  curl -fsS --max-time 15 http://127.0.0.1:3848/health >/dev/null

  log "Deploy finished successfully"
}

run_locked deploy

#!/usr/bin/env bash
# Build a Chrome Web Store–ready zip from extension/.
# Usage: ./scripts/build-extension.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/extension"
DIST="$ROOT/dist"
RELEASES="$ROOT/releases"
BUILD_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$BUILD_DIR"
}
trap cleanup EXIT

VERSION="$(node -p "require('$SRC/manifest.json').version")"
ZIP_NAME="hackswipe-v${VERSION}.zip"
OUT_DIST="$DIST/$ZIP_NAME"
OUT_RELEASES="$RELEASES/$ZIP_NAME"
OUT_ROOT="$ROOT/$ZIP_NAME"

mkdir -p "$DIST" "$RELEASES"

rsync -a \
  --exclude '.DS_Store' \
  --exclude 'icons/generate-icons.py' \
  "$SRC/" "$BUILD_DIR/"

# Ship production endpoints in release builds; keep development in source for local work.
perl -i -pe 's/const HACKSWIPE_ENV = "development"/const HACKSWIPE_ENV = "production"/' "$BUILD_DIR/config.js"

# Drop dev-only host permissions from the store bundle; keep them in source for local work.
node -e '
const fs = require("fs");
const path = process.argv[1];
const manifest = JSON.parse(fs.readFileSync(path, "utf8"));
manifest.host_permissions = (manifest.host_permissions || []).filter(
  (host) => !/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//.test(host)
);
fs.writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
' "$BUILD_DIR/manifest.json"

rm -f "$OUT_DIST" "$OUT_RELEASES" "$OUT_ROOT"
(cd "$BUILD_DIR" && zip -r -q "$OUT_DIST" . -x "*.DS_Store")

cp "$OUT_DIST" "$OUT_RELEASES"
cp "$OUT_DIST" "$OUT_ROOT"

SIZE="$(du -h "$OUT_DIST" | cut -f1)"
echo "Built release zip ($SIZE, v$VERSION, HACKSWIPE_ENV=production):"
echo "  $OUT_DIST"
echo "  $OUT_RELEASES"
echo "  $OUT_ROOT"

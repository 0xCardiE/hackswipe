#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB="${ROOT}/data/licenses.db"
BACKUP_DIR="${ROOT}/data/backups"
RETENTION_DAYS="${LICENSE_BACKUP_RETENTION_DAYS:-30}"
LOG_FILE="${ROOT}/logs/backup.log"

mkdir -p "${BACKUP_DIR}" "${ROOT}/logs"

if [[ ! -f "${DB}" ]]; then
  echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") SKIP no database at ${DB}" >> "${LOG_FILE}"
  exit 0
fi

STAMP="$(date -u +"%Y%m%dT%H%M%SZ")"
DEST="${BACKUP_DIR}/licenses-${STAMP}.db"

cp "${DB}" "${DEST}"
find "${BACKUP_DIR}" -name 'licenses-*.db' -mtime +"${RETENTION_DAYS}" -delete

echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") OK ${DEST}" >> "${LOG_FILE}"

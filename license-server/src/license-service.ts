import { customAlphabet } from "nanoid";
import type Database from "better-sqlite3";
import type {
  ActivateResult,
  LicenseCheckResult,
  LicenseRow,
  LicenseStatus,
  LicenseWithActivation,
} from "./types.js";

const generateLicenseKey = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 24);

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isExpired(license: LicenseRow): boolean {
  if (license.status === "expired") return true;
  if (!license.expires_at) return false;
  return new Date(license.expires_at).getTime() <= Date.now();
}

function findLicenseByCredentials(
  db: Database.Database,
  email: string,
  licenseKey: string
): LicenseRow | undefined {
  return db
    .prepare(
      `SELECT id, email, license_key, status, created_at, expires_at, notes
       FROM licenses
       WHERE email = ? COLLATE NOCASE AND license_key = ?`
    )
    .get(normalizeEmail(email), licenseKey.trim().toUpperCase()) as LicenseRow | undefined;
}

function getActivationForLicense(db: Database.Database, licenseId: number) {
  return db
    .prepare(
      `SELECT id, license_id, installation_id, device_label, activated_at, last_seen_at
       FROM activations
       WHERE license_id = ?`
    )
    .get(licenseId) as
    | {
        id: number;
        license_id: number;
        installation_id: string;
        device_label: string | null;
        activated_at: string;
        last_seen_at: string;
      }
    | undefined;
}

function validateLicenseState(license: LicenseRow): LicenseCheckResult {
  if (license.status === "revoked") {
    return { ok: false, reason: "license_revoked" };
  }
  if (isExpired(license)) {
    return { ok: false, reason: "license_expired" };
  }
  return { ok: true, email: license.email };
}

export function verifyLicense(
  db: Database.Database,
  email: string,
  licenseKey: string,
  installationId: string
): LicenseCheckResult {
  const license = findLicenseByCredentials(db, email, licenseKey);
  if (!license) {
    return { ok: false, reason: "invalid_credentials" };
  }

  const state = validateLicenseState(license);
  if (!state.ok) return state;

  const activation = getActivationForLicense(db, license.id);
  if (!activation) {
    return { ok: false, reason: "not_activated" };
  }

  if (activation.installation_id !== installationId) {
    return { ok: false, reason: "installation_mismatch" };
  }

  db.prepare(`UPDATE activations SET last_seen_at = datetime('now') WHERE id = ?`).run(activation.id);

  return {
    ok: true,
    email: license.email,
    activatedAt: activation.activated_at,
    lastSeenAt: new Date().toISOString(),
  };
}

export function activateLicense(
  db: Database.Database,
  email: string,
  licenseKey: string,
  installationId: string,
  deviceLabel?: string
): ActivateResult {
  const license = findLicenseByCredentials(db, email, licenseKey);
  if (!license) {
    return { ok: false, reason: "invalid_credentials" };
  }

  const state = validateLicenseState(license);
  if (!state.ok) return state;

  const existing = getActivationForLicense(db, license.id);

  if (existing) {
    if (existing.installation_id === installationId) {
      db.prepare(`UPDATE activations SET last_seen_at = datetime('now') WHERE id = ?`).run(existing.id);
      return {
        ok: true,
        activated: false,
        email: license.email,
        activatedAt: existing.activated_at,
        lastSeenAt: new Date().toISOString(),
      };
    }

    return { ok: false, reason: "already_activated_elsewhere" };
  }

  const duplicateInstallation = db
    .prepare(`SELECT license_id FROM activations WHERE installation_id = ?`)
    .get(installationId) as { license_id: number } | undefined;

  if (duplicateInstallation && duplicateInstallation.license_id !== license.id) {
    return { ok: false, reason: "already_activated_elsewhere" };
  }

  const insert = db.prepare(
    `INSERT INTO activations (license_id, installation_id, device_label)
     VALUES (?, ?, ?)`
  );
  insert.run(license.id, installationId, deviceLabel?.trim() || null);

  const activation = getActivationForLicense(db, license.id)!;

  return {
    ok: true,
    activated: true,
    email: license.email,
    activatedAt: activation.activated_at,
    lastSeenAt: activation.last_seen_at,
  };
}

export function deactivateLicense(
  db: Database.Database,
  email: string,
  licenseKey: string,
  installationId: string
): LicenseCheckResult {
  const license = findLicenseByCredentials(db, email, licenseKey);
  if (!license) {
    return { ok: false, reason: "invalid_credentials" };
  }

  const activation = getActivationForLicense(db, license.id);
  if (!activation) {
    return { ok: true, email: license.email };
  }

  if (activation.installation_id !== installationId) {
    return { ok: false, reason: "installation_mismatch" };
  }

  db.prepare(`DELETE FROM activations WHERE id = ?`).run(activation.id);
  return { ok: true, email: license.email };
}

export interface CreateLicenseInput {
  email: string;
  expiresAt?: string | null;
  notes?: string | null;
  licenseKey?: string;
}

export function createLicense(db: Database.Database, input: CreateLicenseInput): LicenseRow {
  const email = normalizeEmail(input.email);
  const licenseKey = (input.licenseKey || generateLicenseKey()).trim().toUpperCase();

  const stmt = db.prepare(
    `INSERT INTO licenses (email, license_key, expires_at, notes)
     VALUES (?, ?, ?, ?)`
  );

  const result = stmt.run(email, licenseKey, input.expiresAt ?? null, input.notes ?? null);

  return db
    .prepare(
      `SELECT id, email, license_key, status, created_at, expires_at, notes
       FROM licenses WHERE id = ?`
    )
    .get(result.lastInsertRowid) as LicenseRow;
}

export function listLicenses(db: Database.Database): LicenseWithActivation[] {
  const rows = db
    .prepare(
      `SELECT l.id, l.email, l.license_key, l.status, l.created_at, l.expires_at, l.notes,
              a.id AS activation_id, a.installation_id, a.device_label,
              a.activated_at, a.last_seen_at
       FROM licenses l
       LEFT JOIN activations a ON a.license_id = l.id
       ORDER BY l.created_at DESC`
    )
    .all() as Array<
    LicenseRow & {
      activation_id: number | null;
      installation_id: string | null;
      device_label: string | null;
      activated_at: string | null;
      last_seen_at: string | null;
    }
  >;

  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    license_key: row.license_key,
    status: row.status,
    created_at: row.created_at,
    expires_at: row.expires_at,
    notes: row.notes,
    activation:
      row.activation_id != null
        ? {
            id: row.activation_id,
            license_id: row.id,
            installation_id: row.installation_id!,
            device_label: row.device_label,
            activated_at: row.activated_at!,
            last_seen_at: row.last_seen_at!,
          }
        : null,
  }));
}

export function setLicenseStatus(
  db: Database.Database,
  licenseId: number,
  status: LicenseStatus
): LicenseRow | undefined {
  db.prepare(`UPDATE licenses SET status = ? WHERE id = ?`).run(status, licenseId);
  return db
    .prepare(
      `SELECT id, email, license_key, status, created_at, expires_at, notes
       FROM licenses WHERE id = ?`
    )
    .get(licenseId) as LicenseRow | undefined;
}

export function resetActivation(db: Database.Database, licenseId: number): boolean {
  const result = db.prepare(`DELETE FROM activations WHERE license_id = ?`).run(licenseId);
  return result.changes > 0;
}

export function deleteLicense(db: Database.Database, licenseId: number): boolean {
  const result = db.prepare(`DELETE FROM licenses WHERE id = ?`).run(licenseId);
  return result.changes > 0;
}

export { generateLicenseKey };

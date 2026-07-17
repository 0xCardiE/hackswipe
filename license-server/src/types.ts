export type LicenseStatus = "active" | "revoked" | "expired";

export interface LicenseRow {
  id: number;
  email: string;
  license_key: string;
  status: LicenseStatus;
  created_at: string;
  expires_at: string | null;
  notes: string | null;
}

export interface ActivationRow {
  id: number;
  license_id: number;
  installation_id: string;
  device_label: string | null;
  activated_at: string;
  last_seen_at: string;
}

export interface LicenseWithActivation extends LicenseRow {
  activation: ActivationRow | null;
}

export type LicenseFailureReason =
  | "invalid_credentials"
  | "license_revoked"
  | "license_expired"
  | "already_activated_elsewhere"
  | "not_activated"
  | "installation_mismatch";

export interface LicenseCheckResult {
  ok: boolean;
  reason?: LicenseFailureReason;
  email?: string;
  activatedAt?: string;
  lastSeenAt?: string;
}

export interface ActivateResult extends LicenseCheckResult {
  activated?: boolean;
}

import { adminApiKey, licenseServerUrl } from "./env.js";

export interface LicenseRecord {
  id: number;
  email: string;
  license_key: string;
  status: string;
  created_at: string;
  expires_at: string | null;
  notes: string | null;
}

export async function listLicenses(): Promise<LicenseRecord[]> {
  const response = await fetch(`${licenseServerUrl}/admin/licenses`, {
    headers: { Authorization: `Bearer ${adminApiKey}` },
  });

  const data = (await response.json()) as { ok?: boolean; licenses?: LicenseRecord[] };
  if (!response.ok || !data.licenses) {
    throw new Error(`Failed to list licenses: ${response.status}`);
  }

  return data.licenses;
}

export function findLicenseByEmail(licenses: LicenseRecord[], email: string): LicenseRecord | undefined {
  const normalized = email.trim().toLowerCase();
  return licenses.find((license) => license.email.toLowerCase() === normalized);
}

export function findLicenseBySession(licenses: LicenseRecord[], sessionId: string): LicenseRecord | undefined {
  const needle = `stripe:${sessionId}`;
  return licenses.find((license) => license.notes?.includes(needle));
}

export const licenseKeyPattern = /^[2-9A-HJ-NP-Z]{24}$/;

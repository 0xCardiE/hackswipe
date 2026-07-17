import { env, isLicenseServerConfigured } from "./env";

export interface LicenseRecord {
  id: number;
  email: string;
  license_key: string;
  status: string;
  created_at: string;
  expires_at: string | null;
  notes: string | null;
}

interface AdminListResponse {
  ok: boolean;
  licenses?: LicenseRecord[];
}

interface AdminCreateResponse {
  ok: boolean;
  license?: LicenseRecord;
  error?: string;
  message?: string;
}

function adminHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${env.LICENSE_SERVER_ADMIN_KEY}`,
    "Content-Type": "application/json",
  };
}

function assertLicenseServer() {
  if (!isLicenseServerConfigured()) {
    throw new Error("License server admin key is not configured.");
  }
}

export async function createLicense(input: {
  email: string;
  notes?: string;
}): Promise<LicenseRecord> {
  assertLicenseServer();

  const response = await fetch(`${env.LICENSE_SERVER_URL}/admin/licenses`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify({
      email: input.email,
      notes: input.notes ?? null,
    }),
  });

  const data = (await response.json()) as AdminCreateResponse;

  if (response.status === 409) {
    const existing = await findLicenseByEmail(input.email);
    if (existing) return existing;
    throw new Error(data.message || "License already exists for this email.");
  }

  if (!response.ok || !data.license) {
    throw new Error(data.message || data.error || "Failed to create license.");
  }

  return data.license;
}

export async function listLicenses(): Promise<LicenseRecord[]> {
  assertLicenseServer();

  const response = await fetch(`${env.LICENSE_SERVER_URL}/admin/licenses`, {
    headers: adminHeaders(),
    cache: "no-store",
  });

  const data = (await response.json()) as AdminListResponse;
  if (!response.ok || !data.licenses) {
    throw new Error("Failed to list licenses from license server.");
  }

  return data.licenses;
}

export async function findLicenseByEmail(email: string): Promise<LicenseRecord | null> {
  const normalized = email.trim().toLowerCase();
  const licenses = await listLicenses();
  return licenses.find((license) => license.email.toLowerCase() === normalized) ?? null;
}

export async function findLicenseByStripeSession(sessionId: string): Promise<LicenseRecord | null> {
  const needle = `stripe:${sessionId}`;
  const licenses = await listLicenses();
  return licenses.find((license) => license.notes?.includes(needle)) ?? null;
}

export function stripeSessionNote(sessionId: string): string {
  return `stripe:${sessionId}`;
}

import { sendLicenseEmail } from "./email";
import {
  createLicense,
  findLicenseByEmail,
  findLicenseByStripeSession,
  stripeSessionNote,
  type LicenseRecord,
} from "./license-server";

export interface FulfillmentResult {
  license: LicenseRecord;
  created: boolean;
  emailed: boolean;
}

export async function fulfillPurchase(input: {
  email: string;
  sessionId: string;
  sendEmail?: boolean;
}): Promise<FulfillmentResult> {
  const email = input.email.trim().toLowerCase();
  const note = stripeSessionNote(input.sessionId);

  let license = await findLicenseByStripeSession(input.sessionId);
  let created = false;

  if (!license) {
    try {
      license = await createLicense({ email, notes: note });
      created = true;
    } catch {
      license = await findLicenseByEmail(email);
      if (!license) throw new Error("Could not create or find license for this purchase.");
    }
  }

  let emailed = false;
  if (input.sendEmail !== false && created) {
    await sendLicenseEmail({ email: license.email, licenseKey: license.license_key });
    emailed = true;
  }

  return { license, created, emailed };
}

import { Resend } from "resend";
import { legal } from "@/config/legal";
import { product } from "@/config/product";
import { env } from "./env";
import { siteUrl } from "./seo";

export interface LicenseEmailPayload {
  email: string;
  licenseKey: string;
}

export async function sendLicenseEmail(payload: LicenseEmailPayload): Promise<void> {
  const subject = `Your ${product.proName} license key`;
  const html = buildLicenseEmailHtml(payload);
  const text = buildLicenseEmailText(payload);

  if (env.EMAIL_PROVIDER === "log") {
    console.log("\n--- LICENSE EMAIL (dev log) ---");
    console.log(`To: ${payload.email}`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    console.log("--- end ---\n");
    return;
  }

  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required when EMAIL_PROVIDER=resend");
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM}>`,
    to: payload.email,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message || "Failed to send license email.");
  }
}

function buildLicenseEmailText(payload: LicenseEmailPayload): string {
  return [
    `Thanks for purchasing ${product.proName}!`,
    "",
    "Your license key:",
    payload.licenseKey,
    "",
    "How to activate:",
    `1. Open ${product.name} in Chrome`,
    "2. Go to Settings → License",
    "3. Enter this email and license key when prompted",
    "",
    "One license activates on one browser installation.",
    "",
    legal.shortDisclaimer,
    "",
    `Questions? ${siteUrl}/faq`,
  ].join("\n");
}

function buildLicenseEmailHtml(payload: LicenseEmailPayload): string {
  return `
<!DOCTYPE html>
<html>
  <body style="font-family: system-ui, sans-serif; background: #ffffff; color: #1a1a1b; padding: 24px;">
    <div style="max-width: 520px; margin: 0 auto; background: #f6f7f8; border: 1px solid #edeff1; border-radius: 16px; padding: 28px;">
      <h1 style="margin: 0 0 8px; color: #ff2d55; font-size: 22px;">${product.proName}</h1>
      <p style="color: #787c7e; margin: 0 0 24px;">Thanks for your purchase!</p>
      <p style="margin: 0 0 8px;">Your license key:</p>
      <code style="display: block; background: #ffffff; padding: 16px; border-radius: 10px; font-size: 18px; letter-spacing: 0.06em; color: #1a1a1b; word-break: break-all; border: 1px solid #edeff1;">${payload.licenseKey}</code>
      <ol style="color: #787c7e; line-height: 1.6; padding-left: 20px;">
        <li>Open the extension side panel in Chrome</li>
        <li>Follow the activation steps in the extension</li>
        <li>Enter your email and the license key above</li>
      </ol>
      <p style="color: #787c7e; font-size: 14px; margin-top: 24px;">One license = one browser install.</p>
      <p style="color: #787c7e; font-size: 14px; margin-top: 16px;">
        Questions? <a href="${siteUrl}/faq" style="color: #ff2d55;">FAQ</a>
      </p>
      <p style="color: #787c7e; font-size: 12px; margin-top: 20px; line-height: 1.5;">${legal.shortDisclaimer}</p>
    </div>
  </body>
</html>`;
}

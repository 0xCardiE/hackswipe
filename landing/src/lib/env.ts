import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_PRODUCT_NAME: z.string().default("HackSwipe Lifetime"),
  NEXT_PUBLIC_PRODUCT_PRICE: z.coerce.number().default(20),
  NEXT_PUBLIC_PRODUCT_ORIGINAL_PRICE: z.coerce.number().default(49),
  NEXT_PUBLIC_FREE_TRIAL_DAYS: z.coerce.number().default(3),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID: z.string().optional(),

  LICENSE_SERVER_URL: z.string().default("http://127.0.0.1:3847"),
  LICENSE_SERVER_ADMIN_KEY: z.string().optional(),

  EMAIL_PROVIDER: z.enum(["resend", "log"]).default("log"),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("licenses@xlcommerce.hr"),
  EMAIL_FROM_NAME: z.string().default("HackSwipe"),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_PRODUCT_NAME: process.env.NEXT_PUBLIC_PRODUCT_NAME,
  NEXT_PUBLIC_PRODUCT_PRICE: process.env.NEXT_PUBLIC_PRODUCT_PRICE,
  NEXT_PUBLIC_PRODUCT_ORIGINAL_PRICE: process.env.NEXT_PUBLIC_PRODUCT_ORIGINAL_PRICE,
  NEXT_PUBLIC_FREE_TRIAL_DAYS: process.env.NEXT_PUBLIC_FREE_TRIAL_DAYS,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
  LICENSE_SERVER_URL: process.env.LICENSE_SERVER_URL,
  LICENSE_SERVER_ADMIN_KEY: process.env.LICENSE_SERVER_ADMIN_KEY,
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
});

export function isStripeConfigured(): boolean {
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_ID);
}

export function isLicenseServerConfigured(): boolean {
  return Boolean(env.LICENSE_SERVER_ADMIN_KEY);
}

export function isEmailConfigured(): boolean {
  return env.EMAIL_PROVIDER === "log" || Boolean(env.RESEND_API_KEY);
}

/** @type {"development" | "production"} */
const HACKSWIPE_ENV = "development";

const ENDPOINTS = {
  development: {
    SITE_URL: "http://localhost:3000",
    LICENSE_SERVER_URL: "http://127.0.0.1:3847",
    PRO_PURCHASE_URL: "http://localhost:3000/pricing",
  },
  production: {
    SITE_URL: "https://hackswipe.app",
    LICENSE_SERVER_URL: "https://license.hackswipe.app",
    PRO_PURCHASE_URL: "https://hackswipe.app/pricing",
  },
};

/** @type {Readonly<{ SITE_URL: string; LICENSE_SERVER_URL: string; PRO_PURCHASE_URL: string; FREE_TRIAL_DAYS: number }>} */
const HACKSWIPE_CONFIG = Object.freeze({
  ...ENDPOINTS[HACKSWIPE_ENV],
  FREE_TRIAL_DAYS: 3,
});

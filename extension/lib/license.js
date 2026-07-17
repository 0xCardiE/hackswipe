const MS_PER_DAY = 24 * 60 * 60 * 1000;

const License = {
  async isPro() {
    const record = await Storage.getLicenseRecord();
    return Boolean(record?.isPro);
  },

  /** Trial status derived from the fixed trialStartedAt timestamp — never extended by usage. */
  async getTrialSummary() {
    const isPro = await this.isPro();
    const trialStartedAt = await Storage.ensureTrialStarted();
    const startedMs = new Date(trialStartedAt).getTime();
    const trialEndsMs = startedMs + HACKSWIPE_CONFIG.FREE_TRIAL_DAYS * MS_PER_DAY;
    const trialEndsAt = new Date(trialEndsMs).toISOString();
    const msLeft = trialEndsMs - Date.now();
    const daysLeft = Math.max(0, Math.ceil(msLeft / MS_PER_DAY));
    const trialExpired = msLeft <= 0;

    return {
      isPro,
      trialStartedAt,
      trialEndsAt,
      daysLeft,
      trialExpired,
      canUse: isPro || !trialExpired,
    };
  },

  async canSwipe() {
    const summary = await this.getTrialSummary();
    return summary.canUse;
  },

  async activate(email, licenseKey) {
    const installationId = await Storage.getInstallationId();
    const response = await fetch(`${HACKSWIPE_CONFIG.LICENSE_SERVER_URL}/api/v1/license/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        licenseKey: licenseKey.trim(),
        installationId,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.ok) {
      throw new Error(data.message || "Activation failed. Check your email and license key.");
    }

    await Storage.saveLicenseRecord({
      email: email.trim(),
      licenseKey: licenseKey.trim(),
      isPro: true,
      activatedAt: data.activatedAt || new Date().toISOString(),
    });

    return data;
  },

  async verifyStoredLicense() {
    const record = await Storage.getLicenseRecord();
    if (!record?.email || !record?.licenseKey) {
      return { ok: false, isPro: false };
    }

    const installationId = await Storage.getInstallationId();

    try {
      const response = await fetch(`${HACKSWIPE_CONFIG.LICENSE_SERVER_URL}/api/v1/license/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: record.email,
          licenseKey: record.licenseKey,
          installationId,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        await Storage.clearLicenseRecord();
        return { ok: false, isPro: false, message: data.message };
      }

      await Storage.saveLicenseRecord({ ...record, isPro: true });
      return { ok: true, isPro: true };
    } catch {
      return { ok: true, isPro: record.isPro === true, offline: true };
    }
  },

  async deactivate() {
    const record = await Storage.getLicenseRecord();
    if (!record?.email || !record?.licenseKey) {
      await Storage.clearLicenseRecord();
      return;
    }

    const installationId = await Storage.getInstallationId();

    try {
      await fetch(`${HACKSWIPE_CONFIG.LICENSE_SERVER_URL}/api/v1/license/deactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: record.email,
          licenseKey: record.licenseKey,
          installationId,
        }),
      });
    } catch {
      // still clear locally
    }

    await Storage.clearLicenseRecord();
  },
};

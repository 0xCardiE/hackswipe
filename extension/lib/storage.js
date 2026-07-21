const DEFAULT_SWIPE_SETTINGS = {
  minAge: 18,
  maxAge: 45,
  maxDistanceKm: 100,
  minPhotos: 1,
  bannedKeywords: [],
  requiredKeywords: [],
  preferredKeywords: [],
  likeRatio: 0.5,
  minDelaySeconds: 1.5,
  maxDelaySeconds: 3.5,
};

const DEFAULT_SESSION_STATS = {
  totalSwipes: 0,
  likes: 0,
  nopes: 0,
  skippedByFilter: 0,
  lastSessionAt: null,
};

function clampNumber(value, fallback, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function normalizeKeywordList(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((word) => String(word).trim().toLowerCase())
    .filter(Boolean);
}

function migrateSwipeSettings(raw) {
  const merged = { ...DEFAULT_SWIPE_SETTINGS, ...(raw || {}) };
  return {
    minAge: clampNumber(merged.minAge, DEFAULT_SWIPE_SETTINGS.minAge, 18, 99),
    maxAge: clampNumber(merged.maxAge, DEFAULT_SWIPE_SETTINGS.maxAge, 18, 99),
    maxDistanceKm: clampNumber(merged.maxDistanceKm, DEFAULT_SWIPE_SETTINGS.maxDistanceKm, 1, 500),
    minPhotos: clampNumber(merged.minPhotos, DEFAULT_SWIPE_SETTINGS.minPhotos, 0, 20),
    bannedKeywords: normalizeKeywordList(merged.bannedKeywords),
    requiredKeywords: normalizeKeywordList(merged.requiredKeywords),
    preferredKeywords: normalizeKeywordList(merged.preferredKeywords),
    likeRatio: clampNumber(merged.likeRatio, DEFAULT_SWIPE_SETTINGS.likeRatio, 0, 1),
    minDelaySeconds: clampNumber(merged.minDelaySeconds, DEFAULT_SWIPE_SETTINGS.minDelaySeconds, 0.5, 30),
    maxDelaySeconds: clampNumber(merged.maxDelaySeconds, DEFAULT_SWIPE_SETTINGS.maxDelaySeconds, 0.5, 60),
  };
}

const Storage = {
  async getSwipeSettings() {
    const { swipeSettings } = await chrome.storage.local.get("swipeSettings");
    return migrateSwipeSettings(swipeSettings);
  },

  async saveSwipeSettings(partial) {
    const current = await this.getSwipeSettings();
    const next = migrateSwipeSettings({ ...current, ...partial });
    await chrome.storage.local.set({ swipeSettings: next });
    return next;
  },

  async getSessionStats() {
    const { sessionStats } = await chrome.storage.local.get("sessionStats");
    return { ...DEFAULT_SESSION_STATS, ...(sessionStats || {}) };
  },

  async saveSessionStats(partial) {
    const current = await this.getSessionStats();
    const next = { ...current, ...partial };
    await chrome.storage.local.set({ sessionStats: next });
    return next;
  },

  async addSessionStats(deltas) {
    const current = await this.getSessionStats();
    const next = { ...current };
    for (const [key, delta] of Object.entries(deltas)) {
      next[key] = (current[key] || 0) + delta;
    }
    next.lastSessionAt = new Date().toISOString();
    await chrome.storage.local.set({ sessionStats: next });
    return next;
  },

  async resetSessionStats() {
    await chrome.storage.local.set({ sessionStats: { ...DEFAULT_SESSION_STATS } });
    return { ...DEFAULT_SESSION_STATS };
  },
};

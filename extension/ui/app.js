const pageStatus = document.getElementById("page-status");
const statusText = document.getElementById("status-text");
const swipeBtn = document.getElementById("swipe-btn");
const filtersChipRow = document.getElementById("filters-chip-row");
const lastActionEl = document.getElementById("last-action");
const toast = document.getElementById("toast");
const extVersionEl = document.getElementById("ext-version");
const trialBadge = document.getElementById("trial-badge");

const countTotal = document.getElementById("count-total");
const countLikes = document.getElementById("count-likes");
const countNopes = document.getElementById("count-nopes");
const countSkipped = document.getElementById("count-skipped");

const lifetimeTotal = document.getElementById("lifetime-total");
const lifetimeLikes = document.getElementById("lifetime-likes");
const lifetimeNopes = document.getElementById("lifetime-nopes");
const lifetimeSkipped = document.getElementById("lifetime-skipped");
const sessionDuration = document.getElementById("session-duration");
const sessionLastSwipe = document.getElementById("session-last-swipe");
const resetStatsBtn = document.getElementById("reset-stats-btn");

const minAgeInput = document.getElementById("setting-min-age");
const maxAgeInput = document.getElementById("setting-max-age");
const maxDistanceInput = document.getElementById("setting-max-distance");
const minPhotosInput = document.getElementById("setting-min-photos");
const bannedInput = document.getElementById("setting-banned-keywords");
const requiredInput = document.getElementById("setting-required-keywords");
const preferredInput = document.getElementById("setting-preferred-keywords");
const minDelayInput = document.getElementById("setting-min-delay");
const maxDelayInput = document.getElementById("setting-max-delay");
const likeRatioInput = document.getElementById("setting-like-ratio");
const likeRatioValue = document.getElementById("like-ratio-value");

const trialBanner = document.getElementById("trial-banner");
const trialBannerText = document.getElementById("trial-banner-text");
const licenseForm = document.getElementById("license-form");
const licenseActive = document.getElementById("license-active");
const licenseEmailEl = document.getElementById("license-email");
const licenseEmailInput = document.getElementById("license-email-input");
const licenseKeyInput = document.getElementById("license-key-input");
const activateLicenseBtn = document.getElementById("activate-license-btn");
const deactivateLicenseBtn = document.getElementById("deactivate-license-btn");
const purchaseCta = document.getElementById("purchase-cta");
const purchaseLink = document.getElementById("purchase-link");
const licenseActivationLabel = document.getElementById("license-activation-label");

let activeTabId = null;
let isTinderTab = false;
let settings = null;
let sessionRunning = false;
let sessionStartedAt = null;
let toastTimer = null;

function showToast(message, tone = "ok") {
  toast.textContent = message;
  toast.classList.remove("hidden", "is-error");
  if (tone === "error") toast.classList.add("is-error");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 2800);
}

function switchTab(tabName) {
  document.querySelectorAll(".nav-tab").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.tab === tabName);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `tab-${tabName}`);
  });
  if (tabName === "stats") renderStatsTab();
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function isTinderUrl(url) {
  return Boolean(url && /tinder\.com/i.test(url));
}

async function sendToContent(message) {
  if (!activeTabId) return null;
  try {
    return await chrome.tabs.sendMessage(activeTabId, message);
  } catch {
    return null;
  }
}

function setPageStatus(state, message, running = false) {
  pageStatus.classList.remove("is-ok", "is-bad", "is-running");
  if (state === "ok") pageStatus.classList.add("is-ok");
  if (state === "bad") pageStatus.classList.add("is-bad");
  if (running) pageStatus.classList.add("is-running");
  statusText.textContent = message;
}

function setSwipeButton(disabled, running) {
  swipeBtn.disabled = disabled;
  swipeBtn.textContent = running ? "Stop Swiping" : "Start Swiping";
  swipeBtn.classList.toggle("is-running", running);
}

function renderFiltersSummary(current) {
  if (!current) {
    filtersChipRow.innerHTML = "";
    return;
  }

  const chips = [
    `${current.minAge}–${current.maxAge} yrs`,
    `≤ ${current.maxDistanceKm} km`,
    `${current.minPhotos}+ photos`,
    `${Math.round(current.likeRatio * 100)}% like ratio`,
  ];
  if (current.bannedKeywords.length) chips.push(`${current.bannedKeywords.length} banned word${current.bannedKeywords.length === 1 ? "" : "s"}`);
  if (current.requiredKeywords.length) chips.push(`${current.requiredKeywords.length} required word${current.requiredKeywords.length === 1 ? "" : "s"}`);
  if (current.preferredKeywords.length) chips.push(`${current.preferredKeywords.length} preferred word${current.preferredKeywords.length === 1 ? "" : "s"}`);

  filtersChipRow.innerHTML = chips.map((label) => `<span class="filter-chip">${label}</span>`).join("");
}

function renderCounters(stats) {
  const safe = stats || { totalSwipes: 0, likes: 0, nopes: 0, skippedByFilter: 0 };
  countTotal.textContent = safe.totalSwipes;
  countLikes.textContent = safe.likes;
  countNopes.textContent = safe.nopes;
  countSkipped.textContent = safe.skippedByFilter;
}

function renderLastAction(action) {
  if (!action) {
    lastActionEl.classList.add("hidden");
    return;
  }

  lastActionEl.classList.remove("hidden");

  if (action.action === "waiting-for-cards") {
    lastActionEl.textContent = "Waiting for the next profile card…";
    return;
  }

  const who = action.card?.name ? `${action.card.name}${action.card.age ? ", " + action.card.age : ""}` : "that profile";

  if (action.filtered) {
    lastActionEl.textContent = `Swiped left on ${who} — filtered (${(action.reasons || []).join(", ") || "no match"})`;
  } else if (action.action === "right") {
    lastActionEl.textContent = `Liked ${who}`;
  } else {
    lastActionEl.textContent = `Passed on ${who}`;
  }
}

async function refreshTabContext() {
  const tab = await getActiveTab();
  activeTabId = tab?.id ?? null;
  isTinderTab = isTinderUrl(tab?.url);
  await pollStatus();
}

async function pollStatus() {
  const trial = await License.getTrialSummary();

  if (!isTinderTab) {
    setPageStatus("bad", "Open tinder.com to start swiping");
    setSwipeButton(true, false);
    sessionRunning = false;
    renderCounters(null);
    renderLastAction(null);
    return;
  }

  const response = await sendToContent({ type: "GET_STATUS" });

  if (!response?.ok) {
    setPageStatus("bad", "Reload the Tinder tab to connect HackSwipe");
    setSwipeButton(true, false);
    sessionRunning = false;
    return;
  }

  const status = response.status;
  settings = status.settings || settings;
  sessionRunning = status.running;
  sessionStartedAt = status.startedAt;

  renderFiltersSummary(settings);
  renderCounters(status.stats);
  renderLastAction(status.lastAction);

  if (!trial.canUse) {
    if (sessionRunning) await sendToContent({ type: "STOP_SWIPE" });
    setPageStatus("bad", "Free trial ended — activate a license to keep swiping");
    setSwipeButton(true, false);
    sessionRunning = false;
    return;
  }

  if (status.running) {
    setPageStatus("ok", "Swiping…", true);
    setSwipeButton(false, true);
  } else if (status.pageReady) {
    setPageStatus("ok", "Ready to swipe");
    setSwipeButton(false, false);
  } else {
    setPageStatus("bad", "Open the Tinder discovery page to begin");
    setSwipeButton(true, false);
  }
}

async function toggleSwipe() {
  swipeBtn.disabled = true;

  if (sessionRunning) {
    await sendToContent({ type: "STOP_SWIPE" });
  } else {
    const trial = await License.getTrialSummary();
    if (!trial.canUse) {
      showToast("Free trial ended. Activate a license to keep swiping.", "error");
      switchTab("license");
      swipeBtn.disabled = false;
      return;
    }

    const response = await sendToContent({ type: "START_SWIPE" });
    if (response?.status?.error) {
      showToast(response.status.error, "error");
    }
  }

  await pollStatus();
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

async function renderStatsTab() {
  const lifetime = await Storage.getSessionStats();
  lifetimeTotal.textContent = lifetime.totalSwipes;
  lifetimeLikes.textContent = lifetime.likes;
  lifetimeNopes.textContent = lifetime.nopes;
  lifetimeSkipped.textContent = lifetime.skippedByFilter;

  sessionDuration.textContent =
    sessionRunning && sessionStartedAt ? formatDuration(Date.now() - new Date(sessionStartedAt).getTime()) : "Not running";
  sessionLastSwipe.textContent = lifetime.lastSessionAt ? formatDate(lifetime.lastSessionAt) : "—";
}

function parseKeywordList(value) {
  return value
    .split(/[\n,]/)
    .map((word) => word.trim())
    .filter(Boolean);
}

async function loadSettingsUi() {
  settings = await Storage.getSwipeSettings();
  minAgeInput.value = settings.minAge;
  maxAgeInput.value = settings.maxAge;
  maxDistanceInput.value = settings.maxDistanceKm;
  minPhotosInput.value = settings.minPhotos;
  bannedInput.value = settings.bannedKeywords.join("\n");
  requiredInput.value = settings.requiredKeywords.join("\n");
  preferredInput.value = settings.preferredKeywords.join("\n");
  minDelayInput.value = settings.minDelaySeconds;
  maxDelayInput.value = settings.maxDelaySeconds;
  likeRatioInput.value = Math.round(settings.likeRatio * 100);
  likeRatioValue.textContent = `${likeRatioInput.value}%`;
  renderFiltersSummary(settings);
}

async function applySettingChange(partial) {
  settings = await Storage.saveSwipeSettings(partial);
  renderFiltersSummary(settings);
  if (isTinderTab) await sendToContent({ type: "UPDATE_FILTERS", settings: partial });
}

async function refreshLicenseUi() {
  const summary = await License.getTrialSummary();
  const record = await Storage.getLicenseRecord();

  trialBadge.classList.remove("is-pro", "is-trial", "is-expired");
  if (summary.isPro) {
    trialBadge.textContent = "LIFETIME";
    trialBadge.classList.add("is-pro");
  } else if (summary.trialExpired) {
    trialBadge.textContent = "TRIAL ENDED";
    trialBadge.classList.add("is-expired");
  } else {
    trialBadge.textContent = `${summary.daysLeft}D LEFT`;
    trialBadge.classList.add("is-trial");
  }

  trialBanner.classList.remove("is-expired", "is-pro");
  if (summary.isPro) {
    trialBanner.classList.add("is-pro");
    trialBannerText.textContent = "You have lifetime access. Thanks for supporting HackSwipe!";
  } else if (summary.trialExpired) {
    trialBanner.classList.add("is-expired");
    trialBannerText.textContent = "Your 3-day free trial has ended. Activate a license to keep auto-swiping.";
  } else {
    trialBannerText.textContent = `${summary.daysLeft} day${summary.daysLeft === 1 ? "" : "s"} left in your free trial — swipe away!`;
  }

  purchaseLink.href = HACKSWIPE_CONFIG.PRO_PURCHASE_URL;

  if (summary.isPro && record) {
    licenseActive.classList.remove("hidden");
    licenseForm.classList.add("hidden");
    licenseEmailEl.textContent = record.email;
    purchaseCta.classList.add("hidden");
    licenseActivationLabel.classList.add("hidden");
  } else {
    licenseActive.classList.add("hidden");
    licenseForm.classList.remove("hidden");
    purchaseCta.classList.remove("hidden");
    licenseActivationLabel.classList.remove("hidden");
  }
}

async function initLicenseState() {
  await License.verifyStoredLicense();
  await refreshLicenseUi();
}

document.querySelectorAll(".nav-tab").forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

swipeBtn.addEventListener("click", toggleSwipe);

resetStatsBtn.addEventListener("click", async () => {
  await Storage.resetSessionStats();
  await renderStatsTab();
  showToast("Lifetime stats reset");
});

minAgeInput.addEventListener("change", () => applySettingChange({ minAge: Number(minAgeInput.value) }));
maxAgeInput.addEventListener("change", () => applySettingChange({ maxAge: Number(maxAgeInput.value) }));
maxDistanceInput.addEventListener("change", () => applySettingChange({ maxDistanceKm: Number(maxDistanceInput.value) }));
minPhotosInput.addEventListener("change", () => applySettingChange({ minPhotos: Number(minPhotosInput.value) }));
bannedInput.addEventListener("change", () => applySettingChange({ bannedKeywords: parseKeywordList(bannedInput.value) }));
requiredInput.addEventListener("change", () => applySettingChange({ requiredKeywords: parseKeywordList(requiredInput.value) }));
preferredInput.addEventListener("change", () => applySettingChange({ preferredKeywords: parseKeywordList(preferredInput.value) }));
minDelayInput.addEventListener("change", () => applySettingChange({ minDelaySeconds: Number(minDelayInput.value) }));
maxDelayInput.addEventListener("change", () => applySettingChange({ maxDelaySeconds: Number(maxDelayInput.value) }));

likeRatioInput.addEventListener("input", () => {
  likeRatioValue.textContent = `${likeRatioInput.value}%`;
});
likeRatioInput.addEventListener("change", () => applySettingChange({ likeRatio: Number(likeRatioInput.value) / 100 }));

licenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = licenseEmailInput.value.trim();
  const licenseKey = licenseKeyInput.value.trim();
  if (!email || !licenseKey) return;

  activateLicenseBtn.disabled = true;
  activateLicenseBtn.textContent = "Activating…";

  try {
    await License.activate(email, licenseKey);
    licenseKeyInput.value = "";
    showToast("Lifetime license activated!");
    await refreshLicenseUi();
    await pollStatus();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    activateLicenseBtn.disabled = false;
    activateLicenseBtn.textContent = "Activate license";
  }
});

deactivateLicenseBtn.addEventListener("click", async () => {
  deactivateLicenseBtn.disabled = true;
  try {
    await License.deactivate();
    showToast("License removed from this browser");
    await refreshLicenseUi();
    await pollStatus();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    deactivateLicenseBtn.disabled = false;
  }
});

chrome.tabs.onActivated.addListener(refreshTabContext);
chrome.tabs.onUpdated.addListener((_tabId, info) => {
  if (info.url || info.status === "complete") refreshTabContext();
});

loadSettingsUi();
initLicenseState();
refreshTabContext();

setInterval(() => {
  pollStatus();
  refreshLicenseUi();
  const activePanel = document.querySelector(".tab-panel.is-active");
  if (activePanel?.id === "tab-stats") renderStatsTab();
}, 2500);

try {
  const manifest = chrome.runtime.getManifest();
  if (manifest?.version && extVersionEl) {
    extVersionEl.textContent = `v${manifest.version}`;
  }
} catch {
  // ignore
}

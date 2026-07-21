/**
 * HackSwipe auto-swipe engine for tinder.com.
 *
 * Everything here runs on-device: profile data is read from the DOM only to
 * evaluate the user's own filters and is never sent anywhere.
 *
 * Tinder frequently reshuffles its DOM/class names, so every selector list
 * below is intentionally short and easy to extend — add a new selector to
 * the relevant array rather than rewriting the read/click logic.
 */

const LIKE_SELECTORS = ['[aria-label="Like"]', '[aria-label="LIKE"]', 'button[title="Like"]'];
const NOPE_SELECTORS = ['[aria-label="Nope"]', '[aria-label="NOPE"]', 'button[title="Nope"]'];

const CARD_CONTAINER_SELECTORS = [
  '.recCard',
  '[class*="recCard" i]',
  '[class*="profileCard" i]',
  '.recsCardboard__cardsContainer > div',
];

const BIO_SELECTORS = ['.profileCard__bio', '[class*="bio" i]'];

const PHOTO_INDICATOR_SELECTORS = [
  '[class*="carousel" i] button',
  '[class*="slider" i] button',
  '.Expand .tappable-view > div.CenterAlign:nth-child(2) button',
];

const NAME_AGE_RE = /^([A-Za-z\u00C0-\u024F .'-]{1,40}),\s*(\d{2})$/;
const DISTANCE_RE = /(\d+(?:\.\d+)?)\s*(km|kilometers?|mi|miles?)\s*away/i;

const WAIT_RETRY_MS = 1000;
const ERROR_RETRY_MS = 1500;

const state = {
  running: false,
  settings: null,
  stats: { totalSwipes: 0, likes: 0, nopes: 0, skippedByFilter: 0 },
  timer: null,
  startedAt: null,
  lastAction: null,
  lastError: null,
};

function isClickable(el) {
  if (!el || el.disabled) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;
  const style = window.getComputedStyle(el);
  return style.visibility !== "hidden" && style.display !== "none";
}

function findButton(selectors) {
  for (const selector of selectors) {
    const nodes = document.querySelectorAll(selector);
    for (const node of nodes) {
      if (isClickable(node)) return node;
    }
  }
  return null;
}

function dispatchKeyFallback(key) {
  const eventInit = { key, code: key, bubbles: true, cancelable: true };
  document.dispatchEvent(new KeyboardEvent("keydown", eventInit));
  document.dispatchEvent(new KeyboardEvent("keyup", eventInit));
}

function performSwipe(action, likeBtn, nopeBtn) {
  const button = action === "right" ? likeBtn : nopeBtn;
  if (button) {
    button.click();
    return true;
  }
  dispatchKeyFallback(action === "right" ? "ArrowRight" : "ArrowLeft");
  return false;
}

function getActiveCardRoot() {
  for (const selector of CARD_CONTAINER_SELECTORS) {
    const nodes = document.querySelectorAll(selector);
    if (nodes.length) return nodes[nodes.length - 1];
  }
  return document.body;
}

function readNameAge(root) {
  const candidates = root.querySelectorAll("h1, h2, span, div");
  for (const el of candidates) {
    const text = (el.textContent || "").trim();
    const match = text.match(NAME_AGE_RE);
    if (match) {
      return { name: match[1].trim(), age: parseInt(match[2], 10) };
    }
  }
  return { name: null, age: null };
}

function readBio(root) {
  for (const selector of BIO_SELECTORS) {
    const el = root.querySelector(selector);
    const text = el?.textContent?.trim();
    if (text) return text;
  }
  return null;
}

function readDistanceKm(root) {
  const match = (root.textContent || "").match(DISTANCE_RE);
  if (!match) return null;
  const value = parseFloat(match[1]);
  return match[2].toLowerCase().startsWith("mi") ? value * 1.60934 : value;
}

function readPhotoCount(root) {
  for (const selector of PHOTO_INDICATOR_SELECTORS) {
    const count = root.querySelectorAll(selector).length;
    if (count > 0) return count;
  }
  return null;
}

function readCardInfo() {
  const root = getActiveCardRoot();
  const { name, age } = readNameAge(root);
  return {
    name,
    age,
    bio: readBio(root),
    distanceKm: readDistanceKm(root),
    photoCount: readPhotoCount(root),
  };
}

/** Decides left/right for a card against the user's filters. Never touches the network. */
function decideSwipe(card, settings) {
  const reasons = [];

  if (card.age != null && (card.age < settings.minAge || card.age > settings.maxAge)) {
    reasons.push("age");
  }
  if (card.distanceKm != null && card.distanceKm > settings.maxDistanceKm) {
    reasons.push("distance");
  }
  if (card.photoCount != null && card.photoCount < settings.minPhotos) {
    reasons.push("photos");
  }

  const bioLower = (card.bio || "").toLowerCase();
  if (settings.bannedKeywords.some((word) => bioLower.includes(word))) {
    reasons.push("banned-keyword");
  }
  if (settings.requiredKeywords.length && !settings.requiredKeywords.some((word) => bioLower.includes(word))) {
    reasons.push("missing-required-keyword");
  }

  if (reasons.length) {
    return { action: "left", filtered: true, reasons };
  }

  const preferredMatch = settings.preferredKeywords.length && settings.preferredKeywords.some((word) => bioLower.includes(word));
  const passesLikeRatio = Math.random() < settings.likeRatio;

  return { action: preferredMatch || passesLikeRatio ? "right" : "left", filtered: false };
}

function randomDelayMs(settings) {
  const minMs = Math.max(300, settings.minDelaySeconds * 1000);
  const maxMs = Math.max(minMs, settings.maxDelaySeconds * 1000);
  return minMs + Math.random() * (maxMs - minMs);
}

async function recordSwipe(decision) {
  state.stats.totalSwipes += 1;
  const deltas = { totalSwipes: 1 };

  if (decision.filtered) {
    state.stats.skippedByFilter += 1;
    deltas.skippedByFilter = 1;
  } else if (decision.action === "right") {
    state.stats.likes += 1;
    deltas.likes = 1;
  } else {
    state.stats.nopes += 1;
    deltas.nopes = 1;
  }

  await Storage.addSessionStats(deltas);
}

function scheduleTick(delayMs) {
  if (state.timer) clearTimeout(state.timer);
  state.timer = setTimeout(tick, delayMs);
}

async function tick() {
  if (!state.running) return;

  try {
    const likeBtn = findButton(LIKE_SELECTORS);
    const nopeBtn = findButton(NOPE_SELECTORS);

    if (!likeBtn && !nopeBtn) {
      state.lastAction = { action: "waiting-for-cards", at: new Date().toISOString() };
      scheduleTick(WAIT_RETRY_MS);
      return;
    }

    const card = readCardInfo();
    const decision = decideSwipe(card, state.settings);
    const clickedButton = performSwipe(decision.action, likeBtn, nopeBtn);
    await recordSwipe(decision);

    state.lastAction = {
      action: decision.action,
      filtered: decision.filtered,
      reasons: decision.reasons || [],
      card,
      clickedButton,
      at: new Date().toISOString(),
    };

    scheduleTick(randomDelayMs(state.settings));
  } catch (error) {
    state.lastError = error?.message || String(error);
    scheduleTick(ERROR_RETRY_MS);
  }
}

async function ensureSettingsLoaded() {
  if (!state.settings) {
    state.settings = await Storage.getSwipeSettings();
  }
  return state.settings;
}

async function startSession(partialSettings) {
  if (partialSettings) {
    state.settings = await Storage.saveSwipeSettings(partialSettings);
  } else {
    await ensureSettingsLoaded();
  }

  if (state.running) return buildStatus();

  state.running = true;
  state.stats = { totalSwipes: 0, likes: 0, nopes: 0, skippedByFilter: 0 };
  state.startedAt = new Date().toISOString();
  state.lastError = null;
  scheduleTick(0);

  return buildStatus();
}

function stopSession() {
  state.running = false;
  if (state.timer) {
    clearTimeout(state.timer);
    state.timer = null;
  }
}

async function updateFilters(partialSettings) {
  state.settings = await Storage.saveSwipeSettings(partialSettings || {});
  return state.settings;
}

function buildStatus(extra = {}) {
  return {
    running: state.running,
    stats: { ...state.stats },
    settings: state.settings,
    startedAt: state.startedAt,
    pageReady: Boolean(findButton(LIKE_SELECTORS) || findButton(NOPE_SELECTORS)),
    lastAction: state.lastAction,
    lastError: state.lastError,
    ...extra,
  };
}

async function getStatus() {
  await ensureSettingsLoaded();
  return buildStatus();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "START_SWIPE") {
    startSession(message.settings).then((status) => sendResponse({ ok: true, status }));
    return true;
  }

  if (message?.type === "STOP_SWIPE") {
    stopSession();
    sendResponse({ ok: true, status: buildStatus() });
    return false;
  }

  if (message?.type === "GET_STATUS") {
    getStatus().then((status) => sendResponse({ ok: true, status }));
    return true;
  }

  if (message?.type === "UPDATE_FILTERS") {
    updateFilters(message.settings).then((settings) => sendResponse({ ok: true, settings }));
    return true;
  }

  return false;
});

window.addEventListener("beforeunload", stopSession);

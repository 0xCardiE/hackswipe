# HackSwipe

**Get matches without buying Gold.**

HackSwipe is a free, open-source Chrome extension that auto-swipes Tinder with your filters — so you stop funding the paywall and still get results.

> Tinder isn't in the matching business. **They're in the billing business.**

Every Boost, Super Like, and Gold subscription exists because manual swiping feels hopeless. HackSwipe flips that: set your filters once, let it swipe with human-like delays, and come back when someone likes you back. **You** pick who to match with.

No accounts. No subscriptions. No license keys. Unlimited usage. MIT licensed.

---

## Why this exists

Tinder's business model isn't really to match people — it's to monetize impatience:

- **Gold** so you can see who liked you
- **Boosts** so your profile jumps the queue
- **Super Likes** so you stand out in a sea of swipes

You're not bad at dating. You're being sold the feeling that swiping manually is too slow. Auto-swipe removes the reason to pay for any of that.

HackSwipe is Tinder-only, runs locally in your browser, and never uploads profile data anywhere. Filters and stats stay on your device.

> *"Match people? Cute story. Charge people who are lonely and busy? That's the product."*

---

## Features

- **Smart filters** — age range, max distance, minimum photos, bio keyword bans/required/preferred
- **Human-like delays** — random pause between swipes so activity looks natural
- **Like ratio** — like a configurable % of passing profiles; pass on the rest to avoid bot patterns
- **Session stats** — swipes, likes, nopes, filtered counts
- **Side panel UI** — stays open while you browse Tinder

---

## Install in Chrome (developer mode)

No build step. Load the extension folder directly.

### 1. Clone the repo

```bash
git clone https://github.com/0xCardiE/hackswipe.git
cd hackswipe
```

### 2. Open Chrome extensions

Go to `chrome://extensions/` in Chrome (or Edge/Brave — any Chromium browser).

### 3. Enable Developer mode

Toggle **Developer mode** in the top-right corner.

### 4. Load unpacked

Click **Load unpacked** and select the `extension/` folder inside this repo:

```
hackswipe/extension/
```

The HackSwipe icon should appear in your toolbar.

### 5. Open Tinder

Go to [tinder.com](https://tinder.com) and log in. Open the discovery/swipe page.

### 6. Open the side panel

Click the HackSwipe icon in the toolbar. The side panel opens.

1. Go to **Settings** and set your filters
2. Go to **Swipe** and click **Start Swiping**
3. Check **Stats** for session totals

If the panel says "Reload the Tinder tab to connect HackSwipe", refresh the Tinder page once.

---

## How it works

1. **Install** — load the extension in Chrome (see above)
2. **Set filters** — age, distance, photos, keywords (under a minute)
3. **Start auto-swipe** — HackSwipe likes or passes profiles that match your rules
4. **Pick your matches** — when someone likes you back, you choose who to talk to

---

## Project structure

```
hackswipe/
├── extension/           ← the Chrome extension (load this folder)
│   ├── manifest.json
│   ├── background.js
│   ├── content/
│   │   └── tinder.js    ← auto-swipe engine
│   ├── lib/
│   │   └── storage.js   ← settings + stats (chrome.storage.local)
│   └── ui/              ← side panel
└── store-assets/        ← screenshots for future Chrome Web Store listing
```

---

## Contributing

Pull requests welcome. Tinder changes its web UI often — DOM selector fixes are especially valuable.

1. Fork the repo
2. Create a branch
3. Make your change
4. Test by loading `extension/` unpacked in Chrome on tinder.com
5. Open a PR

---

## Disclaimer

HackSwipe is an **independent, third-party tool**. It is **not affiliated with, endorsed by, or sponsored by Tinder or Match Group**.

Using automation on Tinder may violate [Tinder's Terms of Service](https://www.tinder.com/terms). You use this extension **at your own risk**. The authors are not responsible for account restrictions, bans, or any other consequences.

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

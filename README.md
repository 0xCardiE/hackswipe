# HackSwipe — free Tinder auto swiper (Chrome extension)

**A free, open-source Tinder swiper for Chrome.** Auto-swipe with filters, skip Gold, pick your matches.

HackSwipe is a **free Tinder auto swiper** — a Chrome extension that swipes for you on [tinder.com](https://tinder.com) using your own rules (age, distance, photos, bio keywords). No subscription, no license key, no paid tier. Unlimited swipes.

Looking for a **free auto swiper for Tinder** that isn't another monthly subscription? This is it.

> Tinder isn't in the matching business. **They're in the billing business.**

Every Boost, Super Like, and Gold plan exists because manual swiping feels hopeless. HackSwipe flips that: set your filters once, let the **Tinder auto-swipe** run with human-like delays, and come back when someone likes you back. **You** pick who to match with.

No accounts. No subscriptions. No license keys. **100% free.** MIT licensed.

---

## Free Tinder swiper — what you get

| | HackSwipe |
|---|---|
| **Price** | Free, forever |
| **Platform** | Tinder web (`tinder.com`) in Chrome |
| **Auto swipe** | Yes — likes and passes based on your filters |
| **Filters** | Age, distance, min photos, bio keywords |
| **Subscriptions** | None |
| **Open source** | Yes — fork it, fix it, share it |

Compared to paid Tinder swipers and monthly auto-swipe subscriptions, HackSwipe is a **free Tinder bot alternative** that runs locally in your browser. Your filters and stats never leave your device.

---

## Why this exists

Tinder's business model isn't really to match people — it's to monetize impatience:

- **Gold** so you can see who liked you
- **Boosts** so your profile jumps the queue
- **Super Likes** so you stand out in a sea of swipes

You're not bad at dating. You're being sold the feeling that swiping manually is too slow. A **free Tinder auto-swiper** removes the reason to pay for any of that.

> *"Match people? Cute story. Charge people who are lonely and busy? That's the product."*

---

## Features

- **Smart filters** — age range, max distance, minimum photos, bio keyword bans/required/preferred
- **Auto swipe Tinder** — likes or passes profiles that match (or fail) your rules
- **Human-like delays** — random pause between swipes so activity looks natural
- **Like ratio** — like a configurable % of passing profiles; pass on the rest
- **Session stats** — swipes, likes, nopes, filtered counts
- **Side panel UI** — stays open while you browse Tinder

---

## Install the free Tinder swiper (Chrome, dev mode)

No build step. Load the extension folder directly — the fastest way to try a **free Tinder swiper on Chrome**.

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

### 6. Start auto-swiping

Click the HackSwipe icon in the toolbar. The side panel opens.

1. Go to **Settings** and set your filters
2. Go to **Swipe** and click **Start Swiping**
3. Check **Stats** for session totals

If the panel says "Reload the Tinder tab to connect HackSwipe", refresh the Tinder page once.

---

## How the Tinder auto swiper works

1. **Install** — load the extension in Chrome (see above)
2. **Set filters** — age, distance, photos, keywords (under a minute)
3. **Auto swipe** — HackSwipe likes or passes profiles that match your rules
4. **Pick your matches** — when someone likes you back, you choose who to talk to

---

## FAQ

**Is HackSwipe a free Tinder swiper?**  
Yes. Completely free, open source, unlimited usage. No trial that expires, no paywall.

**Does it work as a Tinder auto liker / auto swiper?**  
Yes, on Tinder web in Chrome. It swipes right on profiles that pass your filters and left on the rest.

**Is this a Tinder bot?**  
It automates swiping with configurable filters and delays. You still choose who to match with when there's a mutual like.

**Tinder or Twitter?**  
**Tinder only** (`tinder.com`). This is not a Twitter/X tool.

**Do I need to pay for Gold or a subscription swiper?**  
No. That's the point — HackSwipe is a free alternative to paid auto-swipe tools and Tinder premium features.

---

## Project structure

```
hackswipe/
├── extension/           ← the Chrome extension (load this folder)
│   ├── manifest.json
│   ├── background.js
│   ├── content/
│   │   └── tinder.js    ← Tinder auto-swipe engine
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

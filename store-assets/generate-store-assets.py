#!/usr/bin/env python3
"""Generate Chrome Web Store listing images for HackSwipe."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ICONS = ROOT / "extension" / "icons"
OUT = Path(__file__).resolve().parent

ACCENT = (255, 45, 85)  # HackSwipe brand pink/red (#ff2d55)
WHITE = (255, 255, 255)
BG = (255, 255, 255)
TEXT = (26, 26, 27)
MUTED = (120, 124, 126)
SURFACE = (246, 247, 248)
BORDER = (237, 239, 241)
OK = (0, 138, 0)
LIKE_GREEN = (60, 179, 113)
NOPE_RED = (232, 65, 66)

FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def font(size: int, *, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold else FONT_REG
    return ImageFont.truetype(path, size)


def rgb(img: Image.Image) -> Image.Image:
    if img.mode == "RGBA":
        base = Image.new("RGB", img.size, WHITE)
        base.paste(img, mask=img.split()[3])
        return base
    return img.convert("RGB")


def rounded_rect(
    draw: ImageDraw.ImageDraw,
    box: tuple[float, float, float, float],
    radius: int,
    *,
    fill: tuple[int, ...] | None = None,
    outline: tuple[int, ...] | None = None,
    width: int = 1,
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def save_rgb(path: Path, img: Image.Image) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    rgb(img).save(path, format="PNG", optimize=True)
    print(f"  {path.name}")


def load_icon(size: int) -> Image.Image:
    icon = Image.open(ICONS / "icon128.png").convert("RGBA")
    return icon.resize((size, size), Image.Resampling.LANCZOS)


def draw_store_icon() -> Image.Image:
    return load_icon(128)


def draw_panel_header(draw: ImageDraw.ImageDraw, x0: int, y0: int, width: int, *, trial_text: str) -> None:
    # Caller pastes the icon separately (RGBA icon can't be drawn via ImageDraw).
    pad = 16
    cx = x0 + pad
    draw.text((cx + 38, y0 + 14), "HackSwipe", fill=TEXT, font=font(15, bold=True))
    draw.text((cx + 38, y0 + 33), "Auto-swipe Tinder", fill=MUTED, font=font(9))
    tw = draw.textlength(trial_text, font=font(9, bold=True))
    rounded_rect(
        draw,
        (x0 + width - pad - tw - 16, y0 + 14, x0 + width - pad, y0 + 32),
        9,
        fill=(255, 45, 85, 22),
        outline=ACCENT,
    )
    draw.text((x0 + width - pad - tw - 8, y0 + 18), trial_text, fill=ACCENT, font=font(9, bold=True))


def draw_nav_tabs(draw: ImageDraw.ImageDraw, x0: int, y0: int, width: int, *, active: str) -> int:
    tabs = ["Swipe", "Stats", "Settings", "License"]
    tab_w = width / len(tabs)
    y1 = y0 + 30
    draw.line((x0, y1, x0 + width, y1), fill=BORDER, width=1)
    for i, label in enumerate(tabs):
        tx = x0 + i * tab_w
        is_active = label == active
        color = ACCENT if is_active else MUTED
        tw = draw.textlength(label, font=font(10, bold=is_active))
        draw.text((tx + (tab_w - tw) / 2, y0 + 6), label, fill=color, font=font(10, bold=is_active))
        if is_active:
            draw.line((tx + 10, y1, tx + tab_w - 10, y1), fill=ACCENT, width=2)
    return y1 + 12


def draw_counters(draw: ImageDraw.ImageDraw, x0: int, y: int, width: int, counters: list[tuple[str, str, tuple[int, int, int]]]) -> int:
    pad = 16
    gap = 8
    card_w = (width - pad * 2 - gap * (len(counters) - 1)) / len(counters)
    for i, (value, label, color) in enumerate(counters):
        cx0 = x0 + pad + i * (card_w + gap)
        rounded_rect(draw, (cx0, y, cx0 + card_w, y + 52), 10, fill=SURFACE, outline=BORDER)
        vw = draw.textlength(value, font=font(16, bold=True))
        draw.text((cx0 + (card_w - vw) / 2, y + 8), value, fill=color, font=font(16, bold=True))
        lw = draw.textlength(label, font=font(8))
        draw.text((cx0 + (card_w - lw) / 2, y + 30), label, fill=MUTED, font=font(8))
    return y + 62


def draw_filter_chips(draw: ImageDraw.ImageDraw, x0: int, y: int, width: int, chips: list[str]) -> int:
    pad = 16
    draw.text((x0 + pad, y), "ACTIVE FILTERS", fill=MUTED, font=font(8, bold=True))
    y += 18
    cx = x0 + pad
    row_h = 24
    for chip in chips:
        cw = draw.textlength(chip, font=font(9)) + 20
        if cx + cw > x0 + width - pad:
            cx = x0 + pad
            y += row_h + 6
        rounded_rect(draw, (cx, y, cx + cw, y + row_h), 12, fill=SURFACE, outline=BORDER)
        draw.text((cx + 10, y + 6), chip, fill=TEXT, font=font(9))
        cx += cw + 6
    return y + row_h + 12


def draw_swipe_panel(width: int, height: int, *, running: bool, stats: tuple[int, int, int, int]) -> Image.Image:
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    rounded_rect(draw, (0, 0, width - 1, height - 1), 0, fill=BG, outline=BORDER, width=1)

    icon = load_icon(30)
    img.paste(icon, (16, 14), icon)
    draw_panel_header(draw, 0, 0, width, trial_text="FREE · OPEN SOURCE")
    y = draw_nav_tabs(draw, 0, 56, width, active="Swipe")

    pad = 16
    status_h = 30
    status_fill = (0, 138, 0, 20) if running else (120, 124, 126, 18)
    status_color = OK if running else MUTED
    rounded_rect(draw, (pad, y, width - pad, y + status_h), 8, fill=status_fill)
    draw.ellipse((pad + 10, y + 11, pad + 18, y + 19), fill=status_color)
    status_text = "Tinder tab detected — ready" if running else "Open Tinder to begin"
    draw.text((pad + 24, y + 8), status_text, fill=status_color, font=font(10, bold=True))
    y += status_h + 12

    btn_label = "Stop Swiping" if running else "Start Swiping"
    btn_color = NOPE_RED if running else ACCENT
    rounded_rect(draw, (pad, y, width - pad, y + 40), 20, fill=btn_color)
    tw = draw.textlength(btn_label, font=font(13, bold=True))
    draw.text(((width - tw) / 2, y + 12), btn_label, fill=WHITE, font=font(13, bold=True))
    y += 52

    y = draw_filter_chips(draw, 0, y, width, ["Age 22-30", "Within 15 km", "Min 3 photos", "No OnlyFans mentions"])
    total, likes, nopes, filtered = stats
    draw_counters(
        draw,
        0,
        y,
        width,
        [
            (str(total), "Swipes", TEXT),
            (str(likes), "Likes", LIKE_GREEN),
            (str(nopes), "Nopes", NOPE_RED),
            (str(filtered), "Filtered", MUTED),
        ],
    )
    return img


def draw_stats_panel(width: int, height: int) -> Image.Image:
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    rounded_rect(draw, (0, 0, width - 1, height - 1), 0, fill=BG, outline=BORDER, width=1)

    icon = load_icon(30)
    img.paste(icon, (16, 14), icon)
    draw_panel_header(draw, 0, 0, width, trial_text="FREE · OPEN SOURCE")
    y = draw_nav_tabs(draw, 0, 56, width, active="Stats")

    pad = 16
    draw.text((pad, y), "LIFETIME TOTALS", fill=MUTED, font=font(8, bold=True))
    y += 18
    y = draw_counters(
        draw,
        0,
        y,
        width,
        [
            ("1,842", "Swipes", TEXT),
            ("612", "Likes", LIKE_GREEN),
            ("1,230", "Nopes", NOPE_RED),
            ("340", "Filtered", MUTED),
        ],
    )

    y += 8
    draw.text((pad, y), "CURRENT SESSION", fill=MUTED, font=font(8, bold=True))
    y += 20
    rounded_rect(draw, (pad, y, width - pad, y + 64), 10, fill=SURFACE, outline=BORDER)
    draw.text((pad + 12, y + 10), "Session time", fill=MUTED, font=font(10))
    draw.text((width - pad - 12 - draw.textlength("18m 42s", font=font(10, bold=True)), y + 10), "18m 42s", fill=TEXT, font=font(10, bold=True))
    draw.text((pad + 12, y + 34), "Last swipe", fill=MUTED, font=font(10))
    draw.text((width - pad - 12 - draw.textlength("6s ago", font=font(10, bold=True)), y + 34), "6s ago", fill=TEXT, font=font(10, bold=True))
    return img


def draw_settings_panel(width: int, height: int) -> Image.Image:
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    rounded_rect(draw, (0, 0, width - 1, height - 1), 0, fill=BG, outline=BORDER, width=1)

    icon = load_icon(30)
    img.paste(icon, (16, 14), icon)
    draw_panel_header(draw, 0, 0, width, trial_text="FREE · OPEN SOURCE")
    y = draw_nav_tabs(draw, 0, 56, width, active="Settings")

    pad = 16
    draw.text((pad, y), "WHO TO SWIPE ON", fill=MUTED, font=font(8, bold=True))
    y += 18

    fields = [("Min age", "22"), ("Max age", "30")]
    field_w = (width - pad * 2 - 8) / 2
    for i, (label, value) in enumerate(fields):
        fx = pad + i * (field_w + 8)
        draw.text((fx, y), label, fill=MUTED, font=font(9))
        rounded_rect(draw, (fx, y + 14, fx + field_w, y + 38), 8, fill=SURFACE, outline=BORDER)
        draw.text((fx + 10, y + 20), value, fill=TEXT, font=font(11, bold=True))
    y += 50

    for label, value in [("Max distance (km)", "15"), ("Min photos", "3")]:
        draw.text((pad, y), label, fill=MUTED, font=font(9))
        rounded_rect(draw, (pad, y + 14, width - pad, y + 38), 8, fill=SURFACE, outline=BORDER)
        draw.text((pad + 10, y + 20), value, fill=TEXT, font=font(11, bold=True))
        y += 50

    draw.text((pad, y), "BIO KEYWORDS", fill=MUTED, font=font(8, bold=True))
    y += 18
    draw.text((pad, y), "Banned keywords", fill=MUTED, font=font(9))
    rounded_rect(draw, (pad, y + 14, width - pad, y + 46), 8, fill=SURFACE, outline=BORDER)
    draw.text((pad + 10, y + 22), "onlyfans, cashapp", fill=TEXT, font=font(10))
    return img


def draw_license_panel(width: int, height: int) -> Image.Image:
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    rounded_rect(draw, (0, 0, width - 1, height - 1), 0, fill=BG, outline=BORDER, width=1)

    icon = load_icon(30)
    img.paste(icon, (16, 14), icon)
    draw_panel_header(draw, 0, 0, width, trial_text="FREE · OPEN SOURCE")
    y = draw_nav_tabs(draw, 0, 56, width, active="License")

    pad = 16
    rounded_rect(draw, (pad, y, width - pad, y + 34), 8, fill=(255, 45, 85, 16), outline=(255, 45, 85, 60))
    draw.text((pad + 10, y + 10), "Unlimited. Free. Open source.", fill=ACCENT, font=font(10, bold=True))
    y += 46

    draw.text((pad, y), "LIFETIME LICENSE", fill=MUTED, font=font(8, bold=True))
    y += 18
    draw.text((pad, y), "MIT licensed — fork it, fix it, share it", fill=MUTED, font=font(9))
    draw.text((pad, y + 14), "swiping forever, plus future updates.", fill=MUTED, font=font(9))
    y += 36

    rounded_rect(draw, (pad, y, width - pad, y + 40), 20, fill=ACCENT)
    label = "View source on GitHub"
    tw = draw.textlength(label, font=font(12, bold=True))
    draw.text(((width - tw) / 2, y + 13), label, fill=WHITE, font=font(12, bold=True))
    y += 56

    draw.text((pad, y), "Pull requests welcome", fill=MUTED, font=font(9))
    y += 20
    for label, placeholder in [("Email", "you@example.com"), ("License key", "XXXX-XXXX-XXXX")]:
        draw.text((pad, y), label, fill=MUTED, font=font(9))
        rounded_rect(draw, (pad, y + 14, width - pad, y + 38), 8, fill=SURFACE, outline=BORDER)
        draw.text((pad + 10, y + 20), placeholder, fill=MUTED, font=font(10))
        y += 50
    return img


def draw_browser_chrome(draw: ImageDraw.ImageDraw, w: int, h: int, *, url: str, tab_title: str) -> None:
    rounded_rect(draw, (0, 0, w, h), 0, fill=(243, 244, 246))
    rounded_rect(draw, (12, 12, w - 12, h - 12), 10, fill=WHITE, outline=BORDER)

    bar_h = 44
    rounded_rect(draw, (12, 12, w - 12, 12 + bar_h), 10, fill=(232, 233, 235))
    for i, color in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        draw.ellipse((28 + i * 22, 26, 40 + i * 22, 38), fill=color)

    tab_w = 220
    rounded_rect(draw, (90, 18, 90 + tab_w, 12 + bar_h - 2), 6, fill=WHITE)
    draw.text((104, 28), tab_title[:24], fill=TEXT, font=font(10))

    url_y = 12 + bar_h + 8
    rounded_rect(draw, (24, url_y, w - 36, url_y + 32), 16, fill=SURFACE, outline=BORDER)
    draw.text((40, url_y + 9), url, fill=MUTED, font=font(11))


def draw_tinder_card(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], *, name: str, age: int, bio: str, distance: str) -> None:
    x0, y0, x1, y1 = box
    rounded_rect(draw, (x0, y0, x1, y1), 0, fill=(228, 230, 233))

    card_pad = 40
    cx0, cy0, cx1, cy1 = x0 + card_pad, y0 + 24, x1 - card_pad, y1 - 60
    for i in range(cy1 - cy0):
        t = i / max(1, cy1 - cy0)
        shade = int(210 - 60 * t)
        draw.line((cx0, cy0 + i, cx1, cy0 + i), fill=(shade, shade + 6, shade + 10))
    rounded_rect(draw, (cx0, cy0, cx1, cy1), 18, outline=WHITE, width=3)

    dot_y = cy0 + 12
    dot_w = (cx1 - cx0 - 24) / 4
    for i in range(4):
        dx = cx0 + 12 + i * (dot_w + 4)
        rounded_rect(draw, (dx, dot_y, dx + dot_w, dot_y + 4), 2, fill=(255, 255, 255, 220 if i == 0 else 130))

    overlay_y = cy1 - 92
    rounded_rect(draw, (cx0, overlay_y, cx1, cy1), 18, fill=(0, 0, 0, 0))
    draw.rectangle((cx0, overlay_y, cx1, cy1), fill=None)
    for i in range(cy1 - overlay_y):
        t = i / max(1, cy1 - overlay_y)
        draw.line((cx0, overlay_y + i, cx1, overlay_y + i), fill=(0, 0, 0), width=1)
    name_line = f"{name}, {age}"
    draw.text((cx0 + 20, overlay_y + 14), name_line, fill=WHITE, font=font(20, bold=True))
    draw.text((cx0 + 20, overlay_y + 42), distance, fill=(230, 230, 230), font=font(11))
    draw.text((cx0 + 20, overlay_y + 62), bio, fill=(230, 230, 230), font=font(10))

    btn_y = cy1 + 20
    draw.ellipse((cx0 + (cx1 - cx0) / 2 - 100, btn_y, cx0 + (cx1 - cx0) / 2 - 40, btn_y + 44), outline=NOPE_RED, width=3, fill=WHITE)
    draw.line((cx0 + (cx1 - cx0) / 2 - 88, btn_y + 12, cx0 + (cx1 - cx0) / 2 - 64, btn_y + 32), fill=NOPE_RED, width=3)
    draw.line((cx0 + (cx1 - cx0) / 2 - 64, btn_y + 12, cx0 + (cx1 - cx0) / 2 - 88, btn_y + 32), fill=NOPE_RED, width=3)
    draw.ellipse((cx0 + (cx1 - cx0) / 2 + 40, btn_y, cx0 + (cx1 - cx0) / 2 + 100, btn_y + 44), outline=LIKE_GREEN, width=3, fill=WHITE)
    heart_cx, heart_cy = cx0 + (cx1 - cx0) / 2 + 70, btn_y + 22
    draw.ellipse((heart_cx - 10, heart_cy - 8, heart_cx, heart_cy + 2), fill=LIKE_GREEN)
    draw.ellipse((heart_cx, heart_cy - 8, heart_cx + 10, heart_cy + 2), fill=LIKE_GREEN)
    draw.polygon(
        [(heart_cx - 10, heart_cy - 2), (heart_cx + 10, heart_cy - 2), (heart_cx, heart_cy + 12)],
        fill=LIKE_GREEN,
    )


def compose_screenshot(
    *,
    panel: str,
    tab_title: str,
    url: str = "tinder.com",
    **panel_kwargs,
) -> Image.Image:
    w, h = 1280, 800
    img = Image.new("RGB", (w, h), (243, 244, 246))
    draw = ImageDraw.Draw(img)

    panel_w = 360
    content_w = w - panel_w - 24
    draw_browser_chrome(draw, content_w, h, url=url, tab_title=tab_title)

    content_top = 12 + 44 + 8 + 32 + 8
    draw_tinder_card(
        draw,
        (12, content_top, content_w - 12, h - 12),
        name="Alex",
        age=27,
        bio="Coffee, hiking, and terrible puns.",
        distance="4 km away",
    )

    builders = {
        "swipe": lambda: draw_swipe_panel(panel_w, h - 24, running=panel_kwargs.get("running", True), stats=panel_kwargs.get("stats", (24, 9, 12, 3))),
        "stats": lambda: draw_stats_panel(panel_w, h - 24),
        "settings": lambda: draw_settings_panel(panel_w, h - 24),
        "license": lambda: draw_license_panel(panel_w, h - 24),
    }
    panel_img = builders[panel]()
    img.paste(panel_img, (content_w + 6, 12), panel_img)
    return img


def draw_promo_small() -> Image.Image:
    w, h = 440, 280
    img = Image.new("RGB", (w, h), BG)
    draw = ImageDraw.Draw(img)

    draw.rectangle((0, 0, w, 6), fill=ACCENT)

    icon = load_icon(72)
    img.paste(icon, (32, 36), icon)

    draw.text((120, 48), "HackSwipe", fill=TEXT, font=font(24, bold=True))

    draw.text((32, 130), "Auto-swipe Tinder with your own filters.", fill=TEXT, font=font(14, bold=True))
    draw.text((32, 158), "Age, distance, minimum photos, bio keyword bans.", fill=MUTED, font=font(12))
    draw.text((32, 178), "Human-like delays. You still choose who to match.", fill=MUTED, font=font(12))

    rounded_rect(draw, (32, 220, 190, 256), 18, fill=ACCENT)
    draw.text((52, 232), "Add to Chrome", fill=WHITE, font=font(12, bold=True))

    draw.text((208, 232), "Free & open source", fill=MUTED, font=font(10))
    return img


def draw_promo_marquee() -> Image.Image:
    w, h = 1400, 560
    img = Image.new("RGB", (w, h), BG)
    draw = ImageDraw.Draw(img)

    for x in range(w):
        t = x / w
        r = 255
        g = int(255 - (255 - 248) * t)
        b = int(255 - (255 - 249) * t)
        draw.line((x, 0, x, h), fill=(r, g, b))

    draw.ellipse((980, -80, 1380, 320), fill=(255, 45, 85))
    draw.rectangle((0, 0, w, 8), fill=ACCENT)

    icon = load_icon(96)
    img.paste(icon, (72, 72), icon)
    draw.text((190, 96), "HackSwipe", fill=TEXT, font=font(38, bold=True))

    draw.text(
        (72, 210),
        "Auto-swipe Tinder using your own filters.",
        fill=TEXT,
        font=font(40, bold=True),
    )
    draw.text(
        (72, 270),
        "Get matches without paying for Tinder Gold or spending hours swiping.",
        fill=MUTED,
        font=font(20),
    )

    bullets = [
        "Age, distance, minimum photos, and bio keyword filters",
        "Human-like delays keep swiping looking natural",
        "You choose who to actually match with — HackSwipe only swipes",
    ]
    by = 330
    for bullet in bullets:
        draw.ellipse((72, by + 6, 84, by + 18), fill=ACCENT)
        draw.text((96, by), bullet, fill=TEXT, font=font(18))
        by += 36

    rounded_rect(draw, (72, 460, 330, 510), 24, fill=ACCENT)
    draw.text((100, 476), "Add to Chrome — Free", fill=WHITE, font=font(15, bold=True))

    preview = compose_screenshot(panel="swipe", tab_title="Tinder")
    preview = preview.resize((480, 300), Image.Resampling.LANCZOS)
    rounded_rect(draw, (880, 130, 880 + 480, 130 + 300), 12, outline=BORDER, width=2)
    img.paste(preview, (880, 130))
    return img


def main() -> None:
    sys.path.insert(0, str(ICONS))
    print(f"Writing Chrome Web Store assets to {OUT}/")

    save_rgb(OUT / "store-icon-128.png", draw_store_icon())

    screenshots = [
        ("screenshot-1-swipe.png", compose_screenshot(panel="swipe", tab_title="Tinder — auto-swiping")),
        ("screenshot-2-stats.png", compose_screenshot(panel="stats", tab_title="Tinder — session stats")),
        ("screenshot-3-settings.png", compose_screenshot(panel="settings", tab_title="Tinder — filters")),
        ("screenshot-4-license.png", compose_screenshot(panel="license", tab_title="Tinder — license")),
        ("screenshot-5-idle.png", compose_screenshot(panel="swipe", tab_title="Tinder", running=False, stats=(0, 0, 0, 0))),
    ]
    for name, shot in screenshots:
        save_rgb(OUT / name, shot)

    save_rgb(OUT / "promo-small-440x280.png", draw_promo_small())
    save_rgb(OUT / "promo-marquee-1400x560.png", draw_promo_marquee())

    print("Done.")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Generate HackSwipe brand icons for the extension and landing site."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent

BG_DARK = (18, 10, 22)
PINK = (255, 45, 85)
WHITE = (255, 255, 255)

EXTENSION_SIZES = (16, 48, 128)


def draw_heart(draw: ImageDraw.ImageDraw, box: tuple[float, float, float, float], fill) -> None:
    """Classic two-circles-plus-triangle heart, scaled to fit box."""
    left, top, right, bottom = box
    width = right - left
    r = width / 4

    draw.ellipse((left, top, left + 2 * r, top + 2 * r), fill=fill)
    draw.ellipse((left + 2 * r, top, left + 4 * r, top + 2 * r), fill=fill)
    draw.polygon(
        [(left, top + r), (right, top + r), (left + 2 * r, bottom)],
        fill=fill,
    )


def draw_bolt(draw: ImageDraw.ImageDraw, cx: float, cy: float, scale: float, fill) -> None:
    """Small lightning bolt, the "auto/hack" badge overlaid on the heart."""
    points = [
        (cx + 0.05 * scale, cy - 0.55 * scale),
        (cx - 0.35 * scale, cy + 0.05 * scale),
        (cx - 0.05 * scale, cy + 0.05 * scale),
        (cx - 0.15 * scale, cy + 0.55 * scale),
        (cx + 0.35 * scale, cy - 0.1 * scale),
        (cx + 0.05 * scale, cy - 0.1 * scale),
    ]
    draw.polygon(points, fill=fill)


def draw_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = max(2, round(size * 0.22))
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=BG_DARK)

    pad = size * 0.2
    draw_heart(draw, (pad, pad * 1.05, size - pad, size - pad * 0.85), PINK)

    bolt_scale = size * 0.22
    draw_bolt(draw, size / 2, size * 0.52, bolt_scale, WHITE)

    return img


def draw_toolbar_glyph(size: int, *, light_bg: bool) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    color = PINK if light_bg else WHITE

    pad = size * 0.14
    draw_heart(draw, (pad, pad * 1.05, size - pad, size - pad * 0.85), color)

    return img


def save_png(path: Path, image: Image.Image) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, optimize=True)


def main() -> None:
    for icon_size in EXTENSION_SIZES:
        save_png(HERE / f"icon{icon_size}.png", draw_icon(icon_size))
        save_png(HERE / f"toolbar-icon{icon_size}-light.png", draw_toolbar_glyph(icon_size, light_bg=True))
        save_png(HERE / f"toolbar-icon{icon_size}-dark.png", draw_toolbar_glyph(icon_size, light_bg=False))

    print(f"Wrote extension icons to {HERE}")


if __name__ == "__main__":
    main()

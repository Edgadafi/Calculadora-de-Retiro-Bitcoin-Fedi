#!/usr/bin/env python3
"""Genera logo-app-transparent.png: recorte vertical + fondo oscuro → alpha."""
from __future__ import annotations

import math
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "logo-app.png"
DST = ROOT / "assets" / "logo-app-transparent.png"

# Fondo principal del lienzo (muestras en esquinas del área oscura)
BG_DARK = (8, 8, 16)
# Franjas claras arriba/abajo del PNG cuadrado
BG_WHITE = (248, 248, 248)
PADDING = 12


def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def is_white_margin(r: int, g: int, b: int) -> bool:
    return r > 240 and g > 240 and b > 240


def bg_alpha(r: int, g: int, b: int) -> int:
    """0 = transparente, 255 = opaco. Transición suave en bordes anti-alias."""
    if is_white_margin(r, g, b):
        return 0

    d_dark = color_distance((r, g, b), BG_DARK)
    d_white = color_distance((r, g, b), BG_WHITE)
    d_bg = min(d_dark, d_white)

    if d_bg <= 18:
        return 0
    if d_bg >= 42:
        return 255

    t = (d_bg - 18) / (42 - 18)
    return int(255 * t)


def content_bbox(im: Image.Image) -> tuple[int, int, int, int]:
    """Caja útil: excluye franjas blancas y recorta al bloque horizontal."""
    px = im.load()
    w, h = im.size
    xmin, ymin, xmax, ymax = w, h, 0, 0

    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            if is_white_margin(r, g, b):
                continue
            if bg_alpha(r, g, b) >= 200:
                xmin = min(xmin, x)
                xmax = max(xmax, x)
                ymin = min(ymin, y)
                ymax = max(ymax, y)

    if xmin > xmax:
        return 0, 0, w - 1, h - 1

    xmin = max(0, xmin - PADDING)
    ymin = max(0, ymin - PADDING)
    xmax = min(w - 1, xmax + PADDING)
    ymax = min(h - 1, ymax + PADDING)
    return xmin, ymin, xmax, ymax


def process(src: Path, dst: Path) -> None:
    if not src.is_file():
        raise FileNotFoundError(f"No se encontró {src}")

    im = Image.open(src).convert("RGBA")
    box = content_bbox(im)
    cropped = im.crop(box)

    out = Image.new("RGBA", cropped.size, (0, 0, 0, 0))
    src_px = cropped.load()
    out_px = out.load()

    for y in range(cropped.height):
        for x in range(cropped.width):
            r, g, b, _ = src_px[x, y]
            a = bg_alpha(r, g, b)
            if a == 0:
                continue
            out_px[x, y] = (r, g, b, a)

    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst, "PNG", optimize=True)
    print(f"OK: {dst} ({out.width}x{out.height}, {dst.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    try:
        process(SRC, DST)
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)

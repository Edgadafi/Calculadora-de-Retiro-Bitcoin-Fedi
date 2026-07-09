#!/usr/bin/env python3
"""Exporta logo-fedi-icon.svg a PNG 1024/512/192 para catálogo Fedi y PWA."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "logo-fedi-icon.svg"
OUT_DIR = ROOT / "assets"
SIZES = (1024, 512, 192)


def render_with_cairosvg(src: Path, dst: Path, size: int) -> None:
    import cairosvg

    cairosvg.svg2png(
        url=str(src),
        write_to=str(dst),
        output_width=size,
        output_height=size,
    )


def render_with_pillow(src: Path, dst: Path, size: int) -> None:
    """Fallback: rasteriza vía PIL si cairosvg no está instalado."""
    from PIL import Image, ImageDraw

    # Recrear brújula v2 en raster (misma paleta que el SVG)
    navy = (30, 43, 88)
    orange = (240, 125, 56)
    south = (74, 85, 104)

    im = Image.new("RGB", (size, size), navy)
    draw = ImageDraw.Draw(im)
    cx = cy = size // 2
    scale = size / 512

    def s(v: float) -> int:
        return int(v * scale)

    # Anillo
    r = s(168)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=orange, width=max(2, s(6)))

    # Marcas cardinales
    tick = s(16)
    for dx, dy in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
        ox, oy = s(164) * dx, s(164) * dy
        draw.line(
            [(cx + ox, cy + oy), (cx + ox + tick * dx, cy + oy + tick * dy)],
            fill=orange,
            width=max(2, s(4)),
        )

    # Aguja sur
    draw.polygon(
        [
            (cx, cy - s(88)),
            (cx - s(28), cy + s(64)),
            (cx, cy + s(44)),
            (cx + s(28), cy + s(64)),
        ],
        fill=south,
    )
    # Aguja norte
    draw.polygon(
        [
            (cx, cy + s(64)),
            (cx - s(28), cy - s(88)),
            (cx, cy - s(68)),
            (cx + s(28), cy - s(88)),
        ],
        fill=orange,
    )

    # Centro
    cr = s(36)
    draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=orange)

    im.save(dst, "PNG", optimize=True)


def export_all() -> None:
    if not SRC.is_file():
        raise FileNotFoundError(f"No se encontró {SRC}")

    use_cairo = False
    try:
        import cairosvg  # noqa: F401

        use_cairo = True
    except ImportError:
        pass

    for size in SIZES:
        dst = OUT_DIR / f"logo-fedi-{size}.png"
        if use_cairo:
            render_with_cairosvg(SRC, dst, size)
        else:
            render_with_pillow(SRC, dst, size)
        print(f"OK: {dst.name} ({size}x{size}, {dst.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    try:
        export_all()
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)

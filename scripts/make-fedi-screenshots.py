#!/usr/bin/env python3
"""Genera placeholders de screenshot para formulario Fedi (hasta capturas reales)."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "screenshots" / "fedi"
OUT.mkdir(parents=True, exist_ok=True)

BG = (8, 8, 16)
ORANGE = (240, 125, 56)
TEXT = (232, 234, 245)
MUTED = (144, 144, 184)

SCREENS = [
    ("calc-input-dark.png", "Tu plan de retiro", "Ahorro inicial · DCA · Horizonte"),
    ("calc-result-dark.png", "Tu proyección", "Saldo BTC · MXN · Gráfica"),
    ("calc-afore-dark.png", "AFORE vs Bitcoin", "Comparador educativo · ~5% real"),
]


def main() -> None:
    # Proporción portrait tipo móvil (Fedi)
    w, h = 390, 844
    try:
        font_title = ImageFont.truetype("arial.ttf", 28)
        font_sub = ImageFont.truetype("arial.ttf", 16)
    except OSError:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    icon_path = ROOT / "assets" / "logo-fedi-512.png"
    icon = Image.open(icon_path).convert("RGBA") if icon_path.is_file() else None

    for filename, title, subtitle in SCREENS:
        im = Image.new("RGB", (w, h), BG)
        draw = ImageDraw.Draw(im)
        if icon:
            thumb = icon.resize((120, 120), Image.Resampling.LANCZOS)
            im.paste(thumb, ((w - 120) // 2, 80), thumb)
        draw.text((32, 240), title, fill=ORANGE, font=font_title)
        draw.text((32, 290), subtitle, fill=TEXT, font=font_sub)
        draw.rectangle([32, 340, w - 32, h - 120], outline=(42, 42, 66), width=2)
        draw.text((48, 360), "retirobtc.mx/calc", fill=MUTED, font=font_sub)
        draw.text((48, h - 80), "Screenshot placeholder — reemplazar tras captura real", fill=MUTED, font=font_sub)
        dst = OUT / filename
        im.save(dst, "PNG", optimize=True)
        print(f"OK: {dst}")


if __name__ == "__main__":
    main()

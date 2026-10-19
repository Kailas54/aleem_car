from pathlib import Path

root = Path(__file__).resolve().parents[1] / "assets" / "brands"
root.mkdir(parents=True, exist_ok=True)

brands = [
    ("bridgestone", "BRIDGESTONE", "#000000", "#e21e26"),
    ("continental", "Continental", "#f5a623", "#000000"),
    ("goodyear", "GOODYEAR", "#004ea8", "#ffdd00"),
    ("michelin", "MICHELIN", "#294f9b", "#ffd500"),
    ("pirelli", "PIRELLI", "#000000", "#ffcc00"),
    ("bfgoodrich", "BFGoodrich", "#0054a6", "#e21e26"),
    ("cooper-tires", "Cooper", "#0054a6", "#e21e26"),
    ("dunlop", "DUNLOP", "#000000", "#ffcc00"),
    ("falken", "FALKEN", "#e21e26", "#111111"),
    ("hankook", "Hankook", "#f47b20", "#111111"),
    ("kumho", "KUMHO", "#e21e26", "#111111"),
    ("fortune-tires", "FORTUNE", "#1a7f37", "#111111"),
    ("matrax-tyres", "MatraX", "#111111", "#e21e26"),
    ("nexen", "NEXEN", "#7b2cbf", "#111111"),
    ("toyo-tires", "TOYO TIRES", "#111111", "#e21e26"),
    ("yokohama", "YOKOHAMA", "#e21e26", "#111111"),
    ("accelera", "Accelera", "#111111", "#e21e26"),
    ("zeetex", "ZEETEX", "#0b4f9c", "#111111"),
    ("vredestein-tyres", "Vredestein", "#111111", "#4caf50"),
    ("roadstone", "ROADSTONE", "#e21e26", "#111111"),
]

for slug, label, c1, c2 in brands:
    size = 12 if len(label) > 10 else 14
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 56" role="img" aria-label="{label}">
  <rect width="160" height="56" fill="#ffffff"/>
  <rect x="0" y="48" width="160" height="8" fill="{c2}"/>
  <rect x="0" y="0" width="6" height="56" fill="{c1}"/>
  <text x="83" y="33" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="{size}" font-weight="800" fill="{c1}">{label}</text>
</svg>
"""
    (root / f"{slug}.svg").write_text(svg, encoding="utf-8")

print(f"Wrote {len(brands)} logos to {root}")

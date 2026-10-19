"""Download tyre brand logos (Wikimedia + Google favicon fallback) into assets/brands/."""
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "brands"
OUT.mkdir(parents=True, exist_ok=True)

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

BRANDS = [
    ("bridgestone", "https://upload.wikimedia.org/wikipedia/commons/6/6d/Bridgestone_logo.svg", "bridgestone.com"),
    ("continental", "https://upload.wikimedia.org/wikipedia/commons/0/0c/Continental_AG_logo.svg", "continental.com"),
    ("goodyear", "https://upload.wikimedia.org/wikipedia/commons/8/88/Goodyear_logo.svg", "goodyear.com"),
    ("michelin", "https://upload.wikimedia.org/wikipedia/commons/6/6c/Michelin_logo.svg", "michelin.com"),
    ("pirelli", "https://upload.wikimedia.org/wikipedia/commons/3/3e/Pirelli_logo.svg", "pirelli.com"),
    ("bfgoodrich", "https://upload.wikimedia.org/wikipedia/commons/8/8a/BFGoodrich_logo.svg", "bfgoodrich.com"),
    ("cooper-tires", "https://upload.wikimedia.org/wikipedia/commons/1/1a/Cooper_Tire_%26_Rubber_Company_logo.svg", "coopertire.com"),
    ("dunlop", "https://upload.wikimedia.org/wikipedia/commons/2/2e/Dunlop_logo.svg", "dunlop.com"),
    ("falken", "https://upload.wikimedia.org/wikipedia/commons/8/8a/Falken_Tire_logo.svg", "falkentire.com"),
    ("hankook", "https://upload.wikimedia.org/wikipedia/commons/8/8d/Hankook_Logo.svg", "hankooktire.com"),
    ("kumho", "https://upload.wikimedia.org/wikipedia/commons/4/4e/Kumho_Tire_logo.svg", "kumhotire.com"),
    ("fortune-tires", None, "fortunetire.com"),
    ("matrax-tyres", None, "matraxtyres.com"),
    ("nexen", "https://upload.wikimedia.org/wikipedia/commons/5/5e/Nexen_Tire_logo.svg", "nexentire.com"),
    ("toyo-tires", "https://upload.wikimedia.org/wikipedia/commons/7/7e/Toyo_Tires_logo.svg", "toyotires.com"),
    ("yokohama", "https://upload.wikimedia.org/wikipedia/commons/9/9e/Yokohama_Rubber_logo.svg", "yokohama.com"),
    ("accelera", None, "accelera-tyres.com"),
    ("zeetex", None, "zeetex.com"),
    ("vredestein-tyres", "https://upload.wikimedia.org/wikipedia/en/8/8a/Vredestein_logo.svg", "vredestein.com"),
    ("roadstone", "https://upload.wikimedia.org/wikipedia/commons/4/4a/Roadstone_logo.svg", "roadstonetyre.com"),
]


def fetch(url: str, dest: Path) -> bool:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        if len(data) < 200:
            return False
        dest.write_bytes(data)
        return True
    except Exception as exc:
        print(f"  fail {dest.name}: {exc}")
        return False


def main() -> None:
    for slug, wiki, domain in BRANDS:
        png = OUT / f"{slug}.png"
        svg = OUT / f"{slug}.svg"
        ok = False
        if wiki:
            if wiki.endswith(".svg"):
                ok = fetch(wiki, svg)
                if ok:
                    thumb = wiki.replace("/commons/", "/commons/thumb/").replace(".svg", "/320px-" + wiki.split("/")[-1] + ".png")
                    fetch(thumb, png)
            else:
                ok = fetch(wiki, png)
        if not png.exists() or png.stat().st_size < 200:
            google = f"https://www.google.com/s2/favicons?domain={domain}&sz=256"
            fetch(google, png)
        print(slug, "svg" if svg.exists() else "-", "png" if png.exists() else "-", png.stat().st_size if png.exists() else 0)


if __name__ == "__main__":
    main()

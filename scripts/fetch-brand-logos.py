"""Resolve Commons logo URLs and save to assets/brands/{slug}.svg"""
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "brands"
UA = "DARB-Car-Services/1.0 (contact: info@example.com)"

# Wikimedia Commons file titles (verified or best match)
BRANDS = [
    ("bridgestone", "Bridgestone_logo.svg"),
    ("continental", "Continental_Reifen-Logo.svg"),
    ("goodyear", "Goodyear_logo.svg"),
    ("michelin", "Michelin_logo.svg"),
    ("pirelli", "Pirelli_logo.svg"),
    ("bfgoodrich", "BFGoodrich_logo.svg"),
    ("cooper-tires", "Cooper_Tire_%26_Rubber_Company_logo.svg"),
    ("dunlop", "LogoDunlopTire.svg"),
    ("falken", "Falken_Tire_logo.svg"),
    ("hankook", "Hankook_logo_as_of_2019.png"),
    ("kumho", "Kumho_Tire_logo.svg"),
    ("nexen", "Nexen_Tire_logo.svg"),
    ("toyo-tires", "Toyo_Tires_logo.svg"),
    ("yokohama", "Yokohama_Rubber_Company_logo.svg"),
    ("vredestein-tyres", "Vredestein_logo.svg"),
    ("roadstone", "Roadstone_logo.svg"),
]


def commons_url(filename: str) -> str | None:
    title = f"File:{filename}"
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url",
            "format": "json",
        }
    )
    req = urllib.request.Request(
        f"https://commons.wikimedia.org/w/api.php?{params}",
        headers={"User-Agent": UA},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.load(resp)
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        info = page.get("imageinfo")
        if info:
            return info[0]["url"]
    return None


def download(url: str, dest: Path) -> bool:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    if len(data) < 300:
        return False
    dest.write_bytes(data)
    return True


def main() -> None:
    manifest = {}
    for slug, filename in BRANDS:
        time.sleep(2.5)
        try:
            url = commons_url(filename)
        except Exception as exc:
            print(slug, "api fail", exc)
            continue
        if not url:
            print(slug, "no url for", filename)
            continue
        ext = ".png" if url.lower().endswith(".png") else ".svg"
        dest = OUT / f"{slug}{ext}"
        try:
            if download(url, dest):
                manifest[slug] = {"url": url, "file": str(dest.name)}
                print(slug, "OK", dest.name, len(dest.read_bytes()))
            else:
                print(slug, "small file")
        except Exception as exc:
            print(slug, "download fail", exc)
    (ROOT / "assets" / "brands-manifest.json").write_text(
        json.dumps(manifest, indent=2), encoding="utf-8"
    )


if __name__ == "__main__":
    main()

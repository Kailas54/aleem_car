"""Refresh assets/brands/* from Commons (where known) and Google favicons."""
from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "brands"
UA = "AL-DARB-Car-Services/1.0 (brand marquee; local bundle)"

# slug -> list of download URLs (first success wins)
SOURCES: dict[str, list[str]] = {
    "bridgestone": [
        "https://upload.wikimedia.org/wikipedia/commons/6/6d/Bridgestone_logo.svg",
    ],
    "bfgoodrich": [
        "https://upload.wikimedia.org/wikipedia/commons/9/90/BFGoodrich_logo.svg",
    ],
    "falken": [
        "https://upload.wikimedia.org/wikipedia/commons/1/1d/Falken_Tire_logo.svg",
    ],
    "continental": [
        "https://upload.wikimedia.org/wikipedia/commons/7/7f/Continental_logo.jpg",
    ],
    "dunlop": [
        "https://upload.wikimedia.org/wikipedia/commons/8/86/LogoDunlopTire.svg",
    ],
    "hankook": [
        "https://upload.wikimedia.org/wikipedia/commons/8/88/Hankook_logo_as_of_2019.png",
    ],
    "michelin": [
        "https://www.google.com/s2/favicons?domain=michelinman.com&sz=256",
    ],
    "goodyear": [
        "https://www.google.com/s2/favicons?domain=goodyear.com&sz=256",
    ],
    "pirelli": [
        "https://www.google.com/s2/favicons?domain=pirelli.com&sz=256",
    ],
    "cooper-tires": [
        "https://www.google.com/s2/favicons?domain=coopertire.com&sz=256",
    ],
    "kumho": [
        "https://www.google.com/s2/favicons?domain=kumhotire.com&sz=256",
        "https://icons.duckduckgo.com/ip3/kumhotire.com.ico",
    ],
    "nexen": [
        "https://www.google.com/s2/favicons?domain=nexentire.com&sz=256",
    ],
    "toyo-tires": [
        "https://www.google.com/s2/favicons?domain=toyotires.com&sz=256",
    ],
    "yokohama": [
        "https://www.google.com/s2/favicons?domain=yokohama.com&sz=256",
    ],
    "fortune-tires": [
        "https://www.google.com/s2/favicons?domain=fortunetire.com&sz=256",
    ],
    "matrax-tyres": [
        "https://www.google.com/s2/favicons?domain=matraxtyre.com&sz=256",
    ],
    "accelera": [
        "https://www.google.com/s2/favicons?domain=accelera-tyres.com&sz=256",
    ],
    "zeetex": [
        "https://www.google.com/s2/favicons?domain=zeetex.com&sz=256",
    ],
    "vredestein-tyres": [
        "https://www.google.com/s2/favicons?domain=vredestein.com&sz=256",
    ],
    "roadstone": [
        "https://www.google.com/s2/favicons?domain=nexentire.com&sz=256",
    ],
}


def is_html(data: bytes) -> bool:
    head = data[:64].lstrip().lower()
    return head.startswith(b"<!doctype") or head.startswith(b"<html")


def ext_from_url(url: str, data: bytes) -> str:
    path = urllib.parse.urlparse(url).path.lower()
    if path.endswith(".svg") or b"<svg" in data[:200].lower():
        return ".svg"
    if path.endswith(".png") or data[:8] == b"\x89PNG\r\n\x1a\n":
        return ".png"
    if path.endswith(".jpg") or path.endswith(".jpeg") or data[:3] == b"\xff\xd8\xff":
        return ".jpg"
    if path.endswith(".ico"):
        return ".png"
    return ".png"


def fetch(url: str) -> bytes | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            data = resp.read()
    except Exception as exc:
        print("  fail", url[:80], exc)
        return None
    if len(data) < 200 or is_html(data):
        print("  skip bad payload", url[:80], len(data))
        return None
    return data


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, str] = {}

    for path in OUT.iterdir():
        if not path.is_file():
            continue
        try:
            if is_html(path.read_bytes()[:128]):
                print("remove html", path.name)
                path.unlink()
        except OSError:
            pass

    for slug, urls in SOURCES.items():
        print(slug)
        saved = False
        for url in urls:
            time.sleep(1.0)
            data = fetch(url)
            if not data:
                continue
            ext = ext_from_url(url, data)
            dest = OUT / f"{slug}{ext}"
            dest.write_bytes(data)
            manifest[slug] = f"assets/brands/{dest.name}"
            print("  ->", dest.name, len(data))
            saved = True
            break
        if not saved:
            print("  !! no file")

    (ROOT / "assets" / "brands-manifest.json").write_text(
        json.dumps(manifest, indent=2), encoding="utf-8"
    )


if __name__ == "__main__":
    main()

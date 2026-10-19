# DARB CAR SERVICES — Website

Static landing page for DARB Car Services (bilingual EN/AR): hero, about, tyre brands marquee, services fold, and contact from the brochure.

## Run locally

```bash
py -3 -m http.server 5500
```

Open `http://localhost:5500`.

## Deploy (GitHub Pages)

Repo: [github.com/Kailas54/aleem_car](https://github.com/Kailas54/aleem_car)

Pushes to `main` run `.github/workflows/pages.yml`. In **Settings → Pages**, set **Build and deployment** source to **GitHub Actions** (one-time).

Live site: **https://kailas54.github.io/aleem_car/**

## Structure

- `index.html` — page markup
- `css/styles.css` — styles
- `js/` — marquee, service fold (GSAP), WhatsApp and UI
- `assets/` — logos, hero, service images, brand SVGs

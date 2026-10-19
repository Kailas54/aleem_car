# DARB CAR SERVICES — Website

Static landing page for DARB Car Services (bilingual EN/AR): hero, about, tyre brands marquee, services fold, and contact from the brochure.

## Run locally

```bash
py -3 -m http.server 5500
```

Open `http://localhost:5500`.

## Deploy (Vercel)

Repo: [github.com/Kailas54/aleem_car](https://github.com/Kailas54/aleem_car)

### Option A — GitHub (recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and import **Kailas54/aleem_car**.
2. Framework preset: **Other** (static site, no build command).
3. Deploy. Every push to `main` redeploys automatically.

**Production:** https://aleem-ten.vercel.app

### Option B — CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

`vercel.json` sets static hosting options (clean URLs).

## Structure

- `index.html` — page markup
- `css/styles.css` — styles
- `js/` — marquee, service fold (GSAP), WhatsApp and UI
- `assets/` — logos, hero, service images, brand SVGs

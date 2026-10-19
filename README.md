# DARB CAR SERVICES — Website

Static landing page for DARB Car Services (bilingual EN/AR): hero, about, tyre brands marquee, services fold, and contact from the brochure.

## Run locally

```bash
py -3 -m http.server 5500
```

Open `http://localhost:5500`.

## Deploy (GitHub Pages)

Pushes to `main` run `.github/workflows/pages.yml`, which publishes the site root to GitHub Pages.

1. Log in: `gh auth login`
2. Create and push (from this folder):

```bash
gh repo create darb-car-services --public --source=. --remote=origin --push
```

3. In the repo on GitHub: **Settings → Pages → Build and deployment** → Source: **GitHub Actions**.
4. After the workflow finishes, the site is at `https://<your-username>.github.io/darb-car-services/`.

## Structure

- `index.html` — page markup
- `css/styles.css` — styles
- `js/` — marquee, service fold (GSAP), WhatsApp and UI
- `assets/` — logos, hero, service images, brand SVGs

/** Tyre brand marquee — local bundled logos first, then remote fallbacks. */
const wikiFile = (filename) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;

const googleFavicon = (domain) =>
  `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${encodeURIComponent(domain)}&size=256`;

const TYRE_BRANDS = [
  { name: "Bridgestone", slug: "bridgestone", domain: "bridgestone.com" },
  { name: "Continental", slug: "continental", domain: "continental.com" },
  { name: "Goodyear", slug: "goodyear", domain: "goodyear.com" },
  { name: "Michelin", slug: "michelin", domain: "michelinman.com" },
  { name: "Pirelli", slug: "pirelli", domain: "pirelli.com" },
  { name: "BFGoodrich", slug: "bfgoodrich", domain: "bfgoodrich.com" },
  { name: "Cooper Tires", slug: "cooper-tires", domain: "coopertire.com" },
  { name: "Dunlop", slug: "dunlop", domain: "dunloptires.com" },
  { name: "Falken", slug: "falken", domain: "falkentire.com" },
  { name: "Hankook", slug: "hankook", domain: "hankooktire.com" },
  { name: "Kumho", slug: "kumho", domain: "kumhotire.com" },
  { name: "Fortune Tires", slug: "fortune-tires", domain: "fortunetire.com" },
  { name: "MatraX Tyres", slug: "matrax-tyres", domain: "matraxtyres.com" },
  { name: "Nexen", slug: "nexen", domain: "nexentire.com" },
  { name: "Toyo Tires", slug: "toyo-tires", domain: "toyotires.com" },
  { name: "Yokohama", slug: "yokohama", domain: "yokohama.com" },
  { name: "Accelera", slug: "accelera", domain: "accelera-tyres.com" },
  { name: "Zeetex", slug: "zeetex", domain: "zeetex.com" },
  { name: "Vredestein Tyres", slug: "vredestein-tyres", domain: "vredestein.com" },
  { name: "Roadstone", slug: "roadstone", domain: "nexentire.com" },
];

const REMOTE_WIKI = {
  bridgestone: ["https://upload.wikimedia.org/wikipedia/commons/6/6d/Bridgestone_logo.svg"],
  bfgoodrich: ["https://upload.wikimedia.org/wikipedia/commons/9/90/BFGoodrich_logo.svg"],
  falken: ["https://upload.wikimedia.org/wikipedia/commons/1/1d/Falken_Tire_logo.svg"],
  continental: [wikiFile("Continental logo.jpg")],
  dunlop: [wikiFile("LogoDunlopTire.svg")],
  hankook: [wikiFile("Hankook logo as of 2019.png")],
};

const localLogoPaths = (slug) => [
  `assets/brands/${slug}.svg`,
  `assets/brands/${slug}.png`,
  `assets/brands/${slug}.jpg`,
];

const logoSources = (brand) => {
  const sources = [...localLogoPaths(brand.slug)];
  (REMOTE_WIKI[brand.slug] || []).forEach((url) => sources.push(url));
  if (brand.domain) sources.push(googleFavicon(brand.domain));
  return sources;
};

const isLikelyLogo = (img) => {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return false;
  if (w < 32 && h < 32) return false;
  return true;
};

const createBrandItem = (brand) => {
  const item = document.createElement("div");
  item.className = "brand-marquee__item";

  const logoWrap = document.createElement("div");
  logoWrap.className = "brand-marquee__logo-wrap";

  const img = document.createElement("img");
  img.alt = brand.name;
  img.decoding = "async";
  img.loading = "lazy";

  const sources = logoSources(brand);
  let sourceIndex = 0;

  const showTextFallback = () => {
    img.remove();
    logoWrap.classList.add("brand-marquee__logo-wrap--text");
    const mark = document.createElement("span");
    mark.className = "brand-marquee__mark";
    mark.textContent = brand.name;
    logoWrap.appendChild(mark);
  };

  const tryNext = () => {
    sourceIndex += 1;
    if (sourceIndex >= sources.length) {
      showTextFallback();
      return;
    }
    img.src = sources[sourceIndex];
  };

  img.addEventListener("error", tryNext);
  img.addEventListener("load", () => {
    if (!isLikelyLogo(img)) tryNext();
  });

  logoWrap.appendChild(img);
  img.src = sources[0];

  const name = document.createElement("span");
  name.className = "brand-marquee__name";
  name.textContent = brand.name;

  item.append(logoWrap, name);
  return item;
};

const buildMarqueeGroup = () => {
  const group = document.createElement("div");
  group.className = "brand-marquee__group";
  group.setAttribute("aria-hidden", "false");
  TYRE_BRANDS.forEach((brand) => {
    group.appendChild(createBrandItem(brand));
  });
  return group;
};

const initBrandMarquee = () => {
  const track = document.getElementById("brandMarqueeTrack");
  if (!track) return;

  track.replaceChildren();
  const groupA = buildMarqueeGroup();
  const groupB = buildMarqueeGroup();
  groupB.setAttribute("aria-hidden", "true");
  track.append(groupA, groupB);
};

initBrandMarquee();

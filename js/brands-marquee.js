/** Brands from the uploaded collections sheet (4×5 grid). */
const TYRE_BRANDS = [
  { name: "Bridgestone", slug: "bridgestone", wiki: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Bridgestone_logo.svg" },
  { name: "Continental", slug: "continental", wiki: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Continental_AG_logo.svg" },
  { name: "Goodyear", slug: "goodyear", wiki: "https://upload.wikimedia.org/wikipedia/commons/8/88/Goodyear_logo.svg" },
  { name: "Michelin", slug: "michelin", wiki: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Michelin_logo.svg" },
  { name: "Pirelli", slug: "pirelli", wiki: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Pirelli_logo.svg" },
  { name: "BFGoodrich", slug: "bfgoodrich", wiki: "https://upload.wikimedia.org/wikipedia/commons/8/8a/BFGoodrich_logo.svg" },
  { name: "Cooper Tires", slug: "cooper-tires", wiki: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Cooper_Tire_%26_Rubber_Company_logo.svg" },
  { name: "Dunlop", slug: "dunlop", wiki: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Dunlop_logo.svg" },
  { name: "Falken", slug: "falken" },
  { name: "Hankook", slug: "hankook", wiki: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Hankook_Logo.svg" },
  { name: "Kumho", slug: "kumho", wiki: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Kumho_Tire_logo.svg" },
  { name: "Fortune Tires", slug: "fortune-tires" },
  { name: "MatraX Tyres", slug: "matrax-tyres" },
  { name: "Nexen", slug: "nexen", wiki: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Nexen_Tire_logo.svg" },
  { name: "Toyo Tires", slug: "toyo-tires", wiki: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Toyo_Tires_logo.svg" },
  { name: "Yokohama", slug: "yokohama", wiki: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Yokohama_Rubber_logo.svg" },
  { name: "Accelera", slug: "accelera" },
  { name: "Zeetex", slug: "zeetex" },
  { name: "Vredestein Tyres", slug: "vredestein-tyres" },
  { name: "Roadstone", slug: "roadstone" },
];

const localLogo = (slug) => `assets/brands/${slug}.svg`;

const createBrandItem = (brand) => {
  const item = document.createElement("div");
  item.className = "brand-marquee__item";

  const logoWrap = document.createElement("div");
  logoWrap.className = "brand-marquee__logo-wrap";

  const img = document.createElement("img");
  img.alt = "";
  img.decoding = "async";
  img.loading = "lazy";

  const sources = [localLogo(brand.slug), brand.wiki].filter(Boolean);
  let sourceIndex = 0;

  img.addEventListener("error", () => {
    sourceIndex += 1;
    if (sourceIndex < sources.length) {
      img.src = sources[sourceIndex];
      return;
    }
    img.remove();
    logoWrap.classList.add("brand-marquee__logo-wrap--text");
    const mark = document.createElement("span");
    mark.className = "brand-marquee__mark";
    mark.textContent = brand.name;
    logoWrap.appendChild(mark);
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

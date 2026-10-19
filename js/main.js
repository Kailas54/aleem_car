const WHATSAPP_NUMBER = "971507664888";

const buildWhatsAppUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const openWhatsApp = (message) => {
  window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
};

const serviceFoldTime = document.getElementById("serviceFoldTime");
if (serviceFoldTime) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Dubai",
  });
  serviceFoldTime.textContent = formatter.format(new Date());
}

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  const message =
    link.getAttribute("data-whatsapp") ||
    "Hello, I would like to book a service at AL DARB Car Services.";
  link.href = buildWhatsAppUrl(message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const siteHeader = document.querySelector(".site-header");
const welcomeSection = document.querySelector(".welcome");

const setHeaderTheme = () => {
  if (!siteHeader || !welcomeSection) return;
  const threshold = welcomeSection.offsetTop - 72;
  const pastWelcome = window.scrollY >= threshold;
  siteHeader.classList.toggle("site-header--glass", pastWelcome);
};

setHeaderTheme();
window.addEventListener("scroll", setHeaderTheme, { passive: true });
window.addEventListener("resize", setHeaderTheme);

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

const closeAllDropdowns = () => {
  document.querySelectorAll(".nav-item--dropdown").forEach((dropdownParent) => {
    dropdownParent.classList.remove("is-open");
    dropdownParent.querySelector(".nav-link--trigger")?.setAttribute("aria-expanded", "false");
  });
};

document.querySelectorAll(".nav-item--dropdown").forEach((dropdownParent) => {
  const dropdownTrigger = dropdownParent.querySelector(".nav-link--trigger");
  if (!dropdownTrigger) return;

  dropdownTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const wasOpen = dropdownParent.classList.contains("is-open");
    closeAllDropdowns();
    if (!wasOpen) {
      dropdownParent.classList.add("is-open");
      dropdownTrigger.setAttribute("aria-expanded", "true");
    }
  });
});

document.addEventListener("click", closeAllDropdowns);

const navigateToServiceCard = (hash) => {
  const match = hash.match(/^#our-services-(\d+)$/);
  if (!match) return;
  const index = Number(match[1]);
  const go = () => {
    if (typeof window.serviceFoldGoTo === "function") {
      window.serviceFoldGoTo(index);
    }
  };
  go();
  window.setTimeout(go, 120);
};

document.querySelectorAll('a[href^="#our-services-"]').forEach((link) => {
  link.addEventListener("click", () => {
    closeAllDropdowns();
    siteNav?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    navigateToServiceCard(link.getAttribute("href") || "");
  });
});

window.addEventListener("hashchange", () => {
  navigateToServiceCard(window.location.hash);
});

const contactForm = document.querySelector(".contact-form");
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const message = `Hello AL DARB Car Services,

I would like to request a booking.

Name: ${data.get("name")}
Phone: ${data.get("phone")}
Service: ${data.get("service")}`;
  openWhatsApp(message);
});

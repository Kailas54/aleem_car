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
    "Hello, I would like to book a service at DARB Car Services.";
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

const dropdownTrigger = document.querySelector(".nav-link--trigger");
const dropdownParent = document.querySelector(".nav-item--dropdown");

if (dropdownTrigger && dropdownParent) {
  dropdownTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = dropdownParent.classList.toggle("is-open");
    dropdownTrigger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.addEventListener("click", () => {
    dropdownParent.classList.remove("is-open");
    dropdownTrigger.setAttribute("aria-expanded", "false");
  });
}

const contactForm = document.querySelector(".contact-form");
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const message = `Hello DARB Car Services,

I would like to request a booking.

Name: ${data.get("name")}
Phone: ${data.get("phone")}
Service: ${data.get("service")}`;
  openWhatsApp(message);
});

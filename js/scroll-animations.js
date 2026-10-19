/** GSAP scroll + load animations */
const initScrollAnimations = () => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  gsap.registerPlugin(ScrollTrigger);

  const revealDefaults = { ease: "power3.out", immediateRender: false };

  const sectionInView = (section) => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    return rect.top < vh * 0.92 && rect.bottom > vh * 0.08;
  };

  const bindSectionReveal = (section, onPlay) => {
    if (!section) return () => {};

    let played = false;
    const play = () => {
      if (played || reducedMotion) {
        section.classList.add("is-revealed");
        return;
      }
      played = true;
      onPlay();
      section.classList.add("is-revealed");
    };

    ScrollTrigger.create({
      trigger: section,
      start: "top 90%",
      once: true,
      onEnter: play,
      onEnterBack: play,
    });

    return play;
  };

  const refreshAndMaybePlay = (plays) => {
    ScrollTrigger.refresh();
    plays.forEach((play) => {
      if (sectionInView(play.section)) play.fn();
    });
  };

  const playFns = [];

  if (!reducedMotion) {
    const header = document.querySelector(".site-header");
    if (header) {
      gsap.from(header, {
        y: -24,
        autoAlpha: 0,
        duration: 0.75,
        ease: "power3.out",
        delay: 0.15,
      });
    }
  }

  const hero = document.querySelector(".hero");
  if (hero && !reducedMotion) {
    gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(".hero__media", { scale: 1.12, duration: 1.6, ease: "power2.out" })
        .from(".hero__shade", { opacity: 0, duration: 1 }, 0)
        .from(
          ".hero__eyebrow span, .hero__eyebrow .dot",
          { y: 18, opacity: 0, duration: 0.55, stagger: 0.06 },
          0.35
        )
        .from(".hero__title-line", { y: 48, opacity: 0, duration: 0.75 }, 0.45)
        .from(".hero__title-highlight", { y: 36, opacity: 0, duration: 0.7 }, 0.58)
        .from(".hero__subtitle", { y: 22, opacity: 0, duration: 0.55 }, 0.72)
        .from(".hero__subtitle-ar", { y: 18, opacity: 0, duration: 0.5 }, 0.8)
        .from(".hero__actions .btn", { y: 20, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.88)
        .from(".brand-marquee__heading", { y: 16, opacity: 0, duration: 0.5 }, 1.05)
        .from(".brand-marquee__viewport", { y: 24, opacity: 0, duration: 0.65 }, 1.12)
        .from(
          ".brand-marquee__item",
          { y: 20, autoAlpha: 0, duration: 0.45, stagger: { each: 0.04, from: "random" } },
          1.2
        );
    }, hero);
  }

  const welcome = document.querySelector(".welcome");
  if (welcome) {
    const playWelcome = bindSectionReveal(welcome, () => {
      gsap.context(() => {
        const tl = gsap.timeline({ defaults: revealDefaults });

        tl.from(".welcome__lines", { autoAlpha: 0, duration: 1.1 })
          .from(".welcome__eyebrow", { y: 28, autoAlpha: 0, duration: 0.65 }, "-=0.85")
          .from(".welcome__title span", { y: 44, autoAlpha: 0, duration: 0.72, stagger: 0.14 }, "-=0.35")
          .from(".welcome__actions .btn-pill", { y: 24, autoAlpha: 0, duration: 0.55, stagger: 0.1 }, "-=0.25")
          .from(".welcome__kicker", { x: -20, autoAlpha: 0, duration: 0.55 }, "-=0.15")
          .from(".welcome__copy", { y: 28, autoAlpha: 0, duration: 0.65, stagger: 0.12 }, "-=0.35")
          .from(
            ".welcome__figure",
            {
              x: 40,
              autoAlpha: 0,
              scale: 0.96,
              duration: 0.9,
              transformOrigin: "center center",
            },
            "-=0.55"
          )
          .from(".welcome__highlights li", { y: 22, autoAlpha: 0, duration: 0.5, stagger: 0.09 }, "-=0.45")
          .from(".welcome__partner-label", { y: 14, autoAlpha: 0, duration: 0.45 }, "-=0.2")
          .from(".welcome__partner-name", { y: 18, autoAlpha: 0, duration: 0.55 }, "-=0.35");
      }, welcome);
    });
    playFns.push({ section: welcome, fn: playWelcome });
  }

  const serviceFold = document.querySelector(".service-fold");
  if (serviceFold) {
    const playServices = bindSectionReveal(serviceFold, () => {
      gsap.context(() => {
        const tl = gsap.timeline({ defaults: revealDefaults });

        tl.from(".service-fold__brand", { y: -20, autoAlpha: 0, duration: 0.6 })
          .from(".service-fold__book-cta", { x: 24, autoAlpha: 0, duration: 0.55 }, "-=0.35")
          .from(".service-fold__rail-btn", { x: -28, autoAlpha: 0, duration: 0.45, stagger: 0.07 }, "-=0.2")
          .from(".service-fold__stage", { y: 36, autoAlpha: 0, duration: 0.75 }, "-=0.35")
          .from(".service-fold__dock-brand", { y: 16, autoAlpha: 0, duration: 0.5 }, "-=0.25")
          .from(".service-fold__dock-cta", { y: 16, autoAlpha: 0, duration: 0.5 }, "-=0.4")
          .from(".service-fold__dock-meta", { y: 12, autoAlpha: 0, duration: 0.45 }, "-=0.35");
      }, serviceFold);
    });
    playFns.push({ section: serviceFold, fn: playServices });
  }

  const contact = document.querySelector(".section--contact");
  if (contact) {
    const playContact = bindSectionReveal(contact, () => {
      gsap.context(() => {
        const tl = gsap.timeline({ defaults: revealDefaults });

        tl.from(".contact-info h2", { y: 32, autoAlpha: 0, duration: 0.65 })
          .from(".contact-info__lead", { y: 22, autoAlpha: 0, duration: 0.5, stagger: 0.1 }, "-=0.35")
          .from(".contact-details__item", { x: -24, autoAlpha: 0, duration: 0.55, stagger: 0.1 }, "-=0.2")
          .from(".contact-booking__title", { y: 16, autoAlpha: 0, duration: 0.5 }, "-=0.35")
          .from(".contact-booking", { x: 32, autoAlpha: 0, duration: 0.7 }, "-=0.45")
          .from(".contact-form label", { y: 18, autoAlpha: 0, duration: 0.45, stagger: 0.08 }, "-=0.45")
          .from(".contact-form .btn--primary", { y: 16, autoAlpha: 0, duration: 0.5 }, "-=0.25")
          .from(".section__footer p", { y: 12, autoAlpha: 0, duration: 0.45, stagger: 0.08 }, "-=0.2");
      }, contact);
    });
    playFns.push({ section: contact, fn: playContact });
  }

  window.addEventListener("load", () => refreshAndMaybePlay(playFns));

  requestAnimationFrame(() => refreshAndMaybePlay(playFns));
};

if (document.body.classList.contains("is-loading")) {
  window.addEventListener("darb:loader-complete", initScrollAnimations, { once: true });
} else {
  initScrollAnimations();
}

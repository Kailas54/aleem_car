/** Lenis smooth scroll + GSAP ScrollTrigger sync */
(() => {
  const Lenis = window.Lenis;
  if (!Lenis) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const headerOffset =
    () =>
      parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 88;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.05,
    syncTouch: true,
  });

  window.darbLenis = lenis;

  window.darbScrollTo = (target, opts = {}) => {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    const offset = opts.offset ?? -(headerOffset() + 8);
    lenis.scrollTo(el, {
      offset,
      duration: opts.duration ?? 1.15,
      ...opts,
    });
  };

  lenis.on("scroll", () => {
    window.ScrollTrigger?.update();
    window.dispatchEvent(new Event("scroll"));
  });

  if (window.gsap) {
    window.gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    window.gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href === "#" || /^#our-services-\d+$/.test(href)) return;

    link.addEventListener("click", (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.darbScrollTo(target);
    });
  });

  window.addEventListener("load", () => window.ScrollTrigger?.refresh());
})();

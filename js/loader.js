/** Full-screen intro: logo emerges centre, brand text from the sides */
(() => {
  const loader = document.getElementById("siteLoader");
  const pageRoot = document.getElementById("pageRoot");
  if (!loader) {
    window.dispatchEvent(new Event("darb:loader-complete"));
    return;
  }

  const finish = () => {
    document.body.classList.remove("is-loading");
    pageRoot?.removeAttribute("aria-hidden");
    loader.setAttribute("aria-hidden", "true");
    window.setTimeout(() => loader.remove(), 400);
    window.dispatchEvent(new Event("darb:loader-complete"));
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsap = window.gsap;

  const waitForReady = () =>
    new Promise((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

  const run = async () => {
    await waitForReady();
    await new Promise((r) => window.setTimeout(r, reducedMotion ? 80 : 180));

    if (reducedMotion || !gsap) {
      finish();
      return;
    }

    const logo = loader.querySelector(".site-loader__logo");
    const logoWrap = loader.querySelector(".site-loader__logo-wrap");
    const en = loader.querySelector(".site-loader__en");
    const ar = loader.querySelector(".site-loader__ar");
    const bar = loader.querySelector(".site-loader__bar span");
    const glow = loader.querySelector(".site-loader__glow");

    gsap.set([en, ar], { autoAlpha: 0 });
    gsap.set(logoWrap, { scale: 0.35, autoAlpha: 0 });
    gsap.set(logo, { rotation: -12 });
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(glow, { scale: 0.6, autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        gsap.to(loader, {
          autoAlpha: 0,
          duration: 0.55,
          ease: "power2.inOut",
          onComplete: finish,
        });
      },
    });

    tl.to(glow, { scale: 1, autoAlpha: 1, duration: 0.9, ease: "power2.out" })
      .to(
        logoWrap,
        { scale: 1, autoAlpha: 1, duration: 0.85, ease: "back.out(1.6)" },
        0.15
      )
      .to(logo, { rotation: 0, duration: 0.85, ease: "power3.out" }, 0.15)
      .fromTo(
        en,
        { x: -120, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.75 },
        0.55
      )
      .fromTo(
        ar,
        { x: 120, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.75 },
        0.55
      )
      .to(bar, { scaleX: 1, duration: 0.65, ease: "power2.inOut" }, 0.75)
      .to({}, { duration: 0.35 });
  };

  run();
})();

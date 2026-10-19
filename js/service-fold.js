const foldStack = document.getElementById("serviceFoldStack");
const foldRail = document.getElementById("serviceFoldRail");
const foldSection = document.querySelector(".service-fold");

if (foldStack && foldRail && foldSection && window.gsap) {
  const gsap = window.gsap;
  const cards = [...foldStack.querySelectorAll(".service-fold__card")];
  const railButtons = [...foldRail.querySelectorAll(".service-fold__rail-btn")];
  let order = cards.map((_, index) => index).filter((i) => i !== 0).concat(0);
  let isAnimating = false;
  let sectionVisible = false;
  let autoCall = null;

  const AUTO_INTERVAL = 4.8;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STACK_LAYERS = cards.map((_, index) =>
    index === 0
      ? { x: 0, y: 0, rotateY: 0, scale: 1, opacity: 1 }
      : { x: 0, y: 0, rotateY: 0, scale: 1, opacity: 0 }
  );

  const topIndex = () => order[order.length - 1];

  const depthForCard = (cardIndex) => {
    const position = order.indexOf(cardIndex);
    return order.length - 1 - position;
  };

  const syncZIndex = () => {
    cards.forEach((card, cardIndex) => {
      card.style.zIndex = String(order.indexOf(cardIndex) + 1);
    });
  };

  const updateRail = () => {
    railButtons.forEach((btn, index) => {
      const active = topIndex() === index;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
  };

  const layerVars = (depth) => {
    const layer = STACK_LAYERS[Math.min(depth, STACK_LAYERS.length - 1)];
    return {
      x: layer.x,
      y: layer.y,
      rotateY: layer.rotateY,
      scale: layer.scale,
      opacity: layer.opacity,
      xPercent: 0,
      z: 0,
      force3D: true,
      transformOrigin: "0% 50%",
    };
  };

  const layoutStack = ({ duration = 0.7, ease = "power3.out", excludeIndex = null } = {}) => {
    syncZIndex();

    cards.forEach((card, cardIndex) => {
      if (cardIndex === excludeIndex) return;

      const depth = depthForCard(cardIndex);
      card.classList.toggle("is-top", depth === 0);
      card.classList.remove("is-folding");

      const vars = layerVars(depth);

      if (duration <= 0) {
        gsap.set(card, vars);
      } else {
        gsap.to(card, {
          ...vars,
          duration: reducedMotion ? 0.2 : duration,
          ease,
          overwrite: true,
        });
      }
    });

    updateRail();
  };

  const foldTopCard = (onDone) => {
    const currentTop = topIndex();
    const card = cards[currentTop];

    gsap.killTweensOf(cards);
    card.classList.add("is-folding");
    card.style.zIndex = "20";

    const nextCardIndex = order[order.length - 2];
    if (nextCardIndex !== undefined) {
      cards[nextCardIndex].style.zIndex = "19";
    }

    gsap.to(card, {
      rotateY: -92,
      x: -14,
      y: -6,
      scale: 0.985,
      opacity: 0,
      duration: reducedMotion ? 0.22 : 0.72,
      ease: "power2.in",
      force3D: true,
      transformOrigin: "0% 50%",
      onComplete: () => {
        const removed = order.pop();
        order.unshift(removed);

        card.classList.remove("is-folding", "is-top");
        gsap.set(card, {
          ...layerVars(STACK_LAYERS.length - 1),
          opacity: 0,
        });

        syncZIndex();
        layoutStack({ duration: 0.55, ease: "power3.out", excludeIndex: removed });

        gsap.to(card, {
          ...layerVars(STACK_LAYERS.length - 1),
          opacity: STACK_LAYERS[STACK_LAYERS.length - 1].opacity,
          duration: reducedMotion ? 0.15 : 0.35,
          ease: "power2.out",
          delay: 0.08,
          onComplete: onDone,
        });
      },
    });
  };

  const advance = () => {
    if (isAnimating) return;
    isAnimating = true;
    foldTopCard(() => {
      isAnimating = false;
    });
  };

  const goToService = (targetIndex) => {
    if (targetIndex < 0 || targetIndex >= cards.length) return;
    if (topIndex() === targetIndex && !isAnimating) return;

    gsap.killTweensOf(cards);
    isAnimating = false;

    const others = cards.map((_, index) => index).filter((index) => index !== targetIndex);
    order = [...others, targetIndex];

    cards.forEach((card) => card.classList.remove("is-folding"));

    const rect = foldSection.getBoundingClientRect();
    const headerOffset =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 88;
    const needsScroll = rect.top > headerOffset + 24 || rect.top < -rect.height * 0.35;
    if (needsScroll) {
      if (typeof window.darbScrollTo === "function" && !reducedMotion) {
        window.darbScrollTo(foldSection, { offset: -(headerOffset + 8) });
      } else {
        foldSection.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    }

    layoutStack({
      duration: reducedMotion ? 0 : 0.4,
      ease: "power2.out",
    });

    stopAutoPlay();
    if (sectionVisible) startAutoPlay();
  };

  const parseServiceHash = () => {
    const match = window.location.hash.match(/^#our-services-(\d+)$/);
    if (!match) return;
    goToService(Number(match[1]));
  };

  const stopAutoPlay = () => {
    if (autoCall) {
      autoCall.kill();
      autoCall = null;
    }
    foldSection.classList.remove("is-auto-playing");
  };

  const scheduleAutoPlay = () => {
    autoCall = gsap.delayedCall(AUTO_INTERVAL, () => {
      if (sectionVisible && !isAnimating) advance();
      if (sectionVisible) scheduleAutoPlay();
    });
  };

  const startAutoPlay = () => {
    if (!sectionVisible || autoCall) return;
    foldSection.classList.add("is-auto-playing");
    scheduleAutoPlay();
  };

  gsap.set(foldStack, { transformPerspective: 1800 });
  gsap.set(cards, {
    force3D: true,
    transformOrigin: "0% 50%",
  });

  layoutStack({ duration: 0 });
  parseServiceHash();
  window.addEventListener("hashchange", parseServiceHash);

  railButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.serviceIndex);
      window.history.replaceState(null, "", `#our-services-${index}`);
      goToService(index);
    });
  });

  window.serviceFoldGoTo = goToService;

  foldStack.addEventListener("click", (event) => {
    if (event.target.closest("[data-fold-next]")) advance();
  });

  let touchStartY = 0;
  foldStack.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );
  foldStack.addEventListener(
    "touchend",
    (e) => {
      const delta = touchStartY - e.changedTouches[0].screenY;
      if (delta > 42) advance();
    },
    { passive: true }
  );

  foldSection.addEventListener("mouseenter", stopAutoPlay);
  foldSection.addEventListener("mouseleave", () => {
    if (sectionVisible) startAutoPlay();
  });
  foldSection.addEventListener("focusin", stopAutoPlay);
  foldSection.addEventListener("focusout", () => {
    if (sectionVisible) startAutoPlay();
  });

  const sectionObserver = new IntersectionObserver(
    ([entry]) => {
      sectionVisible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      if (sectionVisible) startAutoPlay();
      else stopAutoPlay();
    },
    { threshold: [0.35, 0.5] }
  );
  sectionObserver.observe(foldSection);
}

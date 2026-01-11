import { MOTION, SCROLL } from "./constants.js";

export function createSignals() {
  let scrollY = window.scrollY || 0;
  let lastScrollY = scrollY;
  let scrollV = 0;

  let targetScrollY = scrollY;

  function onScroll() {
    targetScrollY = window.scrollY || 0;
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  return {
    update(dt) {
      scrollY = targetScrollY;
      const dy = scrollY - lastScrollY;

      const v = dt > 0 ? (dy / dt) * 1000 : 0;
      const vClamped = Math.max(-SCROLL.velocityClamp, Math.min(SCROLL.velocityClamp, v));
      const vClean = Math.abs(vClamped) < SCROLL.velocityDeadzone ? 0 : vClamped;

      scrollV = MOTION.prefersReduced ? 0 : scrollV + (vClean - scrollV) * SCROLL.velocityLpf;

      lastScrollY = scrollY;
    },
    destroy() {
      window.removeEventListener("scroll", onScroll);
    },
    get scrollY() {
      return scrollY;
    },
    get scrollV() {
      return scrollV;
    },
  };
}

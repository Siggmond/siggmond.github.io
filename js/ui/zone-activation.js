export function createZoneActivation() {
  const zones = Array.from(document.querySelectorAll(".zone[data-zone]"));
  const ratios = new Map();
  let active = zones[0]?.dataset.zone || null;

  function applyActive() {
    for (const el of zones) {
      const isActive = el.dataset.zone === active;
      el.classList.toggle("is-active", isActive);
    }
  }

  const thresholds = [];
  for (let i = 0; i <= 20; i += 1) thresholds.push(i / 20);

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        ratios.set(entry.target, entry.intersectionRatio);
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      }

      let bestEl = null;
      let bestRatio = -1;
      for (const [el, ratio] of ratios) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestEl = el;
        }
      }

      if (bestEl) {
        const next = bestEl.dataset.zone;
        if (next && next !== active) {
          active = next;
          applyActive();
        }
      }
    },
    { threshold: thresholds }
  );

  for (const el of zones) io.observe(el);
  applyActive();

  return {
    getActiveZone() {
      return active;
    },
    destroy() {
      io.disconnect();
      ratios.clear();
    },
  };
}

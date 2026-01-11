import { MOTION, SCROLL } from "../core/constants.js";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function createSignalField({ root = document } = {}) {
  const el = root.querySelector(".signal-field[data-system=\"signals\"]") ?? root.querySelector(".signal-field");

  let phase = 0;
  let v = 0;

  function apply() {
    if (!el) return;
    el.style.backgroundPosition = `0px ${phase.toFixed(2)}px`;
  }

  apply();

  return {
    update({ dt, scrollV }) {
      if (!el) return;

      if (MOTION.prefersReduced) {
        v = 0;
        apply();
        return;
      }

      const dtS = clamp(dt * 0.001, 0, 0.05);

      const vNorm = clamp(scrollV / SCROLL.velocityClamp, -1, 1);
      const target = vNorm * 18;

      const follow = 10;
      v += (target - v) * (1 - Math.exp(-follow * dtS));

      const damping = Math.exp(-3.8 * dtS);
      v *= damping;

      phase += v;

      if (phase > 100000 || phase < -100000) phase = phase % 100000;

      apply();
    },
  };
}

import { DEPTH_PLANES, MOTION } from "../core/constants.js";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function approachExp(current, target, dtS, k) {
  const a = 1 - Math.exp(-k * dtS);
  return current + (target - current) * a;
}

export function createDepthPlaneSystem({ root = document } = {}) {
  const planes = Array.from(root.querySelectorAll(".depth-plane[data-depth]"));

  const states = planes.map((el) => {
    const idx = Number(el.dataset.depth);
    const cfg = DEPTH_PLANES.levels[idx] ?? DEPTH_PLANES.levels[0];
    return {
      el,
      factor: cfg.factor,
      x: 0,
      y: 0,
    };
  });

  return {
    update({ dt, scrollY, climate, boundaryPressure }) {
      if (MOTION.prefersReduced) {
        for (const s of states) {
          s.x = 0;
          s.y = 0;
          s.el.style.transform = "translate3d(0, 0, 0)";
        }
        return;
      }

      const dtS = clamp(dt * 0.001, 0, 0.05);
      const gain = climate.parallaxGain * (1 - boundaryPressure * DEPTH_PLANES.boundaryGainDrop);

      const kBase = DEPTH_PLANES.followK * climate.dampingMul;
      const k = kBase * (1 - boundaryPressure * DEPTH_PLANES.boundaryStiffen);

      for (const s of states) {
        const targetY = -scrollY * s.factor * gain;

        s.y = approachExp(s.y, targetY, dtS, k);

        s.el.style.transform = `translate3d(0, ${s.y.toFixed(3)}px, 0)`;
      }
    },
  };
}

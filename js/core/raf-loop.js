import { RAF } from "./constants.js";

export function createRafLoop() {
  const fns = new Set();

  let rafId = null;
  let lastT = null;
  let running = false;

  function frame(t) {
    if (!running) return;

    if (lastT === null) lastT = t;
    const rawDt = t - lastT;
    const dt = Math.min(Math.max(rawDt, 0), RAF.dtClampMs);
    lastT = t;

    for (const fn of fns) {
      fn({ t, dt });
    }

    rafId = requestAnimationFrame(frame);
  }

  return {
    add(fn) {
      fns.add(fn);
    },
    remove(fn) {
      fns.delete(fn);
    },
    start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      lastT = null;
    },
  };
}

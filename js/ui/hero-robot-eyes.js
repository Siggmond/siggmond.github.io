// LOCKED – hero robot micro-interactions only.
// Rules:
// - No scroll coupling.
// - No overlays / fixed positioning / movement systems.
// - Reduced-motion must fully disable motion.
import { MOTION } from "../core/constants.js";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function approachExp(current, target, dtS, k) {
  const a = 1 - Math.exp(-k * dtS);
  return current + (target - current) * a;
}

export function createHeroRobotEyes({ root = document } = {}) {
  const left = root.querySelector('[data-eye-pupil="l"]');
  const right = root.querySelector('[data-eye-pupil="r"]');
  const eyeL = root.querySelector('[data-eye="l"]');
  const eyeR = root.querySelector('[data-eye="r"]');

  let viewportW = window.innerWidth || 1;
  let viewportH = window.innerHeight || 1;

  let targetX = 0;
  let targetY = 0;

  let delayedTargetX = 0;
  let delayedTargetY = 0;

  let x = 0;
  let y = 0;

  let vx = 0;
  let vy = 0;

  let hasPointer = false;
  let lastMoveT = performance.now();

  let lastDx = 0;
  let lastDy = 0;

  let isHidden = document.visibilityState === "hidden";

  const maxX = 13;
  const maxY = 8;
  const normX = 0.38;
  const normY = 0.4;

  function setPupils(dx, dy) {
    if (Math.abs(dx - lastDx) + Math.abs(dy - lastDy) < 0.0005) return;
    lastDx = dx;
    lastDy = dy;
    if (left) left.setAttribute("transform", `translate(${dx.toFixed(3)} ${dy.toFixed(3)})`);
    if (right) right.setAttribute("transform", `translate(${dx.toFixed(3)} ${dy.toFixed(3)})`);
  }

  setPupils(0, 0);

  function onResize() {
    viewportW = window.innerWidth || 1;
    viewportH = window.innerHeight || 1;
  }

  function getEyesCenterClient() {
    const fallback = { x: viewportW * 0.5, y: viewportH * 0.5 };
    try {
      if (eyeL && eyeR) {
        const rl = eyeL.getBoundingClientRect();
        const rr = eyeR.getBoundingClientRect();
        return {
          x: (rl.left + rl.right + rr.left + rr.right) * 0.25,
          y: (rl.top + rl.bottom + rr.top + rr.bottom) * 0.25,
        };
      }
      if (eyeL) {
        const r = eyeL.getBoundingClientRect();
        return { x: (r.left + r.right) * 0.5, y: (r.top + r.bottom) * 0.5 };
      }
      if (eyeR) {
        const r = eyeR.getBoundingClientRect();
        return { x: (r.left + r.right) * 0.5, y: (r.top + r.bottom) * 0.5 };
      }
    } catch {
      // ignore
    }
    return fallback;
  }

  function updateTargetFromClient(clientX, clientY) {
    const center = getEyesCenterClient();
    const nx = (clientX - center.x) / (viewportW * normX);
    const ny = (clientY - center.y) / (viewportH * normY);

    targetX = clamp(nx, -1, 1) * maxX;
    targetY = clamp(ny, -1, 1) * maxY;

    hasPointer = true;
    lastMoveT = performance.now();
  }

  function onPointerMove(e) {
    updateTargetFromClient(e.clientX, e.clientY);
  }

  function onMouseMove(e) {
    updateTargetFromClient(e.clientX, e.clientY);
  }

  function onPointerLeave() {
    hasPointer = false;
    targetX = 0;
    targetY = 0;
    lastMoveT = performance.now();
  }

  function onPointerCancel() {
    // Do not reset target on cancel; some environments may emit cancel during scroll.
    hasPointer = false;
  }

  function onBlur() {
    onPointerLeave();
  }

  function onVisibilityChange() {
    isHidden = document.visibilityState === "hidden";
    if (isHidden) {
      onPointerLeave();
    }
  }

  if ("PointerEvent" in window) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("pointercancel", onPointerCancel, { passive: true });
  } else {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onPointerLeave, { passive: true });
  }

  window.addEventListener("blur", onBlur, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });

  return {
    destroy() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointercancel", onPointerCancel);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    },
    update({ dt, focusMode = false } = {}) {
      if (!left && !right) return;

      if (isHidden) {
        if (x !== 0 || y !== 0) {
          x = 0;
          y = 0;
          vx = 0;
          vy = 0;
          setPupils(0, 0);
        }
        return;
      }

      if (MOTION.prefersReduced) {
        hasPointer = false;
        targetX = 0;
        targetY = 0;
        delayedTargetX = 0;
        delayedTargetY = 0;
        if (x !== 0 || y !== 0) {
          x = 0;
          y = 0;
          vx = 0;
          vy = 0;
          setPupils(0, 0);
        }
        return;
      }

      const dtS = clamp(dt * 0.001, 0, 0.05);

      const now = performance.now();
      const idleMs = now - lastMoveT;
      const idle01 = clamp((idleMs - 1100) / 650, 0, 1);

      if (idle01 >= 1 && !hasPointer && !focusMode) {
        return;
      }

      delayedTargetX = approachExp(delayedTargetX, targetX, dtS, 7.8);
      delayedTargetY = approachExp(delayedTargetY, targetY, dtS, 7.8);

      const focusBias = focusMode ? 0.25 : 0;
      const biasedTargetX = delayedTargetX * (1 - focusBias);
      const biasedTargetY = delayedTargetY * (1 - focusBias);

      const follow = 16.0;
      const dampBase = 5.2;
      const damp = dampBase + (focusMode ? 6.0 : 0) + 4.0 * idle01;

      vx = approachExp(vx, (biasedTargetX - x) * follow, dtS, follow);
      vy = approachExp(vy, (biasedTargetY - y) * follow, dtS, follow);

      vx *= Math.exp(-damp * dtS);
      vy *= Math.exp(-damp * dtS);

      x = clamp(x + vx * dtS, -maxX, maxX);
      y = clamp(y + vy * dtS, -maxY, maxY);

      if (Math.abs(vx) + Math.abs(vy) + Math.abs(targetX - x) + Math.abs(targetY - y) < 0.001) {
        return;
      }

      setPupils(x, y);
    },
  };
}

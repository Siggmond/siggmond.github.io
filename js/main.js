import { createRafLoop } from "./core/raf-loop.js";
import { createSignals } from "./core/signals.js";
import { MOTION } from "./core/constants.js";
import { createZoneActivation } from "./ui/zone-activation.js";
import { createProjectExpando } from "./ui/project-expando.js";
import { renderProjects } from "./ui/project-renderer.js";
import { createHeroRobotEyes } from "./ui/hero-robot-eyes.js";
import { createSignalField } from "./systems/signal-field.js";
import { createZoneClimate } from "./systems/zone-climate.js";
import { createDepthPlaneSystem } from "./systems/depth-plane-system.js";

const SCROLL_RESTORE_KEY = "scrollY:session";

try {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
} catch {
  // ignore
}

try {
  const saved = sessionStorage.getItem(SCROLL_RESTORE_KEY);
  const y = saved ? Number(saved) : null;
  if (typeof y === "number" && Number.isFinite(y) && y > 0) {
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
    });
  }
} catch {
  // ignore
}

function persistScrollY() {
  try {
    sessionStorage.setItem(SCROLL_RESTORE_KEY, String(window.scrollY || 0));
  } catch {
    // ignore
  }
}

window.addEventListener("pagehide", persistScrollY);
window.addEventListener("beforeunload", persistScrollY);

const raf = createRafLoop();
const signals = createSignals();
const zones = createZoneActivation();

renderProjects();
const projectExpando = createProjectExpando();

const heroEyes = createHeroRobotEyes();

function cleanupUi() {
  try {
    projectExpando?.destroy?.();
  } catch {
    // ignore
  }

  try {
    heroEyes?.destroy?.();
  } catch {
    // ignore
  }

  try {
    zones?.destroy?.();
  } catch {
    // ignore
  }

  try {
    signals?.destroy?.();
  } catch {
    // ignore
  }

  try {
    zoneClimate?.destroy?.();
  } catch {
    // ignore
  }
}

window.addEventListener("pagehide", cleanupUi);
window.addEventListener("beforeunload", cleanupUi);

const signalField = createSignalField();
const zoneClimate = createZoneClimate();
const depthPlanes = createDepthPlaneSystem();

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

const zoneEls = new Map(
  Array.from(document.querySelectorAll(".zone[data-zone]")).map((el) => [el.dataset.zone, el])
);

const revealedZones = new Set();
if (MOTION.prefersReduced) {
  for (const [key, el] of zoneEls) {
    if (!key) continue;
    el.classList.add("is-revealed");
    revealedZones.add(key);
  }
}

if ("ResizeObserver" in window) {
  let zoneRefreshTimer = null;
  const ro = new ResizeObserver(() => {
    if (zoneRefreshTimer !== null) return;
    zoneRefreshTimer = window.setTimeout(() => {
      zoneRefreshTimer = null;
      zoneClimate.refresh();
    }, 60);
  });

  for (const el of document.querySelectorAll(".zone[data-zone]")) {
    ro.observe(el);
  }
}

let stableZone = "canopy";
let datasetZone = null;
let lastScrollContrast = null;

raf.add(({ t, dt }) => {
  signals.update(dt);

  const root = document.documentElement;
  root.style.setProperty("--scroll-y", `${signals.scrollY}px`);
  root.style.setProperty("--scroll-v", `${signals.scrollV}`);

  const absV = Math.abs(signals.scrollV);
  const contrastT = clamp(absV / 2400, 0, 1);
  const scrollContrast = 1 - contrastT * 0.12;
  const scrollContrastRounded = Math.round(scrollContrast * 10000) / 10000;
  if (scrollContrastRounded !== lastScrollContrast) {
    root.style.setProperty("--scrollContrast", String(scrollContrastRounded));
    lastScrollContrast = scrollContrastRounded;
  }

  signalField.update({ t, dt, scrollY: signals.scrollY, scrollV: signals.scrollV });

  const observedZone = zones.getActiveZone();
  if (observedZone) stableZone = observedZone;

  const focusMode = !!document.querySelector(".project[data-project][data-open]");
  heroEyes.update({ dt, focusMode });

  const climateState = zoneClimate.update({
    scrollY: signals.scrollY,
    scrollV: signals.scrollV,
    zoneKey: stableZone,
  });

  if (climateState) {
    depthPlanes.update({
      dt,
      scrollY: signals.scrollY,
      climate: climateState.climate,
      boundaryPressure: climateState.boundaryPressure,
    });
  }

  if (stableZone !== datasetZone) {
    if (!MOTION.prefersReduced && stableZone && !revealedZones.has(stableZone)) {
      const el = zoneEls.get(stableZone);
      if (el) el.classList.add("is-revealed");
      revealedZones.add(stableZone);
    }

    root.dataset.activeZone = stableZone;
    datasetZone = stableZone;
  }
});

raf.start();

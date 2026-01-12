import { createRafLoop } from "./core/raf-loop.js";
import { createSignals } from "./core/signals.js";
import { MOTION } from "./core/constants.js";
import { createZoneActivation } from "./ui/zone-activation.js";
import { createProjectExpando } from "./ui/project-expando.js";
import { renderProjects } from "./ui/project-renderer.js";
import { createHeroRobotEyes } from "./ui/hero-robot-eyes.js";
import { createThemeController } from "./core/theme.js";
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

const themeController = createThemeController();

renderProjects();
const projectExpando = createProjectExpando();

function initScreenshotInspect() {
  const projectIds = ["taskflow-pro", "collab-engine", "syncbridge", "clientops-hub"];
  const roots = projectIds
    .map((id) => document.querySelector(`.project[data-project="${id}"]`))
    .filter(Boolean);
  if (roots.length === 0) return;

  const grids = roots
    .map((root) => root.querySelector(".project__screensGrid"))
    .filter(Boolean);
  if (grids.length === 0) return;

  let overlay = document.querySelector(".project__inspect");
  let overlayImg = overlay?.querySelector(".project__inspectImg");

  if (!overlay || !overlayImg) {
    overlay = document.createElement("div");
    overlay.className = "project__inspect";
    overlay.setAttribute("hidden", "");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Screenshot inspection");

    overlayImg = document.createElement("img");
    overlayImg.className = "project__inspectImg";
    overlayImg.alt = "";
    overlayImg.decoding = "async";

    overlay.appendChild(overlayImg);
    document.body.appendChild(overlay);
  }

  function close() {
    overlay.setAttribute("hidden", "");
    overlayImg.removeAttribute("src");
    try {
      document.body.style.overflow = "";
    } catch {
      // ignore
    }
  }

  function openFrom(img) {
    const src = img?.getAttribute?.("src") ?? "";
    if (!src) return;
    overlayImg.src = src;
    overlayImg.alt = img.getAttribute("alt") ?? "";
    overlay.removeAttribute("hidden");
    try {
      document.body.style.overflow = "hidden";
    } catch {
      // ignore
    }
  }

  for (const grid of grids) {
    grid.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (!target.classList.contains("project__screenImg")) return;
      openFrom(target);
    });

    grid.addEventListener("keydown", (e) => {
      const key = e.key;
      if (key !== "Enter" && key !== " ") return;
      const target = e.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (!target.classList.contains("project__screenImg")) return;
      e.preventDefault();
      openFrom(target);
    });
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (overlay.hasAttribute("hidden")) return;
    close();
  });
}

initScreenshotInspect();

const heroEyes = createHeroRobotEyes();

function cleanupUi() {
  try {
    themeController?.destroy?.();
  } catch {
    // ignore
  }

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

import { MOTION, ZONES } from "../core/constants.js";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function smoothstep01(x) {
  const t = clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpRgba(a, b, t) {
  const r = lerp(a[0], b[0], t);
  const g = lerp(a[1], b[1], t);
  const bl = lerp(a[2], b[2], t);
  const al = lerp(a[3], b[3], t);
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(bl)}, ${al.toFixed(4)})`;
}

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

function computeZoneRanges(root) {
  const els = Array.from(root.querySelectorAll(".zone[data-zone]"));

  return els
    .map((el) => {
      const key = el.dataset.zone;
      const start = el.offsetTop;
      const end = start + el.offsetHeight;
      return { key, start, end };
    })
    .sort((a, b) => a.start - b.start);
}

export function createZoneClimate({ root = document } = {}) {
  let ranges = computeZoneRanges(root);

  let rangeIndexByKey = new Map(ranges.map((r, i) => [r.key, i]));

  function refreshRanges() {
    ranges = computeZoneRanges(root);
    rangeIndexByKey = new Map(ranges.map((r, i) => [r.key, i]));
  }

  const onResize = () => {
    refreshRanges();
  };

  window.addEventListener("resize", onResize, { passive: true });

  let lastVars = {
    parallaxGain: null,
    dampingMul: null,
    depthOpacity: null,
    depthTint: null,
    boundaryPressure: null,
  };

  function applyVars(vars) {
    const html = document.documentElement;
    for (const [k, v] of Object.entries(vars)) {
      if (v === lastVars[k]) continue;
      html.style.setProperty(`--${k}`, String(v));
      lastVars[k] = v;
    }
  }

  function getClimateForKey(key) {
    return ZONES.registry[key] ?? ZONES.registry.default;
  }

  function blendClimates(a, b, t) {
    return {
      parallaxGain: lerp(a.parallaxGain, b.parallaxGain, t),
      dampingMul: lerp(a.dampingMul, b.dampingMul, t),
      depthOpacity: lerp(a.depthOpacity, b.depthOpacity, t),
      depthTint: lerpRgba(a.depthTintRgba, b.depthTintRgba, t),
      density: lerp(a.density, b.density, t),
      typeScale: lerp(a.typeScale, b.typeScale, t),
      typeTrackingEm: lerp(a.typeTrackingEm, b.typeTrackingEm, t),
      boundaryWindowPx: a.boundaryWindowPx,
      blendWindowPx: a.blendWindowPx,
    };
  }

  function computeBlend(scrollY, idx, baseClimate) {
    const r = ranges[idx];
    const w = baseClimate.blendWindowPx;

    const distToStart = Math.abs(scrollY - r.start);
    const distToEnd = Math.abs(r.end - scrollY);

    if (distToEnd <= w && idx + 1 < ranges.length) {
      const t = smoothstep01(1 - distToEnd / w);
      const otherKey = ranges[idx + 1].key;
      const other = getClimateForKey(otherKey);
      return blendClimates(baseClimate, other, t);
    }

    if (distToStart <= w && idx - 1 >= 0) {
      const t = smoothstep01(1 - distToStart / w);
      const otherKey = ranges[idx - 1].key;
      const other = getClimateForKey(otherKey);
      return blendClimates(baseClimate, other, t);
    }

    return {
      parallaxGain: baseClimate.parallaxGain,
      dampingMul: baseClimate.dampingMul,
      depthOpacity: baseClimate.depthOpacity,
      depthTint: lerpRgba(baseClimate.depthTintRgba, baseClimate.depthTintRgba, 0),
      density: baseClimate.density,
      typeScale: baseClimate.typeScale,
      typeTrackingEm: baseClimate.typeTrackingEm,
      boundaryWindowPx: baseClimate.boundaryWindowPx,
      blendWindowPx: baseClimate.blendWindowPx,
    };
  }

  function computeBoundaryPressure(scrollY, scrollV, idx, climate) {
    if (idx < 0 || idx >= ranges.length) return 0;

    const r = ranges[idx];
    const windowPx = climate.boundaryWindowPx;
    const edge = scrollV >= 0 ? r.end : r.start;
    const dist = Math.abs(edge - scrollY);

    const x = 1 - clamp(dist / windowPx, 0, 1);
    const p = smoothstep01(x);

    const vMag = Math.abs(scrollV);
    const v01 = clamp(vMag / 3000, 0, 1);

    return p * v01;
  }

  return {
    update({ scrollY, scrollV, zoneKey }) {
      if (ranges.length === 0) return null;

      const idx = rangeIndexByKey.get(zoneKey) ?? 0;
      const baseClimate = getClimateForKey(zoneKey);
      const climate = computeBlend(scrollY, idx, baseClimate);

      const boundaryPressure = MOTION.prefersReduced
        ? 0
        : computeBoundaryPressure(scrollY, scrollV, idx, climate);

      applyVars({
        parallaxGain: round4(climate.parallaxGain),
        dampingMul: round4(climate.dampingMul),
        depthOpacity: round4(climate.depthOpacity),
        depthTint: climate.depthTint,
        boundaryPressure: round4(boundaryPressure),
      });

      return {
        zoneKey,
        climate,
        boundaryPressure,
      };
    },
    refresh() {
      refreshRanges();
    },
    destroy() {
      window.removeEventListener("resize", onResize);
    },
  };
}

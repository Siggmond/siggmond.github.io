export const RAF = {
  dtClampMs: 40,
};

export const SCROLL = {
  velocityDeadzone: 2,
  velocityLpf: 0.18,
  velocityClamp: 6000,
};

export const MOTION = {
  prefersReduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
};

export const ZONES = {
  registry: {
    default: {
      parallaxGain: 0.12,
      dampingMul: 1.0,
      depthOpacity: 0.4,
      depthTintRgba: [0, 0, 0, 0],
      boundaryWindowPx: 220,
      blendWindowPx: 260,
      density: 1.0,
      typeScale: 1.0,
      typeTrackingEm: 0.06,
    },
    canopy: {
      parallaxGain: 0.08,
      dampingMul: 1.05,
      depthOpacity: 0.42,
      depthTintRgba: [0, 0, 0, 0],
      boundaryWindowPx: 240,
      blendWindowPx: 320,
      density: 0.92,
      typeScale: 1.06,
      typeTrackingEm: 0.07,
    },
    systems: {
      parallaxGain: 0.11,
      dampingMul: 1.1,
      depthOpacity: 0.4,
      depthTintRgba: [0, 0, 0, 0],
      boundaryWindowPx: 220,
      blendWindowPx: 260,
      density: 1.04,
      typeScale: 1.0,
      typeTrackingEm: 0.06,
    },
    apps: {
      parallaxGain: 0.14,
      dampingMul: 1.0,
      depthOpacity: 0.38,
      depthTintRgba: [0, 0, 0, 0],
      boundaryWindowPx: 220,
      blendWindowPx: 260,
      density: 1.08,
      typeScale: 1.0,
      typeTrackingEm: 0.055,
    },
    ai: {
      parallaxGain: 0.12,
      dampingMul: 1.12,
      depthOpacity: 0.4,
      depthTintRgba: [0, 0, 0, 0],
      boundaryWindowPx: 220,
      blendWindowPx: 260,
      density: 1.02,
      typeScale: 0.99,
      typeTrackingEm: 0.06,
    },
    lab: {
      parallaxGain: 0.16,
      dampingMul: 0.95,
      depthOpacity: 0.36,
      depthTintRgba: [0, 0, 0, 0],
      boundaryWindowPx: 200,
      blendWindowPx: 240,
      density: 0.96,
      typeScale: 1.01,
      typeTrackingEm: 0.065,
    },
    archive: {
      parallaxGain: 0.1,
      dampingMul: 1.2,
      depthOpacity: 0.42,
      depthTintRgba: [0, 0, 0, 0],
      boundaryWindowPx: 240,
      blendWindowPx: 300,
      density: 0.98,
      typeScale: 0.98,
      typeTrackingEm: 0.06,
    },
    exit: {
      parallaxGain: 0.08,
      dampingMul: 1.15,
      depthOpacity: 0.44,
      depthTintRgba: [0, 0, 0, 0],
      boundaryWindowPx: 240,
      blendWindowPx: 320,
      density: 0.9,
      typeScale: 1.02,
      typeTrackingEm: 0.07,
    },
  },
};

export const DEPTH_PLANES = {
  levels: [
    { factor: 0.008 },
    { factor: 0.014 },
    { factor: 0.02 },
  ],
  followK: 8.0,
  boundaryStiffen: 0.6,
  boundaryGainDrop: 0.35,
};

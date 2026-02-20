export type DemoVideoQuality = "low" | "med" | "high";
export type DemoVideoQualityPreference = "auto" | DemoVideoQuality;

export type FullVideoSources = {
  low: string;
  med: string;
  high: string;
};

const DEMO_VIDEO_QUALITY_STORAGE_KEY = "demoVideoQuality";
const VALID_PREFERENCES: readonly DemoVideoQualityPreference[] = ["auto", "low", "med", "high"];

type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

export function getDemoVideoQualityPreference(): DemoVideoQualityPreference {
  if (typeof window === "undefined") {
    return "auto";
  }
  const stored = window.localStorage.getItem(DEMO_VIDEO_QUALITY_STORAGE_KEY);
  if (stored && VALID_PREFERENCES.includes(stored as DemoVideoQualityPreference)) {
    return stored as DemoVideoQualityPreference;
  }
  return "auto";
}

export function setDemoVideoQualityPreference(preference: DemoVideoQualityPreference) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(DEMO_VIDEO_QUALITY_STORAGE_KEY, preference);
}

export function chooseVideoQuality(preference: DemoVideoQualityPreference = "auto"): DemoVideoQuality {
  if (preference !== "auto") {
    return preference;
  }

  if (typeof navigator === "undefined") {
    return "med";
  }

  const connection = (navigator as NavigatorWithConnection).connection;
  if (!connection) {
    return "med";
  }

  if (connection.saveData) {
    return "low";
  }

  const effectiveType = connection.effectiveType?.toLowerCase();
  if (effectiveType === "slow-2g" || effectiveType === "2g") {
    return "low";
  }
  if (effectiveType === "3g") {
    return "med";
  }
  if (effectiveType === "4g") {
    return "high";
  }

  return "med";
}

const QUALITY_FALLBACK_ORDER: Record<DemoVideoQuality, DemoVideoQuality[]> = {
  high: ["high", "med", "low"],
  med: ["med", "low"],
  low: ["low"],
};

export function getQualityFallbackSequence(
  sources: FullVideoSources,
  preferredQuality: DemoVideoQuality,
): DemoVideoQuality[] {
  const sequence = QUALITY_FALLBACK_ORDER[preferredQuality].filter((quality) => Boolean(sources[quality]));
  return sequence.length ? sequence : ["low"];
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Screenshot } from "@/content/projects";
import { assetPath } from "@/lib/assetPath";
import {
  chooseVideoQuality,
  getDemoVideoQualityPreference,
  getQualityFallbackSequence,
  setDemoVideoQualityPreference,
  type DemoVideoQuality,
  type DemoVideoQualityPreference,
  type FullVideoSources,
} from "@/lib/demoVideoQuality";

type IPhoneScreenshotShowcaseProps = {
  items: Screenshot[];
  title?: string;
  frameSrc?: string;
  posterSrc?: string;
  previewVideoSrc?: string;
  fullVideoSources?: FullVideoSources;
};

function fallbackCaption(src: string) {
  const filename = src.split("/").pop() ?? src;
  const stem = filename.replace(/\.[^.]+$/, "");
  const normalized = stem.replace(/[-_]+/g, " ").trim();
  return normalized.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function IPhoneScreenshotShowcase({
  items,
  title = "NovaCommerce",
  frameSrc = "/devices/iphone12pro-frame-clean.png",
  posterSrc,
  previewVideoSrc,
  fullVideoSources,
}: IPhoneScreenshotShowcaseProps) {
  const TRANSITION_MS = 280;
  const STALL_TIMEOUT_MS = 3000;
  const screenshots = useMemo(() => items.filter((it) => Boolean(it.src)), [items]);
  const screenshotSources = useMemo(() => screenshots.map((it) => assetPath(it.src)), [screenshots]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  const [isShowingDemo, setIsShowingDemo] = useState(false);
  const [isFullDemoLoaded, setIsFullDemoLoaded] = useState(false);
  const [hasStartedFullDemo, setHasStartedFullDemo] = useState(false);
  const [isFullDemoUnavailable, setIsFullDemoUnavailable] = useState(false);
  const [qualityPreference, setQualityPreference] = useState<DemoVideoQualityPreference>("auto");
  const [fullDemoQualities, setFullDemoQualities] = useState<DemoVideoQuality[]>([]);
  const [fullDemoQualityIndex, setFullDemoQualityIndex] = useState(0);
  const [hasCurrentFullDemoCanPlay, setHasCurrentFullDemoCanPlay] = useState(false);
  const transitionTimerRef = useRef<number | null>(null);
  const waitingTimerRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const demoVideoRef = useRef<HTMLVideoElement | null>(null);
  const pendingDemoSeekTimeRef = useRef<number | null>(null);
  const total = screenshots.length;
  const currentFullQuality = fullDemoQualities[fullDemoQualityIndex];
  const currentFullVideoSrc =
    isFullDemoLoaded && fullVideoSources && currentFullQuality ? fullVideoSources[currentFullQuality] : undefined;
  const shouldPlayFullDemo = Boolean(currentFullVideoSrc);
  const demoSrc = shouldPlayFullDemo ? currentFullVideoSrc : previewVideoSrc;

  useEffect(() => {
    setQualityPreference(getDemoVideoQualityPreference());
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    // Preload static screenshots to reduce visible image swap flashes.
    screenshotSources.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [screenshotSources]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
      if (waitingTimerRef.current !== null) {
        window.clearTimeout(waitingTimerRef.current);
      }
    };
  }, []);

  const fallbackToPreview = useCallback(() => {
    setIsFullDemoLoaded(false);
    setHasStartedFullDemo(false);
    setIsFullDemoUnavailable(true);
    setHasCurrentFullDemoCanPlay(false);
    pendingDemoSeekTimeRef.current = null;
    if (waitingTimerRef.current !== null) {
      window.clearTimeout(waitingTimerRef.current);
      waitingTimerRef.current = null;
    }
  }, []);

  const fallbackToLowerQuality = useCallback(() => {
    if (!shouldPlayFullDemo) {
      fallbackToPreview();
      return;
    }

    if (fullDemoQualityIndex < fullDemoQualities.length - 1) {
      const currentTime = demoVideoRef.current?.currentTime ?? null;
      pendingDemoSeekTimeRef.current = currentTime;
      setHasStartedFullDemo(false);
      setHasCurrentFullDemoCanPlay(false);
      setFullDemoQualityIndex((idx) => idx + 1);
      if (waitingTimerRef.current !== null) {
        window.clearTimeout(waitingTimerRef.current);
        waitingTimerRef.current = null;
      }
      return;
    }

    fallbackToPreview();
  }, [fallbackToPreview, fullDemoQualities.length, fullDemoQualityIndex, shouldPlayFullDemo]);

  useEffect(() => {
    if (!isShowingDemo || !demoSrc) {
      return;
    }
    const video = demoVideoRef.current;
    if (!video) {
      return;
    }
    video.load();
    const playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        if (shouldPlayFullDemo) {
          fallbackToLowerQuality();
          return;
        }
        video.muted = true;
        void video.play();
      });
    }
  }, [isShowingDemo, demoSrc, shouldPlayFullDemo, fallbackToLowerQuality]);

  useEffect(() => {
    setHasCurrentFullDemoCanPlay(false);
    if (waitingTimerRef.current !== null) {
      window.clearTimeout(waitingTimerRef.current);
      waitingTimerRef.current = null;
    }
  }, [demoSrc, shouldPlayFullDemo]);

  const transitionTo = (nextIndex: number) => {
    if (!total) {
      return;
    }
    const normalized = ((nextIndex % total) + total) % total;
    const prev = currentIndexRef.current;
    if (normalized === prev) {
      return;
    }

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }

    setPreviousIndex(prev);
    setCurrentIndex(normalized);
    currentIndexRef.current = normalized;
    setIsTransitionActive(true);
    requestAnimationFrame(() => {
      setIsTransitionActive(false);
    });

    transitionTimerRef.current = window.setTimeout(() => {
      setPreviousIndex(null);
    }, TRANSITION_MS);
  };

  const goPrevious = () => {
    transitionTo(currentIndexRef.current - 1);
  };

  const goNext = () => {
    transitionTo(currentIndexRef.current + 1);
  };

  if (!total) {
    return null;
  }

  const activeIndex = currentIndex % total;
  const active = screenshots[activeIndex];
  const activeSrc = screenshotSources[activeIndex];
  const previousSrc = previousIndex !== null ? screenshotSources[previousIndex] : null;
  const caption = active.caption ?? fallbackCaption(active.src);
  const displayCaption = isShowingDemo ? "Demo Video" : caption;
  const hasDemo = Boolean(previewVideoSrc || fullVideoSources);

  return (
    <aside className="highlight-card rounded-2xl p-5">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>

      <div className="mt-5 flex justify-center">
        <div className="relative w-full max-w-[285px]">
          <div className="relative aspect-[1334/2676]">
            <div
              className="absolute overflow-hidden bg-black"
              style={{
                left: "6.22%",
                top: "2.69%",
                width: "87.71%",
                height: "94.62%",
                borderRadius: "34px",
              }}
            >
              {isShowingDemo && demoSrc ? (
                <video
                  ref={demoVideoRef}
                  src={assetPath(demoSrc)}
                  poster={posterSrc ? assetPath(posterSrc) : undefined}
                  className="h-full w-full object-cover"
                  autoPlay
                  controls={shouldPlayFullDemo}
                  muted={!shouldPlayFullDemo}
                  loop={!shouldPlayFullDemo}
                  playsInline
                  preload={shouldPlayFullDemo ? "metadata" : "none"}
                  onCanPlay={() => {
                    if (shouldPlayFullDemo) {
                      setHasCurrentFullDemoCanPlay(true);
                      if (waitingTimerRef.current !== null) {
                        window.clearTimeout(waitingTimerRef.current);
                        waitingTimerRef.current = null;
                      }
                    }
                  }}
                  onWaiting={() => {
                    if (!shouldPlayFullDemo || hasCurrentFullDemoCanPlay) {
                      return;
                    }
                    if (waitingTimerRef.current !== null) {
                      window.clearTimeout(waitingTimerRef.current);
                    }
                    waitingTimerRef.current = window.setTimeout(() => {
                      fallbackToLowerQuality();
                    }, STALL_TIMEOUT_MS);
                  }}
                  onLoadedMetadata={(event) => {
                    if (!shouldPlayFullDemo) return;
                    const savedTime = pendingDemoSeekTimeRef.current;
                    if (savedTime === null) return;
                    const video = event.currentTarget;
                    if (Number.isFinite(video.duration) && video.duration > 0) {
                      video.currentTime = Math.min(savedTime, Math.max(video.duration - 0.25, 0));
                    } else {
                      video.currentTime = savedTime;
                    }
                    pendingDemoSeekTimeRef.current = null;
                  }}
                  onError={() => {
                    if (shouldPlayFullDemo) {
                      fallbackToLowerQuality();
                    }
                  }}
                  onPlay={() => {
                    if (shouldPlayFullDemo) {
                      setHasStartedFullDemo(true);
                      setIsFullDemoUnavailable(false);
                      if (waitingTimerRef.current !== null) {
                        window.clearTimeout(waitingTimerRef.current);
                        waitingTimerRef.current = null;
                      }
                    }
                  }}
                />
              ) : (
                <div className="relative h-full w-full">
                  {previousSrc ? (
                    <img
                      src={previousSrc}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out ${
                        isTransitionActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ) : null}
                  <img
                    src={activeSrc}
                    alt={caption}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ease-out ${
                      previousSrc
                        ? isTransitionActive
                          ? "opacity-0 scale-[1.01]"
                          : "opacity-100 scale-100"
                        : "opacity-100 scale-100"
                    }`}
                  />
                </div>
              )}
            </div>
            <img
              src={assetPath(frameSrc)}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full select-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goPrevious}
          disabled={isShowingDemo}
          className="rounded-lg border border-foreground/15 px-3 py-2 text-xs font-mono uppercase tracking-wide hover:border-foreground/30"
          aria-label="Show previous screenshot"
        >
          Prev
        </button>
        <p className="min-w-0 flex-1 truncate text-center text-sm text-muted-foreground">{displayCaption}</p>
        <button
          type="button"
          onClick={goNext}
          disabled={isShowingDemo}
          className="rounded-lg border border-foreground/15 px-3 py-2 text-xs font-mono uppercase tracking-wide hover:border-foreground/30"
          aria-label="Show next screenshot"
        >
          Next
        </button>
      </div>

      {hasDemo ? (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (isShowingDemo) {
                setIsShowingDemo(false);
                setIsFullDemoLoaded(false);
                setHasStartedFullDemo(false);
                setIsFullDemoUnavailable(false);
                setHasCurrentFullDemoCanPlay(false);
                return;
              }
              setIsFullDemoUnavailable(false);
              setIsShowingDemo(true);
            }}
            aria-pressed={isShowingDemo}
            className="rounded-lg border border-foreground/15 px-3 py-2 text-xs font-mono uppercase tracking-wide hover:border-foreground/30"
          >
            {isShowingDemo ? "Images" : "Demo"}
          </button>
        </div>
      ) : null}

      {isShowingDemo && fullVideoSources ? (
        <div className="mt-2 flex justify-center">
          <label htmlFor="demo-quality-setting" className="flex items-center gap-2 text-xs text-muted-foreground">
            Quality
            <select
              id="demo-quality-setting"
              value={qualityPreference}
              onChange={(event) => {
                const nextPreference = event.target.value as DemoVideoQualityPreference;
                setQualityPreference(nextPreference);
                setDemoVideoQualityPreference(nextPreference);
              }}
              className="rounded-md border border-foreground/20 bg-background px-2 py-1 text-xs text-foreground"
            >
              <option value="auto">Auto</option>
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
      ) : null}

      {isShowingDemo && !hasStartedFullDemo && fullVideoSources ? (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => {
              const video = demoVideoRef.current;
              pendingDemoSeekTimeRef.current = video ? video.currentTime : null;
              setIsFullDemoUnavailable(false);
              const preferredQuality = chooseVideoQuality(qualityPreference);
              const qualitySequence = getQualityFallbackSequence(fullVideoSources, preferredQuality);
              setFullDemoQualities(qualitySequence);
              setFullDemoQualityIndex(0);
              setHasCurrentFullDemoCanPlay(false);
              setIsFullDemoLoaded(true);
            }}
            className="rounded-lg border border-foreground/15 px-3 py-2 text-xs font-mono uppercase tracking-wide hover:border-foreground/30"
          >
            Play full demo
          </button>
        </div>
      ) : null}
      {isShowingDemo && isFullDemoUnavailable ? (
        <p className="mt-2 text-center text-xs text-muted-foreground">Full demo unavailable</p>
      ) : null}

      {!isShowingDemo ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {screenshots.map((shot, idx) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => transitionTo(idx)}
              aria-label={`Show screenshot ${idx + 1} of ${total}`}
              aria-current={idx === activeIndex}
              className={`rounded-full transition-all ${
                idx === activeIndex
                  ? "h-2 w-6 bg-foreground/80"
                  : "h-2 w-2 bg-foreground/25 hover:bg-foreground/45"
              }`}
            />
          ))}
        </div>
      ) : null}
    </aside>
  );
}

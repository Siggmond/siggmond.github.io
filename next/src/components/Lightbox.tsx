"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

type LightboxProps = {
  images: string[];
  startIndex: number;
  posterSrc?: string;
  previewVideoSrc?: string;
  fullVideoSources?: FullVideoSources;
  startWithDemo?: boolean;
  onClose: () => void;
};

export function Lightbox({
  images,
  startIndex,
  posterSrc,
  previewVideoSrc,
  fullVideoSources,
  startWithDemo = false,
  onClose,
}: LightboxProps) {
  const STALL_TIMEOUT_MS = 3000;
  const [index, setIndex] = useState(startIndex);
  const [showDemo, setShowDemo] = useState(Boolean(startWithDemo && (previewVideoSrc || fullVideoSources)));
  const [isFullDemoLoaded, setIsFullDemoLoaded] = useState(false);
  const [hasStartedFullDemo, setHasStartedFullDemo] = useState(false);
  const [isFullDemoUnavailable, setIsFullDemoUnavailable] = useState(false);
  const [qualityPreference, setQualityPreference] = useState<DemoVideoQualityPreference>("auto");
  const [fullDemoQualities, setFullDemoQualities] = useState<DemoVideoQuality[]>([]);
  const [fullDemoQualityIndex, setFullDemoQualityIndex] = useState(0);
  const [hasCurrentFullDemoCanPlay, setHasCurrentFullDemoCanPlay] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const demoVideoRef = useRef<HTMLVideoElement | null>(null);
  const pendingDemoSeekTimeRef = useRef<number | null>(null);
  const waitingTimerRef = useRef<number | null>(null);
  const hasDemo = Boolean(previewVideoSrc || fullVideoSources);
  const currentFullQuality = fullDemoQualities[fullDemoQualityIndex];
  const currentFullVideoSrc =
    isFullDemoLoaded && fullVideoSources && currentFullQuality ? fullVideoSources[currentFullQuality] : undefined;
  const shouldPlayFullDemo = Boolean(currentFullVideoSrc);
  const demoSrc = shouldPlayFullDemo ? currentFullVideoSrc : previewVideoSrc;

  useEffect(() => {
    setQualityPreference(getDemoVideoQualityPreference());
  }, []);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    setShowDemo(Boolean(startWithDemo && (previewVideoSrc || fullVideoSources)));
  }, [startWithDemo, previewVideoSrc, fullVideoSources]);

  useEffect(() => {
    if (!showDemo) {
      setIsFullDemoLoaded(false);
      setHasStartedFullDemo(false);
      setIsFullDemoUnavailable(false);
    }
  }, [showDemo]);

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
    if (!showDemo || !demoSrc) {
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
  }, [showDemo, demoSrc, shouldPlayFullDemo, fallbackToLowerQuality]);

  useEffect(() => {
    setHasCurrentFullDemoCanPlay(false);
    if (waitingTimerRef.current !== null) {
      window.clearTimeout(waitingTimerRef.current);
      waitingTimerRef.current = null;
    }
  }, [demoSrc, shouldPlayFullDemo]);

  useEffect(() => {
    return () => {
      if (waitingTimerRef.current !== null) {
        window.clearTimeout(waitingTimerRef.current);
      }
    };
  }, []);

  const count = images.length;

  const goPrev = useCallback(() => {
    if (count < 2) return;
    setIndex((cur) => (cur - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    if (count < 2) return;
    setIndex((cur) => (cur + 1) % count);
  }, [count]);

  const getFocusable = () => {
    const root = dialogRef.current;
    if (!root) return [] as HTMLElement[];
    const nodes = root.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
    );
    return Array.from(nodes).filter((el) => !el.hasAttribute("disabled"));
  };

  useEffect(() => {
    const first = getFocusable()[0];
    if (first) first.focus();
  }, [index, showDemo]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowLeft" && !showDemo) {
        e.preventDefault();
        goPrev();
        return;
      }

      if (e.key === "ArrowRight" && !showDemo) {
        e.preventDefault();
        goNext();
        return;
      }

      if (e.key === "Tab") {
        const focusable = getFocusable();
        if (!focusable.length) return;

        const active = document.activeElement as HTMLElement | null;
        const currentIndex = active ? focusable.indexOf(active) : -1;

        if (e.shiftKey) {
          if (currentIndex <= 0) {
            e.preventDefault();
            focusable[focusable.length - 1]?.focus();
          }
        } else if (currentIndex === focusable.length - 1) {
          e.preventDefault();
          focusable[0]?.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, showDemo, goPrev, goNext]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!images.length && !hasDemo) return null;

  const currentSrc = images[index] ?? images[0] ?? "";

  return (
    <div
      className="lightbox-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Screenshot preview"
      >
        <div className="lightbox-toolbar">
          {showDemo ? (
            <div className="lightbox-counter" aria-label="Demo video">
              Demo
            </div>
          ) : (
            <div className="lightbox-counter" aria-label={`Image ${index + 1} of ${count}`}>
              {index + 1} / {count}
            </div>
          )}
          <div className="lightbox-actions">
            {hasDemo ? (
              <button
                type="button"
                className="lightbox-button"
                onClick={() => {
                  if (showDemo) {
                    setShowDemo(false);
                    setIsFullDemoLoaded(false);
                    setHasCurrentFullDemoCanPlay(false);
                    return;
                  }
                  setShowDemo(true);
                }}
                aria-pressed={showDemo}
                aria-label={showDemo ? "Show screenshots" : "Show demo video"}
              >
                {showDemo ? "Images" : "Demo"}
              </button>
            ) : null}
            {count > 1 && !showDemo ? (
              <button type="button" className="lightbox-button" onClick={goPrev} aria-label="Previous screenshot">
                Prev
              </button>
            ) : null}
            {count > 1 && !showDemo ? (
              <button type="button" className="lightbox-button" onClick={goNext} aria-label="Next screenshot">
                Next
              </button>
            ) : null}
            <button type="button" className="lightbox-button" onClick={onClose} aria-label="Close screenshot preview">
              Close
            </button>
          </div>
        </div>

        <div className="lightbox-stage">
          {showDemo && demoSrc ? (
            <div className="flex h-full w-full flex-col gap-3">
              <video
                ref={demoVideoRef}
                className="lightbox-image"
                src={assetPath(demoSrc)}
                poster={posterSrc ? assetPath(posterSrc) : undefined}
                controls={shouldPlayFullDemo}
                autoPlay
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
              {fullVideoSources ? (
                <div className="flex justify-center">
                  <label htmlFor="lightbox-demo-quality-setting" className="flex items-center gap-2 text-xs text-muted-foreground">
                    Quality
                    <select
                      id="lightbox-demo-quality-setting"
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
              {!hasStartedFullDemo && fullVideoSources ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="lightbox-button"
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
                    aria-label="Load and play full demo video"
                  >
                    Play full demo
                  </button>
                </div>
              ) : null}
              {isFullDemoUnavailable ? (
                <p className="text-center text-xs text-muted-foreground">Full demo unavailable</p>
              ) : null}
            </div>
          ) : (
            <img className="lightbox-image" src={assetPath(currentSrc)} alt="" />
          )}
        </div>
      </div>
    </div>
  );
}

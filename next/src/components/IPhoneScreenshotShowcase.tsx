"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Screenshot } from "@/content/projects";
import { assetPath } from "@/lib/assetPath";

type IPhoneScreenshotShowcaseProps = {
  items: Screenshot[];
  title?: string;
  frameSrc?: string;
  posterSrc?: string;
  previewVideoSrc?: string;
  fullVideoSrc?: string;
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
  fullVideoSrc,
}: IPhoneScreenshotShowcaseProps) {
  const TRANSITION_MS = 280;
  const screenshots = useMemo(() => items.filter((it) => Boolean(it.src)), [items]);
  const screenshotSources = useMemo(() => screenshots.map((it) => assetPath(it.src)), [screenshots]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  const [isShowingDemo, setIsShowingDemo] = useState(false);
  const [isFullDemoLoaded, setIsFullDemoLoaded] = useState(false);
  const [isFullDemoAvailable, setIsFullDemoAvailable] = useState(false);
  const [hasStartedFullDemo, setHasStartedFullDemo] = useState(false);
  const transitionTimerRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const demoVideoRef = useRef<HTMLVideoElement | null>(null);
  const pendingDemoSeekTimeRef = useRef<number | null>(null);
  const total = screenshots.length;
  const shouldPlayFullDemo = isFullDemoLoaded && isFullDemoAvailable && Boolean(fullVideoSrc);
  const demoSrc = shouldPlayFullDemo && fullVideoSrc ? fullVideoSrc : previewVideoSrc;

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
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;

    const checkFullDemo = async () => {
      if (!fullVideoSrc) {
        if (!isCancelled) {
          setIsFullDemoAvailable(false);
        }
        return;
      }

      const fullUrl = assetPath(fullVideoSrc);
      if (!isCancelled) {
        setIsFullDemoAvailable(false);
      }

      try {
        const headResponse = await fetch(fullUrl, {
          method: "HEAD",
          cache: "no-store",
          signal: controller.signal,
        });
        if (!isCancelled && headResponse.ok) {
          setIsFullDemoAvailable(true);
          return;
        }
      } catch {
        // Fallback request below handles servers that block HEAD.
      }

      try {
        const rangeResponse = await fetch(fullUrl, {
          method: "GET",
          headers: { Range: "bytes=0-0" },
          cache: "no-store",
          signal: controller.signal,
        });
        if (!isCancelled) {
          setIsFullDemoAvailable(rangeResponse.ok || rangeResponse.status === 206);
        }
      } catch {
        if (!isCancelled) {
          setIsFullDemoAvailable(false);
        }
      }
    };
    void checkFullDemo();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [fullVideoSrc]);

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
        video.muted = true;
        void video.play();
      });
    }
  }, [isShowingDemo, demoSrc]);

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
  const hasDemo = Boolean(previewVideoSrc || fullVideoSrc);

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
                      setIsFullDemoLoaded(false);
                      setHasStartedFullDemo(false);
                    }
                  }}
                  onPlay={() => {
                    if (shouldPlayFullDemo) {
                      setHasStartedFullDemo(true);
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
                return;
              }
              setIsShowingDemo(true);
            }}
            aria-pressed={isShowingDemo}
            className="rounded-lg border border-foreground/15 px-3 py-2 text-xs font-mono uppercase tracking-wide hover:border-foreground/30"
          >
            {isShowingDemo ? "Images" : "Demo"}
          </button>
        </div>
      ) : null}

      {isShowingDemo && !hasStartedFullDemo && isFullDemoAvailable && fullVideoSrc ? (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => {
              const video = demoVideoRef.current;
              pendingDemoSeekTimeRef.current = video ? video.currentTime : null;
              setIsFullDemoLoaded(true);
            }}
            className="rounded-lg border border-foreground/15 px-3 py-2 text-xs font-mono uppercase tracking-wide hover:border-foreground/30"
          >
            Play full demo
          </button>
        </div>
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

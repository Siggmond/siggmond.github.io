"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { assetPath } from "@/lib/assetPath";

type LightboxProps = {
  images: string[];
  startIndex: number;
  demoVideoSrc?: string;
  startWithDemo?: boolean;
  onClose: () => void;
};

export function Lightbox({ images, startIndex, demoVideoSrc, startWithDemo = false, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const [showDemo, setShowDemo] = useState(Boolean(startWithDemo && demoVideoSrc));
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const hasDemo = Boolean(demoVideoSrc);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    setShowDemo(Boolean(startWithDemo && demoVideoSrc));
  }, [startWithDemo, demoVideoSrc]);

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
                onClick={() => setShowDemo((cur) => !cur)}
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
          {showDemo && demoVideoSrc ? (
            <video
              className="lightbox-image"
              src={assetPath(demoVideoSrc)}
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
          ) : (
            <img className="lightbox-image" src={assetPath(currentSrc)} alt="" />
          )}
        </div>
      </div>
    </div>
  );
}

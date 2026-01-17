"use client";

import { useEffect, useRef, useState } from "react";

import { assetPath } from "@/lib/assetPath";

export function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  const count = images.length;

  const goPrev = () => {
    setIndex((cur) => (cur - 1 + count) % count);
  };

  const goNext = () => {
    setIndex((cur) => (cur + 1) % count);
  };

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
  }, [index]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
        return;
      }

      if (e.key === "ArrowRight") {
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
        } else {
          if (currentIndex === focusable.length - 1) {
            e.preventDefault();
            focusable[0]?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, count]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!images.length) return null;

  const currentSrc = images[index] ?? images[0];

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
          <div className="lightbox-counter" aria-label={`Image ${index + 1} of ${count}`}>
            {index + 1} / {count}
          </div>
          <div className="lightbox-actions">
            {count > 1 ? (
              <button type="button" className="lightbox-button" onClick={goPrev} aria-label="Previous screenshot">
                ←
              </button>
            ) : null}
            {count > 1 ? (
              <button type="button" className="lightbox-button" onClick={goNext} aria-label="Next screenshot">
                →
              </button>
            ) : null}
            <button type="button" className="lightbox-button" onClick={onClose} aria-label="Close screenshot preview">
              ✕
            </button>
          </div>
        </div>

        <div className="lightbox-stage">
          <img className="lightbox-image" src={assetPath(currentSrc)} alt="" />
        </div>
      </div>
    </div>
  );
}

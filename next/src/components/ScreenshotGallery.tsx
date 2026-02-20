"use client";

import { useMemo, useRef, useState } from "react";

import { assetPath } from "@/lib/assetPath";
import { Lightbox } from "@/components/Lightbox";

export type Screenshot = {
  src: string;
  alt: string;
  caption?: string;
};

type ScreenshotGalleryLayout = "grid" | "compact-strip";

export function ScreenshotGallery({
  items,
  layout = "grid",
  posterSrc,
  previewVideoSrc,
  fullVideoSrc,
}: {
  items: Screenshot[];
  layout?: ScreenshotGalleryLayout;
  posterSrc?: string;
  previewVideoSrc?: string;
  fullVideoSrc?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [startWithDemo, setStartWithDemo] = useState(false);
  const lastFocusedElRef = useRef<HTMLButtonElement | null>(null);
  const isCompactStrip = layout === "compact-strip";

  const images = useMemo(() => items.map((it) => it.src), [items]);

  if (!items.length) {
    return (
      <div className="highlight-card mt-6 rounded-xl p-5 text-sm text-muted-foreground">
        No screenshots available.
      </div>
    );
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Screenshots</div>
        {previewVideoSrc || fullVideoSrc ? (
          <button
            type="button"
            className="rounded-md border border-foreground/15 px-3 py-1.5 text-xs font-mono uppercase tracking-wide hover:border-foreground/30"
            onClick={() => {
              setStartWithDemo(true);
              setOpenIndex(0);
            }}
            aria-label="Open demo video"
          >
            Demo
          </button>
        ) : null}
      </div>
      <div className={isCompactStrip ? "mt-4 flex gap-2 overflow-x-auto pb-2 pr-2" : "mt-4 grid gap-4 sm:grid-cols-2"}>
        {items.map((it, idx) => (
          <figure
            key={it.src}
            className={
              isCompactStrip
                ? "highlight-card shrink-0 overflow-hidden rounded-md bg-background"
                : "highlight-card overflow-hidden rounded-xl bg-background"
            }
          >
            <button
              type="button"
              className={isCompactStrip ? "block w-[72px] text-left" : "block w-full text-left"}
              onClick={(e) => {
                lastFocusedElRef.current = e.currentTarget;
                setStartWithDemo(false);
                setOpenIndex(idx);
              }}
              aria-label={`Open screenshot ${idx + 1} of ${items.length}`}
            >
              <img
                src={assetPath(it.src)}
                alt={it.alt}
                loading="lazy"
                decoding="async"
                className={isCompactStrip ? "h-[136px] w-[72px] object-cover" : "h-64 w-full object-cover"}
              />
            </button>
            {!isCompactStrip && it.caption ? (
              <figcaption className="border-t border-foreground/10 p-3 text-sm text-muted-foreground">{it.caption}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {openIndex !== null ? (
        <Lightbox
          images={images}
          startIndex={openIndex}
          posterSrc={posterSrc}
          previewVideoSrc={previewVideoSrc}
          fullVideoSrc={fullVideoSrc}
          startWithDemo={startWithDemo}
          onClose={() => {
            setOpenIndex(null);
            setStartWithDemo(false);
            lastFocusedElRef.current?.focus();
          }}
        />
      ) : null}
    </section>
  );
}

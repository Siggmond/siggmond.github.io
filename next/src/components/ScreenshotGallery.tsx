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
  const [featured, ...rest] = items;

  const images = useMemo(() => items.map((it) => it.src), [items]);

  if (!items.length) {
    return (
      <div className="highlight-card mt-6 rounded-xl p-5 text-sm text-muted-foreground">
        No screenshots available.
      </div>
    );
  }

  return (
    <section className="mt-12">
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
      <figure className="case-card case-reveal mt-5 overflow-hidden rounded-2xl" style={{ animationDelay: "40ms" }}>
        <button
          type="button"
          className="block w-full text-left"
          onClick={(e) => {
            lastFocusedElRef.current = e.currentTarget;
            setStartWithDemo(false);
            setOpenIndex(0);
          }}
          aria-label={`Open featured screenshot of ${items.length}`}
        >
          <img
            src={assetPath(featured.src)}
            alt={featured.alt}
            loading="eager"
            decoding="async"
            className="h-[260px] w-full object-cover sm:h-[360px] lg:h-[460px]"
          />
        </button>
        {featured.caption ? (
          <figcaption className="border-t border-foreground/10 p-3 text-sm text-foreground/75">{featured.caption}</figcaption>
        ) : null}
      </figure>

      <div className={isCompactStrip ? "mt-4 flex gap-2 overflow-x-auto pb-2 pr-2" : "mt-5 grid gap-4 sm:grid-cols-2"}>
        {rest.map((it, idx) => (
          <figure
            key={it.src}
            style={{ animationDelay: `${80 + idx * 30}ms` }}
            className={
              isCompactStrip
                ? "case-card case-reveal shrink-0 overflow-hidden rounded-md"
                : "case-card case-reveal overflow-hidden rounded-xl"
            }
          >
            <button
              type="button"
              className={isCompactStrip ? "block w-[72px] text-left" : "block w-full text-left"}
              onClick={(e) => {
                lastFocusedElRef.current = e.currentTarget;
                setStartWithDemo(false);
                setOpenIndex(idx + 1);
              }}
              aria-label={`Open screenshot ${idx + 2} of ${items.length}`}
            >
              <img
                src={assetPath(it.src)}
                alt={it.alt}
                loading="lazy"
                decoding="async"
                className={isCompactStrip ? "h-[136px] w-[72px] object-cover" : "h-56 w-full object-cover"}
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

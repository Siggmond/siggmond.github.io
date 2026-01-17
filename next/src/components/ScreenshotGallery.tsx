"use client";

import { useMemo, useRef, useState } from "react";

import { assetPath } from "@/lib/assetPath";
import { Lightbox } from "@/components/Lightbox";

export type Screenshot = {
  src: string;
  alt: string;
  caption?: string;
};

export function ScreenshotGallery({ items }: { items: Screenshot[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastFocusedElRef = useRef<HTMLButtonElement | null>(null);

  const images = useMemo(() => items.map((it) => it.src), [items]);

  if (!items.length) {
    return (
      <div className="mt-6 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5 text-sm text-muted-foreground">
        No screenshots available.
      </div>
    );
  }

  return (
    <section className="mt-10">
      <div className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Screenshots</div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((it, idx) => (
          <figure key={it.src} className="overflow-hidden rounded-xl border border-foreground/10 bg-background">
            <button
              type="button"
              className="block w-full text-left"
              onClick={(e) => {
                lastFocusedElRef.current = e.currentTarget;
                setOpenIndex(idx);
              }}
              aria-label={`Open screenshot ${idx + 1} of ${items.length}`}
            >
              <img
                src={assetPath(it.src)}
                alt={it.alt}
                loading="lazy"
                decoding="async"
                className="h-64 w-full object-cover"
              />
            </button>
            {it.caption ? (
              <figcaption className="border-t border-foreground/10 p-3 text-sm text-muted-foreground">{it.caption}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {openIndex !== null ? (
        <Lightbox
          images={images}
          startIndex={openIndex}
          onClose={() => {
            setOpenIndex(null);
            lastFocusedElRef.current?.focus();
          }}
        />
      ) : null}
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function BackgroundLighting() {
  const DEBUG = false;

  const elRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    const el = elRef.current;
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log("[BackgroundLighting] mounted", { elExists: Boolean(el) });
    }

    if (DEBUG && el) {
      root.style.setProperty("--intensity", "3");
      el.style.opacity = "1";
      el.style.outline = "2px solid red";
      el.style.background =
        "radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.35), transparent 60%), radial-gradient(circle at 25% 30%, rgba(255, 255, 0, 0.22), transparent 55%)";
    }

    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const reduced = Boolean(mql?.matches);

    // Defaults (static + safe)
    root.style.setProperty("--lx1", "0.28");
    root.style.setProperty("--ly1", "0.22");
    root.style.setProperty("--lx2", "0.78");
    root.style.setProperty("--ly2", "0.34");
    root.style.setProperty("--lx3", "0.55");
    root.style.setProperty("--ly3", "0.78");
    if (!DEBUG) root.style.setProperty("--intensity", "1.15");

    if (DEBUG && el) {
      const cs = window.getComputedStyle(el);
      // eslint-disable-next-line no-console
      console.log("[BackgroundLighting] computed", {
        position: cs.position,
        inset: { top: cs.top, right: cs.right, bottom: cs.bottom, left: cs.left },
        zIndex: cs.zIndex,
        pointerEvents: cs.pointerEvents,
        opacity: cs.opacity,
        backgroundImage: cs.backgroundImage,
        background: cs.background,
      });

      const x = Math.floor(window.innerWidth / 2);
      const y = Math.floor(window.innerHeight / 2);
      const topEl = document.elementFromPoint(x, y);
      if (topEl) {
        const topCS = window.getComputedStyle(topEl);
        // eslint-disable-next-line no-console
        console.log("[BackgroundLighting] elementFromPoint(center)", {
          tag: topEl.tagName,
          id: topEl.id,
          className: (topEl as HTMLElement).className,
          position: topCS.position,
          zIndex: topCS.zIndex,
          backgroundColor: topCS.backgroundColor,
          backgroundImage: topCS.backgroundImage,
        });
      }
    }

    if (reduced) {
      root.dataset.lightingMotion = "reduced";
      return;
    }

    root.dataset.lightingMotion = "full";

    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;

    let lastMoveAt = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetX = clamp01(e.clientX / w);
      targetY = clamp01(e.clientY / h);
      lastMoveAt = performance.now();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const start = performance.now();

    const tick = (now: number) => {
      // Smooth mouse
      const lerp = 0.06;
      mouseX += (targetX - mouseX) * lerp;
      mouseY += (targetY - mouseY) * lerp;

      // Gentle auto drift (also covers mobile)
      const t = (now - start) / 1000;
      const driftX = Math.sin(t * 0.18) * 0.06;
      const driftY = Math.cos(t * 0.16) * 0.05;

      // If no recent mouse movement, let drift dominate
      const idle = now - lastMoveAt > 2500;
      const dx = idle ? driftX : driftX + (mouseX - 0.5) * 0.08;
      const dy = idle ? driftY : driftY + (mouseY - 0.5) * 0.08;

      root.style.setProperty("--lx1", String(clamp01(0.28 + dx)));
      root.style.setProperty("--ly1", String(clamp01(0.22 + dy)));
      root.style.setProperty("--lx2", String(clamp01(0.78 - dx * 0.8)));
      root.style.setProperty("--ly2", String(clamp01(0.34 + dy * 0.6)));
      root.style.setProperty("--lx3", String(clamp01(0.55 + dx * 0.4)));
      root.style.setProperty("--ly3", String(clamp01(0.78 - dy * 0.5)));

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <div ref={elRef} aria-hidden="true" className="bg-lighting" />;
}

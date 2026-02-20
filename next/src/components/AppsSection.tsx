"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import { IPhoneScreenshotShowcase } from "@/components/IPhoneScreenshotShowcase";
import type { ProjectEntry } from "@/content/projects";

type AppsSectionProps = {
  apps: ProjectEntry[];
};

export function AppsSection({ apps }: AppsSectionProps) {
  const firstApp = apps[0] ?? null;
  const [activeSlug, setActiveSlug] = useState<string>(firstApp?.slug ?? "");
  const showcaseRef = useRef<HTMLDivElement | null>(null);

  const activeApp = useMemo(() => {
    if (!apps.length) {
      return null;
    }
    return apps.find((app) => app.slug === activeSlug) ?? apps[0];
  }, [activeSlug, apps]);

  const selectApp = (slug: string) => {
    setActiveSlug(slug);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1279px)").matches) {
      requestAnimationFrame(() => {
        showcaseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  if (!activeApp) {
    return null;
  }

  return (
    <section id="apps" className="py-14">
      <header className="space-y-3">
        <p className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Apps</p>
        <h2 className="text-3xl font-semibold tracking-tight">Apps</h2>
        <p className="text-muted-foreground max-w-2xl">
          Product-focused applications across web and mobile with typed boundaries, resilient UX flows, and
          operationally clear behavior.
        </p>
      </header>
      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] xl:items-start">
        <div className="grid gap-4 md:grid-cols-2">
          {apps.map((app) => {
            const isActive = activeApp.slug === app.slug;
            return (
              <article
                key={app.slug}
                className={`highlight-card rounded-xl p-5 ${isActive ? "highlight-card-active ring-1 ring-cyan-100/80" : ""}`}
              >
                <button type="button" onClick={() => selectApp(app.slug)} className="w-full text-left">
                  <div className="text-lg font-semibold">{app.title}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{app.summary}</div>
                </button>
                <div className="mt-4 flex items-center justify-end">
                  <Link
                    className="rounded-lg border border-blue-500/60 bg-blue-500/10 px-3 py-2 text-xs font-mono uppercase tracking-wide text-blue-700 hover:border-blue-500"
                    href={`/projects/${app.slug}`}
                  >
                    View
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <div ref={showcaseRef}>
          <IPhoneScreenshotShowcase
            key={activeApp.slug}
            items={activeApp.screenshots ?? []}
            title={activeApp.title}
            posterSrc={activeApp.posterSrc}
            previewVideoSrc={activeApp.previewVideoSrc}
            fullVideoSources={activeApp.fullVideoSources}
          />
        </div>
      </div>
    </section>
  );
}

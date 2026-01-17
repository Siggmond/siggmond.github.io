import type { Metadata } from "next";
import Link from "next/link";

import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects · Siggmond",
  description: "DevTools, platform surfaces, systems work, and AI tooling — organized for fast scanning.",
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="sticky top-0 z-10 -mx-6 mb-8 border-b border-foreground/10 bg-background/70 px-6 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="text-sm text-muted-foreground">
            <Link className="underline" href="/">
              Home
            </Link>
            <span> / </span>
            <span className="text-foreground/80">Projects</span>
          </nav>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 bg-foreground/[0.03] px-3 py-2 font-mono text-sm text-foreground/80 hover:border-foreground/25"
          >
            ← Home
          </Link>
        </div>
      </div>

      <header className="space-y-3">
        <p className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Portfolio</p>
        <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
        <p className="text-muted-foreground max-w-2xl">
          DevTools, platform surfaces, systems work, and AI tooling — organized for fast scanning.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </section>
    </main>
  );
}

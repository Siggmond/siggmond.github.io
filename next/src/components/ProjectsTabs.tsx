"use client";

import { useMemo, useState } from "react";

import type { ProjectEntry } from "@/content/projects";
import { ProjectCard } from "@/components/ProjectCard";

type TabSpec = {
  id: string;
  label: string;
  description: string;
  filter: (project: ProjectEntry) => boolean;
};

const TAB_SPECS: TabSpec[] = [
  {
    id: "all",
    label: "All",
    description: "Everything across tools, platforms, and applications.",
    filter: () => true,
  },
  {
    id: "flagship",
    label: "Flagship",
    description: "Primary work that anchors the portfolio narrative.",
    filter: (project) => project.tier === "flagship",
  },
  {
    id: "devtools",
    label: "DevTools",
    description: "Tooling, automation, and developer experience systems.",
    filter: (project) =>
      project.type === "tool" ||
      project.categories?.includes("tooling") ||
      project.domains?.includes("developer-experience") ||
      project.domains?.includes("open-source"),
  },
  {
    id: "systems",
    label: "Systems",
    description: "Distributed systems, platform work, and integration patterns.",
    filter: (project) =>
      project.domains?.includes("distributed-systems") ||
      project.domains?.includes("platform") ||
      project.domains?.includes("integration"),
  },
  {
    id: "apps",
    label: "Apps",
    description: "Full-stack and internal tools with UX + workflow design.",
    filter: (project) =>
      project.type === "application" ||
      project.domains?.includes("full-stack") ||
      project.domains?.includes("internal-tools"),
  },
  {
    id: "mobile",
    label: "Mobile",
    description: "Flutter-first mobile product builds and commerce apps.",
    filter: (project) => project.domains?.includes("mobile"),
  },
];

export function ProjectsTabs({ projects }: { projects: ProjectEntry[] }) {
  const [activeTabId, setActiveTabId] = useState(TAB_SPECS[0]?.id ?? "all");

  const activeTab = useMemo(
    () => TAB_SPECS.find((tab) => tab.id === activeTabId) ?? TAB_SPECS[0],
    [activeTabId],
  );

  const filteredProjects = useMemo(
    () => projects.filter((project) => activeTab.filter(project)),
    [projects, activeTab],
  );

  return (
    <section className="mt-10 space-y-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Project categories">
        {TAB_SPECS.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={[
                "rounded-full border px-4 py-2 text-sm font-mono transition",
                isActive
                  ? "border-foreground/50 bg-foreground/10 text-foreground shadow-sm"
                  : "border-foreground/15 text-muted-foreground hover:border-foreground/30 hover:text-foreground/80",
              ].join(" ")}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Specification
            </div>
            <div className="text-lg font-semibold">{activeTab.label}</div>
            <p className="max-w-2xl text-sm text-muted-foreground">{activeTab.description}</p>
          </div>
          <div className="rounded-full border border-foreground/10 px-3 py-1 text-xs font-mono text-muted-foreground">
            {filteredProjects.length} Projects
          </div>
        </div>
      </div>

      {filteredProjects.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-foreground/20 bg-foreground/[0.02] p-10 text-center text-sm text-muted-foreground">
          No projects match this specification yet.
        </div>
      )}
    </section>
  );
}

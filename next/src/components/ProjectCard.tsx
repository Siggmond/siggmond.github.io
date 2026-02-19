import Link from "next/link";

import type { ProjectEntry } from "@/content/projects";
import { assetPath } from "@/lib/assetPath";

export function ProjectCard({ project }: { project: ProjectEntry }) {
  const href = `/projects/${project.slug}`;

  return (
    <Link
      href={href}
      className="highlight-card group rounded-xl p-5"
    >
      <div className="space-y-3">
        {project.thumbnail ? (
          <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background">
            <img
              src={assetPath(project.thumbnail)}
              alt={`${project.title} thumbnail`}
              className="h-40 w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}

        <div>
          <div className="text-lg font-semibold">{project.title}</div>
          {project.stack ? (
            <div className="mt-1 text-sm text-muted-foreground">{project.stack}</div>
          ) : null}
        </div>

        <div className="text-sm text-muted-foreground">{project.summary}</div>

        {project.tags.length ? (
          <div className="pt-1 flex flex-wrap gap-2">
            {project.tags.slice(0, 6).map((t) => (
              <span key={t} className="rounded-md border border-foreground/10 px-2 py-0.5 text-xs font-mono text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {project.links && (project.links.github || project.links.pypi) ? (
          <div className="pt-1 text-sm text-muted-foreground space-y-1">
            {project.links.github ? (
              <div>
                <span className="font-mono">GitHub:</span> {project.links.github}
              </div>
            ) : null}
            {project.links.pypi ? (
              <div>
                <span className="font-mono">PyPI:</span> {project.links.pypi}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

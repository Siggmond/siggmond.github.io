import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { getProject, projects } from "@/content/projects";
import { renderProjectMdx } from "@/lib/mdx";
import { BackToProjectsButton } from "@/components/BackToProjectsButton";
import { ScreenshotGallery } from "@/components/ScreenshotGallery";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = `${project.title} · Siggmond`;
  const description = project.summary;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return notFound();

  let rendered = { html: "", frontmatter: {} as Record<string, unknown> };
  if (project.hasMdx) {
    try {
      rendered = await renderProjectMdx(`${project.slug}.mdx`);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        const expected = `src/content/projects/${project.slug}.mdx`;
        if (project.slug === "reposcope-ai") {
          // eslint-disable-next-line no-console
          console.warn(`[MDX] not found for slug ${project.slug} at ${expected}`, err);
        } else {
          // eslint-disable-next-line no-console
          console.warn(`[MDX] failed to load for slug ${project.slug} at ${expected}`, err);
        }
      }
    }
  }

  const screenshots = Array.isArray(project.screenshots)
    ? project.screenshots.map((s) => ({
        src: s.src,
        alt: s.caption || `${project.title} screenshot`,
        caption: s.caption,
      }))
    : [];

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="sticky top-0 z-10 -mx-6 mb-8 border-b border-foreground/10 bg-background/70 px-6 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="text-sm text-muted-foreground">
          <Link className="underline" href="/">
            Home
          </Link>
          <span> / </span>
          <Link className="underline" href="/projects">
            Projects
          </Link>
          <span> / </span>
          <span className="text-foreground/80">{project.title}</span>
          </nav>
          <BackToProjectsButton />
        </div>
      </div>

      <header className="space-y-3">
        <p className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Case study</p>
        <h1 className="text-4xl font-semibold tracking-tight">{project.title}</h1>
        <p className="text-muted-foreground">{project.summary}</p>
      </header>

      <div className="mt-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {project.year ? <span>{project.year}</span> : null}
          {project.stack ? <span>{project.stack}</span> : null}
          {project.determinism ? <span>Determinism: {project.determinism}</span> : null}
          {project.status ? <span>Lifecycle: {project.status}</span> : null}
        </div>

        {project.links && (project.links.github || project.links.pypi || project.links.docs || project.links.demo) ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.links.github ? (
              <a className="underline" href={project.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            ) : null}
            {project.links.pypi ? (
              <a className="underline" href={project.links.pypi} target="_blank" rel="noreferrer">
                PyPI
              </a>
            ) : null}
            {project.links.docs ? (
              <a className="underline" href={project.links.docs} target="_blank" rel="noreferrer">
                Docs
              </a>
            ) : null}
            {project.links.demo ? (
              <a className="underline" href={project.links.demo} target="_blank" rel="noreferrer">
                Demo
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <ScreenshotGallery items={screenshots} />

      {rendered.html ? (
        <article className="prose prose-zinc dark:prose-invert mt-10 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: rendered.html }} />
        </article>
      ) : (
        <section className="mt-10 space-y-6">
          {project.why ? (
            <div>
              <div className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Why</div>
              <div className="mt-2 text-muted-foreground">{project.why}</div>
            </div>
          ) : null}

          {project.problem ? (
            <div>
              <div className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Problem</div>
              <div className="mt-2 text-muted-foreground">{project.problem}</div>
            </div>
          ) : null}

          {project.tradeoffs ? (
            <div>
              <div className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Tradeoffs</div>
              <div className="mt-2 text-muted-foreground">{project.tradeoffs}</div>
            </div>
          ) : null}

          {project.differentiators?.length ? (
            <div>
              <div className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Differentiators</div>
              <ul className="mt-3 list-disc pl-6 text-muted-foreground">
                {project.differentiators.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.decisions?.length ? (
            <div>
              <div className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Decisions</div>
              <ul className="mt-3 list-disc pl-6 text-muted-foreground">
                {project.decisions.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.failureModes?.length ? (
            <div>
              <div className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Failure Modes</div>
              <ul className="mt-3 list-disc pl-6 text-muted-foreground">
                {project.failureModes.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      )}

      {project.architecture ? (
        <section className="mt-10">
          <div className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Architecture</div>
          <pre className="mt-3 overflow-auto rounded-xl border border-foreground/10 bg-background p-4 text-sm">
            {project.architecture}
          </pre>
        </section>
      ) : null}
    </main>
  );
}

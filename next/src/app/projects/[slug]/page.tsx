import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { getProject, projects } from "@/content/projects";
import { getProjectCaseStudy } from "@/content/projects/caseStudies";
import { renderProjectMdx } from "@/lib/mdx";
import { BackToProjectsButton } from "@/components/BackToProjectsButton";
import { CaseStudyBadges, CaseStudyHeroMetrics, ProjectCaseStudySections } from "@/components/ProjectCaseStudySections";
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

  const title = `${project.title} - Siggmond`;
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
  const caseStudy = getProjectCaseStudy(project.slug);

  let rendered = { html: "", frontmatter: {} as Record<string, unknown> };
  if (project.hasMdx) {
    try {
      rendered = await renderProjectMdx(`${project.slug}.mdx`);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        const expected = `src/content/projects/${project.slug}.mdx`;
        if (project.slug === "reposcope-ai") {
          console.warn(`[MDX] not found for slug ${project.slug} at ${expected}`, err);
        } else {
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
  const screenshotLayout = project.type === "application" ? "compact-strip" : "grid";

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-20 text-base leading-relaxed">
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

      <header className="max-w-[72ch] space-y-4">
        <p className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Case study</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{project.title}</h1>
        <p className="text-foreground/90">{project.summary}</p>
        {caseStudy ? <CaseStudyBadges badges={caseStudy.badges} /> : null}
      </header>

      {caseStudy ? <CaseStudyHeroMetrics metrics={caseStudy.heroMetrics} /> : null}

      <div className="case-card mt-7 rounded-2xl p-5">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {project.year ? <span>{project.year}</span> : null}
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

      <ScreenshotGallery
        items={screenshots}
        layout={screenshotLayout}
        posterSrc={project.posterSrc}
        previewVideoSrc={project.previewVideoSrc}
        fullVideoSources={project.fullVideoSources}
      />

      {caseStudy ? (
        <ProjectCaseStudySections study={caseStudy} />
      ) : rendered.html ? (
        <article className="prose prose-invert mt-10 max-w-none text-foreground">
          <div dangerouslySetInnerHTML={{ __html: rendered.html }} />
        </article>
      ) : (
        <section className="mt-10 max-w-[72ch] space-y-6">
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
        <section className="mt-10 max-w-[72ch]">
          <div className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Architecture</div>
          <pre className="case-card mt-3 overflow-auto rounded-xl p-4 text-sm">
            {project.architecture}
          </pre>
        </section>
      ) : null}
    </main>
  );
}


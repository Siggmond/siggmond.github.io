import type { HeroMetric, ProjectCaseStudy } from "@/content/projects/caseStudies";

type ProjectCaseStudySectionsProps = {
  study: ProjectCaseStudy;
};

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-foreground/70">{title}</h2>;
}

function MetricIcon({ kind }: { kind: HeroMetric["icon"] }) {
  if (kind === "build") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-cyan-200">
        <path d="M4 15h16M4 9h16M7 19h10M7 5h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "speed") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-emerald-200">
        <path d="M4 12h9M10 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "quality") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-indigo-200">
        <path
          d="M5 12.5 10.5 18 19 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-amber-200">
      <path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CaseStudyHeroMetrics({ metrics }: { metrics: ProjectCaseStudy["heroMetrics"] }) {
  return (
    <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <article key={metric.label} className="case-card case-reveal rounded-2xl p-4" style={{ animationDelay: `${index * 40}ms` }}>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-foreground/15 bg-foreground/5">
              <MetricIcon kind={metric.icon} />
            </span>
            <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/65">{metric.label}</p>
          </div>
          <p className="mt-3 text-[1.05rem] font-semibold text-foreground">{metric.value}</p>
          <p className="mt-1 text-xs text-foreground/75">{metric.detail}</p>
        </article>
      ))}
    </section>
  );
}

export function CaseStudyBadges({ badges }: { badges: ProjectCaseStudy["badges"] }) {
  return (
    <section className="mt-5 flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span key={`${badge.label}:${badge.value}`} className="rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1 text-xs text-foreground/90">
          <span className="text-foreground/60">{badge.label}:</span> {badge.value}
        </span>
      ))}
    </section>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="case-card case-reveal rounded-2xl p-6 md:p-7">
      <SectionTitle title={title} />
      <ul className="mt-3 max-w-[70ch] list-disc space-y-2 pl-5 text-[0.98rem] leading-7 text-foreground/92">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export function ProjectCaseStudySections({ study }: ProjectCaseStudySectionsProps) {
  return (
    <section className="mt-12 space-y-7">
      <article className="case-card case-reveal rounded-2xl p-6 md:p-7">
        <SectionTitle title="Overview" />
        <p className="mt-3 max-w-[70ch] text-[1.03rem] leading-8 text-foreground/95">{study.overview}</p>
      </article>

      <article className="case-card case-reveal rounded-2xl p-6 md:p-7">
        <SectionTitle title="Problem" />
        <p className="mt-3 max-w-[70ch] text-[1.01rem] leading-8 text-foreground/93">{study.problem}</p>
      </article>

      <BulletSection title="Constraints" items={study.constraints} />
      <BulletSection title="What I Built" items={study.whatIBuilt} />
      <BulletSection title="Engineering Decisions" items={study.engineeringDecisions} />
      <BulletSection title="Tradeoffs" items={study.tradeoffs} />

      <article className="case-card case-reveal rounded-2xl p-6 md:p-7">
        <SectionTitle title="Architecture Flow" />
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {study.architectureFlow.map((node, index) => (
            <div key={node} className="relative rounded-xl border border-foreground/15 bg-black/20 px-4 py-3 text-sm text-foreground/90">
              <span className="text-xs uppercase tracking-wide text-foreground/55">{`Step ${index + 1}`}</span>
              <p className="mt-1">{node}</p>
              {index < study.architectureFlow.length - 1 ? (
                <span className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-foreground/40 md:block">→</span>
              ) : null}
            </div>
          ))}
        </div>
      </article>

      <article className="case-card case-reveal rounded-2xl p-6 md:p-7">
        <SectionTitle title="Highlights" />
        <ul className="mt-3 max-w-[70ch] list-disc space-y-2 pl-5 text-[0.98rem] leading-7 text-foreground/92">
          {study.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <article className="case-card case-reveal rounded-2xl p-6 md:p-7">
        <SectionTitle title="Tech Stack" />
        <div className="mt-3 flex flex-wrap gap-2">
          {study.techStack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-foreground/20 bg-foreground/10 px-3 py-1 text-xs font-medium tracking-wide text-foreground/95"
            >
              {item}
            </span>
          ))}
        </div>
      </article>

      <article className="case-card case-reveal rounded-2xl p-6 md:p-7">
        <SectionTitle title="Technical Notes" />
        <div className="mt-3 space-y-3">
          {study.technicalNotes.map((note) => (
            <details key={note.title} className="group rounded-xl border border-foreground/15 bg-black/20">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-foreground/95 marker:content-none">
                <span className="inline-flex items-center gap-2">
                  <span className="text-foreground/70 transition-transform group-open:rotate-90">{">"}</span>
                  {note.title}
                </span>
              </summary>
              <ul className="max-w-[70ch] list-disc space-y-2 px-8 pb-4 text-sm leading-7 text-foreground/90">
                {note.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </article>

      <BulletSection title="Outcomes" items={study.outcomes} />
    </section>
  );
}

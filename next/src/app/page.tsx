import Link from "next/link";

import { AppsSection } from "@/components/AppsSection";
import { ContactForm } from "@/components/ContactForm";
import { projects } from "@/content/projects";

const CONTACT_TO = "12134189a@gmail.com";
const CONTACT_FORM_ACTION = process.env.NEXT_PUBLIC_CONTACT_FORM_ACTION ?? "https://example.com/form";

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const apps = projects.filter(
    (p) => p.type === "application" && p.slug !== "clientops-hub" && p.slug !== "taskflow-pro",
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3">
          <a className="font-mono text-sm tracking-wide" href="#home">
            Siggmond
          </a>
          <nav className="flex items-center gap-2 font-mono text-xs tracking-wide">
            <a className="rounded-md px-3 py-2 hover:bg-foreground/[0.04]" href="#projects">
              Projects
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-foreground/[0.04]" href="#apps">
              Apps
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-foreground/[0.04]" href="#about">
              About
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-foreground/[0.04]" href="#contact">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6">
        <section id="home" className="py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <div>
                <p className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Siggmond</p>
                <p className="mt-1 text-xs text-muted-foreground/80 font-mono">by Ahmad Saad</p>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                Senior systems &amp; platform engineer building products, platforms, and DevTools that make teams faster and systems safer.
              </h1>
              <div className="space-y-2 text-lg text-muted-foreground">
                <p>
                  I ship inspectable, production-ready systems with clear contracts, strong observability, and product-grade UX.
                </p>
                <p>Focused on apps &amp; websites, DevTools, platform surfaces, and reliability-first architecture.</p>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Applications &amp; websites: full-stack products with real users</li>
                <li>DevTools &amp; automation: CLIs, workflows, feedback loops, internal platforms</li>
                <li>Reliability by design: invariants, failure modes, recovery paths, idempotency</li>
                <li>Operational reality: observability, safe rollouts, debugging ergonomics</li>
                <li>Product-grade UX: cohesive UI, accessibility, performance discipline</li>
              </ul>

              <div className="flex flex-wrap gap-2">
                <a
                  className="rounded-lg border border-foreground/20 bg-foreground/[0.05] px-4 py-2 font-mono text-sm hover:border-foreground/30"
                  href="#contact"
                >
                  Contact
                </a>
                <a
                  className="rounded-lg border border-foreground/15 px-4 py-2 font-mono text-sm text-foreground/80 hover:border-foreground/25"
                  href="#flagship"
                >
                  View flagship
                </a>
              </div>
            </div>

            <div className="highlight-card rounded-2xl p-6">
              <div className="space-y-2">
                <div className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Start Here</div>
                <div className="grid gap-3">
                  <Link className="highlight-card rounded-xl p-4" href="/projects/reposcope-ai">
                    <div className="text-xs tracking-widest uppercase text-muted-foreground font-mono">Flagship</div>
                    <div className="mt-1 text-lg font-semibold">RepoScope AI</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Deterministic repository intelligence with artifact-first onboarding.
                    </div>
                  </Link>
                  <a className="highlight-card rounded-xl p-4" href="#principles">
                    <div className="text-xs tracking-widest uppercase text-muted-foreground font-mono">How I build</div>
                    <div className="mt-1 text-lg font-semibold">Engineering Principles</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Invariants, failure modes, recovery paths, and operability-first tradeoffs.
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="flagship" className="py-14">
          <header className="space-y-3">
            <p className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Flagship</p>
            <h2 className="text-3xl font-semibold tracking-tight">RepoScope AI</h2>
            <p className="text-muted-foreground max-w-2xl">
              Deterministic repository intelligence: artifact-first documentation for fast, trustable onboarding.
            </p>
          </header>
          <div className="highlight-card mt-6 rounded-2xl p-6">
            <p className="text-muted-foreground">
              Start here for the artifacts and entry point, then scan the full portfolio below.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                className="rounded-lg border border-foreground/20 bg-foreground/[0.05] px-4 py-2 font-mono text-sm hover:border-foreground/30"
                href="/projects/reposcope-ai"
              >
                Read case study
              </Link>
              <Link
                className="rounded-lg border border-foreground/15 px-4 py-2 font-mono text-sm text-foreground/80 hover:border-foreground/25"
                href="/projects"
              >
                Browse all projects
              </Link>
            </div>
          </div>
        </section>

        <section id="case-studies" className="py-14">
          <header className="space-y-3">
            <p className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Featured</p>
            <h2 className="text-3xl font-semibold tracking-tight">Case Studies</h2>
            <p className="text-muted-foreground max-w-2xl">
              Three projects that best represent my platform/devtools focus and decision-making under real constraints.
            </p>
          </header>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featured.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="highlight-card rounded-xl p-5"
              >
                <div className="text-lg font-semibold">{p.title}</div>
                <div className="mt-2 text-sm text-muted-foreground">{p.summary}</div>
              </Link>
            ))}
          </div>
        </section>

        <section id="projects" className="py-14">
          <header className="space-y-3">
            <p className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Portfolio</p>
            <h2 className="text-3xl font-semibold tracking-tight">Projects</h2>
            <p className="text-muted-foreground max-w-2xl">
              DevTools, platform surfaces, systems work, and AI tooling — organized for fast scanning.
            </p>
          </header>

          <div className="mt-8">
            <Link className="underline text-foreground/80" href="/projects">
              Open full projects index
            </Link>
          </div>
        </section>

        <AppsSection apps={apps} />

        <section id="principles" className="py-14">
          <header className="space-y-3">
            <p className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Engineering Principles</p>
            <h2 className="text-3xl font-semibold tracking-tight">Engineering Principles</h2>
            <p className="text-muted-foreground max-w-2xl">For architectural depth, start with SyncBridge.</p>
          </header>
          <div className="highlight-card mt-6 rounded-2xl p-6">
            <ul className="space-y-2 text-muted-foreground">
              <li>I describe systems in terms of invariants, failure modes, and recovery paths.</li>
              <li>I prefer deterministic boundaries: explicit contracts, validated inputs, and observable state.</li>
              <li>I optimize for operability: retries, cancellation, idempotency, DLQs, and replay when they matter.</li>
              <li>I keep scope sharp: tradeoffs and intentional exclusions are part of the artifact.</li>
            </ul>
          </div>
        </section>

        <section id="about" className="py-14">
          <header className="space-y-3">
            <p className="text-sm tracking-widest uppercase text-muted-foreground font-mono">About</p>
            <h2 className="text-3xl font-semibold tracking-tight">About</h2>
            <p className="text-muted-foreground max-w-2xl">
              Systems-minded engineer focused on clarity, correctness, and operational reality.
            </p>
          </header>
          <div className="highlight-card mt-6 rounded-2xl p-6">
            <ul className="space-y-2 text-muted-foreground">
              <li>Build developer tools and backend systems with explicit contracts and inspectable state.</li>
              <li>Bias toward deterministic boundaries, clear failure modes, and recovery paths.</li>
            </ul>
          </div>
        </section>

        <section id="contact" className="py-14">
          <header className="space-y-3">
            <p className="text-sm tracking-widest uppercase text-muted-foreground font-mono">Let’s talk</p>
            <h2 className="text-3xl font-semibold tracking-tight">Contact</h2>
            <p className="text-muted-foreground max-w-2xl">
              Recruiting, collaboration, or platform/devtools roles—send a message and I’ll reply within 24–48 hours.
            </p>
          </header>

          <ContactForm toEmail={CONTACT_TO} formAction={CONTACT_FORM_ACTION} />
        </section>

        <footer className="py-10 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Siggmond. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

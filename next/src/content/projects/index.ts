export type ProjectKey =
  | "reposcope-ai"
  | "issue-assistant"
  | "voiceforge-ai"
  | "collab-engine"
  | "syncbridge"
  | "clientops-hub"
  | "taskflow-pro";

export type ProjectLinks = {
  github?: string;
  pypi?: string;
  docs?: string;
  demo?: string;
};

export type Screenshot = {
  src: string;
  caption?: string;
};

export type ProjectEntry = {
  slug: ProjectKey;
  title: string;
  subtitle?: string;
  year?: string;
  tier?: "flagship" | "featured" | "standard" | "archive";
  type?: string;
  summary: string;
  tags: string[];
  domains?: string[];
  featured: boolean;

  hasMdx?: boolean;

  stack?: string;
  stackBadges?: string[];

  classification?: string;
  categories?: string[];

  links?: ProjectLinks;

  status?: string;
  determinism?: string;

  why?: string;
  problem?: string;
  tradeoffs?: string;
  excludes?: string;
  matters?: string;
  proves?: string;

  differentiators?: string[];
  decisions?: string[];
  failureModes?: string[];
  whyNot?: string[];
  omit?: string[];

  architecture?: string;

  thumbnail?: string;
  screenshots?: Screenshot[];

  caseStudyFile?: string;
};

export const projects: ProjectEntry[] = [
  {
    slug: "reposcope-ai",
    title: "RepoScope AI",
    subtitle: "Deterministic Repository Intelligence",
    year: "2025",
    tier: "flagship",
    type: "tool",
    summary:
      "CLI + GitHub Action that audits repositories and generates actionable documentation to help developers understand any codebase in minutes.",
    tags: ["python", "cli", "github-actions", "open-source", "deterministic", "documentation"],
    domains: ["developer-experience", "open-source", "platform"],
    featured: true,
    stackBadges: ["Python", "CLI", "GitHub Actions", "Open Source"],
    classification: "Developer Tooling / Open Source Infrastructure",
    categories: ["open-source", "tooling"],
    links: {
      github: "https://github.com/Siggmond/reposcope-ai",
      pypi: "https://pypi.org/project/reposcope-ai/",
    },
    determinism: "deterministic",
    status: "actively-maintained",
    why:
      "Deterministic repository-understanding engine delivered as a CLI tool and GitHub Action, producing versionable Markdown + JSON artifacts that compress onboarding into minutes.",
    problem:
      "When you open a repo for the first time, the hard part is not reading code — it’s finding entry points, understanding structure, and identifying structural risks without guessing.",
    tradeoffs:
      "RepoScope favors trust and inspectability: deterministic outputs by default, explicit limits on static analysis, and opt-in heuristics labeled as such.",
    excludes:
      "Not a linter, security scanner, quality scoring engine, runtime analyzer, or replacement for code review. RepoScope sits before all of those.",
    matters:
      "Compresses codebase understanding into a small set of readable artifacts: where to start, what to avoid, and which structural risks exist — safe to commit and safe to run in CI.",
    proves:
      "Architect and ship trust-first developer tooling: deterministic analysis, human-first outputs, GitHub-native integration, and explicit constraints.",
    differentiators: [
      "Deterministic by default (same input → same output) with opt-in heuristics clearly labeled.",
      "Human-first output artifacts: SUMMARY.md, ARCHITECTURE.md, RISKS.md, ONBOARDING.md (+ JSON).",
      "Decision support, not judgement: no scoring, no shaming — just explicit signals with limits.",
      "GitHub Action integration suitable for PR workflows and artifact publishing.",
      "PR impact analysis via diff-aware analysis surfaces risk intersections before review starts.",
    ],
    architecture: `
reposcope analyze .
→ Structure snapshot
→ Deterministic risk signals (labeled + bounded)
→ Where-to-start guidance + first-hour checklist
→ Outputs to .reposcope/ (Markdown + JSON)
→ Optional GitHub Action: PR run → artifacts upload → trust-safe comment
    `,
    thumbnail: "/projects/reposcope-ai/01-summary.png",
    screenshots: [{ src: "/projects/reposcope-ai/01-summary.png" }],
    hasMdx: true,
  },
  {
    slug: "issue-assistant",
    title: "Issue Assistant",
    year: "2026",
    tier: "standard",
    type: "tool",
    summary: "Deterministic-first GitHub issue triage engine.",
    tags: ["python", "cli", "github-actions", "devtools", "deterministic", "automation"],
    domains: ["developer-experience", "open-source", "platform"],
    featured: false,
    stack: "Python 3.10+ · CLI · GitHub Actions · PyPI",
    stackBadges: ["Python", "CLI", "GitHub Actions", "PyPI"],
    classification: "DevTools / GitHub Automation",
    categories: ["open-source", "tooling"],
    links: {
      github: "https://github.com/Siggmond/issue-assistant",
      pypi: "https://pypi.org/project/issue-assistant/",
    },
    determinism: "deterministic",
    status: "actively-maintained",
    why:
      "Deterministic-first issue triage that produces maintainer-facing artifacts (summary, maintainer load, explainability) instead of opaque suggestions.",
    problem:
      "Maintainers need consistent triage outputs (summaries, routing cues, workload signals) that can be reviewed and versioned; probabilistic phrasing and inconsistent decisions increase review burden.",
    tradeoffs:
      "Issue Assistant favors explicit rules and inspectable evidence over probabilistic language; this can be stricter and may require more configuration, but it preserves trust and repeatability.",
    excludes:
      "Not a replacement for human triage or project policy. It does not invent issue facts, does not guess intent, and does not make probabilistic claims.",
    differentiators: [
      "Deterministic-first design: explicit rules, thresholds, and evidence fields.",
      "Maintainer artifacts as outputs: ISSUE_SUMMARY.md, MAINTAINER_LOAD.md, and explainability JSON.",
      "Runs as both a Python package (CLI) and a GitHub Action (issue events + scheduled digests).",
      "Phased pipeline with test coverage per phase to keep changes reviewable.",
    ],
    decisions: [
      "Represent triage as deterministic phases with explicit inputs/outputs.",
      "Emit versionable artifacts instead of ephemeral comments.",
      "Use schema-like JSON for explainability and enforce banned probabilistic terms.",
      "Package as a CLI entrypoint and as a composite GitHub Action installing from PyPI.",
    ],
    failureModes: [
      "Missing repo context (labels, CODEOWNERS, templates) leading to reduced routing detail",
      "GitHub API rate limits / transient failures during metadata fetch",
      "Invalid issue templates or missing required fields",
      "Workflow permission constraints in restricted repos",
    ],
    hasMdx: true,
    thumbnail: "/projects/issue-assistant/issue-summary.png",
    screenshots: [
      { src: "/projects/issue-assistant/cli-help.png" },
      { src: "/projects/issue-assistant/issue-summary.png" },
      { src: "/projects/issue-assistant/maintainer-load.png" },
      { src: "/projects/issue-assistant/explainability.png" },
    ],
  },
  {
    slug: "voiceforge-ai",
    title: "VoiceForge AI",
    year: "2025",
    tier: "featured",
    type: "service",
    summary: "A schema-first real-time audio→JSON pipeline that stays usable under latency, noise, and invalid model output.",
    tags: ["python", "fastapi", "websockets", "stt", "llm", "streaming"],
    domains: ["ai-systems", "developer-experience"],
    featured: true,
    stack: "FastAPI · WebSockets · STT · LLMs",
    determinism: "probabilistic",
    status: "experimental",
    links: {
      github: "https://github.com/Siggmond/voiceforg-ai",
    },
    matters: "A schema-first real-time audio→JSON pipeline that stays usable under latency, noise, and invalid model output.",
    proves: "Build streaming AI systems with deterministic validation, bounded retries, and failure-aware protocols.",
    why: "Built to turn live microphone audio into structured, schema-validated intelligence under low-latency streaming constraints.",
    problem:
      "Real-time speech understanding: converting raw audio into usable outputs (clean transcript + structured JSON) while handling noisy input, variable audio formats, and unreliable LLM responses.",
    tradeoffs:
      "A strict schema-first pipeline reduces downstream uncertainty but can reject partially-correct model outputs; this build favors correctness over recall under ambiguous audio.",
    excludes: "Intentionally excludes speaker diarization, long-form batching, and production-grade model hosting concerns.",
    failureModes: [
      "Partial / malformed audio frames and sample-rate mismatches",
      "STT latency spikes, timeouts, and degraded accuracy under noise",
      "LLM invalid JSON / schema violations",
      "Transient network disconnects in WebSocket sessions",
      "Backpressure and buffering when clients outpace processing",
    ],
    decisions: [
      "WebSocket streaming with micro-batched PCM to balance latency and request overhead.",
      "Single normalized audio format to make VAD/STT deterministic.",
      "VAD before STT to reduce cost and silence hallucination.",
      "Schema-first LLM integration with strict Pydantic validation.",
      "Bounded retries and shared async clients for production stability.",
    ],
    differentiators: [
      "Explicit streaming protocol (binary PCM + flush events).",
      "Clear separation between deterministic systems code and probabilistic AI components.",
      "Defensive handling of partial failures without tearing down sessions.",
    ],
    hasMdx: true,
    thumbnail: "/projects/voiceforge-ai/01-swagger-home.png",
    screenshots: [
      { src: "/projects/voiceforge-ai/01-swagger-home.png" },
      { src: "/projects/voiceforge-ai/02-openapi-endpoints-list.png" },
      { src: "/projects/voiceforge-ai/03-analyze-request.png" },
      { src: "/projects/voiceforge-ai/04-analyze-response.png" },
      { src: "/projects/voiceforge-ai/05-transcribe-upload-form.png" },
      { src: "/projects/voiceforge-ai/06-transcribe-response.png" },
      { src: "/projects/voiceforge-ai/07-terminal-startup-logs.png" },
    ],
  },
  {
    slug: "collab-engine",
    title: "Collab Engine",
    year: "2024",
    tier: "featured",
    type: "service",
    summary: "A reference-grade collaborative editing core that converges under reorder/duplication and supports replay-based recovery.",
    tags: ["python", "fastapi", "websockets", "crdt", "realtime", "protocols"],
    domains: ["distributed-systems", "platform"],
    featured: true,
    stack: "FastAPI · WebSockets · CRDT",
    determinism: "eventually consistent",
    status: "reference",
    links: {
      github: "https://github.com/Siggmond/collab-engine",
    },
    matters:
      "A reference-grade collaborative editing core that converges under reorder/duplication and supports replay-based recovery.",
    proves: "Design real-time protocols with explicit invariants, convergence guarantees, and recovery paths.",
    why: "Built to solve real-time multi-client text editing under constraint out-of-order and concurrent operation delivery.",
    problem:
      "Authoritative server-side collaborative text editing where concurrent inserts/deletes must converge despite delayed, reordered, or duplicated operations. Naïve index-based approaches break under concurrency and lead to divergent replicas.",
    tradeoffs:
      "CRDT-based correctness adds state and protocol complexity compared to naïve index edits; this build prioritizes convergence and replayability over minimal payload size.",
    excludes:
      "Intentionally excludes auth, multi-document ACLs, and production persistence backends (persistence is abstracted but not fully implemented).",
    failureModes: [
      "Out-of-order, duplicated, or dropped operations",
      "Reconnect / resync after client disconnect",
      "Concurrent edits referencing unknown parents",
      "Partial broadcast failures and divergent client state",
      "Server crash mid-session (replay / resync paths)",
    ],
    whyNot: [
      "Why not OT? OT correctness is subtle under arbitrary reorder/duplication; CRDT invariants are easier to make explicit and test for convergence.",
      "Why not P2P? A server simplifies authorization, replay, and operational control; this is a reference build for deterministic recovery paths.",
    ],
    decisions: [
      "Use a sequence CRDT (RGA-style) to guarantee convergence under concurrent edits.",
      "Represent elements with stable identities (lamport clock + replica id) instead of positional indexes.",
      "Use insert-after semantics with explicit parent_id to avoid index-shift errors.",
      "Treat deletes as monotonic tombstones to keep integration commutative and idempotent.",
      "Buffer operations that reference unknown parents or ids until dependencies arrive.",
      "Assign a monotonically increasing server_seq per document for authoritative replay and recovery.",
      "Replay ops on reconnect up to a fixed cap; otherwise force a full snapshot resync.",
      "Serialize per-document mutation via async locks to ensure deterministic sequencing and persistence.",
    ],
    differentiators: [
      "CRDT invariants and deterministic merge rules are explicit and enforced in code.",
      "Clear separation between protocol handling, session management, CRDT logic, and persistence.",
      "Recovery and resync are first-class parts of the protocol, not an afterthought.",
      "Persistence is abstracted, allowing future backends without changing merge logic.",
      "Combines CRDT convergence with an authoritative server sequence for durability and replay.",
    ],
    hasMdx: true,
    thumbnail: "/projects/collab-engine/04-ws-handshake.png",
    screenshots: [
      { src: "/projects/collab-engine/01-server-running.png" },
      { src: "/projects/collab-engine/02-health.png" },
      { src: "/projects/collab-engine/03-swagger.png" },
      { src: "/projects/collab-engine/04-ws-handshake.png" },
      { src: "/projects/collab-engine/05-two-clients.png" },
      { src: "/projects/collab-engine/06-concurrent-inserts.jpeg" },
      { src: "/projects/collab-engine/07-replay.jpeg" },
      { src: "/projects/collab-engine/08-resync.png" },
    ],
  },
  {
    slug: "syncbridge",
    title: "SyncBridge",
    year: "2025",
    tier: "featured",
    type: "service",
    summary:
      "A durable job/worker reference that makes retries, leases, DLQs, and replay inspectable and deterministic.",
    tags: ["python", "fastapi", "sqlalchemy", "jobs", "retries", "deterministic"],
    domains: ["platform", "integration", "distributed-systems"],
    featured: true,
    determinism: "deterministic",
    status: "reference",
    links: {
      github: "https://github.com/Siggmond/sync-bridge",
    },
    matters:
      "A durable job/worker reference that makes retries, leases, DLQs, and replay inspectable and deterministic.",
    proves: "Model long-running integration work with explicit job state, safe recovery, and operational controls.",
    why:
      "Provide a small, readable reference implementation of a database-backed job/worker pattern for system-to-system synchronization, with explicit handling of real failure modes (timeouts, rate limits), durable state, and operational controls (retry, cancel, DLQ, replay).",
    problem:
      "Integration work between external systems is unreliable and long-running. Requests to “sync entity X” must be made durable, protected from duplicate active work, resilient to transient upstream failures, and observable. The system needs deterministic job state, attempt history, and safe recovery when a worker crashes mid-run.",
    tradeoffs:
      "DB-as-queue simplifies deployment and guarantees durability, but it requires careful leasing, indexing, and backoff modeling to avoid thundering herds and hot rows.",
    excludes:
      "Intentionally excludes multi-tenant policy, distributed workers across hosts, and exactly-once semantics across external systems.",
    failureModes: [
      "Upstream timeouts and transient network failures",
      "Rate limits and retry-after enforcement",
      "Worker crash mid-run (lease expiry + safe re-claim)",
      "Duplicate enqueue / concurrent work on same entity",
      "Exhausted retries leading to dead-letter state",
    ],
    whyNot: [
      "Why not a message broker? Brokers are great at scale, but DB-as-queue is a readable reference for durable state transitions without extra infra.",
      "Why not mutate the original job on replay? Preserving immutable attempt history makes post-incident analysis and auditability much safer.",
    ],
    decisions: [
      "Database is the durable queue and source of truth.",
      "Explicit leasing for crash-safe job claiming.",
      "Immutable attempt records per execution.",
      "Typed error classification drives retry behavior.",
      "Exponential backoff persisted via next_run_at.",
      "Dead-letter state after max retries.",
      "Replay creates a new job linked to the original.",
      "Idempotency enforced at enqueue-time.",
      "UTC-normalized timestamps for correctness.",
      "Correlation IDs propagated through execution.",
    ],
    differentiators: [
      "Demonstrates DB-as-queue pattern without external brokers.",
      "Operational controls (retry, cancel, DLQ, replay) are first-class.",
      "Failure behavior is deterministic and persisted.",
      "Small codebase with explicit job lifecycle modeling.",
      "Includes mock upstream systems to exercise failure paths.",
    ],
    thumbnail: "/projects/syncbridge/01-api-docs.png",
    screenshots: [
      { src: "/projects/syncbridge/01-api-docs.png" },
      { src: "/projects/syncbridge/02-enqueue-job-response.png" },
      { src: "/projects/syncbridge/03-ui-job-list.png.jpeg" },
      { src: "/projects/syncbridge/04-ui-job-detail-attempts.png" },
      { src: "/projects/syncbridge/05-retryable-failure-logs.png.jpeg" },
      { src: "/projects/syncbridge/07-dlq-dead-job.png" },
      { src: "/projects/syncbridge/10-replay-creates-new-job.png" },
      { src: "/projects/syncbridge/11-metrics-endpoint.png" },
    ],
    hasMdx: true,
  },
  {
    slug: "clientops-hub",
    title: "ClientOps Hub",
    year: "2025",
    tier: "standard",
    type: "application",
    summary: "An ops workspace that treats RBAC and auditability as first-class constraints, not UI polish.",
    tags: ["python", "fastapi", "sqlalchemy", "vue", "jwt", "rbac"],
    domains: ["full-stack", "internal-tools"],
    featured: false,
    stack: "FastAPI · SQLAlchemy · SQLite · Vue 3 · Vite · JWT",
    determinism: "deterministic",
    status: "demo",
    links: {
      github: "https://github.com/Siggmond/client-ops-hub",
    },
    matters: "An ops workspace that treats RBAC and auditability as first-class constraints, not UI polish.",
    proves: "Build internal tools with explicit authorization boundaries and an auditable write history.",
    why:
      "Provide a lightweight internal workspace to manage clients, leads, and invoices with server-enforced access control and an auditable history of write actions, without adopting a full CRM stack.",
    problem:
      "Small teams often need a single operational view of client relationships, lead pipeline state, and billing lifecycle, plus accountability over changes. Spreadsheets or ad-hoc tools lack consistent authorization, soft-delete safety, and a unified audit trail.",
    tradeoffs:
      "A single-DB, two-app architecture keeps the system inspectable and easy to run locally, but it does not target multi-tenant scaling or external identity integrations.",
    excludes:
      "Intentionally excludes multi-tenant SaaS concerns, SSO/IdP integrations, and production hardening beyond a reference implementation.",
    failureModes: [
      "Auth token expiry and unauthorized access attempts",
      "Race conditions on concurrent edits (server-side enforcement)",
      "Soft-delete semantics and accidental destructive actions",
      "Audit log integrity under partial failures",
      "Client-side state drift vs server source of truth",
    ],
    decisions: [
      "Split backend (FastAPI) and frontend (Vue 3) into separate apps.",
      "Use SQLite + SQLAlchemy for local persistence.",
      "JWT bearer authentication with role-based authorization enforced server-side.",
      "Soft-delete semantics with admin-only archive/restore.",
      "Persist audit logs for all write operations.",
      "Compute dashboard metrics client-side from list endpoints.",
      "Auto-create tables and seed default accounts on empty database startup.",
    ],
    differentiators: [
      "First-class persisted audit log with actor role and timestamps.",
      "Consistent soft-delete semantics across all domain entities.",
      "Authorization enforced at the API layer, not just UI gating.",
      "Focused operational scope with clear domain boundaries.",
    ],
    omit: [
      "Do not claim enterprise CRM completeness.",
      "Do not claim multi-tenant, SSO, or external identity providers.",
      "Do not claim production-grade security posture.",
      "Do not claim advanced analytics or reporting services.",
      "Do not claim integrations or background job processing.",
    ],
    hasMdx: true,
    thumbnail: "/projects/clientops-hub/02-dashboard.png",
    screenshots: [
      { src: "/projects/clientops-hub/01-login.png" },
      { src: "/projects/clientops-hub/02-dashboard.png" },
      { src: "/projects/clientops-hub/03-clients-list-search-pagination.png" },
      { src: "/projects/clientops-hub/04-client-create-form.png" },
      { src: "/projects/clientops-hub/05-client-archived-state.png" },
      { src: "/projects/clientops-hub/06-leads-pipeline.png" },
      { src: "/projects/clientops-hub/07-lead-status-change.png" },
      { src: "/projects/clientops-hub/08-invoices-table.png" },
      { src: "/projects/clientops-hub/09-invoice-create-form.png" },
      { src: "/projects/clientops-hub/10-audit-log.png" },
      { src: "/projects/clientops-hub/11-rbac-staff-view.png" },
    ],
  },
  {
    slug: "taskflow-pro",
    title: "TaskFlow Pro",
    year: "2025",
    tier: "standard",
    type: "application",
    summary:
      "A frontend reference that exercises typed boundaries, RBAC, and failure handling without needing a server to run.",
    tags: ["vue", "typescript", "vite", "pinia", "rbac"],
    domains: ["full-stack"],
    featured: false,
    stack: "Vue 3 · TypeScript · Vite · Pinia · Vue Router · Axios",
    determinism: "deterministic",
    status: "demo",
    links: {
      github: "https://github.com/Siggmond/taskflow-pro",
    },
    matters:
      "A frontend reference that exercises typed boundaries, RBAC, and failure handling without needing a server to run.",
    proves: "Ship a production-style frontend architecture with typed contracts, RBAC, and resilient UX failure paths.",
    why:
      "Build a portable, frontend-only project management app that exercises production-style frontend architecture patterns (typed API boundary, feature modules, global error handling, RBAC) without requiring a real backend to run.",
    problem:
      "Teams need a lightweight way to organize work into projects and track tasks moving through a workflow, while still modeling real product constraints like authenticated access, role-based permissions, and an audit trail of changes.",
    tradeoffs:
      "A localStorage-backed mock backend preserves realistic HTTP semantics but cannot model true concurrency or server-enforced invariants; it optimizes for portability and architectural clarity.",
    excludes: "Intentionally excludes a real backend, multi-user concurrency, and long-term data governance concerns.",
    failureModes: [
      "localStorage quota / corruption",
      "401/403 auth failures and role gating errors",
      "Retryable request failures surfaced through normalized errors",
      "Optimistic UI updates requiring rollback",
      "State hydration mismatches on refresh",
    ],
    decisions: [
      "Feature-first module layout (src/modules/*) to keep domain boundaries clear.",
      "Strict store/service split so side effects live behind a typed boundary.",
      "Centralized Axios client for consistent retries and error normalization.",
      "RBAC enforced in both UI and store layers to prevent accidental privilege escalation.",
      "Mock REST API implemented as an Axios adapter to preserve real HTTP semantics.",
      "localStorage-backed persistence to enable realistic CRUD flows without server infra.",
      "Optimistic task movement with rollback on failure for correct UX modeling.",
      "Activity log modeled as explicit domain events emitted by the mock API.",
    ],
    differentiators: [
      "Persistent mock backend supporting auth, RBAC, and CRUD without a real server.",
      "Authoritative permission checks in the state layer, not just UI gating.",
      "Resilient failure behavior with retries, normalized errors, and global surfacing.",
      "Typed domain contracts and a consistent REST-like API surface.",
      "Audit-style activity feed tied to domain mutations.",
    ],
    hasMdx: true,
    thumbnail: "/projects/taskflow-pro/03-dashboard-shell.png",
    screenshots: [
      { src: "/projects/taskflow-pro/01-login-light.png" },
      { src: "/projects/taskflow-pro/03-dashboard-shell.png" },
      { src: "/projects/taskflow-pro/04-projects-list-filters.png" },
      { src: "/projects/taskflow-pro/05-create-project-modal.png" },
      { src: "/projects/taskflow-pro/06-project-overview.png" },
      { src: "/projects/taskflow-pro/07-kanban-board.png" },
      { src: "/projects/taskflow-pro/08-kanban-task-details.png" },
      { src: "/projects/taskflow-pro/09-activity-log.png" },
      { src: "/projects/taskflow-pro/10-admin-users-directory.png" },
      { src: "/projects/taskflow-pro/11-rbac-member-view.png" },
    ],
  },
];

export function getProject(slug: string): ProjectEntry | null {
  return projects.find((p) => p.slug === slug) ?? null;
}

export type ProjectKey =
  | "reposcope-ai"
  | "issue-assistant"
  | "voiceforge-ai"
  | "collab-engine"
  | "syncbridge"
  | "clientops-hub"
  | "taskflow-pro"
  | "nova-commerce"
  | "stock-pilot"
  | "gen-zero";

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
  posterSrc?: string;
  previewVideoSrc?: string;
  fullVideoSources?: {
    low: string;
    med: string;
    high: string;
  };

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
  {
    slug: "nova-commerce",
    title: "NovaCommerce",
    subtitle: "Flutter E-commerce App (Firebase + AI)",
    year: "2026",
    tier: "standard",
    type: "application",
    summary:
      "Production-style Flutter e-commerce app with Firebase backend, full shopping flows, transactional checkout, and AI-assisted UX.",
    tags: ["flutter", "dart", "riverpod", "go-router", "firebase", "tflite"],
    domains: ["mobile", "full-stack", "ai-systems"],
    featured: false,
    stack:
      "Flutter, Dart, Riverpod, GoRouter, Firebase Auth, Firestore, Cloud Functions, Stripe, SharedPreferences, TFLite",
    determinism: "deterministic checkout",
    status: "production-style",
    why:
      "Build a production-style mobile commerce experience with robust architecture boundaries and realistic backend integrations.",
    problem:
      "E-commerce apps need fast, reliable UX and correct stock behavior during checkout, while preserving local state across sign-in and intermittent connectivity.",
    tradeoffs:
      "A local-first experience improves responsiveness, but it introduces sync/reconciliation complexity across devices and authentication transitions.",
    excludes:
      "This portfolio build does not claim full marketplace scope, ERP integrations, or multi-region production operations.",
    proves:
      "Deliver end-to-end mobile product architecture with transactional consistency, modular state/routing, and CI-enforced quality.",
    differentiators: [
      "Firestore transactional checkout validates and decrements variant stock atomically before creating orders.",
      "Hybrid local-first persistence for cart, wishlist, recent searches/viewed with authenticated sync.",
      "Payment abstraction supports Stripe (Cloud Functions + Payment Sheet), plus PayPal/demo/fake providers.",
      "On-device TFLite intent model powers smart navigation suggestions.",
      "CI pipeline runs formatting, static analysis, tests (including golden tests), and release APK build.",
    ],
    decisions: [
      "Use feature-first clean architecture (presentation/domain/data) with Riverpod.",
      "Use go_router with tabbed shell navigation and nested routes for advanced flows.",
      "Protect checkout with Firestore transactions to prevent overselling.",
      "Persist key shopping state locally, then sync when authenticated.",
      "Keep payment providers behind a common interface for portability.",
      "Cover viewmodels/widgets/routing/mapping/AI logic with automated tests.",
    ],
    failureModes: [
      "Concurrent checkout against low stock variants.",
      "Network loss during payment confirmation and order placement.",
      "State divergence after auth transitions with pending local changes.",
      "Provider-specific payment errors and delayed confirmation callbacks.",
      "Model intent misclassification in on-device navigation suggestions.",
    ],
    thumbnail: "/projects/novacommerce/home-page-1.png",
    posterSrc: "/projects/novacommerce/demo-videos/poster.jpg",
    previewVideoSrc: "/projects/novacommerce/demo-videos/preview.webm",
    fullVideoSources: {
      low: "https://github.com/Siggmond/siggmond.github.io/releases/download/v1.0/vd1_low.webm",
      med: "https://github.com/Siggmond/siggmond.github.io/releases/download/v1.0/vd1_med.webm",
      high: "https://github.com/Siggmond/siggmond.github.io/releases/download/v1.0/vd1.webm",
    },
    screenshots: [
      { src: "/projects/novacommerce/sign-in-page.png", caption: "Sign In" },
      { src: "/projects/novacommerce/home-page-1.png", caption: "Home" },
      { src: "/projects/novacommerce/home-page-2.png", caption: "Home Feed" },
      { src: "/projects/novacommerce/home-page-3.png", caption: "Home Categories" },
      { src: "/projects/novacommerce/home-page-4.png", caption: "Home Highlights" },
      { src: "/projects/novacommerce/home-page-5.png", caption: "Home Recommendations" },
      { src: "/projects/novacommerce/search-tab-page.png", caption: "Search" },
      { src: "/projects/novacommerce/search-tab-page-2.png", caption: "Search Results" },
      { src: "/projects/novacommerce/item-detials-page.png", caption: "Item Details" },
      { src: "/projects/novacommerce/offers-tab-page.png", caption: "Offers Tab" },
      { src: "/projects/novacommerce/offers-details-page.png", caption: "Offer Details" },
      { src: "/projects/novacommerce/gold-repositry-page.png", caption: "Gold Repository" },
      { src: "/projects/novacommerce/cart-empty-page.png", caption: "Cart Empty State" },
      { src: "/projects/novacommerce/location-menu.png", caption: "Location Menu" },
      { src: "/projects/novacommerce/out-of-stock-item.png", caption: "Out of Stock State" },
      { src: "/projects/novacommerce/account-tab-page.png", caption: "Account Tab (Main)" },
      { src: "/projects/novacommerce/account-tab-page-2.png", caption: "Account Tab (More)" },
      { src: "/projects/novacommerce/concierge-tab-page.png", caption: "Concierge Tab" },
      { src: "/projects/novacommerce/arabic-language.png", caption: "Arabic Locale" },
      { src: "/projects/novacommerce/francias-langauge.png", caption: "French Locale" },
    ],
    hasMdx: true,
  },
  {
    slug: "stock-pilot",
    title: "StockPilot",
    subtitle: "Flutter Inventory + Demand Forecasting App",
    year: "2026",
    tier: "standard",
    type: "application",
    summary:
      "Flutter inventory and demand forecasting app for tracking products, logging daily sales, estimating stockout risk, and suggesting reorder quantities.",
    tags: [
      "flutter",
      "dart",
      "riverpod",
      "go-router",
      "hive",
      "fl-chart",
      "inventory",
      "forecasting",
      "offline-first",
    ],
    domains: ["mobile", "operations", "product-analytics"],
    featured: false,
    stack:
      "Flutter (Material 3), Dart, Riverpod, go_router, Hive, fl_chart, flutter_screenutil, google_fonts",
    determinism: "deterministic forecasting (7-day moving average)",
    status: "v1.0.0+1",
    why:
      "Built for operators who need fast daily inventory decisions without spreadsheet overhead or opaque predictions.",
    problem:
      "Small inventory teams need a simple, phone-first workflow to track stock, record sales, and act before stockouts happen.",
    tradeoffs:
      "StockPilot favors deterministic and explainable forecasting over black-box ML, improving trust and predictability while limiting model complexity.",
    proves:
      "A production-style Flutter app can combine clean architecture, deterministic forecasting logic, and resilient offline-first local data flows.",
    differentiators: [
      "Three-step onboarding plus quick navigator entry to core modules.",
      "Dashboard blends KPI summaries, stock risk filtering, action queue, and quick-add sales in one flow.",
      "Alerts pipeline classifies states into critical, warning, and opportunity with explicit prioritization.",
      "Sales workflow supports per-product today upsert and two-week history from the same screen.",
      "Adaptive performance engine downgrades expensive effects when frame pressure is detected.",
    ],
    decisions: [
      "Use a feature-first, layered split: presentation, application, domain, and data.",
      "Wire dependency injection through Riverpod repository providers with bootstrap overrides in main.dart.",
      "Use Hive boxes for products, daily sales, and settings with explicit adapters for stable local persistence.",
      "Normalize dates to UTC day-level for deterministic day-based aggregation and forecasting.",
      "Use go_router with StatefulShellRoute for tab routing and explicit module paths.",
      "Implement forecasting with a 7-day moving average and reorder quantity clamp at zero.",
    ],
    failureModes: [
      "Sparse or zero demand history can reduce forecast confidence and produce conservative reorder behavior.",
      "Incorrect lead-time or safety-stock values can shift reorder suggestions away from real-world needs.",
      "Data-entry mistakes in daily sales can skew near-term stockout date calculations.",
      "High rendering load can degrade animation quality without adaptive performance controls.",
      "Onboarding seen-state is currently written but not used for initial route gating.",
    ],
    architecture: `
Presentation
- Onboarding, dashboard, alerts, products, sales, and settings pages.
- UI remains focused on rendering and interaction.

Application
- Controllers, validation, and orchestration logic.
- Alert parsing and prioritization.

Domain
- Product and DailySale models.
- Repository interfaces and forecast contracts.

Data
- Hive repositories and adapters.
- Boxes: products, daily_sales, settings.
    `,
    thumbnail: "/projects/stock-pilot/dashboard-1.png",
    posterSrc: "/projects/stock-pilot/demo-videos/poster.jpg",
    previewVideoSrc: "/projects/stock-pilot/demo-videos/preview.webm",
    fullVideoSources: {
      low: "https://github.com/Siggmond/siggmond.github.io/releases/download/v1.0/vd3_low.webm",
      med: "https://github.com/Siggmond/siggmond.github.io/releases/download/v1.0/vd3_med.webm",
      high: "https://github.com/Siggmond/siggmond.github.io/releases/download/v1.0/vd3.webm",
    },
    screenshots: [
      { src: "/projects/stock-pilot/welcome-1.png", caption: "Onboarding Step 1" },
      { src: "/projects/stock-pilot/welcome-2.png", caption: "Onboarding Step 2" },
      { src: "/projects/stock-pilot/welcome-3.png", caption: "Onboarding Step 3" },
      { src: "/projects/stock-pilot/quick-actions-page.png", caption: "Quick Navigator" },
      { src: "/projects/stock-pilot/dashboard-1.png", caption: "Dashboard Overview" },
      { src: "/projects/stock-pilot/dashboard-2.png", caption: "Dashboard KPIs" },
      { src: "/projects/stock-pilot/dashboard-3.png", caption: "Dashboard Risk Filters" },
      { src: "/projects/stock-pilot/dashboard-4.png", caption: "Dashboard Action Queue" },
      { src: "/projects/stock-pilot/dashbaord-quick-actions.png", caption: "Dashboard Quick Actions" },
      { src: "/projects/stock-pilot/alerts-page.png", caption: "Alerts Feed" },
      { src: "/projects/stock-pilot/products-page.png", caption: "Products List" },
      { src: "/projects/stock-pilot/add-product-page.png", caption: "Create/Edit Product" },
      { src: "/projects/stock-pilot/edit_product.png", caption: "Edit Product Page" },
      { src: "/projects/stock-pilot/sales-page.png", caption: "Sales Page and History" },
      { src: "/projects/stock-pilot/quick-sale-entry.png", caption: "Quick Add Sale (Today Upsert)" },
      { src: "/projects/stock-pilot/settings-page.png", caption: "Settings and Preferences" },
      { src: "/projects/stock-pilot/settings-page-2.png", caption: "Settings Page 2" },
    ],
  },
  {
    slug: "gen-zero",
    title: "MicroStore Optimizer (gen_zero)",
    subtitle: "Seller-facing commerce intelligence with explainable next-best actions",
    year: "2026",
    tier: "standard",
    type: "application",
    summary:
      "A Flutter app that helps small merchants track KPIs, view sales, and act on deterministic, explainable insights with offline-first local persistence.",
    tags: ["flutter", "dart", "riverpod", "hive", "go-router", "fl-chart", "offline-first", "analytics"],
    domains: ["mobile", "commerce", "product-analytics"],
    featured: false,
    stack: "Flutter (Material 3) · Dart (^3.8.1) · Riverpod · Hive · go_router · fl_chart",
    determinism: "deterministic and explainable",
    status: "v1.0.0+1 (mvp)",
    why:
      "Small merchants need phone-first intelligence that converts raw catalog and sales history into clear, explainable actions they can trust.",
    problem:
      "Small merchants often have product and transaction data, but not the time or tooling to convert it into decisions. They need clear KPIs, actionable recommendations with rationale, and reliable offline-first behavior.",
    tradeoffs:
      "The MVP favors deterministic rule-based explainability over opaque ML scoring, which improves trust and portability while limiting prediction breadth.",
    excludes:
      "Play Store signing is intentionally not configured yet; Android release builds use debug signing so the project runs out of the box for demos.",
    proves:
      "You can ship a portfolio-ready commerce intelligence app with deterministic insight generation, clean architecture boundaries, and robust offline-first persistence.",
    differentiators: [
      "Deterministic insights: every recommendation includes why, impact, and action.",
      "Responsive KPI layout that remains stable on small screens and under large accessibility text.",
      "Idempotent demo seeding that fills missing catalog/sales content even after partial setup.",
      "Offline-first persistence with Hive for fast and predictable MVP behavior.",
    ],
    decisions: [
      "Use a clean architecture-inspired split (domain/data/presentation) to keep business logic testable and reusable.",
      "Keep insight generation inside a deterministic, composable rule engine and out of UI code.",
      "Use manual Hive adapters and repositories that map persistence models to domain entities.",
      "Use Riverpod controllers/providers to isolate state transitions from rendering concerns.",
      "Provide stable per-action success/error feedback in UI to make demos and operations reliable.",
    ],
    failureModes: [
      "Sparse or noisy sales history reducing confidence in recommendation quality.",
      "Inaccurate inventory baselines causing weaker restock and price guidance.",
      "Interrupted user sessions requiring strong local persistence recovery.",
      "Partial demo data setup in existing installs (handled with idempotent seeding).",
    ],
    architecture: `
Domain
- Entities/value objects: Product, Sale, SaleLine, Insight.
- Deterministic, composable rule-based InsightEngine.

Data
- Hive persistence with manual adapters.
- Repositories mapping persistence models to domain entities.

Presentation
- Riverpod controllers/providers.
- UI renders domain outputs; insight logic stays outside UI.
    `,
    thumbnail: "/projects/gen-zero/Home-Feed-4.png",
    posterSrc: "/projects/gen-zero/demo-videos/poster.jpg",
    previewVideoSrc: "/projects/gen-zero/demo-videos/preview.webm",
    fullVideoSources: {
      low: "https://github.com/Siggmond/siggmond.github.io/releases/download/v1.0/vd2_low.webm",
      med: "https://github.com/Siggmond/siggmond.github.io/releases/download/v1.0/vd2_med.webm",
      high: "https://github.com/Siggmond/siggmond.github.io/releases/download/v1.0/vd2.webm",
    },
    screenshots: [
      { src: "/projects/gen-zero/Welcome-screen.png", caption: "Welcome Screen" },
      { src: "/projects/gen-zero/Home-Feed-2.png", caption: "Home Feed 2" },
      { src: "/projects/gen-zero/Home-Feed-3.png", caption: "Home Feed 3" },
      { src: "/projects/gen-zero/Home-Feed-4.png", caption: "Home Feed 4" },
      { src: "/projects/gen-zero/Insights-Tab-Page.png", caption: "Insights Tab" },
      { src: "/projects/gen-zero/Insight-Item-Details.png", caption: "Insight Details" },
      { src: "/projects/gen-zero/Products-Tab.png", caption: "Products Tab" },
      { src: "/projects/gen-zero/Add-New-Product.png", caption: "Add New Product" },
      { src: "/projects/gen-zero/Edit-Product-Details.png", caption: "Edit Product Details" },
      { src: "/projects/gen-zero/Sales-Tab-Page.png", caption: "Sales Tab" },
      { src: "/projects/gen-zero/AI-Tab.png", caption: "AI Tab" },
    ],
    hasMdx: true,
  },
];

export function getProject(slug: string): ProjectEntry | null {
  return projects.find((p) => p.slug === slug) ?? null;
}

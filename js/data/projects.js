export const projects = [
  {
    id: "voiceforge-ai",
    zone: "ai",
    title: "VoiceForge AI",
    year: "2025",
    stack: "FastAPI · WebSockets · STT · LLMs",
    determinism: "probabilistic",
    status: "experimental",
    consistencyModel: "Probabilistic inference with deterministic schema validation.",
    timeDimension: "Restart safety: stateless per-session processing; long-lived streams require reconnect + resume at the app layer.",
    interfaceContract: "Strict JSON schema boundary enforced via Pydantic; invalid model output is rejected or retried.",
    whatBreaksFirst: "Latency/timeout pressure in the STT/LLM chain under noisy or bursty audio.",
    operationalPosture: "limited self-healing",
    dependencyPhilosophy: "Keep probabilistic dependencies isolated; keep the systems boundary deterministic and inspectable.",
    twoWeeks: "Harden retries/timeouts and add adversarial audio + invalid-JSON fixtures to quantify failure rates.",
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
      "Backpressure and buffering when clients outpace processing"
    ],
    architecture: `
Audio Input
→ Decode / Normalize (PCM16 mono 16kHz)
→ VAD segmentation
→ STT inference
→ LLM inference (JSON-only)
→ Pydantic validation
→ REST / WebSocket output
    `,
    decisions: [
      "WebSocket streaming with micro-batched PCM to balance latency and request overhead.",
      "Single normalized audio format to make VAD/STT deterministic.",
      "VAD before STT to reduce cost and silence hallucination.",
      "Schema-first LLM integration with strict Pydantic validation.",
      "Bounded retries and shared async clients for production stability."
    ],
    differentiators: [
      "Explicit streaming protocol (binary PCM + flush events).",
      "Clear separation between deterministic systems code and probabilistic AI components.",
      "Defensive handling of partial failures without tearing down sessions."
    ],
    github: "https://github.com/Siggmond/voiceforg-ai"
  },
  {
    id: "collab-engine",
    zone: "systems",
    title: "Collab Engine",
    year: "2024",
    stack: "FastAPI · WebSockets · CRDT",
    determinism: "eventually consistent",
    status: "reference",
    consistencyModel: "Eventual consistency (CRDT convergence) with an authoritative server sequence for replay.",
    timeDimension: "Long-lived sessions; restart safety depends on replay/resync (persistence is intentionally incomplete here).",
    interfaceContract: "Operations are schema-validated and designed to be commutative/idempotent; server_seq defines replay order.",
    whatBreaksFirst: "State/log growth and edge-case protocol drift under long sessions and reconnect churn.",
    operationalPosture: "operator-driven",
    dependencyPhilosophy: "Prefer explicit invariants and minimal dependencies; correctness is prioritized over payload minimization.",
    primaryRisk: "Subtle CRDT/protocol correctness bugs under reorder/duplication can cause divergence that is hard to detect late.",
    twoWeeks: "Add property-based/fuzz testing for reorder/dup scenarios and wire a simple persistence backend for real replay.",
    matters: "A reference-grade collaborative editing core that converges under reorder/duplication and supports replay-based recovery.",
    proves: "Design real-time protocols with explicit invariants, convergence guarantees, and recovery paths.",
    why: "Built to solve real-time multi-client text editing under constraint out-of-order and concurrent operation delivery.",
    problem:
      "Authoritative server-side collaborative text editing where concurrent inserts/deletes must converge despite delayed, reordered, or duplicated operations. Naïve index-based approaches break under concurrency and lead to divergent replicas.",
    tradeoffs:
      "CRDT-based correctness adds state and protocol complexity compared to naïve index edits; this build prioritizes convergence and replayability over minimal payload size.",
    excludes: "Intentionally excludes auth, multi-document ACLs, and production persistence backends (persistence is abstracted but not fully implemented).",
    failureModes: [
      "Out-of-order, duplicated, or dropped operations",
      "Reconnect / resync after client disconnect",
      "Concurrent edits referencing unknown parents",
      "Partial broadcast failures and divergent client state",
      "Server crash mid-session (replay / resync paths)"
    ],
    whyNot: [
      "Why not OT? OT correctness is subtle under arbitrary reorder/duplication; CRDT invariants are easier to make explicit and test for convergence.",
      "Why not P2P? A server simplifies authorization, replay, and operational control; this is a reference build for deterministic recovery paths."
    ],
    architecture: `
Clients
→ WebSocket protocol (hello / op)
→ Session Manager (rooms + broadcast)
→ Document Service
   - per-document lock
   - authoritative server_seq
   - CRDT integration
→ Persistence (op log + snapshot; Phase 1: in-memory)
→ Server → clients (op echo / resync)
  `,
    decisions: [
      "Use a sequence CRDT (RGA-style) to guarantee convergence under concurrent edits.",
      "Represent elements with stable identities (lamport clock + replica id) instead of positional indexes.",
      "Use insert-after semantics with explicit parent_id to avoid index-shift errors.",
      "Treat deletes as monotonic tombstones to keep integration commutative and idempotent.",
      "Buffer operations that reference unknown parents or ids until dependencies arrive.",
      "Assign a monotonically increasing server_seq per document for authoritative replay and recovery.",
      "Replay ops on reconnect up to a fixed cap; otherwise force a full snapshot resync.",
      "Serialize per-document mutation via async locks to ensure deterministic sequencing and persistence."
    ],
    differentiators: [
      "CRDT invariants and deterministic merge rules are explicit and enforced in code.",
      "Clear separation between protocol handling, session management, CRDT logic, and persistence.",
      "Recovery and resync are first-class parts of the protocol, not an afterthought.",
      "Persistence is abstracted, allowing future backends without changing merge logic.",
      "Combines CRDT convergence with an authoritative server sequence for durability and replay."
    ],
    github: "https://github.com/Siggmond/collab-engine",
    demo: null,
    image: null
  },
  {
    "id": "syncbridge",
    "title": "SyncBridge",
    "zone": "systems",
    "determinism": "deterministic",
    "status": "reference",
    "consistencyModel": "Strong consistency for job state (DB transactions) with at-least-once execution semantics.",
    "timeDimension": "Restart safe: job state + attempts are durable; lease expiry enables safe reclaim after worker crash.",
    "interfaceContract": "Enqueue is idempotency-friendly; state transitions are explicit and persisted; correlation IDs propagate.",
    "whatBreaksFirst": "Hot rows / contention on the jobs table under bursty enqueue + multiple workers.",
    "operationalPosture": "limited self-healing",
    "dependencyPhilosophy": "DB-as-queue to minimize infra; optimize for inspectability over broker features.",
    "primaryRisk": "Lease/claim correctness under concurrency; mistakes cause duplicate work, stuck leases, or silent starvation.",
    "twoWeeks": "Add contention-oriented indexing, clearer operational dashboards, and a minimal multi-worker story across hosts.",
    "matters": "A durable job/worker reference that makes retries, leases, DLQs, and replay inspectable and deterministic.",
    "proves": "Model long-running integration work with explicit job state, safe recovery, and operational controls.",
    "why": "Provide a small, readable reference implementation of a database-backed job/worker pattern for system-to-system synchronization, with explicit handling of real failure modes (timeouts, rate limits), durable state, and operational controls (retry, cancel, DLQ, replay).",
    "problem": "Integration work between external systems is unreliable and long-running. Requests to “sync entity X” must be made durable, protected from duplicate active work, resilient to transient upstream failures, and observable. The system needs deterministic job state, attempt history, and safe recovery when a worker crashes mid-run.",
    "tradeoffs": "DB-as-queue simplifies deployment and guarantees durability, but it requires careful leasing, indexing, and backoff modeling to avoid thundering herds and hot rows.",
    "excludes": "Intentionally excludes multi-tenant policy, distributed workers across hosts, and exactly-once semantics across external systems.",
    "failureModes": [
      "Upstream timeouts and transient network failures",
      "Rate limits and retry-after enforcement",
      "Worker crash mid-run (lease expiry + safe re-claim)",
      "Duplicate enqueue / concurrent work on same entity",
      "Exhausted retries leading to dead-letter state"
    ],
    "whyNot": [
      "Why not a message broker? Brokers are great at scale, but DB-as-queue is a readable reference for durable state transitions without extra infra.",
      "Why not mutate the original job on replay? Preserving immutable attempt history makes post-incident analysis and auditability much safer."
    ],
    "architecture": "FastAPI service exposing HTTP endpoints to enqueue and manage sync jobs. Jobs are persisted via SQLAlchemy in a relational database and act as the queue and source of truth. An in-process worker claims jobs via time-bounded leases, executes them through a JobExecutor, records immutable attempt history, classifies failures, retries with exponential backoff, moves exhausted jobs to a dead-letter state, and supports replay by creating linked jobs rather than mutating history.",
    "decisions": [
      "Database is the durable queue and source of truth.",
      "Explicit leasing for crash-safe job claiming.",
      "Immutable attempt records per execution.",
      "Typed error classification drives retry behavior.",
      "Exponential backoff persisted via next_run_at.",
      "Dead-letter state after max retries.",
      "Replay creates a new job linked to the original.",
      "Idempotency enforced at enqueue-time.",
      "UTC-normalized timestamps for correctness.",
      "Correlation IDs propagated through execution."
    ],
    "differentiators": [
      "Demonstrates DB-as-queue pattern without external brokers.",
      "Operational controls (retry, cancel, DLQ, replay) are first-class.",
      "Failure behavior is deterministic and persisted.",
      "Small codebase with explicit job lifecycle modeling.",
      "Includes mock upstream systems to exercise failure paths."
    ],
    "github": "https://github.com/Siggmond/SyncBridge"
  },
  {
    id: "clientops-hub",
    title: "ClientOps Hub",
    zone: "systems",
    year: "2025",
    stack: "FastAPI · SQLAlchemy · SQLite · Vue 3 · Vite · JWT",
    determinism: "deterministic",
    status: "demo",
    consistencyModel: "Strong consistency per request (single DB); audit log is append-only for reconstruction.",
    timeDimension: "Restart safe: core state lives in SQLite; recovery is operational/manual; no background workers.",
    interfaceContract: "Server-enforced RBAC at the API layer; audit log provides a durable write trail.",
    whatBreaksFirst: "SQLite write concurrency and operational sharp edges (accidental destructive actions) under heavier usage.",
    operationalPosture: "operator-driven",
    dependencyPhilosophy: "Prefer minimal infra; a single relational DB keeps the system inspectable and easy to run.",
    primaryRisk: "Authorization mistakes or audit gaps are higher risk than feature gaps in an ops tool.",
    twoWeeks: "Add end-to-end tests for RBAC + audit invariants and add basic migration tooling for schema evolution.",
    matters: "An ops workspace that treats RBAC and auditability as first-class constraints, not UI polish.",
    proves: "Build internal tools with explicit authorization boundaries and an auditable write history.",
    github: "https://github.com/Siggmond/clientops-hub",
    why: "Provide a lightweight internal workspace to manage clients, leads, and invoices with server-enforced access control and an auditable history of write actions, without adopting a full CRM stack.",
    problem: "Small teams often need a single operational view of client relationships, lead pipeline state, and billing lifecycle, plus accountability over changes. Spreadsheets or ad-hoc tools lack consistent authorization, soft-delete safety, and a unified audit trail.",
    tradeoffs:
      "A single-DB, two-app architecture keeps the system inspectable and easy to run locally, but it does not target multi-tenant scaling or external identity integrations.",
    excludes: "Intentionally excludes multi-tenant SaaS concerns, SSO/IdP integrations, and production hardening beyond a reference implementation.",
    failureModes: [
      "Auth token expiry and unauthorized access attempts",
      "Race conditions on concurrent edits (server-side enforcement)",
      "Soft-delete semantics and accidental destructive actions",
      "Audit log integrity under partial failures",
      "Client-side state drift vs server source of truth"
    ],
    architecture:
      "Two-app repository: FastAPI backend + Vue 3 SPA frontend. REST API under /api for auth, clients, leads, invoices, and audit logs. SQLAlchemy models backed by SQLite. JWT bearer auth with role-based access enforced via FastAPI dependencies. Soft deletes via deleted_at. AuditLog persisted for all write actions. Frontend uses Axios, localStorage JWT, and UI gating while relying on server-side authorization.",
    decisions: [
      "Split backend (FastAPI) and frontend (Vue 3) into separate apps.",
      "Use SQLite + SQLAlchemy for local persistence.",
      "JWT bearer authentication with role-based authorization enforced server-side.",
      "Soft-delete semantics with admin-only archive/restore.",
      "Persist audit logs for all write operations.",
      "Compute dashboard metrics client-side from list endpoints.",
      "Auto-create tables and seed default accounts on empty database startup."
    ],
    differentiators: [
      "First-class persisted audit log with actor role and timestamps.",
      "Consistent soft-delete semantics across all domain entities.",
      "Authorization enforced at the API layer, not just UI gating.",
      "Focused operational scope with clear domain boundaries."
    ],
    omit: [
      "Do not claim enterprise CRM completeness.",
      "Do not claim multi-tenant, SSO, or external identity providers.",
      "Do not claim production-grade security posture.",
      "Do not claim advanced analytics or reporting services.",
      "Do not claim integrations or background job processing."
    ]
  },
  {
    id: "taskflow-pro",
    zone: "systems",
    title: "TaskFlow Pro",
    year: "2025",
    stack: "Vue 3 · TypeScript · Vite · Pinia · Vue Router · Axios",
    determinism: "deterministic",
    status: "demo",
    consistencyModel: "Single-user consistency (in-browser state) with mock HTTP semantics; no multi-writer concurrency.",
    timeDimension: "Restart safety via localStorage in a browser session; no durable server-side history.",
    interfaceContract: "Typed API boundary + normalized error model; mock adapter preserves request/response discipline.",
    whatBreaksFirst: "localStorage limits and multi-tab state drift.",
    operationalPosture: "manual",
    dependencyPhilosophy: "Use a standard Vue toolchain, but keep domain boundaries explicit and typed.",
    primaryRisk: "Mock-backend realism: it can hide production constraints if treated as a complete system.",
    twoWeeks: "Add multi-user simulation tests and broaden RBAC + failure-path coverage to better mirror real backends.",
    matters: "A frontend reference that exercises typed boundaries, RBAC, and failure handling without needing a server to run.",
    proves: "Ship a production-style frontend architecture with typed contracts, RBAC, and resilient UX failure paths.",
    why: "Build a portable, frontend-only project management app that exercises production-style frontend architecture patterns (typed API boundary, feature modules, global error handling, RBAC) without requiring a real backend to run.",
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
      "State hydration mismatches on refresh"
    ],
    architecture: `
Single-page Vue 3 + TypeScript application built with Vite. Routing via Vue Router with auth guards and role-gated routes. State via Pinia stores per feature module with a strict store/service split. Centralized Axios client with retry, normalized errors, and 401 handling. Mock REST API implemented as an Axios adapter backed by localStorage. Auth simulated via bearer token encoding userId. Global toast store for runtime/store errors; theme persisted in localStorage.
    `,
    decisions: [
      "Feature-first module layout (src/modules/*) to keep domain boundaries clear.",
      "Strict store/service split so side effects live behind a typed boundary.",
      "Centralized Axios client for consistent retries and error normalization.",
      "RBAC enforced in both UI and store layers to prevent accidental privilege escalation.",
      "Mock REST API implemented as an Axios adapter to preserve real HTTP semantics.",
      "localStorage-backed persistence to enable realistic CRUD flows without server infra.",
      "Optimistic task movement with rollback on failure for correct UX modeling.",
      "Activity log modeled as explicit domain events emitted by the mock API."
    ],
    differentiators: [
      "Persistent mock backend supporting auth, RBAC, and CRUD without a real server.",
      "Authoritative permission checks in the state layer, not just UI gating.",
      "Resilient failure behavior with retries, normalized errors, and global surfacing.",
      "Typed domain contracts and a consistent REST-like API surface.",
      "Audit-style activity feed tied to domain mutations."
    ],
    github: "https://github.com/Siggmond/taskflow-pro",
    demo: null,
    image: null
  }
];

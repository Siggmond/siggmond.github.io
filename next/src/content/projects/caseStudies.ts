import type { ProjectKey } from "@/content/projects";

export type TechnicalNote = {
  title: string;
  points: string[];
};

export type HeroMetric = {
  icon: "build" | "speed" | "quality" | "resilience";
  label: string;
  value: string;
  detail: string;
};

export type CaseStudyBadge = {
  label: "Architecture" | "Pattern" | "Complexity" | "Status";
  value: string;
};

export type ProjectCaseStudy = {
  overview: string;
  problem: string;
  constraints: string[];
  whatIBuilt: string[];
  engineeringDecisions: string[];
  tradeoffs: string[];
  highlights: string[];
  techStack: string[];
  outcomes: string[];
  technicalNotes: TechnicalNote[];
  architectureFlow: string[];
  heroMetrics: HeroMetric[];
  badges: CaseStudyBadge[];
};

const caseStudies: Partial<Record<ProjectKey, ProjectCaseStudy>> = {
  "nova-commerce": {
    overview:
      "NovaCommerce is a mobile commerce build focused on one hard problem: making checkout reliable when users are browsing fast and stock is changing. The app stays responsive with local-first state while preserving inventory correctness during order placement.",
    problem:
      "Common e-commerce demos optimize UI polish but skip the failure-heavy paths where real trust is lost: low-stock races, payment interruptions, and state drift after auth changes.",
    constraints: [
      "Protect stock consistency during concurrent checkout attempts.",
      "Support local-first UX that still reconciles cleanly after sign-in.",
      "Keep payment integration flexible across providers and test flows.",
      "Ship portfolio-ready quality gates with repeatable release artifacts.",
    ],
    whatIBuilt: [
      "Implemented end-to-end shopping flows across browse, search, variants, cart, checkout, and orders.",
      "Built transactional Firestore checkout that validates and decrements stock atomically.",
      "Designed feature-first clean architecture with Riverpod and explicit module boundaries.",
      "Added local persistence for cart, wishlist, and recent user context with sync handoff.",
      "Integrated payment providers behind a shared interface for Stripe and demo providers.",
    ],
    engineeringDecisions: [
      "Split feature code into presentation, domain, and data to keep checkout logic testable.",
      "Used `go_router` tab shell plus nested routes to preserve navigation ownership by module.",
      "Moved risky stock updates into Firestore transactions instead of optimistic client-only writes.",
      "Encapsulated provider-specific payment calls behind a common checkout contract.",
      "Kept intent-routing assistant on-device with TensorFlow Lite (TFLite), then reused TFLite naming and flows consistently.",
    ],
    tradeoffs: [
      "Local-first state improves speed but increases reconciliation complexity after authentication changes.",
      "Strict transactional checkout reduces oversell risk but adds backend coupling to order orchestration.",
      "Provider abstraction improves portability but adds an extra interface layer to maintain.",
    ],
    highlights: [
      "Made checkout deterministic so the same stock state produces the same order result.",
      "Kept cart and wishlist responsive offline, then synced safely after login.",
      "Protected critical paths with CI gates before generating release APK artifacts.",
      "Limited payment-provider lock-in with interface-based orchestration.",
      "Used TFLite intent routing to keep suggestions on-device and low latency.",
    ],
    techStack: [
      "Flutter",
      "Dart",
      "Riverpod",
      "go_router",
      "Firebase Auth",
      "Cloud Firestore",
      "Cloud Functions",
      "Stripe",
      "SharedPreferences",
      "TFLite",
      "GitHub Actions",
    ],
    outcomes: [
      "Shipped 25 automated tests across viewmodels, widgets, routing, mapping, and AI logic.",
      "Automated release quality with CI format, analysis, test, and APK build steps.",
      "Delivered deterministic stock-safe checkout behavior under low-inventory contention.",
      "Released a complete commerce flow with resilient local-first state recovery.",
    ],
    technicalNotes: [
      {
        title: "Failure Modes Covered",
        points: [
          "Concurrent low-stock checkout collision.",
          "Network loss during payment confirmation and order creation.",
          "Local and server state divergence across auth transitions.",
        ],
      },
      {
        title: "Testing And Guardrails",
        points: [
          "Widget and golden tests protect high-change storefront and checkout screens.",
          "Viewmodel tests validate business rules around stock and order sequencing.",
          "Static analysis and test gates block regressions before release packaging.",
        ],
      },
    ],
    architectureFlow: ["UI Modules", "Application Orchestration", "Domain Rules", "Firestore Transaction + Payment"],
    heroMetrics: [
      { icon: "quality", label: "Automated Tests", value: "25", detail: "Widget, VM, routing, mapping, AI" },
      { icon: "resilience", label: "Critical Guarantees", value: "Stock-safe checkout", detail: "Transactional order placement" },
      { icon: "build", label: "Release Pipeline", value: "CI + APK", detail: "Analyze, test, package" },
      { icon: "speed", label: "State Strategy", value: "Local-first", detail: "Sync after authentication" },
    ],
    badges: [
      { label: "Architecture", value: "Feature-first Clean Architecture" },
      { label: "Pattern", value: "Transactional Checkout + Provider Abstraction" },
      { label: "Complexity", value: "Medium-High" },
      { label: "Status", value: "Production-style Portfolio Build" },
    ],
  },
  "stock-pilot": {
    overview:
      "StockPilot is a mobile inventory workspace for operators who need fast daily decisions without opaque forecasting models. It combines deterministic demand estimation, risk surfacing, and quick sales input in one scan-friendly flow.",
    problem:
      "Small teams often detect stockouts too late because sales logs, risk signals, and reorder calculations are split across tools and too slow to update in the field.",
    constraints: [
      "Keep forecasting explainable enough for non-technical operators.",
      "Support offline-first workflows for low-connectivity environments.",
      "Prevent noisy data from creating misleading reorder urgency.",
      "Fit primary decisions into a phone-first dashboard rhythm.",
    ],
    whatIBuilt: [
      "Implemented onboarding, dashboard, alerts, products, sales, and settings modules.",
      "Built deterministic forecasting with a 7-day moving average and zero-clamped reorder output.",
      "Designed risk states that classify inventory into critical, warning, and opportunity groups.",
      "Added quick-sale today upsert plus two-week sales history on the same workflow.",
      "Backed app state with Hive repositories for products, daily sales, and settings.",
    ],
    engineeringDecisions: [
      "Normalized sales dates to UTC day buckets for stable day-level aggregation.",
      "Kept UI rendering-only and moved orchestration to Riverpod controllers.",
      "Used feature-first layering to isolate application rules from storage details.",
      "Aggregated KPI, alerts, and action queue into one dashboard decision surface.",
      "Added adaptive performance downgrades to protect frame pacing on weaker devices.",
    ],
    tradeoffs: [
      "Deterministic forecasting improves trust but limits prediction depth versus ML models.",
      "Offline-first storage improves reliability but requires stricter data-shape management.",
      "Conservative sparse-data behavior reduces false confidence but can under-suggest reorders.",
    ],
    highlights: [
      "Made forecasting deterministic so identical history yields identical reorder guidance.",
      "Translated forecast outputs into plain-language risk states for faster action.",
      "Reduced interaction cost with quick-sale upsert and focused dashboard flow.",
      "Preserved usability in low-connectivity contexts with Hive-backed persistence.",
      "Stabilized rendering under load with adaptive visual effects.",
    ],
    techStack: [
      "Flutter (Material 3)",
      "Dart",
      "Riverpod",
      "go_router",
      "Hive",
      "fl_chart",
      "flutter_screenutil",
      "google_fonts",
    ],
    outcomes: [
      "Shipped `v1.0.0+1` with full inventory loop across six operational modules.",
      "Delivered deterministic reorder logic suitable for repeatable daily workflows.",
      "Enabled offline-first usage through local persistence of products, sales, and settings.",
      "Reduced daily logging friction with quick-sale entry and built-in recent history.",
    ],
    technicalNotes: [
      {
        title: "Failure Modes Covered",
        points: [
          "Sparse or zero-demand periods producing conservative forecasts.",
          "Incorrect lead-time and safety-stock inputs affecting recommendation quality.",
          "Data-entry mistakes distorting near-term stockout timelines.",
        ],
      },
      {
        title: "Forecasting Boundaries",
        points: [
          "Forecasting intentionally favors explainability over black-box prediction breadth.",
          "Rule and threshold values are explicit and auditable in application logic.",
          "Date normalization and clamp behavior enforce deterministic output shape.",
        ],
      },
    ],
    architectureFlow: ["UI Surfaces", "Controllers + Validation", "Forecast Domain Contracts", "Hive Repositories"],
    heroMetrics: [
      { icon: "build", label: "Version", value: "v1.0.0+1", detail: "End-to-end inventory workflow shipped" },
      { icon: "resilience", label: "Forecast Model", value: "Deterministic 7-day MA", detail: "Explainable reorder output" },
      { icon: "speed", label: "Daily Workflow", value: "Quick-sale upsert", detail: "Today + 14-day history" },
      { icon: "quality", label: "Core Modules", value: "6", detail: "Onboarding, dashboard, alerts, products, sales, settings" },
    ],
    badges: [
      { label: "Architecture", value: "Layered Feature-first Mobile App" },
      { label: "Pattern", value: "Deterministic Forecast + Risk Classification" },
      { label: "Complexity", value: "Medium" },
      { label: "Status", value: "Shipped MVP" },
    ],
  },
  "gen-zero": {
    overview:
      "MicroStore Optimizer converts sales and catalog activity into actionable merchant guidance with a strict explainability-first approach. The MVP prioritizes deterministic rules, lightweight offline behavior, and repeatable demo setup.",
    problem:
      "Merchants can capture transactions but still miss next-best actions because KPI visibility and recommendation logic are either absent or hard to trust.",
    constraints: [
      "Keep recommendation logic transparent and easy to inspect.",
      "Support small-screen and large-text accessibility without layout breakage.",
      "Operate reliably without cloud dependency for day-to-day usage.",
      "Provide instant demo readiness without manual data setup.",
    ],
    whatIBuilt: [
      "Implemented merchant KPI dashboard tuned for small screens and text-scale stress.",
      "Built deterministic insight engine with explicit `why`, `impact`, and `action` outputs.",
      "Created product and sales flows for local catalog and transaction management.",
      "Added idempotent demo seeding that backfills missing data safely.",
      "Structured app into domain, data, and presentation layers with Riverpod orchestration.",
    ],
    engineeringDecisions: [
      "Kept insight generation in domain rules to avoid leaking business logic into widgets.",
      "Mapped Hive persistence models to domain entities via repository boundaries.",
      "Used deterministic rule composition to keep outputs stable and explainable.",
      "Built per-action feedback states so operators can trust write outcomes.",
      "Constrained MVP scope to high-value merchant actions before adding complex ML.",
    ],
    tradeoffs: [
      "Rule-based explainability improves trust but limits long-horizon prediction breadth.",
      "Offline-first design improves startup speed but shifts more responsibility to local integrity.",
      "MVP scope control improves clarity but postpones advanced recommendation classes.",
    ],
    highlights: [
      "Made recommendations deterministic and explainable on every insight card.",
      "Kept UI stable under accessibility text scaling and narrow device widths.",
      "Improved demo reliability with idempotent data seeding for partial installs.",
      "Separated rules from rendering to preserve maintainability and testability.",
      "Shipped multi-platform-ready structure with offline-first persistence.",
    ],
    techStack: ["Flutter (Material 3)", "Dart", "Riverpod", "Hive", "go_router", "fl_chart"],
    outcomes: [
      "Shipped `v1.0.0+1` MVP with Android, iOS, Web, Windows, and macOS targets configured.",
      "Delivered explainable deterministic insights for restock, pricing, and bundle opportunities.",
      "Enabled offline-first usage with fast local startup and persistent merchant state.",
      "Stabilized demo and onboarding quality via idempotent seed and feedback patterns.",
    ],
    technicalNotes: [
      {
        title: "Failure Modes Covered",
        points: [
          "Sparse/noisy history degrading recommendation confidence.",
          "Incorrect inventory baselines reducing action relevance.",
          "Interrupted sessions requiring robust local state recovery.",
        ],
      },
      {
        title: "Release Boundaries",
        points: [
          "Android release builds use debug signing for out-of-box demo execution.",
          "Recommendation engine is scoped to deterministic rules in MVP.",
          "Pipeline is prepared for future ML augmentation without domain rewrites.",
        ],
      },
    ],
    architectureFlow: ["Accessible UI", "Riverpod Controllers", "Insight Rule Engine", "Hive Persistence"],
    heroMetrics: [
      { icon: "build", label: "Version", value: "v1.0.0+1", detail: "MVP release baseline" },
      { icon: "quality", label: "Insight Style", value: "Explainable", detail: "why + impact + action" },
      { icon: "resilience", label: "Persistence", value: "Offline-first", detail: "Hive-backed local state" },
      { icon: "speed", label: "Demo Reliability", value: "Idempotent seeding", detail: "Backfills partial installs" },
    ],
    badges: [
      { label: "Architecture", value: "Clean-split Domain/Data/Presentation" },
      { label: "Pattern", value: "Deterministic Rule Engine" },
      { label: "Complexity", value: "Medium" },
      { label: "Status", value: "MVP Packaged" },
    ],
  },
};

export function getProjectCaseStudy(slug: string): ProjectCaseStudy | null {
  return caseStudies[slug as ProjectKey] ?? null;
}

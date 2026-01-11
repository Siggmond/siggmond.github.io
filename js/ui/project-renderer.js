import { projects } from "../data/projects.js";

function el(tag, { className, attrs } = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined) continue;
      node.setAttribute(k, String(v));
    }
  }
  return node;
}

function appendText(node, text) {
  node.appendChild(document.createTextNode(text));
}

function getProjectType(project) {
  if (project?.zone === "apps") return "App";
  return "System";
}

function oneLinePurpose(project) {
  const why = typeof project?.why === "string" ? project.why.trim() : "";
  if (!why) return "";
  const first = why.split(/(?<=[.!?])\s+/)[0] ?? why;
  return first.replace(/\s+/g, " ").trim();
}

function oneLineMatters(project) {
  const matters = typeof project?.matters === "string" ? project.matters.trim() : "";
  if (matters) return matters.replace(/\s+/g, " ").trim();
  return oneLinePurpose(project);
}

function formatMeta(project) {
  const year = project?.year ?? "";
  let stack = project?.stack ?? "";

  if (project?.id === "clientops-hub" && typeof stack === "string" && stack.includes(" · ")) {
    stack = stack
      .split(" · ")
      .slice(0, 4)
      .join(" · ");
  }

  return `${year}${year && stack ? " · " : ""}${stack}`;
}

function getScopeLabel(project) {
  const decisions = Array.isArray(project?.decisions) ? project.decisions.length : 0;
  const archLen = typeof project?.architecture === "string" ? project.architecture.length : 0;

  if (decisions >= 8 || archLen >= 500) return "Scope: Complex";
  if (decisions >= 5 || archLen >= 260) return "Scope: Moderate";
  return "Scope: Focused";
}

function getConstraint(project) {
  if (typeof project?.constraint === "string" && project.constraint.trim()) {
    return project.constraint.trim();
  }

  const decisions = Array.isArray(project?.decisions) ? project.decisions : [];
  if (decisions.length > 0) return `Constraint: ${decisions[0]}`;
  return "Constraint: Prefer explicit boundaries and deterministic state transitions.";
}

function getWhatNot(project) {
  const omit = Array.isArray(project?.omit) ? project.omit : [];
  if (omit.length > 0 && typeof omit[0] === "string" && omit[0].trim()) {
    return `What this is NOT: ${omit[0].trim()}`;
  }
  return "What this is NOT: a full platform — it is a focused reference build.";
}

function formatRepoMeta({ stars, pushedAt, openIssues }) {
  const date = pushedAt ? String(pushedAt).slice(0, 10) : "";
  const starsText = typeof stars === "number" ? `${stars.toLocaleString()} stars` : "";
  const ageDays = pushedAt ? Math.floor((Date.now() - Date.parse(pushedAt)) / (1000 * 60 * 60 * 24)) : null;
  const ageText = typeof ageDays === "number" && Number.isFinite(ageDays) ? `Commit age ${ageDays}d` : "";
  const issuesText = typeof openIssues === "number" ? `${openIssues.toLocaleString()} issues` : "";
  const dateText = date ? `Last commit ${date}` : "";
  return [starsText, issuesText, ageText || dateText].filter(Boolean).join(" · ");
}

function parseGitHubRepo(url) {
  try {
    const u = new URL(url);
    if (u.hostname !== "github.com") return null;
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

const repoMetaPromiseByKey = new Map();

async function fetchRepoMeta({ owner, repo }) {
  const cacheKey = `ghmeta:${owner}/${repo}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const fetchedAt = typeof parsed?.fetchedAt === "number" ? parsed.fetchedAt : 0;
      if (Date.now() - fetchedAt < 1000 * 60 * 60 * 24) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) throw new Error(`GitHub repo fetch failed: ${res.status}`);
  const json = await res.json();

  const meta = {
    stars: typeof json?.stargazers_count === "number" ? json.stargazers_count : null,
    pushedAt: typeof json?.pushed_at === "string" ? json.pushed_at : null,
    openIssues: typeof json?.open_issues_count === "number" ? json.open_issues_count : null,
    fetchedAt: Date.now(),
  };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(meta));
  } catch {
    // ignore
  }

  return meta;
}

function enhanceGitHubLink(a, githubUrl) {
  const repo = parseGitHubRepo(githubUrl);
  if (!repo) return;

  const key = `${repo.owner}/${repo.repo}`;
  if (!repoMetaPromiseByKey.has(key)) {
    repoMetaPromiseByKey.set(key, fetchRepoMeta(repo));
  }

  repoMetaPromiseByKey
    .get(key)
    ?.then((meta) => {
      const suffix = formatRepoMeta(meta);
      if (!suffix) return;
      a.textContent = `View source (GitHub) · ${suffix}`;
    })
    .catch(() => {
      // ignore
    });
}

export function renderProjects({ root = document, items = projects } = {}) {
  const list = Array.isArray(items) ? items : [];

  for (const project of list) {
    if (!project || !project.id || !project.zone) continue;

    const zone = root.querySelector(`.zone[data-zone="${project.zone}"]`);
    const body = zone?.querySelector(":scope > .zone__body");
    if (!zone || !body) continue;

    const mount = body.querySelector(":scope > .zone__inner") || body;

    try {
      const existing = mount.querySelector(`.project[data-project="${CSS.escape(project.id)}"]`);
      if (existing) continue;
    } catch {
      // ignore
    }

    const article = el("article", {
      className: "project",
      attrs: { "data-project": project.id },
    });

    const toggle = el("button", {
      className: "project__toggle",
      attrs: { type: "button", "aria-expanded": "false" },
    });

    const title = el("span", { className: "project__title" });
    appendText(title, project.title ?? "");

    const purpose = el("span", { className: "project__meta" });
    const type = getProjectType(project);
    const matters = oneLineMatters(project);
    appendText(purpose, `${type} — ${matters}`);

    const proves = typeof project?.proves === "string" && project.proves.trim() ? el("span", { className: "project__label" }) : null;
    if (proves) appendText(proves, `Proof: ${project.proves.trim()}`);

    const summary = el("span", { className: "project__label project__label--tags" });
    const det = typeof project?.determinism === "string" && project.determinism.trim() ? project.determinism.trim() : "unspecified";
    const status = typeof project?.status === "string" && project.status.trim() ? project.status.trim() : "unspecified";
    appendText(summary, `${getScopeLabel(project)} · Determinism: ${det} · Lifecycle: ${status}`);

    const meta = el("span", { className: "project__meta" });
    appendText(meta, formatMeta(project));

    toggle.append(title, purpose);
    if (proves) toggle.appendChild(proves);
    toggle.append(summary, meta);

    const panel = el("div", { className: "project__panel", attrs: { hidden: "" } });

    const provesExpanded = typeof project?.proves === "string" && project.proves.trim() ? el("p", { className: "project__micro" }) : null;
    if (provesExpanded) appendText(provesExpanded, `What this proves: ${project.proves.trim()}`);

    const story = el("div", { className: "project__story" });
    if (project.id === "clientops-hub") {
      const whyP = el("p");
      appendText(whyP, project.why ?? "");
      story.appendChild(whyP);

      if (project.problem) {
        const problemP = el("p");
        appendText(problemP, project.problem);
        story.appendChild(problemP);
      }
    } else {
      const whyP = el("p");
      const storyText = project.zone === "systems" ? project.problem ?? project.why : project.why;
      appendText(whyP, storyText ?? "");
      story.appendChild(whyP);
    }

    const guarantees = el("p", { className: "project__micro" });
    appendText(
      guarantees,
      "Guarantees (design intent): explicit state transitions, bounded retries, and observable failure handling."
    );

    const consistencyModel =
      typeof project?.consistencyModel === "string" && project.consistencyModel.trim()
        ? el("p", { className: "project__micro" })
        : null;
    if (consistencyModel) appendText(consistencyModel, `Consistency Model: ${project.consistencyModel.trim()}`);

    const timeDimension =
      typeof project?.timeDimension === "string" && project.timeDimension.trim()
        ? el("p", { className: "project__micro" })
        : null;
    if (timeDimension) appendText(timeDimension, `Time Dimension: ${project.timeDimension.trim()}`);

    const interfaceContract =
      typeof project?.interfaceContract === "string" && project.interfaceContract.trim()
        ? el("p", { className: "project__micro" })
        : null;
    if (interfaceContract) appendText(interfaceContract, `Interface Contract: ${project.interfaceContract.trim()}`);

    const breaksFirst =
      typeof project?.whatBreaksFirst === "string" && project.whatBreaksFirst.trim()
        ? el("p", { className: "project__micro" })
        : null;
    if (breaksFirst) appendText(breaksFirst, `What breaks first: ${project.whatBreaksFirst.trim()}`);

    const ops =
      typeof project?.operationalPosture === "string" && project.operationalPosture.trim()
        ? el("p", { className: "project__micro" })
        : null;
    if (ops) appendText(ops, `Operational posture: ${project.operationalPosture.trim()}`);

    const deps =
      typeof project?.dependencyPhilosophy === "string" && project.dependencyPhilosophy.trim()
        ? el("p", { className: "project__micro" })
        : null;
    if (deps) appendText(deps, `Dependency philosophy: ${project.dependencyPhilosophy.trim()}`);

    const primaryRisk =
      project.zone === "systems" && typeof project?.primaryRisk === "string" && project.primaryRisk.trim()
        ? el("p", { className: "project__micro" })
        : null;
    if (primaryRisk) appendText(primaryRisk, `Primary Risk: ${project.primaryRisk.trim()}`);

    const twoWeeks = typeof project?.twoWeeks === "string" && project.twoWeeks.trim() ? el("p", { className: "project__micro" }) : null;
    if (twoWeeks) appendText(twoWeeks, `If I had 2 more weeks: ${project.twoWeeks.trim()}`);

    const tradeoffs = typeof project?.tradeoffs === "string" && project.tradeoffs.trim() ? el("p", { className: "project__micro" }) : null;
    if (tradeoffs) appendText(tradeoffs, `Tradeoffs: ${project.tradeoffs.trim()}`);

    const excludes = typeof project?.excludes === "string" && project.excludes.trim() ? el("p", { className: "project__micro" }) : null;
    if (excludes) appendText(excludes, project.excludes.trim());

    const failureModes = Array.isArray(project?.failureModes) ? project.failureModes : [];
    const failureWrap = failureModes.length > 0 ? el("div", { className: "project__failures" }) : null;
    if (failureWrap) {
      const labelP = el("p", { className: "project__micro" });
      appendText(labelP, "Failure modes considered:");
      const ul = el("ul", { className: "systems-list" });
      for (const item of failureModes) {
        const li = el("li");
        appendText(li, item);
        ul.appendChild(li);
      }
      failureWrap.append(labelP, ul);
    }

    const whyNotItems = Array.isArray(project?.whyNot) ? project.whyNot : [];
    const whyNotWrap = whyNotItems.length > 0 ? el("div", { className: "project__whynot" }) : null;
    if (whyNotWrap) {
      const labelP = el("p", { className: "project__micro" });
      appendText(labelP, "Why not X?");
      const ul = el("ul", { className: "systems-list" });
      for (const item of whyNotItems.slice(0, 2)) {
        const li = el("li");
        appendText(li, item);
        ul.appendChild(li);
      }
      whyNotWrap.append(labelP, ul);
    }

    const arch = el("div", { className: "project__arch" });
    const archPre = el("pre", { className: "mono" });
    appendText(archPre, project.architecture ?? "");
    arch.appendChild(archPre);

    const constraintWrap = el("div", { className: "project__constraint" });
    const constraintPre = el("pre", { className: "mono" });
    appendText(constraintPre, getConstraint(project));
    constraintWrap.appendChild(constraintPre);

    const whatNot = project.zone === "systems" ? el("p", { className: "project__micro" }) : null;
    if (whatNot) appendText(whatNot, getWhatNot(project));

    const decisionsWrap = el("div", { className: "project__decisions" });
    const decisions = Array.isArray(project.decisions) ? project.decisions : [];
    if (decisions.length > 0) {
      const decisionsUl = el("ul", { className: "systems-list" });
      for (const item of decisions) {
        const li = el("li");
        appendText(li, item);
        decisionsUl.appendChild(li);
      }
      decisionsWrap.appendChild(decisionsUl);
    }

    const diffsWrap = el("div", { className: "project__diffs" });
    const diffs = Array.isArray(project.differentiators) ? project.differentiators : [];
    if (diffs.length > 0) {
      const diffsUl = el("ul", { className: "systems-list" });
      for (const item of diffs) {
        const li = el("li");
        appendText(li, item);
        diffsUl.appendChild(li);
      }
      diffsWrap.appendChild(diffsUl);
    }

    const links = el("nav", { className: "project__links" });
    if (project.github) {
      const a = el("a", {
        attrs: { href: project.github, target: "_blank", rel: "noreferrer" },
      });
      appendText(a, "View source (GitHub)");
      enhanceGitHubLink(a, project.github);
      links.appendChild(a);
    }

    const hasLinks = links.childNodes.length > 0;

    const reviewed = el("div", { className: "project__reviewed" });
    appendText(reviewed, "Reviewed Artifacts: architecture, failure modes, recovery paths, and invariants.");

    panel.append(story);
    if (provesExpanded) panel.appendChild(provesExpanded);
    panel.append(guarantees);
    if (hasLinks) panel.appendChild(links);
    if (consistencyModel) panel.appendChild(consistencyModel);
    if (timeDimension) panel.appendChild(timeDimension);
    if (interfaceContract) panel.appendChild(interfaceContract);
    if (breaksFirst) panel.appendChild(breaksFirst);
    if (ops) panel.appendChild(ops);
    if (deps) panel.appendChild(deps);
    if (primaryRisk) panel.appendChild(primaryRisk);
    if (twoWeeks) panel.appendChild(twoWeeks);
    if (tradeoffs) panel.appendChild(tradeoffs);
    if (excludes) panel.appendChild(excludes);
    if (failureWrap) panel.appendChild(failureWrap);
    if (whyNotWrap) panel.appendChild(whyNotWrap);
    panel.append(constraintWrap);
    if (whatNot) panel.appendChild(whatNot);
    panel.append(arch, decisionsWrap, diffsWrap, reviewed);

    const clip = el("div", { className: "project__clip" });
    clip.append(toggle, panel);

    article.append(clip);
    mount.appendChild(article);
  }
}

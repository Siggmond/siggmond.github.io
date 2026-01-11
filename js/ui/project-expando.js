import { MOTION } from "../core/constants.js";

const LAST_OPEN_PROJECT_KEY = "project:lastOpen";
const LAST_OPEN_ZONE_KEY = "project:lastZone";

function nextId(prefix = "id") {
  return `${prefix}-${Math.random().toString(16).slice(2)}`;
}

function getPanel(projectEl) {
  return projectEl.querySelector(":scope > .project__clip > .project__panel");
}

function getToggle(projectEl) {
  return projectEl.querySelector(":scope > .project__clip > .project__toggle");
}

function isOpen(projectEl) {
  const toggle = getToggle(projectEl);
  return toggle?.getAttribute("aria-expanded") === "true";
}

function setExpanded(projectEl, expanded) {
  const toggle = getToggle(projectEl);
  if (toggle) toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  projectEl.toggleAttribute("data-open", expanded);
}

function persistLastOpen(projectEl) {
  const id = projectEl?.dataset?.project;
  const zone = projectEl?.closest(".zone")?.dataset?.zone ?? null;
  if (!id) return;

  try {
    sessionStorage.setItem(LAST_OPEN_PROJECT_KEY, String(id));
    if (zone) sessionStorage.setItem(LAST_OPEN_ZONE_KEY, String(zone));
  } catch {
    // ignore
  }
}

function clearLastOpen() {
  try {
    sessionStorage.removeItem(LAST_OPEN_PROJECT_KEY);
    sessionStorage.removeItem(LAST_OPEN_ZONE_KEY);
  } catch {
    // ignore
  }
}

function ensureAria(projectEl) {
  const toggle = getToggle(projectEl);
  const panel = getPanel(projectEl);
  if (!toggle || !panel) return;

  if (!toggle.id) toggle.id = nextId("project-toggle");
  if (!panel.id) panel.id = nextId("project-panel");
  toggle.setAttribute("aria-controls", panel.id);
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-labelledby", toggle.id);

  if (!panel.hasAttribute("tabindex")) panel.setAttribute("tabindex", "-1");
}

function animateHeight(panel, fromPx, toPx, { durationMs }) {
  panel.style.overflow = "clip";
  panel.style.height = `${fromPx}px`;

  const anim = panel.animate(
    [{ height: `${fromPx}px` }, { height: `${toPx}px` }],
    {
      duration: durationMs,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
      fill: "forwards",
    }
  );

  return anim;
}

export function createProjectExpando({ root = document } = {}) {
  const projects = Array.from(root.querySelectorAll(".project[data-project]"));

  const cleanup = [];
  const animByPanel = new WeakMap();

  function stopAnim(panel) {
    const prev = animByPanel.get(panel);
    if (prev) {
      try {
        prev.cancel();
      } catch {
        // ignore
      }
    }
    animByPanel.delete(panel);
  }

  function closeProject(projectEl, { focusToggle = false } = {}) {
    const toggle = getToggle(projectEl);
    const panel = getPanel(projectEl);
    if (!toggle || !panel) return;

    if (!isOpen(projectEl)) return;

    stopAnim(panel);
    setExpanded(projectEl, false);

    clearLastOpen();

    if (MOTION.prefersReduced) {
      panel.hidden = true;
      panel.style.height = "";
      panel.style.overflow = "";
      if (focusToggle) toggle.focus();
      return;
    }

    panel.hidden = false;

    const fromPx = panel.scrollHeight;
    const toPx = 0;

    const anim = animateHeight(panel, fromPx, toPx, { durationMs: 220 });
    animByPanel.set(panel, anim);

    anim.onfinish = () => {
      panel.hidden = true;
      panel.style.height = "";
      panel.style.overflow = "";
      animByPanel.delete(panel);
      if (focusToggle) toggle.focus();
    };

    anim.oncancel = () => {
      panel.style.height = "";
      panel.style.overflow = "";
      animByPanel.delete(panel);
    };
  }

  function openProject(projectEl) {
    const toggle = getToggle(projectEl);
    const panel = getPanel(projectEl);
    if (!toggle || !panel) return;

    if (isOpen(projectEl)) return;

    // soft rule: only one expanded per zone
    const zone = projectEl.closest(".zone");
    if (zone) {
      const openInZone = Array.from(zone.querySelectorAll(".project[data-project][data-open]"));
      for (const other of openInZone) {
        if (other !== projectEl) closeProject(other);
      }
    }

    stopAnim(panel);
    ensureAria(projectEl);

    setExpanded(projectEl, true);
    persistLastOpen(projectEl);

    if (MOTION.prefersReduced) {
      panel.hidden = false;
      panel.style.height = "";
      panel.style.overflow = "";
      return;
    }

    panel.hidden = false;

    const toPx = panel.scrollHeight;
    const fromPx = 0;

    const anim = animateHeight(panel, fromPx, toPx, { durationMs: 260 });
    animByPanel.set(panel, anim);

    anim.onfinish = () => {
      panel.style.height = "auto";
      panel.style.overflow = "";
      animByPanel.delete(panel);

      if (document.activeElement === toggle && toggle.matches(":focus-visible")) {
        try {
          panel.focus({ preventScroll: true });
        } catch {
          // ignore
        }
      }
    };

    anim.oncancel = () => {
      panel.style.height = "";
      panel.style.overflow = "";
      animByPanel.delete(panel);
    };
  }

  function toggleProject(projectEl) {
    if (isOpen(projectEl)) {
      closeProject(projectEl, { focusToggle: true });
    } else {
      openProject(projectEl);
    }
  }

  for (const projectEl of projects) {
    ensureAria(projectEl);

    const toggle = getToggle(projectEl);
    const panel = getPanel(projectEl);
    if (!toggle || !panel) continue;

    // Normalize initial state
    if (toggle.getAttribute("aria-expanded") !== "true") {
      toggle.setAttribute("aria-expanded", "false");
    }

    const onClick = (e) => {
      e.preventDefault();
      toggleProject(projectEl);
    };

    toggle.addEventListener("click", onClick);
    cleanup.push(() => toggle.removeEventListener("click", onClick));
  }

  try {
    const id = sessionStorage.getItem(LAST_OPEN_PROJECT_KEY);
    if (id) {
      const projectEl = root.querySelector(`.project[data-project="${CSS.escape(id)}"]`);
      if (projectEl) {
        const toggle = getToggle(projectEl);
        const panel = getPanel(projectEl);
        if (toggle && panel) {
          stopAnim(panel);
          ensureAria(projectEl);
          setExpanded(projectEl, true);
          panel.hidden = false;
          panel.style.height = "auto";
          panel.style.overflow = "";
        }
      }
    }
  } catch {
    // ignore
  }

  const onKeyDown = (e) => {
    if (e.key !== "Escape") return;

    const target = e.target;
    if (!(target instanceof Element)) return;

    const project = target.closest(".project[data-project]");
    if (project && isOpen(project)) {
      e.preventDefault();
      closeProject(project, { focusToggle: true });
      return;
    }

    const anyOpen = root.querySelector(".project[data-project][data-open]");
    if (anyOpen) {
      e.preventDefault();
      closeProject(anyOpen, { focusToggle: true });
    }
  };

  document.addEventListener("keydown", onKeyDown);
  cleanup.push(() => document.removeEventListener("keydown", onKeyDown));

  return {
    destroy() {
      for (const fn of cleanup) fn();
    },
  };
}

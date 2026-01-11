// Minimal, system-first theme controller.
// Updates ONLY: document.documentElement.dataset.theme = "light" | "dark".

const STORAGE_KEY = "theme";

function getStoredTheme() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

function getCurrentTheme() {
  const v = document.documentElement.dataset.theme;
  return v === "light" || v === "dark" ? v : "dark";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

function toggleTheme() {
  const next = getCurrentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  storeTheme(next);
  return next;
}

function setPressed(el, theme) {
  if (!el) return;
  el.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
}

export function createThemeController({ root = document } = {}) {
  const toggleEl = root.querySelector("[data-robot-theme-toggle]");
  if (!toggleEl) {
    console.warn("[theme] toggle not found");
    return {
      destroy() {},
      setTheme(theme) {
        applyTheme(theme);
        storeTheme(theme);
      },
    };
  }

  // Ensure aria matches current theme.
  setPressed(toggleEl, getCurrentTheme());

  function onActivate() {
    const next = toggleTheme();
    setPressed(toggleEl, next);
  }

  function onClick(e) {
    e.preventDefault();
    onActivate();
  }

  function onKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  }

  toggleEl.addEventListener("click", onClick);
  toggleEl.addEventListener("keydown", onKeyDown);

  return {
    destroy() {
      toggleEl.removeEventListener("click", onClick);
      toggleEl.removeEventListener("keydown", onKeyDown);
    },
    setTheme(theme) {
      if (theme !== "light" && theme !== "dark") return;
      applyTheme(theme);
      storeTheme(theme);
      setPressed(toggleEl, theme);
    },
    getTheme() {
      return getCurrentTheme();
    },
    getStoredTheme() {
      return getStoredTheme();
    },
  };
}

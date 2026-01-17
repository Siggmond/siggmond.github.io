"use client";

import { useRouter } from "next/navigation";

export function BackToProjectsButton() {
  const router = useRouter();

  function onClick() {
    try {
      // Best-effort: if there is a meaningful history stack, go back.
      if (typeof window !== "undefined") {
        const hasHistory = window.history.length > 1;
        const hasReferrer = typeof document !== "undefined" && Boolean(document.referrer);
        if (hasHistory && hasReferrer) {
          router.back();
          return;
        }
      }
    } catch {
      // ignore
    }

    router.push("/projects");
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 bg-foreground/[0.03] px-3 py-2 font-mono text-sm text-foreground/80 hover:border-foreground/25"
    >
      ← Back to Projects
    </button>
  );
}

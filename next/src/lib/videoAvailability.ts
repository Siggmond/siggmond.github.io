export function canReachVideo(videoUrl: string, signal?: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    let settled = false;
    let timeoutId: number | null = null;
    const onAbort = () => finish(false);

    const finish = (available: boolean) => {
      if (settled) return;
      settled = true;

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      if (signal) {
        signal.removeEventListener("abort", onAbort);
      }

      video.removeAttribute("src");
      video.load();

      resolve(available);
    };

    if (signal) {
      if (signal.aborted) {
        finish(false);
        return;
      }
      signal.addEventListener("abort", onAbort, { once: true });
    }

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("loadedmetadata", () => finish(true), { once: true });
    video.addEventListener("canplay", () => finish(true), { once: true });
    video.addEventListener("error", () => finish(false), { once: true });

    timeoutId = window.setTimeout(() => finish(false), 12000);
    video.src = videoUrl;
    video.load();
  });
}

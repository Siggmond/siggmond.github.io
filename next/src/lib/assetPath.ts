export function assetPath(p: string) {
  if (/^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(p) || p.startsWith("data:") || p.startsWith("blob:")) {
    return p;
  }
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalizedBase = base && base !== "/" ? base.replace(/\/$/, "") : "";
  const normalizedPath = p.startsWith("/") ? p : `/${p}`;
  return `${normalizedBase}${normalizedPath}`;
}

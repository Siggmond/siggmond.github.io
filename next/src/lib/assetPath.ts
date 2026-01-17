export function assetPath(p: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalizedBase = base && base !== "/" ? base.replace(/\/$/, "") : "";
  const normalizedPath = p.startsWith("/") ? p : `/${p}`;
  return `${normalizedBase}${normalizedPath}`;
}

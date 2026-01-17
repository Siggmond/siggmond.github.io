import type { NextConfig } from "next";

const repo = process.env.GITHUB_REPOSITORY?.split("/")?.[1] ?? "";
const isUserOrOrgSite = repo.endsWith(".github.io");
const inferredBasePath = !repo || isUserOrOrgSite ? "" : `/${repo}`;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? inferredBasePath;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  pageExtensions: ["ts", "tsx"],
};

export default nextConfig;

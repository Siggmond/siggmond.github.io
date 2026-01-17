import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: "",
  assetPrefix: "",
  pageExtensions: ["ts", "tsx"],
};

export default nextConfig;

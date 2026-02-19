import { createRequire } from "node:module";

const requireFromNext = createRequire(new URL("./next/package.json", import.meta.url));
const tailwindPostcss = requireFromNext("@tailwindcss/postcss");

const config = {
  plugins: [tailwindPostcss()],
};

export default config;

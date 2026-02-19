import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const rootNodeModules = path.join(rootDir, "node_modules");
const nextNodeModules = path.join(rootDir, "next", "node_modules");

if (!fs.existsSync(nextNodeModules)) {
  console.error(
    `[ensure-root-node-modules-link] Missing ${nextNodeModules}. Run "npm install" in "next" first.`,
  );
  process.exit(1);
}

if (fs.existsSync(rootNodeModules)) {
  process.exit(0);
}

try {
  fs.symlinkSync(nextNodeModules, rootNodeModules, process.platform === "win32" ? "junction" : "dir");
  console.log("[ensure-root-node-modules-link] Linked root node_modules to next/node_modules");
} catch (error) {
  console.error(
    `[ensure-root-node-modules-link] Failed to create node_modules link: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exit(1);
}

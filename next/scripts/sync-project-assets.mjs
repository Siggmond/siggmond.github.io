import fs from "node:fs";
import path from "node:path";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(srcDir, dstDir) {
  ensureDir(dstDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const ent of entries) {
    const src = path.join(srcDir, ent.name);
    const dst = path.join(dstDir, ent.name);
    if (ent.isDirectory()) {
      copyDir(src, dst);
    } else if (ent.isFile()) {
      fs.copyFileSync(src, dst);
    }
  }
}

const srcRoot = path.join(process.cwd(), "assets", "projects");
const dstRoot = path.join(process.cwd(), "public", "projects");

if (!fs.existsSync(srcRoot)) {
  console.log(`[sync-project-assets] No source folder found: ${srcRoot}`);
  process.exit(0);
}

ensureDir(dstRoot);

const slugs = fs
  .readdirSync(srcRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let copiedFiles = 0;
for (const slug of slugs) {
  const srcDir = path.join(srcRoot, slug);
  const dstDir = path.join(dstRoot, slug);

  // Copy everything each time (simple + deterministic)
  copyDir(srcDir, dstDir);

  const count = fs
    .readdirSync(dstDir, { withFileTypes: true })
    .filter((e) => e.isFile()).length;
  copiedFiles += count;
}

console.log(`[sync-project-assets] Synced ${slugs.length} project folders into ${dstRoot}`);
console.log(`[sync-project-assets] Note: file count is per top-level folder only (${copiedFiles})`);

import { mkdirSync, cpSync, existsSync } from "node:fs";
import path from "node:path";

const src = path.resolve("public/admin");
const dst = path.resolve("dist/admin");

if (!existsSync(src)) {
  console.error("[copy-admin] ❌ source not found:", src);
  process.exit(1);
}

mkdirSync(dst, { recursive: true });

// Node 18+에서 cpSync 사용 가능
cpSync(src, dst, { recursive: true });

console.log("[copy-admin] ✅ copied:", src, "->", dst);

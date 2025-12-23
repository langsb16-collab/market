import { mkdirSync, cpSync, existsSync } from "node:fs";
import path from "node:path";

// Copy admin folder
const adminSrc = path.resolve("public/admin");
const adminDst = path.resolve("dist/admin");

if (!existsSync(adminSrc)) {
  console.error("[copy-admin] ❌ admin source not found:", adminSrc);
  process.exit(1);
}

mkdirSync(adminDst, { recursive: true });
cpSync(adminSrc, adminDst, { recursive: true });
console.log("[copy-admin] ✅ copied:", adminSrc, "->", adminDst);

// Copy static folder
const staticSrc = path.resolve("public/static");
const staticDst = path.resolve("dist/static");

if (existsSync(staticSrc)) {
  mkdirSync(staticDst, { recursive: true });
  cpSync(staticSrc, staticDst, { recursive: true });
  console.log("[copy-admin] ✅ copied:", staticSrc, "->", staticDst);
} else {
  console.warn("[copy-admin] ⚠️ static source not found:", staticSrc);
}

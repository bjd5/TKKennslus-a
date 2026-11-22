#!/usr/bin/env node
/* skrifcheck.js – þýðir og keyrir fyrirmyndarlausnirnar í js/skrif-data.js og js/profhermir-data.js
 * með prófununum í test og ber úttakið saman við test.out. Keyrsla:  node tools/skrifcheck.js */
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const tasks = [];
for (const f of ["js/skrif-data.js", "js/profhermir-data.js"]) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
  ctx.window.TK.SKRIF.forEach((t) => tasks.push(Object.assign({ file: f }, t)));
}
const byId = {};
tasks.forEach((t) => (byId[t.id] = t));
const norm = (s) => String(s).replace(/\r/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/^\n+|\n+$/g, "");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "skrifcheck-"));
let errors = 0, run = 0;
for (const t of tasks) {
  if (!t.checks || !t.checks.length) { errors++; console.log("VILLA: " + t.id + ": vantar matsblað"); }
  if (!t.test) { console.log("ÁN PRÓFUNAR: " + t.id); continue; }
  const sol = t.solution.split("// í Main:")[0];
  let main = "", members = "", classes = "";
  if (t.test.kind === "main") main = t.solution;
  else if (t.test.kind === "members") { members = t.solution; main = t.test.main; }
  else { classes = sol; members = t.test.members || ""; main = t.test.main; }
  if (t.test.extra) classes = byId[t.test.extra.replace("skrif:", "")].solution + "\n" + classes;
  const dir = path.join(tmp, t.id.replace(/\W/g, "_"));
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, "Main.java"), "import java.util.*;\n\npublic class Main {\n" + members + "\npublic static void main(String[] args) throws Exception {\n" + main + "\n}\n}\n" + classes + "\n");
  try {
    execFileSync("javac", ["-nowarn", "-encoding", "UTF-8", "-d", dir, path.join(dir, "Main.java")], { stdio: "pipe" });
    const out = execFileSync("java", ["-cp", dir, "Main"], { input: t.test.in || "", encoding: "utf8" });
    run++;
    if (norm(out) !== norm(t.test.out)) { errors++; console.log("\nRANGT: " + t.id + "\n--- Java prentaði:\n" + out + "--- Vænt:\n" + t.test.out); }
  } catch (e) {
    errors++;
    console.log("\nVILLA í " + t.id + ":\n" + String(e.stderr || e.stdout || e.message).split("\n").slice(0, 15).join("\n"));
  }
}
console.log("\n" + tasks.length + " verkefni, " + run + " keyrð í Java. " + (errors ? errors + " villur." : "Allt passar."));
if (!errors) fs.rmSync(tmp, { recursive: true, force: true });
process.exit(errors ? 1 : 0);

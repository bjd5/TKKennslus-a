#!/usr/bin/env node
/* lesacheck.js – keyrir kóðadæmin í lesefninu (src/*.html) í Java og ber úttakið saman við það sem sýnt er.
 * Keyrsla úr möppu áfangans:  node tools/lesacheck.js
 * Dæmi er merkt  <pre class="code" data-run [data-in="inntak"]><code class="java">…</code></pre>
 * og úttakið er næsta  <pre class="out">…</pre>  á eftir því.
 * Kóðinn er settur inn í main, nema hann innihaldi línuna  // í main:  — þá fer það sem er fyrir ofan
 * hana inn í klasann Main (aðferðir) eða á eftir honum (ef þar eru klasar eða viðmót). */
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const un = (s) => s.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const norm = (s) => String(s).replace(/\r/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/^\n+|\n+$/g, "");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lesacheck-"));
const items = [];
for (const f of fs.readdirSync(path.join(ROOT, "src")).filter((f) => f.endsWith(".html")).sort()) {
  const html = fs.readFileSync(path.join(ROOT, "src", f), "utf8");
  const re = /<pre class="code" data-run(?:="[^"]*")?(?: data-in="([^"]*)")?><code class="java">([\s\S]*?)<\/code><\/pre>/g;
  let m;
  while ((m = re.exec(html))) {
    const rest = html.slice(re.lastIndex);
    const o = rest.match(/<pre class="out">([\s\S]*?)<\/pre>/);
    if (!o) { console.log("VANTAR ÚTTAK: " + f); continue; }
    const src = un(m[2]);
    let main = src, members = "", classes = "";
    const k = src.indexOf("// í main:");
    if (k !== -1) {
      const before = src.slice(0, k);
      main = src.slice(k + "// í main:".length);
      if (/^(abstract |public |final )*(class|interface) /m.test(before)) classes = before.replace(/^public (?=(abstract )?(class|interface))/gm, "");
      else members = before;
    }
    const line = html.slice(0, m.index).split("\n").length;
    items.push({ f, line, pkg: "e" + items.length, main, members, classes, input: m[1] ? un(m[1]).replace(/\\n/g, "\n") : "", out: un(o[1]) });
  }
}
for (const it of items) {
  fs.mkdirSync(path.join(tmp, it.pkg));
  fs.writeFileSync(path.join(tmp, it.pkg, "Main.java"), "package " + it.pkg + ";\nimport java.util.*;\n\npublic class Main {\n" + it.members + "\npublic static void main(String[] args) throws Exception {\n" + it.main + "\n}\n}\n" + it.classes + "\n");
}
const out = path.join(tmp, "out");
try {
  execFileSync("javac", ["-nowarn", "-encoding", "UTF-8", "-d", out].concat(items.map((i) => path.join(tmp, i.pkg, "Main.java"))), { stdio: "pipe" });
} catch (e) {
  const msg = String(e.stderr || e.message);
  const bad = new Set(msg.match(/e\d+(?=[\/\\]Main\.java)/g) || []);
  items.filter((i) => bad.has(i.pkg)).forEach((i) => console.log("ÞÝÐINGARVILLA: src/" + i.f + ":" + i.line));
  console.log(msg.split("\n").slice(0, 30).join("\n"));
  process.exit(1);
}
let errors = 0;
for (const it of items) {
  let got;
  try {
    got = execFileSync("java", ["-cp", out, it.pkg + ".Main"], { input: it.input, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
  } catch (e) { got = String(e.stdout || "") + "@@" + String(e.stderr || "").split("\n")[0]; }
  if (norm(got) !== norm(it.out)) {
    errors++;
    console.log("\nRANGT: src/" + it.f + ":" + it.line + "\n--- Java prentaði:\n" + got + "\n--- Síðan sýnir:\n" + it.out);
  }
}
console.log("\n" + items.length + " dæmi í lesefninu keyrð í Java. " + (errors ? errors + " gáfu annað úttak." : "Öll passa."));
if (!errors) fs.rmSync(tmp, { recursive: true, force: true });
process.exit(errors ? 1 : 0);

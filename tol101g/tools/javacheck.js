#!/usr/bin/env node
/* javacheck.js – keyrir kóðadæmin í alvöru Java og ber úttakið saman við svörin í bankanum.
 * Keyrsla úr möppu áfangans:  node tools/javacheck.js [fjöldi sýna á dæmi, sjálfgefið 12] [síun á heiti]
 * Þarf javac og java (JDK 17+). Hvert sýni verður sinn pakki (g<i>s<k>) með klasanum Main;
 * allt er þýtt í einu og keyrt í einni JVM sem fangar System.out fyrir hvert sýni.
 * Dæmi skilar  java: { main: "...", members: "...", classes: "..." }:
 *   main     setningar inni í main
 *   members  static aðferðir og fastar inni í Main
 *   classes  aðrir klasar og viðmót (efstu klasar í skránni, ekki public) */
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const N = +process.argv[2] || 12;
const FILTER = process.argv[3] || "";
const ctx = { window: {}, console, Math, Number, String, Array, Object, JSON, isNaN, isFinite, parseFloat };
ctx.window.window = ctx.window;
vm.createContext(ctx);
const files = ["js/bank.js"].concat(fs.readdirSync(path.join(ROOT, "js/q")).filter((f) => f.endsWith(".js")).sort().map((f) => "js/q/" + f));
for (const f of files) vm.runInContext("var TK = window.TK; " + fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
const B = ctx.window.TK.bank;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "javacheck-"));
const samples = [];
B.G.forEach((g, gi) => {
  const name = g.name || "G" + gi;
  if (FILTER && name.indexOf(FILTER) === -1) return;
  for (let k = 0; k < N; k++) {
    const d = g();
    if (!d.java) { if (!d.nojava && k === 0) console.log("ÁN JAVA: " + name); break; }
    const pkg = "g" + gi + "s" + k;
    const src = "package " + pkg + ";\nimport java.util.*;\n\npublic class Main {\n" + (d.java.members || "") +
      "\n  public static void main(String[] args) throws Exception {\n" + d.java.main + "\n  }\n}\n" + (d.java.classes || "") + "\n";
    fs.mkdirSync(path.join(tmp, pkg), { recursive: true });
    fs.writeFileSync(path.join(tmp, pkg, "Main.java"), src);
    samples.push({ pkg, name, d, file: path.join(tmp, pkg, "Main.java") });
  }
});
fs.writeFileSync(path.join(tmp, "Runner.java"), `
public class Runner {
  public static void main(String[] a) throws Exception {
    java.io.PrintStream orig = System.out;
    for (String p : a) {
      java.io.ByteArrayOutputStream b = new java.io.ByteArrayOutputStream();
      System.setOut(new java.io.PrintStream(b, true, "UTF-8"));
      String err = "";
      try { Class.forName(p + ".Main").getMethod("main", String[].class).invoke(null, (Object) new String[0]); }
      catch (java.lang.reflect.InvocationTargetException e) { err = "@@UNCAUGHT " + e.getCause(); }
      System.out.flush();
      System.setOut(orig);
      orig.print("@@BEGIN " + p + "\\n" + b.toString("UTF-8") + err + "\\n@@END\\n");
    }
  }
}`);
console.log("Þýði " + samples.length + " sýni í " + tmp + " …");
const out = path.join(tmp, "out");
try {
  execFileSync("javac", ["-nowarn", "-encoding", "UTF-8", "-d", out, path.join(tmp, "Runner.java")].concat(samples.map((s) => s.file)), { stdio: "pipe", maxBuffer: 1 << 26 });
} catch (e) {
  const msg = String(e.stderr || e.stdout || e.message);
  console.log(msg.split("\n").slice(0, 60).join("\n"));
  const bad = new Set((msg.match(/g\d+s\d+/g) || []));
  bad.forEach((p) => { const s = samples.find((x) => x.pkg === p); if (s) console.log("ÞÝÐINGARVILLA: " + s.name + " (" + p + ")"); });
  process.exit(1);
}
const res = execFileSync("java", ["-cp", out, "Runner"].concat(samples.map((s) => s.pkg)), { encoding: "utf8", maxBuffer: 1 << 26 });
const got = {};
res.replace(/@@BEGIN (\S+)\n([\s\S]*?)\n@@END\n/g, (_, p, o) => { got[p] = o; });
let errors = 0;
const shown = {};
samples.forEach((s) => {
  const o = got[s.pkg];
  const want = typeof s.d.answer === "string" ? s.d.answer : String(s.d.answer);
  const ok = typeof s.d.answer === "string" ? B.isRight(s.d, o) === true : B.isRight(s.d, o) === true;
  if (!ok) {
    errors++;
    if ((shown[s.name] = (shown[s.name] || 0) + 1) <= 2) {
      console.log("\nRANGT: " + s.name + " (" + s.pkg + ")\n--- Java prentaði:\n" + o + "\n--- Bankinn segir:\n" + want);
    }
  }
});
const names = [...new Set(samples.map((s) => s.name))];
console.log("\n" + names.length + " dæmi, " + samples.length + " sýni keyrð í Java. " + (errors ? errors + " sýni gáfu annað úttak." : "Öll úttök passa."));
if (!errors) fs.rmSync(tmp, { recursive: true, force: true });
process.exit(errors ? 1 : 0);

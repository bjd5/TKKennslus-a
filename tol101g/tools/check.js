#!/usr/bin/env node
/* check.js – yfirfer spurningabankann og flashcards án vafra.
 * Keyrsla úr möppu áfangans:  node tools/check.js
 * Athugar: lögun MC-spurninga, tvítekningar, að hvert kóðadæmi skili svari (300 keyrslur hvert),
 * að efnisflokkar séu til, verkstæðin og fjölda spurninga í hverjum kafla.
 * Úttak kóðadæmanna er borið saman við alvöru Java í tools/javacheck.js. */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const ctx = { window: {}, console, Math, Number, String, Array, Object, JSON, isNaN, isFinite, parseFloat };
ctx.window.window = ctx.window;
vm.createContext(ctx);
const run = (f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8").replace(/\bwindow\b/g, "window"), ctx, { filename: f });

const files = ["js/bank.js"]
  .concat(fs.readdirSync(path.join(ROOT, "js/q")).filter((f) => f.endsWith(".js")).sort().map((f) => "js/q/" + f))
  .concat(fs.existsSync(path.join(ROOT, "js/cards")) ? fs.readdirSync(path.join(ROOT, "js/cards")).filter((f) => f.endsWith(".js")).sort().map((f) => "js/cards/" + f) : []);
ctx.TK = undefined;
let errors = 0;
const err = (m) => { errors++; console.log("VILLA: " + m); };
for (const f of files) {
  try { vm.runInContext("var TK = window.TK; " + fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f }); }
  catch (e) { err(f + ": " + e.message); }
}
const TK = ctx.window.TK;
const B = TK.bank;
const topics = new Set(B.TOPICS.map((t) => t.id));
const count = {};
B.TOPICS.forEach((t) => (count[t.id] = { mc: 0, g: 0, cards: 0 }));

const seen = new Set();
B.MC.forEach((m, i) => {
  const id = "MC #" + i + " (" + String(m.q).slice(0, 50) + ")";
  if (!topics.has(m.topic)) err(id + ": óþekkt topic " + m.topic);
  else count[m.topic].mc++;
  if (typeof m.q !== "string" || !m.q) err(id + ": vantar q");
  if (!Array.isArray(m.o) || m.o.length < 3) err(id + ": o þarf a.m.k. 3 möguleika");
  if (m.c !== 0) err(id + ": c á að vera 0 (rétta svarið fyrst)");
  if (typeof m.e !== "string" || !m.e) err(id + ": vantar skýringu e");
  if (Array.isArray(m.o) && new Set(m.o).size !== m.o.length) err(id + ": tvítekinn svarmöguleiki");
  if (seen.has(m.q)) err(id + ": tvítekin spurning");
  seen.add(m.q);
});

B.G.forEach((g, i) => {
  const name = g.name || "G #" + i;
  for (let k = 0; k < 300; k++) {
    let d;
    try { d = g(); } catch (e) { err(name + ": kastaði villu: " + e.message); break; }
    if (!topics.has(d.topic)) { err(name + ": óþekkt topic " + d.topic); break; }
    if (k === 0) count[d.topic].g++;
    if (!d.title || !d.text || !d.sol) { err(name + ": vantar title, text eða sol"); break; }
    if (/NaN|undefined|Infinity/.test(d.text + d.sol + d.answer)) { err(name + ": NaN/undefined/Infinity í texta, lausn eða svari"); break; }
    if (typeof d.answer === "string") {
      if (!B.normOut(d.answer)) { err(name + ": tómt svar"); break; }
      if (B.isRight(d, d.answer) !== true) { err(name + ": svarið sjálft telst ekki rétt"); break; }
      if (!d.java && !d.nojava) { err(name + ": vantar java (eða nojava: true)"); break; }
    } else {
      if (typeof d.answer !== "number" || !isFinite(d.answer)) { err(name + ": svar ekki strengur eða endanleg tala (" + d.answer + ")"); break; }
      if (!B.isRight(d, String(d.answer))) { err(name + ": svarið sjálft telst ekki rétt"); break; }
    }
  }
});

// Verkstæðin: hlaða js/verkstaedi.js og js/w/*.js og athuga lögun verkefna
ctx.window.store = { get: (k, d) => d, set: () => {} };
const ws = {};
ctx.window.TK.widget = () => {};
const origWS = () => {};
try {
  vm.runInContext(fs.readFileSync(path.join(ROOT, "js/verkstaedi.js"), "utf8"), ctx, { filename: "js/verkstaedi.js" });
  const real = ctx.window.TK.workshop;
  ctx.window.TK.workshop = (id, tasks) => { ws[id] = tasks; real(id, tasks); };
  const wdir = path.join(ROOT, "js/w");
  for (const f of fs.readdirSync(wdir).filter((f) => f.endsWith(".js")).sort()) {
    try { vm.runInContext(fs.readFileSync(path.join(wdir, f), "utf8"), ctx, { filename: "js/w/" + f }); } catch (e) { err("js/w/" + f + ": " + e.message); }
  }
} catch (e) { err("verkstaedi.js: " + e.message); }
const GAP = /\[\[(.*?)\]\]/g;
Object.keys(ws).forEach((id) => {
  ws[id].forEach((t, i) => {
    const tid = id + " verkefni " + (i + 1) + " (" + t.title + ")";
    if (!t.title) err(tid + ": vantar title");
    if (t.type === "parsons") { if (!Array.isArray(t.lines) || t.lines.length < 3) err(tid + ": of fáar línur"); }
    else if (t.type === "gaps") { const g = String(t.code).match(GAP) || []; if (!g.length) err(tid + ": engar eyður"); g.forEach((x) => { if (/^\[\[\[|\[\[[^\]]*\[/.test(x)) err(tid + ": hornklofi inni í eyðu " + x); }); }
    else if (t.type === "bug") { const n = String(t.code).replace(/^\n/, "").replace(/\s+$/, "").split("\n").length; [].concat(t.bug).forEach((b) => { if (!(b >= 0 && b < n)) err(tid + ": bug utan kóðans"); }); if (!t.explain) err(tid + ": vantar explain"); }
    else if (t.type === "trace") { for (let k = 0; k < (t.gen ? 50 : 1); k++) { const d = t.gen ? t.gen() : t; const nc = (d.cols || t.cols).length; if (!d.rows.length || d.rows.some((r) => r.length !== nc)) { err(tid + ": raðir passa ekki við dálka"); break; } if (/NaN|undefined/.test(JSON.stringify(d))) { err(tid + ": NaN/undefined"); break; } } }
    else if (t.type === "match") { if (!t.pairs || t.pairs.length < 3) err(tid + ": of fá pör"); if (new Set(t.pairs.map((p) => p[1])).size < 3) err(tid + ": of fá ólík svör"); }
    else err(tid + ": óþekkt type " + t.type);
  });
});
for (let n = 1; n <= B.TOPICS.length; n++) if (!ws["kafli-" + n]) err("Verkstæði vantar fyrir kafla " + n);

(TK.CARDS || []).forEach((c, i) => {
  if (!topics.has(c.c)) err("Spjald #" + i + ": óþekkt c " + c.c);
  else count[c.c].cards++;
  if (!c.q || !c.a) err("Spjald #" + i + ": vantar q eða a");
});

console.log("\nEfni              MC   G  spjöld  verkst.");
B.TOPICS.forEach((t) => {
  const c = count[t.id];
  const w = ws["kafli-" + (B.TOPICS.indexOf(t) + 1)];
  console.log(t.id.padEnd(16) + String(c.mc).padStart(4) + String(c.g).padStart(4) + String(c.cards).padStart(8) + String(w ? w.length : 0).padStart(9));
});
console.log("\nSamtals: " + B.MC.length + " MC, " + B.G.length + " kóðadæmi, " + (TK.CARDS || []).length + " spjöld");
console.log(errors ? "\n" + errors + " villur." : "\nEngar villur.");
process.exit(errors ? 1 : 0);

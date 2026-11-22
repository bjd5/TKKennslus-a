#!/usr/bin/env node
/* check.js – yfirfer spurningabankann og flashcards án vafra.
 * Keyrsla úr möppu áfangans:  node tools/check.js
 * Athugar: lögun MC-spurninga, tvítekningar, að hvert reiknidæmi skili endanlegri tölu
 * (300 keyrslur hvert), að efnisflokkar séu til og fjölda spurninga í hverjum kafla. */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const ctx = { window: {}, console, Math, Number, String, Array, Object, JSON, isNaN, isFinite, parseFloat };
ctx.window.window = ctx.window;
vm.createContext(ctx);
const run = (f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8").replace(/\bwindow\b/g, "window"), ctx, { filename: f });

const files = ["js/stat.js", "js/bank.js"]
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
    if (typeof d.answer !== "number" || !isFinite(d.answer)) { err(name + ": svar ekki endanleg tala (" + d.answer + ")"); break; }
    if (!d.title || !d.text || !d.sol) { err(name + ": vantar title, text eða sol"); break; }
    if (/NaN|undefined|Infinity/.test(d.text + d.sol)) { err(name + ": NaN/undefined/Infinity í texta eða lausn"); break; }
    if (!(d.tol > 0) && !(d.absTol > 0)) { err(name + ": vantar tol eða absTol"); break; }
    if (!B.isRight(d, B.is(d.answer, 4))) { err(name + ": birt svar (4 marktækir) telst ekki rétt"); break; }
  }
});

(TK.CARDS || []).forEach((c, i) => {
  if (!topics.has(c.c)) err("Spjald #" + i + ": óþekkt c " + c.c);
  else count[c.c].cards++;
  if (!c.q || !c.a) err("Spjald #" + i + ": vantar q eða a");
});

console.log("\nEfni            MC   G  spjöld");
B.TOPICS.forEach((t) => {
  const c = count[t.id];
  console.log(t.id.padEnd(14) + String(c.mc).padStart(4) + String(c.g).padStart(4) + String(c.cards).padStart(8));
});
console.log("\nSamtals: " + B.MC.length + " MC, " + B.G.length + " reiknidæmi, " + (TK.CARDS || []).length + " spjöld");
console.log(errors ? "\n" + errors + " villur." : "\nEngar villur.");
process.exit(errors ? 1 : 0);

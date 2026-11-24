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
const kinds = {};
B.MC.forEach((m, i) => {
  const k = m.kind || "mc";
  kinds[k] = (kinds[k] || 0) + 1;
  const id = k + " #" + i + " (" + String(m.q).slice(0, 50) + ")";
  if (!topics.has(m.topic)) err(id + ": óþekkt topic " + m.topic);
  else count[m.topic].mc++;
  if (typeof m.q !== "string" || !m.q) err(id + ": vantar q");
  if (typeof m.e !== "string" || !m.e) err(id + ": vantar skýringu e");
  if (/undefined|NaN/.test(JSON.stringify(m))) err(id + ": undefined/NaN í texta");
  if (k === "mc") {
    if (!Array.isArray(m.o) || m.o.length < 3) err(id + ": o þarf a.m.k. 3 möguleika");
    if (m.c !== 0) err(id + ": c á að vera 0 (rétta svarið fyrst)");
    if (Array.isArray(m.o) && new Set(m.o).size !== m.o.length) err(id + ": tvítekinn svarmöguleiki");
  } else if (k === "tf") {
    if (typeof m.a !== "boolean") err(id + ": a þarf að vera true eða false");
    if (/^(rétt|rangt)/i.test(m.q)) err(id + ": q á að vera fullyrðing");
  } else if (k === "multi") {
    if (!Array.isArray(m.o) || m.o.length < 4 || m.o.length > 7) err(id + ": multi þarf 4-7 möguleika");
    if (!Array.isArray(m.c) || m.c.length < 2 || m.c.length >= (m.o || []).length) err(id + ": multi þarf 2 eða fleiri rétt svör og a.m.k. eitt rangt");
    else if (m.c.some((x) => !Number.isInteger(x) || x < 0 || x >= m.o.length) || new Set(m.c).size !== m.c.length) err(id + ": ógild vísun í c");
    if (Array.isArray(m.o) && new Set(m.o).size !== m.o.length) err(id + ": tvítekinn svarmöguleiki");
  } else if (k === "match") {
    if (!Array.isArray(m.pairs) || m.pairs.length < 3 || m.pairs.length > 6) err(id + ": match þarf 3-6 pör");
    else {
      const all = m.pairs.map((r) => r[1]).concat(m.extra || []);
      if (new Set(all).size !== all.length) err(id + ": tvítekið svar í pörun");
      if (new Set(m.pairs.map((r) => r[0])).size !== m.pairs.length) err(id + ": tvítekið atriði í pörun");
      if (m.pairs.some((r) => r.length !== 2 || !r[0] || !r[1])) err(id + ": par þarf tvö gildi");
    }
  } else if (k === "drag") {
    if (!Array.isArray(m.cats) || m.cats.length < 2 || m.cats.length > 4) err(id + ": drag þarf 2-4 flokka");
    else if (!Array.isArray(m.items) || m.items.length < 4 || m.items.length > 9) err(id + ": drag þarf 4-9 atriði");
    else {
      if (m.items.some((it) => !it[0] || !Number.isInteger(it[1]) || it[1] < 0 || it[1] >= m.cats.length)) err(id + ": ógilt flokkanúmer í items");
      for (let c = 0; c < m.cats.length; c++) if (!m.items.some((it) => it[1] === c)) err(id + ": flokkur " + c + " er tómur");
      if (new Set(m.items.map((it) => it[0])).size !== m.items.length) err(id + ": tvítekið atriði");
    }
  } else err(id + ": óþekkt kind " + k);
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
console.log("\nGerðir: " + Object.keys(kinds).map((k) => k + " " + kinds[k]).join(", "));
console.log("\nSamtals: " + B.MC.length + " MC, " + B.G.length + " reiknidæmi, " + (TK.CARDS || []).length + " spjöld");
console.log(errors ? "\n" + errors + " villur." : "\nEngar villur.");
process.exit(errors ? 1 : 0);

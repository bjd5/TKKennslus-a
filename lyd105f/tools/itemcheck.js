// Prófar dæmavélarnar í js/q/lyd.js gegn R:  node tools/itemcheck.js
const fs = require("fs"), vm = require("vm"), { execFileSync } = require("child_process");
const ctx = { window: {}, Math, console, document: { addEventListener() {} } };
ctx.window.addEventListener = () => {};
vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(__dirname + "/../js/" + f, "utf8"), ctx, { filename: f });
load("stat.js"); load("lab.js"); load("q/lyd.js");
const I = ctx.window.Items, A = ctx.window.App;
const RUNS = 300, rjobs = [];
let total = 0; const info = {};
for (const g of I.GEN) {
  const errs = {}; const bump = m => (errs[m] = (errs[m] || 0) + 1);
  for (let i = 0; i < RUNS; i++) {
    let t; try { t = I.make(g); } catch (e) { bump("kast: " + e.message); continue; }
    const text = [t.q, t.ex, t.r].join(" ");
    if (/undefined|NaN|Infinity/.test(text)) bump("undefined/NaN í texta");
    if (t.type === "num") {
      if (!isFinite(t.a)) bump("svar ekki endanlegt");
      const d = t.d == null ? 3 : Math.max(t.d, 2);
      (t.wrong || []).forEach(w => { if (A.fmt(w, d) === A.fmt(t.a, d)) info[g.name] = (info[g.name] || 0) + 1; });
      if (!A.close(t.a, t.a, t.tol)) bump("svar stenst ekki eigin vikmörk");
      if (i < 4 && t.r) rjobs.push({ g: g.skill + "/" + g.name, r: t.r.split("\n").filter(l => !/^\s*#/.test(l))[t.r.split("\n").filter(l => !/^\s*#/.test(l)).length > 1 && /<-/.test(t.r) ? 1 : 0].replace(/#.*$/, ""), full: t.r, a: t.a, tol: t.tol, d: t.d });
    } else {
      if (!(t.opts && t.opts[t.a] != null)) bump("mc vísir rangur");
    }
    const m = I.toMC(t);
    if (m.opts.length !== 5) bump("toMC: " + m.opts.length + " kostir");
    if (new Set(m.opts).size !== m.opts.length) bump("toMC: tvítekinn kostur");
    if (!(m.a >= 0 && m.a < m.opts.length)) bump("toMC: rangt a");
    if (t.type === "num" && m.a !== 4) {
      const d = t.d == null ? 3 : Math.max(t.d, 2);
      if (m.opts[m.a] !== A.fmt(t.a, d)) bump("toMC: rétti kosturinn ekki svarið");
    }
  }
  const e = Object.entries(errs);
  total += e.length;
  console.log((e.length ? "VILLA " : "ok    ") + (g.skill + "/" + g.name).padEnd(24) + (e.length ? JSON.stringify(errs) : ""));
}
// Sannreyna svör með R
const prog = "options(digits=15);" + rjobs.map(j => `local({v<-tryCatch({e<-parse(text=${JSON.stringify(j.full.replace(/#.*$/gm, ""))});r<-c();for(x in e) r<-c(r,suppressWarnings(as.numeric(eval(x))));r},error=function(e)NA);a<-${j.a};cat(v[which.min(abs(v-a))],'\\n')})`).join(";");
fs.writeFileSync(__dirname + "/.itemcheck.R", prog);
const out = execFileSync("Rscript", [__dirname + "/.itemcheck.R"]).toString().trim().split(/\s+/).map(Number);
fs.unlinkSync(__dirname + "/.itemcheck.R");
let rb = 0;
rjobs.forEach((j, i) => {
  const v = out[i], tol = j.tol || { rel: 0.012, abs: 0.0006 };
  if (!A.close(v, j.a, tol)) { rb++; console.log("R-MUNUR", j.g, j.r, "JS:", j.a, "R:", v); }
});
console.log(`R-samanburður: ${rjobs.length - rb}/${rjobs.length} passa`);
console.log("Truflari sem rúnnast að svarinu (toMC sleppir honum):", JSON.stringify(info));
console.log(`Hugtakaspurningar: ${I.CONCEPTS.length}`);
I.CONCEPTS.forEach(c => { if (!(c.opts[c.a])) { total++; console.log("VILLA hugtak", c.id); } });
process.exit(total + rb ? 1 : 0);

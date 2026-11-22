// Yfirfer spurningabankann og spjöldin:  node tools/bankcheck.js [R-sýni]
// Hleður js/stat.js, js/bank.js, js/q/*.js og js/cards/*.js, telur eftir köflum, keyrir hvert reiknidæmi 300 sinnum,
// athugar lögun krossaspurninga og ber sýni af svörum saman við R (fyrsta lína R-kóðans í lausninni).
const fs = require("fs"), vm = require("vm"), path = require("path"), { execFileSync } = require("child_process");
const ROOT = path.join(__dirname, "..");
const w = { Math, console }; w.window = w; vm.createContext(w);
const files = ["js/stat.js", "js/bank.js"].concat(fs.readdirSync(ROOT + "/js/q").sort().map(f => "js/q/" + f), fs.readdirSync(ROOT + "/js/cards").sort().map(f => "js/cards/" + f));
files.forEach(f => vm.runInContext(fs.readFileSync(ROOT + "/" + f, "utf8"), w, { filename: f }));
const B = w.TK.bank, CARDS = w.TK.CARDS || [];
const CH = [["breytur"], ["lysandi"], ["binom", "poisson"], ["normal", "clt"], ["oryggisbil"], ["tilgatur", "ttest"], ["hlutfoll"], ["anova"], ["adhvarf"], ["tvikosta", "naemi"], ["lifun"]];
let bad = 0;
const err = m => { bad++; console.log("VILLA", m); };
const topics = B.TOPICS.map(t => t.id);
// MC
const seenQ = {};
B.MC.forEach((m, i) => {
  if (topics.indexOf(m.topic) < 0) err("MC óþekkt efni " + m.topic);
  if (!Array.isArray(m.o) || m.o.length !== 4) err("MC " + i + " hefur " + (m.o || []).length + " kosti: " + m.q.slice(0, 60));
  if (new Set(m.o).size !== m.o.length) err("MC tvítekinn kostur: " + m.q.slice(0, 60));
  if (m.c !== 0) err("MC c != 0");
  if (!m.e) err("MC án skýringar: " + m.q.slice(0, 60));
  if (seenQ[m.q]) err("MC tvítekin spurning: " + m.q.slice(0, 80));
  seenQ[m.q] = 1;
  if (/undefined|NaN/.test(m.q + m.o.join("") + m.e)) err("MC undefined/NaN: " + m.q.slice(0, 60));
});
// G
const samples = [];
B.G.forEach(g => {
  const name = g.name || "?";
  for (let k = 0; k < 300; k++) {
    let d;
    try { d = g(); } catch (e) { err("G " + name + " kastar: " + e.message); break; }
    if (topics.indexOf(d.topic) < 0) { err("G " + name + " óþekkt efni"); break; }
    if (!isFinite(d.answer)) { err("G " + name + " svar " + d.answer); break; }
    if (/undefined|NaN|Infinity/.test(d.text + d.sol + d.title)) { err("G " + name + " undefined/NaN í texta: " + (d.text + d.sol).slice(0, 200)); break; }
    if (!d.title) { err("G " + name + " án titils"); break; }
    if (k < 3) {
      const m = /<pre class="rcode">([^<\n]*)/.exec(d.sol);
      if (m && !/&lt;|<-/.test(m[1])) samples.push([name, m[1].replace(/&gt;/g, ">").replace(/#.*$/, "").trim(), d.answer, d.tol, d.absTol]);
    }
  }
});
// Spjöld
CARDS.forEach(c => { if (topics.indexOf(c.c) < 0) err("Spjald óþekkt efni " + c.c); if (!c.q || !c.a) err("Spjald án texta"); });
// Talning
console.log("kafli  MC  G  spjöld");
CH.forEach((ts, i) => {
  const mc = B.MC.filter(m => ts.indexOf(m.topic) >= 0).length;
  const g = B.G.filter(x => ts.indexOf(x.topic || (x.topic = x().topic)) >= 0).length;
  const c = CARDS.filter(x => ts.indexOf(x.c) >= 0).length;
  console.log(String(i + 1).padStart(5), String(mc).padStart(4), String(g).padStart(3), String(c).padStart(6), mc < 25 ? "  <25 MC" : "", i > 0 && g < 6 ? "  <6 G" : "");
});
console.log("Alls: MC", B.MC.length, "G", B.G.length, "spjöld", CARDS.length);
// R-samanburður
if (samples.length) {
  const code = "options(digits=15);" + samples.map((s, i) => "v<-tryCatch({" + s[1] + "}, error=function(e) NA); cat('@" + "', " + i + ", if (length(v) == 1) v else NA, '\\n')").join(";");
  const out = [];
  try {
    const tmp = path.join(require("os").tmpdir(), "bankcheck-" + process.pid + ".R"); fs.writeFileSync(tmp, code.replace(/;v<-/g, "\nv<-")); const so = execFileSync("Rscript", [tmp], { stdio: ["ignore", "pipe", "pipe"] }).toString(); fs.unlinkSync(tmp); so.split("\n").forEach(l => { const m = /^@ (\d+) (\S+)/.exec(l.trim()); if (m) out[+m[1]] = Number(m[2]); });
  } catch (e) { console.log("R keyrðist ekki:", e.message.slice(0, 300)); }
  let ok = 0, chk = 0;
  samples.forEach((s, i) => {
    const r = out[i]; if (!isFinite(r)) return;
    chk++;
    const tol = Math.max((s[3] || 0.02) * Math.abs(s[2]), s[4] || 0, 1e-9);
    if (Math.abs(r - s[2]) <= tol) ok++; else err("R: " + s[0] + " JS " + s[2] + " R " + r + " (" + s[1] + ")");
  });
  console.log("R-samanburður:", ok + "/" + chk, "passa (" + (samples.length - chk) + " án beins tölugildis í R-kóða)");
}
console.log(bad ? bad + " villur" : "Engar villur");

/* Yfirfer allt efnið í node: hver kafli og hvert dæmi keyrt oft með slembitölum.
   Athugar að svörin séu endanlegar tölur, að allur TeX þýðist í KaTeX, að jöfnutilvísanir séu til
   og að jöfnuspurningarnar hafi fjóra ólíka svarmöguleika.  Keyrsla:  node tools/check.js */
"use strict";
var path = require("path"), fs = require("fs");
var dir = path.join(__dirname, "..");
global.katex = require(path.join(dir, "vendor/katex/katex.min.js"));
require(path.join(dir, "js/core.js"));
var E = globalThis.EDL;
var html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
(html.match(/js\/(kaflar\/k\d+|lokaprof|synisprof)\.js/g) || []).forEach(function (f) { if (fs.existsSync(path.join(dir, f))) require(path.join(dir, f)); else console.log("(vantar " + f + ")"); });

var errors = 0, N = 300;
function err(where, msg) { errors++; if (errors < 60) console.log("✗ " + where + ": " + msg); }
function tex(where, s) {
  String(s).replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, function (m, a, b) {
    try { katex.renderToString(a || b, { throwOnError: true }); } catch (e) { err(where, "TeX: " + e.message.slice(0, 120) + " ‹" + (a || b).slice(0, 80) + "›"); }
  });
  if ((String(s).replace(/\$\$[\s\S]+?\$\$/g, "").match(/\$/g) || []).length % 2) err(where, "stakir $ í: " + String(s).slice(0, 80));
}
function checkInst(where, inst) {
  if (!inst || !inst.text || !inst.parts || !inst.parts.length || !inst.steps) return err(where, "vantar text/parts/steps");
  tex(where, inst.text); if (inst.hint) tex(where, inst.hint);
  inst.steps.forEach(function (s) { tex(where, s); });
  inst.parts.forEach(function (p, j) {
    if (typeof p.ans !== "number" || !isFinite(p.ans)) err(where, "liður " + j + " svar er ekki tala: " + p.ans);
    else if (p.ans === 0) err(where, "liður " + j + " svar er 0 (hlutfallsleg skekkja virkar ekki)");
    tex(where, p.label);
    tex(where, E.q(p.ans, p.unit));
  });
}

var nums = { ch: 0, eq: 0, pr: 0, ex: 0 };
E.chapters.forEach(function (ch, i) {
  nums.ch++;
  if (ch.n !== i + 1) err(ch.id, "röng númer " + ch.n);
  tex(ch.id, ch.intro);
  if (ch.problems.length < E.PRACTICE) err(ch.id, "of fá dæmi");
  var ids = {};
  ch.eqs.forEach(function (e) {
    nums.eq++;
    if (ids[e.id]) err(ch.id, "tvítekin jafna " + e.id); ids[e.id] = 1;
    tex(ch.id + "/" + e.id, "$" + e.tex + "$"); tex(ch.id + "/" + e.id, e.about);
    (e.vars || []).forEach(function (v) { tex(ch.id + "/" + e.id, "$" + v[0] + "$"); tex(ch.id + "/" + e.id, v[1]); });
    if (e.fill) {
      if (e.fill.tex.indexOf("□") < 0) err(e.id, "fill.tex vantar □");
      if (e.fill.wrong.length < 3) err(e.id, "of fáir rangir möguleikar");
      if (e.fill.wrong.indexOf(e.fill.ans) >= 0) err(e.id, "rétta svarið er líka í wrong");
    }
    E.eqTypes(ch, e).forEach(function (t) {
      for (var k = 0; k < 20; k++) {
        var q = E.eqQuestion(ch, e, t);
        tex(e.id + "/" + t, q.prompt); q.options.forEach(function (o) { tex(e.id + "/" + t, o); });
        if (q.options.length !== 4) err(e.id + "/" + t, "fjöldi möguleika " + q.options.length);
        if (new Set(q.options).size !== q.options.length) err(e.id + "/" + t, "tvíteknir möguleikar");
        if (q.answer < 0) err(e.id + "/" + t, "rétta svarið vantar");
      }
    });
  });
  var pids = {};
  ch.problems.forEach(function (p) {
    nums.pr++;
    if (pids[p.id]) err(ch.id, "tvítekið dæmi " + p.id); pids[p.id] = 1;
    (p.eqs || []).forEach(function (id) { if (!ids[id]) err(ch.id + "/" + p.id, "óþekkt jafna " + id); });
    for (var k = 0; k < N; k++) checkInst(ch.id + "/" + p.id, p.gen(E.R, E));
  });
});
var groups = {};
E.exam.forEach(function (p) {
  nums.ex++; groups[p.group] = (groups[p.group] || 0) + 1;
  if (!p.source) err(p.id, "vantar source");
  for (var k = 0; k < N; k++) checkInst("próf/" + p.id, p.gen(E.R, E));
});
if (E.samples) E.samples.problems.forEach(function (p) {
  nums.sy = (nums.sy || 0) + 1; checkInst("sýni/" + p.id, p.gen(E.R, E));
  if (p.img && !fs.existsSync(path.join(dir, p.img))) err(p.id, "vantar mynd " + p.img);
});
// Tölulesari
[["1,5", 1.5], ["-2.5e3", -2500], ["3·10^-4", 3e-4], ["1.2×10^{5}", 1.2e5], [" 42 ", 42], ["abc", NaN]].forEach(function (c) {
  var v = E.parse(c[0]);
  if (!(v === c[1] || (isNaN(v) && isNaN(c[1])))) err("parse", c[0] + " → " + v);
});
console.log(nums.ch + " kaflar, " + nums.eq + " jöfnur, " + nums.pr + " æfingadæmi, " + nums.ex + " prófdæmi, " + (nums.sy || 0) + " sýnidæmi kennarans, í " + Object.keys(groups).length + " hlutum " + JSON.stringify(groups));
console.log(errors ? errors + " villur" : "Allt í lagi ✓");
process.exit(errors ? 1 : 0);

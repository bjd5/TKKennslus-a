// Athugar hvort spurningarnar birtist vel: node tools/rendercheck.js
// Leitar að blokkareiningum í svarmöguleikum, löngum línum í <pre>, ójöfnum KaTeX-afmörkunum,
// óbirtanlegum gildum, tvíteknum kostum og ólokuðum HTML-merkjum.
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.resolve(__dirname, "..");
const ctx = { window: {}, Math, console }; ctx.window.window = ctx.window; vm.createContext(ctx);
const files = ["js/stat.js", "js/bank.js"].concat(fs.readdirSync(path.join(ROOT, "js/q")).sort().map(f => "js/q/" + f));
for (const f of files) vm.runInContext("var TK = window.TK; " + fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
const B = ctx.window.TK.bank, probs = [];
const strip = s => String(s).replace(/<[^>]+>/g, "").slice(0, 70);
function tags(html, where) {
  const stack = [], voids = new Set(["br", "img", "hr", "input", "wbr"]);
  for (const m of String(html).matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*?(\/?)>/g)) {
    const t = m[1].toLowerCase(); if (voids.has(t) || m[2]) continue;
    if (m[0][1] === "/") { if (stack.pop() !== t) { probs.push("ólokað merki <" + t + "> " + where); return; } } else stack.push(t);
  }
  if (stack.length) probs.push("ólokað merki <" + stack.join(",") + "> " + where);
}
function check(html, where, isOpt) {
  html = String(html);
  if (/undefined|NaN|\[object/.test(strip(html))) probs.push("undefined/NaN: " + where);
  if (isOpt && /<(pre|table|p|div|ul|ol|h\d)\b/.test(html)) probs.push("blokk í svarmöguleika: " + where);
  const noCode = html.replace(/<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>/g, "");
  if ((noCode.match(/\$/g) || []).length % 2) probs.push("ójafnt $: " + where);
  for (const m of html.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g)) {
    const mx = Math.max(...m[1].replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "x").split("\n").map(l => l.length));
    if (mx > 72) probs.push("pre-lína " + mx + " stafir: " + where);
  }
  tags(html, where);
}
B.MC.forEach((m, i) => {
  const w = "MC " + m.topic + " „" + strip(m.q) + "“";
  check(m.q, w); m.o.forEach(o => check(o, w + " [kostur]", true)); check(m.e || "", w + " [skýring]");
  if (new Set(m.o.map(o => strip(o).trim())).size !== m.o.length) probs.push("tvítekinn kostur: " + w);
  if (m.o.length !== 4) probs.push(m.o.length + " kostir: " + w);
});
B.G.forEach(g => { for (let i = 0; i < 40; i++) { const d = g(); const w = "G " + d.topic + " " + d.title; check(d.text, w); check(d.sol, w + " [lausn]"); } });
const uniq = [...new Set(probs)];
uniq.forEach(p => console.log("•", p));
console.log(uniq.length ? uniq.length + " atriði" : "Engin vandamál: " + B.MC.length + " krossaspurningar og " + B.G.length + " dæmavélar");

// Ber stat.js saman við R:  node tools/statcheck.js
const fs = require("fs"), vm = require("vm"), { execFileSync } = require("child_process");
const ctx = { window: {}, Math }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + "/../js/stat.js", "utf8"), ctx);
const S = ctx.window.Stat;
const cases = [
  ["pnorm(1.96)", S.pnorm(1.96)], ["pnorm(-0.5)", S.pnorm(-0.5)], ["pnorm(100,75,13,lower.tail=FALSE)", S.pnorm(100,75,13,false)],
  ["pnorm(-6.2)", S.pnorm(-6.2)], ["pnorm(8)", S.pnorm(8)], ["pnorm(-9)", S.pnorm(-9)],
  ["qnorm(0.95)", S.qnorm(0.95)], ["qnorm(0.1,75,13)", S.qnorm(0.1,75,13)], ["qnorm(0.001)", S.qnorm(0.001)], ["qnorm(0.975)", S.qnorm(0.975)],
  ["pt(2.5406,236)", S.pt(2.5406,236)], ["pt(-1.2,5)", S.pt(-1.2,5)], ["pt(0.3,2)", S.pt(0.3,2)],
  ["qt(0.975,49)", S.qt(0.975,49)], ["qt(0.975,4)", S.qt(0.975,4)], ["qt(0.95,178)", S.qt(0.95,178)], ["qt(0.005,9)", S.qt(0.005,9)],
  ["pf(112,3,4378,lower.tail=FALSE)", S.pf(112,3,4378,false)], ["pf(3.715,2,312,lower.tail=FALSE)", S.pf(3.715,2,312,false)],
  ["dbinom(7,10,0.7)", S.dbinom(7,10,0.7)], ["pbinom(2,5,0.24,lower.tail=FALSE)", S.pbinom(2,5,0.24,false)], ["pbinom(1,5,0.24)", S.pbinom(1,5,0.24)],
  ["dpois(6,4)", S.dpois(6,4)], ["ppois(3,4)", S.ppois(3,4)], ["ppois(2,8,lower.tail=FALSE)", S.ppois(2,8,false)], ["dpois(0,0.5)", S.dpois(0,0.5)],
];
const r = execFileSync("Rscript", ["-e", "options(digits=15);" + cases.map(c => `cat(${c[0]},'\\n')`).join(";")]).toString().trim().split(/\s+/).map(Number);
let bad = 0;
cases.forEach((c, i) => { const rel = Math.abs(c[1] - r[i]) / Math.max(1e-300, Math.abs(r[i])); if (rel > 1e-6 && Math.abs(c[1]-r[i]) > 1e-15) { bad++; console.log("VILLA", c[0], c[1], r[i]); } });
console.log(bad ? bad + " villur" : "Öll " + cases.length + " gildi passa við R");

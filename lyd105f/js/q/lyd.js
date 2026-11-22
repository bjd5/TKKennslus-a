/* q/lyd.js – spurningabanki LÝÐ105F: dæmavélar (nýjar tölur í hvert skipti) og hugtakaspurningar.
 * Efnið er skrifað á innra sniði (q, a, ex, r, tol) og breytt í snið TK.bank (G og MC) neðst í skránni.
 * Svörin eru prófuð gegn R með tools/itemcheck.js. */
(function () {
  "use strict";
  var A0 = (window.App = window.App || {});
  if (!A0.fmt) {
    A0.rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
    A0.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
    A0.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    A0.fmt = function (x, d) {
      if (!isFinite(x)) return String(x);
      if (d == null) d = Math.abs(x) >= 100 ? 1 : Math.abs(x) >= 1 ? 3 : 4;
      var s = x.toFixed(d);
      if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
      return s === "-0" ? "0" : s;
    };
  }
})();
/* Spurningabanki: (1) dæmavélar sem búa til ný talnadæmi í hvert skipti, (2) hugtakaspurningar á prófsniði.
   Hvert dæmi: {skill, type:'num'|'mc', q, a, ex, r (R-kóði), wrong:[algeng mistök]} */
(function () {
  "use strict";
  var S = window.Stat, A = window.App, f = A.fmt, rnd = A.rnd, pick = A.pick;
  function r4(x) { return Math.round(x * 1e4) / 1e4; }
  function r3(x) { return Math.round(x * 1e3) / 1e3; }

  // ================= Dæmavélar =================
  var GEN = [];
  function gen(skill, name, fn) { GEN.push({ skill: skill, name: name, fn: fn }); }

  // ---------- Normaldreifing ----------
  var NORM = [
    { what: "hjartsláttur heilbrigðra kvenna", u: "slög/mín", mu: [72, 78], sd: [10, 14], hi: [95, 105], tag: "yfirslátt" },
    { what: "systólískur blóðþrýstingur", u: "mmHg", mu: [115, 125], sd: [9, 15], hi: [135, 145], tag: "háþrýsting" },
    { what: "kólesteról", u: "mg/dL", mu: [200, 220], sd: [30, 45], hi: [240, 260], tag: "hátt kólesteról" },
    { what: "fæðingarþyngd", u: "g", mu: [3400, 3700], sd: [450, 550], hi: [4300, 4600], tag: "háa fæðingarþyngd" }
  ];
  gen("normal", "upper", function () {
    var c = pick(NORM), mu = rnd(c.mu[0], c.mu[1]), sd = rnd(c.sd[0], c.sd[1]), x = rnd(c.hi[0], c.hi[1]);
    var a = S.pnorm(x, mu, sd, false), z = (x - mu) / sd;
    return { q: "Gerum ráð fyrir að " + c.what + " fylgi normaldreifingu með meðaltal " + mu + " " + c.u + " og staðalfrávik " + sd + " " + c.u + ". Einstaklingur með gildi yfir " + x + " " + c.u + " telst vera með " + c.tag + ". Hverjar eru líkurnar á að einstaklingur valinn af handahófi mælist með " + c.tag + "?",
      a: r4(a), d: 4, wrong: [S.pnorm(x, mu, sd), S.pnorm(x, mu, sd * sd, false), z / 10],
      ex: "<p>z = (" + x + " − " + mu + ") / " + sd + " = " + f(z, 3) + ", svo P(X > " + x + ") = 1 − Φ(" + f(z, 2) + ") = " + f(a, 4) + ".</p>",
      r: "pnorm(" + x + ", mean = " + mu + ", sd = " + sd + ", lower.tail = FALSE)\n1 - pnorm(" + f(z, 4) + ")" };
  });
  gen("normal", "between", function () {
    var mu = rnd(115, 125), sd = rnd(8, 12), w = rnd(3, 8), lo = mu - w, hi = mu + w;
    var a = S.pnorm(hi, mu, sd) - S.pnorm(lo, mu, sd);
    return { q: "Systólískur blóðþrýstingur í þýði fylgir N(" + mu + ", " + sd + "²). Hverjar eru líkurnar á að einstaklingur valinn af handahófi mælist á milli " + lo + " og " + hi + " mmHg?",
      a: r4(a), d: 4, wrong: [S.pnorm(hi, mu, sd), 1 - a, S.pnorm(hi, mu, sd * sd) - S.pnorm(lo, mu, sd * sd)],
      ex: "<p>P(" + lo + " < X < " + hi + ") = Φ(" + f(w / sd, 3) + ") − Φ(" + f(-w / sd, 3) + ") = " + f(a, 4) + ".</p>",
      r: "pnorm(" + hi + ", " + mu + ", " + sd + ") - pnorm(" + lo + ", " + mu + ", " + sd + ")" };
  });
  gen("normal", "quantile", function () {
    var c = pick(NORM), mu = rnd(c.mu[0], c.mu[1]), sd = rnd(c.sd[0], c.sd[1]);
    var low = Math.random() < 0.5, pct = pick([1, 2.5, 5, 10, 20]);
    var p = low ? pct / 100 : 1 - pct / 100, a = S.qnorm(p, mu, sd), z = S.qnorm(p);
    return { q: "Gerum ráð fyrir að " + c.what + " fylgi N(" + mu + ", " + sd + "²) (" + c.u + "). Hvert þarf gildið að vera til að einstaklingur sé í hópi þeirra " + pct + "% sem eru með " + (low ? "lægstu" : "hæstu") + " gildin?",
      a: Math.round(a * 1000) / 1000, d: 2, tol: { abs: Math.max(0.05, sd * 0.004) }, unit: c.u,
      wrong: [S.qnorm(1 - p, mu, sd), mu + z * sd * sd / 10, mu + (low ? -1 : 1) * 1.96 * sd],
      ex: "<p>Finnum z með P(Z &lt; z) = " + f(p, 3) + ": z = " + f(z, 3) + ". Þá er x = μ + zσ = " + mu + " + (" + f(z, 3) + ")·" + sd + " = " + f(a, 2) + ".</p>",
      r: "qnorm(" + f(p, 3) + ", mean = " + mu + ", sd = " + sd + ")" };
  });
  gen("normal", "expected", function () {
    var mu = 75, sd = 13, x = 100, n = pick([100, 150, 200, 300, 500]);
    mu = rnd(72, 78); sd = rnd(11, 14); var p = S.pnorm(x, mu, sd, false), a = n * p;
    return { q: "Hjartsláttur heilbrigðra kvenna fylgir N(" + mu + ", " + sd + "²). Yfirsláttur er hjartsláttur yfir 100 slög/mín. Í slembiúrtaki " + n + " kvenna, hve margar má búast við að hafi yfirslátt?",
      a: Math.round(a * 100) / 100, d: 2, tol: { abs: 0.06 }, wrong: [p, n - a, n * S.pnorm(x, mu, sd)],
      ex: "<p>Fyrst P(X &gt; 100) = " + f(p, 4) + ". Væntanlegur fjöldi er n·p = " + n + " · " + f(p, 4) + " = " + f(a, 2) + ".</p>",
      r: n + " * pnorm(100, " + mu + ", " + sd + ", lower.tail = FALSE)" };
  });

  // ---------- Tvíkostadreifing ----------
  var BIN = [
    { s: "sjúklinga á bráðamóttöku eru með beinbrot", p: [18, 30], n: [4, 8], t: "séu með beinbrot" },
    { s: "þeirra sem fá bóluefnið eru varðir gegn sýkingu", p: [60, 85], n: [8, 12], t: "séu varðir gegn sýkingunni" },
    { s: "fullorðinna reykja daglega", p: [8, 15], n: [6, 12], t: "reyki daglega" },
    { s: "sjúklinga svara meðferðinni", p: [35, 55], n: [6, 10], t: "svari meðferðinni" }
  ];
  gen("binom", "atleast", function () {
    var c = pick(BIN), p = rnd(c.p[0], c.p[1]) / 100, n = rnd(c.n[0], c.n[1]), k = rnd(2, Math.min(n - 1, 4));
    var a = S.pbinom(k - 1, n, p, false);
    return { q: "Um " + Math.round(p * 100) + "% " + c.s + ". Séu " + n + " einstaklingar valdir af handahófi, hverjar eru líkurnar á að <b>a.m.k. " + k + "</b> þeirra " + c.t + "?",
      a: r4(a), d: 4, wrong: [S.pbinom(k, n, p, false), S.dbinom(k, n, p), S.pbinom(k, n, p)],
      ex: "<p>X ~ Bin(n = " + n + ", p = " + p + "). P(X ≥ " + k + ") = 1 − P(X ≤ " + (k - 1) + ") = " + f(a, 4) + ". Algeng mistök eru að nota <code>pbinom(" + k + ", …, lower.tail = FALSE)</code>, en það gefur P(X &gt; " + k + ").</p>",
      r: "1 - pbinom(" + (k - 1) + ", size = " + n + ", prob = " + p + ")\nsum(dbinom(" + k + ":" + n + ", " + n + ", " + p + "))" };
  });
  gen("binom", "fewer", function () {
    var c = pick(BIN), p = rnd(c.p[0], c.p[1]) / 100, n = rnd(c.n[0], c.n[1]), k = rnd(1, 3);
    var a = S.pbinom(k - 1, n, p);
    return { q: "Um " + Math.round(p * 100) + "% " + c.s + ". Séu " + n + " einstaklingar valdir af handahófi, hverjar eru líkurnar á að <b>færri en " + k + "</b> þeirra " + c.t + "?",
      a: r4(a), d: 4, wrong: [S.pbinom(k, n, p), 1 - a, S.dbinom(k, n, p)],
      ex: "<p>„Færri en " + k + "“ þýðir X ≤ " + (k - 1) + ": P(X ≤ " + (k - 1) + ") = " + f(a, 4) + ".</p>",
      r: "pbinom(" + (k - 1) + ", size = " + n + ", prob = " + p + ")" };
  });
  gen("binom", "exact", function () {
    var c = pick(BIN), p = rnd(c.p[0], c.p[1]) / 100, n = rnd(c.n[0], c.n[1]), k = rnd(1, n - 1);
    var a = S.dbinom(k, n, p);
    return { q: "Um " + Math.round(p * 100) + "% " + c.s + ". Séu " + n + " einstaklingar valdir af handahófi, hverjar eru líkurnar á að <b>nákvæmlega " + k + "</b> þeirra " + c.t + "?",
      a: r4(a), d: 4, wrong: [S.pbinom(k, n, p), Math.pow(p, k) * Math.pow(1 - p, n - k), S.pbinom(k - 1, n, p, false)],
      ex: "<p>P(X = " + k + ") = (" + n + " yfir " + k + ") · " + p + "<sup>" + k + "</sup> · " + f(1 - p, 2) + "<sup>" + (n - k) + "</sup> = " + S.choose(n, k) + " · … = " + f(a, 4) + ".</p>",
      r: "dbinom(" + k + ", size = " + n + ", prob = " + p + ")" };
  });
  gen("binom", "mean", function () {
    var n = pick([20, 40, 50, 80, 120, 200]), p = pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.3]);
    var sdq = Math.random() < 0.5, a = sdq ? Math.sqrt(n * p * (1 - p)) : n * p * (1 - p);
    return { q: "X ~ Bin(n = " + n + ", p = " + p + "). Hver er " + (sdq ? "staðalfrávik" : "dreifni") + " X?",
      a: r4(a), d: 3, wrong: [n * p, Math.sqrt(n * p), n * p * (1 - p) * (sdq ? 1 : 0.5)],
      ex: "<p>E[X] = np = " + f(n * p) + " og Var[X] = np(1 − p) = " + f(n * p * (1 - p), 3) + "; staðalfrávikið er kvaðratrótin, " + f(Math.sqrt(n * p * (1 - p)), 3) + ".</p>",
      r: sdq ? "sqrt(" + n + " * " + p + " * (1 - " + p + "))" : n + " * " + p + " * (1 - " + p + ")" };
  });

  // ---------- Poisson ----------
  var POI = [
    { s: "sjúklinga sem koma á bráðamóttöku", per: "klukkutíma", per2: "tveimur klukkutímum" },
    { s: "nýrra inflúensulíkra tilfella sem tilkynnt eru í þorpi", per: "degi", per2: "tveimur dögum" },
    { s: "sjúkrabílaútkalla", per: "klukkutíma", per2: "tveimur klukkutímum" }
  ];
  gen("poisson", "atmost", function () {
    var c = pick(POI), l = rnd(2, 7), k = rnd(1, l);
    var a = S.ppois(k, l);
    return { q: "Að meðaltali er fjöldi " + c.s + " " + l + " á " + c.per + ". Hverjar eru líkurnar á að á einum " + c.per + " verði fjöldinn <b>" + k + " eða minni</b>?",
      a: r4(a), d: 4, wrong: [S.dpois(k, l), S.ppois(k - 1, l), 1 - a],
      ex: "<p>X ~ Poisson(λ = " + l + "). P(X ≤ " + k + ") = Σ e<sup>−λ</sup>λ<sup>x</sup>/x! fyrir x = 0,…," + k + " = " + f(a, 4) + ".</p>",
      r: "ppois(" + k + ", lambda = " + l + ")\nsum(dpois(0:" + k + ", " + l + "))" };
  });
  gen("poisson", "exact", function () {
    var c = pick(POI), l = rnd(2, 7), k = rnd(0, l + 3);
    var a = S.dpois(k, l);
    return { q: "Að meðaltali er fjöldi " + c.s + " " + l + " á " + c.per + ". Hverjar eru líkurnar á að fjöldinn verði <b>nákvæmlega " + k + "</b> á einum " + c.per + "?",
      a: r4(a), d: 4, wrong: [S.ppois(k, l), S.dpois(k, l + 1), S.ppois(k - 1, l, false)],
      ex: "<p>P(X = " + k + ") = e<sup>−" + l + "</sup> · " + l + "<sup>" + k + "</sup> / " + k + "! = " + f(a, 4) + ".</p>",
      r: "dpois(" + k + ", lambda = " + l + ")" };
  });
  gen("poisson", "twoperiod", function () {
    var c = pick(POI), l = rnd(2, 5), k = rnd(3, 6);
    var a = S.ppois(k - 1, 2 * l, false);
    return { q: "Að meðaltali er fjöldi " + c.s + " " + l + " á " + c.per + ". Hverjar eru líkurnar á að á <b>" + c.per2 + "</b> verði fjöldinn a.m.k. " + k + "?",
      a: r4(a), d: 4, wrong: [S.ppois(k - 1, l, false), S.ppois(k, 2 * l, false), Math.pow(S.ppois(k - 1, l, false), 2)],
      ex: "<p>Yfir tvöfalt tímabil er λ tvöfalt stærra: X ~ Poisson(" + 2 * l + "). P(X ≥ " + k + ") = 1 − P(X ≤ " + (k - 1) + ") = " + f(a, 4) + ".</p>",
      r: "1 - ppois(" + (k - 1) + ", lambda = " + 2 * l + ")" };
  });

  // ---------- Úrtaksdreifing / CLT ----------
  gen("clt", "se", function () {
    var mu = rnd(70, 80), v = pick([400, 625, 900, 912.02, 144, 225]), n = pick([25, 36, 50, 100, 144]);
    var a = Math.sqrt(v / n);
    return { q: "Þyngd sjúklinga hefur meðaltal " + mu + " kg og dreifni " + v + " kg². Tekið er slembiúrtak " + n + " sjúklinga. Hvert er staðalfrávik (staðalskekkja) meðaltalsins X̄?",
      a: r4(a), d: 3, unit: "kg", wrong: [Math.sqrt(v) / n, v / n, Math.sqrt(v)],
      ex: "<p>SE = σ/√n = √" + v + " / √" + n + " = " + f(Math.sqrt(v), 3) + " / " + f(Math.sqrt(n), 3) + " = " + f(a, 3) + ". Dreifni X̄ er σ²/n = " + f(v / n, 3) + ".</p>",
      r: "sqrt(" + v + " / " + n + ")" };
  });
  gen("clt", "pbar", function () {
    var mu = rnd(115, 125), sd = rnd(9, 15), n = pick([16, 25, 36, 49, 64]), c = mu + pick([2, 3, 4, 5]);
    var a = S.pnorm(c, mu, sd / Math.sqrt(n), false);
    return { q: "Blóðþrýstingur fylgir N(" + mu + ", " + sd + "²). Hverjar eru líkurnar á að <b>meðaltal</b> " + n + " einstaklinga valinna af handahófi sé hærra en " + c + " mmHg?",
      a: r4(a), d: 4, wrong: [S.pnorm(c, mu, sd, false), S.pnorm(c, mu, sd / n, false), S.pnorm(c, mu, sd / Math.sqrt(n))],
      ex: "<p>X̄ ~ N(" + mu + ", " + sd + "²/" + n + "), svo SE = " + sd + "/√" + n + " = " + f(sd / Math.sqrt(n), 3) + ". z = (" + c + " − " + mu + ")/" + f(sd / Math.sqrt(n), 3) + " = " + f((c - mu) / (sd / Math.sqrt(n)), 3) + " og P = " + f(a, 4) + ".</p>",
      r: "pnorm(" + c + ", mean = " + mu + ", sd = " + sd + " / sqrt(" + n + "), lower.tail = FALSE)" };
  });
  gen("clt", "poismean", function () {
    var l = rnd(3, 6), n = pick([50, 100, 200]);
    return { q: "Fjöldi sjúklinga á klukkutíma fylgir Poisson(λ = " + l + "). Skoðaðir eru " + n + " klukkutímar valdir af handahófi. Samkvæmt höfuðsetningu tölfræðinnar fylgir meðalfjöldinn X̄ nálgunarlega N(μ, σ²/n). Hver er <b>dreifni</b> X̄?",
      a: r4(l / n), d: 4, wrong: [l / Math.sqrt(n), Math.sqrt(l / n), l],
      ex: "<p>Fyrir Poisson er E[X] = Var[X] = λ = " + l + ". Þá X̄ ≈ N(" + l + ", " + l + "/" + n + ") = N(" + l + ", " + f(l / n, 4) + ").</p>", r: l + " / " + n };
  });

  // ---------- Öryggisbil ----------
  gen("oryggisbil", "prop", function () {
    var n = pick([200, 300, 400, 500, 800]), x = rnd(Math.round(n * 0.12), Math.round(n * 0.35)), up = Math.random() < 0.5;
    var p = x / n, se = Math.sqrt(p * (1 - p) / n), a = p + (up ? 1 : -1) * 1.96 * se;
    return { q: "Í slembiúrtaki " + n + " manns reynast " + x + " vera með háþrýsting. Reiknaðu " + (up ? "<b>efri</b>" : "<b>neðri</b>") + " mörk 95% öryggisbils fyrir hlutfallið (normalnálgun).",
      a: r4(a), d: 4, tol: { abs: 0.0015 }, wrong: [p + (up ? 1 : -1) * 1.96 * Math.sqrt(p * (1 - p)), p + (up ? 1 : -1) * 1.645 * se, p],
      ex: "<p>p̂ = " + x + "/" + n + " = " + f(p, 4) + ", SE = √(p̂(1 − p̂)/n) = " + f(se, 4) + ". Bilið er p̂ ± 1.96·SE = [" + f(p - 1.96 * se, 4) + ", " + f(p + 1.96 * se, 4) + "]. <code>prop.test</code> gefur aðeins annað bil (samfelluleiðrétting og Wilson-bil).</p>",
      r: "p <- " + x + " / " + n + "\np + c(-1, 1) * qnorm(0.975) * sqrt(p * (1 - p) / " + n + ")" };
  });
  gen("oryggisbil", "mean", function () {
    var n = pick([10, 15, 20, 25, 30, 50]), xb = rnd(1180, 1350) / 10, s = rnd(80, 180) / 10, conf = pick([0.95, 0.95, 0.9, 0.99]), up = Math.random() < 0.5;
    var t = S.qt(1 - (1 - conf) / 2, n - 1), se = s / Math.sqrt(n), a = xb + (up ? 1 : -1) * t * se;
    var z = S.qnorm(1 - (1 - conf) / 2);
    return { q: "Mældur er blóðþrýstingur hjá " + n + " manns: x̄ = " + xb + " mmHg og s = " + s + " mmHg. Reiknaðu " + (up ? "<b>efri</b>" : "<b>neðri</b>") + " mörk " + Math.round(conf * 100) + "% öryggisbils fyrir meðaltalið (t-dreifing).",
      a: r3(a), d: 2, tol: { abs: 0.03 }, unit: "mmHg", wrong: [xb + (up ? 1 : -1) * z * se, xb + (up ? 1 : -1) * t * s, xb + (up ? 1 : -1) * t * s / n],
      ex: "<p>SE = s/√n = " + f(se, 3) + ", t<sub>" + f(1 - (1 - conf) / 2, 3) + ", " + (n - 1) + "</sub> = " + f(t, 3) + ". Bilið er " + xb + " ± " + f(t, 3) + "·" + f(se, 3) + " = [" + f(xb - t * se, 2) + ", " + f(xb + t * se, 2) + "].</p>",
      r: xb + " + c(-1, 1) * qt(" + f(1 - (1 - conf) / 2, 3) + ", df = " + (n - 1) + ") * " + s + " / sqrt(" + n + ")" };
  });
  gen("oryggisbil", "coverage", function () {
    var N = pick([100, 200, 400, 500, 1000]), conf = pick([90, 95, 99]), contain = Math.random() < 0.5;
    var a = contain ? N * conf / 100 : N * (100 - conf) / 100;
    return { q: "Raunverulegt meðaltal í þýði er þekkt. " + N + " nemendur taka hver sitt slembiúrtak og reikna " + conf + "% öryggisbil fyrir meðaltalið. Hve mörg bil má búast við að " + (contain ? "<b>innihaldi</b>" : "<b>innihaldi ekki</b>") + " rétta meðaltalið?",
      a: a, d: 1, tol: { abs: 0.01 }, wrong: [N - a, N * 0.05, N * conf / 100 / 2],
      ex: "<p>Í endurteknum úrtökum innihalda " + conf + "% bilanna sanna gildið að jafnaði: " + N + " · " + (contain ? conf : 100 - conf) + "% = " + f(a, 1) + ".</p>" };
  });
  gen("oryggisbil", "nfromwidth", function () {
    var s = pick([10, 12, 15, 20]), half = pick([2, 3, 4, 5]);
    var a = Math.ceil(Math.pow(1.96 * s / half, 2));
    return { q: "Staðalfrávik blóðþrýstings er um " + s + " mmHg. Hve stórt úrtak þarf (minnst) til að 95% öryggisbil fyrir meðaltalið nái ±" + half + " mmHg (z-nálgun)?",
      a: a, d: 0, tol: { abs: 1.01 }, wrong: [Math.ceil(1.96 * s / half), Math.ceil(Math.pow(s / half, 2)), Math.ceil(Math.pow(1.645 * s / half, 2))],
      ex: "<p>Vikmörkin eru z·σ/√n = " + half + ", svo n = (zσ/vikmörk)² = (1.96·" + s + "/" + half + ")² = " + f(Math.pow(1.96 * s / half, 2), 2) + " og námundað upp í " + a + ".</p>", r: "ceiling((qnorm(0.975) * " + s + " / " + half + ")^2)" };
  });

  // ---------- t-próf ----------
  gen("ttest", "onesample", function () {
    var n = pick([16, 20, 25, 36, 49]), mu0 = 120, xb = rnd(1210, 1290) / 10, s = rnd(80, 160) / 10;
    var t = (xb - mu0) / (s / Math.sqrt(n));
    return { q: "Kannað er hvort meðalblóðþrýstingur sé frábrugðinn " + mu0 + " mmHg. Í úrtaki " + n + " manns er x̄ = " + xb + " og s = " + s + ". Reiknaðu prófstærðina t.",
      a: r3(t), d: 3, tol: { abs: 0.01 }, wrong: [(xb - mu0) / s, (xb - mu0) / (s / n), (xb - mu0) * Math.sqrt(n)],
      ex: "<p>t = (x̄ − μ₀)/(s/√n) = (" + xb + " − " + mu0 + ")/(" + s + "/√" + n + ") = " + f(t, 3) + " með " + (n - 1) + " frígráður. Tvíhliða p-gildi er " + f(2 * S.pt(-Math.abs(t), n - 1), 4) + ".</p>",
      r: "t <- (" + xb + " - " + mu0 + ") / (" + s + " / sqrt(" + n + "))\n2 * pt(-abs(t), df = " + (n - 1) + ")" };
  });
  gen("ttest", "pvalue", function () {
    var df = pick([9, 14, 19, 29, 49, 99]), t = rnd(150, 320) / 100 * (Math.random() < 0.5 ? -1 : 1);
    var a = 2 * S.pt(-Math.abs(t), df);
    return { q: "t-próf gefur prófstærð t = " + t + " með " + df + " frígráður. Hvert er <b>tvíhliða</b> p-gildið?",
      a: r4(a), d: 4, tol: { abs: 0.0008 }, wrong: [a / 2, 2 * S.pnorm(-Math.abs(t)), 1 - a],
      ex: "<p>p = 2·P(T<sub>" + df + "</sub> &gt; |" + t + "|) = " + f(a, 4) + ". " + (a < 0.05 ? "Minna en 0.05: höfnum H₀ við 5% marktektarkröfu." : "Stærra en 0.05: höfnum ekki H₀.") + "</p>",
      r: "2 * pt(-abs(" + t + "), df = " + df + ")" };
  });
  gen("ttest", "welchchoice", function () {
    var p = pick([0.0003, 0.012, 0.21, 0.56, 0.0418, 0.0729]);
    var unequal = p < 0.05;
    return { type: "mc", q: "Áður en tvö óháð úrtök eru borin saman með t-prófi er <code>var.test()</code> keyrt og gefur p-gildið " + p + ". Hvaða t-próf á að nota?",
      opts: ["<code>t.test(..., var.equal = TRUE)</code>: dreifnin er talin jöfn", "<code>t.test(..., var.equal = FALSE)</code> (Welch): dreifnin er talin ólík", "Parað t-próf, því dreifnin skiptir ekki máli þar", "Kí-kvaðrat próf", "Ekkert að ofan er rétt"],
      a: unequal ? 1 : 0, keep: true,
      ex: "<p>H₀ í <code>var.test</code> er að dreifnin sé jöfn (hlutfall dreifna = 1). p = " + p + (unequal ? " &lt; 0.05: höfnum jafnri dreifni og notum Welch-prófið (var.equal = FALSE)." : " &gt; 0.05: höfnum ekki jafnri dreifni og notum því var.equal = TRUE (vegin dreifni).") + "</p>" };
  });

  // ---------- Hlutföll / OR ----------
  gen("hlutfoll", "or", function () {
    var a = rnd(30, 90), b = rnd(10, 40), c = rnd(10, 40), d = rnd(40, 110);
    var or = (a * d) / (b * c);
    return { q: "<table class='tt'><tr><th></th><th>Sjúkdómur</th><th>Ekki sjúkdómur</th></tr><tr><th>Útsett</th><td>" + a + "</td><td>" + b + "</td></tr><tr><th>Ekki útsett</th><td>" + c + "</td><td>" + d + "</td></tr></table>Reiknaðu gagnlíkindahlutfallið (OR) fyrir sjúkdóm, útsettir á móti óútsettum.",
      a: r3(or), d: 3, tol: { rel: 0.01 }, wrong: [(a / (a + b)) / (c / (c + d)), (b * c) / (a * d), a / c],
      ex: "<p>Gagnlíkindi útsettra: " + a + "/" + b + " = " + f(a / b, 3) + ". Gagnlíkindi óútsettra: " + c + "/" + d + " = " + f(c / d, 3) + ". OR = " + f(a / b, 3) + "/" + f(c / d, 3) + " = (" + a + "·" + d + ")/(" + b + "·" + c + ") = " + f(or, 3) + ". (Áhættuhlutfallið RR væri " + f((a / (a + b)) / (c / (c + d)), 3) + ".)</p>",
      r: "(" + a + " * " + d + ") / (" + b + " * " + c + ")" };
  });
  gen("hlutfoll", "rr", function () {
    var a = rnd(20, 60), n1 = rnd(150, 300), c = rnd(10, 40), n2 = rnd(150, 300);
    var rr = (a / n1) / (c / n2);
    return { q: "Í hópi " + n1 + " reykingamanna fengu " + a + " sjúkdóminn en " + c + " af " + n2 + " sem ekki reykja. Hvert er áhættuhlutfallið (RR), reykingamenn á móti öðrum?",
      a: r3(rr), d: 3, tol: { rel: 0.01 }, wrong: [(a * (n2 - c)) / ((n1 - a) * c), a / c, (a / n1) - (c / n2)],
      ex: "<p>Áhætta: " + a + "/" + n1 + " = " + f(a / n1, 4) + " og " + c + "/" + n2 + " = " + f(c / n2, 4) + ". RR = " + f(rr, 3) + ".</p>", r: "(" + a + " / " + n1 + ") / (" + c + " / " + n2 + ")" };
  });
  gen("hlutfoll", "expected", function () {
    var r1 = rnd(100, 300), r2 = rnd(100, 300), c1 = rnd(40, 120), N = r1 + r2;
    var e = r1 * c1 / N;
    return { q: "Í 2×2 töflu er heildarfjöldi " + N + ". Línusumma fyrsta hóps er " + r1 + " og dálksumma „með sjúkdóm“ er " + c1 + ". Hver er <b>vænt tíðni</b> í reitnum (hópur 1, með sjúkdóm) undir H₀ um óhæði?",
      a: r3(e), d: 2, tol: { abs: 0.02 }, wrong: [r1 * c1, c1 / 2, r1 / N],
      ex: "<p>E = (línusumma · dálksumma)/heild = " + r1 + "·" + c1 + "/" + N + " = " + f(e, 2) + ". Kí-kvaðrat nálgunin er góð ef allar væntar tíðnir eru ≥ 5; annars Fisher-próf.</p>" };
  });

  // ---------- ANOVA ----------
  gen("anova", "F", function () {
    var k = rnd(3, 5), N = rnd(60, 400), ssg = rnd(800, 9000), sse = rnd(15000, 90000);
    var df1 = k - 1, df2 = N - k, F = (ssg / df1) / (sse / df2);
    return { q: "<pre class='mini'>            Df  Sum Sq Mean Sq F value\ngroup       " + df1 + "   " + ssg + "       ?       ?\nResiduals " + df2 + "   " + sse + "       ?</pre>Hvert á F-gildið að vera?",
      a: r3(F), d: 3, tol: { rel: 0.01 }, wrong: [ssg / sse, (ssg / df1) / sse, (sse / df2) / (ssg / df1)],
      ex: "<p>MS<sub>hópa</sub> = " + ssg + "/" + df1 + " = " + f(ssg / df1, 2) + ", MS<sub>leifa</sub> = " + sse + "/" + df2 + " = " + f(sse / df2, 3) + ". F = " + f(F, 3) + ". p-gildi: " + f(S.pf(F, df1, df2, false), 4) + ".</p>",
      r: "(" + ssg + " / " + df1 + ") / (" + sse + " / " + df2 + ")\npf(" + f(F, 3) + ", " + df1 + ", " + df2 + ", lower.tail = FALSE)" };
  });
  gen("anova", "df", function () {
    var k = rnd(3, 6), n = rnd(15, 60), N = k * n, which = Math.random() < 0.5;
    return { q: "Kólesteról er borið saman í " + k + " aldurshópum með " + n + " manns í hverjum (alls " + N + "). Hverjar eru frígráður " + (which ? "<b>hópanna</b> (teljari F)" : "<b>leifanna</b> (nefnari F)") + "?",
      a: which ? k - 1 : N - k, d: 0, tol: { abs: 0.01 }, wrong: [which ? k : N - 1, which ? N - k : k - 1, N],
      ex: "<p>df<sub>hópa</sub> = k − 1 = " + (k - 1) + ", df<sub>leifa</sub> = N − k = " + (N - k) + ".</p>" };
  });

  // ---------- Línulegt aðhvarf ----------
  var LMS = [
    { y: "SYSBP", x: "BMI", a: 86.66684, b: 1.78852, se: 0.07752, df: 4413, xs: [18, 22, 25, 28, 32, 35], yl: "systólískan blóðþrýsting", xl: "BMI" },
    { y: "haed", x: "femur", a: 63.19815, b: 1.47852, se: 0.08964, df: 98, xs: [70, 75, 80, 85], yl: "hæð (cm)", xl: "fótleggjalengd (cm)" },
    { y: "seinniPuls", x: "fyrriPuls", a: 34.1097, b: 0.8877, se: 0.1083, df: 178, xs: [60, 70, 80, 90], yl: "púls eftir hlaup", xl: "púls í hvíld" }
  ];
  function lmOut(m) {
    return "<pre class='mini'>Coefficients:\n            Estimate Std. Error\n(Intercept) " + m.a + "  …\n" + (m.x + "            ").slice(0, 12) + m.b + "  " + m.se + "\nResidual standard error: … on " + m.df + " degrees of freedom</pre>";
  }
  gen("adhvarf", "predict", function () {
    var m = pick(LMS), x = pick(m.xs), yh = m.a + m.b * x;
    return { q: lmOut(m) + "Notaðu líkanið <code>lm(" + m.y + " ~ " + m.x + ")</code> til að spá fyrir um " + m.yl + " hjá einstaklingi með " + m.xl + " = " + x + ".",
      a: r3(yh), d: 2, tol: { abs: 0.05 }, wrong: [m.b * x, m.a + m.b, m.a * x + m.b],
      ex: "<p>ŷ = " + m.a + " + " + m.b + "·" + x + " = " + f(yh, 2) + ". Spá er aðeins áreiðanleg innan þess bils sem x-gildin í gögnunum ná yfir (annars er það bryggjun).</p>", r: m.a + " + " + m.b + " * " + x };
  });
  gen("adhvarf", "ci", function () {
    var m = pick(LMS), up = Math.random() < 0.5, t = S.qt(0.975, m.df), a = m.b + (up ? 1 : -1) * t * m.se;
    return { q: lmOut(m) + "Reiknaðu " + (up ? "<b>efri</b>" : "<b>neðri</b>") + " mörk 95% öryggisbils fyrir hallatölu " + m.x + ".",
      a: r4(a), d: 4, tol: { abs: 0.0015 }, wrong: [m.b + (up ? 1 : -1) * m.se, m.b + (up ? 1 : -1) * 1.645 * m.se, m.a + (up ? 1 : -1) * t * m.se],
      ex: "<p>β̂ ± t<sub>0.975, " + m.df + "</sub>·SE = " + m.b + " ± " + f(t, 4) + "·" + m.se + " = [" + f(m.b - t * m.se, 4) + ", " + f(m.b + t * m.se, 4) + "]. Sama og <code>confint(fit)</code>.</p>",
      r: m.b + " + c(-1, 1) * qt(0.975, df = " + m.df + ") * " + m.se };
  });
  gen("adhvarf", "tval", function () {
    var m = pick(LMS), t = m.b / m.se;
    return { q: lmOut(m) + "Hvert er <code>t value</code> fyrir " + m.x + " (gildið sem vantar í töfluna)?",
      a: r3(t), d: 3, tol: { abs: 0.01 }, wrong: [m.se / m.b, m.b * m.se, m.a / m.se],
      ex: "<p>t = Estimate / Std. Error = " + m.b + " / " + m.se + " = " + f(t, 3) + ". Það prófar H₀: β = 0.</p>", r: m.b + " / " + m.se };
  });
  gen("adhvarf", "r2", function () {
    var r = rnd(20, 90) / 100 * (Math.random() < 0.5 ? -1 : 1);
    return { q: "Fylgnistuðull milli tveggja breyta er r = " + r + ". Hve stórt hlutfall breytileikans í y skýrist af línulegu sambandi við x (R²)?",
      a: r4(r * r), d: 4, tol: { abs: 0.0006 }, wrong: [Math.abs(r), Math.sqrt(Math.abs(r)), 1 - r * r],
      ex: "<p>Í einföldu línulegu aðhvarfi er R² = r² = " + f(r * r, 4) + ", þ.e. um " + Math.round(r * r * 100) + "% breytileikans.</p>" };
  });

  // ---------- Tvíkosta aðhvarf ----------
  var GLMS = [
    { x: "likamsraekt", b: -0.1164, a: -1.7428, y: "reykingar", u1: "hverja klukkustund", uk: "klukkustundir", tail: "af líkamsrækt á viku" },
    { x: "age", b: 0.055475, a: -6.631840, y: "sykursýki", u1: "hvert ár", uk: "ár", tail: "í aldri", other: "(leiðrétt fyrir BMI)" },
    { x: "bmi", b: 0.068679, a: -6.631840, y: "sykursýki", u1: "hverja einingu", uk: "einingar", tail: "í BMI", other: "(leiðrétt fyrir aldri)" }
  ];
  gen("tvikosta", "or", function () {
    var m = pick(GLMS), k = pick([1, 1, 5, 10]), or = Math.exp(k * m.b);
    return { q: "Í tvíkosta aðhvarfslíkani fyrir " + m.y + " er stuðullinn fyrir <code>" + m.x + "</code> " + m.b + (m.other ? " " + m.other : "") + ". Hvert er gagnlíkindahlutfallið (OR) fyrir " + (k === 1 ? m.u1 : k + " " + m.uk) + " til viðbótar " + m.tail + "?",
      a: r4(or), d: 4, tol: { abs: 0.0012 }, wrong: [Math.exp(m.b), k * Math.exp(m.b), 1 + k * m.b],
      ex: "<p>OR = e<sup>" + (k === 1 ? "β" : k + "β") + "</sup> = e<sup>" + f(k * m.b, 4) + "</sup> = " + f(or, 4) + ". " + (or < 1 ? "Gagnlíkindin <b>lækka</b> um " + f((1 - or) * 100, 1) + "%." : "Gagnlíkindin <b>hækka</b> um " + f((or - 1) * 100, 1) + "%.") + "</p>",
      r: "exp(" + (k === 1 ? "" : k + " * ") + m.b + ")" };
  });
  gen("tvikosta", "prob", function () {
    var m = GLMS[0], x = pick([0, 2, 4, 6, 10]), eta = m.a + m.b * x, p = 1 / (1 + Math.exp(-eta));
    return { q: "Líkanið <code>glm(reykir == \"ja\" ~ likamsraekt, family = \"binomial\")</code> gaf skurðpunkt " + m.a + " og hallatölu " + m.b + ". Hverjar eru metnar líkur á að einstaklingur sem stundar " + x + " klst. líkamsrækt á viku reyki?",
      a: r4(p), d: 4, tol: { abs: 0.0012 }, wrong: [Math.exp(eta), eta, Math.exp(eta) / 2],
      ex: "<p>logit(p) = " + m.a + " + (" + m.b + ")·" + x + " = " + f(eta, 4) + ". Gagnlíkindi = e<sup>" + f(eta, 4) + "</sup> = " + f(Math.exp(eta), 4) + ", og p = gagnlíkindi/(1 + gagnlíkindi) = " + f(p, 4) + ".</p>",
      r: "plogis(" + m.a + " + " + m.b + " * " + x + ")\n# eða: predict(glm1, data.frame(likamsraekt = " + x + "), type = \"response\")" };
  });

  // ---------- Næmi og sértæki ----------
  function naemiTable() {
    var tp = rnd(30, 90), fn = rnd(5, 30), fp = rnd(10, 60), tn = rnd(150, 500);
    return { tp: tp, fn: fn, fp: fp, tn: tn,
      html: "<table class='tt'><tr><th></th><th>D+ (veik)</th><th>D− (heilbrigð)</th></tr><tr><th>T+ (jákvætt)</th><td>" + tp + "</td><td>" + fp + "</td></tr><tr><th>T− (neikvætt)</th><td>" + fn + "</td><td>" + tn + "</td></tr></table>" };
  }
  var NM = {
    "næmi": function (t) { return [t.tp / (t.tp + t.fn), "P(T+ | D+) = TP/(TP + FN) = " + t.tp + "/" + (t.tp + t.fn)]; },
    "sértæki": function (t) { return [t.tn / (t.tn + t.fp), "P(T− | D−) = TN/(TN + FP) = " + t.tn + "/" + (t.tn + t.fp)]; },
    "jákvætt forspárgildi (PPV)": function (t) { return [t.tp / (t.tp + t.fp), "P(D+ | T+) = TP/(TP + FP) = " + t.tp + "/" + (t.tp + t.fp)]; },
    "neikvætt forspárgildi (NPV)": function (t) { return [t.tn / (t.tn + t.fn), "P(D− | T−) = TN/(TN + FN) = " + t.tn + "/" + (t.tn + t.fn)]; }
  };
  gen("naemi", "table", function () {
    var t = naemiTable(), key = pick(Object.keys(NM)), v = NM[key](t);
    var others = Object.keys(NM).filter(function (k) { return k !== key; }).map(function (k) { return NM[k](t)[0]; });
    return { q: t.html + "Reiknaðu <b>" + key + "</b> greiningarprófsins.", a: r4(v[0]), d: 4, tol: { abs: 0.0012 }, wrong: others,
      ex: "<p>" + key.charAt(0).toUpperCase() + key.slice(1) + " = " + v[1] + " = " + f(v[0], 4) + ".</p>" };
  });
  gen("naemi", "bayes", function () {
    var prev = pick([0.01, 0.02, 0.05, 0.1, 0.2]), se = pick([0.9, 0.95, 0.99, 0.85]), sp = pick([0.9, 0.95, 0.98, 0.99]);
    var ppv = se * prev / (se * prev + (1 - sp) * (1 - prev));
    return { q: "Algengi sjúkdóms er " + prev * 100 + "%. Greiningarpróf hefur næmi " + se + " og sértæki " + sp + ". Hverjar eru líkurnar á að einstaklingur með jákvætt próf sé í raun veikur (PPV)?",
      a: r4(ppv), d: 4, tol: { abs: 0.0012 }, wrong: [se, se * prev, 1 - sp],
      ex: "<p>Hugsaðu þér 10 000 manns: " + prev * 10000 + " veikir, þar af " + f(se * prev * 10000, 1) + " jákvæðir. Af " + f((1 - prev) * 10000, 0) + " heilbrigðum eru " + f((1 - sp) * (1 - prev) * 10000, 1) + " fölsk jákvæðir. PPV = " + f(se * prev * 10000, 1) + "/(" + f(se * prev * 10000, 1) + " + " + f((1 - sp) * (1 - prev) * 10000, 1) + ") = " + f(ppv, 4) + ". PPV lækkar þegar algengið lækkar.</p>" };
  });

  // ---------- Lifun ----------
  gen("lifun", "hr", function () {
    var b = pick([0.54099, -0.37086, 1.32399, 0.2231, -0.6931, 0.0953]);
    var hr = Math.exp(b);
    return { q: "Í Cox-líkani er <code>coef</code> fyrir breytu " + b + ". Um hve mörg <b>prósent</b> breytist áhættan (hazard) í hópnum miðað við viðmiðunarhópinn? (Svaraðu með formerki: hækkun +, lækkun −.)",
      a: r3((hr - 1) * 100), d: 1, tol: { abs: 0.15 }, unit: "%", wrong: [b * 100, (1 - hr) * 100, hr * 100],
      ex: "<p>HR = exp(coef) = e<sup>" + b + "</sup> = " + f(hr, 4) + ", sem jafngildir " + f((hr - 1) * 100, 1) + "% breytingu á áhættu (" + (hr > 1 ? "meiri" : "minni") + " áhætta).</p>", r: "(exp(" + b + ") - 1) * 100" };
  });

  // ---------- Lýsandi ----------
  gen("lysandi", "median", function () {
    var n = pick([7, 8, 9, 10]), xs = []; for (var i = 0; i < n; i++) xs.push(rnd(55, 95));
    var s = xs.slice().sort(function (a, b) { return a - b; }), med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    var mean = xs.reduce(function (a, b) { return a + b; }, 0) / n;
    return { q: "Hvíldarpúls " + n + " nemenda: " + xs.join(", ") + ". Hvert er <b>miðgildið</b>?", a: med, d: 1, tol: { abs: 0.01 }, wrong: [mean, s[Math.floor(n / 2)], (s[0] + s[n - 1]) / 2],
      ex: "<p>Raðað: " + s.join(", ") + ". " + (n % 2 ? "Miðgildið er miðjugildið, " + med : "Jafn fjöldi, svo miðgildið er meðaltal tveggja miðjugilda: (" + s[n / 2 - 1] + " + " + s[n / 2] + ")/2 = " + med) + ". (Meðaltalið er " + f(mean, 2) + ".)</p>",
      r: "median(c(" + xs.join(", ") + "))" };
  });
  gen("lysandi", "sd", function () {
    var n = 5, xs = []; for (var i = 0; i < n; i++) xs.push(rnd(60, 90));
    var m = xs.reduce(function (a, b) { return a + b; }, 0) / n, ss = xs.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0);
    var sd = Math.sqrt(ss / (n - 1));
    return { q: "Púls fimm einstaklinga: " + xs.join(", ") + ". Reiknaðu úrtaksstaðalfrávikið s.", a: r3(sd), d: 3, tol: { abs: 0.01 }, wrong: [Math.sqrt(ss / n), ss / (n - 1), ss / n],
      ex: "<p>x̄ = " + f(m, 2) + ", Σ(x − x̄)² = " + f(ss, 2) + ", s² = " + f(ss, 2) + "/(n − 1) = " + f(ss / (n - 1), 3) + " og s = " + f(sd, 3) + ". Deilt er með n − 1, ekki n.</p>", r: "sd(c(" + xs.join(", ") + "))" };
  });
  gen("lysandi", "iqr", function () {
    var q1 = rnd(60, 68), q3 = q1 + rnd(8, 20), iqr = q3 - q1, up = Math.random() < 0.5;
    var a = up ? q3 + 1.5 * iqr : q1 - 1.5 * iqr;
    return { q: "Í <code>summary()</code> er 1st Qu. = " + q1 + " og 3rd Qu. = " + q3 + ". Hvar liggja " + (up ? "efri" : "neðri") + " mörkin fyrir útlaga í kassariti (1.5·IQR-reglan)?",
      a: a, d: 1, tol: { abs: 0.01 }, wrong: [up ? q3 + iqr : q1 - iqr, up ? q3 + 1.5 * q3 : q1 - 1.5 * q1, iqr * 1.5],
      ex: "<p>IQR = Q3 − Q1 = " + iqr + ". Mörkin eru " + (up ? "Q3 + 1.5·IQR = " + q3 + " + " + 1.5 * iqr : "Q1 − 1.5·IQR = " + q1 + " − " + 1.5 * iqr) + " = " + a + ".</p>" };
  });

  // ================= Hugtakaspurningar =================
  var N = "Ekkert að ofan er rétt";
  var MC = [
    // --- breytur og snið
    ["breytur", "Spurt er um hæstu prófgráðu sem sjúklingur hefur lokið (grunnskóli, framhaldsskóli, BS, MS, doktor). Af hvaða gerð er breytan?", ["Röðuð flokkabreyta", "Óröðuð flokkabreyta", "Samfelld talnabreyta", "Strjál talnabreyta", N], 0, "Flokkarnir hafa náttúrulega röð en bilin á milli þeirra eru ekki jöfn tölugildi: <b>röðuð flokkabreyta</b> (ordinal)."],
    ["breytur", "Blóðflokkur (A, B, AB, O) er dæmi um:", ["Raðaða flokkabreytu", "Óraðaða flokkabreytu", "Strjála talnabreytu", "Samfellda talnabreytu", N], 1, "Engin náttúruleg röð er á blóðflokkum: <b>óröðuð flokkabreyta</b> (nominal)."],
    ["breytur", "Fjöldi sjúklinga sem koma á bráðamóttöku á klukkutíma er:", ["Samfelld talnabreyta", "Strjál talnabreyta", "Röðuð flokkabreyta", "Óröðuð flokkabreyta", N], 1, "Talning (0, 1, 2, …) er <b>strjál talnabreyta</b>, og Poisson-dreifing er oft eðlilegt líkan fyrir hana."],
    ["breytur", "Þú metur veikindi sjúklinga á bráðamóttöku á skalanum 0–10 eingöngu með því að horfa á þá, og veist hvort þeir eru karlar eða konur. Hvert er helsta vandamálið?", ["Of mikill styrkur", "Hætta á rannsakandabjaga", "Rannsóknin er tvíblind, svo ekkert vandamál er", "Lyfleysuáhrif", N], 1, "Huglægt mat matsmanns sem veit hvaða hópi sjúklingur tilheyrir getur litast af væntingum hans: <b>rannsakandabjagi</b> (experimenter's bias)."],
    ["breytur", "Í tvíblindri rannsókn:", ["Vita þátttakendur einir ekki hvaða meðferð þeir fá", "Vita hvorki þátttakendur né þeir sem meta útkomu hvaða meðferð hver fær", "Eru tveir samanburðarhópar", "Eru allir þátttakendur á lyfleysu", N], 1, "Tvíblindun: hvorki þátttakendur né rannsakendur/matsmenn vita hver fær hvað. Það dregur úr lyfleysuáhrifum og rannsakandabjaga."],
    ["breytur", "Nemendur í púlsrannsókninni köstuðu krónu til að ákveða hvort þeir hlupu eða sátu kyrrir. Hvað er þetta kallað?", ["Lagskipt úrtak", "Slembival (randomization)", "Aðgengisúrtak", "Blindun", N], 1, "Að úthluta meðferð með tilviljun (krónukasti) er <b>slembival</b>. Það jafnar út aðra þætti milli hópa, svo hægt er að álykta um orsakasamband."],
    ["breytur", "Netkönnun þar sem hver sem vill getur svarað er dæmi um:", ["Einfalt slembiúrtak", "Sjálfboðaliðaúrtak", "Lagskipt slembiúrtak", "Parað úrtak", N], 1, "Fólk velur sig sjálft í úrtakið (<b>sjálfboðaliðaúrtak</b>), sem getur valdið úrtaksbjaga."],
    ["breytur", "Hver er helsti munurinn á tilraun og athugunarrannsókn?", ["Tilraun hefur alltaf fleiri þátttakendur", "Í tilraun ákveður rannsakandi skýribreytuna (t.d. með slembivali), og því má frekar álykta um orsakasamband", "Í athugunarrannsókn eru engar breytur mældar", "Enginn munur er", N], 1, "Í athugunarrannsókn getur blöndun (confounding) skýrt tengsl. Slembival í tilraun ver gegn því."],
    // --- lýsandi
    ["lysandi", "Dreifing tekna er mjög hægri-skekkt. Hvaða mælikvarði á miðju lýsir henni best?", ["Meðaltal", "Miðgildi", "Tíðasta gildi", "Spönn", N], 1, "Miðgildið er ónæmt fyrir útlögum og skekkju. Í hægri-skekktri dreifingu er meðaltalið stærra en miðgildið."],
    ["lysandi", "Í <code>summary()</code> fyrir seinniPuls er Mean = 82.21 og Median = 77. Hvað bendir það til?", ["Dreifingin er vinstri-skekkt", "Dreifingin er hægri-skekkt (langur hali upp)", "Dreifingin er samhverf", "Gögnin eru normaldreifð", N], 1, "Meðaltal &gt; miðgildi bendir til hægri-skekkju: fáir mjög háir púlsar (þeir sem hlupu) toga meðaltalið upp."],
    ["lysandi", "Hvaða graf hentar best til að bera saman dreifingu samfelldrar breytu milli nokkurra hópa?", ["Kökurit", "Kassarit (boxplot)", "Stöplarit yfir fjölda", "Punktarit tveggja talnabreyta", N], 1, "Kassarit sýnir miðgildi, fjórðungamörk og útlaga fyrir hvern hóp hlið við hlið."],
    ["lysandi", "Hvert eftirtalinna er mælikvarði á breytileika?", ["Miðgildi", "Fjórðungaspönn (IQR)", "Tíðasta gildi", "Meðaltal", N], 1, "IQR = Q3 − Q1 mælir breytileika miðju 50% gagnanna. Hin þrjú eru mælikvarðar á miðju."],
    // --- normal / dreifingar
    ["normal", "Hve stór hluti gilda í normaldreifingu liggur u.þ.b. innan μ ± 2σ?", ["68%", "95%", "99.7%", "50%", N], 1, "68–95–99.7 reglan: um 95% innan ±2σ (nákvæmlega ±1.96σ)."],
    ["normal", "Hvaða R-skipun gefur P(X &gt; 140) ef X ~ N(120, 10²)?", ["<code>pnorm(140, 120, 10)</code>", "<code>pnorm(140, 120, 10, lower.tail = FALSE)</code>", "<code>qnorm(140, 120, 10)</code>", "<code>dnorm(140, 120, 10)</code>", N], 1, "<code>pnorm</code> gefur P(X ≤ x) sjálfgefið. <code>lower.tail = FALSE</code> gefur efri halann. <code>dnorm</code> er þéttifall (ekki líkur) og <code>qnorm</code> tekur líkur sem inntak."],
    ["normal", "Meðalþyngd sjúklinga er 75.3 kg og dreifnin 912.02 kg². Hvert er staðalfrávikið?", ["912.02 kg", "30.2 kg", "9.12 kg", "75.3 kg", N], 1, "Staðalfrávik = √dreifni = √912.02 ≈ 30.2 kg. Gætið að muninum á σ og σ² í N(μ, σ²)."],
    ["normal", "Hvað gerir <code>qnorm(0.1, 75, 13)</code>?", ["Gefur P(X ≤ 0.1)", "Gefur gildið x þannig að 10% séu fyrir neðan það", "Gefur þéttifallið í 0.1", "Gefur 10% af 75", N], 1, "<code>q</code>-föllin eru andhverfur dreififallsins (prósentumörk). Hér fæst ≈ 58.34."],
    ["binom", "Hvaða skilyrði þurfa að gilda til að fjöldi „árangra“ fylgi tvíkostadreifingu?", ["Fastur fjöldi óháðra tilrauna með sömu líkur á árangri", "Atburðir gerast á samfelldum tíma með föstum meðalhraða", "Breytan er samfelld og samhverf", "Fjöldi tilrauna er óendanlegur", N], 0, "Bin(n, p): n óháðar Bernoulli-tilraunir, hver með líkur p. Seinni lýsingin á við Poisson."],
    ["binom", "Hver er munurinn á <code>pbinom(3, 5, 0.24, lower.tail = FALSE)</code> og P(X ≥ 3)?", ["Enginn munur", "Skipunin gefur P(X &gt; 3) = P(X ≥ 4), ekki P(X ≥ 3)", "Skipunin gefur P(X = 3)", "Skipunin gefur P(X ≤ 3)", N], 1, "Fyrir strjálar dreifingar gefur <code>lower.tail = FALSE</code> P(X &gt; k). P(X ≥ 3) fæst með <code>pbinom(2, …, lower.tail = FALSE)</code>."],
    ["poisson", "Hvaða dreifing er eðlilegt líkan fyrir fjölda nýrra inflúensutilfella sem tilkynnt eru á dag?", ["Normaldreifing", "Poisson-dreifing", "Tvíkostadreifing", "t-dreifing", N], 1, "Talning atburða á föstu tímabili með föstum meðalhraða: <b>Poisson(λ)</b>."],
    ["poisson", "Ef X ~ Poisson(λ = 4), hver er dreifni X?", ["2", "4", "16", "√4", N], 1, "Í Poisson er E[X] = Var[X] = λ."],
    ["clt", "Meðalþyngd 100 sjúklinga (μ = 75.3 kg, σ² = 912.02 kg²). Hvaða dreifingu fylgir meðaltalið X̄ nálgunarlega?", ["N(75.3, 912.02)", "N(75.3, 9.1202)", "N(75.3, 30.2)", "Poisson(75.3)", N], 1, "Höfuðsetning tölfræðinnar: X̄ ≈ N(μ, σ²/n) = N(75.3, 912.02/100) = N(75.3, 9.1202)."],
    ["clt", "Hvað segir höfuðsetning tölfræðinnar (CLT)?", ["Að öll gögn séu normaldreifð ef úrtakið er stórt", "Að úrtaksdreifing meðaltalsins nálgist normaldreifingu þegar n stækkar, óháð lögun upphaflegu dreifingarinnar (með endanlega dreifni)", "Að meðaltalið sé alltaf jafnt μ", "Að staðalfrávikið minnki ekki með n", N], 1, "CLT fjallar um dreifingu <b>meðaltalsins</b>, ekki einstakra mælinga."],
    ["clt", "Hvað gerist við staðalskekkju meðaltalsins ef úrtaksstærðin er fjórfölduð?", ["Hún helmingast", "Hún fjórfaldast", "Hún minnkar um fjórðung", "Ekkert", N], 0, "SE = σ/√n; √4 = 2, svo SE helmingast."],
    // --- öryggisbil
    ["oryggisbil", "95% öryggisbil fyrir meðaltal er [118.2, 124.6]. Hvaða túlkun er rétt?", ["95% einstaklinga eru með gildi á bilinu", "Ef við endurtækjum úrtökuna oft myndu um 95% slíkra bila innihalda sanna meðaltalið μ", "Líkurnar á að x̄ sé á bilinu eru 95%", "μ er örugglega á bilinu", N], 1, "Öryggið vísar til aðferðarinnar: 95% bila sem búin eru til svona innihalda sanna gildið. Bilið segir ekkert um einstaklinga."],
    ["oryggisbil", "Hvaða bil er breiðast (sama úrtak)?", ["90% öryggisbil", "95% öryggisbil", "99% öryggisbil", "Þau eru öll jafnbreið", N], 2, "Meira öryggi krefst stærri margfaldara (z = 1.645, 1.96, 2.576), svo 99% bilið er breiðast."],
    ["oryggisbil", "Hvernig breytist breidd öryggisbils þegar úrtakið stækkar (annað óbreytt)?", ["Það breikkar", "Það mjókkar", "Óbreytt", "Það fer eftir p-gildinu", N], 1, "Breiddin er í hlutfalli við 1/√n."],
    ["oryggisbil", "95% öryggisbil fyrir mun á meðaltölum tveggja hópa er [−4.06, 7.43]. Hvað má álykta við α = 0.05?", ["Marktækur munur er á hópunum", "Ekki er marktækur munur, því 0 er innan bilsins", "Hópur 1 hefur hærra meðaltal", "p-gildið er minna en 0.05", N], 1, "Bilið inniheldur 0, svo tvíhliða prófið hafnar ekki H₀: μ₁ − μ₂ = 0 (p &gt; 0.05)."],
    // --- tilgátupróf
    ["tilgatur", "Hvað er villa af gerð I?", ["Að hafna H₀ þegar H₀ er sönn", "Að hafna ekki H₀ þegar H₀ er ósönn", "Að fá p-gildi stærra en α", "Að nota rangt próf", N], 0, "Gerð I = falsk jákvæð niðurstaða (líkur α). Gerð II = að missa af raunverulegum mun (líkur β)."],
    ["tilgatur", "Lyf lækkar í raun blóðþrýsting, en tilgátupróf gefur p = 0.059 (α = 0.05). Hvað gerðist?", ["Villa af gerð I", "Villa af gerð II", "Engin villa", "Bæði villa af gerð I og II", N], 1, "H₀ er ósönn (lyfið virkar) en við höfnum henni ekki: <b>villa af gerð II</b>."],
    ["tilgatur", "Styrkur (power) tilgátuprófs er:", ["P(hafna H₀ | H₀ sönn)", "P(hafna H₀ | H₀ ósönn) = 1 − β", "p-gildið", "1 − α", N], 1, "Styrkur eru líkurnar á að greina raunverulegan mun. Hann eykst með stærra úrtaki, stærri áhrifum og minni breytileika."],
    ["tilgatur", "Hvað er p-gildi?", ["Líkurnar á að H₀ sé sönn", "Líkurnar á að fá jafn öfgafulla eða öfgafyllri prófstærð en þá sem sást, ef H₀ er sönn", "Líkurnar á villu af gerð II", "Marktektarkrafan α", N], 1, "p-gildið er reiknað <b>miðað við að H₀ sé sönn</b>. Það eru ekki líkurnar á að H₀ sé sönn."],
    ["tilgatur", "Ef tvíhliða p-gildi er 0.03, hvað má segja um 95% öryggisbilið fyrir sama stika?", ["Það inniheldur gildið í H₀", "Það inniheldur ekki gildið í H₀", "Það er ekki hægt að segja", "Það er 97% bil", N], 1, "Tvíhliða próf við α hafnar H₀ nákvæmlega þegar (1 − α) öryggisbilið inniheldur ekki H₀-gildið."],
    ["tilgatur", "Blóðþrýstingur er mældur hjá 50 manns, fyrir og eftir 6 mánuði á lyfi. Villa af gerð I átti sér stað. Hvað gerðist?", ["Ekki var ályktað um mun þótt munur sé í raun", "Ályktað var að munur væri á meðalblóðþrýstingi fyrir og eftir, þótt í raun sé ekki munur", "p-gildið var hærra en α", "Gögnin voru ekki pöruð", N], 1, "Gerð I = hafna sannri H₀ (finna „mun“ sem er ekki til)."],
    ["tilgatur", "Hvað eykur styrk prófs (annað óbreytt)?", ["Minna úrtak", "Lægra α (t.d. 0.01 í stað 0.05)", "Stærra úrtak", "Meiri breytileiki í gögnum", N], 2, "Stærra n minnkar staðalskekkjuna og eykur styrk. Lægra α minnkar styrk."],
    // --- t-próf
    ["ttest", "Blóðþrýstingur mældur hjá sömu 50 einstaklingum fyrir og eftir meðferð. Hvaða próf?", ["Parað t-próf", "Óparað t-próf", "Kí-kvaðrat próf", "Poisson-nálgun", N], 0, "Tvær mælingar á sama einstaklingi eru háðar: <b>parað t-próf</b> á mismuninn (eitt-úrtaks t-próf á d = eftir − fyrir)."],
    ["ttest", "Af hverju er t-dreifing frekar notuð en normaldreifing þegar ályktað er um meðaltöl?", ["Af því að gögnin eru alltaf skekkt", "Af því að σ er óþekkt og metið með s, sem eykur óvissu. t-dreifingin hefur þykkari hala, sérstaklega fyrir lítið n", "Af því að t-dreifingin er samhverf en normaldreifingin ekki", "Af því að úrtakið er alltaf stórt", N], 1, "Þegar s er notað í stað σ fylgir (x̄ − μ)/(s/√n) t-dreifingu með n − 1 frígráður. Hún nálgast N(0,1) þegar n stækkar."],
    ["ttest", "Hver er núlltilgátan í óparaða t-prófinu <code>t.test(SYSBP ~ sykursyki)</code>?", ["H₀: μ<sub>No</sub> = μ<sub>Yes</sub> (enginn munur á meðalblóðþrýstingi)", "H₀: μ<sub>No</sub> ≠ μ<sub>Yes</sub>", "H₀: x̄<sub>No</sub> = x̄<sub>Yes</sub>", "H₀: dreifnin er jöfn", N], 0, "Tilgátur eru um <b>stika þýðisins</b> (μ), ekki úrtaksmeðaltöl (x̄). Gagntilgáta: μ<sub>No</sub> ≠ μ<sub>Yes</sub>."],
    ["ttest", "Lalli mælir langstökk allra nemenda í skólanum og vill vita hvort meðalstökk sé lengra en 4 m. Hvaða próf?", ["Kí-kvaðrat próf", "Tilgátupróf fyrir eitt meðaltal (eins úrtaks t-próf, einhliða)", "Próf fyrir dreifni tveggja þýða", "Parað t-próf", N], 1, "Eitt meðaltal borið saman við fast gildi: <code>t.test(x, mu = 4, alternative = \"greater\")</code>."],
    ["ttest", "Hver er forsenda t-prófs fyrir tvö óháð úrtök með <code>var.equal = TRUE</code>?", ["Úrtökin séu pöruð", "Dreifnin sé sú sama í báðum þýðum (og mælingar u.þ.b. normaldreifðar eða n stórt)", "Hlutföllin séu jöfn", "Úrtaksstærðin sé sú sama", N], 1, "Vegin dreifni (pooled variance) gerir ráð fyrir jafnri dreifni. Annars Welch-próf."],
    // --- hlutföll
    ["hlutfoll", "Hvaða próf hentar til að kanna hvort tengsl séu á milli reykinga (já/nei) og kyns?", ["Óparað t-próf", "Kí-kvaðrat próf á tengslatöflu (eða prop.test)", "ANOVA", "Línulegt aðhvarf", N], 1, "Tvær flokkabreytur → tengslatafla og kí-kvaðrat próf. <code>prop.test</code> á 2×2 töflu gefur sama χ²."],
    ["hlutfoll", "Hvenær ætti að nota Fisher-próf í stað kí-kvaðrat prófs?", ["Þegar n er mjög stórt", "Þegar væntar tíðnir eru litlar (t.d. undir 5)", "Þegar breyturnar eru samfelldar", "Aldrei", N], 1, "Kí-kvaðrat nálgunin verður ónákvæm með litlar væntar tíðnir; R varar við: „Chi-squared approximation may be incorrect“."],
    ["hlutfoll", "Gagnlíkindahlutfall (OR) = 1 þýðir:", ["Engin tengsl milli útsetningar og útkomu", "Útsettir eru tvöfalt líklegri", "Allir fengu sjúkdóminn", "Líkurnar eru 100%", N], 0, "OR = 1: gagnlíkindin eru þau sömu í báðum hópum. Öryggisbil sem inniheldur 1 → ekki marktæk tengsl."],
    ["hlutfoll", "Ef líkur eru p = 0.2, hver eru gagnlíkindin (odds)?", ["0.2", "0.25", "0.8", "4", N], 1, "Gagnlíkindi = p/(1 − p) = 0.2/0.8 = 0.25."],
    // --- ANOVA
    ["anova", "Hver er núlltilgátan í ANOVA með þremur hópum?", ["H₀: μ₁ = μ₂ = μ₃", "H₀: a.m.k. eitt meðaltal er ólíkt", "H₀: dreifnin er ólík", "H₀: μ₁ ≠ μ₂ ≠ μ₃", N], 0, "Gagntilgátan er að a.m.k. eitt meðaltal sé frábrugðið hinum, ekki að öll séu ólík."],
    ["anova", "Á hverju byggir F-prófstærðin í ANOVA?", ["Hlutfalli breytileika <b>milli</b> hópa og breytileika <b>innan</b> hópa", "Mun á miðgildum", "Fjölda hópa", "Fylgni milli hópa", N], 0, "F = MS<sub>milli</sub>/MS<sub>innan</sub>. Ef meðaltölin eru ólík verður breytileikinn milli hópa mikill miðað við suðið innan hópa, og F verður stórt."],
    ["anova", "Hverjar eru forsendur ANOVA?", ["Óháðar mælingar, normaldreifðar leifar og jöfn dreifni milli hópa", "Að hóparnir séu jafnstórir", "Að svarbreytan sé flokkabreyta", "Að n &gt; 1000", N], 0, "Kassarit hjálpa til við að meta jafna dreifni og skekkju; normaldreifingarrit (QQ) fyrir leifar."],
    ["anova", "ANOVA gefur p &lt; 0.05 fyrir fjóra aldurshópa. Hvað má álykta?", ["Öll meðaltölin eru ólík", "A.m.k. eitt meðaltal er frábrugðið hinum. Til að vita hvaða þarf eftirápróf (t.d. Tukey)", "Elsti hópurinn hefur hæsta meðaltalið", "Dreifnin er ólík", N], 1, "ANOVA segir aðeins að munur sé til staðar einhvers staðar."],
    // --- aðhvarf
    ["adhvarf", "Hverjar eru forsendur einfalds línulegs aðhvarfs?", ["Línulegt samband, óháðar leifar, normaldreifðar leifar og jöfn dreifni leifa", "Að x og y séu normaldreifðar", "Að R² sé hærra en 0.5", "Að skurðpunkturinn sé 0", N], 0, "Metið með punktariti (línulegt?), leifariti (mynstur? jöfn dreifing?) og QQ-riti leifa (normaldreifðar?)."],
    ["adhvarf", "Hvernig túlkar þú hallatöluna 1.79 í <code>lm(SYSBP ~ BMI)</code>?", ["Fyrir hverja einingu sem BMI hækkar hækkar meðalblóðþrýstingur um 1.79 mmHg", "BMI skýrir 1.79% af breytileika", "Blóðþrýstingur er 1.79 sinnum hærri", "Fylgnin er 1.79", N], 0, "Hallatalan er vænt breyting á y fyrir einnar einingar aukningu í x."],
    ["adhvarf", "Líkan var metið á gögnum með BMI frá 15.5 til 56.8. Er spá fyrir BMI = 60 áreiðanleg?", ["Já, alltaf", "Nei, það er bryggjun (utan gagnasviðs), sambandið gæti verið annað þar", "Já, ef R² er hátt", "Nei, því 60 er slétt tala", N], 1, "Spá utan sviðs gagnanna (extrapolation) byggir á ósannreyndri forsendu."],
    ["adhvarf", "Hvað segir R² = 0.1076 í <code>lm(SYSBP ~ BMI)</code>?", ["Um 10.8% breytileikans í SYSBP skýrist af BMI", "Sambandið er ekki marktækt", "Hallatalan er 0.1076", "Fylgnin er 0.1076", N], 0, "Samband getur verið mjög marktækt (p &lt; 2e-16 með n = 4415) en samt skýrt lítinn hluta breytileikans."],
    ["adhvarf", "Leifarit (residuals vs fitted) sýnir trektlaga mynstur: leifar dreifast meira fyrir há spágildi. Hvaða forsenda bregst?", ["Línulegt samband", "Jöfn dreifni leifa", "Óháðar mælingar", "Engin", N], 1, "Trekt bendir til ójafnrar dreifni (heteroscedasticity). Umbreyting (t.d. log y) getur hjálpað."],
    // --- tvíkosta
    ["tvikosta", "Hvaða tengifall er notað í tvíkosta aðhvarfsgreiningu?", ["Logit: log(p/(1 − p))", "Auðkennisfall: y = p", "Log: log(y)", "Kvaðratrót", N], 0, "logit(p) = β₀ + β₁x, og p = 1/(1 + e<sup>−(β₀ + β₁x)</sup>)."],
    ["tvikosta", "Stuðull <code>bmi</code> í <code>glm(sykursyki ~ age + bmi, family = \"binomial\")</code> er 0.0687 (p = 0.002). Hvað þýðir exp(0.0687) = 1.071?", ["Líkur á sykursýki hækka um 1.071 prósentustig fyrir hverja BMI-einingu", "Gagnlíkindi sykursýki hækka um u.þ.b. 7.1% fyrir hverja BMI-einingu, leiðrétt fyrir aldri", "7.1% hafa sykursýki", "BMI skýrir 7.1% breytileikans", N], 1, "exp(β) er gagnlíkindahlutfall (OR) fyrir einnar einingar aukningu, að öðrum breytum óbreyttum."],
    ["tvikosta", "Hvað skrifar þú í R til að fá tvíkosta aðhvarf?", ["<code>lm(y ~ x)</code>", "<code>glm(y ~ x, family = \"binomial\")</code>", "<code>glm(y ~ x, family = \"gaussian\")</code>", "<code>coxph(y ~ x)</code>", N], 1, "<code>family = \"gaussian\"</code> gefur sama og <code>lm</code>."],
    // --- næmi
    ["naemi", "Næmi (sensitivity) greiningarprófs er:", ["P(T+ | D+)", "P(T− | D−)", "P(D+ | T+)", "P(D− | T−)", N], 0, "Næmi = hlutfall veikra sem prófið greinir jákvæða. Sértæki = P(T− | D−). PPV = P(D+ | T+). NPV = P(D− | T−)."],
    ["naemi", "Sama greiningarpróf er notað í hópi þar sem sjúkdómurinn er sjaldgæfari. Hvað gerist?", ["Næmi lækkar", "Sértæki lækkar", "PPV lækkar en NPV hækkar", "Ekkert breytist", N], 2, "Næmi og sértæki eru eiginleikar prófsins. Forspárgildin ráðast líka af algengi: færri sannir jákvæðir → lægra PPV."],
    ["naemi", "Hvað sýnir ROC-ferill?", ["Næmi á móti 1 − sértæki fyrir öll möguleg skurðgildi", "PPV á móti NPV", "Lifun á móti tíma", "Leifar á móti spágildum", N], 0, "Flatarmál undir ferlinum (AUC) mælir greiningarhæfni: 0.5 = tilviljun, 1 = fullkomið."],
    // --- lifun
    ["lifun", "Hvað er skerðing (censoring) í lifunargreiningu?", ["Þátttakandi sem lést", "Þátttakandi sem við vitum aðeins að lifði a.m.k. til ákveðins tíma (t.d. rannsókn lauk eða hann týndist)", "Útlagi í gögnunum", "Þátttakandi sem fékk lyfleysu", N], 1, "Skertar mælingar gefa hlutaupplýsingar: atburður hefur ekki átt sér stað þegar eftirfylgd lýkur. Kaplan–Meier nýtir þær."],
    ["lifun", "Cox-líkan gefur exp(coef) = 1.88 fyrir hjartasjúkdóm (p &lt; 0.001). Hvaða túlkun er rétt?", ["Þeir sem eru með hjartasjúkdóm eru í 1.88 sinnum meiri áhættu (hazard) á að deyja en þeir sem ekki eru með hann, og tengslin eru marktæk", "Þeir sem eru ekki með hjartasjúkdóm eru í 1.88 sinnum meiri áhættu", "88% þeirra með hjartasjúkdóm deyja", "Tengslin eru ekki marktæk", N], 0, "exp(coef) er áhættuhlutfall (HR) miðað við viðmiðunarflokkinn. p &lt; 0.05 → marktækt."],
    ["lifun", "Hvernig lestu miðgildi lifunartíma af Kaplan–Meier grafi?", ["Þar sem ferillinn sker y = 0.5, lestu tímann af x-ás", "Þar sem ferillinn endar", "Meðaltal allra tíma", "Þar sem ferillinn sker y = 0", N], 0, "Miðgildið er tíminn þegar metin lifun fer niður í 50%. Ef ferillinn fer aldrei niður fyrir 0.5 er það ekki skilgreint (NA í R)."],
    ["lifun", "Hvaða forsenda liggur að baki Cox-líkaninu?", ["Hlutfallsleg áhætta (proportional hazards): HR er fast yfir tíma", "Lifunartími er normaldreifður", "Engin skerðing", "Að allir deyi", N], 0, "Cox-líkanið gerir ekki ráð fyrir lögun grunnáhættunnar, aðeins að hlutfallið milli hópa sé fast."],
    ["lifun", "Hvaða próf ber saman Kaplan–Meier feril tveggja hópa?", ["t-próf", "Log-rank próf", "F-próf", "Kí-kvaðrat mátgæðapróf", N], 1, "Log-rank (<code>survdiff</code>) ber saman lifun yfir allan tímann; í <code>summary(coxph)</code> heitir það „Score (logrank) test“."]
  ];
  var CONCEPTS = MC.map(function (m, i) { return { id: "c" + i, skill: m[0], type: "mc", q: m[1], opts: m[2], a: m[3], ex: "<p>" + m[4] + "</p>" }; });

  // Breytir talnadæmi í krossaspurningu (fyrir prófherminn). Stundum er rétta svarið „Ekkert að ofan er rétt“.
  function toMC(t) {
    if (t.type === "mc") return t;
    var d = t.d == null ? 3 : Math.max(t.d, 2), seen = {}, opts = [];
    function add(v) { var s = f(v, d); if (!isFinite(v) || seen[s]) return false; seen[s] = 1; opts.push(s); return true; }
    add(t.a);
    (t.wrong || []).forEach(function (w) { if (opts.length < 4) add(w); });
    var step = Math.max(Math.abs(t.a) * 0.13, 3 * Math.pow(10, -d)), k = 1;
    var isProb = t.a >= 0 && t.a <= 1 && (t.wrong || []).every(function (w) { return w >= -1e-9 && w <= 1 + 1e-9; });
    function fill() { while (opts.length < 4 && k < 60) { var v = t.a + (k % 2 ? 1 : -1) * step * Math.ceil(k / 2); k++; if (!isProb || (v > 0 && v < 1)) add(v); } }
    fill();
    var noneRight = Math.random() < 0.15, correct = opts[0];
    if (noneRight) {
      // skipta rétta svarinu út fyrir nýjan truflara sem er ekki þegar til
      opts.shift(); delete seen[correct]; seen[correct] = 1; fill();
    }
    var sh = A.shuffle(opts);
    sh.push(N);
    var a = noneRight ? 4 : sh.indexOf(correct);
    return { skill: t.skill, type: "mc", keep: true, q: t.q + (t.unit ? " (" + t.unit + ")" : ""), opts: sh, a: a,
      ex: (noneRight ? "<p>Rétt gildi (" + correct + ") er ekki meðal kostanna, svo „Ekkert að ofan er rétt“.</p>" : "") + (t.ex || ""), r: t.r };
  }

  function make(g) { var t = g.fn(); t.skill = g.skill; t.type = t.type || "num"; t.gen = g.name; return t; }
  function forSkills(skills) {
    var gs = GEN.filter(function (g) { return !skills || skills.indexOf(g.skill) >= 0; });
    var cs = CONCEPTS.filter(function (c) { return !skills || skills.indexOf(c.skill) >= 0; });
    return { gens: gs, concepts: cs };
  }
  // Velur næsta dæmi: helmingur hugtök, helmingur útreikningar (ef til)
  function next(skills, avoid) {
    var p = forSkills(skills), useGen = p.gens.length && (!p.concepts.length || Math.random() < 0.55);
    if (useGen) return make(pick(p.gens));
    var pool = p.concepts.filter(function (c) { return !avoid || avoid.indexOf(c.id) < 0; });
    return pick(pool.length ? pool : p.concepts);
  }
  window.Items = { GEN: GEN, CONCEPTS: CONCEPTS, make: make, next: next, toMC: toMC, forSkills: forSkills };

  // ---------- Yfir í snið TK.bank ----------
  var B = window.TK && window.TK.bank;
  if (!B) return;
  var LABEL = {};
  B.TOPICS.forEach(function (t) { LABEL[t.id] = t.label; });
  var TITLE = {
    upper: "Líkur í efri hala", between: "Líkur á bili", quantile: "Prósentumark", expected: "Væntanlegur fjöldi",
    atleast: "Að minnsta kosti k", fewer: "Færri en k", exact: "Nákvæmlega k", mean: "Dreifni og staðalfrávik",
    atmost: "k eða færri", twoperiod: "Tvöfalt tímabil", se: "Staðalskekkja meðaltals", pbar: "Líkur fyrir meðaltal",
    poismean: "Dreifing meðaltals (CLT)", prop: "Öryggisbil fyrir hlutfall", coverage: "Hve mörg bil hitta?",
    nfromwidth: "Úrtaksstærð", onesample: "Prófstærð t", pvalue: "p-gildi úr t", or: "Gagnlíkindahlutfall",
    rr: "Áhættuhlutfall", F: "F-gildi úr ANOVA-töflu", df: "Frígráður í ANOVA", predict: "Spá úr aðhvarfslíkani",
    ci: "Öryggisbil hallatölu", tval: "t-gildi í summary(lm)", r2: "Skýrður breytileiki", prob: "Líkur úr tvíkosta líkani",
    table: "Úr 2×2 töflu greiningarprófs", bayes: "PPV út frá algengi", hr: "Áhættuhlutfall í Cox", median: "Miðgildi",
    sd: "Staðalfrávik úrtaks", iqr: "Útlagamörk í kassariti"
  };
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  GEN.forEach(function (g) {
    var probe = make(g);
    if (probe.type === "mc") {
      var seenQ = {};
      for (var k = 0; k < 8; k++) {
        var t = make(g);
        if (seenQ[t.q]) continue;
        seenQ[t.q] = 1;
        var o = [t.opts[t.a]].concat(t.opts.filter(function (x, j) { return j !== t.a && !/Ekkert að ofan/.test(x); }));
        B.MC.push({ topic: g.skill, q: t.q, o: o, c: 0, e: t.ex.replace(/^<p>|<\/p>$/g, "") });
      }
      return;
    }
    var fn = function () {
      var t = make(g), tol = t.tol == null ? { rel: 0.012, abs: 0.0006 } : typeof t.tol === "number" ? { abs: t.tol } : t.tol;
      return { topic: g.skill, title: TITLE[g.name] || LABEL[g.skill], text: "<p>" + t.q + "</p>", answer: t.a, unit: t.unit || "",
        tol: tol.rel || 1e-9, absTol: Math.max(tol.abs || 0, t.a ? 0.51 * Math.pow(10, Math.floor(Math.log10(Math.abs(t.a))) - 3) : 0),
        sol: (t.ex || "") + (t.r ? '<pre class="rcode">' + esc(t.r) + "</pre>" : "") };
    };
    fn.topic = g.skill;
    B.G.push(fn);
  });
  CONCEPTS.forEach(function (c) {
    var right = c.opts[c.a];
    if (/Ekkert að ofan/.test(right)) return;
    var o = [right].concat(c.opts.filter(function (x, j) { return j !== c.a && !/Ekkert að ofan/.test(x); }));
    B.MC.push({ topic: c.skill, q: c.q, o: o, c: 0, e: c.ex.replace(/^<p>|<\/p>$/g, "") });
  });
})();

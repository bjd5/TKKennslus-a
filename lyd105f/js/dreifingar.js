/* dreifingar.js – Dreifingaborðið (dreifingar.html): normal-, t-, tvíkosta- og Poisson-dreifing og dreifing meðaltalsins.
 * Skyggða svæðið sýnir líkurnar sem spurt er um; undir grafinu er R-skipunin og útreikningurinn með z-töflu. */
(function () {
  "use strict";
  var A = window.App, S = window.Stat, h = A.h, esc = A.esc, f = A.fmt;
  function mount(main) {

    var st = { dist: "norm", q: "le", mu: 120, sd: 10, df: 5, n: 10, p: 0.3, lam: 4, a: 135, b: 140, pr: 0.95, cn: 25 };
    var bench = h("div", { class: "bench" });
    var ctrl = h("div", { class: "panel ctrl" });
    var view = h("div", { class: "panel dview" });
    bench.appendChild(ctrl); bench.appendChild(view);
    main.appendChild(bench);

    var DISTS = [["norm", "Normal"], ["t", "t"], ["binom", "Tvíkosta"], ["pois", "Poisson"], ["clt", "Meðaltal"]];
    function seg(items, key, cb) {
      var s = h("div", { class: "seg", role: "group" });
      items.forEach(function (it) {
        var b = h("button", { type: "button", "aria-pressed": st[key] === it[0] ? "true" : "false" }, it[1]);
        b.addEventListener("click", function () { st[key] = it[0]; cb(); });
        s.appendChild(b);
      });
      return s;
    }
    function num(label, key, step, min, max) {
      var w = h("div");
      w.appendChild(h("label", { for: "in-" + key }, label));
      var i = h("input", { type: "number", id: "in-" + key, value: st[key], step: step, min: min, max: max });
      i.addEventListener("input", function () { var v = parseFloat(i.value); if (isFinite(v)) { st[key] = v; draw(); } });
      w.appendChild(i);
      return w;
    }
    function discrete() { return st.dist === "binom" || st.dist === "pois"; }
    function build() {
      ctrl.innerHTML = "";
      ctrl.appendChild(h("label", null, "Dreifing"));
      ctrl.appendChild(seg(DISTS, "dist", function () {
        if (discrete()) { st.a = Math.round(st.dist === "pois" ? 3 : 3); st.b = st.a + 2; if (st.q === "q") st.q = "le"; }
        else if (st.dist === "t") { st.a = 2; st.b = 2.5; }
        else if (st.dist === "clt") { st.a = 123; st.b = 125; }
        else { st.a = 135; st.b = 140; }
        build();
      }));
      var Q = [["le", discrete() ? "P(X ≤ a)" : "P(X < a)"], ["ge", discrete() ? "P(X ≥ a)" : "P(X > a)"], ["bw", "a til b"]];
      if (discrete()) Q.push(["eq", "P(X = a)"]); else Q.push(["q", "Prósentumark"]);
      if (st.q === "eq" && !discrete()) st.q = "le";
      ctrl.appendChild(h("label", null, "Spurning"));
      ctrl.appendChild(seg(Q, "q", build));
      if (st.dist === "norm") { ctrl.appendChild(num("Meðaltal μ", "mu", 1)); ctrl.appendChild(num("Staðalfrávik σ", "sd", 0.5, 0.1)); }
      if (st.dist === "t") ctrl.appendChild(num("Frígráður (df = n − 1)", "df", 1, 1, 500));
      if (st.dist === "binom") { ctrl.appendChild(num("Fjöldi tilrauna n", "n", 1, 1, 60)); ctrl.appendChild(num("Líkur á árangri p", "p", 0.01, 0, 1)); }
      if (st.dist === "pois") ctrl.appendChild(num("Meðalfjöldi λ", "lam", 0.5, 0.1, 40));
      if (st.dist === "clt") { ctrl.appendChild(num("Meðaltal þýðis μ", "mu", 1)); ctrl.appendChild(num("Staðalfrávik þýðis σ", "sd", 0.5, 0.1)); ctrl.appendChild(num("Úrtaksstærð n", "cn", 1, 1, 1000)); }
      if (st.q === "q") ctrl.appendChild(num("Líkur p, þ.e. P(X < x) = p", "pr", 0.01, 0.001, 0.999));
      else { ctrl.appendChild(num(st.q === "bw" ? "Neðri mörk a" : "a", "a", discrete() ? 1 : 0.5)); if (st.q === "bw") ctrl.appendChild(num("Efri mörk b", "b", discrete() ? 1 : 0.5)); }
      if (st.dist === "t") ctrl.appendChild(h("p", { class: "hint" }, "Strikaða línan er staðlaða normaldreifingin. Sjáðu hvernig t-dreifingin hefur þykkari hala þegar frígráður eru fáar, og nálgast N(0, 1) þegar þær fjölga."));
      if (st.dist === "clt") ctrl.appendChild(h("p", { class: "hint" }, "Strikaða línan er dreifing einstakra mælinga, N(μ, σ²). Heila línan er dreifing meðaltalsins, N(μ, σ²/n). Hún mjókkar þegar n stækkar."));
      draw();
    }

    function model() {
      var d = st.dist;
      if (d === "norm") return { c: true, pdf: function (x) { return S.dnorm(x, st.mu, st.sd); }, cdf: function (x) { return S.pnorm(x, st.mu, st.sd); }, q: function (p) { return S.qnorm(p, st.mu, st.sd); }, lo: st.mu - 4 * st.sd, hi: st.mu + 4 * st.sd, R: "norm", args: ", mean = " + st.mu + ", sd = " + st.sd, name: "X ~ N(" + st.mu + ", " + st.sd + "²)" };
      if (d === "clt") { var se = st.sd / Math.sqrt(st.cn); return { c: true, pdf: function (x) { return S.dnorm(x, st.mu, se); }, pdf2: function (x) { return S.dnorm(x, st.mu, st.sd); }, cdf: function (x) { return S.pnorm(x, st.mu, se); }, q: function (p) { return S.qnorm(p, st.mu, se); }, lo: st.mu - 4 * st.sd, hi: st.mu + 4 * st.sd, R: "norm", args: ", mean = " + st.mu + ", sd = " + st.sd + " / sqrt(" + st.cn + ")", name: "X̄ ~ N(" + st.mu + ", " + st.sd + "²/" + st.cn + "), SE = " + f(se, 4), se: se }; }
      if (d === "t") return { c: true, pdf: function (x) { return S.dt(x, st.df); }, pdf2: function (x) { return S.dnorm(x); }, cdf: function (x) { return S.pt(x, st.df); }, q: function (p) { return S.qt(p, st.df); }, lo: -5, hi: 5, R: "t", args: ", df = " + st.df, name: "T ~ t(" + st.df + ")" };
      if (d === "binom") { var n = Math.max(1, Math.round(st.n)), p = Math.min(1, Math.max(0, st.p)); return { c: false, pmf: function (k) { return S.dbinom(k, n, p); }, cdf: function (k) { return S.pbinom(k, n, p); }, lo: 0, hi: n, R: "binom", args: ", size = " + n + ", prob = " + p, name: "X ~ Bin(" + n + ", " + p + ")", mean: n * p, v: n * p * (1 - p) }; }
      var l = Math.max(0.1, st.lam); return { c: false, pmf: function (k) { return S.dpois(k, l); }, cdf: function (k) { return S.ppois(k, l); }, lo: 0, hi: Math.ceil(l + 5 * Math.sqrt(l) + 3), R: "pois", args: ", lambda = " + l, name: "X ~ Poisson(" + l + ")", mean: l, v: l };
    }

    function draw() {
      var m = model(), W = 640, H = 300, P = { l: 40, r: 16, t: 18, b: 34 };
      var a = st.a, b = Math.max(st.a, st.b), res, rc, ex, inside;
      if (!m.c) { a = Math.round(a); b = Math.round(b); }
      if (st.q === "le") { res = m.c ? m.cdf(a) : m.cdf(a); rc = "p" + m.R + "(" + a + m.args + ")"; inside = function (x) { return x <= a; }; }
      if (st.q === "ge") { res = m.c ? 1 - m.cdf(a) : 1 - m.cdf(a - 1); rc = m.c ? "p" + m.R + "(" + a + m.args + ", lower.tail = FALSE)" : "1 - p" + m.R + "(" + (a - 1) + m.args + ")   # P(X ≥ " + a + ") = 1 − P(X ≤ " + (a - 1) + ")"; inside = function (x) { return x >= a; }; }
      if (st.q === "bw") { res = m.c ? m.cdf(b) - m.cdf(a) : m.cdf(b) - m.cdf(a - 1); rc = m.c ? "p" + m.R + "(" + b + m.args + ") - p" + m.R + "(" + a + m.args + ")" : "sum(d" + m.R + "(" + a + ":" + b + m.args + "))"; inside = function (x) { return x >= a && x <= b; }; }
      if (st.q === "eq") { res = m.pmf(a); rc = "d" + m.R + "(" + a + m.args + ")"; inside = function (x) { return x === a; }; }
      var qx;
      if (st.q === "q") { qx = m.q(st.pr); res = qx; rc = "q" + m.R + "(" + st.pr + m.args + ")"; inside = function (x) { return x <= qx; }; }

      var svg = '<svg class="plot" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Graf af ' + esc(m.name) + '">';
      var xs = function (x) { return P.l + (x - m.lo) / (m.hi - m.lo) * (W - P.l - P.r); };
      var ymax = 0, i, pts = [];
      if (m.c) {
        var N = 240;
        for (i = 0; i <= N; i++) { var x = m.lo + (m.hi - m.lo) * i / N; pts.push([x, m.pdf(x)]); ymax = Math.max(ymax, m.pdf(x), m.pdf2 ? m.pdf2(x) : 0); }
      } else { for (i = m.lo; i <= m.hi; i++) ymax = Math.max(ymax, m.pmf(i)); }
      ymax *= 1.1;
      var ys = function (y) { return H - P.b - y / ymax * (H - P.t - P.b); };
      svg += '<line class="ax" x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + (H - P.b) + '" y2="' + (H - P.b) + '"/>';
      // ásmerki
      var ticks = 8, step = niceStep((m.hi - m.lo) / ticks), t0 = Math.ceil(m.lo / step) * step;
      if (!m.c) { step = Math.max(1, Math.round(step)); t0 = 0; }
      for (var tx = t0; tx <= m.hi + 1e-9; tx += step) svg += '<text class="tick" text-anchor="middle" x="' + xs(tx) + '" y="' + (H - P.b + 18) + '">' + f(tx, 2) + "</text>";
      if (m.c) {
        var area = pts.filter(function (p) { return inside(p[0]); });
        if (area.length) {
          var dA = "M" + xs(area[0][0]) + "," + ys(0) + area.map(function (p) { return "L" + xs(p[0]) + "," + ys(p[1]); }).join("") + "L" + xs(area[area.length - 1][0]) + "," + ys(0) + "Z";
          svg += '<path class="area" d="' + dA + '"/>';
        }
        if (m.pdf2) svg += '<path class="curve2" d="' + pts.map(function (p, j) { return (j ? "L" : "M") + xs(p[0]) + "," + ys(m.pdf2(p[0])); }).join("") + '"/>';
        svg += '<path class="curve" d="' + pts.map(function (p, j) { return (j ? "L" : "M") + xs(p[0]) + "," + ys(p[1]); }).join("") + '"/>';
      } else {
        var bw = Math.max(2, (W - P.l - P.r) / (m.hi - m.lo + 1) * 0.72);
        for (i = m.lo; i <= m.hi; i++) svg += '<rect class="bar' + (inside(i) ? " on" : "") + '" x="' + (xs(i) - bw / 2) + '" y="' + ys(m.pmf(i)) + '" width="' + bw + '" height="' + (ys(0) - ys(m.pmf(i))) + '" rx="2"><title>P(X = ' + i + ") = " + f(m.pmf(i), 4) + "</title></rect>";
      }
      svg += "</svg>";

      var expl = "";
      if (st.dist === "norm" || st.dist === "clt") {
        var sd = st.dist === "clt" ? m.se : st.sd;
        if (st.q === "q") expl = "z<sub>" + st.pr + "</sub> = " + f(S.qnorm(st.pr), 3) + " og x = μ + z·σ = " + st.mu + " + " + f(S.qnorm(st.pr), 3) + "·" + f(sd, 3) + " = " + f(qx, 3);
        else {
          var za = (a - st.mu) / sd, zb = (b - st.mu) / sd;
          expl = st.q === "le" ? "z = (" + a + " − " + st.mu + ")/" + f(sd, 3) + " = " + f(za, 3) + " → Φ(" + f(za, 2) + ") = " + f(res, 4)
            : st.q === "ge" ? "z = " + f(za, 3) + " → 1 − Φ(" + f(za, 2) + ") = " + f(res, 4)
            : "Φ(" + f(zb, 2) + ") − Φ(" + f(za, 2) + ") = " + f(S.pnorm(zb), 4) + " − " + f(S.pnorm(za), 4) + " = " + f(res, 4);
        }
      } else if (st.dist === "t") {
        expl = st.q === "q" ? "t<sub>" + st.pr + ", " + st.df + "</sub> = " + f(qx, 4) + " (normaldreifing gæfi " + f(S.qnorm(st.pr), 4) + ")" : "Sama spurning í N(0, 1) gæfi " + f(st.q === "le" ? S.pnorm(a) : st.q === "ge" ? 1 - S.pnorm(a) : S.pnorm(b) - S.pnorm(a), 4) + ".";
      } else {
        expl = "E[X] = " + f(m.mean, 3) + ", Var[X] = " + f(m.v, 3) + (st.q === "ge" ? ". Athugaðu: fyrir strjálar dreifingar gefur <code>lower.tail = FALSE</code> P(X &gt; a), ekki P(X ≥ a)." : ".");
      }
      view.innerHTML = '<div class="dname"><b>' + esc(m.name) + "</b></div>" + svg +
        '<div class="dres"><div><div class="hint">' + (st.q === "q" ? "Prósentumark" : "Líkur") + '</div><div class="big">' + f(res, 4) + '</div></div><div><div class="hint">Í R</div><pre>' + esc(rc) + '</pre></div></div><p class="dexpl">' + expl + "</p>";
    }
    function niceStep(x) { var p = Math.pow(10, Math.floor(Math.log10(x))), r = x / p; return (r < 1.5 ? 1 : r < 3 ? 2 : r < 7 ? 5 : 10) * p; }
    build();
  }

  function start() { var el = document.getElementById("dr-app"); if (el) mount(el); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();

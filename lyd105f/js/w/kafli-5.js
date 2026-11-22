/* w/kafli-5.js – gagnvirka skrefið í kafla 5: hermun öryggisbila og lestur á öryggisbilum í úttaki (vélin er js/gagnvirkt.js). */

(function () {
  "use strict";
  function sim(box) {
    var A = window.App, S = window.Stat, h = A.h;
    var mu = 120, sd = 10, n = 25, N = 100, conf = 0.95;
    box.innerHTML = '<div class="panel"><h3>Hermir: 100 öryggisbil</h3><p>Hver lína er 95% öryggisbil reiknað úr nýju slembiúrtaki af stærð 25 úr N(120, 10²). Lóðrétta línan er sanna meðaltalið μ = 120. Rauðu bilin missa af því.</p><div class="sim"></div><p class="sim-res result"></p><div class="row"><button type="button" class="btn" data-go>Taka 100 ný úrtök</button> <label class="f">Öryggi <select data-conf><option value="0.9">90%</option><option value="0.95" selected>95%</option><option value="0.99">99%</option></select></label></div></div>';
    var el = box.querySelector(".sim"), out = box.querySelector(".sim-res");
    function rn() { var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    function run() {
      var W = 600, H = 300, L = 10, R = 10, lo = 108, hi = 132, miss = 0;
      var xs = function (x) { return L + (W - L - R) * (x - lo) / (hi - lo); };
      var t = S.qt(1 - (1 - conf) / 2, n - 1), svg = '<svg class="kmplot" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="100 öryggisbil">';
      for (var i = 0; i < N; i++) {
        var s = 0, ss = 0, x = [];
        for (var j = 0; j < n; j++) { var v = mu + sd * rn(); x.push(v); s += v; }
        var m = s / n; x.forEach(function (v) { ss += (v - m) * (v - m); });
        var se = Math.sqrt(ss / (n - 1)) / Math.sqrt(n), a = m - t * se, b = m + t * se, ok = a <= mu && mu <= b;
        if (!ok) miss++;
        var y = 6 + i * (H - 12) / N;
        svg += '<line x1="' + xs(a) + '" x2="' + xs(b) + '" y1="' + y + '" y2="' + y + '" stroke="' + (ok ? "var(--muted)" : "var(--bad)") + '" stroke-width="' + (ok ? 1.4 : 2.2) + '"/>';
      }
      svg += '<line x1="' + xs(mu) + '" x2="' + xs(mu) + '" y1="0" y2="' + H + '" stroke="var(--mag)" stroke-width="2"/></svg>';
      el.innerHTML = svg;
      out.textContent = miss + " af 100 bilum innihalda ekki μ = 120. Búist er við um " + Math.round(N * (1 - conf)) + ".";
    }
    box.querySelector("[data-go]").addEventListener("click", run);
    box.querySelector("[data-conf]").addEventListener("change", function (e) { conf = +e.target.value; run(); });
    run();
  }
  window.TK.lab(5, {
    tasks: function () {
      var g = window.TK.labGen(["oryggisbil"], 4);
      return [
        { out: ["p_inngrip"], type: "pick", tok: "0.3460722", title: "Öryggisbil fyrir hlutfall", q: "Smelltu á <b>neðri</b> mörk 95% öryggisbilsins fyrir hlutfall þeirra sem hlupu.", ex: "<p>Bilið er [0.346, 0.436]. Það inniheldur ekki 0.5, sem passar við að p-gildið er lítið.</p>" },
        { out: ["p_inngrip"], type: "num", title: "Punktmat", q: "Hvert er punktmatið fyrir hlutfall hlaupara? (Reiknaðu sjálf(ur) og berðu saman við úttakið.)", a: 0.3901919, d: 4, tol: { abs: 0.0005 }, r: "183 / 469", ex: "<p>p̂ = 183/469 = 0.390.</p>" },
        { out: ["p_t_kyn"], type: "mc", title: "Túlkun", q: "95% öryggisbil fyrir mun á meðalpúlsi kvenna og karla er [0.73, 5.28]. Hvaða túlkun er rétt?", opts: ["Við erum 95% viss um að sanni munurinn á meðalpúlsi (kona − karl) sé á milli 0.73 og 5.28 slög/mín", "95% kvenna hafa 0.73 til 5.28 slögum hraðari púls en karlar", "Líkurnar á að úrtaksmunurinn sé á bilinu eru 95%", "Bilið inniheldur 0, svo enginn munur er"], a: 0, ex: "<p>Öryggisbilið er um stika þýðisins (μ₁ − μ₂). Það inniheldur ekki 0, svo munurinn er marktækur við α = 0.05 (p = 0.0098).</p>" },
        { type: "mc", title: "Hermirinn", q: "Í herminum hér fyrir ofan, hvað gerist ef þú velur 99% í stað 95%?", opts: ["Bilin breikka og færri missa af μ (um 1 af 100)", "Bilin mjókka og fleiri missa af μ", "Ekkert breytist", "Öll bilin innihalda μ"], a: 0, ex: "<p>Hærra öryggi krefst stærri margfaldara (t<sub>0.995, 24</sub> = 2.80 í stað 2.06), svo bilin breikka.</p>" }
      ].concat(g);
    },
    extra: sim
  });
})();

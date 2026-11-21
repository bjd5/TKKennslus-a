/* widgets-a.js – gagnvirku skrefin í köflum 1, 2, 4 og 5.
 * Hver hluti er skráður með TK.widget("kafli-N", function (root, api) { ... }).
 * api.done(texti) merkir skrefið lokið, api.status(texti) sýnir framvindu. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  function register(id, fn) {
    if (typeof TK.widget === "function") TK.widget(id, fn);
    else (TK.pendingWidgets = TK.pendingWidgets || []).push([id, fn]);
  }

  /* ---------- Hjálparföll ---------- */
  var Ctrl = window.Ctrl;
  var col = function (v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); };
  var fix = function (v, d) { return v.toFixed(d).replace(".", ","); };
  var sig = function (v, n) {
    if (!isFinite(v)) return "∞";
    var s = String(Number(v.toPrecision(n || 3)));
    if (/e/.test(s)) s = Number(v).toExponential((n || 3) - 1);
    return s.replace(".", ",");
  };
  var tex = function (v, n) { return sig(v, n).replace(",", "{,}"); };
  var rnd = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var uni = function (a, b) { return a + Math.random() * (b - a); };
  var shuffle = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var math = function (el) { if (window.renderMath) window.renderMath(el); };
  var RPM = (2 * Math.PI) / 60;

  function slider(id, label, unit, min, max, step, val) {
    return '<div><label class="f" for="' + id + '">' + label + ' = <output id="' + id + '-v"></output>' + (unit ? " " + unit : "") +
      '</label><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>';
  }
  function linspace(a, b, n) { var o = []; for (var i = 0; i < n; i++) o.push(a + ((b - a) * i) / (n - 1)); return o; }
  function vline(x, y0, y1) { return { x: [x, x], y: [y0, y1], color: col("--muted"), dash: [4, 4] }; }
  var ok = function (b) { return b ? '<b style="color:var(--good)">✓</b>' : '<b style="color:var(--bad)">✗</b>'; };

  /* =====================================================================
   * Kafli 1 – Líkansmiðja: fyrstu gerðar líkön af ólíkum tegundum kerfa
   * ===================================================================== */
  register("kafli-1", function (root, api) {
    var $ = function (id) { return root.querySelector("#" + id); };
    var box = $("k1-app");
    if (!box) return;

    var SYS = {
      tankur: {
        name: "Vatnstankur",
        sl: [{ k: "A", lab: "$A$", unit: "m²", min: 5, max: 60, step: 1, v: 20 }, { k: "R", lab: "$R$", unit: "s/m²", min: 2, max: 40, step: 1, v: 10 }],
        desc: "Botnflötur $A$, útflæði $q_2 = h/R$. Innflæðið eykst skyndilega um $\\Delta q_1 = 0{,}05$ m³/s.",
        eq: "A\\dot h = q_1 - \\frac{h}{R} \\;\\Rightarrow\\; AR\\,\\dot h + h = R\\,q_1",
        model: function (p) { return { tau: p.A * p.R, K: p.R, du: 0.05, yu: "m", tu: "s", yl: "Δh" }; },
        taustr: function (p) { return "\\tau = AR = " + p.A + "\\cdot" + p.R + " = " + tex(p.A * p.R) + "\\ \\mathrm{s}"; },
      },
      rc: {
        name: "RC-rás",
        sl: [{ k: "R", lab: "$R$", unit: "kΩ", min: 1, max: 100, step: 1, v: 10 }, { k: "C", lab: "$C$", unit: "µF", min: 1, max: 100, step: 1, v: 10 }],
        desc: "Viðnám $R$ í röð, þéttir $C$ yfir úttakið. Inntaksspennan stekkur úr 0 í 10 V.",
        eq: "RC\\,\\dot u_C + u_C = u",
        model: function (p) { return { tau: p.R * p.C, K: 1, du: 10, yu: "V", tu: "ms", yl: "u_C" }; },
        taustr: function (p) { return "\\tau = RC = " + p.R + "\\ \\mathrm{k\\Omega}\\cdot" + p.C + "\\ \\mu\\mathrm F = " + tex(p.R * p.C) + "\\ \\mathrm{ms}"; },
      },
      hiti: {
        name: "Hitamælir",
        sl: [{ k: "R", lab: "$R$", unit: "°C/W", min: 0.5, max: 20, step: 0.5, v: 4 }, { k: "C", lab: "$C$", unit: "J/°C", min: 1, max: 30, step: 0.5, v: 5 }],
        desc: "Varmaviðnám $R$ milli vökva og mælis, varmarýmd mælisins $C$. Mælirinn er settur í vökva sem er 20 °C heitari.",
        eq: "\\frac{T_L - T}{R} = C\\dot T \\;\\Rightarrow\\; RC\\,\\dot T + T = T_L",
        model: function (p) { return { tau: p.R * p.C, K: 1, du: 20, yu: "°C", tu: "s", yl: "ΔT" }; },
        taustr: function (p) { return "\\tau = RC = " + tex(p.R) + "\\cdot" + tex(p.C) + " = " + tex(p.R * p.C) + "\\ \\mathrm{s}"; },
      },
    };

    // Verkefni: eitt fyrir hverja tegund kerfis
    var Rt = rnd(6, 30), At = rnd(10, 40);
    var Rc = rnd(2, 40), Cc = rnd(2, 40);
    var Rh = rnd(2, 16) / 2, Ch = rnd(4, 40) / 2;
    var TASKS = [
      { sys: "tankur", done: false,
        text: "Tankur: stilltu $A$ og $R$ svo tímastuðullinn verði $\\tau = " + tex(At * Rt, 4) + "$ s og vatnshæðin hækki um $" + tex(0.05 * Rt) + "$ m í jafnvægi.",
        hint: "Hækkunin í jafnvægi er $R\\,\\Delta q_1$, svo hún ákvarðar $R$. Síðan gefur $\\tau = AR$ flatarmálið.",
        check: function (m) { return Math.abs(m.tau - At * Rt) / (At * Rt) <= 0.02 && Math.abs(m.K * m.du - 0.05 * Rt) / (0.05 * Rt) <= 0.02; } },
      { sys: "rc", done: false,
        text: "RC-rás: spennan yfir þéttinn á að ná 98 % af lokagildinu eftir $" + tex(4 * Rc * Cc, 4) + "$ ms.",
        hint: "98 % næst eftir $4\\tau$. Hvaða margfeldi $RC$ þarf þá? (Athugaðu: kΩ · µF = ms.)",
        check: function (m) { var T = 4 * Rc * Cc; return Math.abs(4 * m.tau - T) / T <= 0.03; } },
      { sys: "hiti", done: false,
        text: "Hitamælir: hann á að sýna 95 % af hitabreytingunni eftir $" + tex(3 * Rh * Ch, 4) + "$ s.",
        hint: "Tafla 12.1: 95 % næst eftir $3\\tau$.",
        check: function (m) { var T = 3 * Rh * Ch; return Math.abs(3 * m.tau - T) / T <= 0.03; } },
    ];

    var cur = "tankur";
    var params = {};
    Object.keys(SYS).forEach(function (k) { params[k] = {}; SYS[k].sl.forEach(function (s) { params[k][s.k] = s.v; }); });

    box.innerHTML =
      '<div class="chips" role="group" aria-label="Tegund kerfis" id="k1-chips">' +
      Object.keys(SYS).map(function (k) { return '<button type="button" class="chip" data-sys="' + k + '">' + SYS[k].name + "</button>"; }).join("") +
      '</div><p id="k1-desc"></p><div id="k1-eq"></div><div class="row" id="k1-sl"></div>' +
      '<div class="hero-readout" id="k1-read" aria-live="polite"></div>' +
      '<canvas class="plot" id="k1-plot" role="img" aria-label="Þrepasvörun líkansins" style="margin-top:0.8rem"></canvas>' +
      '<div class="legend"><span><i style="background:var(--mag)"></i>svörun</span><span><i style="background:var(--muted)"></i>$\\tau$ og $4\\tau$</span></div>' +
      '<h3 style="margin-top:1.4rem">Verkefnin</h3><ol id="k1-tasks" style="padding-left:1.2rem"></ol><p id="k1-hint" class="small" style="color:var(--muted)"></p>';

    function renderTasks() {
      $("k1-tasks").innerHTML = TASKS.map(function (t, i) {
        return '<li style="margin-bottom:0.4rem' + (t.sys === cur ? ";font-weight:600" : "") + '">' + (t.done ? ok(true) + " " : "") +
          '<a href="#" data-t="' + i + '">' + t.text + "</a></li>";
      }).join("");
      $("k1-tasks").querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function (e) { e.preventDefault(); select(TASKS[+a.getAttribute("data-t")].sys); });
      });
      var t = TASKS.filter(function (t) { return t.sys === cur; })[0];
      $("k1-hint").innerHTML = t && !t.done ? "Vísbending: " + t.hint : "";
      math($("k1-tasks")); math($("k1-hint"));
      var n = TASKS.filter(function (t) { return t.done; }).length;
      if (api.status) api.status(n + " af 3 verkefnum leyst");
      if (n === 3) api.done("Öll þrjú líkönin stillt rétt.");
    }

    function select(k) {
      cur = k;
      var S = SYS[k];
      $("k1-chips").querySelectorAll(".chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-sys") === k)); });
      $("k1-desc").innerHTML = S.desc;
      $("k1-eq").innerHTML = "$$" + S.eq + "$$";
      $("k1-sl").innerHTML = S.sl.map(function (s) { return slider("k1-" + s.k, s.lab, s.unit, s.min, s.max, s.step, params[k][s.k]); }).join("");
      S.sl.forEach(function (s) {
        $("k1-" + s.k).addEventListener("input", function (e) { params[k][s.k] = parseFloat(e.target.value); update(); });
      });
      math($("k1-desc")); math($("k1-eq")); math($("k1-sl"));
      update();
      renderTasks();
    }

    function update() {
      var S = SYS[cur], p = params[cur], m = S.model(p);
      S.sl.forEach(function (s) { $("k1-" + s.k + "-v").textContent = sig(p[s.k], 3); });
      var yf = m.K * m.du;
      $("k1-read").innerHTML =
        '<div class="hl"><b>' + sig(m.tau, 3) + " " + m.tu + "</b><span>tímastuðull $\\tau$</span></div>" +
        "<div><b>" + sig(4 * m.tau, 3) + " " + m.tu + "</b><span>$4\\tau$ (98 %)</span></div>" +
        "<div><b>" + sig(yf, 3) + " " + m.yu + "</b><span>lokagildi " + m.yl + "</span></div>" +
        "<div><b>" + sig(0.632 * yf, 3) + " " + m.yu + "</b><span>gildi við $t = \\tau$ (63 %)</span></div>";
      $("k1-read").insertAdjacentHTML("beforeend", '<div style="flex-basis:100%;font-size:0.95rem;color:var(--muted)">$' + S.taustr(p) + "$</div>");
      math($("k1-read"));
      draw();
      var changed = false;
      TASKS.forEach(function (t) { if (t.sys === cur && !t.done && t.check(m)) { t.done = true; changed = true; } });
      if (changed) renderTasks();
    }

    function draw() {
      var S = SYS[cur], m = S.model(params[cur]), yf = m.K * m.du;
      var tmax = 6 * m.tau;
      var ts = linspace(0, tmax, 200);
      var ys = ts.map(function (t) { return yf * (1 - Math.exp(-t / m.tau)); });
      Ctrl.drawLines($("k1-plot"), [{ x: ts, y: ys, color: col("--mag") }, vline(m.tau, 0, yf * 1.1), vline(4 * m.tau, 0, yf * 1.1)],
        { aspect: 0.42, xmin: 0, xmax: tmax, ymin: 0, ymax: yf * 1.15, hlines: [yf], xlabel: "t [" + m.tu + "]" });
    }

    $("k1-chips").querySelectorAll(".chip").forEach(function (b) {
      b.addEventListener("click", function () { select(b.getAttribute("data-sys")); });
    });
    math(box.querySelector(".legend"));
    select("tankur");
    Ctrl.onRedraw($("k1-plot"), draw);
  });

  /* =====================================================================
   * Kafli 2 – Pólar, stofnbrot og svörun annarrar gerðar kerfis
   * ===================================================================== */
  register("kafli-2", function (root, api) {
    var $ = function (id) { return root.querySelector("#" + id); };
    var box = $("k2-app");
    if (!box) return;

    var CH = [
      { t: "Yfirskot á bilinu 5-10 % og tími hæsta yfirskots $T_p < 2$ s.",
        hint: "Yfirskotið ræðst eingöngu af $\\zeta$ (um 0,59-0,69 hér). $T_p = \\pi/\\omega_d$, svo pólarnir þurfa að vera nógu langt frá raunásnum.",
        test: function (a) { return a.kind === "complex" && a.Mp >= 5 && a.Mp <= 10 && a.Tp < 2; } },
      { t: "Ekkert yfirskot ($\\zeta \\ge 1$) og svörunin komin í jafnvægi ($4\\tau$ hægasta pólsins) innan 2 s.",
        hint: "Báðir pólar raunlægir og sá hægari vinstra megin við $s = -2$. Pólarnir eru $p_{1,2} = \\tfrac{-a_1 \\pm \\sqrt{a_1^2 - 4a_2}}{2}$.",
        test: function (a) { return (a.kind === "real" || a.kind === "double") && a.slow <= -2 + 1e-9; } },
      { t: "Ódempuð sveifla með sveiflutíma 2 s.",
        hint: "Ódempað: pólar á $j\\omega$-ásnum, þ.e. $a_1 = 0$. Sveiflutíminn er $2\\pi/\\omega_n$ og $\\omega_n^2 = a_2$.",
        test: function (a) { return Math.abs(a.a1) < 1e-6 && a.kind === "complex" && Math.abs(2 * Math.PI / a.wd - 2) / 2 <= 0.03; } },
      { t: "Pólar í $s = -2 \\pm 3j$ (dempunartímastuðull 0,5 s og $\\omega_d = 3$ rad/s).",
        hint: "$(s+2)^2 + 9 = s^2 + 4s + 13$.",
        test: function (a) { return a.kind === "complex" && Math.abs(a.sigma + 2) <= 0.06 && Math.abs(a.wd - 3) <= 0.09; } },
      { t: "Yfirdempað kerfi með póla í $s = -1$ og $s = -4$.",
        hint: "$(s+1)(s+4) = s^2 + 5s + 4$.",
        test: function (a) { return a.kind === "real" && Math.abs(a.p1 + 1) <= 0.03 && Math.abs(a.p2 + 4) <= 0.08; } },
    ];
    var order = shuffle([0, 1, 2, 3, 4]).slice(0, 3);
    var step = 0, solved = false;

    box.innerHTML =
      '<p>Kerfið er $y\'\' + a_1y\' + a_2y = b\\,u$ með $b = a_2$, svo jafnvægisgildið við einingarþrep er alltaf $K = b/a_2 = 1$. Inntakið er einingarþrep.</p>' +
      '<div class="row">' + slider("k2-a1", "$a_1$", "", -1, 10, 0.1, 2) + slider("k2-a2", "$a_2$", "", 0.1, 30, 0.1, 5) + "</div>" +
      '<div id="k2-g" style="margin-top:0.6rem"></div>' +
      '<div class="hero-readout" id="k2-read" aria-live="polite"></div>' +
      '<div class="grid2 plots" style="margin-top:0.8rem"><div><p style="font-family:var(--sans);font-weight:700;margin:0.3rem 0">Pólar í s-planinu</p><canvas class="plot" id="k2-s" role="img" aria-label="Pólar kerfisins í s-planinu"></canvas></div>' +
      '<div><p style="font-family:var(--sans);font-weight:700;margin:0.3rem 0">Þrepasvörun $y(t)$</p><canvas class="plot" id="k2-y" role="img" aria-label="Þrepasvörun kerfisins"></canvas></div></div>' +
      '<div id="k2-pf" style="margin-top:0.6rem"></div>' +
      '<div class="key" style="margin-top:1rem"><p style="margin:0"><b id="k2-cn"></b> <span id="k2-ct"></span></p><p id="k2-cr" style="margin:0.4rem 0 0" aria-live="polite"></p>' +
      '<p style="margin:0.6rem 0 0"><button type="button" class="btn ghost" id="k2-hint">Vísbending</button> <button type="button" class="btn" id="k2-next" hidden>Næsta áskorun →</button></p><p id="k2-hinttxt" style="margin:0.5rem 0 0;color:var(--muted)" hidden></p></div>';
    math(box);

    function analyse(a1, a2) {
      var b = a2, d = a1 * a1 - 4 * a2, r = { a1: a1, a2: a2, b: b, wn: Math.sqrt(a2), zeta: a1 / (2 * Math.sqrt(a2)) };
      if (Math.abs(d) < 1e-9) {
        r.kind = "double"; r.p = -a1 / 2; r.slow = r.p;
        r.y = function (t) { return 1 - Math.exp(r.p * t) + r.p * t * Math.exp(r.p * t); };
      } else if (d > 0) {
        r.kind = "real"; r.p1 = (-a1 + Math.sqrt(d)) / 2; r.p2 = (-a1 - Math.sqrt(d)) / 2; r.slow = r.p1;
        r.k2 = b / (r.p1 * (r.p1 - r.p2)); r.k3 = b / (r.p2 * (r.p2 - r.p1));
        r.y = function (t) { return 1 + r.k2 * Math.exp(r.p1 * t) + r.k3 * Math.exp(r.p2 * t); };
      } else {
        r.kind = "complex"; r.sigma = -a1 / 2; r.wd = Math.sqrt(-d) / 2; r.slow = r.sigma;
        r.y = function (t) { return 1 - Math.exp(r.sigma * t) * (Math.cos(r.wd * t) - (r.sigma / r.wd) * Math.sin(r.wd * t)); };
        if (r.zeta > 0) { r.Mp = 100 * Math.exp(-r.zeta * Math.PI / Math.sqrt(1 - r.zeta * r.zeta)); r.Tp = Math.PI / r.wd; }
      }
      r.stable = r.slow < -1e-9;
      return r;
    }

    function num(v) { return tex(v, 3); }
    function sgn(v) { return v < 0 ? " - " + num(-v) : " + " + num(v); }
    function sMinus(p) { return p < 0 ? "s + " + num(-p) : "s - " + num(p); }

    function pfHtml(r) {
      var den = "s^2" + (r.a1 === 0 ? "" : sgn(r.a1) + "s") + " + " + num(r.a2);
      var h = "$$Y(s) = \\frac{G(s)}{s} = \\frac{" + num(r.b) + "}{s\\,(" + den + ")}";
      var yt;
      if (r.kind === "real") {
        h += " = \\frac{1}{s}" + sgn(r.k2) + "\\,\\frac{1}{" + sMinus(r.p1) + "}" + sgn(r.k3) + "\\,\\frac{1}{" + sMinus(r.p2) + "}$$";
        yt = "y(t) = 1" + sgn(r.k2) + "\\,e^{" + num(r.p1) + "t}" + sgn(r.k3) + "\\,e^{" + num(r.p2) + "t}";
      } else if (r.kind === "double") {
        h += " = \\frac{1}{s} - \\frac{1}{" + sMinus(r.p) + "}" + sgn(r.p) + "\\,\\frac{1}{(" + sMinus(r.p) + ")^2}$$";
        yt = "y(t) = 1 - e^{" + num(r.p) + "t}" + sgn(r.p) + "\\,t\\,e^{" + num(r.p) + "t}";
      } else {
        // b = a2 gefur Y = 1/s - (s + a1)/((s - sigma)^2 + wd^2)
        var sq = r.sigma === 0 ? "s^2" : "(" + sMinus(r.sigma) + ")^2";
        h += " = \\frac{1}{s} - \\frac{s" + (r.a1 === 0 ? "" : sgn(r.a1)) + "}{" + sq + " + " + num(r.wd) + "^2}$$";
        if (r.sigma === 0) yt = "y(t) = 1 - \\cos(" + num(r.wd) + "t)";
        else yt = "y(t) = 1 - e^{" + num(r.sigma) + "t}\\Bigl(\\cos(" + num(r.wd) + "t)" + sgn(-r.sigma / r.wd) + "\\,\\sin(" + num(r.wd) + "t)\\Bigr)";
      }
      return h + "$$" + yt + "$$";
    }

    function drawS(r) {
      var cv = $("k2-s"), dpr = window.devicePixelRatio || 1, w = cv.clientWidth || 300, hgt = Math.round(w * 0.75);
      cv.style.height = hgt + "px"; cv.width = Math.round(w * dpr); cv.height = Math.round(hgt * dpr);
      var g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, hgt);
      var poles = r.kind === "real" ? [[r.p1, 0], [r.p2, 0]] : r.kind === "double" ? [[r.p, 0], [r.p, 0]] : [[r.sigma, r.wd], [r.sigma, -r.wd]];
      var R = 6;
      poles.forEach(function (p) { R = Math.max(R, Math.abs(p[0]) * 1.15, Math.abs(p[1]) * 1.15); });
      R = Math.ceil(R);
      var xmin = -R, xmax = Math.max(2, R * 0.3), ymax = R * 0.75;
      var X = function (v) { return 30 + ((v - xmin) / (xmax - xmin)) * (w - 40); };
      var Y = function (v) { return hgt / 2 - (v / ymax) * (hgt / 2 - 14); };
      g.fillStyle = col("--bad"); g.globalAlpha = 0.07; g.fillRect(X(0), 0, w - X(0), hgt); g.globalAlpha = 1;
      g.strokeStyle = col("--rule"); g.lineWidth = 1;
      for (var v = Math.ceil(xmin); v <= xmax; v++) if (v % Math.max(1, Math.round(R / 6)) === 0) { g.beginPath(); g.moveTo(X(v), 8); g.lineTo(X(v), hgt - 8); g.stroke(); }
      g.strokeStyle = col("--ink"); g.beginPath(); g.moveTo(X(xmin), Y(0)); g.lineTo(X(xmax), Y(0)); g.moveTo(X(0), 8); g.lineTo(X(0), hgt - 8); g.stroke();
      g.fillStyle = col("--muted"); g.font = "12px Archivo, system-ui, sans-serif"; g.textAlign = "left";
      g.fillText("jω", X(0) + 5, 18); g.fillText("σ", X(xmax) - 12, Y(0) - 6);
      g.textAlign = "center";
      [-R, -Math.round(R / 2)].forEach(function (t) { g.fillText(String(t), X(t), Y(0) + 15); });
      g.fillText("óstöðugt", X(0) + (w - X(0)) / 2, hgt - 12);
      g.strokeStyle = col("--mag"); g.lineWidth = 2.6;
      poles.forEach(function (p) {
        var x = X(p[0]), y = Y(p[1]), a = 6;
        g.beginPath(); g.moveTo(x - a, y - a); g.lineTo(x + a, y + a); g.moveTo(x + a, y - a); g.lineTo(x - a, y + a); g.stroke();
      });
    }

    function drawY(r) {
      var tmax;
      if (!r.stable && Math.abs(r.slow) < 1e-9 && r.kind === "complex") tmax = Math.min(20, 3 * 2 * Math.PI / r.wd);
      else if (!r.stable) tmax = 6;
      else tmax = Math.max(2, Math.min(20, 5 / -r.slow));
      if (r.kind === "complex" && r.stable) tmax = Math.max(tmax, Math.min(20, 2.5 * r.Tp));
      var ts = linspace(0, tmax, 300), ys = ts.map(r.y);
      Ctrl.drawLines($("k2-y"), [{ x: ts, y: ys, color: col("--mag") }],
        { aspect: 0.75, xmin: 0, xmax: tmax, ymin: -0.2, ymax: 2.2, hlines: [1], xlabel: "t [s]" });
    }

    var last = null;
    function update() {
      var a1 = parseFloat($("k2-a1").value), a2 = parseFloat($("k2-a2").value);
      if (Math.abs(a1) < 0.05) a1 = 0;
      $("k2-a1-v").textContent = fix(a1, 1); $("k2-a2-v").textContent = fix(a2, 1);
      var r = analyse(a1, a2); last = r;
      $("k2-g").innerHTML = "$$G(s) = \\frac{" + num(a2) + "}{s^2" + (a1 === 0 ? "" : sgn(a1) + "s") + " + " + num(a2) + "}\\qquad \\omega_n = \\sqrt{a_2} = " + num(r.wn) + ",\\quad \\zeta = \\frac{a_1}{2\\omega_n} = " + num(r.zeta) + "$$";
      var kind = !r.stable ? (Math.abs(r.slow) < 1e-9 ? "ódempað (á mörkum)" : "óstöðugt") : r.kind === "complex" ? "undirdempað" : r.kind === "double" ? "markdempað" : "yfirdempað";
      var poles = r.kind === "real" ? num(r.p1) + "; " + num(r.p2) : r.kind === "double" ? num(r.p) + " (tvöföld)" : num(r.sigma) + " ± " + num(r.wd) + "j";
      $("k2-read").innerHTML =
        '<div class="hl"><b>' + kind + "</b><span>gerð svörunar</span></div><div><b>$" + poles.replace(";", ";\\;") + "$</b><span>pólar</span></div>" +
        "<div><b>" + (r.stable ? sig(-1 / r.slow, 3) + " s" : "–") + "</b><span>$\\tau$ hægasta hluta</span></div>" +
        "<div><b>" + (r.kind === "complex" && r.stable ? sig(r.Mp, 3) + " %" : r.stable ? "0 %" : "–") + "</b><span>yfirskot $M_p$</span></div>" +
        "<div><b>" + (r.kind === "complex" ? sig(r.Tp || Math.PI / r.wd, 3) + " s" : "–") + "</b><span>$T_p = \\pi/\\omega_d$</span></div>";
      $("k2-pf").innerHTML = '<p style="margin:0 0 0.2rem;font-family:var(--sans);font-weight:700">Stofnbrotaliðun og lausn</p>' + pfHtml(r) +
        (r.stable ? "" : '<p style="color:var(--bad);margin:0">Kerfið er ekki stöðugt, svo lokagildisreglan á ekki við: $y(t)$ stefnir ekki á 1.</p>');
      math($("k2-g")); math($("k2-read")); math($("k2-pf"));
      drawS(r); drawY(r);
      checkChallenge();
    }

    function showChallenge() {
      var c = CH[order[step]];
      $("k2-cn").textContent = "Áskorun " + (step + 1) + " af 3:";
      $("k2-ct").innerHTML = c.t;
      $("k2-cr").innerHTML = "";
      $("k2-next").hidden = true; solved = false;
      $("k2-hinttxt").hidden = true; $("k2-hinttxt").innerHTML = c.hint;
      math($("k2-ct")); math($("k2-hinttxt"));
      if (api.status) api.status(step + " af 3 áskorunum leystar");
      if (last) checkChallenge();
    }

    function checkChallenge() {
      if (solved || step >= 3 || !last) return;
      if (CH[order[step]].test(last)) {
        solved = true;
        $("k2-cr").innerHTML = ok(true) + " Rétt! Pólarnir uppfylla skilyrðið.";
        if (step < 2) $("k2-next").hidden = false;
        else { $("k2-cr").innerHTML += " Allar þrjár áskoranir leystar."; if (api.status) api.status("3 af 3 áskorunum leystar"); api.done("Allar þrjár pólaáskoranirnar leystar."); }
      }
    }

    $("k2-a1").addEventListener("input", update);
    $("k2-a2").addEventListener("input", update);
    $("k2-hint").addEventListener("click", function () { $("k2-hinttxt").hidden = false; });
    $("k2-next").addEventListener("click", function () { step++; showChallenge(); });
    showChallenge();
    update();
    Ctrl.onRedraw($("k2-s"), function () { if (last) { drawS(last); drawY(last); } });
  });

  /* =====================================================================
   * Kafli 4 – Val á nema (þrjár réttar ákvarðanir í röð)
   * ===================================================================== */
  register("kafli-4", function (root, api) {
    var $ = function (id) { return root.querySelector("#" + id); };
    var box = $("k4-app");
    if (!box) return;

    var Q = [
      { name: "hitastig", unit: "°C", tu: "s", req: [[20, 120], [50, 180], [0, 90], [100, 250], [30, 140]],
        ranges: [[0, 150], [-50, 200], [0, 100], [0, 300], [-20, 150], [0, 200], [0, 250], [50, 300], [0, 400]], T: [5, 8, 10, 15, 20], tr: 0.1 },
      { name: "snúningshraða", unit: "RPM", tu: "ms", req: [[0, 1200], [0, 800], [200, 1500], [0, 2500], [0, 900]],
        ranges: [[0, 1000], [0, 1500], [0, 2000], [0, 3000], [0, 1300], [0, 5000], [0, 2500]], T: [60, 80, 100, 150, 200], tr: 1 },
      { name: "þrýsting", unit: "kPa", tu: "ms", req: [[50, 300], [0, 150], [100, 450], [0, 220]],
        ranges: [[0, 400], [0, 250], [0, 600], [0, 160], [0, 500], [0, 1000], [0, 350]], T: [20, 40, 50, 100], tr: 0.5 },
    ];
    var streak = 0, best = 0, round = null, answered = false, finished = false;

    function niceE(span) {
      var c = [1, 2, 5, 10, 15, 20, 25, 30, 40, 50];
      var target = span * uni(0.008, 0.025);
      var e = c[0]; c.forEach(function (x) { if (Math.abs(x - target) < Math.abs(e - target)) e = x; });
      return e;
    }
    function roundTo(v, r) { return Math.round(v / r) * r; }
    function evalS(s, q, R) {
      var span = s.r[1] - s.r[0];
      s.cov = s.r[0] <= R.lo && s.r[1] >= R.hi;
      s.t98 = 4 * s.tau; s.fast = s.t98 <= R.T + 1e-9;
      s.err = (s.p / 100) * span; s.lin = s.err <= R.E + 1e-9;
      s.good = s.cov && s.fast && s.lin;
    }

    function generate() {
      for (var tries = 0; tries < 200; tries++) {
        var q = pick(Q), rq = pick(q.req), R = { lo: rq[0], hi: rq[1], T: pick(q.T) };
        R.E = niceE(rq[1] - rq[0]);
        var cover = q.ranges.filter(function (r) { return r[0] <= R.lo && r[1] >= R.hi; });
        var notc = q.ranges.filter(function (r) { return !(r[0] <= R.lo && r[1] >= R.hi) && r[1] > R.lo && r[0] < R.hi; });
        if (cover.length < 2 || !notc.length) continue;
        var mk = function (r, tauF, errF) {
          var span = r[1] - r[0];
          return { r: r, tau: Math.max(q.tr, roundTo((R.T / 4) * tauF, q.tr)), p: Math.max(0.1, roundTo(((R.E * errF) / span) * 100, 0.1)) };
        };
        var good = mk(pick(cover), uni(0.35, 0.85), uni(0.4, 0.85));
        var decoys = shuffle([
          mk(pick(notc), uni(0.3, 0.8), uni(0.3, 0.8)),
          mk(pick(cover), uni(1.3, 2.4), uni(0.3, 0.8)),
          mk(cover.slice().sort(function (a, b) { return (b[1] - b[0]) - (a[1] - a[0]); })[0], uni(0.3, 0.8), uni(1.35, 2.4)),
        ]).slice(0, 2);
        var list = shuffle([good].concat(decoys));
        list.forEach(function (s) { evalS(s, q, R); });
        var nGood = list.filter(function (s) { return s.good; }).length;
        if (nGood !== 1) continue;
        if (list.some(function (s) { return s.tau <= 0; })) continue;
        return { q: q, R: R, list: list };
      }
      return null;
    }

    box.innerHTML =
      '<div id="k4-req"></div><div class="tablewrap"><table id="k4-tab"></table></div>' +
      '<div class="chips" role="group" aria-label="Veldu nema" id="k4-pick"></div>' +
      '<div id="k4-fb" aria-live="polite"></div>' +
      '<div id="k4-plotwrap" hidden><canvas class="plot" id="k4-plot" role="img" aria-label="Þrepasvörun nemanna þriggja"></canvas>' +
      '<div class="legend" id="k4-leg"></div></div>' +
      '<p style="margin-top:0.8rem"><button type="button" class="btn" id="k4-next" hidden>Næsta umferð →</button> <span id="k4-streak" style="font-family:var(--sans);color:var(--muted)"></span></p>';

    var COLS = ["--mag", "--phase", "--good"];
    function letter(i) { return "ABC".charAt(i); }
    function fmtR(r, u) { return sig(r[0], 4) + " til " + sig(r[1], 4) + " " + u; }

    function newRound() {
      round = generate(); answered = false;
      if (!round) return;
      var q = round.q, R = round.R;
      $("k4-req").innerHTML = '<p>Mæla á <b>' + q.name + "</b> á bilinu <b>" + fmtR([R.lo, R.hi], q.unit) + "</b>. Neminn þarf að komast í jafnvægi (98 %) innan <b>" +
        sig(R.T, 3) + " " + q.tu + "</b> og frávik frá línuleika má ekki vera meira en <b>" + sig(R.E, 3) + " " + q.unit + "</b>. Hvaða nema velurðu?</p>";
      $("k4-tab").innerHTML = "<thead><tr><th></th>" + round.list.map(function (s, i) { return '<th class="num">Nemi ' + letter(i) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        "<tr><td>Mælisvið</td>" + round.list.map(function (s) { return '<td class="num">' + fmtR(s.r, q.unit) + "</td>"; }).join("") + "</tr>" +
        "<tr><td>Tímastuðull</td>" + round.list.map(function (s) { return '<td class="num">' + sig(s.tau, 3) + " " + q.tu + "</td>"; }).join("") + "</tr>" +
        "<tr><td>Frávik frá línuleika</td>" + round.list.map(function (s) { return '<td class="num">' + sig(s.p, 3) + " %</td>"; }).join("") + "</tr></tbody>";
      $("k4-pick").innerHTML = round.list.map(function (s, i) { return '<button type="button" class="chip" data-i="' + i + '">Velja nema ' + letter(i) + "</button>"; }).join("");
      $("k4-pick").querySelectorAll(".chip").forEach(function (b) { b.addEventListener("click", function () { answer(+b.getAttribute("data-i")); }); });
      $("k4-fb").innerHTML = ""; $("k4-plotwrap").hidden = true; $("k4-next").hidden = true;
      showStreak();
    }

    function showStreak() {
      $("k4-streak").textContent = "Rétt í röð: " + streak + " af 3" + (best >= 3 ? " · Verkefninu lokið" : "");
      if (api.status) api.status("Rétt í röð: " + Math.min(streak, 3) + " af 3");
    }

    function answer(i) {
      if (answered) return;
      answered = true;
      var q = round.q, R = round.R, s = round.list[i];
      $("k4-pick").querySelectorAll(".chip").forEach(function (b) {
        b.disabled = true; var j = +b.getAttribute("data-i");
        b.setAttribute("aria-pressed", String(j === i));
        if (round.list[j].good) b.style.borderColor = col("--good");
      });
      if (s.good) { streak++; best = Math.max(best, streak); } else streak = 0;
      var rows = round.list.map(function (x, j) {
        return "<tr><td><b>" + letter(j) + "</b></td><td>" + ok(x.cov) + " " + fmtR(x.r, q.unit) + "</td><td>" + ok(x.fast) + " $4\\tau = " + tex(x.t98, 3) + "$ " + q.tu +
          "</td><td>" + ok(x.lin) + " $" + tex(x.p, 3) + "\\,\\% \\cdot " + tex(x.r[1] - x.r[0], 4) + " = " + tex(x.err, 3) + "$ " + q.unit + "</td></tr>";
      }).join("");
      var reasons = [];
      if (!s.cov) reasons.push("mælisviðið nær ekki yfir allt bilið");
      if (!s.fast) reasons.push("hann er of hægur ($4\\tau$ er lengra en " + sig(R.T, 3) + " " + q.tu + ")");
      if (!s.lin) reasons.push("frávikið er hlutfall af <i>mælisviði</i> nemans, svo breitt mælisvið gefur of mikið frávik í " + q.unit);
      $("k4-fb").innerHTML = '<p class="result ' + (s.good ? "ok" : "no") + '">' + (s.good ? "Rétt val." : "Nemi " + letter(i) + " dugar ekki: " + reasons.join("; ") + ".") + "</p>" +
        '<div class="tablewrap"><table><thead><tr><th></th><th>Nær yfir bilið?</th><th>Jafnvægi innan ' + sig(R.T, 3) + " " + q.tu + "?</th><th>Frávik ≤ " + sig(R.E, 3) + " " + q.unit + "?</th></tr></thead><tbody>" + rows + "</tbody></table></div>";
      math($("k4-fb"));
      // Graf: þrepasvörun (hlutfall af lokagildi) nemanna þriggja
      $("k4-plotwrap").hidden = false;
      var tmax = 2 * R.T, ts = linspace(0, tmax, 200);
      var series = round.list.map(function (x, j) { return { x: ts, y: ts.map(function (t) { return 1 - Math.exp(-t / x.tau); }), color: col(COLS[j]) }; });
      series.push(vline(R.T, 0, 1.1));
      var drawP = function () { Ctrl.drawLines($("k4-plot"), series, { aspect: 0.4, xmin: 0, xmax: tmax, ymin: 0, ymax: 1.1, hlines: [0.98], xlabel: "t [" + q.tu + "]" }); };
      drawP();
      $("k4-leg").innerHTML = round.list.map(function (x, j) { return '<span><i style="background:var(' + COLS[j] + ')"></i>Nemi ' + letter(j) + "</span>"; }).join("") +
        '<span><i style="background:var(--muted)"></i>krafa um tíma; brotalína = 98 %</span>';
      showStreak();
      if (streak >= 3 && !finished) { finished = true; api.done("Þrír réttir nemar í röð."); }
      $("k4-next").hidden = false;
    }

    $("k4-next").addEventListener("click", newRound);
    newRound();
  });

  /* =====================================================================
   * Kafli 5 – Jafnstraumshreyfill: vægi-hraði, afl og val á hreyfli
   * ===================================================================== */
  register("kafli-5", function (root, api) {
    var $ = function (id) { return root.querySelector("#" + id); };
    var box = $("k5-app");
    if (!box) return;

    var P = { va: 12, kt: 0.12, kf: 10, R: 1.5 };
    var SL = [
      { k: "va", lab: "$v_a$", unit: "V", min: 1, max: 30, step: 0.5 },
      { k: "kt", lab: "$K_\\tau$", unit: "Nm/A", min: 0.02, max: 0.3, step: 0.01 },
      { k: "kf", lab: "$K_f$", unit: "V/1000 RPM", min: 2, max: 30, step: 0.5 },
      { k: "R", lab: "$R$", unit: "Ω", min: 0.5, max: 5, step: 0.05 },
    ];
    function calc(p) {
      var kfSI = p.kf / (1000 * RPM), ts = (p.kt / p.R) * p.va, w0 = p.va / kfSI;
      return { kfSI: kfSI, ts: ts, w0: w0, rpm0: w0 / RPM, Pmax: (ts * w0) / 4, Is: p.va / p.R };
    }

    box.innerHTML =
      '<div class="row" id="k5-sl">' + SL.map(function (s) { return slider("k5-" + s.k, s.lab, s.unit, s.min, s.max, s.step, P[s.k]); }).join("") + "</div>" +
      '<div class="hero-readout" id="k5-read" aria-live="polite"></div>' +
      '<div class="grid2 plots" style="margin-top:0.8rem"><div><p style="font-family:var(--sans);font-weight:700;margin:0.3rem 0">Vægi $\\tau(\\omega)$ [Nm]</p><canvas class="plot" id="k5-t" role="img" aria-label="Vægi sem fall af hornhraða"></canvas></div>' +
      '<div><p style="font-family:var(--sans);font-weight:700;margin:0.3rem 0">Afl $P(\\omega)$ [W]</p><canvas class="plot" id="k5-p" role="img" aria-label="Afl sem fall af hornhraða"></canvas></div></div>' +
      '<div class="key" style="margin-top:1rem" id="k5-round"></div>';
    math(box);

    var rounds = ["val", "honnun", "val"], ri = 0, cur = null, wins = 0, finished = false;

    function setSliders(p, lockAll) {
      SL.forEach(function (s) {
        var el = $("k5-" + s.k);
        if (p && p[s.k] !== undefined) { el.value = p[s.k]; P[s.k] = parseFloat(el.value); }
        el.disabled = !!lockAll && s.k !== "va";
      });
      update();
    }

    function update() {
      SL.forEach(function (s) { P[s.k] = parseFloat($("k5-" + s.k).value); $("k5-" + s.k + "-v").textContent = sig(P[s.k], 3); });
      var c = calc(P);
      $("k5-read").innerHTML =
        "<div><b>" + sig(c.ts, 3) + " Nm</b><span>upphafsvægi $\\tau_s = \\frac{K_\\tau}{R}v_a$</span></div>" +
        "<div><b>" + sig(c.w0, 3) + " rad/s</b><span>lausagangur $\\omega_0 = v_a/K_f$ (" + sig(c.rpm0, 4) + " RPM)</span></div>" +
        '<div class="hl"><b>' + sig(c.Pmax, 3) + " W</b><span>$P_{max} = \\tau_s\\omega_0/4$</span></div>" +
        "<div><b>" + sig(c.Is, 3) + " A</b><span>kyrrstöðustraumur $v_a/R$</span></div>" +
        '<div style="flex-basis:100%;font-size:0.95rem;color:var(--muted)">$K_f = ' + tex(P.kf, 3) + "/104{,}72 = " + tex(c.kfSI, 3) + "$ V·s/rad</div>";
      math($("k5-read"));
      draw();
    }

    function draw() {
      var c = calc(P), ws = linspace(0, c.w0, 120);
      Ctrl.drawLines($("k5-t"), [{ x: ws, y: ws.map(function (w) { return c.ts * (1 - w / c.w0); }), color: col("--mag") }],
        { aspect: 0.62, xmin: 0, xmax: c.w0 * 1.02, ymin: 0, ymax: c.ts * 1.1, xlabel: "ω [rad/s]" });
      Ctrl.drawLines($("k5-p"), [{ x: ws, y: ws.map(function (w) { return c.ts * w * (1 - w / c.w0); }), color: col("--phase") }, vline(c.w0 / 2, 0, c.Pmax * 1.15)],
        { aspect: 0.62, xmin: 0, xmax: c.w0 * 1.02, ymin: 0, ymax: c.Pmax * 1.15, hlines: [c.Pmax], xlabel: "ω [rad/s]" });
    }

    function genMotor() {
      return { va: pick([10, 12, 24]), kt: pick([0.05, 0.08, 0.1, 0.12, 0.15, 0.2]), kf: pick([6, 8, 10, 12, 15, 20]), R: pick([0.8, 1, 1.25, 1.5, 2, 2.5, 3]) };
    }

    function genVal() {
      for (var t = 0; t < 300; t++) {
        var A = genMotor(), B = genMotor(); B.va = A.va;
        var a = calc(A), b = calc(B), kind = pick(["ts", "Pmax", "rpm0"]);
        var va = a[kind], vb = b[kind];
        if (Math.abs(va - vb) / Math.max(va, vb) < 0.25) continue;
        var lo = Math.min(va, vb), hi = Math.max(va, vb), thr = lo + (hi - lo) * uni(0.3, 0.7);
        var nice = kind === "ts" ? Math.round(thr * 20) / 20 : kind === "Pmax" ? Math.round(thr) : Math.round(thr / 50) * 50;
        if (!(nice > lo && nice < hi)) continue;
        return { type: "val", A: A, B: B, a: a, b: b, kind: kind, thr: nice, right: va >= nice ? 0 : 1 };
      }
    }

    function genHonnun() {
      for (var t = 0; t < 300; t++) {
        var m = genMotor(), c1 = calc(Object.assign({}, m, { va: 1 })); // tau_s og Pmax við 1 V
        var X = pick([0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5]), Y = pick([10, 15, 20, 25, 30, 40, 50, 60, 80]);
        var vT = X / c1.ts, vP = Math.sqrt(Y / c1.Pmax), vmin = Math.ceil(Math.max(vT, vP) * 2 - 1e-9) / 2;
        if (vmin < 4 || vmin > 29 || Math.abs(vT - vP) / Math.max(vT, vP) < 0.1) continue;
        return { type: "honnun", m: m, X: X, Y: Y, vT: vT, vP: vP, vmin: vmin, limit: vT > vP ? "ts" : "Pmax" };
      }
    }

    function showRound() {
      var kind = rounds[ri];
      cur = kind === "val" ? genVal() : genHonnun();
      var el = $("k5-round");
      if (cur.type === "val") {
        var lab = { ts: "upphafsvægi að minnsta kosti " + sig(cur.thr, 3) + " Nm", Pmax: "hámarksafl að minnsta kosti " + sig(cur.thr, 3) + " W", rpm0: "lausagangshraða að minnsta kosti " + sig(cur.thr, 4) + " RPM" }[cur.kind];
        var row = function (n, k, u) { return "<tr><td>" + n + '</td><td class="num">' + sig(cur.A[k], 3) + " " + u + '</td><td class="num">' + sig(cur.B[k], 3) + " " + u + "</td></tr>"; };
        el.innerHTML = '<p style="margin:0"><b>Umferð ' + (ri + 1) + " af 3 · Val á hreyfli.</b> Hreyfillinn þarf " + lab + ". Aðeins annar uppfyllir kröfuna.</p>" +
          '<div class="tablewrap"><table><thead><tr><th></th><th class="num">Hreyfill A</th><th class="num">Hreyfill B</th></tr></thead><tbody>' +
          row("Innspenna $v_a$", "va", "V") + row("$K_\\tau$", "kt", "Nm/A") + row("$K_f$", "kf", "V/1000 RPM") + row("$R$", "R", "Ω") + "</tbody></table></div>" +
          '<p style="margin:0.4rem 0"><button type="button" class="btn ghost" id="k5-loadA">Setja A í sleðana</button> <button type="button" class="btn ghost" id="k5-loadB">Setja B í sleðana</button></p>' +
          '<div class="chips" id="k5-ans"><button type="button" class="chip" data-i="0">Velja hreyfil A</button><button type="button" class="chip" data-i="1">Velja hreyfil B</button></div><div id="k5-fb" aria-live="polite"></div>';
        setSliders(null, false);
        $("k5-loadA").addEventListener("click", function () { setSliders(cur.A, false); });
        $("k5-loadB").addEventListener("click", function () { setSliders(cur.B, false); });
        el.querySelectorAll("#k5-ans .chip").forEach(function (b) { b.addEventListener("click", function () { answerVal(+b.getAttribute("data-i")); }); });
      } else {
        el.innerHTML = '<p style="margin:0"><b>Umferð ' + (ri + 1) + " af 3 · Hönnun.</b> Hreyfillinn hefur $K_\\tau = " + tex(cur.m.kt) + "$ Nm/A, $K_f = " + tex(cur.m.kf) + "$ V/1000 RPM og $R = " + tex(cur.m.R) +
          "\\ \\Omega$ (sleðarnir eru læstir). Finndu <b>lægstu</b> innspennu (í 0,5 V skrefum) sem gefur upphafsvægi ≥ " + sig(cur.X, 3) + " Nm <b>og</b> hámarksafl ≥ " + sig(cur.Y, 3) + " W.</p>" +
          '<p style="margin:0.6rem 0 0"><button type="button" class="btn" id="k5-confirm">Staðfesta $v_a$</button></p><div id="k5-fb" aria-live="polite"></div>';
        setSliders({ va: 1, kt: cur.m.kt, kf: cur.m.kf, R: cur.m.R }, true);
        $("k5-confirm").addEventListener("click", answerHonnun);
      }
      math(el);
      if (api.status) api.status(wins + " af 3 umferðum leystar");
    }

    function after(right, html) {
      $("k5-fb").innerHTML = '<p class="result ' + (right ? "ok" : "no") + '">' + html + "</p>" +
        '<p><button type="button" class="btn" id="k5-next">' + (right ? (wins >= 3 ? "Byrja upp á nýtt" : "Næsta umferð →") : "Reyna aftur með nýjum tölum") + "</button></p>";
      math($("k5-fb"));
      $("k5-next").addEventListener("click", function () {
        if (right) ri = wins >= 3 ? 0 : ri + 1;
        if (wins >= 3 && right) wins = 0;
        showRound();
      });
      if (wins >= 3 && !finished) { finished = true; api.done("Þrjár hreyfilsumferðir leystar."); }
    }

    function answerVal(i) {
      var right = i === cur.right;
      $("k5-ans").querySelectorAll(".chip").forEach(function (b) { b.disabled = true; b.setAttribute("aria-pressed", String(+b.getAttribute("data-i") === i)); });
      if (right) wins++;
      var u = { ts: ["\\tau_s", "Nm", 3], Pmax: ["P_{max}", "W", 3], rpm0: ["n_0", "RPM", 4] }[cur.kind];
      var expl = "$" + u[0] + "$: A gefur " + sig(cur.a[cur.kind], u[2]) + " " + u[1] + ", B gefur " + sig(cur.b[cur.kind], u[2]) + " " + u[1] + ". ";
      var how = { ts: "$\\tau_s = \\frac{K_\\tau}{R}v_a$.", Pmax: "$P_{max} = \\frac{\\tau_s\\omega_0}{4} = \\frac{K_\\tau v_a^2}{4RK_f}$ með $K_f$ í V·s/rad.", rpm0: "$n_0 = \\frac{v_a}{K_f}\\cdot1000$ RPM ef $K_f$ er í V/1000 RPM." }[cur.kind];
      after(right, (right ? "Rétt. " : "Ekki rétt. ") + expl + how);
    }

    function answerHonnun() {
      var v = P.va, c = calc(P), okT = c.ts >= cur.X - 1e-9, okP = c.Pmax >= cur.Y - 1e-9;
      var right = Math.abs(v - cur.vmin) < 1e-9;
      if (right) wins++;
      var expl = "Vægið vex línulega með $v_a$ en aflið með $v_a^2$: $v_a \\ge " + tex(cur.X) + "\\cdot\\frac{R}{K_\\tau} = " + tex(cur.vT, 3) + "$ V fyrir vægið og $v_a \\ge \\sqrt{\\frac{4RK_f\\,P}{K_\\tau}} = " + tex(cur.vP, 3) +
        "$ V fyrir aflið. Strangari krafan (" + (cur.limit === "ts" ? "vægið" : "aflið") + ") ræður, svo lægsta spennan er <b>" + sig(cur.vmin, 3) + " V</b>.";
      var short = [];
      if (!okT) short.push("upphafsvægið er aðeins " + sig(c.ts, 3) + " Nm");
      if (!okP) short.push("hámarksaflið er aðeins " + sig(c.Pmax, 3) + " W");
      var msg = right ? "Rétt. " : short.length ? "Ekki nóg við " + sig(v, 3) + " V: " + short.join(" og ") + ". " : "Dugar, en " + sig(v, 3) + " V er ekki lægsta spennan. ";
      $("k5-confirm").disabled = true;
      after(right, msg + expl);
    }

    SL.forEach(function (s) { $("k5-" + s.k).addEventListener("input", update); });
    showRound();
    Ctrl.onRedraw($("k5-t"), draw);
  });
})();

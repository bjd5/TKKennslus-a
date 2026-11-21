/* widgets-b.js – gagnvirku skrefin í köflum 3, 6, 7 og 8.
 * Hvert graf er skráð með TK.widget(id, mount). Vélin (journey.js) kallar á mount(root, api)
 * þegar skrefið er fyrst sýnt; api.done(texti) merkir skrefið lokið og api.status(texti) sýnir framvindu. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  function register(id, fn) {
    if (typeof TK.widget === "function") TK.widget(id, fn);
    else (TK._widgetQueue = TK._widgetQueue || []).push([id, fn]); // ef vélin hleðst á eftir
  }

  /* ---------- Hjálparföll ---------- */
  var fmt = function (v, d) { return isFinite(v) ? v.toFixed(d).replace(".", ",").replace(/^-/, "−") : "∞"; };
  var tf = function (v, d) { return fmt(v, d).replace(",", "{,}").replace("−", "-"); }; // tala inni í KaTeX
  var col = function (v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); };
  var $ = function (root, id) { return root.querySelector("#" + id); };
  var math = function (el) { if (typeof window.renderMath === "function") window.renderMath(el); };
  var num = function (str) {
    var s = String(str).replace(/\s+/g, "").replace(/−/g, "-").replace(",", ".");
    return s === "" ? NaN : Number(s);
  };
  var shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  var badge = function (ok, text) {
    var c = ok ? "var(--good)" : "var(--bad)";
    return '<span style="display:inline-block;font:600 0.82rem var(--sans);padding:0.2rem 0.55rem;margin:0.15rem 0.35rem 0.15rem 0;border-radius:999px;border:1px solid ' + c +
      ";color:" + c + ";background:color-mix(in srgb, " + c + ' 10%, transparent)">' + (ok ? "✓ " : "✗ ") + text + "</span>";
  };
  var setResult = function (el, ok, text) {
    el.className = "result " + (ok ? "ok" : "no");
    el.innerHTML = text;
    math(el);
  };

  /* Margliður: stuðlar í lækkandi veldaröð. */
  function pmul(a, b) {
    var r = new Array(a.length + b.length - 1).fill(0);
    for (var i = 0; i < a.length; i++) for (var j = 0; j < b.length; j++) r[i + j] += a[i] * b[j];
    return r;
  }
  function padd(a, b) {
    var n = Math.max(a.length, b.length), r = [];
    for (var i = 0; i < n; i++) r.push((a[i - n + a.length] || 0) + (b[i - n + b.length] || 0));
    return r;
  }
  /** Rætur margliðu (Durand–Kerner). */
  function roots(p) {
    while (p.length > 1 && Math.abs(p[0]) < 1e-14) p = p.slice(1);
    var n = p.length - 1;
    if (n < 1) return [];
    var a = p.map(function (c) { return c / p[0]; });
    var C = window.Ctrl.C, z = [];
    for (var k = 0; k < n; k++) z.push(C.ipow({ re: 0.4, im: 0.9 }, k));
    var ev = function (x) { var r = { re: 1, im: 0 }; for (var i = 1; i <= n; i++) r = C.add(C.mul(r, x), { re: a[i], im: 0 }); return r; };
    for (var it = 0; it < 400; it++) {
      var delta = 0;
      for (var i = 0; i < n; i++) {
        var den = { re: 1, im: 0 };
        for (var j = 0; j < n; j++) if (j !== i) den = C.mul(den, C.sub(z[i], z[j]));
        var step = C.div(ev(z[i]), den);
        z[i] = C.sub(z[i], step);
        delta = Math.max(delta, C.abs(step));
      }
      if (delta < 1e-12) break;
    }
    return z;
  }

  /* Annarrar gerðar þrepasvörun með lokaðri lausn (K = 1). */
  function step2(z, wn, t) {
    if (z < 1) {
      var q = Math.sqrt(1 - z * z), wd = wn * q;
      return 1 - Math.exp(-z * wn * t) * (Math.cos(wd * t) + (z / q) * Math.sin(wd * t));
    }
    if (z === 1) return 1 - Math.exp(-wn * t) * (1 + wn * t);
    var r = wn * Math.sqrt(z * z - 1), p1 = -z * wn + r, p2 = -z * wn - r;
    return 1 - (p2 * Math.exp(p1 * t) - p1 * Math.exp(p2 * t)) / (p2 - p1);
  }
  /** Stikar annarrar gerðar kerfis. tau er tímastuðull hægari pólsins. */
  function params2(z, wn) {
    var o = { s: z * wn };
    if (z < 1) {
      o.wd = wn * Math.sqrt(1 - z * z);
      o.tp = o.wd > 0 ? Math.PI / o.wd : Infinity;
      o.mp = 100 * Math.exp((-z * Math.PI) / Math.sqrt(1 - z * z));
      o.tau = o.s > 0 ? 1 / o.s : Infinity;
    } else {
      var r = wn * Math.sqrt(z * z - 1);
      o.wd = 0; o.tp = Infinity; o.mp = 0;
      o.tau = 1 / (o.s - r);
      o.r = r;
    }
    return o;
  }

  /* =====================================================================
   * Kafli 3: annarrar gerðar kerfi og „hittu markið“
   * ===================================================================== */
  register("kafli-3", function (root, api) {
    var Ctrl = window.Ctrl;
    var zS = $(root, "k3-z"), wS = $(root, "k3-wn");
    var stepCv = $(root, "k3-step"), bodeCv = $(root, "k3-bode");
    var set = function (id, t) { $(root, id).textContent = t; };
    var round = 0, target = null, finished = false;

    function newTarget() {
      var z0, wn0, p;
      if (round === 0) {
        // Mark 1: yfirskot og tími hæsta yfirskots
        z0 = 0.25 + Math.random() * 0.4; wn0 = 1.2 + Math.random() * 2.6; p = params2(z0, wn0);
        var m = Math.round(p.mp), t = Math.round(p.tp * 10) / 10;
        target = {
          text: "Stilltu kerfið svo yfirskotið sé $" + (m - 2) + "$-$" + (m + 2) + "\\,\\%$ og tími hæsta yfirskots $T_p$ sé $" + tf(t * 0.94, 2) + "$-$" + tf(t * 1.06, 2) + "$ s.",
          checks: [
            { label: "$M_p$ á bilinu", f: function (q) { return q.mp >= m - 2 && q.mp <= m + 2; } },
            { label: "$T_p$ á bilinu", f: function (q) { return q.tp >= t * 0.94 && q.tp <= t * 1.06; } },
          ],
          hint: "$M_p$ ræðst eingöngu af $\\zeta$. Finndu fyrst $\\zeta$ og stilltu svo $T_p = \\pi/\\omega_d$ með $\\omega_n$.",
        };
      } else {
        // Mark 2: staðsetning póla (sveiflutíðni og dempun)
        z0 = 0.2 + Math.random() * 0.45; wn0 = 1.5 + Math.random() * 2.5; p = params2(z0, wn0);
        var wd = Math.round(p.wd * 10) / 10, ft = Math.round(4 * p.tau * 10) / 10;
        target = {
          text: "Settu pólana í $s \\approx -\\sigma \\pm j\\omega_d$ með sveiflutíðni $\\omega_d = " + tf(wd * 0.95, 2) + "$-$" + tf(wd * 1.05, 2) + "$ rad/s og þannig að svipula svörunin sé horfin eftir $4\\tau = " + tf(ft * 0.92, 1) + "$-$" + tf(ft * 1.08, 1) + "$ s.",
          checks: [
            { label: "$\\omega_d$ á bilinu", f: function (q) { return q.wd >= wd * 0.95 && q.wd <= wd * 1.05; } },
            { label: "$4\\tau$ á bilinu", f: function (q) { return 4 * q.tau >= ft * 0.92 && 4 * q.tau <= ft * 1.08; } },
          ],
          hint: "Raunhluti pólanna er $-\\zeta\\omega_n = -1/\\tau$ og þverhlutinn er $\\omega_d = \\omega_n\\sqrt{1-\\zeta^2}$. Reiknaðu $\\zeta$ og $\\omega_n$ út frá $\\sigma$ og $\\omega_d$: $\\omega_n = \\sqrt{\\sigma^2 + \\omega_d^2}$.",
        };
      }
      $(root, "k3-goal").innerHTML = '<p style="margin:0"><b>Mark ' + (round + 1) + " af 2:</b> " + target.text + '</p><p style="margin:0.4rem 0 0;color:var(--muted);font-size:0.93rem"><i>Vísbending:</i> ' + target.hint + "</p>";
      math($(root, "k3-goal"));
      api.status && api.status("Mark " + (round + 1) + " af 2");
      update();
    }

    function update() {
      var z = parseFloat(zS.value), wn = parseFloat(wS.value);
      set("k3-zv", fmt(z, 2));
      set("k3-wnv", fmt(wn, 2));
      var p = params2(z, wn);
      if (z < 1) set("k3-p", (p.s > 0 ? "−" + fmt(p.s, 2) : "0") + " ± " + fmt(p.wd, 2) + "j");
      else set("k3-p", p.r < 1e-9 ? "−" + fmt(wn, 2) + " (tvöföld)" : "−" + fmt(p.s - p.r, 2) + ", −" + fmt(p.s + p.r, 2));
      set("k3-tau", fmt(p.tau, 2));
      set("k3-wd", z < 1 ? fmt(p.wd, 2) : "–");
      set("k3-tp", z < 1 && isFinite(p.tp) ? fmt(p.tp, 2) : "–");
      set("k3-mp", fmt(p.mp, 1) + " %");
      set("k3-4t", fmt(4 * p.tau, 1));

      var tmax = isFinite(p.tau) ? Math.min(40 / wn, Math.max(8 / wn, 5 * p.tau)) : 30 / wn;
      var ts = [], ys = [], ymax = 1.2;
      for (var i = 0; i <= 300; i++) {
        var t = (i / 300) * tmax, y = step2(z, wn, t);
        ts.push(t); ys.push(y);
        if (y + 0.1 > ymax) ymax = y + 0.1;
      }
      Ctrl.drawLines(stepCv, [{ x: ts, y: ys, color: col("--mag") }],
        { aspect: 0.42, xmin: 0, xmax: tmax, ymin: 0, ymax: Math.min(2.1, ymax), hlines: [1], xlabel: "t [s]" });
      var G = function (w) {
        var re = wn * wn - w * w, im = 2 * z * wn * w, d = re * re + im * im;
        if (d < 1e-18) d = 1e-18;
        return { re: (wn * wn * re) / d, im: (-wn * wn * im) / d };
      };
      var lo = wn / 100, hi = wn * 100;
      Ctrl.drawBode(bodeCv, Ctrl.bodeData(G, lo, hi, 600), { lo: lo, hi: hi, aspect: 0.72 });

      if (!target) return;
      var allOk = true, h = "";
      target.checks.forEach(function (c) { var ok = c.f(p); allOk = allOk && ok; h += badge(ok, c.label); });
      var chk = $(root, "k3-checks");
      chk.innerHTML = h;
      math(chk);
      if (allOk && !finished) {
        if (round === 0) {
          round = 1;
          setResult($(root, "k3-res"), true, "Mark 1 náð! $\\zeta = " + tf(z, 2) + "$ og $\\omega_n = " + tf(wn, 2) + "$ rad/s. Nú kemur mark 2.");
          setTimeout(newTarget, 900);
        } else {
          finished = true;
          setResult($(root, "k3-res"), true, "Bæði mörkin náð. Þú getur nú stillt kerfi annarrar gerðar út frá yfirskoti, $T_p$ og staðsetningu pólanna.");
          api.done("Þú stilltir annarrar gerðar kerfi á tvö ólík mörk.");
        }
      }
    }

    zS.addEventListener("input", update);
    wS.addEventListener("input", update);
    $(root, "k3-new").addEventListener("click", function () { if (!finished) newTarget(); else { round = 0; finished = false; newTarget(); } });
    Ctrl.onRedraw(stepCv, update);
    newTarget();
  });

  /* =====================================================================
   * Kafli 6: P-stýring, fasaöryggi og seinkun
   * G_P = 2,5/((1+2s)(1+0,5s)) = 2,5/(s^2 + 2,5s + 1)
   * ===================================================================== */
  register("kafli-6", function (root, api) {
    var Ctrl = window.Ctrl, C = Ctrl.C;
    var kS = $(root, "k6-k"), lS = $(root, "k6-l");
    var bodeCv = $(root, "k6-bode"), stepCv = $(root, "k6-step");
    var set = function (id, t) { $(root, id).textContent = t; };
    var stage = 1, Kfix = null, finished = false, last = null;
    var GP = function (s) { return C.div({ re: 2.5, im: 0 }, C.mul(C.add({ re: 1, im: 0 }, C.mul({ re: 2, im: 0 }, s)), C.add({ re: 1, im: 0 }, C.mul({ re: 0.5, im: 0 }, s)))); };

    /** Hermun lokaðrar lykkju með seinkun L á stýrimerkinu: y'' + 2,5y' + y = 2,5 K (r - y)(t - L). */
    function simulate(K, L, tmax) {
      var dt = 0.002, n = Math.round(tmax / dt), dly = Math.round(L / dt);
      var y = 0, v = 0, hist = new Float64Array(n + 1), ts = [], ys = [], every = Math.max(1, Math.round(n / 300));
      for (var i = 0; i <= n; i++) {
        hist[i] = K * (1 - y);
        if (i % every === 0) { ts.push(i * dt); ys.push(y); }
        var u = i - dly >= 0 ? hist[i - dly] : 0;
        var a = 2.5 * u - 2.5 * v - y;
        v += a * dt; y += v * dt; // hálfóbeinn Euler
        if (Math.abs(y) > 1e6) break;
      }
      return { ts: ts, ys: ys };
    }

    function update() {
      var K = parseFloat(kS.value), L = parseFloat(lS.value);
      set("k6-kv", fmt(K, 2));
      set("k6-lv", fmt(L, 2));
      var GK = function (w) {
        var s = { re: 0, im: w };
        return C.mul(C.mul({ re: K, im: 0 }, GP(s)), { re: Math.cos(w * L), im: -Math.sin(w * L) });
      };
      var m = Ctrl.margins(GK, 1e-2, 1e2);
      last = { K: K, L: L, m: m };
      set("k6-pm", m.pm === null ? "–" : fmt(m.pm, 1) + "°");
      set("k6-wc", m.wc === null ? "–" : fmt(m.wc, 2));
      set("k6-am", m.Am === null ? "∞" : fmt(m.Am, 2));
      set("k6-tr", m.wc === null ? "–" : fmt(1.4 / m.wc, 2));
      set("k6-ess", fmt(100 / (1 + 2.5 * K), 1) + " %");
      var st = $(root, "k6-stable");
      st.innerHTML = m.stable ? badge(true, "Stöðugt") : badge(false, "Óstöðugt");
      Ctrl.drawBode(bodeCv, m.data, { lo: 1e-2, hi: 1e2, wc: m.wc, pm: m.pm, wpi: m.wpi, aspect: 0.72 });
      var sim = simulate(K, L, 10);
      Ctrl.drawLines(stepCv, [{ x: sim.ts, y: sim.ys, color: col("--mag") }],
        { aspect: 0.4, xmin: 0, xmax: 10, ymin: -0.5, ymax: 2, hlines: [1], xlabel: "t [s]" });
      if (stage === 1) {
        var ok = m.pm !== null && L === 0 && Math.abs(m.pm - 45) <= 2;
        $(root, "k6-checks").innerHTML = badge(L === 0, "$L = 0$") + badge(ok, "$\\varphi_m = 45^\\circ \\pm 2^\\circ$");
        math($(root, "k6-checks"));
        $(root, "k6-f1").hidden = !ok;
      }
    }

    function check1(ev) {
      ev.preventDefault();
      if (!last || last.m.pm === null || Math.abs(last.m.pm - 45) > 2 || last.L !== 0) return;
      var ans = 100 / (1 + 2.5 * last.K), v = num($(root, "k6-a1").value);
      var res = $(root, "k6-r1");
      if (isNaN(v)) { setResult(res, false, "Skrifaðu tölu í %."); return; }
      if (Math.abs(v - ans) <= Math.max(0.04 * ans, 0.15)) {
        setResult(res, true, "Rétt: lykkjan er tegund 0 með $K_p = 2{,}5K = " + tf(2.5 * last.K, 2) + "$, svo $e_{ss} = \\dfrac{1}{1+K_p} = " + tf(ans, 1) + "\\,\\%$.");
        stage = 2; Kfix = last.K;
        kS.disabled = true;
        lS.disabled = false;
        $(root, "k6-stage2").hidden = false;
        $(root, "k6-checks").innerHTML = badge(true, "Skref 1 lokið");
        api.status && api.status("Skref 2 af 2");
      } else {
        setResult(res, false, "Ekki rétt. Lykkjan er tegund 0: $e_{ss} = 1/(1+K_p)$ þar sem $K_p = G_K(0) = 2{,}5K$.");
      }
    }

    function check2(ev) {
      ev.preventDefault();
      if (stage !== 2 || finished) return;
      var GK0 = function (w) { return C.mul({ re: Kfix, im: 0 }, GP({ re: 0, im: w })); };
      var m0 = Ctrl.margins(GK0, 1e-2, 1e2);
      var Lmax = (m0.pm * Math.PI) / 180 / m0.wc;
      var v = num($(root, "k6-a2").value), res = $(root, "k6-r2");
      if (isNaN(v)) { setResult(res, false, "Skrifaðu tölu í sekúndum."); return; }
      if (Math.abs(v - Lmax) <= 0.05 * Lmax) {
        finished = true;
        setResult(res, true, "Rétt: seinkunin breytir ekki $\\omega_c = " + tf(m0.wc, 2) + "$ rad/s en lækkar fasann um $\\omega L$. Óstöðugt þegar $\\omega_c L = \\varphi_m$: $L_{max} = \\dfrac{" + tf(m0.pm, 1) + "^\\circ\\cdot\\pi/180}{" + tf(m0.wc, 2) + "} = " + tf(Lmax, 3) + "$ s.");
        api.done("Þú stilltir fasaöryggi og fannst hámarksseinkun lykkjunnar.");
      } else {
        setResult(res, false, "Ekki alveg. Seinkun $e^{-Ls}$ hefur mögnun 1 og fasa $-\\omega L$ (í radíönum). Hvaða $L$ étur upp allt fasaöryggið við $\\omega_c$? Prófaðu líka sleðann.");
      }
    }

    kS.addEventListener("input", update);
    lS.addEventListener("input", update);
    $(root, "k6-f1").addEventListener("submit", check1);
    $(root, "k6-f2").addEventListener("submit", check2);
    Ctrl.onRedraw(bodeCv, update);
    api.status && api.status("Skref 1 af 2");
    update();
  });

  /* =====================================================================
   * Kafli 7: PID-tilraunastofa á ferlinu úr lokaprófinu 2025 S6
   * G_P = b/(s^2 + a1 s + a0), b = a0 = 1,5977, a1 = 1,4157
   * G_C = K (1 + 1/(T_I s)) (1 + T_D s)/(1 + T_F s), T_F = 0,2 T_D
   * ===================================================================== */
  register("kafli-7", function (root, api) {
    var Ctrl = window.Ctrl, C = Ctrl.C;
    var a0 = 1.5977, a1 = 1.4157, b = 1.5977;
    var kS = $(root, "k7-k"), iS = $(root, "k7-ti"), dS = $(root, "k7-td");
    var iOn = $(root, "k7-ion"), dOn = $(root, "k7-don");
    var stepCv = $(root, "k7-step"), uCv = $(root, "k7-u");
    var set = function (id, t) { $(root, id).textContent = t; };
    var finished = false, TEND = 12, TPLOT = 6;

    // Opna ferlið (til samanburðar) með lokaðri lausn
    var zP = a1 / (2 * Math.sqrt(a0)), wP = Math.sqrt(a0);

    function simulate(K, TI, useI, TD, useD) {
      var TF = 0.2 * TD, dt = 0.002, n = Math.round(TEND / dt);
      var y = 0, v = 0, xi = 0, zf = 0;
      var out = { t: [], y: [], u: [], yp: [], umax: 0 };
      var ctrl = function (y, xi, zf) {
        var e = 1 - y, vv = K * (e + (useI ? xi / TI : 0));
        return useD ? { u: (TD / TF) * vv + (1 - TD / TF) * zf, v: vv, e: e } : { u: vv, v: vv, e: e };
      };
      // ástand: [y, v, xi, zf]
      var f = function (s) {
        var c = ctrl(s[0], s[2], s[3]);
        return [s[1], b * c.u - a1 * s[1] - a0 * s[0], c.e, useD ? (c.v - s[3]) / TF : 0];
      };
      var s = [0, 0, 0, 0], every = 5;
      for (var i = 0; i <= n; i++) {
        var c = ctrl(s[0], s[2], s[3]);
        if (Math.abs(c.u) > out.umax) out.umax = Math.abs(c.u);
        if (i % every === 0) {
          var t = i * dt;
          out.t.push(t); out.y.push(s[0]); out.u.push(c.u); out.yp.push(step2(zP, wP, t));
        }
        var k1 = f(s), s2 = s.map(function (x, j) { return x + 0.5 * dt * k1[j]; });
        var k2 = f(s2), s3 = s.map(function (x, j) { return x + 0.5 * dt * k2[j]; });
        var k3 = f(s3), s4 = s.map(function (x, j) { return x + dt * k3[j]; });
        var k4 = f(s4);
        s = s.map(function (x, j) { return x + (dt / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]); });
        if (!isFinite(s[0]) || Math.abs(s[0]) > 1e6) break;
      }
      return out;
    }

    function update() {
      var K = parseFloat(kS.value), TI = parseFloat(iS.value), TD = parseFloat(dS.value);
      var useI = iOn.checked, useD = dOn.checked, TF = 0.2 * TD;
      iS.disabled = !useI; dS.disabled = !useD;
      set("k7-kv", fmt(K, 2));
      set("k7-tiv", useI ? fmt(TI, 1) + " s" : "af");
      set("k7-tdv", useD ? fmt(TD, 2) + " s" : "af");
      set("k7-tf", useD ? fmt(TF, 3) + " s" : "–");

      // Stöðugleiki út frá kennijöfnunni: nefnari(G_C) nefnari(G_P) + teljari(G_C) teljari(G_P) = 0
      var numC = [K], denC = [1];
      if (useI) { numC = pmul(numC, [TI, 1]); denC = pmul(denC, [TI, 0]); }
      if (useD) { numC = pmul(numC, [TD, 1]); denC = pmul(denC, [TF, 1]); }
      var charP = padd(pmul(denC, [1, a1, a0]), pmul(numC, [b]));
      var rts = roots(charP);
      var stable = rts.every(function (r) { return r.re < -1e-9; });

      var Lw = function (w) {
        var s = { re: 0, im: w }, g = { re: K, im: 0 };
        if (useI) g = C.mul(g, C.add({ re: 1, im: 0 }, C.div({ re: 1, im: 0 }, C.mul({ re: TI, im: 0 }, s))));
        if (useD) g = C.mul(g, C.div(C.add({ re: 1, im: 0 }, C.mul({ re: TD, im: 0 }, s)), C.add({ re: 1, im: 0 }, C.mul({ re: TF, im: 0 }, s))));
        return C.mul(g, C.div({ re: b, im: 0 }, C.add(C.add(C.mul(s, s), C.mul({ re: a1, im: 0 }, s)), { re: a0, im: 0 })));
      };
      var m = Ctrl.margins(Lw, 1e-3, 1e3);

      var sim = simulate(K, TI, useI, TD, useD);
      var yf = useI ? 1 : K / (1 + K);
      var ess = useI ? 0 : 1 / (1 + K);
      var tr = Infinity, Mp = 0, t10 = null, t90 = null, ymax = -Infinity;
      for (var i = 0; i < sim.t.length; i++) {
        var y = sim.y[i];
        if (t10 === null && y >= 0.1 * yf) t10 = sim.t[i];
        if (t90 === null && y >= 0.9 * yf) t90 = sim.t[i];
        if (y > ymax) ymax = y;
      }
      if (stable && t10 !== null && t90 !== null) tr = t90 - t10;
      if (stable) Mp = Math.max(0, (100 * (ymax - yf)) / yf);

      set("k7-tr", stable && isFinite(tr) ? fmt(tr, 2) + " s" : "–");
      set("k7-mp", stable ? fmt(Mp, 1) + " %" : "–");
      set("k7-ess", stable ? fmt(100 * ess, 1) + " %" : "–");
      set("k7-pm", m.pm === null ? "–" : fmt(m.pm, 0) + "°");
      set("k7-wc", m.wc === null ? "–" : fmt(m.wc, 2));
      set("k7-umax", stable ? fmt(sim.umax, 1) : "–");

      var specs = [
        { ok: stable, t: "Stöðugt" },
        { ok: stable && tr < 0.5, t: "Rístími < 0,5 s" },
        { ok: stable && Mp < 10, t: "Yfirskot < 10 %" },
        { ok: stable && useI, t: "Engin skekkja í jafnvægi" },
      ];
      var h = "", all = true;
      specs.forEach(function (s) { h += badge(s.ok, s.t); all = all && s.ok; });
      $(root, "k7-specs").innerHTML = h;

      var nPlot = sim.t.filter(function (t) { return t <= TPLOT + 1e-9; }).length;
      var cut = function (a) { return a.slice(0, nPlot); };
      var yTop = stable ? Math.min(2, Math.max(1.3, ymax + 0.1)) : 2;
      Ctrl.drawLines(stepCv, [
        { x: cut(sim.t), y: cut(sim.yp), color: col("--muted"), dash: [6, 4] },
        { x: cut(sim.t), y: cut(sim.y), color: col("--mag") },
      ], { aspect: 0.42, xmin: 0, xmax: TPLOT, ymin: 0, ymax: yTop, hlines: [1], xlabel: "t [s]" });
      var us = cut(sim.u), uLo = Math.min(0, Math.min.apply(null, us)), uHi = Math.max(1, Math.max.apply(null, us));
      Ctrl.drawLines(uCv, [{ x: cut(sim.t), y: us, color: col("--phase") }],
        { aspect: 0.3, xmin: 0, xmax: TPLOT, ymin: Math.max(-50, uLo), ymax: Math.min(60, uHi * 1.08), xlabel: "t [s]" });

      if (all && !finished) {
        finished = true;
        setResult($(root, "k7-res"), true, "Allar kröfur uppfylltar með $K = " + tf(K, 2) + "$, $T_I = " + tf(TI, 1) + "$ s og $T_D = " + tf(TD, 2) + "$ s. Taktu eftir stýrimerkinu: D-liðurinn gefur toppinn " + fmt(sim.umax, 1) + " við þrepið.");
        api.done("Þú hannaðir stýringu sem uppfyllir allar kröfurnar.");
      }
    }

    [kS, iS, dS].forEach(function (s) { s.addEventListener("input", update); });
    [iOn, dOn].forEach(function (c) { c.addEventListener("change", update); });
    $(root, "k7-reset").addEventListener("click", function () {
      kS.value = "1"; iS.value = "3"; dS.value = "0.5"; iOn.checked = false; dOn.checked = false; update();
    });
    Ctrl.onRedraw(stepCv, update);
    update();
  });

  /* =====================================================================
   * Kafli 8: vinnuferlið og val á stýriliðum
   * ===================================================================== */
  register("kafli-8", function (root, api) {
    var SEQS = [
      {
        title: "Heildarferli hönnunar (mynd 14.1)",
        steps: [
          "Upplýsingum um þarfir notenda er aflað og skilgreint hvernig réttmæti þeirra skuli staðfest.",
          "Þörfum er umbreytt í kröfur og skilgreint hvernig þær skulu sannprófaðar.",
          "Kerfi sem uppfyllir kröfurnar er hannað og útfært.",
          "Útfærslan er sannprófuð; hönnun og útfærsla endurbætt þar til hún stenst.",
          "Notendur staðfesta réttmæti; kröfur, hönnun og útfærsla endurbætt þar til það tekst.",
        ],
        why: "Fyrst þarfir (sjónarhóll notenda), svo kröfur (sjónarhóll hönnuðar). Sannprófun athugar kröfur, réttmæti athugar þarfir, og hvort tveggja er skilgreint <i>áður</i> en hannað er.",
      },
      {
        title: "Einfaldaða ferlið fyrir véleindakerfi (kafli 14)",
        steps: [
          "Út frá kröfum er skilgreint hvernig heildarkerfið skuli sannprófað.",
          "Kröfur til hverrar vélbúnaðareiningar (tölvu, nema, hreyfils) eru skilgreindar og einingar valdar.",
          "Gert er líkan af hreyfli, kerfinu sem á að stýra og nema; stýring hönnuð með aðstoð líkansins.",
          "Stýringin er útfærð í tölvunni og heildarkerfið sannprófað; endurbætt þar til kröfur standast.",
        ],
        why: "Sannprófunin er skilgreind fyrst, síðan vélbúnaður valinn (nemi og hreyfill eru hluti líkansins), svo líkan og stýring, og loks útfærsla og sannprófun á raunkerfinu.",
      },
    ];
    var OPTS = ["Bæta við I-lið", "Bæta við D-lið", "Duga að breyta K (P)", "Engu þarf að breyta"];
    var CARDS = [
      { t: "Ferlið hefur ekkert heildi (nær föstu gildi án stýringar) og krafist er að engin skekkja sé í jafnvægi eftir þrep í óskgildi.", c: 0, e: "Tegund 0 með P gefur $e_{ss} = 1/(1+K_p) \\ne 0$. Heildi í stýringunni gerir lykkjuna að tegund 1." },
      { t: "Fasi lykkjunnar byrjar í $-90^\\circ$ við lágar tíðnir. Krafa: engin skekkja við þrep í óskgildi. Aðrar kröfur eru þegar uppfylltar.", c: 3, e: "Fasi $-90^\\circ$ við lágar tíðnir þýðir að heildi er þegar í lykkjunni (tegund 1), svo $e_{ss} = 0$ fyrir þrep." },
      { t: "Hækka þarf $\\omega_c$ þrefalt til að ná rístímakröfu, en fasinn við nýju $\\omega_c$ er $-175^\\circ$ og krafist er $\\varphi_m \\ge 50^\\circ$.", c: 1, e: "Hærra K eitt og sér gæfi $\\varphi_m \\approx 5^\\circ$. D-liður gefur fasahækkun við nýju skurðtíðnina (lokapróf 2024 S6)." },
      { t: "$\\varphi_m = 72^\\circ$, mögnunaröryggi 12, en svörunin er of hæg. Fasinn er yfir $-120^\\circ$ langt út fyrir núverandi $\\omega_c$.", c: 2, e: "Nóg fasaöryggi er til staðar. Hærra K færir $\\omega_c$ til hægri og hraðar svöruninni án þess að $\\varphi_m$ fari undir viðunandi mörk." },
      { t: "Yfirskot er 35 % og krafist undir 10 %, en svörunin má ekki verða hægari.", c: 1, e: "Lægra K minnkar yfirskot en hægir á svöruninni. D-liður eykur fasaöryggið við sömu $\\omega_c$ og dregur úr yfirskoti." },
      { t: "Seinkun í lokanum hefur lækkað $\\varphi_m$ í $12^\\circ$. Ekki er gerð krafa um hraðari svörun.", c: 2, e: "Seinkun lækkar fasann um $\\omega L$; minni $\\omega_c$ (lægra K) minnkar fasatapið og eykur fasaöryggið. Einföld lausn þegar hraði skiptir ekki máli." },
      { t: "Í hönnunarverkefninu skilur P-stýring eftir 0,8 °C frávik frá óskgildi hitastigs sem verður að hverfa.", c: 0, e: "Varanlegt frávik með P-stýringu á ferli án heildis: I-liður eyðir því." },
      { t: "Föst þrepatruflun kemur inn á milli stýringar og ferlis. Ferlið inniheldur heildi, stýringin er P. Skekkja vegna truflunarinnar á að vera núll.", c: 0, e: "Heildið þarf að vera <i>á undan</i> truflunni, þ.e. í stýringunni. Heildi í ferlinu eyðir ekki skekkju vegna truflunar sem kemur inn fyrir framan það." },
      { t: "Stöðugt kerfi, rístími 0,3 s (krafa < 0,5 s), yfirskot 5 % (krafa < 10 %) og $e_{ss} = 0$.", c: 3, e: "Allar kröfur uppfylltar. Hafðu stýringuna eins einfalda og hægt er." },
      { t: "Skekkja í jafnvægi er 9 % og krafist undir 2 %. Lykkjan er tegund 0 og fasaöryggi er nóg þótt K sé fimmfaldað.", c: 2, e: "$e_{ss} = 1/(1+K_p)$: með nægu fasaöryggi má einfaldlega hækka K." },
    ];

    var seqIdx = 0, seqDone = false, picked = [], seqMistakes = 0;
    var cards = shuffle(CARDS).slice(0, 6), cardIdx = 0, cardMistakes = 0, cardsDone = false;

    function renderSeq() {
      var box = $(root, "k8-seq");
      if (seqDone) {
        box.innerHTML = '<p class="result ok">Báðar raðirnar réttar' + (seqMistakes ? " (" + seqMistakes + " mistök á leiðinni)" : " í fyrstu tilraun") + ".</p>";
        return;
      }
      var S = SEQS[seqIdx];
      var h = '<p style="font-family:var(--sans);font-weight:700;margin:0 0 0.4rem">Röð ' + (seqIdx + 1) + " af 2: " + S.title + "</p>";
      h += '<ol style="margin:0 0 0.8rem">';
      picked.forEach(function (i) { h += "<li>" + S.steps[i] + "</li>"; });
      for (var k = picked.length; k < S.steps.length; k++) h += '<li style="color:var(--muted)">…</li>';
      h += "</ol><p style=\"margin:0 0 0.4rem;color:var(--muted);font-size:0.92rem\">Smelltu á skrefið sem kemur næst:</p><div class=\"opts\">";
      S.order.forEach(function (i) {
        if (picked.indexOf(i) === -1) h += '<button type="button" class="opt" data-i="' + i + '">' + S.steps[i] + "</button>";
      });
      h += '</div><div class="result" id="k8-seqres" aria-live="polite"></div>';
      box.innerHTML = h;
      box.querySelectorAll(".opt").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var i = parseInt(btn.getAttribute("data-i"), 10);
          if (i === picked.length) {
            picked.push(i);
            if (picked.length === S.steps.length) {
              var res = S.why;
              seqIdx++; picked = [];
              if (seqIdx >= SEQS.length) seqDone = true;
              else SEQS[seqIdx].order = shuffle(SEQS[seqIdx].steps.map(function (_, k) { return k; }));
              renderSeq();
              var r = $(root, "k8-seqres") || $(root, "k8-seq");
              if (!seqDone) setResult(r, true, "Rétt röð! " + res);
              else $(root, "k8-seq").insertAdjacentHTML("beforeend", '<p style="margin:0.4rem 0 0">' + res + "</p>");
              progress();
            } else renderSeq();
          } else {
            seqMistakes++;
            btn.classList.add("wrong");
            setResult($(root, "k8-seqres"), false, "Ekki næst í röðinni. Hugsaðu: hvað þarf að liggja fyrir áður en þetta skref er tekið?");
          }
        });
      });
    }

    function renderCard() {
      var box = $(root, "k8-cards");
      if (cardsDone) {
        box.innerHTML = '<p class="result ok">Öll 6 spjöldin rétt' + (cardMistakes ? " (" + cardMistakes + " mistök á leiðinni)" : " í fyrstu tilraun") + ".</p>";
        return;
      }
      var cd = cards[cardIdx];
      var h = '<p style="font-family:var(--sans);font-weight:700;margin:0 0 0.4rem">Spjald ' + (cardIdx + 1) + " af " + cards.length + "</p>";
      h += '<div class="key"><p style="margin:0">' + cd.t + "</p></div><div class=\"opts\" style=\"margin-top:0.6rem\">";
      OPTS.forEach(function (o, i) { h += '<button type="button" class="opt" data-i="' + i + '">' + o + "</button>"; });
      h += '</div><div class="result" id="k8-cres" aria-live="polite"></div><div id="k8-cnext"></div>';
      box.innerHTML = h;
      math(box);
      box.querySelectorAll(".opt").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var i = parseInt(btn.getAttribute("data-i"), 10);
          if (i === cd.c) {
            box.querySelectorAll(".opt").forEach(function (b2) { b2.disabled = true; });
            btn.classList.add("right");
            setResult($(root, "k8-cres"), true, "Rétt. " + cd.e);
            var nb = document.createElement("button");
            nb.type = "button"; nb.className = "btn ghost"; nb.style.marginTop = "0.6rem";
            nb.textContent = cardIdx + 1 < cards.length ? "Næsta spjald →" : "Ljúka";
            nb.addEventListener("click", function () {
              cardIdx++;
              if (cardIdx >= cards.length) cardsDone = true;
              renderCard(); progress();
            });
            $(root, "k8-cnext").appendChild(nb);
          } else {
            cardMistakes++;
            btn.classList.add("wrong");
            btn.disabled = true;
            setResult($(root, "k8-cres"), false, "Ekki rétt. Reyndu aftur. Hvaða krafa er ekki uppfyllt, og hvaða liður breytir einmitt henni?");
          }
        });
      });
    }

    function progress() {
      var n = (seqDone ? 1 : 0) + (cardsDone ? 1 : 0);
      api.status && api.status("Leikir: " + n + " af 2 lokið");
      if (seqDone && cardsDone) api.done("Þú raðaðir vinnuferlinu og valdir rétta stýriliði í öllum tilvikum.");
    }

    SEQS[0].order = shuffle(SEQS[0].steps.map(function (_, k) { return k; }));
    renderSeq();
    renderCard();
    progress();
  });
})();

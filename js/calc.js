/* calc.js – reiknivélar: hreyfill, nemar og lykkjugreining. Krefst js/ctrl.js. */
(function () {
  "use strict";
  var Ctrl = window.Ctrl;
  var C = Ctrl.C;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Hjálparföll ---------- */
  function num(id) {
    var v = $(id).value.replace(/\s+/g, "").replace(",", ".").replace("−", "-");
    if (v === "") return NaN;
    return Number(v);
  }
  function f(x, sig) {
    if (x === Infinity) return "∞";
    if (x === -Infinity) return "−∞";
    if (typeof x !== "number" || !isFinite(x)) return "–";
    sig = sig || 3;
    var v = Number(x.toPrecision(sig));
    var s = (Math.abs(v) >= 1e6 || (Math.abs(v) < 1e-3 && v !== 0)) ? v.toExponential(sig - 1) : String(v);
    return s.replace(".", ",").replace("-", "−");
  }
  function rows(el, list) {
    el.innerHTML = list.map(function (r) {
      return "<dt>" + r[0] + "</dt><dd" + (r[2] ? ' class="hl"' : "") + ">" + r[1] + "</dd>";
    }).join("");
    window.renderMath(el);
  }
  function bad(el, text) { rows(el, [[text, "–"]]); }
  function onInput(ids, fn) {
    ids.forEach(function (id) {
      $(id).addEventListener("input", fn);
      $(id).addEventListener("change", fn);
    });
  }
  var RPM = 60 / (2 * Math.PI);

  /* ---------- Hreyfill ---------- */
  function motor() {
    var out = $("m-out");
    var kt = num("m-kt"), kf = num("m-kf"), R = num("m-r"), Lm = num("m-l"), va = num("m-va");
    var I = num("m-i"), c = num("m-c"), tl = num("m-tl");
    if (!(c >= 0)) c = 0;
    if (!(tl >= 0)) tl = 0;
    if (!(Lm >= 0)) Lm = 0;
    if ($("m-kfu").value === "rpm") kf = kf / (1000 * 2 * Math.PI / 60);
    if (!(kt > 0 && kf > 0 && R > 0 && isFinite(va))) return bad(out, "Fylltu út $K_\\tau$, $K_f$, $R$ og $v_a$");
    var L = Lm / 1000;
    var ts = (kt * va) / R, w0 = va / kf, P = (ts * w0) / 4;
    var den0 = c + (kt * kf) / R;
    var list = [
      ["Upphafsvægi $\\tau_s = K_\\tau v_a / R$", f(ts) + " Nm", true],
      ["Lausagangshraði $\\omega_0 = v_a / K_f$", f(w0) + " rad/s = " + f(w0 * RPM, 4) + " RPM", true],
      ["Hámarksafl $\\tau_s\\omega_0 / 4$ (við $\\omega_0/2$)", f(P) + " W"],
      ["Upphafsstraumur $v_a / R$", f(va / R) + " A"],
      ["$K_f$ í V·s/rad", f(kf, 4)],
      ["$G_P(0)$ frá $v_a$ til $\\omega$ ($L \\approx 0$)", f((kt / R) / den0) + " (rad/s)/V"],
    ];
    if (L > 0) list.push(["Rafrænn tímastuðull $\\tau_e = L/R$", f((L / R) * 1000) + " ms"]);
    if (I > 0) {
      list.push(["Vélrænn tímastuðull $I / (c + K_\\tau K_f / R)$ (með $L \\approx 0$)", f((I / den0) * 1000) + " ms"]);
      if (L > 0) {
        // (L s + R)(I s + c) + Kτ Kf = 0  ->  a s^2 + b s + d = 0
        var a = I * L, b = R * I + L * c, d = R * c + kt * kf;
        var disc = b * b - 4 * a * d;
        if (disc >= 0) {
          var p1 = (-b + Math.sqrt(disc)) / (2 * a), p2 = (-b - Math.sqrt(disc)) / (2 * a);
          list.push(["Pólar með $L$ (tímastuðlar)", f(-1000 / p1) + " ms og " + f(-1000 / p2) + " ms"]);
        } else {
          list.push(["Pólar með $L$ (sveiflur)", "$\\omega_n$ = " + f(Math.sqrt(d / a)) + " rad/s, $\\zeta$ = " + f(b / (2 * Math.sqrt(a * d)))]);
        }
      }
    }
    if (tl > 0 || c > 0) {
      var w = (ts - tl) / den0;
      if (w <= 0) {
        list.push(["Jafnvægi með álagi", "Álagið er yfir upphafsvægi: hreyfillinn kemst ekki af stað"]);
      } else {
        var i = (va - kf * w) / R;
        list.push(["Jafnvægishraði með álagi ($\\tau_L$, $c$)", f(w) + " rad/s = " + f(w * RPM, 4) + " RPM", true]);
        list.push(["Straumur í jafnvægi", f(i) + " A"]);
        list.push(["Vægi hreyfils í jafnvægi $K_\\tau i$", f(kt * i) + " Nm"]);
        if (tl > 0) list.push(["Afl í álag $\\tau_L\\,\\omega$", f(tl * w) + " W"]);
      }
    }
    rows(out, list);
  }
  onInput(["m-kt", "m-kf", "m-kfu", "m-r", "m-l", "m-va", "m-i", "m-c", "m-tl"], motor);

  /* ---------- Nemar ---------- */
  function sensLin() {
    var out = $("s-out");
    var x0 = num("s-xmin"), x1 = num("s-xmax"), y0 = num("s-ymin"), y1 = num("s-ymax"), x = num("s-x"), lin = num("s-lin");
    if (!(isFinite(x0) && isFinite(x1) && isFinite(y0) && isFinite(y1) && x1 !== x0)) return bad(out, "Fylltu út mælisvið og úttaksbil");
    var S = (y1 - y0) / (x1 - x0);
    var list = [["Næmni $S = \\Delta y / \\Delta x$", f(S, 4), true]];
    if (isFinite(x)) {
      list.push(["Úttak $y$ við $x$", f(y0 + S * (x - x0), 4), true]);
      if (x < Math.min(x0, x1) || x > Math.max(x0, x1)) list.push(["Athugasemd", "$x$ er utan mælisviðs"]);
    }
    list.push(["Mælisvið $x_{max} - x_{min}$", f(x1 - x0)]);
    if (isFinite(lin)) list.push(["Mesta frávik frá línuleika (í einingum $x$)", f((Math.abs(lin) / 100) * Math.abs(x1 - x0), 3)]);
    rows(out, list);
  }
  onInput(["s-xmin", "s-xmax", "s-ymin", "s-ymax", "s-x", "s-lin"], sensLin);

  function sensTime() {
    var out = $("t-out");
    var tau = num("t-tau"), t = num("t-t"), dx = num("t-dx");
    if (!(tau > 0 && t >= 0)) return bad(out, "Fylltu út $\\tau$ og $t$");
    var frac = 1 - Math.exp(-t / tau);
    var list = [["Hlutfall af lokagildi $1 - e^{-t/\\tau}$", f(frac * 100, 4) + " %", true]];
    if (isFinite(dx)) list.push(["Úttak $\\Delta x\\,(1 - e^{-t/\\tau})$", f(dx * frac, 4), true]);
    list.push(["Eftir $\\tau$ (63,2 %)", f(tau) + " s"]);
    list.push(["Eftir $4\\tau$ (98,2 %)", f(4 * tau) + " s"]);
    rows(out, list);
  }
  onInput(["t-tau", "t-t", "t-dx"], sensTime);

  function sensPot() {
    var out = $("p-out");
    var vs = num("p-vs"), rp = num("p-rp"), rl = num("p-rl"), x = num("p-x");
    var N = num("e-n"), r = num("e-r");
    var R = num("g-r"), G = num("g-g"), eps = num("g-e");
    var list = [];
    if (vs > 0 && rp > 0 && rl > 0 && x >= 0 && x <= 1) {
      var e = vs * (rp / rl) * (x * x - x * x * x);
      list.push(["Stillivíðnám: skekkja $e = V_s \\frac{R_P}{R_L}(x^2 - x^3)$", f(e * 1000, 4) + " mV", true]);
      list.push(["Sem hlutfall af mælisviði ($V_s$)", f((e / vs) * 100, 3) + " %"]);
    } else list.push(["Stillivíðnám", "Fylltu út $V_s$, $R_P$, $R_L$ og $0 \\le x \\le 1$"]);
    if (N > 0 && r > 0) list.push(["Kóðaskífa: upplausn $2\\pi r / N$", f((2 * Math.PI * r) / N, 4) + " mm", true]);
    if (R > 0 && isFinite(G) && isFinite(eps)) {
      list.push(["Álagsnemi: $\\Delta R = R\\,G\\,\\varepsilon$", f(R * G * eps, 4) + " Ω", true]);
      list.push(["$\\Delta R / R$", f(G * eps, 4)]);
    }
    rows(out, list);
  }
  onInput(["p-vs", "p-rp", "p-rl", "p-x", "e-n", "e-r", "g-r", "g-g", "g-e"], sensPot);

  /* ---------- Lykkjugreining ---------- */
  var last = null; // síðasta niðurstaða til endurteiknunar

  function parseVars(str) {
    var vars = {};
    var re = /([A-Za-z_][A-Za-z_0-9]*)\s*=\s*([-+−]?\s*[0-9]*[.,]?[0-9]+(?:[eE][-+]?[0-9]+)?)/g;
    var m;
    while ((m = re.exec(str)) !== null) vars[m[1]] = parseFloat(m[2].replace(/\s+/g, "").replace(",", ".").replace("−", "-"));
    return vars;
  }
  function niceCeil(x) {
    var p = Math.pow(10, Math.floor(Math.log10(x)));
    var steps = [1, 2, 5, 10];
    for (var i = 0; i < steps.length; i++) if (steps[i] * p >= x) return steps[i] * p;
    return 10 * p;
  }
  function limitN(GK, N) {
    var s = { re: 1e-8, im: 0 };
    return C.mul(GK(s), C.ipow(s, N)).re;
  }

  function showFields() {
    var t = $("l-type").value;
    $("l-ti-w").hidden = !(t === "PI" || t === "PID");
    $("l-td-w").hidden = !(t === "PD" || t === "PID");
    $("l-tf-w").hidden = t !== "PID";
  }

  function computeLoop() {
    var type = $("l-type").value;
    var K = num("l-k"), TI = num("l-ti"), TD = num("l-td"), TF = num("l-tf");
    var Ld = num("l-delay");
    if (!(Ld >= 0)) Ld = 0;
    if (!isFinite(K)) throw new Error("Fylltu út $K$.");
    if ((type === "PI" || type === "PID") && !(TI > 0)) throw new Error("$T_I$ þarf að vera stærra en 0.");
    if ((type === "PD" || type === "PID") && !(TD >= 0)) throw new Error("$T_D$ þarf að vera 0 eða stærra.");
    if (type === "PID" && !(TF >= 0)) throw new Error("$T_F$ þarf að vera 0 eða stærra.");
    var uv = parseVars($("l-vars").value);
    var GP, GS;
    try { GP = Ctrl.tfFrom($("l-gp").value, uv); GP.at(1); } catch (e) { throw new Error("Ferli $G_P$: " + e.message); }
    try { GS = Ctrl.tfFrom($("l-gs").value || "1", uv); GS.at(1); } catch (e) { throw new Error("Nemi $G_S$: " + e.message); }
    var ctext = { P: "K", PI: "K*(1+1/(TI*s))", PD: "K*(1+TD*s)", PID: "K*(1+1/(TI*s))*(1+TD*s)/(1+TF*s)" }[type];
    var GC = Ctrl.tfFrom(ctext, { K: K, TI: TI, TD: TD, TF: TF });
    var delay = function (s) { return Ld > 0 ? C.exp({ re: -Ld * s.re, im: -Ld * s.im }) : { re: 1, im: 0 }; };
    var GK = function (s) { return C.mul(C.mul(C.mul(GC(s), GP(s)), GS(s)), delay(s)); };
    GK.at = function (w) { return GK({ re: 0, im: w }); };
    var one = C.add({ re: 1, im: 0 }, GK({ re: 0, im: 1 }));
    if (!isFinite(one.re) || !isFinite(one.im)) throw new Error("Formúlan skilar ekki tölu við $s = j$.");

    var m = Ctrl.margins(GK.at, 1e-4, 1e4);
    var N = Ctrl.systemType(GK.at);
    var res = { K: K, type: type, Ld: Ld, GK: GK, GP: GP, GC: GC, GS: GS, delay: delay, m: m, N: N };

    // stuðull fyrir skekkju
    res.kconst = N <= 2 ? limitN(GK, N) : null;

    // tíðnisvið fyrir Bode-rit
    var pts = [m.wc, m.wpi].filter(function (v) { return v !== null && isFinite(v) && v > 0; });
    var lo, hi;
    if (pts.length) {
      lo = Math.pow(10, Math.floor(Math.log10(Math.min.apply(null, pts))) - 1);
      hi = Math.pow(10, Math.ceil(Math.log10(Math.max.apply(null, pts))) + 1);
    } else { lo = 1e-2; hi = 1e2; }
    while (hi / lo < 1e3) { lo /= 10; hi *= 10; }
    res.lo = lo; res.hi = hi;
    res.bode = Ctrl.bodeData(GK.at, lo, hi, 500);

    // þrepasvörun lokaða kerfisins
    var tmaxIn = num("l-tmax");
    var tmax = tmaxIn > 0 ? tmaxIn : (m.wc ? niceCeil(20 / m.wc) : (m.wpi ? niceCeil(20 / m.wpi) : 10));
    var T = function (s) {
      var open = C.mul(C.mul(GC(s), GP(s)), delay(s));
      return C.div(open, C.add({ re: 1, im: 0 }, C.mul(open, GS(s))));
    };
    var ts = [];
    var n = 160;
    for (var i = 0; i <= n; i++) ts.push((i / n) * tmax + 1e-6);
    // Fourier-aðferðin gildir aðeins fyrir stöðug kerfi
    var y = m.stable === false ? null : Ctrl.stepResponse(T, ts, m.wc || m.wpi || 5);
    res.tmax = tmax; res.ts = ts; res.y = y;

    // truflun
    var wv = num("l-wv");
    if (wv > 0) {
      var gpv = C.abs(GP.at(wv));
      var den = C.abs(C.add({ re: 1, im: 0 }, GK.at(wv)));
      res.dist = { w: wv, without: gpv, withFb: gpv / den, den: den };
    }
    return res;
  }

  function renderLoop(r) {
    var out = $("l-out");
    var m = r.m;
    var list = [];
    var stableTxt = m.stable === false ? "Óstöðugt" : "Stöðugt";
    list.push(["Lokaða kerfið (samkvæmt Bode-riti)", stableTxt, true]);
    list.push(["Skurðtíðni $\\omega_c$ ($|G_K| = 1$)", m.wc === null ? "engin" : f(m.wc, 4) + " rad/s", m.wc !== null]);
    list.push(["Fasaöryggi $\\varphi_m = 180^\\circ + \\angle G_K(j\\omega_c)$", m.pm === null ? "–" : f(m.pm, 3) + "°", m.pm !== null]);
    list.push(["$\\omega_\\pi$ (fasi $-180^\\circ$)", m.wpi === null ? "engin" : f(m.wpi, 4) + " rad/s"]);
    list.push(["Mögnunaröryggi $A_m = 1/|G_K(j\\omega_\\pi)|$", m.Am === null ? "–" : f(m.Am, 3) + " (" + f(20 * Math.log10(m.Am), 3) + " dB)"]);
    list.push(["Rístími $t_r \\approx 1{,}4/\\omega_c$", m.wc === null ? "–" : f(1.4 / m.wc, 3) + " s"]);
    if (r.Ld > 0 && m.wc !== null && m.pm !== null && m.pm > 0) {
      list.push(["Mesta seinkun til viðbótar áður en kerfið verður óstöðugt, $\\varphi_m/\\omega_c$", f((m.pm * Math.PI / 180) / m.wc, 3) + " s"]);
    }
    list.push(["Tegund kerfis $N$ (heildunarþættir í $G_K$)", String(r.N)]);
    if (r.N === 0) {
      var kp = r.kconst;
      list.push(["$K_p = G_K(0)$", f(kp, 4)]);
      list.push(["Skekkja við þrep: $1/(1+K_p)$", m.stable === false ? "ekki marktæk (óstöðugt)" : f(100 / (1 + kp), 3) + " %", m.stable !== false]);
      list.push(["Skekkja við flái", m.stable === false ? "ekki marktæk (óstöðugt)" : "∞"]);
    } else if (r.N === 1) {
      list.push(["$K_v = \\lim_{s\\to0} s\\,G_K(s)$", f(r.kconst, 4)]);
      list.push(["Skekkja við þrep", m.stable === false ? "ekki marktæk (óstöðugt)" : "0", m.stable !== false]);
      list.push(["Skekkja við flái $1/K_v$ (fyrir fláa með halla 1)", m.stable === false ? "ekki marktæk (óstöðugt)" : f(1 / r.kconst, 4)]);
    } else if (r.N === 2) {
      list.push(["$K_a = \\lim_{s\\to0} s^2 G_K(s)$", f(r.kconst, 4)]);
      list.push(["Skekkja við þrep og flái", m.stable === false ? "ekki marktæk (óstöðugt)" : "0", m.stable !== false]);
    } else {
      list.push(["Skekkja við þrep og flái", m.stable === false ? "ekki marktæk (óstöðugt)" : "0"]);
    }
    if (r.dist) {
      list.push(["Truflun við $\\omega_v$ = " + f(r.dist.w) + " rad/s: mögnun án afturvirkni $|G_P|$", f(r.dist.without, 4)]);
      list.push(["Með afturvirkni $|G_P/(1+G_K)|$", f(r.dist.withFb, 4), true]);
      list.push(["Deyfing ($|1+G_K|$)", f(r.dist.den, 4)]);
    }
    rows(out, list);
  }

  function drawLoop() {
    if (!last) return;
    var r = last, m = r.m;
    Ctrl.drawBode($("l-bode"), r.bode, { lo: r.lo, hi: r.hi, wc: m.wc, pm: m.pm, wpi: m.wpi, aspect: 0.78 });
    var col = getComputedStyle(document.documentElement).getPropertyValue("--mag").trim();
    var opts = { aspect: 0.62, xmin: 0, xmax: r.tmax, hlines: [1], xlabel: "t [s]" };
    if (r.y === null) {
      opts.ymin = -2; opts.ymax = 2;
      Ctrl.drawLines($("l-step"), [], opts);
      var cv = $("l-step"), g = cv.getContext("2d");
      g.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--bad").trim();
      g.font = "600 14px Archivo, system-ui, sans-serif";
      g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText("Óstöðugt kerfi: svarið vex án takmarka", cv.clientWidth / 2, cv.clientHeight / 2);
      return;
    }
    Ctrl.drawLines($("l-step"), [{ x: r.ts, y: r.y, color: col }], opts);
  }

  function clearCanvas(id) {
    var cv = $(id);
    var g = cv.getContext("2d");
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, cv.width, cv.height);
  }

  function updateLoop() {
    showFields();
    var msg = $("l-msg");
    try {
      last = computeLoop();
      msg.textContent = "";
      msg.className = "result";
      renderLoop(last);
      drawLoop();
    } catch (e) {
      last = null;
      msg.className = "result no";
      msg.textContent = e.message;
      window.renderMath(msg);
      $("l-out").innerHTML = "";
      clearCanvas("l-bode");
      clearCanvas("l-step");
    }
  }

  var LOOP_IDS = ["l-gp", "l-gs", "l-vars", "l-delay", "l-type", "l-k", "l-ti", "l-td", "l-tf", "l-wv", "l-tmax"];
  onInput(LOOP_IDS, updateLoop);

  var PRESETS = {
    hero: { gp: "2.5/((1+2s)(1+0.5s))", type: "P", k: "4" },
    vp: { gp: "2/(s+1)^2", type: "P", k: "3", wv: "0.5" },
    pi: { gp: "1/(s+1)", type: "PI", k: "1", ti: "1" },
    a1: { gp: "1/(s+1)^2", type: "PI", k: "2.2", ti: "5" },
    a2: { gp: "1/(s+1)^2", type: "PI", k: "1.35", ti: "2.1" },
    a3: { gp: "1/(s+1)^2", type: "PI", k: "0.48", ti: "1" },
    pid1: { gp: "1/(s+1)^3", type: "PID", k: "2.5", ti: "2.6", td: "0.65", tf: "0.13" },
    pid2: { gp: "1/(s+1)^3", type: "PID", k: "4", ti: "2.2", td: "0.75", tf: "0.15" },
    delay: { gp: "1/(s+1)", type: "P", k: "3", delay: "0.6" },
    p3: { gp: "1/(s+1)^3", type: "P", k: "2" },
  };
  document.querySelectorAll("#l-presets [data-p]").forEach(function (b) {
    b.addEventListener("click", function () {
      var p = PRESETS[b.getAttribute("data-p")];
      $("l-gp").value = p.gp;
      $("l-gs").value = "1";
      $("l-vars").value = "";
      $("l-delay").value = p.delay || "0";
      $("l-type").value = p.type;
      $("l-k").value = p.k;
      if (p.ti) $("l-ti").value = p.ti;
      if (p.td) $("l-td").value = p.td;
      if (p.tf) $("l-tf").value = p.tf;
      $("l-wv").value = p.wv || "";
      $("l-tmax").value = "";
      updateLoop();
    });
  });

  motor(); sensLin(); sensTime(); sensPot();
  showFields();
  Ctrl.onRedraw($("l-bode"), function () { if (last) drawLoop(); else updateLoop(); });
})();

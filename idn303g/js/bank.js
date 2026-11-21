/* bank.js – spurningabankinn: reiknidæmi (G) með slembitölum og skilningsspurningar (MC).
 * Notaður af æfingasíðunni (quiz.js), köflunum og lokaprófinu (journey.js).
 *
 * Reiknidæmi: G.push(function nafn() { return { topic, title, text, answer, unit, tol, absTol?, sol }; })
 * Skilningsspurning: { topic, q, o: [rétt, rangt, ...], c: 0, e: "skýring" }
 * Efni (topic): likan, laplace, svorun, nemar, hreyflar, stjornkerfi, styringar, vinnuferli */
(function () {
  "use strict";

  /* ---------- Hjálparföll ---------- */
  var rnd = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  var round = function (x, d) { var m = Math.pow(10, d); return Math.round(x * m) / m; };
  var is = function (x, sig) {
    var v = Number(x.toPrecision(sig || 3));
    var s = Math.abs(v) < 1e-3 || Math.abs(v) >= 1e6 ? v.toExponential((sig || 3) - 1) : String(v);
    return s.replace(".", ",");
  };
  var tx = function (x, sig) { return is(x, sig).replace(",", "{,}"); }; // fyrir KaTeX
  var RPM2RAD = (2 * Math.PI) / 60;
  var KF_SI = function (kfk) { return kfk / (1000 * RPM2RAD); }; // V/1000RPM -> V s/rad
  var deg = function (r) { return (r * 180) / Math.PI; };

  /* ---------- Reiknidæmi ---------- */
  var G = [];

  G.push(function sensorOut() {
    var t = pick([
      { lo: 0, hi: 100, ylo: 0, yhi: 5, u: "V" },
      { lo: 0, hi: 150, ylo: 0, yhi: 10, u: "V" },
      { lo: 100, hi: 200, ylo: 4, yhi: 20, u: "mA" },
      { lo: 50, hi: 250, ylo: 4, yhi: 20, u: "mA" },
      { lo: -20, hi: 80, ylo: 0, yhi: 10, u: "V" },
    ]);
    var x = t.lo + Math.round(((t.hi - t.lo) * rnd(1, 9)) / 10 / 5) * 5;
    var y = t.ylo + ((t.yhi - t.ylo) * (x - t.lo)) / (t.hi - t.lo);
    return {
      topic: "nemar",
      title: "Úttak nema",
      text: "Línulegur hitanemi hefur mælisvið $" + t.lo + "$ til $" + t.hi + "\\,^\\circ$C og úttak $" + t.ylo + "$ til $" + t.yhi + "$ " + t.u + ". Hvert er úttakið (í " + t.u + ") í jafnvægi við $" + x + "\\,^\\circ$C?",
      answer: y, unit: t.u, tol: 0.01,
      sol: "<p>Næmni: $S = \\dfrac{" + t.yhi + " - " + t.ylo + "}{" + t.hi + " - " + t.lo + "} = " + tx((t.yhi - t.ylo) / (t.hi - t.lo)) + "$ " + t.u + "/°C.</p><p>$y = y_{min} + S\\,(x - x_{min}) = " + t.ylo + " + " + tx((t.yhi - t.ylo) / (t.hi - t.lo)) + "\\cdot(" + x + " - " + t.lo + ") = " + tx(y) + "$ " + t.u + ".</p>" + (t.u === "mA" ? "<p>Munaðu 4 mA hliðrunina: hún er hluti af úttakinu við neðri mörk mælisviðsins.</p>" : ""),
    };
  });

  G.push(function sensorLin() {
    var hi = pick([100, 120, 150, 200, 250]);
    var p = pick([0.5, 1, 1.5, 2, 2.5, 3]);
    return {
      topic: "nemar",
      title: "Frávik frá línuleika",
      text: "Hitanemi hefur mælisviðið $0$ til $" + hi + "\\,^\\circ$C og frávik frá línuleika $" + tx(p) + "\\,\\%$ (af mælisviði). Hversu mikið er frávikið í °C?",
      answer: (p / 100) * hi, unit: "°C", tol: 0.01,
      sol: "<p>Frávik er gefið sem hlutfall af mælisviði: $\\Delta x_{lin} = " + tx(p / 100) + "\\cdot" + hi + " = " + tx((p / 100) * hi) + "\\,^\\circ$C.</p>",
    };
  });

  G.push(function sensorTime() {
    var tau = pick([2, 2.5, 3, 4, 5, 8, 12]);
    var k = pick([0.5, 1, 1.5, 2, 2.5, 3]);
    var dx = pick([20, 40, 50, 60, 80]);
    var t = round(k * tau, 2);
    var y = dx * (1 - Math.exp(-t / tau));
    return {
      topic: "nemar",
      title: "Tímasvörun nema",
      text: "Nemi er fyrstu gerðar með tímastuðul $\\tau = " + tx(tau) + "$ s og næmni 1 (úttakið er í sömu einingum og inntakið). Hitinn hækkar skyndilega um $" + dx + "\\,^\\circ$C. Hversu mikið hefur nemanum skilað eftir $t = " + tx(t) + "$ s (í °C)?",
      answer: y, unit: "°C", tol: 0.015,
      sol: "<p>Þrepasvörun fyrstu gerðar kerfis: $y(t) = \\Delta x\\,(1 - e^{-t/\\tau})$.</p><p>$y = " + dx + "\\,(1 - e^{-" + tx(t) + "/" + tx(tau) + "}) = " + dx + "\\cdot" + tx(1 - Math.exp(-t / tau), 3) + " = " + tx(y) + "\\,^\\circ$C.</p>",
    };
  });

  G.push(function strain() {
    var R = pick([100, 120, 350]);
    var g = pick([2, 2.1, 2.5]);
    var eps = pick([0.0005, 0.001, 0.002]);
    return {
      topic: "nemar",
      title: "Álagsnemi",
      text: "Álagsnemi hefur viðnám $R = " + R + "\\ \\Omega$ og næmnistuðul $G = " + tx(g) + "$. Hver er breytingin á viðnámi í $\\Omega$ þegar aflögunin er $\\varepsilon = " + tx(eps) + "$?",
      answer: R * g * eps, unit: "Ω", tol: 0.02,
      sol: "<p>$\\Delta R / R = G\\,\\varepsilon \\Rightarrow \\Delta R = R\\,G\\,\\varepsilon = " + R + "\\cdot" + tx(g) + "\\cdot" + tx(eps) + " = " + tx(R * g * eps) + "\\ \\Omega$.</p>",
    };
  });

  G.push(function encoder() {
    var N = pick([40, 60, 72, 100, 120]);
    var r = pick([5, 8, 10, 12]);
    var res = ((2 * Math.PI * r) / N) * 10;
    return {
      topic: "nemar",
      title: "Upplausn kóðaskífu",
      text: "Á kóðaskífu eru $" + N + "$ raufar og radíus hennar er $" + r + "$ cm. Hver er upplausnin við jaðarinn í mm?",
      answer: res, unit: "mm", tol: 0.02,
      sol: "<p>Upplausn = ummál / fjöldi raufa $= \\dfrac{2\\pi r}{N} = \\dfrac{2\\pi\\cdot" + (r * 10) + "\\ \\mathrm{mm}}{" + N + "} = " + tx(res) + "$ mm.</p>",
    };
  });

  G.push(function potError() {
    var Vs = pick([2, 4, 5, 10]);
    var Rp = pick([200, 500, 1000]);
    var RL = pick([5000, 10000, 20000, 100000]);
    var x = pick([0.3, 0.5, 0.6]);
    var e = Vs * (Rp / RL) * (x * x - x * x * x) * 1000;
    return {
      topic: "nemar",
      title: "Álagsskekkja stillivíðnáms",
      text: "Stillivíðnám með heildarviðnám $R_P = " + Rp + "\\ \\Omega$ og fæðispennu $V_s = " + Vs + "$ V er tengt tölvu með innviðnám $R_L = " + (RL / 1000) + "\\ \\mathrm{k}\\Omega$. Hver er skekkjan í mælingu (í mV) þegar sleðinn er í stöðu $x = " + tx(x) + "$? Notaðu $e = V_s\\frac{R_P}{R_L}(x^2 - x^3)$.",
      answer: e, unit: "mV", tol: 0.02,
      sol: "<p>$e = " + Vs + "\\cdot\\dfrac{" + Rp + "}{" + RL + "}\\,(" + tx(x * x, 3) + " - " + tx(x * x * x, 3) + ") = " + tx(e / 1000, 3) + "$ V $= " + tx(e) + "$ mV.</p>",
    };
  });

  function motorParams() {
    return {
      kt: pick([0.05, 0.08, 0.1, 0.12, 0.15, 0.18]),
      R: pick([0.8, 1, 1.25, 1.5, 2, 2.25, 3]),
      kfk: pick([5, 8, 10, 11, 12, 14]),
      va: pick([5, 6, 9, 12, 15, 24]),
    };
  }

  G.push(function motorStall() {
    var m = motorParams();
    var ts = (m.kt / m.R) * m.va;
    return {
      topic: "hreyflar",
      title: "Upphafsvægi",
      text: "Jafnstraumshreyfill: $K_\\tau = " + tx(m.kt) + "$ Nm/A, $R = " + tx(m.R) + "\\ \\Omega$, $K_f = " + m.kfk + "$ V/1000 RPM. Hvert er upphafsvægið (í Nm) við inngangsspennu $" + m.va + "$ V?",
      answer: ts, unit: "Nm", tol: 0.01,
      sol: "<p>Í kyrrstöðu er engin bakspenna, svo $i = v_a/R$ og $\\tau_s = \\dfrac{K_\\tau}{R}v_a = \\dfrac{" + tx(m.kt) + "}{" + tx(m.R) + "}\\cdot" + m.va + " = " + tx(ts) + "$ Nm.</p>",
    };
  });

  G.push(function motorNoLoad() {
    var m = motorParams();
    var n0 = (m.va / m.kfk) * 1000;
    return {
      topic: "hreyflar",
      title: "Lausagangshraði",
      text: "Jafnstraumshreyfill með $K_f = " + m.kfk + "$ V/1000 RPM, $R = " + tx(m.R) + "\\ \\Omega$ og $K_\\tau = " + tx(m.kt) + "$ Nm/A. Hver er snúningshraðinn í lausagangi (í RPM) við $" + m.va + "$ V?",
      answer: n0, unit: "RPM", tol: 0.01,
      sol: "<p>Í lausagangi er $\\tau = 0$, svo $i = 0$ og $v_a = K_f\\omega_0$. Með $K_f$ í V/1000 RPM: $n_0 = \\dfrac{" + m.va + "}{" + m.kfk + "}\\cdot1000 = " + tx(n0) + "$ RPM.</p><p>(Viðnám og $K_\\tau$ koma ekki við sögu.)</p>",
    };
  });

  G.push(function motorPmax() {
    var m = motorParams();
    var ts = (m.kt / m.R) * m.va;
    var n0 = (m.va / m.kfk) * 1000;
    var w0 = n0 * RPM2RAD;
    var P = (ts * w0) / 4;
    return {
      topic: "hreyflar",
      title: "Hámarksafl",
      text: "Jafnstraumshreyfill: $K_\\tau = " + tx(m.kt) + "$ Nm/A, $K_f = " + m.kfk + "$ V/1000 RPM, $R = " + tx(m.R) + "\\ \\Omega$. Hvert er hámarks vélrænt afl (í W) við inngangsspennu $" + m.va + "$ V?",
      answer: P, unit: "W", tol: 0.015,
      sol: "<p>$\\tau_s = \\dfrac{K_\\tau}{R}v_a = " + tx(ts) + "$ Nm. $n_0 = " + tx(n0) + "$ RPM $\\Rightarrow \\omega_0 = " + tx(w0) + "$ rad/s.</p><p>Hámarksafl er við $\\omega_0/2$ og $\\tau_s/2$: $P_{max} = \\dfrac{\\tau_s\\omega_0}{4} = \\dfrac{" + tx(ts) + "\\cdot" + tx(w0) + "}{4} = " + tx(P) + "$ W.</p>",
    };
  });

  G.push(function motorLoad() {
    var m = motorParams();
    var ts = (m.kt / m.R) * m.va;
    var n0 = (m.va / m.kfk) * 1000;
    var frac = pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75]);
    var tl = round(ts * frac, 3);
    var n = n0 * (1 - tl / ts);
    return {
      topic: "hreyflar",
      title: "Hraði undir álagi",
      text: "Jafnstraumshreyfill með $K_\\tau = " + tx(m.kt) + "$ Nm/A, $R = " + tx(m.R) + "\\ \\Omega$, $K_f = " + m.kfk + "$ V/1000 RPM knýr álag sem krefst vægis $" + tx(tl) + "$ Nm í jafnvægi. Hver er snúningshraðinn (RPM) við $" + m.va + "$ V?",
      answer: n, unit: "RPM", tol: 0.02,
      sol: "<p>$\\tau_s = " + tx(ts) + "$ Nm og $n_0 = " + tx(n0) + "$ RPM. Vægið er línulegt í hraða: $\\tau = \\tau_s\\,(1 - n/n_0)$.</p><p>$n = n_0\\,(1 - \\tau/\\tau_s) = " + tx(n0) + "\\,(1 - " + tx(tl) + "/" + tx(ts) + ") = " + tx(n) + "$ RPM.</p>",
    };
  });

  G.push(function motorTe() {
    var L = pick([1, 2, 2.5, 3, 5, 10]);
    var R = pick([1.2, 1.5, 2, 2.25, 3, 4]);
    var te = (L / R);
    return {
      topic: "hreyflar",
      title: "Rafrænn tímastuðull",
      text: "Jafnstraumshreyfill hefur span $L = " + tx(L) + "$ mH og viðnám $R = " + tx(R) + "\\ \\Omega$. Eftir hve langan tíma (í ms) eru bein áhrif inngangsspennunnar á vægið komin í um 98 % af lokagildi ($4\\tau_e$)?",
      answer: 4 * te, unit: "ms", tol: 0.02,
      sol: "<p>Bein áhrif spennu á vægi: $\\dfrac{K_\\tau/R}{\\tau_e s + 1}$ með $\\tau_e = L/R = \\dfrac{" + tx(L) + "\\ \\mathrm{mH}}{" + tx(R) + "\\ \\Omega} = " + tx(te) + "$ ms.</p><p>$4\\tau_e = " + tx(4 * te) + "$ ms.</p>",
    };
  });

  G.push(function motorSpeedErr() {
    var kt = pick([0.12, 0.15, 0.18]);
    var R = pick([1, 1.25, 1.5, 2]);
    var c = pick([0.3, 0.5, 0.8]);
    var kfk = pick([9, 10, 11, 12]);
    var K = pick([5, 10, 20]);
    var dr = pick([5, 10, 20]);
    var kf = KF_SI(kfk);
    var gp0 = (kt / R) / (c + (kt * kf) / R);
    var ess = dr / (1 + K * gp0);
    return {
      topic: "hreyflar",
      title: "Skekkja í hraðastýringu",
      text: "Hreyfill: $K_\\tau = " + tx(kt) + "$ Nm/A, $K_f = " + kfk + "$ V/1000 RPM, $R = " + tx(R) + "\\ \\Omega$, deyfing $c = " + tx(c) + "$ Nms/rad, $L \\approx 0$. P-stýring með $K = " + K + "$ stýrir hraðanum (nemi með $G_S = 1$). Hver er skekkjan í jafnvægi (rad/s) við þrepabreytingu í óskgildi upp á $" + dr + "$ rad/s?",
      answer: ess, unit: "rad/s", tol: 0.02,
      sol: "<p>Breyttu $K_f$ í SI: $" + kfk + "/(1000\\cdot2\\pi/60) = " + tx(kf, 4) + "$ V·s/rad.</p><p>$G_P(0) = \\dfrac{K_\\tau/R}{c + K_\\tau K_f/R} = \\dfrac{" + tx(kt / R, 4) + "}{" + tx(c + (kt * kf) / R, 4) + "} = " + tx(gp0, 4) + "$.</p><p>Tegund 0: $e_{ss} = \\dfrac{\\Delta r}{1 + K\\,G_P(0)} = \\dfrac{" + dr + "}{1 + " + K + "\\cdot" + tx(gp0, 4) + "} = " + tx(ess) + "$ rad/s.</p>",
    };
  });

  G.push(function gearIeff() {
    var I1 = pick([0.001, 0.002, 0.005, 0.01]);
    var I2 = pick([0.1, 0.2, 0.5, 1]);
    var N = pick([2, 5, 10, 20]);
    var Ie = I1 + I2 / (N * N);
    return {
      topic: "hreyflar",
      title: "Gír: heildartregða",
      text: "Hreyfill (tregða $I_1 = " + tx(I1) + "$ kg·m²) knýr álag með tregðu $I_2 = " + tx(I2) + "$ kg·m² í gegnum gír með hlutfallið $N = " + N + "$ ($\\omega_2 = \\omega_1/N$). Hver er heildartregðan $I_{eff}$ séð frá hreyfilsásnum (kg·m²)?",
      answer: Ie, unit: "kg·m²", tol: 0.02,
      sol: "<p>$I_{eff} = I_1 + \\dfrac{I_2}{N^2} = " + tx(I1) + " + \\dfrac{" + tx(I2) + "}{" + (N * N) + "} = " + tx(Ie, 4) + "$ kg·m².</p>",
    };
  });

  G.push(function liftAccel() {
    var m = pick([5, 8, 10, 15, 20]);
    var r = pick([0.1, 0.15, 0.2]);
    var tn = pick([1, 1.5, 2, 3]);
    var ts = Math.ceil((tn + 9.81 * m * r) * (1.3 + Math.random() * 0.8) * 10) / 10;
    var a = (ts - tn - 9.81 * m * r) / r / m;
    return {
      topic: "hreyflar",
      title: "Hreyfill lyftir hlut",
      text: "Hreyfill með upphafsvægi $" + tx(ts) + "$ Nm snýr trissu með radíus $" + tx(r) + "$ m og lyftir $" + m + "$ kg hlut. Núningsvægi í trissunni er $" + tx(tn) + "$ Nm. Hver er upphafshröðun hlutarins (m/s²)? Tregða er hverfandi, $g = 9{,}81$ m/s².",
      answer: a, unit: "m/s²", tol: 0.02,
      sol: "<p>Nettó vægi: $\\tau_\\alpha = \\tau_s - \\tau_n - m g r = " + tx(ts) + " - " + tx(tn) + " - " + tx(9.81 * m * r) + " = " + tx(ts - tn - 9.81 * m * r) + "$ Nm.</p><p>$F = \\tau_\\alpha/r = " + tx((ts - tn - 9.81 * m * r) / r) + "$ N, $a = F/m = " + tx(a) + "$ m/s².</p>",
    };
  });

  G.push(function distNoFb() {
    var tau = pick([5, 10, 15, 20]);
    var T = pick([2, 3, 4.5, 6, 8]);
    var A = pick([1, 2, 5]);
    var w = (2 * Math.PI) / T;
    var amp = A / Math.sqrt(1 + Math.pow(tau * w, 2));
    return {
      topic: "stjornkerfi",
      title: "Sínustruflun án afturvirkni",
      text: "Hitastig inn í tank er sínusbylgja með útslag $" + A + "\\,^\\circ$C og sveiflutíma $T = " + tx(T) + "$ mín. Tankurinn hefur yfirfærslufallið $G_P = \\dfrac{1}{1+" + tau + "s}$ (tími í mín.). Hvert er útslagið á úttaki (°C) án afturvirkni?",
      answer: amp, unit: "°C", tol: 0.02,
      sol: "<p>$\\omega = 2\\pi/T = " + tx(w) + "$ rad/mín. $|G_P(j\\omega)| = \\dfrac{1}{\\sqrt{1 + (" + tau + "\\omega)^2}} = " + tx(1 / Math.sqrt(1 + Math.pow(tau * w, 2)), 4) + "$.</p><p>Útslag úttaks $= " + A + "\\cdot" + tx(1 / Math.sqrt(1 + Math.pow(tau * w, 2)), 4) + " = " + tx(amp) + "\\,^\\circ$C.</p>",
    };
  });

  G.push(function distFb() {
    var tau = pick([5, 10, 15, 20]);
    var T = pick([2, 3, 4.5, 6, 8]);
    var A = pick([1, 2, 5]);
    var g = pick([5, 10, 25, 50]);
    var w = (2 * Math.PI) / T;
    var mag = 1 / Math.hypot(1 + g, tau * w);
    var no = 1 / Math.sqrt(1 + Math.pow(tau * w, 2));
    return {
      topic: "stjornkerfi",
      title: "Sínustruflun með afturvirkni",
      text: "Sama tank og áður, $G_P = \\dfrac{1}{1+" + tau + "s}$, en nú með afturvirkni og P-stýringu þannig að lykkjan er $G_K = \\dfrac{" + g + "}{1+" + tau + "s}$. Truflunin kemur inn á undan tankinum, útslag $" + A + "\\,^\\circ$C og sveiflutími $T = " + tx(T) + "$ mín. Hvert er útslagið á úttaki (°C) með afturvirkni?",
      answer: A * mag, unit: "°C", tol: 0.02,
      sol: "<p>$\\omega = 2\\pi/T = " + tx(w) + "$ rad/mín. $G_{VY} = \\dfrac{G_P}{1+G_K} = \\dfrac{1}{1+" + g + " + " + tau + "s}$.</p><p>$|G_{VY}(j\\omega)| = \\dfrac{1}{\\sqrt{" + (1 + g) + "^2 + (" + tau + "\\cdot" + tx(w) + ")^2}} = " + tx(mag, 4) + "$.</p><p>Útslag: $" + A + "\\cdot" + tx(mag, 4) + " = " + tx(A * mag) + "\\,^\\circ$C. Án afturvirkni væri það $" + tx(A * no) + "\\,^\\circ$C.</p>",
    };
  });

  G.push(function dist2nd() {
    var g = pick([1, 2, 3, 4]);
    var K = pick([1, 1.5, 2, 3, 4]);
    var gp = g / 2;
    var mag = gp / Math.sqrt(1 + Math.pow(K * gp, 2));
    return {
      topic: "stjornkerfi",
      title: "Truflun við $\\omega = 1$ rad/s",
      text: "Ferlið er $G_P = \\dfrac{" + g + "}{(s+1)^2}$, $G_S = 1$, með P-stýringu $G_C = " + tx(K) + "$. Truflun $v$ kemur inn á milli stýringar og ferlis og er sínusbylgja með $\\omega = 1$ rad/s. Hver er mögnun truflunarinnar, $|G_P/(1+G_K)|$, við þessa tíðni?",
      answer: mag, unit: "", tol: 0.02,
      sol: "<p>$G_P(j) = \\dfrac{" + g + "}{(1+j)^2} = \\dfrac{" + g + "}{2j} = -" + tx(gp) + "\\,j$, svo $G_K(j) = -" + tx(K * gp) + "\\,j$.</p><p>$|1 + G_K| = \\sqrt{1 + " + tx(K * gp) + "^2} = " + tx(Math.sqrt(1 + Math.pow(K * gp, 2)), 4) + "$ og $|G_{VY}| = \\dfrac{" + tx(gp) + "}{" + tx(Math.sqrt(1 + Math.pow(K * gp, 2)), 4) + "} = " + tx(mag, 4) + "$.</p>",
    };
  });

  G.push(function essStep() {
    var kp0 = pick([0.5, 1, 2, 3, 5, 10]);
    var K = pick([2, 4, 5, 8, 10, 20]);
    var Kp = kp0 * K;
    return {
      topic: "stjornkerfi",
      title: "Skekkja í jafnvægi (þrep)",
      text: "Lykkjan er $G_K = \\dfrac{" + tx(Kp) + "}{1 + 3s}$ (tegund 0, $G_S = 1$). Hver er skekkjan í jafnvægi (í % af þrepinu) við þrepabreytingu í óskgildi?",
      answer: 100 / (1 + Kp), unit: "%", tol: 0.02,
      sol: "<p>$K_p = G_K(0) = " + tx(Kp) + "$. $e_{ss} = \\dfrac{1}{1+K_p} = \\dfrac{1}{" + tx(1 + Kp) + "} = " + tx(1 / (1 + Kp), 4) + " = " + tx(100 / (1 + Kp)) + "\\,\\%$.</p>",
    };
  });

  G.push(function essK() {
    var kp0 = pick([0.5, 1, 2, 2.5, 5]);
    var p = pick([1, 2, 5, 10]);
    var K = (100 / p - 1) / kp0;
    return {
      topic: "stjornkerfi",
      title: "Hversu hátt þarf $K$ að vera?",
      text: "Ferlið hefur jafnvægismögnun $G_P(0) = " + tx(kp0) + "$, $G_S = 1$ og P-stýring $G_C = K$ er notuð. Hversu hátt þarf $K$ að vera til að skekkjan í jafnvægi við þrepabreytingu í óskgildi sé $" + p + "\\,\\%$?",
      answer: K, unit: "", tol: 0.02,
      sol: "<p>$e_{ss} = \\dfrac{1}{1+K\\,G_P(0)} = " + tx(p / 100, 3) + " \\Rightarrow 1 + K\\cdot" + tx(kp0) + " = " + tx(100 / p) + "$.</p><p>$K = \\dfrac{" + tx(100 / p - 1) + "}{" + tx(kp0) + "} = " + tx(K) + "$.</p>",
    };
  });

  G.push(function essRamp() {
    var K = pick([2, 4, 5, 10, 20]);
    var tau = pick([0.5, 1, 2]);
    var a = pick([1, 2, 5, 10]);
    return {
      topic: "stjornkerfi",
      title: "Skekkja við fláa",
      text: "Lykkjan er $G_K = \\dfrac{" + K + "}{s(" + tx(tau) + "s+1)}$ og óskgildið er flái $r(t) = " + a + "\\,t$. Hver er skekkjan í jafnvægi?",
      answer: a / K, unit: "", tol: 0.02,
      sol: "<p>$G_K$ hefur einn heildunarþátt, svo hún er tegund 1. $K_v = \\lim_{s\\to0} s\\,G_K(s) = " + K + "$.</p><p>$e_{ss} = \\dfrac{a}{K_v} = \\dfrac{" + a + "}{" + K + "} = " + tx(a / K, 4) + "$.</p>",
    };
  });

  G.push(function phaseMargin() {
    var TI = pick([0.5, 1, 2, 3]);
    var a = pick([0.5, 1, 2]);
    var b = pick([0.1, 0.2, 0.25]);
    var wc = pick([1.5, 2, 3, 4, 5]);
    var ph = deg(Math.atan(wc * TI)) - 90 - deg(Math.atan(a * wc)) - deg(Math.atan(b * wc));
    return {
      topic: "stjornkerfi",
      title: "Fasaöryggi PI-stýringar",
      text: "PI-stýring $G_C = K\\left(1+\\dfrac{1}{" + tx(TI) + "s}\\right)$ stýrir ferlinu $G_P = \\dfrac{1}{(" + tx(a) + "s+1)(" + tx(b) + "s+1)}$, $G_S = 1$. Gefið er að skurðtíðni lykkjunnar sé $\\omega_c = " + tx(wc) + "$ rad/s. Hvert er fasaöryggið (í gráðum)?",
      answer: 180 + ph, unit: "°", tol: 0.02, absTol: 1.5,
      sol: "<p>Fasi lykkjunnar: $\\angle G_K = \\arctan(T_I\\omega) - 90^\\circ - \\arctan(" + tx(a) + "\\omega) - \\arctan(" + tx(b) + "\\omega)$.</p><p>Við $\\omega_c = " + tx(wc) + "$: $" + tx(deg(Math.atan(wc * TI)), 4) + "^\\circ - 90^\\circ - " + tx(deg(Math.atan(a * wc)), 4) + "^\\circ - " + tx(deg(Math.atan(b * wc)), 4) + "^\\circ = " + tx(ph, 4) + "^\\circ$.</p><p>$\\varphi_m = 180^\\circ + \\angle G_K(j\\omega_c) = " + tx(180 + ph, 4) + "^\\circ$.</p>",
    };
  });

  G.push(function delayLmax() {
    var K = pick([2, 3, 4, 5]);
    var tau = pick([0.5, 1, 2]);
    var both = Math.random() < 0.5;
    var wc = Math.sqrt(K * K - 1) / tau;
    var pm0 = Math.PI - Math.atan(wc * tau);
    var L = both ? pm0 / (2 * wc) : pm0 / wc;
    return {
      topic: "stjornkerfi",
      title: "Mesta leyfileg seinkun",
      text: both
        ? "P-stýring með $K = " + K + "$ stýrir ferli $\\dfrac{1}{" + tx(tau) + "s+1}$ í gegnum samband með seinkun $L$ í <b>hvora átt</b> (heildarseinkun $2L$ í lykkjunni). Hvert er hæsta gildi $L$ (í s) áður en kerfið verður óstöðugt?"
        : "Lykkjan er $G_K = \\dfrac{" + K + "\\,e^{-Ls}}{" + tx(tau) + "s+1}$. Hvert er hæsta gildi seinkunar $L$ (í s) áður en kerfið verður óstöðugt?",
      answer: L, unit: "s", tol: 0.02,
      sol: "<p>Seinkun breytir ekki mögnuninni. $|G_K| = \\dfrac{" + K + "}{\\sqrt{1+" + tx(tau * tau) + "\\omega_c^2}} = 1 \\Rightarrow \\omega_c = \\dfrac{\\sqrt{" + K + "^2-1}}{" + tx(tau) + "} = " + tx(wc, 4) + "$ rad/s.</p><p>Fasaöryggi án seinkunar: $\\varphi_{m,0} = \\pi - \\arctan(\\omega_c\\tau) = " + tx(pm0, 4) + "$ rad.</p><p>Mörk: $\\varphi_{m,0} = " + (both ? "2L" : "L") + "\\,\\omega_c \\Rightarrow L = \\dfrac{" + tx(pm0, 4) + "}{" + (both ? "2\\cdot" : "") + tx(wc, 4) + "} = " + tx(L, 4) + "$ s.</p>",
    };
  });

  G.push(function gainMargin() {
    var K = pick([1, 2, 2.5, 3, 4]);
    return {
      topic: "stjornkerfi",
      title: "Mögnunaröryggi",
      text: "Lykkjan er $G_K = \\dfrac{" + tx(K) + "}{(s+1)^3}$. Fasinn er $-180^\\circ$ við $\\omega_\\pi = \\sqrt3$ rad/s. Hvert er mögnunaröryggið $A_m$?",
      answer: 8 / K, unit: "", tol: 0.02,
      sol: "<p>$|G_K(j\\sqrt3)| = \\dfrac{" + tx(K) + "}{(\\sqrt{1+3})^3} = \\dfrac{" + tx(K) + "}{8} = " + tx(K / 8, 4) + "$.</p><p>$A_m = 1/|G_K(j\\omega_\\pi)| = " + tx(8 / K, 4) + "$ (" + tx(20 * Math.log10(8 / K), 3) + " dB).</p>",
    };
  });

  G.push(function dbConvert() {
    var mg = pick([0.5, 0.4, 0.25, 0.2, 0.1, 0.05]);
    return {
      topic: "stjornkerfi",
      title: "Mögnunaröryggi í dB",
      text: "Mögnun lykkjunnar við $\\omega_\\pi$ er $|G_K(j\\omega_\\pi)| = " + tx(mg) + "$. Hvert er mögnunaröryggið í dB?",
      answer: -20 * Math.log10(mg), unit: "dB", tol: 0.02,
      sol: "<p>$A_m = 1/" + tx(mg) + " = " + tx(1 / mg) + "$, svo $A_m[\\mathrm{dB}] = 20\\log_{10}(" + tx(1 / mg) + ") = " + tx(-20 * Math.log10(mg), 4) + "$ dB.</p>",
    };
  });

  G.push(function trFromWc() {
    var wc = pick([0.8, 1.08, 1.54, 2, 2.85, 4.2, 11.2]);
    return {
      topic: "stjornkerfi",
      title: "Rístími",
      text: "Skurðtíðni lykkjunnar er $\\omega_c = " + tx(wc) + "$ rad/s. Hver er rístími heildarkerfisins (í s) samkvæmt þumalputtareglunni?",
      answer: 1.4 / wc, unit: "s", tol: 0.02,
      sol: "<p>$t_r \\approx \\dfrac{1{,}4}{\\omega_c} = \\dfrac{1{,}4}{" + tx(wc) + "} = " + tx(1.4 / wc) + "$ s.</p>",
    };
  });

  G.push(function pidHF() {
    var K = pick([1.5, 2, 2.5, 4, 5]);
    var TD = pick([0.3, 0.45, 0.65, 0.75, 1]);
    var f = pick([0.2, 0.25, 0.3, 0.4]);
    return {
      topic: "styringar",
      title: "Hátíðnimögnun PID",
      text: "PID-stýring $G_C = K\\dfrac{1+T_Is}{T_Is}\\dfrac{1+T_Ds}{1+T_Fs}$ með $K = " + tx(K) + "$, $T_D = " + tx(TD) + "$ og $T_F = " + tx(f) + "\\,T_D$. Hver er mögnun stýringarinnar þegar $\\omega\\to\\infty$?",
      answer: K / f, unit: "", tol: 0.02,
      sol: "<p>Þegar $\\omega\\to\\infty$: $\\dfrac{1+T_Is}{T_Is}\\to1$ og $\\dfrac{1+T_Ds}{1+T_Fs}\\to\\dfrac{T_D}{T_F}$, svo $|G_C|\\to K\\dfrac{T_D}{T_F} = \\dfrac{" + tx(K) + "}{" + tx(f) + "} = " + tx(K / f) + "$.</p>",
    };
  });

  G.push(function piTi() {
    var wc = pick([1.2, 1.5, 2.15, 3, 4]);
    return {
      topic: "styringar",
      title: "Val á $T_I$",
      text: "Við hönnun PI-stýringar er skurðtíðni $K\\,G_P$ valin $\\omega_c = " + tx(wc) + "$ rad/s. Notaðu reglu kennarans $\\omega_I = 0{,}2\\,\\omega_c$. Hvað verður $T_I$ (í s)?",
      answer: 1 / (0.2 * wc), unit: "s", tol: 0.02,
      sol: "<p>$\\omega_I = 1/T_I = 0{,}2\\cdot" + tx(wc) + " = " + tx(0.2 * wc, 3) + "$ rad/s, svo $T_I = " + tx(1 / (0.2 * wc)) + "$ s.</p>",
    };
  });

  G.push(function pdTd() {
    var wpi = pick([1.5, 2.24, 3, 4]);
    return {
      topic: "styringar",
      title: "Val á $T_D$",
      text: "Ferlið hefur $\\omega_\\pi = " + tx(wpi) + "$ rad/s. Þú velur horntíðni PD-stýringar $\\omega_D = \\omega_\\pi$. Hvað verður $T_D$ (í s)?",
      answer: 1 / wpi, unit: "s", tol: 0.02,
      sol: "<p>Reglan er $0{,}8\\omega_\\pi < \\omega_D < 1{,}5\\omega_\\pi$. Með $\\omega_D = 1/T_D = " + tx(wpi) + "$ fæst $T_D = " + tx(1 / wpi) + "$ s.</p>",
    };
  });

  /* ---------- Líkanagerð og svörun kerfa (fyrri hluti) ---------- */
  G.push(function firstOrderKT() {
    var a = pick([1, 2, 3, 4, 5, 8, 10]), b = pick([1, 2, 4, 5, 10]), c = pick([1, 2, 3, 5]);
    var ask = pick(["K", "tau"]);
    var K = c / b, tau = a / b;
    return {
      topic: "svorun",
      title: ask === "K" ? "Jafnvægisgildi fyrstu gerðar kerfis" : "Tímastuðull fyrstu gerðar kerfis",
      text: "Kerfi er lýst með $" + a + "y' + " + b + "y = " + (c === 1 ? "" : c) + "u$. Hvert er " + (ask === "K" ? "jafnvægisgildi svörunarinnar við einingarþrepi ($K$)?" : "tímastuðullinn $\\tau$ (í s)?"),
      answer: ask === "K" ? K : tau, unit: ask === "K" ? "" : "s", tol: 0.01,
      sol: "<p>Laplace: $G(s) = \\dfrac{" + c + "}{" + a + "s + " + b + "} = \\dfrac{" + tx(K) + "}{" + tx(tau) + "s + 1}$ (deila í gegn með " + b + ").</p><p>Staðalform $\\dfrac{K}{\\tau s+1}$: $K = " + tx(K) + "$ og $\\tau = " + tx(tau) + "$ s.</p>",
    };
  });

  G.push(function secondOrder() {
    // undirdempað: veljum zeta og wn svo stuðlar verði snyrtilegir
    var c = pick([
      { a1: 2, a2: 2 }, { a1: 2, a2: 5 }, { a1: 4, a2: 8 }, { a1: 1, a2: 4 }, { a1: 2, a2: 10 },
      { a1: 3, a2: 9 }, { a1: 4, a2: 13 }, { a1: 6, a2: 25 }, { a1: 1, a2: 1 }, { a1: 2, a2: 4 },
    ]);
    var b = pick([1, 2, 4, 5, 10]);
    var wn = Math.sqrt(c.a2), z = c.a1 / (2 * wn), wd = wn * Math.sqrt(1 - z * z);
    var Tp = Math.PI / wd, Mp = 100 * Math.exp((-z * Math.PI) / Math.sqrt(1 - z * z)), tau = 1 / (z * wn), K = b / c.a2;
    var q = pick([
      { k: "z", t: "dempunarhlutfallið $\\zeta$", v: z, u: "" },
      { k: "wn", t: "náttúrulega tíðnin $\\omega_n$ (rad/s)", v: wn, u: "rad/s" },
      { k: "Tp", t: "tími hæsta yfirskots $T_p$ (s)", v: Tp, u: "s" },
      { k: "Mp", t: "hæsta yfirskot sem hlutfall af jafnvægisgildi (%)", v: Mp, u: "%" },
      { k: "tau", t: "tímastuðullinn $\\tau = 1/(\\zeta\\omega_n)$ (s)", v: tau, u: "s" },
      { k: "K", t: "jafnvægisgildi svörunar við einingarþrepi", v: K, u: "" },
    ]);
    return {
      topic: "svorun",
      title: "Annarrar gerðar kerfi",
      text: "Kerfi er lýst með $y'' + " + (c.a1 === 1 ? "" : c.a1) + "y' + " + c.a2 + "y = " + (b === 1 ? "" : b) + "u$ og er í hvíld í upphafi. Hvert er " + q.t + "?",
      answer: q.v, unit: q.u, tol: 0.015,
      sol: "<p>$G(s) = \\dfrac{" + b + "}{s^2 + " + (c.a1 === 1 ? "" : c.a1) + "s + " + c.a2 + "}$, borið saman við $\\dfrac{K\\omega_n^2}{s^2 + 2\\zeta\\omega_ns + \\omega_n^2}$:</p>" +
        "<p>$\\omega_n = \\sqrt{" + c.a2 + "} = " + tx(wn) + "$ rad/s, $\\zeta = \\dfrac{" + c.a1 + "}{2\\cdot" + tx(wn) + "} = " + tx(z) + "$, $K = " + b + "/" + c.a2 + " = " + tx(K) + "$.</p>" +
        "<p>$\\omega_d = \\omega_n\\sqrt{1-\\zeta^2} = " + tx(wd) + "$ rad/s, $T_p = \\pi/\\omega_d = " + tx(Tp) + "$ s, $M_p = e^{-\\zeta\\pi/\\sqrt{1-\\zeta^2}} = " + tx(Mp) + "\\,\\%$, $\\tau = 1/(\\zeta\\omega_n) = " + tx(tau) + "$ s.</p>",
    };
  });

  G.push(function stepAtTime() {
    var K = pick([0.5, 1, 2, 4, 5]), tau = pick([0.2, 0.5, 1, 2, 5, 10]), k = pick([0.5, 1, 2, 3]);
    var t = round(k * tau, 3), y = K * (1 - Math.exp(-t / tau));
    return {
      topic: "svorun",
      title: "Þrepasvörun fyrstu gerðar",
      text: "Kerfi hefur yfirfærslufallið $G(s) = \\dfrac{" + tx(K) + "}{" + tx(tau) + "s + 1}$. Hvert er úttakið $t = " + tx(t) + "$ s eftir einingarþrep í inntaki?",
      answer: y, unit: "", tol: 0.015,
      sol: "<p>$y(t) = K(1 - e^{-t/\\tau}) = " + tx(K) + "\\,(1 - e^{-" + tx(t) + "/" + tx(tau) + "}) = " + tx(K) + "\\cdot" + tx(1 - Math.exp(-t / tau)) + " = " + tx(y) + "$.</p>",
    };
  });

  G.push(function finalValue() {
    var b0 = pick([1, 2, 3, 4, 5]), a1 = pick([2, 3, 4, 5, 6]), a0 = pick([2, 4, 5, 8, 10]), A = pick([1, 2, 3, 5]);
    var v = (A * b0) / a0;
    return {
      topic: "laplace",
      title: "Lokagildisreglan",
      text: "Stöðugt kerfi hefur $G(s) = \\dfrac{" + b0 + "}{s^2 + " + a1 + "s + " + a0 + "}$. Inntakið er þrep með stærð $" + A + "$. Hvert er lokagildi úttaksins?",
      answer: v, unit: "", tol: 0.01,
      sol: "<p>$\\lim_{t\\to\\infty} y(t) = \\lim_{s\\to0} s\\,G(s)\\,\\dfrac{" + A + "}{s} = " + A + "\\,G(0) = " + A + "\\cdot\\dfrac{" + b0 + "}{" + a0 + "} = " + tx(v) + "$.</p>",
    };
  });

  G.push(function freqFirst() {
    var K = pick([1, 2, 5, 10]), tau = pick([0.1, 0.5, 1, 2, 5]), w = pick([0.2, 0.5, 1, 2, 4, 10]);
    var m = K / Math.sqrt(1 + tau * tau * w * w), ph = -deg(Math.atan(tau * w));
    var ask = pick(["m", "ph"]);
    return {
      topic: "svorun",
      title: ask === "m" ? "Tíðnisvörun: mögnun" : "Tíðnisvörun: fasi",
      text: "Inntakið $u = \\sin(" + tx(w) + "t)$ fer í kerfið $G(s) = \\dfrac{" + K + "}{" + tx(tau) + "s + 1}$. " + (ask === "m" ? "Hvert er útslag úttaksins í sístæðu ástandi?" : "Hver er fasahliðrun úttaksins (í gráðum)?"),
      answer: ask === "m" ? m : ph, unit: ask === "m" ? "" : "°", tol: 0.015,
      sol: "<p>$|G(j\\omega)| = \\dfrac{K}{\\sqrt{1 + \\tau^2\\omega^2}} = \\dfrac{" + K + "}{\\sqrt{1 + (" + tx(tau) + "\\cdot" + tx(w) + ")^2}} = " + tx(m) + "$.</p><p>$\\varphi = -\\arctan(\\tau\\omega) = -\\arctan(" + tx(tau * w) + ") = " + tx(ph) + "^\\circ$ (úttakið er á eftir).</p>",
    };
  });

  G.push(function tankModel() {
    var A = pick([2, 5, 10, 20, 30]), R = pick([5, 10, 15, 20, 40]), h0 = pick([1, 2, 3, 4]), dq = pick([0.01, 0.02, 0.05, 0.1]);
    var ask = pick(["h", "t"]);
    var h = h0 + R * dq, t4 = 4 * A * R;
    return {
      topic: "likan",
      title: "Vatnstankur (lokapróf 2024 S2)",
      text: "Tankur hefur botnflöt $A = " + A + "\\ \\mathrm{m^2}$ og jafnvægishæð $h_0 = " + h0 + "$ m. Nálægt henni gildir $q_2 = h/R$ með $R = " + R + "\\ \\mathrm{s/m^2}$. Innflæðið er skyndilega aukið um $" + tx(dq) + "\\ \\mathrm{m^3/s}$. " + (ask === "h" ? "Hver verður ný jafnvægishæð (m)?" : "Eftir hve langan tíma (s) næst jafnvægi ($4\\tau$)?"),
      answer: ask === "h" ? h : t4, unit: ask === "h" ? "m" : "s", tol: 0.01,
      sol: "<p>$A\\dot h = q_1 - h/R \\Rightarrow AR\\,\\dot h + h = R\\,q_1$: $\\tau = AR = " + (A * R) + "$ s og mögnun $R$.</p><p>$\\Delta h = R\\,\\Delta q = " + R + "\\cdot" + tx(dq) + " = " + tx(R * dq) + "$ m, svo $h = " + tx(h) + "$ m. $4\\tau = " + t4 + "$ s.</p>",
    };
  });

  G.push(function rcSwitch() {
    var R1 = pick([2, 4, 6, 8, 10]), R2 = pick([1, 2, 4, 5]), C = pick([0.5, 1, 2, 10]), V = pick([10, 12, 20, 30]);
    var Rth = (R1 * R2) / (R1 + R2), uinf = (V * R2) / (R1 + R2), tau = Rth * C; // kΩ*µF = ms
    var ask = pick(["u", "t"]);
    return {
      topic: "likan",
      title: "RC-rás eftir rofa (lokapróf 2025 S2)",
      text: "Spennulind $V_1 = " + V + "$ V tengist hnút í gegnum $R_1 = " + R1 + "\\ \\mathrm{k\\Omega}$. Frá hnútnum til jarðar liggja $R_2 = " + R2 + "\\ \\mathrm{k\\Omega}$ og þéttir $C = " + tx(C) + "\\ \\mu\\mathrm F$ hliðtengd. Rofi sem tengdi aðra spennulind við hnútinn er opnaður við $t = 0$. " + (ask === "u" ? "Hvert er jafnvægisgildi spennunnar $u$ yfir þéttinn (V)?" : "Hver er tímastuðull rásarinnar (ms)?"),
      answer: ask === "u" ? uinf : tau, unit: ask === "u" ? "V" : "ms", tol: 0.01,
      sol: "<p>Kirchhoff: $\\dfrac{V_1 - u}{R_1} = \\dfrac{u}{R_2} + C\\dot u \\Rightarrow R_{th}C\\,\\dot u + u = \\dfrac{R_2}{R_1+R_2}V_1$.</p><p>$R_{th} = R_1\\parallel R_2 = " + tx(Rth) + "\\ \\mathrm{k\\Omega}$, $\\tau = R_{th}C = " + tx(tau) + "$ ms, $u_\\infty = " + tx(uinf) + "$ V.</p>",
    };
  });

  G.push(function rcLowpass() {
    var R = pick([1, 2.2, 4.7, 10, 47, 100]), C = pick([0.1, 0.47, 1, 10, 100]); // kΩ, µF
    var tau = R * C; // ms
    return {
      topic: "likan",
      title: "RC-sía",
      text: "Inntaksspenna $u$ fer í gegnum viðnám $R = " + tx(R) + "\\ \\mathrm{k\\Omega}$ og úttakið $y$ er spennan yfir þétti $C = " + tx(C) + "\\ \\mu\\mathrm F$. Hver er tímastuðullinn (ms)?",
      answer: tau, unit: "ms", tol: 0.01,
      sol: "<p>$\\dfrac{u - y}{R} = C\\dot y \\Rightarrow RC\\,\\dot y + y = u$, svo $\\tau = RC = " + tx(R) + "\\cdot10^3\\cdot" + tx(C) + "\\cdot10^{-6} = " + tx(tau) + "$ ms.</p>",
    };
  });

  G.push(function thermal() {
    var m = pick([0.5, 1, 2, 5]), c = pick([450, 900, 4180]), R = pick([0.05, 0.1, 0.2, 0.5]), P = pick([100, 200, 500, 1000]);
    var Ct = m * c, tau = R * Ct, dT = R * P;
    var ask = pick(["t", "d"]);
    return {
      topic: "likan",
      title: "Varmakerfi",
      text: "Hlutur með massa $" + tx(m) + "$ kg og eðlisvarma $" + c + "$ J/(kg·°C) er hitaður með $P = " + P + "$ W. Varmaviðnámið til umhverfisins er $R = " + tx(R) + "$ °C/W. " + (ask === "t" ? "Hver er tímastuðullinn (s)?" : "Hversu mikið hækkar hitinn umfram umhverfið í jafnvægi (°C)?"),
      answer: ask === "t" ? tau : dT, unit: ask === "t" ? "s" : "°C", tol: 0.01,
      sol: "<p>$P - \\dfrac{T - T_u}{R} = C\\dot T \\Rightarrow RC\\,\\dot T + T = T_u + RP$, með $C = mc = " + tx(Ct) + "$ J/°C.</p><p>$\\tau = RC = " + tx(tau) + "$ s. Í jafnvægi: $T - T_u = RP = " + tx(dT) + "$ °C.</p>",
    };
  });

  G.push(function springs() {
    var k1 = pick([100, 200, 300, 400, 600]), k2 = pick([100, 200, 300, 600]);
    var ser = pick([true, false]);
    var k = ser ? (k1 * k2) / (k1 + k2) : k1 + k2;
    return {
      topic: "likan",
      title: "Jafngildisfjöður",
      text: "Tvær fjaðrir með $k_1 = " + k1 + "$ N/m og $k_2 = " + k2 + "$ N/m eru " + (ser ? "raðtengdar" : "hliðtengdar") + ". Hver er jafngildisstífnin (N/m)?",
      answer: k, unit: "N/m", tol: 0.01,
      sol: ser ? "<p>Raðtengdar: sami kraftur, færslur leggjast saman: $\\dfrac1k = \\dfrac1{k_1} + \\dfrac1{k_2} \\Rightarrow k = \\dfrac{k_1k_2}{k_1+k_2} = " + tx(k) + "$ N/m.</p>"
        : "<p>Hliðtengdar: sama færsla, kraftar leggjast saman: $k = k_1 + k_2 = " + k + "$ N/m.</p>",
    };
  });

  G.push(function massSpring() {
    var m = pick([1, 2, 4, 5]), c = pick([2, 4, 6, 8]), k = pick([8, 16, 32, 50, 100]);
    var wn = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m));
    var ask = pick(["wn", "z"]);
    return {
      topic: "likan",
      title: "Massi, fjöður og dempari",
      text: "Massi $m = " + m + "$ kg er tengdur vegg með fjöður $k = " + k + "$ N/m og dempara $c = " + c + "$ Ns/m. Krafturinn $F$ er inntak og færslan $x$ úttak. Hver er " + (ask === "wn" ? "náttúrulega tíðnin $\\omega_n$ (rad/s)?" : "dempunarhlutfallið $\\zeta$?"),
      answer: ask === "wn" ? wn : z, unit: ask === "wn" ? "rad/s" : "", tol: 0.01,
      sol: "<p>$m\\ddot x + c\\dot x + kx = F \\Rightarrow G = \\dfrac{1/m}{s^2 + \\frac{c}{m}s + \\frac{k}{m}}$.</p><p>$\\omega_n = \\sqrt{k/m} = " + tx(wn) + "$ rad/s, $\\zeta = \\dfrac{c}{2\\sqrt{km}} = " + tx(z) + "$.</p>",
    };
  });

  G.push(function pType0() {
    var Kp = pick([0.5, 1, 2, 2.5, 4]), K = pick([1, 2, 4, 5, 10, 20]), r = pick([1, 2, 5, 10]);
    var e = r / (1 + K * Kp);
    return {
      topic: "stjornkerfi",
      title: "Skekkja með P-stýringu (tegund 0)",
      text: "Ferli $G_P = \\dfrac{" + tx(Kp) + "}{(1+2s)(1+s)}$ er stýrt með P-stýringu $K = " + K + "$ og nema $G_S = 1$. Hver er skekkjan í jafnvægi eftir þrep um $" + r + "$ í óskgildi?",
      answer: e, unit: "", tol: 0.01,
      sol: "<p>Tegund 0: $K_p = \\lim_{s\\to0}G_K = " + K + "\\cdot" + tx(Kp) + " = " + tx(K * Kp) + "$.</p><p>$e_{ss} = \\dfrac{" + r + "}{1 + K_p} = " + tx(e) + "$.</p>",
    };
  });

  G.push(function delayMargin() {
    var pm = pick([30, 35, 40, 45, 50, 60]), wc = pick([0.05, 0.2, 0.5, 1, 2, 5]);
    var L = (pm * Math.PI) / 180 / wc;
    return {
      topic: "stjornkerfi",
      title: "Leyfileg seinkun",
      text: "Lykkja hefur fasaöryggi $\\varphi_m = " + pm + "^\\circ$ við $\\omega_c = " + tx(wc) + "$ rad/s. Hversu löng má hrein seinkun $e^{-Ls}$ í lykkjunni vera áður en kerfið verður óstöðugt (s)?",
      answer: L, unit: "s", tol: 0.015,
      sol: "<p>Seinkunin breytir ekki mögnuninni en lækkar fasann um $\\omega L$ rad. Óstöðugt þegar $\\omega_cL \\ge \\varphi_m$:</p><p>$L_{max} = \\dfrac{" + pm + "\\cdot\\pi/180}{" + tx(wc) + "} = " + tx(L) + "$ s.</p>",
    };
  });

  G.push(function motorSelect() {
    var va = pick([10, 12, 24]), kt = pick([0.08, 0.1, 0.15, 0.2]), R = pick([1, 1.5, 2, 2.5]), kfk = pick([8, 10, 12, 15]);
    var ts = (kt / R) * va, w0 = va / KF_SI(kfk), P = (ts * w0) / 4;
    var ask = pick(["ts", "P"]);
    return {
      topic: "hreyflar",
      title: ask === "ts" ? "Val á hreyfli: upphafsvægi" : "Val á hreyfli: hámarksafl",
      text: "Jafnstraumshreyfill: $v_a = " + va + "$ V, $K_\\tau = " + tx(kt) + "$ Nm/A, $K_f = " + kfk + "$ V/1000 RPM, $R = " + tx(R) + "\\ \\Omega$, span óverulegt. " + (ask === "ts" ? "Hvert er upphafsvægið (Nm)?" : "Hvert er hámarksaflið (W)?"),
      answer: ask === "ts" ? ts : P, unit: ask === "ts" ? "Nm" : "W", tol: 0.015,
      sol: "<p>$\\tau_s = \\dfrac{K_\\tau}{R}v_a = " + tx(ts) + "$ Nm. $K_f = " + kfk + "/104{,}72 = " + tx(KF_SI(kfk)) + "$ V·s/rad, $\\omega_0 = v_a/K_f = " + tx(w0) + "$ rad/s.</p><p>$P_{max} = \\dfrac{\\tau_s\\omega_0}{4} = " + tx(P) + "$ W.</p>",
    };
  });

  G.push(function partialFrac() {
    var a = pick([1, 2, 3]), b = a + pick([1, 2, 3]), A = pick([1, 2, 3, 4]);
    // Y = A / ((s+a)(s+b)) -> k1 e^{-at} + k2 e^{-bt}, k1 = A/(b-a)
    var t = pick([0.2, 0.5, 1]);
    var y = (A / (b - a)) * (Math.exp(-a * t) - Math.exp(-b * t));
    return {
      topic: "laplace",
      title: "Andhverf Laplace-vörpun",
      text: "Finndu $y(t)$ fyrir $Y(s) = \\dfrac{" + A + "}{(s+" + a + ")(s+" + b + ")}$ og reiknaðu $y(" + tx(t) + ")$.",
      answer: y, unit: "", tol: 0.015,
      sol: "<p>Stofnbrot: $k_1 = \\dfrac{" + A + "}{-" + a + "+" + b + "} = " + tx(A / (b - a)) + "$, $k_2 = \\dfrac{" + A + "}{-" + b + "+" + a + "} = " + tx(-A / (b - a)) + "$.</p><p>$y(t) = " + tx(A / (b - a)) + "\\,(e^{-" + a + "t} - e^{-" + b + "t})$, svo $y(" + tx(t) + ") = " + tx(y) + "$.</p>",
    };
  });

  /* ---------- Viðbót: fleiri reiknidæmi fyrir kaflaprófin ---------- */
  var sg = function (x, sig) { return (x < 0 ? "- " : "+ ") + tx(Math.abs(x), sig); }; // formerki í KaTeX
  var cf = function (x) { return x === 1 ? "" : String(x); };                           // stuðli 1 sleppt
  var R2D = 180 / Math.PI;

  /* --- Laplace og blokkrit --- */
  G.push(function lapRepeated() {
    var a = pick([1, 2, 3]), A = pick([1, 2, 4, 6, 9]), t = pick([0.5, 1, 1.5, 2]);
    var k1 = A / (a * a), k21 = -A / (a * a), k22 = -A / a;
    var y = k1 + (k21 + k22 * t) * Math.exp(-a * t);
    return {
      topic: "laplace", title: "Tvöföld rót",
      text: "Finndu $y(t)$ fyrir $Y(s) = \\dfrac{" + A + "}{s\\,(s+" + a + ")^2}$ og reiknaðu $y(" + tx(t) + ")$.",
      answer: y, unit: "", tol: 0.02,
      sol: "<p>Stofnbrot með tvöfaldri rót: $Y = \\dfrac{k_1}{s} + \\dfrac{k_{21}}{s+" + a + "} + \\dfrac{k_{22}}{(s+" + a + ")^2}$.</p>" +
        "<p>$k_1 = sY|_{s=0} = \\dfrac{" + A + "}{" + a * a + "} = " + tx(k1) + "$, $k_{22} = (s+" + a + ")^2Y|_{s=-" + a + "} = \\dfrac{" + A + "}{-" + a + "} = " + tx(k22) + "$, $k_{21} = \\dfrac{d}{ds}\\Bigl[\\dfrac{" + A + "}{s}\\Bigr]_{s=-" + a + "} = -\\dfrac{" + A + "}{" + a * a + "} = " + tx(k21) + "$.</p>" +
        "<p>Úr töflunni ($\\frac{1}{(s+a)^2} \\to te^{-at}$): $y(t) = " + tx(k1) + " " + sg(k21) + "e^{-" + a + "t} " + sg(k22) + "\\,te^{-" + a + "t}$.</p>" +
        "<p>$y(" + tx(t) + ") = " + tx(y) + "$.</p>",
    };
  });

  G.push(function lapComplex() {
    var s0 = pick([1, 2]), w = pick([1, 2, 3]), b = pick([1, 2, 5, 10]), t = pick([0.5, 1, 1.5]);
    var a1 = 2 * s0, a2 = s0 * s0 + w * w;
    var y = (b / a2) * (1 - Math.exp(-s0 * t) * (Math.cos(w * t) + (s0 / w) * Math.sin(w * t)));
    return {
      topic: "laplace", title: "Samoka tvinnrætur",
      text: "Leystu $y'' + " + a1 + "y' + " + a2 + "y = " + cf(b) + "u$ með Laplace, þar sem $u$ er einingarþrep og kerfið í hvíld. Hvað er $y(" + tx(t) + ")$?",
      answer: y, unit: "", tol: 0.02,
      sol: "<p>$Y(s) = \\dfrac{" + b + "}{s\\,(s^2 + " + a1 + "s + " + a2 + ")} = \\dfrac{" + b + "}{s\\bigl((s+" + s0 + ")^2 + " + w * w + "\\bigr)}$, rætur $-" + s0 + " \\pm " + cf(w) + "j$.</p>" +
        "<p>Með $\\sigma = -" + s0 + "$, $\\omega = " + w + "$ (jafna 10.76): $y = \\dfrac{" + b + "}{" + a2 + "}\\Bigl(1 - e^{-" + s0 + "t}\\bigl(\\cos " + cf(w) + "t + \\tfrac{" + s0 + "}{" + w + "}\\sin " + cf(w) + "t\\bigr)\\Bigr)$.</p>" +
        "<p>$y(" + tx(t) + ") = " + tx(b / a2) + "\\bigl(1 - " + tx(Math.exp(-s0 * t)) + "\\cdot(" + tx(Math.cos(w * t)) + " " + sg((s0 / w) * Math.sin(w * t)) + ")\\bigr) = " + tx(y) + "$.</p>",
    };
  });

  G.push(function lapCoef() {
    var a = rnd(1, 3), b = a + rnd(1, 3), p = rnd(1, 5), q;
    do { q = rnd(1, 12); } while (q === p * a || q === p * b);
    var ka = (q - p * a) / (b - a), kb = (q - p * b) / (a - b);
    var askA = Math.random() < 0.5;
    return {
      topic: "laplace", title: "Stofnbrotastuðull",
      text: "$Y(s) = \\dfrac{" + cf(p) + "s + " + q + "}{(s+" + a + ")(s+" + b + ")} = \\dfrac{k_1}{s+" + a + "} + \\dfrac{k_2}{s+" + b + "}$. Hvað er " + (askA ? "$k_1$" : "$k_2$") + "?",
      answer: askA ? ka : kb, unit: "", tol: 0.01, absTol: 0.01,
      sol: "<p>Hyljunaraðferðin (jafna 10.52): $k_i = (s-p_i)Y(s)|_{s=p_i}$.</p>" +
        "<p>$k_1 = \\dfrac{" + p + "\\cdot(-" + a + ") + " + q + "}{-" + a + " + " + b + "} = " + tx(ka) + "$, $\\quad k_2 = \\dfrac{" + p + "\\cdot(-" + b + ") + " + q + "}{-" + b + " + " + a + "} = " + tx(kb) + "$.</p>" +
        "<p>Þá er $y(t) = " + tx(ka) + "e^{-" + a + "t} " + sg(kb) + "e^{-" + b + "t}$. Prófun: $k_1 + k_2 = " + tx(ka + kb) + " = " + p + "$ (stuðull $s$ í teljaranum).</p>",
    };
  });

  G.push(function tfFromOde() {
    var r1 = rnd(1, 3), r2 = r1 + rnd(1, 4), b1 = pick([0, 1, 2]), b2 = pick([2, 3, 4, 6, 8, 10]);
    var a1 = r1 + r2, a2 = r1 * r2, askDC = Math.random() < 0.5;
    var rhs = (b1 ? cf(b1) + "u' + " : "") + b2 + "u";
    return {
      topic: "laplace", title: "Yfirfærslufall úr diffurjöfnu",
      text: "Kerfi er lýst með $y'' + " + a1 + "y' + " + a2 + "y = " + rhs + "$. " + (askDC ? "Hvert er jafnvægisgildi svörunar við einingarþrepi?" : "Hver er tímastuðull hægari pólsins (í s)?"),
      answer: askDC ? b2 / a2 : 1 / r1, unit: askDC ? "" : "s", tol: 0.01,
      sol: "<p>Laplace með núll upphafsgildum: $G(s) = \\dfrac{" + (b1 ? cf(b1) + "s + " : "") + b2 + "}{s^2 + " + a1 + "s + " + a2 + "} = \\dfrac{" + (b1 ? cf(b1) + "s + " : "") + b2 + "}{(s+" + r1 + ")(s+" + r2 + ")}$.</p>" +
        (askDC ? "<p>Lokagildisreglan: $y(\\infty) = \\lim_{s\\to0} s\\,G(s)\\tfrac1s = G(0) = \\dfrac{" + b2 + "}{" + a2 + "} = " + tx(b2 / a2) + "$. Liðurinn með $u'$ hefur engin áhrif á jafnvægið.</p>"
          : "<p>Pólarnir eru $-" + r1 + "$ og $-" + r2 + "$. Sá sem er næst $j\\omega$-ásnum deyr hægast út: $\\tau = 1/" + r1 + " = " + tx(1 / r1) + "$ s. Svipula svörunin er horfin eftir um $4\\tau = " + tx(4 / r1) + "$ s.</p>"),
    };
  });

  G.push(function initFinal() {
    var a = rnd(1, 3), b = a + rnd(1, 3), p = pick([0, 1, 2, 3]), q = rnd(1, 6), r = pick([2, 4, 6, 8, 12]);
    var askInit = Math.random() < 0.5;
    var num = (p ? cf(p) + "s^2 + " : "") + cf(q) + "s + " + r;
    return {
      topic: "laplace", title: askInit ? "Upphafsgildisreglan" : "Lokagildisreglan",
      text: "$Y(s) = \\dfrac{" + num + "}{s\\,(s+" + a + ")(s+" + b + ")}$. Hvað er " + (askInit ? "$y(0^+)$" : "$\\lim_{t\\to\\infty} y(t)$") + " (án þess að finna $y(t)$)?",
      answer: askInit ? p : r / (a * b), unit: "", tol: 0.01, absTol: 0.005,
      sol: askInit
        ? "<p>$y(0^+) = \\lim_{s\\to\\infty} sY(s) = \\lim_{s\\to\\infty} \\dfrac{" + num + "}{(s+" + a + ")(s+" + b + ")}$. Æðstu veldi: " + (p ? "$\\dfrac{" + p + "s^2}{s^2} \\to " + p + "$." : "teljarinn er af lægra stigi en nefnarinn, svo markgildið er $0$.") + "</p>"
        : "<p>Allir pólar $sY$ eru í vinstra hálfplani ($-" + a + "$, $-" + b + "$), svo reglan gildir: $\\lim_{s\\to0} sY(s) = \\dfrac{" + r + "}{" + a + "\\cdot" + b + "} = " + tx(r / (a * b)) + "$.</p>",
    };
  });

  G.push(function fbLoopDC() {
    var Kp = pick([2, 4, 5, 8, 10]), tau = pick([1, 2, 4, 5, 10]), h = pick([0.1, 0.2, 0.5, 1]);
    var dc = Kp / (1 + Kp * h), tc = tau / (1 + Kp * h), askDC = Math.random() < 0.5;
    return {
      topic: "laplace", title: "Afturvirkni í blokkriti",
      text: "Í framleið er $G = \\dfrac{" + Kp + "}{" + cf(tau) + "s + 1}$ og í afturvirkni (neikvæð) er $H = " + tx(h) + "$. " + (askDC ? "Hver er jafnvægismögnun lokaða kerfisins $Y/U$?" : "Hver er tímastuðull lokaða kerfisins (í s)?"),
      answer: askDC ? dc : tc, unit: askDC ? "" : "s", tol: 0.01,
      sol: "<p>$\\dfrac{Y}{U} = \\dfrac{G}{1+GH} = \\dfrac{" + Kp + "}{" + cf(tau) + "s + 1 + " + tx(Kp * h) + "} = \\dfrac{" + tx(dc) + "}{" + tx(tc) + "s + 1}$.</p>" +
        "<p>Jafnvægismögnun $" + tx(dc) + "$ og tímastuðull $" + tx(tc) + "$ s. Afturvirknin minnkar bæði mögnun og tímastuðul um þáttinn $1 + KH = " + tx(1 + Kp * h) + "$.</p>",
    };
  });

  G.push(function innerLoop() {
    var k1 = pick([2, 4, 5, 10]), k2 = pick([1, 2, 4]), a = pick([1, 2, 3]), h = pick([0.5, 1, 2]);
    var Ti0 = k2 / (a + k2 * h), dc = (k1 * Ti0) / (1 + k1 * Ti0);
    return {
      topic: "laplace", title: "Innri lykkja",
      text: "Blokkrit: $U \\to (+,-) \\to G_1 = " + k1 + " \\to$ [innri lykkja: $G_2 = \\dfrac{" + k2 + "}{s+" + a + "}$ með afturvirkni $H = " + tx(h) + "$] $\\to Y$, og ytri afturvirknin frá $Y$ er $1$. Hver er jafnvægismögnun $Y/U$?",
      answer: dc, unit: "", tol: 0.01,
      sol: "<p>Fyrst innri lykkjan: $T_i = \\dfrac{G_2}{1+G_2H} = \\dfrac{" + k2 + "}{s + " + a + " + " + tx(k2 * h) + "}$, $T_i(0) = " + tx(Ti0) + "$.</p>" +
        "<p>Síðan ytri lykkjan: $\\dfrac{Y}{U} = \\dfrac{G_1T_i}{1 + G_1T_i}$, við $s = 0$: $\\dfrac{" + k1 + "\\cdot" + tx(Ti0) + "}{1 + " + tx(k1 * Ti0) + "} = " + tx(dc) + "$.</p>",
    };
  });

  G.push(function distDC() {
    var K = pick([1, 2, 5, 10, 20]), Kp = pick([0.5, 1, 2, 4]), tau = pick([2, 5, 10]), v0 = pick([0.5, 1, 2]);
    var y = (v0 * Kp) / (1 + K * Kp);
    return {
      topic: "laplace", title: "Truflun í blokkriti",
      text: "P-stýring $K = " + K + "$ og ferli $G_P = \\dfrac{" + tx(Kp) + "}{" + tau + "s+1}$ með einingarafturvirkni. Þrepatruflun af stærð $" + tx(v0) + "$ leggst við á milli stýringar og ferlis (óskgildi er 0). Hvert verður jafnvægisgildi úttaksins?",
      answer: y, unit: "", tol: 0.01,
      sol: "<p>Takið óskgildið út (yfirlagning): $\\dfrac{Y}{V} = \\dfrac{G_P}{1 + K G_P}$.</p>" +
        "<p>Við $s = 0$: $\\dfrac{" + tx(Kp) + "}{1 + " + K + "\\cdot" + tx(Kp) + "} = " + tx(Kp / (1 + K * Kp)) + "$, svo $y(\\infty) = " + tx(v0) + "\\cdot" + tx(Kp / (1 + K * Kp)) + " = " + tx(y) + "$.</p>" +
        "<p>Án afturvirkni hefði úttakið orðið $" + tx(v0 * Kp) + "$: afturvirknin deyfir truflunina um þáttinn $1 + KK_P = " + tx(1 + K * Kp) + "$.</p>",
    };
  });

  G.push(function timeShift() {
    var A = pick([1, 2, 5]), a = pick([0.5, 1, 2]), T = pick([1, 2, 3]), t1 = T + pick([-0.5, 0.5, 1, 2]);
    var f = t1 < T ? 0 : A * Math.exp(-a * (t1 - T));
    return {
      topic: "laplace", title: "Hliðrun í tíma",
      text: "$F(s) = \\dfrac{" + A + "\\,e^{-" + T + "s}}{s + " + tx(a) + "}$. Hvað er $f(" + tx(t1) + ")$?",
      answer: f, unit: "", tol: 0.015, absTol: 0.002,
      sol: "<p>Hliðrunarreglan: $\\mathcal{L}[g(t-T)] = G(s)e^{-Ts}$. Hér er $g(t) = " + A + "e^{-" + tx(a) + "t}$ og $T = " + T + "$ s, svo $f(t) = " + A + "e^{-" + tx(a) + "(t-" + T + ")}$ fyrir $t \\ge " + T + "$ og $0$ áður.</p>" +
        "<p>" + (t1 < T ? "$t = " + tx(t1) + " < " + T + "$, svo $f = 0$: merkið er ekki enn komið." : "$f(" + tx(t1) + ") = " + A + "e^{-" + tx(a) + "\\cdot" + tx(t1 - T) + "} = " + tx(f) + "$.") + "</p>",
    };
  });

  /* --- Svörun kerfa --- */
  G.push(function zetaFromMp() {
    var Mp = pick([5, 10, 15, 20, 25, 30, 40, 50]), L = Math.log(Mp / 100);
    var z = -L / Math.sqrt(Math.PI * Math.PI + L * L);
    return {
      topic: "svorun", title: "Dempun út frá yfirskoti",
      text: "Þrepasvörun annarrar gerðar kerfis hefur hæsta yfirskot $" + Mp + "\\,\\%$ af jafnvægisgildi. Hvert er dempunarhlutfallið $\\zeta$?",
      answer: z, unit: "", tol: 0.015,
      sol: "<p>$M_p = e^{-\\zeta\\pi/\\sqrt{1-\\zeta^2}}$. Tökum log: $\\ln M_p = -\\dfrac{\\zeta\\pi}{\\sqrt{1-\\zeta^2}}$ og leysum fyrir $\\zeta$:</p>" +
        "$$\\zeta = \\frac{-\\ln M_p}{\\sqrt{\\pi^2 + \\ln^2 M_p}} = \\frac{" + tx(-L) + "}{\\sqrt{" + tx(Math.PI * Math.PI) + " + " + tx(L * L) + "}} = " + tx(z) + "$$",
    };
  });

  G.push(function readStep() {
    var z = pick([0.3, 0.4, 0.5, 0.56, 0.6, 0.7]), wn = pick([0.5, 1, 1.26, 2, 4]), yf = pick([1, 2, 0.5]);
    var Mp = Math.exp((-z * Math.PI) / Math.sqrt(1 - z * z)), Tp = Math.PI / (wn * Math.sqrt(1 - z * z));
    var yp = round(yf * (1 + Mp), 2), TpR = round(Tp, 2);
    var Mr = (yp - yf) / yf, L = Math.log(Mr), zz = -L / Math.sqrt(Math.PI * Math.PI + L * L), ww = Math.PI / (TpR * Math.sqrt(1 - zz * zz));
    var askZ = Math.random() < 0.5;
    return {
      topic: "svorun", title: "Lesið af þrepasvörun",
      text: "Mæld þrepasvörun annarrar gerðar kerfis nær hámarki $" + tx(yp) + "$ við $t = " + tx(TpR) + "$ s og jafnar sig í $" + tx(yf) + "$. Hvert er " + (askZ ? "$\\zeta$" : "$\\omega_n$ (rad/s)") + "?",
      answer: askZ ? zz : ww, unit: askZ ? "" : "rad/s", tol: 0.02,
      sol: "<p>Yfirskot: $M_p = \\dfrac{" + tx(yp) + " - " + tx(yf) + "}{" + tx(yf) + "} = " + tx(Mr) + "$, svo $\\zeta = \\dfrac{-\\ln M_p}{\\sqrt{\\pi^2+\\ln^2 M_p}} = " + tx(zz) + "$.</p>" +
        "<p>Tími hæsta yfirskots: $T_p = \\dfrac{\\pi}{\\omega_n\\sqrt{1-\\zeta^2}} \\Rightarrow \\omega_n = \\dfrac{\\pi}{" + tx(TpR) + "\\sqrt{1-" + tx(zz) + "^2}} = " + tx(ww) + "$ rad/s.</p>" +
        "<p>Svona er líkan metið út frá mælingum (kafli 4), t.d. ferlið í lokaprófinu 2025 S6.</p>",
    };
  });

  G.push(function resonance() {
    var z = pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5]), wn = pick([1, 2, 5, 10]);
    var Mr = 1 / (2 * z * Math.sqrt(1 - z * z)), wr = wn * Math.sqrt(1 - 2 * z * z), askM = Math.random() < 0.5;
    return {
      topic: "svorun", title: "Ómun",
      text: "$G(s) = \\dfrac{\\omega_n^2}{s^2 + 2\\zeta\\omega_ns + \\omega_n^2}$ með $\\zeta = " + tx(z) + "$ og $\\omega_n = " + wn + "$ rad/s. " + (askM ? "Hver er hæsta mögnunin $M_r$ (hlutfall, ekki dB)?" : "Við hvaða tíðni $\\omega_r$ (rad/s) er mögnunin mest?"),
      answer: askM ? Mr : wr, unit: askM ? "" : "rad/s", tol: 0.01,
      sol: "<p>Fyrir $\\zeta \\le 1/\\sqrt2$ (jöfnur 13.15-13.16, $K = 1$):</p>" +
        "<p>$M_r = \\dfrac{1}{2\\zeta\\sqrt{1-\\zeta^2}} = " + tx(Mr) + "$ ($= " + tx(20 * Math.log10(Mr)) + "$ dB), $\\quad \\omega_r = \\omega_n\\sqrt{1-2\\zeta^2} = " + tx(wr) + "$ rad/s.</p>",
    };
  });

  G.push(function bode2nd() {
    var z = pick([0.2, 0.3, 0.5, 0.7, 1]), wn = pick([1, 2, 5, 10]), r = pick([0.5, 1, 2, 5, 10]), w = wn * r;
    var mag = 1 / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * z * r, 2)), dB = 20 * Math.log10(mag);
    return {
      topic: "svorun", title: "Bode-mögnun annarrar gerðar",
      text: "$G(s) = \\dfrac{" + wn * wn + "}{s^2 + " + tx(2 * z * wn) + "s + " + wn * wn + "}$. Hver er mögnunin í dB við $\\omega = " + tx(w) + "$ rad/s?",
      answer: dB, unit: "dB", tol: 0.02, absTol: 0.15,
      sol: "<p>$\\omega_n = " + wn + "$, $\\zeta = " + tx(z) + "$, og $\\omega/\\omega_n = " + tx(r) + "$.</p>" +
        "$$|G(j\\omega)| = \\frac{1}{\\sqrt{(1-(\\omega/\\omega_n)^2)^2 + (2\\zeta\\omega/\\omega_n)^2}} = \\frac{1}{\\sqrt{" + tx(Math.pow(1 - r * r, 2)) + " + " + tx(Math.pow(2 * z * r, 2)) + "}} = " + tx(mag) + "$$" +
        "<p>$20\\log_{10}" + tx(mag) + " = " + tx(dB) + "$ dB.</p>",
    };
  });

  G.push(function delayPhase() {
    var L = pick([0.1, 0.2, 0.5, 1, 2]), tau = pick([0.5, 1, 2, 5]), w = pick([0.2, 0.5, 1, 2]);
    var ph = -(w * L + Math.atan(tau * w)) * R2D;
    return {
      topic: "svorun", title: "Fasi með seinkun",
      text: "$G(s) = \\dfrac{e^{-" + tx(L) + "s}}{" + tx(tau) + "s + 1}$. Hver er fasinn (í gráðum) við $\\omega = " + tx(w) + "$ rad/s?",
      answer: ph, unit: "°", tol: 0.015, absTol: 0.5,
      sol: "<p>Seinkun gefur $-\\omega L$ (radíanar) og fyrstu gerðar liðurinn $-\\arctan(\\tau\\omega)$:</p>" +
        "<p>$\\varphi = -" + tx(w * L) + "\\cdot\\tfrac{180}{\\pi} - \\arctan(" + tx(tau * w) + ") = " + tx(-w * L * R2D) + "^\\circ " + sg(-Math.atan(tau * w) * R2D) + "^\\circ = " + tx(ph) + "^\\circ$.</p>" +
        "<p>Seinkunin breytir ekki mögnuninni ($|e^{-j\\omega L}| = 1$).</p>",
    };
  });

  G.push(function dominantPole() {
    var a = pick([0.5, 1, 2]), b = a * pick([4, 5, 10]), d = a * pick([20, 40]), c = pick([1, 5, 10]);
    var Ts = 4 / a, askTs = Math.random() < 0.6;
    var dc = c / (a * b * d);
    return {
      topic: "svorun", title: "Ríkjandi póll",
      text: "$G(s) = \\dfrac{" + c + "}{(s+" + tx(a) + ")(s+" + tx(b) + ")(s+" + tx(d) + ")}$. " + (askTs ? "Eftir um það bil hve langan tíma (s) er svipula svörunin við þrepi horfin (98 %)?" : "Hvert er jafnvægisgildi þrepasvörunarinnar?"),
      answer: askTs ? Ts : dc, unit: askTs ? "s" : "", tol: askTs ? 0.02 : 0.01,
      sol: askTs
        ? "<p>Svörunin er summa þriggja veldisfalla. Hægasti liðurinn (póllinn næst $j\\omega$-ásnum, $-" + tx(a) + "$) hefur tímastuðulinn $\\tau = 1/" + tx(a) + " = " + tx(1 / a) + "$ s og ræður lengdinni (kafli 12.4).</p><p>$4\\tau = " + tx(Ts) + "$ s. Hinir liðirnir ($\\tau = " + tx(1 / b) + "$ og $" + tx(1 / d) + "$ s) eru löngu horfnir.</p>"
        : "<p>$y(\\infty) = G(0) = \\dfrac{" + c + "}{" + tx(a) + "\\cdot" + tx(b) + "\\cdot" + tx(d) + "} = " + tx(dc) + "$.</p>",
    };
  });

  G.push(function sineOut2nd() {
    var wn = pick([2, 4, 5]), z = pick([0.2, 0.5, 0.7]), K = pick([1, 2]), A = pick([1, 2, 5]), w = pick([1, 2, 4, 5, 10]);
    var r = w / wn, mag = K / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * z * r, 2)), ph = -Math.atan2(2 * z * r, 1 - r * r) * R2D;
    return {
      topic: "svorun", title: "Sístæð svörun við sínus",
      text: "Inntakið $u(t) = " + A + "\\cos(" + w + "t)$ fer inn í $G(s) = \\dfrac{" + K * wn * wn + "}{s^2 + " + tx(2 * z * wn) + "s + " + wn * wn + "}$. Hvert er útslag sístæða úttaksins?",
      answer: A * mag, unit: "", tol: 0.015,
      sol: "<p>Sístæð svörun: $y = A|G(j\\omega)|\\cos(\\omega t + \\varphi)$ (jafna 13.7).</p>" +
        "<p>$K = " + K + "$, $\\omega_n = " + wn + "$, $\\zeta = " + tx(z) + "$, $\\omega/\\omega_n = " + tx(r) + "$: $|G| = \\dfrac{" + K + "}{\\sqrt{(1-" + tx(r * r) + ")^2 + (" + tx(2 * z * r) + ")^2}} = " + tx(mag) + "$.</p>" +
        "<p>Útslag $= " + A + "\\cdot" + tx(mag) + " = " + tx(A * mag) + "$, og fasinn er $" + tx(ph) + "^\\circ$.</p>",
    };
  });

  /* --- Stýringar --- */
  G.push(function pKforWc() {
    var Kp = pick([0.5, 1, 2, 5]), tau = pick([0.2, 0.5, 1, 2]), wc = pick([0.5, 1, 2, 3]);
    var K = (wc * Math.sqrt(1 + tau * tau * wc * wc)) / Kp, pm = 90 - Math.atan(tau * wc) * R2D;
    return {
      topic: "styringar", title: "K fyrir gefna skurðtíðni",
      text: "Ferlið er $G_P = \\dfrac{" + tx(Kp) + "}{s\\,(" + tx(tau) + "s + 1)}$. Hvaða $K$ í P-stýringu gefur skurðtíðnina $\\omega_c = " + tx(wc) + "$ rad/s?",
      answer: K, unit: "", tol: 0.015,
      sol: "<p>Skurðtíðni: $|K G_P(j\\omega_c)| = 1$, svo $K = \\dfrac{1}{|G_P(j\\omega_c)|} = \\dfrac{\\omega_c\\sqrt{1 + (\\tau\\omega_c)^2}}{" + tx(Kp) + "}$.</p>" +
        "<p>$K = \\dfrac{" + tx(wc) + "\\sqrt{1 + " + tx(tau * tau * wc * wc) + "}}{" + tx(Kp) + "} = " + tx(K) + "$. Fasaöryggið verður þá $90^\\circ - \\arctan(" + tx(tau * wc) + ") = " + tx(pm) + "^\\circ$.</p>",
    };
  });

  G.push(function pdLead() {
    var TD = pick([0.1, 0.2, 0.5, 1]), w = pick([0.5, 1, 2, 4, 5]);
    var lead = Math.atan(w * TD) * R2D;
    return {
      topic: "styringar", title: "Fasahækkun PD",
      text: "PD-stýring $G_C = K(1 + " + tx(TD) + "s)$. Hversu mikla fasahækkun (í gráðum) gefur hún við $\\omega = " + tx(w) + "$ rad/s?",
      answer: lead, unit: "°", tol: 0.01,
      sol: "<p>$\\arg(1 + jT_D\\omega) = \\arctan(T_D\\omega) = \\arctan(" + tx(TD * w) + ") = " + tx(lead) + "^\\circ$.</p>" +
        "<p>Hámarkið er $90^\\circ$ þegar $\\omega \\gg 1/T_D$, en þá vex mögnunin líka (hátíðnisuð).</p>",
    };
  });

  G.push(function piPhaseLoss() {
    var ratio = pick([2, 3, 4, 5, 10]), wc = pick([0.5, 1, 2, 5]);
    var TI = ratio / wc, ph = Math.atan(wc * TI) * R2D - 90;
    return {
      topic: "styringar", title: "Fasatap PI",
      text: "PI-stýring $G_C = K\\dfrac{1 + T_Is}{T_Is}$ með $\\omega_I = \\omega_c/" + ratio + "$ og $\\omega_c = " + tx(wc) + "$ rad/s. Hver er fasi stýringarinnar (í gráðum) við $\\omega_c$?",
      answer: ph, unit: "°", tol: 0.015, absTol: 0.2,
      sol: "<p>$T_I = 1/\\omega_I = " + ratio + "/" + tx(wc) + " = " + tx(TI) + "$ s. Fasi PI: $\\arctan(\\omega T_I) - 90^\\circ$.</p>" +
        "<p>Við $\\omega_c$: $\\arctan(" + tx(wc * TI) + ") - 90^\\circ = " + tx(ph) + "^\\circ$. Þetta er fasaöryggið sem I-liðurinn kostar" + (ratio === 5 ? " (regla heftisins, $\\omega_I = 0{,}2\\omega_c$, kostar um $11^\\circ$; þess vegna er bætt $0{,}06\\pi \\approx 11^\\circ$ við fasaöryggið)." : ".") + "</p>",
    };
  });

  G.push(function pmIntegrator() {
    var K = pick([0.5, 1, 2, 4, 5, 10]), tau = pick([0.1, 0.2, 0.5, 1]);
    var wc = Math.sqrt((-1 + Math.sqrt(1 + 4 * tau * tau * K * K)) / (2 * tau * tau)), pm = 90 - Math.atan(tau * wc) * R2D;
    return {
      topic: "styringar", title: "Fasaöryggi með P-stýringu",
      text: "Lykkjan er $G_K = \\dfrac{" + tx(K) + "}{s\\,(" + tx(tau) + "s + 1)}$. Hvert er fasaöryggið (í gráðum)?",
      answer: pm, unit: "°", tol: 0.015,
      sol: "<p>Skurðtíðni: $\\omega_c\\sqrt{1 + (\\tau\\omega_c)^2} = K$. Með $x = \\omega_c^2$: $\\tau^2x^2 + x - K^2 = 0$, svo $x = \\dfrac{-1 + \\sqrt{1 + 4\\tau^2K^2}}{2\\tau^2} = " + tx(wc * wc) + "$ og $\\omega_c = " + tx(wc) + "$ rad/s.</p>" +
        "<p>Fasi: $-90^\\circ - \\arctan(" + tx(tau * wc) + ") = " + tx(-90 - Math.atan(tau * wc) * R2D) + "^\\circ$, svo $\\varphi_m = 180^\\circ " + sg(-90 - Math.atan(tau * wc) * R2D) + "^\\circ = " + tx(pm) + "^\\circ$.</p>",
    };
  });

  G.push(function pdCancel() {
    var T1 = pick([0.5, 1, 2]), T2 = pick([0.05, 0.1, 0.2]), pmT = pick([45, 50, 60]);
    var wc = Math.tan(((90 - pmT) * Math.PI) / 180) / T2, K = wc * Math.sqrt(1 + T2 * T2 * wc * wc), askK = Math.random() < 0.5;
    return {
      topic: "styringar", title: "PD sem styttir út pól",
      text: "Lykkjan án stýringar er $G_K = \\dfrac{1}{s\\,(1 + " + tx(T1) + "s)(1 + " + tx(T2) + "s)}$. Þú velur PD-stýringu $K(1 + T_Ds)$ með $T_D = " + tx(T1) + "$ s og vilt fasaöryggi $" + pmT + "^\\circ$. Hvað verður " + (askK ? "$K$" : "$\\omega_c$ (rad/s)") + "?",
      answer: askK ? K : wc, unit: askK ? "" : "rad/s", tol: 0.015,
      sol: "<p>$T_D = T_1$ styttir út hægari pólinn: $G_CG_K = \\dfrac{K}{s\\,(1 + " + tx(T2) + "s)}$, með fasa $-90^\\circ - \\arctan(" + tx(T2) + "\\omega)$.</p>" +
        "<p>$\\varphi_m = " + pmT + "^\\circ \\Rightarrow \\arctan(" + tx(T2) + "\\omega_c) = " + (90 - pmT) + "^\\circ \\Rightarrow \\omega_c = \\dfrac{\\tan " + (90 - pmT) + "^\\circ}{" + tx(T2) + "} = " + tx(wc) + "$ rad/s.</p>" +
        "<p>$|G_CG_K(j\\omega_c)| = 1 \\Rightarrow K = \\omega_c\\sqrt{1 + (" + tx(T2) + "\\omega_c)^2} = " + tx(K) + "$. Rístími um $1{,}4/\\omega_c = " + tx(1.4 / wc) + "$ s. (Sama aðferð og í lokaprófinu 2024 S6.)</p>",
    };
  });

  G.push(function piGainLF() {
    var K = pick([1, 2, 5]), TI = pick([1, 2, 5, 10]), w = pick([0.01, 0.02, 0.05, 0.1]);
    var mag = (K * Math.sqrt(1 + w * w * TI * TI)) / (w * TI);
    return {
      topic: "styringar", title: "Mögnun PI við lága tíðni",
      text: "PI-stýring með $K = " + K + "$ og $T_I = " + TI + "$ s. Hver er mögnun stýringarinnar $|G_C(j\\omega)|$ við $\\omega = " + tx(w) + "$ rad/s?",
      answer: mag, unit: "", tol: 0.015,
      sol: "<p>$|G_C(j\\omega)| = K\\dfrac{\\sqrt{1 + (\\omega T_I)^2}}{\\omega T_I} = " + K + "\\cdot\\dfrac{\\sqrt{1 + " + tx(w * w * TI * TI) + "}}{" + tx(w * TI) + "} = " + tx(mag) + "$.</p>" +
        "<p>Við lágar tíðnir er þetta um $\\dfrac{K}{T_I\\omega} = " + tx(K / (TI * w)) + "$: þess vegna mælir $K/T_I$ deyfingu lágtíðnitruflana.</p>",
    };
  });

  G.push(function pidPhase() {
    var TI = pick([1, 2, 5]), TD = pick([0.2, 0.5, 1]), w = pick([0.5, 1, 2, 4]), TF = round(0.3 * TD, 3);
    var ph = (Math.atan(w * TI) - Math.PI / 2 + Math.atan(w * TD) - Math.atan(w * TF)) * R2D;
    return {
      topic: "styringar", title: "Fasi PID-stýringar",
      text: "$G_C = K\\dfrac{1 + " + TI + "s}{" + TI + "s}\\cdot\\dfrac{1 + " + tx(TD) + "s}{1 + " + tx(TF) + "s}$. Hver er fasi stýringarinnar (í gráðum) við $\\omega = " + tx(w) + "$ rad/s?",
      answer: ph, unit: "°", tol: 0.015, absTol: 0.3,
      sol: "<p>Fasarnir leggjast saman: $\\arctan(\\omega T_I) - 90^\\circ + \\arctan(\\omega T_D) - \\arctan(\\omega T_F)$.</p>" +
        "<p>$= " + tx(Math.atan(w * TI) * R2D) + "^\\circ - 90^\\circ + " + tx(Math.atan(w * TD) * R2D) + "^\\circ - " + tx(Math.atan(w * TF) * R2D) + "^\\circ = " + tx(ph) + "^\\circ$.</p>",
    };
  });

  /* --- Líkanagerð --- */
  G.push(function linTank() {
    var A = pick([1, 2, 4]), a = pick([0.01, 0.02, 0.05]), h0 = pick([0.5, 1, 2, 4]), g = 9.81;
    var T = (A / a) * Math.sqrt((2 * h0) / g);
    return {
      topic: "likan", title: "Línuleg nálgun á tanki",
      text: "Tankur með botnflöt $A = " + A + "$ m² og úttaksop $a = " + tx(a) + "$ m² ($q = a\\sqrt{2gh}$) er í jafnvægi við $h_0 = " + tx(h0) + "$ m. Hver er tímastuðull línulega líkansins um þennan vinnupunkt (í s)?",
      answer: T, unit: "s", tol: 0.015,
      sol: "<p>Taylor: $\\hat q = q_0 + a\\sqrt{\\tfrac{g}{2h_0}}\\,(h - h_0)$. Með $A\\dot h = v - q$ fæst $T\\dot{\\hat q} + \\hat q = v$ með (jafna 4.13)</p>" +
        "$$T = \\frac{A}{a}\\sqrt{\\frac{2h_0}{g}} = \\frac{" + A + "}{" + tx(a) + "}\\sqrt{\\frac{2\\cdot" + tx(h0) + "}{9{,}81}} = " + tx(T) + "\\ \\mathrm{s}$$" +
        "<p>Tímastuðullinn vex með $\\sqrt{h_0}$: stikar línulegs líkans eru háðir vinnupunktinum.</p>",
    };
  });

  G.push(function rlcParams() {
    var L = pick([0.01, 0.1, 0.5, 1]), C = pick([1e-6, 1e-5, 1e-4]), R = pick([10, 20, 50, 100, 200]);
    var wn = 1 / Math.sqrt(L * C), z = (R / 2) * Math.sqrt(C / L), askZ = Math.random() < 0.5;
    return {
      topic: "likan", title: "RLC-rás",
      text: "RLC í röð með $R = " + R + "\\ \\Omega$, $L = " + tx(L) + "$ H og $C = " + tx(C * 1e6) + "\\ \\mu$F. Úttakið er spennan yfir þéttinn. Hvert er " + (askZ ? "dempunarhlutfallið $\\zeta$" : "$\\omega_n$ (rad/s)") + "?",
      answer: askZ ? z : wn, unit: askZ ? "" : "rad/s", tol: 0.015,
      sol: "<p>$\\ddot v_C + \\dfrac{R}{L}\\dot v_C + \\dfrac{1}{LC}v_C = \\dfrac{1}{LC}v$ (jafna 6.13). Borið saman við $s^2 + 2\\zeta\\omega_ns + \\omega_n^2$:</p>" +
        "<p>$\\omega_n = \\dfrac{1}{\\sqrt{LC}} = " + tx(wn) + "$ rad/s, $\\quad \\zeta = \\dfrac{R/L}{2\\omega_n} = \\dfrac{R}{2}\\sqrt{\\dfrac{C}{L}} = " + tx(z) + "$.</p>",
    };
  });

  G.push(function ovenModel() {
    var R = pick([0.01, 0.02, 0.05]), C = pick([2000, 5000, 10000, 20000]), P = pick([500, 1000, 2000]), T2 = pick([0, 5, 15, 20]);
    var Tss = T2 + R * P, tau = R * C, askT = Math.random() < 0.5;
    return {
      topic: "likan", title: "Ofn (varmi)",
      text: "Ofn með varmarýmd $C = " + C + "$ J/°C er hitaður með $P = " + P + "$ W. Varmaviðnám veggjanna er $R = " + tx(R) + "$ °C/W og hitinn úti er $" + T2 + "$ °C. " + (askT ? "Hver verður hitinn inni í jafnvægi (°C)?" : "Hver er tímastuðull ofnsins (í s)?"),
      answer: askT ? Tss : tau, unit: askT ? "°C" : "s", tol: 0.01,
      sol: "<p>Orkujafnvægi: $C\\dot T_1 = P - \\dfrac{T_1 - T_2}{R} \\Rightarrow RC\\dot T_1 + T_1 = RP + T_2$ (dæmi 8.1.1).</p>" +
        "<p>Jafnvægi: $T_1 = T_2 + RP = " + T2 + " + " + tx(R * P) + " = " + tx(Tss) + "$ °C. Tímastuðull: $\\tau = RC = " + tx(tau) + "$ s.</p>",
    };
  });

  /* --- Nemar --- */
  G.push(function sensorSettle() {
    var tau = pick([5, 10, 20, 50, 100]), p = pick([90, 95, 99]);
    var t = -tau * Math.log(1 - p / 100);
    return {
      topic: "nemar", title: "Tími að ná hlutfalli",
      text: "Nemi er fyrstu gerðar með tímastuðul $\\tau = " + tau + "$ ms. Hversu langan tíma (ms) tekur að ná $" + p + "\\,\\%$ af lokagildi eftir þrepbreytingu?",
      answer: t, unit: "ms", tol: 0.015,
      sol: "<p>$1 - e^{-t/\\tau} = " + tx(p / 100) + " \\Rightarrow t = -\\tau\\ln(1 - " + tx(p / 100) + ") = " + tau + "\\cdot" + tx(-Math.log(1 - p / 100)) + " = " + tx(t) + "$ ms.</p>",
    };
  });

  G.push(function adcRes() {
    var n = pick([8, 10, 12, 16]), lo = pick([0, -20, 50]), span = pick([100, 150, 200, 500]);
    var res = span / Math.pow(2, n);
    return {
      topic: "nemar", title: "Upplausn A/D-breytis",
      text: "Hitanemi með mælisvið $" + lo + "$ til $" + (lo + span) + "\\,^\\circ$C er lesinn með $" + n + "$ bita A/D-breyti sem nær yfir allt úttak nemans. Hver er upplausnin í °C?",
      answer: res, unit: "°C", tol: 0.01,
      sol: "<p>$" + n + "$ bitar gefa $2^{" + n + "} = " + Math.pow(2, n) + "$ þrep yfir mælisviðið: $\\dfrac{" + span + "}{" + Math.pow(2, n) + "} = " + tx(res) + "\\,^\\circ$C.</p>",
    };
  });

  G.push(function mAinverse() {
    var lo = pick([0, 50, 100]), span = pick([100, 150, 200]), I = round(4 + 16 * pick([0.1, 0.25, 0.4, 0.6, 0.75, 0.9]), 2);
    var T = lo + ((I - 4) / 16) * span;
    return {
      topic: "nemar", title: "Hiti út frá 4-20 mA",
      text: "4-20 mA hitanemi hefur mælisvið $" + lo + "$-$" + (lo + span) + "\\,^\\circ$C. Úttakið mælist $" + tx(I) + "$ mA. Hver er hitinn (°C)?",
      answer: T, unit: "°C", tol: 0.01,
      sol: "<p>Næmni: $16/" + span + " = " + tx(16 / span) + "$ mA/°C, og 4 mA svara til $" + lo + "\\,^\\circ$C.</p><p>$T = " + lo + " + \\dfrac{" + tx(I) + " - 4}{16}\\cdot" + span + " = " + tx(T) + "\\,^\\circ$C.</p>",
    };
  });

  /* --- Hreyflar --- */
  G.push(function vaForPmax() {
    var kt = pick([0.08, 0.1, 0.12, 0.15]), R = pick([1, 1.5, 2]), kfk = pick([8, 10, 12, 15]), P = pick([20, 30, 40, 50]);
    var kf = KF_SI(kfk), va = Math.sqrt((4 * R * kf * P) / kt);
    return {
      topic: "hreyflar", title: "Spenna fyrir hámarksafl",
      text: "Jafnstraumshreyfill hefur $K_\\tau = " + tx(kt) + "$ Nm/A, $K_f = " + kfk + "$ V/1000 RPM og $R = " + tx(R) + "\\ \\Omega$ ($L \\approx 0$). Hve háa innspennu (V) þarf til að hámarksaflið verði $" + P + "$ W?",
      answer: va, unit: "V", tol: 0.015,
      sol: "<p>$P_{max} = \\dfrac{\\tau_s\\omega_0}{4} = \\dfrac{1}{4}\\cdot\\dfrac{K_\\tau v_a}{R}\\cdot\\dfrac{v_a}{K_f} = \\dfrac{K_\\tau}{4RK_f}v_a^2$, með $K_f = " + kfk + "/104{,}72 = " + tx(kf) + "$ V·s/rad.</p>" +
        "<p>$v_a = \\sqrt{\\dfrac{4RK_fP}{K_\\tau}} = \\sqrt{\\dfrac{4\\cdot" + tx(R) + "\\cdot" + tx(kf) + "\\cdot" + P + "}{" + tx(kt) + "}} = " + tx(va) + "$ V. (Sjá lokapróf 2024 S3.)</p>",
    };
  });

  /* ---------- Skilningsspurningar (val) ---------- */
  var MC = [
    { topic: "nemar", q: "Nemi gefur alltaf 25,3 °C þegar hitinn er í raun 24,0 °C, en gildið breytist ekkert milli endurtekinna mælinga. Hvað lýsir þessu best?",
      o: ["Góð endurtekningarhæfni en léleg nákvæmni", "Léleg endurtekningarhæfni og góð nákvæmni", "Of lítil upplausn", "Of stórt deyðubil"], c: 0,
      e: "Nákvæmni er hversu nálægt mælt gildi er því rétta. Endurtekningarhæfni er hvort sama mæling gefur sömu niðurstöðu. Hér er seinni hlutinn góður en sá fyrri slæmur." },
    { topic: "nemar", q: "Hvað segir tímastuðull nema?", o: ["Hversu hratt hann kemst í jafnvægi (63 % eftir einn tímastuðul)", "Hversu nákvæmur hann er", "Hversu breitt mælisviðið er", "Hversu mikið úttakið breytist fyrir hverja einingu inntaks"], c: 0,
      e: "Tímastuðull lýsir hraða, ekki nákvæmni. Seinasti valkosturinn er næmni." },
    { topic: "nemar", q: "Hvað er upplausn nema?", o: ["Minnsta breyting í inntaki sem veldur greinanlegri breytingu í úttaki", "Bil þar sem inntaksbreyting veldur engri úttaksbreytingu", "Hlutfall frávika frá beinni línu", "Hæsta gildi sem hann getur mælt"], c: 0,
      e: "Annar valkosturinn er deyðubil, sá þriðji frávik frá línuleika og sá fjórði er hluti af mælisviði." },
    { topic: "nemar", q: "Hvað einkennir virkan nema?", o: ["Hann þarf utanaðkomandi orkugjafa", "Orkan sem knýr mælinguna kemur frá mælistærðinni sjálfri", "Hann gefur alltaf stafrænt úttak", "Hann hefur alltaf tímastuðul undir 1 s"], c: 0,
      e: "Óvirkur nemi fær orkuna frá mælistærðinni (t.d. þrýstingi). Ef úttakið er rafmerki eru flestir nemar virkir." },
    { topic: "nemar", q: "Þú átt að mæla hita á bilinu 90-130 °C. Nemi A hefur mælisvið 0-100 °C og tímastuðul 2 s. Nemi B hefur 0-150 °C og tímastuðul 2,5 s. Hvað ræður úrslitum?", o: ["Mælisviðið: aðeins B nær yfir allt bilið", "Tímastuðullinn: A er hraðari", "Úttaksspennan", "Ekkert, þeir eru jafn góðir"], c: 0,
      e: "Fyrst þarf neminn að ná yfir bilið sem á að mæla. Hraði og línuleiki A skipta ekki máli ef hann getur ekki mælt yfir 100 °C." },
    { topic: "nemar", q: "4-20 mA hitanemi með mælisvið 100-200 °C. Hvað er úttakið við 100 °C?", o: ["4 mA", "0 mA", "20 mA", "12 mA"], c: 0,
      e: "Neðri mörk mælisviðsins samsvara neðri mörkum úttaksins. Yfirfærslufallið lýsir breytingum frá vinnupunkti, en raunverulegt úttak inniheldur 4 mA hliðrunina." },
    { topic: "nemar", q: "Fyrstu gerðar nemi með tímastuðul 5 s. Um það bil hversu lengi þarf að bíða eftir 98 % af lokagildi?", o: ["20 s", "5 s", "10 s", "50 s"], c: 0, e: "$1 - e^{-4} = 98{,}2\\,\\%$, svo $4\\tau = 20$ s." },
    { topic: "nemar", q: "Hvenær er stafsetjari (A/D-breytir) nauðsynlegur?", o: ["Þegar nemi gefur hliðrænt (samfellt) merki sem fer í tölvu", "Þegar nemi gefur púlsa, t.d. kóðaskífa", "Aldrei, tölvur lesa hliðræn merki beint", "Aðeins fyrir óvirka nema"], c: 0, e: "Stafrænir nemar skila púlsum sem tölvan les beint. Hliðræn merki þarf að stafsetja." },

    { topic: "hreyflar", q: "Hvað gerist með vægi jafnstraumshreyfils þegar hraðinn eykst (föst inngangsspenna)?", o: ["Það minnkar línulega vegna bakspennunnar", "Það eykst línulega", "Það helst fast", "Það eykst með öðru veldi"], c: 0, e: "$\\tau = \\frac{K_\\tau}{R}(v_a - K_f\\omega)$: spanspennan vinnur gegn strauminum og þar með vægið." },
    { topic: "hreyflar", q: "Við hvaða hraða skilar hreyfillinn hámarksafli?", o: ["Helmingi lausagangshraða", "Í lausagangi", "Í kyrrstöðu", "Við málhraða"], c: 0, e: "$P = \\tau_s\\omega(1-\\omega/\\omega_0)$ er parabóla með topp við $\\omega_0/2$." },
    { topic: "hreyflar", q: "Hvað er $K_f = 11$ V/1000 RPM í V·s/rad?", o: ["0,105", "11", "0,0105", "1,05"], c: 0, e: "$1000\\ \\mathrm{RPM} = 104{,}72$ rad/s, svo $11/104{,}72 = 0{,}105$." },
    { topic: "hreyflar", q: "Hver er rafrænn tímastuðull jafnstraumshreyfils?", o: ["$L/R$", "$I/c$", "$R/L$", "$K_\\tau/K_f$"], c: 0, e: "Straumurinn er fyrstu gerðar með $\\tau_e = L/R$. $I/c$ er (næstum) vélræni tímastuðullinn." },
    { topic: "hreyflar", q: "Hreyfill lyftir hlut með jöfnum hraða. Hvað þarf vægið að vera?", o: ["Núningsvægi plús $m g r$", "$m g r$ mínus núningsvægi", "Upphafsvægið", "Núll"], c: 0, e: "Í jafnvægi þarf hreyfillinn að sigrast á núningi og þyngdarkrafti: $\\tau_m = \\tau_n + m g r$." },
    { topic: "hreyflar", q: "Af hverju nær hornhraði hreyfilsins jafnvægi?", o: ["Spanspennan og snúningsdeyfingin vinna gegn auknum hraða", "Hann er takmarkaður við 15 V", "Segulsviðið veikist", "Straumvendirinn stöðvar hann"], c: 0, e: "Bakspennan minnkar strauminn þegar hraðinn vex og deyfingin eykur mótstöðuvægið." },
    { topic: "hreyflar", q: "Ef spanið er hverfandi, hvers konar kerfi er yfirfærslufallið frá inngangsspennu til hornhraða?", o: ["Fyrstu gerðar", "Annarrar gerðar", "Hreint heildi", "Núllta gerðar"], c: 0, e: "$G_P = \\dfrac{K_\\tau/R}{Is + c + K_\\tau K_f/R}$: ein tregða, svo einn tímastuðull." },

    { topic: "stjornkerfi", q: "Hvenær er sjálfvirkt stýrikerfi óstöðugt, skv. Bode-riti lykkjunnar?", o: ["Þegar $|G_K(j\\omega_\\pi)| \\ge 1$", "Þegar $|G_K(j\\omega_c)| \\ge 1$", "Þegar $\\omega_c < \\omega_\\pi$", "Þegar fasaöryggið er 45°"], c: 0, e: "Við $\\omega_\\pi$ er fasinn $-180^\\circ$. Ef mögnunin er þá enn 1 eða meira verður afturvirknin jákvæð og styrkist." },
    { topic: "stjornkerfi", q: "Hrein seinkun $e^{-Ls}$ í lykkjunni hefur áhrif á:", o: ["Fasann: fasaöryggið minnkar, $\\omega_c$ breytist ekki", "Mögnunina: $\\omega_c$ færist", "Hvorugt", "Bæði mögnun og fasa"], c: 0, e: "$|e^{-j\\omega L}| = 1$, fasinn er $-\\omega L$." },
    { topic: "stjornkerfi", q: "Lykkjan er tegund 1. Hvað gerist við flái í óskgildi?", o: ["Skekkjan verður fasti ($1/K_v$)", "Skekkjan verður 0", "Skekkjan vex án takmarka", "Kerfið verður óstöðugt"], c: 0, e: "Tegund 0: óendanleg skekkja við fláa; tegund 1: fasti; tegund 2 eða hærri: núll." },
    { topic: "stjornkerfi", q: "Stýringin er P-stýring, ferlið inniheldur heildun og þrepatruflun kemur inn á milli þeirra. Hver er skekkjan í jafnvægi?", o: ["Fasti sem er ekki núll", "Núll", "Óendanleg", "Fer eftir stærð $K$ aðeins"], c: 0, e: "Til að eyða skekkju vegna þrepatruflunar þarf heildunarþátt í <i>stýringunni</i> (á undan truflunni). Sýnidæmi 3 gefur $-1/3$." },
    { topic: "stjornkerfi", q: "Hvað eiga öll yfirfærsluföll frá inntökum (R, V₁, V₂, W) að úttaki sameiginlegt?", o: ["Sama nefnara: $1 + G_K$", "Sama teljara", "Sömu mögnun", "Ekkert"], c: 0, e: "Þess vegna er yfirfærslufall lykkjunnar svo mikilvægt fyrir alla eiginleika." },
    { topic: "stjornkerfi", q: "Hver er þumalputtareglan fyrir rístíma?", o: ["$t_r \\approx 1{,}4/\\omega_c$", "$t_r \\approx \\omega_c/1{,}4$", "$t_r \\approx 4\\tau$", "$t_r \\approx 1/\\omega_\\pi$"], c: 0, e: "Hærri skurðtíðni þýðir hraðari svörun." },
    { topic: "stjornkerfi", q: "Hvar getur afturvirkni <i>aukið</i> áhrif truflunar miðað við kerfi án afturvirkni?", o: ["Við tíðnir í kringum og yfir $\\omega_c$", "Við mjög lágar tíðnir", "Við $\\omega = 0$", "Aldrei"], c: 0, e: "Við lágar tíðnir ($|G_K| \\gg 1$) deyfir afturvirknin. Nálægt $\\omega_c$ geta mögnunarferlarnir skorist og truflunin magnast (próf 2021 S2)." },
    { topic: "stjornkerfi", q: "Hvað gerist þegar $K$ í P-stýringu hækkar?", o: ["Fasaöryggið minnkar", "Skurðtíðnin lækkar", "Skekkja í jafnvægi eykst (tegund 0)", "Stýrimerkið veikist"], c: 0, e: "$\\omega_c$ færist til hægri þar sem fasinn er lægri, svo $\\varphi_m$ minnkar. Hin atriðin fara öfugt." },
    { topic: "stjornkerfi", q: "Lokagildissetningin $e_{ss} = \\lim_{s\\to0}sE(s)$ gefur marktækt svar því aðeins að:", o: ["Lokaða kerfið sé stöðugt", "Kerfið sé fyrstu gerðar", "Óskgildið sé þrep", "Stýringin sé P-stýring"], c: 0, e: "Ef kerfið er óstöðugt nálgast skekkjan ekki tilgreint gildi (próf 2023 S2 er slíkt dæmi)." },
    { topic: "stjornkerfi", q: "Öldrun breytir næmni nemans $G_S$ um 10 %. Hvað gerist þegar $|G_K| \\gg 1$?", o: ["Heildarkerfið breytist um nær 10 % líka: afturvirknin bætir ekki upp skekkjur í nemanum", "Afturvirknin eyðir áhrifunum, eins og fyrir breytileika í ferlinu", "Aðeins stöðugleikinn breytist, mögnunin ekki", "Ekkert gerist, því nemar hafa enga hreyfifræði"], c: 0, e: "$S^{G_T}_{G_S} = -G_K/(1+G_K) \\approx -1$ þegar lykkjan er há. Fyrir ferlið er $S = 1/(1+G_K) \\approx 0$. Nemi þarf því að vera nákvæmur." },
    { topic: "stjornkerfi", q: "Hvað þýðir að pólar kerfis séu í vinstra hálfplani?", o: ["Kerfið er stöðugt", "Kerfið er óstöðugt", "Kerfið er á mörkum stöðugleika", "Kerfið hefur enga seinkun"], c: 0, e: "Pólar með neikvæðan rauntöluhluta gefa þverrandi veldisvísa." },
    { topic: "stjornkerfi", q: "Heppilegt fasaöryggi og mögnunaröryggi eru venjulega:", o: ["30°-60° og 2-5", "5°-10° og 1-1,2", "90°-120° og 10-20", "0° og 1"], c: 0, e: "Glæra 8 í V8." },

    { topic: "styringar", q: "Hver er helsti kostur PI-stýringar umfram P?", o: ["Hún eyðir skekkju í jafnvægi", "Hún eykur stöðugleika", "Hún veikir stýrimerki á háum tíðnum", "Hún hraðar svörun"], c: 0, e: "Heildunin gerir lykkjuna tegund 1. Gallinn er að stöðugleikinn minnkar." },
    { topic: "styringar", q: "Hvað gerir PD-stýring?", o: ["Gefur jákvæða fasahliðrun og eykur stöðugleika, en eykur stýrimerki á háum tíðnum", "Eyðir skekkju í jafnvægi", "Lækkar mögnun við háar tíðnir", "Minnkar $\\omega_c$"], c: 0, e: "$1 + T_Ds$ gefur allt að $+90^\\circ$ fasa og eykur mögnun á hærri tíðnum." },
    { topic: "styringar", q: "Af hverju er lághleypisía ($1+T_Fs$) sett með diffrun í PID-stýringu?", o: ["Hrein diffrun magnar hátíðnisuð óendanlega mikið", "Til að eyða skekkju í jafnvægi", "Til að auka fasann við lágar tíðnir", "Til að lækka $K$"], c: 0, e: "Með síunni verður hátíðnimögnunin $K\\,T_D/T_F$ (endanleg)." },
    { topic: "styringar", q: "Hvaða regla er notuð til að velja $\\omega_I$ í PI-stýringu?", o: ["$\\omega_I = 0{,}2\\,\\omega_c$", "$\\omega_I = 5\\,\\omega_c$", "$\\omega_I = \\omega_\\pi$", "$\\omega_I = 0{,}2\\,\\omega_\\pi$"], c: 0, e: "Heildunin er höfð töluvert neðan við $\\omega_c$ svo hún éti ekki of mikið fasaöryggi." },
    { topic: "styringar", q: "Hvaða bil er notað fyrir $\\omega_D$ í PD-stýringu?", o: ["$0{,}8\\,\\omega_\\pi < \\omega_D < 1{,}5\\,\\omega_\\pi$", "$\\omega_D < 0{,}2\\,\\omega_c$", "$\\omega_D = 10\\,\\omega_c$", "$\\omega_D = \\omega_I$"], c: 0, e: "Fasahækkunin þarf að nást nálægt þeim stað þar sem fasinn nálgast $-180^\\circ$." },
    { topic: "styringar", q: "Hvaða stærð mælir deyfingu lágtíðnitruflana hjá PI/PID-stýringu?", o: ["$K/T_I$", "$K\\,T_D$", "$T_F$", "$\\omega_\\pi$"], c: 0, e: "Við lágar tíðnir er $|G_C| \\approx K/(T_I\\omega)$, svo hærra $K/T_I$ gefur meiri mögnun lykkjunnar." },
    { topic: "styringar", q: "Á bilinu hvað á $T_F$ að vera í PID-stýringu?", o: ["$0{,}2\\,T_D < T_F < 0{,}4\\,T_D$", "$T_F > 2\\,T_D$", "$T_F = T_I$", "$T_F < 0{,}01\\,T_D$"], c: 0, e: "Skref 3 í hönnunaruppskriftinni." },
    { topic: "styringar", q: "Þú ber saman tvær PI-stýringar með $T_I = 1$, önnur með $K = 3$ og hin með $K = 13$. Hvað segir $K$ eitt og sér um fasaöryggið?", o: ["Ekkert öruggt: þarf að reikna fasann við $\\omega_c$ hvorrar", "Hærra $K$ gefur alltaf meira fasaöryggi", "Lægra $K$ gefur alltaf minna fasaöryggi", "Fasaöryggið er óháð $K$"], c: 0, e: "Próf 2023 S4: $\\varphi_m \\approx 62^\\circ$ fyrir $K = 3$ og $\\approx 29^\\circ$ fyrir $K = 13$." },
    { topic: "likan", q: "Hvað þýðir að líkan sé línulegt?", o: ["Samlagningar- og einsleitniregla gilda: $au_1 + bu_2$ gefur $ay_1 + by_2$", "Úttakið er bein lína í tíma", "Það hefur aðeins eina breytu", "Það er fyrstu gerðar"], c: 0, e: "Kafli 4: viðlegðarregla (superposition) og einsleitniregla (homogeneity)." },
    { topic: "likan", q: "Af hverju eru líkön gerð um vinnupunkt?", o: ["Raunkerfi eru ólínuleg; frávik frá jafnvægi má nálga línulega", "Til að losna við upphafsskilyrði", "Svo kerfið verði stöðugt", "Það er krafa Laplace-vörpunar"], c: 0, e: "Fyrsta stigs Taylor-nálgun. Stikarnir verða háðir vinnupunktinum og nákvæmnin minnkar með stærra fráviki." },
    { topic: "likan", q: "Hvaða grunneining er EKKI til í varmakerfum?", o: ["Tregða", "Rýmd", "Viðnám", "Flæði"], c: 0, e: "Tafla 9.1: varmakerfi hafa aðeins varmarýmd og varmaviðnám, svo þau sveiflast ekki af sjálfu sér." },
    { topic: "likan", q: "Í rafrás er spenna áreynslubreyta. Hver er samsvarandi breyta í vökvakerfi?", o: ["Þrýstingur", "Rúmmálsflæði", "Hæð", "Massi"], c: 0, e: "Áreynsla: kraftur, vægi, spenna, þrýstingur, hitastig. Flæði: hraði, straumur, rúmmálsflæði, varmaflæði." },
    { topic: "likan", q: "Hvað jafngildir spólu $L$ í vélrænu kerfi (lína)?", o: ["Massi $m$", "Fjöður $k$", "Dempari $c$", "Kraftur $F$"], c: 0, e: "RLC: $L\\ddot q + R\\dot q + q/C = v$ og $m\\ddot x + c\\dot x + kx = F$: $L\\leftrightarrow m$, $R\\leftrightarrow c$, $1/C\\leftrightarrow k$." },
    { topic: "likan", q: "Hvernig hagar þéttir sér í jafnvægi (DC)?", o: ["Eins og opin rás (enginn straumur)", "Eins og leiðari (engin spenna)", "Eins og viðnám $1/C$", "Hann afhleðst alltaf"], c: 0, e: "$i = C\\,dv/dt = 0$ þegar spennan er föst. Spóla er öfugt: eins og leiðari." },
    { topic: "likan", q: "Tvær jafnstífar fjaðrir $k$ eru raðtengdar. Jafngildisstífnin er:", o: ["$k/2$", "$2k$", "$k$", "$k^2$"], c: 0, e: "Sami kraftur, færslurnar leggjast saman: $1/k_{eq} = 1/k + 1/k$." },
    { topic: "likan", q: "Hver eru þrjú skref líkanagerðar út frá náttúrulögmálum?", o: ["Afmörkun og uppskipting, grunnjöfnur, diffurjafna fyrir heildina", "Mæla, herma, hanna", "Laplace, blokkrit, Bode", "Kröfur, hönnun, sannprófun"], c: 0, e: "Kafli 4. Leiðin út frá mælingum (system identification) skiptir skrefi 2 út fyrir mælingar á svörun." },
    { topic: "likan", q: "Tankur með útflæði $q_2 = h/R$ og botnflöt $A$. Tímastuðullinn er:", o: ["$AR$", "$A/R$", "$R/A$", "$\\sqrt{AR}$"], c: 0, e: "$A\\dot h = q_1 - h/R \\Rightarrow AR\\,\\dot h + h = Rq_1$." },

    { topic: "svorun", q: "Hvar þurfa allir pólar stöðugs kerfis að vera?", o: ["Í vinstra hálfplani (neikvæður raunhluti)", "Á $j\\omega$-ásnum", "Í hægra hálfplani", "Á raunásnum"], c: 0, e: "Ein rót í hægra hálfplani nægir til að kerfið sé óstöðugt (mynd 12.1)." },
    { topic: "svorun", q: "Pólar eru $-2 \\pm 5j$. Hvað segir þverhlutinn (5)?", o: ["Sveiflutíðnina $\\omega_d$", "Dempunina (tímastuðul)", "Jafnvægisgildið", "Stöðugleikann"], c: 0, e: "Raunhlutinn (−2) segir hversu hratt sveiflan dofnar: $\\tau = 1/2$ s. Þverhlutinn er $\\omega_d = 5$ rad/s." },
    { topic: "svorun", q: "Hvenær hefur annarrar gerðar kerfi yfirskot í þrepasvörun?", o: ["Þegar $0 < \\zeta < 1$", "Þegar $\\zeta > 1$", "Þegar $\\zeta = 1$", "Alltaf"], c: 0, e: "Samoka tvinntölurætur. $\\zeta \\ge 1$ gefur raunrætur og ekkert yfirskot." },
    { topic: "svorun", q: "Hversu langt er fyrstu gerðar kerfi komið eftir einn tímastuðul?", o: ["63 %", "50 %", "86 %", "98 %"], c: 0, e: "$1 - e^{-1} = 0{,}632$. Eftir $4\\tau$: 98 %." },
    { topic: "laplace", q: "Hvað er Laplace-vörpun afleiðu $f'(t)$?", o: ["$sF(s) - f(0)$", "$F(s)/s$", "$F(s) - f(0)$", "$s^2F(s)$"], c: 0, e: "Diffrun verður margföldun með $s$; tegrun deiling með $s$." },
    { topic: "laplace", q: "Hrein seinkun um $T$ sekúndur, $f(t-T)$, í s-rúminu:", o: ["$F(s)e^{-Ts}$", "$F(s-T)$", "$F(s)/T$", "$F(s+T)$"], c: 0, e: "Hliðrunarreglan (regla 5)." },
    { topic: "laplace", q: "Lokagildisreglan segir $\\lim_{t\\to\\infty} f(t) =$", o: ["$\\lim_{s\\to0} sF(s)$", "$\\lim_{s\\to\\infty} sF(s)$", "$F(0)$", "$\\lim_{s\\to0} F(s)/s$"], c: 0, e: "Gildir aðeins ef markgildið er til (kerfið stöðugt)." },
    { topic: "laplace", q: "Raðtengd blokkrit $G_1$ og $G_2$ jafngilda:", o: ["$G_1G_2$", "$G_1 + G_2$", "$\\dfrac{G_1}{1+G_1G_2}$", "$G_1/G_2$"], c: 0, e: "Hliðtengd (lögð saman) gefa $G_1 + G_2$; afturvirkni gefur $\\dfrac{G}{1 \\pm GH}$." },
    { topic: "svorun", q: "Bode-rit fyrstu gerðar kerfis: halli mögnunar fyrir ofan $1/\\tau$?", o: ["−20 dB/dec", "−40 dB/dec", "0 dB/dec", "−3 dB/dec"], c: 0, e: "Við $\\omega = 1/\\tau$ (bandvídd) er mögnunin 3 dB undir láréttu aðfellunni og fasinn −45°." },
    { topic: "svorun", q: "Hvað gerist í tíðnisvörun annarrar gerðar kerfis þegar $\\zeta$ er lítið?", o: ["Toppur (resonance) nálægt $\\omega_n$", "Mögnunin fellur um −20 dB/dec", "Fasinn fer í +180°", "Engin breyting"], c: 0, e: "$M_r = \\dfrac{K}{2\\zeta\\sqrt{1-\\zeta^2}}$ fyrir $\\zeta \\le 1/\\sqrt2$. Yfir $\\omega_n$ fellur mögnunin um −40 dB/dec." },
    { topic: "svorun", q: "$G(s) = 3/s$ og inntakið er einingarþrep. Hvað gerist?", o: ["Úttakið vex línulega ($3t$) og nær ekki jafnvægi", "Úttakið verður 3", "Úttakið sveiflast", "Úttakið fer í 0"], c: 0, e: "Hreint heildi: $Y = 3/s^2 \\Rightarrow y = 3t$ (flái)." },

    { topic: "vinnuferli", q: "Hver er munurinn á þörfum og kröfum?", o: ["Þarfir eru markmið notenda á þeirra máli; kröfur eru mælanleg markmið hönnuðarins", "Það er enginn munur", "Kröfur koma frá notendum, þarfir frá hönnuði", "Þarfir eru alltaf mælanlegar"], c: 0, e: "Kafli 14. Kröfur (hönnunarforsendur) skulu allar vera mælanlegar." },
    { topic: "vinnuferli", q: "Hvað er sannprófun (verification)?", o: ["Að staðfesta að hönnun uppfylli kröfur", "Að staðfesta að hönnun uppfylli þarfir notenda", "Að gera líkan", "Að velja nema"], c: 0, e: "Réttmæti (validation) snýr að þörfum notenda. Hönnun getur staðist sannprófun en samt ekki uppfyllt þarfir." },
    { topic: "vinnuferli", q: "Hvenær er skilgreint hvernig kerfið verður sannprófað?", o: ["Samhliða því að kröfur eru settar, áður en hannað er", "Eftir útfærslu", "Aðeins ef eitthvað bregst", "Aldrei, það er gert með tilfinningu"], c: 0, e: "Skref 1 í vinnuferli heftisins: út frá kröfum er skilgreint hvernig heildarkerfið skuli sannprófað." },
    { topic: "vinnuferli", q: "Af hverju mælir heftið með að byrja á einfaldri stýringu?", o: ["Til að kynnast kerfinu og samsvörun líkans og raunveruleika áður en flækt er", "Einfaldar stýringar eru alltaf bestar", "Flóknar stýringar eru óstöðugar", "Til að spara tölvuafl"], c: 0, e: "Flóknari stýringar krefjast nákvæmari líkana; misræmi milli Laplace-heimsins og raunheims vex." },
    { topic: "vinnuferli", q: "Hverjar eru fjórar dæmigerðar einingar véleindakerfis?", o: ["Vélrænt kerfi, nemi, hreyfill og tölva", "Mótor, gír, hjól og rafhlaða", "Inntak, úttak, truflun og suð", "P, I, D og sía"], c: 0, e: "Kafli 3. Tölvan les nemann og stýrir hreyflinum (afturvirkni)." },
    { topic: "vinnuferli", q: "Hvaða tvo eiginleika hafa öll tæknileg kerfi skv. heftinu?", o: ["Þau eru samsett úr einingum sem eru sjálfar tæknileg kerfi, og þau nýta náttúrufyrirbæri", "Þau eru línuleg og tímaóháð", "Þau hafa tölvu og nema", "Þau eru stöðug og hröð"], c: 0, e: "Kafli 2.2: stigveldi eininga og nýting náttúrufyrirbæra." },
    { topic: "vinnuferli", q: "Lykkja án stýringar hefur heildi (fasi byrjar í −90°). Krafa um enga skekkju við þrep og meiri hraða og fasaöryggi. Hvaða stýring?", o: ["PD", "PI", "P", "PID"], c: 0, e: "Lokapróf 2024 S6: heildið eyðir skekkjunni nú þegar; D-liðurinn gefur fasann sem þarf við hærri $\\omega_c$." },
    { topic: "vinnuferli", q: "Ferli af tegund 0 (nær föstu gildi) á að verða hraðara, með lítið yfirskot og enga skekkju. Hvaða stýring?", o: ["PID", "PD", "P", "PI"], c: 0, e: "Lokapróf 2025 S6: I fyrir skekkjuna, D fyrir fasa/dempun þegar mögnunin er hækkuð." },

    /* ---------- Viðbót: Laplace og blokkrit ---------- */
    { topic: "laplace", q: "Hvað er Laplace-vörpun einingarþrepsins $u(t)$?", o: ["$1/s$", "$1$", "$1/s^2$", "$s$"], c: 0, e: "$\\int_0^\\infty e^{-st}dt = 1/s$ (jafna 10.24). $1$ er kippfallið og $1/s^2$ fláinn." },
    { topic: "laplace", q: "Hver er andhverfa vörpunin af $\\dfrac{1}{(s+a)^2}$?", o: ["$te^{-at}$", "$e^{-2at}$", "$e^{-at}/a$", "$t^2e^{-at}$"], c: 0, e: "Úr töflu 10.1. Tvöföld rót gefur þátt $t$ fyrir framan veldisfallið." },
    { topic: "laplace", q: "Hvað er $\\mathcal{L}[f(t)e^{-at}]$ ef $\\mathcal{L}[f(t)] = F(s)$?", o: ["$F(s+a)$", "$F(s-a)$", "$F(s)e^{-as}$", "$aF(s)$"], c: 0, e: "Dempun í tíma er hliðrun í s-rúminu. (Í heftinu stendur $F(s-a)$, sem er prentvilla.) $F(s)e^{-as}$ er hliðrun í tíma." },
    { topic: "laplace", q: "Hvers vegna þarf kerfið að vera í hvíld þegar yfirfærslufall er notað?", o: ["Yfirfærslufallið er skilgreint með öll upphafsgildi núll", "Annars er kerfið óstöðugt", "Laplace-vörpun er aðeins til fyrir $t > 0$", "Til að lokagildisreglan gildi"], c: 0, e: "$\\mathcal{L}[y'] = sY - y(0)$. Með $y(0) = 0$ fæst hreint margföldunarsamband $Y = G\\,U$." },
    { topic: "laplace", q: "Tvö yfirfærsluföll $G_1$ og $G_2$ eru hliðtengd (merkið skiptist og summurnar leggjast saman). Heildin er:", o: ["$G_1 + G_2$", "$G_1G_2$", "$\\dfrac{G_1}{1+G_1G_2}$", "$G_1/G_2$"], c: 0, e: "Raðtenging gefur margfeldi, hliðtenging summu, og afturvirkni $G/(1 \\pm GH)$ (tafla 11.1)." },
    { topic: "laplace", q: "Neikvæð afturvirkni: framleið $G$, afturvirkni $H$. Yfirfærslufallið er:", o: ["$\\dfrac{G}{1+GH}$", "$\\dfrac{G}{1-GH}$", "$\\dfrac{GH}{1+GH}$", "$G - H$"], c: 0, e: "$E = U - HY$, $Y = GE$ gefur $Y(1 + GH) = GU$." },
    { topic: "laplace", q: "Truflun $R$ kemur inn á milli hreyfils og vélræna kerfisins. Hvað eiga $Y/U$ og $Y/R$ sameiginlegt?", o: ["Sama nefnara $1 + G_K$ (sama lykkjan)", "Sama teljara", "Þau eru jöfn", "Ekkert"], c: 0, e: "Jöfnur 11.6 og 11.9: teljararnir eru ólíkir en nefnarinn er sá sami. Pólarnir (og stöðugleikinn) eru því þeir sömu." },
    { topic: "laplace", q: "$Y(s) = \\dfrac{2}{s(s+1)(s-3)}$. Hvað segir lokagildisreglan?", o: ["Hún gildir ekki: póll í $+3$ gerir kerfið óstöðugt", "$y(\\infty) = -2/3$", "$y(\\infty) = 0$", "$y(\\infty) = 2$"], c: 0, e: "Reglan krefst þess að markgildið sé til. Liðurinn $e^{3t}$ vex án takmarka, svo $-2/3$ væri rangt svar." },
    { topic: "laplace", q: "Hvernig er stuðullinn $k_i$ við einfalda rót $p_i$ fundinn í stofnbrotaliðun?", o: ["$k_i = (s-p_i)Y(s)|_{s=p_i}$", "$k_i = Y(p_i)$", "$k_i = \\dfrac{d}{ds}Y(s)|_{s=p_i}$", "$k_i = 1/p_i$"], c: 0, e: "Jafna 10.52: margfalda með $(s-p_i)$ og setja $s = p_i$, þá hverfa allir hinir liðirnir. Afleiða þarf aðeins fyrir margfaldar rætur." },
    { topic: "laplace", q: "Diffurjafnan er $y'' + 3y' + 2y = u' - 3u$. Hvert er yfirfærslufallið?", o: ["$\\dfrac{s-3}{s^2+3s+2}$", "$\\dfrac{s+3}{s^2+3s+2}$", "$\\dfrac{1}{s^2+3s+2}$", "$\\dfrac{s^2+3s+2}{s-3}$"], c: 0, e: "Afleiður af $u$ verða að margföldun með $s$ í teljaranum (dæmi 11.1.1 d). Núllpunkturinn er í $+3$." },
    { topic: "laplace", q: "Hvað gerist þegar tvö merki eru margfölduð saman í s-rúminu, $F_1(s)F_2(s)$?", o: ["Það samsvarar földun þeirra í tímarúminu", "Það samsvarar margföldun í tíma", "Það samsvarar samlagningu í tíma", "Það hefur enga merkingu"], c: 0, e: "Regla 4 (földun). Þess vegna er $Y = GU$ svo þægilegt: földun verður margföldun." },
    { topic: "laplace", q: "Hver er Laplace-vörpun $\\sin(at)$?", o: ["$\\dfrac{a}{s^2+a^2}$", "$\\dfrac{s}{s^2+a^2}$", "$\\dfrac{1}{s+a}$", "$\\dfrac{a}{s^2-a^2}$"], c: 0, e: "$\\dfrac{s}{s^2+a^2}$ er $\\cos(at)$." },
    { topic: "laplace", q: "Margliða nefnara $Y(s)$ hefur samoka tvinnrætur $-\\sigma \\pm j\\omega$. Hvaða föll koma fyrir í $y(t)$?", o: ["$e^{-\\sigma t}\\cos\\omega t$ og $e^{-\\sigma t}\\sin\\omega t$", "$e^{-\\sigma t}$ og $te^{-\\sigma t}$", "$\\cos\\omega t$ eingöngu", "$e^{\\omega t}$ og $e^{-\\omega t}$"], c: 0, e: "Jafna 10.55 og töflur 10.74-10.75. Raunhlutinn ræður dempun, þverhlutinn sveiflutíðni." },
    { topic: "laplace", q: "Hvað segir upphafsgildisreglan?", o: ["$\\lim_{t\\to0^+}f(t) = \\lim_{s\\to\\infty}sF(s)$", "$\\lim_{t\\to0^+}f(t) = \\lim_{s\\to0}sF(s)$", "$f(0) = F(0)$", "$f(0) = \\lim_{s\\to\\infty}F(s)$"], c: 0, e: "Regla 9 (jafna 10.34). Lokagildisreglan notar $s \\to 0$." },

    /* ---------- Viðbót: Svörun kerfa ---------- */
    { topic: "svorun", q: "Kerfi annarrar gerðar hefur $\\zeta = 1$. Hvernig lítur þrepasvörunin út?", o: ["Engin sveifla, hraðasta svörun án yfirskots (markdempað)", "Ódempuð sveifla", "Lítið yfirskot, um 4 %", "Hún vex án takmarka"], c: 0, e: "Tvöföld rót í $-\\omega_n$. $\\zeta = 0{,}707$ gefur 4,3 % yfirskot." },
    { topic: "svorun", q: "Pólarnir eru $-1$ og $-20$. Hvaða póll ræður hraða svörunarinnar?", o: ["$-1$: hann er næst $j\\omega$-ásnum og deyr hægast út", "$-20$: hann er stærri", "Báðir jafnt", "Hvorugur, aðeins núllpunktar ráða"], c: 0, e: "$e^{-t}$ hefur $\\tau = 1$ s en $e^{-20t}$ hefur $\\tau = 0{,}05$ s. Lengsti tímastuðullinn ræður (kafli 12.4)." },
    { topic: "svorun", q: "Hvað gerist við yfirskotið þegar $\\omega_n$ er tvöfaldað en $\\zeta$ helst óbreytt?", o: ["Yfirskotið helst óbreytt en svörunin verður tvöfalt hraðari", "Yfirskotið tvöfaldast", "Yfirskotið helmingast", "Kerfið verður óstöðugt"], c: 0, e: "$M_p$ er aðeins háð $\\zeta$. $T_p$ og $\\tau$ eru í öfugu hlutfalli við $\\omega_n$." },
    { topic: "svorun", q: "Hver er bandvídd fyrstu gerðar kerfis $K/(\\tau s+1)$?", o: ["$1/\\tau$ (þar er mögnunin 3 dB undir $K$)", "$\\tau$", "$K/\\tau$", "$2\\pi/\\tau$"], c: 0, e: "Kafli 13: bandvídd og tímastuðull eru jafngildir mælikvarðar á viðbragðsgetu." },
    { topic: "svorun", q: "Hver er halli mögnunar annarrar gerðar kerfis langt fyrir ofan $\\omega_n$?", o: ["$-40$ dB/dec", "$-20$ dB/dec", "$0$ dB/dec", "$-60$ dB/dec"], c: 0, e: "Tvöfalt hraðar en fyrstu gerðar kerfi (mynd 13.2). Fasinn stefnir á $-180^\\circ$." },
    { topic: "svorun", q: "Fyrir hvaða $\\zeta$ hverfur ómunartoppurinn í mögnuninni?", o: ["$\\zeta \\ge 1/\\sqrt2 \\approx 0{,}707$", "$\\zeta \\ge 0{,}5$", "$\\zeta \\ge 1$", "Aldrei"], c: 0, e: "Jafna 13.16: $\\omega_r = \\omega_n\\sqrt{1-2\\zeta^2}$ er aðeins til fyrir $\\zeta < 1/\\sqrt2$." },
    { topic: "svorun", q: "Sínusbylgja fer inn í stöðugt línulegt kerfi. Hvað kemur út eftir að svipula svörunin er horfin?", o: ["Sínusbylgja af sömu tíðni, með útslagið margfaldað með $|G(j\\omega)|$ og fasann hliðraðan um $\\arg G(j\\omega)$", "Sínusbylgja af tvöfaldri tíðni", "Fasti", "Ferhyrningsbylgja"], c: 0, e: "Jafna 13.7. Línuleg kerfi búa ekki til nýjar tíðnir." },
    { topic: "svorun", q: "$G(s) = \\dfrac{5s+1}{(s+1)(s+3)}$. Hvað veldur stóru yfirskoti í þrepasvöruninni þótt pólarnir séu rauntölur?", o: ["Núllpunkturinn í $-0{,}2$, sem er hægari en pólarnir", "Pólarnir eru of nálægt hvor öðrum", "Kerfið er óstöðugt", "Það er ekkert yfirskot"], c: 0, e: "Dæmi 12.5.1 (l): núllpunktur nálægt $j\\omega$-ásnum bætir við afleiðuþætti sem gefur topp um 1,05 á móti lokagildinu 0,33." },
    { topic: "svorun", q: "Hvernig er tímastuðull annarrar gerðar kerfis með $0 < \\zeta < 1$ skilgreindur?", o: ["$\\tau = 1/(\\zeta\\omega_n)$, út frá raunhluta pólanna", "$\\tau = 1/\\omega_n$", "$\\tau = T_p$", "$\\tau = 2\\pi/\\omega_d$"], c: 0, e: "Jafna 12.15: einhjúpur sveiflunnar er $e^{-\\zeta\\omega_n t}$. Eftir $4\\tau$ er sveiflan um 2 % eftir." },

    /* ---------- Viðbót: Líkanagerð ---------- */
    { topic: "likan", q: "Hvaða einingar í heftinu varðveita orku (geyma hana og skila aftur)?", o: ["Fjöður, massi, þéttir og spóla", "Dempari og viðnám", "Aðeins massi", "Viðnám og þéttir"], c: 0, e: "Rýmd og tregða geyma orku ($\\tfrac12kx^2$, $\\tfrac12mv^2$, $\\tfrac12Cv^2$, $\\tfrac12Li^2$). Dempari og viðnám breyta orku í varma." },
    { topic: "likan", q: "Tveir þéttar $C_1$ og $C_2$ eru raðtengdir. Jafngildisrýmdin er:", o: ["$\\dfrac{C_1C_2}{C_1+C_2}$", "$C_1 + C_2$", "$\\sqrt{C_1C_2}$", "$C_1 - C_2$"], c: 0, e: "Þéttar fylgja öfugri reglu miðað við viðnám: hliðtengdir leggjast saman." },
    { topic: "likan", q: "Rafrás inniheldur einn þétti og tvö viðnám. Hvaða gerð er diffurjafnan fyrir spennuna yfir þéttinn?", o: ["Fyrstu gerðar", "Annarrar gerðar", "Þriðju gerðar", "Engin diffurjafna, aðeins algebra"], c: 0, e: "Ein orkugeymsla gefur fyrstu gerð. Viðnámin ákvarða aðeins $\\tau = R_{th}C$." },
    { topic: "likan", q: "Hvað einkennir líkan sem er fundið út frá mælingum (system identification)?", o: ["Kerfið er sett í vinnupunkt, inntaki breytt og stikar metnir út frá mældri svörun", "Það byggir eingöngu á náttúrulögmálum", "Það þarf ekki að afmarka kerfið", "Það gildir fyrir öll vinnusvið"], c: 0, e: "Kafli 4: fyrsta skrefið (afmörkun) er það sama, en í stað grunnjafna koma mælingar." },
    { topic: "likan", q: "Hvað er rétt um ástandslíkan $\\dot{\\mathbf x} = A\\mathbf x + Bu$?", o: ["Það er sama kerfi skrifað sem hneppi fyrstu gerðar jafna með ástandsbreytum", "Það er ólínulegt", "Það lýsir aðeins vélrænum kerfum", "Það kemur í stað Laplace-vörpunar í prófinu"], c: 0, e: "Jafna 4.3. Hentugt fyrir mörg inntök og úttök, en á prófunum er ekki beðið um ástandsform." },
    { topic: "likan", q: "Varmi flæðir í gegnum vegg með flatarmál $A$, þykkt $L$ og varmaleiðni $k$. Varmaviðnámið er:", o: ["$R = \\dfrac{L}{Ak}$", "$R = \\dfrac{Ak}{L}$", "$R = AkL$", "$R = \\dfrac{1}{Ah}$"], c: 0, e: "Jafna 8.2. $1/(Ah)$ er viðnám varmaburðar (loft)." },

    /* ---------- Viðbót: Nemar ---------- */
    { topic: "nemar", q: "Á prófinu þarf nemi að „komast í jafnvægi innan 100 ms“. Hvaða viðmið notar heftið fyrir fyrstu gerðar nema?", o: ["$4\\tau$ (98 %)", "$\\tau$ (63 %)", "$2\\tau$ (86 %)", "$10\\tau$"], c: 0, e: "Tafla 12.1: miðað er við $4\\tau$. Lokapróf 2025: nemi B með $\\tau = 50$ ms nær ekki jafnvægi innan 100 ms." },
    { topic: "nemar", q: "Nemi með mælisvið 0-2000 RPM og frávik frá línuleika 2 %. Hversu mikið getur mælingin vikið frá beinni línu?", o: ["40 RPM", "2 RPM", "20 RPM", "Fer eftir mældum hraða"], c: 0, e: "Frávik er gefið sem hlutfall af mælisviði, ekki af mældu gildi: $0{,}02\\cdot2000 = 40$ RPM." },
    { topic: "nemar", q: "Hvað gerist ef mældi hraðinn fer út fyrir mælisvið nemans?", o: ["Úttakið mettast og mælingin verður röng, svo neminn kemur ekki til greina", "Næmnin eykst", "Tímastuðullinn minnkar", "Ekkert, línuleikinn helst"], c: 0, e: "Fyrsta skilyrðið við val á nema er að mælisviðið nái yfir það sem á að mæla." },
    { topic: "nemar", q: "Af hverju er neminn í lykkjunni svo mikilvægur fyrir nákvæmni sjálfvirks stýrikerfis?", o: ["Afturvirkni getur ekki leiðrétt skekkjur í nemanum sjálfum", "Neminn ræður stöðugleikanum einn", "Hann ákvarðar stýrimerkið", "Hann hefur ekki áhrif"], c: 0, e: "Stýrikerfið eltir mæligildið. Ef neminn mælir rangt heldur kerfið röngu gildi af nákvæmni (næmni $\\approx -1$)." },
    { topic: "nemar", q: "Hver er kosturinn við 4-20 mA staðalinn umfram 0-20 mA?", o: ["Hægt er að greina rof í leiðslu (0 mA) frá lægsta gildi (4 mA)", "Meiri næmni", "Minni tímastuðull", "Hann þarf ekki fæðispennu"], c: 0, e: "Lifandi núllpunktur: 0 mA þýðir bilun, ekki neðri mörk mælisviðsins." },
    { topic: "nemar", q: "Hvernig hefur tímastuðull nemans áhrif á lykkjuna?", o: ["Hann bætir við pól sem lækkar fasann og getur minnkað fasaöryggið", "Hann hefur engin áhrif ef neminn er línulegur", "Hann eykur fasann", "Hann ræður aðeins skekkjunni í jafnvægi"], c: 0, e: "$G_S = S/(\\tau s + 1)$ er hluti af $G_K$. Hægur nemi bætir við fasatapi nálægt $\\omega_c$." },

    /* ---------- Viðbót: Hreyflar ---------- */
    { topic: "hreyflar", q: "Hreyfill A hefur $\\tau_s = 1{,}0$ Nm og B hefur $\\tau_s = 0{,}5$ Nm. Krafan er upphafsvægi a.m.k. 0,7 Nm. Hvað er rétt?", o: ["Aðeins A uppfyllir kröfuna", "Aðeins B uppfyllir kröfuna", "Báðir uppfylla hana", "Hvorugur"], c: 0, e: "Lokapróf 2025 S3." },
    { topic: "hreyflar", q: "Hvernig breytist hámarksafl hreyfils ef innspennan er tvöfölduð?", o: ["Það fjórfaldast", "Það tvöfaldast", "Það helst óbreytt", "Það helmingast"], c: 0, e: "$\\tau_s \\propto v_a$ og $\\omega_0 \\propto v_a$, svo $P_{max} = \\tau_s\\omega_0/4 \\propto v_a^2$." },
    { topic: "hreyflar", q: "Hvað er $\\omega_0$ ef $v_a = 10$ V og $K_f = 10$ V/1000 RPM?", o: ["1000 RPM", "100 RPM", "10 000 RPM", "10 RPM"], c: 0, e: "$\\omega_0 = v_a/K_f$: í lausagangi er bakspennan jöfn innspennunni." },
    { topic: "hreyflar", q: "Í blokkriti hreyfils (lokapróf 2024 S4) er $G_1 = T/(U - V_f)$ með $L \\approx 0$. Hvað er $G_1$?", o: ["$K_\\tau/R$", "$1/R$", "$K_f s$", "$1/(Is^2 + cs)$"], c: 0, e: "$u - v_f = Ri$ og $T = K_\\tau i$. $1/(Is^2+cs)$ er $G_2$ og $K_f s$ er afturvirknin." },
    { topic: "hreyflar", q: "Hraðastýring á hreyfli með P-stýringu (úttak er hraði). Hver er tegund lykkjunnar og hvað þýðir það?", o: ["Tegund 0: skekkja í jafnvægi við þrep er $\\Delta r/(1 + KK_P)$", "Tegund 1: engin skekkja", "Tegund 2: engin skekkja við fláa", "Tegundin fer eftir $K$"], c: 0, e: "Frá spennu til hraða er ekkert heildi. Heildið er aðeins til staðar ef úttakið er staða (horn)." },
    { topic: "hreyflar", q: "Hvað gerist ef reiknað er með $K_f$ í V/1000 RPM í stað V·s/rad?", o: ["Allar stærðir sem nota $K_f$ með rad/s verða 104,72 sinnum rangar", "Ekkert, einingarnar eru jafngildar", "Aðeins aflið verður rangt", "Aðeins tímastuðullinn breytist"], c: 0, e: "Breyttu alltaf: $K_f[\\mathrm{V\\cdot s/rad}] = K_f[\\mathrm{V/1000\\,RPM}]/104{,}72$." },
    { topic: "hreyflar", q: "Hvaða tímastuðull ræður hraðasvörun hreyfils með álagi þegar $L \\approx 0$?", o: ["$\\dfrac{I}{c + K_\\tau K_f/R}$ (vélrænn)", "$L/R$ (rafrænn)", "$I/c$ eingöngu", "$R/L$"], c: 0, e: "Bakspennan virkar eins og auka deyfing $K_\\tau K_f/R$ og gerir hreyfilinn hraðari en $I/c$ gefur til kynna." },

    /* ---------- Viðbót: Sjálfvirk stýrikerfi ---------- */
    { topic: "stjornkerfi", q: "Lokapróf 2025 S4: tankur ($1/(As)$) með P-stýringu og afturvirkni. Hver er skekkjan í jafnvægi eftir þrep í óskgildi?", o: ["Núll, því tankurinn er heildi og lykkjan af tegund 1", "$1/(1+K)$", "Óendanleg", "Hún fer eftir seinkun lokans"], c: 0, e: "Hæðin breytist þar til innflæði = útflæði, sem gerist aðeins þegar $E = 0$." },
    { topic: "stjornkerfi", q: "Seinkun er í lykkju með $\\varphi_m = 35^\\circ$ og $\\omega_c = 0{,}05$ rad/s. Við hve langa seinkun verður kerfið óstöðugt?", o: ["Um 12 s ($L = \\varphi_m/\\omega_c$ í radíönum)", "Um 700 s", "Um 0,6 s", "Seinkun gerir kerfið aldrei óstöðugt"], c: 0, e: "$0{,}61/0{,}05 \\approx 12$ s. Muna að breyta gráðum í radíana." },

    /* ---------- Viðbót: Stýringar ---------- */
    { topic: "styringar", q: "Lykkjan inniheldur heildi og hefur 56° fasaöryggi. Krafan er þrefalt hraðari svörun og a.m.k. 60°. Hvaða stýring?", o: ["PD", "PI", "P", "PID"], c: 0, e: "Lokapróf 2024 S6: heildið eyðir skekkjunni þegar, svo aðeins þarf fasahækkun (D)." },
    { topic: "styringar", q: "Ferli af tegund 0 á að fá enga skekkju, yfirskot undir 10 % og þrefalt styttri rístíma. Hvaða stýring?", o: ["PID", "PD", "PI", "P"], c: 0, e: "Lokapróf 2025 S6: I fyrir skekkjuna og D fyrir fasann sem hraðinn krefst." },
    { topic: "styringar", q: "Af hverju er hrein PD-stýring varasöm í raunkerfi?", o: ["Mögnunin vex með tíðni, svo hún magnar mælisuð og gefur stóran topp í stýrimerki við þrep", "Hún eyðir ekki skekkju og er því alltaf óstöðug", "Hún lækkar fasann", "Hún virkar aðeins á tegund 2"], c: 0, e: "Þess vegna er sía $1/(1+T_Fs)$ bætt við og stýrimerkið sannprófað." },
    { topic: "styringar", q: "Hver er tilgangurinn með því að velja $T_D$ jafnt tímastuðli hægari pólsins?", o: ["Núllpunktur PD styttist út á móti pólnum og lykkjan einfaldast", "Það eyðir skekkju í jafnvægi", "Það lækkar $\\omega_c$", "Það eykur mögnunaröryggið óendanlega"], c: 0, e: "$K(1+T_1s)/(s(1+T_1s)(1+T_2s)) = K/(s(1+T_2s))$, svo auðvelt er að reikna $K$ fyrir gefið $\\varphi_m$." },
    { topic: "styringar", q: "Hvað kostar I-liður PI-stýringar í fasa við $\\omega_c$ ef $\\omega_I = 0{,}2\\,\\omega_c$?", o: ["Um $11^\\circ$", "Um $45^\\circ$", "Um $90^\\circ$", "Ekkert"], c: 0, e: "$\\arctan 5 - 90^\\circ = -11{,}3^\\circ$. Þess vegna er fasaöryggið í hönnuninni hækkað um $0{,}06\\pi \\approx 11^\\circ$." },
    { topic: "styringar", q: "Hvaða mælikvarða er eðlilegt að nota til að meta stýringu í hönnunarverkefninu?", o: ["Rístími, yfirskot, skekkja í jafnvægi, deyfing truflana og stærð stýrimerkis", "Aðeins fjöldi kóðalína", "Aðeins hámarkshiti", "Aðeins fasaöryggi líkansins"], c: 0, e: "Þeir þurfa að tengjast kröfum verkefnisins: hraði, skekkja, truflanir, breytileiki og stýrimerki." },

    /* ---------- Viðbót: Vinnuferli, tæknileg kerfi og hönnunarverkefni ---------- */
    { topic: "vinnuferli", q: "Hvað er réttmæti (validation) hönnunar?", o: ["Hversu vel hún uppfyllir þarfir notenda", "Hversu vel hún uppfyllir kröfur hönnuðar", "Hvort líkanið er línulegt", "Hvort kóðinn keyrir"], c: 0, e: "Sannprófun (verification) er gegn kröfum, réttmæti gegn þörfum. Hönnun getur staðist sannprófun en ekki réttmæti." },
    { topic: "vinnuferli", q: "Af hverju tryggir sannprófun ekki réttmæti?", o: ["Kröfurnar endurspegla ekki endilega þarfirnar fullkomlega", "Sannprófun er aldrei nákvæm", "Réttmæti er aðeins prófað í líkani", "Þarfir eru alltaf mælanlegar"], c: 0, e: "Þarfir geta verið huglægar og ómælanlegar. Kröfur eru þýðing á þeim yfir á tungumál hönnuðar." },
    { topic: "vinnuferli", q: "Hvaða eiginleika eiga kröfur að hafa skv. kafla 14?", o: ["Þær eiga að vera mælanlegar", "Þær eiga að vera huglægar", "Þær eiga að lýsa tæknilausninni", "Þær eiga að vera á tungumáli notandans"], c: 0, e: "Kröfur eru á tungumáli hönnuðar og allar mælanlegar, svo hægt sé að sannprófa þær." },
    { topic: "vinnuferli", q: "Hvað er högun (architecture) kerfis?", o: ["Hverjar eru grunneiningar þess og hvernig þær vinna saman", "Útlit notendaviðmótsins", "Forritunarmálið sem er notað", "Fjárhagsáætlun verkefnisins"], c: 0, e: "Fyrsta skref hönnunar í stigveldi: skilgreina högun og hvernig heildin verður sannprófuð." },
    { topic: "vinnuferli", q: "Hvað er átt við með að kröfur myndi stigveldi?", o: ["Kröfur kerfisins skilgreina kröfur til eininga, sem geta sjálfar verið kerfi", "Mikilvægustu kröfurnar eru prófaðar fyrst", "Notandinn raðar kröfum eftir mikilvægi", "Kröfur breytast aldrei"], c: 0, e: "Neðar í stigveldinu taka kröfurnar meira mið af tæknilausnum." },
    { topic: "vinnuferli", q: "Hvert er hlutverk tölvunnar í véleindakerfi?", o: ["Hún les mælingar frá nema og sendir stýrimerki til hreyfilsins", "Hún mælir ástand vélræna kerfisins", "Hún breytir rafmerki í hreyfingu", "Hún er hluti af vélræna kerfinu"], c: 0, e: "Neminn mælir, hreyfillinn framkvæmir og tölvan reiknar stýringuna á milli (kafli 3)." },
    { topic: "vinnuferli", q: "Hver eru þrjú sjónarhorn Arthurs á tækni?", o: ["Leið að markmiði; safn aðferða og eininga (tæknisvið); allar aðferðir og einingar sem til eru", "Vélbúnaður, hugbúnaður og fólk", "Þarfir, kröfur og sannprófun", "Líkan, hönnun og prófun"], c: 0, e: "Heftið sameinar fyrsta sjónarhornið við skilgreiningu á kerfi til að skilgreina tæknileg kerfi." },
    { topic: "vinnuferli", q: "Í tæknilegu kerfi skv. heftinu er fólk:", o: ["Hluti af umhverfi kerfisins, en getur haft áhrif á það", "Ein af einingum kerfisins", "Alltaf inntak kerfisins", "Utan við málið"], c: 0, e: "Krafa heftisins: a.m.k. ein eining er efnisleg og fólk er ekki hluti af kerfinu." },
    { topic: "vinnuferli", q: "Af hverju eru líkön svo verðmæt í hönnun?", o: ["Hægt er að meta og bera saman marga valkosti hratt og ódýrt án tilrauna", "Þau gera prófanir á raunkerfinu óþarfar", "Þau eru alltaf nákvæm", "Þau eru auðveldari en mælingar"], c: 0, e: "Kafli 14: niðurstaðan þarf samt að vera sannprófuð með mælingum á útfærslunni." },
    { topic: "vinnuferli", q: "Stýringin virkar vel í hermun en illa á raunkerfinu. Hvað er líklegasta skýringin?", o: ["Líkanið er línuleg nálgun sem nær ekki yfir t.d. mettun, suð eða seinkun", "Hermunin er alltaf röng", "Raunkerfið er línulegt en líkanið ekki", "Stýringin var of einföld"], c: 0, e: "Misræmi líkans og raunveruleika eykst með flækjustigi stýringar (kafli 14)." },
    { topic: "vinnuferli", q: "Hvað var aðalmarkmið verklegu æfinganna (V1-V3)?", o: ["Að læra að lesa nema og stýra hreyflum á raunverulegum vélbúnaði með kóða", "Að leiða út Laplace-varpanir", "Að skrifa skýrslu um kröfur", "Að herma stýrikerfi í Colab"], c: 0, e: "Raspberry Pi, ljós, hitanemar, ljósnemi og vifta með PWM. Skilaverkefnin voru fræðilegi hlutinn í Colab." },
    { topic: "vinnuferli", q: "Í hönnunarverkefninu er hitastig í rými stýrt. Hvað er „hreyfillinn“ í þessu véleindakerfi?", o: ["Hitagjafinn og viftan (stýrð með PWM)", "Hitaneminn ds18b20", "Raspberry Pi tölvan", "Rýmið sjálft"], c: 0, e: "Hreyfill breytir rafmerki í aðgerð sem hefur áhrif á kerfið, hér varmaflæði." },
    { topic: "vinnuferli", q: "Hvernig er heppilegast að fá líkan af hitastigi rýmisins í hönnunarverkefninu?", o: ["Mæla þrepasvörun hitans við breytingu á duty cycle og meta $K$, $\\tau$ (og seinkun)", "Leiða það út frá varmaleiðni allra veggja", "Giska á stikana", "Nota líkan af jafnstraumshreyfli"], c: 0, e: "Kerfisgreining með mælingum (kafli 4) er fljótleg og nákvæm um vinnupunktinn." },
    { topic: "vinnuferli", q: "Hvað er dæmi um málamiðlun (trade-off) við val á stýringu?", o: ["Hærra $K$ gefur hraðari svörun og minni skekkju en minna fasaöryggi og stærra stýrimerki", "PI-stýring er alltaf betri en P", "Hraði og stöðugleiki fara alltaf saman", "Málamiðlanir eiga aðeins við um kostnað"], c: 0, e: "Hönnun er að uppfylla þarfir á sem bestan hátt, sem krefst málamiðlana milli eftirsóknarverðra eiginleika." },
    { topic: "vinnuferli", q: "Sínuslaga truflun er lögð við hitamælinguna (síðasti hluti hönnunarverkefnisins). Hvernig dregur stýringin best úr áhrifum hennar?", o: ["Með því að halda mögnun lykkjunnar lágri við tíðni truflunarinnar (t.d. sía, lægra $K$ eða minni D-liður)", "Með því að hækka $K$ eins og hægt er", "Með hreinni D-stýringu", "Ekki hægt, mælisuð fer alltaf óbreytt í gegn"], c: 0, e: "Mælisuð fer í gegnum $G_K/(1+G_K)$; við háar tíðnir þarf $|G_K|$ að vera lítið." },
    { topic: "vinnuferli", q: "Hvernig ætti að byggja upp gott svar við ritgerðarspurningu (S5) á lokaprófinu?", o: ["Tengja eigin reynslu við hugtök heftisins og útskýra af hverju, ekki bara hvað gerðist", "Endursegja verkefnalýsinguna", "Skrifa sem mest af formúlum", "Lýsa aðeins því sem gekk vel"], c: 0, e: "Rökstyðja skal svör með efni úr hefti og eigin reynslu." },
  ];

  function parseAnswer(str) {
    var s = String(str).replace(/\s+/g, " ").replace(/−/g, "-").trim();
    var m = s.match(/^([+-]?\d*[.,]?\d+(?:[eE][+-]?\d+)?)(?:\s*\/\s*([+-]?\d*[.,]?\d+))?/);
    if (!m) return NaN;
    var a = parseFloat(m[1].replace(",", "."));
    if (m[2]) a = a / parseFloat(m[2].replace(",", "."));
    return a;
  }

  /** Er tölulegt svar rétt? Skekkjumörk: tol sem hlutfall, absTol sem fast lágmark. */
  function isRight(d, value) {
    var v = typeof value === "number" ? value : parseAnswer(value);
    if (isNaN(v)) return null;
    var tol = Math.max(d.tol * Math.abs(d.answer), d.absTol || 0, 1e-9);
    return Math.abs(v - d.answer) <= tol;
  }

  var TOPICS = [
    { id: "likan", label: "Líkanagerð" },
    { id: "laplace", label: "Laplace og blokkrit" },
    { id: "svorun", label: "Svörun kerfa" },
    { id: "nemar", label: "Nemar" },
    { id: "hreyflar", label: "Hreyflar" },
    { id: "stjornkerfi", label: "Sjálfvirk stýrikerfi" },
    { id: "styringar", label: "Stýringar" },
    { id: "vinnuferli", label: "Vinnuferli" },
  ];

  /** Slembispurning úr gefnum efnum. kind: "num", "mc" eða undefined (hvort sem er). */
  function draw(topics, kind) {
    var has = function (t) { return !topics || topics.indexOf(t) !== -1; };
    var gens = G.filter(function (g) { return has(g.topic || (g.topic = g().topic)); });
    var mcs = MC.filter(function (m) { return has(m.topic); });
    if (!kind) kind = gens.length && (!mcs.length || Math.random() < 0.6) ? "num" : "mc";
    if (kind === "num" && !gens.length) kind = "mc";
    if (kind === "mc" && !mcs.length) kind = "num";
    if (kind === "num") return { kind: "num", d: pick(gens)() };
    return { kind: "mc", d: pick(mcs) };
  }

  window.TK = window.TK || {};
  window.TK.bank = { G: G, MC: MC, TOPICS: TOPICS, draw: draw, parseAnswer: parseAnswer, isRight: isRight,
    rnd: rnd, pick: pick, round: round, is: is, tx: tx, deg: deg, RPM2RAD: RPM2RAD, KF_SI: KF_SI };
})();

/* quiz.js – æfingaspurningar. Reiknidæmi eru búin til með slembitölum og lausnin
 * er reiknuð í kóða, svo hægt er að æfa sömu gerð aftur og aftur. */
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
  ];

  /* ---------- Viðmót ---------- */
  var TOPICS = [
    { id: "allt", label: "Allt" },
    { id: "nemar", label: "Nemar" },
    { id: "hreyflar", label: "Hreyflar" },
    { id: "stjornkerfi", label: "Sjálfvirk stýrikerfi" },
    { id: "styringar", label: "Stýringar" },
  ];
  var MODES = [
    { id: "reikna", label: "Reikna (slembitölur)" },
    { id: "skilja", label: "Skilningur (val)" },
    { id: "blanda", label: "Blanda" },
  ];

  var root = document.getElementById("quiz");
  if (!root) return;
  var state = { topic: "allt", mode: "reikna", cur: null, answered: false };
  var stats = window.store.get("tk-quiz-stats", { n: 0, ok: 0, streak: 0, best: 0 });

  function scoreHtml() {
    return "<span>Svarað <b>" + stats.n + "</b></span><span>Rétt <b>" + stats.ok + "</b>" + (stats.n ? " (" + Math.round((100 * stats.ok) / stats.n) + " %)" : "") + "</span><span>Röð <b>" + stats.streak + "</b></span><span>Best <b>" + stats.best + '</b></span><button type="button" class="linkbtn" id="q-reset">Núllstilla</button>';
  }

  function bindReset() {
    document.getElementById("q-reset").addEventListener("click", function () {
      stats = { n: 0, ok: 0, streak: 0, best: 0 };
      window.store.set("tk-quiz-stats", stats);
      render(); next();
    });
  }

  function render() {
    var h = '<div class="toolbar"><span class="tl" id="q-tl-topic">Efni</span><div class="chips" role="group" aria-labelledby="q-tl-topic">';
    TOPICS.forEach(function (t) {
      h += '<button type="button" class="chip" data-topic="' + t.id + '" aria-pressed="' + (state.topic === t.id) + '">' + t.label + "</button>";
    });
    h += '</div><span class="tl" id="q-tl-mode">Tegund</span><div class="chips" role="group" aria-labelledby="q-tl-mode">';
    MODES.forEach(function (t) {
      h += '<button type="button" class="chip" data-mode="' + t.id + '" aria-pressed="' + (state.mode === t.id) + '">' + t.label + "</button>";
    });
    h += '</div></div><div class="scorebar" aria-live="polite">' + scoreHtml() + "</div>";
    h += '<div id="q-area"></div>';
    root.innerHTML = h;
    root.querySelectorAll("[data-topic]").forEach(function (b) {
      b.addEventListener("click", function () { state.topic = b.getAttribute("data-topic"); render(); next(); });
    });
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { state.mode = b.getAttribute("data-mode"); render(); next(); });
    });
    bindReset();
  }

  function record(ok) {
    stats.n++;
    if (ok) { stats.ok++; stats.streak++; stats.best = Math.max(stats.best, stats.streak); } else stats.streak = 0;
    window.store.set("tk-quiz-stats", stats);
    var sb = root.querySelector(".scorebar");
    if (sb) {
      sb.innerHTML = scoreHtml();
      bindReset();
    }
  }

  function pool(kind) {
    if (kind === "reikna") return G;
    return MC;
  }

  function next() {
    var kind = state.mode === "blanda" ? (Math.random() < 0.65 ? "reikna" : "skilja") : state.mode;
    var q = null;
    for (var tries = 0; tries < 60 && !q; tries++) {
      if (kind === "reikna") {
        var cand = pick(G)();
        if (state.topic === "allt" || cand.topic === state.topic) q = { kind: "num", d: cand };
      } else {
        var m = pick(MC);
        if (state.topic === "allt" || m.topic === state.topic) q = { kind: "mc", d: m };
      }
    }
    if (!q) { // t.d. enginn reiknigenerator fyrir efni
      kind = kind === "reikna" ? "skilja" : "reikna";
      for (var t2 = 0; t2 < 60 && !q; t2++) {
        if (kind === "reikna") { var c2 = pick(G)(); if (c2.topic === state.topic) q = { kind: "num", d: c2 }; }
        else { var m2 = pick(MC); if (m2.topic === state.topic) q = { kind: "mc", d: m2 }; }
      }
    }
    state.cur = q;
    state.answered = false;
    showQuestion();
  }

  function topicLabel(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[i].label;
    return id;
  }

  function parseAnswer(str) {
    var s = String(str).replace(/\s+/g, " ").replace(/−/g, "-").trim();
    var m = s.match(/^([+-]?\d*[.,]?\d+(?:[eE][+-]?\d+)?)(?:\s*\/\s*([+-]?\d*[.,]?\d+))?/);
    if (!m) return NaN;
    var a = parseFloat(m[1].replace(",", "."));
    if (m[2]) a = a / parseFloat(m[2].replace(",", "."));
    return a;
  }

  function showQuestion() {
    var area = document.getElementById("q-area");
    var q = state.cur;
    if (!q) { area.innerHTML = "<p>Engin spurning fannst fyrir þetta val.</p>"; return; }
    var h = '<div class="qcard"><div class="qmeta">' + topicLabel(q.d.topic) + (q.kind === "num" ? " · " + q.d.title : " · Skilningur") + "</div>";
    if (q.kind === "num") {
      h += '<div class="qtext">' + q.d.text + "</div>";
      h += '<form id="q-form" class="row" style="margin-top:1rem" autocomplete="off"><div><label class="f" for="q-in">Svar' + (q.d.unit ? " (" + q.d.unit + ")" : "") + '</label><input id="q-in" type="text" inputmode="decimal" autocapitalize="off" spellcheck="false" placeholder="t.d. 2,5 eða 2/51"></div><div class="fixed"><button class="btn" type="submit">Athuga</button></div><div class="fixed"><button class="btn ghost" type="button" id="q-show">Sýna lausn</button></div></form><p class="qhint">Tala með kommu eða punkti (2,5) eða brot (2/51). Skekkjumörk um 2 %. „Sýna lausn“ telst sem rangt svar.</p>';
    } else {
      var order = q.d.o.map(function (_, i) { return i; });
      for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = order[i]; order[i] = order[j]; order[j] = t; }
      q.order = order;
      h += '<div class="qtext">' + q.d.q + '</div><div class="opts">';
      order.forEach(function (oi, k) { h += '<button type="button" class="opt" data-i="' + oi + '">' + q.d.o[oi] + "</button>"; });
      h += "</div>";
    }
    h += '<div class="result" id="q-res" aria-live="polite"></div><div id="q-sol"></div><div class="qnext"><button type="button" class="btn ghost" id="q-next">Næsta spurning →</button></div></div>';
    area.innerHTML = h;
    window.renderMath(area);
    document.getElementById("q-next").addEventListener("click", next);
    if (q.kind === "num") {
      var inp = document.getElementById("q-in");
      inp.focus({ preventScroll: true });
      document.getElementById("q-form").addEventListener("submit", function (ev) { ev.preventDefault(); checkNum(); });
      document.getElementById("q-show").addEventListener("click", function () { reveal(false); });
    } else {
      area.querySelectorAll(".opt").forEach(function (b) {
        b.addEventListener("click", function () { checkMc(parseInt(b.getAttribute("data-i"), 10)); });
      });
    }
  }

  function reveal(ok) {
    var q = state.cur;
    var sol = document.getElementById("q-sol");
    var ans = q.kind === "num"
      ? '<p><b>Svar:</b> <span class="ans">' + is(q.d.answer, 4) + (q.d.unit ? " " + q.d.unit : "") + "</span></p>"
      : "";
    sol.innerHTML = '<div class="sol" style="border-top:1px solid var(--rule);margin-top:1rem;padding-top:0.8rem">' + ans + (q.kind === "num" ? q.d.sol : "<p>" + q.d.e + "</p>") + "</div>";
    window.renderMath(sol);
    if (!state.answered) { state.answered = true; record(ok); }
  }

  function checkNum() {
    if (state.answered) return;
    var q = state.cur;
    var v = parseAnswer(document.getElementById("q-in").value);
    var res = document.getElementById("q-res");
    if (isNaN(v)) { res.className = "result no"; res.textContent = "Skrifaðu tölu, t.d. 2,5."; return; }
    var tol = Math.max(q.d.tol * Math.abs(q.d.answer), q.d.absTol || 0, 1e-9);
    var ok = Math.abs(v - q.d.answer) <= tol;
    res.className = "result " + (ok ? "ok" : "no");
    res.textContent = ok ? "Rétt." : "Ekki alveg. Berðu saman við lausnina hér að neðan.";
    reveal(ok);
  }

  function checkMc(i) {
    if (state.answered) return;
    var q = state.cur;
    var ok = i === q.d.c;
    document.querySelectorAll("#q-area .opt").forEach(function (b) {
      var bi = parseInt(b.getAttribute("data-i"), 10);
      b.disabled = true;
      if (bi === q.d.c) b.classList.add("right");
      else if (bi === i) b.classList.add("wrong");
    });
    var res = document.getElementById("q-res");
    res.className = "result " + (ok ? "ok" : "no");
    res.textContent = ok ? "Rétt." : "Ekki rétt.";
    reveal(ok);
  }

  render();
  next();
})();

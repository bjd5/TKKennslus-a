/* lokaprof.js – gröf við spurningu 6 á lokaprófunum 2024 og 2025.
 * Líkönin eru valin svo þau passi við myndirnar í prófunum (sjá textann á síðunni). */
(function () {
  "use strict";
  if (!window.Ctrl) return;
  var Ctrl = window.Ctrl, C = Ctrl.C;
  var col = function (v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); };
  var one = { re: 1, im: 0 };
  var closed = function (L) { return function (s) { var g = L(s); return C.div(g, C.add(one, g)); }; };
  var times = function (tmax, n) { var a = []; for (var i = 0; i <= n; i++) a.push((i / n) * tmax + 1e-4); return a; };

  function bode(id, L, lo, hi) {
    var cv = document.getElementById(id);
    if (!cv) return;
    var draw = function () {
      var m = Ctrl.margins(L.at, lo, hi);
      Ctrl.drawBode(cv, m.data, { lo: lo, hi: hi, wc: m.wc, pm: m.pm, wpi: m.wpi, aspect: 0.72 });
    };
    draw();
    Ctrl.onRedraw(cv, draw);
  }

  function steps(id, list, tmax, ymax) {
    var cv = document.getElementById(id);
    if (!cv) return;
    var ts = times(tmax, 160);
    var ys = list.map(function (it) { return Ctrl.stepResponse(it.T, ts, it.w || 5); });
    var draw = function () {
      Ctrl.drawLines(cv, list.map(function (it, i) { return { x: ts, y: ys[i], color: col(it.color) }; }),
        { aspect: 0.45, xmin: 0, xmax: tmax, ymin: 0, ymax: ymax, hlines: [1], xlabel: "t [s]" });
    };
    draw();
    Ctrl.onRedraw(cv, draw);
  }

  /* 2025 S6: ferli annarrar gerðar, zeta ≈ 0,56 og wn ≈ 1,264 rad/s */
  var GP = Ctrl.tfFrom("1.5977/(s^2 + 1.4157s + 1.5977)");
  var GC = Ctrl.tfFrom("3*(1+2s)/(2s)*(1+0.7s)/(1+0.14s)");
  var L25 = function (s) { return C.mul(GC(s), GP(s)); };
  steps("lp25-plant", [{ T: GP, color: "--mag", w: 2 }], 10, 1.3);
  steps("lp25-pid", [{ T: GP, color: "--muted", w: 2 }, { T: closed(L25), color: "--mag", w: 8 }], 6, 1.3);

  /* 2024 S6: G_K = 1/(s(1+0,5s)(1+0,2s)) og PD með T_D = 0,5 s, K = 3,33 */
  var GK = Ctrl.tfFrom("1/(s(1+0.5s)(1+0.2s))");
  var PD = Ctrl.tfFrom("3.333*(1+0.5s)/(s(1+0.5s)(1+0.2s))");
  bode("lp24-gk", GK, 1e-1, 1e2);
  bode("lp24-pd", PD, 1e-1, 1e2);
  steps("lp24-step", [{ T: closed(GK), color: "--muted", w: 2 }, { T: closed(PD), color: "--mag", w: 6 }], 6, 1.4);
})();

/* svorun.js – gagnvirkt annarrar gerðar kerfi: G = wn^2/(s^2 + 2 zeta wn s + wn^2), K = 1.
 * Þrepasvörunin er reiknuð með lokaðri lausn (virkar líka fyrir zeta = 0). */
(function () {
  "use strict";
  var zS = document.getElementById("sv-z"), wS = document.getElementById("sv-wn");
  if (!zS || !wS || !window.Ctrl) return;
  var Ctrl = window.Ctrl;
  var stepCv = document.getElementById("sv-step"), bodeCv = document.getElementById("sv-bode");
  var fmt = function (v, d) { return v.toFixed(d).replace(".", ","); };
  var col = function (v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); };
  var set = function (id, t) { document.getElementById(id).textContent = t; };

  function stepY(z, wn, t) {
    if (z < 1) {
      var wd = wn * Math.sqrt(1 - z * z);
      return 1 - Math.exp(-z * wn * t) * (Math.cos(wd * t) + (z / Math.sqrt(1 - z * z)) * Math.sin(wd * t));
    }
    if (z === 1) return 1 - Math.exp(-wn * t) * (1 + wn * t);
    var r = wn * Math.sqrt(z * z - 1), p1 = -z * wn + r, p2 = -z * wn - r;
    return 1 - (p2 * Math.exp(p1 * t) - p1 * Math.exp(p2 * t)) / (p2 - p1);
  }

  function update() {
    var z = parseFloat(zS.value), wn = parseFloat(wS.value);
    set("sv-zv", fmt(z, 2));
    set("sv-wnv", fmt(wn, 1));

    var s = z * wn, tau = s > 0 ? 1 / s : Infinity;
    if (z < 1) {
      var wd = wn * Math.sqrt(1 - z * z);
      set("sv-p", (s > 0 ? "−" + fmt(s, 2) : "0") + " ± " + fmt(wd, 2) + "j");
      set("sv-wd", fmt(wd, 2));
      set("sv-tp", fmt(Math.PI / wd, 2));
      set("sv-mp", fmt(100 * Math.exp((-z * Math.PI) / Math.sqrt(1 - z * z)), 1) + " %");
    } else {
      var r = wn * Math.sqrt(z * z - 1);
      set("sv-p", r < 1e-9 ? "−" + fmt(wn, 2) + " (tvöföld)" : "−" + fmt(s - r, 2) + ", −" + fmt(s + r, 2));
      set("sv-wd", "–");
      set("sv-tp", "–");
      set("sv-mp", "0 %");
      if (r > 1e-9) tau = 1 / (s - r); // hægari póllinn ræður
    }
    set("sv-tau", isFinite(tau) ? fmt(tau, 2) : "∞");
    set("sv-4t", isFinite(tau) ? fmt(4 * tau, 1) : "∞");

    var tmax = isFinite(tau) ? Math.min(40 / wn, Math.max(8 / wn, 5 * tau)) : 30 / wn;
    var ts = [], ys = [], ymax = 1.2;
    for (var i = 0; i <= 300; i++) {
      var t = (i / 300) * tmax, y = stepY(z, wn, t);
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
  }

  zS.addEventListener("input", update);
  wS.addEventListener("input", update);
  update();
  Ctrl.onRedraw(stepCv, update);
})();

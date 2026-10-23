/* Gagnvirka dæmið á forsíðunni: P-stýring á G_P = 2,5/((1+2s)(1+0,5s)). */
(function () {
  "use strict";
  var slider = document.getElementById("hero-k");
  if (!slider || !window.Ctrl) return;
  var Ctrl = window.Ctrl, C = Ctrl.C;
  var bode = document.getElementById("hero-bode");
  var step = document.getElementById("hero-step");
  var fmt = function (v, d) { return v.toFixed(d).replace(".", ","); };

  function make(K) {
    var GP = Ctrl.tfFrom("2.5/((1+2s)(1+0.5s))");
    var GK = function (s) { return C.mul({ re: K, im: 0 }, GP(s)); };
    GK.at = function (w) { return GK({ re: 0, im: w }); };
    return GK;
  }

  function update() {
    var K = parseFloat(slider.value);
    document.getElementById("hero-kv").textContent = fmt(K, 1);
    var GK = make(K);
    var m = Ctrl.margins(GK.at, 1e-2, 1e2);
    document.getElementById("r-pm").textContent = m.pm === null ? "–" : fmt(m.pm, 0) + "°";
    document.getElementById("r-wc").textContent = m.wc === null ? "–" : fmt(m.wc, 2);
    document.getElementById("r-tr").textContent = m.wc === null ? "–" : fmt(1.4 / m.wc, 2);
    document.getElementById("r-ess").textContent = fmt(100 / (1 + 2.5 * K), 1) + " %";
    Ctrl.drawBode(bode, m.data, { lo: 1e-2, hi: 1e2, wc: m.wc, pm: m.pm, wpi: m.wpi, aspect: 0.72 });

    var T = function (s) { var g = GK(s); return C.div(g, C.add({ re: 1, im: 0 }, g)); };
    var ts = [];
    for (var i = 0; i <= 120; i++) ts.push((i / 120) * 8 + 1e-4);
    var y = Ctrl.stepResponse(T, ts, m.wc || 5);
    Ctrl.drawLines(step, [{ x: ts, y: y, color: getComputedStyle(document.documentElement).getPropertyValue("--mag").trim() }],
      { aspect: 0.4, xmin: 0, xmax: 8, ymin: 0, ymax: 2, hlines: [1], xlabel: "t [s]" });
  }

  slider.addEventListener("input", update);
  document.getElementById("hero-45").addEventListener("click", function () {
    slider.value = "4.0";
    update();
  });
  Ctrl.onRedraw(bode, update);
})();

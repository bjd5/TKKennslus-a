/* Kafli 6 – Vinna og hreyfiorka (OpenStax 7, vinnustofa 4) */
EDL.chapter({
  id: "k06", n: 6, book: "7", title: "Vinna og hreyfiorka", short: "Vinna, vinnu- og orkulögmálið og afl",
  intro: "Vinna er kraftur sinnum færsla í stefnu kraftsins. Heildarvinnan á hlut jafngildir breytingunni á hreyfiorku hans, og það er oft fljótlegra en að reikna hröðun.",
  eqs: [
    { id: "vinna", name: "Vinna fasts krafts", tex: "W = \\vec F\\cdot\\vec d = Fd\\cos\\phi",
      about: "Vinna fasts krafts á hlut sem færist um $\\vec d$. Aðeins þáttur kraftsins í hreyfistefnu vinnur.",
      vars: [["\\phi", "hornið milli kraftsins og færslunnar", "°"], ["d", "færsla", "m"], ["W", "vinna", "J"]],
      fill: { tex: "W = Fd\\,□", ans: "\\cos\\phi", wrong: ["\\sin\\phi", "\\tan\\phi", "\\phi"] } },
    { id: "K", name: "Hreyfiorka", tex: "K = \\tfrac12 m v^2",
      about: "Orka hlutar vegna hreyfingar hans.",
      vars: [["K", "hreyfiorka", "J"]],
      fill: { tex: "K = □", ans: "\\tfrac12 m v^2", wrong: ["m v^2", "\\tfrac12 m v", "m g h"] } },
    { id: "vo", name: "Vinnu- og orkulögmálið", tex: "W_{\\text{heild}} = K_f - K_i",
      about: "Heildarvinna allra krafta á hlut er jöfn breytingunni á hreyfiorku hans.",
      vars: [["W_{\\text{heild}}", "vinna allra krafta samanlagt", "J"], ["K_f", "hreyfiorka í lokin", "J"]],
      fill: { tex: "W_{\\text{heild}} = □", ans: "K_f - K_i", wrong: ["K_i - K_f", "K_f + K_i", "U_f - U_i"] } },
    { id: "gormvinna", name: "Vinna gorms", tex: "W_s = \\tfrac12 k x_i^2 - \\tfrac12 k x_f^2",
      about: "Vinnan sem gormur vinnur á hlut þegar útslag gormsins breytist úr $x_i$ í $x_f$. Gormkrafturinn er $F = -kx$.",
      vars: [["k", "gormstuðull", "N/m"], ["x", "lenging eða þjöppun gormsins", "m"]],
      fill: { tex: "W_s = \\tfrac12 k x_i^2 - □", ans: "\\tfrac12 k x_f^2", wrong: ["k x_f", "\\tfrac12 k x_f", "k x_f^2"] } },
    { id: "afl", name: "Afl", tex: "P = \\dfrac{dW}{dt} = \\vec F\\cdot\\vec v",
      about: "Afl er vinna á tímaeiningu. Mælt í vöttum, $1\\,\\mathrm{W} = 1\\,\\mathrm{J/s}$.",
      vars: [["P", "afl", "W"], ["\\vec v", "hraði", "m/s"]],
      fill: { tex: "P = \\vec F\\cdot □", ans: "\\vec v", wrong: ["\\vec d", "\\vec a", "t"] } },
    { id: "thyngdarvinna", name: "Vinna þyngdarkraftsins", tex: "W_g = -mg\\,\\Delta y",
      about: "Þyngdarkrafturinn vinnur jákvæða vinnu þegar hlutur fer niður og neikvæða þegar hann fer upp.",
      vars: [["\\Delta y", "hæðarbreyting (upp jákvætt)", "m"]],
      fill: { tex: "W_g = □", ans: "-mg\\,\\Delta y", wrong: ["mg\\,\\Delta y", "\\tfrac12 mg\\,\\Delta y", "-m\\,\\Delta y"] } }
  ],
  problems: [
    { id: "sledi", title: "Sleði dreginn í bandi", eqs: ["vinna"],
      gen: function (R, E) {
        var F = R.num(40, 150, 10), th = R.pick([20, 25, 30, 35, 40, 45]), d = R.num(10, 60, 5);
        var W = F * d * Math.cos(E.rad(th));
        return {
          text: "Barn dregur sleða " + E.q(d, "m") + " eftir láréttum snjó með bandi sem myndar " + E.q(th, "°") + " horn við lárétt. Togkrafturinn í bandinu er " + E.q(F, "N") + ". Hve mikla vinnu vinnur barnið?",
          parts: [{ label: "Vinna", ans: W, unit: "J" }],
          steps: ["Aðeins lárétti þáttur kraftsins vinnur, því færslan er lárétt.",
            "$W = Fd\\cos\\phi = " + E.n(F) + "\\cdot " + E.n(d) + "\\cos" + th + "^{\\circ} = " + E.t(W, "J") + "$"]
        };
      } },
    { id: "vo", title: "Hraði eftir togkraft og núning", eqs: ["vo", "vinna", "K"],
      gen: function (R, E) {
        var m = R.num(5, 25, 1), F = R.num(40, 120, 10), mu = R.num(0.1, 0.3, 0.05), d = R.num(3, 12, 1);
        if (F <= mu * m * E.g) F = Math.ceil(mu * m * E.g / 10) * 10 + 20;
        var W = (F - mu * m * E.g) * d, v = Math.sqrt(2 * W / m);
        return {
          text: "Kassi með massa " + E.q(m, "kg") + " liggur kyrr á gólfi. Láréttur kraftur " + E.q(F, "N") + " dregur hann " + E.q(d, "m") + ". Hreyfinúningsstuðullinn er $" + E.n(mu) + "$. Notaðu vinnu- og orkulögmálið.",
          parts: [{ label: "Heildarvinnan á kassann", ans: W, unit: "J" }, { label: "Hraði kassans eftir " + E.q(d, "m"), ans: v, unit: "m/s" }],
          steps: ["$W_F = Fd = " + E.t(F * d, "J") + "$ og $W_f = -\\mu_k mg d = -" + E.t(mu * m * E.g * d, "J") + "$",
            "$W_{\\text{heild}} = " + E.t(W, "J") + "$",
            "$W_{\\text{heild}} = \\tfrac12 mv^2 - 0 \\Rightarrow v = \\sqrt{\\dfrac{2W}{m}} = \\sqrt{\\dfrac{2\\cdot " + E.n(W) + "}{" + E.n(m) + "}} = " + E.t(v, "m/s") + "$"]
        };
      } },
    { id: "hemlun", title: "Hemlunarvegalengd með orku", eqs: ["vo", "K"],
      gen: function (R, E) {
        var kmh = R.num(40, 100, 10), mu = R.pick([0.5, 0.6, 0.7, 0.8]), v = kmh / 3.6;
        var d = v * v / (2 * mu * E.g);
        return {
          text: "Bíll á " + E.q(kmh, "km/klst") + " læsir hjólunum og rennur þar til hann stöðvast. Hreyfinúningsstuðullinn milli dekkja og vegar er $" + E.n(mu) + "$. Hve langt rennur bíllinn?",
          parts: [{ label: "Rennslisvegalengd", ans: d, unit: "m" }],
          steps: ["Núningurinn er eini krafturinn sem vinnur: $W = -\\mu_k mg d$.",
            "$-\\mu_k mg d = 0 - \\tfrac12 mv^2 \\Rightarrow d = \\dfrac{v^2}{2\\mu_k g}$",
            "$v = " + E.t(v, "m/s") + "$, svo $d = \\dfrac{" + E.n(v) + "^2}{2\\cdot " + E.n(mu) + "\\cdot 9{,}8} = " + E.t(d, "m") + "$",
            "Massinn styttist út: þungur og léttur bíll renna jafnlangt."]
        };
      } },
    { id: "afl", title: "Afl lyftu", eqs: ["afl", "thyngdarvinna"],
      gen: function (R, E) {
        var m = R.num(400, 1200, 50), h = R.num(10, 40, 2), t = R.num(10, 40, 2);
        var W = m * E.g * h, P = W / t;
        return {
          text: "Lyfta með farþegum, samtals " + E.q(m, "kg") + ", fer upp um " + E.q(h, "m") + " með jöfnum hraða á " + E.q(t, "s") + ".",
          parts: [{ label: "Vinna mótorsins", ans: W, unit: "J" }, { label: "Meðalafl mótorsins", ans: P, unit: "W" }],
          steps: ["Jafn hraði: mótorinn lyftir með krafti $F = mg$ og hreyfiorkan breytist ekki.",
            "$W = mgh = " + E.n(m) + "\\cdot 9{,}8\\cdot " + E.n(h) + " = " + E.t(W, "J") + "$",
            "$P = W/t = " + E.t(P, "W") + "$ (eða $P = Fv = mg\\,h/t$)"]
        };
      } },
    { id: "gormur", title: "Vinna til að teygja gorm", eqs: ["gormvinna"],
      gen: function (R, E) {
        var k = R.num(100, 800, 50), x1 = R.num(0.02, 0.1, 0.01), x2 = x1 + R.num(0.03, 0.15, 0.01);
        var W = 0.5 * k * (x2 * x2 - x1 * x1);
        return {
          text: "Gormur með gormstuðul " + E.q(k, "N/m") + " er þegar teygður um " + E.q(x1 * 100, "cm") + ". Hve mikla vinnu þarf að vinna til að teygja hann þannig að lengingin verði " + E.q(x2 * 100, "cm") + "?",
          parts: [{ label: "Vinna", ans: W, unit: "J" }],
          steps: ["Vinnan sem við vinnum er mínus vinna gormsins: $W = \\tfrac12 k x_f^2 - \\tfrac12 k x_i^2$",
            "$W = \\tfrac12\\cdot " + E.n(k) + "(" + E.n(x2) + "^2 - " + E.n(x1) + "^2) = " + E.t(W, "J") + "$",
            "Munið að breyta cm í m."]
        };
      } }
  ]
});

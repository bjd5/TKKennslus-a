/* Kafli 2 – Hreyfing í einni vídd (OpenStax 3, vinnustofa 1–2) */
EDL.chapter({
  id: "k02", n: 2, book: "3", title: "Hreyfing í einni vídd", short: "Hraði, hröðun, föst hröðun og frjálst fall",
  intro: "Staðsetning, hraði og hröðun eftir beinni línu. Þegar hröðunin er föst gilda hreyfijöfnurnar þrjár, og frjálst fall er sértilfelli með $a = -g$.",
  eqs: [
    { id: "medal", name: "Meðalhraði", tex: "v_{\\text{meðal}} = \\dfrac{\\Delta x}{\\Delta t}",
      about: "Heildartilfærsla deilt með tímanum sem hún tók.",
      vars: [["\\Delta x", "tilfærsla", "m"], ["\\Delta t", "tímabil", "s"]],
      fill: { tex: "v_{\\text{meðal}} = □", ans: "\\dfrac{\\Delta x}{\\Delta t}", wrong: ["\\dfrac{\\Delta t}{\\Delta x}", "\\Delta x\\,\\Delta t", "\\dfrac{v_0 + v}{\\Delta t}"] } },
    { id: "afleida", name: "Hraði og hröðun sem afleiður", tex: "v = \\dfrac{dx}{dt},\\qquad a = \\dfrac{dv}{dt} = \\dfrac{d^2x}{dt^2}",
      about: "Augnablikshraði er afleiða staðsetningar með tilliti til tíma og hröðun er afleiða hraðans.",
      vars: [["x(t)", "staðsetning sem fall af tíma", "m"], ["a", "hröðun", "m/s^2"]],
      fill: { tex: "a = □", ans: "\\dfrac{dv}{dt}", wrong: ["\\dfrac{dx}{dt}", "\\int v\\,dt", "\\dfrac{v}{x}"] } },
    { id: "v-t", name: "Hraði við fasta hröðun", tex: "v = v_0 + at",
      about: "Hraðinn breytist línulega með tíma þegar hröðunin er föst.",
      vars: [["v_0", "upphafshraði", "m/s"], ["t", "tími", "s"]],
      fill: { tex: "v = v_0 + □", ans: "at", wrong: ["\\tfrac12 at^2", "\\dfrac{a}{t}", "v_0 t"] } },
    { id: "x-t", name: "Staðsetning við fasta hröðun", tex: "x = x_0 + v_0 t + \\tfrac12 a t^2",
      about: "Staðsetning sem fall af tíma þegar hröðunin er föst.",
      vars: [["x_0", "upphafsstaðsetning", "m"], ["v_0", "upphafshraði", "m/s"]],
      fill: { tex: "x = x_0 + v_0 t + □", ans: "\\tfrac12 a t^2", wrong: ["at", "a t^2", "\\tfrac12 v t^2"] } },
    { id: "v2", name: "Tímalausa jafnan", tex: "v^2 = v_0^2 + 2a(x - x_0)",
      about: "Tengir hraða og tilfærslu án þess að tíminn komi fyrir. Hentug þegar tíminn er hvorki gefinn né spurt um hann.",
      vars: [["x - x_0", "tilfærsla", "m"], ["v", "lokahraði", "m/s"]],
      fill: { tex: "v^2 = v_0^2 + □", ans: "2a(x-x_0)", wrong: ["a(x-x_0)", "2a t", "\\tfrac12 a(x-x_0)^2"] } },
    { id: "fall", name: "Frjálst fall", tex: "a_y = -g,\\quad g = 9{,}8\\,\\mathrm{m/s^2}",
      about: "Hlutur sem hreyfist aðeins undir áhrifum þyngdarkraftsins hefur fasta hröðun niður á við, óháð massa.",
      vars: [["g", "þyngdarhröðun við yfirborð jarðar", "m/s^2"]] }
  ],
  problems: [
    { id: "hemlun", title: "Hemlunarvegalengd", eqs: ["v2", "v-t"],
      gen: function (R, E) {
        var kmh = R.num(50, 110, 10), a = R.num(4, 8, 0.5), v0 = kmh / 3.6;
        var d = v0 * v0 / (2 * a), t = v0 / a;
        return {
          text: "Bíll á " + E.q(kmh, "km/klst") + " hemlar með fastri seinkun " + E.q(a, "m/s^2") + " þar til hann stöðvast.",
          parts: [{ label: "Hemlunarvegalengd", ans: d, unit: "m" }, { label: "Hemlunartími", ans: t, unit: "s" }],
          steps: ["$v_0 = " + E.n(kmh) + "/3{,}6 = " + E.t(v0, "m/s") + "$ og hröðunin er $a = -" + E.t(a, "m/s^2") + "$.",
            "Tímalausa jafnan með $v = 0$: $0 = v_0^2 - 2ad \\Rightarrow d = \\dfrac{v_0^2}{2a} = \\dfrac{" + E.n(v0) + "^2}{2\\cdot " + E.n(a) + "} = " + E.t(d, "m") + "$",
            "$0 = v_0 - at \\Rightarrow t = v_0/a = " + E.t(t, "s") + "$"]
        };
      } },
    { id: "upp", title: "Bolta kastað beint upp", eqs: ["v2", "v-t", "fall"],
      gen: function (R, E) {
        var v0 = R.num(8, 25, 1), g = E.g;
        var H = v0 * v0 / (2 * g), T = 2 * v0 / g;
        return {
          text: "Bolta er kastað beint upp í loftið með hraða " + E.q(v0, "m/s") + ". Hunsaðu loftmótstöðu.",
          parts: [{ label: "Mesta hæð yfir kaststað", ans: H, unit: "m" }, { label: "Tími þar til boltinn kemur aftur í kasthæð", ans: T, unit: "s" }],
          steps: ["Í hæsta punkti er $v = 0$: $0 = v_0^2 - 2gH \\Rightarrow H = \\dfrac{v_0^2}{2g} = \\dfrac{" + E.n(v0) + "^2}{2\\cdot 9{,}8} = " + E.t(H, "m") + "$",
            "Tími upp: $t_1 = v_0/g = " + E.t(v0 / g, "s") + "$. Ferðin niður tekur jafnlangan tíma, svo $T = 2v_0/g = " + E.t(T, "s") + "$"]
        };
      } },
    { id: "medal", title: "Meðalhraði á tveimur leggjum", eqs: ["medal"],
      gen: function (R, E) {
        var d = R.num(20, 80, 5), v1 = R.num(40, 90, 10), v2 = R.num(40, 110, 10);
        if (v1 === v2) v2 += 20;
        var t1 = d / v1, t2 = d / v2, vm = 2 * d / (t1 + t2);
        return {
          text: "Þú ekur " + E.q(d, "km") + " á " + E.q(v1, "km/klst") + " og síðan aðra " + E.q(d, "km") + " á " + E.q(v2, "km/klst") + ". Hver er meðalhraðinn á allri leiðinni?",
          parts: [{ label: "Meðalhraði", ans: vm, unit: "km/klst" }],
          hint: "Meðalhraði er ekki meðaltal hraðanna. Finndu heildartímann.",
          steps: ["$t_1 = " + E.n(d) + "/" + E.n(v1) + " = " + E.t(t1, "klst") + "$, $\\;t_2 = " + E.n(d) + "/" + E.n(v2) + " = " + E.t(t2, "klst") + "$",
            "$v_{\\text{meðal}} = \\dfrac{\\Delta x}{\\Delta t} = \\dfrac{" + E.n(2 * d) + "}{" + E.n(t1 + t2) + "} = " + E.t(vm, "km/klst") + "$",
            "Meðalhraðinn er nær lægri hraðanum því lengri tíma er varið á honum."]
        };
      } },
    { id: "brunnur", title: "Steinn látinn falla í brunn", eqs: ["x-t", "v-t", "fall"],
      gen: function (R, E) {
        var t = R.num(1.5, 4, 0.1), g = E.g;
        var h = 0.5 * g * t * t, v = g * t;
        return {
          text: "Þú lætur stein falla úr kyrrstöðu ofan í brunn og hann skellur á vatninu eftir " + E.q(t, "s") + ". (Hunsaðu tímann sem hljóðið tekur.)",
          parts: [{ label: "Dýpt niður að vatni", ans: h, unit: "m" }, { label: "Hraði steinsins þegar hann skellur á vatninu", ans: v, unit: "m/s" }],
          steps: ["Látum stefnu niður vera jákvæða, $v_0 = 0$ og $a = g$.",
            "$h = \\tfrac12 g t^2 = \\tfrac12\\cdot 9{,}8\\cdot " + E.n(t) + "^2 = " + E.t(h, "m") + "$",
            "$v = g t = 9{,}8\\cdot " + E.n(t) + " = " + E.t(v, "m/s") + "$"]
        };
      } },
    { id: "afleida", title: "Hraði og hröðun út frá $x(t)$", eqs: ["afleida"],
      gen: function (R, E) {
        var b = R.num(0.5, 3, 0.5), c = R.num(2, 12, 1), t = R.num(1, 4, 0.5);
        var v = 3 * b * t * t - c, a = 6 * b * t;
        if (v === 0) { c += 1; v = 3 * b * t * t - c; }
        return {
          text: "Staðsetning agnar er $x(t) = " + E.n(b) + "\\,t^3 - " + E.n(c) + "\\,t$ (í metrum, $t$ í sekúndum). Finndu hraða og hröðun agnarinnar við $t = " + E.t(t, "s") + "$.",
          parts: [{ label: "Hraði $v$", ans: v, unit: "m/s" }, { label: "Hröðun $a$", ans: a, unit: "m/s^2" }],
          steps: ["$v(t) = \\dfrac{dx}{dt} = " + E.n(3 * b) + "\\,t^2 - " + E.n(c) + "$, svo $v(" + E.n(t) + ") = " + E.n(3 * b) + "\\cdot " + E.n(t * t) + " - " + E.n(c) + " = " + E.t(v, "m/s") + "$",
            "$a(t) = \\dfrac{dv}{dt} = " + E.n(6 * b) + "\\,t$, svo $a(" + E.n(t) + ") = " + E.t(a, "m/s^2") + "$"]
        };
      } }
  ]
});

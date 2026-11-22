/* Kafli 14 – Sveiflur (OpenStax 15, vinnustofa 11–12) */
EDL.chapter({
  id: "k14", n: 14, book: "15", title: "Sveiflur", short: "Hreintóna sveiflur, gormar, orka og pendúlar",
  intro: "Þegar endurheimtukrafturinn er í réttu hlutfalli við útslagið verður hreyfingin hreintóna sveifla, $x = A\\cos(\\omega t + \\phi)$. Lotan ræðst af kerfinu (gormstuðli og massa, eða lengd og $g$) en ekki af útslaginu.",
  eqs: [
    { id: "Tf", name: "Lota, tíðni og horntíðni", tex: "T = \\dfrac{1}{f},\\qquad \\omega = 2\\pi f = \\dfrac{2\\pi}{T}",
      about: "Lota er tími einnar sveiflu, tíðni er fjöldi sveiflna á sekúndu og horntíðni er í rad/s.",
      vars: [["f", "tíðni", "Hz"], ["T", "lota (sveiflutími)", "s"], ["\\omega", "horntíðni", "rad/s"]],
      fill: { tex: "\\omega = □", ans: "2\\pi f", wrong: ["\\dfrac{f}{2\\pi}", "\\dfrac{2\\pi}{f}", "\\pi f"] } },
    { id: "gormur", name: "Horntíðni massa á gormi", tex: "\\omega = \\sqrt{\\dfrac{k}{m}},\\qquad T = 2\\pi\\sqrt{\\dfrac{m}{k}}",
      about: "Stífari gormur gefur hraðari sveiflu, meiri massi hægari. Óháð útslaginu.",
      vars: [["k", "gormstuðull", "N/m"], ["m", "massi", "kg"]],
      fill: { tex: "T = 2\\pi\\sqrt{□}", ans: "\\dfrac{m}{k}", wrong: ["\\dfrac{k}{m}", "mk", "\\dfrac{L}{g}"] } },
    { id: "xt", name: "Staðsetning í hreintóna sveiflu", tex: "x(t) = A\\cos(\\omega t + \\phi)",
      about: "Lausn hreyfijöfnunnar $m\\ddot x = -kx$.",
      vars: [["A", "útslag (mesta frávik)", "m"], ["\\phi", "fasahorn", "rad"]],
      fill: { tex: "x(t) = A\\,□", ans: "\\cos(\\omega t + \\phi)", wrong: ["\\cos(\\omega + \\phi t)", "e^{-\\omega t}", "\\omega\\cos\\phi"] } },
    { id: "vmax", name: "Mesti hraði og mesta hröðun", tex: "v_{\\max} = A\\omega,\\qquad a_{\\max} = A\\omega^2",
      about: "Hraðinn er mestur í jafnvægisstöðunni og hröðunin mest í ystu stöðunum.",
      vars: [["v_{\\max}", "mesti hraði", "m/s"], ["a_{\\max}", "mesta hröðun", "m/s^2"]],
      fill: { tex: "a_{\\max} = □", ans: "A\\omega^2", wrong: ["A\\omega", "A^2\\omega", "\\dfrac{A}{\\omega^2}"] } },
    { id: "orka", name: "Orka í sveiflu", tex: "E = \\tfrac12 kA^2 = \\tfrac12 mv^2 + \\tfrac12 kx^2",
      about: "Heildarorkan er föst og skiptist milli hreyfiorku og fjaðurstöðuorku. Hraði í stöðu $x$: $v = \\omega\\sqrt{A^2 - x^2}$.",
      vars: [["E", "heildarorka sveiflunnar", "J"], ["x", "frávik frá jafnvægisstöðu", "m"]],
      fill: { tex: "E = □", ans: "\\tfrac12 kA^2", wrong: ["kA", "\\tfrac12 kA", "\\tfrac12 mA^2"] } },
    { id: "pendull", name: "Einfaldur pendúll", tex: "T = 2\\pi\\sqrt{\\dfrac{L}{g}}",
      about: "Gildir fyrir litlar sveiflur. Óháð massa kúlunnar.",
      vars: [["L", "lengd pendúlsins", "m"]],
      fill: { tex: "T = 2\\pi\\sqrt{□}", ans: "\\dfrac{L}{g}", wrong: ["\\dfrac{g}{L}", "\\dfrac{m}{k}", "Lg"] } },
    { id: "efnis", name: "Efnislegur pendúll", tex: "T = 2\\pi\\sqrt{\\dfrac{I}{mgh}}",
      about: "Stjarfhlutur sem sveiflast um ás; $h$ er fjarlægðin frá ásnum að massamiðjunni.",
      vars: [["I", "hverfitregða um snúningsásinn", "kg·m^2"], ["h", "fjarlægð frá ás að massamiðju", "m"]],
      fill: { tex: "T = 2\\pi\\sqrt{\\dfrac{I}{□}}", ans: "mgh", wrong: ["mg", "mh^2", "kh"] } }
  ],
  problems: [
    { id: "gormur", title: "Massi á gormi", eqs: ["gormur", "Tf"],
      gen: function (R, E) {
        var m = R.num(0.2, 3, 0.1), k = R.num(20, 400, 10);
        var w = Math.sqrt(k / m), T = 2 * Math.PI / w;
        return {
          text: "Lóð með massa " + E.q(m, "kg") + " sveiflast á gormi með gormstuðul " + E.q(k, "N/m") + ".",
          parts: [{ label: "Horntíðni", ans: w, unit: "rad/s" }, { label: "Lota", ans: T, unit: "s" }, { label: "Tíðni", ans: 1 / T, unit: "Hz" }],
          steps: ["$\\omega = \\sqrt{k/m} = \\sqrt{" + E.n(k) + "/" + E.n(m) + "} = " + E.t(w, "rad/s") + "$",
            "$T = 2\\pi/\\omega = " + E.t(T, "s") + "$",
            "$f = 1/T = " + E.t(1 / T, "Hz") + "$"]
        };
      } },
    { id: "vmax", title: "Mesti hraði og hröðun", eqs: ["vmax", "Tf"],
      gen: function (R, E) {
        var A = R.num(2, 15, 1), f = R.num(0.5, 5, 0.5);
        var w = 2 * Math.PI * f, v = A / 100 * w, a = A / 100 * w * w;
        return {
          text: "Hlutur sveiflast hreintóna með útslagi " + E.q(A, "cm") + " og tíðni " + E.q(f, "Hz") + ".",
          parts: [{ label: "Mesti hraði", ans: v, unit: "m/s" }, { label: "Mesta hröðun", ans: a, unit: "m/s^2" }],
          steps: ["$\\omega = 2\\pi f = " + E.t(w, "rad/s") + "$ og $A = " + E.t(A / 100, "m") + "$",
            "$v_{\\max} = A\\omega = " + E.t(v, "m/s") + "$",
            "$a_{\\max} = A\\omega^2 = " + E.t(a, "m/s^2") + "$"]
        };
      } },
    { id: "orka", title: "Orka og hraði í sveiflu", eqs: ["orka"],
      gen: function (R, E) {
        var k = R.num(50, 500, 25), m = R.num(0.5, 4, 0.5), A = R.num(5, 20, 1), x = R.num(1, A - 1, 1);
        var Et = 0.5 * k * Math.pow(A / 100, 2), v = Math.sqrt(k / m * (Math.pow(A / 100, 2) - Math.pow(x / 100, 2)));
        return {
          text: "Kubbur með massa " + E.q(m, "kg") + " á láréttum gormi ($k = " + E.t(k, "N/m") + "$) sveiflast núningslaust með útslagi " + E.q(A, "cm") + ".",
          parts: [{ label: "Heildarorka sveiflunnar", ans: Et, unit: "J" }, { label: "Hraði kubbsins þegar hann er " + E.q(x, "cm") + " frá jafnvægisstöðu", ans: v, unit: "m/s" }],
          steps: ["$E = \\tfrac12 kA^2 = \\tfrac12\\cdot " + E.n(k) + "\\cdot " + E.n(A / 100) + "^2 = " + E.t(Et, "J") + "$",
            "$\\tfrac12 mv^2 = E - \\tfrac12 kx^2 = " + E.t(Et - 0.5 * k * Math.pow(x / 100, 2), "J") + "$",
            "$v = \\sqrt{\\dfrac{k}{m}(A^2 - x^2)} = " + E.t(v, "m/s") + "$"]
        };
      } },
    { id: "pendull", title: "Pendúll með gefna lotu", eqs: ["pendull"],
      gen: function (R, E) {
        var T = R.num(0.8, 4, 0.1), fg = R.pick([["tunglinu", 1.62], ["Mars", 3.71]]);
        var L = E.g * T * T / (4 * Math.PI * Math.PI), T2 = 2 * Math.PI * Math.sqrt(L / fg[1]);
        return {
          text: "Hve langur þarf einfaldur pendúll að vera til að lotan sé " + E.q(T, "s") + " á jörðinni? Hver yrði lota sama pendúls á " + fg[0] + " ($g = " + E.t(fg[1], "m/s^2") + "$)?",
          parts: [{ label: "Lengd pendúlsins", ans: L, unit: "m" }, { label: "Lota á " + fg[0], ans: T2, unit: "s" }],
          steps: ["$T = 2\\pi\\sqrt{L/g} \\Rightarrow L = \\dfrac{gT^2}{4\\pi^2} = \\dfrac{9{,}8\\cdot " + E.n(T) + "^2}{4\\pi^2} = " + E.t(L, "m") + "$",
            "$T' = 2\\pi\\sqrt{L/g'} = 2\\pi\\sqrt{" + E.n(L) + "/" + E.n(fg[1]) + "} = " + E.t(T2, "s") + "$"]
        };
      } },
    { id: "peningur", title: "Peningur á lóðréttum gormi", eqs: ["vmax", "gormur"],
      gen: function (R, E) {
        var m = R.num(5, 20, 1) / 1000, A = R.num(0.5, 2.5, 0.1), g = E.g;
        var k = m * g / (A / 100), f = Math.sqrt(k / m) / (2 * Math.PI);
        return {
          text: "Smápeningur (" + E.q(m * 1000, "g") + ") liggur ofan á massalausum gormi sem sveiflast lóðrétt með útslagi " + E.q(A, "cm") + ". Hver er stærsti gormstuðull sem tryggir að peningurinn haldist í snertingu við gorminn alla sveifluna? (Byggt á lokaprófi 2018.)",
          parts: [{ label: "Mesti gormstuðull $k$", ans: k, unit: "N/m" }, { label: "Sveiflutíðni við þann gormstuðul", ans: f, unit: "Hz" }],
          steps: ["Á peninginn verka $N$ upp og $mg$ niður: $N = m(g + \\ddot y)$. Peningurinn losnar ef $N$ yrði neikvæður.",
            "Í efstu stöðu er hröðunin niður á við, $A\\omega^2$, svo skilyrðið er $A\\omega^2 \\le g$.",
            "$\\omega^2 = k/m \\Rightarrow k_{\\max} = \\dfrac{mg}{A} = \\dfrac{" + E.n(m) + "\\cdot 9{,}8}{" + E.n(A / 100) + "} = " + E.t(k, "N/m") + "$",
            "$f = \\dfrac{1}{2\\pi}\\sqrt{g/A} = " + E.t(f, "Hz") + "$"]
        };
      } }
  ]
});

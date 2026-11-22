/* Kafli 10 – Veltuhreyfing og hverfiþungi (OpenStax 11, vinnustofa 6–7) */
EDL.chapter({
  id: "k10", n: 10, book: "11", title: "Veltuhreyfing og hverfiþungi", short: "Rúllað án rennslis, hverfiþungi og varðveisla hans",
  intro: "Hlutur sem rúllar án rennslis hefur bæði hreyfiorku massamiðju og snúningsorku. Hverfiþungi varðveitist þegar ekkert ytra kraftvægi verkar, eins og hjá listdansara sem dregur að sér hendurnar.",
  eqs: [
    { id: "velta", name: "Rúllað án rennslis", tex: "v_{cm} = R\\omega,\\quad a_{cm} = R\\alpha",
      about: "Snertipunkturinn við undirlagið er augnabliks kyrr. Efsti punkturinn fer á $2v_{cm}$.",
      vars: [["v_{cm}", "hraði massamiðjunnar", "m/s"], ["R", "geisli hlutarins", "m"]],
      fill: { tex: "v_{cm} = □", ans: "R\\omega", wrong: ["\\dfrac{\\omega}{R}", "2R\\omega", "R\\alpha"] } },
    { id: "Kvelta", name: "Hreyfiorka í veltu", tex: "K = \\tfrac12 Mv_{cm}^2 + \\tfrac12 I_{cm}\\omega^2",
      about: "Hreyfiorka massamiðjunnar plús snúningsorka um massamiðjuna.",
      vars: [["I_{cm}", "hverfitregða um massamiðju", "kg·m^2"]],
      fill: { tex: "K = \\tfrac12 Mv_{cm}^2 + □", ans: "\\tfrac12 I_{cm}\\omega^2", wrong: ["\\tfrac12 Mv_{cm}\\omega", "I_{cm}\\omega", "\\tfrac12 MR^2"] } },
    { id: "skaplan", name: "Rúllað niður skáplan", tex: "v_{cm} = \\sqrt{\\dfrac{2gh}{1 + I_{cm}/(MR^2)}},\\quad a_{cm} = \\dfrac{g\\sin\\theta}{1 + I_{cm}/(MR^2)}",
      about: "Því meira af massanum sem er utarlega, þeim mun hægar rúllar hluturinn. Kúla ($\\tfrac25$) vinnur sívalning ($\\tfrac12$) sem vinnur hring ($1$).",
      vars: [["h", "lóðrétt fall massamiðjunnar", "m"], ["I_{cm}/(MR^2)", "lögunarstuðull hlutarins", ""]],
      fill: { tex: "a_{cm} = \\dfrac{g\\sin\\theta}{□}", ans: "1 + I_{cm}/(MR^2)", wrong: ["1 - I_{cm}/(MR^2)", "I_{cm}/(MR^2)", "2"] } },
    { id: "L", name: "Hverfiþungi stjarfhlutar", tex: "L = I\\omega",
      about: "Hverfiþungi hlutar sem snýst um fastan ás.",
      vars: [["L", "hverfiþungi", "kg·m^2/s"]],
      fill: { tex: "L = □", ans: "I\\omega", wrong: ["\\tfrac12 I\\omega^2", "I\\alpha", "m\\omega"] } },
    { id: "lagnar", name: "Hverfiþungi agnar", tex: "\\vec \\ell = \\vec r\\times\\vec p,\\quad \\ell = mvr_{\\perp}",
      about: "Ögn sem fer framhjá punkti hefur hverfiþunga um hann, jafnvel á beinni línu.",
      vars: [["r_{\\perp}", "hornrétt fjarlægð frá punktinum að hreyfilínunni", "m"]],
      fill: { tex: "\\vec\\ell = □", ans: "\\vec r\\times\\vec p", wrong: ["\\vec r\\cdot\\vec p", "\\vec p\\times\\vec F", "m\\vec r\\times\\vec a"] } },
    { id: "Lvard", name: "Varðveisla hverfiþunga", tex: "I_i\\omega_i = I_f\\omega_f",
      about: "Ef heildarkraftvægið á kerfið er núll breytist hverfiþunginn ekki.",
      vars: [["I_f", "hverfitregða í lokin", "kg·m^2"], ["\\omega_f", "hornhraði í lokin", "rad/s"]],
      fill: { tex: "I_i\\omega_i = □", ans: "I_f\\omega_f", wrong: ["\\tfrac12 I_f\\omega_f^2", "I_f\\omega_i", "I_i\\omega_f"] } },
    { id: "tauL", name: "Kraftvægi og hverfiþungi", tex: "\\sum\\vec\\tau = \\dfrac{d\\vec L}{dt}",
      about: "Snúningsútgáfa af $\\vec F = d\\vec p/dt$.",
      vars: [["\\vec L", "hverfiþungi kerfisins", "kg·m^2/s"]] }
  ],
  problems: [
    { id: "rulla", title: "Hlutur rúllar niður brekku", eqs: ["skaplan", "Kvelta"],
      gen: function (R, E) {
        var obj = R.pick([["gegnheil kúla", 0.4, "\\tfrac25"], ["gegnheill sívalningur", 0.5, "\\tfrac12"], ["þunnveggja hringur", 1, "1"], ["hol kúla", 2 / 3, "\\tfrac23"]]);
        var h = R.num(0.5, 4, 0.25), th = R.pick([15, 20, 25, 30, 35]);
        var v = Math.sqrt(2 * E.g * h / (1 + obj[1])), a = E.g * Math.sin(E.rad(th)) / (1 + obj[1]);
        return {
          text: "Hlutur (" + obj[0] + ", $I_{cm} = " + obj[2] + " MR^2$) rúllar án rennslis úr kyrrstöðu niður skáplan með halla " + E.q(th, "°") + " og lækkar um " + E.q(h, "m") + ".",
          parts: [{ label: "Hraði massamiðju neðst", ans: v, unit: "m/s" }, { label: "Hröðun massamiðju", ans: a, unit: "m/s^2" }],
          steps: ["Orka: $Mgh = \\tfrac12 Mv^2 + \\tfrac12 I\\omega^2 = \\tfrac12 Mv^2(1 + " + obj[2] + ")$, því $\\omega = v/R$.",
            "$v = \\sqrt{\\dfrac{2gh}{1 + " + obj[2] + "}} = \\sqrt{\\dfrac{2\\cdot 9{,}8\\cdot " + E.n(h) + "}{" + E.n(1 + obj[1]) + "}} = " + E.t(v, "m/s") + "$",
            "$a = \\dfrac{g\\sin\\theta}{1 + " + obj[2] + "} = \\dfrac{9{,}8\\sin" + th + "^{\\circ}}{" + E.n(1 + obj[1]) + "} = " + E.t(a, "m/s^2") + "$"]
        };
      } },
    { id: "listdans", title: "Listdansari dregur að sér hendurnar", eqs: ["Lvard", "L"],
      gen: function (R, E) {
        var I1 = R.num(2.5, 5, 0.1), I2 = R.num(0.8, 2, 0.1), f1 = R.num(0.5, 2, 0.1);
        var f2 = f1 * I1 / I2, K1 = 0.5 * I1 * Math.pow(2 * Math.PI * f1, 2), K2 = 0.5 * I2 * Math.pow(2 * Math.PI * f2, 2);
        return {
          text: "Listdansari snýst með " + E.q(f1, "sn/s") + " með hendurnar út; hverfitregðan er þá " + E.q(I1, "kg·m^2") + ". Hún dregur hendurnar að sér svo hverfitregðan verður " + E.q(I2, "kg·m^2") + ". Hunsaðu núning við ísinn.",
          parts: [{ label: "Ný snúningstíðni", ans: f2, unit: "sn/s" }, { label: "Aukning hreyfiorkunnar $K_f - K_i$", ans: K2 - K1, unit: "J" }],
          steps: ["Ekkert ytra kraftvægi, svo $I_1\\omega_1 = I_2\\omega_2$, og það sama gildir um tíðnina.",
            "$f_2 = f_1\\dfrac{I_1}{I_2} = " + E.n(f1) + "\\cdot\\dfrac{" + E.n(I1) + "}{" + E.n(I2) + "} = " + E.t(f2, "sn/s") + "$",
            "$K = \\tfrac12 I\\omega^2$ með $\\omega = 2\\pi f$: $K_i = " + E.t(K1, "J") + "$, $K_f = " + E.t(K2, "J") + "$",
            "Hreyfiorkan eykst um $" + E.t(K2 - K1, "J") + "$: dansarinn vinnur vinnu með vöðvunum."]
        };
      } },
    { id: "hringekja", title: "Barn stekkur upp á hringekju", eqs: ["Lvard", "lagnar"],
      gen: function (R, E) {
        var M = R.num(100, 300, 20), Rr = R.num(1.5, 3, 0.25), m = R.num(20, 50, 5), v = R.num(2, 5, 0.5);
        var I = 0.5 * M * Rr * Rr, w = m * v * Rr / (I + m * Rr * Rr);
        return {
          text: "Kyrrstæð hringekja er gegnheill diskur með massa " + E.q(M, "kg") + " og geisla " + E.q(Rr, "m") + ". Barn (" + E.q(m, "kg") + ") hleypur á " + E.q(v, "m/s") + " eftir snertli við jaðarinn og stekkur upp á hana. Hver er hornhraði hringekjunnar á eftir?",
          parts: [{ label: "Hornhraði", ans: w, unit: "rad/s" }],
          steps: ["Hverfiþungi barnsins um ásinn fyrir stökkið: $\\ell = mvR = " + E.t(m * v * Rr, "kg·m^2/s") + "$",
            "Hverfitregða á eftir: $I = \\tfrac12 MR^2 + mR^2 = " + E.t(I + m * Rr * Rr, "kg·m^2") + "$",
            "$\\omega = \\dfrac{mvR}{\\tfrac12 MR^2 + mR^2} = " + E.t(w, "rad/s") + "$"]
        };
      } },
    { id: "hjolorka", title: "Hlutfall snúningsorku í rúllandi hjóli", eqs: ["Kvelta", "velta"],
      gen: function (R, E) {
        var M = R.num(1, 10, 0.5), v = R.num(1, 8, 0.5), obj = R.pick([["gegnheill sívalningur", 0.5], ["gegnheil kúla", 0.4], ["hringur", 1]]);
        var Kt = 0.5 * M * v * v, Kr = obj[1] * Kt;
        return {
          text: "Hlutur (" + obj[0] + ") með massa " + E.q(M, "kg") + " rúllar án rennslis eftir gólfi með hraða massamiðju " + E.q(v, "m/s") + ".",
          parts: [{ label: "Heildarhreyfiorka", ans: Kt + Kr, unit: "J" }, { label: "Hlutfall snúningsorku af heildarorku", ans: 100 * Kr / (Kt + Kr), unit: "%" }],
          steps: ["$K_{\\text{bein}} = \\tfrac12 Mv^2 = " + E.t(Kt, "J") + "$",
            "$I_{cm} = " + E.n(obj[1]) + "MR^2$ og $\\omega = v/R$, svo $K_{\\text{snún}} = \\tfrac12 I\\omega^2 = " + E.n(obj[1]) + "\\cdot\\tfrac12 Mv^2 = " + E.t(Kr, "J") + "$",
            "$K = " + E.t(Kt + Kr, "J") + "$; hlutfall $= " + E.n(obj[1]) + "/(1 + " + E.n(obj[1]) + ") = " + E.t(100 * Kr / (Kt + Kr), "%") + "$"]
        };
      } },
    { id: "ogn", title: "Hverfiþungi agnar á beinni línu", eqs: ["lagnar"],
      gen: function (R, E) {
        var m = R.num(0.5, 5, 0.5), v = R.num(2, 12, 1), d = R.num(0.5, 4, 0.5);
        var l = m * v * d;
        return {
          text: "Ögn með massa " + E.q(m, "kg") + " fer á " + E.q(v, "m/s") + " eftir beinni línu sem liggur í " + E.q(d, "m") + " hornréttri fjarlægð frá punktinum $O$. Hver er hverfiþungi agnarinnar um $O$?",
          parts: [{ label: "Stærð hverfiþungans", ans: l, unit: "kg·m^2/s" }],
          steps: ["$\\ell = |\\vec r\\times\\vec p| = r p\\sin\\phi = m v r_{\\perp}$",
            "$\\ell = " + E.n(m) + "\\cdot " + E.n(v) + "\\cdot " + E.n(d) + " = " + E.t(l, "kg·m^2/s") + "$",
            "Hann er fastur meðan ögnin fer eftir línunni, því $r\\sin\\phi$ breytist ekki."]
        };
      } }
  ]
});

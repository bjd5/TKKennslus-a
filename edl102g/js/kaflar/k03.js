/* Kafli 3 – Hreyfing í tveimur og þremur víddum (OpenStax 4, vinnustofa 2) */
EDL.chapter({
  id: "k03", n: 3, book: "4", title: "Hreyfing í tveimur víddum", short: "Kast, hringhreyfing og afstæð hreyfing",
  intro: "Í kasti eru lárétt og lóðrétt hreyfing óháðar: lárétt er hraðinn fastur og lóðrétt er hröðunin $-g$. Í jafnri hringhreyfingu bendir hröðunin inn að miðju.",
  eqs: [
    { id: "kast-x", name: "Kast: lárétt hreyfing", tex: "x = v_0\\cos\\theta_0\\, t",
      about: "Lárétti hraðaþátturinn er fastur í kasti (engin lárétt hröðun).",
      vars: [["\\theta_0", "kasthorn yfir láréttu", "°"], ["v_0", "upphafshraði (ferð)", "m/s"]],
      fill: { tex: "x = □\\, t", ans: "v_0\\cos\\theta_0", wrong: ["v_0\\sin\\theta_0", "v_0", "\\tfrac12 g"] } },
    { id: "kast-y", name: "Kast: lóðrétt hreyfing", tex: "y = v_0\\sin\\theta_0\\, t - \\tfrac12 g t^2",
      about: "Lóðrétta hreyfingin er hreyfing með fastri hröðun $-g$.",
      vars: [["y", "hæð miðað við kaststað", "m"], ["g", "þyngdarhröðun", "m/s^2"]],
      fill: { tex: "y = v_0\\sin\\theta_0\\, t - □", ans: "\\tfrac12 g t^2", wrong: ["g t", "g t^2", "\\tfrac12 g t"] } },
    { id: "drag", name: "Kastvegalengd á sléttu", tex: "R = \\dfrac{v_0^2 \\sin 2\\theta_0}{g}",
      about: "Lárétt vegalengd þegar lent er í sömu hæð og kastað var úr. Mest við $45^{\\circ}$.",
      vars: [["R", "kastvegalengd (drægni)", "m"]],
      fill: { tex: "R = \\dfrac{v_0^2\\,□}{g}", ans: "\\sin 2\\theta_0", wrong: ["\\sin\\theta_0", "\\cos 2\\theta_0", "\\sin^2\\theta_0"] } },
    { id: "haed", name: "Mesta hæð í kasti", tex: "H = \\dfrac{(v_0\\sin\\theta_0)^2}{2g}",
      about: "Hæsti punktur kastferilsins, þar sem lóðrétti hraðaþátturinn er núll.",
      vars: [["H", "mesta hæð yfir kaststað", "m"]],
      fill: { tex: "H = \\dfrac{□}{2g}", ans: "(v_0\\sin\\theta_0)^2", wrong: ["(v_0\\cos\\theta_0)^2", "v_0\\sin\\theta_0", "v_0^2\\sin 2\\theta_0"] } },
    { id: "midsokn", name: "Miðsóknarhröðun", tex: "a_c = \\dfrac{v^2}{r} = \\omega^2 r",
      about: "Í hringhreyfingu bendir hröðunin inn að miðju hringsins, jafnvel þótt ferðin sé föst.",
      vars: [["a_c", "miðsóknarhröðun", "m/s^2"], ["r", "geisli hringsins", "m"], ["\\omega", "hornhraði", "rad/s"]],
      fill: { tex: "a_c = □", ans: "\\dfrac{v^2}{r}", wrong: ["\\dfrac{v}{r}", "v^2 r", "\\dfrac{r}{v^2}"] } },
    { id: "lota", name: "Umferðartími", tex: "T = \\dfrac{2\\pi r}{v} = \\dfrac{2\\pi}{\\omega}",
      about: "Tíminn sem ein umferð tekur í jafnri hringhreyfingu.",
      vars: [["T", "umferðartími (lota)", "s"]],
      fill: { tex: "T = □", ans: "\\dfrac{2\\pi r}{v}", wrong: ["\\dfrac{v}{2\\pi r}", "2\\pi r v", "\\dfrac{\\pi r}{v}"] } },
    { id: "afstaed", name: "Afstæður hraði", tex: "\\vec v_{PS} = \\vec v_{PS'} + \\vec v_{S'S}",
      about: "Hraði hlutar $P$ miðað við kerfi $S$ er hraðinn miðað við kerfi $S'$ plús hraði $S'$ miðað við $S$.",
      vars: [["\\vec v_{S'S}", "hraði kerfis $S'$ miðað við $S$", "m/s"]] }
  ],
  problems: [
    { id: "klettur", title: "Lárétt kast fram af kletti", eqs: ["kast-x", "kast-y"],
      gen: function (R, E) {
        var h = R.num(15, 80, 5), v0 = R.num(5, 20, 1), g = E.g;
        var t = Math.sqrt(2 * h / g), x = v0 * t, v = Math.sqrt(v0 * v0 + 2 * g * h);
        return {
          text: "Steini er kastað lárétt fram af " + E.q(h, "m") + " háum kletti með hraða " + E.q(v0, "m/s") + ".",
          parts: [{ label: "Flugtími", ans: t, unit: "s" }, { label: "Lárétt vegalengd frá klettinum", ans: x, unit: "m" }, { label: "Ferð steinsins rétt áður en hann lendir", ans: v, unit: "m/s" }],
          steps: ["Lóðrétt: $h = \\tfrac12 g t^2 \\Rightarrow t = \\sqrt{2h/g} = \\sqrt{2\\cdot " + E.n(h) + "/9{,}8} = " + E.t(t, "s") + "$",
            "Lárétt: $x = v_0 t = " + E.n(v0) + "\\cdot " + E.n(t) + " = " + E.t(x, "m") + "$",
            "$v_y = g t = " + E.t(g * t, "m/s") + "$, svo $v = \\sqrt{v_0^2 + v_y^2} = " + E.t(v, "m/s") + "$"]
        };
      } },
    { id: "skast", title: "Skáhallt kast", eqs: ["drag", "haed"],
      gen: function (R, E) {
        var v0 = R.num(12, 30, 1), th = R.pick([20, 25, 30, 35, 40, 50, 55, 60, 65]), g = E.g;
        var Rr = v0 * v0 * Math.sin(E.rad(2 * th)) / g, H = Math.pow(v0 * Math.sin(E.rad(th)), 2) / (2 * g);
        return {
          text: "Fótbolta er spyrnt af sléttum velli með hraða " + E.q(v0, "m/s") + " undir " + E.q(th, "°") + " horni við lárétt. Hunsaðu loftmótstöðu.",
          parts: [{ label: "Hve langt fer boltinn áður en hann lendir?", ans: Rr, unit: "m" }, { label: "Mesta hæð boltans", ans: H, unit: "m" }],
          steps: ["$R = \\dfrac{v_0^2\\sin 2\\theta_0}{g} = \\dfrac{" + E.n(v0) + "^2 \\sin " + (2 * th) + "^{\\circ}}{9{,}8} = " + E.t(Rr, "m") + "$",
            "$H = \\dfrac{(v_0\\sin\\theta_0)^2}{2g} = \\dfrac{(" + E.n(v0) + "\\sin" + th + "^{\\circ})^2}{2\\cdot 9{,}8} = " + E.t(H, "m") + "$"]
        };
      } },
    { id: "hringur", title: "Hringekja", eqs: ["midsokn", "lota"],
      gen: function (R, E) {
        var r = R.num(2, 8, 0.5), T = R.num(4, 15, 1);
        var v = 2 * Math.PI * r / T, a = v * v / r;
        return {
          text: "Barn situr " + E.q(r, "m") + " frá miðju hringekju sem fer einn hring á " + E.q(T, "s") + ".",
          parts: [{ label: "Ferð barnsins", ans: v, unit: "m/s" }, { label: "Miðsóknarhröðun barnsins", ans: a, unit: "m/s^2" }],
          steps: ["$v = \\dfrac{2\\pi r}{T} = \\dfrac{2\\pi\\cdot " + E.n(r) + "}{" + E.n(T) + "} = " + E.t(v, "m/s") + "$",
            "$a_c = \\dfrac{v^2}{r} = \\dfrac{" + E.n(v) + "^2}{" + E.n(r) + "} = " + E.t(a, "m/s^2") + "$"]
        };
      } },
    { id: "batur", title: "Bátur þverar á", eqs: ["afstaed"],
      gen: function (R, E) {
        var vb = R.num(2, 6, 0.5), vw = R.num(0.5, 3, 0.5), w = R.num(40, 200, 20);
        var v = Math.hypot(vb, vw), t = w / vb, drift = vw * t;
        return {
          text: "Bátur stefnir hornrétt yfir " + E.q(w, "m") + " breiða á. Hraði bátsins miðað við vatnið er " + E.q(vb, "m/s") + " og áin rennur með " + E.q(vw, "m/s") + ".",
          parts: [{ label: "Ferð bátsins miðað við bakkann", ans: v, unit: "m/s" }, { label: "Hve langt berst báturinn niður ána á leiðinni yfir?", ans: drift, unit: "m" }],
          steps: ["$\\vec v_{\\text{bátur,bakki}} = \\vec v_{\\text{bátur,vatn}} + \\vec v_{\\text{vatn,bakki}}$, og þættirnir eru hornréttir.",
            "$v = \\sqrt{" + E.n(vb) + "^2 + " + E.n(vw) + "^2} = " + E.t(v, "m/s") + "$",
            "Tíminn yfir ræðst aðeins af þverþættinum: $t = " + E.n(w) + "/" + E.n(vb) + " = " + E.t(t, "s") + "$",
            "Rek niður ána: $" + E.n(vw) + "\\cdot " + E.n(t) + " = " + E.t(drift, "m") + "$"]
        };
      } },
    { id: "kast-upp", title: "Kast af palli upp á við", eqs: ["kast-x", "kast-y"],
      gen: function (R, E) {
        var v0 = R.num(10, 22, 1), th = R.pick([20, 30, 35, 40, 45]), h = R.num(5, 25, 5), g = E.g;
        var vx = v0 * Math.cos(E.rad(th)), vy = v0 * Math.sin(E.rad(th));
        var t = (vy + Math.sqrt(vy * vy + 2 * g * h)) / g, x = vx * t;
        return {
          text: "Bolta er kastað af " + E.q(h, "m") + " háum palli með hraða " + E.q(v0, "m/s") + " undir " + E.q(th, "°") + " horni upp fyrir lárétt. Hvenær og hvar lendir hann á jörðinni?",
          parts: [{ label: "Flugtími", ans: t, unit: "s" }, { label: "Lárétt vegalengd", ans: x, unit: "m" }],
          steps: ["$v_{0x} = " + E.n(v0) + "\\cos" + th + "^{\\circ} = " + E.t(vx, "m/s") + "$, $\\;v_{0y} = " + E.n(v0) + "\\sin" + th + "^{\\circ} = " + E.t(vy, "m/s") + "$",
            "Lendir þegar $y = -h$: $-" + E.n(h) + " = " + E.n(vy) + "t - 4{,}9t^2$, sem er annars stigs jafna í $t$.",
            "$t = \\dfrac{v_{0y} + \\sqrt{v_{0y}^2 + 2gh}}{g} = " + E.t(t, "s") + "$ (jákvæða lausnin)",
            "$x = v_{0x} t = " + E.t(x, "m") + "$"]
        };
      } }
  ]
});

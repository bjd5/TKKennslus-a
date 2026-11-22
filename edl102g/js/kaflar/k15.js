/* Kafli 15 – Bylgjur (OpenStax 16, vinnustofa 11–12) */
EDL.chapter({
  id: "k15", n: 15, book: "16", title: "Bylgjur", short: "Bylgjujafnan, bylgjur á streng, afl og standbylgjur",
  intro: "Bylgja flytur orku án þess að efnið ferðist með. Hraði bylgju á streng ræðst af togkraftinum og massa á lengdareiningu, og þegar bylgjur endurkastast frá föstum endum myndast standbylgjur með ákveðnum tíðnum.",
  eqs: [
    { id: "vlf", name: "Útbreiðsluhraði bylgju", tex: "v = \\lambda f = \\dfrac{\\omega}{k}",
      about: "Bylgjan færist eina bylgjulengd á hverri sveiflulotu.",
      vars: [["\\lambda", "bylgjulengd", "m"], ["f", "tíðni", "Hz"], ["v", "útbreiðsluhraði", "m/s"]],
      fill: { tex: "v = □", ans: "\\lambda f", wrong: ["\\dfrac{\\lambda}{f}", "\\dfrac{f}{\\lambda}", "\\lambda f^2"] } },
    { id: "k", name: "Bylgjutala og horntíðni", tex: "k = \\dfrac{2\\pi}{\\lambda},\\qquad \\omega = 2\\pi f = \\dfrac{2\\pi}{T}",
      about: "Bylgjutalan segir til um fjölda radíana á lengdareiningu, horntíðnin fjölda radíana á tímaeiningu.",
      vars: [["k", "bylgjutala", "rad/m"], ["\\omega", "horntíðni", "rad/s"], ["T", "lota (sveiflutími)", "s"]],
      fill: { tex: "k = □", ans: "\\dfrac{2\\pi}{\\lambda}", wrong: ["2\\pi\\lambda", "\\dfrac{\\lambda}{2\\pi}", "\\dfrac{2\\pi}{T}"] } },
    { id: "yxt", name: "Hreintóna bylgja", tex: "y(x,t) = A\\sin(kx - \\omega t + \\phi)",
      about: "Bylgja sem ferðast í jákvæða $x$-stefnu. Með $+\\omega t$ ferðast hún í neikvæða stefnu.",
      vars: [["A", "útslag bylgjunnar", "m"], ["\\phi", "fasahorn", "rad"]],
      fill: { tex: "y(x,t) = A\\sin(□ + \\phi)", ans: "kx - \\omega t", wrong: ["\\omega x - kt", "kx\\,\\omega t", "\\lambda x - f t"] } },
    { id: "vstrengur", name: "Bylgjuhraði á streng", tex: "v = \\sqrt{\\dfrac{F_T}{\\mu}}",
      about: "Hraðinn vex með togkraftinum og minnkar með massa á lengdareiningu strengsins.",
      vars: [["F_T", "togkraftur í strengnum", "N"], ["\\mu", "massi á lengdareiningu", "kg/m"]],
      fill: { tex: "v = \\sqrt{□}", ans: "\\dfrac{F_T}{\\mu}", wrong: ["\\dfrac{\\mu}{F_T}", "F_T\\mu", "\\dfrac{F_T}{m}"] } },
    { id: "afl", name: "Meðalafl bylgju á streng", tex: "P_{\\text{meðal}} = \\tfrac12\\mu A^2\\omega^2 v",
      about: "Orkan sem bylgjan flytur á tímaeiningu. Vex með útslaginu og tíðninni í öðru veldi.",
      vars: [["P_{\\text{meðal}}", "meðalafl sem bylgjan flytur", "W"]],
      fill: { tex: "P_{\\text{meðal}} = \\tfrac12\\mu\\,□\\, v", ans: "A^2\\omega^2", wrong: ["A\\omega", "A^2\\omega", "A\\omega^2"] } },
    { id: "standbylgja", name: "Standbylgjur á streng", tex: "f_n = \\dfrac{nv}{2L},\\quad \\lambda_n = \\dfrac{2L}{n},\\quad n = 1, 2, 3, \\dots",
      about: "Strengur festur í báða enda getur aðeins sveiflast með þessum tíðnum. $n = 1$ er grunntónninn.",
      vars: [["L", "lengd strengsins", "m"], ["n", "númer yfirtónsins (hreintóns)", ""], ["f_n", "tíðni $n$-ta hreintónsins", "Hz"]],
      fill: { tex: "f_n = \\dfrac{nv}{□}", ans: "2L", wrong: ["L", "4L", "2\\pi L"] } }
  ],
  problems: [
    { id: "lesa", title: "Stærðir lesnar úr bylgjujöfnu", eqs: ["k", "vlf", "yxt"],
      gen: function (R, E) {
        var A = R.num(0.02, 0.1, 0.01), kk = R.num(2, 30, 2), ff = R.num(50, 1500, 50);
        var lam = 2 / kk, f = ff / 2, v = lam * f;
        return {
          text: "Bylgja á streng er lýst með $y(x,t) = " + E.n(A) + "\\cos(" + E.n(kk) + "\\pi\\, x - " + E.n(ff) + "\\pi\\, t)$, þar sem lengdir eru í metrum og tími í sekúndum. (Líkt dæmi 3 í lokaprófi 2015.)",
          parts: [{ label: "Bylgjulengd", ans: lam, unit: "m" }, { label: "Tíðni", ans: f, unit: "Hz" }, { label: "Útbreiðsluhraði", ans: v, unit: "m/s" }],
          steps: ["Berum saman við $y = A\\cos(kx - \\omega t)$: $k = " + E.n(kk) + "\\pi\\,\\mathrm{rad/m}$ og $\\omega = " + E.n(ff) + "\\pi\\,\\mathrm{rad/s}$.",
            "$\\lambda = \\dfrac{2\\pi}{k} = \\dfrac{2}{" + E.n(kk) + "} = " + E.t(lam, "m") + "$",
            "$f = \\dfrac{\\omega}{2\\pi} = \\dfrac{" + E.n(ff) + "}{2} = " + E.t(f, "Hz") + "$",
            "$v = \\lambda f = \\omega/k = " + E.t(v, "m/s") + "$ í jákvæða $x$-stefnu"]
        };
      } },
    { id: "gitar", title: "Gítarstrengur stilltur", eqs: ["standbylgja", "vstrengur"],
      gen: function (R, E) {
        var f = R.pick([82, 110, 147, 196, 247, 330]), L = R.num(0.6, 1, 0.05), dmm = R.num(0.3, 1.2, 0.1), rho = 7850;
        var mu = rho * Math.PI * Math.pow(dmm / 2000, 2), v = 2 * L * f, T = mu * v * v;
        return {
          text: "Stálstrengur á gítar hefur þvermál " + E.q(dmm, "mm") + " og virka lengd " + E.q(L, "m") + ". Eðlismassi stáls er " + E.q(rho, "kg/m^3") + ". Grunntónn strengsins á að vera " + E.q(f, "Hz") + ". (Byggt á dæmi 5 í lokaprófi 2018.)",
          parts: [{ label: "Bylgjulengd grunntónsins", ans: 2 * L, unit: "m" }, { label: "Bylgjuhraði á strengnum", ans: v, unit: "m/s" }, { label: "Togkraftur sem þarf", ans: T, unit: "N" }],
          steps: ["Grunntónn ($n = 1$): $\\lambda_1 = 2L = " + E.t(2 * L, "m") + "$",
            "$v = \\lambda_1 f = " + E.n(2 * L) + "\\cdot " + E.n(f) + " = " + E.t(v, "m/s") + "$",
            "$\\mu = \\rho\\pi r^2 = " + E.n(rho) + "\\cdot\\pi(" + E.n(dmm / 2000) + ")^2 = " + E.t(mu, "kg/m") + "$",
            "$v = \\sqrt{F_T/\\mu} \\Rightarrow F_T = \\mu v^2 = " + E.t(T, "N") + "$"]
        };
      } },
    { id: "yfirtonar", title: "Hreintónar strengs", eqs: ["standbylgja", "vstrengur"],
      gen: function (R, E) {
        var L = R.num(0.5, 2, 0.1), T = R.num(50, 400, 10), mu = R.num(1, 10, 0.5) / 1000, n = R.pick([2, 3, 4]);
        var v = Math.sqrt(T / mu), f1 = v / (2 * L);
        return {
          text: "Strengur er " + E.q(L, "m") + " langur, festur í báða enda, með massa á lengdareiningu " + E.q(mu * 1000, "g/m") + " og togkraft " + E.q(T, "N") + ".",
          parts: [{ label: "Tíðni grunntónsins", ans: f1, unit: "Hz" }, { label: "Tíðni " + n + ". hreintónsins", ans: n * f1, unit: "Hz" }, { label: "Bylgjulengd " + n + ". hreintónsins", ans: 2 * L / n, unit: "m" }],
          steps: ["$v = \\sqrt{F_T/\\mu} = \\sqrt{" + E.n(T) + "/" + E.n(mu) + "} = " + E.t(v, "m/s") + "$",
            "$f_1 = \\dfrac{v}{2L} = \\dfrac{" + E.n(v) + "}{" + E.n(2 * L) + "} = " + E.t(f1, "Hz") + "$",
            "$f_" + n + " = " + n + "f_1 = " + E.t(n * f1, "Hz") + "$ og $\\lambda_" + n + " = 2L/" + n + " = " + E.t(2 * L / n, "m") + "$"]
        };
      } },
    { id: "afl", title: "Afl bylgju á streng", eqs: ["afl", "vstrengur", "k"],
      gen: function (R, E) {
        var mu = R.num(2, 20, 1) / 1000, T = R.num(20, 200, 10), A = R.num(2, 15, 1) / 1000, f = R.num(20, 200, 10);
        var v = Math.sqrt(T / mu), w = 2 * Math.PI * f, P = 0.5 * mu * A * A * w * w * v;
        return {
          text: "Hreintóna bylgja með útslag " + E.q(A * 1000, "mm") + " og tíðni " + E.q(f, "Hz") + " er send eftir streng með massa á lengdareiningu " + E.q(mu * 1000, "g/m") + " og togkraft " + E.q(T, "N") + ".",
          parts: [{ label: "Bylgjuhraði", ans: v, unit: "m/s" }, { label: "Meðalafl sem bylgjan flytur", ans: P, unit: "W" }],
          steps: ["$v = \\sqrt{F_T/\\mu} = " + E.t(v, "m/s") + "$",
            "$\\omega = 2\\pi f = " + E.t(w, "rad/s") + "$",
            "$P = \\tfrac12\\mu A^2\\omega^2 v = \\tfrac12\\cdot " + E.n(mu) + "\\cdot " + E.n(A) + "^2\\cdot " + E.n(w) + "^2\\cdot " + E.n(v) + " = " + E.t(P, "W") + "$"]
        };
      } },
    { id: "hradi", title: "Púls á þvottasnúru", eqs: ["vstrengur", "vlf"],
      gen: function (R, E) {
        var m = R.num(0.1, 1, 0.05), L = R.num(5, 25, 1), T = R.num(20, 150, 5), f = R.num(2, 10, 1);
        var mu = m / L, v = Math.sqrt(T / mu), t = L / v;
        return {
          text: "Snúra er " + E.q(L, "m") + " löng og vegur " + E.q(m, "kg") + ". Hún er strekkt með togkrafti " + E.q(T, "N") + ". Annar endinn er hristur með tíðninni " + E.q(f, "Hz") + ".",
          parts: [{ label: "Bylgjuhraði", ans: v, unit: "m/s" }, { label: "Tíminn sem púls tekur að fara snúruna á enda", ans: t, unit: "s" }, { label: "Bylgjulengd", ans: v / f, unit: "m" }],
          steps: ["$\\mu = m/L = " + E.t(mu, "kg/m") + "$",
            "$v = \\sqrt{F_T/\\mu} = \\sqrt{" + E.n(T) + "/" + E.n(mu) + "} = " + E.t(v, "m/s") + "$",
            "$t = L/v = " + E.t(t, "s") + "$ og $\\lambda = v/f = " + E.t(v / f, "m") + "$"]
        };
      } }
  ]
});

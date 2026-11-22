/* Kafli 9 – Snúningshreyfing (OpenStax 10, vinnustofa 6) */
EDL.chapter({
  id: "k09", n: 9, book: "10", title: "Snúningshreyfing", short: "Hornhraði, hverfitregða, kraftvægi og snúningsorka",
  intro: "Snúningur er eins og bein hreyfing með nýjum táknum: $\\theta$ í stað $x$, $\\omega$ í stað $v$, $\\alpha$ í stað $a$, hverfitregða $I$ í stað massa og kraftvægi $\\tau$ í stað krafts.",
  eqs: [
    { id: "omega", name: "Snúningur með fastri hornhröðun", tex: "\\omega = \\omega_0 + \\alpha t,\\quad \\theta = \\omega_0 t + \\tfrac12\\alpha t^2",
      about: "Sömu jöfnur og fyrir beina hreyfingu með fastri hröðun, en fyrir horn.",
      vars: [["\\omega", "hornhraði", "rad/s"], ["\\alpha", "hornhröðun", "rad/s^2"], ["\\theta", "snúningshorn", "rad"]],
      fill: { tex: "\\theta = \\omega_0 t + □", ans: "\\tfrac12\\alpha t^2", wrong: ["\\alpha t", "\\tfrac12\\omega t^2", "\\alpha t^2"] } },
    { id: "omega2", name: "Tímalausa snúningsjafnan", tex: "\\omega^2 = \\omega_0^2 + 2\\alpha\\,\\Delta\\theta",
      about: "Tengir hornhraða og snúningshorn án tíma.",
      vars: [["\\Delta\\theta", "snúningshorn í radíönum", "rad"]],
      fill: { tex: "\\omega^2 = \\omega_0^2 + □", ans: "2\\alpha\\,\\Delta\\theta", wrong: ["\\alpha\\,\\Delta\\theta", "2\\alpha t", "\\tfrac12\\alpha\\,\\Delta\\theta^2"] } },
    { id: "tengsl", name: "Tengsl hornstærða og línulegra stærða", tex: "s = r\\theta,\\quad v = r\\omega,\\quad a_t = r\\alpha",
      about: "Punktur í fjarlægð $r$ frá ásnum fer vegalengdina $s$ með ferðinni $v$. Hornin verða að vera í radíönum.",
      vars: [["a_t", "snertilhröðun", "m/s^2"], ["r", "fjarlægð frá snúningsás", "m"]],
      fill: { tex: "v = □", ans: "r\\omega", wrong: ["\\dfrac{\\omega}{r}", "r\\omega^2", "r\\alpha"] } },
    { id: "I", name: "Hverfitregða", tex: "I = \\sum_i m_i r_i^2",
      about: "Hverfitregða segir til um hve erfitt er að breyta snúningi. Fer bæði eftir massa og hve langt hann er frá ásnum. Gegnheill diskur: $\\tfrac12 MR^2$, hringur: $MR^2$, stöng um miðju: $\\tfrac1{12}ML^2$.",
      vars: [["I", "hverfitregða", "kg·m^2"], ["r_i", "fjarlægð massans $m_i$ frá ásnum", "m"]],
      fill: { tex: "I = \\sum_i □", ans: "m_i r_i^2", wrong: ["m_i r_i", "\\tfrac12 m_i r_i", "m_i^2 r_i"] } },
    { id: "steiner", name: "Hliðrunarregla (Steiner)", tex: "I = I_{cm} + Mh^2",
      about: "Hverfitregða um ás sem er samsíða ás gegnum massamiðju, í fjarlægðinni $h$ frá honum.",
      vars: [["I_{cm}", "hverfitregða um ás gegnum massamiðju", "kg·m^2"], ["h", "fjarlægð milli ásanna", "m"]],
      fill: { tex: "I = I_{cm} + □", ans: "Mh^2", wrong: ["Mh", "\\tfrac12 Mh^2", "I_{cm}h^2"] } },
    { id: "Krot", name: "Snúningshreyfiorka", tex: "K = \\tfrac12 I\\omega^2",
      about: "Hreyfiorka hlutar sem snýst um fastan ás.",
      vars: [["K", "snúningshreyfiorka", "J"]],
      fill: { tex: "K = □", ans: "\\tfrac12 I\\omega^2", wrong: ["I\\omega^2", "\\tfrac12 I\\omega", "\\tfrac12 m\\omega^2"] } },
    { id: "tau", name: "Kraftvægi", tex: "\\tau = rF\\sin\\phi,\\qquad \\vec\\tau = \\vec r\\times\\vec F",
      about: "Snúningsáhrif krafts. Mest þegar krafturinn er hornréttur á armlegginn.",
      vars: [["\\tau", "kraftvægi", "N·m"], ["\\phi", "hornið milli $\\vec r$ og $\\vec F$", "°"]],
      fill: { tex: "\\tau = rF\\,□", ans: "\\sin\\phi", wrong: ["\\cos\\phi", "\\tan\\phi", "\\phi"] } },
    { id: "n2rot", name: "Annað lögmál Newtons fyrir snúning", tex: "\\sum\\tau = I\\alpha",
      about: "Heildarkraftvægið um fastan ás er hverfitregðan sinnum hornhröðunin.",
      vars: [["\\sum\\tau", "heildarkraftvægi", "N·m"]],
      fill: { tex: "\\sum\\tau = □", ans: "I\\alpha", wrong: ["I\\omega", "m\\alpha", "\\tfrac12 I\\alpha^2"] } }
  ],
  problems: [
    { id: "hjol", title: "Hjól sem hægir á sér", eqs: ["omega", "omega2"],
      gen: function (R, E) {
        var rpm = R.num(300, 1500, 100), t = R.num(5, 30, 1);
        var w0 = rpm * 2 * Math.PI / 60, al = w0 / t, th = w0 * t / 2, rev = th / (2 * Math.PI);
        return {
          text: "Hjól snýst með " + E.q(rpm, "sn/mín") + " og hægir jafnt á sér þar til það stöðvast eftir " + E.q(t, "s") + ".",
          parts: [{ label: "Stærð hornhröðunarinnar", ans: al, unit: "rad/s^2" }, { label: "Fjöldi snúninga þar til það stöðvast", ans: rev, unit: "" }],
          steps: ["$\\omega_0 = " + E.n(rpm) + "\\cdot\\dfrac{2\\pi}{60} = " + E.t(w0, "rad/s") + "$",
            "$0 = \\omega_0 - \\alpha t \\Rightarrow \\alpha = " + E.n(w0) + "/" + E.n(t) + " = " + E.t(al, "rad/s^2") + "$",
            "$\\Delta\\theta = \\tfrac12\\omega_0 t = " + E.t(th, "rad") + "$, sem eru $" + E.n(th) + "/2\\pi = " + E.n(rev) + "$ snúningar"]
        };
      } },
    { id: "geisladiskur", title: "Geisladiskur", eqs: ["tengsl"],
      gen: function (R, E) {
        var v = R.num(1.2, 1.4, 0.05), r1 = R.num(22, 26, 1), r2 = R.num(55, 60, 1);
        var w1 = v / (r1 / 1000), w2 = v / (r2 / 1000);
        return {
          text: "Geisladiskur er lesinn með fastri línulegri ferð " + E.q(v, "m/s") + ". Innsti hluti rásarinnar er " + E.q(r1, "mm") + " frá miðju og ysti hlutinn " + E.q(r2, "mm") + " frá miðju. (Byggt á lokaprófi 2013.)",
          parts: [{ label: "Hornhraði þegar innsti hlutinn er lesinn", ans: w1, unit: "rad/s" }, { label: "Hornhraði þegar ysti hlutinn er lesinn", ans: w2, unit: "rad/s" }],
          steps: ["$v = r\\omega \\Rightarrow \\omega = v/r$",
            "Innst: $\\omega = " + E.n(v) + "/" + E.n(r1 / 1000) + " = " + E.t(w1, "rad/s") + "$",
            "Yst: $\\omega = " + E.n(v) + "/" + E.n(r2 / 1000) + " = " + E.t(w2, "rad/s") + "$. Diskurinn snýst hægar þegar lesið er utar."]
        };
      } },
    { id: "kasthjol", title: "Orka í kasthjóli", eqs: ["Krot", "I"],
      gen: function (R, E) {
        var M = R.num(10, 80, 5), Rr = R.num(0.2, 0.6, 0.05), rpm = R.num(1000, 6000, 500);
        var I = 0.5 * M * Rr * Rr, w = rpm * 2 * Math.PI / 60, K = 0.5 * I * w * w;
        return {
          text: "Kasthjól er gegnheill diskur með massa " + E.q(M, "kg") + " og geisla " + E.q(Rr, "m") + ". Það snýst með " + E.q(rpm, "sn/mín") + ".",
          parts: [{ label: "Hverfitregða hjólsins", ans: I, unit: "kg·m^2" }, { label: "Snúningshreyfiorka", ans: K, unit: "J" }],
          steps: ["$I = \\tfrac12 MR^2 = \\tfrac12\\cdot " + E.n(M) + "\\cdot " + E.n(Rr) + "^2 = " + E.t(I, "kg·m^2") + "$",
            "$\\omega = " + E.n(rpm) + "\\cdot 2\\pi/60 = " + E.t(w, "rad/s") + "$",
            "$K = \\tfrac12 I\\omega^2 = " + E.t(K, "J") + "$"]
        };
      } },
    { id: "trissa", title: "Kassi fellur og vindur ofan af hjóli", eqs: ["n2rot", "tengsl", "I"],
      gen: function (R, E) {
        var m = R.num(1, 12, 1), M = R.num(2, 12, 1), Rr = R.num(0.1, 0.4, 0.05);
        var a = m * E.g / (m + M / 2), T = 0.5 * M * a;
        return {
          text: "Léttum spotta er vafið um gegnheilt hjól (diskur) með massa " + E.q(M, "kg") + " og geisla " + E.q(Rr, "m") + " sem snýst núningslaust um fastan ás. Kassi með massa " + E.q(m, "kg") + " hangir í spottanum og fellur. (Byggt á lokaprófi 2013.)",
          parts: [{ label: "Hröðun kassans", ans: a, unit: "m/s^2" }, { label: "Togkraftur í spottanum", ans: T, unit: "N" }],
          steps: ["Kassi: $mg - T = ma$. Hjól: $TR = I\\alpha = \\tfrac12 MR^2\\cdot\\dfrac{a}{R} \\Rightarrow T = \\tfrac12 Ma$",
            "$mg = (m + \\tfrac12 M)a \\Rightarrow a = \\dfrac{mg}{m + M/2} = \\dfrac{" + E.n(m) + "\\cdot 9{,}8}{" + E.n(m + M / 2) + "} = " + E.t(a, "m/s^2") + "$",
            "$T = \\tfrac12 Ma = " + E.t(T, "N") + "$",
            "Geislinn styttist út."]
        };
      } },
    { id: "stong", title: "Stöng um annan endann", eqs: ["steiner", "n2rot", "tau"],
      gen: function (R, E) {
        var M = R.num(0.5, 4, 0.5), L = R.num(0.5, 2, 0.1);
        var I = M * L * L / 3, tau = M * E.g * L / 2, al = tau / I;
        return {
          text: "Einsleit stöng með massa " + E.q(M, "kg") + " og lengd " + E.q(L, "m") + " getur snúist um lárétt ás gegnum annan endann. Henni er haldið láréttri og sleppt. Hverfitregða um miðju er $\\tfrac1{12}ML^2$.",
          parts: [{ label: "Hverfitregða um endann", ans: I, unit: "kg·m^2" }, { label: "Hornhröðun strax eftir að henni er sleppt", ans: al, unit: "rad/s^2" }],
          steps: ["$I = I_{cm} + M(L/2)^2 = \\tfrac1{12}ML^2 + \\tfrac14 ML^2 = \\tfrac13 ML^2 = " + E.t(I, "kg·m^2") + "$",
            "Þyngdin verkar í massamiðjunni: $\\tau = Mg\\,\\dfrac{L}{2} = " + E.t(tau, "N·m") + "$",
            "$\\alpha = \\tau/I = \\dfrac{3g}{2L} = " + E.t(al, "rad/s^2") + "$"]
        };
      } }
  ]
});

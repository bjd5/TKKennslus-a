/* Kafli 8 – Skriðþungi og árekstrar (OpenStax 9, vinnustofa 5) */
EDL.chapter({
  id: "k08", n: 8, book: "9", title: "Skriðþungi og árekstrar", short: "Kraftaukning, skriðþungavarðveisla, árekstrar og massamiðja",
  intro: "Í árekstri eru innri kraftarnir svo stórir og stuttir að ytri kraftar skipta engu máli: heildarskriðþunginn varðveitist. Hreyfiorkan varðveitist aðeins í fjaðrandi árekstri.",
  eqs: [
    { id: "p", name: "Skriðþungi", tex: "\\vec p = m\\vec v",
      about: "Skriðþungi er vigur í stefnu hraðans.",
      vars: [["\\vec p", "skriðþungi", "kg·m/s"]],
      fill: { tex: "\\vec p = □", ans: "m\\vec v", wrong: ["\\tfrac12 m v^2", "m\\vec a", "\\dfrac{\\vec v}{m}"] } },
    { id: "J", name: "Kraftaukning (impúls)", tex: "\\vec J = \\Delta\\vec p = \\vec F_{\\text{meðal}}\\,\\Delta t",
      about: "Kraftaukningin sem verkar á hlut er jöfn breytingunni á skriðþunga hans.",
      vars: [["\\vec J", "kraftaukning (impúls)", "N·s"], ["\\Delta t", "tíminn sem krafturinn verkar", "s"]],
      fill: { tex: "\\vec F_{\\text{meðal}}\\,\\Delta t = □", ans: "\\Delta\\vec p", wrong: ["\\Delta K", "m\\vec a", "\\vec p\\,\\Delta t"] } },
    { id: "vardveisla", name: "Skriðþungavarðveisla", tex: "m_1\\vec v_{1i} + m_2\\vec v_{2i} = m_1\\vec v_{1f} + m_2\\vec v_{2f}",
      about: "Gildir fyrir einangrað kerfi (engir ytri kraftar), t.d. í árekstrum og sprengingum.",
      vars: [["\\vec v_{1f}", "hraði hlutar 1 eftir árekstur", "m/s"]],
      fill: { tex: "m_1\\vec v_{1i} + m_2\\vec v_{2i} = □", ans: "m_1\\vec v_{1f} + m_2\\vec v_{2f}", wrong: ["\\tfrac12 m_1 v_{1f}^2 + \\tfrac12 m_2 v_{2f}^2", "(m_1 - m_2)\\vec v_f", "m_1\\vec v_{1f} - m_2\\vec v_{2f}"] } },
    { id: "ofjadrandi", name: "Alófjaðrandi árekstur", tex: "v_f = \\dfrac{m_1v_{1i} + m_2v_{2i}}{m_1 + m_2}",
      about: "Hlutirnir festast saman og hreyfast með sama hraða á eftir. Hreyfiorka tapast.",
      vars: [["v_f", "sameiginlegur hraði á eftir", "m/s"]],
      fill: { tex: "v_f = \\dfrac{m_1v_{1i} + m_2v_{2i}}{□}", ans: "m_1 + m_2", wrong: ["m_1 m_2", "m_1 - m_2", "2m_1"] } },
    { id: "fjadrandi", name: "Fjaðrandi árekstur, kyrrt skotmark", tex: "v_{1f} = \\dfrac{m_1 - m_2}{m_1 + m_2}v_{1i},\\quad v_{2f} = \\dfrac{2m_1}{m_1 + m_2}v_{1i}",
      about: "Einvíður árekstur þar sem bæði skriðþungi og hreyfiorka varðveitast og hlutur 2 er kyrr í upphafi.",
      vars: [["v_{2f}", "hraði skotmarksins eftir árekstur", "m/s"], ["v_{1i}", "hraði hlutar 1 fyrir árekstur", "m/s"]],
      fill: { tex: "v_{2f} = \\dfrac{□}{m_1 + m_2}v_{1i}", ans: "2m_1", wrong: ["m_1 - m_2", "2m_2", "m_1"] } },
    { id: "massamidja", name: "Massamiðja", tex: "x_{cm} = \\dfrac{1}{M}\\sum_i m_i x_i",
      about: "Massavegið meðaltal staðsetninga. Massamiðjan hreyfist eins og allur massinn væri þar og allir ytri kraftar verkuðu á hann.",
      vars: [["M", "heildarmassi kerfisins", "kg"], ["x_{cm}", "staðsetning massamiðju", "m"]],
      fill: { tex: "x_{cm} = □\\sum_i m_i x_i", ans: "\\dfrac{1}{M}", wrong: ["M", "\\dfrac{1}{N}", "\\dfrac{1}{2M}"] } }
  ],
  problems: [
    { id: "kylfa", title: "Kylfa slær bolta", eqs: ["J", "p"],
      gen: function (R, E) {
        var m = R.num(0.14, 0.16, 0.005), vi = R.num(25, 40, 1), vf = R.num(30, 50, 1), dt = R.num(1, 4, 0.5);
        var J = m * (vf + vi), F = J / (dt / 1000);
        return {
          text: "Hafnabolti (" + E.q(m * 1000, "g") + ") kemur á " + E.q(vi, "m/s") + " og er sleginn beint til baka á " + E.q(vf, "m/s") + ". Kylfan er í snertingu við boltann í " + E.q(dt, "ms") + ".",
          parts: [{ label: "Stærð kraftaukningarinnar", ans: J, unit: "N·s" }, { label: "Meðalkraftur kylfunnar", ans: F, unit: "N" }],
          steps: ["Látum stefnuna til baka vera jákvæða: $v_i = -" + E.n(vi) + "$, $v_f = +" + E.n(vf) + "\\,\\mathrm{m/s}$.",
            "$J = m(v_f - v_i) = " + E.n(m) + "(" + E.n(vf) + " + " + E.n(vi) + ") = " + E.t(J, "N·s") + "$",
            "$F_{\\text{meðal}} = J/\\Delta t = " + E.n(J) + "/" + E.n(dt / 1000) + " = " + E.t(F, "N") + "$"]
        };
      } },
    { id: "festast", title: "Vagnar festast saman", eqs: ["ofjadrandi"],
      gen: function (R, E) {
        var m1 = R.num(800, 2000, 100), m2 = R.num(800, 2000, 100), v1 = R.num(6, 20, 1), v2 = R.num(0, v1 - 3, 1);
        var vf = (m1 * v1 + m2 * v2) / (m1 + m2);
        var Ki = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2, Kf = 0.5 * (m1 + m2) * vf * vf;
        return {
          text: "Bíll (" + E.q(m1, "kg") + ") á " + E.q(v1, "m/s") + " ekur aftan á annan bíl (" + E.q(m2, "kg") + ") " + (v2 ? "sem fer í sömu átt á " + E.q(v2, "m/s") : "sem stendur kyrr") + ". Bílarnir festast saman.",
          parts: [{ label: "Hraði bílanna strax eftir áreksturinn", ans: vf, unit: "m/s" }, { label: "Hreyfiorka sem tapast", ans: Ki - Kf, unit: "J" }],
          steps: ["$v_f = \\dfrac{m_1v_1 + m_2v_2}{m_1 + m_2} = \\dfrac{" + E.n(m1) + "\\cdot " + E.n(v1) + " + " + E.n(m2) + "\\cdot " + E.n(v2) + "}{" + E.n(m1 + m2) + "} = " + E.t(vf, "m/s") + "$",
            "$K_i = " + E.t(Ki, "J") + "$, $\\;K_f = \\tfrac12(m_1 + m_2)v_f^2 = " + E.t(Kf, "J") + "$",
            "Tap: $K_i - K_f = " + E.t(Ki - Kf, "J") + "$"]
        };
      } },
    { id: "fjadrandi", title: "Fjaðrandi árekstur", eqs: ["fjadrandi"],
      gen: function (R, E) {
        var m1 = R.num(0.1, 2, 0.1), m2 = R.num(0.1, 2, 0.1), v = R.num(1, 6, 0.5);
        if (m1 === m2) m2 = +(m2 + 0.3).toFixed(1);
        var v1 = (m1 - m2) / (m1 + m2) * v, v2 = 2 * m1 / (m1 + m2) * v;
        return {
          text: "Kúla með massa " + E.q(m1, "kg") + " á " + E.q(v, "m/s") + " rekst beint og fjaðrandi á kyrra kúlu með massa " + E.q(m2, "kg") + ". Finndu hraða beggja eftir áreksturinn (jákvætt í upphaflegu hreyfistefnuna).",
          parts: [{ label: "$v_{1f}$", ans: v1, unit: "m/s" }, { label: "$v_{2f}$", ans: v2, unit: "m/s" }],
          steps: ["$v_{1f} = \\dfrac{m_1 - m_2}{m_1 + m_2}v_{1i} = \\dfrac{" + E.n(m1 - m2) + "}{" + E.n(m1 + m2) + "}\\cdot " + E.n(v) + " = " + E.t(v1, "m/s") + "$",
            "$v_{2f} = \\dfrac{2m_1}{m_1 + m_2}v_{1i} = \\dfrac{" + E.n(2 * m1) + "}{" + E.n(m1 + m2) + "}\\cdot " + E.n(v) + " = " + E.t(v2, "m/s") + "$",
            v1 < 0 ? "Neikvætt $v_{1f}$: léttari kúlan skoppar til baka." : "Jákvætt $v_{1f}$: þyngri kúlan heldur áfram, hægar."]
        };
      } },
    { id: "bakslag", title: "Bakslag á skautum", eqs: ["vardveisla"],
      gen: function (R, E) {
        var M = R.num(50, 90, 5), m = R.num(2, 8, 0.5), v = R.num(5, 20, 1);
        var V = m * v / M;
        return {
          text: "Skautamaður (" + E.q(M, "kg") + ") stendur kyrr á svellinu og kastar " + E.q(m, "kg") + " bolta lárétt fram með hraða " + E.q(v, "m/s") + ". Hve hratt rennur skautamaðurinn aftur á bak?",
          parts: [{ label: "Hraði skautamannsins", ans: V, unit: "m/s" }],
          steps: ["Heildarskriðþunginn er núll fyrir og eftir kastið: $0 = mv - MV$.",
            "$V = \\dfrac{mv}{M} = \\dfrac{" + E.n(m) + "\\cdot " + E.n(v) + "}{" + E.n(M) + "} = " + E.t(V, "m/s") + "$"]
        };
      } },
    { id: "massamidja", title: "Massamiðja þriggja agna", eqs: ["massamidja"],
      gen: function (R, E) {
        var m = [R.num(1, 5, 1), R.num(1, 5, 1), R.num(1, 5, 1)];
        var x = [0, R.num(1, 4, 0.5), R.num(2, 6, 0.5)], y = [0, R.num(0, 3, 0.5), R.num(1, 4, 0.5)];
        var M = m[0] + m[1] + m[2];
        var xc = (m[0] * x[0] + m[1] * x[1] + m[2] * x[2]) / M, yc = (m[0] * y[0] + m[1] * y[1] + m[2] * y[2]) / M;
        return {
          text: "Agnir með massa " + E.q(m[0], "kg") + ", " + E.q(m[1], "kg") + " og " + E.q(m[2], "kg") + " eru í punktunum $(0, 0)$, $(" + E.n(x[1]) + ", " + E.n(y[1]) + ")$ og $(" + E.n(x[2]) + ", " + E.n(y[2]) + ")$ (í metrum). Finndu massamiðjuna.",
          parts: [{ label: "$x_{cm}$", ans: xc, unit: "m" }, { label: "$y_{cm}$", ans: yc, unit: "m" }],
          steps: ["$M = " + E.t(M, "kg") + "$",
            "$x_{cm} = \\dfrac{" + E.n(m[1]) + "\\cdot " + E.n(x[1]) + " + " + E.n(m[2]) + "\\cdot " + E.n(x[2]) + "}{" + E.n(M) + "} = " + E.t(xc, "m") + "$",
            "$y_{cm} = \\dfrac{" + E.n(m[1]) + "\\cdot " + E.n(y[1]) + " + " + E.n(m[2]) + "\\cdot " + E.n(y[2]) + "}{" + E.n(M) + "} = " + E.t(yc, "m") + "$"]
        };
      } },
    { id: "ballist", title: "Skotpendúll", eqs: ["ofjadrandi", "vardveisla"],
      gen: function (R, E) {
        var m = R.num(5, 20, 1) / 1000, M = R.num(1, 5, 0.5), v = R.num(200, 500, 25);
        var V = m * v / (m + M), h = V * V / (2 * E.g);
        return {
          text: "Byssukúla (" + E.q(m * 1000, "g") + ") á " + E.q(v, "m/s") + " festist í " + E.q(M, "kg") + " trékubbi sem hangir í löngum böndum. Hve hátt sveiflast kubburinn upp?",
          parts: [{ label: "Hraði kubbsins strax eftir áreksturinn", ans: V, unit: "m/s" }, { label: "Hæð sem kubburinn lyftist", ans: h, unit: "m" }],
          steps: ["Árekstur (skriðþungi varðveitist): $V = \\dfrac{mv}{m + M} = \\dfrac{" + E.n(m) + "\\cdot " + E.n(v) + "}{" + E.n(m + M) + "} = " + E.t(V, "m/s") + "$",
            "Sveifla (orka varðveitist): $\\tfrac12 (m + M)V^2 = (m + M)gh$",
            "$h = \\dfrac{V^2}{2g} = " + E.t(h, "m") + "$"]
        };
      } }
  ]
});

/* Kafli 5 – Notkun lögmála Newtons (OpenStax 6, vinnustofa 3–4) */
EDL.chapter({
  id: "k05", n: 5, book: "6", title: "Núningur og hringhreyfing", short: "Núningskraftar, beygjur, hallandi brautir og viðnám",
  intro: "Núningskraftur fer eftir normalkraftinum. Í hringhreyfingu þarf heildarkraftur inn að miðju að vera $mv^2/r$, og það er einhver raunverulegur kraftur (núningur, normalkraftur, togkraftur) sem sér um það.",
  eqs: [
    { id: "kyrr", name: "Kyrrstöðunúningur", tex: "f_s \\le \\mu_s N",
      about: "Kyrrstöðunúningur er eins stór og hann þarf að vera til að hlutur haldist kyrr, upp að hámarkinu $\\mu_s N$.",
      vars: [["\\mu_s", "kyrrstöðunúningsstuðull", ""], ["N", "normalkraftur", "N"]],
      fill: { tex: "f_{s,\\max} = □", ans: "\\mu_s N", wrong: ["\\mu_s mg\\sin\\theta", "\\dfrac{N}{\\mu_s}", "\\mu_k N"] } },
    { id: "hreyfi", name: "Hreyfinúningur", tex: "f_k = \\mu_k N",
      about: "Núningskraftur á hlut sem rennur. Verkar á móti hreyfingunni.",
      vars: [["\\mu_k", "hreyfinúningsstuðull", ""], ["f_k", "hreyfinúningskraftur", "N"]],
      fill: { tex: "f_k = □", ans: "\\mu_k N", wrong: ["\\mu_k m", "\\mu_k v", "\\mu_s N"] } },
    { id: "midsokn", name: "Miðsóknarkraftur", tex: "\\sum F_r = \\dfrac{mv^2}{r}",
      about: "Heildarkrafturinn inn að miðju sem þarf til að halda hlut á hringferli. Ekki sérstakur kraftur á kraftamyndinni.",
      vars: [["\\sum F_r", "heildarkraftur inn að miðju", "N"], ["r", "geisli beygjunnar", "m"]],
      fill: { tex: "\\sum F_r = □", ans: "\\dfrac{mv^2}{r}", wrong: ["\\dfrac{mv}{r}", "mv^2 r", "\\dfrac{mr}{v^2}"] } },
    { id: "flatbeygja", name: "Hámarkshraði í flatri beygju", tex: "v_{\\max} = \\sqrt{\\mu_s g r}",
      about: "Kyrrstöðunúningur milli dekkja og vegar heldur bílnum á hringferlinum.",
      vars: [["v_{\\max}", "mesti hraði án þess að renna", "m/s"]],
      fill: { tex: "v_{\\max} = \\sqrt{□}", ans: "\\mu_s g r", wrong: ["\\dfrac{\\mu_s g}{r}", "\\mu_s r", "\\dfrac{g r}{\\mu_s}"] } },
    { id: "halli", name: "Hallandi beygja án núnings", tex: "\\tan\\theta = \\dfrac{v^2}{rg}",
      about: "Halli brautar þar sem normalkrafturinn einn sér um miðsóknarkraftinn.",
      vars: [["\\theta", "halli brautarinnar", "°"]],
      fill: { tex: "\\tan\\theta = □", ans: "\\dfrac{v^2}{rg}", wrong: ["\\dfrac{rg}{v^2}", "\\dfrac{v}{rg}", "\\dfrac{v^2}{g}"] } },
    { id: "vidnam", name: "Loftviðnám", tex: "F_D = \\tfrac12 C\\rho A v^2",
      about: "Viðnámskraftur á hlut sem fer hratt í gegnum loft eða vökva.",
      vars: [["C", "viðnámsstuðull", ""], ["\\rho", "eðlismassi loftsins", "kg/m^3"], ["A", "þverskurðarflatarmál", "m^2"]],
      fill: { tex: "F_D = \\tfrac12 C\\rho A\\,□", ans: "v^2", wrong: ["v", "v^3", "\\sqrt v"] } },
    { id: "lokahradi", name: "Lokahraði", tex: "v_T = \\sqrt{\\dfrac{2mg}{C\\rho A}}",
      about: "Hraðinn þar sem viðnámið er orðið jafnt þyngdinni, svo hröðunin er núll.",
      vars: [["v_T", "lokahraði", "m/s"]],
      fill: { tex: "v_T = \\sqrt{□}", ans: "\\dfrac{2mg}{C\\rho A}", wrong: ["\\dfrac{C\\rho A}{2mg}", "\\dfrac{mg}{C\\rho A v}", "2mgC\\rho A"] } }
  ],
  problems: [
    { id: "draga", title: "Kassi dreginn eftir gólfi", eqs: ["hreyfi"],
      gen: function (R, E) {
        var m = R.num(10, 40, 2), mu = R.num(0.15, 0.45, 0.05), F = Math.ceil(m * E.g * mu / 10) * 10 + R.num(10, 60, 10);
        var f = mu * m * E.g, a = (F - f) / m;
        return {
          text: "Kassi með massa " + E.q(m, "kg") + " er dreginn eftir láréttu gólfi með láréttum krafti " + E.q(F, "N") + ". Hreyfinúningsstuðullinn er $\\mu_k = " + E.n(mu) + "$.",
          parts: [{ label: "Núningskrafturinn", ans: f, unit: "N" }, { label: "Hröðun kassans", ans: a, unit: "m/s^2" }],
          steps: ["$N = mg = " + E.t(m * E.g, "N") + "$, svo $f_k = \\mu_k N = " + E.n(mu) + "\\cdot " + E.n(m * E.g) + " = " + E.t(f, "N") + "$",
            "$\\sum F_x = F - f_k = ma \\Rightarrow a = \\dfrac{" + E.n(F) + " - " + E.n(f) + "}{" + E.n(m) + "} = " + E.t(a, "m/s^2") + "$"]
        };
      } },
    { id: "skaplan", title: "Skíðamaður á brekku með núningi", eqs: ["hreyfi"],
      gen: function (R, E) {
        var th = R.pick([20, 25, 30, 35, 40]), mu = R.num(0.05, 0.3, 0.05);
        var a = E.g * (Math.sin(E.rad(th)) - mu * Math.cos(E.rad(th)));
        return {
          text: "Skíðamaður rennur niður brekku með halla " + E.q(th, "°") + ". Hreyfinúningsstuðullinn milli skíða og snjós er $" + E.n(mu) + "$. Hver er hröðunin hans niður brekkuna?",
          parts: [{ label: "Hröðun", ans: a, unit: "m/s^2" }],
          steps: ["Hornrétt á brekkuna: $N = mg\\cos\\theta$.",
            "Samsíða brekkunni: $ma = mg\\sin\\theta - \\mu_k mg\\cos\\theta$",
            "$a = g(\\sin\\theta - \\mu_k\\cos\\theta) = 9{,}8(\\sin" + th + "^{\\circ} - " + E.n(mu) + "\\cos" + th + "^{\\circ}) = " + E.t(a, "m/s^2") + "$",
            "Athugaðu að massinn styttist út."]
        };
      } },
    { id: "beygja", title: "Bíll í flatri beygju", eqs: ["flatbeygja", "midsokn"],
      gen: function (R, E) {
        var r = R.num(30, 150, 10), mu = R.pick([0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);
        var v = Math.sqrt(mu * E.g * r);
        return {
          text: "Bíll ekur um flata beygju með geisla " + E.q(r, "m") + ". Kyrrstöðunúningsstuðullinn milli dekkja og vegar er $" + E.n(mu) + "$. Hve hratt getur bíllinn mest farið án þess að renna út af?",
          parts: [{ label: "Mesti hraði", ans: v, unit: "m/s" }, { label: "Sami hraði í km/klst", ans: v * 3.6, unit: "km/klst" }],
          steps: ["Kyrrstöðunúningurinn bendir inn að miðju og sér um miðsóknarkraftinn: $f_s = mv^2/r$.",
            "Við hámarkshraða er $f_s = \\mu_s N = \\mu_s mg$, svo $\\mu_s mg = mv^2/r$.",
            "$v_{\\max} = \\sqrt{\\mu_s g r} = \\sqrt{" + E.n(mu) + "\\cdot 9{,}8\\cdot " + E.n(r) + "} = " + E.t(v, "m/s") + " = " + E.t(v * 3.6, "km/klst") + "$"]
        };
      } },
    { id: "halli", title: "Hallandi kappakstursbraut", eqs: ["halli"],
      gen: function (R, E) {
        var r = R.num(80, 400, 20), kmh = R.num(60, 160, 10), v = kmh / 3.6;
        var th = E.deg(Math.atan(v * v / (r * E.g)));
        return {
          text: "Hve mikinn halla þarf beygja með geisla " + E.q(r, "m") + " að hafa svo bíll á " + E.q(kmh, "km/klst") + " komist í gegnum hana án þess að treysta á núning?",
          parts: [{ label: "Halli brautarinnar", ans: th, unit: "°" }],
          steps: ["$v = " + E.n(kmh) + "/3{,}6 = " + E.t(v, "m/s") + "$",
            "Lóðrétt: $N\\cos\\theta = mg$. Lárétt (inn að miðju): $N\\sin\\theta = mv^2/r$.",
            "Deilum: $\\tan\\theta = \\dfrac{v^2}{rg} = \\dfrac{" + E.n(v) + "^2}{" + E.n(r) + "\\cdot 9{,}8} = " + E.n(v * v / (r * E.g)) + "$",
            "$\\theta = " + E.t(th, "°") + "$"]
        };
      } },
    { id: "fallhlif", title: "Lokahraði fallhlífarstökkvara", eqs: ["lokahradi", "vidnam"],
      gen: function (R, E) {
        var m = R.num(60, 100, 5), A = R.num(0.5, 0.9, 0.05), C = R.pick([0.7, 0.8, 0.9, 1.0]), rho = 1.21;
        var v = Math.sqrt(2 * m * E.g / (C * rho * A));
        return {
          text: "Fallhlífarstökkvari með massa " + E.q(m, "kg") + " fellur með magann niður. Þverskurðarflatarmál hans er " + E.q(A, "m^2") + ", viðnámsstuðullinn $C = " + E.n(C) + "$ og eðlismassi loftsins $" + E.t(rho, "kg/m^3") + "$. Finndu lokahraðann.",
          parts: [{ label: "Lokahraði", ans: v, unit: "m/s" }],
          steps: ["Við lokahraða er $F_D = mg$: $\\tfrac12 C\\rho A v_T^2 = mg$.",
            "$v_T = \\sqrt{\\dfrac{2mg}{C\\rho A}} = \\sqrt{\\dfrac{2\\cdot " + E.n(m) + "\\cdot 9{,}8}{" + E.n(C) + "\\cdot " + E.n(rho) + "\\cdot " + E.n(A) + "}} = " + E.t(v, "m/s") + "$"]
        };
      } }
  ]
});

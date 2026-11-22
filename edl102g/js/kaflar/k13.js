/* Kafli 13 – Straumfræði (OpenStax 14, vinnustofa 10) */
EDL.chapter({
  id: "k13", n: 13, book: "14", title: "Straumfræði", short: "Þrýstingur, flotkraftur, samfelldni og jafna Bernoullis",
  intro: "Í kyrrstæðum vökva vex þrýstingurinn með dýpinu og flotkrafturinn er jafn þyngd þess vökva sem hluturinn ryður frá sér. Í streymandi vökva varðveitist rúmmálsstreymið, og jafna Bernoullis er orkuvarðveisla á rúmmálseiningu.",
  eqs: [
    { id: "rho", name: "Eðlismassi og þrýstingur", tex: "\\rho = \\dfrac{m}{V},\\qquad p = \\dfrac{F}{A}",
      about: "Eðlismassi er massi á rúmmálseiningu og þrýstingur er kraftur á flatareiningu. $1\\,\\mathrm{Pa} = 1\\,\\mathrm{N/m^2}$.",
      vars: [["\\rho", "eðlismassi", "kg/m^3"], ["p", "þrýstingur", "Pa"], ["A", "flatarmál", "m^2"]],
      fill: { tex: "p = □", ans: "\\dfrac{F}{A}", wrong: ["FA", "\\dfrac{A}{F}", "\\dfrac{m}{V}"] } },
    { id: "dypi", name: "Þrýstingur á dýpi", tex: "p = p_0 + \\rho g h",
      about: "Þrýstingur í kyrrstæðum vökva á dýpinu $h$ undir yfirborði þar sem þrýstingurinn er $p_0$.",
      vars: [["p_0", "þrýstingur við yfirborðið", "Pa"], ["h", "dýpi undir yfirborði", "m"]],
      fill: { tex: "p = p_0 + □", ans: "\\rho g h", wrong: ["\\tfrac12\\rho h^2", "\\rho h", "\\dfrac{\\rho g}{h}"] } },
    { id: "pascal", name: "Lögmál Pascals (vökvalyfta)", tex: "\\dfrac{F_1}{A_1} = \\dfrac{F_2}{A_2}",
      about: "Þrýstingsbreyting í lokuðum vökva berst óbreytt til allra hluta hans. Lítill kraftur á litlum stimpli lyftir miklu á stórum.",
      vars: [["A_2", "flatarmál stóra stimpilsins", "m^2"], ["F_2", "kraftur á stóra stimpilinn", "N"]],
      fill: { tex: "\\dfrac{F_1}{A_1} = □", ans: "\\dfrac{F_2}{A_2}", wrong: ["\\dfrac{A_2}{F_2}", "F_2A_2", "\\dfrac{F_2}{A_1}"] } },
    { id: "flot", name: "Lögmál Arkímedesar", tex: "F_{\\text{flot}} = \\rho_{\\text{vökvi}}\\,V_{\\text{kaf}}\\,g",
      about: "Flotkrafturinn er jafn þyngd vökvans sem hluturinn ryður frá sér. Fljótandi hlutur: $\\rho_{\\text{hlutur}}/\\rho_{\\text{vökvi}} = V_{\\text{kaf}}/V$.",
      vars: [["V_{\\text{kaf}}", "rúmmál hlutans sem er undir yfirborði", "m^3"], ["F_{\\text{flot}}", "flotkraftur", "N"]],
      fill: { tex: "F_{\\text{flot}} = □\\,V_{\\text{kaf}}\\,g", ans: "\\rho_{\\text{vökvi}}", wrong: ["\\rho_{\\text{hlutur}}", "m", "p_0"] } },
    { id: "samfelldni", name: "Samfelldnijafnan", tex: "A_1v_1 = A_2v_2",
      about: "Rúmmálsstreymið $Q = Av$ er það sama alls staðar í pípu fyrir óþjappanlegan vökva. Vökvinn fer hraðar þar sem pípan er mjórri.",
      vars: [["v_1", "streymishraði þar sem flatarmálið er $A_1$", "m/s"], ["Q", "rúmmálsstreymi", "m^3/s"]],
      fill: { tex: "A_1v_1 = □", ans: "A_2v_2", wrong: ["A_2/v_2", "v_2/A_2", "\\tfrac12 A_2v_2^2"] } },
    { id: "bernoulli", name: "Jafna Bernoullis", tex: "p_1 + \\tfrac12\\rho v_1^2 + \\rho g y_1 = p_2 + \\tfrac12\\rho v_2^2 + \\rho g y_2",
      about: "Orkuvarðveisla fyrir núningslaust, óþjappanlegt streymi eftir straumlínu.",
      vars: [["\\tfrac12\\rho v^2", "hreyfiorka á rúmmálseiningu", "Pa"], ["y", "hæð", "m"]],
      fill: { tex: "p_1 + □ + \\rho g y_1 = p_2 + \\tfrac12\\rho v_2^2 + \\rho g y_2", ans: "\\tfrac12\\rho v_1^2", wrong: ["\\rho v_1^2", "\\tfrac12\\rho v_1", "\\rho g v_1"] } },
    { id: "torricelli", name: "Lögmál Torricellis", tex: "v = \\sqrt{2gh}",
      about: "Hraði vökva sem bunar út um lítið gat í opnum tanki, $h$ undir yfirborðinu. Sami hraði og í frjálsu falli um $h$.",
      vars: [["h", "hæð vatnsyfirborðs yfir gatinu", "m"]],
      fill: { tex: "v = \\sqrt{□}", ans: "2gh", wrong: ["gh", "\\dfrac{g}{2h}", "2\\rho g h"] } }
  ],
  problems: [
    { id: "dypi", title: "Þrýstingur á kafi", eqs: ["dypi", "rho"],
      gen: function (R, E) {
        var h = R.num(5, 60, 5), rho = R.pick([1000, 1025]), Ad = R.num(0.1, 0.5, 0.05), p0 = 1.013e5;
        var p = p0 + rho * E.g * h, F = (p - p0) * Ad;
        return {
          text: "Kafari er á " + E.q(h, "m") + " dýpi í " + (rho === 1000 ? "ferskvatni" : "sjó") + " ($\\rho = " + E.t(rho, "kg/m^3", 4) + "$). Loftþrýstingurinn er $p_0 = 1{,}013\\times10^{5}\\,\\mathrm{Pa}$. Gríma kafarans hefur flatarmál " + E.q(Ad, "m^2") + " og loft innan í henni er við loftþrýsting.",
          parts: [{ label: "Heildarþrýstingur á þessu dýpi", ans: p, unit: "Pa" }, { label: "Nettókraftur vatnsins á grímuna (umfram loftþrýsting)", ans: F, unit: "N" }],
          steps: ["$p = p_0 + \\rho g h = 1{,}013\\times10^{5} + " + E.n(rho, 4) + "\\cdot 9{,}8\\cdot " + E.n(h) + " = " + E.t(p, "Pa") + "$",
            "Yfirþrýstingurinn er $\\rho g h = " + E.t(p - p0, "Pa") + "$",
            "$F = \\rho g h\\,A = " + E.n(p - p0) + "\\cdot " + E.n(Ad) + " = " + E.t(F, "N") + "$"]
        };
      } },
    { id: "lyfta", title: "Vökvalyfta á verkstæði", eqs: ["pascal"],
      gen: function (R, E) {
        var m = R.num(800, 2500, 100), d1 = R.num(2, 6, 1), d2 = R.num(20, 40, 2);
        var A1 = Math.PI * Math.pow(d1 / 200, 2), A2 = Math.PI * Math.pow(d2 / 200, 2);
        var F1 = m * E.g * A1 / A2;
        return {
          text: "Vökvalyfta lyftir " + E.q(m, "kg") + " bíl. Stóri stimpillinn er " + E.q(d2, "cm") + " að þvermáli og litli stimpillinn " + E.q(d1, "cm") + " að þvermáli.",
          parts: [{ label: "Þrýstingurinn í vökvanum", ans: m * E.g / A2, unit: "Pa" }, { label: "Kraftur sem þarf á litla stimpilinn", ans: F1, unit: "N" }],
          steps: ["$A_2 = \\pi(" + E.n(d2 / 200) + ")^2 = " + E.t(A2, "m^2") + "$, $\\;A_1 = \\pi(" + E.n(d1 / 200) + ")^2 = " + E.t(A1, "m^2") + "$",
            "$p = \\dfrac{mg}{A_2} = \\dfrac{" + E.n(m * E.g) + "}{" + E.n(A2) + "} = " + E.t(m * E.g / A2, "Pa") + "$",
            "$F_1 = pA_1 = mg\\left(\\dfrac{d_1}{d_2}\\right)^2 = " + E.t(F1, "N") + "$"]
        };
      } },
    { id: "flot", title: "Kubbur flýtur á vatni", eqs: ["flot", "rho"],
      gen: function (R, E) {
        var mat = R.pick([["fura", 500], ["eik", 750], ["ís", 917], ["balsaviður", 150], ["korkur", 240]]);
        var a = R.num(0.1, 0.5, 0.05), V = a * a * a, rw = 1000;
        var frac = mat[1] / rw, Ff = mat[1] * V * E.g, Fpush = (rw - mat[1]) * V * E.g;
        return {
          text: "Teningur úr " + mat[0] + " ($\\rho = " + E.t(mat[1], "kg/m^3") + "$) með hliðarlengd " + E.q(a, "m") + " flýtur á vatni ($\\rho = 1000\\,\\mathrm{kg/m^3}$).",
          parts: [{ label: "Hlutfall rúmmálsins undir yfirborði", ans: 100 * frac, unit: "%" }, { label: "Flotkrafturinn á teninginn", ans: Ff, unit: "N" }, { label: "Kraftur sem þarf til að halda honum öllum í kafi", ans: Fpush, unit: "N" }],
          steps: ["Fljótandi: $F_{\\text{flot}} = mg \\Rightarrow \\rho_{\\text{v}}V_{\\text{kaf}}g = \\rho V g \\Rightarrow \\dfrac{V_{\\text{kaf}}}{V} = \\dfrac{" + E.n(mat[1]) + "}{1000} = " + E.t(100 * frac, "%") + "$",
            "$V = " + E.n(a) + "^3 = " + E.t(V, "m^3") + "$, svo $F_{\\text{flot}} = mg = \\rho Vg = " + E.t(Ff, "N") + "$",
            "Allur í kafi: $F_{\\text{flot}} = 1000\\cdot Vg$, og aukakrafturinn er $F = (\\rho_{\\text{v}} - \\rho)Vg = " + E.t(Fpush, "N") + "$"]
        };
      } },
    { id: "pipa", title: "Vatn í mjókkandi pípu", eqs: ["samfelldni", "bernoulli"],
      gen: function (R, E) {
        var d1 = R.num(4, 10, 1), d2 = R.num(1.5, d1 - 1.5, 0.5), v1 = R.num(0.5, 3, 0.25), rho = 1000;
        var v2 = v1 * Math.pow(d1 / d2, 2), dp = 0.5 * rho * (v2 * v2 - v1 * v1);
        return {
          text: "Vatn ($\\rho = 1000\\,\\mathrm{kg/m^3}$) streymir í láréttri pípu sem mjókkar úr " + E.q(d1, "cm") + " í " + E.q(d2, "cm") + " þvermál. Í víða hlutanum er hraðinn " + E.q(v1, "m/s") + ".",
          parts: [{ label: "Hraði í mjóa hlutanum", ans: v2, unit: "m/s" }, { label: "Þrýstingsmunur $p_1 - p_2$", ans: dp, unit: "Pa" }],
          steps: ["Samfelldni: $v_2 = v_1\\dfrac{A_1}{A_2} = v_1\\left(\\dfrac{d_1}{d_2}\\right)^2 = " + E.n(v1) + "\\left(\\dfrac{" + E.n(d1) + "}{" + E.n(d2) + "}\\right)^2 = " + E.t(v2, "m/s") + "$",
            "Bernoulli, lárétt ($y_1 = y_2$): $p_1 - p_2 = \\tfrac12\\rho(v_2^2 - v_1^2)$",
            "$p_1 - p_2 = \\tfrac12\\cdot 1000(" + E.n(v2) + "^2 - " + E.n(v1) + "^2) = " + E.t(dp, "Pa") + "$. Þrýstingurinn er lægri þar sem hraðinn er meiri."]
        };
      } },
    { id: "tankur", title: "Leki úr vatnstanki", eqs: ["torricelli", "bernoulli"],
      gen: function (R, E) {
        var h = R.num(1, 8, 0.5), H = R.num(1, 6, 0.5);
        var v = Math.sqrt(2 * E.g * h), t = Math.sqrt(2 * H / E.g), x = v * t;
        return {
          text: "Stór opinn vatnstankur lekur um lítið gat á hliðinni, " + E.q(h, "m") + " undir vatnsyfirborðinu og " + E.q(H, "m") + " yfir jörðu. Bunan fer lárétt út. (Byggt á lokaprófi 2013.)",
          parts: [{ label: "Hraði vatnsins út um gatið", ans: v, unit: "m/s" }, { label: "Hve langt frá tankinum lendir bunan á jörðinni?", ans: x, unit: "m" }],
          steps: ["Bernoulli frá yfirborði (hraði ≈ 0, þrýstingur $p_0$) að gatinu (þrýstingur $p_0$): $\\rho g h = \\tfrac12\\rho v^2$",
            "$v = \\sqrt{2gh} = \\sqrt{2\\cdot 9{,}8\\cdot " + E.n(h) + "} = " + E.t(v, "m/s") + "$",
            "Fallið: $t = \\sqrt{2H/g} = " + E.t(t, "s") + "$",
            "$x = vt = 2\\sqrt{hH} = " + E.t(x, "m") + "$"]
        };
      } }
  ]
});

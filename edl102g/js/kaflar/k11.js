/* Kafli 11 – Stöðufræði og fjaðurmagn (OpenStax 12, vinnustofa 7 og 9) */
EDL.chapter({
  id: "k11", n: 11, book: "12", title: "Stöðufræði og fjaðurmagn", short: "Jafnvægi krafta og kraftvægis, spenna og streita",
  intro: "Hlutur í jafnvægi hefur bæði heildarkraft og heildarkraftvægi núll. Veldu snúningspunktinn þar sem óþekktur kraftur verkar, þá hverfur hann úr kraftvægisjöfnunni. Fjaðurmagn lýsir hve mikið efni teygist undan álagi.",
  eqs: [
    { id: "jafnvaegi", name: "Jafnvægisskilyrði", tex: "\\sum\\vec F = 0,\\qquad \\sum\\vec\\tau = 0",
      about: "Bæði skilyrðin þurfa að gilda. Kraftvægið má reikna um hvaða punkt sem er.",
      vars: [["\\sum\\vec\\tau", "summa kraftvægis um valinn punkt", "N·m"]],
      fill: { tex: "\\sum\\vec F = 0,\\quad □ = 0", ans: "\\sum\\vec\\tau", wrong: ["\\sum\\vec p", "\\sum m\\vec a", "\\sum\\vec L"] } },
    { id: "tau", name: "Kraftvægi um punkt", tex: "\\tau = F\\,r_{\\perp}",
      about: "Kraftur sinnum armur, þar sem armurinn er hornrétt fjarlægð frá snúningspunktinum að verkunarlínu kraftsins.",
      vars: [["r_{\\perp}", "armur (hornrétt fjarlægð að verkunarlínunni)", "m"]],
      fill: { tex: "\\tau = F\\,□", ans: "r_{\\perp}", wrong: ["r^2", "\\dfrac{1}{r}", "r_{\\parallel}"] } },
    { id: "Y", name: "Young-stuðull (tog og þrýstingur)", tex: "\\dfrac{F_{\\perp}}{A} = Y\\,\\dfrac{\\Delta L}{L_0}",
      about: "Spenna (kraftur á flatareiningu) er í réttu hlutfalli við streitu (hlutfallslega lengingu).",
      vars: [["Y", "Young-stuðull", "Pa"], ["\\Delta L/L_0", "streita (hlutfallsleg lenging)", ""], ["A", "þverskurðarflatarmál", "m^2"]],
      fill: { tex: "\\dfrac{F_{\\perp}}{A} = Y\\,□", ans: "\\dfrac{\\Delta L}{L_0}", wrong: ["\\dfrac{L_0}{\\Delta L}", "\\Delta L", "\\dfrac{\\Delta V}{V_0}"] } },
    { id: "S", name: "Skúfstuðull", tex: "\\dfrac{F_{\\parallel}}{A} = S\\,\\dfrac{\\Delta x}{L_0}",
      about: "Kraftur samsíða fleti aflagar hlut, eins og bók sem er ýtt á ská.",
      vars: [["S", "skúfstuðull", "Pa"], ["\\Delta x", "hliðrun efri flatarins", "m"]],
      fill: { tex: "\\dfrac{F_{\\parallel}}{A} = □\\,\\dfrac{\\Delta x}{L_0}", ans: "S", wrong: ["Y", "B", "k"] } },
    { id: "B", name: "Rúmmálsstuðull", tex: "\\Delta p = -B\\,\\dfrac{\\Delta V}{V_0}",
      about: "Þrýstingsaukning allt um kring minnkar rúmmálið.",
      vars: [["B", "rúmmálsstuðull", "Pa"], ["\\Delta V/V_0", "hlutfallsleg rúmmálsbreyting", ""]],
      fill: { tex: "\\Delta p = -B\\,□", ans: "\\dfrac{\\Delta V}{V_0}", wrong: ["\\dfrac{\\Delta L}{L_0}", "\\Delta V", "\\dfrac{V_0}{\\Delta V}"] } }
  ],
  problems: [
    { id: "vegasalt", title: "Vegasalt í jafnvægi", eqs: ["tau", "jafnvaegi"],
      gen: function (R, E) {
        var m1 = R.num(20, 45, 1), m2 = R.num(25, 60, 1), d1 = R.num(1, 2, 0.1);
        if (m2 * 1 <= m1) m2 = m1 + 10;
        var d2 = m1 * d1 / m2, N = (m1 + m2) * E.g;
        return {
          text: "Barn (" + E.q(m1, "kg") + ") situr " + E.q(d1, "m") + " frá miðju vegasalts sem snýst um miðjuna. Hvar þarf annað barn (" + E.q(m2, "kg") + ") að sitja hinum megin til að vegasaltið sé í jafnvægi? Hunsaðu massa plankans.",
          parts: [{ label: "Fjarlægð frá miðju", ans: d2, unit: "m" }, { label: "Kraftur ássins á vegasaltið", ans: N, unit: "N" }],
          steps: ["Kraftvægi um ásinn: $m_1 g d_1 = m_2 g d_2$",
            "$d_2 = \\dfrac{m_1 d_1}{m_2} = \\dfrac{" + E.n(m1) + "\\cdot " + E.n(d1) + "}{" + E.n(m2) + "} = " + E.t(d2, "m") + "$",
            "Kraftajafnvægi: $N = (m_1 + m_2)g = " + E.t(N, "N") + "$"]
        };
      } },
    { id: "biti", title: "Biti á tveimur stoðum", eqs: ["jafnvaegi", "tau"],
      gen: function (R, E) {
        var L = R.num(4, 10, 1), Wb = R.num(200, 800, 50), Wk = R.num(100, 900, 50), d = R.num(0.5, L - 0.5, 0.5);
        var TB = (Wb * L / 2 + Wk * d) / L, TA = Wb + Wk - TB;
        return {
          text: "Einsleitur biti er " + E.q(L, "m") + " langur og " + E.q(Wb, "N") + " að þyngd. Hann hvílir á stoðum $A$ og $B$ við endana. Kassi sem vegur " + E.q(Wk, "N") + " stendur " + E.q(d, "m") + " frá $A$. (Líkt dæmi 2 í lokaprófi 2013.)",
          parts: [{ label: "Kraftur stoðar $A$", ans: TA, unit: "N" }, { label: "Kraftur stoðar $B$", ans: TB, unit: "N" }],
          steps: ["Kraftvægi um $A$: $F_B L - W_b\\dfrac{L}{2} - W_k d = 0$",
            "$F_B = \\dfrac{" + E.n(Wb) + "\\cdot " + E.n(L / 2) + " + " + E.n(Wk) + "\\cdot " + E.n(d) + "}{" + E.n(L) + "} = " + E.t(TB, "N") + "$",
            "Kraftar lóðrétt: $F_A = W_b + W_k - F_B = " + E.t(TA, "N") + "$"]
        };
      } },
    { id: "bomma", title: "Lárétt bóma með vír", eqs: ["jafnvaegi", "tau"],
      gen: function (R, E) {
        var L = R.num(2, 5, 0.5), Wb = R.num(100, 400, 20), W = R.num(200, 1000, 50), th = R.pick([25, 30, 35, 40, 45, 50]);
        var T = (Wb * L / 2 + W * L) / (L * Math.sin(E.rad(th))), H = T * Math.cos(E.rad(th)), V = Wb + W - T * Math.sin(E.rad(th));
        return {
          text: "Einsleit lárétt bóma (" + E.q(L, "m") + ", " + E.q(Wb, "N") + ") er fest við vegg með löm og haldið uppi af vír frá ytri endanum upp í vegginn, undir " + E.q(th, "°") + " horni við bómuna. Í ytri endanum hangir " + E.q(W, "N") + " lóð.",
          parts: [{ label: "Togkraftur í vírnum", ans: T, unit: "N" }, { label: "Láréttur kraftur lamarinnar", ans: H, unit: "N" }, { label: "Lóðréttur kraftur lamarinnar", ans: V, unit: "N" }],
          steps: ["Kraftvægi um lömina: $TL\\sin\\theta = W_b\\dfrac{L}{2} + WL$",
            "$T = \\dfrac{W_b/2 + W}{\\sin\\theta} = \\dfrac{" + E.n(Wb / 2 + W) + "}{\\sin" + th + "^{\\circ}} = " + E.t(T, "N") + "$",
            "Lárétt: $H = T\\cos\\theta = " + E.t(H, "N") + "$ (út frá veggnum)",
            "Lóðrétt: $V = W_b + W - T\\sin\\theta = " + E.t(V, "N") + "$"]
        };
      } },
    { id: "vir", title: "Lenging stálvírs", eqs: ["Y"],
      gen: function (R, E) {
        var m = R.num(50, 500, 25), L = R.num(1, 5, 0.5), dmm = R.num(1, 4, 0.5), Y = 200e9;
        var A = Math.PI * Math.pow(dmm / 2000, 2), dL = m * E.g * L / (A * Y);
        return {
          text: "Stálvír með þvermál " + E.q(dmm, "mm") + " og lengd " + E.q(L, "m") + " heldur uppi " + E.q(m, "kg") + " massa. Young-stuðull stáls er $Y = 2{,}0\\times10^{11}\\,\\mathrm{Pa}$.",
          parts: [{ label: "Spenna í vírnum $F/A$", ans: m * E.g / A, unit: "Pa" }, { label: "Lenging vírsins", ans: dL * 1000, unit: "mm" }],
          steps: ["$A = \\pi r^2 = \\pi(" + E.n(dmm / 2000) + ")^2 = " + E.t(A, "m^2") + "$",
            "$F/A = mg/A = " + E.t(m * E.g / A, "Pa") + "$",
            "$\\Delta L = \\dfrac{F L_0}{AY} = " + E.t(dL, "m") + " = " + E.t(dL * 1000, "mm") + "$"]
        };
      } },
    { id: "djup", title: "Rúmmálsbreyting á hafsbotni", eqs: ["B"],
      gen: function (R, E) {
        var dp = R.num(10, 100, 5) * 1e6, V = R.num(0.5, 3, 0.5), mat = R.pick([["stál", 160e9, "1{,}6\\times10^{11}"], ["ál", 70e9, "7{,}0\\times10^{10}"], ["kopar", 140e9, "1{,}4\\times10^{11}"]]);
        var dV = dp * V / mat[1];
        return {
          text: "Kubbur úr " + mat[0] + " með rúmmál " + E.q(V, "m^3") + " er sökkt þar sem þrýstingurinn er " + E.q(dp / 1e6, "MPa") + " hærri en við yfirborð. Rúmmálsstuðullinn er $B = " + mat[2] + "\\,\\mathrm{Pa}$. Um hve mikið minnkar rúmmálið?",
          parts: [{ label: "Rúmmálsminnkun", ans: dV * 1e6, unit: "cm^3" }],
          steps: ["$\\Delta V = -\\dfrac{\\Delta p\\,V_0}{B} = -\\dfrac{" + E.n(dp) + "\\cdot " + E.n(V) + "}{" + E.n(mat[1]) + "} = -" + E.t(dV, "m^3") + "$",
            "$1\\,\\mathrm{m^3} = 10^6\\,\\mathrm{cm^3}$, svo minnkunin er $" + E.t(dV * 1e6, "cm^3") + "$"]
        };
      } }
  ]
});

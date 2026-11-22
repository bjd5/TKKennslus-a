/* Kafli 4 – Lögmál Newtons (OpenStax 5, vinnustofa 2–3) */
EDL.chapter({
  id: "k04", n: 4, book: "5", title: "Lögmál Newtons", short: "Kraftar, kraftamyndir, þyngd og normalkraftur",
  intro: "Teiknaðu alltaf kraftamynd fyrst. Síðan skrifar þú $\\sum F = ma$ í hverja stefnu fyrir sig. Kraftar koma alltaf í pörum (3. lögmál), en kraftar í pari verka á ólíka hluti.",
  eqs: [
    { id: "n2", name: "Annað lögmál Newtons", tex: "\\sum \\vec F = m\\vec a",
      about: "Heildarkrafturinn á hlut er massi sinnum hröðun. Skrifað í hverja stefnu fyrir sig: $\\sum F_x = ma_x$.",
      vars: [["\\sum\\vec F", "summa allra krafta sem verka á hlutinn", "N"], ["m", "massi", "kg"], ["\\vec a", "hröðun", "m/s^2"]],
      fill: { tex: "\\sum\\vec F = □", ans: "m\\vec a", wrong: ["m\\vec v", "\\tfrac12 m v^2", "\\dfrac{m}{\\vec a}"] } },
    { id: "n3", name: "Þriðja lögmál Newtons", tex: "\\vec F_{B\\,\\text{á}\\,A} = -\\vec F_{A\\,\\text{á}\\,B}",
      about: "Ef $A$ verkar á $B$ með krafti verkar $B$ á $A$ með jafnstórum krafti í gagnstæða stefnu.",
      vars: [["\\vec F_{A\\,\\text{á}\\,B}", "kraftur sem $A$ verkar með á $B$", "N"]] },
    { id: "thyngd", name: "Þyngd", tex: "w = mg",
      about: "Þyngdarkrafturinn á hlut við yfirborð jarðar.",
      vars: [["w", "þyngd (þyngdarkraftur)", "N"]],
      fill: { tex: "w = □", ans: "mg", wrong: ["\\dfrac{m}{g}", "\\tfrac12 m g^2", "m"] } },
    { id: "skaplan", name: "Kraftar á skáplani", tex: "N = mg\\cos\\theta,\\quad F_{\\parallel} = mg\\sin\\theta",
      about: "Á skáplani með halla $\\theta$ skiptist þyngdin í þátt hornréttan á planið (jafnast á við normalkraftinn) og þátt samsíða planinu.",
      vars: [["N", "normalkraftur", "N"], ["\\theta", "halli plansins", "°"]],
      fill: { tex: "F_{\\parallel} = □", ans: "mg\\sin\\theta", wrong: ["mg\\cos\\theta", "mg\\tan\\theta", "mg"] } },
    { id: "lyfta", name: "Sýndarþyngd í lyftu", tex: "N = m(g + a)",
      about: "Normalkrafturinn frá gólfinu (það sem vog sýnir) þegar lyftan hefur hröðun $a$ upp á við.",
      vars: [["a", "hröðun lyftunnar upp á við", "m/s^2"]],
      fill: { tex: "N = m(□)", ans: "g + a", wrong: ["g - 2a", "a", "g\\,a"] } },
    { id: "atwood", name: "Atwood-vél", tex: "a = \\dfrac{(m_2 - m_1)g}{m_1 + m_2},\\quad T = \\dfrac{2m_1m_2 g}{m_1 + m_2}",
      about: "Tveir massar tengdir með bandi yfir núningslausa og massalausa trissu.",
      vars: [["T", "togkraftur í bandinu", "N"], ["m_2", "þyngri massinn", "kg"]],
      fill: { tex: "a = \\dfrac{(m_2 - m_1)g}{□}", ans: "m_1 + m_2", wrong: ["m_2 - m_1", "m_1 m_2", "m_2"] } }
  ],
  problems: [
    { id: "lyfta", title: "Vog í lyftu", eqs: ["n2", "lyfta"],
      gen: function (R, E) {
        var m = R.num(50, 95, 5), a = R.num(0.5, 3, 0.5), up = R.pick([true, false]);
        var N = m * (E.g + (up ? a : -a));
        return {
          text: "Þú (" + E.q(m, "kg") + ") stendur á vog í lyftu sem " + (up ? "byrjar að fara upp" : "hægir á sér á leið upp") + " með hröðun af stærð " + E.q(a, "m/s^2") + ". Hvað sýnir vogin (í newtonum)?",
          parts: [{ label: "Normalkrafturinn $N$", ans: N, unit: "N" }],
          steps: ["Kraftamynd: $N$ upp og $mg$ niður. $\\sum F_y = N - mg = ma_y$.",
            "Hröðunin er " + (up ? "upp á við: $a_y = +" : "niður á við (hægt á ferð upp): $a_y = -") + E.t(a, "m/s^2") + "$",
            "$N = m(g " + (up ? "+" : "-") + " a) = " + E.n(m) + "(9{,}8 " + (up ? "+" : "-") + " " + E.n(a) + ") = " + E.t(N, "N") + "$"]
        };
      } },
    { id: "skaplan", title: "Kassi rennur niður núningslaust skáplan", eqs: ["n2", "skaplan"],
      gen: function (R, E) {
        var m = R.num(2, 20, 1), th = R.pick([15, 20, 25, 30, 35, 40]), L = R.num(2, 8, 0.5);
        var a = E.g * Math.sin(E.rad(th)), N = m * E.g * Math.cos(E.rad(th)), v = Math.sqrt(2 * a * L);
        return {
          text: "Kassi með massa " + E.q(m, "kg") + " rennur úr kyrrstöðu niður núningslaust skáplan með halla " + E.q(th, "°") + ".",
          parts: [{ label: "Normalkrafturinn", ans: N, unit: "N" }, { label: "Hröðun kassans", ans: a, unit: "m/s^2" }, { label: "Hraði eftir " + E.q(L, "m") + " eftir planinu", ans: v, unit: "m/s" }],
          steps: ["Hornrétt á planið: $N - mg\\cos\\theta = 0 \\Rightarrow N = " + E.n(m) + "\\cdot 9{,}8\\cos" + th + "^{\\circ} = " + E.t(N, "N") + "$",
            "Samsíða planinu: $mg\\sin\\theta = ma \\Rightarrow a = g\\sin\\theta = " + E.t(a, "m/s^2") + "$",
            "$v^2 = 2aL \\Rightarrow v = \\sqrt{2\\cdot " + E.n(a) + "\\cdot " + E.n(L) + "} = " + E.t(v, "m/s") + "$"]
        };
      } },
    { id: "kubbar", title: "Tveimur kubbum ýtt", eqs: ["n2", "n3"],
      gen: function (R, E) {
        var m1 = R.num(2, 10, 1), m2 = R.num(1, 8, 1), F = R.num(10, 60, 5);
        var a = F / (m1 + m2), c = m2 * a;
        return {
          text: "Tveir kubbar, " + E.q(m1, "kg") + " og " + E.q(m2, "kg") + ", liggja hlið við hlið á núningslausu borði. Láréttur " + E.q(F, "N") + " kraftur ýtir á kubbinn með massann " + E.q(m1, "kg") + ", sem ýtir aftur á hinn kubbinn.",
          parts: [{ label: "Hröðun kubbanna", ans: a, unit: "m/s^2" }, { label: "Snertikrafturinn milli kubbanna", ans: c, unit: "N" }],
          steps: ["Kubbarnir hreyfast saman: $a = \\dfrac{F}{m_1 + m_2} = \\dfrac{" + E.n(F) + "}{" + E.n(m1 + m2) + "} = " + E.t(a, "m/s^2") + "$",
            "Kraftamynd fyrir kubb 2: aðeins snertikrafturinn $P$ verkar lárétt, svo $P = m_2 a = " + E.n(m2) + "\\cdot " + E.n(a) + " = " + E.t(c, "N") + "$",
            "Samkvæmt 3. lögmálinu ýtir kubbur 2 á kubb 1 með jafnstórum krafti til baka."]
        };
      } },
    { id: "atwood", title: "Atwood-vél", eqs: ["atwood", "n2"],
      gen: function (R, E) {
        var m1 = R.num(1, 6, 0.5), m2 = m1 + R.num(0.5, 4, 0.5);
        var a = (m2 - m1) * E.g / (m1 + m2), T = 2 * m1 * m2 * E.g / (m1 + m2);
        return {
          text: "Massarnir " + E.q(m1, "kg") + " og " + E.q(m2, "kg") + " hanga hvor sínum megin í léttu bandi yfir núningslausa trissu og er sleppt úr kyrrstöðu.",
          parts: [{ label: "Hröðun massanna", ans: a, unit: "m/s^2" }, { label: "Togkrafturinn í bandinu", ans: T, unit: "N" }],
          steps: ["Massi 2 (þyngri): $m_2 g - T = m_2 a$. Massi 1: $T - m_1 g = m_1 a$.",
            "Leggjum saman: $(m_2 - m_1)g = (m_1 + m_2)a \\Rightarrow a = \\dfrac{(" + E.n(m2) + " - " + E.n(m1) + ")\\cdot 9{,}8}{" + E.n(m1 + m2) + "} = " + E.t(a, "m/s^2") + "$",
            "$T = m_1(g + a) = " + E.n(m1) + "(9{,}8 + " + E.n(a) + ") = " + E.t(T, "N") + "$"]
        };
      } },
    { id: "skilti", title: "Skilti hangir í tveimur vírum", eqs: ["n2", "thyngd"],
      gen: function (R, E) {
        var m = R.num(5, 40, 1), th = R.pick([20, 30, 40, 45, 50, 60]);
        var T = m * E.g / (2 * Math.sin(E.rad(th)));
        return {
          text: "Skilti með massa " + E.q(m, "kg") + " hangir kyrrt í tveimur jafnlöngum vírum sem mynda hvor um sig " + E.q(th, "°") + " horn við lárétt. Hver er togkrafturinn í hvorum vír?",
          parts: [{ label: "Togkraftur $T$ í hvorum vír", ans: T, unit: "N" }],
          steps: ["Lárétt jafnast láréttu þættirnir út vegna samhverfu.",
            "Lóðrétt: $2T\\sin\\theta - mg = 0$",
            "$T = \\dfrac{mg}{2\\sin\\theta} = \\dfrac{" + E.n(m) + "\\cdot 9{,}8}{2\\sin" + th + "^{\\circ}} = " + E.t(T, "N") + "$",
            "Því minna sem hornið er, þeim mun meiri verður togkrafturinn."]
        };
      } }
  ]
});

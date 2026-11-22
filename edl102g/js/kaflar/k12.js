/* Kafli 12 – Þyngdarfræði (OpenStax 13, vinnustofa 9) */
EDL.chapter({
  id: "k12", n: 12, book: "13", title: "Þyngdarfræði", short: "Þyngdarlögmál Newtons, brautir og lausnarhraði",
  intro: "Þyngdarkrafturinn minnkar með fjarlægðinni í öðru veldi. Í hringbraut sér þyngdarkrafturinn um miðsóknarkraftinn, og þar af leiðir brautarhraðinn og lögmál Keplers.",
  eqs: [
    { id: "Fg", name: "Þyngdarlögmál Newtons", tex: "F_g = \\dfrac{Gm_1m_2}{r^2}",
      about: "Aðdráttarkraftur milli tveggja massa í fjarlægðinni $r$ (milli miðja). $G = 6{,}67\\times10^{-11}\\,\\mathrm{N\\,m^2/kg^2}$.",
      vars: [["G", "þyngdarfasti Newtons", "N·m^2/kg^2"], ["r", "fjarlægð milli massamiðja", "m"]],
      fill: { tex: "F_g = \\dfrac{Gm_1m_2}{□}", ans: "r^2", wrong: ["r", "r^3", "2r"] } },
    { id: "g", name: "Þyngdarhröðun", tex: "g = \\dfrac{GM}{r^2}",
      about: "Þyngdarhröðun í fjarlægðinni $r$ frá miðju hnattar með massa $M$.",
      vars: [["M", "massi hnattarins", "kg"]],
      fill: { tex: "g = □", ans: "\\dfrac{GM}{r^2}", wrong: ["\\dfrac{GM}{r}", "\\sqrt{\\dfrac{GM}{r}}", "\\dfrac{GMm}{r^2}"] } },
    { id: "U", name: "Þyngdarstöðuorka", tex: "U = -\\dfrac{GMm}{r}",
      about: "Stöðuorka miðað við að hún sé núll í óendanlegri fjarlægð. Alltaf neikvæð.",
      vars: [["U", "þyngdarstöðuorka", "J"]],
      fill: { tex: "U = □", ans: "-\\dfrac{GMm}{r}", wrong: ["-\\dfrac{GMm}{r^2}", "mgr", "\\dfrac{GMm}{2r}"] } },
    { id: "vbraut", name: "Brautarhraði í hringbraut", tex: "v = \\sqrt{\\dfrac{GM}{r}}",
      about: "Þyngdarkrafturinn er miðsóknarkrafturinn: $GMm/r^2 = mv^2/r$. Óháður massa tunglsins.",
      vars: [["v", "brautarhraði", "m/s"], ["r", "brautargeisli (frá miðju jarðar)", "m"]],
      fill: { tex: "v = \\sqrt{□}", ans: "\\dfrac{GM}{r}", wrong: ["\\dfrac{2GM}{r}", "\\dfrac{GM}{r^2}", "GMr"] } },
    { id: "vlausn", name: "Lausnarhraði", tex: "v_{\\text{lausn}} = \\sqrt{\\dfrac{2GM}{R}}",
      about: "Minnsti hraði sem hlutur þarf frá yfirborðinu til að sleppa alveg frá hnettinum.",
      vars: [["R", "geisli hnattarins", "m"]],
      fill: { tex: "v_{\\text{lausn}} = \\sqrt{□}", ans: "\\dfrac{2GM}{R}", wrong: ["\\dfrac{GM}{R}", "\\dfrac{GM}{2R}", "2GMR"] } },
    { id: "kepler", name: "Þriðja lögmál Keplers", tex: "T^2 = \\dfrac{4\\pi^2}{GM}a^3",
      about: "Umferðartími í öðru veldi er í réttu hlutfalli við hálfan langás brautarinnar í þriðja veldi.",
      vars: [["T", "umferðartími", "s"], ["a", "hálfur langás (geisli í hringbraut)", "m"]],
      fill: { tex: "T^2 = \\dfrac{4\\pi^2}{GM}\\,□", ans: "a^3", wrong: ["a^2", "a", "a^{3/2}"] } },
    { id: "Ebraut", name: "Heildarorka í hringbraut", tex: "E = K + U = -\\dfrac{GMm}{2r}",
      about: "Hreyfiorkan er helmingurinn af stærð stöðuorkunnar, svo heildarorkan er neikvæð.",
      vars: [["E", "heildarorka tunglsins", "J"]],
      fill: { tex: "E = -\\dfrac{GMm}{□}", ans: "2r", wrong: ["r", "r^2", "4r"] } }
  ],
  problems: [
    { id: "planeta", title: "Þyngdarhröðun á annarri plánetu", eqs: ["g"],
      gen: function (R, E) {
        var fM = R.num(0.1, 3, 0.1), fR = R.num(0.5, 2, 0.1), g = 9.8 * fM / (fR * fR), m = R.num(50, 90, 5);
        return {
          text: "Pláneta hefur $" + E.n(fM) + "$ sinnum massa jarðar og $" + E.n(fR) + "$ sinnum geisla hennar. Hver er þyngdarhröðunin við yfirborðið og hve mikið vegur " + E.q(m, "kg") + " geimfari þar? ($g_{\\text{jörð}} = 9{,}8\\,\\mathrm{m/s^2}$)",
          parts: [{ label: "Þyngdarhröðun", ans: g, unit: "m/s^2" }, { label: "Þyngd geimfarans", ans: m * g, unit: "N" }],
          steps: ["$g = GM/R^2$, svo $\\dfrac{g_p}{g_j} = \\dfrac{M_p/M_j}{(R_p/R_j)^2} = \\dfrac{" + E.n(fM) + "}{" + E.n(fR) + "^2}$",
            "$g_p = 9{,}8\\cdot " + E.n(fM / (fR * fR)) + " = " + E.t(g, "m/s^2") + "$",
            "$w = mg_p = " + E.t(m * g, "N") + "$"]
        };
      } },
    { id: "gervitungl", title: "Gervitungl á hringbraut", eqs: ["vbraut", "kepler"],
      gen: function (R, E) {
        var G = 6.67e-11, M = 5.97e24, Re = 6.37e6, h = R.num(200, 2000, 100) * 1000;
        var r = Re + h, v = Math.sqrt(G * M / r), T = 2 * Math.PI * r / v;
        return {
          text: "Gervitungl er á hringbraut í " + E.q(h / 1000, "km") + " hæð yfir yfirborði jarðar. ($M_{\\text{jörð}} = 5{,}97\\times10^{24}\\,\\mathrm{kg}$, $R_{\\text{jörð}} = 6{,}37\\times10^{6}\\,\\mathrm{m}$)",
          parts: [{ label: "Brautarhraði", ans: v, unit: "m/s" }, { label: "Umferðartími", ans: T / 60, unit: "mín" }],
          steps: ["Brautargeislinn er mældur frá miðju jarðar: $r = R + h = " + E.t(r, "m") + "$",
            "$v = \\sqrt{GM/r} = \\sqrt{\\dfrac{6{,}67\\times10^{-11}\\cdot 5{,}97\\times10^{24}}{" + E.n(r) + "}} = " + E.t(v, "m/s") + "$",
            "$T = 2\\pi r/v = " + E.t(T, "s") + " = " + E.t(T / 60, "mín") + "$"]
        };
      } },
    { id: "lausn", title: "Lausnarhraði frá tungli", eqs: ["vlausn"],
      gen: function (R, E) {
        var body = R.pick([["tunglinu", 7.35e22, 1.74e6, "7{,}35\\times10^{22}", "1{,}74\\times10^{6}"], ["Mars", 6.42e23, 3.39e6, "6{,}42\\times10^{23}", "3{,}39\\times10^{6}"], ["jörðinni", 5.97e24, 6.37e6, "5{,}97\\times10^{24}", "6{,}37\\times10^{6}"], ["Merkúríusi", 3.30e23, 2.44e6, "3{,}30\\times10^{23}", "2{,}44\\times10^{6}"]]);
        var v = Math.sqrt(2 * 6.67e-11 * body[1] / body[2]);
        return {
          text: "Hver er lausnarhraðinn frá " + body[0] + "? ($M = " + body[3] + "\\,\\mathrm{kg}$, $R = " + body[4] + "\\,\\mathrm{m}$)",
          parts: [{ label: "Lausnarhraði", ans: v / 1000, unit: "km/s" }],
          steps: ["Orka: $\\tfrac12 mv^2 - \\dfrac{GMm}{R} = 0$ (rétt nær óendanlegri fjarlægð með hraða núll)",
            "$v = \\sqrt{\\dfrac{2GM}{R}} = " + E.t(v, "m/s") + " = " + E.t(v / 1000, "km/s") + "$"]
        };
      } },
    { id: "kraftur", title: "Þyngdarkraftur milli tveggja massa", eqs: ["Fg"],
      gen: function (R, E) {
        var m1 = R.num(50, 500, 50), m2 = R.num(10, 200, 10), r = R.num(0.5, 5, 0.5);
        var F = 6.67e-11 * m1 * m2 / (r * r);
        return {
          text: "Tvær blýkúlur, " + E.q(m1, "kg") + " og " + E.q(m2, "kg") + ", eru með miðjur í " + E.q(r, "m") + " fjarlægð hvor frá annarri. Hver er þyngdarkrafturinn milli þeirra?",
          parts: [{ label: "Kraftur", ans: F, unit: "N" }],
          steps: ["$F = \\dfrac{Gm_1m_2}{r^2} = \\dfrac{6{,}67\\times10^{-11}\\cdot " + E.n(m1) + "\\cdot " + E.n(m2) + "}{" + E.n(r) + "^2} = " + E.t(F, "N") + "$",
            "Örsmár kraftur, þess vegna mældi Cavendish hann með snúningsvog."]
        };
      } },
    { id: "lyfta", title: "Orka til að lyfta gervitungli", eqs: ["Ebraut", "U"],
      gen: function (R, E) {
        var G = 6.67e-11, M = 5.97e24, Re = 6.37e6, m = R.num(200, 2000, 100), h1 = R.num(200, 600, 50) * 1000, h2 = h1 + R.num(200, 2000, 100) * 1000;
        var r1 = Re + h1, r2 = Re + h2, E1 = -G * M * m / (2 * r1), E2 = -G * M * m / (2 * r2);
        return {
          text: "Gervitungl (" + E.q(m, "kg") + ") er fært af hringbraut í " + E.q(h1 / 1000, "km") + " hæð upp á hringbraut í " + E.q(h2 / 1000, "km") + " hæð. ($M_{\\text{jörð}} = 5{,}97\\times10^{24}\\,\\mathrm{kg}$, $R_{\\text{jörð}} = 6{,}37\\times10^{6}\\,\\mathrm{m}$)",
          parts: [{ label: "Heildarorka á neðri brautinni", ans: E1, unit: "J" }, { label: "Orka sem þarf að bæta við", ans: E2 - E1, unit: "J" }],
          steps: ["$E = -\\dfrac{GMm}{2r}$ með $r = R + h$.",
            "$E_1 = -\\dfrac{GMm}{2\\cdot " + E.n(r1) + "} = " + E.t(E1, "J") + "$",
            "$E_2 = " + E.t(E2, "J") + "$, svo $\\Delta E = E_2 - E_1 = " + E.t(E2 - E1, "J") + "$"]
        };
      } }
  ]
});

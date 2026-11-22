/* Kafli 7 – Stöðuorka og orkuvarðveisla (OpenStax 8, vinnustofa 4–5) */
EDL.chapter({
  id: "k07", n: 7, book: "8", title: "Stöðuorka og orkuvarðveisla", short: "Þyngdar- og fjaðurstöðuorka, varðveisla og núningur",
  intro: "Fyrir geymna krafta (þyngd, gorma) má geyma vinnuna sem stöðuorku. Ef enginn núningur er gildir $K_i + U_i = K_f + U_f$; núningur breytir hluta orkunnar í varma.",
  eqs: [
    { id: "Ug", name: "Þyngdarstöðuorka", tex: "U_g = mgy",
      about: "Stöðuorka í þyngdarsviði nálægt yfirborði jarðar. Aðeins breytingin $\\Delta U = mg\\,\\Delta y$ skiptir máli.",
      vars: [["y", "hæð yfir viðmiðunarpunkti", "m"], ["U_g", "þyngdarstöðuorka", "J"]],
      fill: { tex: "U_g = □", ans: "mgy", wrong: ["\\tfrac12 m g y^2", "\\dfrac{mg}{y}", "\\tfrac12 m v^2"] } },
    { id: "Us", name: "Fjaðurstöðuorka", tex: "U_s = \\tfrac12 k x^2",
      about: "Orkan sem er geymd í gormi sem er teygður eða þjappaður um $x$ frá jafnvægisstöðu.",
      vars: [["k", "gormstuðull", "N/m"], ["x", "útslag frá jafnvægisstöðu", "m"]],
      fill: { tex: "U_s = □", ans: "\\tfrac12 k x^2", wrong: ["k x", "\\tfrac12 k x", "k x^2"] } },
    { id: "vardveisla", name: "Varðveisla vélrænnar orku", tex: "K_i + U_i = K_f + U_f",
      about: "Gildir þegar aðeins geymnir kraftar vinna vinnu (enginn núningur eða loftmótstaða).",
      vars: [["U_i", "stöðuorka í upphafi", "J"], ["K_f", "hreyfiorka í lokin", "J"]],
      fill: { tex: "K_i + U_i = □", ans: "K_f + U_f", wrong: ["K_f - U_f", "U_f - K_f", "K_i - U_f"] } },
    { id: "nuningur", name: "Orkujafna með núningi", tex: "K_i + U_i = K_f + U_f + f_k d",
      about: "Núningskrafturinn breytir vélrænni orku í varma, $\\Delta E_{\\text{th}} = f_k d$.",
      vars: [["f_k d", "orka sem núningurinn breytir í varma", "J"], ["d", "vegalengd sem hluturinn rennur", "m"]],
      fill: { tex: "K_i + U_i = K_f + U_f + □", ans: "f_k d", wrong: ["mgd", "\\tfrac12 f_k d^2", "\\mu_k d"] } },
    { id: "kraftur", name: "Kraftur út frá stöðuorku", tex: "F_x = -\\dfrac{dU}{dx}",
      about: "Geyminn kraftur bendir í þá átt sem stöðuorkan minnkar. Jafnvægi þar sem $dU/dx = 0$.",
      vars: [["U(x)", "stöðuorka sem fall af staðsetningu", "J"]],
      fill: { tex: "F_x = □", ans: "-\\dfrac{dU}{dx}", wrong: ["\\dfrac{dU}{dx}", "-\\int U\\,dx", "-\\dfrac{U}{x}"] } },
    { id: "Emech", name: "Vélræn orka", tex: "E_{\\text{mech}} = K + U",
      about: "Summa hreyfiorku og stöðuorku kerfis.",
      vars: [["E_{\\text{mech}}", "vélræn orka kerfisins", "J"]] }
  ],
  problems: [
    { id: "russibani", title: "Rússíbani", eqs: ["vardveisla", "Ug"],
      gen: function (R, E) {
        var h1 = R.num(20, 60, 2), h2 = R.num(5, 18, 1), v0 = R.num(1, 5, 1);
        var v = Math.sqrt(v0 * v0 + 2 * E.g * (h1 - h2));
        return {
          text: "Rússíbanavagn fer yfir topp í " + E.q(h1, "m") + " hæð á " + E.q(v0, "m/s") + ". Hve hratt fer hann yfir næsta topp, sem er í " + E.q(h2, "m") + " hæð? Hunsaðu núning.",
          parts: [{ label: "Hraði á seinni toppnum", ans: v, unit: "m/s" }],
          steps: ["$\\tfrac12 mv_1^2 + mgh_1 = \\tfrac12 mv_2^2 + mgh_2$, og massinn styttist út.",
            "$v_2 = \\sqrt{v_1^2 + 2g(h_1 - h_2)} = \\sqrt{" + E.n(v0) + "^2 + 2\\cdot 9{,}8\\cdot " + E.n(h1 - h2) + "} = " + E.t(v, "m/s") + "$"]
        };
      } },
    { id: "gormskot", title: "Gormbyssa skýtur kúlu upp", eqs: ["Us", "Ug", "vardveisla"],
      gen: function (R, E) {
        var k = R.num(200, 900, 50), x = R.num(0.04, 0.15, 0.01), m = R.num(0.02, 0.2, 0.01);
        var h = k * x * x / (2 * m * E.g);
        return {
          text: "Gormbyssu sem vísar beint upp er þjappað saman um " + E.q(x * 100, "cm") + ". Gormstuðullinn er " + E.q(k, "N/m") + " og kúlan vegur " + E.q(m * 1000, "g") + ". Hve hátt fer kúlan yfir upphafsstöðuna?",
          parts: [{ label: "Hæð", ans: h, unit: "m" }],
          steps: ["Öll fjaðurorkan verður að þyngdarstöðuorku í hæsta punkti (hraðinn er þá núll).",
            "$\\tfrac12 kx^2 = mgh \\Rightarrow h = \\dfrac{kx^2}{2mg} = \\dfrac{" + E.n(k) + "\\cdot " + E.n(x) + "^2}{2\\cdot " + E.n(m) + "\\cdot 9{,}8} = " + E.t(h, "m") + "$"]
        };
      } },
    { id: "rennibraut", title: "Rennibraut með núningi", eqs: ["nuningur"],
      gen: function (R, E) {
        var m = R.num(20, 60, 5), h = R.num(2, 6, 0.5), L = R.num(4, 10, 1), f = R.num(20, 80, 10);
        while (m * E.g * h <= f * L + 10) f -= 5;
        var v = Math.sqrt(2 * (m * E.g * h - f * L) / m);
        return {
          text: "Barn með massa " + E.q(m, "kg") + " rennur úr kyrrstöðu niður " + E.q(L, "m") + " langa rennibraut sem endar " + E.q(h, "m") + " neðar en hún byrjar. Meðalnúningskrafturinn er " + E.q(f, "N") + ". Hve hratt fer barnið neðst?",
          parts: [{ label: "Hraði neðst", ans: v, unit: "m/s" }, { label: "Varmi sem núningurinn myndar", ans: f * L, unit: "J" }],
          steps: ["$mgh = \\tfrac12 mv^2 + fL$",
            "$mgh = " + E.t(m * E.g * h, "J") + "$, $\\;fL = " + E.n(f) + "\\cdot " + E.n(L) + " = " + E.t(f * L, "J") + "$",
            "$v = \\sqrt{\\dfrac{2(mgh - fL)}{m}} = " + E.t(v, "m/s") + "$"]
        };
      } },
    { id: "pendull", title: "Pendúll sleppt úr horni", eqs: ["vardveisla", "Ug"],
      gen: function (R, E) {
        var L = R.num(0.5, 3, 0.1), th = R.pick([20, 30, 40, 45, 50, 60, 70]);
        var h = L * (1 - Math.cos(E.rad(th))), v = Math.sqrt(2 * E.g * h);
        return {
          text: "Pendúll með lengd " + E.q(L, "m") + " er dreginn út í " + E.q(th, "°") + " horn frá lóðréttu og sleppt. Hver er hraði kúlunnar þegar hún fer í gegnum lægsta punkt?",
          parts: [{ label: "Hæðarmunur", ans: h, unit: "m" }, { label: "Hraði í lægsta punkti", ans: v, unit: "m/s" }],
          steps: ["Kúlan lyftist um $h = L(1 - \\cos\\theta) = " + E.n(L) + "(1 - \\cos" + th + "^{\\circ}) = " + E.t(h, "m") + "$",
            "Togkrafturinn vinnur enga vinnu (hornréttur á hreyfinguna), svo $mgh = \\tfrac12 mv^2$.",
            "$v = \\sqrt{2gh} = " + E.t(v, "m/s") + "$"]
        };
      } },
    { id: "UF", title: "Kraftur út frá stöðuorkufalli", eqs: ["kraftur"],
      gen: function (R, E) {
        var a = R.num(2, 8, 1), b = R.num(0.5, 3, 0.5), x = R.num(0.5, 3, 0.5);
        var F = -(2 * a * x - 3 * b * x * x);
        if (F === 0) { x += 0.5; F = -(2 * a * x - 3 * b * x * x); }
        var xe = 2 * a / (3 * b);
        return {
          text: "Stöðuorka agnar er $U(x) = " + E.n(a) + "\\,x^2 - " + E.n(b) + "\\,x^3$ (í J, $x$ í m). Finndu kraftinn á ögnina við $x = " + E.t(x, "m") + "$ og jafnvægisstöðuna $x > 0$.",
          parts: [{ label: "$F_x$ við $x = " + E.n(x) + "\\,\\mathrm{m}$", ans: F, unit: "N" }, { label: "Jafnvægisstaða ($x > 0$)", ans: xe, unit: "m" }],
          steps: ["$F_x = -\\dfrac{dU}{dx} = -(" + E.n(2 * a) + "\\,x - " + E.n(3 * b) + "\\,x^2)$",
            "$F_x(" + E.n(x) + ") = -(" + E.n(2 * a * x) + " - " + E.n(3 * b * x * x) + ") = " + E.t(F, "N") + "$",
            "Jafnvægi þegar $F_x = 0$: $x(" + E.n(2 * a) + " - " + E.n(3 * b) + "x) = 0 \\Rightarrow x = " + E.t(xe, "m") + "$"]
        };
      } }
  ]
});

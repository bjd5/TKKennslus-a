/* Kafli 1 – Einingar og vigrar (OpenStax 1–2, vinnustofa 1) */
EDL.chapter({
  id: "k01", n: 1, book: "1–2", title: "Einingar og vigrar", short: "SI-einingar, þættir vigra, innfeldi og krossfeldi",
  intro: "Allar stærðir í eðlisfræði hafa einingu, og margar þeirra hafa líka stefnu. Hér æfir þú að breyta einingum, skipta vigri í þætti, leggja vigra saman og reikna innfeldi og krossfeldi.",
  eqs: [
    { id: "thaettir", name: "Þættir vigurs", tex: "A_x = A\\cos\\theta,\\quad A_y = A\\sin\\theta",
      about: "Skiptir vigri með lengd $A$ og stefnuhorn $\\theta$ (mælt frá jákvæða $x$-ásnum) í $x$- og $y$-þátt.",
      vars: [["A", "lengd (stærð) vigursins", ""], ["\\theta", "horn frá jákvæða $x$-ásnum", "°"], ["A_x", "$x$-þáttur vigursins", ""]],
      fill: { tex: "A_x = □", ans: "A\\cos\\theta", wrong: ["A\\sin\\theta", "A\\tan\\theta", "\\dfrac{A}{\\cos\\theta}"] } },
    { id: "lengd", name: "Lengd vigurs", tex: "|\\vec A| = \\sqrt{A_x^2 + A_y^2 + A_z^2}",
      about: "Lengd vigurs út frá þáttum hans (Pýþagórasarregla).",
      vars: [["|\\vec A|", "lengd vigursins", ""], ["A_z", "$z$-þáttur vigursins", ""]],
      fill: { tex: "|\\vec A| = \\sqrt{□}", ans: "A_x^2 + A_y^2 + A_z^2", wrong: ["A_x + A_y + A_z", "(A_x + A_y + A_z)^2", "A_x^2 - A_y^2 - A_z^2"] } },
    { id: "horn", name: "Stefnuhorn vigurs", tex: "\\tan\\theta = \\dfrac{A_y}{A_x}",
      about: "Hornið sem vigur myndar við jákvæða $x$-ásinn. Athugaðu í hvaða fjórðungi vigurinn er.",
      vars: [["\\theta", "stefnuhorn vigursins", "°"]],
      fill: { tex: "\\tan\\theta = □", ans: "\\dfrac{A_y}{A_x}", wrong: ["\\dfrac{A_x}{A_y}", "A_x A_y", "\\dfrac{A_y}{A}"] } },
    { id: "innfeldi", name: "Innfeldi (punktfeldi)", tex: "\\vec A\\cdot\\vec B = A_xB_x + A_yB_y + A_zB_z = AB\\cos\\phi",
      about: "Innfeldi tveggja vigra er tala (stigstærð). Það er núll ef vigrarnir eru hornréttir.",
      vars: [["\\phi", "hornið milli vigranna", "°"], ["\\vec A\\cdot\\vec B", "innfeldi vigranna (stigstærð)", ""]],
      fill: { tex: "\\vec A\\cdot\\vec B = AB\\,□", ans: "\\cos\\phi", wrong: ["\\sin\\phi", "\\tan\\phi", "\\phi"] } },
    { id: "kross", name: "Krossfeldi", tex: "|\\vec A\\times\\vec B| = AB\\sin\\phi,\\quad (\\vec A\\times\\vec B)_z = A_xB_y - A_yB_x",
      about: "Krossfeldi er vigur hornréttur á báða vigrana (hægrihandarregla). Það er núll ef vigrarnir eru samsíða.",
      vars: [["(\\vec A\\times\\vec B)_z", "$z$-þáttur krossfeldisins", ""]],
      fill: { tex: "|\\vec A\\times\\vec B| = AB\\,□", ans: "\\sin\\phi", wrong: ["\\cos\\phi", "\\tan\\phi", "(1-\\cos\\phi)"] } },
    { id: "einingavigur", name: "Einingarvigur", tex: "\\hat v = \\dfrac{\\vec v}{|\\vec v|}",
      about: "Vigur með lengd 1 sem bendir í sömu stefnu og $\\vec v$.",
      vars: [["\\hat v", "einingarvigur í stefnu $\\vec v$", ""]],
      fill: { tex: "\\hat v = □", ans: "\\dfrac{\\vec v}{|\\vec v|}", wrong: ["|\\vec v|\\,\\vec v", "\\vec v - |\\vec v|", "\\dfrac{|\\vec v|}{\\vec v}"] } }
  ],
  problems: [
    { id: "einingar", title: "Einingabreyting", eqs: [],
      gen: function (R, E) {
        var kmh = R.num(36, 144, 6), m = R.num(2, 12, 0.5);
        var v = kmh / 3.6;
        return {
          text: "Bíll ekur á " + E.q(kmh, "km/klst") + ". Lítill steinn með massa " + E.q(m, "g") + " situr fastur í dekkinu.",
          parts: [{ label: "Hraði bílsins í m/s", ans: v, unit: "m/s" }, { label: "Massi steinsins í kg", ans: m / 1000, unit: "kg" }],
          hint: "$1\\,\\mathrm{km/klst} = \\dfrac{1000\\,\\mathrm{m}}{3600\\,\\mathrm{s}} = \\dfrac{1}{3{,}6}\\,\\mathrm{m/s}$ og $1\\,\\mathrm{g} = 10^{-3}\\,\\mathrm{kg}$.",
          steps: ["$v = " + E.t(kmh, "km/klst") + "\\cdot\\dfrac{1000\\,\\mathrm{m}}{1\\,\\mathrm{km}}\\cdot\\dfrac{1\\,\\mathrm{klst}}{3600\\,\\mathrm{s}} = \\dfrac{" + E.n(kmh) + "}{3{,}6}\\,\\mathrm{m/s} = " + E.t(v, "m/s") + "$",
            "$m = " + E.t(m, "g") + "\\cdot 10^{-3}\\,\\mathrm{kg/g} = " + E.t(m / 1000, "kg") + "$"]
        };
      } },
    { id: "thaettir", title: "Þættir tilfærsluvigurs", eqs: ["thaettir"],
      gen: function (R, E) {
        var A = R.num(20, 90, 5), th = R.pick([25, 30, 35, 40, 50, 55, 120, 135, 150, 210, 240]);
        var ax = A * Math.cos(E.rad(th)), ay = A * Math.sin(E.rad(th));
        return {
          text: "Göngumaður fer " + E.q(A, "m") + " í stefnu sem myndar " + E.q(th, "°") + " horn við jákvæða $x$-ásinn (rangsælis). Finndu þætti tilfærslunnar.",
          parts: [{ label: "$x$-þáttur $A_x$", ans: ax, unit: "m" }, { label: "$y$-þáttur $A_y$", ans: ay, unit: "m" }],
          steps: ["$A_x = A\\cos\\theta = " + E.n(A) + "\\cos " + th + "^{\\circ} = " + E.t(ax, "m") + "$",
            "$A_y = A\\sin\\theta = " + E.n(A) + "\\sin " + th + "^{\\circ} = " + E.t(ay, "m") + "$",
            "Formerkin segja í hvaða fjórðungi vigurinn er."]
        };
      } },
    { id: "summa", title: "Summa tveggja vigra", eqs: ["thaettir", "lengd", "horn"],
      gen: function (R, E) {
        var a = R.num(3, 9, 1), b = R.num(2, 8, 1), th = R.pick([30, 40, 45, 50, 60]);
        var cx = a + b * Math.cos(E.rad(th)), cy = b * Math.sin(E.rad(th));
        var C = Math.hypot(cx, cy), ang = E.deg(Math.atan2(cy, cx));
        return {
          text: "Vigurinn $\\vec A$ er " + E.q(a, "km") + " í austur og $\\vec B$ er " + E.q(b, "km") + " í stefnu " + E.q(th, "°") + " norðan við austur. Finndu lengd og stefnu $\\vec C = \\vec A + \\vec B$.",
          parts: [{ label: "Lengd $|\\vec C|$", ans: C, unit: "km" }, { label: "Horn $\\vec C$ norðan við austur", ans: ang, unit: "°" }],
          steps: ["Látum $x$ vera austur og $y$ norður. $C_x = A + B\\cos\\theta = " + E.n(a) + " + " + E.n(b) + "\\cos" + th + "^{\\circ} = " + E.t(cx, "km") + "$",
            "$C_y = B\\sin\\theta = " + E.n(b) + "\\sin" + th + "^{\\circ} = " + E.t(cy, "km") + "$",
            "$|\\vec C| = \\sqrt{C_x^2 + C_y^2} = " + E.t(C, "km") + "$",
            "$\\theta_C = \\arctan(C_y/C_x) = " + E.t(ang, "°") + "$"]
        };
      } },
    { id: "innfeldi", title: "Hornið milli tveggja vigra", eqs: ["innfeldi", "lengd"],
      gen: function (R, E) {
        var ax, ay, bx, by;
        do { ax = R.num(-5, 6, 1); ay = R.num(-4, 6, 1); bx = R.num(-4, 6, 1); by = R.num(-5, 5, 1); }
        while ((ax === 0 && ay === 0) || (bx === 0 && by === 0) || ax * bx + ay * by === 0 || ax * by - ay * bx === 0);
        var dot = ax * bx + ay * by, A = Math.hypot(ax, ay), B = Math.hypot(bx, by);
        var phi = E.deg(Math.acos(dot / (A * B)));
        return {
          text: "Gefnir eru vigrarnir $\\vec A = " + ax + "\\,\\hat\\imath " + (ay < 0 ? "-" : "+") + Math.abs(ay) + "\\,\\hat\\jmath$ og $\\vec B = " + bx + "\\,\\hat\\imath " + (by < 0 ? "-" : "+") + Math.abs(by) + "\\,\\hat\\jmath$.",
          parts: [{ label: "Innfeldið $\\vec A\\cdot\\vec B$", ans: dot, unit: "" }, { label: "Hornið $\\phi$ milli vigranna", ans: phi, unit: "°" }],
          steps: ["$\\vec A\\cdot\\vec B = A_xB_x + A_yB_y = (" + ax + ")(" + bx + ") + (" + ay + ")(" + by + ") = " + dot + "$",
            "$A = \\sqrt{" + (ax * ax) + "+" + (ay * ay) + "} = " + E.n(A) + "$, $\\;B = \\sqrt{" + (bx * bx) + "+" + (by * by) + "} = " + E.n(B) + "$",
            "$\\cos\\phi = \\dfrac{\\vec A\\cdot\\vec B}{AB} = \\dfrac{" + dot + "}{" + E.n(A * B) + "} = " + E.n(dot / (A * B)) + "\\;\\Rightarrow\\;\\phi = " + E.t(phi, "°") + "$"]
        };
      } },
    { id: "kross", title: "Krossfeldi og flatarmál", eqs: ["kross"],
      gen: function (R, E) {
        var ax, ay, bx, by;
        do { ax = R.num(1, 7, 1); ay = R.num(-3, 5, 1); bx = R.num(-4, 4, 1); by = R.num(1, 6, 1); } while (ax * by - ay * bx === 0);
        var cz = ax * by - ay * bx;
        return {
          text: "Vigrarnir $\\vec A = (" + ax + ", " + ay + ", 0)\\,\\mathrm{m}$ og $\\vec B = (" + bx + ", " + by + ", 0)\\,\\mathrm{m}$ spanna samsíðung. Finndu $z$-þátt $\\vec A\\times\\vec B$ og flatarmál samsíðungsins.",
          parts: [{ label: "$(\\vec A\\times\\vec B)_z$", ans: cz, unit: "m^2" }, { label: "Flatarmál samsíðungsins", ans: Math.abs(cz), unit: "m^2" }],
          steps: ["Báðir vigrarnir liggja í $xy$-sléttunni, svo krossfeldið hefur bara $z$-þátt.",
            "$(\\vec A\\times\\vec B)_z = A_xB_y - A_yB_x = (" + ax + ")(" + by + ") - (" + ay + ")(" + bx + ") = " + cz + "\\,\\mathrm{m^2}$",
            "Flatarmálið er lengd krossfeldisins: $|\\vec A\\times\\vec B| = " + Math.abs(cz) + "\\,\\mathrm{m^2}$"]
        };
      } }
  ]
});

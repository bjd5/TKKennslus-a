/* Kafli 16 – Hljóð (OpenStax 17, vinnustofa 13) */
EDL.chapter({
  id: "k16", n: 16, book: "17", title: "Hljóð", short: "Hljóðhraði, hljóðstyrkur, pípur, bylgjusláttur og Doppler",
  intro: "Hljóð er þrýstingsbylgja. Hljóðstyrkur dreifist yfir stærri og stærri kúluflöt, desíbelkvarðinn er lógaritmískur, og hreyfing uppsprettu eða hlustanda breytir tíðninni sem heyrist (Doppler).",
  eqs: [
    { id: "vB", name: "Hljóðhraði í efni", tex: "v = \\sqrt{\\dfrac{B}{\\rho}}",
      about: "Hljóðhraðinn vex með rúmmálsstuðlinum (stífleikanum) og minnkar með eðlismassanum.",
      vars: [["B", "rúmmálsstuðull efnisins", "Pa"], ["\\rho", "eðlismassi efnisins", "kg/m^3"]],
      fill: { tex: "v = \\sqrt{□}", ans: "\\dfrac{B}{\\rho}", wrong: ["\\dfrac{\\rho}{B}", "B\\rho", "\\dfrac{F_T}{\\mu}"] } },
    { id: "I", name: "Hljóðstyrkur frá punktuppsprettu", tex: "I = \\dfrac{P}{4\\pi r^2}",
      about: "Afl uppsprettunnar dreifist jafnt yfir kúluflöt, svo styrkurinn fellur með fjarlægðinni í öðru veldi.",
      vars: [["I", "hljóðstyrkur", "W/m^2"], ["P", "afl uppsprettunnar", "W"], ["r", "fjarlægð frá uppsprettu", "m"]],
      fill: { tex: "I = \\dfrac{P}{□}", ans: "4\\pi r^2", wrong: ["4\\pi r", "2\\pi r^2", "\\tfrac43\\pi r^3"] } },
    { id: "dB", name: "Hljóðstyrksstig", tex: "\\beta = (10\\,\\mathrm{dB})\\log_{10}\\dfrac{I}{I_0},\\quad I_0 = 10^{-12}\\,\\mathrm{W/m^2}",
      about: "Desíbelkvarðinn. Tíföldun hljóðstyrksins bætir $10\\,\\mathrm{dB}$ við.",
      vars: [["\\beta", "hljóðstyrksstig", "dB"], ["I_0", "heyrnarmörk (viðmiðunarstyrkur)", "W/m^2"]],
      fill: { tex: "\\beta = (10\\,\\mathrm{dB})\\,□", ans: "\\log_{10}\\dfrac{I}{I_0}", wrong: ["\\dfrac{I}{I_0}", "\\ln\\dfrac{I_0}{I}", "\\log_{10}(I\\,I_0)"] } },
    { id: "opin", name: "Pípa opin í báða enda", tex: "f_n = \\dfrac{nv}{2L},\\quad n = 1, 2, 3, \\dots",
      about: "Þrýstingshnútar í báðum endum, eins og strengur festur í báða enda. Allir hreintónar koma fyrir.",
      vars: [["L", "lengd pípunnar", "m"], ["v", "hljóðhraði í loftinu", "m/s"]],
      fill: { tex: "f_n = \\dfrac{nv}{□},\\quad n = 1, 2, 3, \\dots", ans: "2L", wrong: ["4L", "L", "\\pi L"] } },
    { id: "lokud", name: "Pípa lokuð í annan endann", tex: "f_n = \\dfrac{nv}{4L},\\quad n = 1, 3, 5, \\dots",
      about: "Aðeins oddatöluhreintónar. Grunntónninn er áttund lægri en í opinni pípu af sömu lengd.",
      vars: [["n", "oddatala (1, 3, 5, …)", ""], ["f_n", "tíðni hreintóns", "Hz"]],
      fill: { tex: "f_n = \\dfrac{nv}{□},\\quad n = 1, 3, 5, \\dots", ans: "4L", wrong: ["2L", "L", "3L"] } },
    { id: "slattur", name: "Bylgjusláttur", tex: "f_{\\text{slátt}} = |f_1 - f_2|",
      about: "Tvær nálægar tíðnir mynda hljóð sem dofnar og magnast með mismunatíðninni.",
      vars: [["f_{\\text{slátt}}", "sláttartíðni", "Hz"]],
      fill: { tex: "f_{\\text{slátt}} = □", ans: "|f_1 - f_2|", wrong: ["f_1 + f_2", "\\tfrac12(f_1 + f_2)", "f_1 f_2"] } },
    { id: "doppler", name: "Doppler-hrif", tex: "f' = f\\,\\dfrac{v \\pm v_O}{v \\mp v_S}",
      about: "Efri formerkin þegar hlustandi og uppspretta nálgast hvort annað, neðri þegar þau fjarlægjast. $v$ er hljóðhraðinn.",
      vars: [["v_O", "hraði hlustandans", "m/s"], ["v_S", "hraði uppsprettunnar", "m/s"], ["f'", "tíðnin sem hlustandinn heyrir", "Hz"]],
      fill: { tex: "f' = f\\,\\dfrac{v \\pm v_O}{□}", ans: "v \\mp v_S", wrong: ["v \\pm v_O", "v_S", "v^2 - v_S^2"] } },
    { id: "mach", name: "Höggbylgja (Mach-keila)", tex: "\\sin\\theta = \\dfrac{v}{v_S} = \\dfrac{1}{M}",
      about: "Þegar uppspretta fer hraðar en hljóðið myndast keila með hálfu topphorni $\\theta$.",
      vars: [["M", "Mach-tala ($v_S/v$)", ""], ["\\theta", "hálft topphorn keilunnar", "°"]],
      fill: { tex: "\\sin\\theta = □", ans: "\\dfrac{v}{v_S}", wrong: ["\\dfrac{v_S}{v}", "\\dfrac{v}{v_S + v}", "M"] } }
  ],
  problems: [
    { id: "dbfjarl", title: "Hljóðstyrkur í fjarlægð frá hátalara", eqs: ["I", "dB"],
      gen: function (R, E) {
        var P = R.num(0.5, 20, 0.5), r = R.num(2, 40, 2);
        var I = P / (4 * Math.PI * r * r), b = 10 * Math.log10(I / 1e-12);
        return {
          text: "Hátalari sendir frá sér " + E.q(P, "W") + " af hljóðafli jafnt í allar áttir. Hver er hljóðstyrkurinn og hljóðstyrksstigið í " + E.q(r, "m") + " fjarlægð?",
          parts: [{ label: "Hljóðstyrkur $I$", ans: I, unit: "W/m^2" }, { label: "Hljóðstyrksstig $\\beta$", ans: b, unit: "dB" }],
          steps: ["$I = \\dfrac{P}{4\\pi r^2} = \\dfrac{" + E.n(P) + "}{4\\pi\\cdot " + E.n(r) + "^2} = " + E.t(I, "W/m^2") + "$",
            "$\\beta = 10\\log_{10}\\dfrac{" + E.n(I) + "}{10^{-12}} = " + E.t(b, "dB") + "$"]
        };
      } },
    { id: "dbbreyting", title: "Breyting á hljóðstyrksstigi", eqs: ["dB", "I"],
      gen: function (R, E) {
        var r1 = R.num(1, 10, 1), r2 = r1 * R.pick([2, 3, 4, 5, 10]), b1 = R.num(70, 110, 5);
        var db = 20 * Math.log10(r2 / r1), b2 = b1 - db;
        return {
          text: "Í " + E.q(r1, "m") + " fjarlægð frá punktuppsprettu mælist hljóðstyrksstigið " + E.q(b1, "dB") + ". Hvert er stigið í " + E.q(r2, "m") + " fjarlægð?",
          parts: [{ label: "Lækkun hljóðstyrksstigsins", ans: db, unit: "dB" }, { label: "Hljóðstyrksstig í " + E.q(r2, "m"), ans: b2, unit: "dB" }],
          steps: ["$I \\propto 1/r^2$, svo $\\dfrac{I_2}{I_1} = \\left(\\dfrac{r_1}{r_2}\\right)^2 = \\left(\\dfrac{" + E.n(r1) + "}{" + E.n(r2) + "}\\right)^2$",
            "$\\beta_2 - \\beta_1 = 10\\log_{10}\\dfrac{I_2}{I_1} = -20\\log_{10}\\dfrac{r_2}{r_1} = -" + E.t(db, "dB") + "$",
            "$\\beta_2 = " + E.n(b1) + " - " + E.n(db) + " = " + E.t(b2, "dB") + "$"]
        };
      } },
    { id: "pipa", title: "Grunntónn í pípu", eqs: ["opin", "lokud"],
      gen: function (R, E) {
        var L = R.num(0.2, 2, 0.05), v = R.pick([340, 343, 345]), closed = R.pick([true, false]);
        var f1 = closed ? v / (4 * L) : v / (2 * L), n2 = closed ? 3 : 2;
        return {
          text: "Orgelpípa er " + E.q(L, "m") + " löng og " + (closed ? "lokuð í annan endann" : "opin í báða enda") + ". Hljóðhraðinn er " + E.q(v, "m/s") + ".",
          parts: [{ label: "Tíðni grunntónsins", ans: f1, unit: "Hz" }, { label: "Tíðni næsta hreintóns fyrir ofan", ans: n2 * f1, unit: "Hz" }],
          steps: [closed ? "Lokuð í annan endann: $f_n = \\dfrac{nv}{4L}$ með $n = 1, 3, 5, \\dots$" : "Opin í báða enda: $f_n = \\dfrac{nv}{2L}$ með $n = 1, 2, 3, \\dots$",
            "$f_1 = \\dfrac{" + E.n(v) + "}{" + E.n(closed ? 4 * L : 2 * L) + "} = " + E.t(f1, "Hz") + "$",
            "Næsti hreintónn er $n = " + n2 + "$: $f_" + n2 + " = " + n2 + "f_1 = " + E.t(n2 * f1, "Hz") + "$"]
        };
      } },
    { id: "doppler", title: "Sjúkrabíll með sírenu", eqs: ["doppler"],
      gen: function (R, E) {
        var f = R.num(500, 1200, 50), vs = R.num(15, 40, 1), v = 343;
        var fa = f * v / (v - vs), fr = f * v / (v + vs);
        return {
          text: "Sjúkrabíll ekur á " + E.q(vs, "m/s") + " framhjá þér þar sem þú stendur kyrr. Sírenan sendir frá sér " + E.q(f, "Hz") + ". Hljóðhraðinn er " + E.q(v, "m/s") + ".",
          parts: [{ label: "Tíðni sem þú heyrir meðan bíllinn nálgast", ans: fa, unit: "Hz" }, { label: "Tíðni sem þú heyrir þegar hann fjarlægist", ans: fr, unit: "Hz" }],
          steps: ["Hlustandinn er kyrr ($v_O = 0$), svo $f' = f\\,\\dfrac{v}{v \\mp v_S}$.",
            "Nálgast: $f' = " + E.n(f) + "\\cdot\\dfrac{343}{343 - " + E.n(vs) + "} = " + E.t(fa, "Hz") + "$",
            "Fjarlægist: $f' = " + E.n(f) + "\\cdot\\dfrac{343}{343 + " + E.n(vs) + "} = " + E.t(fr, "Hz") + "$"]
        };
      } },
    { id: "slattur", title: "Bylgjusláttur við stillingu", eqs: ["slattur", "opin"],
      gen: function (R, E) {
        var f1 = R.pick([220, 330, 440, 523]), d = R.num(1, 8, 1), up = R.pick([true, false]);
        var f2 = up ? f1 + d : f1 - d, L = R.num(0.5, 1, 0.05), v = 2 * L * f2;
        return {
          text: "Tónkvísl gefur " + E.q(f1, "Hz") + ". Þegar fiðlustrengur er sleginn samtímis heyrast " + E.q(d, "Hz") + " slættir, og sláttartíðnin " + (up ? "eykst" : "minnkar") + " þegar strengurinn er strekktur örlítið meira. Strengurinn er " + E.q(L, "m") + " langur.",
          parts: [{ label: "Tíðni strengsins", ans: f2, unit: "Hz" }, { label: "Bylgjuhraði á strengnum", ans: v, unit: "m/s" }],
          steps: ["$f_{\\text{slátt}} = |f_1 - f_2| \\Rightarrow f_2 = " + E.n(f1) + " \\pm " + E.n(d) + "$",
            "Meiri togkraftur hækkar tíðni strengsins. " + (up ? "Slættirnir aukast, svo strengurinn var þegar of hár: $f_2 = " + E.t(f2, "Hz") + "$" : "Slættirnir minnka, svo strengurinn var of lágur: $f_2 = " + E.t(f2, "Hz") + "$"),
            "Grunntónn: $v = 2Lf_2 = " + E.t(v, "m/s") + "$"]
        };
      } }
  ]
});

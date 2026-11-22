/* lokaprof.js – dæmasafn lokaprófsins. Fimm hlutar; eitt dæmi er valið úr hverjum hluta.
   Dæmin eru endursögð úr gömlum lokaprófum EÐL102G (2013–2018) með nýjum tölum. */
(function () {
  "use strict";
  var X = EDL.examProblem;
  var G1 = "Hreyfifræði og kraftar", G2 = "Orka og skriðþungi", G3 = "Snúningur og stöðufræði",
    G4 = "Þyngdarfræði og straumfræði", G5 = "Sveiflur og bylgjur";
  var GRAV = 6.67e-11, ME = 5.97e24, RE = 6.37e6;

  /* ---------- 1. Hreyfifræði og kraftar ---------- */
  X({ id: "skidi", group: G1, source: "Byggt á lokaprófi 2013, dæmi 3", title: "Skíðakona í brekku",
    gen: function (R, E) {
      var m = R.num(50, 80, 5), h = R.num(30, 70, 5), L = h * R.pick([1.6, 1.8, 2, 2.2, 2.5]), mu = R.pick([0.1, 0.15, 0.2, 0.25]);
      var g = E.g, base = Math.sqrt(L * L - h * h), cos = base / L;
      var Wf = mu * m * g * cos * L, v = Math.sqrt(2 * (g * h - mu * g * cos * L));
      return {
        text: "Skíðakona með massa " + E.q(m, "kg") + " leggur af stað úr kyrrstöðu efst í " + E.q(L, "m") + " langri brekku með jöfnum halla. Toppurinn er " + E.q(h, "m") + " ofar en brekkufóturinn. Hreyfinúningsstuðullinn milli skíða og snjós er $\\mu_k = " + E.n(mu) + "$. Hunsaðu loftmótstöðu.",
        parts: [{ label: "Normalkrafturinn á skíðakonuna", ans: m * g * cos, unit: "N" },
          { label: "Vinna núningskraftsins (stærð) á leiðinni niður", ans: Wf, unit: "J" },
          { label: "Hraði hennar neðst í brekkunni", ans: v, unit: "m/s" }],
        steps: ["Hallinn: $\\cos\\theta = \\dfrac{\\sqrt{L^2 - h^2}}{L} = \\dfrac{" + E.n(base) + "}{" + E.n(L) + "} = " + E.n(cos) + "$",
          "$N = mg\\cos\\theta = " + E.n(m) + "\\cdot 9{,}8\\cdot " + E.n(cos) + " = " + E.t(m * g * cos, "N") + "$",
          "$f_k = \\mu_k N$, og vinna hans er $W_f = \\mu_k N L = " + E.t(Wf, "J") + "$",
          "Orka: $mgh = \\tfrac12 mv^2 + W_f \\Rightarrow v = \\sqrt{2(gh - \\mu_k g L\\cos\\theta)} = " + E.t(v, "m/s") + "$"]
      };
    } });

  X({ id: "klettakast", group: G1, source: "Í anda vinnustofu 2 og lokaprófa", title: "Kast af kletti upp á við",
    gen: function (R, E) {
      var v0 = R.num(10, 25, 1), th = R.pick([20, 25, 30, 35, 40, 45, 50]), H = R.num(10, 50, 5), g = E.g;
      var vx = v0 * Math.cos(E.rad(th)), vy = v0 * Math.sin(E.rad(th));
      var t = (vy + Math.sqrt(vy * vy + 2 * g * H)) / g, x = vx * t, vf = Math.sqrt(v0 * v0 + 2 * g * H), ymax = H + vy * vy / (2 * g);
      return {
        text: "Steini er kastað af " + E.q(H, "m") + " háum kletti með hraða " + E.q(v0, "m/s") + " undir " + E.q(th, "°") + " horni upp fyrir lárétt. Hann lendir á sléttri jörð við rætur klettsins. Hunsaðu loftmótstöðu.",
        parts: [{ label: "Mesta hæð steinsins yfir jörðu", ans: ymax, unit: "m" },
          { label: "Flugtími", ans: t, unit: "s" },
          { label: "Lárétt fjarlægð frá klettinum að lendingarstað", ans: x, unit: "m" },
          { label: "Ferð steinsins rétt áður en hann lendir", ans: vf, unit: "m/s" }],
        steps: ["$v_{0x} = v_0\\cos\\theta = " + E.t(vx, "m/s") + "$, $\\;v_{0y} = v_0\\sin\\theta = " + E.t(vy, "m/s") + "$",
          "Mesta hæð: $y_{\\max} = H + \\dfrac{v_{0y}^2}{2g} = " + E.n(H) + " + " + E.n(vy * vy / (2 * g)) + " = " + E.t(ymax, "m") + "$",
          "Lending þegar $y = -H$ miðað við kaststað: $-H = v_{0y}t - \\tfrac12 gt^2 \\Rightarrow t = \\dfrac{v_{0y} + \\sqrt{v_{0y}^2 + 2gH}}{g} = " + E.t(t, "s") + "$",
          "$x = v_{0x}t = " + E.t(x, "m") + "$",
          "Orkuvarðveisla: $v = \\sqrt{v_0^2 + 2gH} = " + E.t(vf, "m/s") + "$ (óháð kasthorninu)"]
      };
    } });

  X({ id: "skaplantrissa", group: G1, source: "Í anda vinnustofu 3 og lokaprófa", title: "Kubbur á skáplani tengdur hangandi massa",
    gen: function (R, E) {
      var m1 = R.num(2, 10, 1), th = R.pick([20, 25, 30, 35, 40]), mu = R.pick([0.1, 0.15, 0.2, 0.25, 0.3]), g = E.g;
      var s = Math.sin(E.rad(th)), c = Math.cos(E.rad(th));
      var m2 = Math.ceil(m1 * (s + mu * c)) + R.num(1, 5, 1);
      var a = g * (m2 - m1 * s - mu * m1 * c) / (m1 + m2), T = m2 * (g - a), d = R.num(0.5, 2, 0.5), v = Math.sqrt(2 * a * d);
      return {
        text: "Kubbur með massa " + E.q(m1, "kg") + " liggur á skáplani með halla " + E.q(th, "°") + ". Létt band liggur frá kubbnum upp eftir planinu, yfir massalausa og núningslausa trissu efst, og í því hangir lóð með massa " + E.q(m2, "kg") + ". Hreyfinúningsstuðullinn milli kubbs og plans er $" + E.n(mu) + "$. Kerfinu er sleppt úr kyrrstöðu og lóðið fellur.",
        parts: [{ label: "Hröðun kerfisins", ans: a, unit: "m/s^2" },
          { label: "Togkrafturinn í bandinu", ans: T, unit: "N" },
          { label: "Hraði lóðsins eftir að það hefur fallið " + E.q(d, "m"), ans: v, unit: "m/s" }],
        steps: ["Kubbur (upp planið jákvætt): $T - m_1 g\\sin\\theta - \\mu_k m_1 g\\cos\\theta = m_1 a$",
          "Lóð (niður jákvætt): $m_2 g - T = m_2 a$",
          "Leggjum saman: $a = \\dfrac{g(m_2 - m_1\\sin\\theta - \\mu_k m_1\\cos\\theta)}{m_1 + m_2} = \\dfrac{9{,}8(" + E.n(m2) + " - " + E.n(m1 * s) + " - " + E.n(mu * m1 * c) + ")}{" + E.n(m1 + m2) + "} = " + E.t(a, "m/s^2") + "$",
          "$T = m_2(g - a) = " + E.t(T, "N") + "$",
          "$v = \\sqrt{2ad} = " + E.t(v, "m/s") + "$"]
      };
    } });

  X({ id: "halfpipa", group: G1, source: "Byggt á lokaprófi 2015, dæmi 1", title: "Bolti skotið út úr hálfhringlaga rennu",
    gen: function (R, E) {
      var r = R.num(0.3, 2, 0.1), k = R.pick([2, 3]), g = E.g;
      var v = Math.sqrt(k * g * r), t = Math.sqrt(4 * r / g), x = v * t;
      return {
        text: "Bolta er skotið gegnum rennu sem er hálfhringur með geisla " + E.q(r, "m") + " og stendur lóðrétt á jörðinni. Efst í rennunni, rétt áður en boltinn fer út úr henni lárétt, er miðsóknarhröðun hans $a_\\perp = " + k + "g$. Eftir það er boltinn í frjálsu falli.",
        parts: [{ label: "Hraði boltans efst í rennunni", ans: v, unit: "m/s" },
          { label: "Falltími frá efsta punkti til jarðar", ans: t, unit: "s" },
          { label: "Fjarlægð lendingarstaðar frá snertipunkti rennunnar við jörð", ans: x, unit: "m" }],
        steps: ["Efst: $a_\\perp = v^2/r = " + k + "g \\Rightarrow v = \\sqrt{" + k + "gr} = \\sqrt{" + k + "\\cdot 9{,}8\\cdot " + E.n(r) + "} = " + E.t(v, "m/s") + "$",
          "Boltinn fer lárétt úr hæðinni $2r = " + E.t(2 * r, "m") + "$: $2r = \\tfrac12 g t^2 \\Rightarrow t = \\sqrt{4r/g} = " + E.t(t, "s") + "$",
          "$x = vt = \\sqrt{" + k + "gr}\\sqrt{4r/g} = " + E.n(Math.sqrt(4 * k)) + "\\,r = " + E.t(x, "m") + "$"]
      };
    } });

  /* ---------- 2. Orka og skriðþungi ---------- */
  X({ id: "steinngormur", group: G2, source: "Byggt á lokaprófi 2017, dæmi 2", title: "Steinn skoppar af kubbi á gormi",
    gen: function (R, E) {
      var M, m, v, u, V, loss;
      do {
        M = R.num(8, 20, 1); m = R.num(1, 4, 0.5); v = R.num(5, 12, 1); u = R.num(1, 3, 0.5);
        V = m * (v + u) / M; loss = 0.5 * m * v * v - 0.5 * m * u * u - 0.5 * M * V * V;
      } while (loss <= 0.5);
      var k = R.num(300, 900, 25), x = V * Math.sqrt(M / k);
      return {
        text: "Kyrrstæður kubbur með massa " + E.q(M, "kg") + " liggur á hálu láréttu borði og er festur við léttan láréttan gorm með gormstuðul " + E.q(k, "N/m") + ". Steinn með massa " + E.q(m, "kg") + " kemur lárétt á " + E.q(v, "m/s") + " til hægri, skellur á kubbnum og endurkastast til vinstri á " + E.q(u, "m/s") + ". Kubburinn þjappar þá gorminum saman.",
        parts: [{ label: "Hraði kubbsins strax eftir áreksturinn", ans: V, unit: "m/s" },
          { label: "Mesta þjöppun gormsins", ans: x, unit: "m" },
          { label: "Hreyfiorka sem tapast í árekstrinum", ans: loss, unit: "J" }],
        steps: ["Skiptum dæminu í tvennt. Árekstur (skriðþungi varðveitist, hægri jákvæð): $mv = -mu + MV$",
          "$V = \\dfrac{m(v + u)}{M} = \\dfrac{" + E.n(m) + "(" + E.n(v) + " + " + E.n(u) + ")}{" + E.n(M) + "} = " + E.t(V, "m/s") + "$",
          "Þjöppun (orka varðveitist): $\\tfrac12 MV^2 = \\tfrac12 kx^2 \\Rightarrow x = V\\sqrt{M/k} = " + E.t(x, "m") + "$",
          "Tap: $\\tfrac12 mv^2 - \\tfrac12 mu^2 - \\tfrac12 MV^2 = " + E.n(0.5 * m * v * v) + " - " + E.n(0.5 * m * u * u) + " - " + E.n(0.5 * M * V * V) + " = " + E.t(loss, "J") + "$"]
      };
    } });

  X({ id: "malningarfotur", group: G2, source: "Byggt á lokaprófi 2015, dæmi 5", title: "Tvær málningarfötur yfir trissu",
    gen: function (R, E) {
      var m1 = R.num(8, 16, 1), m2 = R.num(2, m1 - 3, 1), h = R.num(1, 3, 0.25), g = E.g;
      var v = Math.sqrt(2 * (m1 - m2) * g * h / (m1 + m2)), hmax = h + v * v / (2 * g);
      return {
        text: "Tvær málningarfötur hanga hvor í sínum enda bands sem liggur yfir massalausa og núningslausa trissu. Fata með massa " + E.q(m1, "kg") + " er " + E.q(h, "m") + " ofan við gólf og fata með massa " + E.q(m2, "kg") + " stendur á gólfinu. Kerfinu er sleppt úr kyrrstöðu. Notaðu orkuvarðveislu.",
        parts: [{ label: "Hraðinn sem þyngri fatan skellur á gólfið með", ans: v, unit: "m/s" },
          { label: "Mesta hæð léttari fötunnar yfir gólfi (bandið slaknar þegar hin lendir)", ans: hmax, unit: "m" }],
        steps: ["Þyngri fatan fer niður um $h$ og léttari upp um $h$, báðar með sama hraða $v$.",
          "$m_1 g h = m_2 g h + \\tfrac12(m_1 + m_2)v^2$",
          "$v = \\sqrt{\\dfrac{2(m_1 - m_2)gh}{m_1 + m_2}} = \\sqrt{\\dfrac{2\\cdot " + E.n(m1 - m2) + "\\cdot 9{,}8\\cdot " + E.n(h) + "}{" + E.n(m1 + m2) + "}} = " + E.t(v, "m/s") + "$",
          "Eftir það er léttari fatan í frjálsu falli upp á við og fer $v^2/2g = " + E.t(v * v / (2 * g), "m") + "$ hærra.",
          "Mesta hæð: $" + E.n(h) + " + " + E.n(v * v / (2 * g)) + " = " + E.t(hmax, "m") + "$"]
      };
    } });

  X({ id: "skotpendull", group: G2, source: "Í anda vinnustofu 5 og lokaprófa", title: "Skotpendúll",
    gen: function (R, E) {
      var m, M, v, L, V, h;
      do {
        m = R.num(5, 20, 1) / 1000; M = R.num(1, 5, 0.5); v = R.num(200, 500, 25); L = R.num(1, 3, 0.5);
        V = m * v / (m + M); h = V * V / (2 * E.g);
      } while (h >= 0.8 * L);
      var ang = E.deg(Math.acos(1 - h / L)), frac = 100 * M / (m + M);
      return {
        text: "Byssukúla með massa " + E.q(m * 1000, "g") + " á " + E.q(v, "m/s") + " festist í trékubbi með massa " + E.q(M, "kg") + " sem hangir kyrr í " + E.q(L, "m") + " löngum léttum böndum.",
        parts: [{ label: "Hraði kubbsins strax eftir áreksturinn", ans: V, unit: "m/s" },
          { label: "Hæðin sem kubburinn lyftist", ans: h, unit: "m" },
          { label: "Mesta horn bandanna frá lóðréttu", ans: ang, unit: "°" },
          { label: "Hlutfall upphaflegrar hreyfiorku sem tapast", ans: frac, unit: "%" }],
        steps: ["Árekstur, skriðþungi varðveitist: $V = \\dfrac{mv}{m + M} = " + E.t(V, "m/s") + "$",
          "Sveifla, orka varðveitist: $h = \\dfrac{V^2}{2g} = " + E.t(h, "m") + "$",
          "$h = L(1 - \\cos\\theta) \\Rightarrow \\cos\\theta = 1 - h/L = " + E.n(1 - h / L) + "$, svo $\\theta = " + E.t(ang, "°") + "$",
          "$\\dfrac{K_f}{K_i} = \\dfrac{m}{m + M}$, svo tapið er $\\dfrac{M}{m + M} = " + E.t(frac, "%") + "$"]
      };
    } });

  /* ---------- 3. Snúningur og stöðufræði ---------- */
  X({ id: "gjord", group: G3, source: "Byggt á lokaprófi 2017, dæmi 3", title: "Hlutur rúllar niður skáplan",
    gen: function (R, E) {
      var obj = R.pick([["þunnveggja gjörð", 1, "mR^2"], ["gegnheill sívalningur", 0.5, "\\tfrac12 mR^2"], ["gegnheil kúla", 0.4, "\\tfrac25 mR^2"]]);
      var k = obj[1], th = R.pick([20, 25, 30, 35, 40]), L = R.num(1, 4, 0.5), m = R.num(0.2, 2, 0.1), rr = R.num(0.05, 0.3, 0.05), g = E.g;
      var hh = L * Math.sin(E.rad(th)), v = Math.sqrt(2 * g * hh / (1 + k)), a = g * Math.sin(E.rad(th)) / (1 + k), mu = k * Math.tan(E.rad(th)) / (1 + k);
      return {
        text: "Hlutur (" + obj[0] + ", $I = " + obj[2] + "$) með massa " + E.q(m, "kg") + " og geisla " + E.q(rr, "m") + " rúllar án rennslis úr kyrrstöðu niður skáplan með halla " + E.q(th, "°") + ".",
        parts: [{ label: "Hraði massamiðju eftir " + E.q(L, "m") + " eftir planinu", ans: v, unit: "m/s" },
          { label: "Hraði efsta punkts hlutarins á sama stað", ans: 2 * v, unit: "m/s" },
          { label: "Hröðun massamiðjunnar", ans: a, unit: "m/s^2" },
          { label: "Minnsti núningsstuðull svo hluturinn rúlli án rennslis", ans: mu, unit: "" }],
        steps: ["Hæðarfall: $h = L\\sin\\theta = " + E.t(hh, "m") + "$",
          "Orka með $\\omega = v/R$: $mgh = \\tfrac12 mv^2(1 + " + E.n(k) + ") \\Rightarrow v = \\sqrt{\\dfrac{2gh}{" + E.n(1 + k) + "}} = " + E.t(v, "m/s") + "$",
          "Efsti punkturinn fer á $v_{\\text{top}} = v_{cm} + R\\omega = 2v_{cm} = " + E.t(2 * v, "m/s") + "$",
          "Kraftar: $mg\\sin\\theta - f = ma$ og kraftvægi $fR = I\\alpha = " + E.n(k) + "\\,mR^2\\,a/R \\Rightarrow f = " + E.n(k) + "\\,ma$",
          "$a = \\dfrac{g\\sin\\theta}{1 + " + E.n(k) + "} = " + E.t(a, "m/s^2") + "$",
          "$f \\le \\mu N = \\mu mg\\cos\\theta \\Rightarrow \\mu_{\\min} = \\dfrac{" + E.n(k) + "\\tan\\theta}{1 + " + E.n(k) + "} = " + E.n(mu) + "$",
          "Massinn og geislinn skipta ekki máli."]
      };
    } });

  X({ id: "kassihjol", group: G3, source: "Byggt á lokaprófi 2013, dæmi 4", title: "Kassi vindur spotta ofan af hjóli",
    gen: function (R, E) {
      var m = R.num(2, 15, 1), M = R.num(2, 15, 1), rr = R.num(0.1, 0.5, 0.05), d = R.num(1, 4, 0.5), g = E.g;
      var a = m * g / (m + M / 2), T = 0.5 * M * a, v = Math.sqrt(2 * a * d), w = v / rr;
      return {
        text: "Kassi með massa " + E.q(m, "kg") + " hangir í massalausum óteygjanlegum spotta sem er vafinn um einsleitt hjól (diskur, $I = \\tfrac12 MR^2$) með massa " + E.q(M, "kg") + " og geisla " + E.q(rr, "m") + ". Hjólið snýst um láréttan ás í viðnámslausum legum sem eru festar í loftið. Kassanum er sleppt úr kyrrstöðu.",
        parts: [{ label: "Hröðun kassans", ans: a, unit: "m/s^2" },
          { label: "Togkrafturinn í spottanum", ans: T, unit: "N" },
          { label: "Hornhraði hjólsins eftir að kassinn hefur fallið " + E.q(d, "m"), ans: w, unit: "rad/s" }],
        steps: ["Kassi (niður jákvætt): $mg - T = ma$",
          "Hjól: $TR = I\\alpha = \\tfrac12 MR^2\\cdot\\dfrac{a}{R} \\Rightarrow T = \\tfrac12 Ma$",
          "$a = \\dfrac{mg}{m + M/2} = \\dfrac{" + E.n(m) + "\\cdot 9{,}8}{" + E.n(m + M / 2) + "} = " + E.t(a, "m/s^2") + "$",
          "$T = \\tfrac12 Ma = " + E.t(T, "N") + "$",
          "$v = \\sqrt{2ad} = " + E.t(v, "m/s") + "$ og $\\omega = v/R = " + E.t(w, "rad/s") + "$"]
      };
    } });

  X({ id: "planki", group: G3, source: "Byggt á lokaprófi 2017, dæmi 4", title: "Planki í tveimur vírum",
    gen: function (R, E) {
      var L = R.num(1, 4, 0.5), Wb = R.num(60, 200, 10), Wk;
      do { Wk = R.num(20, 150, 10); } while (Wk === Wb);
      var T2 = (4 / 3) * (Wb / 2 + Wk), T1 = Wb + Wk - T2, xs = L * (Wb / 2 + Wk) / (Wb + Wk);
      return {
        text: "Einsleitur planki er " + E.q(L, "m") + " langur og vegur " + E.q(Wb, "N") + ". Lóðréttur vír $1$ er festur í vinstri enda plankans og lóðréttur vír $2$ í punkt " + E.q(0.75 * L, "m") + " frá vinstri enda (þrír fjórðu af lengdinni). Kassi sem vegur " + E.q(Wk, "N") + " stendur á hægri enda plankans, sem er láréttur og kyrr. Taktu kraft upp á við sem jákvæðan; vír sem er festur niður í gólf getur togað niður.",
        parts: [{ label: "Kraftur vírs 2 á plankann", ans: T2, unit: "N" },
          { label: "Kraftur vírs 1 á plankann (jákvætt upp)", ans: T1, unit: "N" },
          { label: "Hvar þarf vír 2 að vera (fjarlægð frá vinstri enda) svo kraftur vírs 1 verði núll?", ans: xs, unit: "m" }],
        steps: ["Kraftvægi um vinstri endann: $T_2\\cdot\\tfrac34 L = W_b\\dfrac{L}{2} + W_k L$",
          "$T_2 = \\tfrac43\\left(\\dfrac{W_b}{2} + W_k\\right) = \\tfrac43(" + E.n(Wb / 2) + " + " + E.n(Wk) + ") = " + E.t(T2, "N") + "$",
          "Kraftajafnvægi: $T_1 = W_b + W_k - T_2 = " + E.t(T1, "N") + "$" + (T1 < 0 ? ", neikvætt: vír 1 togar niður (festur í gólf)." : ", jákvætt: vír 1 togar upp."),
          "Ef $T_1 = 0$ ber vír 2 allt: $T_2 = W_b + W_k$ og kraftvægi um vinstri enda gefur $x(W_b + W_k) = W_b L/2 + W_k L$",
          "$x = \\dfrac{L(W_b/2 + W_k)}{W_b + W_k} = " + E.t(xs, "m") + "$"]
      };
    } });

  /* ---------- 4. Þyngdarfræði og straumfræði ---------- */
  X({ id: "gervitungl", group: G4, source: "Byggt á lokaprófi 2015, dæmi 4", title: "Gervitungl rekst á skiptilykil",
    gen: function (R, E) {
      var m = R.num(300, 1000, 50), h = R.num(200, 800, 50) * 1000, ms = R.num(1, 5, 0.5), vs = R.num(50, 300, 25);
      var r = RE + h, v = Math.sqrt(GRAV * ME / r), En = -GRAV * ME * m / (2 * r), V = (m * v - ms * vs) / (m + ms);
      return {
        text: "Gervitungl með massa " + E.q(m, "kg") + " er á hringbraut í " + E.q(h / 1000, "km") + " hæð yfir yfirborði jarðar. ($M = 5{,}97\\times10^{24}\\,\\mathrm{kg}$, $R = 6{,}37\\times10^{6}\\,\\mathrm{m}$, $G = 6{,}67\\times10^{-11}\\,\\mathrm{N\\,m^2/kg^2}$.) Það lendir í alófjaðrandi árekstri við " + E.q(ms, "kg") + " skiptilykil sem geimfari missti; lykillinn er á " + E.q(vs, "m/s") + " beint á móti hreyfistefnu tunglsins og festist við það.",
        parts: [{ label: "Brautarhraði tunglsins fyrir áreksturinn", ans: v, unit: "m/s" },
          { label: "Heildarorka tunglsins á brautinni", ans: En, unit: "J" },
          { label: "Hraði tungls og lykils strax eftir áreksturinn", ans: V, unit: "m/s" },
          { label: "Hraðabreyting tunglsins vegna árekstursins (stærð)", ans: v - V, unit: "m/s" }],
        steps: ["$r = R + h = " + E.t(r, "m") + "$",
          "$\\dfrac{GMm}{r^2} = \\dfrac{mv^2}{r} \\Rightarrow v = \\sqrt{GM/r} = " + E.t(v, "m/s") + "$",
          "$E = K + U = \\tfrac12 mv^2 - \\dfrac{GMm}{r} = -\\dfrac{GMm}{2r} = " + E.t(En, "J") + "$",
          "Áreksturinn er svo stuttur að þyngdarkrafturinn skiptir ekki máli; skriðþungi varðveitist: $mv - m_s v_s = (m + m_s)V$",
          "$V = \\dfrac{" + E.n(m) + "\\cdot " + E.n(v) + " - " + E.n(ms) + "\\cdot " + E.n(vs) + "}{" + E.n(m + ms) + "} = " + E.t(V, "m/s", 5) + "$",
          "$v - V = " + E.t(v - V, "m/s") + "$"]
      };
    } });

  X({ id: "tankur", group: G4, source: "Byggt á lokaprófi 2013, dæmi 5", title: "Leki úr vatnstanki",
    gen: function (R, E) {
      var h = R.num(1, 8, 0.5), H = R.num(1, 6, 0.5), d = R.num(0.5, 3, 0.5), g = E.g;
      var v = Math.sqrt(2 * g * h), t = Math.sqrt(2 * H / g), x = v * t, A = Math.PI * Math.pow(d / 200, 2), Q = A * v;
      return {
        text: "Gat með þvermál " + E.q(d, "cm") + " hefur myndast á hlið mjög stórs vatnstanks sem er opinn að ofan. Gatið er " + E.q(h, "m") + " neðan við vatnsyfirborðið og " + E.q(H, "m") + " yfir jörðu. Gatið er það lítið að yfirborðið lækkar ekki merkjanlega.",
        parts: [{ label: "Hraði vatnsins út um gatið", ans: v, unit: "m/s" },
          { label: "Rúmmálsstreymi út um gatið", ans: Q * 1000, unit: "L/s" },
          { label: "Lárétt fjarlægð frá tankinum þar sem bunan lendir", ans: x, unit: "m" }],
        steps: ["Bernoulli milli yfirborðs og gats (sami þrýstingur $p_0$, $v_1 \\approx 0$): $\\rho g h = \\tfrac12\\rho v^2$",
          "$v = \\sqrt{2gh} = \\sqrt{2\\cdot 9{,}8\\cdot " + E.n(h) + "} = " + E.t(v, "m/s") + "$ (lögmál Torricellis)",
          "$Q = Av = \\pi(" + E.n(d / 200) + ")^2\\cdot " + E.n(v) + " = " + E.t(Q, "m^3/s") + " = " + E.t(Q * 1000, "L/s") + "$",
          "Bunan fer lárétt út: falltími $t = \\sqrt{2H/g} = " + E.t(t, "s") + "$",
          "$x = vt = 2\\sqrt{hH} = " + E.t(x, "m") + "$"]
      };
    } });

  X({ id: "flotbolti", group: G4, source: "Byggt á lokaprófi 2017, dæmi 5", title: "Plastbolti flýtur á vatni",
    gen: function (R, E) {
      var rr = R.num(5, 20, 1) / 100, f = R.num(10, 60, 2) / 100, rho = 1000, g = E.g;
      var V = 4 / 3 * Math.PI * Math.pow(rr, 3), m = f * rho * V, F = (1 - f) * rho * V * g, a = g * (1 - f) / f;
      return {
        text: "Plastbolti með geisla " + E.q(rr * 100, "cm") + " flýtur á vatni ($\\rho = 1000\\,\\mathrm{kg/m^3}$) með " + E.q(f * 100, "%") + " af rúmmáli sínu neðan vatnsborðs.",
        parts: [{ label: "Massi boltans", ans: m, unit: "kg" },
          { label: "Kraftur sem þarf til að halda honum öllum rétt neðan vatnsborðs", ans: F, unit: "N" },
          { label: "Hröðun boltans einmitt þegar honum er sleppt þaðan", ans: a, unit: "m/s^2" }],
        steps: ["$V = \\tfrac43\\pi R^3 = " + E.t(V, "m^3") + "$",
          "Flot: $mg = \\rho\\,(fV)\\,g \\Rightarrow m = f\\rho V = " + E.t(m, "kg") + "$",
          "Alveg á kafi: $F + mg = \\rho V g \\Rightarrow F = (1 - f)\\rho V g = " + E.t(F, "N") + "$",
          "Sleppt: $ma = \\rho Vg - mg \\Rightarrow a = g\\,\\dfrac{1 - f}{f} = " + E.t(a, "m/s^2") + "$ upp á við"]
      };
    } });

  X({ id: "kulavatn", group: G4, source: "Byggt á lokaprófi 2018, dæmi 4", title: "Kúla bundin á kafi",
    gen: function (R, E) {
      var rr = R.num(0.1, 0.25, 0.01), m = R.num(0.5, 3, 0.5), hd = R.num(2, 6, 0.5), g = E.g, rho = 1000;
      var V = 4 / 3 * Math.PI * Math.pow(rr, 3), Fb = rho * V * g, T = Fb - m * g, p = 101e3 + rho * g * hd;
      if (T <= 0) { m = 0.5; T = Fb - m * g; }
      return {
        text: "Kúla með massa " + E.q(m, "kg") + " og geisla " + E.q(rr, "m") + " er bundin með lóðréttu bandi við botn í vatni ($\\rho = 1000\\,\\mathrm{kg/m^3}$) þannig að miðja hennar er " + E.q(hd, "m") + " undir yfirborði. Loftþrýstingur er $101\\,\\mathrm{kPa}$.",
        parts: [{ label: "Flotkrafturinn á kúluna", ans: Fb, unit: "N" },
          { label: "Togkrafturinn í bandinu", ans: T, unit: "N" },
          { label: "Þrýstingurinn í dýpt miðju kúlunnar", ans: p / 1000, unit: "kPa" }],
        steps: ["$V = \\tfrac43\\pi r^3 = " + E.t(V, "m^3") + "$",
          "Lögmál Arkímedesar: $F_{\\text{flot}} = \\rho V g = " + E.t(Fb, "N") + "$",
          "Jafnvægi: $F_{\\text{flot}} = mg + T \\Rightarrow T = " + E.n(Fb) + " - " + E.n(m * g) + " = " + E.t(T, "N") + "$",
          "$p = p_0 + \\rho g h = 101\\,000 + 1000\\cdot 9{,}8\\cdot " + E.n(hd) + " = " + E.t(p / 1000, "kPa") + "$"]
      };
    } });

  /* ---------- 5. Sveiflur og bylgjur ---------- */
  X({ id: "gitar", group: G5, source: "Byggt á lokaprófi 2018, dæmi 5", title: "Gítarstrengur",
    gen: function (R, E) {
      var dmm = R.num(0.6, 1.2, 0.1), f = R.pick([82, 110, 147, 196]), L = R.num(0.6, 1, 0.05), rho = 8050, Y = 210e9, vs = 340;
      var lam = 2 * L, v = lam * f, A = Math.PI * Math.pow(dmm / 2000, 2), mu = rho * A, T = mu * v * v, strain = T / (A * Y), ls = vs / f;
      return {
        text: "Gítarstrengur er stálvír með þvermál " + E.q(dmm, "mm") + ". Virk lengd hans (sá hluti sem sveiflast) er " + E.q(L, "m") + " og grunntónn hans er " + E.q(f, "Hz") + " þegar hann er rétt stilltur. Stál: $\\rho = 8050\\,\\mathrm{kg/m^3}$, $Y = 210\\times10^{9}\\,\\mathrm{Pa}$. Hljóðhraði í lofti er $340\\,\\mathrm{m/s}$.",
        parts: [{ label: "Bylgjulengd grunntónsins á strengnum", ans: lam, unit: "m" },
          { label: "Útbreiðsluhraði bylgnanna á strengnum", ans: v, unit: "m/s" },
          { label: "Togkrafturinn í strengnum", ans: T, unit: "N" },
          { label: "Hlutfallsleg lenging strengsins $\\Delta L/L_0$", ans: strain, unit: "" },
          { label: "Bylgjulengd hljóðsins í loftinu", ans: ls, unit: "m" }],
        steps: ["Grunntónn: hnútar í báðum endum, svo $\\lambda_1 = 2L = " + E.t(lam, "m") + "$",
          "$v = \\lambda f = " + E.n(lam) + "\\cdot " + E.n(f) + " = " + E.t(v, "m/s") + "$",
          "Massi á lengdareiningu: $\\mu = \\rho A = 8050\\cdot\\pi(" + E.n(dmm / 2000) + ")^2 = " + E.t(mu, "kg/m") + "$",
          "$v = \\sqrt{F_T/\\mu} \\Rightarrow F_T = \\mu v^2 = " + E.t(T, "N") + "$",
          "$\\dfrac{\\Delta L}{L_0} = \\dfrac{F_T}{AY} = \\dfrac{\\rho v^2}{Y} = " + E.n(strain) + "$",
          "Hljóðið hefur sömu tíðni en annan hraða: $\\lambda = 340/" + E.n(f) + " = " + E.t(ls, "m") + "$"]
      };
    } });

  X({ id: "peningur", group: G5, source: "Byggt á lokaprófi 2018, dæmi 3", title: "Smápeningur á sveiflandi gormi",
    gen: function (R, E) {
      var m = R.num(5, 20, 1) / 1000, A = R.num(0.5, 3, 0.1) / 100, g = 9.82;
      var k = m * g / A, f = Math.sqrt(k / m) / (2 * Math.PI), N = 2 * m * g;
      return {
        text: "Smápeningur með massa " + E.q(m * 1000, "g") + " liggur ofan á massalausum lóðréttum gormi sem er festur í gólfið. Gormurinn sveiflast óþvingað upp og niður með föstu útslagi " + E.q(A * 100, "cm") + ", þannig að $y(t) = A\\sin(\\omega t + \\varphi)$ með $\\omega = \\sqrt{k/m}$. Notaðu $g = 9{,}82\\,\\mathrm{m/s^2}$. Hannaðu gorminn með sem stærstan gormstuðul $k$ án þess að peningurinn missi nokkurn tíma snertingu við gorminn.",
        parts: [{ label: "Stærsti leyfilegi gormstuðull $k$", ans: k, unit: "N/m" },
          { label: "Tíðni sveiflunnar með þennan gorm", ans: f, unit: "Hz" },
          { label: "Mesti normalkraftur gormsins á peninginn", ans: N, unit: "N" }],
        steps: ["Á peninginn: $N - mg = m\\ddot y = -m\\omega^2 A\\sin(\\omega t + \\varphi)$, svo $N(t) = mg - m\\omega^2 A\\sin(\\omega t + \\varphi)$",
          "Minnstur í efstu stöðu: $N_{\\min} = m(g - \\omega^2 A) \\ge 0 \\Rightarrow \\omega^2 \\le g/A$",
          "$k = m\\omega^2 \\le \\dfrac{mg}{A} = \\dfrac{" + E.n(m) + "\\cdot 9{,}82}{" + E.n(A) + "} = " + E.t(k, "N/m") + "$",
          "$f = \\dfrac{1}{2\\pi}\\sqrt{g/A} = " + E.t(f, "Hz") + "$",
          "Mestur í neðstu stöðu: $N_{\\max} = m(g + \\omega^2 A) = 2mg = " + E.t(N, "N") + "$"]
      };
    } });

  X({ id: "hvidur", group: G5, source: "Byggt á lokaprófi 2013, dæmi 2", title: "Hviður frá tveimur vírum",
    gen: function (R, E) {
      var Wb = R.num(100, 300, 5), Wk = R.num(100, 300, 5), Lw = R.num(0.5, 1, 0.05), mw = R.num(3, 8, 0.5) / 1000;
      var TA = Wb / 2 + Wk / 4, TB = Wb / 2 + 3 * Wk / 4, mu = mw / Lw;
      var fA = Math.sqrt(TA / mu) / (2 * Lw), fB = Math.sqrt(TB / mu) / (2 * Lw);
      return {
        text: "Einsleitur láréttur biti sem vegur " + E.q(Wb, "N") + " hangir í tveimur eins lóðréttum vírum, $A$ í vinstri enda og $B$ í hægri enda. Lítill blýkubbur sem vegur " + E.q(Wk, "N") + " liggur á bitanum þrjá fjórðu af lengd hans frá $A$. Hvor vír er " + E.q(Lw * 100, "cm") + " langur með massa " + E.q(mw * 1000, "g") + ". Vírarnir eru plokkaðir samtímis og titra báðir á grunntóni sínum.",
        parts: [{ label: "Togkraftur í vír $A$", ans: TA, unit: "N" },
          { label: "Togkraftur í vír $B$", ans: TB, unit: "N" },
          { label: "Tíðni hviðanna", ans: fB - fA, unit: "Hz" }],
        steps: ["Kraftvægi um $A$: $T_B L = W_b\\dfrac{L}{2} + W_k\\dfrac{3L}{4} \\Rightarrow T_B = " + E.t(TB, "N") + "$",
          "$T_A = W_b + W_k - T_B = " + E.t(TA, "N") + "$",
          "$\\mu = m/L = " + E.t(mu, "kg/m") + "$ og grunntónn $f = \\dfrac{1}{2L}\\sqrt{T/\\mu}$",
          "$f_A = " + E.t(fA, "Hz") + "$, $\\;f_B = " + E.t(fB, "Hz") + "$",
          "Hviðutíðni: $f_{\\text{hviða}} = |f_B - f_A| = " + E.t(fB - fA, "Hz") + "$"]
      };
    } });

  X({ id: "strengjaskeyti", group: G5, source: "Byggt á lokaprófi 2015, dæmi 3", title: "Bylgja á skeyttum streng",
    gen: function (R, E) {
      var A = R.num(2, 10, 1) / 100, kc = R.num(5, 30, 5), wc = R.num(500, 3000, 250), L = R.num(5, 15, 1), mv = R.num(0.1, 0.5, 0.05), mh = mv * R.pick([1.5, 2, 2.4, 3, 4]);
      var k = kc * Math.PI, w = wc * Math.PI, vv = w / k, mu1 = mv / L, F = mu1 * vv * vv, vh = Math.sqrt(F * L / mh);
      return {
        text: "Grannur strengur er festur í vegg hægra megin og strekktur með krafti $F$ vinstra megin. Hann er skeyttur saman úr tveimur hlutum, hvor " + E.q(L, "m") + " langur: vinstri hlutinn hefur massann " + E.q(mv, "kg") + " og hægri hlutinn " + E.q(mh, "kg") + ". Á vinstri hlutanum ferðast bylgjan $y(x,t) = " + E.n(A) + "\\cos(" + kc + "\\pi x - " + wc + "\\pi t)$ ($x$ í m, $t$ í s) til hægri.",
        parts: [{ label: "Útbreiðsluhraði á vinstri hlutanum", ans: vv, unit: "m/s" },
          { label: "Stærð togkraftsins $F$", ans: F, unit: "N" },
          { label: "Útbreiðsluhraði á hægri hlutanum", ans: vh, unit: "m/s" },
          { label: "Bylgjulengd á hægri hlutanum", ans: 2 * Math.PI * vh / w, unit: "m" }],
        steps: ["Úr bylgjujöfnunni: $k = " + kc + "\\pi\\,\\mathrm{rad/m}$, $\\omega = " + wc + "\\pi\\,\\mathrm{rad/s}$",
          "$v_v = \\omega/k = " + E.t(vv, "m/s") + "$",
          "$\\mu_v = m_v/L = " + E.t(mu1, "kg/m") + "$ og $v = \\sqrt{F/\\mu}$, svo $F = \\mu_v v_v^2 = " + E.t(F, "N") + "$",
          "Sami togkraftur í öllum strengnum: $v_h = \\sqrt{F/\\mu_h} = \\sqrt{" + E.n(F) + "/" + E.n(mh / L) + "} = " + E.t(vh, "m/s") + "$",
          "Tíðnin helst sú sama við samskeytin: $\\lambda_h = v_h/f = 2\\pi v_h/\\omega = " + E.t(2 * Math.PI * vh / w, "m") + "$"]
      };
    } });
})();

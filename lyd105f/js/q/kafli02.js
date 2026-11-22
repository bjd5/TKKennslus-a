/* q/kafli02.js – aukaspurningar fyrir kafla 2: Lýsandi tölfræði og gröf (efni: lysandi). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 3 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var T = "lysandi";
  var SUM = '<pre class="rcode">&gt; summary(puls[, c("aldur", "fyrriPuls", "seinniPuls", "likamsraekt")])\n' +
    '     aldur         fyrriPuls        seinniPuls      likamsraekt\n' +
    ' Min.   :19.00   Min.   : 42.00   Min.   : 42.00   Min.   : 0.000\n' +
    ' 1st Qu.:20.00   1st Qu.: 64.00   1st Qu.: 68.00   1st Qu.: 2.000\n' +
    ' Median :22.00   Median : 71.50   Median : 77.00   Median : 4.000\n' +
    ' Mean   :24.24   Mean   : 71.98   Mean   : 82.21   Mean   : 4.492\n' +
    ' 3rd Qu.:25.00   3rd Qu.: 80.00   3rd Qu.: 93.00   3rd Qu.: 6.000\n' +
    ' Max.   :70.00   Max.   :120.00   Max.   :162.00   Max.   :25.000\n' +
    '                 NA\'s   :17       NA\'s   :14       NA\'s   :5</pre>';

  M(T, SUM + "Hver er fjórðungaspönnin (IQR) fyrir <code>fyrriPuls</code>?",
    ["16 slög/mín", "78 slög/mín", "8.5 slög/mín", "71.5 slög/mín"],
    "IQR = Q3 − Q1 = 80 − 64 = 16.");
  M(T, SUM + "Hvað segir úttakið um dreifingu <code>aldur</code>?",
    ["Hún er hægri-skekkt: flestir eru um tvítugt en fáir mun eldri (allt að 70 ára)", "Hún er samhverf", "Hún er vinstri-skekkt", "Hún er normaldreifð"],
    "Miðgildið (22) er lægra en meðaltalið (24.24) og hámarkið (70) er langt frá Q3 (25): langur hali upp á við.");
  M(T, SUM + "Hve margar mælingar vantar á <code>likamsraekt</code>?",
    ["5", "4.492", "25", "Engar"],
    "Línan <code>NA's</code> sýnir fjölda gilda sem vantar.");
  M(T, SUM + "Samkvæmt 1.5·IQR-reglunni, frá hvaða gildi teljast háir hvíldarpúlsar (<code>fyrriPuls</code>) útlagar?",
    ["Yfir 104 slög/mín", "Yfir 120 slög/mín", "Yfir 96 slög/mín", "Yfir 80 slög/mín"],
    "IQR = 16, svo efri mörkin eru Q3 + 1.5·16 = 80 + 24 = 104. Hámarkið (120) er því útlagi.");
  M(T, "Hvaða graf hentar best til að sýna dreifingu einnar samfelldrar breytu, t.d. hæðar?",
    ["Stuðlarit (histogram)", "Kökurit", "Stöplarit yfir flokka", "Punktarit tveggja breyta"],
    "Stuðlarit skiptir talnaásnum í bil og sýnir fjölda mælinga í hverju bili.");
  M(T, "Hvaða graf hentar best til að skoða samband tveggja talnabreyta, t.d. BMI og blóðþrýstings?",
    ["Punktarit (scatter plot)", "Kökurit", "Kassarit", "Stöplarit"],
    "Í punktariti er hvor breyta á sínum ás og hver punktur er einn einstaklingur.");
  M(T, "Hvaða graf hentar til að sýna fjölda í hverjum flokki flokkabreytu, t.d. reykingastöðu?",
    ["Stöplarit (bar chart)", "Stuðlarit", "Punktarit", "Normaldreifingarrit"],
    "Stöplarit sýnir tíðni eða hlutfall fyrir hvern flokk. Bil milli stöpla undirstrika að flokkarnir eru aðskildir.");
  M(T, "Hver er munurinn á stöplariti og stuðlariti?",
    ["Stöplarit er fyrir flokkabreytur, stuðlarit fyrir talnabreytur skiptar í bil", "Það er enginn munur", "Stöplarit er fyrir talnabreytur, stuðlarit fyrir flokkabreytur", "Stuðlarit sýnir alltaf hlutföll en stöplarit fjölda"],
    "Í stuðlariti liggja súlurnar saman því bilin mynda samfelldan ás.");
  M(T, "Hvað sýnir miðlínan í kassaritinu?",
    ["Miðgildið", "Meðaltalið", "Tíðasta gildið", "Staðalfrávikið"],
    "Kassinn nær frá Q1 til Q3 og línan í honum er miðgildið. Meðaltalið er ekki sýnt sjálfgefið.");
  M(T, "Hvaða mælikvarði á breytileika er <b>viðkvæmastur</b> fyrir útlögum?",
    ["Spönnin (hámark − lágmark)", "Fjórðungaspönnin", "Miðgildið", "Q1"],
    "Spönnin ræðst eingöngu af tveimur ystu gildunum. IQR er ónæm fyrir útlögum.");
  M(T, "Ef 10 er bætt við allar mælingar, hvað gerist við meðaltal og staðalfrávik?",
    ["Meðaltalið hækkar um 10 en staðalfrávikið er óbreytt", "Bæði hækka um 10", "Meðaltalið er óbreytt en staðalfrávikið hækkar um 10", "Bæði eru óbreytt"],
    "Hliðrun færir alla dreifinguna en breytir ekki dreifingu gildanna um meðaltalið.");
  M(T, "Ef allar mælingar eru margfaldaðar með 2 (t.d. breytt um einingu), hvað gerist við staðalfrávikið?",
    ["Það tvöfaldast", "Það er óbreytt", "Það fjórfaldast", "Það helmingast"],
    "Staðalfrávikið margfaldast með |a| við línulega umbreytingu aX + b. Dreifnin margfaldast með a² (fjórfaldast).");
  M(T, "Hvað mælir <b>frávikshlutfall</b> (coefficient of variation)?",
    ["Staðalfrávik sem hlutfall af meðaltali, s/x̄", "Dreifni deilt með n", "Mun á Q3 og Q1", "Meðaltal deilt með miðgildi"],
    "Frávikshlutfall er einingalaust og hentar til að bera saman breytileika breyta með ólíkar einingar.");
  M(T, "Hvenær er tíðasta gildið (mode) gagnlegasti mælikvarðinn á miðju?",
    ["Fyrir flokkabreytur, t.d. algengasti blóðflokkurinn", "Fyrir samfelldar breytur með marga aukastafi", "Þegar dreifingin er samhverf", "Aldrei"],
    "Fyrir óraðaðar flokkabreytur er hvorki hægt að reikna meðaltal né miðgildi.");
  M(T, "Í vinstri-skekktri dreifingu er yfirleitt:",
    ["Meðaltal < miðgildi", "Meðaltal > miðgildi", "Meðaltal = miðgildi", "Staðalfrávik = 0"],
    "Langur hali niður á við togar meðaltalið niður fyrir miðgildið.");
  M(T, "Hvers vegna er deilt með n − 1 en ekki n þegar úrtaksdreifni s² er reiknuð?",
    ["Svo s² sé óbjagaður metill fyrir σ²; úrtaksmeðaltalið er notað í stað μ og það tekur eina frígráðu", "Til að fá stærri tölu", "Það er bara hefð án ástæðu", "Til að s verði alltaf minna en meðaltalið"],
    "Frávikin frá x̄ eru að jafnaði aðeins minni en frá μ; n − 1 leiðréttir það.");
  M(T, "Fylgnistuðull Pearsons r = −0.85 milli tveggja breyta. Hvað þýðir það?",
    ["Sterkt neikvætt línulegt samband: þegar önnur hækkar lækkar hin", "Veikt samband", "Ekkert samband", "Önnur breytan veldur lækkun hinnar"],
    "r er á bilinu −1 til 1. Fylgni segir ekkert um orsakasamband.");
  M(T, "Fylgnistuðull er r = 0.02 en punktaritið sýnir skýrt U-laga samband. Hvað er rétt?",
    ["Fylgnistuðullinn mælir aðeins <i>línulegt</i> samband, svo hann missir af U-laga sambandi", "Það er ekkert samband milli breytanna", "Útreikningurinn er rangur", "Sambandið er sterkt neikvætt"],
    "Skoðaðu alltaf gögnin myndrænt áður en þú treystir r.");
  M(T, "Hvaða R-skipun gefur lágmark, fjórðungamörk, miðgildi, meðaltal og hámark?",
    ["<code>summary(x)</code>", "<code>mean(x)</code>", "<code>table(x)</code>", "<code>sd(x)</code>"],
    "<code>summary</code> gefur fimm tölu samantekt auk meðaltals (og fjölda NA).");
  M(T, "Hvaða R-skipun hentar til að telja fjölda í hverjum flokki flokkabreytu?",
    ["<code>table(x)</code>", "<code>mean(x)</code>", "<code>sd(x)</code>", "<code>quantile(x)</code>"],
    "<code>table</code> gefur tíðnitöflu; <code>prop.table(table(x))</code> gefur hlutföllin.");
  M(T, "Um 95% gilda í normaldreifingu eru innan meðaltals ± 2 staðalfrávik. Púls fylgir u.þ.b. N(72, 12²). Á hvaða bili eru um 95% hvíldarpúlsa?",
    ["48 til 96 slög/mín", "60 til 84 slög/mín", "36 til 108 slög/mín", "70 til 74 slög/mín"],
    "72 ± 2·12 = [48, 96]. ±1 staðalfrávik gefur um 68% og ±3 um 99.7%.");

  // ---------- Reiknidæmi ----------
  B.G.push(function lysMean() {
    var n = rnd(5, 8), xs = []; for (var i = 0; i < n; i++) xs.push(rnd(55, 98));
    var m = xs.reduce(function (a, b) { return a + b; }, 0) / n;
    return { topic: T, title: "Meðaltal", unit: "slög/mín", tol: 0.002, answer: m,
      text: "<p>Hvíldarpúls " + n + " nemenda: " + xs.join(", ") + ". Reiknaðu meðaltalið x̄.</p>",
      sol: "<p>x̄ = Σx/n = " + xs.reduce(function (a, b) { return a + b; }, 0) + "/" + n + " = " + f(m, 3) + ".</p><pre class=\"rcode\">mean(c(" + xs.join(", ") + "))</pre>" };
  });
  B.G.push(function lysCv() {
    var m = rnd(650, 850) / 10, s = rnd(80, 160) / 10, cv = s / m * 100;
    return { topic: T, title: "Frávikshlutfall", unit: "%", tol: 0.005, answer: cv,
      text: "<p>Meðalhvíldarpúls í úrtaki er " + m + " slög/mín og staðalfrávikið " + s + " slög/mín. Reiknaðu frávikshlutfallið (CV) í prósentum.</p>",
      sol: "<p>CV = s/x̄ · 100% = " + s + "/" + m + " · 100% = " + f(cv, 2) + "%.</p><pre class=\"rcode\">" + s + " / " + m + " * 100</pre>" };
  });
  B.G.push(function lysZscore() {
    var mu = rnd(115, 125), sd = rnd(8, 15), x = mu + rnd(-25, 30);
    var z = (x - mu) / sd;
    return { topic: T, title: "Staðlað gildi (z)", unit: "", tol: 0.002, absTol: 0.005, answer: z,
      text: "<p>Systólískur blóðþrýstingur í hópi hefur meðaltal " + mu + " mmHg og staðalfrávik " + sd + " mmHg. Einstaklingur mælist með " + x + " mmHg. Hve mörgum staðalfrávikum er hann frá meðaltalinu (z-gildi, með formerki)?</p>",
      sol: "<p>z = (x − x̄)/s = (" + x + " − " + mu + ")/" + sd + " = " + f(z, 3) + ".</p><pre class=\"rcode\">(" + x + " - " + mu + ") / " + sd + "</pre>" };
  });
  B.G.push(function lysWeighted() {
    var n1 = rnd(20, 60), n2 = rnd(20, 60), m1 = rnd(680, 760) / 10, m2 = rnd(680, 760) / 10;
    var m = (n1 * m1 + n2 * m2) / (n1 + n2);
    return { topic: T, title: "Vegið meðaltal", unit: "slög/mín", tol: 0.001, answer: m,
      text: "<p>Í hópi " + n1 + " kvenna er meðalpúls " + m1 + " og í hópi " + n2 + " karla " + m2 + " slög/mín. Hver er meðalpúls allra " + (n1 + n2) + " þátttakenda?</p>",
      sol: "<p>Vegið meðaltal: (" + n1 + "·" + m1 + " + " + n2 + "·" + m2 + ")/" + (n1 + n2) + " = " + f(m, 3) + ". Einfalt meðaltal tveggja meðaltala (" + f((m1 + m2) / 2, 3) + ") væri rangt nema hóparnir séu jafnstórir.</p><pre class=\"rcode\">(" + n1 + " * " + m1 + " + " + n2 + " * " + m2 + ") / " + (n1 + n2) + "</pre>" };
  });
})();

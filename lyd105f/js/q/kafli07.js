/* q/kafli07.js – aukaspurningar fyrir kafla 7: Hlutföll og tengslatöflur (efni: hlutfoll). */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var T = "hlutfoll";
  var TAF = '<pre class="rcode">&gt; tafla &lt;- table(fr$kyn, fr$sykursyki)\n&gt; tafla\n\n           No  Yes\n  Male   1885   59\n  Female 2428   62\n&gt; prop.test(tafla)\n\n\t2-sample test for equality of proportions with continuity correction\n\ndata:  tafla\nX-squared = 1.025, df = 1, p-value = 0.3113\nalternative hypothesis: two.sided\n95 percent confidence interval:\n -0.015686252  0.004785861\nsample estimates:\n   prop 1    prop 2\n0.9696502 0.9751004</pre>';
  var CHI = '<pre class="rcode">&gt; tafla &lt;- table(puls$kyn, puls$reykir)\n&gt; tafla\n\n     ja nei\n  1  28 272\n  2  18 140\n&gt; chisq.test(tafla)\n\n\tPearson\'s Chi-squared test with Yates\' continuity correction\n\ndata:  tafla\nX-squared = 0.28449, df = 1, p-value = 0.5938</pre>';
  var BMI = '<pre class="rcode">&gt; table(diabetes$bmi_group, diabetes$sykursyki)\n\n              0   1\n  (-Inf,18]   6   0\n  (18,25]   103   9\n  (25,30]    99  20\n  (30,35]    69  19\n  (35, Inf]  49  10\n&gt; chisq.test(table(diabetes$bmi_group, diabetes$sykursyki))\n\n\tPearson\'s Chi-squared test\n\nX-squared = 8.7448, df = 4, p-value = 0.0678\nWarning message:\nChi-squared approximation may be incorrect</pre>';

  M(T, TAF + "Hvað er <code>prop 2 = 0.9751004</code>?",
    ["Hlutfall kvenna <b>án</b> sykursýki (2428/2490)", "Hlutfall kvenna með sykursýki", "Hlutfall allra án sykursýki", "p-gildið"],
    "<code>prop.test</code> notar fyrsta dálkinn („No“) sem árangur. Hlutfall kvenna með sykursýki er 62/2490 = 0.0249.");
  M(T, TAF + "Hver er núlltilgátan í prófinu?",
    ["H₀: hlutfall með sykursýki er það sama hjá körlum og konum (p₁ = p₂)", "H₀: p₁ ≠ p₂", "H₀: allir eru án sykursýki", "H₀: p̂₁ = 0.970"],
    "Tilgátan er um þýðishlutföll. p = 0.311, svo henni er ekki hafnað.");
  M(T, TAF + "Hvaða ályktun er rétt?",
    ["Ekki er marktækur munur á hlutfalli sykursýki milli kynja (p = 0.31) og öryggisbilið fyrir mun hlutfallanna inniheldur 0", "Karlar eru marktækt oftar með sykursýki", "Konur eru marktækt oftar með sykursýki", "97% karla eru með sykursýki"],
    "Hlutfallið er 3.0% hjá körlum og 2.5% hjá konum, en munurinn er ekki marktækur.");
  M(T, TAF + "Hvaða önnur próf mætti nota á sömu töflu?",
    ["Kí-kvaðrat próf (<code>chisq.test</code>) eða Fisher-próf; tvíkosta aðhvarf kæmi líka til greina", "Parað t-próf", "ANOVA", "Línulegt aðhvarf á kyni"],
    "Á 2×2 töflu gefa <code>prop.test</code> og <code>chisq.test</code> sama χ² og p-gildi (lokaprófið 2025, dæmi 1c).");
  M(T, CHI + "Hverjar eru frígráður kí-kvaðrat prófs fyrir r × c töflu?",
    ["(r − 1)(c − 1), hér 1", "r·c − 1, hér 3", "n − 1", "r + c − 2"],
    "2×2 tafla: (2 − 1)(2 − 1) = 1.");
  M(T, CHI + "Hvaða ályktun er dregin?",
    ["Ekki eru marktæk tengsl milli kyns og reykinga (p = 0.59)", "Konur reykja marktækt meira", "Kyn veldur reykingum", "Prófið hafnar óhæði"],
    "H₀ um óhæði er ekki hafnað.");
  M(T, BMI + "Af hverju kemur viðvörunin „Chi-squared approximation may be incorrect“?",
    ["Sumar væntar tíðnir eru litlar (t.d. í flokknum BMI ≤ 18 með aðeins 6 manns)", "Af því að p &gt; 0.05", "Af því að taflan hefur 5 línur", "Af því að gögn vantar"],
    "Kí-kvaðrat nálgunin þarf væntar tíðnir ≥ 5. Þá má sameina flokka eða nota <code>fisher.test</code>.");
  M(T, BMI + "Hvaðan koma frígráðurnar df = 4?",
    ["(5 − 1)(2 − 1) = 4", "5 − 1 = 4 BMI-flokkar án sykursýki", "Fjöldi reita með tíðni undir 5", "n − 1"],
    "5 línur og 2 dálkar.");
  M(T, "Hvaða skipun gefur væntar tíðnir í kí-kvaðrat prófi í R?",
    ["<code>chisq.test(tafla)$expected</code>", "<code>table(tafla)</code>", "<code>prop.table(tafla)</code>", "<code>summary(tafla)</code>"],
    "Væntar tíðnir eru E = línusumma·dálksumma/heild.");
  M(T, "Hvernig er kí-kvaðrat prófstærðin reiknuð?",
    ["χ² = Σ (séð − vænt)²/vænt yfir alla reiti", "χ² = Σ (séð − vænt)", "χ² = (x̄₁ − x̄₂)/SE", "χ² = MS hópa/MS leifa"],
    "Stórt χ² þýðir að sést tíðni víkur mikið frá því sem óhæði spáir.");
  M(T, "Hvaða próf hentar til að kanna hvort hlutfall reykingafólks sé 15%?",
    ["Eins úrtaks hlutfallspróf: <code>prop.test(x, n, p = 0.15)</code>", "Parað t-próf", "ANOVA", "<code>var.test</code>"],
    "Sjálfgefið prófar <code>prop.test</code> p = 0.5, svo tilgreina þarf <code>p</code>.");
  M(T, "Hvað er <b>áhættuhlutfall</b> (relative risk, RR)?",
    ["Hlutfall áhættu útsettra og óútsettra: P(sjúkd | útsett)/P(sjúkd | ekki útsett)", "Hlutfall gagnlíkinda", "Mismunur áhættu", "p-gildið í kí-kvaðrat prófi"],
    "RR = 2 þýðir tvöfalda áhættu. OR nálgast RR þegar sjúkdómurinn er sjaldgæfur.");
  M(T, "Hvenær er OR góð nálgun á RR?",
    ["Þegar útkoman er sjaldgæf (lágt algengi)", "Alltaf", "Þegar útkoman er algeng", "Aldrei"],
    "Ef p er lítið er p/(1 − p) ≈ p.");
  M(T, "Í tilfella-viðmiðarannsókn (case-control) eru sjúklingar og viðmið valin eftir útkomu. Hvað má reikna?",
    ["Gagnlíkindahlutfall (OR), en ekki áhættu eða RR beint", "RR beint", "Algengi sjúkdómsins í þýðinu", "Nýgengi"],
    "Hlutfall tilfella í rannsókninni er ákveðið af rannsakanda, svo áhætta er ekki metanleg; OR er það.");
  M(T, "Áfengissjúkir: 75 með fitulifur, 15 án. Ekki áfengissjúkir: 26 með, 85 án. Hvert er OR?",
    ["(75·85)/(15·26) ≈ 16.3", "75/26 ≈ 2.9", "(75/90)/(26/111) ≈ 3.6", "(15·26)/(75·85) ≈ 0.06"],
    "Gagnlíkindi 75/15 = 5 og 26/85 = 0.306; OR = 5/0.306 = 16.3 (dæmið úr glærum um tvíkosta aðhvarf).");
  M(T, "Í sama dæmi (75/90 áfengissjúkra og 26/111 annarra með fitulifur), hvert er RR?",
    ["(75/90)/(26/111) ≈ 3.56", "16.3", "75/26", "0.83"],
    "Áhætta 0.833 og 0.234. RR er miklu lægra en OR því útkoman er algeng.");
  M(T, "Hvað er rétt um <code>prop.test(x = c(59, 62), n = c(1944, 2490))</code>?",
    ["Það ber saman hlutfall sykursýki hjá körlum (59/1944) og konum (62/2490)", "Það ber saman meðaltöl", "Það prófar hvort 59 = 62", "Það reiknar OR"],
    "Með <code>x</code> og <code>n</code> sem vigrum er árangurinn skýr, og gildran með fyrsta dálkinn hverfur.");
  M(T, "Hvenær er Fisher-próf (<code>fisher.test</code>) æskilegra en kí-kvaðrat?",
    ["Þegar úrtakið er lítið og væntar tíðnir eru undir 5", "Þegar breyturnar eru samfelldar", "Þegar taflan er stór og n mjög stórt", "Þegar gögnin eru pöruð"],
    "Fisher-prófið er nákvæmt og byggir ekki á nálgun.");
  M(T, "Hvað mælir kí-kvaðrat próf á tengslatöflu?",
    ["Hvort tvær flokkabreytur séu óháðar", "Hvort meðaltöl séu jöfn", "Hvort dreifni sé jöfn", "Hvort samband sé línulegt"],
    "H₀: breyturnar eru óháðar. H₁: tengsl eru á milli þeirra.");
  M(T, "95% öryggisbil fyrir mun tveggja hlutfalla er [−0.016, 0.005]. Hvað má álykta?",
    ["Ekki marktækur munur, því 0 er í bilinu", "Marktækur munur", "Hlutföllin eru bæði neikvæð", "OR er marktækt"],
    "Fyrir <b>mun</b> er engin-áhrif-gildið 0; fyrir <b>hlutfall</b> (OR, RR) er það 1.");
  M(T, "Í Framingham: 59 af 1944 körlum og 62 af 2490 konum eru með sykursýki. Hvert er hlutfall karla með sykursýki?",
    ["0.0303", "0.9697", "0.0237", "0.0249"],
    "59/1944 = 0.0303. Hjá konum 62/2490 = 0.0249.");

  // ---------- Reiknidæmi ----------
  B.G.push(function hlutChi2x2() {
    var a = rnd(20, 60), b = rnd(60, 200), c = rnd(20, 60), d = rnd(60, 200), n = a + b + c + d;
    var cells = [[a, (a + b) * (a + c) / n], [b, (a + b) * (b + d) / n], [c, (c + d) * (a + c) / n], [d, (c + d) * (b + d) / n]];
    var chi = cells.reduce(function (s, x) { return s + (x[0] - x[1]) * (x[0] - x[1]) / x[1]; }, 0);
    return { topic: T, title: "Kí-kvaðrat prófstærð (án leiðréttingar)", unit: "", tol: 0.005, answer: chi,
      text: "<table class=\"tt\"><tr><th></th><th>Reykir</th><th>Reykir ekki</th></tr><tr><th>Karlar</th><td>" + a + "</td><td>" + b + "</td></tr><tr><th>Konur</th><td>" + c + "</td><td>" + d + "</td></tr></table><p>Reiknaðu kí-kvaðrat prófstærðina χ² = Σ(séð − vænt)²/vænt (án Yates-leiðréttingar).</p>",
      sol: "<p>Væntar tíðnir: " + cells.map(function (x) { return f(x[1], 2); }).join(", ") + ". χ² = " + f(chi, 3) + " með 1 frígráðu, p = " + f(2 * S.pnorm(-Math.sqrt(chi))) + ".</p><pre class=\"rcode\">chisq.test(matrix(c(" + a + ", " + c + ", " + b + ", " + d + "), 2), correct = FALSE)</pre>" };
  });
  B.G.push(function hlutPhat() {
    var n = rnd(150, 600), x = rnd(Math.round(n * 0.05), Math.round(n * 0.4));
    var se = Math.sqrt((x / n) * (1 - x / n) / n);
    return { topic: T, title: "Staðalskekkja hlutfalls", unit: "", tol: 0.005, answer: se,
      text: "<p>Í úrtaki " + n + " sjúklinga eru " + x + " með sykursýki. Reiknaðu staðalskekkju hlutfallsins, √(p̂(1 − p̂)/n).</p>",
      sol: "<p>p̂ = " + f(x / n) + ", SE = √(" + f(x / n) + "·" + f(1 - x / n) + "/" + n + ") = " + f(se) + ".</p><pre class=\"rcode\">p &lt;- " + x + " / " + n + "; sqrt(p * (1 - p) / " + n + ")</pre>" };
  });
  B.G.push(function hlutOdds() {
    var x = rnd(5, 60), n = x + rnd(20, 200);
    var o = x / (n - x);
    return { topic: T, title: "Gagnlíkindi", unit: "", tol: 0.005, answer: o,
      text: "<p>Af " + n + " sjúklingum svöruðu " + x + " meðferð. Hver eru <b>gagnlíkindin</b> (odds) á svörun?</p>",
      sol: "<p>Gagnlíkindi = p/(1 − p) = " + x + "/" + (n - x) + " = " + f(o) + " (líkurnar eru " + f(x / n) + ").</p><pre class=\"rcode\">" + x + " / " + (n - x) + "</pre>" };
  });
})();

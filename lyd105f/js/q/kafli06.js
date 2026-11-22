/* q/kafli06.js – aukaspurningar fyrir kafla 6: Tilgátupróf og t-próf (efni: tilgatur, ttest). */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var VAR = '<pre class="rcode">&gt; var.test(fyrriPuls ~ kyn, data = puls)\n\n\tF test to compare two variances\n\ndata:  fyrriPuls by kyn\nF = 1.2512, num df = 293, denom df = 159, p-value = 0.1155\nalternative hypothesis: true ratio of variances is not equal to 1\n95 percent confidence interval:\n 0.9461411 1.6360633\nsample estimates:\nratio of variances\n          1.251186</pre>';
  var TT = '<pre class="rcode">&gt; t.test(fyrriPuls ~ kyn, data = puls, var.equal = TRUE)\n\n\tTwo Sample t-test\n\ndata:  fyrriPuls by kyn\nt = 2.5937, df = 452, p-value = 0.009803\nalternative hypothesis: true difference in means between group 1 and group 2 is not equal to 0\n95 percent confidence interval:\n 0.7277253 5.2789073\nsample estimates:\nmean in group 1 mean in group 2\n       73.04082        70.03750</pre>';
  var WEL = '<pre class="rcode">&gt; t.test(SYSBP ~ sykursyki, data = fr, var.equal = FALSE)\n\n\tWelch Two Sample t-test\n\ndata:  SYSBP by sykursyki\nt = -5.8067, df = 123.71, p-value = 5.044e-08\nalternative hypothesis: true difference in means between group No and group Yes is not equal to 0\n95 percent confidence interval:\n -21.25444 -10.44807\nsample estimates:\n mean in group No mean in group Yes\n         132.4752          148.3264</pre>';

  M("ttest", VAR + "Hvað prófar þetta F-próf og hver er niðurstaðan?",
    ["H₀: dreifni hvíldarpúls er jöfn hjá kynjunum; henni er ekki hafnað (p = 0.1155)", "H₀: meðalpúls er jafn; henni er hafnað", "H₀: dreifnin er ólík; henni er hafnað", "H₀: hlutfall dreifnanna er 1.25; henni er ekki hafnað"],
    "<code>var.test</code> ber saman dreifni tveggja hópa. p &gt; 0.05 og bilið [0.95, 1.64] inniheldur 1, svo var.equal = TRUE er réttlætanlegt.");
  M("ttest", TT + "Kyn 1 = konur, kyn 2 = karlar. Hvaða ályktun er rétt?",
    ["Konur eru að jafnaði með marktækt hraðari hvíldarpúls en karlar, um 0.7–5.3 slögum/mín meira", "Enginn marktækur munur er á kynjunum", "Karlar eru með hraðari púls", "Munurinn er 73.04 slög/mín"],
    "p = 0.0098 &lt; 0.05 og bilið fyrir μ₁ − μ₂ er allt jákvætt.");
  M("ttest", TT + "Hvernig fást frígráðurnar df = 452?",
    ["n₁ + n₂ − 2 (294 konur + 160 karlar − 2)", "n − 1", "Úr Welch-nálgun", "Fjöldi NA-gilda"],
    "Í t-prófi með veginni dreifni eru frígráður n₁ + n₂ − 2.");
  M("ttest", WEL + "Af hverju eru frígráðurnar ekki heiltala (123.71)?",
    ["Welch-prófið notar nálgun (Welch–Satterthwaite) á frígráðum þegar dreifnin er ólík", "Af því að gögn vantar", "Af því að R reiknaði vitlaust", "Af því að þetta er parað próf"],
    "Í Welch-prófi eru frígráður reiknaðar út frá dreifni og stærð hópanna og eru yfirleitt ekki heiltölur.");
  M("ttest", WEL + "Hvað segir öryggisbilið [−21.25, −10.45]?",
    ["Meðalblóðþrýstingur þeirra sem eru <b>með</b> sykursýki er 10.4–21.3 mmHg hærri en hinna", "Þeir sem eru án sykursýki hafa hærri blóðþrýsting", "Munurinn er ekki marktækur", "Blóðþrýstingur lækkar um 10–21 mmHg"],
    "Bilið er fyrir μ<sub>No</sub> − μ<sub>Yes</sub>. Neikvætt bil þýðir að Yes-hópurinn hefur hærra meðaltal.");
  M("ttest", "Í pöruðu t-prófi er í raun prófað:",
    ["Hvort meðaltal mismunanna d = eftir − fyrir sé 0 (eins úrtaks t-próf á d)", "Hvort dreifnin sé jöfn", "Hvort tveir óháðir hópar hafi sama meðaltal", "Hvort hlutföllin séu jöfn"],
    "Frígráður eru n − 1, þar sem n er fjöldi para.");
  M("ttest", "Hvaða R-skipun framkvæmir parað t-próf á blóðþrýstingi fyrir og eftir meðferð?",
    ["<code>t.test(eftir, fyrir, paired = TRUE)</code>", "<code>t.test(eftir, fyrir, var.equal = TRUE)</code>", "<code>var.test(eftir, fyrir)</code>", "<code>prop.test(eftir, fyrir)</code>"],
    "Sama útkoma fæst með <code>t.test(eftir - fyrir, mu = 0)</code>.");
  M("ttest", "Hvaða R-skipun prófar hvort meðalhæð sé önnur en 175 cm?",
    ["<code>t.test(haed, mu = 175)</code>", "<code>t.test(haed ~ 175)</code>", "<code>prop.test(haed, 175)</code>", "<code>var.test(haed, 175)</code>"],
    "Eins úrtaks t-próf með <code>mu</code> = gildið í H₀.");
  M("ttest", "Hvað gerist ef óparað t-próf er notað á pöruð gögn (sömu einstaklingar fyrir og eftir)?",
    ["Prófið verður yfirleitt of veikt, því það tekur ekki tillit til fylgni innan einstaklinga", "Prófið verður sterkara", "Engin áhrif", "p-gildið verður alltaf 0"],
    "Pörun fjarlægir breytileika milli einstaklinga og eykur styrk.");
  M("tilgatur", "Hvaða lýsing á skrefum tilgátuprófs er rétt?",
    ["Setja fram H₀ og H₁, velja α, reikna prófstærð, finna p-gildi, draga ályktun", "Reikna p-gildi, velja svo H₀ sem passar", "Velja α eftir að p-gildið er komið", "Hafna alltaf H₀ ef n er stórt"],
    "α og tilgátur eru ákveðnar <b>áður</b> en gögnin eru skoðuð.");
  M("tilgatur", "Hvenær á að nota <b>einhliða</b> tilgátupróf?",
    ["Þegar rannsóknarspurningin snýst aðeins um eina átt, ákveðið fyrir fram (t.d. hvort lyf <i>lækki</i> blóðþrýsting)", "Alltaf, því það gefur lægra p-gildi", "Þegar p-gildið í tvíhliða prófi er rétt yfir 0.05", "Aldrei"],
    "Að skipta yfir í einhliða próf eftir á til að ná marktekt er ekki leyfilegt.");
  M("tilgatur", "Tvíhliða t-próf gefur p = 0.08. Hvert væri einhliða p-gildið í sömu átt og frávikið?",
    ["0.04", "0.16", "0.08", "0.92"],
    "Fyrir samhverfa dreifingu er einhliða p helmingurinn af tvíhliða, ef frávikið er í „réttu“ áttina.");
  M("tilgatur", "Hvað þýðir „marktækt við α = 0.05“?",
    ["p-gildið er minna en 0.05, svo við höfnum H₀", "Áhrifin eru stór og mikilvæg", "Líkurnar á að H₀ sé sönn eru undir 5%", "Rannsóknin er rétt framkvæmd"],
    "Tölfræðileg marktekt segir ekki til um klíníska þýðingu. Með stóru n geta örlítil áhrif orðið marktæk.");
  M("tilgatur", "Rannsakendur framkvæma 20 óháð tilgátupróf þar sem H₀ er alltaf sönn, við α = 0.05. Hve mörg má búast við að verði marktæk?",
    ["1", "0", "5", "20"],
    "20·0.05 = 1. Þetta er vandinn við fjölpróf (multiple testing).");
  M("tilgatur", "Hver er tengingin milli α og villu af gerð I?",
    ["α eru líkurnar á villu af gerð I, P(hafna H₀ | H₀ sönn)", "α eru líkurnar á villu af gerð II", "α er styrkur prófsins", "Engin tenging"],
    "Með α = 0.05 höfnum við sannri H₀ í 5% tilvika.");

  // ---------- Reiknidæmi ----------
  B.G.push(function ttestPaired() {
    var n = pick([12, 15, 20, 25]), d = rnd(30, 90) / 10, sd = rnd(60, 140) / 10;
    var t = d / (sd / Math.sqrt(n));
    return { topic: "ttest", title: "Parað t-próf: prófstærð", unit: "", tol: 0.003, absTol: 0.01, answer: t,
      text: "<p>Blóðþrýstingur " + n + " sjúklinga er mældur fyrir og eftir meðferð. Meðaltal mismunarins (fyrir − eftir) er d̄ = " + d + " mmHg og staðalfrávik mismunarins s<sub>d</sub> = " + sd + " mmHg. Reiknaðu prófstærðina t í pöruðu t-prófi fyrir H₀: μ<sub>d</sub> = 0.</p>",
      sol: "<p>t = d̄/(s<sub>d</sub>/√n) = " + d + "/(" + sd + "/√" + n + ") = " + f(t, 3) + " með " + (n - 1) + " frígráður. Tvíhliða p = " + f(2 * S.pt(-Math.abs(t), n - 1)) + ".</p><pre class=\"rcode\">t &lt;- " + d + " / (" + sd + " / sqrt(" + n + "))\n2 * pt(-abs(t), df = " + (n - 1) + ")</pre>" };
  });
  B.G.push(function ttestPooled() {
    var n1 = rnd(10, 30), n2 = rnd(10, 30), s1 = rnd(80, 140) / 10, s2 = rnd(80, 140) / 10;
    var sp2 = ((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (n1 + n2 - 2);
    return { topic: "ttest", title: "Vegin dreifni", unit: "", tol: 0.003, answer: sp2,
      text: "<p>Tveir óháðir hópar: n₁ = " + n1 + ", s₁ = " + s1 + " og n₂ = " + n2 + ", s₂ = " + s2 + ". Reiknaðu vegnu dreifnina s<sub>p</sub>² sem notuð er í t-prófi með <code>var.equal = TRUE</code>.</p>",
      sol: "<p>s<sub>p</sub>² = ((n₁ − 1)s₁² + (n₂ − 1)s₂²)/(n₁ + n₂ − 2) = (" + (n1 - 1) + "·" + f(s1 * s1, 2) + " + " + (n2 - 1) + "·" + f(s2 * s2, 2) + ")/" + (n1 + n2 - 2) + " = " + f(sp2, 3) + ".</p><pre class=\"rcode\">((" + n1 + " - 1) * " + s1 + "^2 + (" + n2 + " - 1) * " + s2 + "^2) / (" + n1 + " + " + n2 + " - 2)</pre>" };
  });
  B.G.push(function ttestTwoSample() {
    var n1 = rnd(15, 40), n2 = rnd(15, 40), m1 = rnd(700, 780) / 10, m2 = rnd(680, 760) / 10, s = rnd(90, 140) / 10;
    var se = s * Math.sqrt(1 / n1 + 1 / n2), t = (m1 - m2) / se;
    return { topic: "ttest", title: "Óparað t-próf: prófstærð", unit: "", tol: 0.003, absTol: 0.01, answer: t,
      text: "<p>Hvíldarpúls kvenna (n₁ = " + n1 + ", x̄₁ = " + m1 + ") og karla (n₂ = " + n2 + ", x̄₂ = " + m2 + "). Vegið staðalfrávik er s<sub>p</sub> = " + s + ". Reiknaðu prófstærðina t = (x̄₁ − x̄₂)/(s<sub>p</sub>√(1/n₁ + 1/n₂)).</p>",
      sol: "<p>SE = " + s + "·√(1/" + n1 + " + 1/" + n2 + ") = " + f(se) + ". t = (" + m1 + " − " + m2 + ")/" + f(se) + " = " + f(t, 3) + " með " + (n1 + n2 - 2) + " frígráður.</p><pre class=\"rcode\">(" + m1 + " - " + m2 + ") / (" + s + " * sqrt(1/" + n1 + " + 1/" + n2 + "))</pre>" };
  });
  B.G.push(function tilgCrit() {
    var df = pick([5, 9, 14, 19, 29, 49]), a = pick([0.05, 0.01, 0.1]);
    var c = S.qt(1 - a / 2, df);
    return { topic: "tilgatur", title: "Höfnunarmörk", unit: "", tol: 0.002, answer: c,
      text: "<p>Tvíhliða t-próf með " + df + " frígráður og marktektarkröfu α = " + a + ". Fyrir hvaða |t| (minnst) er H₀ hafnað? Gefðu jákvæða gildið.</p>",
      sol: "<p>Höfnunarmörkin eru t<sub>1 − α/2, df</sub> = t<sub>" + (1 - a / 2) + ", " + df + "</sub> = " + f(c, 3) + ". Höfnum H₀ ef |t| &gt; " + f(c, 3) + ".</p><pre class=\"rcode\">qt(" + (1 - a / 2) + ", df = " + df + ")</pre>" };
  });
})();

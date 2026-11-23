/* q/kafli06.js – aukaspurningar fyrir kafla 6: Tilgátupróf og t-próf (efni: tilgatur, ttest). */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var VAR = '<pre class="rcode">&gt; var.test(fyrriPuls ~ kyn, data = puls)\n\n\tF test to compare two variances\n\ndata:  fyrriPuls by kyn\nF = 1.2512, num df = 293, denom df = 159, p-value = 0.1155\nalternative hypothesis: true ratio of variances is not equal to 1\n95 percent confidence interval:\n 0.9461411 1.6360633\nsample estimates:\nratio of variances\n          1.251186</pre>';
  var TT = '<pre class="rcode">&gt; t.test(fyrriPuls ~ kyn, data = puls, var.equal = TRUE)\n\n\tTwo Sample t-test\n\ndata:  fyrriPuls by kyn\nt = 2.5937, df = 452, p-value = 0.009803\n95 percent confidence interval:\n 0.7277253 5.2789073\nsample estimates:\nmean in group 1 mean in group 2\n       73.04082        70.03750</pre>';
  var WEL = '<pre class="rcode">&gt; t.test(SYSBP ~ sykursyki, data = fr, var.equal = FALSE)\n\n\tWelch Two Sample t-test\n\ndata:  SYSBP by sykursyki\nt = -5.8067, df = 123.71, p-value = 5.044e-08\n95 percent confidence interval:\n -21.25444 -10.44807\nsample estimates:\n mean in group No mean in group Yes\n         132.4752          148.3264</pre>';

  M("ttest", VAR + "Hvað prófar þetta F-próf og hver er niðurstaðan?",
    ["H₀: dreifni hvíldarpúls er jöfn hjá kynjunum; henni er ekki hafnað (p = 0.1155)", "H₀: meðalpúls er jafn; henni er hafnað", "H₀: dreifnin er ólík; henni er hafnað", "H₀: hlutfall dreifnanna er 1.25; henni er ekki hafnað"],
    "<code>var.test</code> ber saman dreifni tveggja hópa. p &gt; 0.05 og bilið [0.95, 1.64] inniheldur 1, svo var.equal = TRUE er réttlætanlegt.");
  M("ttest", TT + "Kyn 1 = konur, kyn 2 = karlar. Hvaða ályktun er rétt?",
    ["Konur eru að jafnaði með marktækt hraðari hvíldarpúls en karlar, um 0.7–5.3 slögum/mín meira", "Enginn marktækur munur er á kynjunum", "Karlar eru með hraðari púls", "Munurinn er 73.04 slög/mín"],
    "p = 0.0098 &lt; 0.05 og bilið fyrir μ₁ − μ₂ er allt jákvætt.");
  M("ttest", TT + "Hvernig fást frígráðurnar df = 452?",
    ["n₁ + n₂ − 2 (294 konur + 160 karlar − 2)", "n − 1", "Úr Welch-nálgun", "n₁ + n₂ − 1 (fjöldi mælinga mínus einn)"],
    "Í t-prófi með veginni dreifni eru frígráður n₁ + n₂ − 2.");
  M("ttest", WEL + "Af hverju eru frígráðurnar ekki heiltala (123.71)?",
    ["Welch-prófið notar nálgun (Welch–Satterthwaite) á frígráðum þegar dreifnin er ólík", "Af því að gögn vantar", "Af því að hóparnir eru misstórir", "Af því að þetta er parað próf"],
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
    ["Prófið verður yfirleitt of veikt, því það tekur ekki tillit til fylgni innan einstaklinga", "Prófið verður sterkara", "Engin áhrif", "Prófið gefur of lágt p-gildi"],
    "Pörun fjarlægir breytileika milli einstaklinga og eykur styrk.");
  M("tilgatur", "Hvaða lýsing á skrefum tilgátuprófs er rétt?",
    ["Setja fram H₀ og H₁, velja α, reikna prófstærð, finna p-gildi, draga ályktun", "Reikna p-gildi, velja svo H₀ sem passar", "Velja α eftir að p-gildið er komið", "Hafna alltaf H₀ ef n er stórt"],
    "α og tilgátur eru ákveðnar <b>áður</b> en gögnin eru skoðuð.");
  M("tilgatur", "Hvenær á að nota <b>einhliða</b> tilgátupróf?",
    ["Þegar rannsóknarspurningin snýst aðeins um eina átt, ákveðið fyrir fram (t.d. hvort lyf <i>lækki</i> blóðþrýsting)", "Alltaf, því það gefur lægra p-gildi", "Þegar p-gildið í tvíhliða prófi er rétt yfir 0.05", "Þegar úrtakið er lítið"],
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
      text: "<p>Blóðþrýstingur " + n + " sjúklinga er mældur fyrir og eftir meðferð. Meðaltal mismunarins (fyrir − eftir) er d̄ = " + d + " mmHg og staðalfrávik mismunarins s<sub>d</sub> = " + sd + " mmHg. Reiknið prófstærðina t í pöruðu t-prófi fyrir H₀: μ<sub>d</sub> = 0.</p>",
      sol: "<p>t = d̄/(s<sub>d</sub>/√n) = " + d + "/(" + sd + "/√" + n + ") = " + f(t, 3) + " með " + (n - 1) + " frígráður. Tvíhliða p = " + f(2 * S.pt(-Math.abs(t), n - 1)) + ".</p><pre class=\"rcode\">t &lt;- " + d + " / (" + sd + " / sqrt(" + n + "))\n2 * pt(-abs(t), df = " + (n - 1) + ")</pre>" };
  });
  B.G.push(function ttestPooled() {
    var n1 = rnd(10, 30), n2 = rnd(10, 30), s1 = rnd(80, 140) / 10, s2 = rnd(80, 140) / 10;
    var sp2 = ((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (n1 + n2 - 2);
    return { topic: "ttest", title: "Vegin dreifni", unit: "", tol: 0.003, answer: sp2,
      text: "<p>Tveir óháðir hópar: n₁ = " + n1 + ", s₁ = " + s1 + " og n₂ = " + n2 + ", s₂ = " + s2 + ". Reiknið vegnu dreifnina s<sub>p</sub>² sem notuð er í t-prófi með <code>var.equal = TRUE</code>.</p>",
      sol: "<p>s<sub>p</sub>² = ((n₁ − 1)s₁² + (n₂ − 1)s₂²)/(n₁ + n₂ − 2) = (" + (n1 - 1) + "·" + f(s1 * s1, 2) + " + " + (n2 - 1) + "·" + f(s2 * s2, 2) + ")/" + (n1 + n2 - 2) + " = " + f(sp2, 3) + ".</p><pre class=\"rcode\">((" + n1 + " - 1) * " + s1 + "^2 + (" + n2 + " - 1) * " + s2 + "^2) / (" + n1 + " + " + n2 + " - 2)</pre>" };
  });
  B.G.push(function ttestTwoSample() {
    var n1 = rnd(15, 40), n2 = rnd(15, 40), m1 = rnd(700, 780) / 10, m2 = rnd(680, 760) / 10, s = rnd(90, 140) / 10;
    var se = s * Math.sqrt(1 / n1 + 1 / n2), t = (m1 - m2) / se;
    return { topic: "ttest", title: "Óparað t-próf: prófstærð", unit: "", tol: 0.003, absTol: 0.01, answer: t,
      text: "<p>Hvíldarpúls kvenna (n₁ = " + n1 + ", x̄₁ = " + m1 + ") og karla (n₂ = " + n2 + ", x̄₂ = " + m2 + "). Vegið staðalfrávik er s<sub>p</sub> = " + s + ". Reiknið prófstærðina t = (x̄₁ − x̄₂)/(s<sub>p</sub>√(1/n₁ + 1/n₂)).</p>",
      sol: "<p>SE = " + s + "·√(1/" + n1 + " + 1/" + n2 + ") = " + f(se) + ". t = (" + m1 + " − " + m2 + ")/" + f(se) + " = " + f(t, 3) + " með " + (n1 + n2 - 2) + " frígráður.</p><pre class=\"rcode\">(" + m1 + " - " + m2 + ") / (" + s + " * sqrt(1/" + n1 + " + 1/" + n2 + "))</pre>" };
  });
  B.G.push(function tilgCrit() {
    var df = pick([5, 9, 14, 19, 29, 49]), a = pick([0.05, 0.01, 0.1]);
    var c = S.qt(1 - a / 2, df);
    return { topic: "tilgatur", title: "Höfnunarmörk", unit: "", tol: 0.002, answer: c,
      text: "<p>Tvíhliða t-próf með " + df + " frígráðum og marktektarkröfu α = " + a + ". Fyrir hvaða |t| (minnst) er H₀ hafnað? Gefið jákvæða gildið.</p>",
      sol: "<p>Höfnunarmörkin eru t<sub>1 − α/2, df</sub> = t<sub>" + (1 - a / 2) + ", " + df + "</sub> = " + f(c, 3) + ". Höfnum H₀ ef |t| &gt; " + f(c, 3) + ".</p><pre class=\"rcode\">qt(" + (1 - a / 2) + ", df = " + df + ")</pre>" };
  });

  // ---------- Í stíl fyrirlestradæma (aukadæmi 8–9) og lokaprófa ----------
  M("tilgatur", "Þorgerður vísindakona notaði parað t-próf til að kanna virkni lyfs sem hún er að þróa. Hún fékk p-gildi = 0.005 og ályktaði að lyfið beri árangur (α = 0.05). Gefum okkur að lyfið virki í raun ekki. Hver eftirfarandi fullyrðinga er rétt?",
    ["Villa af gerð I átti sér stað", "Villa af gerð II átti sér stað", "Það átti engin villa sér stað", "Þorgerður átti ekki að hafna núlltilgátunni því p-gildið er of stórt"],
    "Núlltilgátan (lyfið virkar ekki) er sönn en henni var hafnað: villa af gerð I (fyrirlestradæmi, kennsluvika 9, spurning 5).");
  M("tilgatur", "Elísabet taldi ferðamenn sem heimsóttu stað á Norðurlandi dag hvern í tvo mánuði og reiknaði 95% öryggisbil fyrir mismun meðaltalanna: −8.21 &lt; μ₁ − μ₂ &lt; −2.12. Hún framkvæmdi svo viðeigandi tilgátupróf með α = 0.05. Hver af eftirfarandi fullyrðingum er sönn?",
    ["p-gildi prófsins er lægra en 0.05", "p-gildi prófsins er hærra en 0.05", "Líkurnar á að núlltilgátan sé sönn eru 0.05", "Ekki er hægt að segja neitt um p-gildið út frá bilinu"],
    "Bilið inniheldur ekki 0, svo tvíhliða próf við α = 0.05 hafnar H₀: μ₁ − μ₂ = 0 (fyrirlestradæmi, kennsluvika 9, spurning 7).");
  M("tilgatur", "Lalli lyfjafræðingur mælir hversu lengi virka efnið í lyfi mælist í lifrinni. Gera má ráð fyrir normaldreifingu með <b>þekkt</b> staðalfrávik 22 mínútur. Hann mælir 15 einstaklinga og vill kanna hvort lyfið sé að meðaltali lengur en 620 mínútur í lifrinni. Hver fullyrðinganna er rétt?",
    ["σ² = 484", "μ = 620", "s = 22", "x̄ = 620"],
    "Staðalfrávikið 22 er þekkt stiki þýðisins (σ), svo σ² = 22² = 484. 620 er gildið í núlltilgátunni, ekki þekkt μ (fyrirlestradæmi, kennsluvika 9, spurning 4).");
  M("ttest", "Halli mældi leka í fimm tjöldum, fyrst án efnis og svo eftir að efni var spreyjað á hvert tjald. Gera má ráð fyrir normaldreifingu. Hvaða tilgátupróf á við og hvert er höfnunarsvæðið í tvíhliða prófi (α = 0.05)?",
    ["Parað t-próf; hafna H₀ ef t &lt; −2.776 eða t &gt; 2.776", "Parað t-próf; hafna H₀ ef t &lt; −2.306 eða t &gt; 2.306", "Óparað t-próf; hafna H₀ ef t &lt; −2.306 eða t &gt; 2.306", "Parað t-próf; hafna H₀ ef z &lt; −1.96 eða z &gt; 1.96"],
    "Sama tjaldið er mælt tvisvar, svo mælingarnar eru paraðar. Frígráður eru n − 1 = 4 og t<sub>0.975, 4</sub> = 2.776. 2.306 er t<sub>0.975, 8</sub>, sem ætti við óparað próf (fyrirlestradæmi, kennsluvika 9, spurning 9).");
  M("ttest", "Blóðþrýstingur er mældur hjá 50 þátttakendum með háþrýsting í byrjun rannsóknar og aftur eftir að 6 mánuðir hafa liðið frá því að þeir byrjuðu á nýju blóðþrýstingslækkandi lyfi. Hvernig tölfræðipróf ætti að framkvæma?",
    ["Parað t-próf", "Óparað t-próf", "Normalnálgun á hlutfall", "Poisson-nálgun"],
    "Hver þátttakandi er mældur tvisvar, svo mælingarnar eru háðar (lokapróf 2025, spurning 12).");
  M("ttest", "Lyfjafræðingar skiptu 20 einstaklingum handahófskennt í tvo hópa; annar fékk svefnlyf 1 og hinn svefnlyf 2, og svefnlengd var mæld. Kanna á hvort munur sé á meðalsvefnlengd eftir lyfjum. Hvaða próf á við?",
    ["Óparað t-próf (tvö óháð úrtök)", "Parað t-próf, því hóparnir eru jafnstórir", "Kí-kvaðrat próf", "Eins úrtaks t-próf á mismuninn"],
    "Ólíkir einstaklingar eru í hópunum, svo úrtökin eru óháð. Pörun á aðeins við þegar sami einstaklingur (eða par) er mældur tvisvar (fyrirlestradæmi, kennsluvika 10, dæmi 1).");
  M("ttest", "Nú höfum við áhuga á hvort það að hafa sykursýki hafi áhrif á systólískan blóðþrýsting. Fyrst er dreifnin athuguð með <code>var.test()</code> og fæst p = 2.8·10⁻⁷. Hvort t-prófið ætti að nota og af hverju?",
    ["<code>var.equal = FALSE</code> (Welch), því dreifnin í hópunum er marktækt ólík", "<code>var.equal = TRUE</code>, því p-gildið er lítið", "<code>var.equal = TRUE</code>, því úrtakið er stórt", "Parað t-próf, því dreifnin er ólík"],
    "H₀ í <code>var.test</code> er að dreifnin sé jöfn. Henni er hafnað, svo vegin dreifni á ekki við (lokapróf 2025, dæmi 2).");
  M("tilgatur", "Birna ætlar að kanna hvort meðalhæð karlkyns og kvenkyns antilópa sé ólík. Gera má ráð fyrir normaldreifingu með þekkta dreifni í báðum þýðum. Prófstærðin reyndist −1.75. Hvert er p-gildið?",
    ["0.08", "0.04", "0.96", "Ekki er hægt að finna það, því prófstærðin fylgir ekki staðlaðri normaldreifingu"],
    "Dreifnin er þekkt, svo prófstærðin fylgir N(0, 1). Tvíhliða: p = 2·Φ(−1.75) = 0.080 (fyrirlestradæmi, kennsluvika 9, spurning 6).");

  // Fyrirlestradæmi, kennsluvika 9, spurning 3 (Lalli lyfjafræðingur) og 6 (Birna)
  B.G.push(function tilgZp() {
    var z = rnd(110, 240) / 100 * (Math.random() < 0.3 ? -1 : 1), einhlida = Math.random() < 0.5;
    var p = einhlida ? S.pnorm(z, 0, 1, false) : 2 * S.pnorm(-Math.abs(z));
    var txt = einhlida
      ? "Lalli lyfjafræðingur er að rannsaka hversu lengi virka efnið í lyfi mælist í lifrinni eftir inntöku. Gera má ráð fyrir að tíminn fylgi normaldreifingu með þekkt staðalfrávik. Lalli vill kanna með tilgátuprófi hvort lyfið sé að meðaltali <b>lengur</b> en 620 mínútur í lifrinni (H₁: μ &gt; 620). Hann reiknaði gildið á viðeigandi prófstærð og fékk " + z + "."
      : "Birna er að rannsaka meðalhæð karlkyns og kvenkyns antilópa. Gera má ráð fyrir að hæðin fylgi normaldreifingu með þekkta dreifni í báðum þýðum. Hún kannar með viðeigandi tilgátuprófi hvort meðalhæðin sé <b>frábrugðin</b> á milli kynja. Gildið á prófstærðinni reyndist " + z + ".";
    return { topic: "tilgatur", title: "p-gildi úr z-prófi", unit: "", tol: 0.003, absTol: 0.0006, answer: p,
      text: "<p>" + txt + "</p><p>Hvert er p-gildi tilgátuprófsins?</p>",
      sol: "<p>Þar sem staðalfrávikið er þekkt fylgir prófstærðin staðlaðri normaldreifingu undir H₀. " + (einhlida ? "Einhliða próf (H₁: μ &gt; 620): p = P(Z &gt; " + z + ") = " + f(p) + "." : "Tvíhliða próf: p = 2·P(Z &gt; |" + z + "|) = " + f(p) + ".") + "</p><pre class=\"rcode\">" + (einhlida ? "pnorm(" + z + ", lower.tail = FALSE)" : "2 * pnorm(-abs(" + z + "))") + "</pre>" };
  });
  // Fyrirlestradæmi, kennsluvika 9, spurning 8 (Halli og tjöldin) og kennsluvika 10, dæmi 2 (megrunarlyf)
  B.G.push(function ttestParadGogn() {
    var c = pick([
      { t: "Halli fann rannsókn þar sem leki í {n} tjöldum var mældur, fyrst án efnisins og svo eftir að efnið var spreyjað á ysta lag hvers tjalds. Háar tölur þýða mikinn leka.", a: "Leki án", b: "Leki með", x: "x", y: "y", lo: 60, hi: 95, eff: [-15, 5], dec: 1, q: "hvort efnið hafi áhrif á leka" },
      { t: "Hópur næringarfræðinga mældi þyngd {n} fullvaxta karlmanna áður en inntaka megrunarlyfs hófst og aftur eftir að inntöku lauk.", a: "Fyrir (kg)", b: "Eftir (kg)", x: "fyrir", y: "eftir", lo: 85, hi: 112, eff: [-5, 1], dec: 0, q: "hvort megrunarlyfið hafi áhrif á þyngd" },
      { t: "Hjartsláttur {n} einstaklinga var mældur í hvíld og aftur eftir æfingu.", a: "Fyrir", b: "Eftir", x: "fyrir", y: "eftir", lo: 55, hi: 70, eff: [4, 22], dec: 0, q: "hvort æfingin hafi áhrif á hjartslátt" }
    ]);
    var n = rnd(5, 8), xs = [], ys = [];
    for (var i = 0; i < n; i++) {
      var a = rnd(c.lo, c.hi), b = a + rnd(c.eff[0], c.eff[1]);
      if (c.dec) { a = a / 10; b = Math.round(b) / 10; }
      xs.push(a); ys.push(b);
    }
    var d = xs.map(function (v, j) { return v - ys[j]; }), md = d.reduce(function (u, v) { return u + v; }, 0) / n;
    var sd = Math.sqrt(d.reduce(function (u, v) { return u + (v - md) * (v - md); }, 0) / (n - 1));
    if (!(sd > 0)) { ys[0] += c.dec ? 0.3 : 2; return ttestParadGogn(); }
    var t = md / (sd / Math.sqrt(n));
    var R = "&gt; " + c.x + " &lt;- c(" + xs.join(", ") + ")\n&gt; " + c.y + " &lt;- c(" + ys.join(", ") + ")\n&gt; d &lt;- " + c.x + " - " + c.y + "\n&gt; mean(d)\n[1] " + f(md, 4) + "\n&gt; sd(d)\n[1] " + f(sd, 4);
    return { topic: "ttest", title: "Parað t-próf úr gögnum", unit: "", tol: 0.003, absTol: 0.01, answer: t,
      text: "<p>" + c.t.replace("{n}", n) + " Gera má ráð fyrir normaldreifingu. Kanna á með viðeigandi tvíhliða tilgátuprófi " + c.q + ".</p><pre class=\"rcode\">" + R + "</pre><p>Hvert er gildið á prófstærðinni?</p>",
      sol: "<p>Sömu einingar eru mældar tvisvar, svo notað er parað t-próf á mismuninn d. H₀: μ<sub>d</sub> = 0, H₁: μ<sub>d</sub> ≠ 0. Prófstærðin er t = d̄/(s<sub>d</sub>/√n) = " + f(md, 4) + "/(" + f(sd, 4) + "/√" + n + ") = " + f(t, 3) + " með " + (n - 1) + " frígráðum. Höfnunarsvæðið er |t| &gt; t<sub>0.975, " + (n - 1) + "</sub> = " + f(S.qt(0.975, n - 1), 3) + ".</p><pre class=\"rcode\">t.test(" + c.x + ", " + c.y + ", paired = TRUE)</pre>" };
  });
  // Fyrirlestradæmi, kennsluvika 10, dæmi 1 (svefnlyfin)
  B.G.push(function ttestSvefnlyf() {
    var n = 10, m1 = rnd(78, 90) / 10, m2 = rnd(66, 78) / 10, s1 = rnd(80, 115) / 100, s2 = rnd(75, 110) / 100;
    var sp = Math.sqrt(((n - 1) * s1 * s1 + (n - 1) * s2 * s2) / (2 * n - 2)), t = (m1 - m2) / (sp * Math.sqrt(2 / n));
    return { topic: "ttest", title: "Óparað t-próf: svefnlyfin", unit: "", tol: 0.003, absTol: 0.01, answer: t,
      text: "<p>Hópur lyfjafræðinga rannsakaði tvö svefnlyf. 20 einstaklingum var skipt handahófskennt í tvo hópa; annar hópurinn fékk svefnlyf 1 og hinn svefnlyf 2, og mælt var hversu lengi einstaklingarnir sváfu (klst.).</p><pre class=\"rcode\">&gt; mean(lyf1)\n[1] " + m1 + "\n&gt; mean(lyf2)\n[1] " + m2 + "\n&gt; sd(lyf1)\n[1] " + f(s1, 2) + "\n&gt; sd(lyf2)\n[1] " + f(s2, 2) + "</pre><p>Gera má ráð fyrir normaldreifingu og sömu dreifni í hópunum (þumalputtareglan). Kannið með viðeigandi tilgátuprófi hvort munur sé á meðalsvefnlengd. Hvert er gildið á prófstærðinni?</p>",
      sol: "<p>Tvö óháð úrtök með sömu dreifni: vegin dreifni s<sub>p</sub>² = ((n₁ − 1)s₁² + (n₂ − 1)s₂²)/(n₁ + n₂ − 2) = " + f(sp * sp) + ", s<sub>p</sub> = " + f(sp) + ". t = (x̄₁ − x̄₂)/(s<sub>p</sub>√(1/n₁ + 1/n₂)) = " + f(t, 3) + " með 18 frígráðum.</p><pre class=\"rcode\">t.test(lyf1, lyf2, var.equal = TRUE)</pre>" };
  });
})();

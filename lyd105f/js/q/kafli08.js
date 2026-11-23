/* q/kafli08.js – spurningar fyrir kafla 8: Fervikagreining (efni: anova).
 * Byggðar á verkefnum áfangans: lokapróf 2025 (dæmi 3, kólesteról eftir aldurshópum),
 * fyrirlestradæmi kennsluviku 11 (geislun á þremur svæðum, fervikagreiningartafla) og
 * plasma-gögnunum. Orðalag fylgir prófunum („Hvert ætti F-gildið í töflunni að vera?“ o.s.frv.). */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var T = "anova";
  var FA = '<pre class="rcode">&gt; tapply(fr$TOTCHOL, fr$aldursflokkur, mean, na.rm = TRUE)\n (30,40]  (40,50]  (50,60]  (60,70]\n215.6855 232.8671 249.3015 245.8277\n&gt; summary(aov(TOTCHOL ~ aldursflokkur, data = fr))\n                Df  Sum Sq Mean Sq F value Pr(&gt;F)\naldursflokkur    3  622674  207558     112 &lt;2e-16 ***\nResiduals     4378 8111815    1853\n52 observations deleted due to missingness</pre>';
  var PA = '<pre class="rcode">&gt; tapply(plasma$betaplasma, plasma$smokstat, mean)\nCurrent Smoker         Former          Never\n      121.3256       193.4696       206.0510\n&gt; summary(aov(betaplasma ~ smokstat, data = plasma))\n             Df   Sum Sq Mean Sq F value Pr(&gt;F)\nsmokstat      2   244625  122312   3.715 0.0254 *\nResiduals   312 10271014   32920</pre>';
  // Fyrirlestradæmi kennsluviku 11, dæmi 2: geislun í kjarnorkuveri, 10 mælingar á hverju af þremur svæðum
  var GE = '<table class="tt"><tr><th></th><th>Fervikasumma</th><th>Frígráður</th><th>Meðalfervikasumma</th></tr>' +
    '<tr><th>Milli hópa (svæða)</th><td>3906.9</td><td>xx</td><td>xx</td></tr>' +
    '<tr><th>Innan hópa (svæða)</th><td>xx</td><td>xx</td><td>xx</td></tr>' +
    '<tr><th>Heild</th><td>7829</td><td>xx</td><td></td></tr></table>';
  var GEI = "<p>Yfirvöld könnuðu magn geislunar í kjarnorkuveri. Tíu mælingar voru teknar á hverju af þremur svæðum og vísindamennirnir byrjuðu að fylla út fervikagreiningartöfluna:</p>" + GE;

  // ---------- Lokapróf 2025, dæmi 3: kólesteról eftir aldurshópum ----------
  M(T, FA + "Hver er núlltilgátan og gagntilgátan?",
    ["H₀: meðalkólesteról er það sama í öllum aldurshópum; H₁: a.m.k. eitt meðaltal er ólíkt", "H₀: meðalkólesteról er það sama í öllum aldurshópum; H₁: öll meðaltölin eru ólík", "H₀: a.m.k. eitt meðaltal er ólíkt; H₁: öll meðaltölin eru jöfn", "H₀: dreifni kólesteróls er sú sama í öllum aldurshópum; H₁: hún er ólík"],
    "H₀: μ<sub>30–40</sub> = μ<sub>40–50</sub> = μ<sub>50–60</sub> = μ<sub>60–70</sub>. Gagntilgátan er að a.m.k. eitt meðaltal sé frábrugðið hinum, ekki að öll séu ólík.");
  M(T, FA + "Hvaða ályktun er dregin?",
    ["Meðalkólesteról er ólíkt eftir aldurshópum (p &lt; 2·10⁻¹⁶)", "Öll meðaltölin eru marktækt ólík innbyrðis", "Kólesteról hækkar jafnt og þétt með aldri", "Ekki er marktækur munur á aldurshópunum"],
    "F = 112 og p &lt; 2·10⁻¹⁶, svo við höfnum H₀. ANOVA segir ekki hvaða hópar eru ólíkir. Meðaltalið er reyndar hæst í 50–60 ára hópnum, ekki þeim elsta.");
  M(T, FA + "Hve margir einstaklingar voru í greiningunni?",
    ["4382", "4434", "4378", "4381"],
    "Frígráður leifa eru N − k = 4378 og k = 4, svo N = 4382. 52 voru felldir út vegna vöntunar (4434 − 52).");
  M(T, FA + "Útskýrið á hverju ANOVA byggir. Af hverju má nota F til að sýna fram á mun þegar hóparnir eru ólíkir?",
    ["F ber saman breytileika milli hópa og innan hópa; ef meðaltölin eru ólík verður breytileikinn milli hópa mikill og F stórt", "F ber saman meðaltöl hópanna beint; ef þau eru ólík verður F neikvætt", "F ber saman miðgildi hópanna; ef þau eru ólík verður F nálægt 1", "F er hlutfall fervikasumma; það er alltaf stórt þegar hóparnir eru margir"],
    "F = MS<sub>milli</sub>/MS<sub>innan</sub>. Ef H₀ er sönn meta bæði sömu dreifnina σ² og F er nálægt 1.");
  M(T, FA + "Hvað er <code>Mean Sq</code> fyrir Residuals (1853)?",
    ["Mat á dreifninni innan hópanna", "Mat á dreifninni milli hópanna", "Staðalfrávikið innan hópanna", "Meðalkólesteról allra í gögnunum"],
    "MS<sub>leifa</sub> = Sum Sq/Df = 8111815/4378 er vegin dreifni allra hópanna. Staðalfrávikið innan hópa er √1853 ≈ 43 mg/dL.");
  M(T, "Kassarit sýnir kólesteról eftir fjórum aldurshópum (um 1000 í hverjum). Dreifingarnar eru nokkuð samhverfar og breiddin svipuð. Teljið þið að það sé viðeigandi að nota ANOVA?",
    ["Já: mælingar eru óháðar, dreifni er svipuð í hópunum og hóparnir eru stórir", "Nei: ANOVA má aðeins nota ef hóparnir eru tveir", "Nei: ANOVA krefst þess að allir hópar séu nákvæmlega jafnstórir", "Já: ANOVA hefur engar forsendur"],
    "Forsendur: óháðar mælingar, normaldreifðar leifar og jöfn dreifni milli hópa. Með stóra hópa skiptir normaldreifingin minna máli.");
  M(T, "R² í ANOVA (SS<sub>hópa</sub>/SS<sub>alls</sub>) fyrir kólesteról eftir aldri er 622674/(622674 + 8111815). Hvað er það um það bil?",
    ["0.071", "0.077", "0.929", "0.267"],
    "622674/8734489 = 0.071: aldursflokkur skýrir um 7% breytileikans, þótt munurinn sé mjög marktækur. 0.077 fæst ef deilt er með SS<sub>leifa</sub> í stað SS<sub>alls</sub>.");

  // ---------- Fyrirlestradæmi viku 11: geislun ----------
  M(T, GEI + "Hverjar eru frígráðurnar milli hópa, innan hópa og alls?",
    ["2, 27 og 29", "3, 27 og 30", "2, 30 og 32", "3, 26 og 29"],
    "Milli hópa: k − 1 = 2. Innan hópa: N − k = 30 − 3 = 27. Alls: N − 1 = 29.");
  M(T, GEI + "Hver er fervikasumman innan hópa?",
    ["3922.1", "11735.9", "3906.9", "1953.45"],
    "Fervikasummurnar leggjast saman: SS<sub>innan</sub> = SS<sub>alls</sub> − SS<sub>milli</sub> = 7829 − 3906.9 = 3922.1.");
  M(T, GEI + "Klárið töfluna. Hvert ætti F-gildið að vera?",
    ["13.45", "1.00", "0.50", "26.89"],
    "MS<sub>milli</sub> = 3906.9/2 = 1953.45 og MS<sub>innan</sub> = 3922.1/27 = 145.26. F = 1953.45/145.26 = 13.45. 26.89 fæst ef ekki er deilt með frígráðunum 2.");
  M(T, GEI + "Kannið hvort munur sé á meðalmagni geislunar á svæðunum þremur (α = 0.05). Hvaða ályktun er dregin?",
    ["Höfnum H₀: meðalgeislun er ólík á a.m.k. einu svæðanna (p ≈ 0.0001)", "Höfnum ekki H₀: enginn munur er á svæðunum", "Höfnum H₀: geislun er ólík á öllum þremur svæðunum", "Ekki er hægt að álykta, því töfluna vantar"],
    "F = 13.45 með 2 og 27 frígráður; gagnrýnið gildi er F<sub>0.95; 2, 27</sub> = 3.35 og p = <code>pf(13.45, 2, 27, lower.tail = FALSE)</code> ≈ 8.9·10⁻⁵.");

  // ---------- Plasma ----------
  M(T, PA + "Sýnið hvernig F-gildið 3.715 fæst úr töflunni.",
    ["122312/32920", "244625/10271014", "2/312", "32920/122312"],
    "F = MS<sub>hópa</sub>/MS<sub>leifa</sub> = 122312/32920 = 3.715.");
  M(T, PA + "Hvaða ályktun er dregin við α = 0.05?",
    ["Meðalbetakarótín í blóði er ólíkt eftir reykingastöðu (p = 0.025)", "Reykingar valda lægra betakarótíni í blóði", "Enginn munur er á hópunum", "Allir þrír hóparnir eru ólíkir innbyrðis"],
    "p = 0.0254 &lt; 0.05. Rannsóknin er athugunarrannsókn, svo ekki má álykta um orsakasamband.");
  M(T, PA + "Betaplasma er mjög hægri-skekkt. Hvaða forsenda ANOVA er helst í hættu?",
    ["Normaldreifðar leifar", "Óháðar mælingar", "Að hóparnir séu þrír", "Að svarbreytan sé talnabreyta"],
    "Lausnir: log-umbreyting eða stikalaust próf (Kruskal–Wallis).");

  // ---------- Hugtök ----------
  M(T, "Af hverju er ekki nóg að gera mörg t-próf (öll pör) í stað fervikagreiningar?",
    ["Líkurnar á villu af gerð I aukast með fjölda prófa", "t-próf virka ekki á fleiri en tvo hópa", "Fervikagreining hefur alltaf meiri styrk", "t-próf gefa alltaf sömu niðurstöðu"],
    "Með 4 hópum eru 6 pör. Við α = 0.05 í hverju prófi verða líkur á a.m.k. einni falskri marktekt um 26%.");
  M(T, "Hvert er F-gildið að jafnaði ef núlltilgátan er sönn?",
    ["Nálægt 1", "Nálægt 0", "Mjög stórt", "Neikvætt"],
    "Þá meta bæði MS<sub>milli</sub> og MS<sub>innan</sub> sömu dreifnina σ².");
  M(T, "Í fervikagreiningartöflu með k hópum og N mælingum, hvað af eftirfarandi gildir?",
    ["SS<sub>alls</sub> = SS<sub>milli</sub> + SS<sub>innan</sub>", "MS<sub>alls</sub> = MS<sub>milli</sub> + MS<sub>innan</sub>", "F = SS<sub>milli</sub>/SS<sub>innan</sub>", "df<sub>innan</sub> = k − 1"],
    "Fervikasummurnar leggjast saman, og frígráðurnar líka (k − 1 + N − k = N − 1), en meðalfervikasummurnar ekki.");
  M(T, "Hvaða R-skipun framkvæmir fervikagreiningu á kólesteróli eftir aldurshópum?",
    ["<code>summary(aov(TOTCHOL ~ aldursflokkur, data = fr))</code>", "<code>t.test(TOTCHOL ~ aldursflokkur)</code>", "<code>chisq.test(TOTCHOL, aldursflokkur)</code>", "<code>var.test(TOTCHOL ~ aldursflokkur)</code>"],
    "<code>aov</code> tekur formúlu svarbreyta ~ skýribreyta (flokkabreyta).");
  M(T, "Hvað gerir Tukey-próf (<code>TukeyHSD</code>) eftir fervikagreiningu?",
    ["Ber saman öll pör hópa og leiðréttir fyrir fjölda samanburða", "Prófar hvort dreifnin sé jöfn", "Reiknar F-gildið", "Umbreytir gögnunum"],
    "Það svarar spurningunni: <i>hvaða</i> hópar eru ólíkir?");
  M(T, "Fervikagreining með tveimur hópum jafngildir:",
    ["Óparaða t-prófinu með jafnri dreifni", "Pöruðu t-prófi", "Kí-kvaðrat prófi", "Welch-prófinu (ójöfn dreifni)"],
    "Með k = 2 er F = t² og p-gildin eru eins.");
  M(T, "Hvað segir lítið p-gildi í fervikagreiningu <b>ekki</b>?",
    ["Hvaða hópar eru ólíkir eða hve mikill munurinn er", "Að H₀ um jöfn meðaltöl sé ólíkleg", "Að breytileiki milli hópa sé mikill miðað við innan hópa", "Að F sé stórt"],
    "Til þess þarf eftiráprófanir og að skoða meðaltölin og öryggisbil.");
  M(T, "Í fervikagreiningu eru 5 hópar með 20 í hverjum. Hverjar eru frígráður F-prófsins?",
    ["4 og 95", "5 og 100", "4 og 99", "5 og 95"],
    "k − 1 = 4 og N − k = 100 − 5 = 95.");
  M(T, "Hvað táknar fervikasumman milli hópa (SS<sub>milli</sub>)?",
    ["Σ n<sub>i</sub>(x̄<sub>i</sub> − x̄)²: frávik hópmeðaltala frá heildarmeðaltalinu", "Σ(x − x̄<sub>i</sub>)²: frávik mælinga frá meðaltali síns hóps", "Dreifni hvers hóps fyrir sig", "Fjöldi hópa sinnum heildarmeðaltalið"],
    "Því fjær sem hópmeðaltölin eru hvert frá öðru, því stærri er SS<sub>milli</sub>.");
  M(T, "Ef F-gildi er 0.8 með 3 og 120 frígráður, hvað má segja?",
    ["Ekki er marktækur munur á hópunum (p er stórt)", "Mjög marktækur munur er á hópunum", "Prófið er ógilt, því F á að vera stærra en 1", "Hóparnir eru nákvæmlega jafnir"],
    "F &lt; 1 þýðir að breytileiki milli hópa er minni en vænta mætti af tilviljun; p ≈ 0.5.");
  M(T, "Hvaða skilyrði á <b>svarbreytan</b> í fervikagreiningu að uppfylla?",
    ["Hún er talnabreyta", "Hún er flokkabreyta", "Hún er tvíkosta", "Hún er tími til atburðar"],
    "Svarbreytan er talnabreyta og skýribreytan flokkabreyta (hóparnir). Ef svarbreytan er flokkabreyta á kí-kvaðrat próf frekar við.");

  // ---------- Reiknidæmi ----------
  // Fyrirlestradæmi viku 11, dæmi 2: klárið fervikagreiningartöfluna (geislun á þremur svæðum)
  B.G.push(function aovGeislunF() {
    var k = 3, n = 10, N = k * n, ssb = rnd(15000, 45000) / 10, ssw = rnd(25000, 60000) / 10, sst = Math.round((ssb + ssw) * 10) / 10;
    ssw = Math.round((sst - ssb) * 10) / 10;
    var msb = ssb / (k - 1), msw = ssw / (N - k), F = msb / msw;
    return { topic: T, title: "Klárið fervikagreiningartöfluna", unit: "", tol: 0.003, answer: F,
      text: "<p>Tíu mælingar á geislun voru teknar á hverju af þremur svæðum í kjarnorkuveri. Fervikasumman milli hópa (svæða) er " + f(ssb, 1) + " og heildarfervikasumman " + f(sst, 1) + ". Klárið að fylla út í fervikagreiningartöfluna. Hvert er F-gildið?</p>",
      sol: "<table class=\"tt\"><tr><th></th><th>Fervikasumma</th><th>Frígráður</th><th>Meðalfervikasumma</th></tr>" +
        "<tr><th>Milli hópa</th><td>" + f(ssb, 1) + "</td><td>2</td><td>" + f(msb, 2) + "</td></tr>" +
        "<tr><th>Innan hópa</th><td>" + f(ssw, 1) + "</td><td>27</td><td>" + f(msw, 3) + "</td></tr>" +
        "<tr><th>Heild</th><td>" + f(sst, 1) + "</td><td>29</td><td></td></tr></table>" +
        "<p>SS<sub>innan</sub> = " + f(sst, 1) + " − " + f(ssb, 1) + " = " + f(ssw, 1) + ". F = " + f(msb, 2) + "/" + f(msw, 3) + " = " + f(F, 3) + ", og p = " + (S.pf(F, 2, 27, false) < 0.0001 ? "&lt; 0.0001" : f(S.pf(F, 2, 27, false))) + ".</p>" +
        "<pre class=\"rcode\">(" + f(ssb, 1) + " / 2) / ((" + f(sst, 1) + " - " + f(ssb, 1) + ") / 27)\npf(" + f(F, 3) + ", 2, 27, lower.tail = FALSE)</pre>" };
  });
  B.G.push(function aovGeislunMSW() {
    var k = rnd(3, 4), n = rnd(8, 12), N = k * n, ssb = rnd(15000, 45000) / 10, ssw = rnd(25000, 60000) / 10, sst = Math.round((ssb + ssw) * 10) / 10;
    ssw = Math.round((sst - ssb) * 10) / 10;
    var msw = ssw / (N - k);
    return { topic: T, title: "Meðalfervikasumma innan hópa", unit: "", tol: 0.003, answer: msw,
      text: "<p>Í fervikagreiningu eru " + k + " hópar með " + n + " mælingum í hverjum. Fervikasumman milli hópa er " + f(ssb, 1) + " og heildarfervikasumman " + f(sst, 1) + ". Hver er meðalfervikasumman innan hópa?</p>",
      sol: "<p>SS<sub>innan</sub> = SS<sub>alls</sub> − SS<sub>milli</sub> = " + f(sst, 1) + " − " + f(ssb, 1) + " = " + f(ssw, 1) + ". Frígráður innan hópa: N − k = " + N + " − " + k + " = " + (N - k) + ". MS<sub>innan</sub> = " + f(ssw, 1) + "/" + (N - k) + " = " + f(msw, 3) + ".</p><pre class=\"rcode\">(" + f(sst, 1) + " - " + f(ssb, 1) + ") / (" + N + " - " + k + ")</pre>" };
  });
  B.G.push(function aovP() {
    var k = rnd(3, 5), N = rnd(40, 200), F = rnd(150, 600) / 100;
    var p = S.pf(F, k - 1, N - k, false);
    return { topic: T, title: "p-gildi úr F", unit: "", tol: 0.01, absTol: 0.0005, answer: p,
      text: "<p>Fervikagreining með " + k + " hópum og " + N + " mælingum gefur F = " + F + ". Hvert er p-gildið?</p>",
      sol: "<p>Undir H₀ fylgir F F-dreifingu með " + (k - 1) + " og " + (N - k) + " frígráðum. p = P(F &gt; " + F + ") = " + f(p) + ".</p><pre class=\"rcode\">pf(" + F + ", " + (k - 1) + ", " + (N - k) + ", lower.tail = FALSE)</pre>" };
  });
  B.G.push(function aovSSg() {
    var n = rnd(8, 20), ms = [rnd(200, 240), rnd(200, 240), rnd(200, 260)];
    var gm = (ms[0] + ms[1] + ms[2]) / 3, ss = n * ms.reduce(function (s, m) { return s + (m - gm) * (m - gm); }, 0);
    if (ss === 0) { ms[2] += 7; gm = (ms[0] + ms[1] + ms[2]) / 3; ss = n * ms.reduce(function (s, m) { return s + (m - gm) * (m - gm); }, 0); }
    return { topic: T, title: "Fervikasumma milli hópa", unit: "", tol: 0.002, answer: ss,
      text: "<p>Þrír jafnstórir hópar með " + n + " í hverjum hafa meðalkólesteról " + ms.join(", ") + " mg/dL. Reiknið fervikasummuna milli hópa, SS<sub>milli</sub> = Σ n<sub>i</sub>(x̄<sub>i</sub> − x̄)².</p>",
      sol: "<p>Heildarmeðaltal x̄ = " + f(gm, 3) + ". SS<sub>milli</sub> = " + n + "·[" + ms.map(function (m) { return "(" + m + " − " + f(gm, 3) + ")²"; }).join(" + ") + "] = " + f(ss, 2) + ".</p><pre class=\"rcode\">m &lt;- c(" + ms.join(", ") + ")\n" + n + " * sum((m - mean(m))^2)</pre>" };
  });
  B.G.push(function aovN() {
    var k = rnd(3, 6), df2 = rnd(40, 500);
    return { topic: T, title: "Fjöldi mælinga úr frígráðum", unit: "", tol: 0, absTol: 0.01, answer: df2 + k,
      text: "<p>Í fervikagreiningartöflu eru frígráður milli hópa " + (k - 1) + " og frígráður innan hópa (Residuals) " + df2 + ". Hve margar mælingar voru í greiningunni?</p>",
      sol: "<p>df<sub>milli</sub> = k − 1 = " + (k - 1) + ", svo k = " + k + ". df<sub>innan</sub> = N − k, svo N = " + df2 + " + " + k + " = " + (df2 + k) + ".</p>" };
  });
})();

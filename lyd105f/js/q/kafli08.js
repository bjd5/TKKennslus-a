/* q/kafli08.js – aukaspurningar fyrir kafla 8: Fervikagreining (efni: anova). */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var T = "anova";
  var FA = '<pre class="rcode">&gt; tapply(fr$TOTCHOL, fr$aldursflokkur, mean, na.rm = TRUE)\n (30,40]  (40,50]  (50,60]  (60,70]\n215.6855 232.8671 249.3015 245.8277\n&gt; summary(aov(TOTCHOL ~ aldursflokkur, data = fr))\n                Df  Sum Sq Mean Sq F value Pr(&gt;F)\naldursflokkur    3  622674  207558     112 &lt;2e-16 ***\nResiduals     4378 8111815    1853\n52 observations deleted due to missingness</pre>';
  var PA = '<pre class="rcode">&gt; tapply(plasma$betaplasma, plasma$smokstat, mean)\nCurrent Smoker         Former          Never\n      121.3256       193.4696       206.0510\n&gt; summary(aov(betaplasma ~ smokstat, data = plasma))\n             Df   Sum Sq Mean Sq F value Pr(&gt;F)\nsmokstat      2   244625  122312   3.715 0.0254 *\nResiduals   312 10271014   32920</pre>';

  M(T, FA + "Hve margir voru í greiningunni?",
    ["4382 (= 4378 + 3 + 1)", "4434", "4378", "52"],
    "Heildarfrígráður eru N − 1 = 3 + 4378 = 4381, svo N = 4382. 52 voru felldir út vegna vöntunar.");
  M(T, FA + "Hvað er <code>Mean Sq</code> fyrir Residuals (1853)?",
    ["Mat á dreifni innan hópa: Sum Sq/Df = 8111815/4378", "Meðaltal kólesteróls", "Dreifni milli hópa", "F-gildið"],
    "MS<sub>leifa</sub> er vegin dreifni allra hópanna; √1853 ≈ 43 mg/dL er staðalfrávikið innan hópa.");
  M(T, FA + "Hvaða ályktun er rétt?",
    ["Meðalkólesteról er marktækt ólíkt milli aldurshópa (p &lt; 2·10⁻¹⁶)", "Öll meðaltölin eru marktækt ólík hvert öðru", "Elsti hópurinn hefur hæsta kólesterólið", "Ekki er marktækur munur"],
    "ANOVA segir að a.m.k. eitt meðaltal sé ólíkt. Hæsta meðaltalið er í hópnum 50–60 ára.");
  M(T, PA + "Hvernig fæst F = 3.715?",
    ["122312/32920", "244625/10271014", "2/312", "32920/122312"],
    "F = MS<sub>hópa</sub>/MS<sub>leifa</sub>.");
  M(T, PA + "Hvaða ályktun er dregin við α = 0.05?",
    ["Meðal betakarótín í blóði er ólíkt eftir reykingastöðu (p = 0.025)", "Reykingar valda lægra betakarótíni", "Enginn munur er á hópunum", "Allir þrír hóparnir eru ólíkir innbyrðis"],
    "p = 0.0254 &lt; 0.05. Rannsóknin er athugunarrannsókn, svo ekki má álykta um orsök.");
  M(T, PA + "Betaplasma er mjög hægri-skekkt. Hvaða forsenda ANOVA er helst í hættu?",
    ["Normaldreifðar leifar (og hugsanlega jöfn dreifni)", "Óháðar mælingar", "Að hóparnir séu þrír", "Að svarbreytan sé talnabreyta"],
    "Lausnir: log-umbreyting eða stikalaust próf (Kruskal–Wallis).");
  M(T, "Af hverju er ekki nóg að gera mörg t-próf (öll pör) í stað ANOVA?",
    ["Líkurnar á villu af gerð I aukast með fjölda prófa", "t-próf virka ekki á fleiri en tvo hópa", "ANOVA er alltaf sterkara", "t-próf gefa sömu niðurstöðu"],
    "Með 4 hópum eru 6 pör; við α = 0.05 hvert verða heildarlíkur á a.m.k. einni falskri marktekt um 26%.");
  M(T, "Hvert er F-gildið að jafnaði ef H₀ er sönn?",
    ["Nálægt 1", "Nálægt 0", "Mjög stórt", "Neikvætt"],
    "Þá meta bæði MS<sub>hópa</sub> og MS<sub>leifa</sub> sömu dreifnina σ².");
  M(T, "Í ANOVA-töflu með k hópum og N mælingum, hvað er rétt?",
    ["SS<sub>alls</sub> = SS<sub>hópa</sub> + SS<sub>leifa</sub>", "MS<sub>alls</sub> = MS<sub>hópa</sub> + MS<sub>leifa</sub>", "F = SS<sub>hópa</sub>/SS<sub>leifa</sub>", "df<sub>leifa</sub> = k − 1"],
    "Fervikasummurnar (sums of squares) leggjast saman, en ekki meðalfervikin.");
  M(T, "Hvaða graf er best til að meta forsendur ANOVA áður en prófið er gert?",
    ["Kassarit eftir hópum (dreifing, útlagar, jöfn dreifni)", "Kökurit", "Kaplan–Meier graf", "Stöplarit yfir fjölda"],
    "Kassaritin sýna hvort breytileikinn sé svipaður og hvort skekkja eða útlagar séu til staðar.");
  M(T, "Hvaða R-skipun framkvæmir fervikagreiningu á kólesteróli eftir aldurshópum?",
    ["<code>summary(aov(TOTCHOL ~ aldursflokkur, data = fr))</code>", "<code>t.test(TOTCHOL ~ aldursflokkur)</code>", "<code>chisq.test(TOTCHOL, aldursflokkur)</code>", "<code>var.test(TOTCHOL ~ aldursflokkur)</code>"],
    "<code>aov</code> tekur formúlu svarbreyta ~ flokkabreyta.");
  M(T, "Hvað gerir Tukey-próf (<code>TukeyHSD</code>) eftir ANOVA?",
    ["Ber saman öll pör hópa og leiðréttir fyrir fjölda samanburða", "Prófar jafna dreifni", "Reiknar F-gildið", "Umbreytir gögnunum"],
    "Það svarar spurningunni: <i>hvaða</i> hópar eru ólíkir?");
  M(T, "ANOVA með tveimur hópum jafngildir:",
    ["Óparaða t-prófinu með jafnri dreifni (F = t²)", "Pöruðu t-prófi", "Kí-kvaðrat prófi", "Welch-prófi"],
    "Með k = 2 er F = t² og p-gildin eru eins.");
  M(T, "Hvað er stikalaust jafngildi ANOVA fyrir mjög skekkt gögn?",
    ["Kruskal–Wallis próf", "Parað t-próf", "Fisher-próf", "Log-rank próf"],
    "<code>kruskal.test(y ~ hopur)</code> byggir á röðum gagnanna.");
  M(T, "Hvað segir lítið p-gildi í ANOVA <b>ekki</b>?",
    ["Hvaða hópar eru ólíkir eða hve mikill munurinn er", "Að H₀ um jöfn meðaltöl sé ólíkleg", "Að breytileiki milli hópa sé mikill miðað við innan hópa", "Að F sé stórt"],
    "Til þess þarf eftiráprófanir og að skoða meðaltölin og öryggisbil.");
  M(T, "Í ANOVA eru 5 hópar með 20 í hverjum. Hverjar eru frígráður F-prófsins?",
    ["4 og 95", "5 og 100", "4 og 99", "5 og 95"],
    "k − 1 = 4 og N − k = 100 − 5 = 95.");
  M(T, "Hvað táknar fervikasumma hópa (SS<sub>hópa</sub>)?",
    ["Σ n<sub>i</sub>(x̄<sub>i</sub> − x̄)²: frávik hópmeðaltala frá heildarmeðaltalinu", "Σ(x − x̄<sub>i</sub>)²: frávik innan hópa", "Dreifni hvers hóps", "Fjöldi hópa"],
    "Því fjær sem hópmeðaltölin eru hvert frá öðru, því stærri er SS<sub>hópa</sub>.");
  M(T, "Ef F-gildi er 0.8 með 3 og 120 frígráður, hvað má segja?",
    ["Ekki er marktækur munur á hópunum (p er stórt)", "Mjög marktækur munur", "Prófið er ógilt", "Hóparnir eru nákvæmlega jafnir"],
    "F &lt; 1 þýðir að breytileiki milli hópa er minni en vænta mætti af tilviljun; p ≈ 0.5.");
  M(T, "Hvaða skilyrði á <b>svarbreytan</b> í ANOVA að uppfylla?",
    ["Hún er talnabreyta; skýribreytan er flokkabreyta", "Hún er flokkabreyta", "Hún er tvíkosta", "Hún er tími til atburðar"],
    "Ef svarbreytan er flokkabreyta á kí-kvaðrat próf frekar við.");
  M(T, "R² í ANOVA (SS<sub>hópa</sub>/SS<sub>alls</sub>) fyrir kólesteról eftir aldri er 622674/(622674 + 8111815). Hvað er það um það bil?",
    ["0.071: aldursflokkur skýrir um 7% breytileikans", "0.93", "0.25", "112"],
    "Mjög marktækt (F = 112) en skýrir lítinn hluta breytileikans.");
  M(T, "Í ANOVA er gert ráð fyrir jafnri dreifni. Hvaða próf gæti kannað það formlega?",
    ["Bartlett- eða Levene-próf", "Kí-kvaðrat próf", "Log-rank próf", "Parað t-próf"],
    "Í R: <code>bartlett.test(y ~ hopur)</code>. Þumalputtaregla: stærsta staðalfrávik er minna en tvöfalt það minnsta.");

  // ---------- Reiknidæmi ----------
  B.G.push(function aovMS() {
    var k = rnd(3, 5), N = rnd(60, 300), sse = rnd(10000, 60000);
    var ms = sse / (N - k);
    return { topic: T, title: "Meðalfervik leifa", unit: "", tol: 0.002, answer: ms,
      text: "<p>Í ANOVA með " + k + " hópum og samtals " + N + " mælingum er Sum Sq fyrir Residuals " + sse + ". Hvert er Mean Sq fyrir Residuals?</p>",
      sol: "<p>MS<sub>leifa</sub> = SS<sub>leifa</sub>/(N − k) = " + sse + "/" + (N - k) + " = " + f(ms, 3) + ".</p><pre class=\"rcode\">" + sse + " / (" + N + " - " + k + ")</pre>" };
  });
  B.G.push(function aovP() {
    var k = rnd(3, 5), N = rnd(40, 200), F = rnd(120, 600) / 100;
    var p = S.pf(F, k - 1, N - k, false);
    return { topic: T, title: "p-gildi úr F", unit: "", tol: 0.01, absTol: 0.0005, answer: p,
      text: "<p>ANOVA með " + k + " hópum og " + N + " mælingum gefur F = " + F + ". Hvert er p-gildið?</p>",
      sol: "<p>F fylgir F-dreifingu með " + (k - 1) + " og " + (N - k) + " frígráður undir H₀. p = P(F &gt; " + F + ") = " + f(p) + ".</p><pre class=\"rcode\">pf(" + F + ", " + (k - 1) + ", " + (N - k) + ", lower.tail = FALSE)</pre>" };
  });
  B.G.push(function aovSSg() {
    var n = rnd(8, 20), ms = [rnd(200, 240), rnd(200, 240), rnd(200, 260)];
    var gm = (ms[0] + ms[1] + ms[2]) / 3, ss = n * ms.reduce(function (s, m) { return s + (m - gm) * (m - gm); }, 0);
    return { topic: T, title: "Fervikasumma hópa", unit: "", tol: 0.002, answer: ss,
      text: "<p>Þrír jafnstórir hópar með " + n + " í hverjum hafa meðalkólesteról " + ms.join(", ") + " mg/dL. Reiknaðu SS<sub>hópa</sub> = Σ n<sub>i</sub>(x̄<sub>i</sub> − x̄)².</p>",
      sol: "<p>Heildarmeðaltal x̄ = " + f(gm, 3) + ". SS<sub>hópa</sub> = " + n + "·[" + ms.map(function (m) { return "(" + m + " − " + f(gm, 3) + ")²"; }).join(" + ") + "] = " + f(ss, 2) + ".</p><pre class=\"rcode\">m &lt;- c(" + ms.join(", ") + "); " + n + " * sum((m - mean(m))^2)</pre>" };
  });
  B.G.push(function aovN() {
    var k = rnd(3, 6), df2 = rnd(40, 500);
    return { topic: T, title: "Fjöldi mælinga úr frígráðum", unit: "", tol: 0, absTol: 0.01, answer: df2 + k,
      text: "<p>Í ANOVA-töflu eru frígráður hópa " + (k - 1) + " og frígráður leifa " + df2 + ". Hve margar mælingar voru í greiningunni?</p>",
      sol: "<p>df<sub>hópa</sub> = k − 1 = " + (k - 1) + " svo k = " + k + ". df<sub>leifa</sub> = N − k, svo N = " + df2 + " + " + k + " = " + (df2 + k) + ".</p>" };
  });
})();

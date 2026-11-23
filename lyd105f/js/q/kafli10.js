/* q/kafli10.js – spurningar fyrir kafla 10: Tvíkosta aðhvarf, næmi og sértæki (efni: tvikosta, naemi).
 * Byggðar á verkefnum áfangans: R sýnikóði um tvíkosta aðhvarfsgreiningu (reykingar og drykkja,
 * líkamsrækt), glærur um tvíkosta svarbreytur (áfengissýki og fitulifur), glærur um lýsistærðir
 * fyrir flokkunaraðferðir (næmi, sértæki, PPV, NPV), hlutaprófið (sykursýkisgögnin) og lokapróf 2025. */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var GLM = '<pre class="rcode">&gt; fit &lt;- glm(sykursyki ~ age + bmi, data = diabetes,\n+            family = "binomial")\n&gt; summary(fit)\n\nCoefficients:\n             Estimate Std. Error z value Pr(&gt;|z|)\n(Intercept) -6.631840   0.958939  -6.916 4.65e-12 ***\nage          0.055475   0.009859   5.627 1.83e-08 ***\nbmi          0.068679   0.022235   3.089  0.00201 **\n&gt; exp(coef(fit))\n(Intercept)         age         bmi\n0.001317736 1.057042969 1.071092205\n&gt; exp(confint.default(fit))\n                   2.5 %      97.5 %\n(Intercept) 0.0002011771 0.008631343\nage         1.0368139654 1.077666655\nbmi         1.0254163163 1.118802670</pre>';
  var PG = '<pre class="rcode">&gt; glm1 &lt;- glm(reykir == "ja" ~ likamsraekt, data = puls,\n+             family = "binomial")\n&gt; summary(glm1)\n\nCoefficients:\n            Estimate Std. Error z value Pr(&gt;|z|)\n(Intercept)  -1.7428     0.2482  -7.023 2.18e-12 ***\nlikamsraekt  -0.1164     0.0547  -2.127   0.0334 *\n&gt; exp(coef(glm1))\n(Intercept) likamsraekt\n  0.1750381   0.8901369</pre>';
  var NM = '<pre class="rcode">&gt; table(Prof = diabetes$profun, Sjukdomur = diabetes$sjukd)\n    Sjukdomur\nProf  D+  D-\n  T+  43  17\n  T-  17 313</pre>';
  // R sýnikóði: krosstafla reykinga og drykkju í púlsgögnunum
  var RD = '<table class="tt"><tr><th></th><th>drekkur: Já</th><th>drekkur: Nei</th></tr><tr><th>reykir: Já</th><td>41</td><td>1</td></tr><tr><th>reykir: Nei</th><td>320</td><td>64</td></tr></table>';
  // Glærur, kafli 11: áfengissýki og fitulifur
  var FL = '<table class="tt"><tr><th></th><th>Áfengissjúkur</th><th>Ekki áfengissjúkur</th></tr><tr><th>Með fitulifur</th><td>75</td><td>26</td></tr><tr><th>Án fitulifrar</th><td>15</td><td>85</td></tr></table>';

  // ---------- Gagnlíkindi og gagnlíkindahlutfall ----------
  M("tvikosta", RD + "Reiknið og túlkið gagnlíkindahlutfallið fyrir að reykja, þeir sem drekka á móti þeim sem drekka ekki.",
    ["8.2: þeir sem drekka hafa 8.2 sinnum hærri gagnlíkindi á að reykja", "0.12: þeir sem drekka hafa 8.2 sinnum lægri gagnlíkindi á að reykja", "7.2: þeir sem drekka eru 7.2 sinnum líklegri til að reykja", "0.11: 11% þeirra sem drekka reykja"],
    "Gagnlíkindi hjá þeim sem drekka: (41/361)/(320/361) = 41/320 = 0.128. Hjá þeim sem drekka ekki: 1/64 = 0.016. OR = 0.128/0.016 = (41·64)/(320·1) = 8.2. 0.12 = 1/8.2 er hlutfallið í öfuga átt.");
  M("tvikosta", RD + "Hverjar eru líkurnar á að einstaklingur sem drekkur reyki, og hver eru gagnlíkindin?",
    ["Líkur 0.114 og gagnlíkindi 0.128", "Líkur 0.128 og gagnlíkindi 0.114", "Líkur 0.114 og gagnlíkindi 8.2", "Líkur 0.976 og gagnlíkindi 41"],
    "p = 41/(41 + 320) = 0.114 og gagnlíkindin eru p/(1 − p) = 0.114/0.886 = 0.128.");
  M("tvikosta", FL + "Hver eru gagnlíkindi þess að áfengissjúkir séu með fitulifur?",
    ["5", "0.83", "2.88", "0.31"],
    "p = 75/(75 + 15) = 0.83 og gagnlíkindin p/(1 − p) = 0.83/0.17 = 5 (= 75/15).");
  M("tvikosta", FL + "Reiknið og túlkið gagnlíkindahlutfallið fyrir fitulifur, áfengissjúkir á móti öðrum.",
    ["Um 16: áfengissjúkir hafa um 16 sinnum hærri gagnlíkindi á að vera með fitulifur", "Um 3.6: áfengissjúkir eru 3.6 sinnum líklegri til að vera með fitulifur", "Um 0.06: áfengissjúkir hafa lægri gagnlíkindi á fitulifur", "Um 5: 5 af hverjum 6 áfengissjúkum eru með fitulifur"],
    "Gagnlíkindi áfengissjúkra: 75/15 = 5. Annarra: 26/85 = 0.306. OR = 5/0.306 = 16.3. 3.6 er áhættuhlutfallið (0.833/0.234), ekki gagnlíkindahlutfallið.");

  // ---------- Tvíkosta aðhvarf í R ----------
  M("tvikosta", PG + "Hvert er gagnlíkindahlutfallið fyrir að reykja fyrir hverja klukkustund af líkamsrækt á viku?",
    ["0.890", "−0.116", "0.175", "1.123"],
    "Gagnlíkindahlutfallið fæst með því að setja stikann í veldið á e: exp(−0.1164) = 0.890. Gagnlíkindin á að reykja lækka um 11% fyrir hverja klukkustund. 1.123 = exp(0.1164) er hlutfallið í öfuga átt.");
  M("tvikosta", PG + "Hvert er gagnlíkindahlutfallið fyrir að reykja hjá einstaklingi sem stundar líkamsrækt 5 klukkustundum skemur á viku?",
    ["exp(5·0.1164) ≈ 1.79", "exp(−5·0.1164) ≈ 0.56", "5·0.890 ≈ 4.45", "exp(0.1164) ≈ 1.12"],
    "Skemmri líkamsrækt þýðir −5 klst., svo OR = exp(−5·(−0.1164)) = exp(0.582) = 1.79. Glærurnar segja: „gagnlíkindi þess að reykja eru 0.56 sinnum minni borið saman við einstakling sem stundar líkamsrækt 5 einingum skemur“, sem er sama samband séð frá hinni hliðinni.");
  M("tvikosta", PG + "Hvað þýðir neikvæður stuðull fyrir <code>likamsraekt</code>?",
    ["Líkur á að reykja eru minni hjá þeim sem stunda meiri líkamsrækt", "Líkamsrækt veldur því að fólk hættir að reykja", "Líkur á að reykja eru neikvæðar hjá þeim sem stunda líkamsrækt", "Sambandið er neikvætt og því ekki marktækt"],
    "Formerkið segir til um átt sambandsins. Þetta er athugunarrannsókn, svo ekki er hægt að álykta um orsakasamband.");
  M("tvikosta", GLM + "Túlkið gagnlíkindahlutfallið fyrir aldur.",
    ["Gagnlíkindi sykursýki hækka um 5.7% fyrir hvert ár, að BMI óbreyttu", "Líkur á sykursýki hækka um 5.7 prósentustig fyrir hvert ár", "Gagnlíkindi sykursýki hækka um 1.057% fyrir hvert ár", "Gagnlíkindi sykursýki eru 5.7 sinnum hærri fyrir hvert ár"],
    "exp(0.055475) = 1.057: gagnlíkindin hækka um 5.7% á ári (ekki líkurnar). Öryggisbilið [1.037, 1.078] inniheldur ekki 1.");
  M("tvikosta", GLM + "Hvert er gagnlíkindahlutfallið fyrir 10 ára aldursmun (sama BMI)?",
    ["exp(10·0.055475) ≈ 1.74", "10·1.057 ≈ 10.57", "exp(0.055475) ≈ 1.057", "10·0.055475 ≈ 0.555"],
    "OR fyrir k einingar er exp(k·β) = 1.057<sup>10</sup>.");
  M("tvikosta", GLM + "Er BMI marktækt tengt sykursýki að teknu tilliti til aldurs?",
    ["Já, því p = 0.002 og öryggisbilið fyrir OR inniheldur ekki 1", "Nei, því OR = 1.07 er of nálægt 1", "Nei, því stuðullinn 0.069 er nálægt 0", "Já, því skurðpunkturinn er marktækur"],
    "p = 0.002 og 95% öryggisbilið fyrir OR er [1.025, 1.119]. OR nálægt 1 á hverja einingu getur verið marktækt og safnast upp yfir mörg BMI-stig.");
  M("tvikosta", "Hvert er líkanið í tvíkosta aðhvarfsgreiningu með einni skýribreytu x?",
    ["log(p/(1 − p)) = β₀ + β₁x", "p = β₀ + β₁x", "log(p) = β₀ + β₁x", "p/(1 − p) = β₀ + β₁x"],
    "Svarbreytan er tvíkosta; „logit“ er nafnið á tengifallinu sem varpar líkum á bilinu (0, 1) yfir á allan talnaásinn.");
  M("tvikosta", "Af hverju er venjulegt línulegt aðhvarf óheppilegt fyrir tvíkosta svarbreytu (0/1)?",
    ["Spágildi geta lent utan bilsins [0, 1]", "Hallatalan verður alltaf ómarktæk", "Skýribreyturnar verða þá að vera flokkabreytur", "R getur ekki metið lm með 0/1 svarbreytu"],
    "Auk þess eru leifarnar hvorki normaldreifðar né með jafna dreifni.");
  M("tvikosta", "Ef logit(p) = 0, hverjar eru líkurnar p?",
    ["0.5", "0", "1", "e"],
    "log(p/(1 − p)) = 0 þýðir að gagnlíkindin eru 1, svo p = 0.5.");
  M("tvikosta", "Hvað segir z-gildið (<code>z value</code>) í <code>summary(glm)</code>?",
    ["Estimate/Std. Error, sem prófar H₀: β = 0", "Gagnlíkindahlutfallið exp(β)", "Spágildið fyrir meðaleinstakling", "Staðalfrávik leifanna"],
    "Þetta er Wald-próf. Í glm er notuð normaldreifing (z) en ekki t.");
  M("tvikosta", "Hvað skrifið þið í R til að framkvæma tvíkosta aðhvarfsgreiningu?",
    ["<code>glm(y ~ x, family = \"binomial\")</code>", "<code>glm(y ~ x, family = \"gaussian\")</code>", "<code>lm(y ~ x, family = \"binomial\")</code>", "<code>glm(y ~ x, family = \"poisson\")</code>"],
    "<code>family = \"binomial\"</code> segir R að framkvæma tvíkosta aðhvarfsgreiningu; <code>family = \"gaussian\"</code> gerir það sama og <code>lm</code>.");
  M("tvikosta", "Hvaða kost hefur tvíkosta aðhvarfsgreining fram yfir Fisher-próf eða kí-kvaðrat próf á krosstöflu?",
    ["Hægt er að taka tillit til blöndunarþátta og nota samfelldar skýribreytur", "Hún gefur alltaf lægra p-gildi", "Hún krefst engra forsendna", "Hún reiknar næmi og sértæki"],
    "Eins og línulegt aðhvarf hefur fram yfir t-próf (R sýnikóði áfangans).");

  // ---------- Næmi, sértæki, PPV og NPV ----------
  M("naemi", NM + "Hvert er næmi prófsins (fastandi glúkósi ≥ 126)?",
    ["43/60 ≈ 0.717", "313/330 ≈ 0.948", "43/390 ≈ 0.110", "60/390 ≈ 0.154"],
    "Næmi = P(T+ | D+) = TP/(TP + FN) = 43/(43 + 17). Sértæki = P(T− | D−) = 313/(313 + 17) = 0.948.");
  M("naemi", NM + "Hvert er sértæki prófsins?",
    ["313/330 ≈ 0.948", "43/60 ≈ 0.717", "313/390 ≈ 0.803", "17/330 ≈ 0.052"],
    "Sértæki = P(T− | D−) = TN/(TN + FP) = 313/(313 + 17).");
  M("naemi", NM + "Hvert er jákvætt forspárgildi (PPV)?",
    ["43/60 ≈ 0.717", "313/330 ≈ 0.948", "43/390 ≈ 0.110", "17/60 ≈ 0.283"],
    "PPV = P(D+ | T+) = TP/(TP + FP) = 43/(43 + 17). Hér er sú tilviljun að næmi og PPV eru eins því FN = FP = 17.");
  M("naemi", NM + "Hvert er neikvætt forspárgildi (NPV)?",
    ["313/330 ≈ 0.948", "313/390 ≈ 0.803", "43/60 ≈ 0.717", "17/330 ≈ 0.052"],
    "NPV = P(D− | T−) = TN/(TN + FN) = 313/(313 + 17).");
  M("naemi", "Hvað er <b>falskt neikvætt</b> próf?",
    ["Neikvætt próf hjá einstaklingi sem er í raun veikur", "Jákvætt próf hjá einstaklingi sem er í raun heilbrigður", "Neikvætt próf hjá einstaklingi sem er í raun heilbrigður", "Jákvætt próf hjá einstaklingi sem er í raun veikur"],
    "Mikið næmi þýðir fá fölsk neikvæð próf; það er mikilvægt í skimun.");
  M("naemi", "Ef skurðgildi greiningarprófs er lækkað (fleiri flokkaðir jákvæðir), hvað gerist yfirleitt?",
    ["Næmi hækkar en sértæki lækkar", "Bæði hækka", "Næmi lækkar en sértæki hækkar", "Ekkert breytist"],
    "Þetta er málamiðlunin sem ROC-ferillinn sýnir.");
  M("naemi", "Hvað þýðir AUC = 0.5 fyrir greiningarpróf?",
    ["Prófið greinir ekki betur en hending", "Prófið greinir fullkomlega", "Næmi prófsins er 50%", "Helmingur jákvæðra prófa er réttur"],
    "AUC = 1 er fullkomin aðgreining. AUC = 0.5 samsvarar skálínunni í ROC-grafinu.");
  M("naemi", "Hvaða lýsistærðir flokkunaraðferða eru <b>óháðar</b> algengi sjúkdóms í þýðinu?",
    ["Næmi og sértæki", "PPV og NPV", "Næmi og PPV", "Sértæki og NPV"],
    "Forspárgildin ráðast af algengi; næmi og sértæki eru eiginleikar prófsins sjálfs.");
  M("naemi", "Hvað er „1 − sértæki“?",
    ["P(T+ | D−)", "P(T− | D+)", "P(D− | T+)", "P(T− | D−)"],
    "1 − sértæki = P(T+ | D−), hlutfall falskt jákvæðra meðal heilbrigðra. Það er x-ásinn í ROC-grafi.");
  M("naemi", "Í skimun fyrir sjaldgæfum sjúkdómi (algengi 0.1%) með próf með sértæki 99%, hvað af eftirfarandi gildir?",
    ["Flest jákvæð próf verða fölsk jákvæð", "Flest jákvæð próf verða rétt jákvæð", "Flest neikvæð próf verða fölsk neikvæð", "Næmi prófsins verður lágt"],
    "Af 100 000: 100 veikir, en 999 fölsk jákvæð. Jafnvel með fullkomið næmi er PPV um 9%.");

  // ---------- Reiknidæmi ----------
  // R sýnikóði áfangans: gagnlíkindahlutfall úr krosstöflu reykinga og drykkju
  B.G.push(function glmOR2x2() {
    var a = rnd(25, 60), b = rnd(250, 380), c = rnd(1, 8), d = rnd(50, 90);
    var or = (a * d) / (b * c);
    return { topic: "tvikosta", title: "Gagnlíkindahlutfall úr krosstöflu", unit: "", tol: 0.002, answer: or,
      text: "<p>Í púlsgögnunum fæst þessi krosstafla reykinga og drykkju:</p><table class=\"tt\"><tr><th></th><th>drekkur: Já</th><th>drekkur: Nei</th></tr><tr><th>reykir: Já</th><td>" + a + "</td><td>" + c + "</td></tr><tr><th>reykir: Nei</th><td>" + b + "</td><td>" + d + "</td></tr></table><p>Reiknið gagnlíkindahlutfallið fyrir að reykja, þeir sem drekka á móti þeim sem drekka ekki.</p>",
      sol: "<p>Gagnlíkindi þess að einstaklingur sem drekkur reyki: " + a + "/" + b + " = " + f(a / b) + ". Gagnlíkindi þess að einstaklingur sem drekkur ekki reyki: " + c + "/" + d + " = " + f(c / d) + ". Gagnlíkindahlutfallið er " + f(a / b) + "/" + f(c / d) + " = (" + a + "·" + d + ")/(" + b + "·" + c + ") = " + f(or, 3) + ": þeir sem drekka hafa " + f(or, 1) + " sinnum hærri gagnlíkindi á því að reykja.</p><pre class=\"rcode\">(" + a + " * " + d + ") / (" + b + " * " + c + ")\nfisher.test(matrix(c(" + a + ", " + b + ", " + c + ", " + d + "), 2))</pre>" };
  });
  // Hlutaprófið og sykursýkisgögnin: líkur úr glm með tveimur skýribreytum
  B.G.push(function glmProbDia() {
    var age = rnd(30, 75), bmi = rnd(20, 40);
    var eta = -6.631840 + 0.055475 * age + 0.068679 * bmi, p = 1 / (1 + Math.exp(-eta));
    return { topic: "tvikosta", title: "Líkur úr tvíkosta líkani", unit: "", tol: 0.005, absTol: 0.0005, answer: p,
      text: "<p>Líkanið <code>glm(sykursyki ~ age + bmi, family = \"binomial\")</code> gaf stuðlana −6.631840 (skurðpunktur), 0.055475 (age) og 0.068679 (bmi). Notið líkanið til að reikna líkurnar á sykursýki hjá " + age + " ára einstaklingi með BMI " + bmi + ".</p>",
      sol: "<p>logit(p) = −6.631840 + 0.055475·" + age + " + 0.068679·" + bmi + " = " + f(eta) + ". Gagnlíkindin eru e<sup>" + f(eta) + "</sup> = " + f(Math.exp(eta)) + " og p = gagnlíkindi/(1 + gagnlíkindi) = " + f(p) + ".</p><pre class=\"rcode\">plogis(-6.631840 + 0.055475 * " + age + " + 0.068679 * " + bmi + ")</pre>" };
  });
  // Glærur um lýsistærðir flokkunaraðferða: NPV út frá algengi
  B.G.push(function naemiNPVprev() {
    var prev = pick([0.02, 0.05, 0.1, 0.2]), se = pick([0.8, 0.9, 0.95]), sp = pick([0.85, 0.9, 0.95]);
    var npv = sp * (1 - prev) / (sp * (1 - prev) + (1 - se) * prev);
    return { topic: "naemi", title: "NPV út frá algengi", unit: "", tol: 0.002, answer: npv,
      text: "<p>Algengi sjúkdóms er " + prev * 100 + "%. Prófið hefur næmi " + se + " og sértæki " + sp + ". Hverjar eru líkurnar á að einstaklingur með neikvætt próf sé í raun heilbrigður (NPV)?</p>",
      sol: "<p>NPV = P(D− | T−) = sértæki·(1 − algengi)/[sértæki·(1 − algengi) + (1 − næmi)·algengi] = " + f(sp * (1 - prev)) + "/(" + f(sp * (1 - prev)) + " + " + f((1 - se) * prev) + ") = " + f(npv) + ".</p><pre class=\"rcode\">" + sp + " * (1 - " + prev + ") / (" + sp + " * (1 - " + prev + ") + (1 - " + se + ") * " + prev + ")</pre>" };
  });
})();

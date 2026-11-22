/* q/kafli10.js – aukaspurningar fyrir kafla 10: Tvíkosta aðhvarf, næmi og sértæki (efni: tvikosta, naemi). */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var GLM = '<pre class="rcode">&gt; summary(glm(sykursyki ~ age + bmi, data = diabetes, family = "binomial"))\n\nCoefficients:\n             Estimate Std. Error z value Pr(&gt;|z|)\n(Intercept) -6.631840   0.958939  -6.916 4.65e-12 ***\nage          0.055475   0.009859   5.627 1.83e-08 ***\nbmi          0.068679   0.022235   3.089  0.00201 **\n&gt; exp(coef(fit))\n(Intercept)         age         bmi\n0.001317736 1.057042969 1.071092205\n&gt; exp(confint.default(fit))\n                   2.5 %      97.5 %\n(Intercept) 0.0002011771 0.008631343\nage         1.0368139654 1.077666655\nbmi         1.0254163163 1.118802670</pre>';
  var PG = '<pre class="rcode">&gt; summary(glm(reykir == "ja" ~ likamsraekt, data = puls, family = "binomial"))\n\nCoefficients:\n            Estimate Std. Error z value Pr(&gt;|z|)\n(Intercept)  -1.7428     0.2482  -7.023 2.18e-12 ***\nlikamsraekt  -0.1164     0.0547  -2.127   0.0334 *\n&gt; exp(coef(glm1))\n(Intercept) likamsraekt\n  0.1750381   0.8901369</pre>';
  var NM = '<pre class="rcode">&gt; table(Prof = diabetes$profun, Sjukdomur = diabetes$sjukd)\n    Sjukdomur\nProf  D+  D-\n  T+  43  17\n  T-  17 313</pre>';

  M("tvikosta", GLM + "Hvernig er OR fyrir aldur túlkað?",
    ["Gagnlíkindi sykursýki hækka um u.þ.b. 5.7% fyrir hvert ár í aldri, að BMI óbreyttu", "Líkur á sykursýki hækka um 5.7 prósentustig á ári", "5.7% fólks fær sykursýki á ári", "Aldur skýrir 5.7% breytileikans"],
    "exp(0.055475) = 1.057. Bilið [1.037, 1.078] inniheldur ekki 1.");
  M("tvikosta", GLM + "Hvert er OR fyrir 10 ára aldursmun (sama BMI)?",
    ["exp(10·0.055475) ≈ 1.74", "10·1.057 = 10.57", "1.057", "0.555"],
    "OR fyrir k einingar er exp(k·β) = 1.057<sup>10</sup>.");
  M("tvikosta", GLM + "Er BMI marktækt tengt sykursýki að teknu tilliti til aldurs?",
    ["Já: p = 0.002 og öryggisbilið fyrir OR [1.025, 1.119] inniheldur ekki 1", "Nei, því OR er nálægt 1", "Nei, því stuðullinn er lítill", "Já, því skurðpunkturinn er marktækur"],
    "OR nálægt 1 á hverja einingu getur verið marktækt og safnast upp yfir mörg BMI-stig.");
  M("tvikosta", PG + "Hvert er gagnlíkindahlutfallið fyrir að reykja fyrir hverja klukkustund af líkamsrækt á viku?",
    ["0.89: gagnlíkindin lækka um u.þ.b. 11% á hverja klst.", "−0.1164", "0.175", "1.12"],
    "exp(−0.1164) = 0.890.");
  M("tvikosta", PG + "Hvað þýðir neikvæður stuðull fyrir <code>likamsraekt</code>?",
    ["Líkur (og gagnlíkindi) á að reykja lækka eftir því sem fólk stundar meiri líkamsrækt", "Líkamsrækt veldur reykleysi", "Líkurnar eru neikvæðar", "Sambandið er ekki marktækt"],
    "Formerkið segir til um átt. Þetta er athugunarrannsókn, svo ekki orsakasamband.");
  M("tvikosta", "Af hverju er venjulegt línulegt aðhvarf óheppilegt fyrir tvíkosta svarbreytu (0/1)?",
    ["Spágildi geta farið út fyrir [0, 1] og leifarnar eru hvorki normaldreifðar né með jafna dreifni", "Það gefur alltaf p = 1", "R leyfir það ekki", "Það virkar bara fyrir flokkabreytur"],
    "Logit-tengifallið varpar líkum á bilinu (0, 1) yfir á allan talnaásinn.");
  M("tvikosta", "Ef logit(p) = 0, hverjar eru líkurnar p?",
    ["0.5", "0", "1", "e"],
    "log(p/(1 − p)) = 0 þýðir að gagnlíkindin eru 1, svo p = 0.5.");
  M("tvikosta", "Hvað segir z-gildið (<code>z value</code>) í <code>summary(glm)</code>?",
    ["Estimate deilt með Std. Error; prófar H₀: β = 0 (Wald-próf)", "Spágildið", "Gagnlíkindahlutfallið", "Fjölda tilfella"],
    "Í glm er notuð normaldreifing (z) en ekki t.");
  M("tvikosta", "Hvernig færðu metnar líkur (ekki logit) fyrir nýjan einstakling úr <code>glm</code>?",
    ["<code>predict(fit, nyr, type = \"response\")</code>", "<code>predict(fit, nyr)</code>", "<code>exp(predict(fit, nyr))</code>", "<code>coef(fit)</code>"],
    "Sjálfgefið skilar <code>predict</code> logit-gildinu; exp af því gefur gagnlíkindi, ekki líkur.");
  M("tvikosta", "Hvaða fjölskyldu (family) þarf í <code>glm</code> fyrir tvíkosta aðhvarf?",
    ["<code>binomial</code>", "<code>gaussian</code>", "<code>poisson</code>", "<code>logit</code>"],
    "<code>binomial</code> notar logit-tengifallið sjálfgefið.");
  M("naemi", NM + "Hvert er næmi prófsins (fastandi glúkósi ≥ 126)?",
    ["43/60 ≈ 0.717", "313/330 ≈ 0.948", "43/390 ≈ 0.110", "60/390 ≈ 0.154"],
    "Næmi = TP/(TP + FN) = 43/(43 + 17). Sértæki = 313/(313 + 17) = 0.948.");
  M("naemi", NM + "Hvert er jákvætt forspárgildi (PPV)?",
    ["43/60 ≈ 0.717", "313/330 ≈ 0.948", "43/390 ≈ 0.110", "17/60 ≈ 0.283"],
    "PPV = TP/(TP + FP) = 43/(43 + 17). Hér er sú tilviljun að næmi og PPV eru eins því FN = FP = 17.");
  M("naemi", NM + "Hvert er neikvætt forspárgildi (NPV)?",
    ["313/330 ≈ 0.948", "313/390 ≈ 0.803", "43/60 ≈ 0.717", "17/330 ≈ 0.052"],
    "NPV = TN/(TN + FN) = 313/(313 + 17).");
  M("naemi", "Hvað er <b>falskt neikvætt</b> próf?",
    ["Próf sem er neikvætt hjá einstaklingi sem er í raun veikur", "Próf sem er jákvætt hjá heilbrigðum", "Rétt neikvætt próf", "Próf sem ekki var framkvæmt"],
    "Mikið næmi þýðir fá fölsk neikvæð próf; það er mikilvægt í skimun.");
  M("naemi", "Ef skurðgildi greiningarprófs er lækkað (fleiri flokkaðir jákvæðir), hvað gerist yfirleitt?",
    ["Næmi hækkar en sértæki lækkar", "Bæði hækka", "Næmi lækkar en sértæki hækkar", "Ekkert breytist"],
    "Þetta er málamiðlunin sem ROC-ferillinn sýnir.");
  M("naemi", "Hvað þýðir AUC = 0.5 fyrir greiningarpróf?",
    ["Prófið greinir ekki betur en hending", "Prófið er fullkomið", "Næmi er 50%", "Algengi er 50%"],
    "AUC = 1 er fullkomin aðgreining. AUC = 0.5 samsvarar skálínunni í ROC-grafinu.");
  M("naemi", "Hvaða eiginleikar eru <b>óháðir</b> algengi sjúkdóms í þýðinu?",
    ["Næmi og sértæki", "PPV og NPV", "PPV eingöngu", "Engir"],
    "Forspárgildin ráðast af algengi; næmi og sértæki eru eiginleikar prófsins sjálfs.");
  M("naemi", "Hvað er „1 − sértæki“?",
    ["Hlutfall falskt jákvæðra meðal heilbrigðra, P(T+ | D−)", "Næmi", "NPV", "Algengi"],
    "Það er x-ásinn í ROC-grafi.");
  M("naemi", "Í skimun fyrir sjaldgæfum sjúkdómi (algengi 0.1%) með próf með sértæki 99%, hvað er rétt?",
    ["Flest jákvæð próf verða fölsk jákvæð", "Flest jákvæð próf eru rétt", "NPV verður lágt", "Næmi verður lágt"],
    "Af 100 000: 100 veikir, en 999 fölsk jákvæð. Jafnvel með fullkomið næmi er PPV um 9%.");

  // ---------- Reiknidæmi ----------
  B.G.push(function glmProbDia() {
    var age = rnd(30, 75), bmi = rnd(20, 40);
    var eta = -6.631840 + 0.055475 * age + 0.068679 * bmi, p = 1 / (1 + Math.exp(-eta));
    return { topic: "tvikosta", title: "Líkur úr glm með tveimur breytum", unit: "", tol: 0.005, absTol: 0.0005, answer: p,
      text: "<p>Líkanið <code>glm(sykursyki ~ age + bmi, family = \"binomial\")</code> gaf stuðlana −6.631840 (skurðpunktur), 0.055475 (age) og 0.068679 (bmi). Hverjar eru metnar líkur á sykursýki hjá " + age + " ára einstaklingi með BMI " + bmi + "?</p>",
      sol: "<p>logit(p) = −6.631840 + 0.055475·" + age + " + 0.068679·" + bmi + " = " + f(eta) + ". p = 1/(1 + e<sup>" + f(-eta) + "</sup>) = " + f(p) + ".</p><pre class=\"rcode\">plogis(-6.631840 + 0.055475 * " + age + " + 0.068679 * " + bmi + ")</pre>" };
  });
  B.G.push(function naemiNPVprev() {
    var prev = pick([0.02, 0.05, 0.1, 0.2]), se = pick([0.8, 0.9, 0.95]), sp = pick([0.85, 0.9, 0.95]);
    var npv = sp * (1 - prev) / (sp * (1 - prev) + (1 - se) * prev);
    return { topic: "naemi", title: "NPV út frá algengi", unit: "", tol: 0.002, answer: npv,
      text: "<p>Algengi sjúkdóms er " + prev * 100 + "%. Prófið hefur næmi " + se + " og sértæki " + sp + ". Hverjar eru líkurnar á að einstaklingur með neikvætt próf sé í raun heilbrigður (NPV)?</p>",
      sol: "<p>NPV = sértæki·(1 − algengi)/[sértæki·(1 − algengi) + (1 − næmi)·algengi] = " + f(sp * (1 - prev)) + "/(" + f(sp * (1 - prev)) + " + " + f((1 - se) * prev) + ") = " + f(npv) + ".</p><pre class=\"rcode\">" + sp + " * (1 - " + prev + ") / (" + sp + " * (1 - " + prev + ") + (1 - " + se + ") * " + prev + ")</pre>" };
  });
})();

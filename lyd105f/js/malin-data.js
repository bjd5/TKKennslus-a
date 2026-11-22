/* malin-data.js – verkefni byggð á raunverulegu R-úttaki úr gagnasettum áfangans (js/uttak.js),
 * flokkuð eftir efnisþætti (skill). Gagnvirku skrefin í köflunum (js/gagnvirkt.js) sækja verkefnin héðan.
 * Öll talnasvör voru reiknuð í R; skipunin er í task.r. */
(function () {
  "use strict";
  var A = window.App, h = A.h, esc = A.esc;
  var N = "Ekkert að ofan er rétt";

  var CASES = [
    {
      id: "puls", t: "Púlsrannsóknin", badge: "P", data: "pulsAll",
      story: "Nemendur köstuðu krónu: sumir hlupu í eina mínútu en aðrir sátu kyrrir. Púls var mældur fyrir og eftir. Breytan <code>kyn</code> er 1 = kona og 2 = karl.",
      skills: ["lysandi", "hlutfoll", "ttest", "tilgatur", "adhvarf", "tvikosta"],
      steps: [
        { out: ["p_summary"], skill: "lysandi", type: "pick", tok: "17", q: "Hjá hve mörgum vantar mælingu á púlsi <b>fyrir</b> inngrip (<code>fyrriPuls</code>)? Smelltu á töluna.", ex: "<p>Línan <code>NA's</code> sýnir fjölda gilda sem vantar: 17 hjá fyrriPuls og 14 hjá seinniPuls.</p>" },
        { out: ["p_summary"], skill: "lysandi", type: "mc", q: "Fyrir <code>seinniPuls</code> er meðaltalið 82.21 en miðgildið 77. Hvað segir það um dreifinguna?", opts: ["Hún er hægri-skekkt: nokkur mjög há gildi (þeir sem hlupu) toga meðaltalið upp", "Hún er vinstri-skekkt", "Hún er samhverf, svo normaldreifð", "Meðaltalið er rangt reiknað", N], a: 0, ex: "<p>Meðaltal &gt; miðgildi bendir til langs hala upp á við. Hámarkið er 162.</p>" },
        { out: ["p_inngrip"], skill: "hlutfoll", type: "num", q: "Hver var úthlutað með krónukasti. Hve margir hefðu átt að hlaupa <b>samkvæmt núlltilgátunni</b> (af þeim 469 sem eru skráðir)?", a: 234.5, d: 1, tol: { abs: 0.01 }, r: "469 * 0.5", ex: "<p>Með heiðarlegri krónu er H₀: p = 0.5, svo vænt fjöldi er 0.5 · 469 = 234.5. Í raun hlupu 183.</p>" },
        { out: ["p_inngrip"], skill: "hlutfoll", type: "pick", tok: "2.478e-06", q: "Smelltu á p-gildið sem prófar hvort hlutfall hlaupara sé 0.5.", ex: "<p>p = 2.478·10⁻⁶ &lt; 0.05: höfnum H₀. Öryggisbilið [0.346, 0.436] inniheldur ekki 0.5. Annaðhvort var ekki farið eftir krónunni eða færri hlauparar skiluðu mælingum.</p>" },
        { out: ["p_var_kyn", "p_t_kyn"], skill: "ttest", type: "mc", q: "Áður en meðalpúls kvenna og karla er borinn saman er <code>var.test</code> keyrt. Var rétt að nota <code>var.equal = TRUE</code> í t-prófinu?", opts: ["Já: p = 0.1155 &gt; 0.05, svo við höfnum ekki jafnri dreifni", "Nei: p = 0.1155 sýnir að dreifnin er ólík", "Nei: aldrei má nota var.equal = TRUE", "Já, því úrtökin eru jafnstór", N], a: 0, keep: true, ex: "<p>H₀ í <code>var.test</code> er að hlutfall dreifnanna sé 1. Henni er ekki hafnað, og öryggisbilið [0.946, 1.636] inniheldur 1. Hóparnir eru reyndar ekki jafnstórir (294 og 160 með mælingu).</p>" },
        { out: ["p_t_kyn"], skill: "ttest", type: "pick", tok: "2.5937", q: "Smelltu á <b>prófstærðina</b> í t-prófinu.", ex: "<p>t = 2.5937 með df = 452 (= 294 + 160 − 2).</p>" },
        { out: ["p_t_kyn"], skill: "ttest", type: "num", q: "Hver er metinn munur á meðalpúlsi kvenna og karla (kona − karl) í hvíld?", a: 3.00332, d: 3, tol: { abs: 0.002 }, unit: "slög/mín", r: "73.04082 - 70.03750", ex: "<p>73.04 − 70.04 = 3.00. Öryggisbilið fyrir muninn er [0.73, 5.28] og p = 0.0098, svo konur eru með marktækt hraðari púls í hvíld.</p>" },
        { out: ["p_parad"], skill: "ttest", type: "mc", q: "Púls hlauparanna er borinn saman fyrir og eftir hlaup. Af hverju er notað <b>parað</b> t-próf?", opts: ["Af því að báðar mælingarnar eru á sama einstaklingi og eru því háðar", "Af því að hóparnir eru jafnstórir", "Af því að dreifnin er ólík", "Af því að gögnin eru ekki normaldreifð", N], a: 0, ex: "<p>Parað t-próf er eins úrtaks t-próf á mismuninum d = seinni − fyrri. Hér er meðalmunurinn 25.78 slög/mín (df = 179).</p>" },
        { out: ["p_chisq"], skill: "hlutfoll", type: "num", q: "Hver er <b>vænt tíðni</b> kvenna (kyn = 1) sem reykja (<code>ja</code>) ef reykingar og kyn eru óháð?", a: 30.131, d: 2, tol: { abs: 0.02 }, r: "300 * 46 / 458   # línusumma * dálksumma / heild\nchisq.test(tafla)$expected", ex: "<p>Konur: 28 + 272 = 300. Reykja: 28 + 18 = 46. Alls 458. E = 300·46/458 = 30.13. Séð er 28, nálægt væntu gildi, sem passar við p = 0.594.</p>" },
        { out: ["p_chisq"], skill: "hlutfoll", type: "mc", q: "Hvaða ályktun dregur þú af kí-kvaðrat prófinu?", opts: ["Ekki eru marktæk tengsl milli kyns og reykinga (p = 0.594)", "Konur reykja marktækt meira", "Karlar reykja marktækt meira", "Prófið er ógilt því taflan er 2×2", N], a: 0, ex: "<p>p = 0.5938 &gt; 0.05: höfnum ekki H₀ um óhæði. (Hlutfall reykingafólks: 9.3% kvenna og 11.4% karla.)</p>" },
        { out: ["p_lm"], skill: "adhvarf", type: "num", q: "Notaðu líkanið til að spá fyrir um púls eftir hlaup hjá hlaupara með hvíldarpúls 70.", a: 96.2487, d: 2, tol: { abs: 0.05 }, unit: "slög/mín", r: "34.1097 + 0.8877 * 70\npredict(fit, data.frame(fyrriPuls = 70))", ex: "<p>ŷ = 34.1097 + 0.8877·70 = 96.25 slög/mín.</p>" },
        { out: ["p_lm"], skill: "adhvarf", type: "pick", tok: "0.2739", q: "Smelltu á töluna sem segir hve stór hluti breytileikans í púlsi eftir hlaup skýrist af hvíldarpúlsi.", ex: "<p>R² = 0.2739: um 27% breytileikans skýrast af línulegu sambandi við hvíldarpúls.</p>" },
        { out: ["p_glm"], skill: "tvikosta", type: "num", q: "Stuðull <code>likamsraekt</code> er −0.1164. Hvert er gagnlíkindahlutfallið (OR) fyrir að reykja hjá þeim sem stundar <b>5 klst. meiri</b> líkamsrækt á viku?", a: 0.5587797, d: 3, tol: { abs: 0.002 }, r: "exp(5 * -0.1164)", ex: "<p>OR = e<sup>5·(−0.1164)</sup> = 0.56: gagnlíkindin á að reykja eru um 44% lægri. Fyrir eina klukkustund er OR = 0.89 (sést neðst í úttakinu).</p>" },
        { out: ["p_delta"], skill: "ttest", type: "write", q: "Breytist púls á annan hátt hjá þeim sem hlupu en hjá þeim sem sátu kyrrir? Rökstyddu með úttakinu.", model: "<p>Já. Welch t-próf á <code>delta</code> (púls eftir − fyrir) eftir hópum gefur t = 18.73 (df = 203.67) og p &lt; 2.2·10⁻¹⁶. Meðalbreytingin er 25.78 slög/mín hjá hlaupurum en 0.08 hjá þeim sem sátu. 95% öryggisbilið fyrir muninn, [23.0, 28.4], inniheldur ekki 0. Höfnum H₀: μ<sub>hljóp</sub> = μ<sub>sat</sub> og ályktum að hlaupið hækki púls að jafnaði um u.þ.b. 26 slög/mín meira en kyrrseta.</p>", rubric: ["Nefndi rétta prófið (óparað/Welch t-próf á mismuninum)", "Setti fram H₀ um jöfn meðaltöl breytingar", "Vísaði í p-gildið og/eða öryggisbilið sem inniheldur ekki 0", "Tilgreindi stærð áhrifanna (um 26 slög/mín)"] }
      ]
    },
    {
      id: "fram", t: "Framingham", badge: "F", data: "frmgham2 (fyrsta skoðun)",
      story: "4 434 þátttakendur í Framingham-hjartarannsókninni. Skoðað er hvernig sykursýki, aldur og BMI tengjast blóðþrýstingi og kólesteróli, og lifun eftir því hvort fólk var með kransæðasjúkdóm.",
      skills: ["hlutfoll", "ttest", "anova", "adhvarf", "lifun"],
      steps: [
        { out: ["f_tafla"], skill: "hlutfoll", type: "num", q: "Hvert er hlutfall <b>karla (Male) með sykursýki</b> samkvæmt töflunni?", a: 0.03034979, d: 4, tol: { abs: 0.0003 }, r: "59 / (1885 + 59)", ex: "<p>59/(1885 + 59) = 59/1944 = 0.0303. Hjá konum er það 62/2490 = 0.0249.</p>" },
        { out: ["f_tafla"], skill: "hlutfoll", type: "mc", q: "Hvað segir talan <code>prop 1 = 0.9696502</code> í úttaki <code>prop.test</code>?", opts: ["Hlutfall karla <b>án</b> sykursýki, því fyrsti dálkur töflunnar er „No“", "Hlutfall karla með sykursýki", "p-gildið", "Hlutfall allra án sykursýki", N], a: 0, ex: "<p>Gildra! <code>prop.test(tafla)</code> notar <b>fyrsta dálkinn</b> sem „árangur“. Hér er það „No“, svo 0.970 = 1885/1944. Hlutfallið með sykursýki er 1 − 0.970 = 0.030.</p>" },
        { out: ["f_tafla"], skill: "hlutfoll", type: "num", q: "Reiknaðu gagnlíkindahlutfallið (OR) fyrir sykursýki, karlar á móti konum.", a: 1.225738, d: 3, tol: { abs: 0.003 }, r: "(59 / 1885) / (62 / 2428)\n(59 * 2428) / (1885 * 62)", ex: "<p>Gagnlíkindi karla 59/1885 = 0.0313, kvenna 62/2428 = 0.0255. OR = 1.23: karlar hafa um 23% hærri gagnlíkindi, en munurinn er ekki marktækur (p = 0.311).</p>" },
        { out: ["f_tafla"], skill: "tilgatur", type: "pick", tok: "0.3113", q: "Smelltu á p-gildið sem prófar hvort hlutfall sykursýki sé það sama hjá kynjunum.", ex: "<p>p = 0.3113 &gt; 0.05: ekki marktækur munur. Öryggisbilið fyrir mun hlutfalla inniheldur 0.</p>" },
        { out: ["f_var", "f_t_eq", "f_t_welch"], skill: "ttest", type: "mc", q: "Áhrif sykursýki á systólískan blóðþrýsting. Bæði t-prófin voru keyrð. Hvort á að nota?", opts: ["Welch-prófið (var.equal = FALSE), því var.test hafnar jafnri dreifni (p = 2.8·10⁻⁷)", "var.equal = TRUE, því hóparnir eru stórir", "var.equal = TRUE, því p-gildið er lægra", "Skiptir ekki máli, ályktunin er sú sama", N], a: 0, keep: true, ex: "<p>var.test: F = 0.546, p = 2.809e-07 &lt; 0.05, svo dreifnin er ólík. Þá er Welch-prófið rétt. Hóparnir eru líka mjög misstórir (4313 og 121), og þá skiptir það mestu.</p>" },
        { out: ["f_t_welch"], skill: "ttest", type: "pick", tok: "-5.8067", q: "Smelltu á prófstærðina í t-prófinu sem þú valdir.", ex: "<p>Welch: t = −5.8067 með df = 123.71 (ekki heiltala, því Welch-nálgun er notuð).</p>" },
        { out: ["f_t_welch"], skill: "ttest", type: "mc", q: "Hver er rétt núlltilgáta og ályktun?", opts: ["H₀: μ<sub>No</sub> = μ<sub>Yes</sub>. Höfnum H₀ (p = 5·10⁻⁸): fólk með sykursýki hefur að jafnaði 10–21 mmHg hærri blóðþrýsting", "H₀: x̄<sub>No</sub> = x̄<sub>Yes</sub>. Höfnum ekki H₀", "H₀: μ<sub>No</sub> ≠ μ<sub>Yes</sub>. Höfnum H₀", "H₀: dreifnin er jöfn. Höfnum H₀", N], a: 0, ex: "<p>Öryggisbilið [−21.25, −10.45] er fyrir μ<sub>No</sub> − μ<sub>Yes</sub>. Það er neikvætt, svo þeir með sykursýki hafa hærri meðalblóðþrýsting (148.3 á móti 132.5).</p>" },
        { out: ["f_aov"], skill: "anova", type: "num", q: "Reiknaðu F-gildið út frá <code>Mean Sq</code> dálkinum.", a: 112.0119, d: 2, tol: { abs: 0.1 }, r: "207558 / 1853", ex: "<p>F = MS<sub>hópa</sub>/MS<sub>leifa</sub> = 207558/1853 = 112.0, sem R námundar í 112.</p>" },
        { out: ["f_aov"], skill: "anova", type: "mc", q: "Hverjar eru frígráðurnar í F-prófinu og hvað segja þær?", opts: ["3 og 4378: 4 aldurshópar (k − 1 = 3) og 4382 mælingar (N − k = 4378)", "4 og 4382", "3 og 4434", "1 og 4378", N], a: 0, ex: "<p>52 voru felldir út vegna vöntunar, svo N = 4434 − 52 = 4382 og N − k = 4378.</p>" },
        { out: ["f_aov"], skill: "anova", type: "write", q: "Hver er H₀ og H₁, hvaða ályktun er dregin, og á hverju byggir ANOVA?", model: "<p>H₀: μ<sub>30–40</sub> = μ<sub>40–50</sub> = μ<sub>50–60</sub> = μ<sub>60–70</sub>. H₁: a.m.k. eitt meðaltal er ólíkt hinum. F = 112 og p &lt; 2·10⁻¹⁶, svo við höfnum H₀: meðalkólesteról er ólíkt eftir aldurshópum (hækkar úr 216 í um 249). ANOVA ber saman breytileika <b>milli</b> hópa (MS hópa) við breytileika <b>innan</b> hópa (MS leifa). Ef meðaltölin eru jöfn er F nálægt 1; ef þau eru ólík verður breytileikinn milli hópa mikill og F stórt. Forsendur: óháðar mælingar, normaldreifðar leifar og jöfn dreifni í hópunum (skoða kassarit).</p>", rubric: ["Rétt H₀ (öll meðaltöl jöfn) og H₁ (a.m.k. eitt ólíkt)", "Ályktun út frá p-gildinu: höfnum H₀", "Útskýrði F sem hlutfall breytileika milli og innan hópa", "Nefndi forsendur (óháð, normaldreifðar leifar, jöfn dreifni)"] },
        { out: ["f_lm"], skill: "adhvarf", type: "pick", tok: "1.78852", q: "Smelltu á hallatöluna sem lýsir sambandi BMI og blóðþrýstings.", ex: "<p>Fyrir hverja einingu sem BMI hækkar hækkar meðalblóðþrýstingur um 1.79 mmHg.</p>" },
        { out: ["f_lm"], skill: "adhvarf", type: "num", q: "Spáðu fyrir um systólískan blóðþrýsting hjá manneskju með BMI = 25.", a: 131.3798, d: 2, tol: { abs: 0.05 }, unit: "mmHg", r: "86.66684 + 1.78852 * 25", ex: "<p>ŷ = 86.67 + 1.79·25 = 131.38 mmHg.</p>" },
        { out: ["f_lm"], skill: "adhvarf", type: "num", q: "Reiknaðu <b>neðri</b> mörk 95% öryggisbils hallatölunnar með Estimate ± t·SE (berðu svo saman við <code>confint</code>).", a: 1.636542, d: 4, tol: { abs: 0.0008 }, r: "1.78852 - qt(0.975, df = 4413) * 0.07752", ex: "<p>1.78852 − 1.9605·0.07752 = 1.6365, sama og <code>confint</code> gefur (1.636546). Efri mörkin eru 1.9405.</p>" },
        { out: ["f_lm"], skill: "adhvarf", type: "mc", q: "BMI í gögnunum er á bilinu 15.5–56.8. Er spá fyrir BMI = 15 áreiðanleg?", opts: ["Nei, BMI = 15 er utan gagnasviðsins (bryggjun) og R² = 0.11 er lágt, svo einstaklingsspár eru ónákvæmar", "Já, því p &lt; 2·10⁻¹⁶", "Já, því líkanið er línulegt", "Nei, því hallatalan er jákvæð", N], a: 0, ex: "<p>Marktækt samband þýðir ekki nákvæma spá. Leifastaðalfrávikið er 21 mmHg.</p>" },
        { out: ["f_cox"], skill: "lifun", type: "pick", tok: "3.75840", q: "Smelltu á áhættuhlutfallið (HR) fyrir þá sem eru með kransæðasjúkdóm.", ex: "<p>HR = exp(coef) = 3.758: dánaráhætta þeirra sem voru með CHD er 3.76 sinnum meiri. Talan 0.2661 (exp(−coef)) er hlutfallið í hina áttina.</p>" },
        { out: ["f_cox"], skill: "lifun", type: "num", q: "Um hve mörg prósent er dánaráhættan hærri hjá þeim sem eru með CHD?", a: 275.84, d: 1, tol: { abs: 0.3 }, unit: "%", r: "(3.75840 - 1) * 100", ex: "<p>(HR − 1)·100 = 275.8% hærri áhætta, með 95% bil fyrir HR [3.16, 4.46].</p>" },
        { out: ["f_km"], km: "fram", skill: "lifun", type: "num", q: "Hverjar eru metnar lifunarlíkur eftir <b>10 ár</b> hjá þeim sem voru með CHD?", a: 0.619, d: 3, tol: { abs: 0.003 }, r: "summary(km, times = 10)", ex: "<p>Í <code>summary(km, times = c(5, 10, 20))</code>: survival = 0.619 hjá CHD en 0.916 hjá No CHD.</p>" },
        { out: ["f_km"], km: "fram", skill: "lifun", type: "mc", q: "Af hverju er miðgildi lifunar <code>NA</code> hjá No CHD?", opts: ["Lifunarferillinn fer aldrei niður fyrir 0.5 á eftirfylgnitímanum, svo miðgildið er ekki skilgreint", "Gögn vantar um alla í hópnum", "Enginn í hópnum dó", "Villa í R", N], a: 0, ex: "<p>Eftir 24 ára eftirfylgd eru yfir 50% á lífi í No CHD hópnum. Hjá CHD er miðgildið 14.2 ár.</p>" }
      ]
    },
    {
      id: "syk", t: "Sykursýki", badge: "S", data: "diabetes.sav",
      story: "403 fullorðnir í Virginíu. Sykursýki er skilgreind sem glýkósýlerað hemóglóbín ≥ 7. Hér er metið hvernig aldur og BMI tengjast sykursýki, og hve gott fastandi blóðsykurspróf (≥ 126) er til greiningar.",
      skills: ["naemi", "tvikosta", "hlutfoll"],
      steps: [
        { out: ["d_naemi"], skill: "naemi", type: "num", q: "Reiknaðu <b>næmi</b> blóðsykursprófsins.", a: 0.7166667, d: 4, tol: { abs: 0.001 }, r: "43 / (43 + 17)", ex: "<p>Næmi = P(T+ | D+) = 43/(43 + 17) = 0.717: prófið greinir 72% þeirra sem eru með sykursýki.</p>" },
        { out: ["d_naemi"], skill: "naemi", type: "num", q: "Reiknaðu <b>sértæki</b> prófsins.", a: 0.9484848, d: 4, tol: { abs: 0.001 }, r: "313 / (313 + 17)", ex: "<p>Sértæki = P(T− | D−) = 313/(17 + 313) = 0.948.</p>" },
        { out: ["d_naemi"], skill: "naemi", type: "num", q: "Hvert er <b>algengi</b> sykursýki í þessum hópi?", a: 0.1538462, d: 4, tol: { abs: 0.001 }, r: "(43 + 17) / (43 + 17 + 17 + 313)", ex: "<p>60 af 390 = 0.154. PPV = 43/60 = 0.717 og NPV = 313/330 = 0.948. Talan 17 kemur fyrir í tveimur reitum, svo næmi = PPV hér fyrir tilviljun.</p>" },
        { out: ["d_naemi"], skill: "naemi", type: "mc", q: "Prófið er notað í hópi þar sem algengi sykursýki er aðeins 3%. Hvað gerist?", opts: ["PPV lækkar (fleiri fölsk jákvæð miðað við sönn jákvæð) en næmi og sértæki haldast", "Næmi lækkar", "Sértæki hækkar", "PPV hækkar", N], a: 0, ex: "<p>Næmi og sértæki eru eiginleikar prófsins; forspárgildin ráðast af algenginu.</p>" },
        { out: ["d_glm"], skill: "tvikosta", type: "pick", tok: "1.057042969", q: "Smelltu á gagnlíkindahlutfallið (OR) fyrir aldur.", ex: "<p>exp(0.055475) = 1.057: gagnlíkindi sykursýki hækka um 5.7% fyrir hvert ár, leiðrétt fyrir BMI.</p>" },
        { out: ["d_glm"], skill: "tvikosta", type: "num", q: "Hvert er OR fyrir einstakling sem er <b>10 árum eldri</b> (sama BMI)?", a: 1.741506, d: 3, tol: { abs: 0.003 }, r: "exp(10 * 0.055475)", ex: "<p>exp(10·0.055475) = 1.74. Athugið: þetta er <b>ekki</b> 10·1.057.</p>" },
        { out: ["d_glm"], skill: "tvikosta", type: "num", q: "Hverjar eru metnar líkur á sykursýki hjá 50 ára einstaklingi með BMI = 30?", a: 0.1421288, d: 4, tol: { abs: 0.001 }, r: "plogis(-6.631840 + 0.055475 * 50 + 0.068679 * 30)", ex: "<p>logit = −6.632 + 0.0555·50 + 0.0687·30 = −1.798; p = 1/(1 + e<sup>1.798</sup>) = 0.142.</p>" },
        { out: ["d_glm"], skill: "tvikosta", type: "pick", tok: "1.0254163163", q: "Smelltu á <b>neðri</b> mörk 95% öryggisbils OR fyrir BMI.", ex: "<p>Bilið er [1.025, 1.119] og inniheldur ekki 1, svo BMI tengist sykursýki marktækt (p = 0.002).</p>" },
        { out: ["d_chisq"], skill: "hlutfoll", type: "mc", q: "R gefur viðvörunina „Chi-squared approximation may be incorrect“. Af hverju, og hvað á að gera?", opts: ["Sumar væntar tíðnir eru undir 5 (t.d. í BMI ≤ 18 hópnum), svo betra er að nota Fisher-próf eða sameina flokka", "Gögnin eru ekki normaldreifð", "Taflan er of stór fyrir R", "Það vantar gögn", N], a: 0, ex: "<p>Aðeins 6 eru í lægsta BMI-flokknum. <code>fisher.test()</code> eða sameining flokka leysir þetta.</p>" },
        { out: ["d_chisq"], skill: "tilgatur", type: "pick", tok: "0.0678", q: "Smelltu á p-gildið. Eru marktæk tengsl milli BMI-flokks og sykursýki við α = 0.05?", ex: "<p>p = 0.0678 &gt; 0.05: höfnum ekki H₀ um óhæði. Samt sýndi glm-líkanið með samfelldu BMI marktæk tengsl, því flokkun tapar upplýsingum.</p>" },
        { out: ["d_glm"], skill: "tvikosta", type: "write", q: "Túlkaðu tvíkosta aðhvarfslíkanið: hvaða breytur tengjast sykursýki og hversu mikið?", model: "<p>Líkanið er logit(p) = −6.63 + 0.0555·aldur + 0.0687·BMI. Báðar breytur tengjast marktækt sykursýki (p = 1.8·10⁻⁸ fyrir aldur og 0.002 fyrir BMI). Fyrir hvert ár hækka gagnlíkindin um 5.7% (OR = 1.057, 95% bil 1.037–1.078), leiðrétt fyrir BMI. Fyrir hverja BMI-einingu hækka þau um 7.1% (OR = 1.071, 95% bil 1.025–1.119), leiðrétt fyrir aldri. Bæði bilin eru ofan við 1.</p>", rubric: ["Skrifaði líkanið með logit-tengifalli", "Breytti stuðlum í OR með exp()", "Túlkaði OR sem %-breytingu á gagnlíkindum (ekki líkum)", "Nefndi „leiðrétt fyrir“ hinni breytunni", "Notaði p-gildi eða öryggisbil til að meta marktækni"] }
      ]
    },
    {
      id: "plasma", t: "Plasma", badge: "Pl", data: "plasma.csv",
      story: "315 einstaklingar. Mælt var beta-karótín í blóði (<code>betaplasma</code>) ásamt reykingum og trefjaneyslu. Beta-karótín er mjög hægri-skekkt breyta, og það skiptir máli fyrir forsendurnar.",
      skills: ["anova", "adhvarf", "tilgatur"],
      steps: [
        { out: ["pl_aov"], skill: "anova", type: "num", q: "Reiknaðu F-gildið í fervikagreiningunni.", a: 3.715431, d: 3, tol: { abs: 0.003 }, r: "122312 / 32920", ex: "<p>F = 122312/32920 = 3.715 með 2 og 312 frígráður.</p>" },
        { out: ["pl_aov"], skill: "anova", type: "pick", tok: "0.0254", q: "Smelltu á p-gildið í ANOVA-töflunni.", ex: "<p>p = 0.0254 &lt; 0.05: meðal beta-karótín er ólíkt eftir reykingastöðu.</p>" },
        { out: ["pl_aov"], skill: "anova", type: "mc", q: "Hvaða ályktun má draga?", opts: ["A.m.k. eitt meðaltal er ólíkt; til að vita hvaða hópar eru ólíkir þarf eftirápróf (t.d. Tukey)", "Öll þrjú meðaltölin eru ólík", "Reykingar valda lægra beta-karótíni", "Ekki er marktækur munur", N], a: 0, ex: "<p>ANOVA segir aðeins að munur sé til staðar. Athugunarrannsókn sannar ekki orsakasamband.</p>" },
        { out: ["pl_aov"], skill: "anova", type: "write", q: "Er viðeigandi að nota ANOVA á <code>betaplasma</code>? Hvað myndir þú skoða?", model: "<p>Forsendur ANOVA eru óháðar mælingar, normaldreifðar leifar og jöfn dreifni í hópunum. Beta-karótín er mjög hægri-skekkt (í lm-úttakinu er stærsta leifin 1170 en sú minnsta −241), svo leifar eru líklega ekki normaldreifðar og dreifnin gæti verið ólík milli hópa. Ég myndi skoða kassarit eftir hópum og QQ-rit leifa. Ef forsendur bresta má log-umbreyta breytunni eða nota stikalaust próf (Kruskal–Wallis). Hóparnir eru nokkuð stórir, sem dregur úr áhrifum skekkjunnar á meðaltölin (CLT).</p>", rubric: ["Taldi upp forsendur ANOVA", "Benti á skekkju / útlaga í breytunni", "Nefndi að skoða kassarit og/eða QQ-rit", "Lagði til log-umbreytingu eða stikalaust próf"] },
        { out: ["pl_lm"], skill: "adhvarf", type: "pick", tok: "8.101", q: "Smelltu á hallatölu trefjaneyslu (<code>fiber</code>).", ex: "<p>Fyrir hvert gramm trefja á dag hækkar meðal beta-karótín um 8.1 ng/ml.</p>" },
        { out: ["pl_lm"], skill: "adhvarf", type: "num", q: "Staðfestu <code>t value</code> fyrir fiber með Estimate/Std. Error.", a: 4.295334, d: 3, tol: { abs: 0.003 }, r: "8.101 / 1.886", ex: "<p>8.101/1.886 = 4.295, sem passar við 4.296 í úttakinu (námundun).</p>" },
        { out: ["pl_lm"], skill: "adhvarf", type: "num", q: "Spáðu fyrir um beta-karótín hjá einstaklingi sem borðar 20 g af trefjum á dag.", a: 248.312, d: 1, tol: { abs: 0.1 }, r: "86.292 + 8.101 * 20", ex: "<p>ŷ = 86.292 + 8.101·20 = 248.3.</p>" },
        { out: ["pl_lm"], skill: "adhvarf", type: "mc", q: "Leifarnar ná frá −240.91 upp í 1170.23 og miðgildi þeirra er −44. Hvað bendir það til?", opts: ["Leifarnar eru hægri-skekktar og líklega ekki normaldreifðar; log-umbreyting á betaplasma gæti hjálpað", "Líkanið er fullkomið", "Sambandið er ekki línulegt", "R² er hátt", N], a: 0, ex: "<p>Í samhverfri dreifingu væru Min og Max álíka langt frá 0 og miðgildið nálægt 0.</p>" },
        { out: ["pl_lm"], skill: "tilgatur", type: "mc", q: "Sambandið er marktækt (p = 2.3·10⁻⁵) en R² = 0.056. Hvernig samræmist það?", opts: ["Marktækni segir að hallatalan sé líklega ekki 0, en trefjar skýra aðeins 5.6% breytileikans: tengslin eru raunveruleg en veik", "Það er mótsögn, eitthvað er rangt", "Lágt R² þýðir að niðurstaðan er ekki marktæk", "Hátt p-gildi", N], a: 0, ex: "<p>Með stóru n geta veik tengsl orðið marktæk.</p>" }
      ]
    },
    {
      id: "colon", t: "Ristilkrabbamein", badge: "R", data: "survival::colon",
      story: "Ein af fyrstu árangursríku rannsóknunum á viðbótarlyfjameðferð við ristilkrabbameini. Sjúklingum var slembiraðað í eftirlit (Obs), levamisól (Lev) eða levamisól + 5-FU. Atburðurinn er andlát; tími er í dögum.",
      skills: ["lifun"],
      steps: [
        { out: ["c_km"], km: "colon", skill: "lifun", type: "mc", q: "Lýstu Kaplan–Meier ferlunum. Hvað sést?", opts: ["Lev+5FU hópurinn hefur betri lifun en hinir tveir, en Obs og Lev eru nánast eins", "Allir hópar eru eins", "Lev hefur bestu lifunina", "Obs hefur bestu lifunina", N], a: 0, ex: "<p>Ferill Lev+5FU liggur ofan við hina frá u.þ.b. ári. Eftir 2000 daga eru 62% á lífi á móti 51%.</p>" },
        { out: ["c_km"], km: "colon", skill: "lifun", type: "num", q: "Hverjar eru metnar lifunarlíkur eftir 1000 daga í Lev+5FU hópnum?", a: 0.747, d: 3, tol: { abs: 0.003 }, r: "summary(km, times = 1000)", ex: "<p>0.747 (95% bil 0.699–0.797) á móti 0.672 í Obs.</p>" },
        { out: ["c_km"], km: "colon", skill: "lifun", type: "pick", tok: "2083", q: "Smelltu á miðgildi lifunartíma í eftirlitshópnum (Obs).", ex: "<p>Miðgildið er 2083 dagar (≈ 5.7 ár): þá hefur helmingurinn dáið. Á grafinu er það þar sem ferillinn sker 0.5.</p>" },
        { out: ["c_km"], km: "colon", skill: "lifun", type: "mc", q: "Af hverju er miðgildið <code>NA</code> hjá Lev+5FU?", opts: ["Lifunin fór aldrei niður fyrir 50% á eftirfylgnitímanum", "Enginn dó í hópnum", "Gögn vantar", "Hópurinn er of lítill", N], a: 0, ex: "<p>123 af 304 dóu, færri en helmingur, svo miðgildið er ekki metið. Neðri mörk bilsins (2725) eru þó skilgreind.</p>" },
        { out: ["c_cox"], skill: "lifun", type: "pick", tok: "0.688111", q: "Smelltu á áhættuhlutfallið (HR) fyrir Lev+5FU miðað við eftirlit.", ex: "<p>HR = 0.688 (leiðrétt fyrir aldri). exp(−coef) = 1.4533 er sama hlutfallið í hina áttina (eftirlit á móti Lev+5FU).</p>" },
        { out: ["c_cox"], skill: "lifun", type: "num", q: "Um hve mörg prósent breytist dánaráhættan með Lev+5FU? (Lækkun með mínusmerki.)", a: -31.1889, d: 1, tol: { abs: 0.2 }, unit: "%", r: "(0.688111 - 1) * 100", ex: "<p>(0.688 − 1)·100 = −31.2%: um 31% minni áhætta. 95% bil fyrir HR er [0.545, 0.869] og inniheldur ekki 1.</p>" },
        { out: ["c_cox"], skill: "lifun", type: "mc", q: "Hvað má segja um levamisól eitt sér (Lev)?", opts: ["Engin marktæk áhrif á lifun (HR = 0.97, p = 0.80, bil [0.78, 1.21] inniheldur 1)", "Það lækkar áhættu um 97%", "Það hækkar áhættu marktækt", "Það er jafn áhrifaríkt og Lev+5FU", N], a: 0, ex: "<p>Bilið inniheldur 1, svo engin marktæk áhrif.</p>" },
        { out: ["c_cox"], skill: "lifun", type: "mc", q: "HR fyrir aldur er 1.0024 (p = 0.558). Hvaða túlkun er rétt?", opts: ["Hvert aldursár eykur áhættu um 0.24%, en það er ekki marktækt", "Aldur tvöfaldar áhættu", "Eldri hafa 1.0024 sinnum lægri lifun á ári, marktækt", "Aldur var ekki í líkaninu", N], a: 0, ex: "<p>Samfelld breyta: HR á hverja einingu (ár).</p>" },
        { out: ["c_cox"], skill: "lifun", type: "mc", q: "Hver er líkanjafna Cox-líkansins?", opts: ["h(t) = h₀(t) · exp(−0.0275·Lev − 0.3738·Lev_5FU + 0.0024·aldur)", "h(t) = −0.0275·Lev − 0.3738·Lev_5FU + 0.0024·aldur", "S(t) = 0.97·Lev + 0.69·Lev_5FU", "log(p/(1 − p)) = −0.0275·Lev − 0.3738·Lev_5FU", N], a: 0, ex: "<p>Grunnáhættan h₀(t) er ómetin (enginn skurðpunktur), og stuðlarnir eru log-HR.</p>" },
        { out: ["c_km", "c_cox"], km: "colon", skill: "lifun", type: "write", q: "Skrifaðu stutta niðurstöðu: hefur meðferðin áhrif á lifun? Notaðu bæði Kaplan–Meier og Cox-úttakið.", model: "<p>Kaplan–Meier ferlarnir sýna að Lev+5FU hópurinn hefur betri lifun en eftirlitshópurinn og Lev hópurinn, sem eru nánast eins. Eftir 2000 daga eru 62% á lífi í Lev+5FU á móti 51% í Obs. Miðgildi lifunar er 2083 dagar í Obs en ekki náð í Lev+5FU. Í Cox-líkani, leiðrétt fyrir aldri, er HR fyrir Lev+5FU 0.69 (95% bil 0.55–0.87, p = 0.002), um 31% minni dánaráhætta. Lev eitt sér hefur ekki marktæk áhrif (HR 0.97, bil 0.78–1.21). Þar sem rannsóknin var slembiröðuð má álykta að Lev+5FU bæti lifun.</p>", rubric: ["Lýsti ferlunum (hver er bestur, hverjir eru eins)", "Nefndi tölur af ferlunum (lifun á tíma eða miðgildi)", "Túlkaði HR fyrir Lev+5FU með öryggisbili eða p-gildi", "Sagði að Lev eitt sér hafi ekki marktæk áhrif", "Tengdi slembival við orsakaályktun"] }
      ]
    }
  ];
  var BY = {}; CASES.forEach(function (c) { BY[c.id] = c; });

  // ---------- Kaplan–Meier graf ----------
  var STYLE = [
    { c: "var(--ink)", d: "" },
    { c: "var(--mag)", d: "" },
    { c: "var(--muted)", d: "6 4" }
  ];
  function kmPlot(which) {
    var km = window.KM[which];
    if (!km) return null;
    var keys = Object.keys(km);
    if (which === "colon") keys = ["rx=Obs", "rx=Lev", "rx=Lev+5FU"].filter(function (k) { return km[k]; });
    if (which === "fram") keys = ["hjarta=No CHD", "hjarta=CHD"].filter(function (k) { return km[k]; });
    var tmax = 0;
    keys.forEach(function (k) { var t = km[k].t; tmax = Math.max(tmax, t[t.length - 1]); });
    var W = 560, H = 300, L = 46, R = 14, T = 14, B = 40;
    var xs = function (t) { return L + (W - L - R) * t / tmax; }, ys = function (s) { return T + (H - T - B) * (1 - s); };
    var step = which === "colon" ? 500 : 5;
    var svg = '<svg class="km" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Kaplan–Meier lifunarferlar">';
    [0, 0.25, 0.5, 0.75, 1].forEach(function (s) {
      svg += '<line class="grid' + (s === 0.5 ? " half" : "") + '" x1="' + L + '" x2="' + (W - R) + '" y1="' + ys(s) + '" y2="' + ys(s) + '"/>';
      svg += '<text class="tick" x="' + (L - 6) + '" y="' + (ys(s) + 4) + '" text-anchor="end">' + s + "</text>";
    });
    for (var t = 0; t <= tmax; t += step) svg += '<text class="tick" x="' + xs(t) + '" y="' + (H - B + 16) + '" text-anchor="middle">' + t + "</text>";
    svg += '<text class="axl" x="' + ((L + W - R) / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + (which === "colon" ? "Dagar frá slembiröðun" : "Ár frá fyrstu skoðun") + "</text>";
    svg += '<line class="axis" x1="' + L + '" x2="' + L + '" y1="' + T + '" y2="' + (H - B) + '"/><line class="axis" x1="' + L + '" x2="' + (W - R) + '" y1="' + (H - B) + '" y2="' + (H - B) + '"/>';
    keys.forEach(function (k, i) {
      var d = km[k], p = "M" + xs(0) + "," + ys(1), prev = 1;
      for (var j = 0; j < d.t.length; j++) { p += "H" + xs(d.t[j]).toFixed(1) + "V" + ys(d.s[j]).toFixed(1); prev = d.s[j]; }
      p += "H" + xs(tmax);
      svg += '<path d="' + p + '" fill="none" stroke="' + STYLE[i].c + '" stroke-width="2.2"' + (STYLE[i].d ? ' stroke-dasharray="' + STYLE[i].d + '"' : "") + "/>";
    });
    svg += "</svg>";
    var leg = '<div class="km-leg">' + keys.map(function (k, i) {
      return '<span><svg width="26" height="10" aria-hidden="true"><line x1="0" x2="26" y1="5" y2="5" stroke="' + STYLE[i].c + '" stroke-width="2.4"' + (STYLE[i].d ? ' stroke-dasharray="' + STYLE[i].d + '"' : "") + "/></svg>" + esc(k.split("=")[1]) + "</span>";
    }).join("") + '<span class="muted">Brotalínan er 0.5 (miðgildi)</span></div>';
    var box = h("div", { class: "km-box" }, '<div class="km-head">Kaplan–Meier</div>' + svg + leg);
    return box;
  }

  window.Malin = { CASES: CASES, kmPlot: kmPlot };
})();

/* q/kafli09.js – spurningar fyrir kafla 9: Línulegt aðhvarf (efni: adhvarf).
 * Byggðar á verkefnum áfangans: lokapróf 2025 (dæmi 4, BMI og SYSBP í Framingham),
 * enska lokaprófið 2024 (dæmi 8, hæð og fótleggjalengd), fyrirlestradæmi kennsluviku 11
 * (Atli: hitastig og vettlingasala) og plasma-gögnunum. Orðalag fylgir prófunum. */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var T = "adhvarf";
  var LM = '<pre class="rcode">&gt; summary(lm(SYSBP ~ BMI, data = fr))\n\nCoefficients:\n            Estimate Std. Error t value Pr(&gt;|t|)\n(Intercept) 86.66684    2.02861   42.72   &lt;2e-16 ***\nBMI          1.78852    0.07752   23.07   &lt;2e-16 ***\n---\nResidual standard error: 21.12 on 4413 degrees of freedom\n  (19 observations deleted due to missingness)\nMultiple R-squared:  0.1076,\tAdjusted R-squared:  0.1074\nF-statistic: 532.3 on 1 and 4413 DF,  p-value: &lt; 2.2e-16</pre>';
  var CI = '<pre class="rcode">&gt; confint(fit)\n                2.5 %    97.5 %\n(Intercept) 82.689752 90.643923\nBMI          1.636546  1.940493</pre>';
  var PL = '<pre class="rcode">&gt; summary(lm(betaplasma ~ fiber, data = plasma))\n\nResiduals:\n    Min      1Q  Median      3Q     Max\n-240.91  -91.49  -44.01   31.72 1170.23\n\nCoefficients:\n            Estimate Std. Error t value Pr(&gt;|t|)\n(Intercept)   86.292     26.122   3.303  0.00107 **\nfiber          8.101      1.886   4.296 2.33e-05 ***\n---\nResidual standard error: 178.1 on 313 degrees of freedom\nMultiple R-squared:  0.05567,\tAdjusted R-squared:  0.05266\nF-statistic: 18.45 on 1 and 313 DF,  p-value: 2.327e-05</pre>';
  var FEM = '<pre class="rcode">&gt; summary(lm(haed ~ femur, data = gogn))\n\nCoefficients:\n            Estimate Std. Error t value Pr(&gt;|t|)\n(Intercept) 63.19815    6.78906   9.309 3.83e-15 ***\nfemur        1.47852    0.08964  16.493  &lt; 2e-16 ***\n---\nResidual standard error: 5.153 on 98 degrees of freedom\nMultiple R-squared:  0.7352,\tAdjusted R-squared:  0.7325\nF-statistic: 272 on 1 and 98 DF,  p-value: &lt; 2.2e-16</pre>';
  // Fyrirlestradæmi kennsluviku 11: Atli, hitastig og vettlingasala
  var ATLI = "<p>Atli telur að línulegt samband sé á milli hitastigs í Reykjavík og sölu á vettlingum í búðinni hans. Hann skráir hitastigið 7 handahófsvalda daga og heildarsölu á vettlingum sömu daga. Hitastigið var að meðaltali 4 gráður (staðalfrávik 3 gráður) og salan að meðaltali 28400 krónur (staðalfrávik 4920 krónur). Fylgnin milli vettlingasölu og hitastigs mældist −0.68.</p>";

  // ---------- Lokapróf 2025, dæmi 4: BMI og SYSBP ----------
  M(T, LM + "Hvert er línulega líkanið?",
    ["SYSBP = 86.67 + 1.789·BMI", "SYSBP = 1.789 + 86.67·BMI", "BMI = 86.67 + 1.789·SYSBP", "SYSBP = 2.029 + 0.0775·BMI"],
    "Estimate-dálkurinn gefur skurðpunktinn (Intercept) og hallatöluna fyrir BMI. Std. Error-dálkurinn eru staðalskekkjur, ekki stuðlar.");
  M(T, LM + "Hver er núlltilgátan og gagntilgátan fyrir BMI-stikann?",
    ["H₀: β<sub>BMI</sub> = 0; H₁: β<sub>BMI</sub> ≠ 0", "H₀: β<sub>BMI</sub> ≠ 0; H₁: β<sub>BMI</sub> = 0", "H₀: β̂<sub>BMI</sub> = 1.789; H₁: β̂<sub>BMI</sub> ≠ 1.789", "H₀: β<sub>BMI</sub> = 1; H₁: β<sub>BMI</sub> ≠ 1"],
    "H₀: β = 0 þýðir að ekkert línulegt samband sé milli BMI og SYSBP. Tilgátur eru um stika þýðisins (β), ekki matið β̂.");
  M(T, LM + "Hafnið þið núlltilgátunni? Hvaða ályktun er dregin (túlkið BMI-stikann)?",
    ["Já, p &lt; 2·10⁻¹⁶; fyrir hverja einingu sem BMI hækkar hækkar SYSBP að jafnaði um 1.79 mmHg", "Já, p &lt; 2·10⁻¹⁶; BMI skýrir 1.79% af breytileika SYSBP", "Nei, því R² er aðeins 0.11; BMI hefur ekki áhrif á SYSBP", "Já, p &lt; 2·10⁻¹⁶; SYSBP er 1.79 sinnum hærra hjá þeim sem hafa hærra BMI"],
    "t = 23.07 og p &lt; 2·10⁻¹⁶, svo við höfnum H₀. Hallatalan er vænt breyting á SYSBP fyrir einnar einingar hækkun á BMI. Lágt R² þýðir ekki að sambandið sé ómarktækt.");
  M(T, LM + "Notið líkanið til að spá fyrir um systólískan blóðþrýsting hjá manneskju sem er með 15 í BMI. Er þessi spá áreiðanleg? (BMI í gögnunum er á bilinu 15.54–56.8.)",
    ["Spáin er um 113.5 mmHg, en hún er ekki áreiðanleg: BMI = 15 er utan gagnasviðsins (bryggjun)", "Spáin er um 113.5 mmHg og hún er áreiðanleg, því p &lt; 2·10⁻¹⁶", "Spáin er um 26.8 mmHg; hún er ekki áreiðanleg", "Spáin er um 131.4 mmHg og hún er áreiðanleg, því líkanið er línulegt"],
    "ŷ = 86.67 + 1.789·15 = 113.5. Auk bryggjunar er leifastaðalfrávikið 21 mmHg, svo einstaklingsspár eru ónákvæmar. 26.8 fæst ef skurðpunktinum er sleppt.");
  M(T, LM + CI + "Hvert er 95% öryggisbilið fyrir matið á hallatölunni (stikanum sem lýsir sambandi BMI við SYSBP)?",
    ["[1.637, 1.940]", "[82.69, 90.64]", "[1.711, 1.866]", "[1.789, 1.940]"],
    "Úr <code>confint</code>, eða 1.78852 ± 1.9605·0.07752. [1.711, 1.866] fæst ef ±1·SE er notað í stað ±1.96·SE.");
  M(T, LM + "Hverjar eru forsendurnar fyrir línulegt aðhvarf? Hvaða upplýsingar vantar ykkur til að meta hvort þær standist?",
    ["Línulegt samband, óháðar og normaldreifðar leifar með jafna dreifni; til að meta það vantar punktarit, leifarit og normaldreifingarrit leifa", "Að BMI og SYSBP séu bæði normaldreifð; til þess vantar stuðlarit af hvorri breytu", "Að R² sé hærra en 0.5; til þess vantar ekkert því R² er í úttakinu", "Að skurðpunkturinn sé 0; til þess vantar öryggisbil skurðpunktsins"],
    "Forsendurnar eru um leifarnar, ekki breyturnar sjálfar. Punktarit sýnir línuleika, leifarit (residuals vs fitted) jafna dreifni og QQ-rit normaldreifingu leifa.");
  M(T, LM + "Hvað þýðir <code>Residual standard error: 21.12</code>?",
    ["Mælingar dreifast að jafnaði um 21 mmHg frá aðhvarfslínunni", "Staðalskekkja hallatölunnar er 21.12", "Meðalblóðþrýstingur er 21.12 mmHg", "21% breytileikans er óútskýrður"],
    "Það er mat á σ, staðalfráviki leifanna.");
  M(T, LM + "Hvað segir línan <code>F-statistic: 532.3 on 1 and 4413 DF</code>?",
    ["Hún prófar hvort líkanið í heild skýri marktækt meira en meðaltalið eitt", "Hún prófar hvort skurðpunkturinn sé marktækt frábrugðinn 0", "Hún prófar hvort leifarnar séu normaldreifðar", "Hún segir hve stór hluti breytileikans skýrist"],
    "Í einföldu aðhvarfi jafngildir F-prófið t-prófi hallatölunnar: F = t² = 23.07² ≈ 532.");

  // ---------- Enska lokaprófið 2024, dæmi 8: hæð og fótleggjalengd ----------
  M(T, FEM + "Hvert er línulega líkanið?",
    ["hæð = 63.20 + 1.479·fótleggjalengd", "hæð = 1.479 + 63.20·fótleggjalengd", "fótleggjalengd = 63.20 + 1.479·hæð", "hæð = 6.79 + 0.0896·fótleggjalengd"],
    "Estimate-dálkurinn gefur skurðpunkt og hallatölu.");
  M(T, FEM + "Hvert er hlutfall skýrðrar dreifni (R²)? Hvað þýðir það?",
    ["Um 74% af breytileikanum í hæð má útskýra með breytileika í fótleggjalengd", "Um 86% af breytileikanum í hæð má útskýra með fótleggjalengd", "Hæð hækkar um 74% fyrir hvern cm í fótleggjalengd", "Fylgnin milli hæðar og fótleggjalengdar er 0.74"],
    "R² = 0.7352. Fylgnin er √0.7352 = 0.857; 86% er því fylgnin, ekki R².");
  M(T, FEM + "Hve margir voru í gögnunum?",
    ["100", "98", "99", "101"],
    "Í einföldu aðhvarfi eru frígráður leifa n − 2 = 98.");
  M(T, FEM + "Hafnið þið núlltilgátunni um að ekkert línulegt samband sé milli hæðar og fótleggjalengdar? Hvaða ályktun er dregin?",
    ["Já; þegar fótleggjalengd eykst um 1 cm er hæðin að jafnaði um 1.5 cm meiri", "Já; hæð er 63 cm hærri fyrir hvern cm í fótleggjalengd", "Nei, því skurðpunkturinn er marktækur", "Nei, því p-gildið er minna en 0.05"],
    "p &lt; 2·10⁻¹⁶ &lt; 0.05, svo við höfnum H₀: β = 0 (lausn lokaprófsins 2024).");

  // ---------- Fyrirlestradæmi viku 11: Atli ----------
  M(T, ATLI + "Atli notar aðferð minnstu kvaðrata. Hvert er gildið á hallatölunni?",
    ["−1115.2", "1115.2", "−235.7", "0"],
    "b = r·s<sub>y</sub>/s<sub>x</sub> = −0.68·4920/3 = −1115.2. Hallatalan hefur alltaf sama formerki og fylgnin, svo hún getur ekki verið jákvæð hér.");
  M(T, ATLI + "Hvert er gildið á skurðpunktinum í líkaninu hans Atla?",
    ["32860.8", "23939.2", "28400", "1115.2"],
    "a = ȳ − b·x̄ = 28400 − (−1115.2)·4 = 32860.8. 23939.2 fæst ef formerkið á b gleymist.");
  M(T, ATLI + "Hversu mikið af breytileika í vettlingasölu má rekja til hitastigs úti?",
    ["Um 46%", "Um 68%", "Um −68%", "Það er ekki hægt að meta það út frá gefnum upplýsingum"],
    "R² = r² = (−0.68)² = 0.4624.");
  M(T, ATLI + "Hversu mikið breytist vettlingasalan þegar hitastigið hækkar um eina gráðu samkvæmt líkaninu?",
    ["Salan minnkar um 1115.2 krónur", "Salan eykst um 1115.2 krónur", "Salan minnkar um 235.7 krónur", "Salan breytist ekki"],
    "Hallatalan er −1115.2 krónur á gráðu.");
  M(T, ATLI + "Atli kannar hvort fylgni sé í raun milli vettlingasölu og hitastigs með tvíhliða tilgátuprófi (α = 0.05). Prófstærðin er −2.07 með 5 frígráðum. Hvaða ályktun dregur hann?",
    ["Hann getur ekki hafnað því að fylgnin sé 0 (p ≈ 0.09)", "Að fylgnin milli vettlingasölu og hitastigs sé ekki núll", "Að orsakasamband sé milli vettlingasölu og hitastigs", "Að fylgnin sé nákvæmlega −0.68 í þýðinu"],
    "t = r√(n − 2)/√(1 − r²) = −2.07; gagnrýnið gildi er t<sub>0.975; 5</sub> = 2.571 og p = 2·P(T<sub>5</sub> &lt; −2.07) = 0.093. Með aðeins 7 mælingum er styrkurinn lítill.");

  // ---------- Plasma ----------
  M(T, PL + "Hvað bendir dreifing leifanna (Min −240.91, Median −44.01, Max 1170.23) til?",
    ["Leifarnar eru hægri-skekktar, svo forsendan um normaldreifðar leifar stenst illa", "Leifarnar eru samhverfar, svo forsendan um normaldreifðar leifar stenst vel", "Leifarnar eru vinstri-skekktar vegna nokkurra mjög lágra gilda", "Leifarnar sýna að sambandið er ekki línulegt"],
    "Miðgildið ætti að vera nálægt 0 og fjórðungamörkin samhverf. Log-umbreyting á betaplasma gæti hjálpað.");
  M(T, PL + "Túlkið hallatöluna 8.101.",
    ["Fyrir hvert gramm af trefjum til viðbótar er betakarótín í blóði að jafnaði 8.1 ng/ml hærra", "Trefjar skýra 8.1% af breytileika betakarótíns í blóði", "Betakarótín í blóði hækkar um 8.1% fyrir hvert gramm af trefjum", "Betakarótín í blóði er 8.1 ng/ml þegar trefjaneysla er engin"],
    "p = 2.33·10⁻⁵, svo sambandið er marktækt, en R² = 0.056 er lágt.");

  // ---------- Hugtök ----------
  M(T, "Í leifariti (leifar á móti spágildum) er U-laga mynstur. Hvaða forsenda bregst?",
    ["Línulegt samband", "Jöfn dreifni leifa", "Óháðar leifar", "Normaldreifing skýribreytu"],
    "Bogalaga mynstur þýðir að beina línan nær ekki sambandinu. Bæta má við x² eða umbreyta.");
  M(T, "Hvað er leif (residual) einstaklings?",
    ["Mælt gildi mínus spágildi, e = y − ŷ", "Spágildi mínus mælt gildi, e = ŷ − y", "Spágildi mínus meðaltal, ŷ − ȳ", "Mælt gildi mínus meðaltal, y − ȳ"],
    "Aðferð minnstu kvaðrata velur línuna sem lágmarkar Σe².");
  M(T, "Aðhvarfslína metin með aðferð minnstu kvaðrata fer alltaf í gegnum punktinn:",
    ["(x̄, ȳ)", "(0, 0)", "(0, ȳ)", "(x̄, 0)"],
    "Það leiðir af því að skurðpunkturinn er a = ȳ − b·x̄.");
  M(T, "Hvernig tengjast fylgnistuðull r og hallatala b í einföldu línulegu aðhvarfi?",
    ["b = r·s<sub>y</sub>/s<sub>x</sub>", "b = r·s<sub>x</sub>/s<sub>y</sub>", "b = r", "b = r²"],
    "b og r hafa því alltaf sama formerki, og ef r = 0 er b = 0.");
  M(T, "Í gögnunum er sterk fylgni milli ísasölu og drukknana. Hvað er rétt?",
    ["Fylgnin sannar ekki orsakasamband; hlýtt veður getur skýrt hvort tveggja", "Ísát eykur hættu á drukknun, því fylgnin er sterk", "Fylgnin sannar orsakasamband ef hún er marktæk", "Fylgnin er líklega tilviljun og má hunsa"],
    "Hiti er blöndunarbreyta: fleiri kaupa ís og fleiri synda.");
  M(T, "Hvaða skipun spáir fyrir um SYSBP við BMI = 25 úr líkaninu <code>fit</code>?",
    ["<code>predict(fit, data.frame(BMI = 25))</code>", "<code>predict(fit, 25)</code>", "<code>fitted(fit)[25]</code>", "<code>coef(fit) * 25</code>"],
    "Nýju gildin þurfa að vera í data.frame með sama nafni og skýribreytan. <code>fitted(fit)[25]</code> er spágildi 25. mælingarinnar.");

  // ---------- Reiknidæmi ----------
  // Fyrirlestradæmi viku 11, spurning 1: hallatala úr meðaltölum, staðalfrávikum og fylgni
  B.G.push(function lmAtliSlope() {
    var n = rnd(6, 12), mx = rnd(1, 8), sx = rnd(2, 5), my = rnd(200, 400) * 100, sy = rnd(30, 70) * 100, r = -rnd(40, 90) / 100;
    var b = r * sy / sx;
    return { topic: T, title: "Hallatala með aðferð minnstu kvaðrata", unit: "kr. á gráðu", tol: 0.002, answer: b,
      text: "<p>Atli skráir hitastigið í Reykjavík " + n + " handahófsvalda daga og heildarsölu á vettlingum sömu daga. Hitastigið var að meðaltali " + mx + " gráður (staðalfrávik " + sx + " gráður) og salan að meðaltali " + my + " krónur (staðalfrávik " + sy + " krónur). Fylgnin milli vettlingasölu og hitastigs mældist " + r + ". Atli notar aðferð minnstu kvaðrata til að meta aðhvarfslínu. Hvert er gildið á hallatölunni?</p>",
      sol: "<p>b = r·s<sub>y</sub>/s<sub>x</sub> = " + r + "·" + sy + "/" + sx + " = " + f(b, 2) + " krónur á gráðu: salan minnkar um " + f(-b, 1) + " krónur fyrir hverja gráðu sem hitastigið hækkar.</p><pre class=\"rcode\">" + r + " * " + sy + " / " + sx + "</pre>" };
  });
  // Fyrirlestradæmi viku 11, spurning 2: skurðpunktur
  B.G.push(function lmAtliIntercept() {
    var mx = rnd(1, 8), sx = rnd(2, 5), my = rnd(200, 400) * 100, sy = rnd(30, 70) * 100, r = -rnd(40, 90) / 100;
    var b = r * sy / sx, a = my - b * mx;
    return { topic: T, title: "Skurðpunktur aðhvarfslínu", unit: "kr.", tol: 0.001, answer: a,
      text: "<p>Hitastig var að meðaltali " + mx + " gráður (staðalfrávik " + sx + ") og vettlingasala að meðaltali " + my + " krónur (staðalfrávik " + sy + "). Fylgnin er " + r + ". Hvert er gildið á skurðpunktinum í aðhvarfslínunni (sala ~ hitastig)?</p>",
      sol: "<p>Fyrst hallatalan: b = " + r + "·" + sy + "/" + sx + " = " + f(b, 2) + ". Línan fer í gegnum (x̄, ȳ), svo a = ȳ − b·x̄ = " + my + " − (" + f(b, 2) + ")·" + mx + " = " + f(a, 1) + ".</p><pre class=\"rcode\">b &lt;- " + r + " * " + sy + " / " + sx + "\n" + my + " - b * " + mx + "</pre>" };
  });
  // Fyrirlestradæmi viku 11, spurning 5: prófstærð fyrir fylgni
  B.G.push(function corTestT() {
    var n = rnd(7, 30), r = (Math.random() < 0.5 ? -1 : 1) * rnd(30, 80) / 100;
    var t = r * Math.sqrt(n - 2) / Math.sqrt(1 - r * r), p = 2 * S.pt(-Math.abs(t), n - 2);
    return { topic: T, title: "Tilgátupróf fyrir fylgni", unit: "", tol: 0.002, answer: t,
      text: "<p>Fylgni milli tveggja breyta í úrtaki af stærð n = " + n + " mældist r = " + r + ". Kannið með tvíhliða tilgátuprófi hvort fylgnin sé í raun frábrugðin 0. Hver er prófstærðin t?</p>",
      sol: "<p>H₀: ρ = 0. t = r√(n − 2)/√(1 − r²) = " + r + "·√" + (n - 2) + "/√(1 − " + f(r * r, 4) + ") = " + f(t, 3) + " með " + (n - 2) + " frígráðum. p = " + f(p) + ", svo " + (p < 0.05 ? "við höfnum H₀: fylgnin er marktækt frábrugðin 0." : "við getum ekki hafnað H₀ við α = 0.05.") + "</p><pre class=\"rcode\">t &lt;- " + r + " * sqrt(" + (n - 2) + ") / sqrt(1 - " + r + "^2)\n2 * pt(-abs(t), df = " + (n - 2) + ")</pre>" };
  });
  // Lokapróf 2025, dæmi 4: leif einstaklings í Framingham-líkaninu
  B.G.push(function lmResidual() {
    var a = 86.66684, b = 1.78852, x = rnd(180, 360) / 10, y = Math.round(a + b * x + rnd(-30, 30));
    var e = y - (a + b * x);
    return { topic: T, title: "Leif einstaklings", unit: "mmHg", tol: 0.001, absTol: 0.02, answer: e,
      text: "<p>Línulega líkanið er SYSBP = 86.66684 + 1.78852·BMI. Einstaklingur með BMI = " + x + " mælist með SYSBP = " + y + " mmHg. Hver er leifin hans (y − ŷ)?</p>",
      sol: "<p>ŷ = 86.66684 + 1.78852·" + x + " = " + f(a + b * x, 3) + ". Leifin er " + y + " − " + f(a + b * x, 3) + " = " + f(e, 3) + " mmHg.</p><pre class=\"rcode\">" + y + " - (86.66684 + 1.78852 * " + x + ")</pre>" };
  });
})();

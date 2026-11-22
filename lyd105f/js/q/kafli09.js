/* q/kafli09.js – aukaspurningar fyrir kafla 9: Línulegt aðhvarf (efni: adhvarf). */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var T = "adhvarf";
  var LM = '<pre class="rcode">&gt; summary(lm(SYSBP ~ BMI, data = fr))\n\nCoefficients:\n            Estimate Std. Error t value Pr(&gt;|t|)\n(Intercept) 86.66684    2.02861   42.72   &lt;2e-16 ***\nBMI          1.78852    0.07752   23.07   &lt;2e-16 ***\n---\nResidual standard error: 21.12 on 4413 degrees of freedom\n  (19 observations deleted due to missingness)\nMultiple R-squared:  0.1076,\tAdjusted R-squared:  0.1074\nF-statistic: 532.3 on 1 and 4413 DF,  p-value: &lt; 2.2e-16</pre>';
  var PL = '<pre class="rcode">&gt; summary(lm(betaplasma ~ fiber, data = plasma))\n\nResiduals:\n    Min      1Q  Median      3Q     Max\n-240.91  -91.49  -44.01   31.72 1170.23\n\nCoefficients:\n            Estimate Std. Error t value Pr(&gt;|t|)\n(Intercept)   86.292     26.122   3.303  0.00107 **\nfiber          8.101      1.886   4.296 2.33e-05 ***\n---\nResidual standard error: 178.1 on 313 degrees of freedom\nMultiple R-squared:  0.05567,\tAdjusted R-squared:  0.05266\nF-statistic: 18.45 on 1 and 313 DF,  p-value: 2.327e-05</pre>';
  var FEM = '<pre class="rcode">&gt; summary(lm(haed ~ femur, data = gogn))\n\nCoefficients:\n            Estimate Std. Error t value Pr(&gt;|t|)\n(Intercept) 63.19815    6.78906   9.309 3.83e-15 ***\nfemur        1.47852    0.08964  16.493  &lt; 2e-16 ***\n---\nResidual standard error: 5.153 on 98 degrees of freedom\nMultiple R-squared:  0.7352,\tAdjusted R-squared:  0.7325\nF-statistic: 272 on 1 and 98 DF,  p-value: &lt; 2.2e-16</pre>';

  M(T, FEM + "Hvert er línulega líkanið?",
    ["hæð = 63.20 + 1.479·fótleggjalengd", "hæð = 1.479 + 63.20·fótleggjalengd", "fótleggjalengd = 63.20 + 1.479·hæð", "hæð = 6.79 + 0.0896·fótleggjalengd"],
    "Estimate-dálkurinn gefur skurðpunkt og hallatölu (enska prófið 2024, dæmi 8).");
  M(T, FEM + "Hve stór hluti breytileikans í hæð skýrist af fótleggjalengd?",
    ["Um 74% (R² = 0.7352)", "Um 1.5%", "Um 5%", "Um 27%"],
    "R² = 0.7352.");
  M(T, FEM + "Hve margir voru í gögnunum?",
    ["100 (frígráður leifa 98 = n − 2)", "98", "272", "99"],
    "Í einföldu aðhvarfi eru frígráður leifa n − 2.");
  M(T, LM + "Hvað þýðir <code>Residual standard error: 21.12</code>?",
    ["Mælingar dreifast að jafnaði um 21 mmHg frá aðhvarfslínunni", "Staðalskekkja hallatölunnar", "Meðalblóðþrýstingur er 21.12", "21% breytileikans er óútskýrður"],
    "Það er mat á σ, staðalfráviki leifanna.");
  M(T, LM + "Hvað segir línan <code>F-statistic: 532.3 on 1 and 4413 DF</code>?",
    ["Hún prófar hvort líkanið skýri marktækt meira en meðaltalið eitt; í einföldu aðhvarfi jafngildir hún t-prófi hallatölunnar (F = t² = 23.07²)", "Hún prófar hvort skurðpunkturinn sé 0", "Hún prófar normaldreifingu leifa", "Hún gefur R²"],
    "23.07² ≈ 532.");
  M(T, PL + "Hvað bendir dreifing leifanna (Min −240.91, Median −44.01, Max 1170.23) til?",
    ["Leifarnar eru mjög hægri-skekktar, svo forsendan um normaldreifðar leifar stenst illa", "Leifarnar eru fullkomlega normaldreifðar", "Líkanið passar mjög vel", "Það vantar gögn"],
    "Miðgildið ætti að vera nálægt 0 og fjórðungamörkin samhverf. Log-umbreyting á betaplasma gæti hjálpað.");
  M(T, PL + "Hvernig túlkar þú hallatöluna 8.101?",
    ["Fyrir hvert gramm af trefjum til viðbótar á dag er betakarótín í blóði að jafnaði 8.1 ng/ml hærra", "Trefjar skýra 8.1% af breytileikanum", "Betakarótín er 8.1 sinnum hærra", "Hallatalan er ekki marktæk"],
    "p = 2.33·10⁻⁵, svo hún er marktæk, en R² = 0.056 er lágt.");
  M(T, "Í leifariti (residuals vs fitted) er mynstur U-laga boga. Hvaða forsenda bregst?",
    ["Línulegt samband", "Jöfn dreifni", "Óháðar mælingar", "Normaldreifing skýribreytu"],
    "Bogalaga mynstur þýðir að beina línan nær ekki sambandinu. Bæta má við x² eða umbreyta.");
  M(T, "Hvaða graf er notað til að meta hvort leifar séu normaldreifðar?",
    ["Normal Q–Q graf (<code>plot(fit, which = 2)</code>)", "Kassarit af x", "Kökurit", "Punktarit af y á móti x"],
    "Punktarnir eiga að falla nálægt beinni línu.");
  M(T, "Hvað er leif (residual) einstaklings?",
    ["Mælt gildi mínus spágildi: e = y − ŷ", "Spágildi mínus meðaltal", "Hallatalan", "Staðalskekkja"],
    "Aðferð minnstu kvaðrata velur línuna sem lágmarkar Σe².");
  M(T, "Aðhvarfslína fer alltaf í gegnum punktinn:",
    ["(x̄, ȳ)", "(0, 0)", "(0, ȳ)", "(x̄, 0)"],
    "Það leiðir af því að skurðpunkturinn er a = ȳ − b·x̄.");
  M(T, "Hvað er skurðpunkturinn (Intercept) í <code>lm(SYSBP ~ BMI)</code>, og er hann gagnlegur?",
    ["Spáður blóðþrýstingur við BMI = 0; hann hefur enga raunhæfa túlkun því BMI = 0 er ekki til", "Meðalblóðþrýstingur allra", "Breyting fyrir hverja einingu BMI", "R²"],
    "Skurðpunkturinn er oft utan gagnasviðsins og þarf ekki að túlka.");
  M(T, "Hvaða núlltilgáta er prófuð í línu BMI í <code>summary(lm)</code>?",
    ["H₀: β<sub>BMI</sub> = 0 (ekkert línulegt samband)", "H₀: β<sub>BMI</sub> = 1", "H₀: R² = 1", "H₀: skurðpunkturinn er 0"],
    "t = Estimate/Std. Error prófar hvort hallatalan sé 0.");
  M(T, "Hvernig tengjast fylgnistuðull r og hallatala b í einföldu aðhvarfi?",
    ["b = r·s<sub>y</sub>/s<sub>x</sub>; þau hafa alltaf sama formerki", "b = r", "b = 1/r", "Engin tengsl"],
    "Ef r = 0 er b = 0.");
  M(T, "Hvaða R-skipun gefur 95% öryggisbil fyrir stuðla líkansins <code>fit</code>?",
    ["<code>confint(fit)</code>", "<code>summary(fit)$r.squared</code>", "<code>predict(fit)</code>", "<code>anova(fit)</code>"],
    "<code>confint</code> notar Estimate ± t<sub>0.975, df</sub>·SE.");
  M(T, "Hvaða skipun spáir fyrir um SYSBP við BMI = 25 úr líkaninu <code>fit</code>?",
    ["<code>predict(fit, data.frame(BMI = 25))</code>", "<code>fit(25)</code>", "<code>lm(25)</code>", "<code>summary(fit, 25)</code>"],
    "Með <code>interval = \"prediction\"</code> fæst spábil fyrir einstakling.");
  M(T, "Í gögnunum er sterk fylgni milli ísasölu og drukknana. Hvað er rétt?",
    ["Fylgni sannar ekki orsakasamband; þriðja breytan (hiti/sumar) skýrir hvort tveggja", "Ísát veldur drukknunum", "Drukknanir valda ísáti", "Fylgnin hlýtur að vera reikningsvilla"],
    "Klassískt dæmi um blöndunarbreytu.");
  M(T, "Einn útlagi með mjög hátt x-gildi getur:",
    ["Haft mikil áhrif á hallatöluna (vogarafl, leverage)", "Engin áhrif haft", "Aðeins haft áhrif á skurðpunktinn", "Lækkað n"],
    "Punktar langt frá x̄ hafa mest vogarafl; skoðaðu punktaritið.");
  M(T, "Leiðrétt R² (Adjusted R-squared) er:",
    ["R² leiðrétt fyrir fjölda skýribreyta; refsar fyrir óþarfa breytur", "Alltaf stærra en R²", "Sama og fylgnistuðullinn", "p-gildi líkansins"],
    "Í einföldu aðhvarfi með stórt n er munurinn lítill.");
  M(T, "Ef skýribreytan er flokkabreyta með tveimur flokkum (t.d. kyn), hvað mælir hallatalan í <code>lm(y ~ kyn)</code>?",
    ["Mun á meðaltali y milli flokkanna", "Fylgni", "Hlutfall í hvorum flokki", "Ekkert, lm virkar ekki"],
    "R býr til vísibreytu (0/1). Prófið jafngildir t-prófi með jafnri dreifni.");

  // ---------- Reiknidæmi ----------
  B.G.push(function lmSlope() {
    var r = rnd(30, 90) / 100 * (Math.random() < 0.8 ? 1 : -1), sx = rnd(30, 60) / 10, sy = rnd(100, 250) / 10;
    var b = r * sy / sx;
    return { topic: T, title: "Hallatala úr fylgni", unit: "", tol: 0.003, answer: b,
      text: "<p>Fylgni milli BMI og blóðþrýstings er r = " + r + ". Staðalfrávik BMI er s<sub>x</sub> = " + sx + " og blóðþrýstings s<sub>y</sub> = " + sy + " mmHg. Reiknaðu hallatölu aðhvarfslínunnar.</p>",
      sol: "<p>b = r·s<sub>y</sub>/s<sub>x</sub> = " + r + "·" + sy + "/" + sx + " = " + f(b, 4) + ".</p><pre class=\"rcode\">" + r + " * " + sy + " / " + sx + "</pre>" };
  });
  B.G.push(function lmResidual() {
    var a = 86.66684, b = 1.78852, x = rnd(180, 360) / 10, y = Math.round(a + b * x + rnd(-30, 30));
    var e = y - (a + b * x);
    return { topic: T, title: "Leif einstaklings", unit: "mmHg", tol: 0.001, absTol: 0.02, answer: e,
      text: "<p>Líkanið er SYSBP = 86.66684 + 1.78852·BMI. Einstaklingur með BMI = " + x + " mælist með SYSBP = " + y + " mmHg. Hver er leifin hans (y − ŷ)?</p>",
      sol: "<p>ŷ = 86.66684 + 1.78852·" + x + " = " + f(a + b * x, 3) + ". Leifin er " + y + " − " + f(a + b * x, 3) + " = " + f(e, 3) + ".</p><pre class=\"rcode\">" + y + " - (86.66684 + 1.78852 * " + x + ")</pre>" };
  });
})();

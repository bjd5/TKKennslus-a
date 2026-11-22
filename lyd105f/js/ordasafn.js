/* ordasafn.js – leitarhæft orðasafn áfangans: [íslenska, enska, kafli, skýring]. */
(function () {
  "use strict";
  var CH = { 1: "Rannsóknir, breytur og úrtök", 2: "Lýsandi tölfræði og gröf", 3: "Líkur: tvíkosta og Poisson", 4: "Normaldreifing og CLT", 5: "Öryggisbil", 6: "Tilgátupróf og t-próf", 7: "Hlutföll og tengslatöflur", 8: "Fervikagreining", 9: "Línulegt aðhvarf", 10: "Tvíkosta aðhvarf, næmi og sértæki", 11: "Lifunargreining" };
  var T = [
    ["Þýði", "population", 1, "Allur hópurinn sem við viljum álykta um, t.d. allir fullorðnir Íslendingar."],
    ["Úrtak", "sample", 1, "Sá hluti þýðisins sem er mældur."],
    ["Stiki", "parameter", 1, "Óþekkt tala sem lýsir þýðinu, t.d. μ, σ eða p."],
    ["Lýsistærð", "statistic", 1, "Tala reiknuð úr úrtaki, t.d. x̄ eða p̂; notuð sem mat á stika."],
    ["Breyta", "variable", 1, "Eiginleiki sem er mældur og getur tekið mismunandi gildi."],
    ["Flokkabreyta", "categorical variable", 1, "Breyta sem tekur gildi í flokkum, t.d. kyn eða blóðflokkur."],
    ["Óröðuð flokkabreyta", "nominal variable", 1, "Flokkabreyta án náttúrulegrar röðunar, t.d. blóðflokkur."],
    ["Röðuð flokkabreyta", "ordinal variable", 1, "Flokkabreyta með náttúrulega röð, t.d. hæsta prófgráða."],
    ["Talnabreyta", "numerical variable", 1, "Breyta með tölugildi sem hægt er að reikna með."],
    ["Strjál breyta", "discrete variable", 1, "Talnabreyta sem tekur aðgreind gildi, oft talning (0, 1, 2, …)."],
    ["Samfelld breyta", "continuous variable", 1, "Talnabreyta sem getur tekið öll gildi á bili, t.d. blóðþrýstingur."],
    ["Svarbreyta", "response variable", 1, "Útkoman sem við viljum skýra (y)."],
    ["Skýribreyta", "explanatory variable", 1, "Breytan sem notuð er til að skýra svarbreytuna (x)."],
    ["Tilraun", "experiment", 1, "Rannsókn þar sem rannsakandi ákveður meðferð þátttakenda."],
    ["Stýrð tilraun", "controlled experiment", 1, "Tilraun með samanburðarhópi, t.d. lyfleysuhópi."],
    ["Athugunarrannsókn", "observational study", 1, "Rannsókn þar sem aðeins er fylgst með, engin meðferð ákveðin."],
    ["Slembival", "randomization", 1, "Meðferð úthlutað með tilviljun (t.d. krónukasti); jafnar út aðra þætti."],
    ["Blindun", "blinding", 1, "Að þátttakendur og/eða rannsakendur viti ekki hver fær hvaða meðferð."],
    ["Einblind rannsókn", "single-blind trial", 1, "Þátttakendur vita ekki hvaða meðferð þeir fá."],
    ["Tvíblind rannsókn", "double-blind trial", 1, "Hvorki þátttakendur né rannsakendur/matsmenn vita hver fær hvað."],
    ["Lyfleysa", "placebo", 1, "Óvirk meðferð sem lítur eins út og sú virka."],
    ["Lyfleysuáhrif", "placebo effect", 1, "Bati sem stafar af því einu að fá meðferð."],
    ["Bjagi", "bias", 1, "Kerfisbundin skekkja sem hliðrar niðurstöðum í eina átt."],
    ["Úrtaksbjagi", "sampling bias", 1, "Úrtakið er ekki lýsandi fyrir þýðið."],
    ["Rannsakandabjagi", "experimenter's bias", 1, "Væntingar rannsakanda lita mælingar eða mat."],
    ["Blöndun", "confounding", 1, "Þriðja breyta tengist bæði skýri- og svarbreytu og skekkir tengslin."],
    ["Orsakasamband", "causation", 1, "Breyting í x veldur breytingu í y; krefst helst slembiraðaðrar tilraunar."],
    ["Einfalt slembiúrtak", "simple random sample", 1, "Allir í þýðinu jafn líklegir til að lenda í úrtakinu."],
    ["Lagskipt slembiúrtak", "stratified random sample", 1, "Þýði skipt í lög og slembiúrtak tekið úr hverju lagi."],
    ["Aðgengisúrtak", "convenience sample", 1, "Þeir valdir sem auðvelt er að ná til; hætta á bjaga."],
    ["Sjálfboðaliðaúrtak", "voluntary response sample", 1, "Fólk velur sig sjálft í úrtakið, t.d. netkönnun."],
    ["Vöntun mælinga", "missing values", 1, "Mælingar sem vantar; NA í R."],
    ["Lýsandi tölfræði", "descriptive statistics", 2, "Að lýsa gögnum með tölum og gröfum."],
    ["Meðaltal", "mean", 2, "Summa gilda deilt með fjölda, x̄."],
    ["Miðgildi", "median", 2, "Miðjugildi raðaðra gagna; ónæmt fyrir útlögum."],
    ["Tíðasta gildi", "mode", 2, "Algengasta gildið."],
    ["Spönn", "range", 2, "Hæsta gildi mínus lægsta gildi."],
    ["Dreifni", "variance", 2, "Meðalkvaðratfrávik frá meðaltali, s² (deilt með n − 1)."],
    ["Staðalfrávik", "standard deviation", 2, "Kvaðratrót dreifninnar, s; í sömu einingum og gögnin."],
    ["Fjórðungamörk", "quartiles", 2, "Q1 og Q3: 25% og 75% prósentumörk."],
    ["Fjórðungaspönn", "interquartile range (IQR)", 2, "Q3 − Q1; breidd miðju 50% gagnanna."],
    ["Prósentumark", "percentile / quantile", 2, "Gildi sem tiltekið hlutfall gagna er fyrir neðan."],
    ["Frávikshlutfall", "coefficient of variation", 2, "Staðalfrávik deilt með meðaltali."],
    ["Útlagi", "outlier", 2, "Gildi sem sker sig úr; í kassariti utan 1.5·IQR frá kassanum."],
    ["Skekkja dreifingar", "skewness", 2, "Ósamhverfa; hægri-skekkt: langur hali upp, meðaltal > miðgildi."],
    ["Stöplarit", "bar chart", 2, "Graf af tíðni flokka."],
    ["Kökurit", "pie chart", 2, "Hringlaga graf af hlutföllum flokka."],
    ["Stuðlarit", "histogram", 2, "Graf af dreifingu talnabreytu í bilum."],
    ["Kassarit", "boxplot", 2, "Sýnir miðgildi, fjórðungamörk og útlaga; gott til að bera saman hópa."],
    ["Punktarit", "scatter plot", 2, "Graf tveggja talnabreyta, x á móti y."],
    ["Slembistærð", "random variable", 3, "Tala sem ræðst af tilviljun, t.d. fjöldi sjúklinga á klukkutíma."],
    ["Líkindadreifing", "probability distribution", 3, "Lýsir hvaða gildi slembistærð getur tekið og með hvaða líkum."],
    ["Massafall", "probability mass function", 3, "P(X = k) fyrir strjála slembistærð; d-föll í R."],
    ["Dreififall", "cumulative distribution function", 3, "P(X ≤ x); p-föll í R."],
    ["Væntigildi", "expected value", 3, "Meðalgildi slembistærðar til lengdar, E[X]."],
    ["Bernoulli-tilraun", "Bernoulli trial", 3, "Tilraun með tvær útkomur, árangur eða ekki."],
    ["Tvíkostadreifing", "binomial distribution", 3, "Fjöldi árangra í n óháðum tilraunum með líkur p; Bin(n, p)."],
    ["Tvíliðustuðull", "binomial coefficient", 3, "Fjöldi leiða til að velja k af n, (n yfir k)."],
    ["Poisson-dreifing", "Poisson distribution", 3, "Fjöldi atburða á tímabili með meðalfjölda λ."],
    ["Óháðar og einsdreifðar", "independent and identically distributed (iid)", 3, "Mælingar sem hafa ekki áhrif hver á aðra og fylgja sömu dreifingu."],
    ["Normaldreifing", "normal distribution", 4, "Samhverf bjöllulaga dreifing, N(μ, σ²)."],
    ["Stöðluð normaldreifing", "standard normal distribution", 4, "N(0, 1); z-gildi."],
    ["Þéttifall", "density function", 4, "Lýsir samfelldri dreifingu; flatarmál undir því eru líkur."],
    ["z-gildi", "z-score", 4, "(x − μ)/σ: hve mörg staðalfrávik frá meðaltali."],
    ["Úrtaksdreifing lýsistærðar", "sampling distribution", 4, "Dreifing lýsistærðar (t.d. x̄) yfir endurtekin úrtök."],
    ["Staðalskekkja", "standard error", 4, "Staðalfrávik metils, t.d. SE(x̄) = σ/√n."],
    ["Höfuðsetning tölfræðinnar", "central limit theorem", 4, "Meðaltal stórs úrtaks er nálgunarlega normaldreift, X̄ ≈ N(μ, σ²/n)."],
    ["Lögmál mikils fjölda", "law of large numbers", 4, "Úrtaksmeðaltalið nálgast μ þegar n stækkar."],
    ["Línuleg umbreyting", "linear transformation", 4, "Y = a + bX; meðaltal og staðalfrávik breytast á fyrirsjáanlegan hátt."],
    ["Ályktunartölfræði", "inferential statistics", 5, "Að álykta um þýði út frá úrtaki."],
    ["Metill", "estimator", 5, "Regla sem gefur mat á stika, t.d. x̄ fyrir μ."],
    ["Punktmat", "point estimate", 5, "Ein tala sem mat á stika, t.d. p̂ = 0.22."],
    ["Öryggisbil", "confidence interval", 5, "Bil sem inniheldur sanna stikann í (1 − α)·100% endurtekinna úrtaka."],
    ["Öryggi", "confidence level", 5, "Hlutfall bila sem innihalda sanna gildið, t.d. 95%."],
    ["Öryggismörk", "confidence limits", 5, "Neðri og efri endi öryggisbils."],
    ["Vikmörk", "margin of error", 5, "Hálf breidd öryggisbils, t.d. 1.96·SE."],
    ["t-dreifing", "t-distribution", 5, "Samhverf dreifing með þykkari hala en normal; notuð þegar σ er metið með s."],
    ["Frígráður", "degrees of freedom", 5, "Stiki t-, χ²- og F-dreifinga, t.d. n − 1."],
    ["Tilgáta", "hypothesis", 6, "Fullyrðing um stika þýðis."],
    ["Tilgátupróf", "hypothesis test", 6, "Aðferð til að meta hvort gögnin samrýmist núlltilgátu."],
    ["Núlltilgáta", "null hypothesis (H₀)", 6, "Tilgátan um engin áhrif eða engan mun, t.d. μ₁ = μ₂."],
    ["Gagntilgáta", "alternative hypothesis (H₁)", 6, "Það sem við viljum sýna, t.d. μ₁ ≠ μ₂."],
    ["Prófstærð", "test statistic", 6, "Tala reiknuð úr gögnum sem mælir frávik frá H₀, t.d. t eða χ²."],
    ["p-gildi", "p-value", 6, "Líkur á jafn öfgafullri eða öfgafyllri prófstærð ef H₀ er sönn."],
    ["Marktektarkrafa", "significance level (α)", 6, "Mörkin sem p-gildið er borið saman við, oftast 0.05."],
    ["Hafna", "reject", 6, "Að hafna H₀ þegar p < α."],
    ["Höfnunarsvæði", "rejection region", 6, "Gildi prófstærðar sem leiða til höfnunar H₀."],
    ["Einhliða tilgátupróf", "one-sided test", 6, "Gagntilgáta í eina átt, t.d. μ > 4."],
    ["Tvíhliða tilgátupróf", "two-sided test", 6, "Gagntilgáta í báðar áttir, μ ≠ μ₀."],
    ["Villa af gerð I", "type I error", 6, "Að hafna sannri H₀ (falsk jákvæð niðurstaða); líkur α."],
    ["Villa af gerð II", "type II error", 6, "Að hafna ekki ósannri H₀ (missa af raunverulegum mun); líkur β."],
    ["Styrkur", "power", 6, "Líkur á að hafna H₀ þegar hún er ósönn, 1 − β."],
    ["t-próf", "t-test", 6, "Próf um meðaltöl sem byggir á t-dreifingu."],
    ["Parað t-próf", "paired t-test", 6, "t-próf á mismun tveggja mælinga á sama einstaklingi."],
    ["Parað slembiúrtak", "paired sample", 6, "Tvær háðar mælingar á hverri einingu, t.d. fyrir og eftir."],
    ["Óparað t-próf", "two-sample t-test", 6, "Ber saman meðaltöl tveggja óháðra hópa."],
    ["Vegin dreifni", "pooled variance", 6, "Sameiginlegt mat á dreifni tveggja hópa; var.equal = TRUE."],
    ["Welch-próf", "Welch t-test", 6, "t-próf sem gerir ekki ráð fyrir jafnri dreifni; var.equal = FALSE."],
    ["F-próf", "F-test", 6, "Próf byggt á F-dreifingu, t.d. var.test eða ANOVA."],
    ["Stikalaus próf", "nonparametric tests", 6, "Próf sem gera ekki ráð fyrir tiltekinni dreifingu, t.d. Wilcoxon."],
    ["Hlutfall", "proportion", 7, "Hluti sem hefur eiginleika, p̂ = x/n."],
    ["Tengslatafla", "contingency table", 7, "Tafla yfir fjölda í hverri samsetningu tveggja flokkabreyta."],
    ["Vænt tíðni", "expected frequency", 7, "Fjöldi í reit ef H₀ um óhæði er sönn: línusumma·dálksumma/heild."],
    ["Kí-kvaðrat próf", "chi-squared test", 7, "Prófar óhæði í tengslatöflu með Σ(O − E)²/E."],
    ["Mátgæðapróf", "goodness of fit test", 7, "Prófar hvort tíðnir passi við tiltekna dreifingu."],
    ["Fisher-próf", "Fisher's exact test", 7, "Nákvæmt próf á tengslatöflu, notað þegar væntar tíðnir eru litlar."],
    ["Gagnlíkindi", "odds", 7, "p/(1 − p): líkur á atburði á móti líkum á að hann gerist ekki."],
    ["Gagnlíkindahlutfall", "odds ratio (OR)", 7, "Hlutfall gagnlíkinda tveggja hópa, ad/bc."],
    ["Áhættuhlutfall", "relative risk (RR)", 7, "Hlutfall líkna (áhættu) tveggja hópa."],
    ["Samfelluleiðrétting", "continuity correction", 7, "Leiðrétting í prop.test og chisq.test fyrir 2×2 töflur (Yates)."],
    ["Fervikagreining", "analysis of variance (ANOVA)", 8, "Ber saman meðaltöl þriggja eða fleiri hópa."],
    ["Fervikasummur", "sums of squares", 8, "Skipting heildarbreytileika í breytileika milli og innan hópa."],
    ["Meðalferviksumma", "mean square", 8, "Fervikasumma deilt með frígráðum, MS = SS/df."],
    ["F-gildi", "F statistic", 8, "MS hópa / MS leifa; stórt F bendir til ólíkra meðaltala."],
    ["Eftirápróf", "post hoc test", 8, "Próf eftir ANOVA til að finna hvaða hópar eru ólíkir, t.d. Tukey."],
    ["Jöfn dreifni", "homogeneity of variance", 8, "Forsenda ANOVA: sama dreifni í öllum hópum."],
    ["Aðhvarfsgreining", "regression", 9, "Líkan sem lýsir svarbreytu sem falli af skýribreytu."],
    ["Einfalt línulegt aðhvarf", "simple linear regression", 9, "y = α + βx + ε."],
    ["Fylgni", "correlation", 9, "Línulegt samband tveggja talnabreyta."],
    ["Fylgnistuðull", "correlation coefficient (r)", 9, "Styrkur línulegs sambands, á bilinu −1 til 1."],
    ["Hallatala", "slope", 9, "Breyting á y fyrir einnar einingar breytingu á x, β."],
    ["Skurðpunktur", "intercept", 9, "Vænt gildi y þegar x = 0, α."],
    ["Aðferð minnstu kvaðrata", "least squares", 9, "Velur línuna sem lágmarkar summu kvaðraðra leifa."],
    ["Leifar", "residuals", 9, "Mismunur mælds og spáðs gildis, y − ŷ."],
    ["Leifarit", "residual plot", 9, "Leifar á móti spágildum; á að sýna jafnt band án mynsturs."],
    ["Normaldreifingarrit", "normal probability plot (QQ plot)", 9, "Metur hvort leifar séu normaldreifðar: punktar á beinni línu."],
    ["Skýringarhlutfall", "coefficient of determination (R²)", 9, "Hlutfall breytileika í y sem líkanið skýrir."],
    ["Brúun", "interpolation", 9, "Spá innan gagnasviðs skýribreytunnar."],
    ["Bryggjun", "extrapolation", 9, "Spá utan gagnasviðs; ótraust."],
    ["Umbreyta", "transform", 9, "Að breyta breytu, t.d. log(y), til að bæta forsendur."],
    ["Tvíkosta aðhvarfsgreining", "logistic regression", 10, "Aðhvarf fyrir tvíkosta svarbreytu; glm með family = \"binomial\"."],
    ["Tengifall", "link function", 10, "Fall sem tengir væntigildi svarbreytu við línulega hlutann; logit í tvíkosta aðhvarfi."],
    ["Logit", "logit", 10, "log(p/(1 − p)), log-gagnlíkindi."],
    ["Greiningarpróf", "diagnostic test", 10, "Próf sem flokkar fólk sem jákvætt eða neikvætt."],
    ["Næmi", "sensitivity", 10, "P(T+ | D+): hlutfall veikra sem greinast jákvæðir."],
    ["Sértæki", "specificity", 10, "P(T− | D−): hlutfall heilbrigðra sem fá neikvætt."],
    ["Jákvætt forspárgildi", "positive predictive value (PPV)", 10, "P(D+ | T+): líkur á sjúkdómi ef próf er jákvætt."],
    ["Neikvætt forspárgildi", "negative predictive value (NPV)", 10, "P(D− | T−): líkur á heilbrigði ef próf er neikvætt."],
    ["Sönn jákvæð", "true positive", 10, "Veikur og prófið jákvætt."],
    ["Fölsk jákvæð", "false positive", 10, "Heilbrigður en prófið jákvætt."],
    ["Sönn neikvæð", "true negative", 10, "Heilbrigður og prófið neikvætt."],
    ["Fölsk neikvæð", "false negative", 10, "Veikur en prófið neikvætt."],
    ["Algengi", "prevalence", 10, "Hlutfall þýðis með sjúkdóminn; hefur áhrif á PPV og NPV."],
    ["ROC-ferill", "ROC curve", 10, "Næmi á móti 1 − sértæki fyrir öll skurðgildi."],
    ["Flatarmál undir ferli", "area under the curve (AUC)", 10, "Mælikvarði á greiningarhæfni; 0.5 tilviljun, 1 fullkomið."],
    ["Lifunargreining", "survival analysis", 11, "Greining á tíma að atburði, t.d. dauða."],
    ["Skerðing", "censoring", 11, "Atburður hafði ekki orðið þegar eftirfylgd lauk; við vitum aðeins að tíminn er lengri."],
    ["Lifunarfall", "survival function", 11, "S(t) = P(T > t), líkur á að lifa lengur en t."],
    ["Kaplan–Meier mat", "Kaplan–Meier estimator", 11, "Þrepaferill sem metur S(t) með skertum gögnum."],
    ["Miðgildi lifunar", "median survival time", 11, "Tíminn þegar S(t) = 0.5."],
    ["Í áhættu", "at risk", 11, "Þeir sem eru enn á lífi og ekki skertir á tilteknum tíma (n.risk)."],
    ["Log-rank próf", "log-rank test", 11, "Ber saman lifunarföll hópa."],
    ["Áhættufall", "hazard function", 11, "Augnabliksáhætta á atburði við tíma t."],
    ["Áhættuhlutfall (HR)", "hazard ratio", 11, "Hlutfall áhættufalla tveggja hópa; exp(coef) í Cox."],
    ["Cox-líkan", "Cox proportional hazards model", 11, "h(t | x) = h₀(t)·exp(βx)."],
    ["Hlutfallsleg áhætta", "proportional hazards", 11, "Forsenda Cox: HR fast yfir tíma."],
    ["Eftirfylgd", "follow-up", 11, "Tíminn sem fylgst er með þátttakanda."]
  ];

  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/þ/g, "th").replace(/æ/g, "ae").replace(/ð/g, "d").replace(/ö/g, "o"); }
  var esc = function (s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); };

  function init() {
    var q = document.getElementById("os-q"), chips = document.getElementById("os-chips"), tb = document.querySelector("#os-table tbody"), cnt = document.getElementById("os-count");
    if (!q || !tb) return;
    T.sort(function (a, b) { return a[2] - b[2] || a[0].localeCompare(b[0], "is"); });
    var ch = 0;
    var labels = [[0, "Allir"]].concat(Object.keys(CH).map(function (k) { return [+k, k + ". " + CH[k]]; }));
    labels.forEach(function (l) {
      var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = l[1];
      b.setAttribute("aria-pressed", l[0] === 0 ? "true" : "false");
      b.addEventListener("click", function () { ch = l[0]; Array.prototype.forEach.call(chips.children, function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); }); render(); });
      chips.appendChild(b);
    });
    function render() {
      var words = norm(q.value).split(/\s+/).filter(Boolean);
      var rows = T.filter(function (t) {
        if (ch && t[2] !== ch) return false;
        var hay = norm(t[0] + " " + t[1] + " " + t[3]);
        return words.every(function (w) { return hay.indexOf(w) >= 0; });
      });
      tb.innerHTML = rows.length ? rows.map(function (t) {
        return "<tr><td><b>" + esc(t[0]) + "</b></td><td><i>" + esc(t[1]) + "</i></td><td>" + esc(t[3]) + '</td><td class="num"><a href="kafli-' + t[2] + '.html" title="' + esc(CH[t[2]]) + '">' + t[2] + "</a></td></tr>";
      }).join("") : '<tr><td colspan="4">Ekkert hugtak passar við leitina.</td></tr>';
      cnt.textContent = rows.length + " af " + T.length + " hugtökum";
    }
    q.addEventListener("input", render);
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

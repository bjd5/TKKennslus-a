/* q/kafli05.js – aukaspurningar fyrir kafla 5: Öryggisbil (efni: oryggisbil). */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var T = "oryggisbil";
  var PROP = '<pre class="rcode">&gt; prop.test(x = 183, n = 469)\n\n\t1-sample proportions test with continuity correction\n\ndata:  183 out of 469, null probability 0.5\nX-squared = 22.183, df = 1, p-value = 2.478e-06\nalternative hypothesis: true p is not equal to 0.5\n95 percent confidence interval:\n 0.3460722 0.4361387\nsample estimates:\n        p\n0.3901919</pre>';
  var PARAD = '<pre class="rcode">&gt; t.test(hlupu$seinniPuls, hlupu$fyrriPuls, paired = TRUE)\n\n\tPaired t-test\n\ndata:  hlupu$seinniPuls and hlupu$fyrriPuls\nt = 19.421, df = 179, p-value &lt; 2.2e-16\nalternative hypothesis: true mean difference is not equal to 0\n95 percent confidence interval:\n 23.16357 28.40310\nsample estimates:\nmean difference\n       25.78333</pre>';

  M(T, "200 læknanemar taka hver sitt slembiúrtak 50 karla og reikna 95% öryggisbil fyrir meðalblóðþrýsting, sem er í raun 115 mmHg. Hve margir má búast við að fái bil sem inniheldur <b>ekki</b> 115?",
    ["10", "190", "5", "195"],
    "5% af 200 = 10 (spurning 1 á lokaprófinu 2025).");
  M(T, PROP + "Af 469 nemendum hlupu 183. Hvert er 95% öryggisbilið fyrir hlutfall hlaupara?",
    ["[0.346, 0.436]", "[0.390, 0.500]", "[22.18, 469]", "[0.5, 0.39]"],
    "Bilið stendur undir <code>95 percent confidence interval</code>. Það inniheldur ekki 0.5.");
  M(T, PROP + "Hvað má álykta af öryggisbilinu?",
    ["Hlutfall hlaupara er marktækt lægra en 0.5, því bilið inniheldur ekki 0.5", "Hlutfallið gæti vel verið 0.5", "95% nemenda hlupu", "Ekkert, því p-gildið er lítið"],
    "Bilið er allt fyrir neðan 0.5, sem samsvarar p = 2.5·10⁻⁶ &lt; 0.05.");
  M(T, PARAD + "Hvernig er öryggisbilið túlkað?",
    ["Með 95% öryggi hækkar púls hlauparanna að jafnaði um 23.2 til 28.4 slög/mín við hlaupið", "95% hlauparanna hækkuðu um 23–28 slög", "Púlsinn eftir hlaup er 23–28 slög/mín", "Meðalmunurinn er 0"],
    "Bilið er fyrir <b>meðaltal</b> mismunarins í þýðinu, ekki einstaklinga.");
  M(T, "Hvaða margfaldari er notaður í 90% öryggisbili með normalnálgun?",
    ["1.645", "1.96", "2.576", "1.282"],
    "<code>qnorm(0.95)</code> = 1.645, því 5% eru í hvorum hala.");
  M(T, "Hvaða margfaldari er notaður í 99% öryggisbili með normalnálgun?",
    ["2.576", "1.96", "1.645", "3"],
    "<code>qnorm(0.995)</code> = 2.576.");
  M(T, "Af hverju er t-dreifing notuð í öryggisbili fyrir meðaltal þegar σ er óþekkt?",
    ["Af því að s er notað sem mat á σ, sem bætir við óvissu; t hefur þykkari hala", "Af því að meðaltalið er alltaf skekkt", "Af því að t-dreifingin er þrengri en normaldreifingin", "Af því að n er alltaf undir 30"],
    "Margfaldarinn t<sub>0.975, n−1</sub> er stærri en 1.96, sérstaklega fyrir lítið n (t.d. 2.776 fyrir n = 5).");
  M(T, "Hver er margfaldarinn í 95% öryggisbili fyrir meðaltal með n = 10 mælingum (σ óþekkt)?",
    ["<code>qt(0.975, 9)</code> = 2.262", "<code>qnorm(0.975)</code> = 1.96", "<code>qt(0.95, 10)</code> = 1.812", "<code>qt(0.975, 10)</code> = 2.228"],
    "Frígráður eru n − 1 = 9.");
  M(T, "Hvað af eftirfarandi gerir öryggisbil <b>mjórra</b> (annað óbreytt)?",
    ["Stærra úrtak", "Hærra öryggisstig (99% í stað 95%)", "Meiri breytileiki í gögnunum", "Minna úrtak"],
    "Breidd ≈ 2·z·σ/√n.");
  M(T, "Öryggisbil fyrir mun á meðaltölum tveggja hópa er [0.73, 5.28]. Hvað er rétt?",
    ["Munurinn er marktækur við α = 0.05, því 0 er ekki í bilinu", "Munurinn er ekki marktækur", "p-gildið er stærra en 0.05", "Meðaltölin eru jöfn"],
    "Bil sem inniheldur ekki 0 samsvarar tvíhliða p &lt; 0.05.");
  M(T, "Öryggisbil fyrir gagnlíkindahlutfall (OR) er [0.78, 1.21]. Hvað er rétt?",
    ["Tengslin eru ekki marktæk, því bilið inniheldur 1", "Tengslin eru marktæk, því bilið inniheldur ekki 0", "OR er örugglega minna en 1", "OR er 1.21"],
    "Fyrir hlutföll (OR, RR, HR) er „engin áhrif“ = 1, ekki 0.");
  M(T, "Í 95% öryggisbili fyrir hlutfall er staðalskekkjan:",
    ["√(p̂(1 − p̂)/n)", "p̂(1 − p̂)", "√(p̂/n)", "s/√n"],
    "Bilið er p̂ ± 1.96·√(p̂(1 − p̂)/n).");
  M(T, "Í úrtaki 500 manns eru 110 með háþrýsting. Hvert er punktmatið fyrir hlutfallið?",
    ["0.22", "110", "0.11", "0.78"],
    "p̂ = 110/500 = 0.22 (dæmi 7 á lokaprófinu 2025).");
  M(T, "Í úrtaki 500 manns eru 110 með háþrýsting. Hvert er 95% öryggisbilið (normalnálgun)?",
    ["[0.184, 0.256]", "[0.200, 0.240]", "[0.110, 0.330]", "[0.214, 0.226]"],
    "SE = √(0.22·0.78/500) = 0.0185, og 0.22 ± 1.96·0.0185 = [0.184, 0.256].");
  M(T, "Hvaða fullyrðing um 95% öryggisbil [0.184, 0.256] er <b>röng</b>?",
    ["Líkurnar á að sanna hlutfallið sé í þessu tiltekna bili eru 95%", "Aðferðin gefur bil sem innihalda sanna hlutfallið í 95% tilvika", "Bilið er reiknað úr einu úrtaki", "Bilið yrði breiðara með 99% öryggi"],
    "Eftir að bilið er reiknað annaðhvort inniheldur það p eða ekki. 95% vísa til aðferðarinnar (strangt til tekið í tíðnihyggju).");
  M(T, "Hverjar eru forsendur öryggisbils fyrir meðaltal með t-dreifingu?",
    ["Óháðar mælingar og u.þ.b. normaldreifð gögn (eða nógu stórt n)", "Að n sé að minnsta kosti 1000", "Að σ sé þekkt", "Að gögnin séu flokkabreyta"],
    "Fyrir stórt n tryggir CLT að x̄ sé nálgunarlega normaldreift.");
  M(T, '<pre class="rcode">&gt; confint(fit)\n                2.5 %    97.5 %\n(Intercept) 82.689752 90.643923\nBMI          1.636546  1.940493</pre>Hvað segir línan fyrir BMI?',
    ["Með 95% öryggi hækkar meðalblóðþrýstingur um 1.64–1.94 mmHg fyrir hverja einingu í BMI", "BMI er á bilinu 1.64–1.94", "2.5% fólks hefur BMI 1.64", "Hallatalan er ekki marktæk"],
    "Bilið fyrir hallatöluna inniheldur ekki 0, svo sambandið er marktækt.");
  M(T, "Rannsakandi vill helminga breidd öryggisbils. Hvað þarf hann að gera við úrtaksstærðina?",
    ["Fjórfalda hana", "Tvöfalda hana", "Helminga hana", "Ekkert, breiddin ræðst af öryggisstiginu"],
    "Breiddin er í hlutfalli við 1/√n.");
  M(T, "5% Íslendinga 65 ára og eldri eru með Alzheimer. 400 hjúkrunarfræðingar reikna hver 90% öryggisbil. Hve mörg bil má búast við að innihaldi 5%?",
    ["360", "380", "40", "20"],
    "90% af 400 = 360 (enska prófið 2024).");
  M(T, "Hvað er <b>vikmörk</b> (margin of error) í öryggisbilinu 0.22 ± 0.036?",
    ["0.036, hálf breidd bilsins", "0.22", "0.072", "0.256"],
    "Bilið er punktmat ± vikmörk.");
  M(T, "Ef 95% öryggisbil fyrir μ er [118.2, 124.6], hvert er úrtaksmeðaltalið?",
    ["121.4", "118.2", "124.6", "6.4"],
    "Bilið er samhverft um x̄: (118.2 + 124.6)/2 = 121.4.");

  B.G.push(function ciPropWidth() {
    var n = pick([100, 200, 400, 600, 1000]), x = rnd(Math.round(n * 0.1), Math.round(n * 0.5));
    var p = x / n, m = 1.96 * Math.sqrt(p * (1 - p) / n);
    return { topic: T, title: "Vikmörk hlutfalls", unit: "", tol: 0.01, absTol: 0.0005, answer: m,
      text: "<p>Í úrtaki " + n + " einstaklinga reykja " + x + ". Reiknaðu vikmörk (hálfa breidd) 95% öryggisbils fyrir hlutfall reykingafólks.</p>",
      sol: "<p>p̂ = " + f(p) + ", vikmörk = 1.96·√(p̂(1 − p̂)/n) = 1.96·" + f(Math.sqrt(p * (1 - p) / n)) + " = " + f(m) + ".</p><pre class=\"rcode\">p &lt;- " + x + " / " + n + "\nqnorm(0.975) * sqrt(p * (1 - p) / " + n + ")</pre>" };
  });
  B.G.push(function ciMeanZ() {
    var n = pick([36, 49, 64, 100, 144]), xb = rnd(700, 760) / 10, sd = rnd(10, 14), conf = pick([90, 95, 99]), up = Math.random() < 0.5;
    var z = S.qnorm(1 - (100 - conf) / 200), a = xb + (up ? 1 : -1) * z * sd / Math.sqrt(n);
    return { topic: T, title: "Öryggisbil, σ þekkt", unit: "slög/mín", tol: 0.0005, absTol: 0.01, answer: a,
      text: "<p>Vitað er að staðalfrávik hvíldarpúls í þýðinu er σ = " + sd + " slög/mín. Í úrtaki " + n + " manns er x̄ = " + xb + ". Reiknaðu " + (up ? "efri" : "neðri") + " mörk " + conf + "% öryggisbils fyrir μ.</p>",
      sol: "<p>z = " + f(z, 3) + ", SE = σ/√n = " + sd + "/" + Math.sqrt(n) + " = " + f(sd / Math.sqrt(n)) + ". Bilið: " + xb + " ± " + f(z * sd / Math.sqrt(n), 3) + " = [" + f(xb - z * sd / Math.sqrt(n), 2) + ", " + f(xb + z * sd / Math.sqrt(n), 2) + "].</p><pre class=\"rcode\">" + xb + " + c(-1, 1) * qnorm(" + f(1 - (100 - conf) / 200, 3) + ") * " + sd + " / sqrt(" + n + ")</pre>" };
  });
})();

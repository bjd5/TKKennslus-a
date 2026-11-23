/* q/kafli05.js – aukaspurningar fyrir kafla 5: Öryggisbil (efni: oryggisbil). */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var T = "oryggisbil";
  var PROP = '<pre class="rcode">&gt; prop.test(x = 183, n = 469)\n\n\t1-sample proportions test with continuity correction\n\ndata:  183 out of 469, null probability 0.5\nX-squared = 22.183, df = 1, p-value = 2.478e-06\nalternative hypothesis: true p is not equal to 0.5\n95 percent confidence interval:\n 0.3460722 0.4361387\nsample estimates:\n        p\n0.3901919</pre>';
  var PARAD = '<pre class="rcode">&gt; t.test(hlupu$seinniPuls, hlupu$fyrriPuls, paired = TRUE)\n\n\tPaired t-test\n\ndata:  hlupu$seinniPuls and hlupu$fyrriPuls\nt = 19.421, df = 179, p-value &lt; 2.2e-16\nalternative hypothesis: true mean difference is not equal to 0\n95 percent confidence interval:\n 23.16357 28.40310\nsample estimates:\nmean difference\n       25.78333</pre>';

  M(T, "200 læknanemar taka hver sitt slembiúrtak 50 karla og reikna 95% öryggisbil fyrir meðalblóðþrýsting, sem er í raun 115 mmHg. Hve mörg þessara bila má búast við að innihaldi <b>ekki</b> 115?",
    ["10", "190", "5", "195"],
    "5% af 200 = 10 (spurning 1 á lokaprófinu 2025).");
  M(T, PROP + "Af 469 nemendum hlupu 183. Hvert er 95% öryggisbilið fyrir hlutfall hlaupara?",
    ["[0.346, 0.436]", "[0.390, 0.500]", "[0.346, 0.390]", "[0.436, 0.500]"],
    "Bilið stendur undir <code>95 percent confidence interval</code>. Það inniheldur ekki 0.5.");
  M(T, PROP + "Hvað má álykta af öryggisbilinu?",
    ["Hlutfall hlaupara er marktækt lægra en 0.5, því bilið inniheldur ekki 0.5", "Hlutfallið gæti vel verið 0.5", "95% nemenda hlupu", "Hlutfall hlaupara er marktækt hærra en 0.5"],
    "Bilið er allt fyrir neðan 0.5, sem samsvarar p = 2.5·10⁻⁶ &lt; 0.05.");
  M(T, PARAD + "Hvernig er öryggisbilið túlkað?",
    ["Með 95% öryggi hækkar púls hlauparanna að jafnaði um 23.2 til 28.4 slög/mín við hlaupið", "95% hlauparanna hækkuðu um 23–28 slög", "Púlsinn eftir hlaup er 23–28 slög/mín", "Púlsinn hækkar ekki marktækt, því bilið er breitt"],
    "Bilið er fyrir <b>meðaltal</b> mismunarins í þýðinu, ekki einstaklinga.");
  M(T, "Hvaða margfaldari er notaður í 90% öryggisbili með normalnálgun?",
    ["1.645", "1.96", "2.576", "1.282"],
    "<code>qnorm(0.95)</code> = 1.645, því 5% eru í hvorum hala.");
  M(T, "Hvaða margfaldari er notaður í 99% öryggisbili með normalnálgun?",
    ["2.576", "1.96", "1.645", "2.326"],
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
    ["0.22", "0.0185", "0.11", "0.78"],
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
    ["Með 95% öryggi hækkar meðalblóðþrýstingur um 1.64–1.94 mmHg fyrir hverja einingu í BMI", "BMI er á bilinu 1.64–1.94", "BMI skýrir 1.64–1.94% af breytileika blóðþrýstings", "Hallatalan er ekki marktæk"],
    "Bilið fyrir hallatöluna inniheldur ekki 0, svo sambandið er marktækt.");
  M(T, "Rannsakandi vill helminga breidd öryggisbils. Hvað þarf hann að gera við úrtaksstærðina?",
    ["Fjórfalda hana", "Tvöfalda hana", "Helminga hana", "Ekkert, breiddin ræðst af öryggisstiginu"],
    "Breiddin er í hlutfalli við 1/√n.");
  M(T, "5% Íslendinga 65 ára og eldri eru með Alzheimer. 400 hjúkrunarfræðingar reikna hver 90% öryggisbil. Hve mörg bil má búast við að innihaldi 5%?",
    ["360", "380", "40", "20"],
    "90% af 400 = 360 (enska prófið 2024).");
  M(T, "Hver eru <b>vikmörkin</b> (margin of error) í öryggisbilinu 0.22 ± 0.036?",
    ["0.036, hálf breidd bilsins", "0.22", "0.072", "0.256"],
    "Bilið er punktmat ± vikmörk.");
  M(T, "Ef 95% öryggisbil fyrir μ er [118.2, 124.6], hvert er úrtaksmeðaltalið?",
    ["121.4", "118.2", "124.6", "3.2"],
    "Bilið er samhverft um x̄: (118.2 + 124.6)/2 = 121.4.");

  B.G.push(function ciPropWidth() {
    var n = pick([100, 200, 400, 600, 1000]), x = rnd(Math.round(n * 0.1), Math.round(n * 0.5));
    var p = x / n, m = 1.96 * Math.sqrt(p * (1 - p) / n);
    return { topic: T, title: "Vikmörk hlutfalls", unit: "", tol: 0.01, absTol: 0.0005, answer: m,
      text: "<p>Í úrtaki " + n + " einstaklinga reykja " + x + ". Reiknið vikmörk (hálfa breidd) 95% öryggisbils fyrir hlutfall reykingafólks.</p>",
      sol: "<p>p̂ = " + f(p) + ", vikmörk = 1.96·√(p̂(1 − p̂)/n) = 1.96·" + f(Math.sqrt(p * (1 - p) / n)) + " = " + f(m) + ".</p><pre class=\"rcode\">p &lt;- " + x + " / " + n + "\nqnorm(0.975) * sqrt(p * (1 - p) / " + n + ")</pre>" };
  });
  B.G.push(function ciMeanZ() {
    var n = pick([36, 49, 64, 100, 144]), xb = rnd(700, 760) / 10, sd = rnd(10, 14), conf = pick([90, 95, 99]), up = Math.random() < 0.5;
    var z = S.qnorm(1 - (100 - conf) / 200), a = xb + (up ? 1 : -1) * z * sd / Math.sqrt(n);
    return { topic: T, title: "Öryggisbil, σ þekkt", unit: "slög/mín", tol: 0.0005, absTol: 0.01, answer: a,
      text: "<p>Vitað er að staðalfrávik hvíldarpúls í þýðinu er σ = " + sd + " slög/mín. Í úrtaki " + n + " manna er x̄ = " + xb + ". Reiknið " + (up ? "efri" : "neðri") + " mörk " + conf + "% öryggisbils fyrir μ.</p>",
      sol: "<p>z = " + f(z, 3) + ", SE = σ/√n = " + sd + "/" + Math.sqrt(n) + " = " + f(sd / Math.sqrt(n)) + ". Bilið: " + xb + " ± " + f(z * sd / Math.sqrt(n), 3) + " = [" + f(xb - z * sd / Math.sqrt(n), 2) + ", " + f(xb + z * sd / Math.sqrt(n), 2) + "].</p><pre class=\"rcode\">" + xb + " + c(-1, 1) * qnorm(" + f(1 - (100 - conf) / 200, 3) + ") * " + sd + " / sqrt(" + n + ")</pre>" };
  });

  // ---------- Í stíl fyrirlestradæma (aukadæmi 7–9) og lokaprófa ----------
  M(T, "Fyrirtæki framkvæmdi skoðanakönnun fyrir borgarstjórnarkosningar. 1350 manns tóku afstöðu og 178 sögðust ætla að kjósa Pírata. Hvert er mat ykkar á hlutfalli kjósenda sem ætla sér að kjósa Pírata?",
    ["0.13", "178", "0.0758", "Ekki er hægt að reikna hlutfallið út frá upplýsingunum"],
    "Punktmatið er p̂ = 178/1350 = 0.132 (fyrirlestradæmi, kennsluvika 8, spurning 1).");
  M(T, "Í sömu könnun (178 af 1350), hver eru neðri mörk 95% öryggisbils fyrir hlutfall kjósenda Pírata?",
    ["0.11", "0.06", "0.09", "Ekki er hægt að beita normalnálgun, svo bilið er ekki hægt að reikna"],
    "p̂ = 0.1319, SE = √(0.1319·0.8681/1350) = 0.0092, neðri mörk 0.1319 − 1.96·0.0092 = 0.114. Normalnálgunin er í lagi því np̂ og n(1 − p̂) eru báðar langt yfir 5.");
  M(T, "Helga mældi greindarvísitölu 15 apa. Meðaltalið var 120 stig og staðalfrávikið 12 stig. Gera má ráð fyrir normaldreifingu. Hver eru efri mörk 95% öryggisbils fyrir meðalgreindarvísitöluna?",
    ["126.65", "125.46", "126.10", "113.35"],
    "120 + t<sub>0.975, 14</sub>·12/√15 = 120 + 2.145·3.098 = 126.65. Ef notað er 1.96 í stað t fæst 126.07 (fyrirlestradæmi, kennsluvika 9, spurning 1).");
  M(T, "Finnur kannaði verð á hamborgurum á 18 stöðum á Þjóðvegi 1. Meðalverðið var 1425 kr. og staðalfrávikið 73 kr. Hvert er efra mark 95% öryggisbils fyrir meðalverðið?",
    ["1461.3", "1458.7", "1391.3", "1288.7"],
    "1425 + t<sub>0.975, 17</sub>·73/√18 = 1425 + 2.110·17.21 = 1461.3. Með 1.96 í stað t fengist 1458.7 (fyrirlestradæmi, kennsluvika 10, spurning 7).");
  M(T, "Reiknið 95% öryggisbil fyrir hlutfallið: í úrtaki 500 manns reyndust 110 vera með háþrýsting. Hvernig er bilið túlkað?",
    ["Ef úrtakstakan væri endurtekin oft myndu um 95% bilanna innihalda raunverulegt hlutfall í þýðinu", "95% þeirra 500 sem voru skoðaðir eru með blóðþrýsting á bilinu", "Hlutfallið í úrtakinu er 95% öruggt", "Líkurnar á að úrtakshlutfallið 0.22 sé í bilinu eru 95%"],
    "Bilið er [0.184, 0.256]. Það fjallar um hlutfallið í þýðinu, ekki einstaklinga eða úrtakshlutfallið (lokapróf 2025, dæmi 7c).");

  // Fyrirlestradæmi, kennsluvika 8, spurning 2 (skoðanakönnun)
  B.G.push(function ciKonnun() {
    var fl = pick([["Pírata", 0.13], ["Sjálfstæðisflokkinn", 0.26], ["Samfylkinguna", 0.22], ["Framsóknarflokkinn", 0.1]]);
    var n = pick([850, 1000, 1200, 1350, 1500]), x = Math.round(n * fl[1] * rnd(85, 115) / 100), up = Math.random() < 0.5;
    var p = x / n, se = Math.sqrt(p * (1 - p) / n), a = p + (up ? 1 : -1) * 1.96 * se;
    return { topic: T, title: "Öryggisbil fyrir hlutfall", unit: "", tol: 0.002, absTol: 0.001, answer: a,
      text: "<p>Fyrirtæki framkvæmdi skoðanakönnun rétt fyrir borgarstjórnarkosningar. " + n + " manns tóku afstöðu til spurningarinnar „Ef kosið yrði til borgarstjórnar í dag, hvaða flokk myndir þú kjósa?“ og " + x + " sögðust ætla að kjósa " + fl[0] + ". Göngum út frá að tilraunahögunin hafi verið í lagi.</p><p>Finnið " + (up ? "efra" : "neðra") + " mark 95% öryggisbils fyrir hlutfall kjósenda sem ætla sér að kjósa " + fl[0] + ".</p>",
      sol: "<p>p̂ = " + x + "/" + n + " = " + f(p) + " og SE = √(p̂(1 − p̂)/n) = " + f(se) + ". Bilið er p̂ ± 1.96·SE = [" + f(p - 1.96 * se) + ", " + f(p + 1.96 * se) + "].</p><pre class=\"rcode\">p &lt;- " + x + " / " + n + "\np + c(-1, 1) * qnorm(0.975) * sqrt(p * (1 - p) / " + n + ")</pre>" };
  });
  // Fyrirlestradæmi, kennsluvika 9, spurning 1 og kennsluvika 10, spurning 7
  B.G.push(function ciMeanSaga() {
    var c = pick([
      { t: "Helga er að rannsaka greindarvísitölu ákveðinnar apategundar. Hún mældi greindarvísitöluna í {n} öpum og reyndist hún vera {m} stig að meðaltali. Staðalfrávikið var {s} stig.", m: [110, 130], s: [8, 15], u: "stig", d: 0, what: "meðalgreindarvísitölu apategundarinnar" },
      { t: "Finnur ferðamálafræðingur valdi af handahófi {n} staði á Þjóðvegi 1 sem selja hamborgara og kannaði verðið. Meðalverðið var {m} krónur og staðalfrávikið {s} krónur.", m: [1300, 1600], s: [50, 110], u: "kr.", d: 0, what: "meðalverð á hamborgurum á Þjóðvegi 1" },
      { t: "Hjúkrunarfræðingur mældi blóðsykur hjá {n} sjúklingum á göngudeild. Meðaltalið var {m} mmól/L og staðalfrávikið {s} mmól/L.", m: [55, 75], s: [8, 16], u: "mmól/L", d: 1, what: "meðalblóðsykur sjúklinga á göngudeildinni" }
    ]);
    var n = rnd(10, 25), m = rnd(c.m[0], c.m[1]), s = rnd(c.s[0], c.s[1]);
    if (c.d) { m = m / 10; s = s / 10; }
    var up = Math.random() < 0.5, t = S.qt(0.975, n - 1), a = m + (up ? 1 : -1) * t * s / Math.sqrt(n);
    return { topic: T, title: "Öryggisbil fyrir meðaltal", unit: c.u, tol: 0.0005, absTol: 0.02, answer: a,
      text: "<p>" + c.t.replace("{n}", n).replace("{m}", m).replace("{s}", s) + " Gera má ráð fyrir að mælingarnar fylgi normaldreifingu.</p><p>Hvert er " + (up ? "efra" : "neðra") + " mark 95% öryggisbils fyrir " + c.what + "?</p>",
      sol: "<p>σ er óþekkt og metið með s, svo notuð er t-dreifing með n − 1 = " + (n - 1) + " frígráðum: t<sub>0.975, " + (n - 1) + "</sub> = " + f(t, 3) + ". Bilið er x̄ ± t·s/√n = " + m + " ± " + f(t, 3) + "·" + s + "/√" + n + " = [" + f(m - t * s / Math.sqrt(n), 2) + ", " + f(m + t * s / Math.sqrt(n), 2) + "].</p><pre class=\"rcode\">" + m + " + c(-1, 1) * qt(0.975, df = " + (n - 1) + ") * " + s + " / sqrt(" + n + ")</pre>" };
  });
})();

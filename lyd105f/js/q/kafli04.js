/* q/kafli04.js – spurningar fyrir kafla 4: Normaldreifing og höfuðsetningin (efni: normal, clt).
 * Byggt á fyrirlestradæmum kennsluviku 4 og 6 („aukadæmi 4b“ og „aukadæmi k6“),
 * lokaprófunum 2024 og 2025 og ensku prófinu frá vori 2024. Orðalag eins og í áfanganum. */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }

  // ---------- Normaldreifing: krossaspurningar ----------
  M("normal", "Við gerum ráð fyrir að hjartsláttur heilbrigðra íslenskra kvenna fylgi normaldreifingu með meðaltal 75 slög/mínútu og staðalfrávik 13 slög/mínútu. Þegar hjartsláttur mælist hærri en 100 slög/mínútu er talað um yfirslátt. Sé heilbrigð kona valin af handahófi, hverjar eru líkurnar á að hún sé með yfirslátt?",
    ["0.027", "0.973", "0.441", "0.559"],
    "P(X > 100) = 1 − Φ((100 − 75)/13) = 1 − Φ(1.92) = 0.027. Í R: <code>pnorm(100, 75, 13, lower.tail = F)</code> (spurning 7 á lokaprófinu 2025).");
  M("normal", "Hjartsláttur heilbrigðra kvenna fylgir normaldreifingu með meðaltal 75 og staðalfrávik 13 slög/mínútu. Hver þarf hjartslátturinn að vera til að vera í hópi þeirra 10% kvenna sem eru með hægasta hjartsláttinn?",
    ["58.34 slög/mínútu", "91.66 slög/mínútu", "44.76 slög/mínútu", "67.98 slög/mínútu"],
    "x = μ + z<sub>0.10</sub>·σ = 75 − 1.2816·13 = 58.34. Í R: <code>qnorm(0.1, 75, 13)</code> (spurning 8 á lokaprófinu 2025). 91.66 er efra 10% markið.");
  M("normal", "Hjartsláttur fylgir normaldreifingu með meðaltal 75 og staðalfrávik 13, og líkurnar á yfirslætti eru 0.027. Í slembiúrtaki af 150 íslenskum konum, hve margar má búast við að hafi yfirslátt?",
    ["4.1", "0.027", "0", "145.9"],
    "Væntanlegur fjöldi er n·p = 150·0.0272 = 4.1 (spurning 9 á lokaprófinu 2025).");
  M("normal", "Atli er að fást við normaldreifingu með meðaltal 20 og <b>dreifni</b> 4. Hann hefur gildið x = 22. Hvert er tilsvarandi staðlað z-gildi?",
    ["1", "0.5", "2", "0.125"],
    "Staðalfrávikið er √4 = 2, svo z = (22 − 20)/2 = 1. Ef deilt er með dreifninni fæst 0.5, sem er algeng villa.");
  M("normal", "Hvert er gildið á z<sub>0.75</sub>, þ.e. talan z þannig að Φ(z) = 0.75?",
    ["0.67", "1.96", "0.75", "1.15"],
    "Úr töflu eða <code>qnorm(0.75)</code> = 0.674. 1.96 er z<sub>0.975</sub>.");
  M("normal", "Hvert er gildið á Φ(z) ef z = 0.60?",
    ["Um 0.73", "Um 0.27", "Um 0.60", "Um 0.95"],
    "Φ(0.60) = 0.7257 úr töflu staðlaðrar normaldreifingar, eða <code>pnorm(0.6)</code>. 0.27 er 1 − Φ(0.60).");
  M("normal", "Slembistærðin Z fylgir stöðluðu normaldreifingunni, Z ~ N(0, 1). Reiknið P(Z = 0.25).",
    ["0", "0.4013", "0.5987", "0.3867"],
    "Fyrir samfellda slembistærð eru líkurnar á einu tilteknu gildi alltaf 0. 0.5987 er P(Z ≤ 0.25) og 0.3867 er hæð þéttifallsins, <code>dnorm(0.25)</code>.");
  M("normal", "Hvert er gildið á z ef Φ(z) = 0.80?",
    ["Um 0.84", "Um 0.79", "Um 1.79", "Um 0.20"],
    "z = <code>qnorm(0.8)</code> = 0.8416.");
  M("normal", "Einkunnir í tölfræðiáfanga fylgja normaldreifingu með meðaltal 6.7 og staðalfrávik 2.7. Hvaða einkunn þarf nemandi að ná til að vera í hópi þeirra 20% nemenda sem eru með hæstu einkunnina?",
    ["8.97", "8.12", "4.43", "6.92"],
    "x = 6.7 + z<sub>0.80</sub>·2.7 = 6.7 + 0.8416·2.7 = 8.97, eða <code>qnorm(0.8, 6.7, 2.7)</code>. 4.43 er neðra 20% markið.");
  M("normal", "Einkunnir fylgja normaldreifingu með meðaltal 6.7 og staðalfrávik 2.7. Til að standast áfangann þarf að lágmarki 5 í einkunn. Sé nemandi valinn af handahófi, hverjar eru líkurnar á að hann falli?",
    ["Um 26%", "Um 74%", "Um 50%", "Um 37%"],
    "P(X < 5) = Φ((5 − 6.7)/2.7) = Φ(−0.63) = 0.264, eða <code>pnorm(5, 6.7, 2.7)</code>.");
  M("normal", "Gerum ráð fyrir að systólískur blóðþrýstingur fylgi normaldreifingu með meðaltal 120 mmHg og staðalfrávik 10 mmHg. Á heilsugæslu vill læknir setja mörkin þannig að aðeins efstu 5% teljist með háþrýsting. Hver ættu mörkin að vera?",
    ["136.4 mmHg", "139.6 mmHg", "130.0 mmHg", "103.6 mmHg"],
    "x<sub>0.95</sub> = 120 + 1.645·10 = 136.4, eða <code>qnorm(0.95, 120, 10)</code> (lokaprófið 2024). 139.6 notar 1.96.");
  M("normal", "Blóðþrýstingur fylgir normaldreifingu með meðaltal 120 og staðalfrávik 10 mmHg. Hverjar eru líkurnar á að einstaklingur valinn af handahófi mælist á milli 115 og 125 mmHg?",
    ["0.383", "0.691", "0.309", "0.950"],
    "P(115 < X < 125) = Φ(0.5) − Φ(−0.5) = 0.69 − 0.31 = 0.38 (lokaprófið 2024). 0.691 er bara Φ(0.5).");
  M("normal", "Hvernig getið þið kannað hvort gögn séu u.þ.b. normaldreifð?",
    ["Með normaldreifingarriti: punktarnir eiga að liggja nálægt beinni línu", "Með því að athuga hvort meðaltal og staðalfrávik séu jöfn", "Með kökuriti af gögnunum", "Með því að athuga hvort öll gildin séu jákvæð"],
    "Í R: <code>qqnorm(x); qqline(x)</code>. Stuðlarit gefur líka vísbendingu um lögun dreifingarinnar.");
  M("normal", "Ninna rannsakar aldur fólks í spinningtímum, sem fylgir normaldreifingu með meðaltal 30 ár og staðalfrávik 3 ár. Hverjar eru líkurnar á að þátttakandi valinn af handahófi sé eldri en 33 ára?",
    ["15.9%", "8%", "84.1%", "99.9%"],
    "z = (33 − 30)/3 = 1, og P(X > 33) = 1 − Φ(1) = 0.159.");
  M("normal", "Aldur í spinningtímum fylgir normaldreifingu með meðaltal 30 og staðalfrávik 3 ár. Hversu gamall þyrfti Jóhannes að vera til að vera eldri en 99% þátttakenda?",
    ["Í minnsta lagi 37 ára", "Í minnsta lagi 33 ára", "Í minnsta lagi 36 ára", "Í minnsta lagi 45 ára"],
    "x<sub>0.99</sub> = 30 + 2.326·3 = 36.98, svo 37 ára. 36 ára fæst ef notað er z = 1.96.");

  // ---------- Höfuðsetning tölfræðinnar: krossaspurningar ----------
  M("clt", "Meðalþyngd sjúklinga er 75.3 kg með dreifnina 912.02 kg². Hvaða líkindadreifingu er eðlilegt að gera ráð fyrir að meðalþyngd 100 sjúklinga sem koma á bráðamóttökuna á einum klukkutíma fylgi?",
    ["N(75.3, 9.1202)", "N(75.3, 912.02)", "N(75.3, 30.2)", "N(75.3, 91.202)"],
    "Samkvæmt höfuðsetningu tölfræðinnar er X̄ ≈ N(μ, σ²/n) = N(75.3, 912.02/100) = N(75.3, 9.1202) (spurning 4 á lokaprófinu 2025).");
  M("clt", "Magn tómatsósu sem barn kýs að setja út á spagettíið sitt er normaldreift með stikana μ = 15 ml og σ² = 9 ml². 25 börn eru valin af handahófi. Hvaða líkindadreifingu fylgir meðaltómatsósunotkun barnanna 25?",
    ["Normaldreifingu með μ = 15 og σ² = 9/25 ml²", "Normaldreifingu með μ = 15 og σ² = 9 ml²", "Normaldreifingu með μ = 15 og σ = 3 ml", "Normaldreifingu með μ = 15/25 og σ² = 9/25 ml²"],
    "Meðaltalið hefur sama væntigildi og einstaklingarnir en dreifnina σ²/n = 9/25 = 0.36 ml² (fyrirlestradæmi, kennsluvika 6).");
  M("clt", "Bensíneyðsla leigubíla fylgir normaldreifingu með meðaltal 15 og staðalfrávik 5 lítra/100 km. Nonni velur 12 leigubíla af handahófi. Hver er staðalskekkja meðaleyðslunnar?",
    ["5/√12 ≈ 1.44", "√(5/12) ≈ 0.65", "5/12 ≈ 0.42", "5·√12 ≈ 17.3"],
    "Staðalskekkja meðaltals er σ/√n = 5/√12 = 1.44 lítrar/100 km.");
  M("clt", "Aldur í spinningtímum fylgir normaldreifingu með meðaltal 30 og staðalfrávik 3 ár. Morgun einn mæta 9 manns. Hverjar eru líkurnar á að meðalaldur þeirra sé lægri en 33 ár?",
    ["99.9%", "84.1%", "15.9%", "8%"],
    "X̄ ~ N(30, 3²/9), svo staðalskekkjan er 3/√9 = 1. z = (33 − 30)/1 = 3 og Φ(3) = 0.9987. 84.1% fæst ef staðalfrávik einstaklings (3) er notað.");
  M("clt", "Meðalsystólískur blóðþrýstingur 200 einstaklinga er skoðaður, þar sem blóðþrýstingur fylgir N(120, 10²). Hvaða dreifingu fylgir X̄?",
    ["N(120, 10²/200) = N(120, 0.5)", "N(120, 10²)", "N(120, 10/200)", "N(120, 10²/√200)"],
    "Dreifni meðaltalsins er σ²/n = 100/200 = 0.5 og staðalskekkjan √0.5 = 0.707 (lokaprófið 2024).");
  M("clt", "Hvað er <b>staðalskekkja</b> meðaltals?",
    ["Staðalfrávik úrtaksdreifingar meðaltalsins, σ/√n", "Staðalfrávik einstakra mælinga", "Dreifni þýðisins", "Munurinn á x̄ og μ í einu úrtaki"],
    "Staðalskekkjan segir hve mikið x̄ sveiflast milli úrtaka. Hún minnkar með √n.");
  M("clt", "Hvaða fullyrðing um höfuðsetningu tölfræðinnar er <b>röng</b>?",
    ["Hún segir að einstakar mælingar verði normaldreifðar ef úrtakið er stórt", "Hún á við um meðaltöl úr hvaða dreifingu sem er með endanlega dreifni", "Nálgunin batnar eftir því sem n stækkar", "Hún skýrir af hverju normaldreifingin er svo oft notuð"],
    "Höfuðsetningin fjallar um úrtaksdreifingu <b>meðaltalsins</b>. Einstakar mælingar halda sinni dreifingu.");
  M("clt", "Fjöldi sjúklinga sem koma á bráðamóttöku á klukkutíma fylgir Poisson dreifingu með λ = 4. Valdir eru 50 klukkutímar af handahófi. Hvaða dreifingu má nota til að nálga dreifingu meðalfjöldans?",
    ["N(4, 4/50)", "Poisson(4)", "N(4, 4)", "N(200, 4)"],
    "Fyrir Poisson er E[X] = Var[X] = λ = 4, svo X̄ ≈ N(4, 4/50) samkvæmt höfuðsetningu tölfræðinnar (lokaprófið 2024).");
  M("clt", "Hve mikið þarf að stækka úrtak til að helminga staðalskekkjuna?",
    ["Fjórfalda það", "Tvöfalda það", "Þrefalda það", "Áttfalda það"],
    "SE = σ/√n og √4 = 2.");
  M("clt", "Úrtaksdreifing <b>hlutfalls</b> p̂ er fyrir stórt n nálgunarlega:",
    ["N(p, p(1 − p)/n)", "N(p, p(1 − p))", "Poisson(np)", "N(np, np)"],
    "p̂ er meðaltal 0/1-breytu, svo höfuðsetningin gildir. Staðalskekkjan er √(p(1 − p)/n).");

  // ---------- Reiknidæmi ----------
  // eftir fyrirlestradæmum kennsluviku 4, spurningar 10-14 (einkunnir í tölfræðiáfanga)
  B.G.push(function normEinkunnir() {
    var mu = rnd(60, 72) / 10, sd = rnd(18, 30) / 10, typ = pick(["haerra", "milli", "falla", "efstu", "laegstu"]), a, txt, sol, r;
    if (typ === "haerra") { var x = Math.round(mu + rnd(5, 15) / 10); a = S.pnorm(x, mu, sd, false); txt = "hverjar eru líkurnar á að hann fái hærra en " + x + " í einkunn?"; sol = "P(X > " + x + ") = 1 − Φ((" + x + " − " + mu + ")/" + sd + ") = 1 − Φ(" + f((x - mu) / sd, 2) + ")"; r = "pnorm(" + x + ", " + mu + ", " + sd + ", lower.tail = F)"; }
    else if (typ === "milli") { var lo = Math.floor(mu), hi = lo + 1; a = S.pnorm(hi, mu, sd) - S.pnorm(lo, mu, sd); txt = "hverjar eru líkurnar á að hann fái á milli " + lo + " og " + hi + " í einkunn?"; sol = "P(" + lo + " < X < " + hi + ") = Φ(" + f((hi - mu) / sd, 2) + ") − Φ(" + f((lo - mu) / sd, 2) + ")"; r = "pnorm(" + hi + ", " + mu + ", " + sd + ") - pnorm(" + lo + ", " + mu + ", " + sd + ")"; }
    else if (typ === "falla") { a = S.pnorm(5, mu, sd); txt = "hverjar eru líkurnar á að hann falli, ef að lágmarki þarf 5 til að standast?"; sol = "P(X < 5) = Φ((5 − " + mu + ")/" + sd + ") = Φ(" + f((5 - mu) / sd, 2) + ")"; r = "pnorm(5, " + mu + ", " + sd + ")"; }
    else if (typ === "efstu") { var q = pick([10, 20, 25]); a = S.qnorm(1 - q / 100, mu, sd); txt = "hvaða einkunn þarf hann að ná til að vera í hópi þeirra " + q + "% sem eru með hæstu einkunnina?"; sol = "x = μ + z<sub>" + f(1 - q / 100, 2) + "</sub>·σ = " + mu + " + " + f(S.qnorm(1 - q / 100), 4) + "·" + sd; r = "qnorm(" + f(1 - q / 100, 2) + ", " + mu + ", " + sd + ")"; }
    else { var q2 = pick([10, 20, 30]); a = S.qnorm(q2 / 100, mu, sd); txt = "hvaða einkunn er hann með að hámarki ef hann tilheyrir hópi þeirra " + q2 + "% sem eru með lægstu einkunnina?"; sol = "x = μ + z<sub>" + f(q2 / 100, 2) + "</sub>·σ = " + mu + " + (" + f(S.qnorm(q2 / 100), 4) + ")·" + sd; r = "qnorm(" + f(q2 / 100, 2) + ", " + mu + ", " + sd + ")"; }
    return { topic: "normal", title: "Einkunnir í tölfræðiáfanga", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Gerum ráð fyrir að einkunnir handahófsvalins nemanda í tölfræðiáfanga fylgi normaldreifingu með meðaltal " + mu + " og staðalfrávik " + sd + ". Sé nemandi valinn af handahófi, " + txt + "</p>",
      sol: "<p>" + sol + " = " + f(a) + ".</p><pre class=\"rcode\">" + r + "</pre>" };
  });
  // eftir fyrirlestradæmum kennsluviku 4, spurning 1 (staðlað z-gildi þegar dreifnin er gefin)
  B.G.push(function normZdreifni() {
    var mu = rnd(10, 40), v = pick([4, 9, 16, 25, 36]), sd = Math.sqrt(v), x = mu + pick([-2, -1, 1, 2, 3]) * sd / pick([1, 2]);
    var z = (x - mu) / sd;
    return { topic: "normal", title: "Staðlað z-gildi", unit: "", tol: 0.001, absTol: 0.005, answer: z,
      text: "<p>Atli er að fást við normaldreifingu með meðaltal " + mu + " og dreifni " + v + ". Hann hefur gildið x = " + f(x, 2) + ". Hvert er tilsvarandi staðlað z-gildi?</p>",
      sol: "<p>Staðalfrávikið er σ = √" + v + " = " + sd + ". z = (x − μ)/σ = (" + f(x, 2) + " − " + mu + ")/" + sd + " = " + f(z, 3) + ". Ekki deila með dreifninni.</p><pre class=\"rcode\">(" + f(x, 2) + " - " + mu + ") / sqrt(" + v + ")</pre>" };
  });
  // eftir lokaprófinu 2025, spurningar 7-9 (hjartsláttur kvenna)
  B.G.push(function normYfirslattur() {
    var mu = rnd(70, 78), sd = rnd(10, 14), n = pick([100, 150, 200, 250]), p = S.pnorm(100, mu, sd, false), a = n * p;
    return { topic: "normal", title: "Væntanlegur fjöldi með yfirslátt", unit: "konur", tol: 0.01, absTol: 0.05, answer: a,
      text: "<p>Við gerum ráð fyrir að hjartsláttur heilbrigðra íslenskra kvenna fylgi normaldreifingu með meðaltal " + mu + " slög/mínútu og staðalfrávik " + sd + " slög/mínútu. Þegar hjartsláttur mælist hærri en 100 slög/mínútu er talað um yfirslátt. Í slembiúrtaki af " + n + " íslenskum konum, hve margar má búast við að hafi yfirslátt?</p>",
      sol: "<p>Fyrst P(X > 100) = 1 − Φ((100 − " + mu + ")/" + sd + ") = " + f(p) + ". Væntanlegur fjöldi er n·p = " + n + "·" + f(p) + " = " + f(a, 2) + ".</p><pre class=\"rcode\">" + n + " * pnorm(100, " + mu + ", " + sd + ", lower.tail = F)</pre>" };
  });
  // eftir fyrirlestradæmum kennsluviku 6, spurningar 10-11 (einstaklingur eða meðaltal)
  B.G.push(function cltSpinning() {
    var mu = rnd(28, 40), sd = rnd(2, 6), n = pick([4, 9, 16, 25]), d = pick([1, 2]), x = mu + d, mean = Math.random() < 0.6;
    var se = mean ? sd / Math.sqrt(n) : sd, a = S.pnorm(x, mu, se);
    return { topic: "clt", title: mean ? "Meðalaldur í hópi" : "Aldur eins þátttakanda", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Gerum ráð fyrir að aldur þátttakenda í spinningtímum fylgi normaldreifingu með meðaltal " + mu + " ár og staðalfrávik " + sd + " ár. " + (mean ? "Morgun einn mæta " + n + " manns. Hverjar eru líkurnar á að meðalaldur þeirra sé lægri en " + x + " ár?" : "Hverjar eru líkurnar á að þátttakandi valinn af handahófi sé yngri en " + x + " ára?") + "</p>",
      sol: "<p>" + (mean ? "X̄ ~ N(" + mu + ", " + sd + "²/" + n + "), svo staðalskekkjan er " + sd + "/√" + n + " = " + f(se, 3) + ". " : "") + "z = (" + x + " − " + mu + ")/" + f(se, 3) + " = " + f(d / se, 3) + " og Φ(z) = " + f(a) + ".</p><pre class=\"rcode\">pnorm(" + x + ", " + mu + ", " + (mean ? sd + " / sqrt(" + n + ")" : sd) + ")</pre>" };
  });
  // eftir fyrirlestradæmum kennsluviku 6, spurning 2 (staðalskekkja meðaleyðslu)
  B.G.push(function cltStadalskekkja() {
    var c = pick([["Bensíneyðsla leigubíla", "lítrar/100 km", "leigubíla"], ["Kólesteról karla", "mg/dL", "karla"], ["Fæðingarþyngd", "g", "nýbura"]]);
    var sd = c[0] === "Fæðingarþyngd" ? rnd(40, 60) * 10 : c[0] === "Kólesteról karla" ? rnd(30, 45) : rnd(3, 7), n = pick([9, 12, 16, 20, 25, 36]);
    var a = sd / Math.sqrt(n);
    return { topic: "clt", title: "Staðalskekkja meðaltals", unit: c[1], tol: 0.005, absTol: 0.005, answer: a,
      text: "<p>" + c[0] + " fylgir normaldreifingu með staðalfrávik " + sd + " " + c[1] + ". Valið er slembiúrtak " + n + " " + c[2] + ". Hver er staðalskekkja meðaltalsins?</p>",
      sol: "<p>SE = σ/√n = " + sd + "/√" + n + " = " + f(a, 3) + " " + c[1] + ".</p><pre class=\"rcode\">" + sd + " / sqrt(" + n + ")</pre>" };
  });
  B.G.push(function cltProbBetween() {
    var mu = rnd(70, 80), sd = rnd(10, 15), n = pick([16, 25, 36, 64, 100]), w = pick([1, 2, 3]);
    var se = sd / Math.sqrt(n), a = S.pnorm(mu + w, mu, se) - S.pnorm(mu - w, mu, se);
    return { topic: "clt", title: "Meðaltal á bili", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Hvíldarpúls fylgir dreifingu með meðaltal " + mu + " og staðalfrávik " + sd + " slög/mínútu. Tekið er slembiúrtak " + n + " einstaklinga. Hverjar eru líkurnar á að úrtaksmeðaltalið verði innan ±" + w + " slaga frá " + mu + "?</p>",
      sol: "<p>Samkvæmt höfuðsetningu tölfræðinnar er X̄ ≈ N(" + mu + ", " + sd + "²/" + n + "), staðalskekkjan " + f(se, 3) + ". P = Φ(" + f(w / se, 3) + ") − Φ(" + f(-w / se, 3) + ") = " + f(a) + ".</p><pre class=\"rcode\">diff(pnorm(c(" + (mu - w) + ", " + (mu + w) + "), " + mu + ", " + sd + "/sqrt(" + n + ")))</pre>" };
  });
})();

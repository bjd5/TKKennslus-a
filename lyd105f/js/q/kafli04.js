/* q/kafli04.js – aukaspurningar fyrir kafla 4: Normaldreifing og höfuðsetningin (efni: normal, clt). */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }

  M("normal", "Hjartsláttur heilbrigðra kvenna fylgir N(75, 13²). Hverjar eru líkurnar á yfirslætti (hjartslætti yfir 100 slögum/mín)?",
    ["0.027", "0.973", "0.441", "0.559"],
    "<code>pnorm(100, 75, 13, lower.tail = FALSE)</code> = 0.0272 (spurning 7 á lokaprófinu 2025).");
  M("normal", "Hjartsláttur fylgir N(75, 13²). Hver þarf hjartslátturinn að vera til að kona sé í hópi þeirra 10% sem eru með hægasta hjartsláttinn?",
    ["58.34 slög/mín eða minna", "91.66 slög/mín", "44.76 slög/mín", "67.98 slög/mín"],
    "<code>qnorm(0.10, 75, 13)</code> = 75 − 1.2816·13 = 58.34 (spurning 8 á lokaprófinu 2025).");
  M("normal", "Hjartsláttur fylgir N(75, 13²) og P(X > 100) = 0.027. Í slembiúrtaki 150 kvenna, hve margar má búast við að hafi yfirslátt?",
    ["Um 4.1", "0.027", "0", "145.9"],
    "Væntanlegur fjöldi = n·p = 150·0.0272 = 4.1 (spurning 9 á lokaprófinu 2025).");
  M("normal", "Ef X ~ N(μ, σ²), hvaða dreifingu fylgir Z = (X − μ)/σ?",
    ["Stöðluðu normaldreifingunni N(0, 1)", "N(μ, 1)", "t-dreifingu", "N(0, σ²)"],
    "Stöðlun gerir okkur kleift að nota eina töflu (Φ) fyrir allar normaldreifingar.");
  M("normal", "Hvað er Φ(0) í staðlaðri normaldreifingu?",
    ["0.5", "0", "1", "0.3989"],
    "Dreifingin er samhverf um 0, svo helmingur líkindanna er neðan við 0. (0.3989 er þéttifallið í 0.)");
  M("normal", "Hvað gefur <code>dnorm(120, 120, 10)</code>?",
    ["Hæð þéttifallsins í x = 120, ekki líkur", "P(X = 120)", "P(X ≤ 120) = 0.5", "Prósentumark"],
    "Fyrir samfellda breytu er P(X = x) = 0. Þéttifallið gefur hæð ferilsins.");
  M("normal", "Systólískur blóðþrýstingur fylgir N(120, 10²). Hvert er efsta 5% markið?",
    ["136.4 mmHg", "139.6 mmHg", "130 mmHg", "116.4 mmHg"],
    "<code>qnorm(0.95, 120, 10)</code> = 120 + 1.645·10 = 136.4 (lokaprófið 2024).");
  M("normal", "X ~ N(120, 10²). Hverjar eru líkurnar á að X sé á milli 115 og 125?",
    ["0.383", "0.691", "0.309", "0.950"],
    "Φ(0.5) − Φ(−0.5) = 0.6915 − 0.3085 = 0.383.");
  M("normal", "Hvernig getur þú kannað hvort gögn séu u.þ.b. normaldreifð?",
    ["Með normaldreifingarriti (QQ-riti): punktarnir eiga að liggja nálægt beinni línu", "Með því að athuga hvort meðaltal sé jákvætt", "Með kökuriti", "Með því að telja NA-gildi"],
    "Í R: <code>qqnorm(x); qqline(x)</code>. Stuðlarit getur líka gefið vísbendingu.");
  M("normal", "Hvort er líklegra: að ein kona mælist með púls yfir 85, eða að <b>meðaltal</b> 25 kvenna sé yfir 85, ef púls fylgir N(75, 13²)?",
    ["Að ein kona mælist yfir 85; meðaltalið hefur miklu minni breytileika", "Að meðaltalið sé yfir 85", "Jafn líklegt", "Ekki hægt að segja"],
    "Ein kona: P = 0.221. Meðaltal: SE = 13/5 = 2.6, z = 3.85, P ≈ 0.00006.");
  M("clt", "Meðalsystólískur blóðþrýstingur 200 einstaklinga úr N(120, 10²). Hvaða dreifingu fylgir X̄?",
    ["N(120, 10²/200) = N(120, 0.5)", "N(120, 10²)", "N(120, 10/200)", "Poisson(120)"],
    "Dreifni meðaltalsins er σ²/n = 100/200 = 0.5; staðalskekkjan er √0.5 = 0.707.");
  M("clt", "Hvað er <b>staðalskekkja</b> (standard error) meðaltals?",
    ["Staðalfrávik úrtaksdreifingar meðaltalsins, σ/√n", "Staðalfrávik einstakra mælinga", "Dreifni þýðisins", "Munurinn á x̄ og μ í einu úrtaki"],
    "Staðalskekkjan segir hve mikið x̄ sveiflast milli úrtaka. Hún minnkar með √n.");
  M("clt", "Hvaða fullyrðing um höfuðsetninguna (CLT) er <b>röng</b>?",
    ["Hún segir að einstakar mælingar verði normaldreifðar ef úrtakið er stórt", "Hún á við um meðaltöl úr hvaða dreifingu sem er með endanlega dreifni", "Nálgunin batnar eftir því sem n stækkar", "Hún skýrir af hverju normaldreifingin er svo oft notuð"],
    "CLT fjallar um úrtaksdreifingu <b>meðaltalsins</b>. Einstakar mælingar halda sinni dreifingu.");
  M("clt", "Fjöldi sjúklinga á klukkutíma fylgir Poisson(4). Skoðaðir eru 50 klukkutímar. Hvaða dreifingu fylgir meðalfjöldinn nálgunarlega?",
    ["N(4, 4/50)", "Poisson(4)", "N(4, 4)", "N(200, 4)"],
    "Fyrir Poisson er μ = σ² = λ = 4. CLT: X̄ ≈ N(4, 4/50) (lokaprófið 2024).");
  M("clt", "Lögmál mikils fjölda segir:",
    ["Úrtaksmeðaltalið nálgast væntigildið μ þegar n stækkar", "Öll gögn verða normaldreifð", "Dreifnin eykst með n", "p-gildi verða alltaf marktæk"],
    "CLT bætir við lögun dreifingarinnar um μ.");
  M("clt", "Mæld er þyngd sjúklinga með meðaltal 75.3 kg og dreifni 912.02 kg². Hvert er staðalfrávik meðaltals 100 sjúklinga?",
    ["3.02 kg", "9.12 kg", "30.2 kg", "0.302 kg"],
    "SE = √(912.02/100) = √9.1202 = 3.02 kg.");
  M("clt", "Hve mikið þarf að stækka úrtak til að helminga staðalskekkjuna?",
    ["Fjórfalda það", "Tvöfalda það", "Þrefalda það", "Áttfalda það"],
    "SE = σ/√n; √4 = 2.");
  M("clt", "Úrtaksdreifing <b>hlutfalls</b> p̂ er fyrir stórt n nálgunarlega:",
    ["N(p, p(1 − p)/n)", "N(p, p(1 − p))", "Poisson(np)", "N(np, np)"],
    "p̂ er meðaltal 0/1-breytu, svo CLT gildir. Staðalskekkjan er √(p(1 − p)/n).");

  // ---------- Reiknidæmi ----------
  B.G.push(function normLower() {
    var mu = rnd(70, 80), sd = rnd(10, 14), x = mu - rnd(10, 25);
    var a = S.pnorm(x, mu, sd);
    return { topic: "normal", title: "Líkur í neðri hala", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Hvíldarpúls fylgir N(" + mu + ", " + sd + "²). Hægsláttur (bradycardia) er púls undir " + x + " slögum/mín. Hverjar eru líkurnar á að einstaklingur valinn af handahófi sé með hægslátt?</p>",
      sol: "<p>z = (" + x + " − " + mu + ")/" + sd + " = " + f((x - mu) / sd, 3) + ", Φ(z) = " + f(a) + ".</p><pre class=\"rcode\">pnorm(" + x + ", " + mu + ", " + sd + ")</pre>" };
  });
  B.G.push(function cltProbBetween() {
    var mu = rnd(70, 80), sd = rnd(10, 15), n = pick([16, 25, 36, 64, 100]), w = pick([1, 2, 3]);
    var se = sd / Math.sqrt(n), a = S.pnorm(mu + w, mu, se) - S.pnorm(mu - w, mu, se);
    return { topic: "clt", title: "Meðaltal á bili", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Hvíldarpúls fylgir dreifingu með meðaltal " + mu + " og staðalfrávik " + sd + " slög/mín. Tekið er slembiúrtak " + n + " manns. Hverjar eru líkurnar á að úrtaksmeðaltalið verði innan ±" + w + " slaga frá " + mu + "?</p>",
      sol: "<p>X̄ ≈ N(" + mu + ", " + sd + "²/" + n + "), SE = " + f(se, 3) + ". P = Φ(" + f(w / se, 3) + ") − Φ(" + f(-w / se, 3) + ") = " + f(a) + ".</p><pre class=\"rcode\">pnorm(" + (mu + w) + ", " + mu + ", " + sd + "/sqrt(" + n + ")) - pnorm(" + (mu - w) + ", " + mu + ", " + sd + "/sqrt(" + n + "))</pre>" };
  });
})();

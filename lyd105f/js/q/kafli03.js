/* q/kafli03.js – spurningar fyrir kafla 3: Líkur, tvíkosta- og Poisson-dreifing (efni: binom, poisson).
 * Byggt á fyrirlestradæmum (kennsluvika 3, „aukadæmi 4a“), lausnum við kafla 5 (aefingk5.Rmd)
 * og lokaprófunum 2024 og 2025. Orðalag eins og í áfanganum. */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  function pct(x) { return Math.round(x * 100) + "%"; }

  // ---------- Tvíkostadreifing: krossaspurningar ----------
  M("binom", "Af þeim sjúklingum sem koma á bráðamóttöku í Reykjavík eru um 24% með beinbrot. Séu 5 sjúklingar valdir af handahófi, hvaða líkindadreifingu er eðlilegt að gera ráð fyrir að fjöldi þeirra sem eru með beinbrot fylgi?",
    ["Tvíkostadreifingu með stikana n = 5 og p = 0.24", "Poisson dreifingu með stikann λ = 0.24", "Tvíkostadreifingu með stikana n = 5 og p = 0.76", "Normaldreifingu með stikana μ = 5 og σ² = 0.24"],
    "Fastur fjöldi (5) óháðra tilrauna, hver með sömu líkur (0.24) á „árangri“: X ~ Bin(5, 0.24).");
  M("binom", "Af sjúklingum á bráðamóttöku eru um 24% með beinbrot. Séu 5 sjúklingar valdir af handahófi, hverjar eru líkurnar á að a.m.k. 3 séu með beinbrot?",
    ["0.093", "0.254", "0.901", "0.987"],
    "P(X ≥ 3) = 1 − P(X ≤ 2) = <code>1 - pbinom(2, 5, 0.24)</code> = 0.0932 (spurning 5 á lokaprófinu 2025). 0.254 er u.þ.b. P(X = 2) = <code>dbinom(2, 5, 0.24)</code>.");
  M("binom", "Af sjúklingum á bráðamóttöku eru um 24% með beinbrot. Séu 5 sjúklingar valdir af handahófi, hverjar eru líkurnar á að færri en 2 séu með beinbrot?",
    ["0.654", "0.907", "0.254", "0.093"],
    "„Færri en 2“ þýðir X ≤ 1: <code>pbinom(1, 5, 0.24)</code> = 0.654 (spurning 6 á lokaprófinu 2025). 0.907 er P(X ≤ 2).");
  M("binom", "Bóluefni hefur sýnt 70% virkni í að koma í veg fyrir sýkingu. 10 einstaklingar fá bóluefnið. Hverjar eru líkurnar á að nákvæmlega 7 séu varðir?",
    ["0.267", "0.383", "0.617", "0.700"],
    "X ~ Bin(10, 0.7). P(X = 7) = (10 yfir 7)·0.7⁷·0.3³ = <code>dbinom(7, 10, 0.7)</code> = 0.267 (lokaprófið 2024). 0.617 er P(X ≤ 7) og 0.383 er P(X ≥ 8).");
  M("binom", "Bóluefni hefur 70% virkni og 10 einstaklingar fá það. Hvaða R-skipun gefur líkurnar á að a.m.k. 8 séu varðir?",
    ["<code>1 - pbinom(7, 10, 0.7)</code>", "<code>1 - pbinom(8, 10, 0.7)</code>", "<code>pbinom(8, 10, 0.7)</code>", "<code>dbinom(8, 10, 0.7)</code>"],
    "P(X ≥ 8) = 1 − P(X ≤ 7) = 0.383. Einnig <code>sum(dbinom(8:10, 10, 0.7))</code> eða <code>pbinom(7, 10, 0.7, lower.tail = F)</code>.");
  M("binom", "Á hversu marga vegu er hægt að fá þrjár sexur sé teningi kastað fimm sinnum, ef okkur er sama um hverjar hinar tvær útkomurnar eru?",
    ["10", "3", "15", "60"],
    "Tvíliðustuðullinn (5 yfir 3) = 5!/(3!·2!) = 10, í R <code>choose(5, 3)</code>.");
  M("binom", "Erla kastar sex hliða teningi 15 sinnum. Hver er dreifnin á fjölda sexa sem upp koma?",
    ["2.08", "2.5", "1.44", "15"],
    "X ~ Bin(15, 1/6). Var[X] = np(1 − p) = 15·(1/6)·(5/6) = 2.08. 2.5 er væntigildið np og 1.44 er staðalfrávikið.");
  M("binom", "Á prófi eru 4 svarmöguleikar við hverja spurningu. Lalli lati svarar fimm spurningum og giskar í hvert skipti. Látum X tákna fjölda réttra svara. Hvert er væntigildi X?",
    ["1.25", "0.94", "2", "0.25"],
    "X ~ Bin(5, 0.25), E[X] = np = 5·0.25 = 1.25. 0.94 er dreifnin np(1 − p).");
  M("binom", "Lalli lati giskar á fimm spurningar með 4 svarmöguleika hver. Hverjar eru líkurnar á að hann svari að minnsta kosti einni spurningu rétt?",
    ["Um 76%", "Um 40%", "Um 24%", "Um 63%"],
    "P(X ≥ 1) = 1 − P(X = 0) = 1 − 0.75⁵ = 0.763. Um 40% eru líkurnar á nákvæmlega einu réttu svari, <code>dbinom(1, 5, 0.25)</code> = 0.396.");
  M("binom", "Í þorpi nokkru eru 8% þorpsbúa með malaríu. Séu 5 þorpsbúar valdir af handahófi, hverjar eru líkurnar á að a.m.k. einn sé með malaríu? Gerum ráð fyrir að atburðirnir séu óháðir.",
    ["Um 34%", "Um 66%", "Um 40%", "Um 8%"],
    "P(X ≥ 1) = 1 − (1 − 0.08)⁵ = 1 − 0.659 = 0.341. 66% eru líkurnar á að <b>enginn</b> sé með malaríu, og 40% fæst með því að margfalda 5·0.08.");
  M("binom", "Hvaða forsenda tvíkostadreifingar bregst ef 10 einstaklingar úr <b>sömu fjölskyldu</b> eru skoðaðir til að kanna arfgengan sjúkdóm?",
    ["Að tilraunirnar séu óháðar", "Að fjöldi tilrauna sé fastur", "Að aðeins séu tvær útkomur", "Að líkurnar séu á bilinu 0 til 1"],
    "Fjölskyldumeðlimir deila genum, svo útkomurnar eru háðar hver annarri.");
  M("binom", "Teningi er kastað 8 sinnum. Hvaða R-skipun gefur líkurnar á að fá <b>færri en þrjár</b> sexur?",
    ["<code>pbinom(2, 8, 1/6)</code>", "<code>pbinom(3, 8, 1/6)</code>", "<code>dbinom(3, 8, 1/6)</code>", "<code>1 - pbinom(2, 8, 1/6)</code>"],
    "P(X < 3) = P(X ≤ 2) = <code>pbinom(2, 8, 1/6)</code> = 0.865 (dæmi 5.3 c).");
  M("binom", "Hvenær er sæmilegt að nálga tvíkostadreifingu með normaldreifingu?",
    ["Þegar np og n(1 − p) eru báðar nógu stórar (t.d. ≥ 5)", "Þegar p er mjög lítið og n lítið", "Þegar n = 1", "Þegar p er nálægt 0 eða 1, óháð n"],
    "Þá er Bin(n, p) ≈ N(np, np(1 − p)).");

  // ---------- Poisson: krossaspurningar ----------
  M("poisson", "Gerum ráð fyrir að meðalfjöldi sjúklinga sem koma á bráðamóttöku sé 4 á klukkutíma. Hverjar eru líkurnar á að á einum klukkutíma komi þrír eða færri sjúklingar?",
    ["0.433", "0.238", "0.629", "0.195"],
    "X ~ Poisson(4). P(X ≤ 3) = <code>ppois(3, 4)</code> = 0.4335 (spurning 2 á lokaprófinu 2025). 0.195 er P(X = 3) og 0.629 er P(X ≤ 4).");
  M("poisson", "Meðalfjöldi sjúklinga á bráðamóttöku er 4 á klukkutíma. Hverjar eru líkurnar á að á einum klukkutíma komi sex sjúklingar?",
    ["0.104", "0.889", "0.285", "0.156"],
    "<code>dpois(6, 4)</code> = e<sup>−4</sup>·4⁶/6! = 0.1042 (spurning 3 á lokaprófinu 2025). 0.889 er P(X ≤ 6).");
  M("poisson", "Á ferðamannastað nokkrum koma að meðaltali tveir ferðamenn á klukkutíma. Eðlilegt er að gera ráð fyrir að slembistærðin X, fjöldi ferðamanna á klukkutíma, fylgi:",
    ["Poisson dreifingu með stikann λ = 2", "Poisson dreifingu með stikann λ = 2·24 = 48", "Tvíkostadreifingu með stikana n = 2 og p = 1/2", "Normaldreifingu með μ = 2 og σ² = 4"],
    "Talning atburða á föstu tímabili (einum klukkutíma) með föstum meðalhraða: Poisson(λ = 2). λ = 48 ætti við heilan sólarhring.");
  M("poisson", "Á ferðamannastað koma að meðaltali tveir ferðamenn á klukkutíma. Líkurnar á að <b>fleiri en tveir</b> komi á næsta klukkutíma má reikna sem:",
    ["1 − (P(X = 0) + P(X = 1) + P(X = 2))", "P(X = 0) + P(X = 1) + P(X = 2)", "1 − (P(X = 0) + P(X = 1))", "P(X = 3)"],
    "P(X > 2) = 1 − P(X ≤ 2). Í R: <code>1 - ppois(2, 2)</code> = 0.323.");
  M("poisson", "Á ferðamannastað koma að meðaltali tveir ferðamenn á klukkutíma. Hverjar eru líkurnar á að einn eða fleiri komi á næstu <b>tveimur</b> klukkutímum?",
    ["Um 98%", "Um 86%", "Um 91%", "Um 2%"],
    "Á tveimur klukkutímum er λ = 2·2 = 4. P(X ≥ 1) = 1 − e<sup>−4</sup> = 0.982. 86% fæst ef λ = 2 er notað óbreytt.");
  M("poisson", "Gerum ráð fyrir að Kötlugos fylgi Poisson dreifingu með stikann λ = 2 á öld. Hverjar eru líkurnar á a.m.k. einu Kötlugosi á öld?",
    ["0.865", "0.135", "0.271", "0.594"],
    "P(X ≥ 1) = 1 − P(X = 0) = <code>1 - dpois(0, 2)</code> = 0.865 (dæmi 5.5). 0.135 er P(X = 0) og 0.271 er P(X = 1).");
  M("poisson", "Í handboltaleik er meðalfjöldi marka 0.8 á mínútu. Hvaða stika á að nota til að reikna líkurnar á nákvæmlega 5 mörkum á <b>þremur</b> mínútum?",
    ["λ = 3·0.8 = 2.4", "λ = 0.8", "λ = 0.8/3 = 0.27", "λ = 5"],
    "Stikinn skalast með lengd tímabilsins: λ = 2.4, og P(Y = 5) = <code>dpois(5, 2.4)</code> = 0.060 (dæmi 5.7 c).");
  M("poisson", "Skiptiborð fær að meðaltali 2.4 símtöl á mínútu. Hvaða R-skipun gefur líkurnar á að fá að minnsta kosti tvö símtöl á mínútu?",
    ["<code>1 - ppois(1, 2.4)</code>", "<code>1 - ppois(2, 2.4)</code>", "<code>ppois(2, 2.4)</code>", "<code>dpois(2, 2.4)</code>"],
    "P(X ≥ 2) = 1 − P(X ≤ 1) = 0.692. Sama fæst með <code>ppois(1, 2.4, lower.tail = F)</code> (dæmi 5.10 b).");
  M("poisson", "Hvaða eiginleiki einkennir Poisson dreifingu?",
    ["Væntigildið og dreifnin eru jöfn (bæði λ)", "Hún er alltaf samhverf", "Dreifnin er λ² en væntigildið λ", "Hún hefur fastan fjölda tilrauna n"],
    "E[X] = Var[X] = λ. Fyrir lítið λ er dreifingin hægri-skekkt.");
  M("poisson", "Fyrir hvaða breytu er Poisson dreifing <b>síst</b> viðeigandi?",
    ["Hæð fullorðinna", "Fjöldi sjúkrabílaútkalla á klukkutíma", "Fjöldi nýrra krabbameinstilfella á ári í sveitarfélagi", "Fjöldi fæðinga á vakt"],
    "Hæð er samfelld talnabreyta; Poisson dreifing lýsir talningu atburða.");
  M("poisson", "Hvert er staðalfrávik X ef X ~ Poisson(λ = 9)?",
    ["3", "9", "81", "4.5"],
    "Var[X] = λ = 9, svo staðalfrávikið er √9 = 3.");

  // ---------- Reiknidæmi ----------
  // eftir aefingk5, dæmi 5.3: teningi kastað n sinnum
  B.G.push(function binTeningur() {
    var n = rnd(6, 12), typ = pick(["exact", "atmost", "fewer"]), k = rnd(1, 3);
    var a, txt, sol, r;
    if (typ === "exact") { a = S.dbinom(k, n, 1 / 6); txt = "að fá nákvæmlega " + k + " sinnum sexu"; sol = "P(X = " + k + ") = (" + n + " yfir " + k + ")·(1/6)<sup>" + k + "</sup>·(5/6)<sup>" + (n - k) + "</sup>"; r = "dbinom(" + k + ", " + n + ", 1/6)"; }
    else if (typ === "atmost") { a = S.pbinom(k, n, 1 / 6); txt = "að fá " + k + " eða færri ása"; sol = "P(X ≤ " + k + ") = P(X = 0) + … + P(X = " + k + ")"; r = "pbinom(" + k + ", " + n + ", 1/6)\nsum(dbinom(0:" + k + ", " + n + ", 1/6))"; }
    else { a = S.pbinom(k, n, 1 / 6); txt = "að fá færri en " + (k + 1) + " sexur"; sol = "P(X < " + (k + 1) + ") = P(X ≤ " + k + ")"; r = "pbinom(" + k + ", " + n + ", 1/6)"; }
    return { topic: "binom", title: "Teningakast (tvíkostadreifing)", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Teningi er kastað " + n + " sinnum. Reiknið líkurnar á " + txt + ".</p>",
      sol: "<p>Tilraunin er framkvæmd n = " + n + " sinnum og líkurnar á atburðinum í hverju kasti eru p = 1/6, svo X ~ Bin(" + n + ", 1/6). " + sol + " = " + f(a) + ".</p><pre class=\"rcode\">" + r + "</pre>" };
  });
  // eftir fyrirlestradæmi kennsluviku 3, spurning 6 (malaría)
  B.G.push(function binAmkEinn() {
    var c = pick([["þorpi nokkru", "þorpsbúa", "með malaríu"], ["bæjarfélagi", "íbúa", "með sykursýki"], ["skóla", "nemenda", "með ofnæmi"]]);
    var p = rnd(4, 15) / 100, n = rnd(4, 10), a = 1 - Math.pow(1 - p, n);
    return { topic: "binom", title: "Að minnsta kosti einn", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Í " + c[0] + " eru " + pct(p) + " " + c[1] + " " + c[2] + ". Séu " + n + " valdir af handahófi, hverjar eru líkurnar á að a.m.k. einn sé " + c[2] + "? Gerum ráð fyrir að atburðirnir séu óháðir.</p>",
      sol: "<p>X ~ Bin(" + n + ", " + p + "). P(X ≥ 1) = 1 − P(X = 0) = 1 − (1 − " + p + ")<sup>" + n + "</sup> = 1 − " + f(Math.pow(1 - p, n)) + " = " + f(a) + ".</p><pre class=\"rcode\">1 - dbinom(0, " + n + ", " + p + ")\n1 - pbinom(0, " + n + ", " + p + ")</pre>" };
  });
  // eftir fyrirlestradæmi kennsluviku 3, spurningar 7-9 (Lalli lati giskar)
  B.G.push(function binGisk() {
    var m = pick([3, 4, 5]), n = rnd(5, 10), k = rnd(1, 3), p = 1 / m, a = S.dbinom(k, n, p);
    return { topic: "binom", title: "Giskað á krossaspurningar", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Á prófi eru " + m + " svarmöguleikar við hverja spurningu. Lalli lati svarar " + n + " spurningum og ákveður að giska á svarið í hvert skipti. Hverjar eru líkurnar á að Lalli svari nákvæmlega " + k + " spurningum rétt?</p>",
      sol: "<p>X = fjöldi réttra svara ~ Bin(" + n + ", 1/" + m + "). P(X = " + k + ") = (" + n + " yfir " + k + ")·(1/" + m + ")<sup>" + k + "</sup>·(" + (m - 1) + "/" + m + ")<sup>" + (n - k) + "</sup> = " + f(a) + ". Væntigildið er np = " + f(n / m, 2) + ".</p><pre class=\"rcode\">dbinom(" + k + ", " + n + ", 1/" + m + ")</pre>" };
  });
  // eftir lokaprófinu 2025, spurningar 5-6 (beinbrot á bráðamóttöku)
  B.G.push(function binBeinbrot() {
    var p = rnd(18, 32) / 100, n = rnd(5, 8), k = rnd(2, 3), amk = Math.random() < 0.5;
    var a = amk ? S.pbinom(k - 1, n, p, false) : S.pbinom(k - 1, n, p);
    return { topic: "binom", title: "Beinbrot á bráðamóttöku", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Af þeim sjúklingum sem koma á bráðamóttöku eru um " + pct(p) + " með beinbrot. Séu " + n + " sjúklingar valdir af handahófi, hverjar eru líkurnar á að " + (amk ? "a.m.k. " + k : "færri en " + k) + " séu með beinbrot?</p>",
      sol: "<p>X ~ Bin(" + n + ", " + p + "). " + (amk ? "P(X ≥ " + k + ") = 1 − P(X ≤ " + (k - 1) + ")" : "P(X < " + k + ") = P(X ≤ " + (k - 1) + ")") + " = " + f(a) + ".</p><pre class=\"rcode\">" + (amk ? "1 - pbinom(" + (k - 1) + ", " + n + ", " + p + ")" : "pbinom(" + (k - 1) + ", " + n + ", " + p + ")") + "</pre>" };
  });
  // eftir fyrirlestradæmi kennsluviku 3, spurningar 3-4 (fæðingar á vakt)
  B.G.push(function poisFaedingar() {
    var l = rnd(2, 5), two = Math.random() < 0.5, k = two ? rnd(4, 8) : 1, L = two ? 2 * l : l;
    var a = two ? S.dpois(k, L) : S.ppois(1, l, false);
    return { topic: "poisson", title: "Fæðingar á vakt", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Gerum ráð fyrir að meðalfjöldi fæðinga á spítala nokkrum séu " + l + " fæðingar á vakt. " + (two ? "Hverjar eru líkurnar á að á tveimur vöktum fæðist " + k + " börn?" : "Hverjar eru líkurnar á að á einni vakt fæðist fleiri en eitt barn?") + "</p>",
      sol: two ? "<p>Á tveimur vöktum er stikinn λ = 2·" + l + " = " + L + ". P(X = " + k + ") = e<sup>−" + L + "</sup>·" + L + "<sup>" + k + "</sup>/" + k + "! = " + f(a) + ".</p><pre class=\"rcode\">dpois(" + k + ", " + L + ")</pre>"
        : "<p>X ~ Poisson(" + l + "). P(X > 1) = 1 − P(X = 0) − P(X = 1) = 1 − e<sup>−" + l + "</sup>(1 + " + l + ") = " + f(a) + ".</p><pre class=\"rcode\">1 - ppois(1, " + l + ")</pre>" };
  });
  // eftir aefingk5, dæmi 5.10 (skiptiborð)
  B.G.push(function poisSimtol() {
    var l = rnd(15, 35) / 10, typ = pick(["amk", "fleiri", "tvaer"]), k, a, txt, r;
    if (typ === "amk") { k = 2; a = S.ppois(1, l, false); txt = "að fá að minnsta kosti tvö símtöl á mínútu"; r = "1 - ppois(1, " + l + ")"; }
    else if (typ === "fleiri") { k = 3; a = S.ppois(3, l, false); txt = "að fá fleiri en 3 símtöl á mínútu"; r = "1 - ppois(3, " + l + ")"; }
    else { k = rnd(4, 7); a = S.dpois(k, 2 * l); txt = "að fá " + k + " símtöl á tveimur mínútum"; r = "dpois(" + k + ", 2 * " + l + ")"; }
    return { topic: "poisson", title: "Símtöl á skiptiborði", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Skiptiborð í banka fær að meðaltali " + l + " símtöl á mínútu. Reiknið líkurnar á " + txt + ".</p>",
      sol: "<p>" + (typ === "amk" ? "P(X ≥ 2) = 1 − P(X < 2) = 1 − P(X ≤ 1)" : typ === "fleiri" ? "P(X > 3) = 1 − P(X ≤ 3)" : "Á tveimur mínútum þarf stikann 2·" + l + " = " + f(2 * l, 2) + ", og P(X = " + k + ")") + " = " + f(a) + ".</p><pre class=\"rcode\">" + r + "</pre>" };
  });
  // eftir aefingk5, dæmi 5.5 og 5.7 (Kötlugos, handbolti)
  B.G.push(function poisAmkEinn() {
    var c = pick([["ljóna sem sjást í safaríferð", "í næstu ferð", "ferð"], ["Kötlugosa", "á næstu öld", "öld"], ["útkalla þyrlu Landhelgisgæslunnar á nóttu", "næstu nótt", "nótt"]]);
    var l = rnd(5, 30) / 10, a = 1 - Math.exp(-l);
    return { topic: "poisson", title: "Að minnsta kosti einn atburður", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Gerum ráð fyrir að fjöldi " + c[0] + " fylgi Poisson dreifingu með stikann λ = " + l + " á " + c[2] + ". Hverjar eru líkurnar á að a.m.k. einn atburður verði " + c[1] + "?</p>",
      sol: "<p>P(X ≥ 1) = 1 − P(X < 1) = 1 − P(X = 0) = 1 − e<sup>−" + l + "</sup> = " + f(a) + ".</p><pre class=\"rcode\">1 - dpois(0, " + l + ")</pre>" };
  });
  B.G.push(function poisBetween() {
    var l = rnd(3, 8), a = rnd(1, l), b = a + rnd(1, 3);
    var v = S.ppois(b, l) - S.ppois(a - 1, l);
    return { topic: "poisson", title: "Á bili (Poisson)", unit: "", tol: 0.005, absTol: 0.0005, answer: v,
      text: "<p>Gerum ráð fyrir að meðalfjöldi sjúklinga sem koma á bráðamóttöku sé " + l + " á klukkutíma. Hverjar eru líkurnar á að á einum klukkutíma komi á bilinu " + a + " til " + b + " sjúklingar (að báðum meðtöldum)?</p>",
      sol: "<p>P(" + a + " ≤ X ≤ " + b + ") = P(X ≤ " + b + ") − P(X ≤ " + (a - 1) + ") = " + f(S.ppois(b, l)) + " − " + f(S.ppois(a - 1, l)) + " = " + f(v) + ".</p><pre class=\"rcode\">ppois(" + b + ", " + l + ") - ppois(" + (a - 1) + ", " + l + ")\nsum(dpois(" + a + ":" + b + ", " + l + "))</pre>" };
  });
})();

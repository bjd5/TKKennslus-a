/* q/kafli03.js – aukaspurningar fyrir kafla 3: Líkur, tvíkosta- og Poisson-dreifing (efni: binom, poisson). */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }

  // ---------- Tvíkostadreifing ----------
  M("binom", "Um 24% sjúklinga á bráðamóttöku eru með beinbrot. Valdir eru 5 sjúklingar af handahófi. Hvaða dreifingu fylgir fjöldi þeirra sem eru með beinbrot?",
    ["Bin(n = 5, p = 0.24)", "Poisson(λ = 0.24)", "N(5, 0.24)", "Bin(n = 0.24, p = 5)"],
    "Fastur fjöldi (5) óháðra tilrauna, hver með líkur 0.24 á „árangri“: tvíkostadreifing.");
  M("binom", "Hvaða R-skipun gefur P(X ≥ 3) ef X ~ Bin(5, 0.24)?",
    ["<code>1 - pbinom(2, 5, 0.24)</code>", "<code>1 - pbinom(3, 5, 0.24)</code>", "<code>pbinom(3, 5, 0.24)</code>", "<code>dbinom(3, 5, 0.24)</code>"],
    "P(X ≥ 3) = 1 − P(X ≤ 2). Útkoman er 0.0932 (spurning 5 á lokaprófinu 2025).");
  M("binom", "X ~ Bin(5, 0.24). Hverjar eru líkurnar á að <b>færri en 2</b> séu með beinbrot?",
    ["0.654", "0.907", "0.254", "0.093"],
    "P(X < 2) = P(X ≤ 1) = <code>pbinom(1, 5, 0.24)</code> = 0.654 (spurning 6 á lokaprófinu 2025).");
  M("binom", "Hvað gefur <code>dbinom(7, 10, 0.7)</code>?",
    ["P(X = 7) þegar X ~ Bin(10, 0.7), u.þ.b. 0.267", "P(X ≤ 7), u.þ.b. 0.617", "P(X ≥ 7)", "Væntigildið 7"],
    "<code>d</code>-föllin gefa massafallið P(X = k) fyrir strjálar dreifingar; <code>p</code>-föllin uppsöfnuð líkindi P(X ≤ k).");
  M("binom", "Hvert er væntigildi X ~ Bin(n = 200, p = 0.05)?",
    ["10", "190", "9.5", "0.05"],
    "E[X] = np = 200·0.05 = 10.");
  M("binom", "Hvenær er normaldreifingarnálgun á tvíkostadreifingu sæmileg?",
    ["Þegar np og n(1 − p) eru báðar nógu stórar (t.d. ≥ 5 eða 10)", "Þegar p er mjög lítið og n lítið", "Aldrei", "Þegar n = 1"],
    "Þá er Bin(n, p) ≈ N(np, np(1 − p)).");
  M("binom", "Hver er túlkun tvíliðustuðulsins (n yfir k)?",
    ["Fjöldi leiða til að velja hvaða k af n tilraunum heppnast", "Líkurnar á k árangri", "Væntigildið", "Fjöldi tilrauna"],
    "Þess vegna er P(X = k) = (n yfir k)·p<sup>k</sup>(1 − p)<sup>n−k</sup>: hver röð hefur sömu líkur og (n yfir k) raðir eru til.");
  M("binom", "Bóluefni veitir vörn í 70% tilfella. 10 manns eru bólusettir. Hvaða fullyrðing er rétt?",
    ["P(a.m.k. 8 varðir) = <code>sum(dbinom(8:10, 10, 0.7))</code> ≈ 0.383", "P(a.m.k. 8 varðir) = <code>pbinom(8, 10, 0.7)</code>", "P(nákvæmlega 7 varðir) = 0.7", "Fjöldi varinna fylgir Poisson(7)"],
    "P(X ≥ 8) = P(8) + P(9) + P(10) = 0.233 + 0.121 + 0.028 = 0.383.");
  M("binom", "Hvaða forsenda tvíkostadreifingar bregst ef 10 sjúklingar eru valdir úr <b>sömu fjölskyldu</b> til að kanna arfgengan sjúkdóm?",
    ["Óhæði tilraunanna", "Fastur fjöldi tilrauna", "Aðeins tvær útkomur", "Ekkert, hún gildir"],
    "Fjölskyldumeðlimir deila genum, svo útkomurnar eru háðar.");
  M("binom", "Hver er dreifni X ~ Bin(n, p)?",
    ["np(1 − p)", "np", "√(np)", "p(1 − p)"],
    "Var[X] = np(1 − p); staðalfrávikið er √(np(1 − p)).");
  M("binom", "Hverjar eru líkurnar á að <b>enginn</b> af 4 sjúklingum svari meðferð ef hver svarar með líkum 0.4?",
    ["0.6<sup>4</sup> ≈ 0.130", "0.4<sup>4</sup> ≈ 0.026", "1 − 0.4<sup>4</sup>", "4·0.6 = 2.4"],
    "P(X = 0) = (1 − p)<sup>n</sup> = 0.6<sup>4</sup> = 0.1296.");

  // ---------- Poisson ----------
  M("poisson", "Að meðaltali koma 4 sjúklingar á bráðamóttöku á klukkutíma. Hverjar eru líkurnar á að <b>þrír eða færri</b> komi á einum klukkutíma?",
    ["0.433", "0.238", "0.629", "0.195"],
    "<code>ppois(3, 4)</code> = 0.4335 (spurning 2 á lokaprófinu 2025).");
  M("poisson", "Að meðaltali koma 4 sjúklingar á klukkutíma. Hverjar eru líkurnar á að nákvæmlega 6 komi?",
    ["0.104", "0.889", "0.285", "0.156"],
    "<code>dpois(6, 4)</code> = e<sup>−4</sup>·4<sup>6</sup>/6! = 0.1042 (spurning 3 á lokaprófinu 2025).");
  M("poisson", "Fjöldi ILI-tilfella er að meðaltali 4 á dag. Hvaða dreifingu fylgir fjöldi tilfella á <b>einni viku</b>?",
    ["Poisson(λ = 28)", "Poisson(λ = 4)", "Bin(7, 4)", "Poisson(λ = 4/7)"],
    "λ skalast með lengd tímabilsins: 7·4 = 28.");
  M("poisson", "Hvaða eiginleiki einkennir Poisson-dreifingu?",
    ["Væntigildi og dreifni eru jöfn (bæði λ)", "Hún er alltaf samhverf", "Hún tekur neikvæð gildi", "Hún hefur fastan fjölda tilrauna n"],
    "E[X] = Var[X] = λ. Fyrir lítið λ er hún hægri-skekkt.");
  M("poisson", "Hvaða R-skipun gefur P(X ≥ 3) ef X ~ Poisson(4)?",
    ["<code>ppois(2, 4, lower.tail = FALSE)</code>", "<code>ppois(3, 4, lower.tail = FALSE)</code>", "<code>dpois(3, 4)</code>", "<code>ppois(3, 4)</code>"],
    "P(X ≥ 3) = P(X > 2) = 1 − <code>ppois(2, 4)</code> = 0.762.");
  M("poisson", "Hvenær nálgast tvíkostadreifing Poisson-dreifingu?",
    ["Þegar n er stórt og p lítið, með λ = np", "Þegar p = 0.5", "Þegar n er lítið", "Aldrei"],
    "Sjaldgæfir atburðir í mörgum tilraunum: Bin(n, p) ≈ Poisson(np).");
  M("poisson", "Hverjar eru líkurnar á að enginn atburður verði ef X ~ Poisson(λ)?",
    ["e<sup>−λ</sup>", "λ", "1 − λ", "0"],
    "P(X = 0) = e<sup>−λ</sup>λ<sup>0</sup>/0! = e<sup>−λ</sup>.");
  M("poisson", "Fyrir hvaða breytu er Poisson-dreifing <b>síst</b> viðeigandi?",
    ["Hæð fullorðinna", "Fjöldi sjúkrabílaútkalla á klukkutíma", "Fjöldi nýrra krabbameinstilfella á ári í sveitarfélagi", "Fjöldi stökkbreytinga í DNA-bút"],
    "Hæð er samfelld breyta; Poisson lýsir talningu atburða.");
  M("poisson", "Hvert er staðalfrávik X ~ Poisson(λ = 9)?",
    ["3", "9", "81", "4.5"],
    "Var[X] = λ = 9, svo staðalfrávikið er √9 = 3.");
  M("poisson", "Í R er <code>sum(dpois(0:4, 4))</code> sama og:",
    ["<code>ppois(4, 4)</code> = P(X ≤ 4)", "<code>ppois(3, 4)</code>", "<code>dpois(4, 4)</code>", "<code>1 - ppois(4, 4)</code>"],
    "Summa massafallsins frá 0 til k er uppsafnaða dreififallið P(X ≤ k) = 0.629.");

  // ---------- Viðbótarreiknidæmi ----------
  B.G.push(function binExpected() {
    var n = rnd(8, 15), p = rnd(10, 40) / 100, k = rnd(1, 3);
    var a = S.pbinom(k - 1, n, p, false);
    return { topic: "binom", title: "Að minnsta kosti k (tvíkosta)", unit: "", tol: 0.005, absTol: 0.0005, answer: a,
      text: "<p>Af reykingafólki sem reynir að hætta tekst það " + Math.round(p * 100) + "% án aðstoðar innan árs. Í hópi " + n + " reykingamanna, hverjar eru líkurnar á að a.m.k. " + k + " hætti?</p>",
      sol: "<p>X ~ Bin(" + n + ", " + p + "). P(X ≥ " + k + ") = 1 − P(X ≤ " + (k - 1) + ") = " + f(a) + ".</p><pre class=\"rcode\">1 - pbinom(" + (k - 1) + ", " + n + ", " + p + ")</pre>" };
  });
  B.G.push(function poisBetween() {
    var l = rnd(3, 8), a = rnd(1, l), b = a + rnd(1, 3);
    var v = S.ppois(b, l) - S.ppois(a - 1, l);
    return { topic: "poisson", title: "Á bili (Poisson)", unit: "", tol: 0.005, absTol: 0.0005, answer: v,
      text: "<p>Að meðaltali berast " + l + " sýni á rannsóknarstofu á klukkutíma. Hverjar eru líkurnar á að á einum klukkutíma berist á bilinu " + a + " til " + b + " sýni (að báðum meðtöldum)?</p>",
      sol: "<p>P(" + a + " ≤ X ≤ " + b + ") = P(X ≤ " + b + ") − P(X ≤ " + (a - 1) + ") = " + f(S.ppois(b, l)) + " − " + f(S.ppois(a - 1, l)) + " = " + f(v) + ".</p><pre class=\"rcode\">ppois(" + b + ", " + l + ") - ppois(" + (a - 1) + ", " + l + ")\nsum(dpois(" + a + ":" + b + ", " + l + "))</pre>" };
  });
})();

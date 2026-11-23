/* q/kafli11.js – spurningar fyrir kafla 11: Lifunargreining (efni: lifun).
 * Byggðar á verkefnum áfangans: lokapróf 2025 (spurningar 14–15, Cox og Kaplan–Meier fyrir
 * hjartasjúkdóm), prófspurning um lifun (ristilkrabbamein, survival::colon), æfingin með
 * UNOS-gögnunum (tíðni atburða og hættuhlutfall), Kaplan–Meier og Cox með WCGS-gögnunum. */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var T = "lifun";
  var KM = '<pre class="rcode">&gt; km &lt;- survfit(Surv(TIMEDTH / 365.25, DEATH) ~ hjarta, data = fr)\n&gt; km\n                 n events median 0.95LCL 0.95UCL\nhjarta=No CHD 4240   1406     NA      NA      NA\nhjarta=CHD     194    144   14.2    11.9    16.1\n&gt; summary(km, times = c(5, 10, 20))\n                hjarta=No CHD\n time n.risk n.event survival std.err lower 95% CI upper 95% CI\n    5   4099     141    0.967 0.00275        0.961        0.972\n   10   3885     214    0.916 0.00425        0.908        0.925\n   20   3177     708    0.749 0.00666        0.736        0.762\n\n                hjarta=CHD\n time n.risk n.event survival std.err lower 95% CI upper 95% CI\n    5    158      36    0.814  0.0279        0.762        0.871\n   10    120      38    0.619  0.0349        0.554        0.691\n   20     71      50    0.361  0.0345        0.299        0.435</pre>';
  var COX = '<pre class="rcode">&gt; fit &lt;- coxph(Surv(time, status) ~ Lev + Lev_5FU + age, data = colon2)\n&gt; summary(fit)\n  n= 929, number of events= 452\n\n             coef exp(coef)  se(coef)      z Pr(&gt;|z|)\nLev     -0.027493  0.972881  0.110313 -0.249  0.80318\nLev_5FU -0.373805  0.688111  0.118811 -3.146  0.00165 **\nage      0.002368  1.002370  0.004045  0.585  0.55836\n\n        exp(coef) exp(-coef) lower .95 upper .95\nLev        0.9729     1.0279    0.7837    1.2077\nLev_5FU    0.6881     1.4533    0.5452    0.8685\nage        1.0024     0.9976    0.9945    1.0103\n\nLikelihood ratio test= 12.49  on 3 df,   p=0.006\nWald test            = 11.9  on 3 df,   p=0.008\nScore (logrank) test = 12.02  on 3 df,   p=0.007</pre>';
  var FC = '<pre class="rcode">&gt; summary(coxph(Surv(TIMEDTH / 365.25, DEATH) ~ hjarta, data = fr))\n  n= 4434, number of events= 1550\n\n             coef exp(coef) se(coef)     z Pr(&gt;|z|)\nhjartaCHD 1.32399   3.75840  0.08776 15.09   &lt;2e-16 ***\n\n          exp(coef) exp(-coef) lower .95 upper .95\nhjartaCHD     3.758     0.2661     3.164     4.464</pre>';
  // Prófspurning um lifun: summary(survfit) fyrir meðferðarhópana í ristilkrabbameinsrannsókninni
  var CK = '<pre class="rcode">&gt; km &lt;- survfit(Surv(time, status) ~ rx, data = colon2)\n&gt; km\n             n events median 0.95LCL 0.95UCL\nrx=Obs     315    168   2083    1656    2789\nrx=Lev     310    161   2152    1540      NA\nrx=Lev+5FU 304    123     NA    2725      NA\n&gt; s &lt;- summary(km, times = 1000)\n&gt; data.frame(strata = s$strata, time = s$time, n.risk = s$n.risk,\n+            n.event = s$n.event, survival = round(s$surv, 3))\n      strata time n.risk n.event survival\n1     rx=Obs 1000    211     103    0.672\n2     rx=Lev 1000    203     107    0.655\n3 rx=Lev+5FU 1000    227      77    0.747</pre>';
  // Æfingin með UNOS-gögnunum: lifun barna eftir nýrnaígræðslu, lifandi (0) eða látinn (1) gjafi
  var UN = '<pre class="rcode">&gt; nrow(unos); sum(unos$death); sum(unos$fu)\n[1] 9775\n[1] 465\n[1] 38004.91\n&gt; tapply(unos$death, unos$txtype, sum)\n  0   1\n177 288\n&gt; tapply(unos$fu, unos$txtype, sum)\n       0        1\n20694.43 17310.48</pre>';

  // ---------- Lokapróf 2025, spurningar 14–15: hjartasjúkdómur í Framingham ----------
  M(T, FC + "Þið notið Cox-líkan til að skoða lifun eftir því hvort manneskjan hafi greinst með hjartasjúkdóm eða ekki. Hvað af eftirfarandi gildir?",
    ["Þeir sem eru með hjartasjúkdóm eru í 3.758 sinnum meiri áhættu á að deyja en þeir sem ekki eru með hann, og tengslin eru marktæk þar sem p-gildið er minna en 0.05", "Þeir sem eru ekki með hjartasjúkdóm eru í 3.758 sinnum meiri áhættu á að deyja en þeir sem eru með hann, og tengslin eru marktæk", "Þeir sem eru með hjartasjúkdóm eru í 15.09 sinnum meiri áhættu á að deyja, og tengslin eru marktæk", "Þeir sem eru með hjartasjúkdóm eru í 1.324 sinnum meiri áhættu á að deyja, og tengslin eru ekki marktæk"],
    "exp(coef) = 3.758 er áhættuhlutfallið fyrir CHD miðað við viðmiðunarflokkinn „No CHD“, og p &lt; 2·10⁻¹⁶. 15.09 er z-gildið og 1.324 er coef (log HR), ekki HR.");
  M(T, FC + "Hvað er <code>exp(-coef) = 0.2661</code>?",
    ["Áhættuhlutfallið fyrir „No CHD“ miðað við CHD", "Lifun CHD-hópsins eftir eitt ár", "Neðri mörk öryggisbilsins fyrir áhættuhlutfallið", "Staðalskekkja stuðulsins"],
    "exp(−coef) = 1/3.758 = 0.266: sama samband séð frá hinum hópnum.");
  M(T, KM + "Hvað lesið þið út frá Kaplan–Meier úttakinu?",
    ["Þeir sem eru með hjartasjúkdóm eru með verri lifun: eftir 20 ár eru um 36% á lífi á móti um 75% þeirra sem ekki voru með hjartasjúkdóm", "Þeir sem eru með hjartasjúkdóm eru með betri lifun: eftir 20 ár eru um 75% á lífi", "Lifunin er svipuð í hópunum, því báðir ferlarnir byrja í 1", "Þeir sem eru með hjartasjúkdóm eru með verri lifun: eftir 20 ár eru 71 látnir af 194"],
    "Í línunni time = 20 er survival 0.361 fyrir CHD og 0.749 fyrir No CHD. n.risk = 71 er fjöldi enn í áhættu, ekki fjöldi látinna.");
  M(T, KM + "Hver er metin lifun eftir 10 ár hjá þeim sem voru með hjartasjúkdóm (CHD) í upphafi?",
    ["0.619", "0.916", "0.814", "0.361"],
    "Í töflunni fyrir hjarta=CHD, línan time = 10: survival = 0.619.");
  M(T, KM + "Af hverju er miðgildi lifunar <code>NA</code> fyrir hópinn án hjartasjúkdóms?",
    ["Lifunarferillinn fer aldrei niður fyrir 0.5 á eftirfylgdartímanum", "Engin dauðsföll urðu í hópnum", "Gögn um lifunartíma vantar í hópnum", "Hópurinn er of lítill til að meta miðgildið"],
    "Eftir 20 ár er lifunin enn 0.749, svo helmingurinn hefur ekki dáið.");
  M(T, KM + "Eftir hve langan tíma hefur helmingur þeirra sem voru með hjartasjúkdóm dáið?",
    ["Um 14.2 ár", "Um 11.9 ár", "Um 10 ár", "Um 20 ár"],
    "Miðgildi lifunar (median) er 14.2 ár, með 95% öryggisbil 11.9–16.1 ár.");
  M(T, KM + "Hvað þýðir dálkurinn <code>n.risk</code>?",
    ["Fjöldi sem er enn á lífi og í eftirfylgd rétt fyrir þann tíma", "Fjöldi sem hefur dáið fram að þeim tíma", "Fjöldi sem hefur verið skertur fram að þeim tíma", "Fjöldi sem dó nákvæmlega á þeim tíma"],
    "n.risk er fjöldi í áhættu rétt fyrir tímann. Hann lækkar bæði vegna dauðsfalla og skerðingar.");

  // ---------- Prófspurning um lifun: ristilkrabbamein ----------
  M(T, CK + "Hver er heildarlifunin eftir 1000 daga hjá þeim sem fengu Lev+5FU samkvæmt þessum gögnum?",
    ["0.747", "0.672", "0.655", "227"],
    "Í línunni rx=Lev+5FU er survival = 0.747 við time = 1000. 227 er fjöldi í áhættu.");
  M(T, CK + "Eftir u.þ.b. hve langan tíma hafa 50% þeirra sem voru undir eftirliti (Obs) dáið?",
    ["Um 2083 daga", "Um 1000 daga", "Um 1656 daga", "Það er ekki hægt að meta, því miðgildið er NA"],
    "Miðgildi lifunar í Obs-hópnum er 2083 dagar (95% öryggisbil 1656–2789). Í Lev+5FU-hópnum er það NA, því ferillinn fer ekki niður fyrir 0.5.");
  M(T, COX + "Skrifið aðhvarfsjöfnu Cox-líkansins.",
    ["h(t) = h₀(t)·exp(−0.0275·Lev − 0.3738·Lev_5FU + 0.0024·age)", "h(t) = −0.0275 − 0.3738·Lev_5FU + 0.0024·age", "S(t) = 0.973·Lev + 0.688·Lev_5FU + 1.002·age", "h(t) = h₀(t) + 0.973·Lev + 0.688·Lev_5FU + 1.002·age"],
    "Áhættufallið er grunnáhætta h₀(t) margfölduð með exp af línulegri samantekt skýribreytanna, með stuðlunum úr coef-dálkinum.");
  M(T, COX + "Hvaða meðferð lækkar marktækt áhættu á dauða miðað við eftirlit (Obs), að teknu tilliti til aldurs? Rökstyðjið með öryggisbilum og p-gildum.",
    ["Lev+5FU: HR = 0.688 (0.545–0.869), p = 0.0017", "Lev: HR = 0.973 (0.784–1.208), p = 0.80", "Báðar meðferðirnar, því báðir stuðlarnir eru neikvæðir", "Hvorug, því Concordance er aðeins 0.548"],
    "Bilið fyrir Lev+5FU inniheldur ekki 1. Bilið fyrir Lev inniheldur 1, svo levamisól eitt og sér hefur ekki marktæk áhrif. Neikvæður stuðull einn og sér segir ekkert um marktekt.");
  M(T, COX + "Um hve mörg prósent lækkar áhættan með Lev+5FU?",
    ["Um 31%", "Um 37%", "Um 69%", "Um 45%"],
    "1 − 0.688 = 0.312: HR = 0.688 þýðir 31% lægri áhættu (hazard). 37% fæst ef coef (−0.374) er lesið sem prósenta.");
  M(T, COX + "Er aldur marktækt tengdur lifun í líkaninu?",
    ["Nei, því p = 0.558 og öryggisbilið fyrir HR inniheldur 1", "Já, því HR fyrir aldur er stærra en 1", "Já, því stuðullinn fyrir aldur er jákvæður", "Nei, því aldur er samfelld breyta"],
    "HR = 1.0024 á ár (95% bil 0.995–1.010) er nánast 1.");

  // ---------- Æfingin með UNOS-gögnunum ----------
  M(T, UN + "Hver er stiki hættufallsins λ (tíðni atburða) fyrir alla, miðað við fasta hættu yfir tíma?",
    ["465/38004.91 ≈ 0.0122 dauðsföll á mannár", "465/9775 ≈ 0.0476 dauðsföll á mannár", "38004.91/465 ≈ 81.7 dauðsföll á mannár", "9775/38004.91 ≈ 0.257 dauðsföll á mannár"],
    "λ = fjöldi atburða / heildareftirfylgnitími = 465/38004.91. 465/9775 er hlutfall látinna, sem tekur ekki tillit til mislangrar eftirfylgni.");
  M(T, UN + "Reiknið hættuhlutfallið milli txtype = 1 (látinn gjafi) og txtype = 0 (lifandi gjafi).",
    ["Um 1.95", "Um 0.51", "Um 1.63", "Um 0.83"],
    "λ₁ = 288/17310.48 = 0.0166 og λ₀ = 177/20694.43 = 0.0086. Hættuhlutfallið er λ₁/λ₀ = 1.95. 1.63 = 288/177 tekur ekki tillit til eftirfylgnitímans.");

  // ---------- Hugtök ----------
  M(T, "Hvað er <b>skerðing</b> (censoring) í dæmigerðri klínískri rannsókn?",
    ["Sjúklingur sem er á lífi þegar rannsókn lýkur", "Sjúklingur sem deyr á meðan á rannsókn stendur", "Sjúklingur sem hættir á lyfinu en er fylgt eftir", "Sjúklingur með óvenju langan lifunartíma"],
    "Við vitum aðeins að lifunartími hans er lengri en eftirfylgdartíminn. Í R er skert mæling merkt með + (t.d. 1664+ í WCGS-gögnunum).");
  M(T, "Af hverju má ekki bara sleppa skertum einstaklingum eða telja þá sem látna?",
    ["Hvort tveggja bjagar matið, því þeir lifðu a.m.k. til skerðingartímans", "Það má, ef skerðingin er jafn algeng í öllum hópum", "Það má, því það minnkar bara úrtakið", "Það má, ef skertir eru færri en 10%"],
    "Tími fram að skerðingu skiptir jafn miklu máli og tími fram að atburði.");
  M(T, "Hvernig er Kaplan–Meier metillinn reiknaður?",
    ["Ŝ(t) = Π(1 − d<sub>i</sub>/n<sub>i</sub>) yfir atburðatíma fram að t", "Ŝ(t) = hlutfall þeirra sem eru á lífi á tíma t af öllum í upphafi", "Ŝ(t) = Σ d<sub>i</sub>/n<sub>i</sub> yfir atburðatíma fram að t", "Ŝ(t) = 1 − (fjöldi látinna)/(fjöldi skertra)"],
    "d<sub>i</sub> er fjöldi atburða á tímapunkti i og n<sub>i</sub> fjöldi þeirra sem eru enn í áhættu.");
  M(T, "Hvernig lítur Kaplan–Meier ferill út?",
    ["Tröppulaga, byrjar í 1 og fellur við hvern atburð", "Tröppulaga, byrjar í 0 og hækkar við hvern atburð", "Bein lína frá 1 niður í 0", "Tröppulaga, fellur við hverja skerðingu"],
    "Ferillinn er óbreyttur milli atburða. Skerðingar lækka ekki ferilinn, en minnka n.risk.");
  M(T, "Hvaða R-skipun ber saman lifunarferla hópa með log-rank prófi?",
    ["<code>survdiff(Surv(time, status) ~ hopur, data = d)</code>", "<code>t.test(time ~ hopur)</code>", "<code>chisq.test(status, hopur)</code>", "<code>survfit(Surv(time, status) ~ 1)</code>"],
    "Log-rank prófar H₀: lifunarferlarnir eru eins.");
  M(T, "Hvað er <b>áhættufall</b> (hazard)?",
    ["Augnabliksáhætta á atburði á tíma t hjá þeim sem hafa lifað fram að t", "Líkurnar á að lifa lengur en t", "Hlutfall þeirra sem hafa dáið fram að t", "Fjöldi í áhættu á tíma t"],
    "Áhættuhlutfallið (HR) í Cox-líkani er hlutfall áhættufalla tveggja hópa.");
  M(T, "Kaplan–Meier ferlar tveggja hópa skerast. Hvað bendir það til?",
    ["Að forsendan um hlutfallslega áhættu standist hugsanlega ekki", "Að lifun hópanna sé eins", "Að log-rank prófið sé marktækt", "Að HR sé nákvæmlega 1"],
    "Ef HR væri fast yfir tíma ættu ferlarnir ekki að skerast.");
  M(T, "Lifunartími er oft hægri-skekktur og skertur. Af hverju er t-próf á lifunartíma óheppilegt?",
    ["Það ræður ekki við skerðingu og gerir ráð fyrir normaldreifingu", "Það krefst þess að hóparnir séu jafnstórir", "Það má ekki nota á tíma sem svarbreytu", "Það hefur of lítinn styrk í stórum úrtökum"],
    "Lifunargreining (Kaplan–Meier, log-rank, Cox) er hönnuð fyrir skertar mælingar.");

  // ---------- Reiknidæmi ----------
  // Kaplan–Meier WCGS sýnikóðinn: Ŝ(t) = Π(1 − d_i/n_i)
  B.G.push(function kmStep() {
    var n = rnd(20, 35), s = 1, ni = n, tt = 0, steps = [];
    for (var i = 0; i < 4; i++) {
      var d = rnd(1, 3), c = rnd(0, 2);
      tt += rnd(2, 6);
      steps.push({ t: tt, d: d, n: ni });
      s *= 1 - d / ni;
      ni -= d + c;
    }
    var rows = steps.map(function (st) { return "<tr><td>" + st.t + "</td><td>" + st.n + "</td><td>" + st.d + "</td></tr>"; }).join("");
    return { topic: T, title: "Kaplan–Meier metillinn", unit: "", tol: 0.003, answer: s,
      text: "<p>Í lifunarrannsókn (n = " + n + ") fengust þessir atburðatímar (mánuðir), fjöldi í áhættu og fjöldi dauðsfalla. Milli atburða voru nokkrir skertir.</p><table class=\"tt\"><tr><th>tími</th><th>n í áhættu</th><th>dauðsföll</th></tr>" + rows + "</table><p>Reiknið Kaplan–Meier matið á lifun eftir síðasta atburðatímann.</p>",
      sol: "<p>Ŝ(t) = Π(1 − d<sub>i</sub>/n<sub>i</sub>) = " + steps.map(function (st) { return "(1 − " + st.d + "/" + st.n + ")"; }).join("·") + " = " + f(s) + ".</p><pre class=\"rcode\">prod(1 - c(" + steps.map(function (st) { return st.d; }).join(", ") + ") / c(" + steps.map(function (st) { return st.n; }).join(", ") + "))</pre>" };
  });
  // Æfingin með UNOS-gögnunum: hættuhlutfall úr tíðni atburða
  B.G.push(function unosHR() {
    var d0 = rnd(120, 220), t0 = rnd(15000, 25000), d1 = rnd(200, 320), t1 = rnd(12000, 22000);
    var l0 = d0 / t0, l1 = d1 / t1, hr = l1 / l0;
    return { topic: T, title: "Hættuhlutfall úr tíðni atburða", unit: "", tol: 0.003, answer: hr,
      text: "<p>Í gögnum um lifun barna eftir nýrnaígræðslu létust " + d0 + " af þeim sem fengu nýra frá lifandi gjafa (txtype = 0), með heildareftirfylgni " + t0 + " ár, og " + d1 + " af þeim sem fengu nýra frá látnum gjafa (txtype = 1), með heildareftirfylgni " + t1 + " ár. Reiknið λ fyrir hvorn hóp miðað við fasta hættu yfir tíma og svo hættuhlutfallið txtype = 1 á móti txtype = 0.</p>",
      sol: "<p>λ₀ = " + d0 + "/" + t0 + " = " + f(l0, 5) + " og λ₁ = " + d1 + "/" + t1 + " = " + f(l1, 5) + " dauðsföll á mannár. Hættuhlutfallið er λ₁/λ₀ = " + f(hr, 3) + ".</p><pre class=\"rcode\">lambda &lt;- c(" + d0 + " / " + t0 + ", " + d1 + " / " + t1 + ")\nlambda[2] / lambda[1]</pre>" };
  });
  B.G.push(function coxHRk() {
    var b = pick([0.002368, 0.055475, 0.0125, 0.0312]), k = pick([5, 10, 20]);
    var hr = Math.exp(k * b);
    return { topic: T, title: "Áhættuhlutfall fyrir k einingar", unit: "", tol: 0.003, answer: hr,
      text: "<p>Í Cox-líkani er stuðullinn (coef) fyrir aldur " + b + " á ár. Hvert er áhættuhlutfallið fyrir einstakling sem er " + k + " árum eldri, að öðru óbreyttu?</p>",
      sol: "<p>HR = exp(" + k + "·" + b + ") = " + f(hr) + ".</p><pre class=\"rcode\">exp(" + k + " * " + b + ")</pre>" };
  });
  B.G.push(function coxCI() {
    var b = pick([-0.373805, 1.32399, 0.54099, -0.6]), se = pick([0.118811, 0.08776, 0.18806, 0.15]), up = Math.random() < 0.5;
    var v = Math.exp(b + (up ? 1 : -1) * 1.96 * se);
    return { topic: T, title: "Öryggisbil fyrir áhættuhlutfall", unit: "", tol: 0.003, answer: v,
      text: "<p>Cox-líkan gefur coef = " + b + " og se(coef) = " + se + ". Reiknið " + (up ? "efri" : "neðri") + " mörk 95% öryggisbils fyrir áhættuhlutfallið.</p>",
      sol: "<p>Bilið er reiknað á log-kvarða og svo tekið exp: exp(" + b + " " + (up ? "+" : "−") + " 1.96·" + se + ") = " + f(v) + ". Bilið allt: [" + f(Math.exp(b - 1.96 * se)) + ", " + f(Math.exp(b + 1.96 * se)) + "].</p><pre class=\"rcode\">exp(" + b + " + c(-1, 1) * qnorm(0.975) * " + se + ")</pre>" };
  });
  B.G.push(function coxZ() {
    // |z| á bilinu 1–3.2 svo p-gildið verði hvorki nánast 0 né nánast 1
    var se = rnd(8, 30) / 100, b = Math.round((Math.random() < 0.5 ? -1 : 1) * rnd(100, 320) / 100 * se * 1000) / 1000;
    var z = b / se, p = 2 * S.pnorm(-Math.abs(z));
    return { topic: T, title: "p-gildi í Cox-líkani", unit: "", tol: 0.01, absTol: 0.0005, answer: p,
      text: "<p>Í Cox-líkani er coef = " + b + " og se(coef) = " + se + ". Reiknið p-gildi Wald-prófsins fyrir H₀: β = 0.</p>",
      sol: "<p>z = coef/se = " + f(z, 3) + ", p = 2·Φ(−|z|) = " + (p < 0.0001 ? "&lt; 0.0001" : f(p)) + ".</p><pre class=\"rcode\">2 * pnorm(-abs(" + b + " / " + se + "))</pre>" };
  });
  B.G.push(function survExp() {
    var lam = pick([0.05, 0.1, 0.02, 0.08]), t = pick([5, 10, 12, 20]);
    var s = Math.exp(-lam * t);
    return { topic: T, title: "Lifun með fastri hættu", unit: "", tol: 0.003, answer: s,
      text: "<p>Ef hættufallið er fast, h(t) = λ = " + lam + " á ári, er lifunarfallið S(t) = e<sup>−λt</sup>. Hverjar eru líkurnar á að lifa lengur en " + t + " ár?</p>",
      sol: "<p>S(" + t + ") = e<sup>−" + lam + "·" + t + "</sup> = " + f(s) + ". Miðgildi lifunar er ln(2)/λ = " + f(Math.log(2) / lam, 2) + " ár.</p><pre class=\"rcode\">exp(-" + lam + " * " + t + ")</pre>" };
  });
})();

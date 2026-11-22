/* q/kafli11.js – aukaspurningar fyrir kafla 11: Lifunargreining (efni: lifun). */
(function () {
  "use strict";
  var B = window.TK.bank, S = window.Stat, rnd = B.rnd, pick = B.pick;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  function f(x, d) { var s = (+x).toFixed(d == null ? 4 : d); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }
  var T = "lifun";
  var KM = '<pre class="rcode">&gt; km &lt;- survfit(Surv(TIMEDTH / 365.25, DEATH) ~ hjarta, data = fr)\n&gt; km\n                 n events median 0.95LCL 0.95UCL\nhjarta=No CHD 4240   1406     NA      NA      NA\nhjarta=CHD     194    144   14.2    11.9    16.1\n&gt; summary(km, times = c(5, 10, 20))\n                hjarta=No CHD\n time n.risk n.event survival std.err lower 95% CI upper 95% CI\n    5   4099     141    0.967 0.00275        0.961        0.972\n   10   3885     214    0.916 0.00425        0.908        0.925\n   20   3177     708    0.749 0.00666        0.736        0.762\n\n                hjarta=CHD\n time n.risk n.event survival std.err lower 95% CI upper 95% CI\n    5    158      36    0.814  0.0279        0.762        0.871\n   10    120      38    0.619  0.0349        0.554        0.691\n   20     71      50    0.361  0.0345        0.299        0.435</pre>';
  var COX = '<pre class="rcode">&gt; summary(coxph(Surv(time, status) ~ Lev + Lev_5FU + age, data = colon2))\n  n= 929, number of events= 452\n\n             coef exp(coef)  se(coef)      z Pr(&gt;|z|)\nLev     -0.027493  0.972881  0.110313 -0.249  0.80318\nLev_5FU -0.373805  0.688111  0.118811 -3.146  0.00165 **\nage      0.002368  1.002370  0.004045  0.585  0.55836\n\n        exp(coef) exp(-coef) lower .95 upper .95\nLev        0.9729     1.0279    0.7837    1.2077\nLev_5FU    0.6881     1.4533    0.5452    0.8685\nage        1.0024     0.9976    0.9945    1.0103\n\nLikelihood ratio test= 12.49  on 3 df,   p=0.006\nWald test            = 11.9  on 3 df,   p=0.008\nScore (logrank) test = 12.02  on 3 df,   p=0.007</pre>';
  var FC = '<pre class="rcode">&gt; summary(coxph(Surv(TIMEDTH / 365.25, DEATH) ~ hjarta, data = fr))\n  n= 4434, number of events= 1550\n\n             coef exp(coef) se(coef)     z Pr(&gt;|z|)\nhjartaCHD 1.32399   3.75840  0.08776 15.09   &lt;2e-16 ***\n\n          exp(coef) exp(-coef) lower .95 upper .95\nhjartaCHD     3.758     0.2661     3.164     4.464</pre>';

  M(T, KM + "Hver er metin lifun eftir 10 ár hjá þeim sem voru með hjartasjúkdóm (CHD) í upphafi?",
    ["0.619", "0.916", "120", "0.361"],
    "Í töflunni fyrir hjarta=CHD, línan time = 10: survival = 0.619.");
  M(T, KM + "Af hverju er miðgildi lifunar <code>NA</code> fyrir hópinn án hjartasjúkdóms?",
    ["Lifunarferillinn fer aldrei niður fyrir 0.5 á eftirfylgdartímanum", "Engin dauðsföll urðu í hópnum", "Gögn vantar", "Hópurinn er of lítill"],
    "Eftir 20 ár er lifunin enn 0.749, svo helmingurinn hefur ekki dáið.");
  M(T, KM + "Eftir hve langan tíma hefur helmingur þeirra sem voru með CHD dáið?",
    ["Um 14.2 ár (95% bil 11.9–16.1)", "Um 10 ár", "Um 20 ár", "Aldrei"],
    "Miðgildi lifunar er tíminn þar sem metin lifun fer niður í 0.5.");
  M(T, KM + "Hvað þýðir dálkurinn <code>n.risk</code>?",
    ["Fjöldi sem er enn í áhættu (á lífi og ekki skertur) á þeim tíma", "Fjöldi látinna", "Fjöldi skertra", "Heildarfjöldi í hópnum"],
    "n.risk lækkar bæði vegna dauðsfalla og skerðingar.");
  M(T, FC + "Hvaða túlkun á Cox-líkaninu er rétt?",
    ["Þeir sem voru með CHD eru í 3.76 sinnum meiri áhættu á að deyja á hverjum tíma en þeir sem voru það ekki; marktækt (p &lt; 2·10⁻¹⁶)", "Þeir sem voru ekki með CHD eru í 3.76 sinnum meiri áhættu", "76% þeirra með CHD deyja", "HR er 1.32"],
    "exp(coef) = 3.758 er HR fyrir CHD miðað við viðmiðunarflokkinn „No CHD“.");
  M(T, FC + "Hvað er <code>exp(-coef) = 0.2661</code>?",
    ["HR fyrir „No CHD“ miðað við CHD (1/3.758)", "p-gildið", "Lifunarlíkur", "Staðalskekkja"],
    "Sama samband séð frá hinum hópnum.");
  M(T, COX + "Hvaða meðferð lækkar marktækt áhættu á dauða miðað við eftirlit (Obs), að aldri óbreyttum?",
    ["Lev+5FU: HR = 0.688 (95% bil 0.545–0.869), p = 0.0017", "Lev: HR = 0.973", "Báðar meðferðirnar", "Hvorug"],
    "Bilið fyrir Lev inniheldur 1 (0.78–1.21), svo levamisól eitt og sér hefur ekki marktæk áhrif.");
  M(T, COX + "Um hve mörg prósent lækkar áhættan með Lev+5FU?",
    ["Um 31% (1 − 0.688)", "Um 37%", "Um 69%", "Um 45%"],
    "HR = 0.688 þýðir 31.2% lægri áhætta (hazard).");
  M(T, COX + "Er aldur marktækt tengdur lifun í líkaninu?",
    ["Nei: p = 0.558 og bilið fyrir HR (0.995–1.010) inniheldur 1", "Já, því HR &gt; 1", "Já, því coef er jákvætt", "Nei, því aldur er samfelld breyta"],
    "HR = 1.0024 á ár er nánast 1.");
  M(T, COX + "Hvert er Cox-líkanið á jöfnuformi?",
    ["h(t) = h₀(t)·exp(−0.0275·Lev − 0.3738·Lev_5FU + 0.0024·age)", "h(t) = −0.0275 − 0.3738·Lev_5FU + 0.0024·age", "S(t) = 0.973·Lev + 0.688·Lev_5FU", "h(t) = h₀(t) + 0.973·Lev + 0.688·Lev_5FU + 1.002·age"],
    "Áhættufallið er grunnáhætta h₀(t) margfölduð með exp af línulegri samantekt.");
  M(T, "Hvað er <b>skerðing</b> (censoring) í dæmigerðri klínískri rannsókn?",
    ["Sjúklingur sem er á lífi þegar rannsókn lýkur, eða týnist úr eftirfylgd", "Sjúklingur sem deyr", "Sjúklingur sem hættir á lyfinu en er fylgt eftir", "Útlagi"],
    "Við vitum aðeins að lifunartími hans er lengri en eftirfylgdartíminn.");
  M(T, "Af hverju má ekki bara sleppa skertum einstaklingum eða telja þá sem látna?",
    ["Hvort tveggja bjagar lifunarmatið; Kaplan–Meier nýtir upplýsingarnar um að þeir lifðu að minnsta kosti til skerðingartímans", "Það má alveg", "Það lækkar n", "R leyfir það ekki"],
    "Að sleppa þeim vanmetur lifun; að telja þá látna vanmetur hana enn meira.");
  M(T, "Hvernig er Kaplan–Meier matið reiknað?",
    ["Sem margfeldi af (1 − d<sub>i</sub>/n<sub>i</sub>) yfir alla atburðatíma fram að t", "Sem hlutfall látinna af öllum", "Sem meðaltal lifunartíma", "Með línulegu aðhvarfi"],
    "Ŝ(t) = Π(1 − d<sub>i</sub>/n<sub>i</sub>), þar sem d<sub>i</sub> eru atburðir og n<sub>i</sub> fjöldi í áhættu.");
  M(T, "Hvernig lítur Kaplan–Meier ferill út?",
    ["Tröppulaga, byrjar í 1 og fellur aðeins við atburði; skerðingar eru oft merktar með +", "Bein lína frá 1 niður í 0", "Bjöllulaga", "Hækkar með tímanum"],
    "Ferillinn er óbreyttur milli atburða.");
  M(T, "Hvaða R-skipun teiknar Kaplan–Meier feril eftir hópum?",
    ["<code>plot(survfit(Surv(time, status) ~ hopur, data = d))</code>", "<code>plot(coxph(time ~ hopur))</code>", "<code>hist(time)</code>", "<code>boxplot(time ~ status)</code>"],
    "<code>Surv(time, status)</code> býr til svarbreytu með tíma og atburðavísi (1 = atburður, 0 = skert).");
  M(T, "Hvaða R-skipun ber saman lifun hópa með log-rank prófi?",
    ["<code>survdiff(Surv(time, status) ~ hopur, data = d)</code>", "<code>t.test(time ~ hopur)</code>", "<code>chisq.test(status, hopur)</code>", "<code>survfit(time)</code>"],
    "Log-rank prófar H₀: lifunarferlarnir eru eins.");
  M(T, "Hvað er <b>áhættufall</b> (hazard)?",
    ["Augnabliksáhætta á atburði á tíma t, að því gefnu að hafa lifað fram að t", "Líkurnar á að lifa fram yfir t", "Uppsöfnuð dauðsföll", "Fjöldi í áhættu"],
    "HR í Cox-líkani er hlutfall áhættufalla tveggja hópa.");
  M(T, "Kaplan–Meier ferlar tveggja hópa skerast. Hvað bendir það til?",
    ["Að forsendan um hlutfallslega áhættu í Cox-líkani standist hugsanlega ekki", "Að hóparnir séu eins", "Að engin skerðing sé", "Að HR sé 1"],
    "Ef HR væri fast yfir tíma ættu ferlarnir ekki að skerast.");
  M(T, "Hvað mælir Concordance (C-stuðull) í <code>summary(coxph)</code>?",
    ["Hve vel líkanið raðar einstaklingum eftir áhættu; 0.5 = hending, 1 = fullkomið", "Hlutfall skertra", "p-gildi líkansins", "R²"],
    "C = 0.548 í ristilkrabbameinslíkaninu þýðir veika aðgreiningu einstaklinga þótt meðferðaráhrifin séu marktæk.");
  M(T, "Lifunartími er oft hægri-skekktur og skertur. Af hverju er t-próf á lifunartíma óheppilegt?",
    ["Það ræður ekki við skerðingu og gerir ráð fyrir normaldreifingu", "Það er of sterkt", "Það virkar bara á flokkabreytur", "Það gefur alltaf p = 0"],
    "Lifunargreining (KM, log-rank, Cox) er hönnuð fyrir skertar mælingar.");

  // ---------- Reiknidæmi ----------
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
    return { topic: T, title: "Kaplan–Meier mat", unit: "", tol: 0.003, answer: s,
      text: "<p>Í rannsókn á " + n + " sjúklingum fengust þessir atburðatímar (mánuðir), fjöldi í áhættu og fjöldi dauðsfalla. Milli atburða voru einhverjir skertir.</p><table class=\"tt\"><tr><th>tími</th><th>n í áhættu</th><th>dauðsföll</th></tr>" + rows + "</table><p>Reiknaðu Kaplan–Meier matið á lifun eftir síðasta atburðatímann.</p>",
      sol: "<p>Ŝ = " + steps.map(function (st) { return "(1 − " + st.d + "/" + st.n + ")"; }).join("·") + " = " + f(s) + ".</p><pre class=\"rcode\">prod(1 - c(" + steps.map(function (st) { return st.d; }).join(", ") + ") / c(" + steps.map(function (st) { return st.n; }).join(", ") + "))</pre>" };
  });
  B.G.push(function coxHRk() {
    var b = pick([0.002368, 0.055475, 0.0125, 0.0312]), k = pick([5, 10, 20]);
    var hr = Math.exp(k * b);
    return { topic: T, title: "HR fyrir k einingar", unit: "", tol: 0.003, answer: hr,
      text: "<p>Í Cox-líkani er stuðullinn (coef) fyrir aldur " + b + " á ár. Hvert er áhættuhlutfallið (HR) fyrir einstakling sem er " + k + " árum eldri, að öðru óbreyttu?</p>",
      sol: "<p>HR = exp(" + k + "·" + b + ") = " + f(hr) + ".</p><pre class=\"rcode\">exp(" + k + " * " + b + ")</pre>" };
  });
  B.G.push(function coxCI() {
    var b = pick([-0.373805, 1.32399, 0.54099, -0.6]), se = pick([0.118811, 0.08776, 0.18806, 0.15]), up = Math.random() < 0.5;
    var v = Math.exp(b + (up ? 1 : -1) * 1.96 * se);
    return { topic: T, title: "Öryggisbil fyrir HR", unit: "", tol: 0.003, answer: v,
      text: "<p>Cox-líkan gefur coef = " + b + " og se(coef) = " + se + ". Reiknaðu " + (up ? "efri" : "neðri") + " mörk 95% öryggisbils fyrir áhættuhlutfallið.</p>",
      sol: "<p>Bilið er reiknað á log-kvarða og svo tekið exp: exp(" + b + " " + (up ? "+" : "−") + " 1.96·" + se + ") = " + f(v) + ". Bilið allt: [" + f(Math.exp(b - 1.96 * se)) + ", " + f(Math.exp(b + 1.96 * se)) + "].</p><pre class=\"rcode\">exp(" + b + " + c(-1, 1) * qnorm(0.975) * " + se + ")</pre>" };
  });
  B.G.push(function coxZ() {
    var b = rnd(-90, 120) / 100, se = rnd(8, 30) / 100;
    var z = b / se, p = 2 * S.pnorm(-Math.abs(z));
    return { topic: T, title: "p-gildi í Cox-líkani", unit: "", tol: 0.01, absTol: 0.0005, answer: p,
      text: "<p>Í Cox-líkani er coef = " + b + " og se(coef) = " + se + ". Reiknaðu p-gildi Wald-prófsins fyrir H₀: β = 0.</p>",
      sol: "<p>z = coef/se = " + f(z, 3) + ", p = 2·Φ(−|z|) = " + f(p) + ".</p><pre class=\"rcode\">2 * pnorm(-abs(" + b + " / " + se + "))</pre>" };
  });
  B.G.push(function survExp() {
    var lam = pick([0.05, 0.1, 0.02, 0.08]), t = pick([5, 10, 12, 20]);
    var s = Math.exp(-lam * t);
    return { topic: T, title: "Lifun með fastri áhættu", unit: "", tol: 0.003, answer: s,
      text: "<p>Ef áhættufallið er fast, h(t) = " + lam + " á ári, er lifunarfallið S(t) = e<sup>−λt</sup>. Hverjar eru líkurnar á að lifa lengur en " + t + " ár?</p>",
      sol: "<p>S(" + t + ") = e<sup>−" + lam + "·" + t + "</sup> = " + f(s) + ". Miðgildi lifunar er ln(2)/λ = " + f(Math.log(2) / lam, 2) + " ár.</p><pre class=\"rcode\">exp(-" + lam + " * " + t + ")</pre>" };
  });
})();

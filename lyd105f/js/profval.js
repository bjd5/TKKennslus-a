/* profval.js – Prófavalið (profval.html): hvaða próf eða dreifingu á að nota? Nemandinn les dæmi og gengur ákvörðunartré
   þar til hann kemur að laufi, sem er borið saman við rétta svarið. */
(function () {
  "use strict";
  var A = window.App, h = A.h, esc = A.esc;

  // ---------- Ákvörðunartréð ----------
  var NODES = {
    root: { q: "Hvað snýst spurningin um?", c: [
      ["Líkur fyrir eina breytu", "Hverjar eru líkurnar á …? Hvaða dreifingu fylgir …?", "dist"],
      ["Bera saman meðaltöl", "Talnabreyta, t.d. blóðþrýstingur eða púls", "mean"],
      ["Hlutföll eða tengsl flokkabreyta", "Já/nei, flokkar, tengslatafla", "prop"],
      ["Samband tveggja talnabreyta", "Hefur x línuleg áhrif á y?", "L:lm"],
      ["Spá fyrir um já/nei útkomu", "Tvíkosta svarbreyta út frá skýribreytum", "L:glm"],
      ["Meta gæði greiningarprófs", "Jákvætt/neikvætt próf á móti raunverulegum sjúkdómi", "L:naemi"],
      ["Tími þar til atburður gerist", "Lifun, endurkoma sjúkdóms, skertar mælingar", "surv"]
    ] },
    dist: { q: "Hvers konar stærð er verið að lýsa?", c: [
      ["Fjöldi „árangra“ af n tilraunum", "Fastur fjöldi óháðra tilrauna, sömu líkur p", "L:binom"],
      ["Fjöldi atburða á tímabili", "Meðalfjöldi á klst./dag er þekktur, enginn fastur hámarksfjöldi", "L:poisson"],
      ["Ein samfelld mæling", "Bjöllulaga mæling á einum einstaklingi", "L:normal"],
      ["Meðaltal margra mælinga", "Dreifing X̄ fyrir úrtak af stærð n", "L:clt"]
    ] },
    mean: { q: "Hve mörg úrtök eða hópar eru borin saman?", c: [
      ["Eitt úrtak", "Meðaltal borið saman við fast gildi (t.d. 120 mmHg)", "L:t1"],
      ["Tveir hópar eða tvær mælingar", "", "pair"],
      ["Þrír eða fleiri hópar", "T.d. fjórir aldurshópar", "L:anova"]
    ] },
    pair: { q: "Eru mælingarnar paraðar?", c: [
      ["Já, sömu einstaklingar", "Fyrir/eftir, tvær mælingar á sama manni, pöruð systkini", "L:parad"],
      ["Nei, óháðir hópar", "Ólíkir einstaklingar í hvorum hópi", "L:oparad"]
    ] },
    prop: { q: "Hvað er borið saman?", c: [
      ["Eitt hlutfall við fast gildi", "T.d. er hlutfallið 0.5?", "L:prop1"],
      ["Tvö eða fleiri hlutföll / tengslatafla", "Tvær flokkabreytur, r × c tafla", "exp"]
    ] },
    exp: { q: "Eru allar væntar tíðnir í töflunni a.m.k. 5?", c: [
      ["Já", "Nóg af gögnum í hverjum reit", "L:chisq"],
      ["Nei, sumar eru litlar", "Fáar mælingar í einhverjum reit", "L:fisher"]
    ] },
    surv: { q: "Hvað viltu gera?", c: [
      ["Lýsa og bera saman lifunarferla hópa", "Lifun yfir tíma, miðgildi lifunar, er munur á ferlum?", "L:km"],
      ["Meta áhrif skýribreyta á áhættu", "Áhættuhlutfall (HR), leiðrétt fyrir öðrum breytum", "L:cox"]
    ] }
  };

  var LEAVES = {
    binom: { t: "Tvíkostadreifing", skill: "binom", r: "dbinom(k, size = n, prob = p)\npbinom(k, size = n, prob = p)", d: "X ~ Bin(n, p): fjöldi árangra í n óháðum tilraunum með sömu líkur p." },
    poisson: { t: "Poisson-dreifing", skill: "poisson", r: "dpois(k, lambda)\nppois(k, lambda)", d: "X ~ Poisson(λ): fjöldi atburða á tímabili. λ breytist í hlutfalli við lengd tímabilsins." },
    normal: { t: "Normaldreifing", skill: "normal", r: "pnorm(x, mean, sd)\nqnorm(p, mean, sd)", d: "X ~ N(μ, σ²): samfelld, samhverf mæling. Athugið: R notar staðalfrávik (sd), ekki dreifni." },
    clt: { t: "Höfuðsetningin (CLT): X̄ ~ N(μ, σ²/n)", skill: "clt", r: "pnorm(x, mean = mu, sd = sigma / sqrt(n))", d: "Meðaltal n óháðra mælinga er nálgunarlega normaldreift með staðalskekkju σ/√n." },
    t1: { t: "Eins úrtaks t-próf", skill: "ttest", r: "t.test(x, mu = 120)", d: "Ber meðaltal eins úrtaks saman við fast gildi μ₀. H₀: μ = μ₀." },
    parad: { t: "Parað t-próf", skill: "ttest", r: "t.test(eftir, fyrir, paired = TRUE)", d: "Tvær mælingar á sömu einstaklingum. Prófið skoðar mismuninn d = eftir − fyrir. H₀: μ_d = 0." },
    oparad: { t: "Óparað t-próf (tvö óháð úrtök)", skill: "ttest", r: "var.test(y ~ hopur, data = d)\nt.test(y ~ hopur, data = d, var.equal = TRUE)   # ef var.test gefur p > 0.05\nt.test(y ~ hopur, data = d, var.equal = FALSE)  # Welch, ef p < 0.05", d: "Ber saman meðaltöl tveggja óháðra hópa. H₀: μ₁ = μ₂. Fyrst er var.test notað til að velja var.equal." },
    anova: { t: "Fervikagreining (ANOVA)", skill: "anova", r: "summary(aov(y ~ hopur, data = d))", d: "Ber saman meðaltöl þriggja eða fleiri hópa. H₀: öll meðaltöl jöfn. F = MS hópa / MS leifa." },
    prop1: { t: "Próf fyrir eitt hlutfall", skill: "hlutfoll", r: "prop.test(x = 90, n = 238, p = 0.5)", d: "Ber hlutfall saman við fast gildi p₀. H₀: p = p₀." },
    chisq: { t: "Kí-kvaðrat próf (eða prop.test fyrir 2×2)", skill: "hlutfoll", r: "chisq.test(table(d$x, d$y))\nprop.test(table(d$x, d$y))   # tvö hlutföll", d: "Kannar tengsl tveggja flokkabreyta. H₀: breyturnar eru óháðar (hlutföllin eins)." },
    fisher: { t: "Fisher-próf", skill: "hlutfoll", r: "fisher.test(table(d$x, d$y))", d: "Nákvæmt próf á tengslatöflu þegar væntar tíðnir eru litlar (< 5). R varar þá við kí-kvaðrat nálguninni." },
    lm: { t: "Fylgni og línulegt aðhvarf", skill: "adhvarf", r: "fit <- lm(y ~ x, data = d)\nsummary(fit)\nconfint(fit)\ncor.test(d$x, d$y)", d: "y = β₀ + β₁x + ε. H₀: β₁ = 0 (ekkert línulegt samband). Forsendur: línulegt samband, óháðar, normaldreifðar leifar með jafna dreifni." },
    glm: { t: "Tvíkosta aðhvarf (logistic)", skill: "tvikosta", r: "fit <- glm(y ~ x1 + x2, data = d, family = \"binomial\")\nsummary(fit)\nexp(coef(fit))   # gagnlíkindahlutföll", d: "logit(p) = β₀ + β₁x. exp(β) er gagnlíkindahlutfall (OR) fyrir einnar einingar aukningu." },
    naemi: { t: "Næmi, sértæki, PPV og NPV (ROC)", skill: "naemi", r: "tafla <- table(Prof = d$prof, Sjukdomur = d$sjukd)\n# næmi = TP/(TP+FN), sértæki = TN/(TN+FP)\n# PPV = TP/(TP+FP), NPV = TN/(TN+FN)", d: "Mat á greiningarprófi út frá 2×2 töflu: próf (T+/T−) á móti raunverulegu ástandi (D+/D−)." },
    km: { t: "Kaplan–Meier og log-rank próf", skill: "lifun", r: "km <- survfit(Surv(time, status) ~ hopur, data = d)\nplot(km); summary(km, times = 1000)\nsurvdiff(Surv(time, status) ~ hopur, data = d)", d: "Metur lifunarferil með skertum mælingum. Log-rank prófið ber saman ferla hópa." },
    cox: { t: "Cox-líkan (hlutfallsleg áhætta)", skill: "lifun", r: "fit <- coxph(Surv(time, status) ~ x1 + x2, data = d)\nsummary(fit)   # exp(coef) = HR", d: "Metur áhættuhlutfall (HR) fyrir skýribreytur, leiðrétt hvert fyrir öðru. Forsenda: HR fast yfir tíma." }
  };

  // ---------- Dæmin ----------
  // [texti, rétt lauf, af hverju]
  var SC = [
    ["Blóðþrýstingur er mældur hjá 50 manns með háþrýsting í byrjun rannsóknar og aftur eftir 6 mánuði á nýju lyfi. Hefur lyfið áhrif á blóðþrýsting?", "parad", "Sömu einstaklingar eru mældir tvisvar, svo mælingarnar eru háðar. Prófað er hvort meðalmismunurinn sé 0."],
    ["Í púlsrannsókninni var hvíldarpúls (fyrriPuls) mældur hjá öllum. Er meðalhvíldarpúls ólíkur hjá konum og körlum?", "oparad", "Tveir óháðir hópar (konur og karlar) og talnabreyta. Fyrst var.test til að velja var.equal."],
    ["Í púlsrannsókninni hlupu sumir eftir krónukasti. Var púls þeirra sem hlupu marktækt hærri eftir hlaupið en fyrir?", "parad", "Fyrir og eftir hjá sömu einstaklingum: parað t-próf á seinniPuls − fyrriPuls."],
    ["Í púlsrannsókninni hlupu 90 af 238 þátttakendum. Krónukast átti að skipta hópnum til helminga. Er hlutfall þeirra sem hlupu frábrugðið 0.5?", "prop1", "Eitt hlutfall (90/238) borið saman við fast gildi 0.5: prop.test(90, 238, p = 0.5)."],
    ["Er púlsbreytingin (seinniPuls − fyrriPuls) að jafnaði ólík milli þeirra sem hlupu og þeirra sem sátu kyrrir?", "oparad", "Mismunurinn er ein talnabreyta fyrir hvern mann; hóparnir (hlupu/sátu) eru óháðir."],
    ["Í Framingham-gögnunum: eru tengsl á milli kyns og þess að hafa sykursýki?", "chisq", "Tvær flokkabreytur (kyn, sykursýki já/nei) í 2×2 töflu með stórar tíðnir: kí-kvaðrat eða prop.test."],
    ["Í Framingham-gögnunum: er meðal systólískur blóðþrýstingur ólíkur hjá þeim sem hafa sykursýki og þeim sem hafa hana ekki?", "oparad", "Talnabreyta (SYSBP) í tveimur óháðum hópum. var.test sýndi ólíka dreifni, svo Welch (var.equal = FALSE)."],
    ["Er kólesteról mismunandi eftir fjórum aldurshópum (30–40, 40–50, 50–60, 60–70 ára) í Framingham?", "anova", "Meðaltöl talnabreytu borin saman í fleiri en tveimur hópum."],
    ["Hvernig hefur BMI áhrif á systólískan blóðþrýsting? Smíðið líkan og túlkið hallatöluna.", "lm", "Tvær talnabreytur; spurt um línulegt samband og hallatölu."],
    ["Hefur fjöldi klukkutíma í líkamsrækt á viku áhrif á líkurnar á að einstaklingur reyki (já/nei)?", "glm", "Svarbreytan er tvíkosta (reykir já/nei) og skýribreytan samfelld: tvíkosta aðhvarf."],
    ["Í sykursýkisgögnunum: hvernig tengjast aldur og BMI því að vera með sykursýki (glyhb ≥ 7), þegar leiðrétt er fyrir báðum í einu?", "glm", "Tvíkosta svarbreyta með tveimur skýribreytum; exp(β) gefur leiðrétt OR."],
    ["Fastandi blóðsykur ≥ 126 er notaður sem greiningarpróf fyrir sykursýki. Hve stórt hlutfall sykursjúkra greinir prófið jákvætt?", "naemi", "Spurt er um næmi, P(T+ | D+)."],
    ["Greiningarpróf er jákvætt hjá sjúklingi. Hverjar eru líkurnar á að hann sé í raun með sjúkdóminn, ef algengi er 2%?", "naemi", "Jákvætt forspárgildi (PPV), sem ræðst af næmi, sértæki og algengi."],
    ["Í ristilkrabbameinsrannsókn (colon) var sjúklingum skipt í þrjá meðferðarhópa. Lýstu lifun hópanna yfir tíma og kannaðu hvort ferlarnir séu ólíkir.", "km", "Tími til dauða með skertum mælingum; lýsa og bera saman ferla: Kaplan–Meier og log-rank."],
    ["Í ristilkrabbameinsgögnunum: hefur Lev+5FU meðferð áhrif á dánaráhættu þegar leiðrétt er fyrir aldri?", "cox", "Áhrif skýribreyta á áhættu, leiðrétt: Cox-líkan og exp(coef) = HR."],
    ["Í Framingham: eru þeir sem hafa hjartasjúkdóm við upphaf í meiri dánaráhættu? Gefðu áhættuhlutfall með öryggisbili.", "cox", "Áhættuhlutfall (HR) með öryggisbili kemur úr Cox-líkani."],
    ["Á bráðamóttöku koma að meðaltali 4 sjúklingar á klukkutíma. Hverjar eru líkurnar á að þrír eða færri komi á næsta klukkutíma?", "poisson", "Fjöldi atburða á tímabili með þekktan meðalhraða: Poisson(λ = 4)."],
    ["Um 24% sjúklinga á bráðamóttöku eru með beinbrot. Séu 5 sjúklingar valdir af handahófi, hverjar eru líkurnar á að a.m.k. 3 séu með beinbrot?", "binom", "Fastur fjöldi (n = 5) óháðra tilrauna með líkur p = 0.24: Bin(5, 0.24)."],
    ["Bóluefni veitir 70% vörn. Tíu manns fá bóluefnið. Hverjar eru líkurnar á að nákvæmlega 7 séu varðir?", "binom", "n = 10 óháðir einstaklingar, hver varinn með líkum 0.7: dbinom(7, 10, 0.7)."],
    ["Hjartsláttur heilbrigðra kvenna fylgir N(75, 13²). Hverjar eru líkurnar á að kona valin af handahófi sé með hjartslátt yfir 100?", "normal", "Ein samfelld mæling á einum einstaklingi: pnorm(100, 75, 13, lower.tail = FALSE)."],
    ["Systólískur blóðþrýstingur fylgir N(120, 10²). Hvar á að setja mörkin svo aðeins efstu 5% teljist með háþrýsting?", "normal", "Prósentumark normaldreifingar: qnorm(0.95, 120, 10)."],
    ["Meðalþyngd sjúklinga er 75.3 kg með dreifni 912.02 kg². Hvaða dreifingu fylgir meðalþyngd 100 sjúklinga?", "clt", "Spurt um dreifingu meðaltals: X̄ ~ N(75.3, 912.02/100)."],
    ["Fjöldi sjúklinga á klukkutíma fylgir Poisson(4). Hvaða dreifingu fylgir meðalfjöldi á klukkutíma yfir 50 klukkutíma?", "clt", "Meðaltal margra mælinga: höfuðsetningin gefur X̄ ≈ N(4, 4/50)."],
    ["Lalli mælir langstökk allra nemenda í skólanum. Er meðalstökk lengra en 4 metrar?", "t1", "Eitt meðaltal borið saman við fast gildi 4: t.test(x, mu = 4, alternative = \"greater\")."],
    ["Er meðal systólískur blóðþrýstingur íslenskra karla frábrugðinn 115 mmHg, miðað við slembiúrtak 50 karla?", "t1", "Eitt úrtak borið saman við fast gildi 115 mmHg."],
    ["Í sykursýkisgögnunum er BMI skipt í fimm flokka. Eru tengsl á milli BMI-flokks og sykursýki? Einn flokkurinn hefur aðeins 6 manns.", "fisher", "Tengslatafla þar sem sumar væntar tíðnir eru undir 5; kí-kvaðrat nálgunin er þá ótraust."],
    ["Lítil rannsókn: 3 af 8 í meðferðarhópi og 1 af 9 í samanburðarhópi fengu aukaverkun. Er munur á tíðni aukaverkana?", "fisher", "2×2 tafla með mjög lágar tíðnir: Fisher-próf."],
    ["Er fylgni milli hvíldarpúls og aldurs í púlsrannsókninni? Er sambandið línulegt?", "lm", "Tvær talnabreytur: fylgni (cor.test) eða lm(fyrriPuls ~ aldur)."],
    ["Í plasmagögnunum er beta-karótín í blóði borið saman milli reykingaflokka (Never, Former, Current Smoker).", "anova", "Talnabreyta í þremur óháðum hópum."],
    ["Hefur trefjaneysla (fiber) áhrif á styrk beta-karótíns í blóði? Hve mikið breytist hann fyrir hvert gramm af trefjum?", "lm", "Spurt um hallatölu tveggja talnabreyta."],
    ["Í rannsókn á 400 manns reyndust 110 hafa háþrýsting. Reiknið 95% öryggisbil fyrir algengið og kannið hvort það sé frábrugðið 25%.", "prop1", "Eitt hlutfall, öryggisbil og próf gegn föstu gildi: prop.test(110, 400, p = 0.25)."],
    ["Er hlutfall reykingafólks það sama meðal nemenda í þremur námskeiðum (STAE, LAN, LÝÐ)?", "chisq", "Ein flokkabreyta (reykir) borin saman milli þriggja hópa: r × c tafla og kí-kvaðrat."],
    ["Í tvíburarannsókn er kólesteról mælt hjá báðum tvíburum þar sem annar reykir en hinn ekki. Er munur?", "parad", "Tvíburar eru pöraðir: hvort par gefur einn mismun."],
    ["Fjöldi nýrra inflúensulíkra tilfella sem tilkynnt eru á dag í litlu þorpi er að meðaltali 4. Hverjar eru líkurnar á a.m.k. 3 tilfellum á tveimur dögum?", "poisson", "Talning á tímabili; yfir tvo daga er λ = 8."],
    ["Í nýrnaígræðslugögnum (UNOS): hefur HLA-samræmi áhrif á tíma þar til ígrætt nýra bilar, leiðrétt fyrir aldri gjafa?", "cox", "Tími til atburðar með fleiri en einni skýribreytu: Cox-líkan."],
    ["Lyfjafyrirtæki vill vita hvort tvö lyf lækki blóðþrýsting jafn mikið. Hvort lyf er gefið sínum hópi 40 sjúklinga.", "oparad", "Tveir óháðir hópar (ólíkir sjúklingar) og talnabreyta (lækkun blóðþrýstings)."],
    ["Hverjar eru líkurnar á að meðaltal blóðþrýstings 25 manns valinna af handahófi úr N(120, 10²) sé yfir 124 mmHg?", "clt", "Spurt um meðaltal: X̄ ~ N(120, 10²/25), staðalskekkja 2."]
  ];

  var leafPath = {}; // lauf -> slóð (fyrir skýringu)
  (function walk(id, path) {
    NODES[id].c.forEach(function (c) {
      var p = path.concat([c[0]]);
      if (c[2].slice(0, 2) === "L:") leafPath[c[2].slice(2)] = p; else walk(c[2], p);
    });
  })("root", []);

  var order = [], pos = 0, stats = { n: 0, ok: 0 };
  function nextScenario() {
    if (pos >= order.length) { order = A.shuffle(SC.map(function (_, i) { return i; })); pos = 0; }
    return SC[order[pos++]];
  }

  function render(main) {
    main.innerHTML = "";
    var top = h("div", { class: "pv-top" });
    var score = h("span", { class: "pv-score", "aria-live": "polite" });
    var toggle = h("button", { class: "btn ghost", type: "button", "aria-expanded": "false" }, "Sjá allt tréð");
    top.appendChild(score); top.appendChild(h("span", { class: "pv-spacer" })); top.appendChild(toggle);
    main.appendChild(top);
    var overview = h("div", { class: "panel pv-overview", hidden: true });
    overview.innerHTML = "<h3>Allt ákvörðunartréð</h3>" + treeHtml("root");
    main.appendChild(overview);
    toggle.addEventListener("click", function () {
      overview.hidden = !overview.hidden;
      toggle.setAttribute("aria-expanded", String(!overview.hidden));
      toggle.textContent = overview.hidden ? "Sjá allt tréð" : "Fela tréð";
    });
    var stage = h("div", { class: "pv-stage" });
    main.appendChild(stage);
    function upd() { score.textContent = stats.n ? stats.ok + " rétt af " + stats.n + " í þessari lotu" : SC.length + " dæmi í bankanum"; }
    upd();
    function round() { play(stage, nextScenario(), function (ok) { stats.n++; if (ok) stats.ok++; upd(); }, round); }
    round();
  }

  function play(stage, sc, onScore, onNext) {
    stage.innerHTML = "";
    var leaf = LEAVES[sc[1]];
    stage.appendChild(h("div", { class: "panel pv-scenario" }, '<span class="pv-tag">Dæmi</span><p class="pv-text">' + sc[0] + "</p>"));
    var trail = h("div", { class: "pv-trail", "aria-label": "Leiðin þín" });
    stage.appendChild(trail);
    var nodeBox = h("div", { class: "pv-tree" });
    stage.appendChild(nodeBox);
    var path = [];
    function drawTrail() {
      trail.innerHTML = path.length ? '<span class="pv-start">Leiðin:</span>' + path.map(function (p) { return "<span>" + esc(p) + "</span>"; }).join('<b class="pv-arrow" aria-hidden="true">→</b>') : "";
      if (path.length) {
        var back = h("button", { class: "pv-back", type: "button" }, "Til baka");
        back.addEventListener("click", function () { path.pop(); stack.pop(); show(stack[stack.length - 1]); });
        trail.appendChild(back);
      }
    }
    var stack = ["root"];
    function show(id) {
      drawTrail();
      var n = NODES[id];
      nodeBox.innerHTML = "";
      var card = h("div", { class: "panel pv-node" }, "<h3>" + esc(n.q) + "</h3>");
      var ch = h("div", { class: "pv-choices" });
      n.c.forEach(function (c) {
        var b = h("button", { type: "button" }, esc(c[0]) + (c[1] ? "<small>" + esc(c[1]) + "</small>" : ""));
        b.addEventListener("click", function () {
          path.push(c[0]);
          if (c[2].slice(0, 2) === "L:") finish(c[2].slice(2));
          else { stack.push(c[2]); show(c[2]); }
        });
        ch.appendChild(b);
      });
      card.appendChild(ch);
      nodeBox.appendChild(card);
    }
    function finish(chosen) {
      drawTrail();
      trail.querySelector(".pv-back") && trail.querySelector(".pv-back").remove();
      var ok = chosen === sc[1], got = LEAVES[chosen];
      onScore(ok);
      nodeBox.innerHTML = "";
      var fb = h("div", { class: "fb " + (ok ? "ok" : "no"), "aria-live": "polite" });
      fb.innerHTML = "<h4>" + (ok ? "Rétt: " + esc(leaf.t) : "Þú valdir „" + esc(got.t) + "“. Rétt er: " + esc(leaf.t)) + "</h4>" +
        "<p>" + esc(sc[2]) + "</p>" +
        (ok ? "" : '<p class="hint">Rétta leiðin: ' + leafPath[sc[1]].map(esc).join(" → ") + "</p>") +
        "<p>" + esc(leaf.d) + "</p><pre>" + esc(leaf.r) + "</pre>";
      nodeBox.appendChild(fb);
      var nx = h("button", { class: "btn", type: "button", style: "margin-top:0.9rem" }, "Næsta dæmi →");
      nx.addEventListener("click", onNext);
      nodeBox.appendChild(nx);
      nx.focus({ preventScroll: true });
    }
    show("root");
  }

  function treeHtml(id) {
    var n = NODES[id];
    return '<div class="pv-q">' + esc(n.q) + "</div><ul class=\"pv-list\">" + n.c.map(function (c) {
      var inner;
      if (c[2].slice(0, 2) === "L:") {
        var l = LEAVES[c[2].slice(2)];
        inner = '<div class="pv-leaf"><b>' + esc(l.t) + "</b><code>" + esc(l.r.split("\n")[0]) + "</code></div>";
      } else inner = treeHtml(c[2]);
      return "<li><span class=\"pv-opt\">" + esc(c[0]) + "</span>" + inner + "</li>";
    }).join("") + "</ul>";
  }

  function start() { var el = document.getElementById("pv-app"); if (el) render(el); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  window.Profval = { NODES: NODES, LEAVES: LEAVES, SC: SC };
})();

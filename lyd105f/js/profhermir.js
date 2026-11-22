/* profhermir.js – Prófhermirinn (profhermir.html, verðlaun eftir lokapróf ferðalagsins).
 * Skrifleg dæmi á sniði lokaprófsins með raunverulegu R-úttaki (App.rcon). Nemandinn skrifar svar,
 * opnar fyrirmyndarsvar og hakar við matsatriði; stigin eru hlutfall matsatriða sinnum stig liðarins. */
(function () {
  "use strict";
  var A = window.App, h = A.h, esc = A.esc, f = A.fmt;

  var WRITTEN = [
    { id: "w-ttest", pts: 14, t: "Sykursýki og blóðþrýstingur (Framingham)", outs: ["f_var", "f_t_eq", "f_t_welch"], skill: "ttest",
      intro: "Við viljum vita hvort sykursýki tengist systólískum blóðþrýstingi (SYSBP). Fyrst er dreifnin borin saman með <code>var.test()</code>, og svo eru bæði t-prófin keyrð.",
      parts: [
        { q: "Hvort t-prófið ætti að nota og af hverju?", model: "<code>var.test</code> gefur p = 2.809e-07 &lt; 0.05, svo við höfnum því að dreifnin sé jöfn (hlutfall dreifna 0.546). Því á að nota Welch-prófið, <code>var.equal = FALSE</code>.", rubric: ["Vísar í p-gildi var.test (2.8e-07)", "Segir að dreifnin sé ekki jöfn", "Velur var.equal = FALSE (Welch)"] },
        { q: "Hver er prófstærðin og hverjar eru tilgáturnar?", model: "t = −5.8067 með df = 123.71. H₀: μ<sub>No</sub> = μ<sub>Yes</sub> (sami meðalblóðþrýstingur), H₁: μ<sub>No</sub> ≠ μ<sub>Yes</sub>.", rubric: ["t = −5.81 úr Welch-prófinu", "H₀ um jöfn meðaltöl þýðis (μ, ekki x̄)", "Tvíhliða gagntilgáta"] },
        { q: "Hafnið þið núlltilgátunni og hvaða ályktun er dregin?", model: "Já, p = 5.044e-08 &lt; 0.05. Meðalblóðþrýstingur er marktækt hærri hjá þeim sem eru með sykursýki (148.3 á móti 132.5 mmHg). 95% öryggisbil fyrir muninn (No − Yes) er [−21.25, −10.45] og inniheldur ekki 0.", rubric: ["Höfnum H₀ með vísun í p-gildi", "Segir í hvaða átt munurinn er (hærra hjá sykursjúkum)", "Nefnir öryggisbilið og að það inniheldur ekki 0"] }
      ] },
    { id: "w-anova", pts: 11, t: "Kólesteról eftir aldurshópum (ANOVA)", outs: ["f_aov"], skill: "anova",
      intro: "Við viljum skoða hvort kólesteról (TOTCHOL) sé mismunandi eftir aldurshópum og notum ANOVA.",
      parts: [
        { q: "Sýnið hvernig F-gildið fæst úr töflunni.", model: "F = MS<sub>hópa</sub>/MS<sub>leifa</sub> = 207558/1853 ≈ 112. MS fæst sem Sum Sq/Df: 622674/3 = 207558 og 8111815/4378 = 1853.", rubric: ["F = MS hópa / MS leifa", "Reiknar MS = SS/df", "Fær u.þ.b. 112"] },
        { q: "Hverjar eru tilgáturnar og hvaða ályktun er dregin?", model: "H₀: μ<sub>30–40</sub> = μ<sub>40–50</sub> = μ<sub>50–60</sub> = μ<sub>60–70</sub>. H₁: a.m.k. eitt meðaltal er frábrugðið. p &lt; 2e-16, svo við höfnum H₀: meðalkólesteról er ólíkt milli aldurshópa (lægst í yngsta hópnum, 215.7).", rubric: ["H₀: öll meðaltöl jöfn", "H₁: a.m.k. eitt ólíkt (ekki öll ólík)", "Höfnum H₀ með vísun í p"] },
        { q: "Á hverju byggir ANOVA, og hvað þarf að skoða til að meta hvort hún eigi við?", model: "ANOVA ber saman breytileika <b>milli</b> hópa við breytileika <b>innan</b> hópa. Ef meðaltölin eru ólík verður MS<sub>hópa</sub> stórt miðað við MS<sub>leifa</sub>, og F stórt. Forsendur: óháðar mælingar, u.þ.b. normaldreifðar leifar og jöfn dreifni milli hópa. Það má meta með kassariti og QQ-riti. Með svona stór úrtök (4382) skiptir normaldreifing minna máli.", rubric: ["Milli vs. innan hópa breytileiki", "Nefnir óháðar mælingar", "Nefnir normaldreifðar leifar", "Nefnir jafna dreifni (t.d. skoða kassarit)"] }
      ] },
    { id: "w-lm", pts: 14, t: "BMI og systólískur blóðþrýstingur (lm)", outs: ["f_lm"], skill: "adhvarf",
      intro: "Við viljum skoða hvernig BMI hefur áhrif á systólískan blóðþrýsting og smíðum línulegt aðhvarfslíkan.",
      parts: [
        { q: "Hvert er línulega líkanið, og hvernig er BMI-stikinn túlkaður?", model: "SYSBP = 86.67 + 1.789·BMI. Fyrir hverja einingu sem BMI hækkar hækkar vænt SYSBP um 1.79 mmHg.", rubric: ["Rétt jafna með báðum stuðlum", "Túlkar hallatöluna sem breytingu á y fyrir einingu í x", "Nefnir einingu (mmHg)"] },
        { q: "Tilgátur, ályktun og 95% öryggisbil hallatölunnar?", model: "H₀: β<sub>BMI</sub> = 0, H₁: β<sub>BMI</sub> ≠ 0. t = 23.07, p &lt; 2e-16, svo við höfnum H₀: línulegt samband er til staðar. 95% öryggisbil: [1.637, 1.940] (confint), eða 1.78852 ± 1.96·0.07752.", rubric: ["H₀: β = 0", "Höfnum með p < 2e-16", "Öryggisbil u.þ.b. [1.64, 1.94]"] },
        { q: "Forsendur línulegs aðhvarfs, og hvað vantar til að meta þær? Hversu stóran hluta skýrir BMI?", model: "Línulegt samband, óháðar leifar, normaldreifðar leifar og jöfn dreifni leifa. Til að meta þær vantar punktarit, leifarit (residuals vs fitted) og QQ-rit leifa. R² = 0.1076: BMI skýrir aðeins um 11% breytileikans í SYSBP, þrátt fyrir mjög marktækt samband.", rubric: ["Nefnir a.m.k. þrjár forsendur", "Nefnir leifarit og QQ-rit", "Túlkar R² ≈ 11%"] },
        { q: "Spáið fyrir um SYSBP hjá manneskju með BMI = 15. Er spáin áreiðanleg?", model: "ŷ = 86.67 + 1.789·15 ≈ 113.5 mmHg. Minnsta BMI í gögnunum er um 15.5, svo 15 er rétt utan gagnasviðsins (bryggjun). Spáin er því varhugaverð, og leifastaðalfrávikið (21.1 mmHg) er stórt.", rubric: ["ŷ ≈ 113.5", "Bendir á bryggjun / utan sviðs gagna", "Nefnir óvissu (t.d. stórt leifastaðalfrávik)"] }
      ] },
    { id: "w-pois", pts: 10, t: "Inflúensulík veikindi (Poisson)", outs: [], skill: "poisson",
      intro: "Heilbrigðiseftirlit fylgist með fjölda nýrra inflúensulíkra veikinda (ILI) sem tilkynnt eru á dag í litlu þorpi. Að meðaltali greinast 4 tilfelli á dag.",
      parts: [
        { q: "Hvaða dreifingu er skynsamlegt að gera ráð fyrir?", model: "Poisson-dreifingu með λ = 4 á dag: talning atburða á föstu tímabili með föstum meðalhraða, og atburðirnir eru óháðir.", rubric: ["Poisson", "λ = 4", "Rökstuðningur (talning á tímabili)"] },
        { q: "Hverjar eru líkurnar á a.m.k. 3 nýjum tilfellum á einum degi? En á tveimur dögum?", model: "P(X ≥ 3) = 1 − P(X ≤ 2) = 1 − <code>ppois(2, 4)</code> = 1 − 0.2381 = 0.7619. Á tveimur dögum er λ = 8: 1 − <code>ppois(2, 8)</code> = 0.9862.", rubric: ["Notar 1 − P(X ≤ 2)", "0.762 fyrir einn dag", "λ = 8 og 0.986 fyrir tvo daga"] },
        { q: "Ef 100 sambærileg þorp eru valin, hvaða dreifingu má nota sem nálgun fyrir meðalfjölda tilfella á dag?", model: "Samkvæmt höfuðsetningu tölfræðinnar er X̄ ≈ N(λ, λ/n) = N(4, 4/100) = N(4, 0.04), staðalskekkja 0.2.", rubric: ["Normaldreifing (CLT)", "Meðaltal 4", "Dreifni 0.04 (eða SE 0.2)"] }
      ] },
    { id: "w-prop", pts: 6, t: "Algengi háþrýstings (öryggisbil)", outs: [], skill: "oryggisbil",
      intro: "Í þýði er verið að skoða algengi háþrýstings. Úrtak af 500 manns er tekið og 110 reynast hafa háþrýsting.",
      parts: [
        { q: "Reiknið punktmat og 95% öryggisbil fyrir hlutfallið, og túlkið bilið.", model: "p̂ = 110/500 = 0.22. SE = √(0.22·0.78/500) = 0.0185. 95% bil: 0.22 ± 1.96·0.0185 = [0.184, 0.256]. Túlkun: ef við tækjum mörg slík úrtök myndu um 95% bilanna innihalda raunverulegt algengi. Við erum 95% viss um að algengið sé á bilinu 18.4% til 25.6%.", rubric: ["p̂ = 0.22", "SE ≈ 0.0185", "Bil ≈ [0.184, 0.256]", "Rétt túlkun (um þýðishlutfallið / endurtekin úrtök)"] }
      ] },
    { id: "w-lifun", pts: 10, t: "Hjartasjúkdómur og lifun (KM og Cox)", outs: ["f_km", "f_cox"], skill: "lifun",
      intro: "Lifun þátttakenda í Framingham er skoðuð eftir því hvort þeir voru með hjartasjúkdóm (CHD) við upphaf rannsóknar. Tími er í árum.",
      parts: [
        { q: "Lýsið muninum á lifun hópanna út frá Kaplan–Meier úttakinu.", model: "Þeir sem voru með CHD hafa mun verri lifun: eftir 10 ár er metin lifun 0.619 á móti 0.916, og eftir 20 ár 0.361 á móti 0.749. Miðgildi lifunar í CHD-hópnum er 14.2 ár (95% bil 11.9–16.1). Í hópnum án CHD er það NA, því ferillinn fer aldrei niður fyrir 0.5.", rubric: ["Verri lifun hjá CHD", "Vísar í tölur (t.d. 10 eða 20 ár)", "Miðgildi 14.2 ár og útskýrir NA"] },
        { q: "Túlkið Cox-líkanið.", model: "HR = exp(coef) = 3.758 (95% bil 3.16–4.46), p &lt; 2e-16. Þeir sem eru með hjartasjúkdóm eru í um 3.8 sinnum meiri áhættu á að deyja, á hverjum tíma, en þeir sem ekki eru með hann. Tengslin eru marktæk. exp(−coef) = 0.266 er sama samband séð frá hinum hópnum.", rubric: ["HR ≈ 3.76 með réttri átt", "Öryggisbil inniheldur ekki 1 / p < 0.05", "Gerir greinarmun á exp(coef) og exp(−coef)"] }
      ] },
    { id: "w-normal", pts: 10, t: "Blóðþrýstingur (normaldreifing)", outs: [], skill: "normal",
      intro: "Gerum ráð fyrir að systólískur blóðþrýstingur í þýði fylgi normaldreifingu með meðaltal 120 mmHg og staðalfrávik 10 mmHg.",
      parts: [
        { q: "Hverjar eru líkurnar á að einstaklingur valinn af handahófi mælist á milli 115 og 125 mmHg?", model: "X ~ N(120, 10²). Stöðlum: P(115 &lt; X &lt; 125) = P(−0.5 &lt; Z &lt; 0.5) = Φ(0.5) − Φ(−0.5) = 0.6915 − 0.3085 = 0.383. Í R: <code>pnorm(125, 120, 10) - pnorm(115, 120, 10)</code> = 0.3829.", rubric: ["Staðlar rétt: z = (x − μ)/σ = ±0.5", "Dregur neðri líkur frá efri", "Svar ≈ 0.383"] },
        { q: "Þeir sem mælast yfir 140 mmHg teljast með háþrýsting. Hve stórt hlutfall þýðisins er það? Hve margir af 200 manna slembiúrtaki eru væntanlega með háþrýsting?", model: "P(X &gt; 140) = P(Z &gt; 2) = 1 − Φ(2) = 0.0228 (<code>pnorm(140, 120, 10, lower.tail = FALSE)</code>). Væntanlegur fjöldi af 200 er 200 · 0.0228 = 4.55, þ.e. um 4–5 manns.", rubric: ["z = 2 og 1 − Φ(2)", "Hlutfall ≈ 0.0228", "Væntanlegur fjöldi = n · p ≈ 4.55"] },
        { q: "Hvar á að setja mörkin svo aðeins efstu 5% teljist með háþrýsting?", model: "Finnum x með P(X &lt; x) = 0.95: z<sub>0.95</sub> = 1.645, svo x = μ + zσ = 120 + 1.645 · 10 = 136.4 mmHg. Í R: <code>qnorm(0.95, 120, 10)</code> = 136.45.", rubric: ["Notar 95. prósentumark (ekki 97.5)", "x = μ + zσ með z ≈ 1.645", "Svar ≈ 136.4 mmHg"] },
        { q: "Hvaða dreifingu fylgir meðalblóðþrýstingur 300 einstaklinga valinna af handahófi?", model: "Samkvæmt höfuðsetningunni (og því X er normaldreift) er X̄ ~ N(μ, σ²/n) = N(120, 100/300) = N(120, 0.333). Staðalskekkjan er 10/√300 = 0.577 mmHg.", rubric: ["Normaldreifing með meðaltal 120", "Dreifni σ²/n = 0.333 (eða SE = 0.577)"] }
      ] },
    { id: "w-binom", pts: 10, t: "Virkni bóluefnis (tvíkostadreifing)", outs: [], skill: "binom",
      intro: "Nýtt bóluefni veitir 70% vörn gegn veirusýkingu í forrannsóknum. Tíu einstaklingar fá bóluefnið.",
      parts: [
        { q: "Hvaða dreifingu fylgir fjöldi þeirra sem eru varðir, og af hverju?", model: "X ~ Bin(n = 10, p = 0.7): fastur fjöldi (10) óháðra einstaklinga, hver annaðhvort varinn eða ekki, með sömu líkur 0.7. E[X] = np = 7 og Var[X] = np(1 − p) = 2.1.", rubric: ["Tvíkostadreifing Bin(10, 0.7)", "Rökstuðningur: fastur fjöldi, óháðar tilraunir, sömu líkur", "E[X] = 7 (og Var = 2.1)"] },
        { q: "Hverjar eru líkurnar á að nákvæmlega 7 séu varðir?", model: "P(X = 7) = (10 yfir 7) · 0.7⁷ · 0.3³ = 120 · 0.0824 · 0.027 = 0.267. Í R: <code>dbinom(7, 10, 0.7)</code> = 0.2668.", rubric: ["Rétt formúla með tvíliðustuðli (10 yfir 7) = 120", "Svar ≈ 0.267"] },
        { q: "Hverjar eru líkurnar á að a.m.k. 8 séu varðir?", model: "P(X ≥ 8) = P(X = 8) + P(X = 9) + P(X = 10) = 0.2335 + 0.1211 + 0.0282 = 0.383. Í R: <code>1 - pbinom(7, 10, 0.7)</code> eða <code>sum(dbinom(8:10, 10, 0.7))</code> = 0.3828. Athugið: <code>pbinom(8, …, lower.tail = FALSE)</code> gæfi P(X &gt; 8), sem er rangt.", rubric: ["Leggur saman P(8) + P(9) + P(10) eða notar 1 − P(X ≤ 7)", "Svar ≈ 0.383", "Varast lower.tail-gildruna (P(X ≥ 8), ekki P(X > 8))"] }
      ] },
    { id: "w-glm", pts: 12, t: "Aldur, BMI og sykursýki (tvíkosta aðhvarf)", outs: ["d_glm"], skill: "tvikosta",
      intro: "Í sykursýkisgögnunum er sykursýki skilgreind sem glyhb ≥ 7. Smíðað er tvíkosta aðhvarfslíkan með aldri og BMI sem skýribreytum.",
      parts: [
        { q: "Skrifið líkanið og útskýrið af hverju tvíkosta aðhvarf er notað en ekki línulegt.", model: "logit(p) = log(p/(1 − p)) = −6.632 + 0.0555·aldur + 0.0687·BMI, þar sem p eru líkur á sykursýki. Svarbreytan er tvíkosta (0/1), svo línulegt líkan gæti spáð líkum utan [0, 1]. Logit-tengifallið varpar líkum á allan rauntöluásinn.", rubric: ["Líkanið á logit-skala með réttum stuðlum", "Svarbreytan er tvíkosta (já/nei)", "Línulegt líkan gæti gefið líkur utan [0, 1]"] },
        { q: "Túlkið stuðul aldurs. Hvert er gagnlíkindahlutfallið fyrir 10 ára eldri einstakling?", model: "exp(0.0555) = 1.057 (95% bil 1.037–1.078), p = 1.8·10⁻⁸: gagnlíkindi sykursýki hækka um 5.7% fyrir hvert ár, leiðrétt fyrir BMI. Fyrir 10 ár: exp(10 · 0.055475) = 1.74, þ.e. 74% hærri gagnlíkindi.", rubric: ["OR = exp(β) = 1.057 á ár", "Leiðrétt fyrir BMI / marktækt (bil inniheldur ekki 1)", "10 ár: exp(10β) ≈ 1.74 (ekki 10 · 1.057)"] },
        { q: "Túlkið stuðul BMI með öryggisbili. Hverjar eru metnar líkur á sykursýki hjá 50 ára einstaklingi með BMI 30?", model: "exp(0.0687) = 1.071 (95% bil 1.025–1.119), p = 0.002: hver BMI-eining hækkar gagnlíkindin um 7.1% að aldri óbreyttum. Fyrir 50 ára með BMI 30: logit = −6.632 + 0.0555·50 + 0.0687·30 = −1.80, og p = 1/(1 + e<sup>1.80</sup>) = 0.142. Í R: <code>plogis(-6.63184 + 0.055475*50 + 0.068679*30)</code>.", rubric: ["OR = 1.071 með bili sem inniheldur ekki 1", "Reiknar logit ≈ −1.80", "Breytir í líkur ≈ 0.14"] }
      ] },
    { id: "w-naemi", pts: 10, t: "Fastandi blóðsykur sem greiningarpróf (næmi og sértæki)", outs: ["d_naemi"], skill: "naemi",
      intro: "Fastandi blóðsykur ≥ 126 mg/dL (T+) er notaður sem greiningarpróf fyrir sykursýki. Raunveruleg sykursýki (D+) er skilgreind sem glyhb ≥ 7.",
      parts: [
        { q: "Reiknið næmi og sértæki prófsins og túlkið þau.", model: "Næmi = P(T+ | D+) = 43/(43 + 17) = 0.717: prófið greinir 72% sykursjúkra. Sértæki = P(T− | D−) = 313/(313 + 17) = 0.948: 95% þeirra sem eru ekki með sykursýki fá neikvætt próf.", rubric: ["Næmi = 43/60 ≈ 0.717", "Sértæki = 313/330 ≈ 0.948", "Rétt túlkun (hlutfall veikra / heilbrigðra sem prófið flokkar rétt)"] },
        { q: "Reiknið jákvætt og neikvætt forspárgildi (PPV og NPV).", model: "PPV = P(D+ | T+) = 43/(43 + 17) = 0.717: af þeim sem prófast jákvæðir eru 72% í raun með sykursýki. NPV = P(D− | T−) = 313/(313 + 17) = 0.948.", rubric: ["PPV = 43/60 ≈ 0.717", "NPV = 313/330 ≈ 0.948", "Rétt skilyrðing (líkur á sjúkdómi gefið prófniðurstöðu)"] },
        { q: "Algengi sykursýki í úrtakinu er 60/390 = 15%. Hvað gerist við PPV ef prófið er notað í þýði þar sem algengið er 7%?", model: "Næmi og sértæki haldast, en PPV lækkar þegar algengi lækkar. PPV = 0.717·0.07 / (0.717·0.07 + 0.052·0.93) = 0.51: aðeins um helmingur jákvæðra væri í raun veikur. NPV hækkar.", rubric: ["Næmi og sértæki eru eiginleikar prófsins og breytast ekki", "PPV lækkar (≈ 0.51)", "Rökstuðningur: fleiri falsk jákvæðir miðað við sanna jákvæða"] }
      ] }
  ];


  function mount(root) {
    root.innerHTML = "";
    var pickBox = h("div", { class: "panel ph-setup" });
    pickBox.innerHTML = "<h3>Veldu dæmi</h3><p>Á lokaprófinu 2025 voru skriflegu dæmin 70% af einkunninni. Hér eru " + WRITTEN.length + " dæmi á sama sniði. Taktu þrjú af handahófi eins og í prófi, eða veldu sjálf(ur).</p>";
    var list = h("div", { class: "ph-list" });
    WRITTEN.forEach(function (w, i) {
      var lab = h("label", { class: "ph-item" }, '<input type="checkbox" value="' + i + '"> <span><b>' + esc(w.t) + '</b> <span class="hint">' + w.pts + " stig · " + w.parts.length + " liðir</span></span>");
      list.appendChild(lab);
    });
    pickBox.appendChild(list);
    var row = h("div", { class: "ph-btns" });
    var rand = h("button", { class: "btn", type: "button" }, "Þrjú dæmi af handahófi");
    var chosen = h("button", { class: "btn ghost", type: "button" }, "Byrja með völdu dæmin");
    var all = h("button", { class: "btn ghost", type: "button" }, "Öll dæmin");
    row.appendChild(rand); row.appendChild(chosen); row.appendChild(all);
    pickBox.appendChild(row);
    root.appendChild(pickBox);
    rand.addEventListener("click", function () { run(root, A.shuffle(WRITTEN).slice(0, 3)); });
    all.addEventListener("click", function () { run(root, WRITTEN.slice()); });
    chosen.addEventListener("click", function () {
      var sel = [].map.call(list.querySelectorAll("input:checked"), function (x) { return WRITTEN[+x.value]; });
      if (!sel.length) { A.toast("Veldu a.m.k. eitt dæmi"); return; }
      run(root, sel);
    });
  }

  function run(root, probs) {
    root.innerHTML = "";
    var t0 = Date.now(), scores = {};
    var max = probs.reduce(function (s, w) { return s + w.pts; }, 0);
    var head = h("div", { class: "ph-head" });
    var timer = h("span", { class: "ph-timer" }, "0:00");
    var tot = h("span", { class: "ph-total", "aria-live": "polite" });
    var back = h("button", { class: "btn ghost", type: "button" }, "Velja önnur dæmi");
    back.addEventListener("click", function () { clearInterval(iv); mount(root); window.scrollTo(0, root.offsetTop - 20); });
    head.appendChild(timer); head.appendChild(tot); head.appendChild(back);
    root.appendChild(head);
    var iv = setInterval(function () {
      if (!document.body.contains(timer)) { clearInterval(iv); return; }
      var s = Math.floor((Date.now() - t0) / 1000);
      timer.textContent = (s >= 3600 ? Math.floor(s / 3600) + ":" + pad(Math.floor(s / 60) % 60) : Math.floor(s / 60)) + ":" + pad(s % 60);
    }, 1000);
    function total() {
      var got = 0, done = 0, n = 0;
      probs.forEach(function (w) {
        w.parts.forEach(function (_, j) { n++; var v = scores[w.id + ":" + j]; if (v != null) { done++; got += v * w.pts / w.parts.length; } });
      });
      tot.textContent = f(got, 1) + " af " + max + " stigum · " + done + "/" + n + " liðir metnir";
      if (done === n) {
        clearInterval(iv);
        var pct = Math.round(got / max * 100);
        res.hidden = false;
        res.innerHTML = "<h3>Niðurstaða: " + f(got, 1) + " af " + max + " stigum (" + pct + "%)</h3><p>" +
          (pct >= 80 ? "Mjög gott. Þú ert vel undirbúin(n) fyrir skriflega hlutann." : pct >= 60 ? "Gott. Farðu yfir matsatriðin sem vantaði og prófaðu önnur dæmi." : "Farðu aftur yfir kaflana sem dæmin byggja á og reyndu svo aftur.") +
          '</p><p class="hint">Tími: ' + timer.textContent + ". Á lokaprófinu hefurðu 3 klukkustundir fyrir allt prófið.</p>";
      }
    }
    probs.forEach(function (w, wi) {
      var c = h("section", { class: "panel ph-prob" });
      c.appendChild(h("h3", null, (wi + 1) + ". " + esc(w.t) + ' <span class="ph-pts">' + w.pts + " stig</span>"));
      c.appendChild(h("p", null, w.intro));
      w.outs.forEach(function (k) { if (window.UTTAK && window.UTTAK[k]) c.appendChild(A.rcon(k, { title: "R-úttak" })); });
      w.parts.forEach(function (p, pi) {
        var part = h("div", { class: "ph-part" });
        part.appendChild(h("div", { class: "ph-lbl" }, String.fromCharCode(97 + pi) + ")"));
        var inner = h("div", { class: "ph-body" });
        part.appendChild(inner);
        A.renderTask(inner, { type: "write", q: p.q, model: p.model, rubric: p.rubric }, {}, function (sc) { scores[w.id + ":" + pi] = sc; total(); });
        c.appendChild(part);
      });
      root.appendChild(c);
    });
    var res = h("div", { class: "panel ph-result", hidden: true, "aria-live": "polite" });
    root.appendChild(res);
    total();
    window.scrollTo(0, root.offsetTop - 20);
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function start() { var el = document.getElementById("ph-app"); if (el) mount(el); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  window.WRITTEN = WRITTEN;
})();

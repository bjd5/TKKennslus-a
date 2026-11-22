/* q/kafli01.js – aukaspurningar fyrir kafla 1: Rannsóknir, breytur og úrtök (efni: breytur). */
(function () {
  "use strict";
  var B = window.TK.bank;
  function M(t, q, o, e) { B.MC.push({ topic: t, q: q, o: o, c: 0, e: e }); }
  var T = "breytur";

  M(T, "Í púlsgögnunum (<code>pulsAll</code>) er breytan <code>kyn</code> skráð sem 1 og 2. Hvernig á að fara með hana í R?",
    ["Sem flokkabreytu (factor), því tölurnar eru bara merki fyrir flokka", "Sem samfellda talnabreytu, því hún er skráð með tölum", "Sem strjála talnabreytu sem má taka meðaltal af", "Sem raðaða flokkabreytu með jöfnum bilum"],
    "Tölurnar 1 og 2 eru aðeins kóðar. Meðaltal þeirra (t.d. 1.33 í <code>summary</code>) hefur enga merkingu nema sem hlutfall. Því er breytunni breytt í <code>factor</code>.");
  M(T, "Hvaða breyta í púlsgögnunum er <b>samfelld talnabreyta</b>?",
    ["<code>haed</code> (hæð í cm)", "<code>reykir</code> (ja/nei)", "<code>inngrip</code> (hljop/sat_kyrr)", "<code>namskeid</code> (heiti námskeiðs)"],
    "Hæð getur í grunninn tekið hvaða gildi sem er á bili, þótt hún sé skráð í heilum cm. Hinar breyturnar eru flokkabreytur.");
  M(T, "Fjöldi sígaretta sem reyktar eru á dag (<code>CIGPDAY</code> í Framingham) er:",
    ["Strjál talnabreyta", "Samfelld talnabreyta", "Óröðuð flokkabreyta", "Röðuð flokkabreyta"],
    "Talning tekur gildin 0, 1, 2, … og er því strjál talnabreyta.");
  M(T, "Sjúklingar meta verki á skalanum „enginn, vægur, miðlungs, mikill“. Hvaða gerð breytu er það?",
    ["Röðuð flokkabreyta", "Óröðuð flokkabreyta", "Samfelld talnabreyta", "Strjál talnabreyta"],
    "Flokkarnir hafa náttúrulega röð, en fjarlægðin milli þeirra er ekki skilgreind: röðuð flokkabreyta (ordinal).");
  M(T, "Í rannsókn er kannað hvort reykingar hafi áhrif á lungnastarfsemi. Hver er <b>svarbreytan</b>?",
    ["Lungnastarfsemin", "Reykingarnar", "Aldur þátttakenda", "Fjöldi þátttakenda"],
    "Svarbreyta (response) er útkoman sem mæld er. Skýribreyta (explanatory) er sú sem talin er hafa áhrif, hér reykingar.");
  M(T, "Hver er munurinn á <b>þýði</b> og <b>úrtaki</b>?",
    ["Þýðið er allur hópurinn sem við viljum álykta um; úrtakið er sá hluti þess sem við mælum", "Úrtakið er alltaf stærra en þýðið", "Þýði er bara notað í tilraunum, úrtak í athugunarrannsóknum", "Þau eru það sama ef n > 30"],
    "Við mælum úrtak og notum ályktunartölfræði til að segja eitthvað um þýðið.");
  M(T, "Hvað er <b>stiki</b> (parameter)?",
    ["Töluleg stærð sem lýsir þýðinu, t.d. μ eða p", "Töluleg stærð reiknuð úr úrtaki, t.d. x̄", "Breyta í gagnasafni", "Gildi sem vantar"],
    "Stikar lýsa þýðinu og eru yfirleitt óþekktir. Lýsistærðir (statistics) eins og x̄ og p̂ eru reiknaðar úr úrtakinu og notaðar til að meta stikana.");
  M(T, "Rannsakandi velur af handahófi 10 bekki úr skólum landsins og mælir alla nemendur í þeim. Hvers konar úrtak er það?",
    ["Klasaúrtak (heilir hópar valdir af handahófi)", "Einfalt slembiúrtak", "Lagskipt slembiúrtak", "Sjálfboðaliðaúrtak"],
    "Þegar heilir hópar (klasar) eru valdir og allir í þeim mældir er talað um klasaúrtak. Í lagskiptu úrtaki er dregið úr <i>hverju</i> lagi.");
  M(T, "Þýðinu er skipt í aldurshópa og jafnmargir dregnir af handahófi úr hverjum hópi. Þetta er:",
    ["Lagskipt slembiúrtak", "Einfalt slembiúrtak", "Aðgengisúrtak", "Klasaúrtak"],
    "Lagskipting (stratification) tryggir að hvert lag sé með í úrtakinu.");
  M(T, "Læknanemi spyr fólk sem gengur fram hjá á Háskólatorgi um svefnvenjur. Hver er helsta hættan?",
    ["Úrtaksbjagi: aðgengisúrtak endurspeglar ekki þýðið", "Of mikill styrkur", "Lyfleysuáhrif", "Of stórt úrtak"],
    "Aðgengisúrtak (convenience sample) nær aðeins til þeirra sem auðvelt er að ná í, t.d. háskólanema.");
  M(T, "Hvað eru <b>lyfleysuáhrif</b> (placebo effect)?",
    ["Bati sem verður vegna þess að þátttakandi telur sig fá meðferð, þótt hún sé óvirk", "Aukaverkanir virka lyfsins", "Þegar rannsakandi veit hver fær lyfleysu", "Þegar lyf virkar betur í stærri skömmtum"],
    "Þess vegna fær samanburðarhópur lyfleysu, og helst er rannsóknin blinduð.");
  M(T, "Í athugunarrannsókn sést að þeir sem drekka kaffi fá oftar lungnakrabbamein. Reykingafólk drekkur meira kaffi. Hvað kallast reykingar hér?",
    ["Blöndunarbreyta (confounder)", "Svarbreyta", "Lyfleysa", "Slembival"],
    "Blöndunarbreyta tengist bæði skýribreytunni og svarbreytunni og getur skapað tengsl sem eru ekki orsakasamband.");
  M(T, "Hvers vegna er <b>slembival</b> (randomization) notað í tilraunum?",
    ["Til að hóparnir verði sambærilegir að jafnaði í öllum öðrum þáttum, mældum sem ómældum", "Til að fá stærra úrtak", "Til að rannsóknin verði tvíblind", "Til að losna við að mæla svarbreytuna"],
    "Slembival jafnar út blöndunarbreytur milli hópa, svo munur á útkomu má rekja til meðferðarinnar.");
  M(T, "Í einblindri rannsókn:",
    ["Vita þátttakendur ekki hvaða meðferð þeir fá, en rannsakendur vita það", "Vita rannsakendur ekki hvaða meðferð hver fær, en þátttakendur vita það", "Vita hvorki þátttakendur né rannsakendur hvaða meðferð hver fær", "Er aðeins einn hópur"],
    "Í tvíblindri rannsókn vita hvorki þátttakendur né þeir sem meta útkomuna hver fær hvað.");
  M(T, "Hvaða rannsóknarsnið gefur sterkustu rökin fyrir <b>orsakasambandi</b>?",
    ["Slembuð samanburðartilraun (randomized controlled trial)", "Þversniðsrannsókn", "Netkönnun", "Tilfellaröð (case series)"],
    "Slembival og samanburðarhópur gera kleift að álykta um orsök.");
  M(T, "Hvað á við um <b>breytileika</b> og <b>bjaga</b> í mælingum?",
    ["Bjagi er kerfisbundin skekkja í ákveðna átt; breytileiki er tilviljanakennd dreifing mælinga", "Bjagi minnkar alltaf þegar úrtakið stækkar", "Breytileiki er alltaf kerfisbundinn", "Þau eru sama hugtakið"],
    "Stærra úrtak minnkar breytileika matsins (staðalskekkju) en lagar ekki bjaga: bjagað úrtak er jafn bjagað þótt það sé stórt.");
  M(T, "Í púlsrannsókninni hlupu færri en búist var við miðað við krónukast. Hver gæti verið skýringin sem varðar rannsóknarsniðið?",
    ["Sumir fóru ekki eftir krónukastinu (t.d. nenntu ekki að hlaupa), svo slembivalið raskaðist", "Krónan var of stór", "Úrtakið var of stórt", "Púls er strjál breyta"],
    "Ef þátttakendur víkja frá úthlutuninni er slembivalið ekki lengur hreint, og hóparnir geta orðið ólíkir í öðrum þáttum.");
  M(T, "Hvað þýðir að gildi vanti (<code>NA</code>) í R?",
    ["Mælingin var ekki skráð; flest föll þurfa <code>na.rm = TRUE</code> eða að línum sé sleppt", "Gildið er 0", "Gildið er óendanlegt", "Breytan er flokkabreyta"],
    "<code>mean(x)</code> skilar NA ef eitthvert gildi vantar; <code>mean(x, na.rm = TRUE)</code> sleppir þeim. <code>na.omit()</code> fjarlægir línur með vöntun.");
  M(T, "Rannsókn þar sem hópur er valinn í dag og fylgt eftir í mörg ár til að sjá hverjir fá hjartasjúkdóm (eins og Framingham) er:",
    ["Ferilrannsókn (cohort study)", "Tilfella-viðmiðarannsókn", "Slembuð tilraun", "Þversniðsrannsókn"],
    "Framingham er framsýn ferilrannsókn: útsetning er mæld í upphafi og útkomunni fylgt eftir.");
  M(T, "Hver er kosturinn við tilraun með <b>samanburðarhóp</b>?",
    ["Hægt er að greina áhrif meðferðar frá öðrum breytingum sem verða með tímanum (t.d. náttúrulegum bata)", "Þá þarf ekki slembival", "Þá eru engin lyfleysuáhrif", "Þá verður úrtakið stærra"],
    "Án samanburðarhóps veistu ekki hvort bati stafar af meðferðinni eða hefði orðið hvort sem er.");
})();

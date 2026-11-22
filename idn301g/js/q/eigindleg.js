/* q/eigindleg.js – spurningar fyrir kafla 5: Eigindleg ferlagreining. */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, is = B.is;
  var T = "eigindleg";
  B.MC.push(
    { topic: T, q: "Hvenær er skref í ferli <b>virðisaukandi</b> (VA)?",
      o: ["Þegar það skapar virði sem viðskiptavinurinn er tilbúinn að greiða fyrir", "Þegar það er nauðsynlegt til að uppfylla lög og reglugerðir", "Þegar það tekur mestan tíma í ferlinu", "Þegar það er unnið af sérfræðingi"],
      c: 0, e: "VA: viðskiptavinurinn myndi sakna skrefsins. Lög og reglugerðir gera skref að BVA (rekstrarvirði)." },
    { topic: T, q: "Hvenær er skref flokkað sem <b>rekstrarvirði</b> (BVA)?",
      o: ["Þegar það er nauðsynlegt til að reka starfsemina, afla tekna eða uppfylla lög, en skapar ekki virði fyrir viðskiptavininn", "Þegar viðskiptavinurinn er tilbúinn að greiða fyrir það", "Þegar það er óþarft og má fella burt", "Þegar það er unnið sjálfvirkt af upplýsingakerfi"],
      c: 0, e: "BVA: reksturinn myndi finna fyrir því ef skrefið væri tekið út. NVA má fella burt." },
    { topic: T, q: "Í bankanum þarf að staðfesta skilríki nýs viðskiptavinar vegna laga um peningaþvætti. Hvernig flokkast skrefið?",
      o: ["BVA (rekstrarvirði)", "VA (virðisaukandi)", "NVA (óvirðisaukandi)", "Sóun af tegundinni ofvinnsla"],
      c: 0, e: "Lögbundið eftirlit sem viðskiptavinurinn greiðir ekki fyrir en reksturinn verður að hafa: BVA." },
    { topic: T, q: "Í tækjaleigudæminu: „Áframsenda beiðni til yfirverkfræðings“. Hvernig flokkast skrefið?",
      o: ["NVA", "VA", "BVA", "VA ef beiðnin er samþykkt, annars NVA"],
      c: 0, e: "Sendingar milli fólks skapa ekkert virði og eru ekki nauðsynlegar í sjálfu sér: NVA (tafla 6.1)." },
    { topic: T, q: "Í tækjaleigudæminu: „Velja hentugt tæki“. Hvernig flokkast skrefið?",
      o: ["VA", "BVA", "NVA", "Gallar"],
      c: 0, e: "Viðskiptavinurinn (verkfræðingurinn á verkstað) vill einmitt fá rétt tæki: VA." },
    { topic: T, q: "Í tækjaleigudæminu: „Búa til innkaupapöntun (PO)“. Hvernig flokkast skrefið samkvæmt töflu 6.1?",
      o: ["BVA", "VA", "NVA", "Umframframleiðsla"],
      c: 0, e: "Pöntunin er nauðsynleg fyrir bókhald og eftirlit fyrirtækisins (BVA). Að <i>senda</i> hana til birgis er VA því þá fer tækið af stað." },
    { topic: T, q: "Hvað á að gera við skrefin eftir virðisgreiningu?",
      o: ["Fella burt NVA, lágmarka BVA og tryggja að VA skili sínu", "Fella burt BVA, lágmarka NVA og tvöfalda VA", "Sjálfvirkja öll VA skref og fella burt hin", "Flytja NVA skref yfir á viðskiptavininn"],
      c: 0, e: "NVA má fjarlægja; BVA þarf en má oft einfalda eða sjálfvirkja." },
    { topic: T, q: "Hvaða tegund sóunar er það þegar starfsmaður þarf að leita að skjölum í sameiginlegu drifi?",
      o: ["Hreyfing / áreynsla (motion)", "Óþarfa tilfærsla (transportation)", "Of miklar birgðir (inventory)", "Gallar (defects)"],
      c: 0, e: "Glæra 12: „Leita að gögnum“ er hreyfing. Starfsmaðurinn sjálfur eyðir orku án virðis." },
    { topic: T, q: "Þjónustubeiðni flakkar á milli þriggja deilda áður en einhver tekur hana að sér. Hvaða tegund sóunar er það?",
      o: ["Óþarfa tilfærsla / flutningar (transportation)", "Hreyfing / áreynsla (motion)", "Umframframleiðsla (overproduction)", "Vannýttur mannauður"],
      c: 0, e: "Glæra 12: beiðnir sem ferðast á milli deilda að óþörfu eru tilfærsla. Hluturinn (beiðnin) er fluttur, ekki fólkið." },
    { topic: T, q: "Umsókn um námsstyrk bíður í fimm daga í pósthólfi eftir undirskrift yfirmanns. Hvaða tegund sóunar er það?",
      o: ["Bið (waiting)", "Gallar (defects)", "Ofvinnsla (over-processing)", "Hreyfing (motion)"],
      c: 0, e: "Glæra 12: óskilvirkt samþykktarferli er dæmi um bið. Tilvikið stendur kyrrt." },
    { topic: T, q: "Starfsmaður sendir vikulega skýrslu á 25 manns í cc, en enginn les hana. Hvaða tegund sóunar er það?",
      o: ["Umframframleiðsla (overproduction)", "Of miklar birgðir (inventory)", "Bið (waiting)", "Gallar (defects)"],
      c: 0, e: "Glæra 12: of margar skýrslur og tölvupóstur með fjölda í cc er umframframleiðsla: framleitt umfram eftirspurn." },
    { topic: T, q: "Reikningur fer á rangt heimilisfang og þarf að gefa hann út aftur. Hvaða tegund sóunar er það?",
      o: ["Gallar (defects)", "Óþarfa tilfærsla (transportation)", "Umframframleiðsla (overproduction)", "Bið (waiting)"],
      c: 0, e: "Rangt heimilisfang og rangur reikningur eru dæmi um galla á glærum 11-12. Leiðrétting er endurvinnsla." },
    { topic: T, q: "Byggingavöruverslun á 400 bretti af garðhúsgögnum á lager í október sem seljast ekki fyrr en í maí. Hvaða tegund sóunar er það?",
      o: ["Of miklar birgðir (inventory)", "Bið (waiting)", "Hreyfing (motion)", "Gallar (defects)"],
      c: 0, e: "Vörur sem eru geymdar á lager eru birgðir (flokkurinn „halda“). Bið á við um tilvik eða fólk sem bíður." },
    { topic: T, q: "Sjúkraþjálfari með 10 ára reynslu er látinn sjá um tímabókanir og hugmyndir hans um bætt flæði eru aldrei spurðar. Hvaða sóun er það?",
      o: ["Vannýttur mannauður (unutilized talent)", "Ofvinnsla (over-processing)", "Hreyfing (motion)", "Of miklar birgðir"],
      c: 0, e: "Áttundi þátturinn: hæfni og hugmyndir starfsfólks eru ekki nýttar." },
    { topic: T, q: "Tryggingafélag krefst þriggja undirskrifta fyrir tjón upp á 15.000 kr. Hvaða tegund sóunar er það?",
      o: ["Óskilvirk ferli / ofvinnsla (over-processing)", "Gallar (defects)", "Umframframleiðsla (overproduction)", "Vannýttur mannauður"],
      c: 0, e: "Meira er gert en virði málsins réttlætir: ofvinnsla. (Biðin eftir undirskriftunum er að auki bið.)" },
    { topic: T, q: "Hvaða tvær TPS-sóunartegundir falla undir flokkinn <b>færsla</b> (move) í bókinni?",
      o: ["Tilfærsla (transportation) og hreyfing (motion)", "Birgðir (inventory) og bið (waiting)", "Gallar og ofvinnsla", "Umframframleiðsla og bið"],
      c: 0, e: "Færsla = transportation + motion. Halda = inventory + waiting. Yfirgera = defects, over-processing, overproduction." },
    { topic: T, q: "Hvaða sóunartegundir falla undir flokkinn <b>halda</b> (hold)?",
      o: ["Birgðir og bið", "Tilfærsla og hreyfing", "Gallar, ofvinnsla og umframframleiðsla", "Bið og vannýttur mannauður"],
      c: 0, e: "Halda = að geyma eitthvað: birgðir (vörur á lager) og bið (tilvik bíður). Tómagangur auðlindar fylgir líka." },
    { topic: T, q: "Hvaða sóunartegundir falla undir flokkinn <b>yfirgera</b> (overdo)?",
      o: ["Gallar, ofvinnsla og umframframleiðsla", "Birgðir, bið og tómagangur", "Tilfærsla og hreyfing", "Bið, gallar og hreyfing"],
      c: 0, e: "Yfirgera = gera meira en nauðsyn krefur til að skila virði: laga galla, ofvinna, offramleiða." },
    { topic: T, q: "Hvað er <b>tómagangur</b> (idleness) samkvæmt glærunum?",
      o: ["Þegar auðlind bíður eftir tilviki til að vinna", "Þegar tilvik bíður eftir auðlind", "Þegar vörur eru geymdar á lager", "Þegar starfsmaður gengur á milli starfsstöðva"],
      c: 0, e: "Glæra 15: bið = tilvik bíður; tómagangur = auðlind bíður eftir einingu. Hvort tveggja tilheyrir „halda“." },
    { topic: T, q: "Hvað stendur TIMWOODS fyrir?",
      o: ["Transportation, Inventory, Motion, Waiting, Overproduction, Over-processing, Defects, Skills", "Time, Inventory, Money, Work, Output, Orders, Delivery, Service", "Transportation, Information, Methods, Waiting, Operations, Output, Data, Staff", "Tasks, Inputs, Measures, Workflows, Owners, Outputs, Decisions, Suppliers"],
      c: 0, e: "Minnisregla fyrir átta tegundir sóunar í Lean. S = skills, vannýttur mannauður." },
    { topic: T, q: "Hver er munurinn á <b>tilfærslu</b> (transportation) og <b>hreyfingu</b> (motion)?",
      o: ["Í tilfærslu eru hlutir eða upplýsingar fluttar; í hreyfingu hreyfir fólkið sig óþarflega innan verksins", "Tilfærsla á við um fólk; hreyfing á við um vörur", "Tilfærsla er alltaf rafræn; hreyfing er alltaf líkamleg", "Enginn munur, hugtökin eru samheiti"],
      c: 0, e: "Tilfærsla: bretti, skjöl, beiðnir, gögn milli kerfa. Hreyfing: starfsmaðurinn gengur, leitar, teygir sig." },
    { topic: T, q: "Hverjir eru fimm aðalhópar hagsmunaaðila í hagsmunagreiningu samkvæmt glærunum?",
      o: ["Viðskiptavinir, ferlaþátttakendur, ytri aðilar, ferlaeigandi og umbótastuðningsaðili", "Hluthafar, stjórn, starfsmenn, birgjar og samkeppnisaðilar", "Viðskiptavinir, ferlagreinandi, fundarstjóri, tólstjóri og ferlaeigandi", "Stjórnendur, millistjórnendur, starfsfólk, verktakar og ráðgjafar"],
      c: 0, e: "Glæra 18: allir hóparnir eru spurðir hvert vandamálið sé og ferlagreinandinn setur saman heildarmynd." },
    { topic: T, q: "Af hverju er hagsmunagreining notuð við skráningu vandamála?",
      o: ["Til að fá vandamál frá ólíkum sjónarhornum, því hver hópur sér vandamál sem hinir sjá ekki", "Til að ákveða hver ber ábyrgð á hverju vandamáli", "Til að reikna kostnað hvers vandamáls", "Til að raða vandamálum eftir erfiðleika lausnar"],
      c: 0, e: "Viðskiptavinur, starfsmaður og eftirlitsaðili sjá ólík vandamál. Kostnaðarmat er í vandamálaskránni og erfiðleikamat í PICK." },
    { topic: T, q: "Hvað af eftirtöldu er <b>ekki</b> venjulegt svæði í vandamálaskrá (issue register)?",
      o: ["Nafn þess starfsmanns sem olli vandamálinu", "Stutt nafn og lýsing", "Gögn og forsendur matsins", "Eigindlegt og megindlegt mat á áhrifum"],
      c: 0, e: "Glæra 21: nafn, lýsing, forgangsröðun, gögn og forsendur, eigindlegt mat, megindlegt mat. Sökudólgaleit á ekki heima þar." },
    { topic: T, q: "Hver er munurinn á <b>vandamáli</b> (issue) og <b>þætti</b> (factor) í vandamálaskrá?",
      o: ["Vandamál hefur bein áhrif á ferlið; þáttur hefur áhrif á vandamál sem svo hefur áhrif á ferlið", "Vandamál er megindlegt; þáttur er eigindlegt", "Vandamál er utan fyrirtækisins; þáttur innan þess", "Vandamál hefur forgang 1; þáttur hefur forgang 2 eða lægri"],
      c: 0, e: "Glæra 23: aðgreint með svæðunum „er valdið af“ (caused by) og „veldur“ (is cause of)." },
    { topic: T, q: "Vandamál kemur upp 20 sinnum í mánuði og kostar 15 mínútur í hvert skipti. Annað kemur upp 2 sinnum og kostar 90 mínútur. Hvort er stærra í Pareto-greiningu á tíma?",
      o: ["Það fyrra (300 mín á mánuði á móti 180)", "Það seinna, því hvert tilvik er dýrara", "Þau eru jafn stór", "Ekki hægt að bera saman án eigindlegs mats"],
      c: 0, e: "Áhrif = tíðni × áhrif á skipti: $20 \\cdot 15 = 300$ og $2 \\cdot 90 = 180$ mínútur." },
    { topic: T, q: "Hvað segir Pareto-reglan (80/20)?",
      o: ["Fá vandamál valda stórum hluta áhrifanna, t.d. 20 % vandamála 80 % áhrifa", "80 % af ferlinu er virðisaukandi og 20 % sóun", "Leysa á 80 % vandamála á 20 % tímans", "80 % vandamála eru tengd fólki og 20 % tækni"],
      c: 0, e: "Pareto-greining forgangsraðar: hin fáu mikilvægu vandamál fyrst. 80/20 er þumalputtaregla, ekki náttúrulögmál." },
    { topic: T, q: "Hvernig er Pareto-rit byggt upp?",
      o: ["Súlur í lækkandi röð eftir áhrifum og lína sem sýnir uppsafnað hlutfall", "Súlur í stafrófsröð og lína sem sýnir meðaltal", "Fjórir reitir eftir ávinningi og erfiðleika", "Bein sem liggja að vandamáli flokkuð eftir 6M"],
      c: 0, e: "Fjórir reitir eru PICK-rit og bein eftir 6M eru fiskbeinarit." },
    { topic: T, q: "Í PICK-riti er lausn með <b>miklum ávinningi</b> sem er <b>auðvelt</b> að framkvæma. Í hvaða reit lendir hún?",
      o: ["Framkvæma (Implement)", "Áskorun (Challenge)", "Geranlegt (Possible)", "Slátra (Kill)"],
      c: 0, e: "Implement = mikill ávinningur + auðvelt: forgangsraða. Challenge = mikill ávinningur + erfitt." },
    { topic: T, q: "Í PICK-riti er lausn með <b>litlum ávinningi</b> sem er <b>erfitt</b> að framkvæma. Hvað á að gera?",
      o: ["Slátra (Kill): líklega ekki þess virði", "Framkvæma strax (Implement)", "Taka sem áskorun (Challenge)", "Gera ef hægt (Possible)"],
      c: 0, e: "Kill = lítill ávinningur + erfitt. Possible = lítill ávinningur + auðvelt." },
    { topic: T, q: "Fyrir hvað stendur PICK?",
      o: ["Possible, Implement, Challenge, Kill", "Plan, Implement, Check, Keep", "Priority, Impact, Cost, Knowledge", "Process, Issue, Cause, Key"],
      c: 0, e: "Íslensku heitin á glærunum: Geranlegt, Framkvæma, Áskorun, Slátra." },
    { topic: T, q: "Hvað er rótargreining (root cause analysis)?",
      o: ["Fjölskylda aðferða til að finna undirliggjandi ástæður vandamála", "Aðferð til að flokka skref í VA, BVA og NVA", "Aðferð til að raða vandamálum eftir kostnaði", "Aðferð til að finna afbrigði í atburðaskrá"],
      c: 0, e: "Glæra 26. Hinar lýsingarnar eiga við virðisgreiningu, Pareto og process mining." },
    { topic: T, q: "Hvaða tvö önnur heiti eru notuð um orsakarit (cause-and-effect diagram)?",
      o: ["Fiskbeinarit og Ishikawa-rit", "Trérit og af-hverju-rit", "Pareto-rit og PICK-rit", "Flæðirit og SIPOC-rit"],
      c: 0, e: "Lögunin minnir á fiskbein; Kaoru Ishikawa gerði ritið þekkt. Trérit er annað heiti á af-hverju-riti." },
    { topic: T, q: "Hver eru 6M í fiskbeinariti?",
      o: ["Machine, Method, Material, Man, Measurement, Milieu", "Money, Management, Market, Method, Machine, Mission", "Motion, Material, Measurement, Money, Man, Method", "Machine, Model, Material, Manager, Metric, Mission"],
      c: 0, e: "Tækni, aðferð, aðföng, fólk, mælingar og umhverfi (glæra 28)." },
    { topic: T, q: "Í fiskbeinariti fyrir „viðhaldsbeiðnir gleymast“ er orsökin „verkbeiðnakerfið sendir engar áminningar“. Undir hvaða bein fellur hún?",
      o: ["Machine (tækni)", "Man (fólk)", "Milieu (umhverfi)", "Measurement (mælingar)"],
      c: 0, e: "Kerfi og tæki eru „machine (technology)“. Ef orsökin væri að starfsfólk væri ekki þjálfað væri það „man“." },
    { topic: T, q: "Í fiskbeinariti fyrir „seinar afgreiðslur hjá heilsugæslu“ er orsökin „enginn fylgist með biðtíma“. Undir hvaða bein fellur hún?",
      o: ["Measurement (mælingar)", "Method (aðferð)", "Material (aðföng)", "Machine (tækni)"],
      c: 0, e: "Það sem ekki er mælt er ekki stýrt: skortur á mælingum." },
    { topic: T, q: "Hver er munurinn á <b>áhrifaþætti</b> (causal factor) og <b>valdandi þætti</b> (contributing factor)?",
      o: ["Ef áhrifaþáttur er lagaður stöðvast vandamálið; valdandi þáttur hjálpar til við að valda því", "Áhrifaþáttur er innan fyrirtækisins; valdandi þáttur utan þess", "Áhrifaþáttur er megindlegur; valdandi þáttur eigindlegur", "Áhrifaþáttur á við um fólk; valdandi þáttur um tækni"],
      c: 0, e: "Glæra 27. Mörkin eru óljós og oft er ekki gerður greinarmunur í reynd." },
    { topic: T, q: "Hvað er af-hverju-rit (why-why diagram)?",
      o: ["Trérit með endurteknum pörum af spurningunni „af hverju?“ og svari, þar til komið er að rót", "Rit sem raðar vandamálum eftir kostnaði", "Rit sem flokkar orsakir í sex bein", "Rit sem sýnir ávinning á móti erfiðleika"],
      c: 0, e: "Glæra 32: endurtekin pör (dyad) af af-hverju og svari. 5 Whys í Six Sigma." },
    { topic: T, q: "Af hverju er mælt með að spyrja „af hverju?“ um það bil <b>fimm sinnum</b>?",
      o: ["Fyrsta svarið er oftast bara einkenni; dýpri spurningar komast að rótinni", "Af því að vandamál hafa alltaf nákvæmlega fimm orsakir", "Til að finna fimm starfsmenn sem bera ábyrgð", "Til að fylla út öll svæði vandamálaskrárinnar"],
      c: 0, e: "Talan 5 er þumalputtaregla sem sýnir ítrun og dýpt. Hætta á þegar komið er að orsök sem hægt er að breyta." },
    { topic: T, q: "Í 5-af-hverju greiningu á seinum matarpöntunum endar teymið á „af því að kokkurinn Siggi er latur“. Hvað er að?",
      o: ["Greiningin endar á sökudólgi en ekki á rót í ferlinu sem hægt er að breyta", "Ekkert, fólk er eitt af 6M", "Það þarf nákvæmlega fimm svör, ekki fleiri", "Svarið er of megindlegt"],
      c: 0, e: "Góð rót er eitthvað í ferlinu, kerfinu eða umhverfinu sem kemur í veg fyrir endurtekningu, óháð því hver vinnur verkið." },
    { topic: T, q: "Hver eru fjögur verkfæri eigindlegrar ferlagreiningar sem glærurnar nefna?",
      o: ["Virðisgreining, sóunargreining, skráning vandamála og rótargreining", "Biðraðalíkön, hermun, flæðigreining og Pareto", "Viðtöl, vinnustofur, athugun og atburðaskrár", "SIPOC, RACI, BPMN og CLD"],
      c: 0, e: "Glæra 5. Biðraðir, hermun og flæðigreining eru megindleg greining (kafli 6); viðtöl o.fl. eru uppgötvunaraðferðir." },
    { topic: T, q: "Í hvaða vídd BPM liggur rót vandamálsins „starfsfólk kann ekki á nýja bókunarkerfið“?",
      o: ["Fólk (þjálfun)", "Stefna", "Ferlar", "Tækni"],
      c: 0, e: "Kerfið sjálft er í lagi en þekkingu skortir: víddin fólk (mannauður, þjálfun). Vandamál í ferli á oft rót í annarri vídd." }
  );

  // Reiknidæmi: Pareto-hlutfall stærsta vandamálsins
  B.G.push(function paretoHlutfall() {
    var names = pick([["tvískráning", "röng gögn", "bið eftir samþykki"], ["leit að skjölum", "endurgerð reikninga", "símtöl um stöðu máls"], ["vantar fylgigögn", "rangt tæki pantað", "handvirk afstemming"]]);
    var f, t, v, tot, mx;
    do {
      f = [rnd(2, 30), rnd(2, 30), rnd(2, 30)];
      t = [rnd(1, 12) * 5, rnd(1, 12) * 5, rnd(1, 12) * 5];
      v = [f[0] * t[0], f[1] * t[1], f[2] * t[2]];
    } while (v[0] === v[1] || v[1] === v[2] || v[0] === v[2]);
    tot = v[0] + v[1] + v[2];
    mx = Math.max(v[0], v[1], v[2]);
    var k = v.indexOf(mx);
    var ans = (100 * mx) / tot;
    var txt = names.map(function (n, i) { return "<b>" + n + "</b> (" + f[i] + " sinnum í mánuði, " + t[i] + " mín í hvert skipti)"; });
    return { topic: T, title: "Pareto: hlutfall stærsta vandamálsins",
      text: "Í vandamálaskrá eru þrjú vandamál: " + txt[0] + ", " + txt[1] + " og " + txt[2] + ". Hversu stórt hlutfall (%) af heildartímanum veldur stærsta vandamálið?",
      answer: ans, unit: "%", tol: 0.01,
      sol: "<p>Áhrif = tíðni × mínútur: $" + f[0] + "\\cdot" + t[0] + " = " + v[0] + "$, $" + f[1] + "\\cdot" + t[1] + " = " + v[1] + "$ og $" + f[2] + "\\cdot" + t[2] + " = " + v[2] + "$ mín. Samtals $" + tot + "$ mín á mánuði.</p><p>Stærst er „" + names[k] + "“: $" + mx + "/" + tot + " = " + B.tx(ans, 3) + "\\,\\%$.</p>" };
  });

  // Reiknidæmi: hversu mörg vandamál þarf til að ná 80 %
  B.G.push(function paretoFjoldi() {
    var v, tot, sorted, need, cum, i;
    do {
      v = [];
      for (i = 0; i < 6; i++) v.push(rnd(1, 40) * 10);
      sorted = v.slice().sort(function (a, b) { return b - a; });
      tot = v.reduce(function (s, x) { return s + x; }, 0);
      cum = 0; need = 0;
      for (i = 0; i < 6; i++) { cum += sorted[i]; need = i + 1; if (cum >= 0.8 * tot) break; }
      var cumPrev = cum - sorted[need - 1];
    } while (new Set(v).size < 6 || Math.abs(cum / tot - 0.8) < 0.02 || Math.abs(cumPrev / tot - 0.8) < 0.02);
    var labels = ["V1", "V2", "V3", "V4", "V5", "V6"];
    var rows = sorted.map(function (x) { return x; });
    var c2 = 0, steps = rows.map(function (x) { c2 += x; return x + " → " + B.is((100 * c2) / tot, 3) + " %"; });
    return { topic: T, title: "Pareto: hin fáu mikilvægu",
      text: "Sex vandamál kosta (í þús. kr. á ári): " + v.map(function (x, j) { return labels[j] + ": " + x; }).join(", ") + ". Hversu mörg vandamál (þau stærstu) þarf til að ná a.m.k. 80 % af heildarkostnaðinum?",
      answer: need, unit: "vandamál", tol: 0.001, absTol: 0.1,
      sol: "<p>Samtals $" + tot + "$. Raðað í lækkandi röð með uppsöfnuðu hlutfalli: " + steps.join("; ") + ".</p><p>80 % markið ($" + B.tx(0.8 * tot, 4) + "$) næst með <b>" + need + "</b> stærstu vandamálunum.</p>" };
  });
})();

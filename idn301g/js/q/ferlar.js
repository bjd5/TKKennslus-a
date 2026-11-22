/* q/ferlar.js – spurningar fyrir kafla 1: Ferlar og ferlaskráning. */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, tx = B.tx, is = B.is;
  var T = "ferlar";
  B.MC.push(
    { topic: T, q: "Hvað einkennir viðskiptaferli (business process) samkvæmt skilgreiningu Dumas o.fl.?", o: ["Safn atburða, verka og ákvarðana sem skilar útkomu sem hefur virði fyrir viðskiptavin", "Ein deild í skipuriti og þau verk sem starfsmenn hennar vinna", "Hugbúnaðarkerfi sem styður dagleg verk starfsmanna", "Skjalfest verklagsregla sem gæðastjóri hefur samþykkt"], c: 0, e: "Ferli er keðja atburða, verka og ákvarðana sem skilar virði til (innri eða ytri) viðskiptavinar. Það sker oft þvert á deildir, er ekki kerfi og þarf ekki að vera skjalfest til að vera til." },
    { topic: T, q: "Hver er munurinn á atburði og verki í ferli?", o: ["Atburður gerist á augnabliki og tekur engan tíma; verk er vinna sem tekur tíma", "Atburður er alltaf unninn af tölvukerfi en verk af starfsmanni", "Verk gerist á augnabliki en atburður er langvinnt ástand", "Enginn munur, orðin eru notuð jöfnum höndum"], c: 0, e: "Atburður (t.d. „umsókn móttekin“) er augnablik; verk (t.d. „yfirfara umsókn“) er vinnueining sem auðlind framkvæmir og tekur tíma." },
    { topic: T, q: "Ferlið frá því að viðskiptavinur pantar vöru þar til greiðsla hefur borist kallast:", o: ["Order-to-cash", "Procure-to-pay", "Quote-to-order", "Record-to-report"], c: 0, e: "Order-to-cash nær yfir sölupöntun, afhendingu, reikningagerð og greiðslu. Procure-to-pay er innkaupahliðin, quote-to-order kemur á undan (tilboð í pöntun) og record-to-report er bókhald." },
    { topic: T, q: "Byggingavöruverslun pantar timbur hjá birgi, tekur á móti því og greiðir reikninginn. Hvaða ferlafjölskylda er þetta?", o: ["Procure-to-pay", "Order-to-cash", "Issue-to-resolution", "Hire-to-retire"], c: 0, e: "Innkaup frá beiðni til greiðslu reiknings birgis eru procure-to-pay. Order-to-cash er sama ferli séð frá seljandanum." },
    { topic: T, q: "Viðhaldsbeiðni leigjanda frá því hún berst þar til viðgerð er lokið tilheyrir helst hvaða ferlafjölskyldu?", o: ["Issue-to-resolution", "Application-to-approval", "Quote-to-cash", "Procure-to-pay"], c: 0, e: "Mál sem hefst á vandamáli (bilun, kvörtun, tjóni) og lýkur með lausn er issue-to-resolution." },
    { topic: T, q: "Hvaða tveir ferlar mynda saman quote-to-cash?", o: ["Quote-to-order og order-to-cash", "Procure-to-pay og order-to-cash", "Quote-to-order og procure-to-pay", "Issue-to-resolution og record-to-report"], c: 0, e: "Quote-to-order (tilboð í pöntun) kemur á undan order-to-cash (pöntun í greiðslu) í virðiskeðjunni; saman heita þeir quote-to-cash." },
    { topic: T, q: "Í hvaða röð eru fasar BPM-lífsferilsins?", o: ["Auðkenning, uppgötvun, greining, endurhönnun, innleiðing, eftirlit", "Auðkenning, greining, uppgötvun, innleiðing, endurhönnun, eftirlit", "Uppgötvun, auðkenning, endurhönnun, greining, eftirlit, innleiðing", "Greining, auðkenning, uppgötvun, eftirlit, endurhönnun, innleiðing"], c: 0, e: "Fyrst eru ferlar auðkenndir (ferlaarkitektúr), svo er núverandi ferli skráð (as-is), greint, endurhannað (to-be), innleitt og vaktað." },
    { topic: T, q: "Hver er afurð ferlauppgötvunar (process discovery) í BPM-lífsferlinum?", o: ["As-is ferlalíkan", "To-be ferlalíkan", "Ferlaarkitektúr", "Keyranlegt ferlalíkan"], c: 0, e: "Uppgötvun lýsir ferlinu eins og það er unnið í dag: as-is líkan. To-be kemur úr endurhönnun, ferlaarkitektúr úr auðkenningu og keyranlegt líkan úr innleiðingu." },
    { topic: T, q: "Hvaða fasi BPM-lífsferilsins skilar to-be ferlalíkani?", o: ["Endurhönnun ferla", "Ferlagreining", "Ferlauppgötvun", "Ferlaeftirlit"], c: 0, e: "Endurhönnun (process redesign) skilar to-be líkani sem lýsir því hvernig ferlið á að vera. Greiningin á undan skilar innsýn í veikleika." },
    { topic: T, q: "Hvaða tvö skref felur ferlaauðkenning (process identification) í sér?", o: ["Að skilgreina ferlaarkitektúr og velja ferla til að vinna með", "Að teikna as-is líkan og reikna umferðartíma", "Að taka viðtöl og greina atburðaskrár", "Að endurhanna ferla og innleiða þá í hugbúnaði"], c: 0, e: "Auðkenning = ferlaarkitektúr (yfirlit yfir ferla og tengsl þeirra) + val á ferlum. Hvorugt felur í sér að bæta einstakan feril." },
    { topic: T, q: "Launavinnsla í tryggingafélagi er gríðarlega mikilvæg. Í hvaða ferlaflokk fellur hún?", o: ["Stoðferli", "Meginferli", "Stjórnunarferli", "Enda-í-enda ferli viðskiptavina"], c: 0, e: "Viðskiptavinurinn greiðir ekki fyrir launavinnslu; hún styður meginferlana með auðlindum (mannauði). Mikilvægi ræður ekki flokknum." },
    { topic: T, q: "Hvaða ferli er meginferli (core process) hjá tryggingafélagi?", o: ["Tjónaþjónusta", "Upplýsingatækni", "Stefnumótun", "Mannauðsstjórnun"], c: 0, e: "Tjónaþjónusta er hluti þess sem viðskiptavinurinn kaupir. UT og mannauður eru stoðferlar; stefnumótun er stjórnunarferli." },
    { topic: T, q: "Áhættumat og fjárhagsáætlanagerð flokkast sem:", o: ["Stjórnunarferlar", "Meginferlar", "Stoðferlar", "Undirferlar"], c: 0, e: "Stjórnunarferlar veita leiðsögn, reglur og umgjörð fyrir megin- og stoðferla, t.d. stefnumótun, fjárhagsáætlanir og áhættumat." },
    { topic: T, q: "Þegar ferli er brotinn niður í undirferla sem lýsa nánar hvernig hann er unninn er það kallað:", o: ["Niðurbrot (lóðrétt samband)", "Röð (lárétt samband)", "Sérhæfing", "Samþætting"], c: 0, e: "Niðurbrot (decomposition) er stigveldissamband. Röð er lárétt samband ferla sem taka hver við af öðrum; sérhæfing eru útgáfur af sama almenna ferli." },
    { topic: T, q: "Tryggingafélag hefur sérstakt tjónaferli fyrir ökutæki og annað fyrir fasteignir, bæði útgáfur af almenna tjónaferlinu. Hvaða samband er þetta?", o: ["Sérhæfing", "Niðurbrot", "Röð", "Samsíða ferli"], c: 0, e: "Sérhæfing (specialization) lýsir mismunandi útgáfum af sama almenna ferlinu." },
    { topic: T, q: "Hvaða þrjú viðmið eru notuð við val á ferlum til að vinna með?", o: ["Mikilvægi, heilsa og framkvæmanleiki", "Kostnaður, tími og gæði", "Stærð, aldur og fjöldi starfsmanna", "Virðisauki, sóun og breytileiki"], c: 0, e: "Ferlar eru valdir eftir mikilvægi fyrir stefnu (strategic importance), heilsu (health) og framkvæmanleika umbóta (feasibility)." },
    { topic: T, q: "Í ferlaeignasafni (process portfolio), hvaða ferla á helst að taka fyrir fyrst?", o: ["Mikilvæga ferla við slæma heilsu sem er raunhæft að bæta", "Ferla við góða heilsu sem skipta litlu máli", "Mikilvæga ferla við góða heilsu", "Alla ferla í einu til að gæta jafnræðis"], c: 0, e: "Áherslureiturinn er mikið mikilvægi og léleg heilsa, og innan hans eru ferlar með mikinn framkvæmanleika teknir fyrst." },
    { topic: T, q: "Hvað mælir framkvæmanleiki (feasibility) við val á ferlum?", o: ["Hversu líklegt er að umbætur takist m.t.t. menningar, pólitíkur og mótstöðu", "Hversu mikið ferlið kostar á ári", "Hversu oft ferlið er keyrt á viku", "Hversu vel ferlið styður stefnu fyrirtækisins"], c: 0, e: "Framkvæmanleiki snýst um líkur á að umbótaverkefni nái árangri í skipulagsheildinni. Stefnutengslin eru mikilvægi." },
    { topic: T, q: "Hverjar eru fjórar víddir ferlaframmistöðu á glærunum?", o: ["Tími, kostnaður, gæði og sveigjanleiki", "Tími, kostnaður, áhætta og ánægja", "Nýtni, markvirkni, gæði og hraði", "Fólk, ferlar, tækni og viðskiptavinur"], c: 0, e: "Frammistöðumælikvarðar (PPI) eru skilgreindir eftir tíma, kostnaði, gæðum og sveigjanleika." },
    { topic: T, q: "Umferðartími (cycle time) ferlis skiptist í:", o: ["Vinnslutíma og biðtíma", "Fastan og breytilegan kostnað", "Innri og ytri gæði", "Virkan og óvirkan tíma auðlinda"], c: 0, e: "Á glærunum er umferðartíma skipt í framleiðslu-/vinnslutíma og biðtíma (allt hitt)." },
    { topic: T, q: "Hlutfall kvartana viðskiptavina er dæmi um:", o: ["Ytri gæði", "Innri gæði", "Sveigjanleika", "Vinnslutíma"], c: 0, e: "Ytri gæði eru séð frá viðskiptavininum (ánægja, kvartanir). Innri gæði eru séð frá skipulagsheildinni (villuhlutfall, endurvinnsla)." },
    { topic: T, q: "Hæfileiki starfsfólks til að leysa mismunandi verk í ferlinu og ráða við breytilegt álag fellur undir:", o: ["Sveigjanleika", "Gæði", "Kostnað", "Tíma"], c: 0, e: "Sveigjanleiki er hæfileikinn til að bregðast við breytingum, m.a. fjölhæfni mannauðs og getu ferlisins til að ráða við breytilegt álag." },
    { topic: T, q: "Verkefni styttir afgreiðslutíma lánsumsókna án þess að gæði breytist. Hvað hefur batnað?", o: ["Nýtni (efficiency)", "Markvirkni (effectiveness)", "Sveigjanleiki", "Ytri gæði"], c: 0, e: "Nýtni = sömu gæði með minni tíma eða fyrirhöfn. Markvirkni = meiri gæði/nákvæmni með sömu fyrirhöfn." },
    { topic: T, q: "Hvaða nálgun beinir sjónum fyrst og fremst að útkomu ferlisins og fækkun galla með tölfræði?", o: ["Six Sigma", "Lean", "ISO-vottun", "Ferlaauðkenning"], c: 0, e: "Six Sigma leggur áherslu á útkomuna (output), minnkar breytileika og stefnir á 3,4 galla á milljón tækifæri. Lean einblínir á ferlið og sóun." },
    { topic: T, q: "Hvað stendur DMAIC fyrir?", o: ["Define, Measure, Analyze, Improve, Control", "Design, Model, Automate, Implement, Check", "Define, Map, Assess, Innovate, Communicate", "Discover, Measure, Adjust, Improve, Confirm"], c: 0, e: "DMAIC er fimm skrefa aðferð Six Sigma til að bæta núverandi ferli þegar orsökin er óþekkt." },
    { topic: T, q: "Ferli er til en stigvaxandi umbætur munu ekki duga til að uppfylla kröfur. Hvaða tegund verkefnis á við?", o: ["Endurhönnun ferlis (reengineering)", "Skjótur ávinningur (quick win)", "Ferlahönnun (DFSS)", "Innviðaverkefni (process management)"], c: 0, e: "Endurhönnun er fyrir ferli sem er til en þarf róttæka endurskoðun. DFSS er þegar ekkert ferli er til; quick win þegar orsök og lausn eru þekkt." },
    { topic: T, q: "Í SIPOC stendur „I“ fyrir:", o: ["Innlag (input): það sem ferlið þarf til að vinna", "Innri viðskiptavin (internal customer)", "Umbætur (improvement)", "Upplýsingakerfi (information system)"], c: 0, e: "SIPOC: Supplier (birgi), Input (innlag), Process (ferli), Output (frálag), Customer (viðskiptavinur)." },
    { topic: T, q: "Í SIPOC fyrir „eiginmaður hellir upp á te“, í hvaða dálk fer ketillinn?", o: ["Innlag (I)", "Birgi (S)", "Ferli (P)", "Frálag (O)"], c: 0, e: "Ketillinn er auðlind sem ferlið notar: innlag. Birgjar eru aðilar (eiginmaðurinn, verslunin)." },
    { topic: T, q: "Í SIPOC fyrir tjónstilkynningu, hvar á „uppgjörsbréf til tjónþola“ heima?", o: ["Frálag (O)", "Innlag (I)", "Viðskiptavinur (C)", "Birgi (S)"], c: 0, e: "Uppgjörsbréfið er það sem ferlið skilar: frálag. Tjónþolinn sem tekur við því er viðskiptavinurinn." },
    { topic: T, q: "Hvað á P-dálkurinn í SIPOC að innihalda?", o: ["Um 4-8 meginþrep ferlisins í réttri röð", "Öll verk ferlisins með ákvörðunum og greinum", "Deildirnar sem taka þátt í ferlinu", "Lykilmælikvarða ferlisins"], c: 0, e: "SIPOC er yfirlitstafla; P-dálkurinn hefur fá meginþrep. Smáatriði, ákvarðanir og deildir koma í flæðiriti og BPMN-líkani." },
    { topic: T, q: "Hver á að vera „A“ (Accountable) í RACI-fylki?", o: ["Sá sem ber endanlega ábyrgð og veitir lokasamþykki; einn á hvert verk", "Sá sem vinnur verkið; geta verið margir", "Sá sem er hafður með í ráðum áður en verkið er unnið", "Sá sem fær upplýsingar eftir að verkinu lýkur"], c: 0, e: "A = eigandi/stjórnandi með lokasamþykki; nákvæmlega einn. R vinnur verkið, C er ráðgefandi, I er upplýstur." },
    { topic: T, q: "Lögfræðingur bankans er spurður álits áður en nýr viðskiptasamningur er samþykktur. Hvaða RACI-hlutverk hefur hann?", o: ["C – Consulted", "R – Responsible", "A – Accountable", "I – Informed"], c: 0, e: "Ráðgefandi (C) er sá sem leitað er til áður en verkið er unnið, í tvíhliða samskiptum." },
    { topic: T, q: "Í deildarferli samkvæmt sniðmáti námskeiðsins, hvað fær ekki númer?", o: ["Ákvarðanir", "Fyrsta þrepið sem hleypir ferlinu af stað", "Verkþættir sem unnir eru í UT-kerfi", "Síðasta þrepið á undan ENDI"], c: 0, e: "Ákvarðanir eru ekki numeraðar af því að þær eru ekki virðisaukandi verkþættir; aðeins verkþættir fá númer." },
    { topic: T, q: "Hvað á að koma fram í haus flæðirits samkvæmt sniðmáti námskeiðsins?", o: ["Nafn á ferli, ferilseigandi, UT-hagsmunaaðili, lykilmæling og dagsetning samþykktar", "Skipurit fyrirtækisins og nöfn allra starfsmanna", "SIPOC-tafla og RACI-fylki ferlisins", "Kostnaðaráætlun og tímaáætlun umbótaverkefnisins"], c: 0, e: "Hausinn tilgreinir nafn, eiganda, UT-hagsmunaaðila, lykilmælingu (KPI) og samþykktardag." },
    { topic: T, q: "„Trygging nær að hámarki 70 % af verði bifreiðar sem kostar meira en 20 m.kr.“ Þetta er dæmi um:", o: ["Viðskiptareglu (business rule)", "UT-kröfu", "Lykilmælikvarða", "Ferlaflokk"], c: 0, e: "Viðskiptaregla segir hvað má eða má ekki eða gefur forsendur ákvörðunar. UT-krafa lýsir hvernig kerfi á að styðja regluna." },
    { topic: T, q: "Hvað af eftirfarandi er nefnt á glærunum sem atriði til að skoða við ferlaskráningu?", o: ["Tvískráningar og óljóst eignarhald á verkþáttum", "Fjöldi tákna í BPMN-staðlinum", "Launakjör starfsmanna í ferlinu", "Litur á flæðiritinu"], c: 0, e: "Athugun á ferlum: flöskuhálsar, tvískráningar, óþarfa þrep, óljóst eignarhald, gefnar forsendur og umferðartími." },
    { topic: T, q: "Hvað er flöskuháls (bottleneck) í ferli?", o: ["Þrep þar sem innflæðið er meira en þrepið afkastar, og það ræður afköstum ferlisins", "Fyrsta þrep ferlisins, af því að allt fer þar í gegn", "Þrepið með flesta starfsmenn", "Þrepið sem tekur lengstan tíma á hverja einingu, óháð fjölda starfsmanna"], c: 0, e: "Flöskuhálsinn er skorðan: þar er afkastagetan minnst miðað við álag. Lengsti vinnslutími á einingu segir ekki allt ef fleiri starfsmenn vinna samhliða." },
    { topic: T, q: "Hvað á samkvæmt F2 að forðast varðandi þrep sem eru ekki flöskuhálsar?", o: ["Að bæta við þau afkastagetu; það bætir bara við sóun", "Að mæla afköst þeirra", "Að hafa biðminni á undan flöskuhálsinum", "Að setja besta fólkið á flöskuhálsinn"], c: 0, e: "Aukin geta annars staðar en í flöskuhálsinum eykur ekki afköst ferlisins. Biðminni fyrir framan flöskuhálsinn og besta fólkið á hann eru einmitt ráðin." },
    { topic: T, q: "Hver er einfaldasta leiðin til að finna flöskuháls samkvæmt F2?", o: ["Leita að biðröðunum", "Telja starfsmenn í hverri deild", "Spyrja viðskiptavininn", "Skoða skipuritið"], c: 0, e: "Vinna hrannast upp fyrir framan flöskuhálsinn, svo biðraðirnar vísa á hann." },
    { topic: T, q: "Í flæðitímagreiningu F2 eru fjórar leiðir: 130, 96, 158 og 123 mín. Hvar á að byrja úrbætur?", o: ["Á leiðinni sem tekur 158 mín. (lengsta leiðin)", "Á leiðinni sem tekur 96 mín.", "Jafnt á öllum leiðum", "Á leiðinni sem tekur 130 mín. af því hún er í miðjunni"], c: 0, e: "Lengsta leiðin (critical path) er hægasta flæðið og ræður heildartímanum. Að stytta aðra leið styttir ekki heildina." },
    { topic: T, q: "Á bráðamóttöku tekur heimsóknin 3,5 klst. en vinnan aðeins 11 mín. Hver er lærdómurinn?", o: ["Mest er að vinna með því að minnka bið og flutning", "Starfsfólkið þarf að vinna hraðar", "Ferlið er í lagi því vinnan sjálf er stutt", "Bæta þarf við fleiri skoðunum"], c: 0, e: "Um 95 % tímans er bið og flutningur. Að ráðast á biðina styttir umferðartímann mun meira en að flýta vinnunni." },
    { topic: T, q: "Hvað er staðlað verklag (standardized work) samkvæmt F2?", o: ["Grunnlína fyrir stöðugar umbætur; bættur staðall verður ný grunnlína", "Regla um að enginn megi breyta ferlinu eftir að það hefur verið skráð", "ISO-vottun ferlisins", "Sjálfvirknivæðing allra handvirkra verka"], c: 0, e: "Staðlað verklag minnkar breytileika og er viðmiðið sem umbætur eru mældar við; þegar það batnar verður nýi staðallinn grunnlína." },
    { topic: T, q: "Hvaða sjónarhorn Zachman-rammans lýsir ferlaarkitektúr?", o: ["Viðskiptaferlasýn", "Skipuheildarsýn", "Gagnasýn", "Tækniskipulagssýn"], c: 0, e: "Viðskiptaferlasýnin lýsir ferlaheimsmyndinni með ferlaarkitektúr. Skipuheildarsýn = skipurit, gagnasýn = gagnalíkan, tækniskipulagssýn = innviðalíkan." },
    { topic: T, q: "Hvað er APQC PCF?", o: ["Tilvísunarlíkan (ferlarammi) sem flokkar ferla í 13 kafla", "Aðferð til að reikna afköst flöskuhálsa", "Hugbúnaður til að teikna BPMN-líkön", "Gæðastaðall fyrir vottun fyrirtækja"], c: 0, e: "Process Classification Framework frá APQC er tilvísunarlíkan sem nýtist við ferlaskráningu, eins og ITIL og SCOR." },
    { topic: T, q: "Hvað er rangt við að flokka ferli sem meginferli „af því að hann er mikilvægur“?", o: ["Flokkurinn ræðst af því hvort ferlið skapar beint virðið sem viðskiptavinurinn greiðir fyrir", "Ekkert; mikilvægustu ferlarnir eru alltaf meginferlar", "Meginferlar eru alltaf þeir sem kosta mest", "Mikilvægi ræður bara því hvort ferli er stjórnunarferli"], c: 0, e: "Stoðferlar eins og UT eða launavinnsla geta verið mjög mikilvægir en eru samt stoðferlar." },
    { topic: T, q: "Hvað sýnir hitakort (heat map) af ferlakorti?", o: ["Heilsu eða þroska hvers ferils með litum (grænt, gult, rautt)", "Hitastig í framleiðslusal", "Fjölda starfsmanna í hverju ferli", "Röð ferla í virðiskeðjunni"], c: 0, e: "Hitakortið litar ferlana á ferlakortinu eftir eiginleikum eða þroska og sýnir í fljótu bragði hvar vandinn liggur." }
  );

  B.G.push(function floskuhals() {
    var names = ["Móttaka", "Skráning", "Yfirferð", "Afgreiðsla"];
    var st, cap, ok;
    do {
      st = names.map(function () { return { s: rnd(1, 4), t: rnd(4, 20) / 2 }; });
      cap = st.map(function (x) { return (x.s * 60) / x.t; });
      var srt = cap.slice().sort(function (a, b) { return a - b; });
      ok = srt[1] / srt[0] > 1.08;
    } while (!ok);
    var m = Math.min.apply(null, cap), k = cap.indexOf(m);
    return {
      topic: T, title: "Afköst ferlis með flöskuhálsi",
      text: "Umsóknir fara í gegnum fjögur þrep í röð: " + st.map(function (x, i) { return names[i].toLowerCase() + " (" + x.s + " starfsm., " + is(x.t) + " mín. á umsókn)"; }).join(", ") + ". Hve margar umsóknir á klst. getur ferlið afgreitt?",
      answer: m, unit: "umsóknir/klst", tol: 0.02,
      sol: "<p>Afköst þreps = $\\text{starfsmenn}\\cdot 60/\\text{vinnslutími}$: " + st.map(function (x, i) { return names[i] + " $" + x.s + "\\cdot 60/" + tx(x.t) + " = " + tx(cap[i]) + "$"; }).join("; ") + ".</p><p>Afköst ferlisins ráðast af flöskuhálsinum (" + names[k].toLowerCase() + "): <b>" + is(m) + " umsóknir/klst</b>.</p>",
    };
  });
  B.G.push(function vinnuhlutfall() {
    var work = rnd(6, 40), ct = rnd(90, 360);
    return {
      topic: T, title: "Hlutfall vinnslutíma",
      text: "Mál er $" + ct + "$ mín. í gegnum ferlið frá upphafi til enda, en samanlagður vinnslutími (eiginleg vinna) er $" + work + "$ mín. Hve stór hluti umferðartímans (í %) er vinna?",
      answer: (100 * work) / ct, unit: "%", tol: 0.02,
      sol: "<p>$\\dfrac{\\text{vinnslutími}}{\\text{umferðartími}} = \\dfrac{" + work + "}{" + ct + "} = " + tx((100 * work) / ct) + "\\,\\%$. Afgangurinn, $" + tx(100 - (100 * work) / ct) + "\\,\\%$, er bið og flutningur.</p>",
    };
  });
  B.G.push(function lengstaleid() {
    var v, p;
    do {
      v = { A: rnd(10, 50), B: rnd(10, 60), C: rnd(10, 60), D: rnd(5, 60), E: rnd(5, 60), F: rnd(5, 60), G: rnd(5, 60), H: rnd(5, 40), I: rnd(5, 40) };
      p = [["A-B-D-H", v.A + v.B + v.D + v.H], ["A-B-E-H", v.A + v.B + v.E + v.H], ["A-C-F-I", v.A + v.C + v.F + v.I], ["A-C-G-I", v.A + v.C + v.G + v.I]];
      var s = p.map(function (x) { return x[1]; }).sort(function (a, b) { return b - a; });
    } while (s[0] === s[1]);
    var best = p.reduce(function (a, b) { return b[1] > a[1] ? b : a; });
    return {
      topic: T, title: "Lengsta leið í flæðitímagreiningu",
      text: "Eftir A greinist ferlið í B og C; eftir B koma D eða E og svo H; eftir C koma F eða G og svo I (sama net og á glæru 12 í F2). Tímar í mín.: " + Object.keys(v).map(function (k) { return k + " = " + v[k]; }).join(", ") + ". Hve langur er tíminn eftir lengstu leiðinni (í mín.)?",
      answer: best[1], unit: "mín", tol: 0.001, absTol: 0.5,
      sol: "<p>Leiðirnar: " + p.map(function (x) { return x[0] + " = " + x[1]; }).join(", ") + ".</p><p>Lengsta leiðin er <b>" + best[0] + " með " + best[1] + " mín.</b> Þar á að byrja úrbætur.</p>",
    };
  });
  B.G.push(function takttimi() {
    var h = pick([7, 7.5, 8]), d = rnd(30, 160);
    return {
      topic: T, title: "Takt-tími",
      text: "Þjónustuver er opið $" + tx(h) + "$ klst. á dag og $" + d + "$ beiðnir berast á dag. Hver er takt-tíminn í mínútum á beiðni?",
      answer: (h * 60) / d, unit: "mín", tol: 0.02,
      sol: "<p>Takt-tími = tiltækur tími / eftirspurn $= " + tx(h) + "\\cdot 60/" + d + " = " + tx((h * 60) / d) + "$ mín. Ferlið þarf að skila beiðni á þessu bili til að anna eftirspurninni.</p>",
    };
  });
})();

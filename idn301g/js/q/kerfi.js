/* q/kerfi.js – spurningar fyrir kafla 8: Kerfishugsun og orsakalykkjur. */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, tx = B.tx, is = B.is;

  B.MC.push(
    /* ---------- Kerfi, birgðir og flæði ---------- */
    { topic: "kerfi", q: "Samkvæmt Meadows er kerfi byggt úr þremur hlutum. Hverjir eru þeir?",
      o: ["Einingar, tengingar og tilgangur", "Inntak, ferli og úttak", "Birgðir, flæði og ský", "Gerendur, verkþættir og atburðir"], c: 0,
      e: "Kerfi er safn <b>eininga</b> (elements) sem tengjast með <b>tengingum</b> (interconnections) og ná saman einhverjum <b>tilgangi</b> (function, purpose). Inntak-ferli-úttak lýsir opnu ferli, ekki kerfi með endurgjöf." },
    { topic: "kerfi", q: "Hvaða hluti kerfis hefur að jafnaði <b>mest</b> áhrif á hegðun þess ef honum er breytt?",
      o: ["Tilgangur kerfisins", "Einingarnar sjálfar", "Fjöldi eininganna", "Heitin á einingunum"], c: 0,
      e: "Ef öllum leikmönnum fótboltaliðs er skipt út er liðið samt fótboltalið, en ef tilgangurinn breytist (liðið á að tapa) verður kerfið gjörólíkt. Einingarnar skipta oftast minnstu máli, <b>tilgangurinn</b> mestu." },
    { topic: "kerfi", q: "Hvernig er <b>kerfishugsun</b> (systems thinking) lýst á glærunum?",
      o: ["Að horfa á kerfi með tilliti til orsaka, afleiðinga og endurgjafar", "Að greina hvert ferli í kerfinu sérstaklega og hámarka það", "Að teikna öll ferli kerfisins í BPMN með sundbrautum", "Að mæla allar einingar kerfisins og finna fylgni á milli þeirra"], c: 0,
      e: "Kerfishugsun snýst um orsakir, afleiðingar og <b>endurgjöf</b>: kortleggja breytur, skilja orsakasamhengi og skilja hegðunina sem stafar af uppbyggingunni yfir tíma." },
    { topic: "kerfi", q: "Hvað einkennir <b>birgð</b> (stock)?",
      o: ["Hún safnast upp og er mæld á einum tímapunkti", "Hún er mæld á tímaeiningu, t.d. lítrar á mínútu", "Hún breytist aðeins þegar stýribreyta breytist", "Hún liggur alltaf utan afmörkunar kerfisins"], c: 0,
      e: "Birgð er uppsöfnun (vatn í baðkari, íbúðir á landinu) og er mæld á tímapunkti. Það er <b>flæði</b> sem mælist á tímaeiningu og breytir birgðinni." },
    { topic: "kerfi", q: "Hvert eftirfarandi er <b>flæði</b> (flow) en ekki birgð?",
      o: ["Fjöldi nýbyggðra íbúða á ári", "Fjöldi íbúða á landinu", "Innistæða á bankareikningi", "Fiskur í sjónum í tonnum"], c: 0,
      e: "Flæði er mælt á tímaeiningu (íbúðir <b>á ári</b>) og breytir birgð. Íbúðir á landinu, innistæða og stærð fiskistofns eru birgðir sem mæla má á einum tímapunkti." },
    { topic: "kerfi", q: "Í baðkar renna 10 L/mín og jafn mikið fer út um niðurfallið. Hvað gerist með vatnsmagnið?",
      o: ["Það stendur í stað í kviku jafnvægi", "Það minnkar hægt þar til baðkarið tæmist", "Það eykst hægt þar til baðkarið fyllist", "Það sveiflast í kringum upphafsgildið"], c: 0,
      e: "Þegar innflæði = útflæði breytist birgðin ekki þótt vatnið sé á hreyfingu: <b>kvikt jafnvægi</b> (dynamic equilibrium)." },
    { topic: "kerfi", q: "Hvernig er hægt að <b>hækka</b> birgð, t.d. fjölda íbúða í útleigu til heimila?",
      o: ["Með því að auka innflæði eða minnka útflæði", "Eingöngu með því að auka innflæðið", "Eingöngu með því að minnka útflæðið", "Með því að breyta birgðinni beint, framhjá flæðunum"], c: 0,
      e: "Birgð breytist aðeins vegna flæðis, og bæði innflæði og útflæði hafa áhrif. Íbúðum í langtímaleigu fjölgar hvort sem fleiri bætast við eða færri hverfa í skammtímaleigu." },
    { topic: "kerfi", q: "Hvað táknar <b>ský</b> í birgða- og flæðiriti (SFD)?",
      o: ["Uppsprettu eða niðurfall utan afmörkunar kerfisins", "Óvissu um stærð birgðarinnar", "Seinkun í flæðinu milli tveggja birgða", "Upplýsingatengingu milli tveggja breyta"], c: 0,
      e: "Ský sýna hvaðan flæði kemur og hvert það fer þegar það er <b>utan afmörkunar</b> líkansins. Þau eru einföldun sem getur bitið mann ef afmörkunin er röng." },
    { topic: "kerfi", q: "Í SFD er teiknað rör með loka (krana) á milli tveggja kassa. Hvað táknar það?",
      o: ["Flæði", "Birgð", "Seinkun", "Lykkju"], c: 0,
      e: "Kassi = birgð, rör með loka = <b>flæði</b>, lítill hringur = breyta (converter), ský = uppspretta/niðurfall." },
    { topic: "kerfi", q: "Hvers vegna eru birgðir mikilvægar fyrir stöðugleika kerfa?",
      o: ["Þær breytast hægt og virka sem stuðpúði sem aftengir innflæði og útflæði", "Þær breytast alltaf jafn hratt og flæðin sem tengjast þeim", "Þær eyða seinkunum úr kerfinu svo það bregst strax við", "Þær gera allar lykkjur kerfisins að jafnvægislykkjum"], c: 0,
      e: "Birgðir breytast aðeins í gegnum flæði og því <b>hægt</b>. Þær kaupa tíma og leyfa innflæði og útflæði að vera ólík um stund (lager í verslun, lón virkjunar)." },
    { topic: "kerfi", q: "Hver er munurinn á <b>opnu</b> og <b>lokuðu</b> kerfi (open-loop og closed-loop)?",
      o: ["Í lokuðu kerfi berst úttakið aftur og hefur áhrif á inntakið", "Í lokuðu kerfi er ekkert flæði inn í eða út úr kerfinu", "Í opnu kerfi eru eingöngu styrkjandi lykkjur", "Í opnu kerfi eru engar birgðir, aðeins flæði"], c: 0,
      e: "Lokað kerfi hefur <b>endurgjöf</b>: úttakið berst til baka og breytir inntakinu. Opið kerfi er keðja inntak → ferli → úttak án endurgjafar." },

    /* ---------- Lykkjur og pólun ---------- */
    { topic: "kerfi", q: "Hvernig er <b>jákvæð endurgjöf</b> (positive feedback) lýst á glærunum?",
      o: ["Hún er sjálfstyrkjandi (self-reinforcing)", "Hún er sjálfleiðréttandi (self-correcting)", "Hún er alltaf æskileg fyrir kerfið", "Hún leitar alltaf að gefnu markmiði"], c: 0,
      e: "Jákvæð endurgjöf er <b>sjálfstyrkjandi</b> (hæna → egg → fleiri hænur). „Jákvæð“ segir ekkert um hvort hún sé góð; vítahringur er líka jákvæð endurgjöf." },
    { topic: "kerfi", q: "Hvað gerir <b>jafnvægislykkja</b> (balancing loop, B)?",
      o: ["Vinnur á móti breytingum og dregur kerfið að markmiði eða jafnvægi", "Magnar breytingar svo vöxtur leiðir af sér meiri vöxt", "Heldur kerfinu alltaf nákvæmlega í markmiðinu án frávika", "Tengir saman tvær birgðir án þess að hafa áhrif á þær"], c: 0,
      e: "Neikvæð endurgjöf er <b>sjálfleiðréttandi</b>: hún bregst við bilinu milli stöðu og markmiðs. Hún getur samt sveiflast og skotið yfir markið ef seinkun er í henni." },
    { topic: "kerfi", q: "Hvað þýðir $A \\xrightarrow{+} B$ í orsakariti?",
      o: ["Ef A eykst, eykst B (umfram það sem annars hefði orðið), og ef A minnkar, minnkar B", "B eykst alltaf með tímanum óháð því hvað A gerir", "A og B hafa jákvæða fylgni en ekki endilega orsakasamband", "Tengslin milli A og B eru æskileg fyrir kerfið"], c: 0,
      e: "Plús merkir að breytingin er í <b>sömu átt</b> (S, same). Orsakarit sýnir orsakasamband, ekki bara fylgni, og formerkið segir ekkert um hvort það sé gott eða slæmt." },
    { topic: "kerfi", q: "Hvað þýðir $A \\xrightarrow{-} B$ í orsakariti?",
      o: ["Ef A eykst, minnkar B, og ef A minnkar, eykst B", "B minnkar alltaf með tímanum, óháð A", "A dregur úr áhrifum B á aðrar breytur", "Tengslin eru slæm og ætti að fjarlægja þau"], c: 0,
      e: "Mínus merkir að breytingin er í <b>gagnstæða átt</b> (O, opposite). Dæmi: Stýrivextir $\\xrightarrow{-}$ Útlán." },
    { topic: "kerfi", q: "Sumir nota bókstafina S og O í stað + og − á örvum. Hvað merkir <b>O</b>?",
      o: ["Opposite: breytingin er í gagnstæða átt, sama og −", "Open: tengslin eru ekki hluti af lykkju", "Output: örin bendir á úttak kerfisins", "Oscillation: tengslin valda sveiflum"], c: 0,
      e: "S = same (+) og O = <b>opposite</b> (−). Á glærunni um niðurstöður De Meulenaere o.fl. sést O-merking." },
    { topic: "kerfi", q: "Hvað táknar tvöfalt strik (||) yfir ör í orsakariti?",
      o: ["Seinkun milli orsakar og afleiðingar", "Tvöföld áhrif, þ.e. tengsl með stuðul 2", "Tvö samsíða tengsl sem núlla hvort annað", "Að tengslin hafi verið rofin í líkaninu"], c: 0,
      e: "|| er merki um <b>seinkun</b>: „ef A eykst, eykst B eftir nokkurn tíma“. Merktu þær seinkanir sem skipta máli fyrir hegðunina." },
    { topic: "kerfi", q: "Lykkja hefur fimm tengsl, þar af <b>tvö neikvæð</b>. Hvers konar lykkja er hún?",
      o: ["Styrkjandi (R), því fjöldi neikvæðra tengsla er slétt tala", "Jafnvægislykkja (B), því hún inniheldur neikvæð tengsl", "Hvorki R né B, því formerkin í henni eru blönduð", "Það ræðst eingöngu af því hvort seinkun er í lykkjunni"], c: 0,
      e: "Teldu neikvæðu tengslin: <b>slétt tala = R</b>, oddatala = B. Tvö neikvæð tengsl snúa stefnunni tvisvar svo þau núllast út." },
    { topic: "kerfi", q: "Lykkja hefur fjögur tengsl, þar af <b>þrjú neikvæð</b>. Hvers konar lykkja er hún?",
      o: ["Jafnvægislykkja (B), því 3 er oddatala", "Styrkjandi (R), því flest tengslin eru neikvæð", "Styrkjandi (R), því 4 tengsl er slétt tala", "Ekki hægt að segja án þess að vita stærð tengslanna"], c: 0,
      e: "Það er fjöldi <b>neikvæðra</b> tengsla sem gildir, ekki heildarfjöldi tengsla. Oddatala neikvæðra tengsla → <b>B</b>." },
    { topic: "kerfi", q: "Ferðamenn $\\xrightarrow{+}$ Álag á náttúruperlur $\\xrightarrow{-}$ Ánægja ferðamanna $\\xrightarrow{+}$ Ferðamenn. Hvers konar lykkja er þetta?",
      o: ["Jafnvægislykkja (B) sem heldur aftur af fjölgun ferðamanna", "Styrkjandi lykkja (R) sem veldur veldisvexti ferðamanna", "Styrkjandi lykkja (R), því tvö af þremur tengslum eru jákvæð", "Engin lykkja, því álag er ekki mælanleg breyta"], c: 0,
      e: "Eitt neikvætt tengsl (oddatala) → <b>B</b>. Saga: fleiri ferðamenn → meira álag → minni ánægja → færri ferðamenn. Þetta er dæmigerð takmörkunarlykkja í ferðaþjónustu." },
    { topic: "kerfi", q: "Atvinnuleysi $\\xrightarrow{-}$ Tekjur heimila $\\xrightarrow{+}$ Neysla $\\xrightarrow{-}$ Atvinnuleysi. Hvers konar lykkja er þetta?",
      o: ["Styrkjandi lykkja (R), vítahringur", "Jafnvægislykkja (B), því hún hefur neikvæð tengsl", "Jafnvægislykkja (B) sem dregur úr atvinnuleysi", "Engin lykkja, því tengslin eru ekki öll eins"], c: 0,
      e: "Tvö neikvæð tengsl (slétt tala) → <b>R</b>. Saga: atvinnuleysi eykst → tekjur minnka → neysla minnkar → atvinnuleysi eykst enn. Styrkjandi lykkja getur verið vítahringur." },
    { topic: "kerfi", q: "Verðbólga $\\xrightarrow{+}$ Stýrivextir $\\xrightarrow{-}$ Útlán $\\xrightarrow{+}$ Eftirspurn $\\xrightarrow{+}$ Verðbólga. Hvers konar lykkja er þetta?",
      o: ["Jafnvægislykkja (B): stýrivextir halda aftur af verðbólgu", "Styrkjandi lykkja (R): verðbólga ýtir undir meiri verðbólgu", "Styrkjandi lykkja (R), því þrjú af fjórum tengslum eru jákvæð", "Jafnvægislykkja (B), því stýrivextir eru markmið"], c: 0,
      e: "Eitt neikvætt tengsl → <b>B</b>. Þetta er stýrivaxtalykkja Seðlabankans: hún bregst við bilinu milli verðbólgu og markmiðs, með talsverðri seinkun." },
    { topic: "kerfi", q: "Útlán banka $\\xrightarrow{+}$ Innlán $\\xrightarrow{+}$ Útlánageta $\\xrightarrow{+}$ Útlán banka. Hvers konar lykkja er þetta í peningakerfinu?",
      o: ["Styrkjandi lykkja (R): útlán skapa innlán sem leyfa enn meiri útlán", "Jafnvægislykkja (B): innlán takmarka útlán bankans", "Jafnvægislykkja (B), því hún hefur þrjú tengsl", "Engin lykkja, því peningar eru flæði en ekki birgð"], c: 0,
      e: "Engin neikvæð tengsl → <b>R</b>. Þegar banki lánar verða til ný innlán í bankakerfinu, sem auka getu til frekari útlána. Jafnvægislykkjur (bindiskylda, eiginfjárkröfur, stýrivextir) halda aftur af henni." },
    { topic: "kerfi", q: "Hver er „besta leiðin“ samkvæmt glærunum til að ákvarða pólun lykkju?",
      o: ["Að segja söguna hringinn í kringum lykkjuna", "Að telja jákvæðu tengslin í lykkjunni", "Að skoða hvort lykkjan hefur seinkun", "Að athuga hvort lykkjan er teiknuð réttsælis"], c: 0,
      e: "Fljótlega leiðin er að telja neikvæðu tengslin; besta leiðin er að <b>segja söguna</b> („ef X eykst þá…“), helst tvisvar: einu sinni með aukningu og einu sinni með minnkun." },
    { topic: "kerfi", q: "Hvað gerist venjulega þegar <b>seinkun</b> í jafnvægislykkju lengist?",
      o: ["Sveiflurnar í kerfinu verða stærri", "Kerfið nær markmiðinu hraðar", "Lykkjan breytist í styrkjandi lykkju", "Birgðin í kerfinu hættir að breytast"], c: 0,
      e: "Lengri seinkun → <b>stærri sveiflur</b>: gripið er inn í of lengi og kerfið skýtur yfir markið, eins og í sturtu sem bregst seint við eða á húsnæðismarkaði þar sem tekur ár að byggja." },
    { topic: "kerfi", q: "Hvað er átt við þegar sagt er að ein lykkja <b>ráði</b> (loop dominance) í kerfi?",
      o: ["Hún hefur mest áhrif á hegðunina á tilteknum tíma, og yfirráðin geta færst til", "Hún er sú lykkja sem hefur flest tengsl og breytur", "Hún er alltaf styrkjandi og ræður því vextinum", "Hún er sú lykkja sem var teiknuð fyrst í líkaninu"], c: 0,
      e: "Hegðunin ræðst af því hvaða lykkja er sterkust hverju sinni. Í S-ferli ræður R fyrst (veldisvöxtur) en B tekur svo yfir þegar takmörkin nálgast." },

    /* ---------- CLD-reglur ---------- */
    { topic: "kerfi", q: "Hvaða heiti á breytu fylgir best reglum um CLD?",
      o: ["Ánægja ferðamanna", "Aukin ánægja ferðamanna", "Ferðamenn verða ánægðari", "Ánægja ferðamanna minnkar"], c: 0,
      e: "Breytuheiti eiga að vera <b>nafnorð</b>, mælanleg og <b>hlutlaus um stefnu</b>. Breytingin sjálf er sýnd með örvum og formerkjum, ekki í heitinu." },
    { topic: "kerfi", q: "Hópur í HÓP2 (peningakerfið) er með þessar breytur. Hver þeirra brýtur reglurnar um breytuheiti?",
      o: ["Seðlabankinn", "Stýrivextir", "Peningamagn í umferð", "Verðbólga"], c: 0,
      e: "„Seðlabankinn“ er stofnun, ekki stærð sem getur aukist eða minnkað. Stofnanir eiga heima sem <b>gerendur</b> á bak við breytur eins og stýrivexti." },
    { topic: "kerfi", q: "Á glærunum er tekið dæmi um að „viðhorf til glæpa“ sé slæmt breytuheiti. Hvers vegna?",
      o: ["Það er óljóst hvað það þýðir að breytan aukist", "Það er of langt og flókið heiti", "Glæpir eru ekki hluti af neinu kerfi", "Viðhorf er alltaf birgð en ekki flæði"], c: 0,
      e: "Það þarf að vera skýrt hvað það þýðir að breytan aukist eða minnki. „Umburðarlyndi gagnvart glæpum“ hefur skýra stefnu." },
    { topic: "kerfi", q: "Nemandi teiknar „Umsókn berst → Umsókn metin → Lán greitt út“ í orsakarit. Hver er villan?",
      o: ["Örvarnar tákna tímaröð („og svo…“) en ekki orsakasamband", "Það vantar formerki á fyrstu örina", "Lykkjan er styrkjandi og ætti að vera jafnvægislykkja", "Breyturnar eru of mælanlegar fyrir orsakarit"], c: 0,
      e: "Örvar í CLD tákna <b>orsök</b>, ekki „og svo…“. Röð verkþátta á heima í ferlariti (BPMN), ekki orsakariti." },
    { topic: "kerfi", q: "Ísasala og morðtíðni haldast í hendur yfir árið. Hvernig á að fara með það í CLD?",
      o: ["Ekki teikna ör á milli; fylgni er ekki orsök og báðar ráðast af árstíð", "Teikna ör frá ísasölu til morðtíðni með formerkinu +", "Teikna ör í báðar áttir, því fylgnin er gagnkvæm", "Teikna jafnvægislykkju á milli breytanna tveggja"], c: 0,
      e: "Fylgni endurspeglar fyrri hegðun, ekki uppbyggingu kerfisins. Hér er sameiginleg orsök (sumar, hiti). CLD á að sýna <b>orsakasamhengi</b>." },
    { topic: "kerfi", q: "Hvað af eftirfarandi er nefnt sem <b>algeng mistök</b> við gerð orsakarita?",
      o: ["Margar aðgerðir faldar í einni breytu", "Að nefna lykkjurnar með grípandi heitum", "Að merkja mikilvægar seinkanir með ||", "Að byrja einfalt og bæta smám saman við"], c: 0,
      e: "Algeng mistök: óskýrt vandamál, óafmörkuð spurning, <b>margar aðgerðir í einni breytu</b>, of mikil einföldun, skortur á uppbyggingu og of mörg smáatriði. Hinir valkostirnir eru góð vinnubrögð." },
    { topic: "kerfi", q: "Samkvæmt glærunum: ef tengsl í CLD þarfnast útskýringar, hvað á að gera?",
      o: ["Brjóta þau upp með því að bæta við millilið", "Skrifa útskýringuna við örina í löngu máli", "Fjarlægja tengslin úr ritinu", "Merkja þau með seinkunarmerki ||"], c: 0,
      e: "„If a link needs explanation, disaggregate it.“ T.d. Stýrivextir → <b>Greiðslubyrði lána</b> → Eftirspurn eftir íbúðum → Húsnæðisverð." },

    /* ---------- Hegðun og dýragarðurinn ---------- */
    { topic: "kerfi", q: "Birgð vex um 5 % á ári. Um það bil hve langur er tvöföldunartíminn?",
      o: ["Um 14 ár", "Um 20 ár", "Um 10 ár", "Um 7 ár"], c: 0,
      e: "<b>Regla 70</b>: $T_2 \\approx 70/r = 70/5 = 14$ ár." },
    { topic: "kerfi", q: "Vatnaliljum í tjörn fjölgar tvöfalt á dag og tjörnin er hulin á degi 30. Hvaða dag var hún hálfhulin?",
      o: ["Á degi 29", "Á degi 15", "Á degi 20", "Á degi 25"], c: 0,
      e: "Í veldisvexti tvöfaldast magnið á hverjum degi, svo daginn áður var hún <b>hálf</b> hulin. Fólk vanmetur veldisvöxt kerfisbundið (dæmið úr grein Kristrúnar Frostadóttur í F11)." },
    { topic: "kerfi", q: "Hvaða hegðun yfir tíma kemur fram þegar styrkjandi lykkja ræður fyrst og jafnvægislykkja tekur svo yfir þegar takmörkum er náð?",
      o: ["S-ferill", "Veldisvöxtur án enda", "Deyfðar sveiflur", "Línulegur vöxtur"], c: 0,
      e: "R gefur veldisvöxt í byrjun; þegar takmörkin nálgast tekur B yfir og vöxturinn flatar út: <b>S-ferill</b> (logistic growth)." },
    { topic: "kerfi", q: "Í hitastillisdæmi Meadows (hitun á móti varmatapi) endar hitinn aðeins undir markmiðinu. Hvers vegna?",
      o: ["Varmatapið heldur áfram meðan hitastillirinn bregst við, svo tvær jafnvægislykkjur togast á", "Hitastillirinn er styrkjandi lykkja sem skýtur yfir markið", "Mælirinn í hitastillinum er alltaf of lágt stilltur", "Herbergið er birgð sem getur aldrei breyst"], c: 0,
      e: "Ein birgð og <b>tvær jafnvægislykkjur</b> sem togast á: hitunin dregur hitann að markmiðinu, varmatapið að útihitanum. Bæta þarf lekann upp í markmiðinu." },
    { topic: "kerfi", q: "Í tveggja birgða kerfi Meadows þar sem endurnýjanleg auðlind (fiskistofn) takmarkar fjármagn útgerðar, hvað getur gerst?",
      o: ["Jafnvægi, sveiflur í kringum jafnvægi eða ofveiði og hrun", "Eingöngu stöðugt jafnvægi, því stofninn endurnýjar sig", "Eingöngu óendanlegur vöxtur, því auðlindin er endurnýjanleg", "Eingöngu hrun, því öll auðlindanýting endar í hruni"], c: 0,
      e: "Það ræðst af því hversu hratt sókn eykst miðað við endurnýjun stofnsins: <b>jafnvægi, sveiflur eða hrun</b>. Kvótakerfið er tilraun til að halda kerfinu í fyrsta flokknum." },
    { topic: "kerfi", q: "Bílasali bregst mjög hratt við breytingum í sölu með því að breyta pöntunum strax. Hvað segir Meadows um þetta?",
      o: ["Hröð viðbrögð við seinkuðum upplýsingum auka oft sveiflurnar í lagernum", "Hröð viðbrögð eyða alltaf sveiflum í lagernum", "Viðbragðshraðinn skiptir engu máli fyrir lagerinn", "Hröð viðbrögð breyta lykkjunni í styrkjandi lykkju"], c: 0,
      e: "Í lagerkerfi með seinkunum (skynjun, ákvörðun, afhending) gera <b>ofviðbrögð</b> sveiflurnar verri. Yfirveguð, hægari viðbrögð jafna þær." },

    /* ---------- Seigla, sjálfsskipulag, stigveldi ---------- */
    { topic: "kerfi", q: "Hvað er <b>seigla</b> (resilience) kerfis?",
      o: ["Geta kerfis til að jafna sig eftir áföll, byggð á mörgum afturvirkum lykkjum", "Geta kerfis til að halda framleiðni í hámarki öllum stundum", "Geta kerfis til að standa algerlega í stað án breytinga", "Geta kerfis til að vaxa með veldisvexti án takmarka"], c: 0,
      e: "Seigla byggist á <b>mörgum lykkjum</b> sem geta tekið við hver af annarri. Hún er ekki það sama og stöðugleiki: kyrrstætt kerfi getur verið brothætt." },
    { topic: "kerfi", q: "Verslanakeðja leggur niður alla bakhúslagera og pantar nákvæmlega eftir sölu („lean“). Hvaða eiginleika fórnar hún helst?",
      o: ["Seiglu", "Stigveldi", "Afmörkun", "Tilgangi"], c: 0,
      e: "Kerfi sem eru hámörkuð fyrir afköst eða skilvirkni missa oft <b>seiglu</b>: stuðpúðar (birgðir) sem gleyptu áföll eru horfnir, svo truflun í aðfangakeðju bitnar strax á viðskiptavinum." },
    { topic: "kerfi", q: "Hvað er <b>sjálfsskipulag</b> (self-organization)?",
      o: ["Geta kerfis til að gera sig flóknara og þróa nýja uppbyggingu", "Að kerfi sé skipulagt ofan frá af einum stjórnanda", "Að allar einingar kerfisins séu eins og víxlanlegar", "Að kerfið haldist óbreytt þótt umhverfið breytist"], c: 0,
      e: "Sjálfsskipulag er geta kerfis til að læra, breyta og þróa eigin uppbyggingu (þróun lífvera, nýsköpun). Það er sterkasta form seiglu og vogaraflspunktur 4." },
    { topic: "kerfi", q: "Hvers vegna er <b>stigveldi</b> (hierarchy) gagnlegt í kerfum?",
      o: ["Tengsl innan undirkerfa eru sterkari en milli þeirra, svo hlutar geta starfað sjálfstætt", "Efsta stig þarf að hafa allar upplýsingar um allar einingar", "Það tryggir að öll undirkerfi hámarki eigin markmið", "Það eyðir þörfinni fyrir afturvirkar lykkjur í kerfinu"], c: 0,
      e: "Stigveldi léttir á upplýsingaþörf og gerir kerfi minna brothætt. Það á að <b>þjóna undirkerfunum</b>; ef undirkerfi hámarkar eigin markmið á kostnað heildar er það <i>suboptimization</i>." },

    /* ---------- Af hverju kerfi koma á óvart ---------- */
    { topic: "kerfi", q: "Sjómaður veit ekki hvað keppinautar hans veiða eða hve mikið er eftir í sjónum, og hámarkar því eigin afla. Hvaða hugtak lýsir þessu?",
      o: ["Afmörkuð skynsemi (bounded rationality)", "Sjálfsskipulag (self-organization)", "Stigmögnun (escalation)", "Tælandi atburðir (beguiling events)"], c: 0,
      e: "<b>Afmörkuð skynsemi</b>: hver aðili tekur skynsamlega ákvörðun út frá þeim upplýsingum sem hann hefur, en það sem er skynsamlegt fyrir einstaklinginn er ekki endilega skynsamlegt fyrir kerfið." },
    { topic: "kerfi", q: "Hvað segir Meadows um <b>takmörk</b> (limits) í kerfum?",
      o: ["Vöxtur stöðvast við mest takmarkandi þáttinn, og þegar hann er fjarlægður tekur næsti við", "Takmörk eru alltaf sett af stjórnvöldum og má því afnema", "Kerfi án seinkana hafa engin takmörk á vexti", "Takmörk skipta aðeins máli í kerfum með einni birgð"], c: 0,
      e: "Takmarkandi þátturinn er mikilvægasta inntakið. Endalaus vöxtur er ómögulegur: spurningin er „<b>innan hvaða takmarka viljum við lifa?</b>“." },
    { topic: "kerfi", q: "Fréttir fjalla um „hrun á hlutabréfamarkaði“ sem einstakan atburð. Hvað ráðleggur Meadows?",
      o: ["Að skoða mynstur yfir tíma og uppbygginguna sem veldur atburðunum", "Að spá fyrir um næsta hrun út frá fylgni flæða", "Að einbeita sér að stærstu atburðunum og hunsa smærri", "Að treysta á atferlislíkön sem byggja á fyrri flæðum"], c: 0,
      e: "Atburðir eru <b>tælandi</b> (beguiling events). Kerfishugsun spyr hvaða uppbygging (birgðir, lykkjur, seinkanir) framleiðir atburðina. Atferlislíkön spá vel til skamms tíma en bregðast þegar uppbyggingin breytist." },
    { topic: "kerfi", q: "Skordýraeitur drap náttúrulega óvini lirfanna svo lirfunum fjölgaði enn meira (dæmi úr TiS). Hvaða ástæðu fyrir „óvæntri“ hegðun kerfa sýnir þetta best?",
      o: ["Línuleg hugsun í ólínulegum heimi", "Afmörkuð skynsemi einstakra bænda", "Hnignun markmiða í skógrækt", "Of stórir stuðpúðar í vistkerfinu"], c: 0,
      e: "Við hugsum línulega („meira eitur, færri lirfur“) en kerfið er <b>ólínulegt</b>: yfirráð lykkja færðust og afleiðingin varð þveröfug." },

    /* ---------- Kerfisgildrur ---------- */
    { topic: "kerfi", q: "Vinsæll foss er öllum opinn án gjalds. Hver ferðaþjónustuaðili hagnast á að fara þangað með sem flesta, en göngustígar og gróður láta á sjá. Hvaða kerfisgildra er þetta?",
      o: ["Harmleikur almenninganna (tragedy of the commons)", "Stigmögnun (escalation)", "Velgengni til hinna velgengnu", "Að snúa á reglurnar (rule beating)"], c: 0,
      e: "Sameiginleg auðlind, ávinningurinn rennur til hvers notanda en kostnaðurinn dreifist á alla: <b>harmleikur almenninganna</b>. Útgönguleiðir: fræðsla/siðareglur, skipting auðlindar eða reglusetning (t.d. aðgangsstýring)." },
    { topic: "kerfi", q: "Tvær matvöruverslanakeðjur lækka verð á víxl, alltaf aðeins meira en hin, þar til báðar tapa. Hvaða kerfisgildra er þetta?",
      o: ["Stigmögnun (escalation)", "Harmleikur almenninganna", "Hnignun markmiða", "Að velta byrðinni"], c: 0,
      e: "<b>Stigmögnun</b>: staða hvors aðila ræðst af því að vera á undan hinum, svo tvær styrkjandi lykkjur ýta hvor annarri. Útgönguleið: neita að taka þátt eða semja um nýtt kerfi." },
    { topic: "kerfi", q: "Stærsta verslanakeðjan fær bestu innkaupakjörin, getur því boðið lægsta verðið og eykur markaðshlutdeild sína enn frekar. Hvaða kerfisgildra er þetta?",
      o: ["Velgengni til hinna velgengnu (success to the successful)", "Stigmögnun (escalation)", "Andstaða við stefnu (policy resistance)", "Að elta rangt markmið"], c: 0,
      e: "Sigurvegarinn fær umbun sem auðveldar honum að sigra aftur: <b>velgengni til hinna velgengnu</b>. Útgönguleiðir: samkeppnislög, fjölbreytni, jafna leikvöllinn." },
    { topic: "kerfi", q: "Fyrirtæki ræður alltaf utanaðkomandi ráðgjafa þegar vandi kemur upp. Með tímanum hverfur þekkingin innanhúss og það verður háðara ráðgjöfunum. Hvaða kerfisgildra er þetta?",
      o: ["Að velta byrðinni (shifting the burden)", "Velgengni til hinna velgengnu", "Harmleikur almenninganna", "Hnignun markmiða"], c: 0,
      e: "Inngrip leysir einkennin en veikir getu kerfisins sjálfs, sem verður háð inngripinu: <b>að velta byrðinni</b> (fíkn). Útgönguleið: styrkja eigin getu kerfisins." },
    { topic: "kerfi", q: "Í kvótakerfinu henda sumir sjómenn verðminni fiski fyrir borð svo aflaheimildirnar nýtist í verðmætari fisk. Hvaða kerfisgildra er þetta?",
      o: ["Að snúa á reglurnar (rule beating)", "Að velta byrðinni", "Stigmögnun", "Hnignun markmiða"], c: 0,
      e: "Brottkast fylgir bókstaf reglunnar (aflinn sem landað er rúmast innan kvóta) en vinnur gegn tilgangi hennar (vernda stofninn): <b>að snúa á reglurnar</b>." },
    { topic: "kerfi", q: "Árangur ferðaþjónustunnar er eingöngu mældur í fjölda ferðamanna, þótt tekjur á hvern ferðamann og álag á náttúru skipti meira máli. Hvaða kerfisgildra er þetta?",
      o: ["Að elta rangt markmið (seeking the wrong goal)", "Harmleikur almenninganna", "Andstaða við stefnu", "Stigmögnun"], c: 0,
      e: "Kerfið hámarkar mælikvarðann en ekki raunverulega velferð: <b>rangt markmið</b>. „Ekki rugla saman viðleitni og árangri, annars hannarðu kerfi sem framleiðir viðleitni.“" },
    { topic: "kerfi", q: "Biðlistar í heilbrigðiskerfinu lengjast smám saman og stjórnendur segja „staðan er ekki verri en í fyrra“. Hvaða kerfisgildra er þetta?",
      o: ["Hnignun markmiða (drift to low performance)", "Að snúa á reglurnar", "Velgengni til hinna velgengnu", "Stigmögnun"], c: 0,
      e: "Markmiðið ræðst af fyrri frammistöðu, svo það lækkar smám saman: <b>hnignun markmiða</b>. Útgönguleið: föst markmið eða miða við bestu frammistöðu." },
    { topic: "kerfi", q: "Sett er þak á leiguverð. Leigusalar bregðast við með því að færa íbúðir í skammtímaleigu, og framboð á langtímaleigu minnkar. Hvaða kerfisgildra lýsir þessu best?",
      o: ["Andstaða við stefnu (policy resistance)", "Harmleikur almenninganna", "Velgengni til hinna velgengnu", "Hnignun markmiða"], c: 0,
      e: "Aðilar með ólík markmið toga sömu birgð (leiguíbúðir) í mismunandi áttir; þegar einn togar fastar togar hinn á móti: <b>andstaða við stefnu</b>. Útgönguleið: finna sameiginlegt markmið." },

    /* ---------- Vogaraflspunktar ---------- */
    { topic: "kerfi", q: "Hvert eftirfarandi er <b>áhrifamesti</b> vogaraflspunkturinn samkvæmt Meadows?",
      o: ["Markmið kerfisins", "Upplýsingaflæði", "Stærð stuðpúða", "Lengd seinkana"], c: 0,
      e: "Röðin (12 minnst → 1 mest): tölur, stuðpúðar, uppbygging, seinkanir, B-lykkjur, R-lykkjur, upplýsingar, reglur, sjálfsskipulag, <b>markmið (3)</b>, hugmyndafræði, að hefja sig yfir hugmyndafræði." },
    { topic: "kerfi", q: "Hvaða vogaraflspunktur er <b>neðst</b> á lista Meadows (minnst áhrif)?",
      o: ["Tölur: fastar og stikar", "Seinkanir", "Reglur kerfisins", "Upplýsingaflæði"], c: 0,
      e: "<b>Tölur og stikar</b> (12) eru auðveldastar að breyta og fá 90-99 % athyglinnar, en breyta sjaldan hegðuninni („að raða þilfarsstólum á Titanic“)." },
    { topic: "kerfi", q: "Rafmagnsmælir er færður úr kjallaranum fram í forstofu og notkun minnkar um þriðjung. Hvaða vogaraflspunktur er þetta?",
      o: ["Upplýsingaflæði", "Reglur", "Stuðpúðar", "Tölur og stikar"], c: 0,
      e: "Ekkert annað breyttist en hverjir sjá hvaða upplýsingar: <b>upplýsingaflæði</b> (6). Ódýrt og fljótlegt inngrip með mikil áhrif." },
    { topic: "kerfi", q: "Hvaða röð vogaraflspunkta er rétt, frá <b>minnstu</b> til <b>mestu</b> vogarafls?",
      o: ["Stikar → seinkanir → upplýsingaflæði → markmið", "Markmið → upplýsingaflæði → seinkanir → stikar", "Seinkanir → stikar → markmið → upplýsingaflæði", "Upplýsingaflæði → stikar → seinkanir → markmið"], c: 0,
      e: "Stikar (12), seinkanir (9), upplýsingaflæði (6), markmið (3). Því hærra sem vogaraflið er, því meira veitir kerfið mótspyrnu." },
    { topic: "kerfi", q: "Leyfilegur heildarafli þorsks er lækkaður um 3 % á milli ára. Hvar er þetta inngrip á lista Meadows?",
      o: ["Tölur og stikar (12): lítið vogarafl", "Reglur (5): mikið vogarafl", "Markmið (3): mjög mikið vogarafl", "Sjálfsskipulag (4): mjög mikið vogarafl"], c: 0,
      e: "Að breyta stærð kvótans er að breyta <b>stika</b>. Að breyta aflareglunni sjálfri (hvernig kvótinn er ákveðinn) væri regla (5) og að breyta tilgangi kerfisins væri markmið (3)." },
    { topic: "kerfi", q: "Hvað segir Meadows um <b>jafnvægislykkjur</b> sem vogaraflspunkt (nr. 8)?",
      o: ["Ekki fjarlægja þær þótt þær virðist óþarfar; styrkur þeirra eykur seiglu", "Þær á að fjarlægja til að auka afköst kerfisins", "Þær eru alltaf áhrifameiri en markmið kerfisins", "Þær skipta engu máli ef styrkjandi lykkjur eru til staðar"], c: 0,
      e: "Öryggiskerfi í kjarnorkuveri eða vernd uppljóstrara virðast óþörf þar til á reynir. Að styrkja <b>jafnvægislykkjur</b> eykur seiglu kerfisins." }
  );

  /* ---------- Reiknidæmi ---------- */

  // Samhengi fyrir birgðir með föstum flæðum
  var STOCKS = [
    { name: "baðkar", s: "Í baðkari eru", u: "L", fu: "L/mín", tu: "mín", tud: "mínútum", inn: "kraninn gefur", ut: "niðurfallið tekur" },
    { name: "lager", s: "Á lager byggingavöruverslunar eru", u: "sementspokar", fu: "pokar/dag", tu: "dagar", tud: "dögum", inn: "birgirinn afhendir", ut: "verslunin selur" },
    { name: "lón", s: "Í miðlunarlóni eru", u: "GL", fu: "GL/viku", tu: "vikur", tud: "vikum", inn: "innrennslið er", ut: "virkjunin notar" },
  ];

  B.G.push(function birgdEftirTima() {
    var c = pick(STOCKS);
    var qin = rnd(4, 20), qout = rnd(4, 20);
    if (qin === qout) qin += 2;
    var t = rnd(5, 20);
    var S0 = qout > qin ? (qout - qin) * t + rnd(10, 80) : rnd(10, 120);
    var S = S0 + (qin - qout) * t;
    return {
      topic: "kerfi", title: "Birgð eftir tíma (baðkarið)",
      text: c.s + " $" + S0 + "$ " + c.u + ". Innflæði: " + c.inn + " $" + qin + "$ " + c.fu + ". Útflæði: " + c.ut + " $" + qout + "$ " + c.fu +
        ". Hver er birgðin eftir $" + t + "$ " + c.tu + " ef flæðin haldast föst?",
      answer: S, unit: c.u, tol: 0.01, absTol: 0.5,
      sol: "<p>Nettóflæði $= " + qin + " - " + qout + " = " + (qin - qout) + "$ " + c.fu + ".</p>" +
        "<p>$S(t) = S_0 + (q_{inn} - q_{út})\\,t = " + S0 + " + (" + (qin - qout) + ")\\cdot " + t + " = " + S + "$ " + c.u + ".</p>" +
        "<p>" + (qin > qout ? "Innflæðið er meira en útflæðið svo birgðin hækkar." : "Útflæðið er meira en innflæðið svo birgðin lækkar.") + "</p>",
    };
  });

  B.G.push(function timiTilTomtFullt() {
    var c = pick(STOCKS);
    var fill = Math.random() < 0.5, qin, qout, S0, C, t, text, sol;
    if (fill) {
      qout = rnd(2, 10); qin = qout + rnd(2, 12);
      C = rnd(10, 40) * 10; S0 = rnd(0, Math.floor(C / 20)) * 10;
      t = (C - S0) / (qin - qout);
      text = c.s + " $" + S0 + "$ " + c.u + " og hámarksrýmið er $" + C + "$ " + c.u + ". Innflæði: " + c.inn + " $" + qin + "$ " + c.fu + "; útflæði: " + c.ut + " $" + qout + "$ " + c.fu + ". Hve langur tími (í " + c.tud + ") líður þar til fullt er?";
      sol = "<p>Nettóinnflæði $= " + qin + " - " + qout + " = " + (qin - qout) + "$ " + c.fu + ". Það vantar $" + C + " - " + S0 + " = " + (C - S0) + "$ " + c.u + ".</p>" +
        "<p>$t = \\dfrac{C - S_0}{q_{inn} - q_{út}} = \\dfrac{" + (C - S0) + "}{" + (qin - qout) + "} = " + tx(t, 4) + "$ " + c.tu + ".</p>";
    } else {
      qin = rnd(0, 10); qout = qin + rnd(2, 15);
      S0 = rnd(5, 60) * 10;
      t = S0 / (qout - qin);
      text = c.s + " $" + S0 + "$ " + c.u + ". Innflæði: " + c.inn + " $" + qin + "$ " + c.fu + "; útflæði: " + c.ut + " $" + qout + "$ " + c.fu + ". Hve langur tími (í " + c.tud + ") líður þar til birgðin tæmist ef flæðin haldast föst?";
      sol = "<p>Nettóútflæði $= " + qout + " - " + qin + " = " + (qout - qin) + "$ " + c.fu + ".</p>" +
        "<p>$t = \\dfrac{S_0}{q_{út} - q_{inn}} = \\dfrac{" + S0 + "}{" + (qout - qin) + "} = " + tx(t, 4) + "$ " + c.tu + ".</p><p>Birgðin kaupir tíma: svona langan frest hefur kerfið til að bregðast við.</p>";
    }
    return { topic: "kerfi", title: fill ? "Hvenær fyllist birgðin?" : "Hvenær tæmist birgðin?", text: text, answer: t, unit: c.tu, tol: 0.02, sol: sol };
  });

  B.G.push(function tvofoldunartimi() {
    var kind = rnd(0, 2), r, T, m, ans, text, sol;
    var ctx = pick([
      { sent: "Ferðamönnum fjölgar", nom: "Fjöldi ferðamanna", acc: "fjölda ferðamanna" },
      { sent: "Innistæða á vaxtareikningi vex", nom: "Innistæðan", acc: "innistæðuna" },
      { sent: "Íbúðaverð hækkar", nom: "Íbúðaverðið", acc: "íbúðaverðið" },
      { sent: "Peningamagn í umferð eykst", nom: "Peningamagnið", acc: "peningamagnið" },
    ]);
    if (kind === 0) {
      r = pick([2, 3, 4, 5, 6, 7, 8, 10, 12, 14]);
      ans = 70 / r;
      text = ctx.sent + " um $" + r + "\\,\\%$ á ári (styrkjandi lykkja). Notaðu <b>reglu 70</b> til að finna tvöföldunartímann í árum.";
      sol = "<p>$T_2 \\approx \\dfrac{70}{r} = \\dfrac{70}{" + r + "} = " + tx(ans, 3) + "$ ár.</p><p>Nákvæmt gildi er $\\ln 2/\\ln(1+r) = " + tx(Math.log(2) / Math.log(1 + r / 100), 3) + "$ ár; regla 70 er góð nálgun fyrir litla $r$.</p>";
      return { topic: "kerfi", title: "Tvöföldunartími (regla 70)", text: text, answer: ans, unit: "ár", tol: 0.03, sol: sol };
    }
    if (kind === 1) {
      T = pick([5, 7, 10, 14, 20, 35]);
      ans = 70 / T;
      text = ctx.nom + " tvöfaldast á $" + T + "$ árum. Hver er árlegur vöxtur í prósentum samkvæmt reglu 70?";
      sol = "<p>$r \\approx \\dfrac{70}{T_2} = \\dfrac{70}{" + T + "} = " + tx(ans, 3) + "\\,\\%$ á ári.</p>";
      return { topic: "kerfi", title: "Vaxtarhraði út frá tvöföldunartíma", text: text, answer: ans, unit: "%", tol: 0.03, sol: sol };
    }
    r = pick([2, 5, 7, 10, 14]); m = rnd(2, 4);
    ans = m * 70 / r;
    var f = Math.pow(2, m);
    text = ctx.sent + " um $" + r + "\\,\\%$ á ári. Um það bil hve mörg ár tekur að $" + f + "$-falda " + ctx.acc + "? Notaðu reglu 70.";
    sol = "<p>$" + f + " = 2^{" + m + "}$, svo það þarf $" + m + "$ tvöfaldanir. Hver tekur $70/" + r + " = " + tx(70 / r, 3) + "$ ár.</p><p>$t \\approx " + m + "\\cdot " + tx(70 / r, 3) + " = " + tx(ans, 3) + "$ ár.</p>";
    return { topic: "kerfi", title: "Margföldun með veldisvexti", text: text, answer: ans, unit: "ár", tol: 0.03, sol: sol };
  });

  B.G.push(function jafnvaegisgildi() {
    var kind = rnd(0, 2), I, d, D, ans, text, sol, unit;
    if (kind === 0) {
      I = rnd(3, 12) * 1000; D = rnd(3, 10);
      ans = I * D; unit = "ferðamenn";
      text = "Til landsins koma að meðaltali $" + I + "$ ferðamenn á dag og hver dvelur að meðaltali í $" + D + "$ daga. Brottfarir á dag eru því (fjöldi á landinu)/" + D + ". Hve margir ferðamenn eru á landinu á hverjum tíma þegar kerfið er í jafnvægi?";
      sol = "<p>Í jafnvægi er innflæði = útflæði: $" + I + " = S^*/" + D + "$.</p><p>$S^* = I\\cdot D = " + I + "\\cdot " + D + " = " + ans + "$ ferðamenn. (Sama og lögmál Little: $L = \\lambda W$.)</p>";
    } else if (kind === 1) {
      I = rnd(15, 45) * 100; d = pick([0.5, 1, 1.5, 2, 2.5]);
      ans = I / (d / 100); unit = "íbúðir";
      text = "Á hverju ári bætast við $" + I + "$ nýjar íbúðir og $" + tx(d) + "\\,\\%$ af íbúðastofninum hverfa úr notkun (úrelding, niðurrif). Við hvaða stærð íbúðastofnsins er jafnvægi?";
      sol = "<p>Útflæðið er $d\\cdot S$ með $d = " + tx(d / 100, 3) + "$. Í jafnvægi: $I = d\\,S^*$.</p><p>$S^* = \\dfrac{I}{d} = \\dfrac{" + I + "}{" + tx(d / 100, 3) + "} = " + ans + "$ íbúðir.</p><p>Þetta er jafnvægislykkja: ef stofninn er stærri en $S^*$ er úreldingin meiri en nýbyggingarnar og hann minnkar, og öfugt.</p>";
    } else {
      I = rnd(20, 90) * 1000; d = pick([10, 15, 20, 25, 30, 40]);
      ans = I / (d / 100); unit = "tonn";
      text = "Nýliðun í fiskistofni er um $" + I + "$ tonn á ári og samanlagt hverfa $" + d + "\\,\\%$ af stofninum á ári (afli og náttúruleg afföll). Hver er jafnvægisstærð stofnsins í tonnum?";
      sol = "<p>Í jafnvægi er nýliðun = afföll: $" + I + " = " + tx(d / 100, 2) + "\\,S^*$.</p><p>$S^* = \\dfrac{" + I + "}{" + tx(d / 100, 2) + "} = " + ans + "$ tonn.</p><p>Ef veiðihlutfallið er hækkað minnkar jafnvægisstofninn.</p>";
    }
    return { topic: "kerfi", title: "Jafnvægisgildi jafnvægislykkju", text: text, answer: ans, unit: unit, tol: 0.01, sol: sol };
  });

  B.G.push(function markmidsleit() {
    var c = pick([
      { s: "Lager verslunar", u: "einingar", per: "viku", pers: "vikur", how: "pantar verslunarstjórinn á hverri viku" },
      { s: "Starfsmannafjöldi í þjónustuveri", u: "starfsmenn", per: "mánuð", pers: "mánuði", how: "ræður mannauðsstjórinn á hverjum mánuði" },
      { s: "Fjöldi leiguíbúða í eigu félags", u: "íbúðir", per: "ár", pers: "ár", how: "kaupir félagið á hverju ári" },
    ]);
    var M = rnd(20, 60) * 10, S0 = rnd(2, 15) * 10, k = pick([0.2, 0.25, 0.3, 0.4, 0.5]), n = rnd(2, 5);
    var ans = M - (M - S0) * Math.pow(1 - k, n);
    return {
      topic: "kerfi", title: "Markmiðsleit jafnvægislykkju",
      text: c.s + " er $" + S0 + "$ " + c.u + " en markmiðið er $" + M + "$. Til að loka bilinu " + c.how + " sem nemur $" + Math.round(k * 100) + "\\,\\%$ af bilinu milli markmiðs og stöðu. Hver er staðan eftir $" + n + "$ " + c.pers + "?",
      answer: ans, unit: c.u, tol: 0.01, absTol: 0.5,
      sol: "<p>Bilið í upphafi er $" + M + " - " + S0 + " = " + (M - S0) + "$. Á hverju tímabili minnkar það um $" + Math.round(k * 100) + "\\,\\%$, þ.e. margfaldast með $" + tx(1 - k, 2) + "$.</p>" +
        "<p>$\\text{bil}_{" + n + "} = " + (M - S0) + "\\cdot " + tx(1 - k, 2) + "^{" + n + "} = " + tx((M - S0) * Math.pow(1 - k, n), 4) + "$.</p>" +
        "<p>$S_{" + n + "} = " + M + " - " + tx((M - S0) * Math.pow(1 - k, n), 4) + " = " + tx(ans, 4) + "$ " + c.u + ".</p><p>Jafnvægislykkja nálgast markmiðið hratt í fyrstu en hægar eftir því sem bilið minnkar.</p>",
    };
  });

  // Raunveruleg lykkjudæmi: [breyta, lýsing tengsla til næstu breytu, formerki]
  var LOOPS = [
    { nodes: ["Húsnæðisverð", "Arðsemi nýbygginga", "Framboð íbúða"], s: [1, 1, -1],
      d: ["þegar húsnæðisverð hækkar verða nýbyggingar arðbærari", "meiri arðsemi leiðir (með seinkun) til meira framboðs íbúða", "meira framboð íbúða lækkar húsnæðisverð"] },
    { nodes: ["Húsnæðisverð", "Væntingar um verðhækkun", "Eftirspurn eftir íbúðum"], s: [1, 1, 1],
      d: ["hækkandi verð eykur væntingar um frekari hækkun", "meiri væntingar auka eftirspurn eftir íbúðum", "meiri eftirspurn hækkar húsnæðisverð"] },
    { nodes: ["Ferðamenn", "Álag á náttúruperlur", "Ánægja ferðamanna"], s: [1, -1, 1],
      d: ["fleiri ferðamenn auka álag á náttúruperlur", "meira álag dregur úr ánægju ferðamanna", "meiri ánægja ferðamanna fjölgar ferðamönnum (umtal, endurkomur)"] },
    { nodes: ["Fiskistofn", "Kostnaður á veitt tonn", "Sókn"], s: [-1, -1, -1],
      d: ["stærri fiskistofn lækkar kostnað á hvert veitt tonn", "hærri kostnaður á tonn dregur úr sókn", "meiri sókn minnkar fiskistofninn"] },
    { nodes: ["Atvinnuleysi", "Tekjur heimila", "Neysla", "Sala fyrirtækja"], s: [-1, 1, 1, -1],
      d: ["meira atvinnuleysi lækkar tekjur heimila", "hærri tekjur auka neyslu", "meiri neysla eykur sölu fyrirtækja", "meiri sala fyrirtækja dregur úr atvinnuleysi"] },
    { nodes: ["Verðbólga", "Stýrivextir", "Útlán", "Eftirspurn"], s: [1, -1, 1, 1],
      d: ["meiri verðbólga leiðir til hærri stýrivaxta", "hærri stýrivextir draga úr útlánum", "meiri útlán auka eftirspurn", "meiri eftirspurn eykur verðbólgu"] },
    { nodes: ["Biðröð við kassa", "Ánægja viðskiptavina", "Fjöldi viðskiptavina"], s: [-1, 1, 1],
      d: ["lengri biðröð dregur úr ánægju viðskiptavina", "meiri ánægja fjölgar viðskiptavinum", "fleiri viðskiptavinir lengja biðröðina"] },
    { nodes: ["Markaðshlutdeild", "Innkaupamáttur", "Útsöluverð"], s: [1, -1, -1],
      d: ["meiri markaðshlutdeild eykur innkaupamátt gagnvart birgjum", "meiri innkaupamáttur lækkar útsöluverð", "hærra útsöluverð minnkar markaðshlutdeild"] },
  ];

  B.G.push(function lykkjuPolun() {
    var real = Math.random() < 0.6, nodes, s, d, n, neg, askCount = Math.random() < 0.5, text, chain;
    if (real) {
      var L = pick(LOOPS); nodes = L.nodes; s = L.s; d = L.d; n = nodes.length;
      chain = "<ul>" + d.map(function (x) { return "<li>" + x.charAt(0).toUpperCase() + x.slice(1) + ".</li>"; }).join("") + "</ul>";
      text = "Lykkjan " + nodes.join(" → ") + " → " + nodes[0] + " er lýst svona:" + chain;
    } else {
      n = rnd(3, 6); nodes = "ABCDEF".slice(0, n).split(""); s = [];
      for (var i = 0; i < n; i++) s.push(Math.random() < 0.45 ? -1 : 1);
      var str = "";
      for (var j = 0; j < n; j++) str += nodes[j] + " \\xrightarrow{" + (s[j] > 0 ? "+" : "-") + "} ";
      text = "Lykkja í orsakariti: $" + str + nodes[0] + "$.";
    }
    neg = s.filter(function (x) { return x < 0; }).length;
    var sign = neg % 2 === 0 ? 1 : -1;
    var typ = sign > 0 ? "styrkjandi lykkja (R)" : "jafnvægislykkja (B)";
    var list = s.map(function (x, i) { return nodes[i] + " → " + nodes[(i + 1) % n] + ": " + (x > 0 ? "+" : "−"); }).join("; ");
    var sol = "<p>Pólun hvers tengsls: " + list + ".</p><p>Fjöldi neikvæðra tengsla: $" + neg + "$, sem er " + (neg % 2 === 0 ? "slétt tala" : "oddatala") + ". Pólun lykkjunnar er margfeldi formerkjanna, $" + (sign > 0 ? "+1" : "-1") + "$, svo þetta er <b>" + typ + "</b>.</p>";
    if (askCount) {
      return { topic: "kerfi", title: "Neikvæð tengsl í lykkju", text: text + " Hve mörg tengsl í lykkjunni eru <b>neikvæð</b>?", answer: neg, unit: "tengsl", tol: 0.01, absTol: 0.1, sol: sol };
    }
    return { topic: "kerfi", title: "Pólun lykkju", text: text + " Sláðu inn $+1$ ef lykkjan er styrkjandi (R) og $-1$ ef hún er jafnvægislykkja (B).", answer: sign, unit: "", tol: 0.01, absTol: 0.1, sol: sol };
  });
})();

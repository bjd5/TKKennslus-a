/* w/kafli-7.js – gagnvirka skrefið í kafla 7: endurhönnunarráðgjafinn.
 * Borð 1: veldu heuristic fyrir vandamál og spáðu fyrir um áhrif á djöflafjórþáttunina.
 * Borð 2: flokkaðu verk í to-be ferli eftir BPMN-verktegundum (keyranlegt líkan).
 * Borð 3: atburðarásir úr keyrslu BPMS (einingar, úthlutunarmynstur, skrefin fimm).
 * api.done() er kallað þegar öll þrjú borðin eru leyst. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  function register(id, fn) { if (typeof TK.widget === "function") TK.widget(id, fn); else (TK._widgetQueue = TK._widgetQueue || []).push([id, fn]); }

  /* ---------- Hjálparföll ---------- */
  var shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var math = function (el) { if (typeof window.renderMath === "function") window.renderMath(el); };
  var el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var btn = function (cls, html, fn) { var b = el("button", cls, html); b.type = "button"; if (fn) b.addEventListener("click", fn); return b; };

  var CSS = [
    ".w7-tabs{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 1rem}",
    ".w7-tab{font:600 .9rem var(--sans);padding:.45rem .8rem;border:1px solid var(--rule-2);border-radius:99px;background:var(--raised);color:var(--ink);cursor:pointer}",
    ".w7-tab[aria-selected=true]{background:var(--key-bg);border-color:var(--mag);color:var(--mag)}",
    ".w7-tab:disabled{opacity:.5;cursor:not-allowed}",
    ".w7-tab .w7-ok{color:var(--good);margin-left:.3rem}",
    ".w7-head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.4rem;align-items:baseline;font:600 .9rem var(--sans);color:var(--muted);margin-bottom:.5rem}",
    ".w7-case{border:1px solid var(--rule);border-left:4px solid var(--mag);border-radius:8px;background:var(--raised);padding:.8rem 1rem;margin:.2rem 0 .9rem}",
    ".w7-dom{display:inline-block;font:600 .78rem var(--sans);text-transform:uppercase;letter-spacing:.04em;color:var(--mag);margin-bottom:.25rem}",
    ".w7-q{font:700 1rem var(--sans);margin:.9rem 0 .45rem}",
    ".w7-opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:.45rem}",
    ".w7-opts .opt small{display:block;color:var(--muted);font:400 .85rem var(--sans);margin-top:.15rem}",
    ".w7-pred{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,12rem);gap:1rem;align-items:center}",
    "@media (max-width:560px){.w7-pred{grid-template-columns:1fr}.w7-dia{max-width:12rem;margin:0 auto}}",
    ".w7-axis{display:grid;grid-template-columns:7.5rem 1fr;gap:.4rem;align-items:center;margin:.3rem 0}",
    "@media (max-width:420px){.w7-axis{grid-template-columns:1fr}}",
    ".w7-axis b{font:600 .95rem var(--sans)}",
    ".w7-axis .chips{margin:0}",
    ".w7-axis .chip{min-width:5.2rem}",
    ".w7-axis.ok b{color:var(--good)}.w7-axis.no b{color:var(--bad)}",
    ".w7-axis .w7-exp{font:500 .82rem var(--sans);color:var(--muted);grid-column:2}",
    "@media (max-width:420px){.w7-axis .w7-exp{grid-column:1}}",
    ".w7-dia svg{width:100%;height:auto;display:block}",
    ".w7-fb{margin-top:.8rem;padding:.7rem .9rem;border-radius:8px;background:var(--paper-2);border:1px solid var(--rule)}",
    ".w7-fb p{margin:.3rem 0}",
    ".w7-btns{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.9rem}",
    ".w7-pal{display:flex;flex-wrap:wrap;gap:.4rem;margin:.4rem 0 .9rem;position:sticky;top:0;z-index:2;background:var(--raised);padding:.4rem 0}",
    ".w7-type{display:inline-flex;align-items:center;gap:.35rem;font:600 .85rem var(--sans);padding:.35rem .6rem;border:1px solid var(--rule-2);border-radius:8px;background:var(--raised);color:var(--ink);cursor:pointer}",
    ".w7-type svg{width:22px;height:18px;flex:none}",
    ".w7-type[aria-pressed=true]{background:var(--key-bg);border-color:var(--mag);color:var(--mag);box-shadow:0 0 0 2px color-mix(in srgb,var(--mag) 30%,transparent)}",
    ".w7-tasks{display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:.55rem}",
    ".w7-task{display:flex;flex-direction:column;align-items:flex-start;gap:.35rem;text-align:left;font:400 .97rem/1.4 var(--serif);padding:.65rem .8rem;border:1.5px dashed var(--rule-2);border-radius:12px;background:var(--raised);color:var(--ink);cursor:pointer;min-height:4.4rem}",
    ".w7-task:hover:not(:disabled){border-color:var(--mag)}",
    ".w7-task.set{border-style:solid;border-color:var(--ink)}",
    ".w7-task.right{border-style:solid;border-color:var(--good);background:color-mix(in srgb,var(--good) 10%,var(--raised))}",
    ".w7-task.wrong{border-style:solid;border-color:var(--bad);background:color-mix(in srgb,var(--bad) 8%,var(--raised))}",
    ".w7-task:disabled{cursor:default}",
    ".w7-tag{display:inline-flex;align-items:center;gap:.3rem;font:600 .8rem var(--sans);color:var(--mag)}",
    ".w7-tag svg{width:20px;height:16px}",
    ".w7-tag.none{color:var(--muted);font-weight:500}",
    ".w7-why{font:400 .86rem/1.4 var(--sans);color:var(--muted)}",
    ".w7-pips{display:flex;gap:.3rem}",
    ".w7-pips i{width:.8rem;height:.8rem;border-radius:50%;border:1.5px solid var(--rule-2);display:inline-block}",
    ".w7-pips i.on{background:var(--good);border-color:var(--good)}.w7-pips i.off{background:var(--bad);border-color:var(--bad)}"
  ].join("\n");

  /* ---------- Gögn: heuristics ---------- */
  var H = {
    elim: ["Activity elimination", "Fjarlægðu óþörf verk."],
    ctrlrel: ["Control relocation", "Færðu eftirlit til viðskiptavinarins."],
    contact: ["Contact reduction", "Fækkaðu samskiptum við viðskiptavini og þriðju aðila."],
    integ: ["Integration", "Samþættu ferlið við ferli viðskiptavinar eða birgja."],
    casetypes: ["Case types", "Greindu ólíkar tegundir mála í sundur í aðskilin ferli."],
    casebased: ["Case-based work", "Losaðu þig við runuvinnslu og reglubundin verk."],
    triage: ["Triage", "Skiptu verki í aðskildar útgáfur, t.d. einföld og flókin mál."],
    compose: ["Activity composition", "Sameinaðu lítil verk í stærri samsett verk."],
    reseq: ["Resequencing", "Færðu verk á þann stað sem hentar, t.d. þar til ljóst er að þess þarf."],
    parallel: ["Parallelism", "Settu óháð verk samhliða."],
    knockout: ["Knock-out", "Ódýr próf sem hafna mörgum fyrst, dýr próf síðast."],
    exception: ["Exception", "Hannaðu fyrir dæmigerð mál og einangraðu frávik."],
    caseassign: ["Case assignment", "Láttu sama starfsmann vinna sem flest skref málsins."],
    flexassign: ["Flexible assignment", "Haltu fjölhæfum starfsmönnum lausum eins lengi og hægt er."],
    central: ["Centralization", "Láttu dreifða starfsmenn vinna eins og þeir séu á einum stað."],
    split: ["Split responsibilities", "Forðastu sameiginlega ábyrgð ólíkra deilda á sama verki."],
    custteam: ["Customer teams", "Teymi úr ólíkum deildum annast heila tegund mála."],
    numinv: ["Numerical involvement", "Fækkaðu deildum og einstaklingum sem koma að ferlinu."],
    casemgr: ["Case manager", "Einn ábyrgðarmaður fyrir hverja tegund mála."],
    extra: ["Extra resources", "Fjölgaðu auðlindum ef afköst duga ekki."],
    special: ["Specialize", "Dýpkaðu færni starfsmanna."],
    empower: ["Empower", "Gefðu starfsmönnum ákvörðunarvald í stað millistjórnenda."],
    ctrladd: ["Control addition", "Athugaðu inntak og úttak með auknu eftirliti."],
    buffer: ["Buffering", "Geymdu ytri upplýsingar og gerstu áskrifandi að uppfærslum."],
    automate: ["Activity automation", "Sjálfvirknivæddu verk."],
    integtech: ["Integral technology", "Lyftu efnislegum skorðum með nýrri tækni."],
    trusted: ["Trusted party", "Notaðu niðurstöðu trausts þriðja aðila."],
    outsource: ["Outsourcing", "Útvistaðu ferlinu eða hluta þess."],
    interf: ["Interfacing", "Notaðu staðlað viðmót við samstarfsaðila."]
  };
  var AX = [["T", "Tími"], ["K", "Kostnaður"], ["G", "Gæði"], ["S", "Sveigjanleiki"]];

  /* fx: +1 batnar, -1 versnar, 0 óbreytt; ás sem vantar er ekki metinn (fer eftir útfærslu). */
  var SC = [
    { dom: "Tryggingafélag", txt: "Annar starfsmaður fer yfir öll afgreidd smátjón undir 50.000 kr. Yfirferðin tekur 15 mínútur á mál og finnur villu í 0,2 % tilfella.",
      h: "elim", d: ["ctrladd", "parallel", "casemgr"], fx: { T: 1, K: 1, G: -1 },
      why: "Yfirferðin skilar nær engu, svo hún er felld niður. Tími og kostnaður batna. Örfáar villur sem áður fundust sleppa nú í gegn, svo gæði geta versnað lítillega; sveigjanleiki breytist lítið." },
    { dom: "Útflutningur á ferskum fiski", txt: "Heilbrigðisvottorð, tollskýrsla og bókun flutnings eru unnin hvert á eftir öðru, þótt ekkert þeirra þurfi niðurstöðu hinna. Fiskurinn bíður á meðan og ferskleikinn minnkar.",
      h: "parallel", d: ["reseq", "compose", "casebased"], fx: { T: 1, K: -1 },
      why: "Óháð verk eru sett samhliða, og þá ræður lengsta greinin umferðartímanum í stað summunnar. Kostnaður getur aukist: meiri samhæfing, og ef sendingin fellur niður hefur vinna verið unnin til einskis." },
    { dom: "Nýskráning í banka", txt: "Fyrst er fjárhagsstaða nýs viðskiptavinar greind ítarlega (2 dagar sérfræðings). Svo er flett upp á þvingunarlista (5 mínútur), og sú athugun hafnar 8 % umsókna.",
      h: "knockout", d: ["triage", "exception", "empower"], fx: { T: 1, K: 1 },
      why: "Knock-out: ódýra prófið sem hafnar mörgum á að koma fyrst. Þá sparast dýra greiningin fyrir 8 % mála, svo bæði kostnaður og meðalumferðartími batna, án teljandi fórnarkostnaðar." },
    { dom: "Viðhaldsbeiðnir í fasteignaumsjón", txt: "Beiðnum um viðgerðir er safnað saman alla vikuna og þeim úthlutað til iðnaðarmanna á fundi á mánudagsmorgnum. Brýnar beiðnir bíða því allt að viku.",
      h: "casebased", d: ["elim", "central", "trusted"], fx: { T: 1, K: -1 },
      why: "Vikulegi fundurinn er runuvinnsla (batch). Case-based work afgreiðir hverja beiðni jafnóðum og styttir biðtímann mikið. Á móti tapast stærðarhagkvæmni: samhæfing og ferðir iðnaðarmanna verða óhagkvæmari, svo kostnaður getur aukist." },
    { dom: "Byggingavöruverslun", txt: "Allar innkaupabeiðnir, líka skrúfur fyrir 5.000 kr., þurfa samþykki deildarstjóra og svo fjármálastjóra. Beiðnir bíða dögum saman eftir undirskriftum.",
      h: "empower", d: ["outsource", "ctrladd", "special"], fx: { T: 1, G: -1 },
      why: "Empower: innkaupafulltrúinn fær heimild til að samþykkja sjálfur upp að ákveðnu marki. Tíminn styttist mikið. Minna eftirlit stjórnenda getur þýtt verri ákvarðanir í einstaka tilvikum, svo gæði geta versnað." },
    { dom: "Heilbrigðisþjónusta", txt: "Einfaldar tilvísanir (t.d. hefðbundin augnskoðun) og flóknar tilvísanir fara í sömu biðröð og eru allar metnar af sömu sérfræðingunum. Einföldu málin bíða lengi að óþörfu.",
      h: "triage", d: ["compose", "caseassign", "numinv"], fx: { T: 1, G: 1 },
      why: "Triage skiptir matinu í tvær útgáfur: hraðbraut fyrir einföld mál og sérfræðimat fyrir flókin. Tíminn styttist og hvor hópur fær meðferð við hæfi (gæði). Sveigjanleiki getur minnkað því auðlindirnar skiptast í tvo hópa." },
    { dom: "Farangur flugfélags", txt: "Farþegi með týnda tösku hringir, fær eyðublað sent í pósti, sendir kvittanir með öðrum pósti og er svo hringt í hann til að fá bankaupplýsingar. Málið tekur fjórar snertingar.",
      h: "contact", d: ["interf", "extra", "casetypes"], fx: { T: 1, K: 1 },
      why: "Contact reduction: öllum upplýsingum er safnað í einni snertingu, t.d. á vefformi. Það styttir umferðartíma og sparar vinnu starfsmanna." },
    { dom: "Tryggingafélag", txt: "Starfsmaður afritar gögn hverrar tjónstilkynningar úr vefformi yfir í tjónakerfið og síðan í greiðslukerfið. Um 3 % færslna eru með innsláttarvillu.",
      h: "automate", d: ["ctrladd", "outsource", "casemgr"], fx: { T: 1, G: 1, S: -1 },
      why: "Activity automation (t.d. samþætting eða RPA) flytur gögnin sjálfvirkt. Tími styttist og innsláttarvillur hverfa (gæði). Sjálfvirka lausnin ræður aðeins við tilvik sem gert var ráð fyrir, svo sveigjanleiki minnkar; stofnkostnaður kemur á móti sparnaði." },
    { dom: "Nýskráning í banka", txt: "Fjórir ólíkir starfsmenn vinna hver sitt litla skref í sama málinu. Hver þeirra þarf að lesa allt málið frá grunni áður en hann getur unnið sitt skref.",
      h: "caseassign", d: ["parallel", "outsource", "buffer"], fx: { T: 1, G: 1, S: -1 },
      why: "Case assignment: sami starfsmaður vinnur eins mörg skref málsins og hægt er. Hann þekkir málið, svo uppsetningartími hverfur (tími) og færri villur verða við afhendingar (gæði). Sveigjanleiki minnkar því erfiðara er að færa vinnu milli fólks." },
    { dom: "Byggingavöruverslun, lager", txt: "Við vörumóttöku eru „skanna fylgiseðil“, „telja vörur“, „skrá í kerfi“ og „setja á hillu“ fjögur aðskilin verk sem ólíkir starfsmenn taka úr biðröð hver á eftir öðrum.",
      h: "compose", d: ["triage", "ctrlrel", "custteam"], fx: { T: 1, S: -1 },
      why: "Activity composition sameinar smáverkin í eitt samsett verk eins starfsmanns. Biðraðir og afhendingar milli verka hverfa, svo tíminn styttist. Sveigjanleiki minnkar því stærra verk er erfiðara að skipta milli fólks." },
    { dom: "Farangur flugfélags", txt: "Einn starfsmaður sér um afgreiðsluborð fyrir týndan farangur. Eftir hvert flug frá útlöndum myndast 40 manna röð og nýtingin er um 98 %.",
      h: "extra", d: ["elim", "casebased", "integ"], fx: { T: 1, K: -1 },
      why: "Nýting nálægt 100 % þýðir mjög langan biðtíma (sbr. biðraðafræði). Extra resources: fleiri starfsmenn á álagstímum stytta biðina mikið og auka sveigjanleika, en launakostnaður hækkar." },
    { dom: "Heilbrigðisþjónusta", txt: "Sjúklingar með háþrýsting mæta á heilsugæslu á tveggja vikna fresti bara til að láta mæla blóðþrýsting hjá hjúkrunarfræðingi.",
      h: "ctrlrel", d: ["elim", "outsource", "contact"], fx: { T: 1, K: 1, G: -1 },
      why: "Control relocation: sjúklingurinn mælir sjálfur heima og sendir gildin inn. Tími og kostnaður batna, en mælingar sjúklinga geta verið ónákvæmari, svo gæði geta versnað nema eftirlit sé tryggt á annan hátt." },
    { dom: "Útflutningur á ferskum fiski", txt: "Um 95 % sendinga eru staðlaðar, en allar sendingar fara í gegnum eftirlitsskref vegna sérvottorða sem aðeins eiga við sjaldgæfar lífrænar sendingar.",
      h: "exception", d: ["knockout", "elim", "integ"], fx: { T: 1, K: 1 },
      why: "Exception: ferlið er hannað fyrir dæmigerðu sendinguna og sérsendingar fara í sér undirferli. Eftirlitið hverfur ekki, það er bara aðskilið, svo staðlaðar sendingar verða fljótari og ódýrari." },
    { dom: "Tryggingafélag", txt: "Lögfræðingur skrifar drög að uppgjörsbréfi strax við móttöku hvers tjóns, en 30 % tjóna eru dregin til baka eða hafnað áður en ákvörðun er tekin.",
      h: "reseq", d: ["parallel", "compose", "custteam"], fx: { K: 1 },
      why: "Resequencing: bréfið er fært aftur fyrir ákvörðunina og aðeins skrifað þegar þess þarf. Það sparar vinnu lögfræðingsins í 30 % mála (kostnaður). Áhrif á tíma fara eftir því hvort bréfið var á krítísku leiðinni." },
    { dom: "Nýskráning í banka", txt: "Nýir viðskiptavinir þurfa að mæta í útibú með vegabréf, þar sem starfsmaður skoðar það og ljósritar áður en hægt er að stofna reikning.",
      h: "trusted", d: ["outsource", "ctrladd", "integtech"], fx: { T: 1, K: 1 },
      why: "Trusted party: bankinn notar auðkenningu útgefanda rafrænna skilríkja í stað eigin skoðunar. Tími og kostnaður batna. Þetta er ekki outsourcing, því enginn vinnur verkið fyrir bankann; hann treystir niðurstöðu annars." },
    { dom: "Viðhaldsbeiðnir í fasteignaumsjón", txt: "Fyrirtækið er með skrifstofur í Reykjavík, á Akureyri og á Egilsstöðum, hver með sína biðröð beiðna. Ein skrifstofan er yfirhlaðin meðan starfsfólk hinna bíður eftir verkum.",
      h: "central", d: ["split", "outsource", "exception"], fx: { T: 1 },
      why: "Centralization: sameiginleg biðröð í kerfinu lætur dreifðu skrifstofurnar vinna eins og eina. Sameiginleg biðröð styttir biðtíma (sbr. biðraðafræði). Staðbundin þekking getur tapast, svo önnur áhrif fara eftir útfærslu." },
    { dom: "Umsókn um námsstyrk", txt: "Í 12 % mála reynast ákvarðanir sem sendar eru umsækjendum rangar vegna rangra gagna í umsókn, og þarf að leiðrétta þær eftir á. Umsækjendur kvarta.",
      h: "ctrladd", d: ["elim", "ctrlrel", "parallel"], fx: { G: 1 },
      why: "Control addition: inntakið er athugað áður en unnið er úr því og úttakið áður en það fer út. Gæðin batna. Á móti kemur aukinn tími og vinna í hverju máli, sem að hluta vinnst upp með færri leiðréttingum." }
  ];

  /* ---------- Gögn: verktegundir ---------- */
  var TYPES = [
    ["user", "Notendaverk", "user"], ["manual", "Handvirkt", "manual"], ["service", "Þjónusta", "service"], ["script", "Skrifta", "script"],
    ["rule", "Viðskiptaregla", "business rule"], ["send", "Senda", "send"], ["receive", "Móttaka", "receive"]
  ];
  var TN = {}; TYPES.forEach(function (t) { TN[t[0]] = t; });
  function icon(k) {
    var s = '<svg viewBox="0 0 28 22" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round">';
    if (k === "user") s += '<circle cx="14" cy="7" r="4"/><path d="M6 20q0-8 8-8t8 8z"/>';
    else if (k === "manual") s += '<path d="M6 12V6a1.6 1.6 0 0 1 3.2 0v5M9.2 6V3.5a1.6 1.6 0 0 1 3.2 0V11M12.4 4.5a1.6 1.6 0 0 1 3.2 0V11M15.6 6a1.6 1.6 0 0 1 3.2 0v8q0 6-6 6h-2q-4 0-6-4l-2.5-4a1.5 1.5 0 0 1 2.6-1.5L6 13"/>';
    else if (k === "service") s += '<circle cx="11" cy="9" r="5"/><circle cx="11" cy="9" r="1.6"/><path d="M11 2v2M11 14v2M4 9h2M16 9h2"/><circle cx="19" cy="16" r="3.5"/>';
    else if (k === "script") s += '<path d="M7 3h13q-3 4 0 8t0 8H7q3-4 0-8t0-8zM10 8h7M10 12h7M10 16h6"/>';
    else if (k === "rule") s += '<rect x="5" y="4" width="18" height="14"/><path d="M5 9h18M11 9v9"/>';
    else if (k === "send") s += '<rect x="5" y="5" width="18" height="12" style="fill:currentColor"/><path d="M5 5l9 6 9-6" style="stroke:var(--raised)"/>';
    else if (k === "receive") s += '<rect x="5" y="5" width="18" height="12"/><path d="M5 5l9 6 9-6"/>';
    return s + "</svg>";
  }
  var PROC = [
    { name: "Tjónstilkynning hjá tryggingafélagi", tasks: [
      { t: "Bíða eftir myndum af tjóninu frá tjónþola", k: "receive", w: "Ferlið bíður eftir skilaboðum frá ytri aðila: móttökuverk." },
      { t: "Sækja tjónasögu viðskiptavinar úr tjónakerfinu (vefþjónusta)", k: "service", w: "Ytra kerfi er kallað og svar kemur til baka: þjónustuverk." },
      { t: "Meta hvort tjónið falli undir skilmála með ákvörðunartöflu í reglukerfi", k: "rule", w: "Reglukerfi utan BPMS metur reglurnar: viðskiptaregluverk." },
      { t: "Reikna bætur = tjón − sjálfsábyrgð (kóði í ferlavélinni)", k: "script", w: "Kóði sem keyrir innan BPMS: skriftuverk." },
      { t: "Matsmaður skoðar bílinn á staðnum (ekkert skráð í kerfið)", k: "manual", w: "Unnið án hugbúnaðar og BPMS veit ekki af því: handvirkt verk." },
      { t: "Tjónafulltrúi samþykkir eða hafnar bótum í verklista BPMS", k: "user", w: "Manneskja vinnur verkið með stuðningi BPMS: notendaverk." },
      { t: "Senda tjónþola tilkynningu um niðurstöðu", k: "send", w: "Einstefnuskilaboð til ytri aðila: sendiverk." }
    ] },
    { name: "Umsókn um námsstyrk", tasks: [
      { t: "Bíða eftir staðfestingu á skólavist frá háskólanum", k: "receive", w: "Beðið eftir skilaboðum utan frá: móttökuverk." },
      { t: "Sækja tekjuupplýsingar umsækjanda í vefþjónustu Skattsins", k: "service", w: "Kallað á ytra forrit sem skilar gögnum: þjónustuverk." },
      { t: "Ákvarða styrkflokk eftir úthlutunarreglum í reglukerfi", k: "rule", w: "Ákvörðunartafla í reglukerfi: viðskiptaregluverk." },
      { t: "Reikna styrkupphæð úr gögnum málsins (formúla í BPMS)", k: "script", w: "Einföld formúla sem BPMS keyrir sjálft: skriftuverk." },
      { t: "Ráðgjafi metur rökstuðning umsækjanda á skjá og skráir mat", k: "user", w: "Dómgreind manneskju með stuðningi BPMS: notendaverk." },
      { t: "Póstleggja undirritað frumrit samnings", k: "manual", w: "Gerist utan kerfisins, án hugbúnaðar: handvirkt verk." },
      { t: "Senda tilkynningu um úthlutun til greiðslukerfis", k: "send", w: "Skilaboð send út án þess að bíða eftir svari: sendiverk." }
    ] },
    { name: "Meðhöndlun farangurs hjá flugfélagi", tasks: [
      { t: "Starfsmaður ber töskuna út að flugvélinni", k: "manual", w: "Líkamlegt verk án hugbúnaðar: handvirkt verk." },
      { t: "Bera innritaðar töskur saman við farþega sem mættu, eftir reglum í reglukerfi", k: "rule", w: "Reglukerfi metur hvaða töskur á að fjarlægja: viðskiptaregluverk." },
      { t: "Bíða eftir tilkynningu flugvallar um að vélin sé lent", k: "receive", w: "Beðið eftir skilaboðum frá ytri aðila: móttökuverk." },
      { t: "Fletta upp tengiflugi farþega í bókunarkerfinu", k: "service", w: "Ytra kerfi er kallað og skilar svari: þjónustuverk." },
      { t: "Þjónustufulltrúi skráir lýsingu farþega á týndri tösku í kerfið", k: "user", w: "Manneskja vinnur í viðmóti BPMS: notendaverk." },
      { t: "Senda farþega SMS um að taskan sé fundin", k: "send", w: "Einstefnuskilaboð: sendiverk." },
      { t: "Reikna dagpeninga = dagar án tösku × taxti (kóði í BPMS)", k: "script", w: "Útreikningur innan BPMS: skriftuverk." }
    ] },
    { name: "Nýskráning viðskiptavinar í banka", tasks: [
      { t: "Sannreyna auðkenni með rafrænum skilríkjum (ytri auðkenningarþjónusta)", k: "service", w: "Ytri þjónusta er kölluð og skilar niðurstöðu: þjónustuverk." },
      { t: "Áhættuflokka viðskiptavin eftir reglum um peningaþvætti í reglukerfi", k: "rule", w: "Ákvörðunartafla í reglukerfi: viðskiptaregluverk." },
      { t: "Regluvörður fer yfir mál í hæsta áhættuflokki í verklista", k: "user", w: "Sérfræðimat manneskju með stuðningi BPMS: notendaverk." },
      { t: "Bíða eftir undirrituðum samningi frá viðskiptavini", k: "receive", w: "Beðið eftir skilaboðum: móttökuverk." },
      { t: "Búa til reikningsnúmer út frá útibúi og raðnúmeri (kóði í BPMS)", k: "script", w: "Kóði innan BPMS: skriftuverk." },
      { t: "Starfsmaður í útibúi afhendir debetkort (ekkert skráð)", k: "manual", w: "Unnið án hugbúnaðar: handvirkt verk." },
      { t: "Senda viðskiptavini velkomin-skilaboð", k: "send", w: "Einstefnuskilaboð: sendiverk." }
    ] },
    { name: "Viðhaldsbeiðni í fasteignaumsjón", tasks: [
      { t: "Iðnaðarmaður gerir við lekann á staðnum", k: "manual", w: "Líkamlegt verk án hugbúnaðar: handvirkt verk." },
      { t: "Verkstjóri velur iðnaðarmann fyrir beiðnina í verklista BPMS", k: "user", w: "Manneskja ákveður með stuðningi BPMS: notendaverk." },
      { t: "Forgangsflokka beiðni eftir reglutöflu (tegund × áhrif) í reglukerfi", k: "rule", w: "Reglutafla í reglukerfi: viðskiptaregluverk." },
      { t: "Senda birgja pöntun á varahlut", k: "send", w: "Skilaboð send út: sendiverk." },
      { t: "Bíða eftir afhendingarstaðfestingu frá birgja", k: "receive", w: "Beðið eftir skilaboðum: móttökuverk." },
      { t: "Uppfæra stöðu íbúðar í fasteignakerfinu (vefþjónusta sem svarar)", k: "service", w: "Ytra kerfi kallað og svarar: þjónustuverk." },
      { t: "Reikna heildarkostnað = vinna + efni (skrifta í BPMS)", k: "script", w: "Útreikningur innan BPMS: skriftuverk." }
    ] }
  ];

  /* ---------- Gögn: borð 3 ---------- */
  var L3 = [
    { q: "Gjaldkeri sér í „innhólfi“ BPMS þrjú mál sem bíða samþykkis og tekur eitt að sér. Hvaða eining BPMS er þetta?", o: ["Verklistastjóri (worklist handler)", "Keyrsluvél (execution engine)", "Líkanatól (process modeling tool)", "Ytri þjónusta (external service)"], e: "Verklistastjórinn líkist innhólfi: þar eru verk boðin og tekin að sér." },
    { q: "Ný umsókn berst og kerfið stofnar nýtt tilvik ferlisins og ákveður hvaða verk kemur næst. Hvaða eining sér um það?", o: ["Keyrsluvél (execution engine)", "Verklistastjóri (worklist handler)", "Stjórnunar- og eftirlitstól", "Líkanageymsla (repository)"], e: "Keyrsluvélin býr til tilvik (cases) og dreifir vinnu frá upphafi til enda." },
    { q: "Ferlaeigandi skoðar mælaborð: meðalumferðartími 9 dagar, 14 % mála yfir fresti. Hvaðan koma tölurnar?", o: ["Úr stjórnunar- og eftirlitstólum sem byggja á keyrsluskrám", "Úr líkanatólinu, sem reiknar þær úr líkaninu", "Úr verklistastjóranum, sem telur verk hvers og eins", "Úr ytri þjónustu sem metur lánshæfi"], e: "BPMS skráir keyrsluna í keyrsluskrár og eftirlitstólin taka saman yfir mörg mál." },
    { q: "Ferlavélin kallar á lánshæfismatskerfi utan BPMS og fær einkunn til baka. Hvað kallast það kerfi í arkitektúrnum?", o: ["Ytri þjónusta (external service)", "Verklistastjóri (worklist handler)", "Keyrsluskrá (execution log)", "Líkanatól (process modeling tool)"], e: "Ytri þjónustur vinna sjálfvirk verk og þurfa þjónustuviðmót sem keyrsluvélin talar við." },
    { q: "Ferlahönnuður bætir viðskiptareglu og gagnainntaki við verk og vistar nýja útgáfu líkansins. Hvaða eining er notuð?", o: ["Líkanatól (process modeling tool)", "Keyrsluvél (execution engine)", "Stjórnunar- og eftirlitstól", "Verklistastjóri (worklist handler)"], e: "Líkanatólið býr til og breytir líkönum, bætir við gögnum, reglum og mælikvörðum og vistar í geymslu." },
    { q: "Starfsmaður er í veikindaleyfi og stjórnandi færir verkin hans yfir á annan. Hvaða eining styður það?", o: ["Stjórnunar- og eftirlitstól (administration)", "Líkanatól (process modeling tool)", "Ytri þjónusta (external service)", "Líkanageymsla (repository)"], e: "Stjórnunartólin halda utan um hverjir eru tiltækir og hvernig brugðist er við frávikum." },
    { q: "Sá sem stofnar greiðslu má ekki vera sá sem samþykkir hana. Hvaða úthlutunarmynstur?", o: ["Separation of duties", "Retain familiar", "Case handling", "Shortest queue"], e: "Separation of duties: tvö verk verða að vera unnin af ólíkum aðilum." },
    { q: "Ráðgjafinn sem tók viðtalið á líka að skrifa niðurstöðuna. Hvaða úthlutunarmynstur?", o: ["Retain familiar", "Separation of duties", "Random allocation", "Organizational allocation"], e: "Retain familiar: tvö tiltekin verk skulu unnin af sama aðila." },
    { q: "Nýtt verk fer til þess sem hefur fæst verk í verklistanum. Hvaða mynstur?", o: ["Shortest queue", "Round-robin", "Allocation by offer", "History-based allocation"], e: "Shortest queue velur þann með stystu biðröðina." },
    { q: "Verkið birtist hjá öllum tjónafulltrúum; þegar einn tekur það hverfur það hjá hinum. Hvaða mynstur?", o: ["Allocation by offer", "Random allocation", "Direct allocation", "Round-robin"], e: "Allocation by offer: verkið er boðið mörgum og sá sem tekur það („checks out“) fær það." },
    { q: "Verkum er deilt í hring: sá sem lengst hefur verið án verks fær næsta. Hvaða mynstur?", o: ["Round-robin", "Shortest queue", "Capability-based allocation", "Deferred allocation"], e: "Round-robin deilir í hring, óháð lengd biðraðar." },
    { q: "Teymið fer yfir to-be líkanið og merkir hvaða verk BPMS getur stýrt og hver ekki. Hvaða skref af fimm er þetta?", o: ["Skref 1: mörk sjálfvirkni", "Skref 2: handvirk verk", "Skref 4: nákvæmnistig", "Skref 5: keyrslueiginleikar"], e: "Skref 1 byggir á því að ekki er hægt að sjálfvirknivæða öll ferli; verkin eru flokkuð í sjálfvirk, notenda- og handvirk." },
    { q: "Ákveðið er að matsmaður staðfesti skoðun í appi svo BPMS viti að verkinu sé lokið. Hvaða skref?", o: ["Skref 2: farið yfir handvirk verk", "Skref 1: mörk sjálfvirkni", "Skref 3: fullgera líkanið", "Skref 5: keyrslueiginleikar"], e: "Skref 2: ef BPMS sér ekki verkið, er það ekki til. Handvirka verkið er tengt BPMS sem notendaverk." },
    { q: "Bætt er við villuatburði ef greiðslukerfið svarar ekki, og gagnahlutum sem ákvarðanir í hliðum byggja á. Hvaða skref?", o: ["Skref 3: fullgera líkanið", "Skref 4: nákvæmnistig", "Skref 2: handvirk verk", "Skref 1: mörk sjálfvirkni"], e: "Skref 3: frávik eru reglan, og engin gögn þýða engar ákvarðanir og enga afhendingu verka." },
    { q: "Tvö samliggjandi verk sem sami starfsmaður vinnur eru sameinuð í eitt. Hvaða skref?", o: ["Skref 4: hæfilegt nákvæmnistig", "Skref 3: fullgera líkanið", "Skref 5: keyrslueiginleikar", "Skref 2: handvirk verk"], e: "Skref 4: task aggregation (samsöfnun) og task decomposition (sundurliðun)." },
    { q: "Skilgreind eru gagnatög breyta, slóð vefþjónustu og kóðabútur skriftuverks. Hvaða skref?", o: ["Skref 5: keyrslueiginleikar", "Skref 4: nákvæmnistig", "Skref 3: fullgera líkanið", "Skref 1: mörk sjálfvirkni"], e: "Skref 5: execution properties gera líkanið að fullu keyranlegt í völdu BPMS." },
    { q: "Starfsmaður afritar 200 sinnum á dag gögn úr gömlu kerfi án tenginga yfir í annað kerfi. Hvaða lausn er fljótlegust?", o: ["RPA-þjarkur sem hermir eftir aðgerðunum í viðmótinu", "Nýtt ERP-kerfi sem leysir bæði kerfin af hólmi", "CMMN-líkan af málavinnslunni", "Hópakerfi eins og Teams"], e: "RPA hentar síendurteknum, reglubundnum verkum í eldri kerfum og krefst engra breytinga á þeim." },
    { q: "Fyrirtæki notar Camunda, sem keyrir BPMN-líkön beint. Hvernig flokkast það í „síðasta spölnum“?", o: ["Hreint BPMN (pure BPMN)", "Aðlagað BPMN (adapted BPMN)", "Ekki BPMN (non-BPMN)", "Sértækt PAIS"], e: "Pure BPMN: Activiti og Camunda. Adapted: Bizagi og Bonita. Non-BPMN: YAWL." }
  ];

  /* ---------- Djöflafjórþáttunin sem SVG ---------- */
  function quad(pred, exp) {
    var cx = 100, cy = 100, R = { "1": 78, "0": 52, "-1": 28 };
    var pt = function (k, v) {
      var r = R[String(v)];
      return k === "T" ? [cx, cy - r] : k === "K" ? [cx + r, cy] : k === "G" ? [cx, cy + r] : [cx - r, cy];
    };
    var poly = function (m) { return AX.map(function (a) { return pt(a[0], m[a[0]] == null ? 0 : m[a[0]]).join(","); }).join(" "); };
    var base = { T: 0, K: 0, G: 0, S: 0 };
    var s = '<svg viewBox="0 0 200 215" role="img" aria-label="Djöflafjórþáttun: tími efst, kostnaður til hægri, gæði neðst, sveigjanleiki til vinstri">' +
      '<g style="stroke:var(--rule-2);stroke-width:1"><line x1="100" y1="12" x2="100" y2="188"/><line x1="12" y1="100" x2="188" y2="100"/></g>' +
      '<polygon points="' + poly(base) + '" style="fill:none;stroke:var(--muted);stroke-width:1.4;stroke-dasharray:4 4"/>';
    if (pred) s += '<polygon points="' + poly(pred) + '" style="fill:color-mix(in srgb,var(--mag) 16%,transparent);stroke:var(--mag);stroke-width:2"/>';
    if (exp) s += '<polygon points="' + poly(exp) + '" style="fill:none;stroke:var(--good);stroke-width:2.2;stroke-dasharray:7 4"/>';
    s += '<g style="font:600 11px var(--sans);fill:var(--ink)"><text x="100" y="9" text-anchor="middle">Tími</text><text x="198" y="96" text-anchor="end">Kostn.</text><text x="100" y="200" text-anchor="middle">Gæði</text><text x="2" y="96">Sveigj.</text></g>' +
      '<text x="100" y="213" text-anchor="middle" style="font:400 9.5px var(--sans);fill:var(--muted)">lengra út = betra</text></svg>';
    return s;
  }

  register("kafli-7", function (root, api) {
    var app = root.querySelector("#k7-app");
    if (!app) return;
    if (!document.getElementById("w7-css")) { var st = document.createElement("style"); st.id = "w7-css"; st.textContent = CSS; document.head.appendChild(st); }
    app.innerHTML = "";

    var state = { done: [false, false, false], cur: 0, procOk: 0 };
    var tabs = el("div", "w7-tabs"); tabs.setAttribute("role", "tablist"); tabs.setAttribute("aria-label", "Borð");
    var stage = el("div", "w7-stage"); stage.setAttribute("aria-live", "polite");
    app.appendChild(tabs); app.appendChild(stage);
    var NAMES = ["1. Ráðgjafinn", "2. Keyranlega líkanið", "3. Í keyrslu"];

    function report() {
      var parts = NAMES.map(function (n, i) { return (state.done[i] ? "✓ " : "") + n; });
      api.status("Framvinda: " + parts.join(" · ") + " (" + state.done.filter(Boolean).length + " af 3 borðum).");
    }
    function finishLevel(i) {
      if (state.done[i]) return;
      state.done[i] = true;
      drawTabs(); report();
      if (state.done.every(Boolean)) api.done("Vel gert! Þú valdir heuristics og vógst áhrif þeirra, gerðir to-be ferli keyranleg og leystir úr keyrslumálum í BPMS.");
    }
    function drawTabs() {
      tabs.innerHTML = "";
      NAMES.forEach(function (n, i) {
        var open = i === 0 || state.done[i - 1] || state.done[i];
        var b = btn("w7-tab", esc(n) + (state.done[i] ? '<span class="w7-ok" aria-label="lokið">✓</span>' : ""), function () { go(i); });
        b.setAttribute("role", "tab"); b.setAttribute("aria-selected", String(i === state.cur));
        if (!open) { b.disabled = true; b.title = "Ljúktu fyrra borði fyrst"; }
        tabs.appendChild(b);
      });
    }
    function go(i) { state.cur = i; drawTabs(); [level1, level2, level3][i](); }

    /* ---------- Borð 1 ---------- */
    function level1() {
      var picks = shuffle(SC).slice(0, 4), idx = 0, score = 0, log = [];
      function next() {
        stage.innerHTML = "";
        if (idx >= picks.length) return summary();
        var sc = picks[idx], pred = { T: 0, K: 0, G: 0, S: 0 }, gotH = false;
        var head = el("div", "w7-head", "<span>Borð 1 · atburðarás " + (idx + 1) + " af " + picks.length + "</span><span>Stig: " + score + " af " + idx * 2 + "</span>");
        var card = el("div", "w7-case", '<span class="w7-dom">' + esc(sc.dom) + "</span><p style=\"margin:.2rem 0 0\">" + esc(sc.txt) + "</p>");
        stage.appendChild(head); stage.appendChild(card);
        stage.appendChild(el("p", "w7-q", "a) Hvaða heuristic leggur þú til?"));
        var opts = el("div", "w7-opts"); stage.appendChild(opts);
        var fbH = el("div", "result"); stage.appendChild(fbH);
        var partB = el("div"); stage.appendChild(partB);
        shuffle([sc.h].concat(sc.d)).forEach(function (k) {
          var b = btn("opt", "<b>" + esc(H[k][0]) + "</b><small>" + esc(H[k][1]) + "</small>", function () {
            Array.prototype.forEach.call(opts.children, function (o) { o.disabled = true; if (o.dataset.k === sc.h) o.classList.add("right"); });
            gotH = k === sc.h;
            if (!gotH) b.classList.add("wrong");
            fbH.className = "result " + (gotH ? "ok" : "no");
            fbH.textContent = gotH ? "Rétt: " + H[sc.h][0] + "." : "Ekki alveg. Hér á best við " + H[sc.h][0] + ": " + H[sc.h][1];
            if (gotH) score++;
            showB();
          });
          b.dataset.k = k; opts.appendChild(b);
        });
        function showB() {
          partB.appendChild(el("p", "w7-q", "b) Spáðu fyrir um áhrif " + esc(H[sc.h][0]) + " á djöflafjórþáttunina"));
          var wrap = el("div", "w7-pred"), left = el("div"), dia = el("div", "w7-dia");
          wrap.appendChild(left); wrap.appendChild(dia); partB.appendChild(wrap);
          var rows = {};
          AX.forEach(function (a) {
            var row = el("div", "w7-axis"); row.appendChild(el("b", "", a[1]));
            var ch = el("div", "chips"); ch.setAttribute("role", "group"); ch.setAttribute("aria-label", a[1]);
            [[-1, "↓ versnar"], [0, "= óbreytt"], [1, "↑ batnar"]].forEach(function (v) {
              var c = btn("chip", v[1], function () {
                pred[a[0]] = v[0];
                Array.prototype.forEach.call(ch.children, function (x) { x.setAttribute("aria-pressed", String(x === c)); });
                dia.innerHTML = quad(pred);
              });
              c.setAttribute("aria-pressed", String(v[0] === 0)); ch.appendChild(c);
            });
            row.appendChild(ch); left.appendChild(row); rows[a[0]] = row;
          });
          dia.innerHTML = quad(pred);
          var bx = el("div", "w7-btns"); partB.appendChild(bx);
          var chk = btn("btn", "Staðfesta spá", function () {
            chk.disabled = true;
            var allOk = true, exp = {};
            AX.forEach(function (a) {
              var k = a[0], row = rows[k], want = sc.fx[k];
              Array.prototype.forEach.call(row.querySelectorAll(".chip"), function (x) { x.disabled = true; });
              if (want == null) { row.appendChild(el("span", "w7-exp", "Ekki metið: fer eftir útfærslu.")); return; }
              exp[k] = want;
              var ok = pred[k] === want; if (!ok) allOk = false;
              row.classList.add(ok ? "ok" : "no");
              row.appendChild(el("span", "w7-exp", (ok ? "✓ " : "✗ ") + "Dæmigert: " + (want > 0 ? "↑ batnar" : want < 0 ? "↓ versnar" : "= óbreytt")));
            });
            var e2 = {}; AX.forEach(function (a) { e2[a[0]] = exp[a[0]] == null ? pred[a[0]] : exp[a[0]]; });
            dia.innerHTML = quad(pred, e2);
            if (allOk) score++;
            log.push(gotH && allOk);
            var fb = el("div", "w7-fb", "<p><b class=\"" + (allOk ? "" : "") + "\" style=\"color:var(" + (allOk ? "--good" : "--bad") + ")\">" + (allOk ? "Spáin stenst." : "Spáin stenst ekki á öllum metnu ásunum.") + "</b> Græna brotalínan sýnir dæmigerð áhrif.</p><p>" + esc(sc.why) + "</p>");
            partB.appendChild(fb);
            var nb = btn("btn", idx + 1 < picks.length ? "Næsta atburðarás →" : "Sjá niðurstöðu", function () { idx++; next(); });
            partB.appendChild(el("div", "w7-btns")).appendChild(nb);
            nb.focus();
          });
          bx.appendChild(chk);
        }
      }
      function summary() {
        var pass = score >= 6;
        stage.appendChild(el("div", "w7-head", "<span>Borð 1 · niðurstaða</span>"));
        var pips = el("div", "w7-pips"); log.forEach(function (ok) { pips.appendChild(el("i", ok ? "on" : "off")); });
        stage.appendChild(pips);
        stage.appendChild(el("p", "result " + (pass ? "ok" : "no"), "Þú fékkst " + score + " af 8 stigum. " + (pass ? "Borð 1 er leyst!" : "Þú þarft 6 af 8. Reyndu aftur með nýjum atburðarásum.")));
        var bx = el("div", "w7-btns"); stage.appendChild(bx);
        if (pass) { finishLevel(0); bx.appendChild(btn("btn", "Áfram í borð 2 →", function () { go(1); })); }
        bx.appendChild(btn(pass ? "btn ghost" : "btn", "Nýjar atburðarásir", function () { level1(); }));
      }
      next();
    }

    /* ---------- Borð 2 ---------- */
    var lastProc = -1;
    function level2() {
      var pi; do { pi = Math.floor(Math.random() * PROC.length); } while (pi === lastProc && PROC.length > 1);
      lastProc = pi;
      var P = PROC[pi], tasks = shuffle(P.tasks).slice(0, 6), asg = {}, sel = null, checked = false;
      tasks.sort(function (a, b) { return P.tasks.indexOf(a) - P.tasks.indexOf(b); });
      stage.innerHTML = "";
      stage.appendChild(el("div", "w7-head", "<span>Borð 2 · ferli " + Math.min(state.procOk + 1, 2) + " af 2</span><span>" + esc(P.name) + "</span>"));
      stage.appendChild(el("p", "", "To-be ferlið hefur verið samþykkt og á að keyra í BPMS. Flokkaðu hvert verk eftir verktegund (skref 1 í umbreytingunni): <b>veldu verktegund</b> í stikunni og <b>smelltu svo á verkið</b>. Spurðu: vinnur manneskja verkið, og ef svo er, sér BPMS það?"));
      var pal = el("div", "w7-pal"); pal.setAttribute("role", "group"); pal.setAttribute("aria-label", "Verktegundir");
      stage.appendChild(pal);
      TYPES.forEach(function (t) {
        var b = btn("w7-type", icon(t[0]) + "<span>" + esc(t[1]) + '</span><small style="font-weight:400;color:var(--muted)">' + esc(t[2]) + "</small>", function () {
          if (checked) return;
          sel = sel === t[0] ? null : t[0];
          Array.prototype.forEach.call(pal.children, function (x) { x.setAttribute("aria-pressed", String(x.dataset.k === sel)); });
        });
        b.dataset.k = t[0]; b.setAttribute("aria-pressed", "false"); pal.appendChild(b);
      });
      var grid = el("div", "w7-tasks"); stage.appendChild(grid);
      var res = el("p", "result"); stage.appendChild(res);
      var bx = el("div", "w7-btns"); stage.appendChild(bx);
      var chk = btn("btn", "Athuga flokkunina", check); chk.disabled = true; bx.appendChild(chk);
      var cards = tasks.map(function (tk, i) {
        var c = btn("w7-task", "", function () {
          if (checked) return;
          if (!sel) { res.className = "result no"; res.textContent = "Veldu fyrst verktegund í stikunni."; return; }
          asg[i] = sel; res.textContent = ""; paint(); });
        grid.appendChild(c); return c;
      });
      function paint() {
        cards.forEach(function (c, i) {
          var k = asg[i];
          c.className = "w7-task" + (k ? " set" : "");
          c.innerHTML = "<span>" + esc(tasks[i].t) + "</span>" + (k ? '<span class="w7-tag">' + icon(k) + esc(TN[k][1]) + "</span>" : '<span class="w7-tag none">ekki flokkað</span>');
          c.setAttribute("aria-label", tasks[i].t + ". " + (k ? "Flokkað sem " + TN[k][1] : "Ekki flokkað"));
        });
        chk.disabled = Object.keys(asg).length < tasks.length;
      }
      paint();
      function check() {
        checked = true; chk.disabled = true;
        var right = 0;
        cards.forEach(function (c, i) {
          var ok = asg[i] === tasks[i].k; if (ok) right++;
          c.classList.add(ok ? "right" : "wrong"); c.disabled = true;
          c.innerHTML += '<span class="w7-why">' + (ok ? "✓ " : "✗ Rétt: " + esc(TN[tasks[i].k][1]) + ". ") + esc(tasks[i].w) + "</span>";
        });
        Array.prototype.forEach.call(pal.children, function (x) { x.disabled = true; });
        var pass = right >= 5;
        if (pass) state.procOk++;
        res.className = "result " + (pass ? "ok" : "no");
        res.textContent = right + " af " + tasks.length + " rétt. " + (pass ? (state.procOk >= 2 ? "Borð 2 er leyst!" : "Gott! Eitt ferli í viðbót.") : "Þú þarft 5 af 6. Reyndu annað ferli.");
        bx.innerHTML = "";
        if (state.procOk >= 2) { finishLevel(1); bx.appendChild(btn("btn", "Áfram í borð 3 →", function () { go(2); })); bx.appendChild(btn("btn ghost", "Annað ferli", level2)); }
        else bx.appendChild(btn("btn", pass ? "Næsta ferli →" : "Reyna annað ferli", level2));
        report();
      }
    }

    /* ---------- Borð 3 ---------- */
    function level3() {
      var qs = shuffle(L3).slice(0, 6), idx = 0, right = 0, log = [];
      function next() {
        stage.innerHTML = "";
        if (idx >= qs.length) return summary();
        var q = qs[idx];
        stage.appendChild(el("div", "w7-head", "<span>Borð 3 · mál " + (idx + 1) + " af " + qs.length + "</span><span>Rétt: " + right + "</span>"));
        stage.appendChild(el("div", "w7-case", '<span class="w7-dom">Í keyrslu</span><p style="margin:.2rem 0 0">' + esc(q.q) + "</p>"));
        var opts = el("div", "w7-opts"); stage.appendChild(opts);
        var fb = el("div"); stage.appendChild(fb);
        shuffle(q.o.map(function (t, i) { return [t, i === 0]; })).forEach(function (o) {
          var b = btn("opt", esc(o[0]), function () {
            Array.prototype.forEach.call(opts.children, function (x) { x.disabled = true; if (x.dataset.c === "1") x.classList.add("right"); });
            if (!o[1]) b.classList.add("wrong"); else right++;
            log.push(o[1]);
            fb.appendChild(el("p", "result " + (o[1] ? "ok" : "no"), (o[1] ? "Rétt. " : "Rangt. Rétt svar: " + esc(q.o[0]) + ". ") ));
            fb.appendChild(el("p", "w7-why", esc(q.e)));
            var nb = btn("btn", idx + 1 < qs.length ? "Næsta mál →" : "Sjá niðurstöðu", function () { idx++; next(); });
            fb.appendChild(el("div", "w7-btns")).appendChild(nb); nb.focus();
          });
          b.dataset.c = o[1] ? "1" : "0"; opts.appendChild(b);
        });
      }
      function summary() {
        var pass = right >= 5;
        stage.appendChild(el("div", "w7-head", "<span>Borð 3 · niðurstaða</span>"));
        var pips = el("div", "w7-pips"); log.forEach(function (ok) { pips.appendChild(el("i", ok ? "on" : "off")); }); stage.appendChild(pips);
        stage.appendChild(el("p", "result " + (pass ? "ok" : "no"), right + " af 6 rétt. " + (pass ? "Borð 3 er leyst!" : "Þú þarft 5 af 6. Reyndu aftur með nýjum málum.")));
        var bx = el("div", "w7-btns"); stage.appendChild(bx);
        if (pass) finishLevel(2);
        bx.appendChild(btn(pass ? "btn ghost" : "btn", "Ný mál", level3));
        if (state.done.every(Boolean)) stage.appendChild(el("p", "result ok", "Öll þrjú borðin eru leyst. Þú mátt halda áfram að æfa eins og þú vilt."));
        else if (pass) { var firstOpen = state.done.indexOf(false); bx.insertBefore(btn("btn", "Fara í borð " + (firstOpen + 1) + " →", function () { go(firstOpen); }), bx.firstChild); }
      }
      next();
    }

    drawTabs(); report(); go(0);
    math(app);
  });
})();

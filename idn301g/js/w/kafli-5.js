/* w/kafli-5.js – gagnvirka skrefið í kafla 5: sóunarveiðar og Pareto-smiðja.
 * Borð 1: flokka skref ferlis í VA / BVA / NVA (öll rétt).
 * Borð 2: greina tegund sóunar í 6 atburðarásum (a.m.k. 5 rétt).
 * Borð 3: Pareto-rit úr vandamálaskrá: raða eftir áhrifum og finna fjöldann sem nær 80 %.
 * api.done() er kallað þegar öll þrjú borðin eru leyst. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  function register(id, fn) { if (typeof TK.widget === "function") TK.widget(id, fn); else (TK._widgetQueue = TK._widgetQueue || []).push([id, fn]); }

  var rnd = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var btn = function (cls, html, fn) { var b = el("button", cls, html); b.type = "button"; if (fn) b.addEventListener("click", fn); return b; };
  var pct = function (x) { return (Math.round(x * 10) / 10).toFixed(1).replace(".", ",") + " %"; };

  var CSS = [
    ".w5-tabs{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 1rem}",
    ".w5-tab{font:600 .9rem var(--sans);padding:.45rem .8rem;border:1px solid var(--rule-2);border-radius:99px;background:var(--raised);color:var(--ink);cursor:pointer}",
    ".w5-tab[aria-selected=true]{background:var(--key-bg);border-color:var(--mag);color:var(--mag)}",
    ".w5-tab:disabled{opacity:.5;cursor:not-allowed}",
    ".w5-tab .w5-ok{color:var(--good);margin-left:.3rem}",
    ".w5-dom{display:inline-block;font:600 .78rem var(--sans);text-transform:uppercase;letter-spacing:.04em;color:var(--mag);margin-bottom:.25rem}",
    ".w5-step{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.3rem .8rem;align-items:center;padding:.55rem .7rem;border:1px solid var(--rule);border-radius:8px;margin:.4rem 0;background:var(--raised)}",
    "@media (max-width:520px){.w5-step{grid-template-columns:1fr}}",
    ".w5-step .chips{margin:0}",
    ".w5-step.ok{border-color:var(--good)}.w5-step.no{border-color:var(--bad)}",
    ".w5-step .w5-exp{grid-column:1/-1;font:500 .85rem var(--sans);color:var(--muted)}",
    ".w5-sc{border:1px solid var(--rule);border-left:4px solid var(--mag);border-radius:8px;padding:.6rem .8rem;margin:.5rem 0;background:var(--raised)}",
    ".w5-sc.ok{border-left-color:var(--good)}.w5-sc.no{border-left-color:var(--bad)}",
    ".w5-sc p{margin:0 0 .4rem}",
    ".w5-sc select{max-width:20rem}",
    ".w5-sc .w5-exp{font:500 .85rem var(--sans);color:var(--muted);margin-top:.35rem}",
    ".w5-btns{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.9rem}",
    ".w5-fb{margin-top:.8rem;padding:.7rem .9rem;border-radius:8px;background:var(--paper-2);border:1px solid var(--rule)}",
    ".w5-fb p{margin:.3rem 0}",
    ".w5-reg{overflow-x:auto;margin:.5rem 0}",
    ".w5-reg table{margin:0;width:100%;font:500 .9rem var(--sans)}",
    ".w5-reg td,.w5-reg th{padding:.35rem .5rem}",
    ".w5-reg td.n{text-align:right;font-variant-numeric:tabular-nums}",
    ".w5-iss{display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));gap:.45rem;margin:.5rem 0}",
    ".w5-iss .opt{font-family:var(--sans);font-size:.92rem}",
    ".w5-chart{border:1px solid var(--rule);border-radius:8px;background:var(--raised);padding:.3rem;margin:.6rem 0}",
    ".w5-chart svg{width:100%;height:auto;display:block}",
    ".w5-nums{display:flex;flex-wrap:wrap;gap:.4rem}"
  ].join("\n");
  function css() { if (!document.getElementById("w5-css")) { var s = el("style"); s.id = "w5-css"; s.textContent = CSS; document.head.appendChild(s); } }

  /* ---------- Borð 1: ferlar með flokkuðum skrefum ---------- */
  var PROCS = [
    { name: "Nýskráning í banka", steps: [
      ["Viðskiptavinur fyllir út umsókn á vefnum", "VA", "Viðskiptavinurinn vill fá reikning; að lýsa þörfinni er hluti af því."],
      ["Umsóknin er prentuð út og sett í bakka þjónustufulltrúa", "NVA", "Flutningur á pappír skapar ekkert virði og er ekki nauðsynlegur."],
      ["Skilríki eru staðfest vegna laga um peningaþvætti", "BVA", "Lögbundið eftirlit: nauðsynlegt fyrir reksturinn en viðskiptavinurinn greiðir ekki fyrir það."],
      ["Áhættumat er skráð í eftirlitskerfi bankans", "BVA", "Áhættustýring bankans: rekstrarvirði."],
      ["Umsókn bíður eftir að yfirmaður kvitti á hana", "NVA", "Bið skapar ekkert virði."],
      ["Reikningur er stofnaður og kort sent til viðskiptavinar", "VA", "Það sem viðskiptavinurinn vildi fá."]] },
    { name: "Viðhaldsbeiðni í fjölbýli", steps: [
      ["Íbúi lýsir biluninni í þjónustugátt", "VA", "Íbúinn vill fá viðgerð; lýsingin er nauðsynlegt ílag hennar."],
      ["Beiðni er áframsend frá móttöku til húsvarðar", "NVA", "Afhending milli fólks: tilfærsla án virðis."],
      ["Pípari lagar lekann", "VA", "Þetta er nákvæmlega það sem íbúinn bað um."],
      ["Kostnaður er bókaður á rétt verknúmer", "BVA", "Bókhald og kostnaðareftirlit fyrirtækisins."],
      ["Pípari fer aftur á lager eftir gleymdu verkfæri", "NVA", "Óþarfa hreyfing sem skilar engu."],
      ["Rafmagnsúttekt samkvæmt reglugerð er skráð", "BVA", "Krafa reglugerðar: rekstrarvirði."]] },
    { name: "Umsókn um námsstyrk", steps: [
      ["Nemandi skilar umsókn með fylgigögnum", "VA", "Nemandinn vill styrk; umsóknin er grunnur hans."],
      ["Starfsmaður slær gögnin aftur inn í annað kerfi", "NVA", "Endurtekinn innsláttur: hverfur ef kerfin tala saman."],
      ["Námsárangur er staðfestur gegn úthlutunarreglum", "BVA", "Sjóðurinn verður að fylgja reglum sínum; nemandinn greiðir ekki fyrir eftirlitið."],
      ["Umsóknin bíður í bunka í viku", "NVA", "Bið."],
      ["Styrkurinn er greiddur út til nemandans", "VA", "Það sem nemandinn sótti um."],
      ["Greiðslan er bókuð í fjárhagsbókhald", "BVA", "Bókhaldsskylda: rekstrarvirði."]] },
    { name: "Útflutningur á fiski", steps: [
      ["Fiskur er flakaður og pakkaður eftir pöntun", "VA", "Kaupandinn greiðir fyrir unna vöru."],
      ["Bretti eru flutt tvisvar milli frystigeymslna", "NVA", "Óþarfa tilfærsla."],
      ["Útflutningsskýrsla er send tollinum", "BVA", "Lögbundin skýrsla: nauðsynleg fyrir reksturinn."],
      ["Heilbrigðisvottorð er gefið út vegna reglna innflutningslands", "BVA", "Reglugerðarkrafa."],
      ["Sendingin er kæld og flutt til kaupanda", "VA", "Kaupandinn greiðir fyrir að fá vöruna ferska til sín."],
      ["Pöntun er slegin inn aftur vegna innsláttarvillu", "NVA", "Endurvinnsla vegna galla."]] },
    { name: "Heimsókn á heilsugæslu", steps: [
      ["Læknir skoðar sjúklinginn", "VA", "Kjarni þjónustunnar."],
      ["Sjúklingur bíður á biðstofu", "NVA", "Bið."],
      ["Lyfseðill er gefinn út", "VA", "Sjúklingurinn kom til að fá meðferð."],
      ["Komugjald er skráð og innheimt", "BVA", "Tekjuöflun: rekstrarvirði."],
      ["Sjúkraskrá er uppfærð samkvæmt lögum", "BVA", "Lögbundin skráning."],
      ["Ritari prentar tilvísun og sendir hana í pósti", "NVA", "Tilfærsla á pappír sem rafræn tilvísun gerir óþarfa."]] }
  ];

  /* ---------- Borð 2: sóunartegundir ---------- */
  var WT = { T: "Óþarfa tilfærsla / flutningar", I: "Of miklar birgðir", M: "Hreyfing / áreynsla", W: "Bið", O: "Umframframleiðsla", P: "Óskilvirk ferli (ofvinnsla)", D: "Gallar", S: "Vannýttur mannauður" };
  var SCEN = [
    ["Viðhaldsbeiðni flakkar milli móttöku, fasteignasviðs og húsvarðar áður en einhver tekur hana að sér.", "T", "Beiðnin sjálf er flutt á milli fólks að óþörfu."],
    ["Tjónagögn eru færð handvirkt úr tjónakerfinu yfir í greiðslukerfið.", "T", "Upplýsingar færðar milli kerfa (glæra 12)."],
    ["Fiskbretti eru flutt úr vinnslusal í frystigeymslu og svo aftur á hleðslusvæði daginn eftir.", "T", "Vörur fluttar langar leiðir."],
    ["Afgreiðslumaður í byggingavöruverslun gengur á lagerinn í hinum enda hússins í hvert skipti til að gá hvort vara sé til.", "M", "Starfsmaðurinn sjálfur gengur að óþörfu."],
    ["Hjúkrunarfræðingur leitar að blóðþrýstingsmæli í þremur herbergjum.", "M", "Leit að búnaði er hreyfing."],
    ["Starfsmaður leitar að réttu eyðublaði í möppum á sameiginlegu drifi.", "M", "Leit að gögnum er hreyfing."],
    ["Lánsumsókn liggur í þrjá daga og bíður eftir undirskrift yfirmanns.", "W", "Óskilvirkt samþykktarferli: tilvikið bíður."],
    ["Farþegi bíður í 40 mínútur í síma eftir þjónustufulltrúa vegna týndrar tösku.", "W", "Viðskiptavinurinn bíður."],
    ["Pípari mætir á staðinn en kemst ekki inn því enginn er með lykil.", "W", "Auðlindin bíður eftir að geta unnið verkið."],
    ["Verslunin geymir 300 bretti af grillum á lager yfir veturinn.", "I", "Vörur geymdar á lager umfram þörf."],
    ["Pósthólf þjónustuvers geymir 900 ólesna tölvupósta.", "I", "Yfirfullt pósthólf er birgðir (glæra 12)."],
    ["Heilsugæslan á lyfjabirgðir sem renna út áður en þær eru notaðar.", "I", "Of miklar birgðir."],
    ["Vikuleg skýrsla er send á 30 manns en aðeins tveir lesa hana.", "O", "Of margar skýrslur og fjöldi í cc: framleitt umfram eftirspurn."],
    ["Fiskvinnslan pakkar 20 % meira en pantað var „til öryggis“.", "O", "Framleiðsla umfram eftirspurn."],
    ["Tjón upp á 8.000 kr. krefst þriggja undirskrifta og skoðunar matsmanns.", "P", "Meira gert en virði málsins réttlætir."],
    ["Umsókn um námsstyrk er yfirfarin bæði af ráðgjafa og deildarstjóra með sama gátlista.", "P", "Tvítekin vinnsla sem bætir engu við."],
    ["Reikningur er sendur á rangt heimilisfang og þarf að gefa hann út aftur.", "D", "Rangt heimilisfang og rangur reikningur eru gallar."],
    ["Taska er merkt með röngum flugvallarkóða og endar í Ósló.", "D", "Villa sem þarf að leiðrétta."],
    ["Innsláttarvilla í kennitölu tefur stofnun bankareiknings.", "D", "Innsláttarvillur eru gallar."],
    ["Reyndur sjúkraliði með hugmyndir að betra flæði er aldrei spurður álits.", "S", "Hæfni og hugmyndir starfsfólks ónýttar."],
    ["Sérmenntaður verkfræðingur eyðir hálfum deginum í ljósritun.", "S", "Hæfni starfsmannsins er ekki nýtt."]
  ];

  /* ---------- Borð 3: vandamálaskrár ---------- */
  var REGS = [
    { name: "Tryggingafélag: tjónaþjónusta", items: ["Vantar fylgigögn með tjónstilkynningu", "Tvískráning í tjónakerfi", "Símtöl um stöðu máls", "Rangt bankanúmer við greiðslu", "Bið eftir mati matsmanns", "Leit að eldri tjónum"] },
    { name: "Byggingavöruverslun: pantanir", items: ["Vara uppseld eftir pöntun", "Röng vara afgreidd", "Handvirk afstemming við birgi", "Leit að vöru á lager", "Endurútgáfa reikninga", "Skilavara ekki skráð"] },
    { name: "Heilsugæsla: tímabókanir", items: ["Sjúklingur mætir ekki", "Tvíbókaður tími", "Vantar tilvísun", "Símtöl vegna endurnýjunar lyfseðla", "Leit að sjúkraskrá", "Rangar upplýsingar í bókun"] },
    { name: "Flugfélag: farangursmál", items: ["Taska ekki skönnuð við komu", "Rangt heimilisfang farþega", "Tvítekin bótakrafa", "Fyrirspurnir um stöðu tösku", "Handvirk skráning í kerfi", "Taska send á rangan flugvöll"] }
  ];
  function makeReg() {
    var r = pick(REGS), n = rnd(5, 6), items, cum, need, tot, s;
    for (;;) {
      items = shuffle(r.items).slice(0, n).map(function (nm) { var f = rnd(2, 40), m = rnd(1, 12) * 5; return { nm: nm, f: f, m: m, v: f * m }; });
      var vs = items.map(function (x) { return x.v; });
      if (new Set(vs).size < n) continue;
      s = items.slice().sort(function (a, b) { return b.v - a.v; });
      tot = vs.reduce(function (a, b) { return a + b; }, 0);
      cum = 0; need = 0;
      var prevPct = 0, okGap = true;
      for (var i = 0; i < n; i++) { prevPct = cum / tot; cum += s[i].v; if (cum / tot >= 0.8) { need = i + 1; okGap = cum / tot - 0.8 >= 0.02 && 0.8 - prevPct >= 0.02; break; } }
      if (okGap && need >= 2 && need <= n - 1) break;
    }
    return { name: r.name, items: items, sorted: s, tot: tot, need: need };
  }
  function paretoSVG(reg, k) {
    var W = 560, H = 270, x0 = 50, x1 = 510, y0 = 20, y1 = 200, n = reg.items.length, bw = (x1 - x0) / n;
    var mx = reg.sorted[0].v;
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Pareto-rit í smíðum">';
    s += '<path d="M' + x0 + "," + y1 + " L" + x1 + "," + y1 + " M" + x0 + "," + y0 + " L" + x0 + "," + y1 + " M" + x1 + "," + y0 + " L" + x1 + "," + y1 + '" style="stroke:var(--rule-2);fill:none"/>';
    var y80 = y1 - 0.8 * (y1 - y0);
    s += '<path d="M' + x0 + "," + y80 + " L" + x1 + "," + y80 + '" style="stroke:var(--bad);stroke-dasharray:5 4;fill:none"/><text x="' + (x1 + 4) + '" y="' + (y80 + 4) + '" style="font:11px var(--sans);fill:var(--bad)">80 %</text>';
    s += '<text x="' + (x1 + 4) + '" y="' + (y0 + 4) + '" style="font:11px var(--sans);fill:var(--muted)">100 %</text>';
    var cum = 0, pts = [];
    for (var i = 0; i < k; i++) {
      var it = reg.sorted[i], h = (it.v / mx) * (y1 - y0) * 0.95, cx = x0 + bw * i + bw / 2;
      cum += it.v; pts.push([cx, y1 - (cum / reg.tot) * (y1 - y0)]);
      s += '<rect x="' + (cx - bw * 0.35) + '" y="' + (y1 - h) + '" width="' + bw * 0.7 + '" height="' + h + '" style="fill:var(--mag);opacity:.85"/>';
      s += '<text x="' + cx + '" y="' + (y1 - h - 4) + '" text-anchor="middle" style="font:11px var(--sans);fill:var(--ink)">' + it.v + "</text>";
      s += '<text x="' + cx + '" y="' + (y1 + 16) + '" text-anchor="middle" style="font:11px var(--sans);fill:var(--muted)">' + (i + 1) + ".</text>";
    }
    if (pts.length) {
      s += '<path d="M' + pts.map(function (p) { return p[0] + "," + p[1]; }).join(" L") + '" style="stroke:var(--ink);stroke-width:2;fill:none"/>';
      pts.forEach(function (p, i) {
        var c = 0; for (var j = 0; j <= i; j++) c += reg.sorted[j].v;
        s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" style="fill:var(--ink)"/><text x="' + (p[0] + 5) + '" y="' + (p[1] - 6) + '" style="font:600 11px var(--sans);fill:var(--ink)">' + pct((100 * c) / reg.tot) + "</text>";
      });
    }
    s += '<text x="' + (W / 2) + '" y="' + (H - 30) + '" text-anchor="middle" style="font:12px var(--sans);fill:var(--muted)">súlur: mín á mánuði · lína: uppsafnað %</text>';
    return s + "</svg>";
  }

  register("kafli-5", function (root, api) {
    css();
    var app = root.querySelector("#k5-app");
    var solved = [false, false, false], cur = 0;
    var tabs = el("div", "w5-tabs"), body = el("div");
    app.innerHTML = ""; app.appendChild(tabs); app.appendChild(body);
    var TITLES = ["1. VA / BVA / NVA", "2. Sóunarveiðar", "3. Pareto-smiðja"];
    function drawTabs() {
      tabs.innerHTML = "";
      TITLES.forEach(function (t, i) {
        var b = btn("w5-tab", t + (solved[i] ? '<span class="w5-ok">✓</span>' : ""), function () { cur = i; drawTabs(); LEVELS[i](); });
        b.setAttribute("role", "tab"); b.setAttribute("aria-selected", i === cur ? "true" : "false");
        b.disabled = i > 0 && !solved[i - 1] && !solved[i];
        tabs.appendChild(b);
      });
    }
    function status() {
      var n = solved.filter(Boolean).length;
      if (n === 3) api.done("Vel gert! Þú flokkaðir skref og sóun og smíðaðir Pareto-rit úr vandamálaskrá.");
      else api.status("Þú hefur leyst " + n + " af 3 borðum.");
    }
    function win(i, fb, msg) {
      solved[i] = true; status(); drawTabs();
      fb.appendChild(el("p", "result ok", msg));
      if (i < 2) fb.appendChild(btn("btn", "Næsta borð →", function () { cur = i + 1; drawTabs(); LEVELS[cur](); }));
    }

    /* Borð 1 */
    var lastProc = -1;
    function level1() {
      var pi; do { pi = rnd(0, PROCS.length - 1); } while (pi === lastProc); lastProc = pi;
      var P = PROCS[pi], choice = P.steps.map(function () { return null; }), rows = [];
      body.innerHTML = "";
      body.appendChild(el("span", "w5-dom", P.name));
      body.appendChild(el("p", null, "Flokkaðu hvert skref. Spyrðu: myndi viðskiptavinurinn greiða fyrir það (VA)? Ef ekki, þarf reksturinn það eða lögin (BVA)? Annars NVA."));
      P.steps.forEach(function (st, i) {
        var r = el("div", "w5-step"); r.appendChild(el("span", null, (i + 1) + ". " + st[0]));
        var ch = el("div", "chips");
        ["VA", "BVA", "NVA"].forEach(function (c) {
          var b = btn("chip", c, function () { choice[i] = c; Array.prototype.forEach.call(ch.children, function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); });
          b.setAttribute("aria-pressed", "false"); ch.appendChild(b);
        });
        r.appendChild(ch); var ex = el("div", "w5-exp"); ex.hidden = true; r.appendChild(ex);
        rows.push([r, ex]); body.appendChild(r);
      });
      var fb = el("div"), row = el("div", "w5-btns");
      row.appendChild(btn("btn", "Athuga", function () {
        var good = 0;
        P.steps.forEach(function (st, i) {
          var ok = choice[i] === st[1]; if (ok) good++;
          rows[i][0].className = "w5-step " + (ok ? "ok" : "no");
          rows[i][1].hidden = ok; rows[i][1].textContent = ok ? "" : (choice[i] ? "Ekki rétt. " : "Veldu flokk. ") + "Hugsaðu: hver nýtur góðs af skrefinu?";
        });
        fb.innerHTML = "";
        if (good === P.steps.length) {
          P.steps.forEach(function (st, i) { rows[i][1].hidden = false; rows[i][1].textContent = st[1] + ": " + st[2]; });
          win(0, fb, "Öll 6 skrefin rétt flokkuð!");
        } else {
          fb.appendChild(el("p", "result no", good + " af 6 rétt. Lagaðu rauðu skrefin og athugaðu aftur."));
          fb.appendChild(btn("btn ghost", "Annar ferill", level1));
        }
      }));
      body.appendChild(row); body.appendChild(fb);
    }

    /* Borð 2 */
    function level2() {
      var set = shuffle(SCEN).slice(0, 6), sels = [], boxes = [];
      body.innerHTML = "";
      body.appendChild(el("p", null, "Hvaða tegund sóunar lýsir hver atburðarás best? Mundu muninn á <b>tilfærslu</b> (hluturinn/upplýsingarnar fluttar) og <b>hreyfingu</b> (fólkið hreyfir sig), og á <b>birgðum</b> (hlutir geymdir) og <b>bið</b> (tilvik bíður)."));
      set.forEach(function (sc, i) {
        var b = el("div", "w5-sc"); b.appendChild(el("p", null, "<b>" + (i + 1) + ".</b> " + sc[0]));
        var s = el("select"); s.setAttribute("aria-label", "Tegund sóunar í atburðarás " + (i + 1));
        s.appendChild(el("option", null, "Veldu tegund sóunar…")); s.options[0].value = "";
        Object.keys(WT).forEach(function (k) { var o = el("option", null, WT[k]); o.value = k; s.appendChild(o); });
        b.appendChild(s); var ex = el("div", "w5-exp"); ex.hidden = true; b.appendChild(ex);
        sels.push(s); boxes.push([b, ex]); body.appendChild(b);
      });
      var fb = el("div"), row = el("div", "w5-btns");
      var chk = btn("btn", "Athuga", function () {
        var good = 0;
        set.forEach(function (sc, i) {
          var ok = sels[i].value === sc[1]; if (ok) good++;
          boxes[i][0].className = "w5-sc " + (ok ? "ok" : "no");
          boxes[i][1].hidden = false;
          boxes[i][1].textContent = (ok ? "✓ " : "✗ Rétt: " + WT[sc[1]] + ". ") + sc[2];
          sels[i].disabled = true;
        });
        chk.disabled = true; fb.innerHTML = "";
        if (good >= 5) win(1, fb, good + " af 6 rétt. Þú þekkir sóunina!");
        else { fb.appendChild(el("p", "result no", good + " af 6 rétt; þú þarft 5. Lestu skýringarnar og reyndu nýjar atburðarásir.")); fb.appendChild(btn("btn ghost", "Nýjar atburðarásir", level2)); }
      });
      row.appendChild(chk); body.appendChild(row); body.appendChild(fb);
    }

    /* Borð 3 */
    function level3() {
      var reg = makeReg(), k = 0, phase = 1;
      body.innerHTML = "";
      body.appendChild(el("span", "w5-dom", reg.name));
      body.appendChild(el("p", null, "Vandamálaskrá með tíðni á mánuði og vinnslutíma í hvert skipti. Reiknaðu áhrifin (tíðni × mínútur) í huganum eða á blaði og <b>smelltu á vandamálin í Pareto-röð</b>, það stærsta fyrst."));
      var t = el("div", "w5-reg");
      t.innerHTML = "<table><thead><tr><th>Vandamál</th><th>Tíðni/mán</th><th>Mín/skipti</th></tr></thead><tbody>" + reg.items.map(function (x) { return "<tr><td>" + x.nm + '</td><td class="n">' + x.f + '</td><td class="n">' + x.m + "</td></tr>"; }).join("") + "</tbody></table>";
      body.appendChild(t);
      var chart = el("div", "w5-chart", paretoSVG(reg, 0)); body.appendChild(chart);
      var grid = el("div", "w5-iss"), msg = el("p", "result"), fb = el("div");
      shuffle(reg.items).forEach(function (x) {
        var b = btn("opt", x.nm, function () {
          if (phase !== 1 || b.disabled) return;
          if (x === reg.sorted[k]) {
            b.disabled = true; b.classList.add("right"); b.innerHTML = (k + 1) + ". " + x.nm + " <small>(" + x.f + " × " + x.m + " = " + x.v + ")</small>";
            k++; chart.innerHTML = paretoSVG(reg, k);
            msg.className = "result ok"; msg.textContent = "Rétt: " + x.v + " mín á mánuði.";
            if (k === reg.items.length) ask();
          } else {
            msg.className = "result no";
            msg.textContent = "Ekki næst stærst: " + x.nm + " er " + x.f + " × " + x.m + " = " + x.v + " mín. Leitaðu að stærra.";
          }
        });
        grid.appendChild(b);
      });
      body.appendChild(grid); body.appendChild(msg); body.appendChild(fb);
      function ask() {
        phase = 2;
        fb.innerHTML = "";
        fb.appendChild(el("p", "w5-q", "<b>Hversu mörg stærstu vandamálin þarf til að ná a.m.k. 80 % af heildartímanum (" + reg.tot + " mín)?</b>"));
        var nums = el("div", "w5-nums"), res = el("div");
        for (var i = 1; i <= reg.items.length; i++) (function (n) {
          nums.appendChild(btn("btn ghost", String(n), function () {
            res.innerHTML = "";
            if (n === reg.need) {
              Array.prototype.forEach.call(nums.children, function (c) { c.disabled = true; });
              var share = (100 * reg.need) / reg.items.length;
              win(2, res, "Rétt! " + n + " af " + reg.items.length + " vandamálum (" + pct(share) + " þeirra) valda yfir 80 % tímans. " + (share <= 40 ? "Hér gildir Pareto-reglan vel." : "80/20 er bara þumalputtaregla: hér dreifast áhrifin meira."));
            } else res.appendChild(el("p", "result no", "Ekki rétt. Lestu uppsafnaða hlutfallið á línunni: hvar fer hún fyrst yfir rauðu 80 % línuna?"));
          }));
        })(i);
        fb.appendChild(nums); fb.appendChild(res);
      }
    }

    var LEVELS = [level1, level2, level3];
    drawTabs(); level1(); status();
  });
})();

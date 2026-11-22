/* w/kafli-9.js – gagnvirka skrefið í kafla 9: stjórnstöð ferlanna.
 * Þrjú borð: KPI-smiðja (víddir), RACI-fylki (reglur + lýsing) og þroskamat (stig 1-5).
 * api.done() þegar öll þrjú borðin eru leyst. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  function register(id, fn) { if (typeof TK.widget === "function") TK.widget(id, fn); else (TK._widgetQueue = TK._widgetQueue || []).push([id, fn]); }

  var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };

  var CSS =
    ".w9-tabs{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 1rem}" +
    ".w9-tab{font:600 .85rem var(--sans);padding:.4rem .8rem;border:1px solid var(--rule-2);border-radius:99px;background:var(--raised);color:var(--ink);cursor:pointer}" +
    ".w9-tab[aria-selected=true]{background:var(--key-bg);border-color:var(--mag);color:var(--mag)}" +
    ".w9-tab.ok::after{content:' ✓';color:var(--good)}" +
    ".w9-item{border:1px solid var(--rule);border-radius:8px;padding:.6rem .75rem;margin:.5rem 0;background:var(--paper)}" +
    ".w9-item.right{border-color:var(--good);background:color-mix(in srgb,var(--good) 9%,var(--paper))}" +
    ".w9-item.wrong{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 8%,var(--paper))}" +
    ".w9-item p{margin:0 0 .4rem}" +
    ".w9-item .chips{margin:.2rem 0 0}" +
    ".w9-why{font-size:.9rem;color:var(--muted);margin:.35rem 0 0}" +
    ".w9-clues{margin:.3rem 0 1rem;padding-left:1.2rem}.w9-clues li{margin:.25rem 0}" +
    ".w9-grid{border-collapse:collapse;font:500 .88rem var(--sans);min-width:100%}" +
    ".w9-grid th,.w9-grid td{border:1px solid var(--rule);padding:.3rem;text-align:center;vertical-align:middle}" +
    ".w9-grid th{background:var(--paper-2);font-weight:600;font-size:.8rem}" +
    ".w9-grid td.w9-act{text-align:left;font-weight:600;min-width:7.5rem}" +
    ".w9-cell{width:2.6rem;height:2.4rem;font:700 1rem var(--sans);border:1px solid var(--rule-2);border-radius:6px;background:var(--raised);color:var(--ink);cursor:pointer}" +
    ".w9-cell:focus-visible{outline:2px solid var(--focus);outline-offset:1px}" +
    ".w9-cell.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 14%,var(--raised))}" +
    ".w9-cell.good{border-color:var(--good)}" +
    ".w9-legend{font-size:.9rem;color:var(--muted);margin:.2rem 0 .6rem}" +
    ".w9-bar{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}" +
    ".w9-fb{margin:.6rem 0 0;padding-left:1.2rem;font-size:.93rem}.w9-fb li{margin:.2rem 0}";

  /* ---------- Borð 1: KPI-smiðja ---------- */
  var DIMS = ["Tími", "Kostnaður", "Gæði", "Sveigjanleiki"];
  var KPIS = [
    ["Meðalumferðartími frá tjónstilkynningu til greiðslu bóta", 0, "Lengd tímabils frá upphafi til enda máls er tímamæling (CT)."],
    ["Hlutfall viðhaldsbeiðna í forgangi 1 sem leystar eru innan 24 klst.", 0, "Hlutfall innan tímamarka mælir tímavíddina."],
    ["Meðalbiðtími umsóknar áður en matsnefnd tekur hana fyrir", 0, "Biðtími er hluti umferðartíma: tímavídd."],
    ["Tími frá því farangur er tékkaður inn þar til hann er kominn í flugvél", 0, "Tímalengd ferlis: tímavídd."],
    ["Biðtími sjúklings frá tilvísun til fyrsta tíma hjá sérfræðingi", 0, "Biðtími: tímavídd."],
    ["Launakostnaður á hverja afgreidda umsókn um námsstyrk", 1, "Krónur á mál: kostnaðarvídd."],
    ["Heildarkostnaður verktaka og innri vinnu á hverja lokaða viðhaldsbeiðni", 1, "Kostnaður á einingu (token)."],
    ["Kostnaður vegna bóta sem greiddar eru fyrir týndar töskur á mánuði", 1, "Bein útgjöld í krónum: kostnaðarvídd (þótt orsökin sé gæðabrestur mælir þessi tala peninga)."],
    ["Flutningskostnaður á hvert kíló af útfluttum fiski", 1, "Kostnaður á einingu: kostnaðarvídd."],
    ["Kostnaður við áreiðanleikakönnun á hvern nýjan viðskiptavin", 1, "Krónur á mál: kostnaðarvídd."],
    ["Hlutfall tjónamála sem eru opnuð aftur vegna villu í uppgjöri", 2, "Endurvinnsla vegna villna er gæðamæling."],
    ["Hlutfall innkaupapantana með rangt magn eða ranga vöru", 2, "Gallar/villur: gæðavídd (sóunarflokkurinn „gallar“)."],
    ["Ánægja umsækjenda með afgreiðsluna, mæld í könnun", 2, "Ytri gæði, mæld frá sjónarhorni viðskiptavinar."],
    ["Fjöldi kvartana á hverjar 1000 fisksendingar vegna hitastigs", 2, "Kvartanir vegna galla: ytri gæði."],
    ["Hlutfall nýskráninga þar sem skjöl vantar og óska þarf eftir þeim aftur", 2, "Endurtekin vinna vegna ófullnægjandi gagna: gæðavídd (lykkjur í skránni)."],
    ["Hlutfall starfsmanna þjónustuvers sem geta sinnt öllum gerðum beiðna", 3, "Geta mannauðs til að leysa mismunandi verk er sveigjanleiki (F1)."],
    ["Fjöldi ólíkra gerða tjóna sem ferlið afgreiðir án sérmeðferðar", 3, "Hversu mikinn breytileika ferlið ræður við: sveigjanleiki."],
    ["Hversu mikla aukningu í innkomnum beiðnum ferlið ræður við án þess að tímamörk bresti", 3, "Geta ferlisins til að taka við breytilegu álagi er sveigjanleiki (F1)."],
    ["Hlutfall bókana sem hægt er að breyta að ósk sjúklings án nýrrar tilvísunar", 3, "Geta ferlisins til að laga sig að óskum viðskiptavinar: sveigjanleiki."],
    ["Fjöldi ólíkra flutningsleiða og áfangastaða sem útflutningsferlið styður", 3, "Fjölbreytni afbrigða sem ferlið ræður við: sveigjanleiki."],
  ];

  /* ---------- Borð 2: RACI ---------- */
  var RACI = [
    { t: "Tjónstilkynning hjá tryggingafélagi (svið 1)",
      roles: ["Tjónafulltrúi", "Deildarstj. tjóna", "Lögfræðideild", "Fjármálasvið", "Viðskiptavinur"],
      acts: ["Skrá tjónstilkynningu", "Meta bótaskyldu", "Greiða bætur", "Loka máli"],
      m: [["R", "A", "", "", ""], ["R", "A", "C", "", ""], ["", "A", "", "R", "I"], ["R", "A", "", "", "I"]],
      clues: ["Deildarstjóri tjóna á ferlið og tekur lokaákvörðun í öllum fjórum verkþrepunum.",
        "Tjónafulltrúinn skráir tilkynninguna, metur bótaskylduna og lokar málinu.",
        "Lögfræðideild verður að gefa álit áður en bótaskylda er metin.",
        "Starfsmenn fjármálasviðs greiða bæturnar út.",
        "Viðskiptavinurinn fær tilkynningu eftir að bætur hafa verið greiddar og eftir að máli er lokað."] },
    { t: "Viðhaldsbeiðni í fasteignaumsjón (svið 8)",
      roles: ["Þjónustuver", "Umsjónarm. fasteigna", "Verktaki", "Rekstrarstjóri", "Leigjandi"],
      acts: ["Skrá viðhaldsbeiðni", "Forgangsraða beiðni", "Framkvæma viðgerð", "Staðfesta verklok"],
      m: [["R", "", "", "A", "I"], ["", "R", "C", "A", ""], ["", "", "R", "A", "I"], ["", "R", "", "A", "C"]],
      clues: ["Rekstrarstjóri er ferilseigandi og hefur lokaorðið í hverju verkþrepi.",
        "Þjónustuver skráir beiðnina og leigjandinn fær staðfestingu eftir að hún hefur verið skráð.",
        "Umsjónarmaður fasteigna forgangsraðar beiðninni, en verður fyrst að fá álit verktakans á því hvenær hann kemst.",
        "Verktakinn gerir við og leigjandanum er tilkynnt þegar viðgerð er lokið.",
        "Umsjónarmaður staðfestir verklok, en aðeins eftir að hafa ráðfært sig við leigjandann um hvort hann sé sáttur."] },
    { t: "Umsókn um námsstyrk (svið 4)",
      roles: ["Umsækjandi", "Starfsm. sjóðs", "Matsnefnd", "Framkvæmdastj.", "Fjármálasvið"],
      acts: ["Yfirfara umsókn", "Meta umsókn faglega", "Tilkynna niðurstöðu", "Greiða styrk"],
      m: [["", "R", "", "A", ""], ["", "C", "R", "A", ""], ["I", "R", "I", "A", ""], ["I", "", "", "A", "R"]],
      clues: ["Framkvæmdastjóri sjóðsins á ferlið og tekur lokaákvörðun í öllum verkþrepum.",
        "Starfsmaður sjóðsins yfirfer umsóknir og sendir út tilkynningu um niðurstöðu.",
        "Matsnefndin metur umsóknina faglega, en verður fyrst að ráðfæra sig við starfsmanninn sem yfirfór hana.",
        "Fjármálasvið greiðir styrkinn út.",
        "Umsækjandinn er látinn vita eftir á, bæði af niðurstöðunni og af greiðslunni.",
        "Matsnefndin fær að vita niðurstöðuna eftir að hún hefur verið tilkynnt."] },
    { t: "Útflutningur á ferskum fiski (svið 6)",
      roles: ["Sölufulltrúi", "Gæðastjóri", "Flutningsaðili", "Útflutningsstj.", "Kaupandi"],
      acts: ["Staðfesta pöntun", "Gæðaskoða afla", "Gefa út útflutningsskjöl", "Flytja vöru"],
      m: [["R", "", "", "A", "I"], ["", "R", "", "A", ""], ["R", "C", "", "A", ""], ["C", "", "R", "A", "I"]],
      clues: ["Útflutningsstjóri á ferlið og tekur lokaákvörðun í öllum verkþrepum.",
        "Sölufulltrúinn staðfestir pöntunina og gefur út útflutningsskjölin.",
        "Gæðastjórinn skoðar aflann, og verður að vera hafður með í ráðum áður en skjölin eru gefin út.",
        "Flutningsaðilinn flytur vöruna, en ráðfærir sig fyrst við sölufulltrúann um afhendingartíma.",
        "Kaupandinn fær tilkynningu eftir að pöntun er staðfest og eftir að varan er farin af stað."] },
    { t: "Tilvísun í sérfræðiþjónustu (svið 3)",
      roles: ["Heimilislæknir", "Móttökuritari", "Sérfræðingur", "Yfirlæknir", "Sjúklingur"],
      acts: ["Senda tilvísun", "Forgangsraða tilvísun", "Bóka tíma", "Skila niðurstöðu"],
      m: [["R", "", "", "A", "I"], ["C", "", "R", "A", ""], ["", "R", "", "A", "I"], ["I", "", "R", "A", "I"]],
      clues: ["Yfirlæknir deildarinnar á ferlið og tekur lokaákvörðun í öllum verkþrepum.",
        "Heimilislæknirinn sendir tilvísunina og sjúklingurinn fær afrit eftir að hún hefur verið send.",
        "Sérfræðingurinn forgangsraðar tilvísuninni, en verður fyrst að fá skýringar frá heimilislækninum.",
        "Móttökuritari bókar tímann og sjúklingurinn fær tilkynningu um hann eftir á.",
        "Sérfræðingurinn skilar niðurstöðu; heimilislæknir og sjúklingur fá hana senda eftir á."] },
  ];
  var CYC = ["", "R", "A", "C", "I"];

  /* ---------- Borð 3: Þroskamat ---------- */
  var LV = ["1 Upphafsstig", "2 Stýrt", "3 Skilgreint", "4 Megindlega stýrt", "5 Bestun"];
  var MAT = [
    ["BPM er varla notað; þar sem það sést er það tilfallandi og einangrað innan einstakra deilda.", "Lítil samhæfing og nær engin þátttaka starfsfólks í ferlavinnu. Hver deild gerir hlutina á sinn hátt."],
    ["Fyrstu ferlarnir hafa verið skráðir og greindir og stjórnendur farnir að taka þátt, en þekkingin á aðferðunum er að mestu hjá utanaðkomandi ráðgjöfum.", "Eftir fyrstu BPM-verkefnin er ferlahugsun að kvikna hjá starfsfólki, en fyrirtækið reiðir sig á ytri sérfræðinga."],
    ["Innri BPM-þjálfun hefur minnkað þörfina fyrir ráðgjafa og samráðsvettvangur er á innranetinu, en áherslan er enn á að skrá og greina ferla.", "Ávinningur fyrstu verkefna sést og aðferðir eru fágaðri, en lítið er unnið með innleiðingu og vöktun."],
    ["BPM-öndvegissetur hefur verið stofnað og kerfisbundin frammistöðuvöktun tryggir að verkefnin skili stefnumarkandi ávinningi.", "Áherslan hefur færst á innleiðingu og vöktun með öflugri breytingastjórnun; nær engin þörf er fyrir utanaðkomandi aðstoð."],
    ["BPM er hluti af daglegri stjórnun, ábyrgð og frammistöðumati og öndvegissetrið hefur minnkað því allir kunna aðferðirnar.", "Aðferðir og verkfæri eru stöðluð og almennt viðurkennd og stöðugar umbætur eru orðnar sjálfsagður hluti rekstrarins."],
  ];
  var MATWHY = [
    "Stig 1: tilfallandi, einangrað, lítil samhæfing.",
    "Stig 2: fyrstu verkefni og ferlahugsun, en þekkingin hjá ytri sérfræðingum.",
    "Stig 3: innri þjálfun og samráðsvettvangar, en áherslan á fyrstu fasa lífsferilsins.",
    "Stig 4: vöktun, öndvegissetur og áhersla á seinni fasa lífsferilsins.",
    "Stig 5: BPM innbyggt í stjórnun og frammistöðumat, stöðugar umbætur.",
  ];

  register("kafli-9", function (root, api) {
    var app = root.querySelector("#k9-app");
    if (!app) return;
    if (!document.getElementById("w9-css")) { var st = document.createElement("style"); st.id = "w9-css"; st.textContent = CSS; document.head.appendChild(st); }
    var solved = [false, false, false], cur = 0, finished = false;
    var NAMES = ["1. KPI-smiðja", "2. RACI-fylki", "3. Þroskamat"];

    app.innerHTML = '<div class="w9-tabs" role="tablist"></div><div class="w9-body"></div>';
    var tabs = app.querySelector(".w9-tabs"), body = app.querySelector(".w9-body");

    function drawTabs() {
      tabs.innerHTML = NAMES.map(function (n, i) {
        return '<button type="button" role="tab" class="w9-tab' + (solved[i] ? " ok" : "") + '" aria-selected="' + (i === cur) + '" data-i="' + i + '">' + n + "</button>";
      }).join("");
    }
    tabs.addEventListener("click", function (e) { var b = e.target.closest("[data-i]"); if (b) { cur = +b.getAttribute("data-i"); show(); } });

    function progress() {
      var n = solved.filter(Boolean).length;
      drawTabs();
      if (n === 3 && !finished) { finished = true; api.done("Vel gert! Þú hefur valið mælikvarða, skýrt eignarhaldið og metið þroskann: þú stýrir ferlinu."); }
      else if (!finished) api.status("Þú hefur leyst " + n + " af 3 borðum.");
    }
    function next(i) {
      for (var k = 1; k <= 3; k++) { var j = (i + k) % 3; if (!solved[j]) return j; }
      return -1;
    }
    function resultBox(ok, html, i) {
      var nx = ok ? next(i) : -1;
      return '<div class="result ' + (ok ? "ok" : "no") + '">' + html + "</div>" +
        (ok && nx >= 0 ? '<div class="w9-bar"><button type="button" class="btn" data-goto="' + nx + '">Áfram í ' + NAMES[nx] + " →</button></div>" : "");
    }
    body.addEventListener("click", function (e) { var g = e.target.closest("[data-goto]"); if (g) { cur = +g.getAttribute("data-goto"); show(); } });

    /* Paraval með hnöppum (chips með aria-pressed) */
    function chipRow(name, labels) {
      return '<div class="chips" role="group" aria-label="' + esc(name) + '">' + labels.map(function (l, k) {
        return '<button type="button" class="chip" aria-pressed="false" data-v="' + k + '">' + esc(l) + "</button>";
      }).join("") + "</div>";
    }
    function bindChips(container) {
      container.addEventListener("click", function (e) {
        var c = e.target.closest(".chip"); if (!c) return;
        var row = c.parentNode;
        Array.prototype.forEach.call(row.querySelectorAll(".chip"), function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
        var it = row.closest(".w9-item"); if (it) { it.classList.remove("right", "wrong"); var w = it.querySelector(".w9-why"); if (w) w.remove(); }
      });
    }
    bindChips(body);
    var chosen = function (it) { var c = it.querySelector('.chip[aria-pressed="true"]'); return c ? +c.getAttribute("data-v") : -1; };

    /* ----- Borð 1 ----- */
    function stageKpi() {
      var items = shuffle([0, 1, 2, 3].reduce(function (acc, d) {
        return acc.concat(shuffle(KPIS.filter(function (k) { return k[1] === d; })).slice(0, 2));
      }, []));
      body.innerHTML = '<h3 style="margin-top:0">KPI-smiðja</h3><p>Þú ert að setja upp mælaborð og vilt mælikvarða í öllum fjórum víddum djöflafjórþáttunarinnar, svo hægt sé að sjá ef ein vídd er bætt á kostnað annarrar. Í hvaða vídd fellur hver mælikvarði?</p>' +
        items.map(function (k, i) { return '<div class="w9-item" data-k="' + i + '"><p><b>' + (i + 1) + ".</b> " + esc(k[0]) + "</p>" + chipRow("Vídd mælikvarða " + (i + 1), DIMS) + "</div>"; }).join("") +
        '<div class="w9-bar"><button type="button" class="btn" data-check>Athuga</button><button type="button" class="btn ghost" data-new>Nýir mælikvarðar</button></div><div class="w9-res" aria-live="polite"></div>';
      body.querySelector("[data-new]").addEventListener("click", stageKpi);
      body.querySelector("[data-check]").addEventListener("click", function () {
        var right = 0, blank = 0;
        Array.prototype.forEach.call(body.querySelectorAll(".w9-item"), function (it) {
          var k = items[+it.getAttribute("data-k")], v = chosen(it);
          var old = it.querySelector(".w9-why"); if (old) old.remove();
          it.classList.remove("right", "wrong");
          if (v < 0) { blank++; return; }
          var ok = v === k[1]; if (ok) right++;
          it.classList.add(ok ? "right" : "wrong");
          it.insertAdjacentHTML("beforeend", '<p class="w9-why">' + (ok ? "✓ " : "✗ Rétt: <b>" + DIMS[k[1]] + "</b>. ") + esc(k[2]) + "</p>");
        });
        var ok = right === items.length;
        if (ok) solved[0] = true;
        body.querySelector(".w9-res").innerHTML = resultBox(ok, ok ? "Allir 8 réttir. Mælaborðið nær nú yfir allar fjórar víddirnar." :
          right + " af " + items.length + " réttir" + (blank ? " (" + blank + " ósvaraðir)" : "") + ". Lagaðu þá rauðu og athugaðu aftur, eða fáðu nýja mælikvarða.", 0);
        progress();
      });
    }

    /* ----- Borð 2 ----- */
    function stageRaci() {
      var S = pick(RACI), nA = S.acts.length, nR = S.roles.length;
      var grid = S.acts.map(function () { return S.roles.map(function () { return ""; }); });
      var head = "<tr><th>Ferlaþrep</th>" + S.roles.map(function (r) { return "<th>" + esc(r) + "</th>"; }).join("") + "</tr>";
      var rows = S.acts.map(function (a, i) {
        return '<tr><td class="w9-act">' + esc(a) + "</td>" + S.roles.map(function (r, j) {
          return '<td><button type="button" class="w9-cell" data-r="' + i + '" data-c="' + j + '" aria-label="' + esc(a + " / " + r + ": autt") + '">–</button></td>';
        }).join("") + "</tr>";
      }).join("");
      body.innerHTML = '<h3 style="margin-top:0">RACI-fylki: ' + esc(S.t) + "</h3><p>Lýsingin á ferlinu:</p><ul class=\"w9-clues\">" +
        S.clues.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" +
        '<p class="w9-legend"><b>R</b> Ábyrgð (vinnur verkið) · <b>A</b> Stýring/eignarhald (lokaákvörðun) · <b>C</b> Ráðgefandi (áður) · <b>I</b> Upplýst (eftir). Smelltu á reit til að fletta – → R → A → C → I, eða veldu reit og ýttu á R, A, C, I eða Delete. Reitir sem lýsingin nefnir ekki eiga að vera auðir.</p>' +
        '<div class="tablewrap"><table class="w9-grid"><thead>' + head + "</thead><tbody>" + rows + "</tbody></table></div>" +
        '<div class="w9-bar"><button type="button" class="btn" data-check>Athuga fylkið</button><button type="button" class="btn ghost" data-new>Nýtt ferli</button></div><div class="w9-res" aria-live="polite"></div>';
      function setCell(btn, v) {
        var i = +btn.getAttribute("data-r"), j = +btn.getAttribute("data-c");
        grid[i][j] = v; btn.textContent = v || "–"; btn.classList.remove("bad", "good");
        btn.setAttribute("aria-label", S.acts[i] + " / " + S.roles[j] + ": " + (v || "autt"));
      }
      var tbl = body.querySelector(".w9-grid");
      tbl.addEventListener("click", function (e) {
        var b = e.target.closest(".w9-cell"); if (!b) return;
        var v = grid[+b.getAttribute("data-r")][+b.getAttribute("data-c")];
        setCell(b, CYC[(CYC.indexOf(v) + 1) % CYC.length]);
      });
      tbl.addEventListener("keydown", function (e) {
        var b = e.target.closest(".w9-cell"); if (!b) return;
        var k = e.key.toUpperCase();
        if (k === "R" || k === "A" || k === "C" || k === "I") { setCell(b, k); e.preventDefault(); }
        else if (e.key === "Delete" || e.key === "Backspace" || e.key === "-") { setCell(b, ""); e.preventDefault(); }
      });
      body.querySelector("[data-new]").addEventListener("click", stageRaci);
      body.querySelector("[data-check]").addEventListener("click", function () {
        var rules = [], wrong = 0;
        for (var i = 0; i < nA; i++) {
          var a = 0, r = 0;
          for (var j = 0; j < nR; j++) { if (grid[i][j] === "A") a++; if (grid[i][j] === "R") r++; }
          if (a !== 1) rules.push("„" + S.acts[i] + "“ hefur " + a + " A en á að hafa nákvæmlega eitt (eignarhald).");
          if (r < 1) rules.push("„" + S.acts[i] + "“ hefur ekkert R; einhver þarf að vinna verkið.");
        }
        Array.prototype.forEach.call(tbl.querySelectorAll(".w9-cell"), function (b) {
          var i = +b.getAttribute("data-r"), j = +b.getAttribute("data-c"), ok = grid[i][j] === S.m[i][j];
          b.classList.toggle("bad", !ok); b.classList.toggle("good", ok && !!grid[i][j]);
          if (!ok) wrong++;
        });
        var ok = !wrong && !rules.length, html;
        if (ok) { solved[1] = true; html = "Fylkið stenst bæði reglurnar (eitt A, a.m.k. eitt R í hverri línu) og lýsinguna. Eignarhaldið er skýrt."; }
        else {
          html = (rules.length ? "<b>Reglubrot:</b><ul class=\"w9-fb\">" + rules.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "Reglurnar standast, ") +
            (wrong ? "<p style=\"margin:.4rem 0 0\">" + wrong + " reit" + (wrong === 1 ? "ur passar" : "ir passa") + " ekki við lýsinguna (rauðmerktir). Lestu aftur: „vinnur/gerir“ = R, „lokaákvörðun/á ferlið“ = A, „áður/ráðfæra sig/álit“ = C, „eftir á/tilkynnt“ = I.</p>" : "");
        }
        body.querySelector(".w9-res").innerHTML = resultBox(ok, html, 1);
        progress();
      });
    }

    /* ----- Borð 3 ----- */
    function stageMat() {
      var items = shuffle([0, 1, 2, 3, 4].map(function (l) { return { l: l, t: pick(MAT[l]) }; }));
      body.innerHTML = '<h3 style="margin-top:0">Þroskamat</h3><p>Fimm skipulagsheildir lýsa BPM-starfi sínu. Á hvaða þroskastig (F14) á hver þeirra heima? Hvert stig kemur fyrir einu sinni.</p>' +
        items.map(function (it, i) { return '<div class="w9-item" data-k="' + i + '"><p><b>' + String.fromCharCode(65 + i) + ".</b> " + esc(it.t) + "</p>" + chipRow("Þroskastig lýsingar " + String.fromCharCode(65 + i), LV) + "</div>"; }).join("") +
        '<div class="w9-bar"><button type="button" class="btn" data-check>Athuga</button><button type="button" class="btn ghost" data-new>Nýjar lýsingar</button></div><div class="w9-res" aria-live="polite"></div>';
      body.querySelector("[data-new]").addEventListener("click", stageMat);
      body.querySelector("[data-check]").addEventListener("click", function () {
        var right = 0;
        Array.prototype.forEach.call(body.querySelectorAll(".w9-item"), function (el) {
          var it = items[+el.getAttribute("data-k")], v = chosen(el);
          var old = el.querySelector(".w9-why"); if (old) old.remove();
          el.classList.remove("right", "wrong");
          if (v < 0) return;
          var ok = v === it.l; if (ok) right++;
          el.classList.add(ok ? "right" : "wrong");
          el.insertAdjacentHTML("beforeend", '<p class="w9-why">' + (ok ? "✓ " + esc(MATWHY[it.l]) : "✗ Ekki rétt. Vísbending: " + (v < it.l ? "þetta er þroskaðra en " + esc(LV[v]) + "." : "þetta er ekki komið jafn langt og " + esc(LV[v]) + ".")) + "</p>");
        });
        var ok = right === 5;
        if (ok) solved[2] = true;
        body.querySelector(".w9-res").innerHTML = resultBox(ok, ok ? "Allar fimm réttar. Mundu að í raun er þroskinn oft ójafn milli kjarnaþáttanna sex (þroskamynstrin á F14)." :
          right + " af 5 réttar. Lagaðu þær rauðu og athugaðu aftur.", 2);
        progress();
      });
    }

    function show() {
      drawTabs();
      [stageKpi, stageRaci, stageMat][cur]();
      if (typeof window.renderMath === "function") window.renderMath(body);
    }
    show();
    progress();
  });
})();

/* w/kafli-1.js – gagnvirka skrefið í kafla 1: SIPOC-smiðja, flöskuhálsaleit og lengsta leið. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  function register(id, fn) { if (typeof TK.widget === "function") TK.widget(id, fn); else (TK._widgetQueue = TK._widgetQueue || []).push([id, fn]); }

  var CSS = [
    ".w1-tabs{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 1rem}",
    ".w1-tabs .chip.done::after{content:' ✓';color:var(--good)}",
    ".w1-cols{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.4rem;margin:.8rem 0}",
    "@media (max-width:720px){.w1-cols{grid-template-columns:1fr 1fr}}",
    ".w1-col{border:1px solid var(--rule-2);border-radius:8px;background:var(--paper-2);min-height:7rem;padding:.35rem;display:flex;flex-direction:column;gap:.3rem;cursor:pointer}",
    ".w1-col.target{border-color:var(--mag);box-shadow:0 0 0 2px color-mix(in srgb,var(--mag) 30%,transparent)}",
    ".w1-col h4{margin:0 0 .2rem;font:700 .8rem/1.2 var(--sans);color:var(--muted)}",
    ".w1-col h4 b{color:var(--mag);font-size:1rem;margin-right:.25rem}",
    ".w1-pool{display:flex;flex-wrap:wrap;gap:.35rem;min-height:2.4rem;padding:.4rem;border:1px dashed var(--rule-2);border-radius:8px}",
    ".w1-item{font:500 .82rem/1.25 var(--sans);padding:.3rem .5rem;border:1px solid var(--rule-2);border-radius:6px;background:var(--raised);color:var(--ink);cursor:grab;text-align:left;display:flex;align-items:center;gap:.25rem}",
    ".w1-item[aria-pressed=true]{border-color:var(--mag);background:var(--key-bg);color:var(--mag);font-weight:700}",
    ".w1-item.ok{border-color:var(--good)}.w1-item.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 10%,var(--raised))}",
    ".w1-item .mv{font:600 .75rem var(--sans);border:0;background:none;color:var(--muted);cursor:pointer;padding:0 .15rem}",
    ".w1-item .txt{flex:1}",
    ".w1-tbl{border-collapse:collapse;width:100%;font:.9rem var(--sans)}",
    ".w1-tbl th,.w1-tbl td{border-bottom:1px solid var(--rule);padding:.35rem .4rem;text-align:left}",
    ".w1-tbl td.num{text-align:right}",
    ".w1-inp{font:1rem var(--sans);padding:.35rem .5rem;border:1px solid var(--rule-2);border-radius:6px;background:var(--raised);color:var(--ink);width:8rem}",
    ".w1-svg{width:100%;min-width:420px;height:auto;display:block}",
    ".w1-scen{background:var(--key-bg);border-left:3px solid var(--key-line);padding:.6rem .8rem;border-radius:6px;margin:.6rem 0}",
  ].join("");

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  function fmt(x, d) { return (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toString().replace(".", ","); }
  function num(s) { s = String(s).replace(/\s/g, "").replace(",", "."); return s === "" ? NaN : Number(s); }

  /* ---------- SIPOC-atburðarásir ---------- */
  var SIPOC = [
    { title: "Eiginmaður hellir upp á te (F2)", text: "Eiginkonan biður um tebolla. Eiginmaðurinn notar tepoka, vatn og mjólk sem keypt var í matvöruversluninni og ber fram tebolla. Notaði tepokinn fer í ruslið.",
      S: ["Eiginmaðurinn", "Matvöruverslunin"], I: ["Tepoki", "Vatn", "Mjólk"], P: ["Setja vatn í ketil", "Sjóða vatnið", "Hella vatninu yfir tepoka í bolla", "Fjarlægja tepoka og bera fram"], O: ["Tebolli", "Notaður tepoki"], C: ["Eiginkonan"] },
    { title: "Tjónstilkynning hjá tryggingafélagi (svið 1)", text: "Tjónþoli tilkynnir árekstur og sendir ljósmyndir; verkstæði sendir kostnaðarmat. Tjónafulltrúi skráir tjónið, metur bótaskyldu, reiknar bætur og greiðir. Tjónþoli fær greiðslu og uppgjörsbréf.",
      S: ["Tjónþoli (tilkynnir)", "Verkstæði"], I: ["Tjónstilkynning", "Ljósmyndir af tjóni", "Kostnaðarmat"], P: ["Skrá tjón", "Meta bótaskyldu", "Reikna bætur", "Greiða bætur"], O: ["Bótagreiðsla", "Uppgjörsbréf"], C: ["Tjónþoli (fær uppgjör)"] },
    { title: "Nýskráning viðskiptavinar í banka (svið 7)", text: "Umsækjandi sækir um viðskipti og framvísar skilríkjum; bankinn sækir upplýsingar í Þjóðskrá. Ráðgjafi tekur við umsókn, staðfestir auðkenni, framkvæmir áreiðanleikakönnun og stofnar reikning. Nýr viðskiptavinur fær virkan reikning og regluvarsla fær skráð áhættumat.",
      S: ["Umsækjandi", "Þjóðskrá"], I: ["Umsókn", "Skilríki", "Upplýsingar úr Þjóðskrá"], P: ["Taka við umsókn", "Staðfesta auðkenni", "Framkvæma áreiðanleikakönnun", "Stofna reikning"], O: ["Virkur reikningur", "Skráð áhættumat"], C: ["Nýr viðskiptavinur", "Regluvarsla bankans"] },
    { title: "Viðhaldsbeiðni í fasteignaumsjón (svið 8)", text: "Leigjandi sendir viðhaldsbeiðni með lýsingu og mynd; varahlutir koma frá heildsala. Þjónustuver skráir beiðnina og forgangsraðar, húsvörður framkvæmir viðgerð og leigjandi staðfestir verklok. Leigjandi fær lagfærða íbúð og eigandi fær kostnaðaryfirlit.",
      S: ["Leigjandi (sendir beiðni)", "Heildsali"], I: ["Viðhaldsbeiðni", "Mynd af bilun", "Varahlutir"], P: ["Skrá beiðni", "Forgangsraða", "Framkvæma viðgerð", "Staðfesta verklok"], O: ["Lagfærð íbúð", "Kostnaðaryfirlit"], C: ["Leigjandi (fær viðgerð)", "Eigandi fasteignar"] },
  ];
  var KEYS = ["S", "I", "P", "O", "C"], NAMES = { S: "Birgi", I: "Innlag", P: "Ferli", O: "Frálag", C: "Viðskiptavinur" };

  register("kafli-1", function (root, api) {
    var app = root.querySelector("#k1-app");
    if (!document.getElementById("w1-css")) { var st = document.createElement("style"); st.id = "w1-css"; st.textContent = CSS; document.head.appendChild(st); }
    var solved = [false, false, false], cur = 0;
    app.innerHTML = '<div class="w1-tabs" role="tablist"></div><div class="w1-body"></div><p class="result" aria-live="polite"></p>';
    var tabs = app.querySelector(".w1-tabs"), body = app.querySelector(".w1-body"), res = app.querySelector(".result");
    var TITLES = ["1. SIPOC-smiðja", "2. Flöskuháls", "3. Lengsta leið"];
    function drawTabs() {
      tabs.innerHTML = TITLES.map(function (t, i) { return '<button type="button" class="chip' + (solved[i] ? " done" : "") + '" aria-pressed="' + (i === cur) + '" data-i="' + i + '">' + t + "</button>"; }).join("");
    }
    tabs.addEventListener("click", function (e) { var b = e.target.closest("button[data-i]"); if (b) { cur = +b.dataset.i; show(); } });
    function setRes(ok, html) { res.className = "result " + (ok ? "ok" : "no"); res.innerHTML = html; if (window.renderMath) window.renderMath(res); }
    function progress() {
      var n = solved.filter(Boolean).length;
      drawTabs();
      if (n === 3) api.done("Vel gert! Þú settir upp SIPOC, fannst flöskuháls og reiknaðir lengstu leið.");
      else api.status("Þú hefur leyst " + n + " af 3 verkefnum.");
    }
    var H = {};
    body.addEventListener("click", function (e) { if (H.click) H.click(e); });
    body.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var el = e.target;
      if (el.classList.contains("w1-item") || el.classList.contains("w1-col")) { e.preventDefault(); el.click(); }
    });
    body.addEventListener("dragstart", function (e) { var ch = e.target.closest && e.target.closest(".w1-item"); if (ch) e.dataTransfer.setData("text/plain", ch.dataset.id); });
    body.addEventListener("dragover", function (e) { if (H.drop && e.target.closest("[data-col]")) e.preventDefault(); });
    body.addEventListener("drop", function (e) { var c = e.target.closest("[data-col]"); if (c && H.drop) { e.preventDefault(); H.drop(e.dataTransfer.getData("text/plain"), c.dataset.col); } });
    function show() { res.className = "result"; res.innerHTML = ""; H = {}; drawTabs(); [sipoc, bottleneck, critical][cur](); }

    /* ===== 1. SIPOC ===== */
    function sipoc() {
      var sc = SIPOC[rnd(0, SIPOC.length - 1)];
      var items = [];
      KEYS.forEach(function (k) { sc[k].forEach(function (t, i) { items.push({ id: k + i, t: t, k: k, ord: i, at: null }); }); });
      items = shuffle(items);
      var sel = null;
      body.innerHTML = '<h3 style="margin-top:0">SIPOC-smiðja: ' + esc(sc.title) + '</h3><div class="w1-scen">' + esc(sc.text) + "</div>" +
        '<p style="font-size:.92rem;color:var(--muted)">Veldu spjald (smelltu eða ýttu á Enter) og svo dálk, eða dragðu spjaldið. Raðaðu þrepunum í P-dálkinum í rétta röð með ▲▼.</p>' +
        '<div class="w1-pool" data-col="pool" aria-label="Óraðað"></div><div class="w1-cols"></div>' +
        '<div class="row"><button type="button" class="btn" data-a="check">Athuga</button><button type="button" class="btn ghost" data-a="new">Ný atburðarás</button></div>';
      var pool = body.querySelector(".w1-pool"), cols = body.querySelector(".w1-cols");
      cols.innerHTML = KEYS.map(function (k) { return '<div class="w1-col" data-col="' + k + '" tabindex="0" role="button" aria-label="Setja í ' + NAMES[k] + '"><h4><b>' + k + "</b>" + NAMES[k] + '</h4><div class="w1-list"></div></div>'; }).join("");
      function chip(it) {
        var mv = it.at === "P" ? '<button type="button" class="mv" data-up="' + it.id + '" aria-label="Færa upp">▲</button><button type="button" class="mv" data-dn="' + it.id + '" aria-label="Færa niður">▼</button>' : "";
        return '<div class="w1-item" draggable="true" tabindex="0" role="button" data-id="' + it.id + '" aria-pressed="' + (sel === it.id) + '"><span class="txt">' + esc(it.t) + "</span>" + mv + "</div>";
      }
      function render() {
        pool.innerHTML = items.filter(function (x) { return !x.at; }).map(chip).join("") || '<span style="color:var(--muted);font-size:.85rem">Öll spjöld komin í dálka.</span>';
        KEYS.forEach(function (k) { cols.querySelector('[data-col="' + k + '"] .w1-list').innerHTML = items.filter(function (x) { return x.at === k; }).map(chip).join(""); });
        cols.querySelectorAll(".w1-col").forEach(function (c) { c.classList.toggle("target", !!sel); });
      }
      function place(id, col) {
        var it = items.filter(function (x) { return x.id === id; })[0];
        if (!it) return;
        var idx = items.indexOf(it); items.splice(idx, 1); items.push(it);
        it.at = col === "pool" ? null : col; sel = null; render();
      }
      function move(id, d) {
        var inP = items.filter(function (x) { return x.at === "P"; }), it = inP.filter(function (x) { return x.id === id; })[0], i = inP.indexOf(it), j = i + d;
        if (j < 0 || j >= inP.length) return;
        var a = items.indexOf(inP[i]), b = items.indexOf(inP[j]); items[a] = inP[j]; items[b] = inP[i]; render();
      }
      H = {
        click: function (e) {
          var t = e.target;
          if (t.dataset.up) { move(t.dataset.up, -1); return; }
          if (t.dataset.dn) { move(t.dataset.dn, 1); return; }
          var ch = t.closest(".w1-item");
          if (ch) { sel = sel === ch.dataset.id ? null : ch.dataset.id; render(); return; }
          var col = t.closest("[data-col]");
          if (col && sel) { place(sel, col.dataset.col); return; }
          var a = t.closest("[data-a]");
          if (a && a.dataset.a === "new") { res.innerHTML = ""; res.className = "result"; sipoc(); return; }
          if (a && a.dataset.a === "check") check();
        },
        drop: function (id, col) { place(id, col); },
      };
      function check() {
        var left = items.filter(function (x) { return !x.at; }).length;
        if (left) { setRes(false, "Settu fyrst öll spjöldin í dálka (" + left + " eftir)."); return; }
        var wrong = 0;
        items.forEach(function (x) { if (x.at !== x.k) wrong++; });
        var inP = items.filter(function (x) { return x.at === "P"; }), orderOk = wrong === 0 && inP.every(function (x, i) { return x.ord === i; });
        render();
        items.forEach(function (x) { var el = body.querySelector('[data-id="' + x.id + '"]'); if (el) el.classList.add(x.at === x.k ? "ok" : "bad"); });
        if (wrong) { setRes(false, wrong + " spjald/spjöld eru í röngum dálki (rauð). Mundu: <b>birgi</b> er aðili sem leggur til, <b>innlag</b> er það sem ferlið notar, <b>frálag</b> er það sem ferlið skilar og <b>viðskiptavinur</b> er sá sem tekur við því."); return; }
        if (!orderOk) { setRes(false, "Allt í réttum dálkum, en þrepin í P-dálkinum eru ekki í réttri röð. Hvað þarf að gerast fyrst?"); return; }
        setRes(true, "Rétt! SIPOC-taflan afmarkar ferlið: frá birgjum og innlagi, í gegnum " + inP.length + " meginþrep, að frálagi og viðskiptavinum.");
        solved[0] = true; progress();
      }
      render();
    }

    /* ===== 2. Flöskuháls ===== */
    var BN = [
      { t: "Afgreiðsla námsstyrkjaumsókna", u: "umsóknir", one: "hver umsókn", s: ["Móttaka og skráning", "Yfirferð gagna", "Mat fagráðs", "Ákvörðun og svarbréf"] },
      { t: "Farangursmeðhöndlun á flugvelli", u: "töskur", one: "hver taska", s: ["Innritun", "Gegnumlýsing", "Flokkun", "Hleðsla í vagna"] },
      { t: "Útflutningur á ferskum fiski", u: "kassar", one: "hver kassi", s: ["Flökun", "Snyrting", "Pökkun í frauðkassa", "Merking og vigtun"] },
      { t: "Tjónaafgreiðsla tryggingafélags", u: "tjón", one: "hvert tjón", s: ["Skráning", "Mat á bótaskyldu", "Útreikningur bóta", "Greiðsla"] },
    ];
    function bottleneck() {
      var sc = BN[rnd(0, BN.length - 1)], st, cap, srt, nb, k, cap2, after;
      do {
        st = sc.s.map(function (n) { return { n: n, w: rnd(1, 4), t: rnd(3, 16) / 2 }; });
        cap = st.map(function (x) { return (x.w * 60) / x.t; });
        srt = cap.slice().sort(function (a, b) { return a - b; });
        k = cap.indexOf(srt[0]);
        cap2 = cap.slice(); cap2[k] = ((st[k].w + 1) * 60) / st[k].t;
        after = Math.min.apply(null, cap2);
      } while (srt[1] / srt[0] < 1.12);
      body.innerHTML = '<h3 style="margin-top:0">Flöskuhálsaleit: ' + esc(sc.t) + "</h3>" +
        "<p>Þrepin eru í röð og " + sc.one + " fer í gegnum þau öll. Starfsmenn í sama þrepi vinna samhliða.</p>" +
        '<div class="tablewrap"><table class="w1-tbl"><thead><tr><th>Þrep</th><th class="num">Starfsmenn</th><th class="num">Vinnslutími (mín. á einingu)</th></tr></thead><tbody>' +
        st.map(function (x, i) { return "<tr><td><label><input type=\"radio\" name=\"w1bn\" value=\"" + i + "\"> " + esc(x.n) + '</label></td><td class="num">' + x.w + '</td><td class="num">' + fmt(x.t, 1) + "</td></tr>"; }).join("") +
        "</tbody></table></div>" +
        '<p><b>a)</b> Veldu flöskuhálsinn í töflunni.</p>' +
        '<p><label class="f"><b>b)</b> Afköst ferlisins (' + sc.u + '/klst): <input class="w1-inp" id="w1-a" inputmode="decimal"></label></p>' +
        '<p><label class="f"><b>c)</b> Afköst ef einum starfsmanni er bætt við flöskuhálsinn (' + sc.u + '/klst): <input class="w1-inp" id="w1-b" inputmode="decimal"></label></p>' +
        '<div class="row"><button type="button" class="btn" id="w1-bc">Athuga</button><button type="button" class="btn ghost" id="w1-bn">Nýtt dæmi</button></div>';
      body.querySelector("#w1-bn").onclick = function () { bottleneck(); res.className = "result"; res.innerHTML = ""; };
      body.querySelector("#w1-bc").onclick = function () {
        var r = body.querySelector('input[name="w1bn"]:checked'), a = num(body.querySelector("#w1-a").value), b = num(body.querySelector("#w1-b").value);
        var okR = r && +r.value === k, okA = Math.abs(a - srt[0]) <= 0.02 * srt[0] + 0.05, okB = Math.abs(b - after) <= 0.02 * after + 0.05;
        var expl = "<br><span style='font-weight:400;color:var(--ink)'>Afköst þrepa ($\\text{starfsmenn}\\cdot 60/\\text{tími}$): " + st.map(function (x, i) { return esc(x.n) + " " + fmt(cap[i], 1); }).join(", ") + ".</span>";
        if (okR && okA && okB) {
          var nk = cap2.indexOf(after);
          setRes(true, "Rétt! Flöskuhálsinn er „" + esc(st[k].n) + "“ með " + fmt(srt[0], 1) + " " + sc.u + "/klst. Með auka starfsmanni fer hann í " + fmt(cap2[k], 1) + ", en afköst ferlisins verða " + fmt(after, 1) + (nk !== k ? " af því að „" + esc(st[nk].n) + "“ verður næsti flöskuháls." : ".") + expl);
          solved[1] = true; progress();
        } else {
          var msg = [];
          if (!okR) msg.push("a) Flöskuhálsinn er þrepið með <b>minnst afköst</b>, ekki endilega lengsta vinnslutímann.");
          if (!okA) msg.push("b) Afköst ferlis = afköst flöskuhálsins.");
          if (!okB) msg.push("c) Reiknaðu ný afköst flöskuhálsins og taktu svo aftur lágmarkið yfir öll þrep: hvert verður næsti flöskuháls?");
          setRes(false, msg.join("<br>"));
        }
      };
    }

    /* ===== 3. Lengsta leið ===== */
    function critical() {
      var v, P, best;
      do {
        v = { A: rnd(10, 50), B: rnd(10, 60), C: rnd(10, 60), D: rnd(5, 60), E: rnd(5, 60), F: rnd(5, 60), G: rnd(5, 60), H: rnd(5, 40), I: rnd(5, 40) };
        P = [["A-B-D-H", "ABDH"], ["A-B-E-H", "ABEH"], ["A-C-F-I", "ACFI"], ["A-C-G-I", "ACGI"]].map(function (p) { return { n: p[0], s: p[1], d: p[1].split("").reduce(function (a, c) { return a + v[c]; }, 0) }; });
        var ds = P.map(function (p) { return p.d; }).sort(function (a, b) { return b - a; });
      } while (ds[0] - ds[1] < 3);
      best = P.reduce(function (a, b) { return b.d > a.d ? b : a; });
      var N = { A: [55, 140], B: [155, 85], C: [155, 195], D: [255, 45], E: [255, 120], F: [255, 165], G: [255, 240], H: [355, 85], I: [355, 205] };
      var E = [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["C", "G"], ["D", "H"], ["E", "H"], ["F", "I"], ["G", "I"]];
      var svg = '<svg class="w1-svg" viewBox="0 0 410 275" role="img" aria-label="Ferlanet með þrepum A til I og tímum"><defs><marker id="w1ar" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 1L10 5L0 9Z" style="fill:var(--muted)"/></marker></defs>';
      E.forEach(function (e) { var p = N[e[0]], q = N[e[1]]; svg += '<path d="M' + (p[0] + 28) + " " + p[1] + "L" + (q[0] - 28) + " " + q[1] + '" style="stroke:var(--muted);stroke-width:1.3;fill:none" marker-end="url(#w1ar)"/>'; });
      Object.keys(N).forEach(function (k) {
        var p = N[k];
        svg += '<rect x="' + (p[0] - 28) + '" y="' + (p[1] - 15) + '" width="56" height="30" rx="6" style="fill:var(--raised);stroke:var(--ink);stroke-width:1.3"/>' +
          '<text x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle" style="fill:var(--ink);font:700 14px var(--sans)">' + k + "</text>" +
          '<text x="' + p[0] + '" y="' + (p[1] - 20) + '" text-anchor="middle" style="fill:var(--mag);font:700 11px var(--sans)">' + v[k] + " mín</text>";
      });
      svg += '<path d="M5 140H27" style="stroke:var(--muted);stroke-width:1.3" marker-end="url(#w1ar)"/></svg>';
      body.innerHTML = '<h3 style="margin-top:0">Flæðitímagreining: hvar á að byrja?</h3><p>Verkefni greinist eftir A í tvær samhliða keðjur. Allar leiðir þurfa að klárast. Finndu <b>lengstu leiðina</b> (critical path) og heildartíma hennar.</p>' +
        '<div class="tablewrap" style="margin:.5rem 0">' + svg + "</div>" +
        '<div class="row" role="radiogroup" aria-label="Leiðir">' + P.map(function (p, i) { return '<label class="opt" style="padding:.4rem .7rem"><input type="radio" name="w1cp" value="' + i + '"> ' + p.n + "</label>"; }).join("") + "</div>" +
        '<p><label class="f">Tími lengstu leiðar (mín.): <input class="w1-inp" id="w1-c" inputmode="decimal"></label></p>' +
        '<div class="row"><button type="button" class="btn" id="w1-cc">Athuga</button><button type="button" class="btn ghost" id="w1-cn">Nýtt dæmi</button></div>';
      body.querySelector("#w1-cn").onclick = function () { critical(); res.className = "result"; res.innerHTML = ""; };
      body.querySelector("#w1-cc").onclick = function () {
        var r = body.querySelector('input[name="w1cp"]:checked'), d = num(body.querySelector("#w1-c").value);
        var okR = r && P[+r.value] === best, okD = Math.abs(d - best.d) < 0.5;
        var tbl = P.map(function (p) { return p.n + " = " + p.s.split("").map(function (c) { return v[c]; }).join(" + ") + " = " + p.d; }).join("<br>");
        if (okR && okD) { setRes(true, "Rétt! " + best.n + " tekur " + best.d + " mín. og ræður heildartímanum. Að stytta þrep sem eru ekki á þessari leið styttir ekki verkefnið.<br><span style='font-weight:400;color:var(--ink)'>" + tbl + "</span>"); solved[2] = true; progress(); }
        else setRes(false, (okR ? "Rétt leið, en tíminn er ekki réttur." : "Ekki rétt leið.") + " Leggðu saman tímana eftir hverri af fjórum leiðunum og veldu þá lengstu.");
      };
    }

    show();
    api.status("Þú hefur leyst 0 af 3 verkefnum.");
  });
})();

/* w/kafli-8.js – gagnvirka skrefið í kafla 8: lykkjuspæjarinn og birgðahermirinn.
 * Borð 1, 3, 5: lykkjuspæjari. Nemandinn setur + / − á hvert tengsl í CLD og velur R eða B fyrir hverja lykkju
 *               (borð 1: einföld lykkja, borð 3: lykkja með fleiri neikvæðum tengslum, borð 5: tvær lykkjur).
 * Borð 2: baðkarið. Stilla eitt flæði (hitt fast) svo birgðin hitti markmið á tíma T.
 * Borð 4: jafnvægislykkja. Útflæði = d·S; stilla innflæði svo jafnvægið S* = I/d verði markmiðið.
 * api.done() er kallað þegar öll fimm borðin eru leyst. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  function register(id, fn) { if (typeof TK.widget === "function") TK.widget(id, fn); else (TK._widgetQueue = TK._widgetQueue || []).push([id, fn]); }

  /* ---------- Hjálparföll ---------- */
  var rnd = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var math = function (e) { if (typeof window.renderMath === "function") window.renderMath(e); };
  var el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var btn = function (cls, html, fn) { var b = el("button", cls, html); b.type = "button"; if (fn) b.addEventListener("click", fn); return b; };
  var nf = function (x, d) { // tala með íslenskri kommu og bili sem þúsundaskilum
    var s = (d ? x.toFixed(d) : String(Math.round(x))).replace(".", ",");
    var p = s.split(","); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return p.join(",").replace(/^-/, "−");
  };
  var SVGNS = "http://www.w3.org/2000/svg";

  var CSS = [
    ".w8-tabs{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 1rem}",
    ".w8-tab{font:600 .88rem var(--sans);padding:.4rem .75rem;border:1px solid var(--rule-2);border-radius:99px;background:var(--raised);color:var(--ink);cursor:pointer}",
    ".w8-tab[aria-selected=true]{background:var(--key-bg);border-color:var(--mag);color:var(--mag)}",
    ".w8-tab:disabled{opacity:.5;cursor:not-allowed}",
    ".w8-tab .w8-ok{color:var(--good);margin-left:.3rem}",
    ".w8-head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.4rem;align-items:baseline;font:600 .9rem var(--sans);color:var(--muted);margin-bottom:.5rem}",
    ".w8-case{border:1px solid var(--rule);border-left:4px solid var(--mag);border-radius:8px;background:var(--raised);padding:.7rem .95rem;margin:.2rem 0 .9rem}",
    ".w8-case p{margin:.2rem 0}",
    ".w8-dom{display:inline-block;font:600 .78rem var(--sans);text-transform:uppercase;letter-spacing:.04em;color:var(--mag)}",
    ".w8-svg{width:100%;height:auto;display:block;background:var(--raised);border:1px solid var(--rule);border-radius:10px;touch-action:manipulation}",
    ".w8-svg text{font-family:var(--sans);fill:var(--ink)}",
    ".w8-svg .w8-edge{fill:none;stroke:var(--ink);stroke-width:1.7}",
    ".w8-svg .w8-badge{cursor:pointer}",
    ".w8-svg .w8-badge circle{fill:var(--raised);stroke:var(--rule-2);stroke-width:1.6}",
    ".w8-svg .w8-badge.set circle{stroke:var(--mag);fill:var(--key-bg)}",
    ".w8-svg .w8-badge.right circle{stroke:var(--good);fill:color-mix(in srgb,var(--good) 14%,var(--raised))}",
    ".w8-svg .w8-badge.wrong circle{stroke:var(--bad);fill:color-mix(in srgb,var(--bad) 14%,var(--raised))}",
    ".w8-svg .w8-badge text{font-weight:700;font-size:17px;text-anchor:middle;dominant-baseline:central;pointer-events:none}",
    ".w8-svg .w8-badge:focus{outline:none}.w8-svg .w8-badge:focus circle{stroke:var(--focus);stroke-width:3}",
    ".w8-svg .w8-loop text{font-weight:700;font-size:16px;text-anchor:middle;dominant-baseline:central}",
    ".w8-links{display:grid;gap:.35rem;margin:.9rem 0}",
    ".w8-link{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.5rem;align-items:center;padding:.35rem .55rem;border:1px solid var(--rule);border-radius:8px;background:var(--raised);font:500 .92rem var(--sans)}",
    ".w8-link.right{border-color:var(--good)}.w8-link.wrong{border-color:var(--bad)}",
    ".w8-link .chips{margin:0;flex-wrap:nowrap}",
    ".w8-link .chip{min-width:2.6rem;font-weight:700;text-align:center}",
    ".w8-link small{color:var(--muted);font-weight:500}",
    ".w8-loops{display:grid;gap:.45rem;margin:.6rem 0}",
    ".w8-looprow{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;font:600 .92rem var(--sans)}",
    ".w8-looprow .chips{margin:0}",
    ".w8-looprow.right{color:var(--good)}.w8-looprow.wrong{color:var(--bad)}",
    ".w8-btns{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.9rem}",
    ".w8-fb{margin-top:.8rem;padding:.7rem .9rem;border-radius:8px;background:var(--paper-2);border:1px solid var(--rule)}",
    ".w8-fb p{margin:.3rem 0}",
    ".w8-ctrl{display:grid;grid-template-columns:minmax(0,1fr) 7rem;gap:.6rem;align-items:end;margin:.6rem 0}",
    ".w8-ctrl input[type=number]{padding:.45rem .55rem}",
    ".w8-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(8.5rem,1fr));gap:.45rem;margin:.6rem 0}",
    ".w8-facts div{border:1px solid var(--rule);border-radius:8px;padding:.45rem .6rem;background:var(--paper-2)}",
    ".w8-facts b{display:block;font:700 1.02rem var(--sans)}",
    ".w8-facts span{font:500 .78rem var(--sans);color:var(--muted)}",
    "@media (max-width:420px){.w8-ctrl{grid-template-columns:1fr}}"
  ].join("\n");

  /* =====================================================================
   * Gögn: lykkjur. s = formerki, dl = vísar tengsla með seinkun.
   * ===================================================================== */
  var L1 = [
    { dom: "Húsnæðismarkaður", nodes: ["Húsnæðisverð", "Arðsemi nýbygginga", "Framboð íbúða"], s: [1, 1, -1], dl: [1],
      story: "Hærra verð gerir nýbyggingar arðbærari, framboð eykst (með seinkun) og meira framboð lækkar verðið. Eitt neikvætt tengsl → B." },
    { dom: "Ferðaþjónusta", nodes: ["Ferðamenn", "Álag á innviði", "Ánægja ferðamanna"], s: [1, -1, 1], dl: [],
      story: "Fleiri ferðamenn auka álag, meira álag dregur úr ánægju og minni ánægja fækkar ferðamönnum. Eitt neikvætt tengsl → B." },
    { dom: "Peningakerfið", nodes: ["Innistæða", "Vaxtatekjur"], s: [1, 1], dl: [],
      story: "Hærri innistæða gefur meiri vaxtatekjur sem leggjast við innistæðuna. Engin neikvæð tengsl → R (vaxtavextir)." },
    { dom: "Kvótakerfið", nodes: ["Fiskistofn", "Leyfilegur heildarafli", "Afli"], s: [1, 1, -1], dl: [0],
      story: "Stærri stofn gefur (eftir stofnmælingu og ráðgjöf) hærri heildarafla, meiri afla, og meiri afli minnkar stofninn. Eitt neikvætt tengsl → B." },
    { dom: "Virðiskeðja smásölu", nodes: ["Birgðir í verslun", "Pantanir"], s: [-1, 1], dl: [1],
      story: "Því minna sem er á lager, því meira er pantað; pantanir bæta (með seinkun) við lagerinn. Eitt neikvætt tengsl → B, og seinkunin getur valdið sveiflum." },
    { dom: "Virðiskeðja smásölu", nodes: ["Fjöldi viðskiptavina", "Meðmæli"], s: [1, 1], dl: [],
      story: "Fleiri viðskiptavinir mæla með versluninni og meðmælin fjölga viðskiptavinum. Engin neikvæð tengsl → R." },
  ];
  var L2 = [
    { dom: "Peningakerfið", nodes: ["Verðbólga", "Stýrivextir", "Útlán", "Eftirspurn"], s: [1, -1, 1, 1], dl: [2],
      story: "Verðbólga hækkar stýrivexti, hærri vextir draga úr útlánum, minni útlán minnka eftirspurn og þá minnkar verðbólga. Eitt neikvætt tengsl → B." },
    { dom: "Hagkerfið", nodes: ["Atvinnuleysi", "Tekjur heimila", "Neysla", "Sala fyrirtækja"], s: [-1, 1, 1, -1], dl: [],
      story: "Atvinnuleysi lækkar tekjur, neysla og sala minnka og atvinnuleysi eykst enn. Tvö neikvæð tengsl → R (vítahringur)." },
    { dom: "Kvótakerfið", nodes: ["Fiskistofn", "Kostnaður á veitt tonn", "Sókn"], s: [-1, -1, -1], dl: [],
      story: "Stærri stofn lækkar kostnað á tonn, lægri kostnaður eykur sókn og meiri sókn minnkar stofninn. Þrjú neikvæð tengsl (oddatala) → B." },
    { dom: "Virðiskeðja smásölu", nodes: ["Markaðshlutdeild", "Innkaupamáttur", "Útsöluverð"], s: [1, -1, -1], dl: [],
      story: "Meiri hlutdeild gefur meiri innkaupamátt, lægra verð og enn meiri hlutdeild. Tvö neikvæð tengsl → R (velgengni til hinna velgengnu)." },
    { dom: "Húsnæðismarkaður", nodes: ["Húsnæðisverð", "Greiðslubyrði nýrra lána", "Eftirspurn eftir íbúðum"], s: [1, -1, 1], dl: [],
      story: "Hærra verð þýðir þyngri greiðslubyrði, sem dregur úr eftirspurn, og minni eftirspurn lækkar verðið. Eitt neikvætt tengsl → B." },
    { dom: "Virðiskeðja smásölu", nodes: ["Biðröð við kassa", "Ánægja viðskiptavina", "Fjöldi viðskiptavina"], s: [-1, 1, 1], dl: [],
      story: "Lengri biðröð dregur úr ánægju, færri koma aftur og biðröðin styttist. Eitt neikvætt tengsl → B." },
    { dom: "Ferðaþjónusta", nodes: ["Ferðamenn", "Verð á gistingu", "Samkeppnishæfni Íslands"], s: [1, 1, -1], dl: [],
      story: "Fleiri ferðamenn hækka gistiverð, hærra verð dregur úr samkeppnishæfni og ferðamönnum fækkar. Eitt neikvætt tengsl → B." },
  ];
  // Tvær lykkjur sem deila breytunni c. A og B: aðrar breytur lykkjunnar, s: formerki frá c og hringinn.
  var L3 = [
    { dom: "Ferðaþjónusta", c: "Ferðamenn",
      A: { nodes: ["Tekjur ferðaþjónustu", "Markaðssetning"], s: [1, 1, 1], dl: [] },
      B: { nodes: ["Álag á náttúru", "Ánægja ferðamanna"], s: [1, -1, 1], dl: [] },
      story: "Vinstri: tekjur fjármagna markaðssetningu sem laðar að fleiri ferðamenn (R, vöxtur). Hægri: álag dregur úr ánægju og heldur aftur af fjölgun (B, takmörk). Saman gefa þær S-feril." },
    { dom: "Húsnæðismarkaður", c: "Húsnæðisverð",
      A: { nodes: ["Væntingar um hækkun", "Eftirspurn eftir íbúðum"], s: [1, 1, 1], dl: [] },
      B: { nodes: ["Arðsemi nýbygginga", "Framboð íbúða"], s: [1, 1, -1], dl: [1] },
      story: "Vinstri: verðbóla (R). Hægri: framboðið svarar með seinkun (B). Seinkunin veldur því að verðið sveiflast." },
    { dom: "Kvótakerfið", c: "Fiskistofn",
      A: { nodes: ["Nýliðun"], s: [1, 1], dl: [] },
      B: { nodes: ["Leyfilegur heildarafli", "Afli"], s: [1, 1, -1], dl: [0] },
      story: "Vinstri: stærri stofn gefur meiri nýliðun (R). Hægri: aflareglan tengir heildarafla við stofninn og aflinn heldur honum í skefjum (B)." },
    { dom: "Peningakerfið", c: "Útlán",
      A: { nodes: ["Innlán", "Útlánageta"], s: [1, 1, 1], dl: [] },
      B: { nodes: ["Eftirspurn", "Verðbólga", "Stýrivextir"], s: [1, 1, 1, -1], dl: [3] },
      story: "Vinstri: útlán skapa innlán sem auka útlánagetu (R, peningamyndun). Hægri: útlán auka eftirspurn og verðbólgu, Seðlabankinn hækkar vexti og útlán minnka (B)." },
    { dom: "Virðiskeðja smásölu", c: "Fjöldi viðskiptavina",
      A: { nodes: ["Meðmæli"], s: [1, 1], dl: [] },
      B: { nodes: ["Biðröð við kassa", "Ánægja viðskiptavina"], s: [1, -1, 1], dl: [] },
      story: "Vinstri: ánægðir viðskiptavinir mæla með versluninni (R). Hægri: fleiri viðskiptavinir lengja biðröð, ánægja minnkar og þeim fækkar (B)." },
  ];

  /* Smíða graf: hnútar með hnit, tengsl, lykkjur. */
  function buildSingle(sc) {
    var n = sc.nodes.length, cx = 320, cy = 175, nodes = [], links = [];
    for (var i = 0; i < n; i++) {
      var th = -Math.PI / 2 + (2 * Math.PI * i) / n;
      nodes.push({ label: sc.nodes[i], x: cx + 205 * Math.cos(th), y: cy + 120 * Math.sin(th) });
    }
    for (var j = 0; j < n; j++) links.push({ a: j, b: (j + 1) % n, s: sc.s[j], delay: sc.dl.indexOf(j) >= 0, cx: cx, cy: cy, two: n === 2 });
    return { nodes: nodes, links: links, loops: [{ links: links.map(function (_, k) { return k; }), type: sc.s.filter(function (x) { return x < 0; }).length % 2 ? "B" : "R", cx: cx, cy: cy, name: "Lykkjan" }], h: 350 };
  }
  function buildDouble(sc) {
    var nodes = [{ label: sc.c, x: 320, y: 185 }], links = [], loops = [];
    [["A", 190, 0, -1], ["B", 450, Math.PI, 1]].forEach(function (cfg, li) {
      var part = sc[cfg[0]], k = part.nodes.length + 1, cx = cfg[1], cy = 185, idx = [0];
      for (var i = 1; i < k; i++) {
        var th = cfg[2] + cfg[3] * (2 * Math.PI * i) / k;
        nodes.push({ label: part.nodes[i - 1], x: cx + 130 * Math.cos(th), y: cy + 135 * Math.sin(th) });
        idx.push(nodes.length - 1);
      }
      var ll = [];
      for (var j = 0; j < k; j++) { links.push({ a: idx[j], b: idx[(j + 1) % k], s: part.s[j], delay: part.dl.indexOf(j) >= 0, cx: cx, cy: cy, two: k === 2 }); ll.push(links.length - 1); }
      loops.push({ links: ll, type: part.s.filter(function (x) { return x < 0; }).length % 2 ? "B" : "R", cx: cx + (li ? 15 : -15), cy: cy, name: li ? "Hægri lykkjan" : "Vinstri lykkjan" });
    });
    return { nodes: nodes, links: links, loops: loops, h: 375 };
  }

  /* Skipta heiti í 1-2 línur. */
  function wrap(label) {
    if (label.length <= 14) return [label];
    var mid = label.length / 2, best = -1;
    for (var i = 0; i < label.length; i++) if (label[i] === " " && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
    return best < 0 ? [label] : [label.slice(0, best), label.slice(best + 1)];
  }

  /* =====================================================================
   * Lykkjuspæjarinn
   * ===================================================================== */
  function loopLevel(box, level, onSolved) {
    var sc, g, ans, loopAns, checked = false, badges = [], rows = [], loopRows = [];
    function newCase() {
      if (level === 1) { sc = pick(L1); g = buildSingle(sc); }
      else if (level === 3) { sc = pick(L2); g = buildSingle(sc); }
      else { sc = pick(L3); g = buildDouble(sc); }
      ans = g.links.map(function () { return 0; });
      loopAns = g.loops.map(function () { return ""; });
      checked = false;
      render();
    }
    function render() {
      box.innerHTML = "";
      box.appendChild(el("div", "w8-case", '<span class="w8-dom">' + esc(sc.dom) + "</span><p>" +
        (g.loops.length > 1 ? "Ritið sýnir tvær lykkjur sem deila breytunni <b>" + esc(sc.c) + "</b>." : "Ritið sýnir eina lykkju.") +
        " Ákvarðaðu pólun hvers tengsls (+ ef breytingin er í sömu átt, − ef í gagnstæða átt) og hvort " + (g.loops.length > 1 ? "hvor lykkja" : "lykkjan") + " sé R eða B. || merkir seinkun.</p>"));
      box.appendChild(drawCLD());
      var lw = el("div", "w8-links"); rows = [];
      g.links.forEach(function (lk, i) {
        var r = el("div", "w8-link");
        r.appendChild(el("div", "", esc(g.nodes[lk.a].label) + " → " + esc(g.nodes[lk.b].label) + (lk.delay ? " <small>(seinkun)</small>" : "")));
        var ch = el("div", "chips");
        [[1, "+"], [-1, "−"]].forEach(function (o) {
          var b = btn("chip", o[1], function () { setSign(i, o[0]); });
          b.setAttribute("aria-label", (o[0] > 0 ? "Plús" : "Mínus") + ": " + g.nodes[lk.a].label + " til " + g.nodes[lk.b].label);
          b.dataset.v = o[0]; ch.appendChild(b);
        });
        r.appendChild(ch); lw.appendChild(r); rows.push(r);
      });
      box.appendChild(lw);
      var lp = el("div", "w8-loops"); loopRows = [];
      g.loops.forEach(function (L, li) {
        var r = el("div", "w8-looprow");
        r.appendChild(el("span", "", esc(L.name) + ":"));
        var ch = el("div", "chips");
        [["R", "R styrkjandi"], ["B", "B jafnvægis"]].forEach(function (o) {
          var b = btn("chip", o[1], function () { loopAns[li] = o[0]; checked = false; sync(); });
          b.dataset.v = o[0]; ch.appendChild(b);
        });
        r.appendChild(ch); lp.appendChild(r); loopRows.push(r);
      });
      box.appendChild(lp);
      var fb = el("div", "w8-fb"); fb.hidden = true;
      var bt = el("div", "w8-btns");
      bt.appendChild(btn("btn", "Athuga", function () { check(fb); }));
      bt.appendChild(btn("btn ghost", "Nýtt dæmi", newCase));
      box.appendChild(bt); box.appendChild(fb);
      sync();
    }
    function setSign(i, v) { ans[i] = v; checked = false; sync(); }
    function cycle(i) { ans[i] = ans[i] === 1 ? -1 : 1; checked = false; sync(); }
    function sync() {
      g.links.forEach(function (lk, i) {
        var bd = badges[i], v = ans[i];
        bd.t.textContent = v === 0 ? "?" : v > 0 ? "+" : "−";
        var st = v === 0 ? "" : checked ? (v === lk.s ? "right" : "wrong") : "set";
        bd.g.setAttribute("class", "w8-badge " + st);
        rows[i].className = "w8-link" + (checked && v !== 0 ? (v === lk.s ? " right" : " wrong") : "");
        rows[i].querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(Number(c.dataset.v) === v)); });
      });
      g.loops.forEach(function (L, li) {
        L.t.textContent = loopAns[li] || "?";
        L.t.style.fill = loopAns[li] === "R" ? "var(--good)" : loopAns[li] === "B" ? "var(--bad)" : "var(--muted)";
        loopRows[li].className = "w8-looprow" + (checked && loopAns[li] ? (loopAns[li] === L.type ? " right" : " wrong") : "");
        loopRows[li].querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.v === loopAns[li])); });
      });
    }
    function check(fb) {
      checked = true; sync(); fb.hidden = false;
      var missing = ans.filter(function (v) { return v === 0; }).length + loopAns.filter(function (v) { return !v; }).length;
      if (missing) { fb.innerHTML = '<p class="result no">Þú átt eftir að ákveða ' + missing + " atriði.</p>"; return; }
      var badL = ans.filter(function (v, i) { return v !== g.links[i].s; }).length;
      var badLoop = loopAns.filter(function (v, i) { return v !== g.loops[i].type; }).length;
      if (!badL && !badLoop) {
        fb.innerHTML = '<p class="result ok">Rétt! Öll tengsl og lykkjur eru rétt greindar.</p><p>' + esc(sc.story) + "</p>";
        onSolved();
        return;
      }
      var h = '<p class="result no">' + (badL ? badL + " tengsl " + (badL === 1 ? "er" : "eru") + " með rangt formerki" : "Formerkin eru rétt") + (badLoop ? (badL ? " og " : ", en ") + "pólun lykkju er röng." : ".") + "</p>";
      if (badL) h += "<p><i>Vísbending:</i> segðu söguna: „ef fyrri breytan <b>eykst</b>, eykst eða minnkar sú seinni?“ Rauðu hringirnir eru rangir.</p>";
      else h += "<p><i>Vísbending:</i> teldu neikvæðu tengslin í lykkjunni. Slétt tala → R, oddatala → B.</p>";
      fb.innerHTML = h;
    }
    function drawCLD() {
      var W = 640, H = g.h, svg = document.createElementNS(SVGNS, "svg");
      svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("class", "w8-svg");
      svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "Orsakarit: " + g.nodes.map(function (n) { return n.label; }).join(", "));
      var mid = "k8w-ah-" + level;
      svg.innerHTML = '<defs><marker id="' + mid + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" style="fill:var(--ink)"/></marker></defs>';
      var mk = function (tag, attrs, parent) { var e = document.createElementNS(SVGNS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); (parent || svg).appendChild(e); return e; };
      // stærðir hnúta
      g.nodes.forEach(function (n) {
        n.x = Math.max(78, Math.min(W - 78, n.x));
        n.lines = wrap(n.label);
        var w = Math.max.apply(null, n.lines.map(function (s) { return s.length; })) * 7.9;
        n.hw = w / 2 + 6; n.hh = n.lines.length * 9 + 5;
      });
      var trim = function (n, tx, ty) { // punktur á brún hnútsins í átt að (tx,ty)
        var dx = tx - n.x, dy = ty - n.y, t = Math.min(n.hw / Math.max(Math.abs(dx), 1e-6), n.hh / Math.max(Math.abs(dy), 1e-6));
        t = Math.min(t, 0.9);
        return [n.x + dx * t, n.y + dy * t];
      };
      badges = [];
      g.links.forEach(function (lk, i) {
        var A = g.nodes[lk.a], Bn = g.nodes[lk.b];
        var mx = (A.x + Bn.x) / 2, my = (A.y + Bn.y) / 2, dx = Bn.x - A.x, dy = Bn.y - A.y, len = Math.sqrt(dx * dx + dy * dy);
        var nx = -dy / len, ny = dx / len; // hægri normall (í skjáhnitum)
        var ox = mx - lk.cx, oy = my - lk.cy;
        if (!lk.two && nx * ox + ny * oy < 0) { nx = -nx; ny = -ny; }
        var bulge = Math.min(0.32 * len, 90), qx = mx + nx * bulge, qy = my + ny * bulge;
        var p0 = trim(A, qx, qy), p1 = trim(Bn, qx, qy);
        mk("path", { d: "M" + p0[0].toFixed(1) + " " + p0[1].toFixed(1) + " Q" + qx.toFixed(1) + " " + qy.toFixed(1) + " " + p1[0].toFixed(1) + " " + p1[1].toFixed(1), class: "w8-edge", "marker-end": "url(#" + mid + ")" });
        var at = function (t) { var u = 1 - t; return [u * u * p0[0] + 2 * u * t * qx + t * t * p1[0], u * u * p0[1] + 2 * u * t * qy + t * t * p1[1]]; };
        if (lk.delay) {
          var a1 = at(0.3), a2 = at(0.34), tx = a2[0] - a1[0], ty = a2[1] - a1[1], tl = Math.sqrt(tx * tx + ty * ty) || 1;
          tx /= tl; ty /= tl;
          [-4, 4].forEach(function (off) {
            var cxp = a1[0] + tx * off, cyp = a1[1] + ty * off;
            mk("line", { x1: cxp - ty * 9, y1: cyp + tx * 9, x2: cxp + ty * 9, y2: cyp - tx * 9, style: "stroke:var(--ink);stroke-width:2.2" });
          });
        }
        var bp = at(0.55);
        var gg = mk("g", { class: "w8-badge", tabindex: "0", role: "button", "aria-label": "Formerki tengsls frá " + A.label + " til " + Bn.label + ". Smelltu til að skipta." });
        mk("circle", { cx: bp[0].toFixed(1), cy: bp[1].toFixed(1), r: 14 }, gg);
        var t = mk("text", { x: bp[0].toFixed(1), y: (bp[1] + 1).toFixed(1) }, gg);
        gg.addEventListener("click", function () { cycle(i); });
        gg.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cycle(i); } });
        badges.push({ g: gg, t: t });
      });
      g.nodes.forEach(function (n) {
        mk("rect", { x: (n.x - n.hw).toFixed(1), y: (n.y - n.hh).toFixed(1), width: (2 * n.hw).toFixed(1), height: (2 * n.hh).toFixed(1), rx: 6, style: "fill:var(--raised);stroke:var(--rule-2);stroke-width:1" });
        n.lines.forEach(function (s, k) {
          var tt = mk("text", { x: n.x.toFixed(1), y: (n.y + (k - (n.lines.length - 1) / 2) * 17 + 5).toFixed(1), "text-anchor": "middle", "font-size": "14.5", "font-weight": "600" });
          tt.textContent = s;
        });
      });
      g.loops.forEach(function (L) {
        var lg = mk("g", { class: "w8-loop" });
        mk("circle", { cx: L.cx, cy: L.cy, r: 17, style: "fill:none;stroke:var(--muted);stroke-width:1.6;stroke-dasharray:88 19" }, lg);
        L.t = mk("text", { x: L.cx, y: L.cy + 1 }, lg);
      });
      return svg;
    }
    newCase();
  }

  /* =====================================================================
   * Línurit fyrir birgðaherminn
   * ===================================================================== */
  function chart(series, opt) {
    var W = 640, H = 260, L = 64, R = 16, T = 16, Bm = 40;
    var xmax = opt.xmax, ymax = opt.ymax;
    var X = function (x) { return L + (x / xmax) * (W - L - R); };
    var Y = function (y) { return T + (1 - y / ymax) * (H - T - Bm); };
    var s = '<svg class="w8-svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(opt.aria) + '">';
    s += '<path d="M' + L + " " + T + " V" + (H - Bm) + " H" + (W - R) + '" style="fill:none;stroke:var(--rule-2);stroke-width:1.3"/>';
    for (var k = 0; k <= 4; k++) {
      var yv = (ymax * k) / 4;
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(yv).toFixed(1) + '" y2="' + Y(yv).toFixed(1) + '" style="stroke:var(--rule);stroke-width:1"/>';
      s += '<text x="' + (L - 6) + '" y="' + (Y(yv) + 4).toFixed(1) + '" text-anchor="end" font-size="12" style="fill:var(--muted)">' + nf(yv) + "</text>";
    }
    for (var j = 0; j <= 5; j++) {
      var xv = Math.round((xmax * j) / 5);
      s += '<text x="' + X(xv).toFixed(1) + '" y="' + (H - Bm + 16) + '" text-anchor="middle" font-size="12" style="fill:var(--muted)">' + xv + "</text>";
    }
    s += '<text x="' + ((L + W - R) / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="12" style="fill:var(--muted)">' + esc(opt.xlabel) + "</text>";
    if (opt.target != null) {
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(opt.target).toFixed(1) + '" y2="' + Y(opt.target).toFixed(1) + '" style="stroke:var(--good);stroke-width:1.6;stroke-dasharray:6 5"/>';
      s += '<text x="' + (W - R - 4) + '" y="' + (Y(opt.target) - 6).toFixed(1) + '" text-anchor="end" font-size="12" style="fill:var(--good)">markmið</text>';
    }
    if (opt.tmark != null) s += '<line x1="' + X(opt.tmark).toFixed(1) + '" x2="' + X(opt.tmark).toFixed(1) + '" y1="' + T + '" y2="' + (H - Bm) + '" style="stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 4"/>';
    if (opt.cap != null) s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(opt.cap).toFixed(1) + '" y2="' + Y(opt.cap).toFixed(1) + '" style="stroke:var(--bad);stroke-width:1.3"/><text x="' + (L + 6) + '" y="' + (Y(opt.cap) - 5).toFixed(1) + '" font-size="12" style="fill:var(--bad)">hámark</text>';
    series.forEach(function (sr) {
      var d = sr.pts.map(function (p, i) { return (i ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y(Math.max(0, Math.min(ymax, p[1]))).toFixed(1); }).join(" ");
      s += '<path d="' + d + '" style="fill:none;stroke:' + sr.color + ";stroke-width:2.6" + (sr.dash ? ";stroke-dasharray:" + sr.dash : "") + '"/>';
    });
    if (opt.dot) s += '<circle cx="' + X(opt.dot[0]).toFixed(1) + '" cy="' + Y(Math.max(0, Math.min(ymax, opt.dot[1]))).toFixed(1) + '" r="5" style="fill:var(--mag)"/>';
    return s + "</svg>";
  }

  function control(label, min, max, step, val, unit) {
    var wrapEl = el("div", "w8-ctrl"), id = "k8c" + Math.floor(Math.random() * 1e6);
    var left = el("div");
    left.appendChild(el("label", "f", esc(label)));
    left.querySelector("label").setAttribute("for", id);
    var rg = el("input"); rg.type = "range"; rg.min = min; rg.max = max; rg.step = step; rg.value = val; rg.id = id;
    left.appendChild(rg);
    var right = el("div"); right.appendChild(el("label", "f", esc(unit)));
    var nb = el("input"); nb.type = "number"; nb.min = min; nb.max = max; nb.step = step; nb.value = val; nb.setAttribute("aria-label", label + " (" + unit + ")");
    right.appendChild(nb);
    rg.addEventListener("input", function () { nb.value = rg.value; });
    nb.addEventListener("input", function () { rg.value = nb.value; });
    wrapEl.appendChild(left); wrapEl.appendChild(right);
    return { el: wrapEl, get: function () { return Number(String(nb.value).replace(",", ".")); } };
  }

  /* =====================================================================
   * Borð 2: baðkarið (föst flæði)
   * ===================================================================== */
  var TUBS = [
    { dom: "Baðkarið", st: "Vatn í baðkari", u: "L", fu: "L/mín", tu: "mín", cap: 200, mk: function () {
        var S0 = rnd(1, 6) * 10, out = rnd(2, 6), net = rnd(3, 9), T = rnd(6, 12), S1 = S0 + net * T;
        return { S0: S0, T: T, target: S1, fixed: out, ctrl: "inn", ans: net + out, max: 30, step: 1,
          text: "Í baðkarinu eru " + S0 + " L og tappinn lekur " + out + " L/mín. Stilltu <b>kranann (innflæðið)</b> svo nákvæmlega " + S1 + " L séu í baðkarinu eftir " + T + " mínútur." };
      } },
    { dom: "Virðiskeðja smásölu", st: "Sementspokar á lager", u: "pokar", fu: "pokar/dag", tu: "dagar", cap: 1500, mk: function () {
        var S0 = rnd(6, 10) * 100, out = rnd(10, 16) * 10, T = pick([10, 12, 15, 20]), net = -rnd(2, 5) * 10, S1 = S0 + net * T;
        if (S1 < 50) { net = -10; S1 = S0 + net * T; }
        return { S0: S0, T: T, target: S1, fixed: out, ctrl: "inn", ans: out + net, max: 250, step: 10,
          text: "Á lager byggingavöruverslunar eru " + S0 + " pokar og salan er " + out + " pokar á dag. Fyrir vorið á að minnka lagerinn í " + S1 + " poka á " + T + " dögum. Stilltu <b>daglegar afhendingar frá birgi (innflæðið)</b> svo það gangi upp." };
      } },
    { dom: "Orkukerfið", st: "Vatn í miðlunarlóni", u: "GL", fu: "GL/viku", tu: "vikur", cap: 900, mk: function () {
        var S0 = rnd(20, 50) * 10, inn = rnd(15, 40), T = pick([8, 10, 12, 16]), net = pick([-1, 1]) * rnd(5, 15), S1 = S0 + net * T;
        if (S1 < 50) { net = -net; S1 = S0 + net * T; }
        return { S0: S0, T: T, target: S1, fixed: inn, ctrl: "út", ans: inn - net, max: 60, step: 1,
          text: "Í miðlunarlóni eru " + S0 + " GL og innrennslið er " + inn + " GL á viku. Eftir " + T + " vikur á lónið að standa í " + S1 + " GL. Stilltu <b>vatnsnotkun virkjunarinnar (útflæðið)</b>." };
      } },
  ];
  function tubLevel(box, onSolved) {
    var c, p, ctl;
    function newCase() {
      c = pick(TUBS); p = c.mk();
      box.innerHTML = "";
      box.appendChild(el("div", "w8-case", '<span class="w8-dom">' + esc(c.dom) + "</span><p>" + p.text + "</p>"));
      var facts = el("div", "w8-facts",
        "<div><b>" + nf(p.S0) + " " + c.u + "</b><span>upphafsbirgð $S_0$</span></div>" +
        "<div><b>" + nf(p.target) + " " + c.u + "</b><span>markmið</span></div>" +
        "<div><b>" + p.T + " " + c.tu + "</b><span>tími $T$</span></div>" +
        "<div><b>" + p.fixed + " " + c.fu + "</b><span>" + (p.ctrl === "inn" ? "útflæði (fast)" : "innflæði (fast)") + "</span></div>");
      box.appendChild(facts);
      ctl = control(p.ctrl === "inn" ? "Innflæði" : "Útflæði", 0, p.max, p.step, Math.round(p.max / 2 / p.step) * p.step, c.fu);
      box.appendChild(ctl.el);
      var plot = el("div", "", chart([], { xmax: p.T * 1.25, ymax: c.cap, target: p.target, tmark: p.T, cap: c.cap, xlabel: "tími [" + c.tu + "]", aria: "Birgð yfir tíma" }));
      box.appendChild(plot);
      var fb = el("div", "w8-fb"); fb.hidden = true;
      var bt = el("div", "w8-btns");
      bt.appendChild(btn("btn", "Keyra hermun", function () { run(plot, fb); }));
      bt.appendChild(btn("btn ghost", "Nýtt dæmi", newCase));
      box.appendChild(bt); box.appendChild(fb);
      math(box);
    }
    function run(plot, fb) {
      var v = ctl.get();
      if (!isFinite(v) || v < 0) { fb.hidden = false; fb.innerHTML = '<p class="result no">Sláðu inn jákvæða tölu.</p>'; return; }
      var qin = p.ctrl === "inn" ? v : p.fixed, qout = p.ctrl === "inn" ? p.fixed : v, net = qin - qout;
      var pts = [], S = p.S0, tEnd = p.T * 1.25, dt = tEnd / 100, empty = null, full = null;
      for (var t = 0; t <= tEnd + 1e-9; t += dt) {
        var val = p.S0 + net * t;
        if (val <= 0 && empty === null) empty = t;
        if (val >= c.cap && full === null) full = t;
        pts.push([t, Math.max(0, Math.min(c.cap, val))]);
      }
      S = Math.max(0, Math.min(c.cap, p.S0 + net * p.T));
      plot.innerHTML = chart([{ pts: pts, color: "var(--mag)" }], { xmax: tEnd, ymax: c.cap, target: p.target, tmark: p.T, cap: c.cap, dot: [p.T, S], xlabel: "tími [" + c.tu + "]", aria: "Birgð yfir tíma" });
      fb.hidden = false;
      var ok = Math.abs(S - p.target) < 0.5 && (empty === null || empty >= p.T) && (full === null || full >= p.T);
      var base = "<p>Nettóflæði: $" + qin + " - " + qout + " = " + net + "$ " + esc(c.fu) + ". Birgðin eftir " + p.T + " " + esc(c.tu) + ": $S(T) = " + p.S0 + " + (" + net + ")\\cdot " + p.T + " = " + (p.S0 + net * p.T) + "$ " + esc(c.u) + ".</p>";
      if (ok) {
        fb.innerHTML = '<p class="result ok">Hárrétt! Birgðin hittir markmiðið.</p>' + base + "<p>Lykillinn: nauðsynlegt nettóflæði er $(S^* - S_0)/T = " + ((p.target - p.S0) / p.T) + "$, og stýrða flæðið bætir upp það fasta.</p>";
        math(fb); onSolved(); return;
      }
      var h = '<p class="result no">' + (S > p.target ? "Of mikið" : "Of lítið") + " í birgðinni á tíma $T$.</p>" + base;
      if (empty !== null && empty < p.T) h += "<p>Birgðin tæmdist áður en tíminn var liðinn.</p>";
      h += "<p><i>Vísbending:</i> hvaða nettóflæði þarf til að fara úr $" + p.S0 + "$ í $" + p.target + "$ á $" + p.T + "$ " + esc(c.tu) + "? Mundu að nettóflæði = innflæði − útflæði.</p>";
      fb.innerHTML = h; math(fb);
    }
    newCase();
  }

  /* =====================================================================
   * Borð 4: jafnvægislykkja (útflæði í hlutfalli við birgð)
   * ===================================================================== */
  var EQ = [
    { dom: "Húsnæðismarkaður", u: "íbúðir", fu: "íbúðir/ár", tu: "ár", horizon: 150, mk: function () {
        var d = pick([2, 2.5, 4, 5]), k = rnd(8, 20) * (d === 2.5 ? 2 : 1), St = k * 10000, I = St * d / 100;
        return { d: d / 100, target: St, ans: I, S0: Math.round(St * pick([0.6, 0.7, 1.3]) / 1000) * 1000, max: I * 3, step: 50,
          text: "Á hverju ári hverfa " + String(d).replace(".", ",") + " % af íbúðastofninum úr notkun (úrelding, niðurrif, breytt notkun). Markmiðið er að stofninn nái jafnvægi við " + nf(St) + " íbúðir. Stilltu <b>fjölda nýbygginga á ári</b>." };
      } },
    { dom: "Ferðaþjónusta", u: "ferðamenn", fu: "komur/dag", tu: "dagar", horizon: 50, mk: function () {
        var D = rnd(3, 9), I = rnd(4, 14) * 500, St = I * D;
        return { d: 1 / D, target: St, ans: I, S0: Math.round(St * pick([0.3, 0.5, 1.5]) / 100) * 100, max: 20000, step: 250,
          text: "Ferðamenn dvelja að meðaltali í " + D + " daga, svo á hverjum degi fer 1/" + D + " þeirra sem eru á landinu. Gistirými leyfir að " + nf(St) + " ferðamenn séu á landinu í einu. Stilltu <b>fjölda koma á dag</b> svo jafnvægið verði nákvæmlega það." };
      } },
    { dom: "Kvótakerfið", u: "tonn", fu: "tonn/ár", tu: "ár", horizon: 30, mk: function () {
        var d = pick([20, 25, 40, 50]), St = rnd(4, 12) * 100000, I = St * d / 100;
        return { d: d / 100, target: St, ans: I, S0: Math.round(St * pick([0.5, 0.6, 1.4]) / 10000) * 10000, max: I * 3, step: 5000,
          text: "Í einföldu stofnlíkani bætast árlega við nýliðun (tonn á ári) og samtals " + d + " % stofnsins hverfa á ári (afli og náttúruleg afföll). Markmiðið er að stofninn sé í jafnvægi við " + nf(St) + " tonn. Stilltu <b>nýliðunina</b> sem samsvarar því." };
      } },
  ];
  function eqLevel(box, onSolved) {
    var c, p, ctl;
    function newCase() {
      c = pick(EQ); p = c.mk();
      box.innerHTML = "";
      box.appendChild(el("div", "w8-case", '<span class="w8-dom">' + esc(c.dom) + "</span><p>" + p.text + "</p><p>Útflæðið er $d\\cdot S$, svo þetta er <b>jafnvægislykkja</b>: því stærri sem birgðin er, því meira fer út.</p>"));
      box.appendChild(el("div", "w8-facts",
        "<div><b>" + nf(p.S0) + "</b><span>upphafsbirgð (" + esc(c.u) + ")</span></div>" +
        "<div><b>" + nf(p.target) + "</b><span>markmið $S^*$ (" + esc(c.u) + ")</span></div>" +
        "<div><b>" + nf(p.d * 100, p.d * 100 % 1 ? 2 : 0) + " %</b><span>útflæðishlutfall $d$ á tímaeiningu</span></div>"));
      ctl = control("Innflæði", 0, p.max, p.step, Math.round(p.max / 5 / p.step) * p.step, c.fu);
      box.appendChild(ctl.el);
      var plot = el("div", "", chart([], { xmax: c.horizon, ymax: Math.max(p.target, p.S0) * 1.6, target: p.target, xlabel: "tími [" + c.tu + "]", aria: "Birgð yfir tíma" }));
      box.appendChild(plot);
      var fb = el("div", "w8-fb"); fb.hidden = true;
      var bt = el("div", "w8-btns");
      bt.appendChild(btn("btn", "Keyra hermun", function () { run(plot, fb); }));
      bt.appendChild(btn("btn ghost", "Nýtt dæmi", newCase));
      box.appendChild(bt); box.appendChild(fb);
      math(box);
    }
    function run(plot, fb) {
      var I = ctl.get();
      if (!isFinite(I) || I < 0) { fb.hidden = false; fb.innerHTML = '<p class="result no">Sláðu inn jákvæða tölu.</p>'; return; }
      var S = p.S0, pts = [[0, S]];
      for (var t = 1; t <= c.horizon; t++) { S = S + I - p.d * S; pts.push([t, S]); }
      var Seq = I / p.d, ymax = Math.max(p.target, p.S0, Seq) * 1.25;
      plot.innerHTML = chart([{ pts: pts, color: "var(--mag)" }, { pts: [[0, Seq], [c.horizon, Seq]], color: "var(--phase)", dash: "2 5" }],
        { xmax: c.horizon, ymax: ymax, target: p.target, xlabel: "tími [" + c.tu + "]", aria: "Birgð yfir tíma og jafnvægisgildi" });
      fb.hidden = false;
      var dtx = String(+(p.d).toFixed(4)).replace(".", "{,}");
      var base = "<p>Jafnvægi þar sem inn = út: $I = d\\,S^* \\Rightarrow S^* = I/d = " + nf(I).replace(/ /g, "\\,") + "/" + dtx + " = " + nf(Seq).replace(/ /g, "\\,").replace(",", "{,}") + "$ " + esc(c.u) + " (doppótta línan).</p>";
      if (Math.abs(Seq - p.target) <= 0.005 * p.target) {
        fb.innerHTML = '<p class="result ok">Rétt! Birgðin leitar að markmiðinu og helst þar.</p>' + base +
          "<p>Taktu eftir lögun ferilsins: jafnvægislykkja lokar bilinu hratt í fyrstu og hægar eftir því sem bilið minnkar (markmiðsleit).</p>";
        math(fb); onSolved(); return;
      }
      fb.innerHTML = '<p class="result no">Jafnvægið er ' + (Seq > p.target ? "of hátt" : "of lágt") + ".</p>" + base +
        "<p><i>Vísbending:</i> í jafnvægi er innflæðið jafnt útflæðinu, $I = d\\cdot S^*$. Hvaða $I$ gefur $S^* = " + nf(p.target).replace(/ /g, "\\,") + "$?</p>";
      math(fb);
    }
    newCase();
  }

  /* =====================================================================
   * Aðalviðmót
   * ===================================================================== */
  var LEVELS = [
    { name: "Borð 1: lykkjuspæjari", mount: function (b, ok) { loopLevel(b, 1, ok); } },
    { name: "Borð 2: baðkarið", mount: function (b, ok) { tubLevel(b, ok); } },
    { name: "Borð 3: fleiri mínusar", mount: function (b, ok) { loopLevel(b, 3, ok); } },
    { name: "Borð 4: jafnvægi", mount: function (b, ok) { eqLevel(b, ok); } },
    { name: "Borð 5: tvær lykkjur", mount: function (b, ok) { loopLevel(b, 5, ok); } },
  ];

  register("kafli-8", function (root, api) {
    var app = root.querySelector("#k8-app");
    if (!app) return;
    if (!document.getElementById("w8-css")) { var st = document.createElement("style"); st.id = "w8-css"; st.textContent = CSS; document.head.appendChild(st); }
    var solved = LEVELS.map(function () { return false; }), cur = 0, finished = false;
    app.innerHTML = "";
    var tabs = el("div", "w8-tabs"); tabs.setAttribute("role", "tablist");
    var head = el("div", "w8-head");
    var box = el("div");
    var nextWrap = el("div", "w8-btns");
    app.appendChild(tabs); app.appendChild(head); app.appendChild(box); app.appendChild(nextWrap);

    function drawTabs() {
      tabs.innerHTML = "";
      LEVELS.forEach(function (L, i) {
        var open = i === 0 || solved[i - 1] || solved[i];
        var b = btn("w8-tab", esc(L.name) + (solved[i] ? '<span class="w8-ok">✓</span>' : ""), function () { show(i); });
        b.setAttribute("role", "tab"); b.setAttribute("aria-selected", String(i === cur)); b.disabled = !open;
        tabs.appendChild(b);
      });
      var n = solved.filter(Boolean).length;
      head.innerHTML = "<span>" + esc(LEVELS[cur].name) + "</span><span>" + n + " af " + LEVELS.length + " borðum leyst</span>";
    }
    function show(i) {
      cur = i; nextWrap.innerHTML = ""; drawTabs();
      LEVELS[i].mount(box, function () { solvedLevel(i); });
    }
    function solvedLevel(i) {
      solved[i] = true; drawTabs();
      var n = solved.filter(Boolean).length;
      nextWrap.innerHTML = "";
      if (n === LEVELS.length) {
        if (!finished) { finished = true; api.done("Vel gert! Þú greindir pólun tengsla og lykkja og stilltir birgðir og flæði í öllum fimm borðum."); }
        return;
      }
      api.status && api.status("Þú hefur leyst " + n + " af " + LEVELS.length + " borðum.");
      var nxt = solved.indexOf(false, i + 1); if (nxt < 0) nxt = solved.indexOf(false);
      nextWrap.appendChild(btn("btn", "Áfram í " + esc(LEVELS[nxt].name.split(":")[0].toLowerCase()) + " →", function () { show(nxt); app.scrollIntoView({ block: "start" }); }));
    }
    api.status && api.status("Þú hefur leyst 0 af " + LEVELS.length + " borðum.");
    show(0);
  });
})();

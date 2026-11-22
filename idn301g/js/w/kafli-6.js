/* w/kafli-6.js – gagnvirka skrefið í kafla 6: flæðigreinandinn og biðraðastjórinn.
 * Borð 1: hringrásartími samsetts BPMN-ferlis (endursending, AND, röð, XOR).
 * Borð 2: nýtni ferils (CTE) þegar biðtíma er bætt við.
 * Borð 3: lögmál Little (WIP og nauðsynleg stytting CT).
 * Borð 4: M/M/c – minnsta mönnun sem nær biðtímamarkmiði.
 * Borð 5: M/M/c – lágmarka heildarkostnað (laun + kostnaður biðar) með fjölda og þjálfunarstigi.
 * api.done() er kallað þegar öll fimm borðin eru leyst. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  function register(id, fn) { if (typeof TK.widget === "function") TK.widget(id, fn); else (TK._widgetQueue = TK._widgetQueue || []).push([id, fn]); }

  /* ---------- Hjálparföll ---------- */
  var rnd = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var math = function (el) { if (typeof window.renderMath === "function") window.renderMath(el); };
  var is = function (x, sig) { var v = Number(Number(x).toPrecision(sig || 4)); return String(v).replace(".", ","); };
  var tx = function (x, sig) { return is(x, sig).replace(",", "{,}"); };
  var kr = function (x) { return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " kr."; };
  var num = function (s) { s = String(s).replace(/\s+/g, "").replace(/−/g, "-").replace(/%/g, "").replace(",", "."); return s === "" ? NaN : Number(s); };
  var near = function (v, a, tol) { return isFinite(v) && Math.abs(v - a) <= Math.max(tol * Math.abs(a), 1e-9); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  // M/M/c (BPM kafli 7.2, formúla 7.13)
  function mmc(lam, mu, c) {
    var a = lam / mu, rho = a / c;
    if (rho >= 1) return { a: a, rho: rho, Lq: Infinity, Wq: Infinity, W: Infinity, L: Infinity };
    var sum = 0, t = 1;
    for (var n = 0; n < c; n++) { if (n > 0) t *= a / n; sum += t; }
    var ac = t * a / c, top = ac / (1 - rho), P0 = 1 / (sum + top);
    var Lq = ac * rho * P0 / ((1 - rho) * (1 - rho)), Wq = Lq / lam;
    return { a: a, rho: rho, Lq: Lq, Wq: Wq, W: Wq + 1 / mu, L: lam * (Wq + 1 / mu), Pw: top * P0 };
  }

  var CSS = [
    ".w6-tabs{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 1rem}",
    ".w6-tab{font:600 .88rem var(--sans);padding:.42rem .8rem;border:1px solid var(--rule-2);border-radius:99px;background:var(--raised);color:var(--ink);cursor:pointer}",
    ".w6-tab[aria-selected=true]{background:var(--key-bg);border-color:var(--mag);color:var(--mag)}",
    ".w6-tab:disabled{opacity:.5;cursor:not-allowed}",
    ".w6-tab .w6-ok{color:var(--good);margin-left:.3rem}",
    ".w6-case{border:1px solid var(--rule);border-left:4px solid var(--mag);border-radius:8px;background:var(--raised);padding:.8rem 1rem;margin:.2rem 0 .9rem}",
    ".w6-case p:last-child{margin-bottom:0}",
    ".w6-fig{overflow-x:auto;margin:.6rem 0}",
    ".w6-fig svg{display:block;min-width:520px;width:100%;height:auto;font:12px var(--sans);fill:var(--ink)}",
    ".w6-ctrl{display:flex;flex-wrap:wrap;gap:1rem;align-items:center;margin:.6rem 0}",
    ".w6-step{display:inline-flex;align-items:center;gap:.4rem;font:600 .95rem var(--sans)}",
    ".w6-step button{min-width:2.4rem;font-size:1.1rem}",
    ".w6-step output{min-width:2rem;text-align:center;font-size:1.25rem;font-variant-numeric:tabular-nums}",
    ".w6-read{display:grid;grid-template-columns:repeat(auto-fit,minmax(7.5rem,1fr));gap:.5rem;margin:.8rem 0}",
    ".w6-read div{border:1px solid var(--rule);border-radius:8px;padding:.5rem .6rem;background:var(--paper-2)}",
    ".w6-read b{display:block;font:700 1.1rem var(--sans);font-variant-numeric:tabular-nums}",
    ".w6-read span{font:500 .78rem var(--sans);color:var(--muted)}",
    ".w6-read .bad b{color:var(--bad)}.w6-read .good b{color:var(--good)}",
    ".w6-bar{height:.7rem;border-radius:4px;background:var(--rule);overflow:hidden;display:flex;margin:.3rem 0 .1rem}",
    ".w6-bar i{display:block;height:100%}",
    ".w6-legend{font:500 .8rem var(--sans);color:var(--muted)}",
    ".w6-legend i{display:inline-block;width:.75rem;height:.75rem;border-radius:2px;margin:0 .25rem -.1rem .6rem}",
    ".w6-sol{border-top:1px solid var(--rule);margin-top:.8rem;padding-top:.6rem}",
    ".w6-done{font:600 1rem var(--sans);color:var(--good)}",
  ].join("\n");

  /* ---------- Ferli: samhengi og blokkir ---------- */
  var CTX = [
    { p: "Tjónaferli tryggingafélags", u: "klst", n: ["Yfirfara tilkynningu", "Sækja lögreglu­skýrslu", "Fá viðgerðarmat", "Meta tjónið", "Skoðun matsmanns", "Einföld afgreiðsla"], xl: ["stór tjón", "önnur"], loop: "gögn vantar" },
    { p: "Umsóknir um námsstyrk", u: "dagar", n: ["Fara yfir umsókn", "Staðfesta skólavist", "Sækja tekjur", "Reikna styrk", "Mat nefndar", "Stöðluð afgreiðsla"], xl: ["utan reglna", "innan reglna"], loop: "fylgiskjöl vantar" },
    { p: "Viðhaldsbeiðnir fasteignafélags", u: "klst", n: ["Greina beiðni", "Panta varahlut", "Bóka iðnaðarmann", "Skipuleggja verk", "Viðgerð á staðnum", "Leiðbeina í síma"], xl: ["heimsókn", "sími"], loop: "lýsing ófullnægjandi" },
    { p: "Týndur farangur hjá flugfélagi", u: "klst", n: ["Skrá tilkynningu", "Leita í kerfi", "Hafa samband við flugvöll", "Staðfesta eiganda", "Senda tösku heim", "Greiða bætur"], xl: ["taska finnst", "finnst ekki"], loop: "upplýsingar vantar" },
    { p: "Nýskráning í banka", u: "dagar", n: ["Yfirfara skilríki", "Áreiðanleika­könnun", "Lánshæfismat", "Stofna reikning", "Handvirk skoðun", "Sjálfvirkt samþykki"], xl: ["áhættumál", "önnur"], loop: "skilríki ógild" },
    { p: "Útflutningur á ferskum fiski", u: "klst", n: ["Gæðaskoða afla", "Útbúa skjöl", "Pakka og merkja", "Bóka flutning", "Senda með flugi", "Senda með skipi"], xl: ["hraðsending", "önnur"], loop: "stenst ekki skoðun" },
  ];
  function tv(u) { return u === "dagar" ? rnd(1, 6) : rnd(1, 10) / 2; }
  function unitTxt(x, u) { if (u !== "dagar") return is(x) + " " + u; var n = Math.round(x * 100) / 100; return is(x) + (n % 10 === 1 && n % 100 !== 11 ? " dagur" : " dagar"); }

  // Býr til ferli með blokkunum fjórum í slembiröð
  function makeProcess(withWait) {
    var c = pick(CTX), u = c.u;
    var task = function (i) { var t = { n: c.n[i], v: tv(u) }; if (withWait) t.w = u === "dagar" ? rnd(1, 8) : rnd(1, 16); return t; };
    var blocks = [
      { type: "loop", t: task(0), r: pick([0.1, 0.2, 0.25, 0.3]) },
      { type: "and", a: task(1), b: task(2) },
      { type: "seq", t: task(3) },
      { type: "xor", a: task(4), b: task(5), p: rnd(2, 8) / 10 },
    ];
    if (blocks[1].a.v === blocks[1].b.v) blocks[1].b.v += u === "dagar" ? 1 : 0.5;
    // endursending fremst (eins og á glæru 7), hinar í slembiröð
    blocks = [blocks[0]].concat(shuffle(blocks.slice(1)));
    return { c: c, u: u, blocks: blocks };
  }
  // flæðigreining: f(task) gefur tíma aðgerðar
  function flow(proc, f) {
    var parts = [], total = 0;
    proc.blocks.forEach(function (b) {
      var v, s;
      if (b.type === "seq") { v = f(b.t); s = tx(v); }
      else if (b.type === "loop") { v = f(b.t) / (1 - b.r); s = "\\dfrac{" + tx(f(b.t)) + "}{1-" + tx(b.r) + "}"; }
      else if (b.type === "and") { v = Math.max(f(b.a), f(b.b)); s = "\\max(" + tx(f(b.a)) + ";\\," + tx(f(b.b)) + ")"; }
      else { v = b.p * f(b.a) + (1 - b.p) * f(b.b); s = "(" + tx(b.p) + "\\cdot " + tx(f(b.a)) + " + " + tx(1 - b.p) + "\\cdot " + tx(f(b.b)) + ")"; }
      parts.push({ s: s, v: v, type: b.type }); total += v;
    });
    return { total: total, parts: parts };
  }
  var NAMES = { seq: "línuleg", loop: "endursending", and: "samhliða", xor: "valkvæð" };
  function flowTex(fl, unit) {
    return "$$CT = " + fl.parts.map(function (p) { return p.s; }).join(" + ") + "$$$$= " + fl.parts.map(function (p) { return tx(p.v); }).join(" + ") + " = " + tx(fl.total) + "\\text{ " + unit + "}$$";
  }

  /* ---------- SVG-teikning ferlis ---------- */
  function drawProcess(proc) {
    var Y = 125, W = 100, H = 46, x = 0, out = [], u = proc.u, id = "w6m" + rnd(1000, 9999);
    var S = "stroke:var(--ink);stroke-width:1.5";
    var arrow = function (pts) { return '<path d="M' + pts.map(function (p) { return p.join(","); }).join(" L") + '" fill="none" style="stroke:var(--ink);stroke-width:1.4" marker-end="url(#' + id + ')"/>'; };
    var label = function (x0, y0, t, st) { return '<text x="' + x0 + '" y="' + y0 + '" text-anchor="middle" style="' + (st || "") + '">' + esc(t) + "</text>"; };
    var box = function (x0, cy, t) {
      var words = [], lines = [], cur = "";
      t.n.split(" ").forEach(function (w) { if (w.replace(/\u00ad/g, "").length > 13 && w.indexOf("\u00ad") > 0) { var ps = w.split("\u00ad"); words.push(ps[0] + "-", ps.slice(1).join("")); } else words.push(w); });
      words.forEach(function (w) { if ((cur + " " + w).trim().length > 13 && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); });
      lines.push(cur);
      var s = '<rect x="' + x0 + '" y="' + (cy - H / 2) + '" width="' + W + '" height="' + H + '" rx="8" style="fill:var(--raised);' + S + '"/>';
      lines.forEach(function (l, i) { s += label(x0 + W / 2, cy + 4 + (i - (lines.length - 1) / 2) * 13, l.replace(/\u00ad/g, "")); });
      s += label(x0 + W / 2, cy + H / 2 + 15, unitTxt(t.v, u), "fill:var(--mag);font-weight:700");
      return s;
    };
    var gw = function (cx, kind) {
      var s = '<path d="M' + cx + "," + (Y - 15) + " L" + (cx + 15) + "," + Y + " L" + cx + "," + (Y + 15) + " L" + (cx - 15) + "," + Y + ' Z" style="fill:var(--raised);' + S + '"/>';
      s += kind === "x" ? '<path d="M' + (cx - 6) + "," + (Y - 6) + " L" + (cx + 6) + "," + (Y + 6) + " M" + (cx + 6) + "," + (Y - 6) + " L" + (cx - 6) + "," + (Y + 6) + '" style="stroke:var(--ink);stroke-width:2.5"/>'
        : '<path d="M' + cx + "," + (Y - 8) + " L" + cx + "," + (Y + 8) + " M" + (cx - 8) + "," + Y + " L" + (cx + 8) + "," + Y + '" style="stroke:var(--ink);stroke-width:2.5"/>';
      return s;
    };
    out.push('<circle cx="18" cy="' + Y + '" r="10" fill="none" style="' + S + '"/>');
    x = 28;
    proc.blocks.forEach(function (b) {
      if (b.type === "seq") {
        out.push(arrow([[x, Y], [x + 18, Y]]), box(x + 19, Y, b.t)); x += 19 + W;
      } else if (b.type === "loop") {
        out.push(arrow([[x, Y], [x + 18, Y]]), gw(x + 34, "x"), arrow([[x + 49, Y], [x + 66, Y]]), box(x + 67, Y, b.t), arrow([[x + 67 + W, Y], [x + 67 + W + 17, Y]]), gw(x + 67 + W + 33, "x"));
        out.push(arrow([[x + 67 + W + 33, Y - 15], [x + 67 + W + 33, 50], [x + 34, 50], [x + 34, Y - 16]]));
        out.push(label(x + 117, 44, Math.round(b.r * 100) + " % endursent"));
        x += 67 + W + 48;
      } else {
        var k = b.type === "xor" ? "x" : "+", gx = x + 34, tx0 = x + 70, jx = tx0 + W + 34;
        out.push(arrow([[x, Y], [x + 18, Y]]), gw(gx, k));
        out.push(arrow([[gx, Y - 15], [gx, 62], [tx0 - 1, 62]]), arrow([[gx, Y + 15], [gx, 188], [tx0 - 1, 188]]));
        out.push(box(tx0, 62, b.a), box(tx0, 188, b.b));
        out.push(arrow([[tx0 + W, 62], [jx, 62], [jx, Y - 16]]), arrow([[tx0 + W, 188], [jx, 188], [jx, Y + 16]]), gw(jx, k));
        if (b.type === "xor") out.push(label(gx - 5, 58, Math.round(b.p * 100) + " %", "font-weight:700;text-anchor:end"), label(gx - 5, 200, Math.round((1 - b.p) * 100) + " %", "font-weight:700;text-anchor:end"));
        x = jx + 15;
      }
    });
    out.push(arrow([[x, Y], [x + 20, Y]]), '<circle cx="' + (x + 31) + '" cy="' + Y + '" r="10" fill="none" style="stroke:var(--ink);stroke-width:3"/>');
    var w = x + 46;
    return '<svg viewBox="0 0 ' + w + ' 240" role="img" aria-label="BPMN-líkan: ' + esc(proc.c.p) + '"><defs><marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink)"/></marker></defs>' + out.join("") + "</svg>";
  }
  function describe(proc) {
    // textalýsing fyrir skjálesara og síma
    return "<ol>" + proc.blocks.map(function (b) {
      if (b.type === "seq") return "<li>" + b.t.n.replace(/\u00ad/g, "") + " (" + unitTxt(b.t.v, proc.u) + ")</li>";
      if (b.type === "loop") return "<li>" + b.t.n.replace(/\u00ad/g, "") + " (" + unitTxt(b.t.v, proc.u) + "), endurtekið í " + Math.round(b.r * 100) + " % tilvika</li>";
      if (b.type === "and") return "<li>Samhliða (AND): " + b.a.n.replace(/\u00ad/g, "") + " (" + unitTxt(b.a.v, proc.u) + ") og " + b.b.n.replace(/\u00ad/g, "") + " (" + unitTxt(b.b.v, proc.u) + ")</li>";
      return "<li>Val (XOR): " + b.a.n.replace(/\u00ad/g, "") + " (" + Math.round(b.p * 100) + " %, " + unitTxt(b.a.v, proc.u) + ") eða " + b.b.n.replace(/\u00ad/g, "") + " (" + Math.round((1 - b.p) * 100) + " %, " + unitTxt(b.b.v, proc.u) + ")</li>";
    }).join("") + "</ol>";
  }
  function allTasks(proc) {
    var t = [];
    proc.blocks.forEach(function (b) { if (b.t) t.push(b.t); if (b.a) t.push(b.a, b.b); });
    return t;
  }

  register("kafli-6", function (root, api) {
    var app = root.querySelector("#k6-app");
    if (!app) return;
    if (!document.getElementById("w6-css")) { var st = document.createElement("style"); st.id = "w6-css"; st.textContent = CSS; document.head.appendChild(st); }

    var LEVELS = ["Hringrásartími", "Nýtni (CTE)", "Lögmál Little", "Mönnun", "Lágmarkskostnaður"];
    var solved = [false, false, false, false, false], cur = 0, finished = false;
    var tabs = document.createElement("div"); tabs.className = "w6-tabs"; tabs.setAttribute("role", "tablist");
    var stage = document.createElement("div");
    app.innerHTML = ""; app.appendChild(tabs); app.appendChild(stage);

    function renderTabs() {
      tabs.innerHTML = "";
      LEVELS.forEach(function (name, i) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "w6-tab"; b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", i === cur ? "true" : "false");
        b.disabled = i > 0 && !solved[i - 1] && !solved[i];
        b.innerHTML = "Borð " + (i + 1) + ": " + name + (solved[i] ? '<span class="w6-ok">✓</span>' : "");
        b.addEventListener("click", function () { cur = i; show(); });
        tabs.appendChild(b);
      });
    }
    function progress() {
      var n = solved.filter(Boolean).length;
      if (n === 5 && !finished) { finished = true; api.done("Öll fimm borðin leyst: þú kannt flæðigreiningu, Little og M/M/c."); }
      else if (!finished) api.status("Þú hefur leyst " + n + " af 5 borðum.");
    }
    function win(i, msg, box) {
      var first = !solved[i];
      solved[i] = true; renderTabs(); progress();
      if (box.querySelector(".w6-done")) return;
      var p = document.createElement("p"); p.className = "w6-done";
      p.textContent = msg;
      box.appendChild(p);
      if (first && i < 4) {
        var nb = document.createElement("button"); nb.type = "button"; nb.className = "btn"; nb.textContent = "Áfram í borð " + (i + 2) + " →";
        nb.addEventListener("click", function () { cur = i + 1; show(); });
        box.appendChild(nb);
      }
    }
    function result(el, ok, html) { el.className = "result " + (ok ? "ok" : "no"); el.innerHTML = html; math(el); }
    function answerForm(label, unit, onCheck) {
      var f = document.createElement("form"); f.className = "row"; f.setAttribute("autocomplete", "off"); f.style.marginTop = "0.8rem";
      var idn = "w6in" + rnd(1e5, 1e6);
      f.innerHTML = '<div><label class="f" for="' + idn + '">' + label + (unit ? " (" + unit + ")" : "") + '</label><input id="' + idn + '" type="text" inputmode="decimal" spellcheck="false"></div><div class="fixed"><button class="btn" type="submit">Athuga</button></div>';
      f.addEventListener("submit", function (e) { e.preventDefault(); onCheck(num(f.querySelector("input").value)); });
      return f;
    }
    function newBtn(fn) { var b = document.createElement("button"); b.type = "button"; b.className = "btn ghost"; b.textContent = "Nýtt dæmi"; b.addEventListener("click", fn); return b; }
    function solBtn(html, box) {
      var b = document.createElement("button"); b.type = "button"; b.className = "btn ghost"; b.textContent = "Sýna lausn";
      b.addEventListener("click", function () { var d = document.createElement("div"); d.className = "w6-sol"; d.innerHTML = html; box.appendChild(d); math(d); b.disabled = true; });
      return b;
    }

    /* ----- Borð 1: CT ----- */
    function level1() {
      var proc = makeProcess(false), fl = flow(proc, function (t) { return t.v; }), tries = 0;
      stage.innerHTML = '<div class="w6-case"><p><b>' + esc(proc.c.p) + ".</b> Reiknaðu meðal hringrásartíma (CT) eins máls í gegnum ferlið. Tölurnar undir aðgerðunum eru meðaltímar.</p></div>" +
        '<div class="w6-fig">' + drawProcess(proc) + "</div><details><summary>Ferlið í texta</summary>" + describe(proc) + "</details>";
      var box = document.createElement("div"), res = document.createElement("p"), ctl = document.createElement("div");
      ctl.className = "row"; ctl.style.marginTop = ".6rem";
      box.appendChild(answerForm("Hringrásartími CT", proc.u, function (v) {
        tries++;
        if (near(v, fl.total, 0.02)) { result(res, true, "✓ Rétt! " + flowTex(fl, proc.u)); win(0, "Borð 1 leyst.", box); }
        else {
          var hint = "Skiptu ferlinu í fjórar blokkir og reiknaðu hverja fyrir sig.";
          var sumAnd = proc.blocks.filter(function (b) { return b.type === "and"; })[0];
          if (sumAnd && near(v, fl.total - Math.max(sumAnd.a.v, sumAnd.b.v) + sumAnd.a.v + sumAnd.b.v, 0.01)) hint = "Þú lagðir samhliða greinarnar saman. Fyrir tíma gildir $\\max(T_1, T_2)$.";
          else if (tries >= 2) hint = "Blokkirnar gefa: " + fl.parts.map(function (p) { return NAMES[p.type] + " $" + p.s + "$"; }).join(", ") + ".";
          result(res, false, "✗ Ekki rétt. " + hint);
        }
      }));
      box.appendChild(res); ctl.appendChild(newBtn(level1)); ctl.appendChild(solBtn("<p>Blokk fyrir blokk:</p>" + flowTex(fl, proc.u), box));
      stage.appendChild(box); stage.appendChild(ctl); math(stage);
    }

    /* ----- Borð 2: CTE ----- */
    function level2() {
      var proc = makeProcess(true), u = proc.u;
      var tct = flow(proc, function (t) { return t.v; }), ct = flow(proc, function (t) { return t.v + t.w; }), cte = 100 * tct.total / ct.total;
      var rows = allTasks(proc).map(function (t) { return "<tr><td>" + esc(t.n.replace(/\u00ad/g, "")) + "</td><td>" + is(t.v) + "</td><td>" + is(t.w) + "</td></tr>"; }).join("");
      stage.innerHTML = '<div class="w6-case"><p><b>' + esc(proc.c.p) + ".</b> Mælingar sýna að mál bíða á undan hverri aðgerð. Tölurnar á myndinni eru vinnslutímar; taflan sýnir líka biðtímann (í " + u + "). Biðin endurtekst með aðgerðinni í endursendingu.</p></div>" +
        '<div class="w6-fig">' + drawProcess(proc) + '</div><div class="tablewrap"><table><thead><tr><th>Aðgerð</th><th>Vinnslutími</th><th>Biðtími</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
        "<p>Reiknaðu $TCT$ (bara vinnslutímar) og $CT$ (vinnsla + bið) með blokkareglunum og svo $CTE = TCT/CT$.</p>";
      var box = document.createElement("div"), res = document.createElement("p"), ctl = document.createElement("div");
      ctl.className = "row"; ctl.style.marginTop = ".6rem";
      var sol = "<p>TCT (vinnslutímar):</p>" + flowTex(tct, u).replace("CT =", "TCT =") + "<p>CT (vinnsla + bið):</p>" + flowTex(ct, u) +
        "$$CTE = \\frac{" + tx(tct.total) + "}{" + tx(ct.total) + "} = " + tx(cte, 3) + "\\,\\%$$";
      box.appendChild(answerForm("Nýtni ferilsins CTE", "%", function (v) {
        if (v > 0 && v <= 1 && near(v * 100, cte, 0.02)) v = v * 100;
        if (near(v, cte, 0.02)) { result(res, true, "✓ Rétt: CTE = " + is(cte, 3) + " %. Málið er í bið " + is(100 - cte, 3) + " % tímans."); win(1, "Borð 2 leyst.", box); }
        else {
          var naive = 100 * allTasks(proc).reduce(function (s, t) { return s + t.v; }, 0) / allTasks(proc).reduce(function (s, t) { return s + t.v + t.w; }, 0);
          result(res, false, "✗ Ekki rétt. " + (near(v, naive, 0.02) ? "Þú lagðir alla tíma saman. TCT og CT fylgja blokkareglunum: XOR vegið, AND hámark, endursending deilt með $1-r$." : "Byrjaðu á TCT; það er sami útreikningur og í borði 1. Svo CT með vinnslu + bið hverrar aðgerðar."));
        }
      }));
      box.appendChild(res); ctl.appendChild(newBtn(level2)); ctl.appendChild(solBtn(sol, box));
      stage.appendChild(box); stage.appendChild(ctl); math(stage);
    }

    /* ----- Borð 3: Little ----- */
    function level3() {
      var c = pick(CTX), lam = rnd(4, 20) * 3, ctm = rnd(3, 16) * 5, wip = lam * ctm / 60, grow = pick([20, 25, 50]), ct2 = ctm / (1 + grow / 100), step = 0;
      var place = pick(["Þjónustuver tryggingafélags", "Móttaka heilsugæslu", "Afgreiðsla byggingavöruverslunar", "Símaver bankans"]);
      stage.innerHTML = '<div class="w6-case"><p><b>' + place + ".</b> Að meðaltali koma $\\lambda = " + lam + "$ viðskiptavinir á klukkustund og hver er að meðaltali $" + ctm + "$ mínútur á staðnum frá komu til brottfarar. Kerfið er stöðugt.</p></div>";
      var box = document.createElement("div"), res = document.createElement("p"), q2 = document.createElement("div"), res2 = document.createElement("p");
      var f1 = answerForm("(a) Hve margir eru að meðaltali á staðnum (WIP)?", "viðskiptavinir", function (v) {
        if (near(v, wip, 0.02)) { result(res, true, "✓ Rétt: $WIP = \\lambda\\cdot CT = " + lam + "\\cdot \\frac{" + ctm + "}{60} = " + tx(wip) + "$."); if (step === 0) { step = 1; q2.hidden = false; } }
        else result(res, false, near(v, lam * ctm, 0.02) ? "✗ Gættu að einingum: $\\lambda$ er á klukkustund en CT í mínútum." : "✗ Ekki rétt. Lögmál Little: $WIP = \\lambda \\cdot CT$, í sömu tímaeiningu.");
      });
      q2.hidden = true;
      q2.appendChild(document.createElement("p")).innerHTML = "(b) Komutakturinn eykst um " + grow + " %. Rýmið rúmar bara jafnmarga og nú. Hve margar mínútur má hver viðskiptavinur að hámarki vera að meðaltali til að WIP haldist óbreytt?";
      q2.appendChild(answerForm("(b) Nýr hringrásartími", "mín", function (v) {
        if (near(v, ct2, 0.02)) { result(res2, true, "✓ Rétt: $CT = WIP/\\lambda = " + tx(wip) + "/" + tx(lam * (1 + grow / 100)) + " = " + tx(ct2 / 60) + "$ klst $= " + tx(ct2) + "$ mín."); win(2, "Borð 3 leyst.", box); }
        else result(res2, false, near(v, ctm * (1 - grow / 100), 0.02) ? "✗ Ekki alveg: CT minnkar í hlutfallinu $1/(1+" + tx(grow / 100) + ")$, ekki um " + grow + " %." : "✗ Ekki rétt. Nýr komutaktur er $" + tx(lam * (1 + grow / 100)) + "$ á klst; notaðu $CT = WIP/\\lambda$.");
      }));
      q2.appendChild(res2);
      box.appendChild(f1); box.appendChild(res); box.appendChild(q2);
      var ctl = document.createElement("div"); ctl.className = "row"; ctl.style.marginTop = ".6rem"; ctl.appendChild(newBtn(level3));
      stage.appendChild(box); stage.appendChild(ctl); math(stage);
    }

    /* ----- Borð 4: minnsta mönnun ----- */
    function level4() {
      var st = pick([4, 5, 6, 8, 10]), mu = 60 / st, lam = rnd(Math.ceil(mu * 2.2), Math.floor(mu * 5.6)), target = pick([0.5, 1, 2, 3]), wage = pick([5500, 6000, 6500, 7000]);
      var cmin = Math.floor(lam / mu) + 1, copt = cmin;
      while (mmc(lam, mu, copt).Wq * 60 > target) copt++;
      var c = cmin - 1 > 0 ? cmin - 1 : 1, stepA = false;
      var place = pick(["Símaver tryggingafélags", "Þjónustuborð týnds farangurs", "Afgreiðsla Tryggingastofnunar", "Símaver heilsugæslunnar"]);
      stage.innerHTML = '<div class="w6-case"><p><b>' + place + ".</b> Að meðaltali berast $\\lambda = " + lam + "$ erindi á klst og hvert tekur að meðaltali " + st + " mínútur ($\\mu = " + tx(mu) + "$ á klst). Starfsmenn vinna úr einni sameiginlegri röð (M/M/c) og kosta " + kr(wage) + " á klst hver. <b>Markmið:</b> meðalbiðtími í röð $W_q \\le " + tx(target) + "$ mín með sem fæstum starfsmönnum.</p></div>";
      var box = document.createElement("div"), res = document.createElement("p"), part2 = document.createElement("div"), res2 = document.createElement("p");
      box.appendChild(answerForm("Skref 1: hver er minnsti fjöldi starfsmanna svo kerfið sé stöðugt?", "starfsmenn", function (v) {
        if (v === cmin) { result(res, true, "✓ Rétt: $\\lambda/\\mu = " + tx(lam / mu) + "$, og $\\rho = \\lambda/(c\\mu) \\lt 1$ krefst $c \\ge " + cmin + "$. En stöðugt er ekki það sama og gott: skoðaðu biðina."); if (!stepA) { stepA = true; part2.hidden = false; c = cmin; upd(); } }
        else result(res, false, v < lam / mu ? "✗ Með " + v + " starfsmenn er $\\rho = " + tx(lam / (v * mu), 3) + " \\ge 1$: röðin vex endalaust." : "✗ Of margir. Kerfið er stöðugt um leið og $c\\mu \\gt \\lambda$.");
      }));
      box.appendChild(res);
      part2.hidden = true;
      part2.innerHTML = "<p><b>Skref 2:</b> stilltu fjölda starfsmanna og staðfestu þegar þú hefur fundið minnstu mönnun sem nær markmiðinu.</p>" +
        '<div class="w6-ctrl"><span class="w6-step">Starfsmenn $c$: <button type="button" class="btn ghost" data-d="-1" aria-label="Fækka starfsmönnum">−</button><output aria-live="polite">1</output><button type="button" class="btn ghost" data-d="1" aria-label="Fjölga starfsmönnum">+</button></span>' +
        '<button type="button" class="btn" data-ok>Staðfesta mönnun</button></div><div class="w6-read" aria-live="polite"></div>';
      part2.appendChild(res2);
      var out = part2.querySelector("output"), read = part2.querySelector(".w6-read");
      function upd() {
        out.textContent = c;
        var q = mmc(lam, mu, c), stable = q.rho < 1, okT = stable && q.Wq * 60 <= target;
        read.innerHTML = '<div class="' + (stable ? "" : "bad") + '"><b>' + (stable ? is(q.rho * 100, 3) + " %" : "≥ 100 %") + "</b><span>nýting ρ</span></div>" +
          "<div><b>" + (stable ? is(q.Lq, 3) : "∞") + "</b><span>í röð, L<sub>q</sub></span></div>" +
          '<div class="' + (okT ? "good" : "bad") + '"><b>' + (stable ? is(q.Wq * 60, 3) + " mín" : "∞") + "</b><span>bið, W<sub>q</sub></span></div>" +
          "<div><b>" + (stable ? is(q.W * 60, 3) + " mín" : "∞") + "</b><span>í kerfi, W</span></div>" +
          "<div><b>" + kr(c * wage) + "</b><span>launakostnaður á klst</span></div>";
      }
      part2.querySelectorAll("[data-d]").forEach(function (b) { b.addEventListener("click", function () { c = Math.max(1, Math.min(30, c + Number(b.getAttribute("data-d")))); upd(); }); });
      part2.querySelector("[data-ok]").addEventListener("click", function () {
        var q = mmc(lam, mu, c);
        if (c === copt) { result(res2, true, "✓ Rétt: " + c + " starfsmenn gefa $W_q = " + tx(q.Wq * 60, 3) + "$ mín" + (c > cmin ? ", en með " + (c - 1) + " væri biðin $" + tx(mmc(lam, mu, c - 1).Wq * 60, 3) + "$ mín" : "") + ". Taktu eftir hve mikið biðin styttist við hvern starfsmann nálægt $\\rho \\approx 1$."); win(3, "Borð 4 leyst.", box); }
        else if (c > copt) result(res2, false, "✗ Markmiðinu er náð, en of dýrt: prófaðu færri starfsmenn.");
        else result(res2, false, "✗ Biðin er enn yfir markmiðinu.");
      });
      box.appendChild(part2);
      var ctl = document.createElement("div"); ctl.className = "row"; ctl.style.marginTop = ".6rem"; ctl.appendChild(newBtn(level4));
      stage.appendChild(box); stage.appendChild(ctl); math(stage);
    }

    /* ----- Borð 5: lágmarka heildarkostnað ----- */
    function level5() {
      var sc, best, second, lam, mu0, k, wage, opts;
      do {
        var st = pick([5, 6, 8, 10, 12]); mu0 = 60 / st; lam = rnd(Math.ceil(mu0 * 2), Math.floor(mu0 * 6)); k = pick([4000, 6000, 8000, 10000, 15000]); wage = pick([5000, 6000, 7000]);
        opts = [
          { n: "Óbreytt", d: "afgreiðslutími " + st + " mín", mu: mu0, w: wage },
          { n: "Þjálfun", d: "20 % hraðari afgreiðsla, laun +10 %", mu: mu0 * 1.2, w: wage * 1.1 },
          { n: "Nýtt kerfi", d: "50 % hraðari afgreiðsla, +45 % á starfsmann (laun + leyfi)", mu: mu0 * 1.5, w: wage * 1.45 },
        ];
        var all = [];
        opts.forEach(function (o, i) { for (var c = 1; c <= 30; c++) { var q = mmc(lam, o.mu, c); if (q.rho < 1) all.push({ i: i, c: c, cost: c * o.w + k * q.Lq }); } });
        all.sort(function (a, b) { return a.cost - b.cost; });
        best = all[0]; second = all[1];
      } while (second.cost - best.cost < 0.015 * best.cost);
      var sel = { i: 0, c: Math.floor(lam / mu0) + 1 };
      stage.innerHTML = '<div class="w6-case"><p><b>Afgreiðsla bílaleigu á Keflavíkurflugvelli.</b> $\\lambda = ' + lam + "$ viðskiptavinir á klst, ein sameiginleg röð (M/M/c). Hver starfsmaður kostar " + kr(wage) + " á klst. Fyrirtækið metur að hver klukkustund sem viðskiptavinur bíður í röð kosti " + kr(k) + " (óánægja og tapaðar bókanir).</p>" +
        "<p><b>Markmið:</b> veldu fjölda starfsmanna og vinnulag sem lágmarkar <b>heildarkostnað á klst</b> $= c \\cdot \\text{laun} + " + tx(k, 6) + "\\cdot L_q$.</p></div>" +
        '<div class="chips" role="group" aria-label="Vinnulag">' + opts.map(function (o, i) { return '<button type="button" class="chip" data-o="' + i + '">' + o.n + " <small>(" + o.d + ")</small></button>"; }).join("") + "</div>" +
        '<div class="w6-ctrl"><span class="w6-step">Starfsmenn $c$: <button type="button" class="btn ghost" data-d="-1" aria-label="Fækka starfsmönnum">−</button><output aria-live="polite"></output><button type="button" class="btn ghost" data-d="1" aria-label="Fjölga starfsmönnum">+</button></span>' +
        '<button type="button" class="btn" data-ok>Staðfesta val</button></div><div class="w6-read" aria-live="polite"></div>' +
        '<div class="w6-bar" aria-hidden="true"><i class="w6-b1" style="background:var(--mag)"></i><i class="w6-b2" style="background:var(--bad)"></i></div><div class="w6-legend"><i style="background:var(--mag)"></i>laun<i style="background:var(--bad)"></i>kostnaður biðar</div>';
      var res = document.createElement("p"), box = document.createElement("div");
      var out = stage.querySelector("output"), read = stage.querySelector(".w6-read"), tries = 0;
      function upd() {
        out.textContent = sel.c;
        stage.querySelectorAll("[data-o]").forEach(function (b) { b.setAttribute("aria-pressed", Number(b.getAttribute("data-o")) === sel.i ? "true" : "false"); });
        var o = opts[sel.i], q = mmc(lam, o.mu, sel.c), stable = q.rho < 1, pay = sel.c * o.w, wait = stable ? k * q.Lq : Infinity;
        read.innerHTML = '<div class="' + (stable ? "" : "bad") + '"><b>' + (stable ? is(q.rho * 100, 3) + " %" : "≥ 100 %") + "</b><span>nýting ρ</span></div>" +
          "<div><b>" + (stable ? is(q.Wq * 60, 3) + " mín" : "∞") + "</b><span>bið, W<sub>q</sub></span></div>" +
          "<div><b>" + kr(pay) + "</b><span>laun á klst</span></div>" +
          "<div><b>" + (stable ? kr(wait) : "∞") + "</b><span>kostnaður biðar á klst</span></div>" +
          "<div><b>" + (stable ? kr(pay + wait) : "∞") + "</b><span>heildarkostnaður á klst</span></div>";
        var tot = stable ? pay + wait : 1;
        stage.querySelector(".w6-b1").style.width = (stable ? 100 * pay / tot : 0) + "%";
        stage.querySelector(".w6-b2").style.width = (stable ? 100 * wait / tot : 100) + "%";
      }
      stage.querySelectorAll("[data-o]").forEach(function (b) { b.addEventListener("click", function () { sel.i = Number(b.getAttribute("data-o")); upd(); }); });
      stage.querySelectorAll("[data-d]").forEach(function (b) { b.addEventListener("click", function () { sel.c = Math.max(1, Math.min(30, sel.c + Number(b.getAttribute("data-d")))); upd(); }); });
      stage.querySelector("[data-ok]").addEventListener("click", function () {
        tries++;
        var o = opts[sel.i], q = mmc(lam, o.mu, sel.c);
        if (q.rho >= 1) { result(res, false, "✗ Kerfið er óstöðugt ($\\rho \\ge 1$): biðröðin vex endalaust."); return; }
        var cost = sel.c * o.w + k * q.Lq;
        if (sel.i === best.i && sel.c === best.c) { result(res, true, "✓ Þetta er lágmarkið: " + kr(cost) + " á klst. Næstbesti kosturinn (" + opts[second.i].n + ", c = " + second.c + ") kostar " + kr(second.cost)); win(4, "Borð 5 leyst. Þú ert biðraðastjóri!", box); }
        else result(res, false, "✗ Til er ódýrari samsetning (" + kr(cost - best.cost) + " ódýrari á klst)." + (tries >= 3 ? " Vísbending: prófaðu „" + opts[best.i].n + "“ og breyttu fjöldanum í báðar áttir." : " Prófaðu hvert vinnulag og leitaðu að lágmarkinu: of fáir gefa dýra bið, of margir dýr laun."));
      });
      box.appendChild(res);
      var ctl = document.createElement("div"); ctl.className = "row"; ctl.style.marginTop = ".6rem"; ctl.appendChild(newBtn(level5));
      stage.appendChild(box); stage.appendChild(ctl);
      upd(); math(stage);
    }

    var RENDER = [level1, level2, level3, level4, level5];
    function show() { renderTabs(); RENDER[cur](); }
    show(); progress();
  });
})();

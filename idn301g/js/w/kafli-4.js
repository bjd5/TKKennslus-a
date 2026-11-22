/* w/kafli-4.js – gagnvirka skrefið í kafla 4: atburðaskrárspæjarinn.
 * Borð 1: afbrigði í atburðaskrá (fjöldi og algengasta).
 * Borð 2: tíðni brúa í bein-eftirfylgniriti (DFG) og fjöldi ólíkra brúa.
 * Borð 3: hegðunarvillur í BPMN-brotum (traust, deadlock, skortur á samstillingu, livelock).
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
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var num = function (s) { s = String(s).trim().replace(",", "."); return s === "" ? NaN : Number(s); };

  var CSS = [
    ".w4-tabs{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 1rem}",
    ".w4-tab{font:600 .9rem var(--sans);padding:.45rem .8rem;border:1px solid var(--rule-2);border-radius:99px;background:var(--raised);color:var(--ink);cursor:pointer}",
    ".w4-tab[aria-selected=true]{background:var(--key-bg);border-color:var(--mag);color:var(--mag)}",
    ".w4-tab:disabled{opacity:.5;cursor:not-allowed}",
    ".w4-tab .w4-ok{color:var(--good);margin-left:.3rem}",
    ".w4-legend{font:500 .88rem var(--sans);color:var(--muted);margin:.3rem 0 .6rem}",
    ".w4-legend b{color:var(--ink)}",
    ".w4-log{max-height:22rem;overflow:auto;border:1px solid var(--rule);border-radius:8px;margin:.4rem 0 .8rem}",
    ".w4-log table{margin:0;width:100%;font:500 .9rem var(--sans);border-collapse:collapse}",
    ".w4-log th,.w4-log td{padding:.3rem .6rem;border-bottom:1px solid var(--rule);text-align:left;white-space:nowrap}",
    ".w4-log th{position:sticky;top:0;background:var(--paper-2)}",
    ".w4-log td.w4-c{font-weight:700}",
    ".w4-log tr.w4-alt td{background:color-mix(in srgb,var(--mag) 6%,transparent)}",
    ".w4-q{font:700 1rem var(--sans);margin:.9rem 0 .45rem}",
    ".w4-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:.6rem}",
    ".w4-opts{display:grid;gap:.4rem}",
    ".w4-opts .opt{font-family:var(--sans)}",
    ".w4-opts .opt[aria-pressed=true]{border-color:var(--mag);background:var(--key-bg)}",
    ".w4-btns{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.9rem}",
    ".w4-fb{margin-top:.8rem;padding:.7rem .9rem;border-radius:8px;background:var(--paper-2);border:1px solid var(--rule)}",
    ".w4-fb p{margin:.3rem 0}",
    ".w4-frag{border:1px solid var(--rule);border-radius:8px;background:var(--raised);padding:.4rem;margin:.5rem 0}",
    ".w4-frag svg{width:100%;height:auto;display:block;max-width:34rem;margin:0 auto}",
    ".w4-score{font:600 .9rem var(--sans);color:var(--muted)}"
  ].join("\n");
  function css() { if (!document.getElementById("w4-css")) { var s = el("style"); s.id = "w4-css"; s.textContent = CSS; document.head.appendChild(s); } }

  /* ---------- Svið: aðgerðir (kóði → heiti) og afbrigði með vægi ---------- */
  var DOMAINS = [
    { name: "Tryggingafélag: tjónamál", pre: "T", acts: { S: "Skrá tjón", M: "Meta tjón", "Ó": "Óska eftir gögnum", A: "Samþykkja bætur", H: "Hafna kröfu", G: "Greiða bætur" },
      vars: [["SMAG", 5], ["SMÓMAG", 2], ["SMH", 2], ["SÓMAG", 1], ["SMÓMH", 1]] },
    { name: "Viðhaldsbeiðnir í fjölbýli", pre: "V", acts: { B: "Skrá beiðni", F: "Forgangsraða", "Ú": "Úthluta verki", V: "Vinna verk", P: "Panta varahlut", L: "Loka beiðni" },
      vars: [["BFÚVL", 5], ["BFÚPVL", 2], ["BFL", 2], ["BFÚVÚVL", 1], ["BÚVL", 1]] },
    { name: "Nýskráning í banka", pre: "N", acts: { U: "Fylla út umsókn", K: "Kanna skilríki", "Á": "Áhættumat", V: "Óska eftir viðbótargögnum", O: "Opna reikning", H: "Hafna umsókn" },
      vars: [["UKÁO", 5], ["UKVKÁO", 2], ["UKÁH", 2], ["UKÁVÁO", 1], ["UKH", 1]] },
    { name: "Týndur farangur flugfélags", pre: "F", acts: { T: "Tilkynna týnda tösku", L: "Leita að tösku", F: "Finna tösku", S: "Senda tösku heim", B: "Greiða bætur", M: "Loka máli" },
      vars: [["TLFSM", 5], ["TLBM", 2], ["TLLFSM", 1], ["TLLBM", 1], ["TFSM", 1]] }
  ];
  var chars = function (s) { return Array.from(s); };
  function drawVariant(d) {
    var tot = d.vars.reduce(function (s, v) { return s + v[1]; }, 0), r = Math.random() * tot;
    for (var i = 0; i < d.vars.length; i++) { r -= d.vars[i][1]; if (r < 0) return d.vars[i][0]; }
    return d.vars[0][0];
  }
  /** Býr til atburðaskrá: { d, cases:[{id, trace}], events:[{id, a, t}] } */
  function makeLog(n) {
    var d = pick(DOMAINS), cases = [], events = [];
    var base = rnd(100, 400);
    for (var i = 0; i < n; i++) {
      var id = d.pre + "-" + (base + 2 * i + rnd(0, 1)), trace = drawVariant(d);
      var t = rnd(0, 6 * 60) + 8 * 60 + i * rnd(10, 40);
      chars(trace).forEach(function (a) { t += rnd(8, 150); events.push({ id: id, a: a, t: t }); });
      cases.push({ id: id, trace: trace });
    }
    events.sort(function (x, y) { return x.t - y.t; });
    return { d: d, cases: cases, events: events };
  }
  function fmtT(t) { var day = 3 + Math.floor(t / 1440), m = t % 1440; return day + ".3. " + pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  function variants(log) {
    var m = {};
    log.cases.forEach(function (c) { m[c.trace] = (m[c.trace] || 0) + 1; });
    return m;
  }
  function dfg(log) {
    var m = {};
    log.cases.forEach(function (c) { var a = chars(c.trace); for (var i = 0; i + 1 < a.length; i++) { var k = a[i] + "→" + a[i + 1]; m[k] = (m[k] || 0) + 1; } });
    return m;
  }
  var vtxt = function (tr) { return "⟨" + chars(tr).join(", ") + "⟩"; };

  function logView(log) {
    var wrap = el("div");
    var leg = el("p", "w4-legend", "<b>" + log.d.name + ".</b> " + Object.keys(log.d.acts).map(function (k) { return "<b>" + k + "</b> = " + log.d.acts[k]; }).join(" · "));
    wrap.appendChild(leg);
    var box = el("div", "w4-log");
    var byCase = false;
    function render() {
      var ev = log.events.slice();
      if (byCase) ev.sort(function (x, y) { return x.id < y.id ? -1 : x.id > y.id ? 1 : x.t - y.t; });
      var prev = null, alt = false;
      box.innerHTML = "<table><thead><tr><th>Málsnúmer</th><th>Aðgerð</th><th>Tímastimpill</th></tr></thead><tbody>" + ev.map(function (e) {
        if (byCase && e.id !== prev) { alt = !alt; prev = e.id; }
        return "<tr" + (byCase && alt ? ' class="w4-alt"' : "") + '><td class="w4-c">' + e.id + "</td><td>" + e.a + " · " + log.d.acts[e.a] + "</td><td>" + fmtT(e.t) + "</td></tr>";
      }).join("") + "</tbody></table>";
    }
    var tg = btn("btn ghost", "Raða eftir málsnúmeri", function () { byCase = !byCase; tg.textContent = byCase ? "Raða eftir tíma (eins og kerfið skilar)" : "Raða eftir málsnúmeri"; render(); });
    render();
    wrap.appendChild(box);
    var r = el("div", "w4-btns"); r.style.marginTop = "0"; r.appendChild(tg); wrap.appendChild(r);
    return wrap;
  }

  /* ---------- Borð 3: líkanabrot ---------- */
  var KINDS = {
    sound: "Traust (engin villa)", deadlock: "Deadlock", lack: "Skortur á samstillingu", livelock: "Livelock"
  };
  var FRAGS = [
    { split: "AND", join: "AND", ans: "sound", why: "AND-klofnun sendir tóka í báðar greinar og AND-sameiningin bíður eftir báðum. Klofnun og sameining af sömu tegund: traust." },
    { split: "XOR", join: "XOR", ans: "sound", why: "XOR-klofnun velur eina grein og XOR-sameining hleypir henni í gegn. Sama tegund: traust." },
    { split: "XOR", join: "AND", ans: "deadlock", why: "Aðeins ein grein fær tóka, en AND-sameiningin bíður eftir báðum. Tókinn festist: deadlock." },
    { split: "OR", join: "AND", ans: "deadlock", why: "OR-klofnun getur valið bara eina grein; þá bíður AND-sameiningin endalaust eftir hinni: (mögulegt) deadlock." },
    { split: "AND", join: "XOR", ans: "lack", why: "Báðar greinar fá tóka og XOR-sameiningin hleypir hvorum í gegn: tveir tókar á sama raðflæði, skortur á samstillingu." },
    { split: "OR", join: "XOR", ans: "lack", why: "Ef OR velur báðar greinar hleypir XOR-sameiningin báðum tókum í gegn: (mögulegur) skortur á samstillingu." },
    { loop: "dead", ans: "livelock", why: "Þegar tókinn fer í neðri greinina kemst hann aldrei út úr lykkjunni B → sameining → B: livelock." },
    { loop: "ok", ans: "sound", why: "Lykkjan hefur útgönguleið: XOR-klofnunin eftir B velur annaðhvort að endurtaka eða halda áfram. Traust." }
  ];
  var AR = '<defs><marker id="w4-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink)"/></marker></defs>';
  function gw(cx, cy, kind) {
    var s = '<path d="M' + cx + "," + (cy - 18) + " L" + (cx + 18) + "," + cy + " L" + cx + "," + (cy + 18) + " L" + (cx - 18) + "," + cy + ' Z" style="fill:var(--paper);stroke:var(--ink);stroke-width:1.6"/>';
    if (kind === "XOR") s += '<path d="M' + (cx - 6) + "," + (cy - 6) + " L" + (cx + 6) + "," + (cy + 6) + " M" + (cx + 6) + "," + (cy - 6) + " L" + (cx - 6) + "," + (cy + 6) + '" style="stroke:var(--ink);stroke-width:2.2"/>';
    else if (kind === "AND") s += '<path d="M' + (cx - 8) + "," + cy + " L" + (cx + 8) + "," + cy + " M" + cx + "," + (cy - 8) + " L" + cx + "," + (cy + 8) + '" style="stroke:var(--ink);stroke-width:2.2"/>';
    else s += '<circle cx="' + cx + '" cy="' + cy + '" r="7" style="fill:none;stroke:var(--ink);stroke-width:2"/>';
    return s;
  }
  var task = function (x, y, w, h, t) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" style="fill:var(--paper);stroke:var(--ink);stroke-width:1.6"/><text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 5) + '" text-anchor="middle" style="font:14px var(--sans);fill:var(--ink)">' + t + "</text>"; };
  var ln = function (d) { return '<path d="' + d + '" style="fill:none;stroke:var(--ink);stroke-width:1.6" marker-end="url(#w4-ar)"/>'; };
  var start = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="10" style="fill:var(--paper);stroke:var(--ink);stroke-width:1.6"/>'; };
  var end = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="10" style="fill:var(--paper);stroke:var(--ink);stroke-width:3.2"/>'; };
  function fragSVG(f) {
    var s = '<svg viewBox="0 0 520 200" role="img" aria-label="BPMN-brot">' + AR;
    if (!f.loop) {
      s += start(20, 100) + ln("M30,100 L80,100") + gw(100, 100, f.split);
      s += ln("M100,82 L100,50 L158,50") + ln("M100,118 L100,150 L158,150");
      s += task(160, 32, 110, 36, "A") + task(160, 132, 110, 36, "B");
      s += ln("M270,50 L330,50 L330,80") + ln("M270,150 L330,150 L330,120") + gw(330, 100, f.join);
      s += ln("M348,100 L388,100") + task(390, 82, 70, 36, "C") + ln("M460,100 L488,100") + end(500, 100);
    } else if (f.loop === "dead") {
      s += start(20, 70) + ln("M30,70 L68,70") + task(70, 52, 80, 36, "A") + ln("M150,70 L200,70") + gw(220, 70, "XOR");
      s += ln("M238,70 L298,70") + task(300, 52, 80, 36, "C") + ln("M380,70 L428,70") + end(440, 70);
      s += ln("M220,88 L220,120") + gw(220, 140, "XOR") + ln("M238,140 L298,140") + task(300, 122, 80, 36, "B");
      s += ln("M380,140 L410,140 L410,185 L220,185 L220,160");
    } else {
      s += start(20, 90) + ln("M30,90 L80,90") + gw(100, 90, "XOR") + ln("M118,90 L168,90") + task(170, 72, 90, 36, "B");
      s += ln("M260,90 L300,90") + gw(320, 90, "XOR") + ln("M338,90 L388,90") + task(390, 72, 70, 36, "C") + ln("M460,90 L488,90") + end(500, 90);
      s += ln("M320,108 L320,160 L100,160 L100,110");
    }
    return s + "</svg>";
  }

  register("kafli-4", function (root, api) {
    css();
    var app = root.querySelector("#k4-app");
    var solved = [false, false, false], cur = 0;
    var tabs = el("div", "w4-tabs"), body = el("div");
    app.innerHTML = ""; app.appendChild(tabs); app.appendChild(body);
    var TITLES = ["1. Afbrigði", "2. DFG-brýr", "3. Líkanaspæjari"];
    function drawTabs() {
      tabs.innerHTML = "";
      TITLES.forEach(function (t, i) {
        var b = btn("w4-tab", t + (solved[i] ? '<span class="w4-ok">✓</span>' : ""), function () { cur = i; drawTabs(); LEVELS[i](); });
        b.setAttribute("role", "tab"); b.setAttribute("aria-selected", i === cur ? "true" : "false");
        b.disabled = i > 0 && !solved[i - 1] && !solved[i];
        tabs.appendChild(b);
      });
    }
    function status() {
      var n = solved.filter(Boolean).length;
      if (n === 3) api.done("Vel gert! Þú last afbrigði og DFG beint úr atburðaskrá og fannst hegðunarvillurnar.");
      else api.status("Þú hefur leyst " + n + " af 3 borðum.");
    }
    function win(i, fb, msg) {
      solved[i] = true; status(); drawTabs();
      var p = el("p", "result ok", msg); fb.appendChild(p);
      if (i < 2) fb.appendChild(btn("btn", "Næsta borð →", function () { cur = i + 1; drawTabs(); LEVELS[cur](); }));
    }

    /* Borð 1 */
    function level1() {
      var log, vm, keys, mx;
      do {
        log = makeLog(rnd(6, 9)); vm = variants(log); keys = Object.keys(vm);
        mx = Math.max.apply(null, keys.map(function (k) { return vm[k]; }));
      } while (keys.length < 3 || keys.filter(function (k) { return vm[k] === mx; }).length !== 1);
      var best = keys.filter(function (k) { return vm[k] === mx; })[0];
      body.innerHTML = "";
      body.appendChild(el("p", null, "Hér eru <b>" + log.cases.length + " mál</b>. Flokkaðu atburðina eftir málsnúmeri, lestu rakningu hvers máls og berðu þær saman."));
      body.appendChild(logView(log));
      body.appendChild(el("p", "w4-q", "a) Hversu mörg ólík afbrigði (variants) eru í skránni?"));
      var inp = el("input"); inp.type = "text"; inp.inputMode = "numeric"; inp.style.maxWidth = "8rem"; inp.setAttribute("aria-label", "Fjöldi afbrigða");
      body.appendChild(inp);
      body.appendChild(el("p", "w4-q", "b) Hvert er algengasta afbrigðið?"));
      var all = Object.keys(log.d.vars.reduce(function (o, v) { o[v[0]] = 1; return o; }, {}));
      var opts = shuffle(all), chosen = null, ob = el("div", "w4-opts");
      opts.forEach(function (v) {
        var b = btn("opt", vtxt(v), function () { chosen = v; Array.prototype.forEach.call(ob.children, function (c) { c.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true"); });
        b.setAttribute("aria-pressed", "false"); ob.appendChild(b);
      });
      body.appendChild(ob);
      var fb = el("div");
      var row = el("div", "w4-btns");
      row.appendChild(btn("btn", "Athuga", function () {
        var n = num(inp.value), okN = n === keys.length, okV = chosen === best;
        fb.innerHTML = "";
        var box = el("div", "w4-fb");
        box.innerHTML = "<p>" + (okN ? "✓" : "✗") + " Fjöldi afbrigða: " + (okN ? "rétt, " + keys.length + "." : "ekki rétt.") + "</p><p>" + (okV ? "✓" : "✗") + " Algengasta afbrigðið: " + (okV ? "rétt." : chosen ? "ekki rétt." : "veldu afbrigði.") + "</p>";
        if (!(okN && okV)) {
          box.innerHTML += "<p><b>Lausn:</b> " + keys.sort(function (a, b) { return vm[b] - vm[a]; }).map(function (k) { return vtxt(k) + " × " + vm[k]; }).join(" · ") + ".</p><p>Reyndu aftur með nýrri skrá. Ráð: smelltu á „Raða eftir málsnúmeri“ og skrifaðu niður rakningu hvers máls.</p>";
          fb.appendChild(box);
          fb.appendChild(btn("btn ghost", "Ný atburðaskrá", level1));
        } else { fb.appendChild(box); win(0, fb, "Rétt! " + keys.length + " afbrigði og hamingjuleiðin er " + vtxt(best) + " (" + vm[best] + " mál)."); }
      }));
      body.appendChild(row); body.appendChild(fb);
    }

    /* Borð 2 */
    function level2() {
      var log, g, edges, asked;
      do {
        log = makeLog(rnd(7, 10)); g = dfg(log); edges = Object.keys(g);
      } while (edges.length < 5);
      var codes = Object.keys(log.d.acts);
      asked = shuffle(edges).slice(0, 2);
      var extra;
      do { extra = pick(codes) + "→" + pick(codes); } while (asked.indexOf(extra) >= 0 || extra[0] === extra[2]);
      asked.push(extra); asked = shuffle(asked);
      body.innerHTML = "";
      body.appendChild(el("p", null, "Ný skrá með <b>" + log.cases.length + " málum</b>. Í DFG er brú $a \\to b$ með tíðni = hversu oft $b$ kom <i>strax</i> á eftir $a$ í sama máli."));
      body.appendChild(logView(log));
      var grid = el("div", "w4-grid"), inputs = [];
      asked.forEach(function (k) {
        var w = el("div"); w.appendChild(el("label", "f", "Tíðni brúar " + k.replace("→", " → ")));
        var i = el("input"); i.type = "text"; i.inputMode = "numeric"; w.appendChild(i); inputs.push(i); grid.appendChild(w);
      });
      var w2 = el("div"); w2.appendChild(el("label", "f", "Fjöldi ólíkra brúa í DFG"));
      var iE = el("input"); iE.type = "text"; iE.inputMode = "numeric"; w2.appendChild(iE); grid.appendChild(w2);
      body.appendChild(el("p", "w4-q", "Fylltu inn:")); body.appendChild(grid);
      var fb = el("div"), row = el("div", "w4-btns");
      row.appendChild(btn("btn", "Athuga", function () {
        var good = 0, lines = [];
        asked.forEach(function (k, j) {
          var right = g[k] || 0, v = num(inputs[j].value), ok = v === right; if (ok) good++;
          lines.push("<p>" + (ok ? "✓ " : "✗ ") + k.replace("→", " → ") + (ok ? ": rétt (" + right + ")." : ": ekki rétt.") + "</p>");
        });
        var okE = num(iE.value) === edges.length; if (okE) good++;
        lines.push("<p>" + (okE ? "✓ Fjöldi brúa: rétt (" + edges.length + ")." : "✗ Fjöldi brúa: ekki rétt.") + "</p>");
        fb.innerHTML = ""; var box = el("div", "w4-fb", lines.join("")); fb.appendChild(box);
        if (good === 4) win(1, fb, "Allt rétt! Þú taldir DFG eins og process mining-tól gerir.");
        else {
          box.innerHTML += "<p><b>Lausn:</b> brýr DFG: " + edges.sort().map(function (k) { return k.replace("→", " → ") + " (" + g[k] + ")"; }).join(", ") + ".</p><p>Mundu: brú sem kemur aldrei fyrir hefur tíðnina 0, og endurtekning innan sama máls (t.d. lykkja) telst hvert skipti.</p>";
          fb.appendChild(btn("btn ghost", "Ný atburðaskrá", level2));
        }
      }));
      body.appendChild(row); body.appendChild(fb);
      if (typeof window.renderMath === "function") window.renderMath(body);
    }

    /* Borð 3 */
    var right3 = 0, last = -1;
    function level3() {
      var i; do { i = rnd(0, FRAGS.length - 1); } while (i === last); last = i;
      var f = FRAGS[i];
      body.innerHTML = "";
      body.appendChild(el("p", "w4-score", "Rétt greind brot: " + right3 + " af 4"));
      body.appendChild(el("p", null, "Teymið teiknaði þetta brot í EV1-líkani. Hugsaðu um tókana: hvað gerist þegar tilvik fer í gegn?"));
      body.appendChild(el("div", "w4-frag", fragSVG(f)));
      var ob = el("div", "w4-opts"), fb = el("div");
      Object.keys(KINDS).forEach(function (k) {
        ob.appendChild(btn("opt", KINDS[k], function () {
          Array.prototype.forEach.call(ob.children, function (c) { c.disabled = true; });
          var ok = k === f.ans; if (ok) right3++;
          this.classList.add(ok ? "right" : "wrong");
          fb.innerHTML = "";
          var box = el("div", "w4-fb", "<p><b>" + (ok ? "Rétt." : "Ekki rétt, svarið er: " + KINDS[f.ans] + ".") + "</b> " + f.why + "</p>");
          fb.appendChild(box);
          if (right3 >= 4) { body.querySelector(".w4-score").textContent = "Rétt greind brot: 4 af 4"; win(2, fb, "Þú fannst hegðunarvillurnar rétt í 4 brotum."); }
          else fb.appendChild(btn("btn", "Næsta brot →", level3));
        }));
      });
      body.appendChild(ob); body.appendChild(fb);
    }

    var LEVELS = [level1, level2, level3];
    drawTabs(); level1(); status();
  });
})();

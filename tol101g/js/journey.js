/* journey.js – ferðalagið að lokaprófinu.
 *
 * Kaflarnir (TK.CHAPTERS) hafa hver fjögur skref: Lesa → Æfa → Gagnvirkt → Kaflapróf.
 * Næsti kafli opnast við einkunn ≥ TK.PASS í kaflaprófi. Þegar allir kaflar eru búnir
 * opnast lokaprófið (js/examgen.js) og þegar það næst opnast prófasafnið.
 * Framvindan er geymd í localStorage (TK.COURSE.key) í vafra nemandans.
 * Texti sem er bundinn áfanganum (stig, lokapróf, verðlaun) er í TK.COURSE í js/chapters.js.
 *
 * Gagnvirkir hlutar skrá sig með TK.widget("kafli-N", function (root, api) {...});
 * api.done(texti) lýkur skrefinu og api.status(texti) sýnir stöðu.
 */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  var CH = TK.CHAPTERS || [];
  var PASS = TK.PASS || 6;
  var GOAL = TK.PRACTICE_GOAL || 5;
  var C = TK.COURSE || {};
  var KEY = C.key || "gfk-ferd-v1";
  var NUMW = ["núll", "einn", "tvo", "þrjá", "fjóra", "fimm", "sex", "sjö", "átta", "níu", "tíu", "ellefu", "tólf"];
  var nCh = function () { return NUMW[CH.length] || String(CH.length); };

  /* ---------- Gagnvirkir hlutar: skráning ---------- */
  var widgets = {};
  TK.widget = function (id, mount) { widgets[id] = mount; };
  (TK._widgetQueue || []).forEach(function (w) { widgets[w[0]] = w[1]; });

  /* ---------- Geymsla ---------- */
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!s || s.v !== 1) s = { v: 1, ch: {}, final: { best: null, attempts: 0, passed: false, history: [] }, xp: 0, unlockAll: false };
    return s;
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function ch(n) {
    var k = String(n);
    if (!S.ch[k]) S.ch[k] = { read: false, practice: 0, widget: false, best: null, attempts: 0 };
    return S.ch[k];
  }

  /* ---------- Reglur ---------- */
  function passed(n) { var c = S.ch[String(n)]; return !!(c && c.best !== null && c.best >= PASS); }
  function unlocked(n) { return S.unlockAll || n === 1 || passed(n - 1); }
  function testReady(n) { var c = ch(n); return S.unlockAll || (c.read && c.practice >= GOAL && c.widget); }
  function allPassed() { for (var i = 0; i < CH.length; i++) if (!passed(CH[i].n)) return false; return CH.length > 0; }
  function finalOpen() { return S.unlockAll || allPassed(); }
  function archiveOpen() { return S.unlockAll || !!S.final.passed; }
  function gateOpen(g) {
    if (g === "final") return finalOpen();
    if (g === "archive") return archiveOpen();
    var m = /^ch(\d+)$/.exec(g || "");
    return m ? unlocked(+m[1]) : true;
  }
  function stepsDone(n) { var c = ch(n); return (c.read ? 1 : 0) + (c.practice >= GOAL ? 1 : 0) + (c.widget ? 1 : 0) + (passed(n) ? 1 : 0); }
  function stars(g) { return g === null || g === undefined ? 0 : g >= 9.5 ? 3 : g >= 8 ? 2 : g >= PASS ? 1 : 0; }
  function starStr(k) { return "★★★".slice(0, k) + "☆☆☆".slice(0, 3 - k); }
  var fmt = function (x, d) { return Number(x).toFixed(d === undefined ? 1 : d).replace(".", ","); };

  /* ---------- Stig (XP) ---------- */
  var LEVELS = C.levels || [[0, "Nýnemi"], [500, "Lengra kominn"], [1500, "Meistari"]];
  function level(xp) {
    var i = 0;
    while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][0]) i++;
    var lo = LEVELS[i][0], hi = i + 1 < LEVELS.length ? LEVELS[i + 1][0] : null;
    return { i: i + 1, name: LEVELS[i][1], lo: lo, hi: hi, frac: hi ? (xp - lo) / (hi - lo) : 1, next: hi ? LEVELS[i + 1][1] : null };
  }
  function addXP(amount, why) {
    if (!amount) return;
    var before = level(S.xp).i;
    S.xp += amount;
    save();
    toast("+" + amount + " XP" + (why ? " · " + why : ""));
    var L = level(S.xp);
    if (L.i > before) celebrate("Nýtt stig: " + L.name, "Þú ert komin(n) á stig " + L.i + ". Haltu áfram!", null);
    renderSide();
  }

  /* ---------- Smáhlutir í viðmóti ---------- */
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function math(node) { if (window.renderMath) window.renderMath(node); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  var toastBox = null;
  function toast(msg) {
    if (!toastBox) { toastBox = el('<div class="toasts" aria-live="polite"></div>'); document.body.appendChild(toastBox); }
    var t = el('<div class="toast">' + esc(msg) + "</div>");
    toastBox.appendChild(t);
    setTimeout(function () { t.classList.add("out"); }, 2600);
    setTimeout(function () { t.remove(); }, 3200);
  }

  var celQueue = [];
  function celebrate(title, text, link) {
    if (document.querySelector(".celebrate")) { celQueue.push([title, text, link]); return; }
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var conf = "";
    if (!reduce) for (var i = 0; i < 70; i++) {
      conf += '<i style="left:' + (Math.random() * 100).toFixed(1) + "%;animation-delay:" + (Math.random() * 0.6).toFixed(2) + "s;animation-duration:" + (1.6 + Math.random() * 1.4).toFixed(2) + "s;background:hsl(" + Math.floor(Math.random() * 360) + ' 80% 60%)"></i>';
    }
    var ov = el('<div class="celebrate" role="dialog" aria-modal="true" aria-labelledby="cel-t"><div class="confetti" aria-hidden="true">' + conf + '</div><div class="cel-card"><div class="cel-ico" aria-hidden="true">🎉</div><h2 id="cel-t">' + esc(title) + "</h2><p>" + text + '</p><div class="cel-btns">' + (link ? '<a class="btn" href="' + link.href + '">' + esc(link.label) + "</a>" : "") + '<button type="button" class="btn ghost" data-close>Loka</button></div></div></div>');
    document.body.appendChild(ov);
    var close = function () {
      ov.remove(); document.removeEventListener("keydown", onKey);
      if (celQueue.length) { var c = celQueue.shift(); celebrate(c[0], c[1], c[2]); }
    };
    var onKey = function (e) { if (e.key === "Escape") close(); };
    ov.querySelector("[data-close]").addEventListener("click", close);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.addEventListener("keydown", onKey);
    (ov.querySelector(".cel-btns .btn") || ov.querySelector("[data-close]")).focus();
  }

  /* ---------- Valmynd: lásar, stjörnur og stig ---------- */
  function renderSide() {
    document.querySelectorAll("a.nav[data-gate]").forEach(function (a) {
      var g = a.getAttribute("data-gate");
      var open = gateOpen(g);
      var badge = a.querySelector(".nav-b");
      if (!badge) { badge = el('<span class="nav-b" aria-hidden="true"></span>'); a.appendChild(badge); }
      var m = /^ch(\d+)$/.exec(g);
      a.classList.toggle("locked", !open);
      if (!open) { badge.textContent = "🔒"; a.setAttribute("title", "Læst"); }
      else if (m && passed(+m[1])) { badge.textContent = starStr(stars(ch(+m[1]).best)); badge.className = "nav-b stars"; a.removeAttribute("title"); }
      else if (g === "final" && S.final.passed) { badge.textContent = "✓"; badge.className = "nav-b"; }
      else { badge.textContent = ""; badge.className = "nav-b"; a.removeAttribute("title"); }
    });
    var box = document.getElementById("side-xp");
    if (box) {
      var L = level(S.xp);
      box.hidden = false;
      box.innerHTML = '<div class="xp-top"><b>Stig ' + L.i + "</b> · " + esc(L.name) + '</div><div class="xp-bar"><i style="width:' + Math.round(L.frac * 100) + '%"></i></div><div class="xp-sub">' + S.xp + " XP" + (L.hi ? " · " + (L.hi - S.xp) + " í næsta stig" : "") + "</div>";
    }
  }

  /* ---------- Læstar síður (lokapróf og prófasafn) ---------- */
  function applyGates() {
    document.querySelectorAll(".gate[data-gate]").forEach(function (g) {
      var open = gateOpen(g.getAttribute("data-gate"));
      g.querySelector(".lockscreen").hidden = open;
      g.querySelector(".gated").hidden = !open;
    });
  }

  /* ---------- Spurningar: sameiginleg birting ---------- */
  var B = function () { return TK.bank; };
  function topicOf(g) { if (!g._topic) g._topic = g().topic; return g._topic; }
  function pool(topics) {
    var b = B();
    return {
      gens: b.G.filter(function (g) { return topics.indexOf(topicOf(g)) !== -1; }),
      mcs: b.MC.filter(function (m) { return topics.indexOf(m.topic) !== -1; }),
    };
  }
  function numAnswer(d) { return B().answerHtml(d); }

  /* ---------- Skref 2: Æfingar ---------- */
  function mountPractice(n, root, onProgress) {
    var topics = (CH[n - 1] || {}).topics || [];
    var P = pool(topics);
    var cur = null, answered = false, last = null;
    function next() {
      var kind = P.gens.length && (!P.mcs.length || Math.random() < 0.6) ? "num" : "mc";
      for (var t = 0; t < 8; t++) {
        cur = kind === "num" ? { kind: "num", d: B().pick(P.gens)() } : { kind: "mc", d: B().pick(P.mcs) };
        var key = cur.kind === "num" ? cur.d.title : cur.d.q;
        if (key !== last) { last = key; break; }
      }
      answered = false;
      show();
    }
    function head() {
      var c = ch(n), k = Math.min(c.practice, GOAL);
      return '<div class="p-head"><span>Rétt svör: <b>' + c.practice + "</b>" + (c.practice < GOAL ? " af " + GOAL : " · skrefinu lokið ✓") + '</span><span class="pips">' + new Array(GOAL + 1).join("·").split("").map(function (_, i) { return '<i class="' + (i < k ? "on" : "") + '"></i>'; }).join("") + "</span></div>";
    }
    function show() {
      var d = cur.d, h = head() + '<div class="qcard"><div class="qmeta">' + (cur.kind === "num" ? esc(d.title) : "Skilningur") + "</div>";
      if (cur.kind === "num") {
        h += '<div class="qtext">' + d.text + '</div><form class="p-form" style="margin-top:1rem" autocomplete="off"><div class="ans-box">' + B().answerInput("p-in-" + n, d) + '</div><div class="row" style="margin-top:0.6rem"><div class="fixed"><button class="btn" type="submit">Athuga</button></div><div class="fixed"><button class="btn ghost" type="button" data-show>Sýna lausn</button></div></div></form>';
      } else {
        h += '<div class="qtext">' + d.q + '</div><div class="opts">' + shuffle(d.o.map(function (_, i) { return i; })).map(function (i) { return '<button type="button" class="opt" data-i="' + i + '">' + d.o[i] + "</button>"; }).join("") + "</div>";
      }
      h += '<div class="result" aria-live="polite"></div><div class="p-sol"></div><div class="qnext"><button type="button" class="btn ghost" data-next>Næsta spurning →</button></div></div>';
      root.innerHTML = h;
      math(root);
      root.querySelector("[data-next]").addEventListener("click", next);
      if (cur.kind === "num") {
        root.querySelector(".p-form").addEventListener("submit", function (e) {
          e.preventDefault();
          var ok = B().isRight(d, root.querySelector(".p-form input, .p-form textarea").value);
          if (ok === null) { var r = root.querySelector(".result"); r.className = "result no"; r.textContent = B().isText(d) ? "Skrifaðu úttakið fyrst." : "Skrifaðu tölu."; return; }
          finish(ok);
        });
        root.querySelector("[data-show]").addEventListener("click", function () { finish(false); });
      } else {
        root.querySelectorAll(".opt").forEach(function (b) {
          b.addEventListener("click", function () {
            if (answered) return;
            var i = +b.getAttribute("data-i");
            root.querySelectorAll(".opt").forEach(function (o) {
              var oi = +o.getAttribute("data-i"); o.disabled = true;
              if (oi === d.c) o.classList.add("right"); else if (oi === i) o.classList.add("wrong");
            });
            finish(i === d.c);
          });
        });
      }
    }
    function finish(ok) {
      if (answered) return;
      answered = true;
      var d = cur.d, r = root.querySelector(".result");
      r.className = "result " + (ok ? "ok" : "no");
      r.textContent = ok ? "Rétt!" : "Ekki rétt. Farðu yfir lausnina.";
      var sol = root.querySelector(".p-sol");
      sol.innerHTML = '<div class="sol" style="border-top:1px solid var(--rule);margin-top:1rem;padding-top:0.8rem">' + (cur.kind === "num" ? '<p><b>Rétt svar:</b></p>' + numAnswer(d) + d.sol : "<p>" + d.e + "</p>") + "</div>";
      math(sol);
      root.querySelectorAll("input,textarea,button[type=submit],[data-show]").forEach(function (x) { x.disabled = true; });
      if (ok) {
        var c = ch(n); c.practice++; save();
        addXP(10);
        if (c.practice === GOAL) toast("Æfingum lokið · kaflaprófið nálgast");
        root.querySelector(".p-head").outerHTML = head();
        onProgress();
      }
      root.querySelector("[data-next]").focus();
    }
    next();
  }

  /* ---------- Próf: sameiginleg birting og einkunnagjöf ---------- */
  function partHtml(id, p) {
    var h = '<div class="tpart" data-pid="' + id + '">' + (p.label ? '<b class="tlab">' + esc(p.label) + "</b> " : "") + '<div class="ttext">' + p.text + "</div>";
    if (p.kind === "num") {
      h += '<div class="tin ans-box">' + B().answerInput(id, p) + "</div>";
    } else {
      p._order = p._order || shuffle(p.o.map(function (_, i) { return i; }));
      h += '<div class="topts" role="radiogroup">' + p._order.map(function (i) { return '<label class="topt"><input type="radio" name="' + id + '" value="' + i + '"> <span>' + p.o[i] + "</span></label>"; }).join("") + "</div>";
    }
    return h + '<div class="tfb"></div></div>';
  }
  function gradePart(root, id, p) {
    var box = root.querySelector('[data-pid="' + id + '"]'), ok, given;
    if (p.kind === "num") {
      var v = box.querySelector("input,textarea").value.trim();
      given = v;
      ok = v ? !!B().isRight(p, v) : false;
    } else {
      var r = box.querySelector("input:checked");
      given = r ? +r.value : null;
      ok = given === p.c;
      box.querySelectorAll(".topt").forEach(function (l) {
        var i = +l.querySelector("input").value;
        if (i === p.c) l.classList.add("right"); else if (i === given) l.classList.add("wrong");
      });
    }
    box.querySelectorAll("input,textarea").forEach(function (x) { x.disabled = true; });
    box.classList.add(ok ? "ok" : "no");
    var fb = box.querySelector(".tfb");
    fb.innerHTML = '<p class="result ' + (ok ? "ok" : "no") + '">' + (ok ? "✓ Rétt" : given === "" || given === null ? "✗ Ósvarað" : "✗ Rangt") + "</p>" +
      '<details class="reveal tsol"><summary></summary><div class="sol">' + (p.kind === "num" ? '<p><b>Rétt svar:</b></p>' + numAnswer(p) + p.sol : "<p>" + p.e + "</p>") + "</div></details>";
    math(fb);
    return ok;
  }
  function unanswered(root) {
    var k = 0;
    root.querySelectorAll(".tpart").forEach(function (b) {
      var i = b.querySelector("input[type=text],textarea");
      if (i ? !i.value.trim() : !b.querySelector("input:checked")) k++;
    });
    return k;
  }

  /* ---------- Skref 4: Kaflapróf ---------- */
  var TEST_N = C.testN || 10;
  function buildTest(n) {
    var P = pool((CH[n - 1] || {}).topics || []);
    var nNum = P.gens.length ? Math.min(P.mcs.length ? Math.max(2, Math.ceil(TEST_N / 2)) : TEST_N, P.mcs.length ? 2 * P.gens.length : TEST_N) : 0;
    var gens = shuffle(P.gens.slice()), mcs = shuffle(P.mcs.slice()), parts = [];
    for (var i = 0; i < nNum; i++) {
      var d = gens[i % gens.length]();
      parts.push({ kind: "num", text: d.text, answer: d.answer, alt: d.alt, loose: d.loose, multi: d.multi, label: d.label, unit: d.unit, tol: d.tol, absTol: d.absTol, sol: d.sol, title: d.title });
    }
    for (var j = 0; parts.length < TEST_N && mcs.length; j++) {
      var m = mcs[j % mcs.length];
      parts.push({ kind: "mc", text: m.q, o: m.o, c: m.c, e: m.e, title: "Skilningur" });
    }
    return parts;
  }

  function mountTest(n, root, onChange) {
    var info = CH[n - 1] || {}, mode = "intro";
    function intro() {
      mode = "intro";
      var c = ch(n), ready = testReady(n);
      var reqs = [["Lesa kaflann", c.read], ["Æfingar: " + Math.min(c.practice, GOAL) + " af " + GOAL + " réttum", c.practice >= GOAL], ["Kóðaverkstæðið", c.widget]];
      root.innerHTML = '<div class="t-intro"><div class="grid2"><div class="key"><p><b>' + TEST_N + " spurningar</b> úr kaflanum: kóðadæmi með nýjum tölum og skilningsspurningar. Engin svör sjást fyrr en þú skilar.</p><p>Einkunn er hlutfall réttra svara × 10. <b>Þú þarft " + fmt(PASS) + "</b> til að " + (n < CH.length ? "opna kafla " + (n + 1) : "opna lokaprófið") + ".</p></div>" +
        '<div class="key"><p><b>Besta einkunn:</b> ' + (c.best === null ? "–" : fmt(c.best) + " " + starStr(stars(c.best))) + "</p><p><b>Tilraunir:</b> " + c.attempts + '</p><p style="color:var(--muted);font-size:0.9rem">★ 6+ · ★★ 8+ · ★★★ 9,5+. Þú mátt taka prófið eins oft og þú vilt; besta einkunnin gildir.</p></div></div>' +
        (ready ? "" : '<div class="note warn"><p><b class="t">Kaflaprófið opnast þegar þú hefur lokið:</b></p><ul class="checklist">' + reqs.map(function (r) { return '<li class="' + (r[1] ? "done" : "") + '">' + (r[1] ? "✓ " : "○ ") + r[0] + "</li>"; }).join("") + "</ul></div>") +
        '<p><button type="button" class="btn" data-start' + (ready ? "" : " disabled") + ">" + (c.attempts ? "Taka nýtt kaflapróf" : "Byrja kaflapróf") + "</button></p></div>";
      var b = root.querySelector("[data-start]");
      if (b && ready) b.addEventListener("click", start);
    }
    function start() {
      mode = "exam";
      var parts = buildTest(n), uid = "t" + n + "-" + Date.now().toString(36);
      var h = '<form class="ctest-form" novalidate><ol class="tlist">';
      parts.forEach(function (p, i) { h += '<li class="tq"><div class="tq-h">Spurning ' + (i + 1) + ' <span>' + esc(p.title) + "</span></div>" + partHtml(uid + "-" + i, p) + "</li>"; });
      h += '</ol><div class="t-submit"><button type="submit" class="btn">Skila prófinu</button> <button type="button" class="btn ghost" data-cancel>Hætta við</button></div></form>';
      root.innerHTML = h;
      math(root);
      root.querySelector("[data-cancel]").addEventListener("click", function () { if (confirm("Hætta við prófið? Svörin glatast.")) intro(); });
      root.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        var u = unanswered(root);
        if (u && !confirm(u + (u === 1 ? " spurningu" : " spurningum") + " er ósvarað. Skila samt?")) return;
        var right = 0;
        parts.forEach(function (p, i) { if (gradePart(root, uid + "-" + i, p)) right++; });
        var grade = Math.round((100 * right) / parts.length) / 10;
        result(grade, right, parts.length);
      });
      root.scrollIntoView({ block: "start" });
    }
    function result(grade, right, total) {
      mode = "result";
      var c = ch(n), wasPassed = passed(n), prevBest = c.best;
      c.attempts++;
      if (c.best === null || grade > c.best) c.best = grade;
      save();
      var ok = grade >= PASS;
      var xp = 15 + (ok && !wasPassed ? 100 : 0) + (prevBest === null || grade > prevBest ? Math.round((grade - (prevBest || 0)) * 10) : 0);
      addXP(xp, "kaflapróf");
      var nextHref = n < CH.length ? "kafli-" + (n + 1) + ".html" : "lokaprof-aefing.html";
      var nextLabel = n < CH.length ? "Áfram í kafla " + (n + 1) + " →" : "Áfram í lokaprófið →";
      var banner = el('<div class="t-result ' + (ok ? "pass" : "fail") + '"><div class="t-grade">' + fmt(grade) + '</div><div><p class="t-msg"><b>' + (ok ? "Þú náðir! " : "Ekki alveg. ") + "</b>" + right + " af " + total + " rétt" + (ok ? " · " + starStr(stars(grade)) : "") + "</p><p>" +
        (ok ? (wasPassed ? "Besta einkunnin þín er " + fmt(c.best) + "." : "Næsti áfangi er opinn.") : "Þú þarft " + fmt(PASS) + ". Farðu yfir lausnirnar hér að neðan, æfðu þig aðeins meira og reyndu aftur.") +
        '</p><p class="t-btns">' + (ok ? '<a class="btn" href="' + nextHref + '">' + nextLabel + "</a> " : "") + '<button type="button" class="btn ghost" data-retry>Nýtt kaflapróf</button> <button type="button" class="btn ghost" data-practice>Æfa meira</button></p></div></div>');
      root.insertBefore(banner, root.firstChild);
      var sub = root.querySelector(".t-submit"); if (sub) sub.remove();
      banner.querySelector("[data-retry]").addEventListener("click", start);
      banner.querySelector("[data-practice]").addEventListener("click", function () { showStep("aefa"); });
      root.scrollIntoView({ block: "start" });
      onChange();
      if (ok && !wasPassed) {
        if (n < CH.length) celebrate("Kafli " + (n + 1) + " opnaður!", "Þú fékkst <b>" + fmt(grade) + "</b> í kaflaprófi " + n + " (" + esc(info.title) + ").", { href: nextHref, label: nextLabel });
        else celebrate("Lokaprófið er opið!", "Þú hefur klárað alla " + nCh() + " kaflana. " + (C.finalOpenText || "Nú er komið að lokaprófinu."), { href: nextHref, label: nextLabel });
      }
    }
    intro();
    return { refresh: function () { if (mode === "intro") intro(); } };
  }

  /* ---------- Kaflasíða ---------- */
  var showStep = function () {};
  function initChapter(box) {
    var n = +box.getAttribute("data-ch");
    var lock = box.querySelector(".lockscreen"), body = box.querySelector(".ch-body");
    if (!unlocked(n)) { lock.hidden = false; body.hidden = true; return; }
    var sections = {}, mounted = {}, test = null;
    box.querySelectorAll("section.step").forEach(function (s) { sections[s.getAttribute("data-step")] = s; });
    var btns = box.querySelectorAll(".stepper .st");

    function status() {
      var c = ch(n);
      var st = {
        lesa: c.read ? "✓" : "",
        aefa: c.practice >= GOAL ? "✓" : Math.min(c.practice, GOAL) + "/" + GOAL,
        gagnvirkt: c.widget ? "✓" : "",
        prof: passed(n) ? starStr(stars(c.best)) : testReady(n) ? "opið" : "🔒",
      };
      btns.forEach(function (b) {
        var k = b.getAttribute("data-step");
        b.querySelector(".st-s").textContent = st[k];
        b.classList.toggle("done", st[k] === "✓" || (k === "prof" && passed(n)));
      });
      if (test) test.refresh();
      renderSide();
    }

    showStep = function (k, noScroll) {
      if (!sections[k]) k = "lesa";
      Object.keys(sections).forEach(function (s) { sections[s].hidden = s !== k; });
      btns.forEach(function (b) {
        var on = b.getAttribute("data-step") === k;
        b.classList.toggle("on", on);
        if (on) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      });
      if (!mounted[k]) {
        mounted[k] = true;
        if (k === "aefa") mountPractice(n, sections.aefa.querySelector(".practice"), status);
        if (k === "gagnvirkt") mountWidget();
        if (k === "prof") test = mountTest(n, sections.prof.querySelector(".ctest"), status);
      }
      if (history.replaceState) history.replaceState(null, "", "#" + k);
      if (!noScroll) box.querySelector(".ch-head").scrollIntoView({ block: "start" });
      window.dispatchEvent(new Event("resize"));
    };

    function mountWidget() {
      var sec = sections.gagnvirkt, st = sec.querySelector(".w-status");
      var api = {
        done: function (msg) {
          var c = ch(n);
          st.innerHTML = '<span class="result ok">✓ ' + esc(msg || "Kóðaverkstæðinu er lokið.") + '</span> <button type="button" class="btn ghost" data-go-test>Í kaflaprófið →</button>';
          st.querySelector("[data-go-test]").addEventListener("click", function () { showStep("prof"); });
          if (!c.widget) { c.widget = true; save(); addXP(40, "kóðaverkstæði"); status(); }
        },
        status: function (t) { if (!ch(n).widget) st.textContent = t; },
      };
      var w = widgets["kafli-" + n];
      if (w) {
        try { w(sec, api); } catch (e) { st.textContent = "Villa í kóðaverkstæðinu: " + e.message; if (window.console) console.error(e); }
      } else {
        st.innerHTML = '<button type="button" class="btn ghost" data-manual>Merkja skrefið lokið</button>';
        st.querySelector("[data-manual]").addEventListener("click", function () { api.done("Merkt lokið."); });
      }
      if (ch(n).widget) api.done("Þú hefur þegar lokið þessu verkefni. Þú mátt prófa áfram.");
    }

    btns.forEach(function (b) { b.addEventListener("click", function () { showStep(b.getAttribute("data-step")); }); });
    var rb = box.querySelector("[data-act=read]");
    if (rb) rb.addEventListener("click", function () {
      var c = ch(n);
      if (!c.read) { c.read = true; save(); addXP(20, "lestur"); status(); }
      showStep("aefa");
    });

    // Upphafsskref: úr slóðinni (#aefa eða akkeri í lesefninu), annars fyrsta ókláraða skref
    var h = decodeURIComponent((location.hash || "").slice(1)).replace(/^step-/, "");
    var start = sections[h] ? h : null, target = null;
    if (!start && h) {
      target = document.getElementById(h);
      if (target) { var sec = target.closest("section.step"); start = sec ? sec.getAttribute("data-step") : "lesa"; }
    }
    if (!start) {
      var c = ch(n);
      start = !c.read ? "lesa" : c.practice < GOAL ? "aefa" : !c.widget ? "gagnvirkt" : "prof";
    }
    status();
    showStep(start, true);
    if (target) setTimeout(function () { target.scrollIntoView({ block: "start" }); }, 50);
  }

  /* ---------- Kortið (forsíða) ---------- */
  function nextAction() {
    for (var i = 0; i < CH.length; i++) {
      var n = CH[i].n, c = ch(n);
      if (passed(n)) continue;
      var step = !c.read ? "lesa" : c.practice < GOAL ? "aefa" : !c.widget ? "gagnvirkt" : "prof";
      var lab = { lesa: "Lesa", aefa: "Æfa", gagnvirkt: "Kóðaverkstæðið", prof: "Kaflapróf" }[step];
      return { href: "kafli-" + n + ".html#" + step, label: "Kafli " + n + ": " + CH[i].title + " · " + lab };
    }
    if (!S.final.passed) return { href: "lokaprof-aefing.html", label: "Lokapróf ferðalagsins" };
    return { href: C.rewardHref || "upprifjun.html", label: C.rewardLabel || "Verðlaunin" };
  }

  function renderMap(root) {
    var L = level(S.xp), done = 0, starsTot = 0;
    CH.forEach(function (c) { if (passed(c.n)) done++; starsTot += stars(ch(c.n).best); });
    var na = nextAction();
    var h = '<div class="ferd-status"><div class="fs-lvl"><div class="fs-badge">' + L.i + '</div><div><b>' + esc(L.name) + '</b><div class="xp-bar"><i style="width:' + Math.round(L.frac * 100) + '%"></i></div><small>' + S.xp + " XP" + (L.next ? " · " + (L.hi - S.xp) + " XP í „" + esc(L.next) + "“" : " · hæsta stig") + "</small></div></div>" +
      '<div class="fs-num"><b>' + done + "/" + CH.length + "</b><small>kaflar búnir</small></div>" +
      '<div class="fs-num"><b>' + starsTot + "/" + 3 * CH.length + "</b><small>stjörnur</small></div>" +
      '<div class="fs-num"><b>' + (S.final.best === null ? "–" : fmt(S.final.best)) + "</b><small>lokapróf</small></div>" +
      '<a class="btn fs-go" href="' + na.href + '">' + (S.xp ? "Halda áfram" : "Byrja ferðalagið") + ' →<small>' + esc(na.label) + "</small></a></div>";
    h += '<ol class="ferd-map">';
    CH.forEach(function (c) {
      var n = c.n, open = unlocked(n), p = passed(n), sd = stepsDone(n), cc = ch(n);
      var cls = p ? "done" : open ? (sd ? "active" : "open") : "locked";
      h += '<li class="fm ' + cls + '"><div class="fm-dot">' + (p ? "✓" : open ? n : "🔒") + "</div>" +
        (open ? '<a class="fm-card" href="kafli-' + n + '.html">' : '<div class="fm-card" aria-disabled="true">') +
        '<span class="fm-k">Kafli ' + n + "</span><span class=\"fm-t\">" + esc(c.title) + '</span><span class="fm-s">' + esc(c.sub) + '</span><span class="fm-e">' + esc(c.exam) + "</span>" +
        '<span class="fm-p">' + ["Lesa", "Æfa", "Verkstæði", "Próf"].map(function (lab, i) {
          var on = [cc.read, cc.practice >= GOAL, cc.widget, p][i];
          return '<i class="' + (on ? "on" : "") + '">' + lab + "</i>";
        }).join("") + '</span><span class="fm-g">' + (p ? starStr(stars(cc.best)) + " · " + fmt(cc.best) : cc.attempts ? "Besta: " + fmt(cc.best) : open ? "Opið" : "Læst") + "</span>" +
        (open ? "</a>" : "</div>") + "</li>";
    });
    var fo = finalOpen();
    h += '<li class="fm final ' + (S.final.passed ? "done" : fo ? "open" : "locked") + '"><div class="fm-dot">' + (S.final.passed ? "🏆" : fo ? "🎓" : "🔒") + "</div>" +
      (fo ? '<a class="fm-card" href="lokaprof-aefing.html">' : '<div class="fm-card" aria-disabled="true">') +
      '<span class="fm-k">Lokahnykkurinn</span><span class="fm-t">Lokapróf ferðalagsins</span><span class="fm-s">' + esc(C.finalSub || "") + '</span><span class="fm-g">' +
      (S.final.passed ? "Náð · besta " + fmt(S.final.best) : S.final.attempts ? "Besta: " + fmt(S.final.best) : fo ? "Opið" : "Opnast þegar allir kaflar eru búnir") + "</span>" + (fo ? "</a>" : "</div>") + "</li>";
    var ao = archiveOpen();
    h += '<li class="fm archive ' + (ao ? "open" : "locked") + '"><div class="fm-dot">' + (ao ? "🏅" : "🔒") + '</div><div class="fm-card"><span class="fm-k">Verðlaun</span><span class="fm-t">' + esc(C.rewardTitle || "Verðlaunin") + "</span>" +
      (ao ? '<span class="fm-links">' + (C.rewardLinks || []).map(function (l) { return '<a href="' + l[0] + '">' + esc(l[1]) + "</a>"; }).join("") + "</span>"
        : '<span class="fm-s">' + esc(C.rewardLocked || "") + "</span>") + "</div></li>";
    h += "</ol>";
    root.innerHTML = h;
    math(root);
  }

  /* ---------- Lokapróf ferðalagsins ---------- */
  function initFinal(root) {
    var timer = null;
    function intro() {
      if (timer) { clearInterval(timer); timer = null; }
      var f = S.final;
      root.innerHTML = '<div class="grid2"><div class="key">' + (C.finalIntro || "") + "<p>Þú þarft <b>" + fmt(PASS) + "</b> til að ná.</p></div>" +
        '<div class="key"><p><b>Besta einkunn:</b> ' + (f.best === null ? "–" : fmt(f.best)) + "</p><p><b>Tilraunir:</b> " + f.attempts + "</p>" + (f.history.length ? '<p style="font-size:0.9rem;color:var(--muted)">Síðustu: ' + f.history.slice(-5).map(function (x) { return fmt(x.g); }).join(" · ") + "</p>" : "") + "</div></div>" +
        (f.passed ? '<div class="note tip"><p><b class="t">Þú hefur náð lokaprófinu.</b> <a href="' + (C.rewardHref || "upprifjun.html") + '">' + esc(C.rewardTitle || "Verðlaunin") + "</a> er opin. Hér getur þú tekið eins mörg ný lokapróf og þú vilt; spurningarnar og tölurnar eru nýjar í hvert skipti.</p></div>" : "") +
        '<p><button type="button" class="btn" data-start>' + (f.attempts ? "Nýtt lokapróf" : "Byrja lokaprófið") + "</button></p>";
      root.querySelector("[data-start]").addEventListener("click", start);
    }
    function start() {
      if (!TK.examgen) { root.innerHTML = '<p class="note warn">Prófarafallinn (js/examgen.js) fannst ekki.</p>'; return; }
      var uid = "lp" + Date.now().toString(36), exam = TK.examgen(uid), t0 = Date.now();
      var h = '<div class="exam-bar"><span>Lokapróf ferðalagsins</span><span class="exam-clock" aria-live="off">0:00:00</span></div><form class="exam-form" novalidate>';
      exam.questions.forEach(function (q, qi) {
        h += '<section class="ex exam-q" data-q="' + qi + '"><div class="ex-head">Spurning ' + q.n + " (" + q.weight + " %) <span>" + esc(q.title || "") + '</span><span class="q-score"></span></div><div class="ex-body"><div class="q-intro">' + (q.html || "") + "</div>";
        q.parts.forEach(function (p, pi) { h += partHtml(uid + "-" + qi + "-" + pi, p); });
        h += "</div></section>";
      });
      h += '<div class="t-submit"><button type="submit" class="btn">Skila prófinu</button> <button type="button" class="btn ghost" data-cancel>Hætta við</button></div></form>';
      root.innerHTML = h;
      math(root);
      exam.questions.forEach(function (q, qi) {
        if (typeof q.setup === "function") { try { q.setup(root.querySelector('[data-q="' + qi + '"]')); } catch (e) { if (window.console) console.error(e); } }
      });
      var clock = root.querySelector(".exam-clock");
      timer = setInterval(function () {
        var s = Math.floor((Date.now() - t0) / 1000);
        clock.textContent = Math.floor(s / 3600) + ":" + ("0" + Math.floor((s % 3600) / 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2);
      }, 1000);
      root.querySelector("[data-cancel]").addEventListener("click", function () { if (confirm("Hætta við lokaprófið? Svörin glatast.")) intro(); });
      root.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        var u = unanswered(root);
        if (u && !confirm(u + (u === 1 ? " lið" : " liðum") + " er ósvarað. Skila samt?")) return;
        clearInterval(timer); timer = null;
        var pts = 0, tot = 0;
        exam.questions.forEach(function (q, qi) {
          var r = 0;
          q.parts.forEach(function (p, pi) { if (gradePart(root, uid + "-" + qi + "-" + pi, p)) r++; });
          var got = q.parts.length ? (q.weight * r) / q.parts.length : 0;
          pts += got; tot += q.weight;
          root.querySelector('[data-q="' + qi + '"] .q-score').textContent = fmt(got) + " / " + q.weight;
        });
        finish(Math.round((100 * pts) / tot) / 10, Math.round((Date.now() - t0) / 60000));
      });
      root.scrollIntoView({ block: "start" });
    }
    function finish(grade, mins) {
      var f = S.final, was = f.passed;
      f.attempts++;
      f.history.push({ g: grade, t: Date.now(), m: mins });
      if (f.history.length > 30) f.history.shift();
      if (f.best === null || grade > f.best) f.best = grade;
      var ok = grade >= PASS;
      if (ok) f.passed = true;
      save();
      addXP(30 + (ok && !was ? 300 : 0) + Math.round(grade * 5), "lokapróf");
      var banner = el('<div class="t-result ' + (ok ? "pass" : "fail") + '"><div class="t-grade">' + fmt(grade) + '</div><div><p class="t-msg"><b>' + (ok ? "Þú náðir lokaprófinu! " : "Ekki alveg. ") + "</b>" + (mins ? "Tími: " + mins + " mín." : "") + "</p><p>" +
        (ok ? esc(C.rewardWon || "") : "Þú þarft " + fmt(PASS) + ". Skoðaðu hvaða spurningar fóru illa og rifjaðu upp viðkomandi kafla.") +
        '</p><p class="t-btns">' + (ok ? '<a class="btn" href="' + (C.rewardHref || "upprifjun.html") + '">Opna verðlaunin →</a> ' : "") + '<button type="button" class="btn ghost" data-retry>Nýtt lokapróf</button></p></div></div>');
      root.insertBefore(banner, root.firstChild);
      var sub = root.querySelector(".t-submit"); if (sub) sub.remove();
      banner.querySelector("[data-retry]").addEventListener("click", start);
      root.scrollIntoView({ block: "start" });
      renderSide();
      if (ok && !was) celebrate("Þú náðir lokaprófinu!", "Einkunn <b>" + fmt(grade) + "</b>. " + esc(C.rewardWon || ""), { href: C.rewardHref || "upprifjun.html", label: "Opna verðlaunin →" });
    }
    intro();
  }

  /* ---------- Stillingar á forsíðu ---------- */
  function initSettings(root) {
    function draw() {
      root.innerHTML = '<p>Framvindan er geymd í þessum vafra (localStorage). Hún fylgir ekki á milli tækja.</p><p class="row" style="gap:0.6rem">' +
        '<button type="button" class="btn ghost" data-reset>Byrja upp á nýtt</button>' +
        '<button type="button" class="btn ghost" data-unlock>' + (S.unlockAll ? "Læsa aftur (venjulegur hamur)" : "Opna allt (yfirferðarhamur)") + "</button></p>" +
        (S.unlockAll ? '<p class="note warn">Yfirferðarhamur er á: allir kaflar og próf eru opin, en framvindan telst ekki.</p>' : "");
      root.querySelector("[data-reset]").addEventListener("click", function () {
        if (!confirm("Eyða allri framvindu (kaflar, einkunnir og XP)? Þetta er ekki hægt að afturkalla.")) return;
        try { localStorage.removeItem(KEY); } catch (e) {}
        S = load(); refreshAll(); draw();
      });
      root.querySelector("[data-unlock]").addEventListener("click", function () {
        if (!S.unlockAll && !confirm("Opna alla kafla og prófin án þess að klára þau? Hentar til að skoða efnið, en þá er leikurinn ekki lengur leikur.")) return;
        S.unlockAll = !S.unlockAll; save(); refreshAll(); draw();
      });
    }
    draw();
  }

  function refreshAll() {
    renderSide();
    applyGates();
    var m = document.getElementById("ferd-map");
    if (m) renderMap(m);
  }

  /* ---------- Ræsing ---------- */
  function init() {
    renderSide();
    applyGates();
    var m = document.getElementById("ferd-map"); if (m) renderMap(m);
    var c = document.querySelector(".chapter[data-ch]"); if (c) initChapter(c);
    var f = document.getElementById("final-exam"); if (f && finalOpen()) initFinal(f);
    var s = document.getElementById("ferd-settings"); if (s) initSettings(s);
    if (S.unlockAll) document.documentElement.setAttribute("data-unlockall", "");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else setTimeout(init, 0);

  TK.journey = { state: function () { return S; }, passed: passed, unlocked: unlocked };
})();

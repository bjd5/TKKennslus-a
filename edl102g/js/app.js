/* app.js – viðmótið: leiðin (forsíða), kaflar í þremur skrefum (æfingadæmi → jöfnur → kaflapróf),
   lokapróf og formúlublað. Allt er ein síða með #/slóðum. */
(function () {
  "use strict";
  var E = window.EDL, R = E.R;
  var app = document.getElementById("app");
  var sess = { pr: {}, drill: {}, test: {}, final: null, hideEq: false };
  var STEPS = [
    { id: "aefa", name: "Æfingadæmi", short: "Æ" },
    { id: "jofnur", name: "Jöfnurnar", short: "J" },
    { id: "prof", name: "Kaflapróf", short: "P" }
  ];
  var LETTERS = "abcdefgh";

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  var M = E.math;
  function gradeStr(g) { return g == null ? "" : String(g).replace(".", ","); }
  function chIndex(ch) { return E.chapters.indexOf(ch); }

  /* ---------- Forsíða: leiðin ---------- */
  function stepState(ch, st) {
    if (st === "aefa") return E.practiceDone(ch) ? "done" : "";
    if (st === "jofnur") return E.eqDone(ch) ? "done" : "";
    return E.cs(ch.id).passed ? "done" : "";
  }
  function viewHome() {
    var s = E.load();
    var passed = E.chapters.filter(function (c) { return E.cs(c.id).passed; }).length;
    var current = -1;
    E.chapters.some(function (c, i) { if (E.chOpen(i) && !E.cs(c.id).passed) { current = i; return true; } return false; });
    var h = '<section class="hero">' +
      '<p class="kicker">EÐL102G · Eðlisfræði 1V</p>' +
      '<h1>Leiðin að lokaprófinu</h1>' +
      '<p class="lede">Aflfræði, stöðufræði, straumfræði, sveiflur og bylgjur í ' + E.chapters.length + ' köflum, í sömu röð og kennslubókin (OpenStax University Physics). Í hverjum kafla leysir þú fyrst æfingadæmi, lærir svo jöfnurnar og tekur loks kaflapróf. Með einkunn ' + E.PASS + ' eða hærra opnast næsti kafli, og í lokin bíður lokapróf á sama sniði og gömlu prófin.</p>' +
      '<div class="how">' +
      '<div><b>1</b><span><strong>Æfingadæmi.</strong> Reiknaðu ' + E.PRACTICE + ' dæmi. Vísbendingin sýnir jöfnurnar og lausnin er sýnd skref fyrir skref.</span></div>' +
      '<div><b>2</b><span><strong>Jöfnurnar.</strong> Spjöld með hverri jöfnu og hvað táknin þýða, og þjálfun þar til þú kannt þær.</span></div>' +
      '<div><b>3</b><span><strong>Kaflapróf.</strong> Ný dæmi án vísbendinga og spurningar um jöfnurnar. ' + E.PASS + ' opnar næsta kafla.</span></div>' +
      '</div>' +
      '<div class="meter" role="img" aria-label="' + passed + ' af ' + E.chapters.length + ' köflum lokið"><span style="width:' + (100 * passed / E.chapters.length) + '%"></span></div>' +
      '<p class="meter-l">' + passed + ' af ' + E.chapters.length + ' köflum lokið' + (s.final.best != null ? ' · lokapróf: ' + gradeStr(s.final.best) : '') + '</p>' +
      '</section>';
    h += '<ol class="line">';
    E.chapters.forEach(function (c, i) {
      var open = E.chOpen(i), cs = E.cs(c.id);
      var cls = "stop" + (open ? "" : " locked") + (cs.passed ? " done" : "") + (i === current ? " current" : "");
      var pips = STEPS.map(function (st) { return '<i class="pip ' + (open ? stepState(c, st.id) : "") + '">' + (open && stepState(c, st.id) ? "✓ " : "") + st.name + '</i>'; }).join("");
      var inner = '<span class="dot">' + c.n + '</span>' +
        '<span class="body"><span class="ttl">' + esc(c.title) + '</span><span class="sub">Bók: ' + (c.book.indexOf("–") > 0 ? "kaflar " : "kafli ") + c.book + ' · ' + esc(c.short) + '</span></span>' +
        '<span class="pips" aria-label="Skref">' + pips + '</span>' +
        '<span class="score">' + (cs.best != null ? gradeStr(cs.best) : (open ? "" : "🔒")) + '</span>';
      h += '<li class="' + cls + '">' + (open ? '<a href="#/k/' + c.n + '">' + inner + '</a>' : '<div aria-disabled="true">' + inner + '</div>') + '</li>';
    });
    var fo = E.finalOpen();
    var fin = '<span class="dot">★</span><span class="body"><span class="ttl">Lokapróf</span><span class="sub">Fimm dæmi úr öllu námsefninu, 20% hvert, eins og gömlu prófin</span></span><span class="pips"></span><span class="score">' + (s.final.best != null ? gradeStr(s.final.best) : (fo ? "" : "🔒")) + '</span>';
    h += '<li class="stop final' + (fo ? "" : " locked") + (s.final.passed ? " done" : "") + '">' + (fo ? '<a href="#/lokaprof">' + fin + '</a>' : '<div aria-disabled="true">' + fin + '</div>') + '</li>';
    h += '</ol>';
    h += '<section class="tools">' +
      '<a class="btn" href="#/synisprof">Sample questions frá kennaranum</a>' +
      '<a class="btn ghost" href="#/formulur">Formúlublað</a>' +
      '<button type="button" class="btn ghost" data-act="open-all">' + (s.open ? "Læsa köflunum aftur" : "Opna alla kafla") + '</button>' +
      '<button type="button" class="btn ghost" data-act="reset">Byrja upp á nýtt</button>' +
      '<p class="small">Framvindan er geymd í þessum vafra. „Opna alla kafla“ er yfirferðarhamur sem sleppir lásunum. Efnið er unnið upp úr fyrirlestrum, vinnustofum, vikuprófum, gömlum lokaprófum og jöfnublaði námskeiðsins; tölurnar í dæmunum eru nýjar í hvert skipti.</p>' +
      '</section>';
    app.innerHTML = h;
    document.title = "Eðlisfræði 1V · Leiðin að lokaprófinu";
  }

  /* ---------- Kafli ---------- */
  function stepper(ch, step) {
    return '<nav class="stepper" aria-label="Skref kaflans">' + STEPS.map(function (st, k) {
      var open = E.stepOpen(ch, st.id), state = stepState(ch, st.id);
      var label = '<b>' + (state === "done" ? "✓" : (k + 1)) + '</b><span>' + st.name + '<small>' + stepNote(ch, st.id) + '</small></span>';
      var cls = "st " + state + (st.id === step ? " on" : "") + (open ? "" : " locked");
      return open ? '<a class="' + cls + '" href="#/k/' + ch.n + '/' + st.id + '"' + (st.id === step ? ' aria-current="step"' : '') + '>' + label + '</a>'
        : '<span class="' + cls + '" aria-disabled="true">' + label + '</span>';
    }).join('<i class="arrow" aria-hidden="true"></i>') + '</nav>';
  }
  function stepNote(ch, st) {
    if (st === "aefa") return Math.min(E.practiceCount(ch), E.practiceNeed(ch)) + " / " + E.practiceNeed(ch) + " leyst";
    if (st === "jofnur") return E.eqLearned(ch) + " / " + ch.eqs.length + " lærðar";
    var b = E.cs(ch.id).best;
    return b == null ? "náð við " + E.PASS : "best: " + gradeStr(b);
  }
  function chHead(ch, step) {
    return '<header class="chhead">' +
      '<a class="back" href="#/">← Leiðin</a>' +
      '<p class="kicker">Kafli ' + ch.n + ' af ' + E.chapters.length + ' · Bók: ' + (ch.book.indexOf("–") > 0 ? "kaflar " : "kafli ") + ch.book + '</p>' +
      '<h1>' + esc(ch.title) + '</h1>' +
      '<p class="lede">' + M(ch.intro) + '</p>' +
      '<div id="stepper">' + stepper(ch, step) + '</div>' +
      '</header>';
  }
  function refreshStepper(ch, step) {
    var el = document.getElementById("stepper");
    if (el) el.innerHTML = stepper(ch, step);
  }
  function viewChapter(n, step) {
    var ch = E.chapters[n - 1];
    if (!ch) return viewHome();
    var i = n - 1;
    if (!E.chOpen(i)) {
      app.innerHTML = '<section class="locked-msg"><a class="back" href="#/">← Leiðin</a><h1>Kafli ' + n + ' er læstur</h1><p>Hann opnast þegar þú nærð ' + E.PASS + ' í kaflaprófi ' + E.chapters[i - 1].n + '. kafla, <a href="#/k/' + (n - 1) + '">' + esc(E.chapters[i - 1].title) + '</a>.</p></section>';
      return;
    }
    if (!step) {
      step = !E.practiceDone(ch) ? "aefa" : (!E.eqDone(ch) ? "jofnur" : "prof");
      history.replaceState(null, "", "#/k/" + n + "/" + step);
    }
    if (!E.stepOpen(ch, step)) step = !E.practiceDone(ch) ? "aefa" : "jofnur";
    document.title = ch.title + " · Eðlisfræði 1V";
    var body = step === "aefa" ? practiceBody(ch) : step === "jofnur" ? eqBody(ch) : testBody(ch);
    app.innerHTML = chHead(ch, step) + '<section class="stepbody" data-ch="' + ch.id + '" data-step="' + step + '">' + body + '</section>';
  }

  /* ---------- Skref 1: æfingadæmi ---------- */
  function prState(ch, p) {
    var a = sess.pr[ch.id] = sess.pr[ch.id] || {};
    if (!a[p.id]) a[p.id] = { inst: p.gen(R, E), peeked: false, hint: false, values: [], marks: [], msg: "" };
    return a[p.id];
  }
  function practiceGoal(ch) {
    var c = E.practiceCount(ch), need = E.practiceNeed(ch);
    var done = c >= need;
    return '<div class="goal' + (done ? " ok" : "") + '"><p>' + (done
      ? '<b>Æfingadæmum lokið.</b> Næsta skref er að læra jöfnurnar sem þú notaðir. <a class="btn small" href="#/k/' + ch.n + '/jofnur">Áfram í jöfnurnar →</a>'
      : 'Leystu <b>' + need + '</b> af ' + ch.problems.length + ' dæmum (' + c + ' komin). Vísbendingin sýnir jöfnurnar. Ef þú skoðar lausnina telst dæmið ekki leyst fyrr en þú hefur reiknað það aftur með nýjum tölum.') + '</p></div>';
  }
  function practiceBody(ch) {
    return '<div id="goal">' + practiceGoal(ch) + '</div>' +
      ch.problems.map(function (p, k) { return '<div class="pslot" id="p-' + p.id + '">' + probCard(ch, p, k) + '</div>'; }).join("");
  }
  function partsHtml(parts, st, disabled) {
    var multi = parts.length > 1;
    return '<ol class="parts' + (multi ? "" : " single") + '">' + parts.map(function (pt, j) {
      var mk = st.marks[j], id = "in-" + Math.random().toString(36).slice(2, 8);
      return '<li class="part' + (mk === true ? " right" : mk === false ? " wrong" : "") + '">' +
        (multi ? '<span class="pletter" aria-hidden="true">' + LETTERS[j] + ')</span>' : '') +
        '<div class="pbody">' +
        '<label class="pq" for="' + id + '">' + M(pt.label) + '</label>' +
        '<div class="pin"><input id="' + id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Svar" data-j="' + j + '" value="' + esc(st.values[j] || "") + '"' + (disabled ? " disabled" : "") + '>' +
        '<span class="unit">' + (pt.unit ? M("$" + E.u(pt.unit).replace(/^\\,/, "") + "$") : "") + '</span>' +
        (mk === true ? '<span class="mk">Rétt</span>' : mk === false ? '<span class="mk">Rangt</span>' : '') + '</div>' +
        '</div></li>';
    }).join("") + '</ol>';
  }
  function stepsHtml(inst) {
    var multi = inst.parts.length > 1;
    return '<ol class="steps">' + inst.steps.map(function (s) { return '<li>' + M(s) + '</li>'; }).join("") + '</ol>' +
      '<div class="ans"><b>Svör</b>' + inst.parts.map(function (pt, j) {
        return '<div>' + (multi ? '<span class="al">' + LETTERS[j] + ')</span> ' : '') + M(pt.label) + ': <b>' + M(E.q(pt.ans, pt.unit)) + '</b></div>';
      }).join("") + '</div>';
  }
  function hintHtml(ch, p, inst) {
    var eqs = (p.eqs || []).map(function (id) { return E.eqById(ch, id); }).filter(Boolean);
    return (inst.hint ? '<p>' + M(inst.hint) + '</p>' : '') +
      (eqs.length ? '<div class="hint-eqs">' + eqs.map(function (e) { return '<div><small>' + esc(e.name) + '</small>' + M("$\\displaystyle " + e.tex + "$") + '</div>'; }).join("") + '</div>' : '');
  }
  function probCard(ch, p, k) {
    var st = prState(ch, p), inst = st.inst, solved = !!E.cs(ch.id).solved[p.id];
    return '<article class="prob' + (solved ? " solved" : "") + '" data-p="' + p.id + '">' +
      '<header><h3><span class="pn">Dæmi ' + (k + 1) + '</span> ' + esc(p.title) + '</h3>' + (solved ? '<span class="badge">✓ Leyst</span>' : '') + '</header>' +
      (p.src ? '<p class="from small">' + esc(p.src) + '</p>' : '') +
      '<div class="ptext">' + M(inst.text) + '</div>' +
      (p.img ? '<figure class="fig"><img src="' + p.img + '" alt="' + esc(p.alt || "") + '" loading="lazy"></figure>' : '') +
      (inst.after ? '<p class="after">' + M(inst.after) + '</p>' : '') +
      partsHtml(inst.parts, st, false) +
      '<p class="tip">Tugabrot með kommu eða punkti; veldi má skrifa 3,2e-4.</p>' +
      '<div class="pbtns">' +
      '<button type="button" class="btn" data-act="check">Athuga</button>' +
      (ch.samples ? '' : '<button type="button" class="btn ghost" data-act="hint" aria-expanded="' + st.hint + '">Vísbending</button>') +
      '<button type="button" class="btn ghost" data-act="sol" aria-expanded="' + st.peeked + '">Sýna lausn</button>' +
      (ch.samples ? '' : '<button type="button" class="btn ghost" data-act="new">Nýjar tölur</button>') +
      '</div>' +
      (st.msg ? '<p class="fb ' + st.msgCls + '" role="status">' + st.msg + '</p>' : '') +
      (st.hint ? '<div class="hint">' + hintHtml(ch, p, inst) + '</div>' : '') +
      (st.peeked ? '<div class="sol"><h4>Lausn</h4>' + stepsHtml(inst) + '</div>' : '') +
      '</article>';
  }
  function readValues(el) {
    return Array.prototype.map.call(el.querySelectorAll("input[data-j]"), function (i) { return i.value; });
  }
  function onPractice(act, card, ch) {
    var pid = card.getAttribute("data-p");
    var p = ch.problems.filter(function (x) { return x.id === pid; })[0];
    var k = ch.problems.indexOf(p);
    var st = prState(ch, p);
    st.values = readValues(card);
    if (act === "check") {
      st.marks = st.inst.parts.map(function (pt, j) { return E.close(E.parse(st.values[j]), pt.ans, pt.tol); });
      var empty = st.values.some(function (v) { return !String(v).trim(); });
      var all = st.marks.every(Boolean);
      if (all && !st.peeked) {
        var was = E.practiceDone(ch);
        E.cs(ch.id).solved[p.id] = true; E.save();
        st.msg = "Rétt! Vel gert."; st.msgCls = "good";
        if (!was && E.practiceDone(ch)) st.msg += " Þú hefur lokið æfingadæmunum.";
      } else if (all) {
        st.msg = "Rétt, en þú skoðaðir lausnina. Smelltu á „Nýjar tölur“ og reiknaðu dæmið sjálf(ur) til að það teljist leyst."; st.msgCls = "warn";
      } else if (empty) {
        st.msg = "Fylltu í alla reitina."; st.msgCls = "warn";
        st.marks = st.marks.map(function (m, j) { return String(st.values[j]).trim() ? m : undefined; });
      } else {
        st.msg = "Ekki alveg. Athugaðu einingarnar og formerkið, eða skoðaðu vísbendinguna."; st.msgCls = "bad";
      }
    } else if (act === "hint") {
      st.hint = !st.hint;
    } else if (act === "sol") {
      st.peeked = true; st.msg = "";
    } else if (act === "new") {
      sess.pr[ch.id][p.id] = null; st = prState(ch, p);
    }
    document.getElementById("p-" + p.id).innerHTML = probCard(ch, p, k);
    document.getElementById("goal").innerHTML = ch.samples ? sampleGoal(ch) : practiceGoal(ch);
    refreshStepper(ch, "aefa");
    if (act === "new") { var f = document.querySelector("#p-" + p.id + " input"); if (f) f.focus(); }
  }

  /* ---------- Skref 2: jöfnurnar ---------- */
  function eqGoal(ch) {
    var c = E.eqLearned(ch), done = c >= ch.eqs.length;
    return '<div class="goal' + (done ? " ok" : "") + '"><p>' + (done
      ? '<b>Þú kannt jöfnurnar.</b> Kaflaprófið er opið. <a class="btn small" href="#/k/' + ch.n + '/prof">Áfram í kaflaprófið →</a>'
      : 'Jafna telst lærð þegar þú hefur svarað <b>' + E.MASTER + '</b> spurningum um hana rétt (rangt svar dregur eina frá). <b>' + c + ' / ' + ch.eqs.length + '</b> lærðar.') + '</p></div>';
  }
  function eqCards(ch) {
    var s = E.cs(ch.id);
    return ch.eqs.map(function (e) {
      var c = Math.min(s.eq[e.id] || 0, E.MASTER), pips = "";
      for (var k = 0; k < E.MASTER; k++) pips += k < c ? "●" : "○";
      return '<article class="eqc' + (c >= E.MASTER ? " learned" : "") + '">' +
        '<header><h3>' + esc(e.name) + '</h3><span class="mpips" title="' + c + ' af ' + E.MASTER + ' réttum">' + pips + '</span></header>' +
        '<div class="eqtex">' + M("$$" + e.tex + "$$") + '</div>' +
        '<p>' + M(e.about) + '</p>' +
        (e.vars && e.vars.length ? '<table class="vars"><tbody>' + e.vars.map(function (v) {
          return '<tr><td>' + M("$" + v[0] + "$") + '</td><td>' + M(v[1]) + '</td><td>' + (v[2] ? M("$" + E.u(v[2]).replace(/^\\,/, "") + "$") : "") + '</td></tr>';
        }).join("") + '</tbody></table>' : '') +
        '</article>';
    }).join("");
  }
  function pickDrill(ch, prev) {
    var s = E.cs(ch.id);
    var todo = ch.eqs.filter(function (e) { return (s.eq[e.id] || 0) < E.MASTER; });
    var pool = todo.length ? todo : ch.eqs;
    if (pool.length > 1 && prev) pool = pool.filter(function (e) { return e.id !== prev.eq; });
    var eq = R.pick(pool);
    var types = E.eqTypes(ch, eq);
    if (prev && prev.eq === eq.id && types.length > 1) types = types.filter(function (t) { return t !== prev.type; });
    return E.eqQuestion(ch, eq, R.pick(types));
  }
  function mcHtml(q, chosen, name, reveal) {
    return '<div class="mc" role="group">' + q.options.map(function (o, k) {
      var cls = "opt";
      if (reveal && k === q.answer) cls += " right";
      else if (reveal && k === chosen) cls += " wrong";
      else if (!reveal && k === chosen) cls += " chosen";
      return '<button type="button" class="' + cls + '" data-act="' + name + '" data-k="' + k + '"' + (reveal ? " disabled" : "") + '>' + M(o) + '</button>';
    }).join("") + '</div>';
  }
  function drillBox(ch) {
    var d = sess.drill[ch.id];
    if (!d) d = sess.drill[ch.id] = { q: pickDrill(ch, null), chosen: null, n: 0, right: 0 };
    var q = d.q, ans = d.chosen != null;
    var h = '<div class="drill"><header><h2>Þjálfun</h2><span class="small">' + d.right + ' rétt af ' + d.n + ' í þessari lotu</span></header>' +
      '<p class="dq">' + M(q.prompt) + '</p>' + mcHtml(q, d.chosen, "drill", ans);
    if (ans) {
      var ok = d.chosen === q.answer, eq = E.eqById(ch, q.eq);
      h += '<p class="fb ' + (ok ? "good" : "bad") + '" role="status">' + (ok ? "Rétt!" : "Ekki rétt.") + ' ' + M("$\\displaystyle " + eq.tex + "$") + ' <span class="small">(' + esc(eq.name) + ')</span></p>' +
        '<button type="button" class="btn" data-act="drill-next">Næsta spurning →</button>';
    }
    return h + '</div>';
  }
  function eqBody(ch) {
    return '<div id="goal">' + eqGoal(ch) + '</div>' +
      '<div id="drill">' + drillBox(ch) + '</div>' +
      '<div class="eqbar"><h2>Jöfnur kaflans</h2><button type="button" class="btn ghost small" data-act="hide-eq" aria-pressed="' + sess.hideEq + '">' + (sess.hideEq ? "Sýna jöfnurnar" : "Fela jöfnurnar") + '</button></div>' +
      '<div class="eqgrid' + (sess.hideEq ? " hidden-eq" : "") + '" id="eqgrid">' + eqCards(ch) + '</div>';
  }
  function onEq(act, el, ch) {
    var d = sess.drill[ch.id];
    if (act === "drill" && d && d.chosen == null) {
      d.chosen = +el.getAttribute("data-k"); d.n++;
      var s = E.cs(ch.id), id = d.q.eq;
      if (d.chosen === d.q.answer) { d.right++; s.eq[id] = Math.min((s.eq[id] || 0) + 1, E.MASTER); }
      else s.eq[id] = Math.max((s.eq[id] || 0) - 1, 0);
      E.save();
    } else if (act === "drill-next") {
      d.q = pickDrill(ch, d.q); d.chosen = null;
    } else if (act === "hide-eq") {
      sess.hideEq = !sess.hideEq;
      viewChapter(ch.n, "jofnur");
      return;
    }
    document.getElementById("drill").innerHTML = drillBox(ch);
    document.getElementById("goal").innerHTML = eqGoal(ch);
    document.getElementById("eqgrid").innerHTML = eqCards(ch);
    refreshStepper(ch, "jofnur");
    var b = document.querySelector("#drill [data-act=drill-next], #drill .opt:not([disabled])");
    if (b) b.focus({ preventScroll: true });
  }

  /* ---------- Skref 3: kaflapróf ---------- */
  function newTest(ch) {
    var items = R.shuffle(ch.problems).map(function (p) { return { kind: "num", p: p, inst: p.gen(R, E), values: [], marks: [] }; });
    var eqs = R.shuffle(ch.eqs).slice(0, 3);
    eqs.forEach(function (e) { items.push({ kind: "mc", q: E.eqQuestion(ch, e), chosen: null }); });
    return { items: items, submitted: false, grade: null };
  }
  function testIntro(ch) {
    var cs = E.cs(ch.id);
    return '<div class="intro-card"><h2>Kaflapróf</h2>' +
      '<p>' + ch.problems.length + ' reiknidæmi með nýjum tölum og 3 spurningar um jöfnurnar. Engar vísbendingar fyrr en þú skilar, þá sérðu lausnirnar. Hver liður gildir jafnt. Einkunn <b>' + E.PASS + '</b> eða hærri opnar næsta kafla.</p>' +
      (cs.best != null ? '<p>Besta einkunn hingað til: <b>' + gradeStr(cs.best) + '</b>' + (cs.passed ? ' ✓' : '') + '</p>' : '') +
      '<button type="button" class="btn" data-act="test-start">Byrja prófið</button></div>';
  }
  function itemHtml(it, k, sub) {
    var h = '<article class="titem' + (sub ? (itemScore(it).r === itemScore(it).t ? " right" : " wrong") : "") + '" data-k="' + k + '">' +
      '<header><h3><span class="pn">' + (k + 1) + '.</span> ' + (it.kind === "num" ? esc(it.p.title) : "Jafna") + '</h3>' +
      (sub ? '<span class="badge">' + itemScore(it).r + ' / ' + itemScore(it).t + '</span>' : '') + '</header>';
    if (it.kind === "num") {
      h += '<div class="ptext">' + M(it.inst.text) + '</div>' + partsHtml(it.inst.parts, it, sub);
      if (sub) h += '<details class="sol"' + (itemScore(it).r < itemScore(it).t ? " open" : "") + '><summary>Lausn</summary>' + stepsHtml(it.inst) + '</details>';
    } else {
      h += '<p class="dq">' + M(it.q.prompt) + '</p>' + mcHtml(it.q, it.chosen, "tmc", sub);
    }
    return h + '</article>';
  }
  function itemScore(it) {
    if (it.kind === "num") return { r: it.marks.filter(function (m) { return m === true; }).length, t: it.inst.parts.length };
    return { r: it.chosen === it.q.answer ? 1 : 0, t: 1 };
  }
  function testBody(ch) {
    var t = sess.test[ch.id];
    if (!t) return testIntro(ch);
    var h = "";
    if (t.submitted) {
      var pass = t.grade >= E.PASS, nx = E.chapters[chIndex(ch) + 1];
      h += '<div class="result ' + (pass ? "ok" : "no") + '" id="result" tabindex="-1"><div class="big">' + gradeStr(t.grade) + '</div><div>' +
        '<p><b>' + (pass ? (t.grade >= 9.5 ? "Frábært!" : "Staðið!") : "Ekki alveg komið.") + '</b> ' + t.right + ' af ' + t.total + ' liðum réttir. ' +
        (pass ? (nx ? 'Næsti kafli, <b>' + esc(nx.title) + '</b>, er opinn.' : 'Allir kaflar búnir: lokaprófið er opið.') : 'Þú þarft ' + E.PASS + '. Farðu yfir lausnirnar hér fyrir neðan og reyndu aftur með nýjum tölum.') + '</p>' +
        '<p>' + (pass ? (nx ? '<a class="btn" href="#/k/' + nx.n + '">Næsti kafli →</a> ' : '<a class="btn" href="#/lokaprof">Lokaprófið →</a> ') : '') +
        '<button type="button" class="btn ghost" data-act="test-start">Nýtt próf</button></p></div></div>';
    }
    h += '<div class="test">' + t.items.map(function (it, k) { return itemHtml(it, k, t.submitted); }).join("") + '</div>';
    if (!t.submitted) h += '<div class="submit"><button type="button" class="btn" data-act="test-submit">Skila prófi</button><span class="small">Tómur reitur telst rangur.</span></div>';
    return h;
  }
  function onTest(act, el, ch) {
    var t = sess.test[ch.id];
    if (act === "test-start") {
      sess.test[ch.id] = newTest(ch);
    } else if (act === "tmc" && t && !t.submitted) {
      var item = t.items[+el.closest(".titem").getAttribute("data-k")];
      item.chosen = +el.getAttribute("data-k");
      el.parentNode.querySelectorAll(".opt").forEach(function (b, k) { b.classList.toggle("chosen", k === item.chosen); });
      return;
    } else if (act === "test-submit" && t && !t.submitted) {
      collectTest(t);
      var r = 0, tot = 0;
      t.items.forEach(function (it) {
        if (it.kind === "num") it.marks = it.inst.parts.map(function (pt, j) { return E.close(E.parse(it.values[j]), pt.ans, pt.tol); });
        var sc = itemScore(it); r += sc.r; tot += sc.t;
      });
      t.right = r; t.total = tot; t.grade = E.grade(r, tot); t.submitted = true;
      var cs = E.cs(ch.id);
      cs.best = cs.best == null ? t.grade : Math.max(cs.best, t.grade);
      if (t.grade >= E.PASS) cs.passed = true;
      E.save();
    }
    viewChapter(ch.n, "prof");
    var res = document.getElementById("result");
    if (res) { res.scrollIntoView({ block: "start" }); res.focus({ preventScroll: true }); }
    else window.scrollTo(0, document.querySelector(".stepbody").offsetTop - 16);
  }
  function collectTest(t) {
    document.querySelectorAll(".titem").forEach(function (el) {
      var it = t.items[+el.getAttribute("data-k")];
      if (it.kind === "num") it.values = readValues(el);
    });
  }

  /* ---------- Lokapróf ---------- */
  function newFinal() {
    var groups = [];
    E.exam.forEach(function (p) { if (groups.indexOf(p.group) < 0) groups.push(p.group); });
    var items = groups.map(function (g) {
      var p = R.pick(E.exam.filter(function (x) { return x.group === g; }));
      return { kind: "num", p: p, inst: p.gen(R, E), values: [], marks: [] };
    });
    return { items: items, submitted: false, start: Date.now() };
  }
  function viewFinal() {
    document.title = "Lokapróf · Eðlisfræði 1V";
    if (!E.finalOpen()) {
      app.innerHTML = '<section class="locked-msg"><a class="back" href="#/">← Leiðin</a><h1>Lokaprófið er læst</h1><p>Það opnast þegar þú hefur staðist öll kaflaprófin. Á forsíðunni getur þú líka opnað allt í yfirferðarham.</p></section>';
      return;
    }
    var s = E.load(), f = sess.final;
    var h = '<header class="chhead"><a class="back" href="#/">← Leiðin</a><p class="kicker">Lokapróf · EÐL102G</p><h1>Lokapróf ferðalagsins</h1>' +
      '<p class="lede">Fimm dæmi á sama sniði og gömlu lokaprófin (2013–2018): eitt úr hverjum hluta námsefnisins, hvert 20%. Á alvöru prófinu hefur þú 3 klukkustundir, vasareikni og jöfnublaðið, svo hafðu <a href="#/formulur" target="_blank">formúlublaðið</a> opið við hliðina. Einkunn ' + E.FINAL_PASS + ' eða hærri telst staðin.</p></header>';
    if (!f) {
      h += '<div class="intro-card"><h2>Tilbúin(n)?</h2><p>Dæmin eru valin af handahófi úr safni sem er unnið upp úr gömlu prófunum, með nýjum tölum. Hver liður innan dæmis gildir jafnt. Þegar þú skilar sérðu lausnirnar.</p>' +
        (s.final.best != null ? '<p>Besta einkunn: <b>' + gradeStr(s.final.best) + '</b></p>' : '') +
        '<button type="button" class="btn" data-act="final-start">Byrja lokaprófið</button></div>';
    } else {
      if (f.submitted) {
        var pass = f.grade >= E.FINAL_PASS;
        h += '<div class="result ' + (pass ? "ok" : "no") + '" id="result" tabindex="-1"><div class="big">' + gradeStr(f.grade) + '</div><div><p><b>' + (pass ? (f.grade >= 9 ? "Þú ert tilbúin(n) fyrir prófið!" : "Staðið!") : "Ekki staðið að þessu sinni.") + '</b> Tími: ' + f.mins + ' mín. ' +
          (pass ? 'Taktu annað próf með nýjum dæmum til að æfa þig enn frekar.' : 'Skoðaðu lausnirnar og farðu aftur í kaflana þar sem þú misstir stig.') + '</p>' +
          '<p><button type="button" class="btn" data-act="final-start">Nýtt lokapróf</button></p></div></div>';
      } else {
        h += '<p class="small timer" id="timer"></p>';
      }
      h += '<div class="test">' + f.items.map(function (it, k) {
        var sc = itemScore(it);
        return '<article class="titem exam' + (f.submitted ? (sc.r === sc.t ? " right" : " wrong") : "") + '" data-k="' + k + '">' +
          '<header><h3><span class="pn">Dæmi ' + (k + 1) + '</span> ' + esc(it.p.title) + ' <span class="w">(20%)</span></h3>' + (f.submitted ? '<span class="badge">' + sc.r + ' / ' + sc.t + '</span>' : '') + '</header>' +
          '<p class="from small">' + esc(it.p.group) + ' · ' + esc(it.p.source) + '</p>' +
          '<div class="ptext">' + M(it.inst.text) + '</div>' + partsHtml(it.inst.parts, it, f.submitted) +
          (f.submitted ? '<details class="sol"' + (sc.r < sc.t ? " open" : "") + '><summary>Lausn</summary>' + stepsHtml(it.inst) + '</details>' : '') +
          '</article>';
      }).join("") + '</div>';
      if (!f.submitted) h += '<div class="submit"><button type="button" class="btn" data-act="final-submit">Skila prófi</button><span class="small">Tómur reitur telst rangur.</span></div>';
    }
    app.innerHTML = h;
    tick();
  }
  var timerId = null;
  function tick() {
    clearInterval(timerId);
    var el = document.getElementById("timer"), f = sess.final;
    if (!el || !f || f.submitted) return;
    function up() {
      var m = Math.floor((Date.now() - f.start) / 60000);
      el.textContent = "Tími liðinn: " + m + " mín af 180";
    }
    up(); timerId = setInterval(up, 15000);
  }
  function onFinal(act) {
    var f = sess.final;
    if (act === "final-start") sess.final = newFinal();
    else if (act === "final-submit" && f && !f.submitted) {
      collectTest(f);
      var sum = 0;
      f.items.forEach(function (it) {
        it.marks = it.inst.parts.map(function (pt, j) { return E.close(E.parse(it.values[j]), pt.ans, pt.tol); });
        var sc = itemScore(it); sum += 2 * sc.r / sc.t;
      });
      f.grade = Math.round(2 * sum) / 2; f.submitted = true; f.mins = Math.max(1, Math.round((Date.now() - f.start) / 60000));
      var s = E.load();
      s.final.best = s.final.best == null ? f.grade : Math.max(s.final.best, f.grade);
      if (f.grade >= E.FINAL_PASS) s.final.passed = true;
      E.save();
    }
    viewFinal();
    var res = document.getElementById("result");
    if (res) { res.scrollIntoView({ block: "start" }); res.focus({ preventScroll: true }); }
    else window.scrollTo(0, 0);
  }

  /* ---------- Sýnidæmi kennarans (Sample Questions for the Final Exam) ---------- */
  function sampleGoal(ch) {
    var n = ch.problems.filter(function (p) { return E.cs(ch.id).solved[p.id]; }).length;
    return '<div class="goal' + (n === ch.problems.length ? " ok" : "") + '"><p>Kennarinn sendi þessi dæmi sem sýnishorn fyrir lokaprófið. Þau eru hér orðrétt, með sömu tölum og myndum. Reiknaðu hvern lið og smelltu á „Athuga“; lausnin er sýnd skref fyrir skref. <b>' + n + ' / ' + ch.problems.length + '</b> leyst.</p></div>';
  }
  function viewSamples() {
    var ch = E.samples;
    document.title = "Sample Questions · Eðlisfræði 1V";
    app.innerHTML = '<header class="chhead"><a class="back" href="#/">← Leiðin</a><p class="kicker">Frá kennaranum · alltaf opið</p><h1>Sample Questions for the Final Exam</h1>' +
      '<p class="lede">Fjögur dæmi úr gömlum lokaprófum sem kennarinn valdi sem dæmi um lokaprófið.</p></header>' +
      '<section class="stepbody" data-ch="synis" data-step="aefa"><div id="goal">' + sampleGoal(ch) + '</div>' +
      ch.problems.map(function (p, k) { return '<div class="pslot" id="p-' + p.id + '">' + probCard(ch, p, k) + '</div>'; }).join("") +
      '</section>';
  }

  /* ---------- Formúlublað ---------- */
  function viewFormulas() {
    document.title = "Formúlublað · Eðlisfræði 1V";
    var h = '<header class="chhead"><a class="back" href="#/">← Leiðin</a><p class="kicker">Alltaf opið</p><h1>Formúlublað</h1>' +
      '<p class="lede">Allar jöfnurnar á leiðinni, kafla fyrir kafla, í sama rithætti og jöfnublað námskeiðsins. Fasti: $g = 9{,}8\\,\\mathrm{m/s^2}$, $G = 6{,}67\\times10^{-11}\\,\\mathrm{N\\,m^2/kg^2}$.</p></header>';
    h += '<div class="sheet">' + E.chapters.map(function (c) {
      return '<section><h2><span>' + c.n + '</span> ' + esc(c.title) + '</h2><dl>' + c.eqs.map(function (e) {
        return '<div><dt>' + esc(e.name) + '</dt><dd>' + "$\\displaystyle " + e.tex + "$" + '</dd></div>';
      }).join("") + '</dl></section>';
    }).join("") + '</div>';
    app.innerHTML = M(h);
  }

  /* ---------- Leiðarval og atburðir ---------- */
  function route() {
    clearInterval(timerId);
    var parts = location.hash.replace(/^#\/?/, "").split("/");
    if (parts[0] === "k") viewChapter(+parts[1], parts[2]);
    else if (parts[0] === "lokaprof") viewFinal();
    else if (parts[0] === "formulur") viewFormulas();
    else if (parts[0] === "synisprof") viewSamples();
    else viewHome();
    if (!/test|final/.test(document.activeElement && document.activeElement.getAttribute("data-act") || "")) window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  app.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-act]");
    if (!el || el.disabled) return;
    var act = el.getAttribute("data-act");
    var body = el.closest(".stepbody");
    var ch = body ? (body.getAttribute("data-ch") === "synis" ? E.samples : E.byId(body.getAttribute("data-ch"))) : null;
    if (act === "open-all") { var s = E.load(); s.open = !s.open; E.save(); viewHome(); return; }
    if (act === "reset") {
      if (confirm("Eyða allri framvindu og byrja upp á nýtt?")) { E.reset(); sess = { pr: {}, drill: {}, test: {}, final: null, hideEq: false }; viewHome(); }
      return;
    }
    if (/^final/.test(act)) return onFinal(act);
    if (!ch) return;
    if (/^(check|hint|sol|new)$/.test(act)) return onPractice(act, el.closest(".prob"), ch);
    if (/^(drill|drill-next|hide-eq)$/.test(act)) return onEq(act, el, ch);
    if (/^(test-start|tmc|test-submit)$/.test(act)) return onTest(act, el, ch);
  });
  // Enter í svarreit = Athuga
  app.addEventListener("keydown", function (ev) {
    if (ev.key !== "Enter" || ev.target.tagName !== "INPUT") return;
    var card = ev.target.closest(".prob");
    if (card) { ev.preventDefault(); card.querySelector("[data-act=check]").click(); }
  });
  // Geyma svör í prófum þegar slegið er inn, svo þau glatist ekki við endurteikningu
  app.addEventListener("input", function (ev) {
    var item = ev.target.closest(".titem");
    if (!item) return;
    var t = location.hash.indexOf("lokaprof") >= 0 ? sess.final : sess.test[(document.querySelector(".stepbody") || {}).getAttribute && document.querySelector(".stepbody").getAttribute("data-ch")];
    if (t && t.items) t.items[+item.getAttribute("data-k")].values = readValues(item);
  });

  /* Þema (sami lykill og á hinum kennsluvefjunum) */
  var doc = document.documentElement, tb = document.querySelector(".theme-btn");
  function cur() { return doc.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); }
  function label() { tb.textContent = cur() === "dark" ? "☀ Ljóst" : "☾ Dökkt"; }
  tb.addEventListener("click", function () {
    var n = cur() === "dark" ? "light" : "dark";
    doc.setAttribute("data-theme", n);
    try { localStorage.setItem("tk-theme", n); } catch (e) {}
    label();
  });
  label();

  route();
})();

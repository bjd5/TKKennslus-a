/* quiz.js – viðmót æfingasíðunnar. Spurningarnar sjálfar eru í bank.js. */
(function () {
  "use strict";
  if (!window.TK || !window.TK.bank) return;
  var B = window.TK.bank, G = B.G, MC = B.MC, pick = B.pick, is = B.is, parseAnswer = B.parseAnswer;

  /* ---------- Viðmót ---------- */
  var TOPICS = [{ id: "allt", label: "Allt" }].concat(B.TOPICS);
  var MODES = [
    { id: "skilja", label: "Skilningur (val)" },
    { id: "reikna", label: "Kóðadæmi (slembitölur)" },
    { id: "blanda", label: "Blanda" },
  ];

  var root = document.getElementById("quiz");
  if (!root) return;
  var state = { topic: "allt", mode: "skilja", cur: null, answered: false };
  var stats = window.store.get("tol101g-quiz-stats", { n: 0, ok: 0, streak: 0, best: 0 });

  function scoreHtml() {
    return "<span>Svarað <b>" + stats.n + "</b></span><span>Rétt <b>" + stats.ok + "</b>" + (stats.n ? " (" + Math.round((100 * stats.ok) / stats.n) + " %)" : "") + "</span><span>Röð <b>" + stats.streak + "</b></span><span>Best <b>" + stats.best + '</b></span><button type="button" class="linkbtn" id="q-reset">Núllstilla</button>';
  }

  function bindReset() {
    document.getElementById("q-reset").addEventListener("click", function () {
      stats = { n: 0, ok: 0, streak: 0, best: 0 };
      window.store.set("tol101g-quiz-stats", stats);
      render(); next();
    });
  }

  function render() {
    var h = '<div class="toolbar"><span class="tl" id="q-tl-topic">Efni</span><div class="chips" role="group" aria-labelledby="q-tl-topic">';
    TOPICS.forEach(function (t) {
      h += '<button type="button" class="chip" data-topic="' + t.id + '" aria-pressed="' + (state.topic === t.id) + '">' + t.label + "</button>";
    });
    h += '</div><span class="tl" id="q-tl-mode">Tegund</span><div class="chips" role="group" aria-labelledby="q-tl-mode">';
    MODES.forEach(function (t) {
      h += '<button type="button" class="chip" data-mode="' + t.id + '" aria-pressed="' + (state.mode === t.id) + '">' + t.label + "</button>";
    });
    h += '</div></div><div class="scorebar" aria-live="polite">' + scoreHtml() + "</div>";
    h += '<div id="q-area"></div>';
    root.innerHTML = h;
    root.querySelectorAll("[data-topic]").forEach(function (b) {
      b.addEventListener("click", function () { state.topic = b.getAttribute("data-topic"); render(); next(); });
    });
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { state.mode = b.getAttribute("data-mode"); render(); next(); });
    });
    bindReset();
  }

  function record(ok) {
    stats.n++;
    if (ok) { stats.ok++; stats.streak++; stats.best = Math.max(stats.best, stats.streak); } else stats.streak = 0;
    window.store.set("tol101g-quiz-stats", stats);
    var sb = root.querySelector(".scorebar");
    if (sb) {
      sb.innerHTML = scoreHtml();
      bindReset();
    }
  }

  function next() {
    var inTopic = function (t) { return state.topic === "allt" || t === state.topic; };
    var gens = G.filter(function (g) { return inTopic(g.topic || (g.topic = g().topic)); });
    var mcs = MC.filter(function (m) { return inTopic(m.topic); });
    var kind = state.mode === "blanda" ? (Math.random() < 0.4 ? "reikna" : "skilja") : state.mode;
    if (kind === "reikna" && !gens.length) kind = "skilja"; // ekkert reiknidæmi í þessu efni
    if (kind === "skilja" && !mcs.length) kind = "reikna";
    var q = null;
    if (kind === "reikna" && gens.length) q = { kind: "num", d: pick(gens)() };
    else if (mcs.length) q = { kind: "mc", d: pick(mcs) };
    state.cur = q;
    state.answered = false;
    showQuestion();
  }

  function topicLabel(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[i].label;
    return id;
  }


  function showQuestion() {
    var area = document.getElementById("q-area");
    var q = state.cur;
    if (!q) { area.innerHTML = "<p>Engin spurning fannst fyrir þetta val.</p>"; return; }
    var h = '<div class="qcard"><div class="qmeta">' + topicLabel(q.d.topic) + (q.kind === "num" ? " · " + q.d.title : " · Skilningur") + "</div>";
    if (q.kind === "num") {
      h += '<div class="qtext">' + q.d.text + "</div>";
      h += '<form id="q-form" style="margin-top:1rem" autocomplete="off"><div class="ans-box">' + B.answerInput("q-in", q.d) + '</div><div class="row" style="margin-top:0.6rem"><div class="fixed"><button class="btn" type="submit">Athuga</button></div><div class="fixed"><button class="btn ghost" type="button" id="q-show">Sýna lausn</button></div></div></form><p class="qhint">' + (B.isText(q.d) ? "Skrifaðu nákvæmlega það sem prentast, eina línu fyrir hverja línu. Bil aftast í línu skipta ekki máli." : "Tala með punkti eða kommu.") + " „Sýna lausn“ telst sem rangt svar.</p>';
    } else {
      var order = q.d.o.map(function (_, i) { return i; });
      for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = order[i]; order[i] = order[j]; order[j] = t; }
      q.order = order;
      h += '<div class="qtext">' + q.d.q + '</div><div class="opts">';
      order.forEach(function (oi, k) { h += '<button type="button" class="opt" data-i="' + oi + '">' + q.d.o[oi] + "</button>"; });
      h += "</div>";
    }
    h += '<div class="result" id="q-res" aria-live="polite"></div><div id="q-sol"></div><div class="qnext"><button type="button" class="btn ghost" id="q-next">Næsta spurning →</button></div></div>';
    area.innerHTML = h;
    window.renderMath(area);
    document.getElementById("q-next").addEventListener("click", next);
    if (q.kind === "num") {
      var inp = document.getElementById("q-in");
      if (inp) inp.focus({ preventScroll: true });
      document.getElementById("q-form").addEventListener("submit", function (ev) { ev.preventDefault(); checkNum(); });
      document.getElementById("q-show").addEventListener("click", function () { reveal(false); });
    } else {
      area.querySelectorAll(".opt").forEach(function (b) {
        b.addEventListener("click", function () { checkMc(parseInt(b.getAttribute("data-i"), 10)); });
      });
    }
  }

  function reveal(ok) {
    var q = state.cur;
    var sol = document.getElementById("q-sol");
    var ans = q.kind === "num"
      ? "<p><b>Rétt svar:</b></p>" + B.answerHtml(q.d)
      : "";
    sol.innerHTML = '<div class="sol" style="border-top:1px solid var(--rule);margin-top:1rem;padding-top:0.8rem">' + ans + (q.kind === "num" ? q.d.sol : "<p>" + q.d.e + "</p>") + "</div>";
    window.renderMath(sol);
    if (!state.answered) { state.answered = true; record(ok); }
  }

  function checkNum() {
    if (state.answered) return;
    var q = state.cur;
    var ok = B.isRight(q.d, document.getElementById("q-in").value);
    var res = document.getElementById("q-res");
    if (ok === null) { res.className = "result no"; res.textContent = B.isText(q.d) ? "Skrifaðu úttakið fyrst." : "Skrifaðu tölu."; return; }
    res.className = "result " + (ok ? "ok" : "no");
    res.textContent = ok ? "Rétt." : "Ekki alveg. Berðu saman við lausnina hér að neðan.";
    reveal(ok);
  }

  function checkMc(i) {
    if (state.answered) return;
    var q = state.cur;
    var ok = i === q.d.c;
    document.querySelectorAll("#q-area .opt").forEach(function (b) {
      var bi = parseInt(b.getAttribute("data-i"), 10);
      b.disabled = true;
      if (bi === q.d.c) b.classList.add("right");
      else if (bi === i) b.classList.add("wrong");
    });
    var res = document.getElementById("q-res");
    res.className = "result " + (ok ? "ok" : "no");
    res.textContent = ok ? "Rétt." : "Ekki rétt.";
    reveal(ok);
  }

  render();
  next();
})();

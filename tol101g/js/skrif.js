/* skrif.js – kóðaskrif: nemandinn skrifar kóða frá grunni, eins og á prófinu, og ber svo saman
 * við fyrirmyndarlausn og matsblað. Gögnin eru í TK.SKRIF (js/skrif-data.js eða js/profhermir-data.js):
 *   { id, topic, title, points?, prompt (HTML), starter (kóði), hint (HTML), solution (kóði), checks: ["…", …] }
 * Uppkast og staða hvers verkefnis eru geymd í localStorage (lykill eftir síðu). */
(function () {
  "use strict";
  var TK = window.TK || {};
  var root = document.getElementById("skrif");
  if (!root || !TK.SKRIF) return;
  var DATA = TK.SKRIF, KEY = "tol101g-skrif-" + (root.getAttribute("data-key") || "kodaskrif");
  var S = window.store.get(KEY, { done: {}, draft: {} });
  function save() { window.store.set(KEY, S); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function dedent(s) {
    var lines = String(s || "").replace(/^\n/, "").replace(/\s+$/, "").split("\n");
    var m = Math.min.apply(null, lines.filter(function (l) { return l.trim(); }).map(function (l) { return l.match(/^ */)[0].length; }));
    return lines.map(function (l) { return l.slice(isFinite(m) ? m : 0); }).join("\n");
  }
  var topics = [];
  DATA.forEach(function (t) { if (topics.indexOf(t.topic) === -1) topics.push(t.topic); });
  var state = { topic: window.store.get(KEY + "-topic", "allt") };
  if (state.topic !== "allt" && topics.indexOf(state.topic) === -1) state.topic = "allt";

  function bar() {
    var n = DATA.filter(function (t) { return S.done[t.id]; }).length;
    return '<div class="scorebar"><span>Leyst: <b>' + n + "</b> af " + DATA.length + "</span></div>";
  }
  function render() {
    var h = (topics.length > 1 ? '<div class="toolbar"><span class="tl">Efni</span><div class="chips" role="group">' +
      ["allt"].concat(topics).map(function (t) { return '<button type="button" class="chip" data-t="' + esc(t) + '" aria-pressed="' + (state.topic === t) + '">' + (t === "allt" ? "Allt" : esc(t)) + "</button>"; }).join("") + "</div></div>" : "") + bar();
    DATA.forEach(function (t, i) {
      if (state.topic !== "allt" && t.topic !== state.topic) return;
      var done = !!S.done[t.id];
      h += '<section class="ex sk' + (done ? " sk-done" : "") + '" data-id="' + esc(t.id) + '"><div class="ex-head">' + (i + 1) + ". " + esc(t.title) + (t.points ? " <span>(" + t.points + " stig)</span>" : "") + (done ? ' <span class="sk-ok">✓ leyst</span>' : "") + '</div><div class="ex-body">' +
        '<div class="sk-prompt">' + t.prompt + "</div>" +
        '<label class="f" for="sk-' + esc(t.id) + '">Kóðinn þinn</label><textarea id="sk-' + esc(t.id) + '" class="sk-code" spellcheck="false" autocapitalize="off" autocomplete="off" rows="' + Math.max(6, Math.min(22, dedent(t.solution).split("\n").length + 2)) + '">' + esc(S.draft[t.id] !== undefined ? S.draft[t.id] : dedent(t.starter || "")) + "</textarea>" +
        '<div class="ws-btns">' + (t.hint ? '<button type="button" class="btn ghost" data-hint>Vísbending</button>' : "") + '<button type="button" class="btn" data-sol>Bera saman við lausn</button><button type="button" class="btn ghost" data-reset>Byrja upp á nýtt</button></div>' +
        '<div class="sk-hint" hidden>' + (t.hint || "") + "</div><div class=\"sk-sol\" hidden></div></div></section>";
    });
    root.innerHTML = h;
    root.querySelectorAll("[data-t]").forEach(function (b) { b.addEventListener("click", function () { state.topic = b.getAttribute("data-t"); window.store.set(KEY + "-topic", state.topic); render(); }); });
    root.querySelectorAll("section.sk").forEach(bind);
    if (window.renderMath) window.renderMath(root);
  }
  function bind(sec) {
    var id = sec.getAttribute("data-id"), t = DATA.filter(function (x) { return x.id === id; })[0], ta = sec.querySelector("textarea");
    ta.addEventListener("input", function () { S.draft[id] = ta.value; save(); });
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        var s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 4;
        S.draft[id] = ta.value; save();
      } else if (e.key === "Enter") {
        var pos = ta.selectionStart, line = ta.value.slice(0, pos).split("\n").pop(), ind = line.match(/^ */)[0];
        if (/\{\s*$/.test(line)) ind += "    ";
        e.preventDefault();
        ta.value = ta.value.slice(0, pos) + "\n" + ind + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = pos + 1 + ind.length;
        S.draft[id] = ta.value; save();
      }
    });
    var hb = sec.querySelector("[data-hint]");
    if (hb) hb.addEventListener("click", function () { var x = sec.querySelector(".sk-hint"); x.hidden = !x.hidden; });
    sec.querySelector("[data-reset]").addEventListener("click", function () {
      if (ta.value.trim() && !confirm("Eyða kóðanum þínum í þessu verkefni?")) return;
      ta.value = dedent(t.starter || ""); delete S.draft[id]; save();
    });
    sec.querySelector("[data-sol]").addEventListener("click", function () {
      var box = sec.querySelector(".sk-sol");
      if (!box.hidden) { box.hidden = true; return; }
      box.innerHTML = '<div class="grid2"><div><h4>Þinn kóði</h4><pre class="code"><code class="java">' + esc(ta.value || "(tómt)") + '</code></pre></div><div><h4>Fyrirmyndarlausn</h4><pre class="code"><code class="java">' + esc(dedent(t.solution)) + "</code></pre></div></div>" +
        (t.note ? '<div class="note tip"><p>' + t.note + "</p></div>" : "") +
        '<h4>Matsblað: hakaðu við það sem lausnin þín gerir</h4><ul class="sk-checks">' + (t.checks || []).map(function (c, k) { return '<li><label><input type="checkbox" data-k="' + k + '"> ' + c + "</label></li>"; }).join("") + "</ul>" +
        '<p class="result" aria-live="polite"></p>';
      box.hidden = false;
      if (window.renderMath) window.renderMath(box);
      var boxes = box.querySelectorAll("input[type=checkbox]"), res = box.querySelector(".result");
      function upd() {
        var k = 0; boxes.forEach(function (b) { if (b.checked) k++; });
        var all = k === boxes.length;
        res.className = "result " + (all ? "ok" : ""); res.textContent = all ? "✓ Allt á matsblaðinu er uppfyllt. Verkefnið er merkt leyst." : k + " af " + boxes.length + " atriðum.";
        if (all && !S.done[id]) { S.done[id] = true; save(); sec.classList.add("sk-done"); var b = root.querySelector(".scorebar"); if (b) b.outerHTML = bar(); }
      }
      boxes.forEach(function (b) { b.addEventListener("change", upd); });
    });
  }
  render();
})();

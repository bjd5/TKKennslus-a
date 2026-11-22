/* lab.js – verkefnavélin fyrir gagnvirku skrefin, prófherminn og verkfærin:
 * R-úttak með smellanlegum tölum (App.rcon) og verkefni af fjórum gerðum (App.renderTask):
 * mc (krossar), num (tala), pick (smelltu á töluna í úttakinu) og write (skrifað svar + matsblað). */
(function () {
  "use strict";
  // ---------- Hjálparföll ----------
  function h(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null && attrs[k] !== false) e.setAttribute(k, attrs[k]);
    }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  // Íslensk framsetning talna: punktur eins og í R (prófin nota punkt)
  function fmt(x, d) {
    if (!isFinite(x)) return String(x);
    if (d == null) d = Math.abs(x) >= 100 ? 1 : Math.abs(x) >= 1 ? 3 : 4;
    var s = x.toFixed(d);
    if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
    return s === "-0" ? "0" : s;
  }
  function parseNum(s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/\s/g, "").replace(",", ".").replace(/^−/, "-");
    if (/%$/.test(s)) return parseFloat(s) / 100;
    if (/^-?\d*\.?\d+(e-?\d+)?$/i.test(s)) return parseFloat(s);
    if (/^-?\d+\/\d+$/.test(s)) { var p = s.split("/"); return +p[0] / +p[1]; }
    return NaN;
  }
  function close(v, a, tol) {
    if (!isFinite(v)) return false;
    tol = tol == null ? { rel: 0.012, abs: 0.0006 } : tol;
    if (typeof tol === "number") tol = { abs: tol };
    var d = Math.abs(v - a);
    return d <= (tol.abs || 0) + 1e-12 || (tol.rel != null && d <= Math.abs(a) * tol.rel);
  }
  function toast(msg) {
    var t = h("div", { class: "toast", role: "status" }, esc(msg));
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
  }

  // ---------- R-úttak ----------
  var TOKRE = /(<\s?\d(?:\.\d)?e-\d+|-?\d*\.?\d+(?:e[-+]?\d+)?)/g;
  function rcon(key, opts) {
    opts = opts || {};
    var u = window.UTTAK[key];
    var box = h("div", { class: "rcon", "data-key": key });
    box.appendChild(h("div", { class: "rcon-head" }, "<i></i><i></i><i></i><span>" + esc(opts.title || "R") + "</span>"));
    var code = u.code.split("\n").map(function (l, i) { return '<span class="p">' + "&gt; " + "</span>" + esc(l); }).join("\n");
    box.appendChild(h("pre", { class: "code" }, code));
    var n = 0;
    var out = u.out.split("\n").map(function (line) {
      var safe = esc(line);
      // tölur sem ekki eru hluti af orði (t.d. „2.5 %“ eða „lower .95“ verða líka tölur – það er í lagi)
      return safe.replace(/(&lt;\s?\d(?:\.\d)?e-\d+|(?:^|(?<=[\s(:=,\[]))-?\d*\.?\d+(?:e[-+]?\d+)?(?=$|[\s),%\]]))/g, function (m) {
        n++; return '<span class="tok" data-i="' + n + '">' + m + "</span>";
      });
    }).join("\n");
    box.appendChild(h("pre", { class: "out" }, out));
    return box;
  }
  function tokText(el) { return el.textContent.replace(/\s/g, ""); }

  // ---------- Verkefnavélin ----------
  // task: {type:'mc'|'num'|'pick'|'write', q, ...}; ctx.con = R-úttaksbox fyrir 'pick'
  // onDone(score 0..1, detail)
  function renderTask(host, task, ctx, onDone) {
    ctx = ctx || {};
    host.innerHTML = "";
    var wrap = h("div", { class: "task-body" });
    if (task.q) wrap.appendChild(h("p", { class: "q" }, task.q));
    host.appendChild(wrap);
    var fb = h("div", { class: "fb", hidden: true, "aria-live": "polite" });
    var done = false;
    function finish(score, title, extra) {
      if (done) return; done = true;
      fb.hidden = false;
      fb.className = "fb " + (score >= 0.999 ? "ok" : score > 0 ? "" : "no");
      fb.innerHTML = "<h4>" + title + "</h4>" + (extra || "") + (task.ex ? "<div>" + task.ex + "</div>" : "") + (task.r ? "<pre>" + esc(task.r) + "</pre>" : "");
      if (onDone) onDone(score);
    }

    if (task.type === "mc") {
      var opts = h("div", { class: "opts", role: "group" });
      var order = task.keep ? task.opts.map(function (_, i) { return i; }) : shuffleKeepLast(task.opts);
      order.forEach(function (oi, k) {
        var b = h("button", { class: "opt", type: "button" }, '<span class="l">' + "ABCDEFG"[k] + "</span><span>" + task.opts[oi] + "</span>");
        b.addEventListener("click", function () {
          if (done) return;
          var ok = oi === task.a;
          b.classList.add(ok ? "right" : "wrong");
          opts.querySelectorAll(".opt").forEach(function (x, j) { x.disabled = true; if (order[j] === task.a) x.classList.add("right"); });
          finish(ok ? 1 : 0, ok ? "Rétt" : "Ekki rétt");
        });
        opts.appendChild(b);
      });
      wrap.appendChild(opts);
    }

    if (task.type === "num") {
      var row = h("div", { class: "numin" });
      var inp = h("input", { type: "text", inputmode: "decimal", "aria-label": "Svar", placeholder: task.ph || "t.d. 0.433", autocomplete: "off" });
      var go = h("button", { class: "btn pri", type: "button" }, "Athuga");
      var giveup = h("button", { class: "btn ghost", type: "button" }, "Sýna lausn");
      row.appendChild(inp); if (task.unit) row.appendChild(h("span", { class: "muted" }, task.unit)); row.appendChild(go); row.appendChild(giveup);
      wrap.appendChild(row);
      var tries = 0;
      function check() {
        var v = parseNum(inp.value);
        if (!isFinite(v)) { toast("Sláðu inn tölu, t.d. 0.433"); return; }
        tries++;
        if (close(v, task.a, task.tol)) { inp.disabled = go.disabled = giveup.disabled = true; finish(tries === 1 ? 1 : 0.5, "Rétt" + (tries > 1 ? " í annarri tilraun" : ""), "<p>Svarið er <b>" + fmt(task.a, task.d) + "</b>.</p>"); }
        else if (tries === 1) { toast("Ekki alveg. Reyndu aftur"); inp.select(); }
        else { inp.disabled = go.disabled = giveup.disabled = true; finish(0, "Ekki rétt", "<p>Rétt svar er <b>" + fmt(task.a, task.d) + "</b> (þú svaraðir " + esc(inp.value) + ").</p>"); }
      }
      go.addEventListener("click", check);
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
      giveup.addEventListener("click", function () { inp.disabled = go.disabled = giveup.disabled = true; finish(0, "Lausn", "<p>Svarið er <b>" + fmt(task.a, task.d) + "</b>.</p>"); });
      setTimeout(function () { if (!ctx.noFocus) inp.focus({ preventScroll: true }); }, 30);
    }

    if (task.type === "pick") {
      var con = ctx.con;
      wrap.appendChild(h("p", { class: "hint" }, "Smelltu á réttu töluna í R-úttakinu."));
      if (!con) { wrap.appendChild(h("p", null, "(Úttak vantar)")); return; }
      con.classList.add("picking");
      var targets = [].filter.call(con.querySelectorAll(".tok"), function (t) { return tokText(t) === task.tok.replace(/\s/g, ""); });
      if (task.nth != null) targets = [targets[task.nth]];
      var handler = function (e) {
        var t = e.target.closest(".tok");
        if (!t || done) return;
        var ok = targets.indexOf(t) >= 0;
        t.classList.add(ok ? "hit" : "miss");
        if (!ok) targets.forEach(function (x) { x.classList.add("hit"); });
        con.classList.remove("picking");
        con.removeEventListener("click", handler);
        finish(ok ? 1 : 0, ok ? "Rétt: " + esc(task.tok) : "Ekki rétt. Rétta talan er " + esc(task.tok), "");
        if (targets[0]) targets[0].scrollIntoView({ block: "nearest", inline: "nearest" });
      };
      con.addEventListener("click", handler);
      var skip = h("button", { class: "btn ghost", type: "button" }, "Sýna mér");
      skip.addEventListener("click", function () { if (done) return; targets.forEach(function (x) { x.classList.add("hit"); }); con.classList.remove("picking"); con.removeEventListener("click", handler); finish(0, "Hér er talan: " + esc(task.tok), ""); if (targets[0]) targets[0].scrollIntoView({ block: "nearest" }); });
      wrap.appendChild(skip);
    }

    if (task.type === "write") {
      var ta = h("textarea", { class: "draft", placeholder: "Skrifaðu svarið eins og á prófinu. Það er bara fyrir þig og er ekki vistað.", "aria-label": "Uppkast að svari" });
      var show = h("button", { class: "btn pri", type: "button" }, "Bera saman við fyrirmyndarsvar");
      wrap.appendChild(ta); wrap.appendChild(h("div", { class: "row", style: "margin-top:10px" })).appendChild(show);
      show.addEventListener("click", function () {
        show.disabled = true;
        var m = h("div", { class: "model" }, "<b>Fyrirmyndarsvar</b><div>" + task.model + "</div>");
        wrap.appendChild(m);
        var ul = h("ul", { class: "rubric" });
        task.rubric.forEach(function (r) { var li = h("li"); li.innerHTML = '<label><input type="checkbox"> <span>' + r + "</span></label>"; ul.appendChild(li); });
        wrap.appendChild(h("p", { class: "small muted", style: "margin:12px 0 0" }, "Hakaðu við það sem kom fram í þínu svari:"));
        wrap.appendChild(ul);
        var ok = h("button", { class: "btn", type: "button", style: "margin-top:10px" }, "Skrá sjálfsmat");
        wrap.appendChild(ok);
        ok.addEventListener("click", function () {
          var c = ul.querySelectorAll("input:checked").length, n = task.rubric.length;
          ul.querySelectorAll("input").forEach(function (x) { x.disabled = true; });
          ok.disabled = true;
          finish(c / n, "Sjálfsmat: " + c + " af " + n + " atriðum", "");
        });
      });
    }
    host.appendChild(fb);
    return { get done() { return done; } };
  }
  function shuffleKeepLast(opts) {
    var idx = opts.map(function (_, i) { return i; });
    var last = /Ekkert að ofan/i.test(opts[opts.length - 1]) ? idx.pop() : null;
    idx = shuffle(idx);
    if (last != null) idx.push(last);
    return idx;
  }


  var A = (window.App = window.App || {});
  var api = { h: h, esc: esc, rnd: rnd, pick: pick, shuffle: shuffle, fmt: fmt, parseNum: parseNum, close: close, toast: toast, rcon: rcon, renderTask: renderTask };
  for (var k in api) A[k] = api[k];
})();

/* gagnvirkt.js – vélin á bak við gagnvirka skrefið í hverjum kafla.
 * Kafli skráir sig í js/w/kafli-N.js með
 *   TK.lab(N, { skills: [...], tasks: function () { return [...]; }, need: 0.6, extra: function (root, done) {} })
 * skills: verkefni úr R-úttaksmálunum (js/malin-data.js) með þessum efnisþáttum eru tekin með.
 * tasks:  aukaverkefni kaflans (sama snið og í js/lab.js: mc, num, pick, write; out: [lyklar í UTTAK], km: "fram"|"colon").
 * Skrefinu lýkur (api.done) þegar öll verkefnin hafa verið leyst og meðaleinkunn er a.m.k. need. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  function register(id, fn) { if (typeof TK.widget === "function") TK.widget(id, fn); else (TK._widgetQueue = TK._widgetQueue || []).push([id, fn]); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  TK.lab = function (n, cfg) {
    register("kafli-" + n, function (sec, api) {
      var A = window.App, h = A.h;
      var root = sec.querySelector(".lab-root") || sec.insertBefore(h("div", { class: "lab-root" }), sec.querySelector(".w-status"));
      var KEY = "lyd105f-lab-k" + n;
      var tasks = [];
      if (cfg.skills && window.Malin) window.Malin.CASES.forEach(function (c) {
        c.steps.forEach(function (st) { if (cfg.skills.indexOf(st.skill) >= 0) tasks.push(st); });
      });
      if (cfg.tasks) tasks = (cfg.order === "after" ? tasks.concat(cfg.tasks()) : cfg.tasks().concat(tasks));
      if (cfg.max && tasks.length > cfg.max) tasks = tasks.slice(0, cfg.max);
      var need = cfg.need == null ? 0.6 : cfg.need;
      var res = store(KEY) || {};
      if (res.n !== tasks.length) res = { n: tasks.length, s: {} };
      var cur = 0;
      for (var i = 0; i < tasks.length; i++) if (res.s[i] == null) { cur = i; break; }

      if (cfg.extra) { var ex = h("div", { class: "lab-extra" }); root.appendChild(ex); cfg.extra(ex); }
      var pills = h("div", { class: "lab-steps", role: "group", "aria-label": "Verkefni" });
      var outs = h("div", { class: "lab-outs" });
      var card = h("div", { class: "qcard" });
      var nav = h("div", { class: "lab-nav" });
      root.appendChild(pills); root.appendChild(outs); root.appendChild(card); root.appendChild(nav);

      function avg() { var t = 0, c = 0; for (var k in res.s) { t += res.s[k]; c++; } return c ? t / c : 0; }
      function answered() { return Object.keys(res.s).length; }
      function check() {
        if (answered() < tasks.length) { api.status(answered() + " af " + tasks.length + " verkefnum leyst."); return; }
        if (avg() >= need) api.done("Öll " + tasks.length + " verkefnin leyst, meðaleinkunn " + Math.round(avg() * 100) + "%.");
        else api.status("Meðaleinkunn " + Math.round(avg() * 100) + "%. Þú þarft " + Math.round(need * 100) + "%: byrjaðu upp á nýtt og reyndu aftur.");
      }
      function drawPills() {
        pills.innerHTML = "";
        tasks.forEach(function (_, j) {
          var b = h("button", { type: "button", "aria-label": "Verkefni " + (j + 1) }, String(j + 1));
          if (j === cur) b.setAttribute("aria-current", "step");
          if (res.s[j] != null) b.className = res.s[j] >= 0.999 ? "ok" : "no";
          b.addEventListener("click", function () { cur = j; show(); });
          pills.appendChild(b);
        });
      }
      function show() {
        drawPills();
        var st = tasks[cur];
        outs.innerHTML = ""; card.innerHTML = ""; nav.innerHTML = "";
        if (st.km && window.Malin) { var kp = window.Malin.kmPlot(st.km); if (kp) outs.appendChild(kp); }
        (st.out || []).forEach(function (k) { if (window.UTTAK[k]) outs.appendChild(A.rcon(k, { title: "R-úttak" })); });
        var con = null;
        if (st.type === "pick") con = [].filter.call(outs.querySelectorAll(".rcon"), function (b) {
          return [].some.call(b.querySelectorAll(".tok"), function (t) { return t.textContent.replace(/\s/g, "") === st.tok.replace(/\s/g, ""); });
        })[0] || outs.querySelector(".rcon");
        card.appendChild(h("div", { class: "lab-meta" }, "Verkefni " + (cur + 1) + " af " + tasks.length + (st.title ? " · " + A.esc(st.title) : "")));
        var host = h("div"); card.appendChild(host);
        if (res.s[cur] != null) {
          host.appendChild(h("p", { class: "hint" }, "Þú hefur leyst þetta verkefni (" + Math.round(res.s[cur] * 100) + "%). Þú mátt svara aftur, en fyrsta svarið gildir."));
        }
        var inner = h("div"); host.appendChild(inner);
        A.renderTask(inner, st, { con: con, noFocus: true }, function (score) {
          if (res.s[cur] == null) { res.s[cur] = score; store(KEY, res); }
          drawPills(); check();
          if (window.renderMath) window.renderMath(card);
        });
        if (window.renderMath) { window.renderMath(card); window.renderMath(outs); }
        var prev = h("button", { class: "btn ghost", type: "button" }, "← Fyrra");
        var next = h("button", { class: "btn", type: "button" }, "Næsta →");
        prev.disabled = cur === 0; next.disabled = cur === tasks.length - 1;
        prev.addEventListener("click", function () { cur--; show(); });
        next.addEventListener("click", function () { cur++; show(); outs.scrollIntoView({ block: "nearest" }); });
        var reset = h("button", { class: "btn ghost", type: "button" }, "Byrja upp á nýtt");
        reset.addEventListener("click", function () { res = { n: tasks.length, s: {} }; store(KEY, res); cur = 0; show(); check(); });
        nav.appendChild(prev); nav.appendChild(next); nav.appendChild(reset);
      }
      if (!tasks.length) { root.appendChild(h("p", null, "Engin verkefni fundust.")); return; }
      show(); check();
    });
  };

  // Hjálp: n talnadæmi úr dæmavélunum (js/q/lyd.js) fyrir gefna efnisþætti
  TK.labGen = function (skills, k) {
    var I = window.Items, out = [];
    if (!I) return out;
    var gens = I.GEN.filter(function (g) { return skills.indexOf(g.skill) >= 0; });
    var order = window.App.shuffle(gens);
    for (var i = 0; i < k && gens.length; i++) {
      var t = I.make(order[i % order.length]);
      if (t.type !== "num") { t = I.make(order[(i + 1) % order.length]); }
      t.title = "Reiknaðu";
      out.push(t);
    }
    return out;
  };
})();

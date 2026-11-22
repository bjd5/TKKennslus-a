/* verkstaedi.js – kóðaverkstæðið (skref 3 í hverjum kafla).
 *
 * Hver kafli skráir verkefnin sín í js/w/kafli-N.js með
 *   TK.workshop("kafli-N", [ verkefni, ... ]);
 * Verkefnin eru af fimm gerðum (title og prompt alls staðar):
 *   { type: "parsons", lines: ["lína 1", "  lína 2", ...], extra: ["truflandi lína", ...], alts: [[1,0,2,...]] }
 *        Raða línum í rétt forrit. Inndráttur er hluti af línunni. alts: aðrar réttar raðir (vísar í lines).
 *   { type: "gaps", code: "for (int i = [[0]]; i [[<|<=]] n; i++)" , hint }
 *        Fylla í eyður. [[a|b]] = eyða þar sem a eða b er rétt (bil skipta ekki máli).
 *   { type: "bug", code: "...", bug: 3 (eða [3, 4]), explain: "..." }
 *        Smella á línuna sem er röng (0 = fyrsta lína).
 *   { type: "trace", code: "...", cols: ["i", "sum"], rows: [["0", "0"], ...], gen: function () { return {code, rows} } }
 *        Fylla út rakningartöflu: eitt gildi í hvern reit. gen (valfrjálst) býr til nýtt dæmi.
 *   { type: "match", pairs: [["vinstri", "hægri"], ...] }
 *        Para saman: velja rétt hægra megin fyrir hvert atriði vinstra megin (sama svar má koma oftar en einu sinni).
 * Öll verkefnin þarf að leysa til að ljúka skrefinu (api.done). Staðan er geymd í localStorage. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  function register(id, fn) { if (typeof TK.widget === "function") TK.widget(id, fn); else (TK._widgetQueue = TK._widgetQueue || []).push([id, fn]); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function dedent(s) {
    var lines = String(s).replace(/^\n/, "").replace(/\s+$/, "").split("\n");
    var m = Math.min.apply(null, lines.filter(function (l) { return l.trim(); }).map(function (l) { return l.match(/^ */)[0].length; }));
    return lines.map(function (l) { return l.slice(m); }).join("\n");
  }
  var hl = function (s) { return window.highlightJava ? window.highlightJava(s) : esc(s); };
  var norm = function (s) { return String(s).replace(/\s+/g, "").replace(/;$/, ""); };
  var TYPE_LABEL = { parsons: "Raðaðu línunum", gaps: "Fylltu í eyðurnar", bug: "Finndu villuna", trace: "Raktu forritið", match: "Paraðu saman" };

  var CSS = [
    ".ws-tabs{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 1rem}",
    ".ws-tabs .chip.done::after{content:' ✓';color:var(--good)}",
    ".ws-type{font:700 .72rem/1 var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--mag);margin:0 0 .3rem}",
    ".ws-cols{display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin:.6rem 0}",
    "@media (max-width:760px){.ws-cols{grid-template-columns:1fr}}",
    ".ws-box{border:1px solid var(--rule-2);border-radius:8px;background:var(--paper-2);padding:.4rem;min-height:6rem;display:flex;flex-direction:column;gap:.25rem}",
    ".ws-box h4{margin:.1rem .2rem .3rem;font:700 .78rem/1.2 var(--sans);color:var(--muted)}",
    ".ws-line{display:flex;align-items:center;gap:.3rem;font:500 .84rem/1.35 var(--mono);white-space:pre;text-align:left;padding:.3rem .45rem;border:1px solid var(--rule-2);border-radius:6px;background:var(--code-bg);color:var(--code-ink);cursor:pointer;overflow-x:auto}",
    ".ws-line:hover{border-color:var(--mag)}",
    ".ws-line .t{flex:1}",
    ".ws-line .mv{font:600 .8rem var(--sans);border:0;background:none;color:var(--muted);cursor:pointer;padding:0 .2rem}",
    ".ws-line.ok{border-color:var(--good)}.ws-line.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 10%,var(--code-bg))}",
    ".ws-code{font:500 .86rem/1.55 var(--mono);background:var(--code-bg);color:var(--code-ink);border:1px solid var(--rule);border-radius:8px;padding:.6rem .4rem;overflow-x:auto;margin:.6rem 0}",
    ".ws-code .ln{display:flex;white-space:pre;border-radius:4px;padding:0 .4rem}",
    ".ws-code .ln i{font-style:normal;color:var(--tk-c);width:2.2em;flex:none;text-align:right;margin-right:.8em;user-select:none}",
    ".ws-code.click .ln{cursor:pointer}.ws-code.click .ln:hover{background:color-mix(in srgb,var(--mag) 12%,transparent)}",
    ".ws-code .ln.bad{background:color-mix(in srgb,var(--bad) 18%,transparent)}.ws-code .ln.ok{background:color-mix(in srgb,var(--good) 22%,transparent)}",
    ".ws-gap{font:600 .86rem var(--mono);width:auto;min-width:2.5em;padding:.05rem .3rem;border:1px solid var(--mag);border-radius:4px;background:var(--raised);color:var(--ink)}",
    ".ws-gap.ok{border-color:var(--good);background:color-mix(in srgb,var(--good) 12%,var(--raised))}.ws-gap.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 10%,var(--raised))}",
    ".ws-trace{border-collapse:collapse;width:auto;font:.88rem var(--mono)}",
    ".ws-trace th,.ws-trace td{border:1px solid var(--rule-2);padding:.25rem .35rem;text-align:center}",
    ".ws-trace input{width:5.5em;font:.88rem var(--mono);padding:.15rem .3rem;text-align:center}",
    ".ws-trace input.ok{border-color:var(--good)}.ws-trace input.bad{border-color:var(--bad)}",
    ".ws-match{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:.45rem .8rem;align-items:center;margin:.6rem 0}",
    "@media (max-width:640px){.ws-match{grid-template-columns:1fr}}",
    ".ws-match .l{font:500 .92rem/1.35 var(--sans)}.ws-match select{width:100%;font:.9rem var(--sans)}",
    ".ws-match select.ok{border-color:var(--good)}.ws-match select.bad{border-color:var(--bad)}",
    ".ws-btns{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.6rem}",
    ".ws-expl{margin-top:.6rem}",
  ].join("");

  TK.workshop = function (id, tasks) {
    register(id, function (root, api) {
      var app = root.querySelector(".ws-app");
      if (!app) return;
      if (!document.getElementById("ws-css")) { var st = document.createElement("style"); st.id = "ws-css"; st.textContent = CSS; document.head.appendChild(st); }
      var KEY = "tol101g-ws-" + id;
      var solved = (window.store && window.store.get(KEY, null)) || [];
      if (solved.length !== tasks.length) solved = tasks.map(function () { return false; });
      var cur = solved.indexOf(false); if (cur < 0) cur = 0;
      app.innerHTML = '<div class="ws-tabs" role="tablist"></div><div class="ws-body"></div><p class="result" aria-live="polite"></p>';
      var tabs = app.querySelector(".ws-tabs"), body = app.querySelector(".ws-body"), res = app.querySelector(".result");

      function nDone() { return solved.filter(Boolean).length; }
      function drawTabs() {
        tabs.innerHTML = tasks.map(function (t, i) { return '<button type="button" class="chip' + (solved[i] ? " done" : "") + '" aria-pressed="' + (i === cur) + '" data-i="' + i + '">' + (i + 1) + ". " + esc(t.title) + "</button>"; }).join("");
      }
      tabs.addEventListener("click", function (e) { var b = e.target.closest("button[data-i]"); if (b) { cur = +b.getAttribute("data-i"); show(); } });
      function setRes(ok, html) { res.className = "result " + (ok ? "ok" : "no"); res.innerHTML = html; }
      function win(msg) {
        if (!solved[cur]) { solved[cur] = true; if (window.store) window.store.set(KEY, solved); }
        drawTabs();
        var left = tasks.length - nDone();
        setRes(true, "✓ " + (msg || "Rétt!") + (left ? " " + left + " verkefni eftir." + ' <button type="button" class="btn ghost" data-nexttask>Næsta verkefni →</button>' : ""));
        var nb = res.querySelector("[data-nexttask]");
        if (nb) nb.addEventListener("click", function () { var k = solved.indexOf(false); cur = k < 0 ? cur : k; show(); });
        if (!left) api.done("Öllum " + tasks.length + " verkefnunum er lokið.");
        else api.status(nDone() + " af " + tasks.length + " verkefnum leyst.");
      }

      function show() {
        drawTabs();
        res.className = "result"; res.innerHTML = "";
        var t = tasks[cur];
        body.innerHTML = '<p class="ws-type">' + TYPE_LABEL[t.type] + "</p><h3 style=\"margin-top:0\">" + esc(t.title) + "</h3>" + (t.prompt ? "<div>" + t.prompt + "</div>" : "") + '<div class="ws-task"></div>';
        if (window.renderMath) window.renderMath(body);
        var box = body.querySelector(".ws-task");
        ({ parsons: parsons, gaps: gaps, bug: bug, trace: trace, match: match })[t.type](t, box);
      }

      /* ---------- Raða línum ---------- */
      function parsons(t, box) {
        var all = t.lines.map(function (l, i) { return { t: l, k: i }; }).concat((t.extra || []).map(function (l, i) { return { t: l, k: -1 - i }; }));
        var pool = shuffle(all), sol = [];
        box.innerHTML = '<div class="ws-cols"><div class="ws-box" data-z="pool"><h4>Línur (smelltu til að færa yfir)</h4></div><div class="ws-box" data-z="sol"><h4>Forritið þitt</h4></div></div>' +
          '<div class="ws-btns"><button type="button" class="btn" data-check>Athuga</button><button type="button" class="btn ghost" data-reset>Byrja aftur</button></div>' +
          (t.extra && t.extra.length ? '<p class="qhint">Ath.: ' + t.extra.length + (t.extra.length === 1 ? " lína á ekki heima" : " línur eiga ekki heima") + " í forritinu.</p>" : "");
        var zp = box.querySelector('[data-z="pool"]'), zs = box.querySelector('[data-z="sol"]');
        function line(it, inSol, idx) {
          return '<div class="ws-line" data-k="' + it.k + '">' + (inSol ? '<button type="button" class="mv" data-up="' + idx + '" aria-label="Upp">▲</button><button type="button" class="mv" data-dn="' + idx + '" aria-label="Niður">▼</button>' : "") + '<span class="t">' + hl(it.t) + "</span></div>";
        }
        function draw() {
          zp.innerHTML = "<h4>Línur (smelltu til að færa yfir)</h4>" + pool.map(function (it) { return line(it, false); }).join("");
          zs.innerHTML = "<h4>Forritið þitt</h4>" + sol.map(function (it, i) { return line(it, true, i); }).join("");
        }
        zp.addEventListener("click", function (e) {
          var l = e.target.closest(".ws-line"); if (!l) return;
          var k = +l.getAttribute("data-k"), i = pool.findIndex(function (x) { return x.k === k; });
          sol.push(pool.splice(i, 1)[0]); draw();
        });
        zs.addEventListener("click", function (e) {
          var up = e.target.closest("[data-up]"), dn = e.target.closest("[data-dn]");
          if (up || dn) {
            var i = +(up || dn).getAttribute(up ? "data-up" : "data-dn"), j = up ? i - 1 : i + 1;
            if (j >= 0 && j < sol.length) { var tmp = sol[i]; sol[i] = sol[j]; sol[j] = tmp; draw(); }
            return;
          }
          var l = e.target.closest(".ws-line"); if (!l) return;
          var k = +l.getAttribute("data-k"), x = sol.findIndex(function (s) { return s.k === k; });
          pool.push(sol.splice(x, 1)[0]); draw();
        });
        box.querySelector("[data-reset]").addEventListener("click", function () { pool = shuffle(all); sol = []; draw(); res.innerHTML = ""; });
        box.querySelector("[data-check]").addEventListener("click", function () {
          var orders = [t.lines.map(function (_, i) { return i; })].concat(t.alts || []);
          var got = sol.map(function (s) { return s.k; });
          var ok = orders.some(function (o) { return o.length === got.length && o.every(function (v, i) { return v === got[i] || norm(t.lines[v]) === norm(sol[i].t); }); });
          var els = zs.querySelectorAll(".ws-line");
          if (ok) { els.forEach(function (e) { e.classList.add("ok"); }); win("Forritið er rétt."); return; }
          // merkja línur sem eru á réttum stað miðað við fyrstu röðina
          var o = orders[0], firstBad = -1;
          els.forEach(function (e, i) { var good = sol[i].k === o[i] || (o[i] !== undefined && norm(t.lines[o[i]]) === norm(sol[i].t)); e.classList.toggle("ok", good); e.classList.toggle("bad", !good); if (!good && firstBad < 0) firstBad = i; });
          var extraIn = sol.some(function (s) { return s.k < 0; });
          setRes(false, extraIn ? "Ekki rétt. Það er lína í forritinu sem á ekki heima þar." : sol.length < t.lines.length ? "Ekki rétt enn. Það vantar " + (t.lines.length - sol.length) + " línur." : "Ekki rétt. Lína " + (firstBad + 1) + " er ekki á réttum stað.");
        });
        draw();
      }

      /* ---------- Fylla í eyður ---------- */
      function gaps(t, box) {
        var src = dedent(t.code), answers = [], k = 0;
        var html = src.split(/(\[\[.*?\]\])/).map(function (part) {
          var m = part.match(/^\[\[(.*?)\]\]$/);
          if (!m) return hl(part);
          var opts = m[1].split("|"); answers.push(opts);
          var w = Math.max(2, Math.max.apply(null, opts.map(function (o) { return o.length; })) + 1);
          return '<input class="ws-gap" data-g="' + k++ + '" size="' + w + '" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Eyða ' + k + '">';
        }).join("");
        box.innerHTML = '<pre class="code"><code data-hl>' + html + "</code></pre>" +
          '<div class="ws-btns"><button type="button" class="btn" data-check>Athuga</button><button type="button" class="btn ghost" data-show>Sýna svörin</button></div>' + (t.hint ? '<p class="qhint">' + t.hint + "</p>" : "");
        var inputs = box.querySelectorAll(".ws-gap");
        function check(reveal) {
          var bad = 0;
          inputs.forEach(function (inp, i) {
            if (reveal) inp.value = answers[i][0];
            var ok = answers[i].some(function (a) { return norm(a) === norm(inp.value); });
            inp.classList.toggle("ok", ok); inp.classList.toggle("bad", !ok); if (!ok) bad++;
          });
          return bad;
        }
        box.querySelector("[data-check]").addEventListener("click", function () {
          var bad = check(false);
          if (!bad) win("Allar eyðurnar eru réttar.");
          else setRes(false, bad === 1 ? "1 eyða er ekki rétt enn (rauð)." : bad + " eyður eru ekki réttar enn (rauðar).");
        });
        box.querySelector("[data-show]").addEventListener("click", function () {
          check(true);
          setRes(false, "Svörin eru komin í eyðurnar. Lestu þau yfir; verkefnið telst ekki leyst fyrr en þú gerir það sjálf(ur). Smelltu á flipann til að reyna aftur.");
        });
      }

      /* ---------- Finna villu ---------- */
      function codeLines(src, click) {
        return '<div class="ws-code' + (click ? " click" : "") + '">' + dedent(src).split("\n").map(function (l, i) { return '<div class="ln" data-l="' + i + '"><i>' + (i + 1) + "</i><span>" + (hl(l) || " ") + "</span></div>"; }).join("") + "</div>";
      }
      function bug(t, box) {
        var bugs = [].concat(t.bug), tries = 0;
        box.innerHTML = codeLines(t.code, true) + '<div class="ws-expl"></div>';
        var code = box.querySelector(".ws-code"), ex = box.querySelector(".ws-expl");
        code.addEventListener("click", function (e) {
          var l = e.target.closest(".ln"); if (!l || code.classList.contains("solved")) return;
          var i = +l.getAttribute("data-l");
          if (bugs.indexOf(i) !== -1) {
            code.classList.add("solved"); code.classList.remove("click");
            bugs.forEach(function (b) { var x = code.querySelector('[data-l="' + b + '"]'); if (x) x.classList.add("ok"); });
            ex.innerHTML = '<div class="note tip"><p><b class="t">Villan:</b> ' + t.explain + "</p></div>";
            if (window.renderMath) window.renderMath(ex);
            win("Þú fannst villuna.");
          } else {
            tries++; l.classList.add("bad");
            setRes(false, "Þessi lína er í lagi. " + (tries >= 3 && t.hint ? t.hint : "Reyndu aftur."));
          }
        });
      }

      /* ---------- Rakning ---------- */
      function trace(t, box) {
        var d = t.gen ? t.gen() : t;
        var h = codeLines(d.code, false) + '<div class="tablewrap"><table class="ws-trace"><thead><tr><th>#</th>' + (d.cols || t.cols).map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>";
        d.rows.forEach(function (r, i) {
          h += "<tr><td>" + (i + 1) + "</td>" + r.map(function (_, j) { return '<td><input type="text" data-r="' + i + '" data-c="' + j + '" spellcheck="false" autocomplete="off" aria-label="Lína ' + (i + 1) + ", " + esc((d.cols || t.cols)[j]) + '"></td>'; }).join("") + "</tr>";
        });
        h += '</tbody></table></div><div class="ws-btns"><button type="button" class="btn" data-check>Athuga</button>' + (t.gen ? '<button type="button" class="btn ghost" data-new>Nýtt dæmi</button>' : "") + '<button type="button" class="btn ghost" data-show>Sýna töfluna</button></div>' +
          '<p class="qhint">' + (t.hint || "Ein lína í töflunni fyrir hverja umferð (eða hvert skref sem lýst er). Skrifaðu gildi breytanna eins og Java myndi prenta þau.") + "</p>";
        box.innerHTML = h;
        var inputs = box.querySelectorAll("input");
        box.querySelector("[data-check]").addEventListener("click", function () {
          var bad = 0;
          inputs.forEach(function (inp) {
            var want = String(d.rows[+inp.getAttribute("data-r")][+inp.getAttribute("data-c")]);
            var ok = norm(inp.value).replace(/^"|"$/g, "") === norm(want).replace(/^"|"$/g, "");
            inp.classList.toggle("ok", ok); inp.classList.toggle("bad", !ok); if (!ok) bad++;
          });
          if (!bad) win("Rakningin er rétt."); else setRes(false, bad === 1 ? "1 reitur er ekki réttur enn (rauður)." : bad + " reitir eru ekki réttir enn (rauðir).");
        });
        box.querySelector("[data-show]").addEventListener("click", function () {
          inputs.forEach(function (inp) { inp.value = d.rows[+inp.getAttribute("data-r")][+inp.getAttribute("data-c")]; inp.classList.remove("bad"); });
          setRes(false, "Taflan er útfyllt. Farðu yfir hana línu fyrir línu" + (t.gen ? " og reyndu svo nýtt dæmi sjálf(ur)." : "; verkefnið telst ekki leyst fyrr en þú fyllir hana út sjálf(ur)."));
        });
        var nb = box.querySelector("[data-new]"); if (nb) nb.addEventListener("click", function () { trace(t, box); res.innerHTML = ""; });
      }

      /* ---------- Para saman ---------- */
      function match(t, box) {
        var rights = shuffle(t.pairs.map(function (p) { return p[1]; }).filter(function (r, i, a) { return a.indexOf(r) === i; }));
        var h = '<div class="ws-match">';
        t.pairs.forEach(function (p, i) {
          h += '<div class="l">' + p[0] + '</div><select data-i="' + i + '" aria-label="Svar ' + (i + 1) + '"><option value="">Veldu…</option>' + rights.map(function (r) { return '<option value="' + esc(r) + '">' + esc(r) + "</option>"; }).join("") + "</select>";
        });
        box.innerHTML = h + '</div><div class="ws-btns"><button type="button" class="btn" data-check>Athuga</button></div>';
        if (window.renderMath) window.renderMath(box);
        box.querySelector("[data-check]").addEventListener("click", function () {
          var bad = 0;
          box.querySelectorAll("select").forEach(function (s) {
            var ok = s.value === t.pairs[+s.getAttribute("data-i")][1];
            s.classList.toggle("ok", ok); s.classList.toggle("bad", !ok); if (!ok) bad++;
          });
          if (!bad) win("Allt rétt parað."); else setRes(false, bad === 1 ? "1 pörun er ekki rétt enn." : bad + " paranir eru ekki réttar enn.");
        });
      }

      show();
      if (nDone() === tasks.length) api.done("Öllum verkefnunum er lokið. Þú mátt leysa þau aftur.");
      else api.status(nDone() + " af " + tasks.length + " verkefnum leyst.");
    });
  };
})();

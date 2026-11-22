/* calc.js – reiknivélar fyrir megindlega ferlagreiningu: flæðisgreining (röð, XOR, AND, endursending),
 * CTE, lögmál Little, framleiðslugeta og nýting, M/M/1 og M/M/c (Erlang C, formúla 7.13). */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  if (!$("flow")) return;

  /* ---------- Hjálparföll ---------- */
  function toNum(s) {
    s = String(s).replace(/\s+/g, "").replace(/−/g, "-").replace(",", ".");
    if (s === "") return NaN;
    return Number(s);
  }
  // „2+0,5+1“ -> 3,5
  function sumExpr(s) {
    var parts = String(s).split("+"), t = 0;
    for (var i = 0; i < parts.length; i++) { var v = toNum(parts[i]); if (!isFinite(v)) return NaN; t += v; }
    return parts.length ? t : NaN;
  }
  function num(id) { return toNum($(id).value); }
  function f(x, sig) {
    if (x === Infinity) return "∞";
    if (typeof x !== "number" || !isFinite(x)) return "–";
    var v = Number(x.toPrecision(sig || 4));
    var s = (Math.abs(v) >= 1e7 || (Math.abs(v) < 1e-4 && v !== 0)) ? v.toExponential((sig || 4) - 1) : String(v);
    return s.replace(".", ",").replace("-", "−");
  }
  function t(x, sig) { return f(x, sig).replace(",", "{,}").replace("−", "-"); } // inni í KaTeX
  function rows(el, list) {
    el.innerHTML = list.map(function (r) { return "<dt>" + r[0] + "</dt><dd" + (r[2] ? ' class="hl"' : "") + ">" + r[1] + "</dd>"; }).join("");
    if (window.renderMath) window.renderMath(el);
  }
  function bad(el, text) { rows(el, [[text, "–"]]); }
  function watch(ids, fn) { ids.forEach(function (id) { $(id).addEventListener("input", fn); $(id).addEventListener("change", fn); }); fn(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- Flæðisgreining ---------- */
  var LABEL = { seq: "Aðgerð", xor: "XOR", and: "AND", loop: "Endursending" };
  var HINT = { seq: "t.d. 3 eða 2+1", xor: "t.d. 0,6:1; 0,4:2", and: "t.d. 1; 3", loop: "t.d. 1" };
  var box = $("fl-rows"), seqNo = 0;

  function addRow(type, val, r) {
    var id = "fl" + (seqNo++), d = document.createElement("div");
    d.className = "row fl-row"; d.setAttribute("data-type", type);
    d.style.cssText = "margin:0.4rem 0;padding:0.5rem 0.6rem;border:1px solid var(--rule);border-radius:8px;background:var(--paper-2)";
    d.innerHTML = '<div style="flex:1 1 14rem"><label class="f" for="' + id + '">' + LABEL[type] + (type === "loop" ? ": tími $T$" : type === "seq" ? ": tími $T$" : type === "xor" ? ": líkur:tími; …" : ": tímar greina; …") + "</label>" +
      '<input id="' + id + '" type="text" data-k="v" placeholder="' + HINT[type] + '" value="' + esc(val || "") + '"></div>' +
      (type === "loop" ? '<div style="flex:0 1 7rem"><label class="f" for="' + id + 'r">$r$</label><input id="' + id + 'r" type="text" inputmode="decimal" data-k="r" value="' + esc(r || "0,2") + '"></div>' : "") +
      '<div class="fixed"><button type="button" class="btn ghost" aria-label="Fjarlægja blokk">×</button></div>';
    d.querySelector("button").addEventListener("click", function () { d.remove(); flowCalc(); });
    d.querySelectorAll("input").forEach(function (i) { i.addEventListener("input", flowCalc); });
    box.appendChild(d);
    if (window.renderMath) window.renderMath(d);
  }
  function preset(name) {
    box.innerHTML = "";
    if (name === "slide") {
      $("fl-unit").value = "dagar"; $("fl-mode").value = "time";
      addRow("loop", "1", "0,2"); addRow("and", "1; 3"); addRow("seq", "3"); addRow("xor", "0,6:1; 0,4:2");
    }
    flowCalc();
  }
  function flowCalc() {
    var out = $("fl-out"), texEl = $("fl-tex"), sumMode = $("fl-mode").value === "sum", unit = $("fl-unit").value.trim();
    var list = [], tex = [], vals = [], total = 0, err = null;
    box.querySelectorAll(".fl-row").forEach(function (row, i) {
      if (err) return;
      var type = row.getAttribute("data-type"), raw = row.querySelector('[data-k="v"]').value, v, s;
      if (type === "seq") {
        v = sumExpr(raw); s = t(v);
        if (!isFinite(v)) err = "Blokk " + (i + 1) + ": skrifaðu tíma, t.d. 3 eða 2+1";
      } else if (type === "loop") {
        var T = sumExpr(raw), r = toNum(row.querySelector('[data-k="r"]').value);
        if (r > 1) r = r / 100;
        if (!isFinite(T) || !(r >= 0 && r < 1)) err = "Blokk " + (i + 1) + ": þarf $T$ og $0 \\le r \\lt 1$";
        else { v = T / (1 - r); s = "\\dfrac{" + t(T) + "}{1-" + t(r) + "}"; }
      } else if (type === "and") {
        var br = raw.split(";").map(function (x) { return sumExpr(x); });
        if (!br.length || br.some(function (x) { return !isFinite(x); })) err = "Blokk " + (i + 1) + ": skrifaðu tíma greina aðskilda með ;";
        else if (sumMode) { v = br.reduce(function (a, b) { return a + b; }, 0); s = "(" + br.map(function (x) { return t(x); }).join(" + ") + ")"; }
        else { v = Math.max.apply(null, br); s = "\\max(" + br.map(function (x) { return t(x); }).join(";\\,") + ")"; }
      } else {
        var items = raw.split(";").filter(function (x) { return x.trim() !== ""; }).map(function (x) {
          var p = x.split(":"); return p.length === 2 ? [toNum(p[0]), sumExpr(p[1])] : [NaN, NaN];
        });
        if (!items.length || items.some(function (x) { return !isFinite(x[0]) || !isFinite(x[1]); })) err = "Blokk " + (i + 1) + ": skrifaðu greinar sem líkur:tími; líkur:tími";
        else {
          var ps = items.reduce(function (a, x) { return a + x[0]; }, 0);
          if (Math.abs(ps - 100) < 0.5) items.forEach(function (x) { x[0] /= 100; }), ps = 1;
          if (Math.abs(ps - 1) > 1e-6) err = "Blokk " + (i + 1) + ": líkurnar summast í " + f(ps) + ", ekki 1";
          else { v = items.reduce(function (a, x) { return a + x[0] * x[1]; }, 0); s = "(" + items.map(function (x) { return t(x[0]) + "\\cdot " + t(x[1]); }).join(" + ") + ")"; }
        }
      }
      if (!err) { total += v; vals.push(v); tex.push(s); list.push(["Blokk " + (i + 1) + ": " + LABEL[type], f(v) + (unit ? " " + esc(unit) : "")]); }
    });
    if (err) { bad(out, err); texEl.innerHTML = ""; return; }
    if (!list.length) { bad(out, "Bættu við blokkum"); texEl.innerHTML = ""; return; }
    list.push([sumMode ? "Samtals (kostnaður / einingaálag)" : "Hringrásartími $CT$", f(total) + (unit ? " " + esc(unit) : ""), true]);
    rows(out, list);
    texEl.innerHTML = "$$" + (sumMode ? "" : "CT = ") + tex.join(" + ") + " = " + vals.map(function (x) { return t(x); }).join(" + ") + " = " + t(total) + "$$";
    if (window.renderMath) window.renderMath(texEl);
  }
  document.querySelectorAll("[data-add]").forEach(function (b) { b.addEventListener("click", function () { addRow(b.getAttribute("data-add")); flowCalc(); }); });
  document.querySelectorAll("[data-preset]").forEach(function (b) { b.addEventListener("click", function () { preset(b.getAttribute("data-preset")); }); });
  $("fl-mode").addEventListener("change", flowCalc);
  $("fl-unit").addEventListener("input", flowCalc);
  preset("slide");

  /* ---------- CTE ---------- */
  watch(["c-tct", "c-ct"], function () {
    var a = num("c-tct"), b = num("c-ct"), out = $("c-out");
    if (!(a > 0 && b > 0)) return bad(out, "Settu inn $TCT$ og $CT$");
    rows(out, [
      ["$CTE = TCT/CT$", f(100 * a / b, 3) + " %", true],
      ["Hlutfall tímans í bið", f(100 * (1 - a / b), 3) + " %"],
      ["Biðtími á mál, $CT - TCT$", f(b - a)],
    ].concat(a > b ? [["Athugaðu", "TCT getur ekki verið stærra en CT"]] : []));
  });

  /* ---------- Little ---------- */
  watch(["l-wip", "l-lam", "l-ct"], function () {
    var w = num("l-wip"), l = num("l-lam"), c = num("l-ct"), out = $("l-out");
    var have = [isFinite(w), isFinite(l), isFinite(c)].filter(Boolean).length;
    if (have < 2) return bad(out, "Fylltu út tvær af þremur stærðum");
    if (have === 3) return rows(out, [["Allar þrjár gefnar: $\\lambda\\cdot CT$", f(l * c)], ["Samanborið við $WIP$", f(w)], [Math.abs(l * c - w) <= 0.01 * Math.abs(w) ? "Stenst lögmál Little" : "Stenst ekki: tæmdu einn reitinn", ""]]);
    if (!isFinite(w)) return rows(out, [["$WIP = \\lambda \\cdot CT = " + t(l) + "\\cdot " + t(c) + "$", f(l * c), true]]);
    if (!isFinite(l)) return rows(out, [["$\\lambda = WIP / CT = " + t(w) + "/" + t(c) + "$", f(w / c), true]]);
    rows(out, [["$CT = WIP / \\lambda = " + t(w) + "/" + t(l) + "$", f(w / l), true], ["Ef tímaeiningin er klst: $CT$ í mínútum", f(60 * w / l)]]);
  });

  /* ---------- Framleiðslugeta ---------- */
  watch(["g-ul", "g-n", "g-h", "g-lam"], function () {
    var ul = num("g-ul"), n = num("g-n"), h = num("g-h"), lam = num("g-lam"), out = $("g-out");
    if (!(ul > 0 && n > 0 && h > 0)) return bad(out, "Settu inn $ul$, fjölda og vinnustundir");
    var uc = n * h, mu = uc / ul, list = [["Einingaafköst $uc = " + t(n) + "\\cdot " + t(h) + "$", f(uc) + " klst"], ["Fræðileg framleiðslugeta $\\mu_p = uc/ul$", f(mu) + " mál á tímabili", true]];
    if (lam > 0) {
      var rho = lam / mu;
      list.push(["Nýting $\\rho_p = \\lambda/\\mu_p$", f(100 * rho, 3) + " %", true]);
      list.push(["Staða", rho < 1 ? "Stöðugt" : "Óstöðugt: fleiri mál berast en hópurinn ræður við"]);
      list.push(["Fjöldi sem þarf svo $\\rho_p \\lt 1$", "minnst " + (Math.floor(lam * ul / h) + 1)]);
    }
    rows(out, list);
  });

  /* ---------- Biðraðir ---------- */
  function mmc(lam, mu, c) {
    var a = lam / mu, rho = a / c;
    if (rho >= 1) return { a: a, rho: rho, stable: false };
    var sum = 0, tt = 1;
    for (var n = 0; n < c; n++) { if (n > 0) tt *= a / n; sum += tt; }
    var ac = tt * a / c, top = ac / (1 - rho), P0 = 1 / (sum + top);
    var Lq = ac * rho * P0 / ((1 - rho) * (1 - rho)), Wq = Lq / lam, W = Wq + 1 / mu;
    return { a: a, rho: rho, stable: true, sum: sum, ac: ac, top: top, P0: P0, Pw: top * P0, Lq: Lq, Wq: Wq, W: W, L: lam * W };
  }
  function tconv(x, u) { return u === "klst" ? " (" + f(60 * x) + " mín)" : u === "dagar" ? " (" + f(24 * x) + " klst á sólarhring)" : ""; }

  watch(["q1-lam", "q1-mu", "q1-u"], function () {
    var lam = num("q1-lam"), mu = num("q1-mu"), u = $("q1-u").value, out = $("q1-out");
    if (!(lam > 0 && mu > 0)) return bad(out, "Settu inn $\\lambda$ og $\\mu$");
    var q = mmc(lam, mu, 1);
    if (!q.stable) return rows(out, [["$\\rho = \\lambda/\\mu$", f(q.rho), true], ["Óstöðugt kerfi", "$\\rho \\ge 1$: röðin vex án takmarka"]]);
    var tu = u === "klst" ? " klst" : u === "mín" ? " mín" : " dagar";
    rows(out, [
      ["Nýting $\\rho = \\lambda/\\mu$", f(100 * q.rho, 3) + " %", true],
      ["$L_q = \\rho^2/(1-\\rho)$", f(q.Lq), true],
      ["$W_q = L_q/\\lambda$", f(q.Wq) + tu + tconv(q.Wq, u), true],
      ["$W = W_q + 1/\\mu$", f(q.W) + tu + tconv(q.W, u), true],
      ["$L = \\lambda W$", f(q.L)],
      ["Meðalafgreiðslutími $1/\\mu$", f(1 / mu) + tu + tconv(1 / mu, u)],
      ["Líkur á að þjónn sé laus, $1-\\rho$", f(100 * (1 - q.rho), 3) + " %"],
    ]);
  });

  watch(["qc-lam", "qc-mu", "qc-c", "qc-u", "qc-t"], function () {
    var lam = num("qc-lam"), mu = num("qc-mu"), c = Math.round(num("qc-c")), u = $("qc-u").value, target = num("qc-t"), out = $("qc-out"), tab = $("qc-tab");
    tab.innerHTML = "";
    if (!(lam > 0 && mu > 0 && c >= 1 && c <= 200)) return bad(out, "Settu inn $\\lambda$, $\\mu$ og $c \\ge 1$");
    var q = mmc(lam, mu, c), tu = u === "klst" ? " klst" : u === "mín" ? " mín" : " dagar", cmin = Math.floor(lam / mu) + 1;
    var list = [["$\\lambda/\\mu$ (meðalfjöldi upptekinna þjóna)", f(q.a)], ["Nýting $\\rho = \\lambda/(c\\mu)$", f(100 * q.rho, 3) + " %", true]];
    if (!q.stable) {
      list.push(["Óstöðugt kerfi", "Þarf minnst $c = " + cmin + "$"]);
    } else {
      list.push(
        ["$\\sum_{n=0}^{c-1} (\\lambda/\\mu)^n/n!$", f(q.sum)],
        ["$(\\lambda/\\mu)^c / (c!(1-\\rho))$", f(q.top)],
        ["Líkur á bið (Erlang C) $P_w$", f(100 * q.Pw, 3) + " %"],
        ["$L_q$ (formúla 7.13)", f(q.Lq), true],
        ["$W_q = L_q/\\lambda$", f(q.Wq) + tu + tconv(q.Wq, u), true],
        ["$W = W_q + 1/\\mu$", f(q.W) + tu + tconv(q.W, u), true],
        ["$L = \\lambda W$", f(q.L)]
      );
    }
    var hasT = target > 0, best = null, h = '<div class="tablewrap"><table><thead><tr><th>$c$</th><th>$\\rho$</th><th>$P_w$</th><th>$L_q$</th><th>$W_q$</th><th>$W$</th></tr></thead><tbody>';
    for (var k = cmin; k <= cmin + 5; k++) {
      var r = mmc(lam, mu, k), ok = hasT && r.Wq <= target;
      if (ok && best === null) best = k;
      h += "<tr" + (k === c ? ' style="font-weight:700"' : "") + "><td>" + k + (hasT ? (ok ? " ✓" : "") : "") + "</td><td>" + f(100 * r.rho, 3) + " %</td><td>" + f(100 * r.Pw, 3) + " %</td><td>" + f(r.Lq) + "</td><td>" + f(r.Wq) + tu + "</td><td>" + f(r.W) + tu + "</td></tr>";
    }
    if (hasT) {
      if (best === null) { best = cmin + 6; while (mmc(lam, mu, best).Wq > target && best < 500) best++; }
      list.push(["Minnsta $c$ svo $W_q \\le " + t(target) + "$", String(best), true]);
    }
    rows(out, list);
    tab.innerHTML = "<p style=\"margin:0 0 0.4rem;font:600 0.9rem var(--sans)\">Samanburður á fjölda þjóna (frá minnsta stöðuga fjölda)</p>" + h + "</tbody></table></div>";
    if (window.renderMath) window.renderMath(tab);
  });
})();

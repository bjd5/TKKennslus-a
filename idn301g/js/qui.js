/* qui.js – sameiginleg birting og einkunnagjöf spurninga: reikna, val, rétt/rangt, fjölsvar, pörun og drag-and-drop.
 * Notað af journey.js (æfingar, kaflapróf, lokapróf) og quiz.js (frjálsar æfingar).
 *
 * Spurningargerðir í bankanum (TK.bank.MC; kind vantar = "mc"):
 *   mc     { topic, q, o: [rétt, rangt, ...], c: 0, e }
 *   tf     { topic, kind: "tf", q: "Fullyrðing", a: true|false, e }
 *   multi  { topic, kind: "multi", q, o: [...], c: [0, 2], e }          – öll rétt svör þarf, ekkert rangt
 *   match  { topic, kind: "match", q, pairs: [[vinstri, hægri], ...], extra: [hægri aukavalkostir], e }
 *   drag   { topic, kind: "drag", q, cats: ["Flokkur A", ...], items: [["atriði", flokkur-númer], ...], e }
 * Reiknidæmi (TK.bank.G) hafa kind "num".
 *
 * TK.qui.toPart(m) breytir bankaspurningu í "part"; partHtml(id, p) býr til HTML;
 * gradePart(root, id, p) gefur einkunn (true/false) og sýnir endurgjöf; unansweredIn(root) telur ósvarað. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  var B = function () { return TK.bank; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var math = function (node) { if (window.renderMath) window.renderMath(node); };
  var shuffle = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var range = function (n) { var r = []; for (var i = 0; i < n; i++) r.push(i); return r; };

  var HINT = {
    mc: "Veldu eitt svar.",
    tf: "Er fullyrðingin rétt eða röng?",
    multi: "Veldu <b>öll</b> svör sem eiga við (eitt eða fleiri).",
    match: "Paraðu hvert atriði við rétt svar í fellilistanum.",
    drag: "Settu hvert atriði í réttan flokk: dragðu það eða smelltu á atriðið og svo á flokkinn.",
  };
  var KIND_NAME = { mc: "Val", tf: "Rétt/rangt", multi: "Fjölsvar", match: "Pörun", drag: "Flokkun", num: "Útreikningur" };

  function toPart(m, title) {
    var k = m.kind || "mc";
    var p = { kind: k, text: m.q, e: m.e, title: title || KIND_NAME[k] };
    if (k === "mc") { p.o = m.o; p.c = m.c; }
    else if (k === "tf") { p.o = ["Rétt", "Rangt"]; p.c = m.a ? 0 : 1; }
    else if (k === "multi") { p.o = m.o; p.c = m.c.slice(); }
    else if (k === "match") { p.pairs = m.pairs; p.extra = m.extra || []; }
    else if (k === "drag") { p.cats = m.cats; p.items = m.items; }
    return p;
  }

  function numAnswer(d) { return B().is(d.answer, 4) + (d.unit ? " " + d.unit : ""); }

  /* ---------- Birting ---------- */
  function partHtml(id, p) {
    var h = '<div class="tpart kind-' + p.kind + '" data-pid="' + id + '">' + (p.label ? '<b class="tlab">' + esc(p.label) + "</b> " : "") + '<div class="ttext">' + p.text + "</div>";
    if (p.kind === "num") {
      return h + '<div class="row tin"><div><label class="f" for="' + id + '">Svar' + (p.unit ? " (" + esc(p.unit) + ")" : "") + '</label><input id="' + id + '" type="text" inputmode="decimal" spellcheck="false" autocomplete="off"></div></div><div class="tfb"></div></div>';
    }
    if (p.kind === "mc" || p.kind === "tf" || p.kind === "multi") {
      var multi = p.kind === "multi";
      if (!p._order) p._order = p.kind === "tf" ? [0, 1] : shuffle(range(p.o.length));
      h += '<p class="thint">' + HINT[p.kind] + "</p>";
      h += '<div class="topts" role="' + (multi ? "group" : "radiogroup") + '">' + p._order.map(function (i) {
        return '<label class="topt"><input type="' + (multi ? "checkbox" : "radio") + '" name="' + id + '" value="' + i + '"> <span>' + p.o[i] + "</span></label>";
      }).join("") + "</div>";
    } else if (p.kind === "match") {
      if (!p._rl) { p._rights = p.pairs.map(function (r) { return r[1]; }).concat(p.extra); p._rl = shuffle(range(p._rights.length)); p._ll = shuffle(range(p.pairs.length)); }
      h += '<p class="thint">' + HINT.match + "</p><div class=\"tmatch\">" + p._ll.map(function (i) {
        return '<div class="mrow" data-i="' + i + '"><span class="mleft">' + p.pairs[i][0] + '</span><select aria-label="Svar við: ' + esc(p.pairs[i][0].replace(/<[^>]+>/g, "")) + '"><option value="">Veldu…</option>' + p._rl.map(function (j) { return '<option value="' + j + '">' + esc(p._rights[j].replace(/<[^>]+>/g, "")) + "</option>"; }).join("") + "</select></div>";
      }).join("") + "</div>";
    } else if (p.kind === "drag") {
      if (!p._il) p._il = shuffle(range(p.items.length));
      h += '<p class="thint">' + HINT.drag + '</p><div class="tdrag"><div class="dpool" data-zone="">' + p._il.map(function (i) {
        return '<button type="button" class="dchip" draggable="true" data-i="' + i + '" data-cat="">' + p.items[i][0] + "</button>";
      }).join("") + '</div><div class="dzones">' + p.cats.map(function (c, ci) {
        return '<div class="dzone" data-zone="' + ci + '" tabindex="0" role="group" aria-label="Flokkur: ' + esc(c.replace(/<[^>]+>/g, "")) + '"><div class="dz-h">' + c + '</div><div class="dz-b"></div></div>';
      }).join("") + "</div></div>";
    }
    return h + '<div class="tfb"></div></div>';
  }

  /* ---------- Drag-and-drop: ein sameiginleg hlustun á skjalinu ---------- */
  var selChip = null;
  function active(el) { var b = el.closest(".tpart"); return b && !b.classList.contains("ok") && !b.classList.contains("no") ? b : null; }
  function place(chip, zone) {
    var box = chip.closest(".tpart");
    var target = zone.classList.contains("dpool") ? zone : zone.querySelector(".dz-b");
    target.appendChild(chip);
    chip.setAttribute("data-cat", zone.classList.contains("dpool") ? "" : zone.getAttribute("data-zone"));
    chip.classList.remove("sel");
    if (selChip === chip) selChip = null;
    if (box) box.dispatchEvent(new Event("change", { bubbles: true }));
  }
  document.addEventListener("click", function (e) {
    var chip = e.target.closest && e.target.closest(".dchip");
    if (chip && active(chip)) {
      if (selChip && selChip !== chip) selChip.classList.remove("sel");
      chip.classList.toggle("sel");
      selChip = chip.classList.contains("sel") ? chip : null;
      return;
    }
    var zone = e.target.closest && (e.target.closest(".dzone") || e.target.closest(".dpool"));
    if (zone && selChip && selChip.closest(".tdrag") === zone.closest(".tdrag") && active(zone)) place(selChip, zone);
  });
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("dzone") && selChip && active(e.target)) {
      e.preventDefault(); place(selChip, e.target);
    }
  });
  var dragChip = null;
  document.addEventListener("dragstart", function (e) {
    var chip = e.target.closest && e.target.closest(".dchip");
    if (!chip || !active(chip)) { if (chip) e.preventDefault(); return; }
    dragChip = chip;
    try { e.dataTransfer.setData("text/plain", chip.getAttribute("data-i")); e.dataTransfer.effectAllowed = "move"; } catch (x) {}
  });
  document.addEventListener("dragover", function (e) {
    var zone = e.target.closest && (e.target.closest(".dzone") || e.target.closest(".dpool"));
    if (zone && dragChip && dragChip.closest(".tdrag") === zone.closest(".tdrag")) { e.preventDefault(); zone.classList.add("over"); }
  });
  document.addEventListener("dragleave", function (e) { var z = e.target.closest && (e.target.closest(".dzone") || e.target.closest(".dpool")); if (z) z.classList.remove("over"); });
  document.addEventListener("drop", function (e) {
    var zone = e.target.closest && (e.target.closest(".dzone") || e.target.closest(".dpool"));
    if (zone) zone.classList.remove("over");
    if (zone && dragChip && dragChip.closest(".tdrag") === zone.closest(".tdrag")) { e.preventDefault(); place(dragChip, zone); }
    dragChip = null;
  });

  /* ---------- Einkunnagjöf ---------- */
  function solHtml(p) {
    if (p.kind === "num") return '<p><b>Rétt svar:</b> <span class="ans">' + numAnswer(p) + "</span></p>" + p.sol;
    var h = "";
    if (p.kind === "match") h += '<ul class="plain">' + p.pairs.map(function (r) { return "<li>" + r[0] + " → <b>" + r[1] + "</b></li>"; }).join("") + "</ul>";
    if (p.kind === "drag") h += '<ul class="plain">' + p.cats.map(function (c, ci) {
      return "<li><b>" + c + ":</b> " + p.items.filter(function (it) { return it[1] === ci; }).map(function (it) { return it[0]; }).join("; ") + "</li>";
    }).join("") + "</ul>";
    if (p.kind === "multi") h += "<p><b>Rétt svör:</b> " + p.c.map(function (i) { return p.o[i]; }).join("; ") + "</p>";
    if (p.kind === "tf") h += "<p><b>Rétt svar:</b> " + p.o[p.c] + "</p>";
    return h + (p.e ? "<p>" + p.e + "</p>" : "");
  }

  function gradePart(root, id, p) {
    var box = root.querySelector('[data-pid="' + id + '"]'), ok = false, given = null, empty = false;
    if (p.kind === "num") {
      var v = box.querySelector("input").value.trim();
      given = v; empty = !v;
      ok = v ? !!B().isRight(p, v) : false;
    } else if (p.kind === "mc" || p.kind === "tf") {
      var r = box.querySelector("input:checked");
      given = r ? +r.value : null; empty = given === null;
      ok = given === p.c;
      box.querySelectorAll(".topt").forEach(function (l) {
        var i = +l.querySelector("input").value;
        if (i === p.c) l.classList.add("right"); else if (i === given) l.classList.add("wrong");
      });
    } else if (p.kind === "multi") {
      var chosen = [].map.call(box.querySelectorAll("input:checked"), function (x) { return +x.value; });
      empty = !chosen.length;
      ok = chosen.length === p.c.length && chosen.every(function (i) { return p.c.indexOf(i) !== -1; });
      box.querySelectorAll(".topt").forEach(function (l) {
        var i = +l.querySelector("input").value, want = p.c.indexOf(i) !== -1, got = chosen.indexOf(i) !== -1;
        if (want) l.classList.add("right"); else if (got) l.classList.add("wrong");
      });
    } else if (p.kind === "match") {
      var all = true, any = false;
      box.querySelectorAll(".mrow").forEach(function (row) {
        var sel = row.querySelector("select"), good = sel.value !== "" && +sel.value === +row.getAttribute("data-i");
        if (sel.value !== "") any = true;
        if (!good) all = false;
        row.classList.add(good ? "right" : "wrong");
      });
      ok = all; empty = !any;
    } else if (p.kind === "drag") {
      var allc = true, anyp = false;
      box.querySelectorAll(".dchip").forEach(function (c) {
        var cat = c.getAttribute("data-cat"), good = cat !== "" && p.items[+c.getAttribute("data-i")][1] === +cat;
        if (cat !== "") anyp = true;
        if (!good) allc = false;
        c.classList.add(good ? "right" : "wrong");
      });
      ok = allc; empty = !anyp;
    }
    box.querySelectorAll("input,select").forEach(function (x) { x.disabled = true; });
    box.querySelectorAll(".dchip").forEach(function (x) { x.disabled = true; x.draggable = false; x.classList.remove("sel"); });
    box.classList.add(ok ? "ok" : "no");
    var fb = box.querySelector(".tfb");
    fb.innerHTML = '<p class="result ' + (ok ? "ok" : "no") + '">' + (ok ? "✓ Rétt" : empty ? "✗ Ósvarað" : "✗ Rangt") + "</p>" +
      '<details class="reveal tsol"><summary></summary><div class="sol">' + solHtml(p) + "</div></details>";
    math(fb);
    return ok;
  }

  function unansweredIn(root) {
    var k = 0;
    root.querySelectorAll(".tpart").forEach(function (b) {
      if (b.classList.contains("kind-num")) { if (!b.querySelector("input").value.trim()) k++; }
      else if (b.classList.contains("kind-match")) { if ([].some.call(b.querySelectorAll("select"), function (s) { return s.value === ""; })) k++; }
      else if (b.classList.contains("kind-drag")) { if ([].some.call(b.querySelectorAll(".dchip"), function (c) { return c.getAttribute("data-cat") === ""; })) k++; }
      else if (!b.querySelector("input:checked")) k++;
    });
    return k;
  }

  TK.qui = { toPart: toPart, partHtml: partHtml, gradePart: gradePart, unansweredIn: unansweredIn, solHtml: solHtml, numAnswer: numAnswer, KIND_NAME: KIND_NAME, esc: esc };
})();

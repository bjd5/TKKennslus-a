/* w/kafli-3.js – gagnvirka skrefið í kafla 3: atburðaspæjari og villuleit í samvinnulíkani. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  function register(id, fn) { if (typeof TK.widget === "function") TK.widget(id, fn); else (TK._widgetQueue = TK._widgetQueue || []).push([id, fn]); }

  /* ---------- BPMN-teikning í SVG (sama safn og í lesefninu) ----------
   * BP({w, h, label, id}) skilar teiknara. Öll form nota CSS-breytur vefsins svo þau virki í ljósu og dökku þema.
   * Atburðir: þunnur hringur = upphaf, þykkur = endir, tvöfaldur = millistig (strikaður = órjúfandi).
   * Verk: ávalur rétthyrningur. Hlið: tígull með X / + / O. Raðflæði: heil lína með fylltri ör.
   * Skilaboðaflæði: strikalína með opnum hring í upphafi og opinni ör í endann. */
  var BPCOL = { ink: "var(--ink)", mag: "var(--mag)", bad: "var(--bad)", good: "var(--good)", mut: "var(--muted)" };
  function BP(o) {
    o = o || {};
    BP.n = (BP.n || 0) + 1;
    var uid = o.id || "bp" + BP.n + Math.random().toString(36).slice(2, 6);
    var parts = [];
    var BG = "var(--raised)";
    var col = function (c) { return BPCOL[c] || c || BPCOL.ink; };
    var key = function (c) { return BPCOL[c] ? c : "ink"; };
    var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
    var f = function (x) { return Math.round(x * 10) / 10; };
    function pathOf(pts) { return pts.map(function (p, i) { return (i ? "L" : "M") + f(p[0]) + " " + f(p[1]); }).join(" "); }

    function text(x, y, s, t) {
      t = t || {};
      var lines = String(s).split("\n"), fs = t.size || 10.5, lh = fs * 1.2, y0;
      if (t.v === "top") y0 = y + fs * 0.82;
      else if (t.v === "bottom") y0 = y - (lines.length - 1) * lh - fs * 0.22;
      else y0 = y - ((lines.length - 1) * lh) / 2 + fs * 0.36;
      var st = "fill:" + col(t.col || "ink") + ";font-family:var(--sans);font-size:" + fs + "px" + (t.bold ? ";font-weight:700" : "") + (t.it ? ";font-style:italic" : "");
      var tr = t.rot ? ' transform="rotate(' + t.rot + " " + f(x) + " " + f(y) + ')"' : "";
      return '<text x="' + f(x) + '" y="' + f(y0) + '" text-anchor="' + (t.a || "middle") + '" style="' + st + '"' + tr + ">" +
        lines.map(function (l, i) { return '<tspan x="' + f(x) + '"' + (i ? ' dy="' + f(lh) + '"' : "") + ">" + esc(l) + "</tspan>"; }).join("") + "</text>";
    }
    function stroke(c, w, extra) { return "stroke:" + col(c) + ";stroke-width:" + w + (extra || ""); }
    function wrap(s, t) { return t && t.g ? "<g " + t.g + ">" + s + "</g>" : s; }

    var api = {
      uid: uid,
      raw: function (s) { parts.push(s); return api; },
      text: function (x, y, s, t) { parts.push(text(x, y, s, t)); return api; },
      task: function (cx, cy, label, t) {
        t = t || {};
        var w = t.w || 96, h = t.h || 50, c = t.col || "ink", x = cx - w / 2, y = cy - h / 2, s = "";
        var hit = t.hit ? ' style="fill:' + col(t.hit) + ';fill-opacity:0.14;stroke:none"' : "";
        s += '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + w + '" height="' + h + '" rx="8" style="fill:' + (t.fill || BG) + ";" + stroke(c, t.call ? 3.2 : 1.3) + '"/>';
        if (t.hit) s += '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + w + '" height="' + h + '" rx="8"' + hit + "/>";
        if (t.trans) s += '<rect x="' + f(x + 3) + '" y="' + f(y + 3) + '" width="' + (w - 6) + '" height="' + (h - 6) + '" rx="6" style="fill:none;' + stroke(c, 1) + '"/>';
        var mk = t.mk || [], tx = mk.length ? -5 : 0;
        s += text(cx, cy + tx, label, { size: t.fs || 10.5, col: t.tcol || c });
        if (t.tag) s += text(x + 7, y + 4, t.tag, { v: "top", a: "start", size: 9.5, bold: true, col: "mag" });
        var mx = cx - ((mk.length - 1) * 15) / 2, my = y + h - 9;
        mk.forEach(function (m, i) {
          var X = mx + i * 15, Y = my, ss = "fill:none;" + stroke(c, 1.2);
          if (m === "sub") s += '<rect x="' + f(X - 5.5) + '" y="' + f(Y - 5.5) + '" width="11" height="11" style="' + ss + '"/><path d="M' + f(X - 3.5) + " " + f(Y) + "H" + f(X + 3.5) + "M" + f(X) + " " + f(Y - 3.5) + "V" + f(Y + 3.5) + '" style="' + ss + '"/>';
          else if (m === "loop") s += '<path d="M' + f(X - 3.5) + " " + f(Y + 4) + "A5 5 0 1 1 " + f(X + 3.5) + " " + f(Y + 4) + '" style="' + ss + '"/><path d="M' + f(X - 6.5) + " " + f(Y + 3) + "L" + f(X - 3.5) + " " + f(Y + 4.5) + "L" + f(X - 2.5) + " " + f(Y + 1) + '" style="' + ss + '"/>';
          else if (m === "mi") s += '<path d="M' + f(X - 4) + " " + f(Y - 5) + "V" + f(Y + 5) + "M" + f(X) + " " + f(Y - 5) + "V" + f(Y + 5) + "M" + f(X + 4) + " " + f(Y - 5) + "V" + f(Y + 5) + '" style="fill:none;' + stroke(c, 1.7) + '"/>';
          else if (m === "mis") s += '<path d="M' + f(X - 5) + " " + f(Y - 4) + "H" + f(X + 5) + "M" + f(X - 5) + " " + f(Y) + "H" + f(X + 5) + "M" + f(X - 5) + " " + f(Y + 4) + "H" + f(X + 5) + '" style="fill:none;' + stroke(c, 1.7) + '"/>';
          else if (m === "comp") s += '<path d="M' + f(X - 6) + " " + f(Y) + "L" + f(X) + " " + f(Y - 4) + "V" + f(Y + 4) + "Z M" + f(X) + " " + f(Y) + "L" + f(X + 6) + " " + f(Y - 4) + "V" + f(Y + 4) + 'Z" style="' + ss + '"/>';
          else if (m === "adhoc") s += '<path d="M' + f(X - 6) + " " + f(Y + 1) + "Q" + f(X - 3) + " " + f(Y - 4) + " " + f(X) + " " + f(Y) + "T" + f(X + 6) + " " + f(Y - 1) + '" style="' + ss + '"/>';
        });
        parts.push(wrap(s, t));
        return api;
      },
      /* kind: start | end | inter. t.trig: msg | timer | error | comp | term | signal. t.thr = kastandi (fyllt tákn). t.ni = órjúfandi (strikað). */
      ev: function (cx, cy, kind, t) {
        t = t || {};
        var r = t.r || 13, c = t.col || "ink", s = "", da = t.ni ? ";stroke-dasharray:3 2.2" : "";
        var fillc = t.hit ? "color-mix(in srgb, " + col(t.hit) + " 16%, " + BG + ")" : BG;
        if (kind === "end") s += '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + r + '" style="fill:' + fillc + ";" + stroke(c, 3.4) + '"/>';
        else if (kind === "inter") s += '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + r + '" style="fill:' + fillc + ";" + stroke(c, 1.2, da) + '"/><circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + (r - 3) + '" style="fill:none;' + stroke(c, 1.2, da) + '"/>';
        else s += '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + r + '" style="fill:' + fillc + ";" + stroke(c, 1.3, da) + '"/>';
        var fill = t.thr ? col(c) : "none", ic = stroke(c, 1.1) + ";fill:" + fill;
        if (t.trig === "msg") {
          var ew = r * 1.08, eh = r * 0.74, ex = cx - ew / 2, ey = cy - eh / 2;
          s += '<rect x="' + f(ex) + '" y="' + f(ey) + '" width="' + f(ew) + '" height="' + f(eh) + '" style="' + ic + '"/>';
          s += '<path d="M' + f(ex) + " " + f(ey) + "L" + f(cx) + " " + f(ey + eh * 0.58) + "L" + f(ex + ew) + " " + f(ey) + '" style="fill:none;' + stroke(t.thr ? BG : c, 1.1) + '"/>';
        } else if (t.trig === "timer") {
          var tr = r * 0.64;
          s += '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(tr) + '" style="fill:none;' + stroke(c, 1.2) + '"/>';
          for (var k = 0; k < 12; k++) {
            var an = (k * Math.PI) / 6, r1 = tr * (k % 3 ? 0.8 : 0.68);
            s += '<path d="M' + f(cx + Math.cos(an) * r1) + " " + f(cy + Math.sin(an) * r1) + "L" + f(cx + Math.cos(an) * tr) + " " + f(cy + Math.sin(an) * tr) + '" style="' + stroke(c, 0.7) + '"/>';
          }
          s += '<path d="M' + f(cx) + " " + f(cy - tr * 0.6) + "L" + f(cx) + " " + f(cy) + "L" + f(cx + tr * 0.45) + " " + f(cy + tr * 0.1) + '" style="fill:none;' + stroke(c, 1.2) + '"/>';
        } else if (t.trig === "error") {
          var q = r * 0.55, P = [[-0.75, 0.75], [-0.3, -0.55], [0.1, 0.15], [0.75, -0.75], [0.3, 0.55], [-0.1, -0.15]];
          s += '<path d="' + pathOf(P.map(function (p) { return [cx + p[0] * q, cy + p[1] * q]; })) + 'Z" style="' + ic + ';stroke-linejoin:round"/>';
        } else if (t.trig === "comp") {
          var u = r * 0.36;
          s += '<path d="M' + f(cx - 2 * u) + " " + f(cy) + "L" + f(cx - 0.1 * u) + " " + f(cy - u) + "V" + f(cy + u) + "Z M" + f(cx) + " " + f(cy) + "L" + f(cx + 1.9 * u) + " " + f(cy - u) + "V" + f(cy + u) + 'Z" style="' + ic + '"/>';
        } else if (t.trig === "term") {
          s += '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(r * 0.6) + '" style="fill:' + col(c) + ';stroke:none"/>';
        } else if (t.trig === "signal") {
          var v = r * 0.6;
          s += '<path d="M' + f(cx) + " " + f(cy - v) + "L" + f(cx + v * 0.9) + " " + f(cy + v * 0.6) + "L" + f(cx - v * 0.9) + " " + f(cy + v * 0.6) + 'Z" style="' + ic + '"/>';
        }
        if (t.label) {
          var lp = t.lp || "b", ls = { size: t.fs || 9.5, col: t.lcol || "ink" };
          if (lp === "b") { ls.v = "top"; s += text(cx + (t.ldx || 0), cy + r + 3, t.label, ls); }
          else if (lp === "t") { ls.v = "bottom"; s += text(cx + (t.ldx || 0), cy - r - 3, t.label, ls); }
          else if (lp === "r") { ls.a = "start"; s += text(cx + r + 4, cy, t.label, ls); }
          else { ls.a = "end"; s += text(cx - r - 4, cy, t.label, ls); }
        }
        parts.push(wrap(s, t));
        return api;
      },
      /* type: xor | and | or | evt | none | q */
      gw: function (cx, cy, type, t) {
        t = t || {};
        var s0 = t.s || 18, c = t.col || "ink", mc = t.mcol || c, s = "";
        var fillc = t.hit ? "color-mix(in srgb, " + col(t.hit) + " 16%, " + BG + ")" : BG;
        s += '<path d="M' + f(cx) + " " + f(cy - s0) + "L" + f(cx + s0) + " " + f(cy) + "L" + f(cx) + " " + f(cy + s0) + "L" + f(cx - s0) + " " + f(cy) + 'Z" style="fill:' + fillc + ";" + stroke(c, t.sw || 1.3) + '"/>';
        var a = s0 * 0.3, b = s0 * 0.42;
        if (type === "xor") s += '<path d="M' + f(cx - a) + " " + f(cy - a) + "L" + f(cx + a) + " " + f(cy + a) + "M" + f(cx + a) + " " + f(cy - a) + "L" + f(cx - a) + " " + f(cy + a) + '" style="fill:none;' + stroke(mc, 2.6) + '"/>';
        else if (type === "and") s += '<path d="M' + f(cx - b) + " " + f(cy) + "H" + f(cx + b) + "M" + f(cx) + " " + f(cy - b) + "V" + f(cy + b) + '" style="fill:none;' + stroke(mc, 2.8) + '"/>';
        else if (type === "or") s += '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(s0 * 0.4) + '" style="fill:none;' + stroke(mc, 2.4) + '"/>';
        else if (type === "evt") {
          s += '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(s0 * 0.58) + '" style="fill:none;' + stroke(mc, 1) + '"/><circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(s0 * 0.47) + '" style="fill:none;' + stroke(mc, 1) + '"/>';
          var pp = [];
          for (var k = 0; k < 5; k++) { var an = -Math.PI / 2 + (k * 2 * Math.PI) / 5; pp.push([cx + Math.cos(an) * s0 * 0.29, cy + Math.sin(an) * s0 * 0.29]); }
          s += '<path d="' + pathOf(pp) + 'Z" style="fill:none;' + stroke(mc, 1.2) + '"/>';
        } else if (type === "q") s += text(cx, cy + 1, "?", { size: 15, bold: true, col: mc });
        if (t.num != null) s += '<circle cx="' + f(cx + s0 * 0.85) + '" cy="' + f(cy - s0 * 0.85) + '" r="7.5" style="fill:' + col(t.numcol || "mag") + ';stroke:none"/>' + text(cx + s0 * 0.85, cy - s0 * 0.85 + 0.3, String(t.num), { size: 9.5, bold: true, col: BG });
        if (t.label) s += text(cx + (t.ldx || 0), cy - s0 - 4 + (t.ldy || 0), t.label, { v: "bottom", size: 9.5, a: t.la || "middle" });
        parts.push(wrap(s, t));
        return api;
      },
      seq: function (pts, t) {
        t = t || {};
        var c = t.col || "ink", s = "";
        if (t.hitw) s += '<path d="' + pathOf(pts) + '" style="fill:none;stroke:transparent;stroke-width:' + t.hitw + '"/>';
        s += '<path d="' + pathOf(pts) + '" style="fill:none;' + stroke(c, t.sw || 1.3) + (t.dash ? ";stroke-dasharray:" + t.dash : "") + '" marker-end="url(#' + uid + "-ar-" + key(c) + ')"/>';
        if (t.def) {
          var dx = pts[1][0] - pts[0][0], dy = pts[1][1] - pts[0][1], L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L;
          var mx = pts[0][0] + ux * 10, my = pts[0][1] + uy * 10;
          s += '<path d="M' + f(mx - uy * 5 - ux * 3) + " " + f(my + ux * 5 - uy * 3) + "L" + f(mx + uy * 5 + ux * 3) + " " + f(my - ux * 5 + uy * 3) + '" style="' + stroke(c, 1.3) + '"/>';
        }
        if (t.label) s += text(t.lx, t.ly, t.label, { size: t.fs || 9, a: t.la || "start", v: t.lv || "bottom", col: t.lcol || "mut" });
        parts.push(wrap(s, t));
        return api;
      },
      msg: function (pts, t) {
        t = t || {};
        var c = t.col || "ink", s = "";
        if (t.hitw) s += '<path d="' + pathOf(pts) + '" style="fill:none;stroke:transparent;stroke-width:' + t.hitw + '"/>';
        s += '<path d="' + pathOf(pts) + '" style="fill:none;' + stroke(c, 1.2) + ';stroke-dasharray:6 3.5" marker-start="url(#' + uid + "-mc-" + key(c) + ')" marker-end="url(#' + uid + "-mo-" + key(c) + ')"/>';
        if (t.label) s += text(t.lx, t.ly, t.label, { size: t.fs || 9, a: t.la || "start", v: t.lv || "middle", col: t.lcol || "mut", it: true });
        parts.push(wrap(s, t));
        return api;
      },
      assoc: function (pts, t) {
        t = t || {};
        var c = t.col || "mut";
        parts.push(wrap('<path d="' + pathOf(pts) + '" style="fill:none;' + stroke(c, 1.1) + ';stroke-dasharray:1.5 3"' + (t.arrow ? ' marker-end="url(#' + uid + "-ao-" + key(c) + ')"' : "") + "/>", t));
        return api;
      },
      data: function (cx, cy, label, t) {
        t = t || {};
        var w = 26, h = 33, x = cx - w / 2, y = cy - h / 2, c = t.col || "ink", d = 8, s = "";
        s += '<path d="M' + f(x) + " " + f(y) + "H" + f(x + w - d) + "L" + f(x + w) + " " + f(y + d) + "V" + f(y + h) + "H" + f(x) + 'Z" style="fill:' + BG + ";" + stroke(c, 1.1) + '"/>';
        s += '<path d="M' + f(x + w - d) + " " + f(y) + "V" + f(y + d) + "H" + f(x + w) + '" style="fill:none;' + stroke(c, 1.1) + '"/>';
        if (t.coll) s += '<path d="M' + f(cx - 4) + " " + f(y + h - 9) + "v6M" + f(cx) + " " + f(y + h - 9) + "v6M" + f(cx + 4) + " " + f(y + h - 9) + 'v6" style="' + stroke(c, 1.4) + '"/>';
        if (label) s += text(cx, y + h + 3, label, { v: "top", size: t.fs || 9 });
        parts.push(wrap(s, t));
        return api;
      },
      store: function (cx, cy, label, t) {
        t = t || {};
        var w = 34, h = 30, x = cx - w / 2, y = cy - h / 2, ry = 5, c = t.col || "ink", s = "";
        s += '<path d="M' + f(x) + " " + f(y + ry) + "V" + f(y + h - ry) + "A" + w / 2 + " " + ry + " 0 0 0 " + f(x + w) + " " + f(y + h - ry) + "V" + f(y + ry) + '" style="fill:' + BG + ";" + stroke(c, 1.1) + '"/>';
        s += '<ellipse cx="' + f(cx) + '" cy="' + f(y + ry) + '" rx="' + w / 2 + '" ry="' + ry + '" style="fill:' + BG + ";" + stroke(c, 1.1) + '"/>';
        if (label) s += text(cx, y + h + 3, label, { v: "top", size: t.fs || 9 });
        parts.push(wrap(s, t));
        return api;
      },
      annot: function (x, cy, label, t) {
        t = t || {};
        var n = String(label).split("\n").length, h = n * 12 + 8, c = t.col || "mut";
        parts.push(wrap('<path d="M' + f(x + 10) + " " + f(cy - h / 2) + "H" + f(x) + "V" + f(cy + h / 2) + "H" + f(x + 10) + '" style="fill:none;' + stroke(c, 1.1) + '"/>' +
          text(x + 5, cy, label, { a: "start", size: t.fs || 9.5, col: t.tcol || "ink" }), t));
        return api;
      },
      /* Laug (pool) með heiti á vinstri bekk; t.lanes = [{h, label}] skiptir henni í brautir. t.black = svartur kassi (bara heiti). */
      pool: function (x, y, w, h, label, t) {
        t = t || {};
        var c = t.col || "ink", s = "";
        s += '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + w + '" height="' + h + '" style="fill:none;' + stroke(c, 1.3) + '"/>';
        if (t.black) { s += text(x + w / 2, y + h / 2, label, { size: 11, bold: true, col: c }); parts.push(s); return api; }
        s += '<path d="M' + f(x + 24) + " " + f(y) + "V" + f(y + h) + '" style="' + stroke(c, 1.3) + '"/>';
        s += text(x + 12, y + h / 2, label, { size: 10.5, bold: true, rot: -90, col: c });
        if (t.lanes) {
          var yy = y;
          t.lanes.forEach(function (ln, i) {
            if (i) s += '<path d="M' + f(x + 24) + " " + f(yy) + "H" + f(x + w) + '" style="' + stroke(c, 1) + '"/>';
            s += '<path d="M' + f(x + 46) + " " + f(yy) + "V" + f(yy + ln.h) + '" style="' + stroke(c, 0.8) + '"/>';
            s += text(x + 35, yy + ln.h / 2, ln.label, { size: 9.5, rot: -90, col: c });
            yy += ln.h;
          });
        }
        parts.push(s);
        return api;
      },
      svg: function (extraStyle, cls) {
        var defs = "";
        Object.keys(BPCOL).forEach(function (k) {
          var c = BPCOL[k];
          defs += '<marker id="' + uid + "-ar-" + k + '" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="8.5" markerHeight="8.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0.8L10 5L0 9.2Z" style="fill:' + c + '"/></marker>';
          defs += '<marker id="' + uid + "-mo-" + k + '" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M1 1.5L11 6L1 10.5Z" style="fill:' + BG + ";stroke:" + c + ';stroke-width:1.2"/></marker>';
          defs += '<marker id="' + uid + "-mc-" + k + '" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><circle cx="5" cy="5" r="3.8" style="fill:' + BG + ";stroke:" + c + ';stroke-width:1.2"/></marker>';
          defs += '<marker id="' + uid + "-ao-" + k + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0.5 0.8L9.5 5L0.5 9.2" style="fill:none;stroke:' + c + ';stroke-width:1.2"/></marker>';
        });
        return '<svg' + (cls === false ? "" : ' class="' + (cls || "diagram") + '"') + ' viewBox="0 0 ' + o.w + " " + o.h + '" role="img" aria-label="' + esc(o.label || "BPMN-líkan") +
          '" xmlns="http://www.w3.org/2000/svg" style="height:auto;' + (extraStyle || "") + '"><defs>' + defs + "</defs>" + parts.join("") + "</svg>";
      },
    };
    return api;
  }


  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- Táknaspjald ---------- */
  var SYM = [
    { k: "startMsg", n: "Upphafsatburður skilaboða", d: function (D) { D.ev(30, 26, "start", { trig: "msg" }); } },
    { k: "startTimer", n: "Upphafstímaatburður", d: function (D) { D.ev(30, 26, "start", { trig: "timer" }); } },
    { k: "interMsgC", n: "Millistigsatburður skilaboða, grípandi", d: function (D) { D.ev(30, 26, "inter", { trig: "msg" }); } },
    { k: "interMsgT", n: "Millistigsatburður skilaboða, kastandi", d: function (D) { D.ev(30, 26, "inter", { trig: "msg", thr: true }); } },
    { k: "interTimer", n: "Millistigstímaatburður (töf)", d: function (D) { D.ev(30, 26, "inter", { trig: "timer" }); } },
    { k: "endMsg", n: "Endaatburður skilaboða", d: function (D) { D.ev(30, 26, "end", { trig: "msg", thr: true }); } },
    { k: "endError", n: "Endaatburður villu", d: function (D) { D.ev(30, 26, "end", { trig: "error", thr: true }); } },
    { k: "endTerm", n: "Lokunaratburður (terminate)", d: function (D) { D.ev(30, 26, "end", { trig: "term" }); } },
    { k: "evtGw", n: "Atburðahlið", d: function (D) { D.gw(30, 26, "evt", { s: 17 }); } },
    { k: "bTimer", n: "Tímajaðaratburður, rjúfandi", d: function (D) { D.task(30, 20, "", { w: 50, h: 26 }); D.ev(38, 33, "inter", { trig: "timer", r: 10 }); } },
    { k: "bMsg", n: "Skilaboðajaðaratburður, rjúfandi", d: function (D) { D.task(30, 20, "", { w: 50, h: 26 }); D.ev(38, 33, "inter", { trig: "msg", r: 10 }); } },
    { k: "bMsgNI", n: "Skilaboðajaðaratburður, órjúfandi", d: function (D) { D.task(30, 20, "", { w: 50, h: 26 }); D.ev(38, 33, "inter", { trig: "msg", r: 10, ni: true }); } },
    { k: "bError", n: "Villujaðaratburður", d: function (D) { D.task(30, 20, "", { w: 50, h: 26 }); D.ev(38, 33, "inter", { trig: "error", r: 10 }); } },
    { k: "bComp", n: "Bótajaðaratburður", d: function (D) { D.task(30, 20, "", { w: 50, h: 26 }); D.ev(38, 33, "inter", { trig: "comp", r: 10 }); } },
  ];
  var SYMBY = {}; SYM.forEach(function (s) { SYMBY[s.k] = s; });
  function icon(s) { var D = BP({ w: 60, h: 50, label: s.n }); s.d(D); return D.svg("width:60px;height:50px", false); }

  var QS = [
    { k: "startMsg", t: "Tjónsuppgjör hefst þegar tjónstilkynning berst frá viðskiptavini í tölvupósti.", e: "Ferlið hefst við að skilaboð berast: upphafsatburður skilaboða (autt umslag, þunn lína)." },
    { k: "startTimer", t: "Birgðaáfylling byggingavöruverslunar fer sjálfkrafa af stað alla fimmtudaga kl. 8.", e: "Tilvik verður til á ákveðnum tíma: upphafstímaatburður." },
    { k: "interMsgC", t: "Námsstyrkjasjóðurinn hefur beðið um viðbótargögn og ferlið bíður þar til þau berast frá umsækjanda.", e: "Beðið eftir skilaboðum í miðju ferli: grípandi millistigsatburður skilaboða (autt umslag, tvöfaldur hringur)." },
    { k: "interMsgT", t: "Bankinn sendir viðskiptavini staðfestingu á að reikningur hafi verið stofnaður, og ferlið heldur strax áfram með næsta verk.", e: "Skilaboð send og ferlið heldur áfram: kastandi millistigsatburður skilaboða (fyllt umslag)." },
    { k: "endMsg", t: "Ferli viðhaldsbeiðni lýkur á því að leigjandi fær tilkynningu um að viðgerð sé lokið.", e: "Ferlinu lýkur með sendingu skilaboða: endaatburður skilaboða (fyllt umslag, þykk lína)." },
    { k: "interTimer", t: "Eftir að fiski er pakkað þarf að bíða í 2 klst. meðan hann kælist áður en hann er hlaðinn á bíl.", e: "Töf í flæðinu: millistigstímaatburður í röð. Hann setur ekki tímamörk á annað verk." },
    { k: "bTimer", t: "Ef yfirferð læknis á tilvísun tekur meira en 5 virka daga er henni hætt og tilvísunin send til yfirlæknis.", e: "Tímamörk á verk sem á að stöðva: rjúfandi tímajaðaratburður á verkinu." },
    { k: "bTimer", t: "Flutningsaðili á að skila tilboði innan 48 klst. Ef það tekst ekki er undirferlinu hætt og seljanda send tilkynning.", e: "Activity timeout: rjúfandi tímajaðaratburður á undirferlinu." },
    { k: "bMsgNI", t: "Meðan pöntun er afgreidd getur viðskiptavinur tilkynnt nýtt heimilisfang. Heimilisfangið er uppfært án þess að afgreiðslan stöðvist.", e: "Verkið heldur áfram og nýtt flæði keyrir samhliða: órjúfandi (strikaður) skilaboðajaðaratburður." },
    { k: "bMsg", t: "Ef umsækjandi dregur umsókn sína til baka meðan á mati stendur er matinu hætt strax og umsókninni lokað.", e: "Ytra frávik sem stöðvar verkið: rjúfandi skilaboðajaðaratburður." },
    { k: "bError", t: "Innan undirferlisins „Tollafgreiðsla“ getur komið í ljós að vottorð vantar. Þá er undirferlið stöðvað og sérstök villumeðhöndlun tekur við utan þess.", e: "Innra frávik gripið á jaðri undirferlisins: villujaðaratburður (með sama heiti og villan sem kastað er inni)." },
    { k: "endError", t: "Innan undirferlisins „Athuga lagerstöðu“ kemur í ljós að vara er ekki til; sú grein undirferlisins endar á því að kasta villunni „Vara ekki til“.", e: "Villunni er kastað innan undirferlisins með endaatburði villu (fyllt tákn, þykk lína)." },
    { k: "evtGw", t: "Tryggingafélagið hefur sent tilboð og bíður: annaðhvort berst samþykki, höfnun, eða 14 dagar líða án svars. Það sem gerist fyrst ræður framhaldinu.", e: "Ákvörðun út frá því sem gerist fyrst (kapphlaup atburða): atburðahlið." },
    { k: "evtGw", t: "Seljandi á uppboðsvef bíður annaðhvort eftir beiðni um að stofna aðgang eða beint eftir staðfestingu; hvort kemur ræðst af því hvort hann er þegar skráður hjá þjónustunni.", e: "Seljandinn sér ekki gögn þjónustunnar, aðeins hvaða skilaboð berast fyrst: atburðahlið (annars sjálfhelda)." },
    { k: "endTerm", t: "Ef svikagrunur vaknar í nýskráningu skal öllu tilvikinu hætt samstundis, líka athugunum sem eru í gangi samhliða.", e: "Allt tilvikið stöðvað, líka samhliða greinar: lokunaratburður (terminate)." },
    { k: "bComp", t: "Verkið „Taka greiðslu“ hefur þegar verið unnið. Ef ferðinni er síðar aflýst þarf að endurgreiða; tengja á bótaverkið „Endurgreiða“ við verkið.", e: "Afturkalla lokið verk: bótajaðaratburður tengdur bótaverki með punktalínu." },
  ];

  /* ---------- Samvinnulíkan með raufum fyrir villur ---------- */
  var SLOTS = {
    start: { n: "Upphafsatburður tjónþola", e: "Upphafsatburður er teiknaður með <b>þunnri</b> línu. Þykk lína táknar endaatburð, svo ferlið virðist enda áður en það byrjar." },
    msg1: { n: "Tenging frá „Senda tjónstilkynningu“", e: "<b>Raðflæði má ekki fara á milli lauga.</b> Tjónþolinn ræður ekki röð verka tryggingafélagsins; samskiptin eru skilaboðaflæði (strikalína, opinn hringur, opin ör)." },
    start2: { n: "Upphafsatburður tryggingafélags", e: "Skilaboðaflæði kemur inn í upphafsatburðinn, svo hann á að vera <b>upphafsatburður skilaboða</b> (með umslagi)." },
    seqIn: { n: "Tenging frá „Skrá tjón“ að hliðinni", e: "Innan sömu laugar er röð sýnd með <b>raðflæði</b>. Skilaboðaflæði er aðeins notað á milli lauga." },
    label: { n: "Verkið í efri greininni", e: "Verk á að heita <b>sögn + nafnorð</b> („Reikna bætur“). „Bætur reiknaðar“ er heiti á atburði." },
    join: { n: "Samruninn", e: "Klofnunin er XOR (annaðhvort reiknaðar bætur eða kröfu hafnað), svo samruninn á að vera <b>XOR</b>. AND-samruni myndi bíða eftir báðum greinum: sjálfhelda." },
    end2: { n: "Endir tryggingafélagsins", e: "Ferlið endar í millistigsatburði (tvöföldum hring). Ferli á að enda í <b>endaatburði með þykkri línu</b>." },
    catch: { n: "Atburðurinn „Niðurstaða móttekin“", e: "Tjónþolinn <b>tekur við</b> niðurstöðunni, svo atburðurinn er grípandi: <b>autt</b> umslag. Fyllt umslag þýðir að skilaboð eru send." },
  };
  var SLOTKEYS = Object.keys(SLOTS);
  function diagram(err, found) {
    var D = BP({ w: 800, h: 400, label: "Samvinnulíkan tjónþola og tryggingafélags; finndu villurnar" });
    var col = function (k) { return found[k] ? "bad" : "ink"; };
    var G = function (k, lab) { return 'data-k="' + k + '" tabindex="0" role="button" aria-label="' + lab + '" style="cursor:pointer"'; };
    var E = function (k) { return !!err[k]; };
    D.pool(10, 10, 780, 125, "Tjónþoli");
    D.pool(10, 160, 780, 230, "Tryggingafélag");
    // tjónþoli
    D.ev(80, 70, E("start") ? "end" : "start", { label: "Tjón\nvarð", col: col("start"), g: G("start", "Upphafsatburður tjónþola") });
    D.seq([[93, 70], [140, 70]], { hitw: 14, g: G("d1", "Raðflæði") });
    D.task(190, 70, "Senda tjóns-\ntilkynningu", { w: 100, g: G("d2", "Verkið Senda tjónstilkynningu") });
    D.seq([[240, 70], [652, 70]], { hitw: 14, g: G("d3", "Raðflæði að Niðurstaða móttekin") });
    D.ev(665, 70, "inter", { trig: "msg", thr: E("catch"), label: "Niðurstaða\nmóttekin", lp: "t", col: col("catch"), g: G("catch", "Atburðurinn Niðurstaða móttekin") });
    D.seq([[678, 70], [732, 70]], { hitw: 14, g: G("d4", "Raðflæði") });
    D.ev(745, 70, "end", { label: "Máli\nlokið", g: G("d5", "Endaatburður tjónþola") });
    // milli lauga
    if (E("msg1")) D.seq([[190, 95], [190, 262]], { col: col("msg1"), hitw: 16, g: G("msg1", "Tenging frá Senda tjónstilkynningu") });
    else D.msg([[190, 95], [190, 262]], { label: "tjónstilkynning", lx: 197, ly: 145, hitw: 16, g: G("msg1", "Tenging frá Senda tjónstilkynningu") });
    D.msg([[665, 250], [665, 83]], { label: "niðurstaða", lx: 672, ly: 145, hitw: 16, g: G("d6", "Skilaboðaflæði með niðurstöðu") });
    // tryggingafélag
    D.ev(190, 275, "start", { trig: E("start2") ? null : "msg", label: "Tilkynning\nmóttekin", col: col("start2"), g: G("start2", "Upphafsatburður tryggingafélags") });
    D.seq([[203, 275], [252, 275]], { hitw: 14, g: G("d7", "Raðflæði") });
    D.task(300, 275, "Skrá tjón", { g: G("d8", "Verkið Skrá tjón") });
    if (E("seqIn")) D.msg([[348, 275], [382, 275]], { col: col("seqIn"), hitw: 14, g: G("seqIn", "Tenging frá Skrá tjón að hlið") });
    else D.seq([[348, 275], [382, 275]], { hitw: 14, g: G("seqIn", "Tenging frá Skrá tjón að hlið") });
    D.gw(400, 275, "xor", { g: G("d9", "XOR-klofnun") });
    D.text(386, 312, "bótaskylt?", { a: "end", size: 9.5, col: "mut" });
    D.seq([[400, 257], [400, 215], [452, 215]], { label: "já", lx: 405, ly: 212, hitw: 14, g: G("d10", "Raðflæði já") });
    D.seq([[400, 293], [400, 335], [452, 335]], { label: "nei", lx: 405, ly: 338, lv: "top", hitw: 14, g: G("d11", "Raðflæði nei") });
    D.task(500, 215, E("label") ? "Bætur\nreiknaðar" : "Reikna\nbætur", { col: col("label"), g: G("label", "Verkið í efri grein") });
    D.task(500, 335, "Hafna\nkröfu", { g: G("d12", "Verkið Hafna kröfu") });
    D.seq([[548, 215], [575, 215], [575, 257]], { hitw: 14, g: G("d13", "Raðflæði") });
    D.seq([[548, 335], [575, 335], [575, 293]], { hitw: 14, g: G("d14", "Raðflæði") });
    D.gw(575, 275, E("join") ? "and" : "xor", { col: col("join"), g: G("join", "Samruninn") });
    D.seq([[593, 275], [620, 275]], { hitw: 14, g: G("d15", "Raðflæði") });
    D.task(665, 275, "Senda\nniðurstöðu", { w: 90, g: G("d16", "Verkið Senda niðurstöðu") });
    D.seq([[710, 275], [737, 275]], { hitw: 14, g: G("d17", "Raðflæði") });
    D.ev(750, 275, E("end2") ? "inter" : "end", { label: "Tjón\nafgreitt", col: col("end2"), g: G("end2", "Endir tryggingafélags") });
    return D.svg("min-width:640px;width:100%", "w3-svg");
  }

  var CSS = [
    ".w3-head{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 .8rem}",
    ".w3-head .chip.done::after{content:' ✓';color:var(--good)}",
    ".w3-q{background:var(--key-bg);border-left:3px solid var(--key-line);padding:.7rem .9rem;border-radius:6px;margin:.5rem 0 .8rem;font-size:1.02rem}",
    ".w3-pal{display:grid;grid-template-columns:repeat(auto-fill,minmax(76px,1fr));gap:.4rem}",
    ".w3-sym{display:flex;flex-direction:column;align-items:center;gap:.15rem;padding:.35rem .2rem;border:1px solid var(--rule-2);border-radius:8px;background:var(--raised);color:var(--ink);cursor:pointer;font:600 .72rem/1.15 var(--sans)}",
    ".w3-sym:hover:not(:disabled){border-color:var(--mag);background:var(--key-bg)}",
    ".w3-sym.right{border-color:var(--good);background:color-mix(in srgb,var(--good) 14%,var(--raised))}",
    ".w3-sym.wrong{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,var(--raised))}",
    ".w3-sym .nm{min-height:1.6em;text-align:center;color:var(--muted);font-weight:500}",
    ".w3-svg{display:block;height:auto;background:var(--raised);border:1px solid var(--rule);border-radius:8px}",
    ".w3-svg [data-k]:focus{outline:none}.w3-svg [data-k]:focus-visible>*{stroke:var(--focus)!important}",
    ".w3-svg [data-k]:hover>*:not(text){opacity:.75}",
    ".w3-found{margin:.6rem 0;padding-left:1.2rem}.w3-found li{margin:.3rem 0}",
    ".w3-bar{display:flex;gap:1rem;flex-wrap:wrap;font:600 .9rem var(--sans);margin:.4rem 0}",
  ].join("");

  register("kafli-3", function (root, api) {
    var app = root.querySelector("#k3-app");
    if (!document.getElementById("w3-css")) { var st = document.createElement("style"); st.id = "w3-css"; st.textContent = CSS; document.head.appendChild(st); }
    var doneA = false, roundsB = 0, mode = 0, lastSet = "";
    app.innerHTML = '<div class="w3-head"></div><div class="w3-body"></div><p class="result" aria-live="polite"></p>';
    var head = app.querySelector(".w3-head"), body = app.querySelector(".w3-body"), res = app.querySelector(".result");
    function setRes(ok, h) { res.className = "result " + (ok ? "ok" : "no"); res.innerHTML = h; }
    function clr() { res.className = "result"; res.innerHTML = ""; }
    function drawHead() {
      head.innerHTML = '<button type="button" class="chip' + (doneA ? " done" : "") + '" aria-pressed="' + (mode === 0) + '" data-m="0">1. Atburðaspæjari</button>' +
        '<button type="button" class="chip' + (roundsB >= 2 ? " done" : "") + '" aria-pressed="' + (mode === 1) + '" data-m="1">2. Villuleit (' + Math.min(roundsB, 2) + "/2)</button>";
    }
    head.addEventListener("click", function (e) { var b = e.target.closest("[data-m]"); if (b) { mode = +b.dataset.m; start(); } });
    function progress() {
      drawHead();
      var n = (doneA ? 1 : 0) + Math.min(roundsB, 2);
      if (n === 3) api.done("Vel gert! Þú þekkir atburðatáknin og fannst allar villurnar í tveimur samvinnulíkönum.");
      else api.status("Þú hefur leyst " + n + " af 3 verkefnum (atburðaspæjari + tvær villuleitir).");
    }
    function start() { clr(); drawHead(); body.onclick = null; body.onkeydown = null; if (mode === 0) quiz(); else hunt(); }

    /* ===== A. Atburðaspæjari ===== */
    function quiz() {
      var qs = shuffle(QS).slice(0, 8), i = 0, score = 0, answered = false;
      var pal = shuffle(SYM);
      function draw() {
        var q = qs[i];
        body.innerHTML = "<div class='w3-bar'><span>Spurning " + (i + 1) + " af 8</span><span>Rétt: " + score + "</span></div>" +
          "<div class='w3-q'>" + q.t + "</div><p style='font-size:.9rem;color:var(--muted);margin:.2rem 0 .5rem'>Hvaða tákn á við? Heitin birtast eftir að þú svarar.</p>" +
          "<div class='w3-pal'>" + pal.map(function (s) {
            var cls = answered ? (s.k === q.k ? " right" : answered === s.k ? " wrong" : "") : "";
            return "<button type='button' class='w3-sym" + cls + "' data-s='" + s.k + "' aria-label='" + s.n + "'" + (answered ? " disabled" : "") + ">" + icon(s) + "<span class='nm'>" + (answered ? s.n : "") + "</span></button>";
          }).join("") + "</div>" +
          (answered ? "<div class='row' style='margin-top:.7rem'><button type='button' class='btn' data-a='next'>" + (i < 7 ? "Næsta spurning →" : "Sjá niðurstöðu") + "</button></div>" : "");
      }
      body.onclick = function (e) {
        var s = e.target.closest("[data-s]");
        if (s && !answered) {
          answered = s.dataset.s;
          var q = qs[i], ok = answered === q.k;
          if (ok) score++;
          setRes(ok, (ok ? "Rétt! " : "Ekki rétt. Rétta svarið er: " + SYMBY[q.k].n + ". ") + "<span style='font-weight:400;color:var(--ink)'>" + q.e + "</span>");
          draw(); return;
        }
        var a = e.target.closest("[data-a]");
        if (!a) return;
        if (a.dataset.a === "next") {
          clr();
          if (i < 7) { i++; answered = false; draw(); return; }
          if (score >= 6) {
            doneA = true;
            body.innerHTML = "<p>Þú fékkst <b>" + score + " af 8</b>.</p><div class='row'><button type='button' class='btn' data-a='go'>Áfram í villuleit →</button><button type='button' class='btn ghost' data-a='again'>Ný umferð</button></div>";
            setRes(true, "Atburðaspæjarinn er leystur.");
            progress();
          } else {
            body.innerHTML = "<p>Þú fékkst <b>" + score + " af 8</b>. Þú þarft 6 rétt. Rifjaðu upp töfluna yfir atburði í lesefninu og reyndu aftur.</p><div class='row'><button type='button' class='btn' data-a='again'>Ný umferð</button></div>";
          }
          return;
        }
        if (a.dataset.a === "again") { clr(); quiz(); }
        if (a.dataset.a === "go") { mode = 1; start(); }
      };
      draw();
    }

    /* ===== B. Villuleit ===== */
    function hunt() {
      var set;
      do { set = shuffle(SLOTKEYS).slice(0, 3).sort(); } while (set.join() === lastSet);
      lastSet = set.join();
      var err = {}, found = {}, miss = 0, nFound = 0, log = [];
      set.forEach(function (k) { err[k] = true; });
      function draw() {
        body.innerHTML = "<p>Í líkaninu eru <b>þrjár villur</b>. Smelltu á gölluðu táknin (eða farðu á þau með Tab og ýttu á Enter). Rangar ábendingar: <b>" + miss + "</b> af 3 leyfðum.</p>" +
          "<div class='tablewrap' style='margin:0'>" + diagram(err, found) + "</div>" +
          "<ol class='w3-found'>" + log.join("") + "</ol>" +
          "<div class='row'><button type='button' class='btn ghost' data-a='new'>Ný útgáfa af líkaninu</button></div>";
      }
      function hit(k) {
        if (nFound === 3 || miss > 3) return;
        if (err[k] && !found[k]) {
          found[k] = true; nFound++;
          log.push("<li><b>" + SLOTS[k].n + ":</b> " + SLOTS[k].e + "</li>");
          draw();
          if (nFound === 3) {
            roundsB++;
            setRes(true, "Allar þrjár villurnar fundnar!" + (roundsB < 2 ? " Fáðu nýja útgáfu og finndu villurnar þar líka." : ""));
            progress();
          } else setRes(true, "Rétt, þetta er villa. " + (3 - nFound) + " eftir.");
        } else if (found[k]) {
          setRes(true, "Þessa villu ertu þegar búin(n) að finna.");
        } else {
          miss++;
          if (miss > 3) { setRes(false, "Of margar rangar ábendingar. Hér kemur ný útgáfa af líkaninu; skoðaðu gátlistann í lesefninu."); setTimeout(function () { clr(); hunt(); }, 1800); }
          else { setRes(false, "Þetta tákn er rétt teiknað. Leitaðu áfram (" + miss + " af 3 röngum)."); draw(); }
        }
      }
      body.onclick = function (e) {
        var g = e.target.closest("[data-k]");
        if (g) { hit(g.getAttribute("data-k")); return; }
        var a = e.target.closest("[data-a]");
        if (a && a.dataset.a === "new") { clr(); hunt(); }
      };
      body.onkeydown = function (e) {
        if ((e.key === "Enter" || e.key === " ") && e.target.getAttribute && e.target.getAttribute("data-k")) { e.preventDefault(); var k = e.target.getAttribute("data-k"); hit(k); var el = body.querySelector('[data-k="' + k + '"]'); if (el) el.focus(); }
      };
      draw();
    }

    start();
    api.status("Þú hefur leyst 0 af 3 verkefnum (atburðaspæjari + tvær villuleitir).");
  });
})();

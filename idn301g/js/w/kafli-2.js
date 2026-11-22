/* w/kafli-2.js – gagnvirka skrefið í kafla 2: hliðasmiðja (XOR/AND/OR) og gild spor. */
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


  /* ---------- Atburðarásir (blokkbyggð líkön) ---------- */
  function T(l) { return { t: "task", l: l }; }
  function S() { return { t: "seq", c: [].slice.call(arguments) }; }
  function G(g, br) { return { t: "gw", g: g, br: br.map(function (b) { return { c: b[0], s: b[1] }; }) }; }
  function L(body, back, exit) { return { t: "loop", body: body, back: back, exit: exit }; }

  var SC = [
    [ // borð 1: eitt hliðapar
      { name: "Tjónstilkynning (svið 1)", st: "Tjónstilkynning\nmóttekin", en: "Tjón\ngert upp",
        text: "Tjónið er fyrst skráð. Tjón undir 200 þús. kr. eru greidd sjálfvirkt en á stærri tjón er sendur matsmaður. Í báðum tilvikum fær tjónþoli síðan sent uppgjör.",
        m: S(T("Skrá tjón"), G("xor", [["undir\n200 þús.", T("Greiða bætur\nsjálfvirkt")], ["200 þús.\neða meira", T("Senda\nmatsmann")]]), T("Senda\nuppgjör")) },
      { name: "Farangur flugfélags (svið 5)", st: "Taska\ninnrituð", en: "Taska\num borð",
        text: "Eftir að farangursmiði er prentaður er taskan gegnumlýst og jafnframt skráð í farangurskerfið. Báðar aðgerðirnar eru alltaf gerðar og röðin skiptir ekki máli, en taskan er ekki hlaðin fyrr en hvoru tveggja er lokið.",
        m: S(T("Prenta\nfarangursmiða"), G("and", [["", T("Gegnumlýsa\ntösku")], ["", T("Skrá í farang-\nurskerfi")]]), T("Hlaða tösku\ní flugvél")) },
      { name: "Námsstyrkur (svið 4)", st: "Umsókn\nmóttekin", en: "Umsókn\nafgreidd",
        text: "Umsókn er yfirfarin. Uppfylli hún skilyrði er styrkur samþykktur, uppfylli hún þau ekki er henni hafnað, og ef vafi leikur á er henni vísað til úthlutunarnefndar. Að því loknu fær umsækjandi svar.",
        m: S(T("Yfirfara\numsókn"), G("xor", [["uppfyllir\nskilyrði", T("Samþykkja\nstyrk")], ["vafamál", T("Vísa til\nnefndar")], ["uppfyllir\nekki", T("Hafna\numsókn")]]), T("Senda\nsvar")) },
      { name: "Útflutningur á fiski (svið 6)", st: "Pöntun\nmóttekin", en: "Sending\nafhent",
        text: "Þegar pöntun hefur verið staðfest vinna þrír starfsmenn samtímis: einn útbýr útflutningsskjöl, annar pakkar fiskinum og sá þriðji bókar flugfrakt. Sendingin er afhent á flugvelli þegar allt þrennt er tilbúið.",
        m: S(T("Staðfesta\npöntun"), G("and", [["", T("Útbúa útflutn-\ningsskjöl")], ["", T("Pakka fiski")], ["", T("Bóka\nflugfrakt")]]), T("Afhenda\nsendingu")) },
    ],
    [ // borð 2: tvö hliðapör
      { name: "Nýskráning í banka (svið 7)", st: "Umsókn um\nviðskipti", en: "Viðskiptavinur\nskráður",
        text: "Skilríki umsækjanda eru staðfest og á sama tíma er kannað hvort hann sé á válista; bæði þarf alltaf. Síðan er áhætta metin. Ef áhættan er mikil er gerð aukin áreiðanleikakönnun, annars er farið beint í að stofna reikning.",
        m: S(G("and", [["", T("Staðfesta\nskilríki")], ["", T("Kanna\nválista")]]), T("Meta\náhættu"), G("xor", [["mikil\náhætta", T("Aukin áreiðan-\nleikakönnun")], ["lítil\náhætta", null]]), T("Stofna\nreikning")) },
      { name: "Tilvísun í sérfræðiþjónustu (svið 3)", st: "Tilvísun\nmóttekin", en: "Tími\nbókaður",
        text: "Tilvísunin er metin. Bráð tilvik fá tíma innan viku; önnur eru bókuð samkvæmt biðlista. Þegar tími er fundinn er sjúklingi send boðun og sjúkraskrá uppfærð, hvort tveggja alltaf og óháð hvort öðru.",
        m: S(T("Meta\ntilvísun"), G("xor", [["bráð", T("Bóka innan\nviku")], ["ekki bráð", T("Bóka skv.\nbiðlista")]]), G("and", [["", T("Senda\nboðun")], ["", T("Uppfæra\nsjúkraskrá")]])) },
      { name: "Viðhaldsbeiðni (svið 8)", st: "Beiðni\nmóttekin", en: "Beiðni\nlokið",
        text: "Beiðnin er greind. Einföld verk fara til húsvarðar en sérhæfð verk til verktaka. Eftir viðgerð er leigjanda tilkynnt og kostnaður skráður í kerfið; hvort tveggja er alltaf gert og röðin skiptir ekki máli.",
        m: S(T("Greina\nbeiðni"), G("xor", [["einfalt", T("Úthluta\nhúsverði")], ["sérhæft", T("Panta\nverktaka")]]), T("Framkvæma\nviðgerð"), G("and", [["", T("Tilkynna\nleigjanda")], ["", T("Skrá\nkostnað")]])) },
      { name: "Farangur við komu (svið 5)", st: "Flugvél\nlent", en: "Farangur\nafgreiddur",
        text: "Þegar vélin er lent er farangur affermdur og samtímis er farþegum tilkynnt um færiband. Síðan er hver taska skönnuð: fari hún í tengiflug er hún flutt þangað, annars sett á færibandið.",
        m: S(G("and", [["", T("Afferma\nfarangur")], ["", T("Tilkynna\nfæriband")]]), T("Skanna\nmiða"), G("xor", [["tengiflug", T("Flytja í\ntengiflug")], ["lokastaður", T("Setja á\nfæriband")]])) },
    ],
    [ // borð 3: OR eða lykkja
      { name: "Innkaup byggingavöruverslunar (svið 2)", st: "Innkaupaþörf\ngreind", en: "Vörur\nmótteknar",
        text: "Innkaupalisti er tekinn saman. Timbur er pantað hjá birgi A, festingar hjá birgi B og málning hjá birgi C, en aðeins það sem vantar: það getur verið eitt, tvennt eða allt þrennt (eitthvað vantar alltaf). Tekið er á móti vörunum þegar allt sem var pantað hefur borist.",
        m: S(T("Taka saman\ninnkaupalista"), G("or", [["vantar\ntimbur", T("Panta timbur\n(birgir A)")], ["vantar\nfestingar", T("Panta festing-\nar (birgir B)")], ["vantar\nmálningu", T("Panta máln-\ningu (birgir C)")]]), T("Taka á móti\nvörum")) },
      { name: "Gagnaöflun í tjónamáli (svið 1)", st: "Tjónstilkynning\nmóttekin", en: "Bætur\nreiknaðar",
        text: "Tjónið er skráð. Síðan er aflað gagna frá tjónþola og þau yfirfarin. Ef gögnin eru ófullnægjandi er aftur leitað til tjónþola og gögnin yfirfarin á ný, eins oft og þarf. Þegar gögnin eru fullnægjandi eru bætur reiknaðar.",
        m: S(T("Skrá tjón"), L(S(T("Afla gagna"), T("Yfirfara\ngögn")), "ófullnægjandi", "fullnægjandi"), T("Reikna\nbætur")) },
      { name: "Rannsóknir fyrir sérfræðitíma (svið 3)", st: "Tilvísun\nmóttekin", en: "Tími\nbókaður",
        text: "Tilvísunin er metin. Eftir þörfum er tekin blóðprufa, bókuð myndgreining, eða hvort tveggja; alltaf a.m.k. annað. Tími hjá sérfræðingi er bókaður þegar þær rannsóknir sem ákveðnar voru eru búnar.",
        m: S(T("Meta\ntilvísun"), G("or", [["þarf\nblóðprufu", T("Taka\nblóðprufu")], ["þarf mynd-\ngreiningu", T("Bóka mynd-\ngreiningu")]]), T("Bóka tíma hjá\nsérfræðingi")) },
      { name: "Úttekt viðgerðar (svið 8)", st: "Beiðni\nmóttekin", en: "Beiðni\nlokað",
        text: "Verki er úthlutað. Viðgerðin er framkvæmd og tekin út. Ef úttektin er ekki samþykkt er viðgerðin endurtekin og tekin út aftur, þar til hún er samþykkt. Þá er beiðninni lokað.",
        m: S(T("Úthluta\nverki"), L(S(T("Framkvæma\nviðgerð"), T("Taka út\nverk")), "ekki\nsamþykkt", "samþykkt"), T("Loka\nbeiðni")) },
    ],
  ];

  /* ---------- Númerun, útlit og spor ---------- */
  function prep(sc) {
    var tag = 0, gid = 0, gws = [];
    (function walk(n) {
      if (!n) return;
      if (n.t === "task") n.tag = String.fromCharCode(65 + tag++);
      else if (n.t === "seq") n.c.forEach(walk);
      else if (n.t === "gw") { n.sid = ++gid; n.jid = ++gid; gws.push({ id: n.sid, ans: n.g, role: "split", pair: n.jid, g: n.g }); n.br.forEach(function (b) { walk(b.s); }); gws.push({ id: n.jid, ans: n.g, role: "join", pair: n.sid, g: n.g }); }
      else if (n.t === "loop") { n.jid = ++gid; walk(n.body); n.sid = ++gid; gws.push({ id: n.jid, ans: "xor", role: "ljoin", pair: n.sid, g: "xor" }); gws.push({ id: n.sid, ans: "xor", role: "lsplit", pair: n.jid, g: "xor" }); }
    })(sc.m);
    gws.sort(function (a, b) { return a.id - b.id; });
    return gws;
  }
  var TW = 96, TH = 50, GAP = 26, GS = 18, BIN = 78, BOUT = 26, VG = 20;
  function lay(n) {
    if (!n) return { w: 0, h: 22, ya: 11, empty: true, draw: function () {} };
    if (n.t === "task") return { w: TW, h: TH, ya: TH / 2, draw: function (D, x, y, ctx) { D.task(x + TW / 2, y + TH / 2, n.l, { w: TW, h: TH, tag: n.tag, fs: 10 }); } };
    if (n.t === "seq") {
      var ch = n.c.map(lay), w = 0, ya = 0, below = 0;
      ch.forEach(function (c, i) { w += c.w + (i ? GAP : 0); ya = Math.max(ya, c.ya); below = Math.max(below, c.h - c.ya); });
      return { w: w, h: ya + below, ya: ya, draw: function (D, x, y, ctx) {
        var cx = x;
        ch.forEach(function (c, i) { c.draw(D, cx, y + ya - c.ya, ctx); if (i < ch.length - 1) D.seq([[cx + c.w, y + ya], [cx + c.w + GAP, y + ya]]); cx += c.w + GAP; });
      } };
    }
    if (n.t === "gw") {
      var br = n.br.map(function (b) { return lay(b.s); }), k = br.length, off = [], tot = 0, bw = 0;
      br.forEach(function (b, i) { off.push(tot); tot += b.h + (i < k - 1 ? VG : 0); bw = Math.max(bw, b.w); });
      var anc = br.map(function (b, i) { return off[i] + b.ya; });
      var ya2 = k % 2 ? anc[(k - 1) / 2] : (anc[k / 2 - 1] + anc[k / 2]) / 2;
      var pad = Math.max(0, GS + 14 - ya2), h = Math.max(tot + pad, ya2 + pad + GS + 4);
      ya2 += pad;
      var w2 = 2 * GS + BIN + bw + BOUT + 2 * GS;
      return { w: w2, h: h, ya: ya2, draw: function (D, x, y, ctx) {
        var my = y + ya2, sx = x + GS, jx = x + w2 - GS, bx = x + 2 * GS + BIN;
      function blab(lab, ay, mid) { return lab ? { label: lab, lx: mid ? sx + GS + 9 : sx + 5, ly: ay > my + 1 ? ay + 3 : ay - 3, lv: ay > my + 1 ? "top" : "bottom", fs: 9 } : {}; }
        br.forEach(function (b, i) {
          var ay = y + pad + anc[i], mid = Math.abs(ay - my) < 1, lab = n.br[i].c;
          var p1 = mid ? [[sx + GS, my], [bx, ay]] : [[sx, ay < my ? my - GS : my + GS], [sx, ay], [bx, ay]];
          if (b.empty) {
            var pe = mid ? [[sx + GS, my], [jx - GS, my]] : [[sx, ay < my ? my - GS : my + GS], [sx, ay], [jx, ay], [jx, ay < my ? my - GS : my + GS]];
            D.seq(pe, blab(lab, ay, mid));
            return;
          }
          D.seq(p1, blab(lab, ay, mid));
          b.draw(D, bx, y + pad + off[i], ctx);
          var ex = bx + b.w;
          D.seq(mid ? [[ex, ay], [jx - GS, my]] : [[ex, ay], [jx, ay], [jx, ay < my ? my - GS : my + GS]]);
        });
        ctx.gw(D, sx, my, n.sid); ctx.gw(D, jx, my, n.jid);
      } };
    }
    if (n.t === "loop") {
      var b = lay(n.body), ya3 = Math.max(b.ya, GS + 14), top = ya3 - b.ya, h3 = Math.max(b.h + top, ya3 + GS) + 40;
      var w3 = 2 * GS + GAP + b.w + GAP + 2 * GS + 62;
      return { w: w3, h: h3, ya: ya3, draw: function (D, x, y, ctx) {
        var my = y + ya3, jx = x + GS, bx = x + 2 * GS + GAP, sx = bx + b.w + GAP + GS, yb = y + h3 - 12;
        D.seq([[jx + GS, my], [bx, my]]);
        b.draw(D, bx, y + top, ctx);
        D.seq([[bx + b.w, my], [sx - GS, my]]);
        D.raw('<path d="M' + (sx + GS) + " " + my + "H" + (x + w3) + '" style="fill:none;stroke:var(--ink);stroke-width:1.3"/>');
        D.text(sx + GS + 12, my - 4, n.exit, { a: "start", v: "bottom", size: 9, col: "mut" });
        D.seq([[sx, my + GS], [sx, yb], [jx, yb], [jx, my + GS]], { label: n.back, lx: (sx + jx) / 2, ly: yb - 3, la: "middle", fs: 9 });
        ctx.gw(D, jx, my, n.jid); ctx.gw(D, sx, my, n.sid);
      } };
    }
  }
  function render(sc, types, colors, label) {
    var body = lay(sc.m), M = 34, top = 16;
    var W = M + 26 + GAP + body.w + GAP + 26 + M, Hh = top + body.h + 40;
    var D = BP({ w: W, h: Hh, label: label });
    var my = top + Math.max(body.ya, 13);
    D.ev(M + 13, my, "start", { label: sc.st });
    D.seq([[M + 26, my], [M + 26 + GAP, my]]);
    var ctx = { gw: function (D2, x, y, id) {
      var t = types[id], c = colors[id] || "ink";
      D2.gw(x, y, t || "q", { num: id, col: c === "ink" ? "ink" : c, mcol: t ? (c === "ink" ? "mag" : c) : "mut", numcol: c === "ink" ? "mag" : c, sw: c === "ink" ? 1.3 : 2.4 });
    } };
    body.draw(D, M + 26 + GAP, my - body.ya, ctx);
    var ex = M + 26 + GAP + body.w;
    D.seq([[ex, my], [ex + GAP, my]]);
    D.ev(ex + GAP + 13, my, "end", { label: sc.en });
    return D.svg("min-width:" + Math.round(W * 0.82) + "px;width:100%", "w2-svg");
  }
  function inter(a, b) {
    if (!a.length) return [b]; if (!b.length) return [a];
    return inter(a.slice(1), b).map(function (t) { return [a[0]].concat(t); }).concat(inter(a, b.slice(1)).map(function (t) { return [b[0]].concat(t); }));
  }
  function interAll(list) { return list.reduce(function (acc, tr) { var out = []; acc.forEach(function (a) { inter(a, tr).forEach(function (x) { out.push(x); }); }); return out; }, [[]]); }
  function product(sets) { return sets.reduce(function (acc, s) { var out = []; acc.forEach(function (a) { s.forEach(function (b) { out.push(a.concat(b)); }); }); return out; }, [[]]); }
  function traces(n) {
    if (!n) return [[]];
    if (n.t === "task") return [[n.tag]];
    if (n.t === "seq") return product(n.c.map(traces));
    if (n.t === "loop") { var b = traces(n.body); return b.concat(product([b, b])); }
    var bt = n.br.map(function (b) { return traces(b.s); });
    if (n.g === "xor") return [].concat.apply([], bt);
    var subsets = [];
    if (n.g === "and") subsets = [bt];
    else for (var m = 1; m < 1 << bt.length; m++) subsets.push(bt.filter(function (x, i) { return m & (1 << i); }));
    var out = [];
    subsets.forEach(function (sub) { product(sub.map(function (s) { return s.map(function (t) { return [t]; }); })).forEach(function (combo) { interAll(combo.map(function (c) { return c[0]; })).forEach(function (x) { out.push(x); }); }); });
    return out;
  }

  var GN = { xor: "XOR", and: "AND", or: "OR" };
  function why(g, chosen) {
    var role = g.role, a = g.ans;
    if (role === "ljoin") return chosen === "and" ? "AND-samruni í lykkju bíður eftir tóka bæði frá upphafinu og bakflæðinu, sem kemur aldrei samtímis: sjálfhelda. Lykkja byrjar á XOR-samruna." : "Bakflæðið og fyrsta umferðin eru aldrei virk samtímis; XOR-samruni hleypir tókanum í gegn hvaðan sem hann kemur.";
    if (role === "lsplit") return "Hér er valið annaðhvort að endurtaka eða halda áfram, aldrei hvort tveggja: XOR-klofnun.";
    if (role === "split") {
      if (a === "xor") return chosen === "and" ? "AND sendir tóka í allar greinar, en hér á aðeins ein greinin að fara (skilyrðin útiloka hvort annað)." : "OR leyfir fleiri en eina grein, en skilyrðin hér útiloka hvort annað: XOR.";
      if (a === "and") return chosen === "xor" ? "XOR velur eina grein, en hér eru allar greinarnar alltaf framkvæmdar: AND." : "OR á við þegar skilyrði ráða hvaða greinar eru farnar. Hér eru allar alltaf farnar án skilyrða: AND.";
      return chosen === "xor" ? "Fleiri en ein grein getur verið virk í einu („eitt eða fleiri“), svo XOR dugar ekki: OR." : "Ekki eru alltaf allar greinar farnar; það ræðst af skilyrðum: OR.";
    }
    var sp = GN[g.g];
    if (a === "xor") return chosen === "and" ? "Klofnunin er XOR, svo aðeins ein grein fær tóka. AND-samruni myndi bíða eftir hinum: sjálfhelda." : "OR-samruni virkar reyndar hér, en er óþarflega flókinn; samruni á að vera af sömu gerð og klofnunin (" + sp + ").";
    if (a === "and") return chosen === "xor" ? "Klofnunin er AND, svo allar greinar fá tóka. XOR-samruni hleypir hverjum strax í gegn og verkin á eftir keyra oftar en einu sinni (engin samstilling)." : "OR-samruni virkar hér en AND er skýrara: samruni á að vera af sömu gerð og klofnunin.";
    return chosen === "xor" ? "Klofnunin er OR, svo fleiri en ein grein getur verið virk. XOR-samruni myndi láta verkin á eftir keyra oftar en einu sinni." : "Klofnunin er OR og ekki eru alltaf allar greinar virkar. AND-samruni myndi bíða eftir óvirkri grein: sjálfhelda. OR-samruni bíður bara eftir virkum greinum.";
  }
  function roleName(r) { return r === "split" ? "klofnun" : r === "join" ? "samruni" : r === "ljoin" ? "samruni (lykkja)" : "klofnun (lykkja)"; }

  var CSS = [
    ".w2-head{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;margin:0 0 .8rem}",
    ".w2-head .chip.done::after{content:' ✓';color:var(--good)}",
    ".w2-desc{background:var(--key-bg);border-left:3px solid var(--key-line);padding:.6rem .8rem;border-radius:6px;margin:.4rem 0 .8rem}",
    ".w2-svg{display:block;height:auto;background:var(--raised);border:1px solid var(--rule);border-radius:8px}",
    ".w2-gws{display:grid;gap:.4rem;margin:.8rem 0}",
    ".w2-gw{display:flex;flex-wrap:wrap;align-items:center;gap:.35rem;font:500 .9rem var(--sans)}",
    ".w2-gw .lab{min-width:11rem}",
    ".w2-gw .lab b{display:inline-block;min-width:1.4rem;height:1.4rem;line-height:1.4rem;text-align:center;border-radius:50%;background:var(--mag);color:var(--raised);margin-right:.35rem;font-size:.8rem}",
    ".w2-gw .lab.ok b{background:var(--good)}.w2-gw .lab.no b{background:var(--bad)}",
    ".w2-tr{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;padding:.35rem 0;border-bottom:1px solid var(--rule);font:500 .95rem var(--sans)}",
    ".w2-tr code{flex:1;min-width:12rem;font:600 .95rem var(--sans);letter-spacing:.02em}",
    ".w2-tr .mk{min-width:1.2rem;font-weight:700}",
    ".w2-fb{font:400 .88rem/1.45 var(--sans);margin:.2rem 0 .2rem 1.8rem;color:var(--ink)}",
  ].join("");

  register("kafli-2", function (root, api) {
    var app = root.querySelector("#k2-app");
    if (!document.getElementById("w2-css")) { var st = document.createElement("style"); st.id = "w2-css"; st.textContent = CSS; document.head.appendChild(st); }
    var done = [false, false, false, false], lvl = 0;
    app.innerHTML = '<div class="w2-head"></div><div class="w2-body"></div><p class="result" aria-live="polite"></p>';
    var head = app.querySelector(".w2-head"), body = app.querySelector(".w2-body"), res = app.querySelector(".result");
    function setRes(ok, h) { res.className = "result " + (ok ? "ok" : "no"); res.innerHTML = h; }
    function clr() { res.className = "result"; res.innerHTML = ""; }
    function drawHead() {
      head.innerHTML = ["Borð 1: ein hlið", "Borð 2: tvö pör", "Borð 3: OR eða lykkja", "Borð 4: spor"].map(function (t, i) {
        return '<button type="button" class="chip' + (done[i] ? " done" : "") + '" aria-pressed="' + (i === lvl) + '" data-l="' + i + '">' + t + "</button>";
      }).join("");
    }
    head.addEventListener("click", function (e) { var b = e.target.closest("[data-l]"); if (b) { lvl = +b.dataset.l; start(); } });
    function progress() {
      var n = done.filter(Boolean).length;
      drawHead();
      if (n === 4) api.done("Frábært! Þú valdir réttar hliðar í þremur líkönum og flokkaðir spor rétt.");
      else api.status("Þú hefur klárað " + n + " af 4 borðum.");
    }
    var last = [-1, -1, -1, -1];
    function pickSc(pool, k) { var i; do { i = Math.floor(Math.random() * pool.length); } while (pool.length > 1 && i === last[k]); last[k] = i; return JSON.parse(JSON.stringify(pool[i])); }
    function start() { clr(); drawHead(); if (lvl < 3) gate(); else trace(); }

    function gate() {
      var sc = pickSc(SC[lvl], lvl), gws = prep(sc), types = {}, colors = {}, checked = false;
      function draw() {
        body.innerHTML = "<h3 style='margin-top:0'>" + sc.name + "</h3><div class='w2-desc'>" + sc.text + "</div>" +
          "<div class='tablewrap' style='margin:0'>" + render(sc, types, colors, "Ferlalíkan með óþekktum hliðum: " + sc.name) + "</div>" +
          "<div class='w2-gws'>" + gws.map(function (g) {
            var st = colors[g.id] === "good" ? " ok" : colors[g.id] === "bad" ? " no" : "";
            return "<div><div class='w2-gw'><span class='lab" + st + "'><b>" + g.id + "</b>Hlið " + g.id + ": " + roleName(g.role) + "</span>" +
              ["xor", "and", "or"].map(function (t) { return "<button type='button' class='chip' data-g='" + g.id + "' data-t='" + t + "' aria-pressed='" + (types[g.id] === t) + "'>" + GN[t] + "</button>"; }).join("") +
              "</div>" + (checked && colors[g.id] === "bad" ? "<p class='w2-fb'>" + why(g, types[g.id]) + "</p>" : "") + "</div>";
          }).join("") + "</div>" +
          "<div class='row'><button type='button' class='btn' data-a='check'>Athuga</button><button type='button' class='btn ghost' data-a='new'>Ný atburðarás</button></div>";
      }
      body.onclick = function (e) {
        var b = e.target.closest("[data-g]");
        if (b) { types[b.dataset.g] = b.dataset.t; delete colors[b.dataset.g]; checked = false; draw(); return; }
        var a = e.target.closest("[data-a]");
        if (!a) return;
        if (a.dataset.a === "new") { clr(); gate(); return; }
        var missing = gws.filter(function (g) { return !types[g.id]; }).length;
        if (missing) { setRes(false, "Veldu gerð allra hliða fyrst (" + missing + " eftir)."); return; }
        var wrong = 0;
        gws.forEach(function (g) { var ok = types[g.id] === g.ans; colors[g.id] = ok ? "good" : "bad"; if (!ok) wrong++; });
        checked = true; draw();
        if (wrong) setRes(false, wrong + " hlið/hliðar eru rangar (rauðar). Lestu skýringuna undir hverri og reyndu aftur.");
        else {
          setRes(true, "Rétt! Allar hliðar passa við lýsinguna og hver samruni við sína klofnun." + (lvl < 3 ? " Veldu næsta borð." : ""));
          done[lvl] = true; progress();
          if (lvl < 3) { var nb = document.createElement("button"); nb.type = "button"; nb.className = "btn"; nb.textContent = "Næsta borð →"; nb.style.marginTop = ".6rem"; nb.onclick = function () { lvl++; start(); }; res.appendChild(document.createElement("br")); res.appendChild(nb); }
        }
      };
      draw();
    }

    function trace() {
      var pool = SC[0].concat(SC[1], SC[2]).filter(function (s) { return JSON.stringify(s.m).indexOf('"loop"') < 0; });
      var sc = JSON.parse(JSON.stringify(pool[Math.floor(Math.random() * pool.length)]));
      var gws = prep(sc), types = {};
      gws.forEach(function (g) { types[g.id] = g.ans; });
      var valid = traces(sc.m), key = function (t) { return t.join(","); }, vset = {};
      valid.forEach(function (t) { vset[key(t)] = true; });
      var tags = []; (function w(n) { if (!n) return; if (n.t === "task") tags.push(n.tag); else if (n.t === "seq") n.c.forEach(w); else if (n.t === "gw") n.br.forEach(function (b) { w(b.s); }); })(sc.m);
      var items = [], seen = {}, nValid = 2 + Math.floor(Math.random() * 2), guard = 0;
      while (items.filter(function (x) { return x.ok; }).length < Math.min(nValid, valid.length) && guard++ < 200) {
        var t = valid[Math.floor(Math.random() * valid.length)];
        if (!seen[key(t)]) { seen[key(t)] = 1; items.push({ t: t, ok: true }); }
      }
      guard = 0;
      while (items.length < 5 && guard++ < 500) {
        var base = valid[Math.floor(Math.random() * valid.length)].slice(), kind = Math.floor(Math.random() * 3), why2 = "";
        if (kind === 0 && base.length > 1) { var i = Math.floor(Math.random() * (base.length - 1)), x = base[i]; base[i] = base[i + 1]; base[i + 1] = x; why2 = base[i + 1] + " á að koma á undan " + base[i] + " (raðflæðið ræður röðinni)."; }
        else if (kind === 1 && base.length > 1) { var j = Math.floor(Math.random() * base.length), rm = base.splice(j, 1)[0]; why2 = "Verkið " + rm + " vantar: það verður að keyra í þessari leið."; }
        else { var add = tags[Math.floor(Math.random() * tags.length)], p = Math.floor(Math.random() * (base.length + 1)); base.splice(p, 0, add); why2 = base.filter(function (q) { return q === add; }).length > 1 ? "Verkið " + add + " kemur tvisvar fyrir en getur bara keyrt einu sinni." : "Verkið " + add + " á ekki heima í þessu spori: það er í grein sem útilokast af öðru verki sem er í sporinu (XOR), eða á röngum stað."; }
        if (!vset[key(base)] && !seen[key(base)]) { seen[key(base)] = 1; items.push({ t: base, ok: false, why: why2 }); }
      }
      items.sort(function () { return Math.random() - 0.5; });
      var ans = {};
      function draw(show) {
        body.innerHTML = "<h3 style='margin-top:0'>Gild spor? " + sc.name + "</h3><p>Hér eru allar hliðar þekktar. Merktu hvert spor sem <b>gilt</b> (líkanið leyfir nákvæmlega þessa röð verka frá upphafi til enda) eða <b>ógilt</b>.</p>" +
          "<div class='tablewrap' style='margin:0'>" + render(sc, types, {}, "Ferlalíkan: " + sc.name) + "</div>" +
          "<div style='margin:.8rem 0'>" + items.map(function (it, i) {
            var mark = show ? (ans[i] === (it.ok ? "y" : "n") ? "<span class='mk' style='color:var(--good)'>✓</span>" : "<span class='mk' style='color:var(--bad)'>✗</span>") : "<span class='mk'></span>";
            return "<div class='w2-tr'>" + mark + "<code>⟨" + it.t.join(", ") + "⟩</code>" +
              "<button type='button' class='chip' data-i='" + i + "' data-v='y' aria-pressed='" + (ans[i] === "y") + "'>Gilt</button>" +
              "<button type='button' class='chip' data-i='" + i + "' data-v='n' aria-pressed='" + (ans[i] === "n") + "'>Ógilt</button></div>" +
              (show && ans[i] !== (it.ok ? "y" : "n") ? "<p class='w2-fb'>" + (it.ok ? "Þetta spor er gilt: hver XOR-hlið velur eina grein, hver AND-grein er öll með og röðin innan hverrar greinar heldur sér." : it.why) + "</p>" : "");
          }).join("") + "</div>" +
          "<div class='row'><button type='button' class='btn' data-a='check'>Athuga</button><button type='button' class='btn ghost' data-a='new'>Ný spor</button></div>";
      }
      body.onclick = function (e) {
        var b = e.target.closest("[data-i]");
        if (b) { ans[b.dataset.i] = b.dataset.v; draw(false); return; }
        var a = e.target.closest("[data-a]");
        if (!a) return;
        if (a.dataset.a === "new") { clr(); trace(); return; }
        if (Object.keys(ans).length < items.length) { setRes(false, "Merktu öll fimm sporin fyrst."); return; }
        var wrong = items.filter(function (it, i) { return ans[i] !== (it.ok ? "y" : "n"); }).length;
        draw(true);
        if (wrong) setRes(false, wrong + " rangt metin. Skoðaðu skýringarnar, eða fáðu ný spor og reyndu aftur.");
        else { setRes(true, "Allt rétt! Líkanið leyfir alls " + valid.length + " mismunandi spor."); done[3] = true; progress(); }
      };
      draw(false);
    }

    start();
    api.status("Þú hefur klárað 0 af 4 borðum.");
  });
})();

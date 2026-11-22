/* core.js – kjarni eðlisfræðivefsins: skráning kafla, slembitölur, framsetning talna,
   yfirferð svara, jöfnuspurningar og framvinda í localStorage. Virkar líka í node (tools/check.js). */
(function (root) {
  "use strict";
  var E = root.EDL = root.EDL || {};
  E.chapters = [];
  E.exam = [];
  E.chapter = function (c) { E.chapters.push(c); };
  E.examProblem = function (p) { E.exam.push(p); };
  E.PASS = 6;          // einkunn sem þarf í kaflaprófi
  E.FINAL_PASS = 5;    // einkunn sem þarf í lokaprófi
  E.PRACTICE = 4;      // fjöldi æfingadæma sem þarf að leysa í hverjum kafla
  E.MASTER = 2;        // rétt svör sem þarf til að jafna teljist lærð
  E.TOL = 0.02;        // leyfilegt hlutfallslegt frávik í tölusvari
  E.g = 9.8;

  /* ---------- Slembitölur ---------- */
  var R = E.R = {
    num: function (a, b, step) {
      step = step || 1;
      var n = Math.round((b - a) / step);
      return +(a + step * Math.floor(Math.random() * (n + 1))).toFixed(10);
    },
    pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }
  };

  /* ---------- Tölur í TeX ---------- */
  // n(x, p): tala með p markverðum stöfum (sjálfgefið 3), aftastu núll felld brott, kommu sem tugabrotsmerki.
  E.n = function (x, p) {
    p = p || 3;
    if (!isFinite(x)) return "?";
    if (x === 0) return "0";
    var ax = Math.abs(x), s;
    if (ax >= 1e5 || ax < 1e-3) {
      var e = Math.floor(Math.log10(ax));
      var m = Number((x / Math.pow(10, e)).toPrecision(p));
      if (Math.abs(m) >= 10) { m = Number((m / 10).toPrecision(p)); e += 1; }
      s = String(m) + "\\times 10^{" + e + "}";
    } else {
      s = String(Number(x.toPrecision(p)));
    }
    return s.replace(".", "{,}");
  };
  // u(unit): eining í TeX
  E.u = function (unit) {
    if (!unit) return "";
    if (unit === "°") return "^{\\circ}";
    if (unit === "%") return "\\,\\%";
    if (/[^\x00-\x7f·]/.test(unit)) return "\\,\\text{" + unit + "}";
    return "\\,\\mathrm{" + unit.replace(/·/g, "\\cdot ") + "}";
  };
  // q(x, unit, p): stærð með einingu sem $...$
  E.q = function (x, unit, p) { return "$" + E.n(x, p) + E.u(unit) + "$"; };
  // t(x, unit, p): sama og q en án $ (til notkunar inni í TeX)
  E.t = function (x, unit, p) { return E.n(x, p) + E.u(unit); };
  E.rad = function (deg) { return deg * Math.PI / 180; };
  E.deg = function (rad) { return rad * 180 / Math.PI; };

  /* ---------- Yfirferð svara ---------- */
  E.parse = function (s) {
    s = String(s == null ? "" : s).trim().replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/,/g, ".").replace(/[{}]/g, "");
    s = s.replace(/(\*|x|×|·)10\^/i, "e").replace(/^10\^/, "1e");
    if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return NaN;
    return parseFloat(s);
  };
  E.close = function (v, ans, tol) {
    tol = tol == null ? E.TOL : tol;
    if (!isFinite(v)) return false;
    return Math.abs(v - ans) <= tol * Math.abs(ans) + 1e-12;
  };

  /* ---------- Stærðfræði í texta ---------- */
  E.math = function (s) {
    var K = root.katex;
    if (!K) return s;
    return String(s)
      .replace(/\$\$([\s\S]+?)\$\$/g, function (m, t) { return K.renderToString(t, { displayMode: true, throwOnError: false }); })
      .replace(/\$([^$]+?)\$/g, function (m, t) { return K.renderToString(t, { throwOnError: false }); });
  };

  E.byId = function (id) {
    for (var i = 0; i < E.chapters.length; i++) if (E.chapters[i].id === id) return E.chapters[i];
    return null;
  };
  E.eqById = function (ch, id) {
    for (var i = 0; i < ch.eqs.length; i++) if (ch.eqs[i].id === id) return ch.eqs[i];
    return null;
  };

  /* ---------- Jöfnuspurningar ----------
     A: hvaða jafna lýsir tilteknu lögmáli, B: hvað táknar tákn, D: fylltu í eyðuna. */
  function otherEqs(ch, eq) {
    var pool = ch.eqs.filter(function (e) { return e !== eq; });
    if (pool.length < 3) {
      E.chapters.forEach(function (c) { if (c !== ch) pool = pool.concat(c.eqs); });
    }
    return pool;
  }
  E.eqTypes = function (ch, eq) {
    var t = ["A"];
    if (eq.vars && eq.vars.length && varPool(ch, eq).length >= 3) t.push("B");
    if (eq.fill) t.push("D");
    return t;
  };
  function varPool(ch, eq) {
    var seen = {}, out = [];
    eq.vars.forEach(function (v) { seen[v[1]] = 1; });
    ch.eqs.forEach(function (e) {
      (e.vars || []).forEach(function (v) { if (!seen[v[1]]) { seen[v[1]] = 1; out.push(v[1]); } });
    });
    return out;
  }
  function mc(prompt, right, wrong, isTex) {
    var opts = R.shuffle([right].concat(R.shuffle(wrong).slice(0, 3)));
    return {
      kind: "mc", prompt: prompt, isTex: !!isTex,
      options: opts.map(function (o) { return isTex ? "$\\displaystyle " + o + "$" : o; }),
      answer: opts.indexOf(right)
    };
  }
  E.eqQuestion = function (ch, eq, type) {
    type = type || R.pick(E.eqTypes(ch, eq));
    var q;
    if (type === "B") {
      var v = R.pick(eq.vars);
      q = mc("Hvað táknar $" + v[0] + "$ í jöfnunni $\\displaystyle " + eq.tex + "$?", v[1], varPool(ch, eq), false);
    } else if (type === "D") {
      q = mc("Fylltu í eyðuna: $\\displaystyle " + eq.fill.tex.replace("□", "\\boxed{\\;?\\;}") + "$",
        eq.fill.ans, eq.fill.wrong, true);
    } else {
      var wrong = R.shuffle(otherEqs(ch, eq)).map(function (e) { return e.tex; })
        .filter(function (t, i, a) { return t !== eq.tex && a.indexOf(t) === i; });
      q = mc("Hvaða jafna á við? <b>" + eq.name + "</b>. " + eq.about, eq.tex, wrong, true);
    }
    q.type = type; q.eq = eq.id;
    return q;
  };

  /* ---------- Framvinda ---------- */
  var KEY = "edl102g-ferd-v1";
  var mem = null;
  function blank() { return { ch: {}, final: { best: null, passed: false }, open: false }; }
  E.load = function () {
    if (mem) return mem;
    try { mem = JSON.parse(root.localStorage.getItem(KEY)) || blank(); } catch (e) { mem = blank(); }
    if (!mem.ch) mem = blank();
    return mem;
  };
  E.save = function () { try { root.localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {} };
  E.reset = function () { mem = blank(); E.save(); };
  E.cs = function (id) {
    var s = E.load();
    if (!s.ch[id]) s.ch[id] = { solved: {}, eq: {}, best: null, passed: false };
    return s.ch[id];
  };
  E.practiceCount = function (ch) {
    var s = E.cs(ch.id), n = 0;
    ch.problems.forEach(function (p) { if (s.solved[p.id]) n++; });
    return n;
  };
  E.practiceNeed = function (ch) { return Math.min(E.PRACTICE, ch.problems.length); };
  E.practiceDone = function (ch) { return E.practiceCount(ch) >= E.practiceNeed(ch); };
  E.eqLearned = function (ch) {
    var s = E.cs(ch.id), n = 0;
    ch.eqs.forEach(function (e) { if ((s.eq[e.id] || 0) >= E.MASTER) n++; });
    return n;
  };
  E.eqDone = function (ch) { return E.eqLearned(ch) >= ch.eqs.length; };
  E.chOpen = function (i) {
    var s = E.load();
    if (s.open || i === 0) return true;
    return E.cs(E.chapters[i - 1].id).passed;
  };
  E.stepOpen = function (ch, step) {
    var s = E.load();
    if (s.open) return true;
    if (step === "aefa") return true;
    if (step === "jofnur") return E.practiceDone(ch);
    if (step === "prof") return E.practiceDone(ch) && E.eqDone(ch);
    return false;
  };
  E.finalOpen = function () {
    var s = E.load();
    return s.open || E.chapters.every(function (c) { return E.cs(c.id).passed; });
  };
  E.grade = function (right, total) { return total ? Math.round(20 * right / total) / 2 : 0; };
})(typeof window !== "undefined" ? window : globalThis);

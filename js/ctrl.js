/* ctrl.js – litla stýritækni-safnið á síðunni.
 * Tvinntölur, formúluþáttari fyrir yfirfærsluföll, spönn (fasaöryggi o.fl.),
 * þrepasvörun (Talbot) og einfaldar teikningar á canvas. Engin utanaðkomandi söfn. */
(function (root) {
  "use strict";

  /* ---------- Tvinntölur ---------- */
  const C = {
    n: (re, im) => ({ re: re, im: im || 0 }),
    add: (a, b) => ({ re: a.re + b.re, im: a.im + b.im }),
    sub: (a, b) => ({ re: a.re - b.re, im: a.im - b.im }),
    mul: (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }),
    div: (a, b) => {
      const d = b.re * b.re + b.im * b.im;
      return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
    },
    abs: (a) => Math.hypot(a.re, a.im),
    arg: (a) => Math.atan2(a.im, a.re),
    exp: (a) => {
      const m = Math.exp(a.re);
      return { re: m * Math.cos(a.im), im: m * Math.sin(a.im) };
    },
    ipow: (a, n) => {
      let r = { re: 1, im: 0 };
      const neg = n < 0;
      let k = Math.abs(n);
      let b = a;
      while (k > 0) {
        if (k & 1) r = C.mul(r, b);
        b = C.mul(b, b);
        k >>= 1;
      }
      return neg ? C.div({ re: 1, im: 0 }, r) : r;
    },
  };

  /* ---------- Formúluþáttari ---------- */
  // Styður: tölur (komma eða punktur), s, breytur (K, TI, ...), + - * / ^, sviga,
  // óbeina margföldun (2s, 3(1+s), (s+1)(s+2)) og exp(...).
  function tokenize(src) {
    const out = [];
    const s = src.replace(/,/g, ".").replace(/\s+/g, " ");
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (ch === " ") { i++; continue; }
      if (/[0-9.]/.test(ch)) {
        let j = i;
        while (j < s.length && /[0-9.]/.test(s[j])) j++;
        out.push({ t: "num", v: parseFloat(s.slice(i, j)) });
        i = j;
      } else if (/[A-Za-z_]/.test(ch)) {
        let j = i;
        while (j < s.length && /[A-Za-z_0-9]/.test(s[j])) j++;
        out.push({ t: "id", v: s.slice(i, j) });
        i = j;
      } else if ("+-*/^()".indexOf(ch) >= 0) {
        out.push({ t: ch });
        i++;
      } else {
        throw new Error("Óleyfilegt tákn: " + ch);
      }
    }
    return out;
  }

  function parse(src) {
    const toks = tokenize(src);
    let p = 0;
    const peek = () => toks[p];
    const eat = (t) => {
      if (!toks[p] || toks[p].t !== t) throw new Error("Vantar " + t);
      return toks[p++];
    };
    function expr() {
      let n = term();
      while (peek() && (peek().t === "+" || peek().t === "-")) {
        const op = toks[p++].t;
        const r = term();
        n = { k: op, a: n, b: r };
      }
      return n;
    }
    function startsFactor() {
      const t = peek();
      return t && (t.t === "num" || t.t === "id" || t.t === "(");
    }
    function term() {
      let n = unary();
      for (;;) {
        const t = peek();
        if (t && (t.t === "*" || t.t === "/")) {
          p++;
          n = { k: t.t, a: n, b: unary() };
        } else if (startsFactor()) {
          n = { k: "*", a: n, b: unary() };
        } else break;
      }
      return n;
    }
    function unary() {
      const t = peek();
      if (t && t.t === "-") { p++; return { k: "neg", a: unary() }; }
      if (t && t.t === "+") { p++; return unary(); }
      return power();
    }
    function power() {
      const base = atom();
      if (peek() && peek().t === "^") {
        p++;
        const e = unary();
        return { k: "^", a: base, b: e };
      }
      return base;
    }
    function atom() {
      const t = peek();
      if (!t) throw new Error("Óvænt endir á formúlu");
      if (t.t === "num") { p++; return { k: "num", v: t.v }; }
      if (t.t === "(") {
        p++;
        const n = expr();
        eat(")");
        return n;
      }
      if (t.t === "id") {
        p++;
        if (t.v === "exp" && peek() && peek().t === "(") {
          p++;
          const n = expr();
          eat(")");
          return { k: "exp", a: n };
        }
        return { k: "var", v: t.v };
      }
      throw new Error("Óvænt tákn: " + t.t);
    }
    const ast = expr();
    if (p < toks.length) throw new Error("Óvænt tákn í enda formúlu");
    return ast;
  }

  function evalAst(n, s, vars) {
    switch (n.k) {
      case "num": return { re: n.v, im: 0 };
      case "var":
        if (n.v === "s") return s;
        if (n.v === "pi") return { re: Math.PI, im: 0 };
        if (Object.prototype.hasOwnProperty.call(vars, n.v)) return { re: vars[n.v], im: 0 };
        throw new Error("Óþekkt breyta: " + n.v);
      case "+": return C.add(evalAst(n.a, s, vars), evalAst(n.b, s, vars));
      case "-": return C.sub(evalAst(n.a, s, vars), evalAst(n.b, s, vars));
      case "*": return C.mul(evalAst(n.a, s, vars), evalAst(n.b, s, vars));
      case "/": return C.div(evalAst(n.a, s, vars), evalAst(n.b, s, vars));
      case "neg": { const v = evalAst(n.a, s, vars); return { re: -v.re, im: -v.im }; }
      case "exp": return C.exp(evalAst(n.a, s, vars));
      case "^": {
        const e = evalAst(n.b, s, vars);
        if (Math.abs(e.im) > 1e-12 || Math.abs(e.re - Math.round(e.re)) > 1e-12)
          throw new Error("Veldisvísir verður að vera heil tala");
        return C.ipow(evalAst(n.a, s, vars), Math.round(e.re));
      }
    }
    throw new Error("Villa í formúlu");
  }

  /** Býr til fall F(s) úr texta, t.d. "2.5/((1+2s)(1+0.5s))". vars: {K:3}. */
  function tfFrom(src, vars) {
    const ast = parse(src);
    vars = vars || {};
    const f = (s) => evalAst(ast, s, vars);
    f.at = (w) => f({ re: 0, im: w });
    return f;
  }

  /* ---------- Tíðnigreining ---------- */
  const deg = (r) => (r * 180) / Math.PI;
  const dB = (m) => 20 * Math.log10(m);

  function logspace(lo, hi, n) {
    const a = Math.log10(lo), b = Math.log10(hi);
    const out = new Array(n);
    for (let i = 0; i < n; i++) out[i] = Math.pow(10, a + ((b - a) * i) / (n - 1));
    return out;
  }

  /** Teiknar upp Bode-gögn fyrir G(jw) (G: w -> tvinntala). */
  function bodeData(G, lo, hi, n) {
    const ws = logspace(lo, hi, n);
    const mag = [], ph = [];
    let prev = null;
    for (let i = 0; i < n; i++) {
      const g = G(ws[i]);
      let a = C.arg(g);
      if (prev === null) {
        if (a > 0.05) a -= 2 * Math.PI;
      } else {
        while (a - prev > Math.PI) a -= 2 * Math.PI;
        while (a - prev < -Math.PI) a += 2 * Math.PI;
      }
      prev = a;
      mag.push(C.abs(g));
      ph.push(a);
    }
    return { w: ws, mag: mag, ph: ph };
  }

  function bisect(f, a, b) {
    let fa = f(a);
    for (let i = 0; i < 80; i++) {
      const m = 0.5 * (a + b);
      const fm = f(m);
      if ((fa <= 0) === (fm <= 0)) { a = m; fa = fm; } else b = m;
    }
    return 0.5 * (a + b);
  }

  /** Stöðugleikamörk fyrir lykkjufall GK(w). Skilar wc, pm (gráður), wpi, Am. */
  function margins(GK, lo, hi) {
    lo = lo || 1e-4;
    hi = hi || 1e3;
    const n = 14000;
    const d = bodeData(GK, lo, hi, n);
    const res = { wc: null, pm: null, wpi: null, Am: null, stable: null };
    let ic = -1, ip = -1;
    for (let i = 0; i < n - 1; i++) {
      if (ic < 0 && d.mag[i] >= 1 && d.mag[i + 1] < 1) ic = i;
      if (ip < 0 && d.ph[i] > -Math.PI && d.ph[i + 1] <= -Math.PI) ip = i;
      if (ic >= 0 && ip >= 0) break;
      if (d.mag[i] < 1e-6 && i > 0) break;
    }
    const phaseAt = (w) => {
      // fasi með samfelldri útleiðslu: finnum bil og nálgum línulega í lg(w)
      let k = 0;
      while (k < n - 2 && d.w[k + 1] < w) k++;
      const t = (Math.log(w) - Math.log(d.w[k])) / (Math.log(d.w[k + 1]) - Math.log(d.w[k]));
      return d.ph[k] + t * (d.ph[k + 1] - d.ph[k]);
    };
    if (ic >= 0) {
      res.wc = bisect((w) => C.abs(GK(w)) - 1 > 0 ? -1 : 1, d.w[ic], d.w[ic + 1]);
      // bisect gefur þann stað þar sem formerkið breytist
      res.pm = deg(Math.PI + phaseAt(res.wc));
    }
    if (ip >= 0) {
      res.wpi = bisect((w) => (phaseAt(w) + Math.PI > 0 ? -1 : 1), d.w[ip], d.w[ip + 1]);
      res.Am = 1 / C.abs(GK(res.wpi));
    }
    if (res.wpi !== null && res.Am <= 1) res.stable = false;
    else if (res.pm !== null && res.pm <= 0) res.stable = false;
    else res.stable = true;
    res.data = d;
    return res;
  }

  /** Stefnumunur á lograskala við lága tíðni -> tegund kerfis (N). */
  function systemType(GK) {
    const w1 = 1e-6, w2 = 1e-5;
    const a = C.abs(GK(w1)), b = C.abs(GK(w2));
    const slope = Math.log10(a / b) / Math.log10(w2 / w1);
    return Math.max(0, Math.round(slope - 1e-9));
  }

  /** Fasti (Kp, Kv eða Ka) fyrir tegund N: lim s^N GK(s). */
  function errorConstant(GK, N) {
    const w = 1e-7;
    return C.abs(GK(w)) * Math.pow(w, N);
  }

  /* ---------- Þrepasvörun (Talbot) ---------- */
  function talbot(F, t, M) {
    M = M || 24;
    if (t <= 0) return 0;
    const r = (2 * M) / (5 * t);
    let sum = 0.5 * F({ re: r, im: 0 }).re * Math.exp(r * t);
    for (let k = 1; k < M; k++) {
      const th = (k * Math.PI) / M;
      const cot = 1 / Math.tan(th);
      const s = { re: r * th * cot, im: r * th };
      const sig = th + (th * cot - 1) * cot;
      const e = C.exp({ re: s.re * t, im: s.im * t });
      const term = C.mul(C.mul(e, F(s)), { re: 1, im: sig });
      sum += term.re;
    }
    return (r / M) * sum;
  }

  /**
   * Þrepasvörun stöðugs kerfis T(s) á tímunum ts, með Fourier-heildun á j-ásnum:
   *   y(t) = (2/pi) * Int_0^inf Re T(jw) * sin(wt)/w dw
   * (trapisuaðferð með Fejér-glugga). Virkar líka fyrir kerfi með seinkun og lítið deyfðar sveiflur,
   * en aðeins fyrir stöðug kerfi. wref: dæmigerð tíðni kerfisins (t.d. skurðtíðni), notuð til að velja efri mörk.
   */
  function stepResponse(T, ts, wref) {
    const tmax = Math.max.apply(null, ts);
    wref = wref > 0 ? wref : 5;
    const dw = 0.2 / tmax;
    const nmax = 300000; // takmark á reikniálag (hæg kerfi með langan tíma)
    const n = Math.min(nmax, Math.ceil(Math.min(6000, Math.max(300, 150 * wref)) / dw));
    const W = n * dw;
    const coef = new Float64Array(n + 1);
    let re0 = 0;
    for (let k = 0; k <= n; k++) {
      const v = T({ re: 0, im: k === 0 ? 1e-9 : k * dw }).re * (1 - (k * dw) / W);
      if (k === 0) re0 = 0.5 * v;
      else coef[k] = v / (k * dw);
    }
    return ts.map((t) => {
      // sin(k*dw*t) með hrökkunarformúlu (ódýrara en n köll á Math.sin)
      const d = dw * t, cd = Math.cos(d), sd = Math.sin(d);
      let sn = 0, cs = 1, sum = re0 * t;
      for (let k = 1; k <= n; k++) {
        const sn1 = sn * cd + cs * sd;
        cs = cs * cd - sn * sd;
        sn = sn1;
        sum += coef[k] * sn;
      }
      return (2 / Math.PI) * dw * sum;
    });
  }

  /* ---------- Teikning ---------- */
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function setupCanvas(cv, aspect) {
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth || 600;
    const h = Math.round(w * aspect);
    cv.style.height = h + "px";
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { g: g, w: w, h: h };
  }

  function niceTicks(lo, hi, target) {
    const span = hi - lo;
    const raw = span / target;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
    const out = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(Math.abs(v) < 1e-12 ? 0 : v);
    return out;
  }

  function fmtNum(v) {
    if (v === 0) return "0";
    const a = Math.abs(v);
    if (a >= 1000 || a < 0.01) return v.toExponential(0).replace("e+", "e");
    return String(+v.toPrecision(3));
  }

  /** Bode-rit: tveir hlutar (mögnun dB, fasi °). opts: {lo, hi, wc, wpi, aspect} */
  function drawBode(cv, d, opts) {
    opts = opts || {};
    const ink = cssVar("--ink"), muted = cssVar("--muted"), rule = cssVar("--rule");
    const cMag = cssVar("--mag"), cPh = cssVar("--phase"), mark = cssVar("--mark"), bad = cssVar("--bad");
    const { g, w, h } = setupCanvas(cv, opts.aspect || 0.78);
    g.clearRect(0, 0, w, h);
    g.font = "12px Archivo, system-ui, sans-serif";
    const L = 46, R = 12, T = 12, B = 46, gap = 22;
    const ph1 = (h - T - B - gap) * 0.52;
    const ph2 = h - T - B - gap - ph1;
    const lo = Math.log10(opts.lo || d.w[0]), hi = Math.log10(opts.hi || d.w[d.w.length - 1]);
    const X = (wv) => L + ((Math.log10(wv) - lo) / (hi - lo)) * (w - L - R);

    const magdB = d.mag.map(dB);
    let mLo = Math.max(-80, Math.min(-20, Math.floor(Math.min.apply(null, magdB) / 20) * 20));
    let mHi = Math.min(80, Math.max(20, Math.ceil(Math.max.apply(null, magdB) / 20) * 20));
    const phDeg = d.ph.map(deg);
    let pLo = Math.min(-180, Math.floor(Math.min.apply(null, phDeg) / 90) * 90);
    let pHi = Math.max(0, Math.ceil(Math.max.apply(null, phDeg) / 90) * 90);
    if (pLo < -540) pLo = -540;
    const Ym = (v) => T + ph1 - ((Math.max(mLo, Math.min(mHi, v)) - mLo) / (mHi - mLo)) * ph1;
    const Yp = (v) => T + ph1 + gap + ph2 - ((Math.max(pLo, Math.min(pHi, v)) - pLo) / (pHi - pLo)) * ph2;

    function frame(y0, hh, ticks, Y, unit, zeroLine) {
      g.strokeStyle = rule; g.lineWidth = 1; g.fillStyle = muted; g.textAlign = "right"; g.textBaseline = "middle";
      ticks.forEach((tv) => {
        const y = Y(tv);
        g.beginPath(); g.moveTo(L, y); g.lineTo(w - R, y); g.stroke();
        g.fillText(fmtNum(tv), L - 6, y);
      });
      for (let e = Math.ceil(lo); e <= Math.floor(hi); e++) {
        for (let m = 1; m < 10; m++) {
          const v = m * Math.pow(10, e);
          const x = X(v);
          if (x < L || x > w - R) continue;
          g.strokeStyle = rule; g.globalAlpha = m === 1 ? 1 : 0.35;
          g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y0 + hh); g.stroke();
          g.globalAlpha = 1;
        }
      }
      g.strokeStyle = ink; g.lineWidth = 1;
      g.strokeRect(L, y0, w - L - R, hh);
      g.save(); g.translate(12, y0 + hh / 2); g.rotate(-Math.PI / 2); g.fillStyle = muted; g.textAlign = "center"; g.fillText(unit, 0, 0); g.restore();
      if (zeroLine !== undefined) {
        g.strokeStyle = ink; g.lineWidth = 1.4; g.setLineDash([5, 4]);
        const y = Y(zeroLine);
        g.beginPath(); g.moveTo(L, y); g.lineTo(w - R, y); g.stroke(); g.setLineDash([]);
      }
    }
    frame(T, ph1, niceTicks(mLo, mHi, 5), Ym, "mögnun [dB]", 0);
    frame(T + ph1 + gap, ph2, niceTicks(pLo, pHi, 5), Yp, "fasi [°]", -180);

    g.fillStyle = muted; g.textAlign = "center"; g.textBaseline = "top";
    const sup = (e) => String(e).replace(/-/g, "⁻").replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
    for (let e = Math.ceil(lo); e <= Math.floor(hi); e++) g.fillText("10" + sup(e), X(Math.pow(10, e)), T + ph1 + gap + ph2 + 6);
    g.textAlign = "right"; g.fillText("ω [rad/s]", w - R, T + ph1 + gap + ph2 + 24);

    function line(arr, Y, col) {
      g.strokeStyle = col; g.lineWidth = 2.4; g.lineJoin = "round";
      g.beginPath();
      let started = false;
      for (let i = 0; i < d.w.length; i++) {
        const x = X(d.w[i]);
        if (x < L - 1 || x > w - R + 1) continue;
        const y = Y(arr[i]);
        if (!started) { g.moveTo(x, y); started = true; } else g.lineTo(x, y);
      }
      g.stroke();
    }
    g.save();
    g.beginPath(); g.rect(L, T, w - L - R, h - T - B); g.clip();
    line(magdB, Ym, cMag);
    line(phDeg, Yp, cPh);
    g.restore();

    if (opts.wc) {
      const x = X(opts.wc);
      g.strokeStyle = ink; g.lineWidth = 1.4; g.setLineDash([2, 3]);
      g.beginPath(); g.moveTo(x, T); g.lineTo(x, T + ph1 + gap + ph2); g.stroke(); g.setLineDash([]);
      g.fillStyle = ink; g.textAlign = x > w - 40 ? "right" : "left"; g.textBaseline = "top";
      g.fillText("ωc", x + (x > w - 40 ? -4 : 4), T + 3);
      if (opts.pm !== undefined && opts.pm !== null) {
        const y1 = Yp(-180), y2 = Yp(opts.pm - 180);
        g.strokeStyle = bad; g.lineWidth = 3;
        g.beginPath(); g.moveTo(x, y1); g.lineTo(x, y2); g.stroke();
        g.fillStyle = ink; g.textAlign = "left";
        g.fillText("φm = " + opts.pm.toFixed(0) + "°", x + 6, Math.min(y1, y2) + 2 + (opts.pm > 0 ? 0 : 0));
      }
    }
    if (opts.wpi) {
      const x = X(opts.wpi);
      g.strokeStyle = muted; g.lineWidth = 1.2; g.setLineDash([2, 3]);
      g.beginPath(); g.moveTo(x, T); g.lineTo(x, T + ph1 + gap + ph2); g.stroke(); g.setLineDash([]);
      g.fillStyle = muted; g.textAlign = "left"; g.textBaseline = "top";
      g.fillText("ωπ", x + 4, T + ph1 - 16);
    }
  }

  /** Lína á línuriti (t.d. þrepasvörun). series: [{x:[], y:[], color, dash}] */
  function drawLines(cv, series, opts) {
    opts = opts || {};
    const ink = cssVar("--ink"), muted = cssVar("--muted"), rule = cssVar("--rule");
    const { g, w, h } = setupCanvas(cv, opts.aspect || 0.5);
    g.clearRect(0, 0, w, h);
    g.font = "12px Archivo, system-ui, sans-serif";
    const L = 46, R = 12, T = 12, B = 30;
    let xs = [], ys = [];
    series.forEach((s) => { xs = xs.concat(s.x); ys = ys.concat(s.y.filter(isFinite)); });
    const x0 = opts.xmin !== undefined ? opts.xmin : Math.min.apply(null, xs);
    const x1 = opts.xmax !== undefined ? opts.xmax : Math.max.apply(null, xs);
    let y0 = opts.ymin !== undefined ? opts.ymin : Math.min.apply(null, ys);
    let y1 = opts.ymax !== undefined ? opts.ymax : Math.max.apply(null, ys);
    if (y1 - y0 < 1e-9) { y1 += 1; y0 -= 1; }
    const padY = opts.ymax === undefined ? (y1 - y0) * 0.08 : 0;
    y1 += padY; if (opts.ymin === undefined) y0 -= padY;
    const X = (v) => L + ((v - x0) / (x1 - x0)) * (w - L - R);
    const Y = (v) => T + (1 - (v - y0) / (y1 - y0)) * (h - T - B);
    g.strokeStyle = rule; g.fillStyle = muted; g.lineWidth = 1; g.textBaseline = "middle"; g.textAlign = "right";
    niceTicks(y0, y1, 5).forEach((v) => {
      g.beginPath(); g.moveTo(L, Y(v)); g.lineTo(w - R, Y(v)); g.stroke(); g.fillText(fmtNum(v), L - 6, Y(v));
    });
    g.textAlign = "center"; g.textBaseline = "top";
    niceTicks(x0, x1, 6).forEach((v) => {
      g.beginPath(); g.moveTo(X(v), T); g.lineTo(X(v), h - B); g.stroke(); g.fillText(fmtNum(v), X(v), h - B + 6);
    });
    g.strokeStyle = ink; g.strokeRect(L, T, w - L - R, h - T - B);
    if (opts.xlabel) { g.textAlign = "right"; g.fillStyle = muted; g.fillText(opts.xlabel, w - R, h - 16); }
    (opts.hlines || []).forEach((v) => {
      g.strokeStyle = ink; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(L, Y(v)); g.lineTo(w - R, Y(v)); g.stroke(); g.setLineDash([]);
    });
    g.save(); g.beginPath(); g.rect(L, T, w - L - R, h - T - B); g.clip();
    series.forEach((s) => {
      g.strokeStyle = s.color || cssVar("--mag"); g.lineWidth = 2.4; g.lineJoin = "round";
      g.setLineDash(s.dash || []);
      g.beginPath();
      let st = false;
      for (let i = 0; i < s.x.length; i++) {
        if (!isFinite(s.y[i])) continue;
        if (!st) { g.moveTo(X(s.x[i]), Y(s.y[i])); st = true; } else g.lineTo(X(s.x[i]), Y(s.y[i]));
      }
      g.stroke(); g.setLineDash([]);
    });
    g.restore();
  }

  /** Kallar á fall þegar canvas breytir stærð eða þema breytist. */
  function onRedraw(el, fn) {
    let raf = 0;
    const go = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fn); };
    if (window.ResizeObserver) new ResizeObserver(go).observe(el);
    window.addEventListener("themechange", go);
    if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", go);
    go();
  }

  root.Ctrl = {
    C: C, parse: parse, tfFrom: tfFrom, bodeData: bodeData, margins: margins,
    systemType: systemType, errorConstant: errorConstant, talbot: talbot, stepResponse: stepResponse,
    drawBode: drawBode, drawLines: drawLines, onRedraw: onRedraw, deg: deg, dB: dB, logspace: logspace,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = root.Ctrl;
})(typeof window !== "undefined" ? window : globalThis);

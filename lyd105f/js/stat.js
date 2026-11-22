/* Tölfræðiföll í vafranum (sömu nöfn og í R): pnorm, qnorm, pt, qt, dbinom, pbinom, dpois, ppois, pf.
   Prófað gegn R með tools/statcheck.js. */
(function () {
  "use strict";

  // log Gamma (Lanczos, g = 7)
  var LG = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function lgamma(x) {
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
    x -= 1;
    var a = LG[0], t = x + 7.5;
    for (var i = 1; i < 9; i++) a += LG[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function lchoose(n, k) { return lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1); }

  // Staðlaða normaldreifingin: Φ(z) með erfc (W. J. Cody, nákvæmni ~1e-15)
  function erfc(x) {
    var z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 +
      t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
      t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  }
  // Nákvæmari Φ með röð/keðjubroti (Marsaglia) svo töflugildi passi upp á 4+ aukastafi
  function Phi(z) {
    if (z < -38) return 0;
    if (z > 38) return 1;
    if (Math.abs(z) < 3) {
      // Marsaglia (2004): Φ(x) = 1/2 + φ(x)(x + x^3/3 + x^5/15 + ...)
      var s = z, t = z, b = z * z, i = 1;
      while (Math.abs(t) > 1e-17 * Math.abs(s) && i < 500) { i += 2; t = t * b / i; s += t; }
      return 0.5 + s * Math.exp(-0.5 * b - 0.91893853320467274178);
    }
    // Hali: Q(x) = φ(x) / (x + 1/(x + 2/(x + 3/(x + ...))))
    var x = Math.abs(z), cf = x;
    for (var k = 120; k >= 1; k--) cf = x + k / cf;
    var q = Math.exp(-0.5 * x * x - 0.91893853320467274178) / cf;
    return z > 0 ? 1 - q : q;
  }
  function pnorm(x, mu, sd, lower) {
    mu = mu == null ? 0 : mu; sd = sd == null ? 1 : sd;
    var z = (x - mu) / sd;
    return lower === false ? Phi(-z) : Phi(z);
  }
  function dnorm(x, mu, sd) {
    mu = mu == null ? 0 : mu; sd = sd == null ? 1 : sd;
    var z = (x - mu) / sd;
    return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
  }
  // Acklam + eitt Halley-skref
  function qnorm(p, mu, sd) {
    mu = mu == null ? 0 : mu; sd = sd == null ? 1 : sd;
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    var a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239],
      b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1],
      c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783],
      d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
    var q, r, x, pl = 0.02425;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    else if (p <= 1 - pl) { q = p - 0.5; r = q * q; x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
    else { q = Math.sqrt(-2 * Math.log(1 - p)); x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    for (var k = 0; k < 2; k++) {
      var e = Phi(x) - p, u = e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2);
      x = x - u / (1 + x * u / 2);
    }
    return mu + sd * x;
  }

  // Regluleg ófullkomin betafall I_x(a,b) (keðjubrot, Lentz)
  function betacf(x, a, b) {
    var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap, TINY = 1e-300;
    if (Math.abs(d) < TINY) d = TINY;
    d = 1 / d; var h = d;
    for (var m = 1; m <= 300; m++) {
      var m2 = 2 * m, aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY; c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY; c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d; var del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    if (x < (a + 1) / (a + b + 2)) return bt * betacf(x, a, b) / a;
    return 1 - bt * betacf(1 - x, b, a) / b;
  }
  function pt(t, df, lower) {
    var x = df / (df + t * t), tail = 0.5 * ibeta(x, df / 2, 0.5); // P(T > |t|)
    var p = t >= 0 ? 1 - tail : tail;
    return lower === false ? 1 - p : p;
  }
  function dt(t, df) {
    return Math.exp(lgamma((df + 1) / 2) - lgamma(df / 2) - 0.5 * Math.log(df * Math.PI) - (df + 1) / 2 * Math.log(1 + t * t / df));
  }
  function qt(p, df) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    var x = qnorm(p);
    for (var i = 0; i < 60; i++) {
      var f = pt(x, df) - p, g = dt(x, df), step = f / g;
      x -= step;
      if (Math.abs(step) < 1e-13) break;
    }
    return x;
  }
  function pf(f, d1, d2, lower) {
    var p = f <= 0 ? 0 : ibeta(d1 * f / (d1 * f + d2), d1 / 2, d2 / 2);
    return lower === false ? 1 - p : p;
  }

  function dbinom(k, n, p) {
    if (k < 0 || k > n || k !== Math.floor(k)) return 0;
    if (p === 0) return k === 0 ? 1 : 0;
    if (p === 1) return k === n ? 1 : 0;
    return Math.exp(lchoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  }
  function pbinom(k, n, p, lower) {
    k = Math.floor(k); var s = 0;
    for (var i = 0; i <= Math.min(k, n); i++) s += dbinom(i, n, p);
    s = Math.min(1, s);
    return lower === false ? 1 - s : s;
  }
  function dpois(k, l) {
    if (k < 0 || k !== Math.floor(k)) return 0;
    return Math.exp(-l + k * Math.log(l) - lgamma(k + 1));
  }
  function ppois(k, l, lower) {
    k = Math.floor(k); var s = 0;
    for (var i = 0; i <= k; i++) s += dpois(i, l);
    s = Math.min(1, s);
    return lower === false ? 1 - s : s;
  }
  function choose(n, k) { return Math.round(Math.exp(lchoose(n, k))); }

  window.Stat = { pnorm: pnorm, dnorm: dnorm, qnorm: qnorm, pt: pt, dt: dt, qt: qt, pf: pf,
    dbinom: dbinom, pbinom: pbinom, dpois: dpois, ppois: ppois, choose: choose, lgamma: lgamma };
})();

/* w/kafli-3.js – gagnvirka skrefið í kafla 3: líkindaverkstæði: tvíkosta- og Poisson-dreifing (vélin er js/gagnvirkt.js). */

(function () {
  "use strict";
  window.TK.lab(3, {
    need: 0.6,
    tasks: function () {
      var g = window.TK.labGen(["binom", "poisson"], 8);
      g.unshift({ type: "mc", title: "Hvaða dreifing?", q: "Fjöldi sjúklinga sem koma á bráðamóttöku á klukkutíma, að meðaltali 4. Hvaða dreifing á við og hvert er R-fallið fyrir P(X ≤ 3)?",
        opts: ["Poisson(λ = 4), <code>ppois(3, 4)</code>", "Bin(n = 4, p = 0.5), <code>pbinom(3, 4, 0.5)</code>", "N(4, 4), <code>pnorm(3, 4, 2)</code>", "Poisson(λ = 4), <code>dpois(3, 4)</code>"], a: 0,
        ex: "<p>Talning atburða á föstu tímabili: Poisson. <code>dpois(3, 4)</code> gefur aðeins P(X = 3); P(X ≤ 3) = <code>ppois(3, 4)</code> = 0.433.</p>" });
      return g;
    },
    extra: function (box) {
      box.innerHTML = '<p class="hint">Opnaðu <a href="dreifingar.html">dreifingaborðið</a> í öðrum flipa til að sjá súlurnar og flatarmálið fyrir hvert dæmi.</p>';
    }
  });
})();

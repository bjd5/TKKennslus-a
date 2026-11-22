/* w/kafli-4.js – gagnvirka skrefið í kafla 4: normaldreifing og dreifing meðaltalsins (vélin er js/gagnvirkt.js). */

(function () {
  "use strict";
  window.TK.lab(4, {
    tasks: function () {
      var g = window.TK.labGen(["normal", "clt"], 8);
      g.push({ type: "mc", title: "Höfuðsetningin", q: "Meðalþyngd sjúklinga er 75.3 kg og dreifnin 912.02 kg². Hvaða dreifingu fylgir meðalþyngd 100 sjúklinga sem koma á einum klukkutíma (nálgunarlega)?",
        opts: ["N(75.3, 9.1202)", "N(75.3, 912.02)", "N(75.3, 30.2)", "N(75.3, 0.302)"], a: 0, keep: false,
        ex: "<p>X̄ ~ N(μ, σ²/n) = N(75.3, 912.02/100) = N(75.3, 9.1202). Staðalskekkjan er √9.1202 = 3.02 kg. (Spurning 4 á lokaprófinu 2025.)</p>" });
      return g;
    },
    extra: function (box) {
      box.innerHTML = '<p class="hint">Á <a href="dreifingar.html">dreifingaborðinu</a> geturðu valið „Meðaltal“ og séð hvernig dreifing X̄ mjókkar þegar n stækkar.</p>';
    }
  });
})();

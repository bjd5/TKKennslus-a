/* cards/kafli08.js – flashcards fyrir kafla 8: Fervikagreining (ANOVA). */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "anova", q: "Hvað prófar einþátta ANOVA?", a: "H₀: μ₁ = μ₂ = … = μ<sub>k</sub>. H₁: a.m.k. eitt meðaltal er ólíkt." },
  { c: "anova", q: "F-prófstærðin?", a: "F = MS<sub>hópa</sub>/MS<sub>leifa</sub>." },
  { c: "anova", q: "Mean Sq?", a: "MS = Sum Sq/Df." },
  { c: "anova", q: "Frígráður í ANOVA?", a: "Hópar: k − 1. Leifar: N − k. Alls: N − 1." },
  { c: "anova", q: "SS-sundurliðun?", a: "SS<sub>alls</sub> = SS<sub>hópa</sub> + SS<sub>leifa</sub>." },
  { c: "anova", q: "SS hópa?", a: "Σ n<sub>i</sub>(x̄<sub>i</sub> − x̄)²: breytileiki milli hópa." },
  { c: "anova", q: "SS leifa?", a: "ΣΣ(x<sub>ij</sub> − x̄<sub>i</sub>)²: breytileiki innan hópa." },
  { c: "anova", q: "F nálægt 1?", a: "Bendir til að H₀ standist; breytileiki milli hópa ekki meiri en innan." },
  { c: "anova", q: "Forsendur ANOVA?", a: "Óháðar mælingar, normaldreifðar leifar, jöfn dreifni í hópunum." },
  { c: "anova", q: "ANOVA í R?", a: "<code>summary(aov(y ~ hopur, data = d))</code>" },
  { c: "anova", q: "Eftiráprófanir?", a: "<code>TukeyHSD(aov(...))</code> ber saman öll pör og leiðréttir fyrir fjölda." },
  { c: "anova", q: "Af hverju ekki mörg t-próf?", a: "Líkur á villu af gerð I safnast upp." },
  { c: "anova", q: "ANOVA með 2 hópa?", a: "Jafngildir t-prófi með jafnri dreifni; F = t²." },
  { c: "anova", q: "Stikalaust jafngildi?", a: "Kruskal–Wallis: <code>kruskal.test(y ~ hopur)</code>." },
  { c: "anova", q: "Graf til að meta forsendur?", a: "Kassarit eftir hópum og QQ-rit leifa." },
  { c: "anova", q: "Próf fyrir jafna dreifni?", a: "<code>bartlett.test(y ~ hopur)</code> (eða Levene)." },
  { c: "anova", q: "R² í ANOVA?", a: "SS<sub>hópa</sub>/SS<sub>alls</sub>: hlutfall skýrðs breytileika." },
  { c: "anova", q: "Kólesteról eftir aldri?", a: "F = 207558/1853 = 112, df 3 og 4378, p &lt; 2e-16." },
  { c: "anova", q: "Betaplasma eftir reykingum?", a: "F = 3.715, df 2 og 312, p = 0.025." },
  { c: "anova", q: "Hvað segir ANOVA ekki?", a: "Hvaða hópar eru ólíkir." }
); })();

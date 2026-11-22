/* cards/kafli06.js – flashcards fyrir kafla 6: Tilgátupróf og t-próf. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "tilgatur", q: "Skref tilgátuprófs?", a: "1) H₀ og H₁ 2) α 3) prófstærð 4) p-gildi 5) ályktun í samhengi." },
  { c: "tilgatur", q: "Núlltilgáta?", a: "Fullyrðing um stika þýðis sem felur í sér „engin áhrif/enginn munur“, t.d. H₀: μ₁ = μ₂." },
  { c: "tilgatur", q: "p-gildi?", a: "Líkurnar á jafn öfgafullri eða öfgafyllri prófstærð og þeirri sem sást, <b>ef H₀ er sönn</b>." },
  { c: "tilgatur", q: "Villa af gerð I?", a: "Hafna sannri H₀ (falsk jákvæð). Líkur = α." },
  { c: "tilgatur", q: "Villa af gerð II?", a: "Hafna ekki ósannri H₀ (missa af raunverulegum áhrifum). Líkur = β." },
  { c: "tilgatur", q: "Styrkur (power)?", a: "1 − β = P(hafna H₀ | H₀ ósönn). Eykst með n, áhrifastærð og α; minnkar með breytileika." },
  { c: "tilgatur", q: "Einhliða vs. tvíhliða?", a: "Einhliða aðeins ef áttin er ákveðin fyrir fram. Tvíhliða er sjálfgefið." },
  { c: "tilgatur", q: "Marktekt vs. mikilvægi?", a: "Lítil áhrif geta orðið marktæk með stórt n. Skoðaðu áhrifastærð og öryggisbil." },
  { c: "ttest", q: "Eins úrtaks t-próf?", a: "t = (x̄ − μ₀)/(s/√n), df = n − 1. <code>t.test(x, mu = μ0)</code>" },
  { c: "ttest", q: "Parað t-próf?", a: "Eins úrtaks t-próf á mismunum d. <code>t.test(eftir, fyrir, paired = TRUE)</code>, df = n − 1." },
  { c: "ttest", q: "Óparað t-próf, jöfn dreifni?", a: "Vegin dreifni, df = n₁ + n₂ − 2. <code>t.test(y ~ hopur, var.equal = TRUE)</code>" },
  { c: "ttest", q: "Welch t-próf?", a: "Ójöfn dreifni, frígráður nálgaðar (ekki heiltala). Sjálfgefið í R." },
  { c: "ttest", q: "var.test?", a: "F-próf fyrir jafna dreifni: H₀: σ₁²/σ₂² = 1. p &lt; 0.05 → var.equal = FALSE." },
  { c: "ttest", q: "Vegin dreifni?", a: "s<sub>p</sub>² = ((n₁ − 1)s₁² + (n₂ − 1)s₂²)/(n₁ + n₂ − 2)." },
  { c: "ttest", q: "Hvenær parað próf?", a: "Þegar mælingar koma í pörum: sami einstaklingur fyrir/eftir, tvíburar, augu sama manns." },
  { c: "ttest", q: "Forsendur t-prófs?", a: "Óháðar mælingar (eða óháð pör), u.þ.b. normaldreifð gögn eða stórt n." },
  { c: "ttest", q: "Lesa t.test úttak?", a: "t = prófstærð, df, p-value, öryggisbil fyrir muninn, og meðaltöl hópanna." },
  { c: "ttest", q: "Af hverju t en ekki normal?", a: "σ er óþekkt og metið með s; t-dreifingin hefur þykkari hala, sérstaklega fyrir lítið n." },
  { c: "tilgatur", q: "Fjölpróf?", a: "Með mörgum prófum aukast líkur á a.m.k. einni villu af gerð I (20 próf við α = 0.05 → 1 vænt)." },
  { c: "ttest", q: "Lalli og langstökkið (> 4 m)?", a: "Eins úrtaks t-próf, einhliða: <code>t.test(x, mu = 4, alternative = \"greater\")</code>." }
); })();

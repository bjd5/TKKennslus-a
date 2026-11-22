/* cards/kafli09.js – flashcards fyrir kafla 9: Línulegt aðhvarf. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "adhvarf", q: "Einfalt línulegt aðhvarfslíkan?", a: "Y = α + βx + ε, ε ~ N(0, σ²)." },
  { c: "adhvarf", q: "Aðferð minnstu kvaðrata?", a: "Velur a og b sem lágmarka Σ(y − ŷ)²." },
  { c: "adhvarf", q: "Hallatala b?", a: "Vænt breyting á y fyrir einnar einingar aukningu í x." },
  { c: "adhvarf", q: "Skurðpunktur a?", a: "Spágildi y þegar x = 0; oft án raunhæfrar túlkunar." },
  { c: "adhvarf", q: "Leif?", a: "e = y − ŷ." },
  { c: "adhvarf", q: "Forsendur?", a: "Línulegt samband, óháðar leifar, normaldreifðar leifar, jöfn dreifni leifa." },
  { c: "adhvarf", q: "Leifarit?", a: "Leifar á móti spágildum: ætti að vera handahófskennt band um 0. <code>plot(fit, which = 1)</code>" },
  { c: "adhvarf", q: "QQ-rit leifa?", a: "Metur normaldreifingu leifa. <code>plot(fit, which = 2)</code>" },
  { c: "adhvarf", q: "R²?", a: "Hlutfall breytileika í y sem skýrist af x. Í einföldu aðhvarfi R² = r²." },
  { c: "adhvarf", q: "Tilgáta um hallatölu?", a: "H₀: β = 0. t = b/SE(b), df = n − 2." },
  { c: "adhvarf", q: "Öryggisbil hallatölu?", a: "b ± t<sub>0.975, n−2</sub>·SE(b). <code>confint(fit)</code>" },
  { c: "adhvarf", q: "Spá?", a: "<code>predict(fit, data.frame(x = 25))</code>; spábil með <code>interval = \"prediction\"</code>." },
  { c: "adhvarf", q: "Bryggjun?", a: "Spá utan gagnasviðs x; óáreiðanleg." },
  { c: "adhvarf", q: "Residual standard error?", a: "Mat á σ: dæmigert frávik mælinga frá línunni." },
  { c: "adhvarf", q: "F-statistic í summary(lm)?", a: "Prófar hvort líkanið skýri eitthvað; í einföldu aðhvarfi F = t²." },
  { c: "adhvarf", q: "Tengsl r og b?", a: "b = r·s<sub>y</sub>/s<sub>x</sub>." },
  { c: "adhvarf", q: "Línan fer í gegnum?", a: "(x̄, ȳ)." },
  { c: "adhvarf", q: "Trektlaga leifarit?", a: "Ójöfn dreifni; prófa log-umbreytingu." },
  { c: "adhvarf", q: "Bogalaga leifarit?", a: "Sambandið er ekki línulegt." },
  { c: "adhvarf", q: "SYSBP ~ BMI?", a: "SYSBP = 86.67 + 1.79·BMI, R² = 0.108, p &lt; 2e-16." }
); })();

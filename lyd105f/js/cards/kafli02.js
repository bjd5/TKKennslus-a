/* cards/kafli02.js – flashcards fyrir kafla 2: Lýsandi tölfræði og gröf. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "lysandi", q: "Meðaltal?", a: "x̄ = Σx<sub>i</sub>/n. Viðkvæmt fyrir útlögum. <code>mean(x)</code>" },
  { c: "lysandi", q: "Miðgildi?", a: "Miðjugildið þegar gögnum er raðað (meðaltal tveggja miðjugilda ef n er slétt). Ónæmt fyrir útlögum. <code>median(x)</code>" },
  { c: "lysandi", q: "Tíðasta gildi?", a: "Algengasta gildið. Eini mælikvarðinn á miðju fyrir óraðaðar flokkabreytur." },
  { c: "lysandi", q: "Úrtaksdreifni og staðalfrávik?", a: "s² = Σ(x − x̄)²/(n − 1), s = √s². <code>var(x)</code>, <code>sd(x)</code>" },
  { c: "lysandi", q: "Fjórðungamörk og IQR?", a: "Q1 = 25%-mark, Q3 = 75%-mark, IQR = Q3 − Q1. <code>quantile(x)</code>, <code>IQR(x)</code>" },
  { c: "lysandi", q: "Útlagaregla í kassariti?", a: "Gildi undir Q1 − 1.5·IQR eða yfir Q3 + 1.5·IQR." },
  { c: "lysandi", q: "Spönn?", a: "Hámark − lágmark. Mjög viðkvæm fyrir útlögum." },
  { c: "lysandi", q: "Frávikshlutfall (CV)?", a: "s/x̄ (oft í %). Einingalaus mælikvarði á breytileika." },
  { c: "lysandi", q: "Hægri-skekkt dreifing?", a: "Langur hali upp á við; meðaltal > miðgildi (t.d. tekjur, betaplasma)." },
  { c: "lysandi", q: "Vinstri-skekkt dreifing?", a: "Langur hali niður á við; meðaltal < miðgildi." },
  { c: "lysandi", q: "Stuðlarit?", a: "Dreifing einnar talnabreytu, skipt í bil. <code>hist(x)</code> eða <code>geom_histogram()</code>" },
  { c: "lysandi", q: "Kassarit?", a: "Miðgildi, Q1, Q3, skeggin og útlagar; gott til að bera saman hópa. <code>boxplot(y ~ hopur)</code>" },
  { c: "lysandi", q: "Stöplarit vs. kökurit?", a: "Bæði fyrir flokkabreytur. Stöplarit er yfirleitt auðveldara að lesa." },
  { c: "lysandi", q: "Punktarit?", a: "Samband tveggja talnabreyta. <code>plot(x, y)</code> eða <code>geom_point()</code>" },
  { c: "lysandi", q: "Fylgnistuðull Pearsons?", a: "r ∈ [−1, 1] mælir styrk og stefnu <b>línulegs</b> sambands. <code>cor(x, y)</code>" },
  { c: "lysandi", q: "68–95–99.7 reglan?", a: "Í normaldreifingu eru um 68%, 95% og 99.7% gilda innan ±1, ±2 og ±3 staðalfrávika." },
  { c: "lysandi", q: "Línuleg umbreyting aX + b?", a: "Meðaltal verður a·x̄ + b, staðalfrávik |a|·s." },
  { c: "lysandi", q: "Hvað gefur summary(x)?", a: "Min, 1st Qu., Median, Mean, 3rd Qu., Max og fjölda NA's." },
  { c: "lysandi", q: "Vegið meðaltal hópa?", a: "(n₁x̄₁ + n₂x̄₂)/(n₁ + n₂)." },
  { c: "lysandi", q: "Af hverju n − 1 í s²?", a: "Svo s² sé óbjagaður metill fyrir σ²; ein frígráða fer í að meta μ með x̄." }
); })();

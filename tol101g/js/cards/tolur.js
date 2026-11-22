/* cards/tolur.js – flashcards fyrir kafla 2: Tölur, breytur og segðir. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "tolur", q: "Átta frumtög Java?", a: "<code>byte short int long</code> (heiltölur), <code>float double</code> (kommutölur), <code>char</code>, <code>boolean</code>." },
  { c: "tolur", q: "<code>7 / 2</code>, <code>7.0 / 2</code>, <code>-7 / 2</code>?", a: "<code>3</code>, <code>3.5</code>, <code>-3</code> (heiltöludeiling stýfir að núlli)." },
  { c: "tolur", q: "Formerki afgangs <code>a % b</code>?", a: "Sama og <b>a</b> (vinstri hliðar): <code>-7 % 3 == -1</code>, <code>7 % -3 == 1</code>." },
  { c: "tolur", q: "Forgangur reiknivirkja?", a: "Svigar → kast, ++, −− → <code>* / %</code> (frá vinstri) → <code>+ -</code> (frá vinstri) → <code>= += …</code>" },
  { c: "tolur", q: "<code>x++</code> vs. <code>++x</code>?", a: "<code>x++</code> skilar gamla gildinu og hækkar svo. <code>++x</code> hækkar fyrst og skilar nýja gildinu." },
  { c: "tolur", q: "Víkkun vs. þrenging?", a: "<b>Víkkun</b> (int → double) gerist sjálfkrafa. <b>Þrenging</b> (double → int) þarf kast: <code>(int) 7.9</code> = 7." },
  { c: "tolur", q: "<code>(double) 7 / 2</code> vs. <code>(double) (7 / 2)</code>?", a: "<code>3.5</code> (kastað á undan deilingu) vs. <code>3.0</code> (heiltöludeilingin búin fyrst)." },
  { c: "tolur", q: "Teningur 1-6 með Math.random()?", a: "<code>(int) (Math.random() * 6) + 1</code>" },
  { c: "tolur", q: "Hvernig prentast double?", a: "Alltaf með punkti: <code>4.0</code>, <code>2.5</code>, <code>0.30000000000000004</code>. Heil tala fær <code>.0</code>." },
  { c: "tolur", q: "Math.round(2.5) og Math.round(-2.5)?", a: "<code>3</code> og <code>-2</code> (.5 fer upp í átt að +∞). Skilar <code>long</code>." },
  { c: "tolur", q: "Síðasti tölustafur n og n án hans?", a: "<code>n % 10</code> og <code>n / 10</code>." },
  { c: "tolur", q: "Hvað gerir <code>k += 2.7</code> ef k er int?", a: "Kastar sjálfkrafa: <code>k = (int) (k + 2.7)</code>. Þýðist (en <code>k = k + 2.7</code> gerir það ekki)." },
  { c: "tolur", q: "Yfirflæði?", a: "<code>Integer.MAX_VALUE + 1 == Integer.MIN_VALUE</code>; engin villa, talan fer hringinn." }
); })();

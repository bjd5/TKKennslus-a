/* cards/erfdir.js – flashcards fyrir kafla 10: Erfðir og fjölbrigðni. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "erfdir", q: "Hvað erfir undirklasi?", a: "Öll eigindi og aðferðir (private eru til en <b>ekki aðgengileg</b> beint). Smiðir erfast <b>ekki</b>." },
  { c: "erfdir", q: "super(…)?", a: "Kall á smið yfirklasans; <b>fyrsta</b> setning. Annars setur Java inn <code>super()</code> sjálfkrafa." },
  { c: "erfdir", q: "Hvenær er sjálfvirka super() þýðingarvilla?", a: "Þegar yfirklasinn hefur engan smið án færibreyta." },
  { c: "erfdir", q: "Röð smiða í <code>new C()</code> (C → B → A)?", a: "A klárast fyrst, svo B, svo C (ofan frá)." },
  { c: "erfdir", q: "Yfirskrifun vs. yfirhleðsla?", a: "<b>Yfirskrifun</b>: sama undirskrift í undirklasa, valin við keyrslu. <b>Yfirhleðsla</b>: ólíkar færibreytur, valin við þýðingu." },
  { c: "erfdir", q: "super.aðferð()?", a: "Kallar á útgáfu yfirklasans af aðferðinni, t.d. <code>\"Triangle \" + super.toString()</code>." },
  { c: "erfdir", q: "Yfirlýst vs. raunverulegt tag?", a: "Yfirlýst (breytan) ákveður hvað <b>má</b> kalla á (þýðing). Raunverulegt (hluturinn) ákveður hvað <b>keyrir</b> (keyrsla)." },
  { c: "erfdir", q: "Breytileg binding?", a: "Útgáfa aðferðar er valin við keyrslu eftir raunverulegum klasa hlutarins, líka þegar kallað er innan úr yfirklasanum." },
  { c: "erfdir", q: "Upcast og downcast?", a: "Upp: sjálfkrafa (<code>Player p = new Human();</code>). Niður: <code>(Human) p</code>; ClassCastException ef rangt. Verja með <code>instanceof</code>." },
  { c: "erfdir", q: "instanceof?", a: "true ef hluturinn er af klasanum <b>eða undirklasa</b> hans (eða útfærir viðmótið). <code>null instanceof X</code> er false." },
  { c: "erfdir", q: "Yfirskrifa equals rétt?", a: "<code>public boolean equals(Object o)</code> (færibreyta af tagi Object!), með instanceof og kasti." },
  { c: "erfdir", q: "protected?", a: "Aðgengilegt klasanum, undirklösum og pakkanum (# í UML)." },
  { c: "erfdir", q: "final á klasa / aðferð / breytu?", a: "Klasi: ekki erfa. Aðferð: ekki yfirskrifa. Breyta: ekki breyta." },
  { c: "erfdir", q: "Má yfirskrifun þrengja aðgang?", a: "Nei (public → private er villa). Hún má víkka hann (protected → public)." }
); })();

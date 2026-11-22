/* cards/tengsl.js – flashcards fyrir kafla 9: Tengsl hluta og UML. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "tengsl", q: "UML: samband (association)?", a: "Heil lína (opin ör = í hvaða átt má rata). Java: eigindi sem vísar á hinn klasann." },
  { c: "tengsl", q: "UML: safntengsl (aggregation)?", a: "Holur tígull ◇ við heildina. Hlutarnir geta lifað sjálfstætt (t.d. nemendur námskeiðs)." },
  { c: "tengsl", q: "UML: samsetning (composition)?", a: "Fylltur tígull ◆ við heildina. Hlutarnir lifa og deyja með heildinni (t.d. hornpunktar þríhyrnings); heildin býr þá til." },
  { c: "tengsl", q: "UML: erfðir?", a: "Heil lína, holur þríhyrningur ▷ við yfirklasann. Java: <code>extends</code>." },
  { c: "tengsl", q: "UML: útfærsla viðmóts?", a: "<b>Brotin</b> lína, holur þríhyrningur ▷ við viðmótið. Java: <code>implements</code>." },
  { c: "tengsl", q: "UML: háð (dependency)?", a: "Brotin lína með opinni ör. Klasi notar hinn bara tímabundið (færibreyta, staðvær breyta)." },
  { c: "tengsl", q: "Fjöldatölur?", a: "<code>1</code>, <code>0..1</code>, <code>*</code> / <code>0..*</code>, <code>1..*</code>, <code>2..4</code>" },
  { c: "tengsl", q: "„hefur“ vs. „er“ í Java?", a: "„hefur“ → eigindi (<code>private DrawPile drawPile;</code>). „er“ → <code>extends</code>." },
  { c: "tengsl", q: "<code>new Card[7]</code>?", a: "Fylki af 7 <b>null</b>-tilvísunum; engin spil eru búin til." },
  { c: "tengsl", q: "Geyma tilvísun eða afrita í smið?", a: "Tilvísun: hluturinn er deildur (breytingar utan frá sjást). Afrit (<code>new Point(p.getX(), p.getY())</code>): heildin á sinn eigin hlut." },
  { c: "tengsl", q: "Internering strengja?", a: "Bókstafir með sama innihaldi eru <b>sami</b> hlutur. <code>new String(…)</code> og strengir búnir til við keyrslu eru nýir. Alltaf <code>equals</code>." },
  { c: "tengsl", q: "split?", a: "<code>\"a,b,,c,,\".split(\",\")</code> → <code>{\"a\",\"b\",\"\",\"c\"}</code> (tómir aftast hverfa). <code>\" +\"</code> = eitt eða fleiri bil." },
  { c: "tengsl", q: "StringBuilder?", a: "Breytanlegur strengur: <code>append, insert, reverse, setCharAt, toString</code>." },
  { c: "tengsl", q: "Autoboxing?", a: "<code>Integer x = 5;</code> (int → Integer) og <code>int y = x;</code> (unboxing) gerast sjálfkrafa." }
); })();

/* cards/hrein.js – flashcards fyrir kafla 11: Hrein klasar og viðmót. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "hrein", q: "Hrein aðferð?", a: "<code>public abstract double calcArea();</code> Undirskrift án líkama." },
  { c: "hrein", q: "Reglur um hreina klasa?", a: "Ekki hægt að <code>new</code>-a. Undirklasi útfærir <b>allar</b> hreinu aðferðirnar eða er sjálfur abstract. Má hafa eigindi, smiði og venjulegar aðferðir." },
  { c: "hrein", q: "Viðmót: hvað er sjálfkrafa?", a: "Aðferðir <code>public abstract</code> (nema default/static), breytur <code>public static final</code>. Engir smiðir, engin hlutbundin eigindi." },
  { c: "hrein", q: "extends vs. implements?", a: "<code>extends</code> einn klasa; <code>implements</code> mörg viðmót: <code>class A extends B implements C, D</code>." },
  { c: "hrein", q: "Comparable&lt;T&gt;?", a: "<code>public int compareTo(T o)</code>: neikvætt (á undan), 0, jákvætt (á eftir). Þá virkar <code>Arrays.sort</code>." },
  { c: "hrein", q: "Hreinn klasi vs. viðmót?", a: "Hreinn klasi: sameiginlegt ástand og útfærsla, „er“, einn. Viðmót: hæfni, „getur“, mörg, ekkert ástand." },
  { c: "hrein", q: "UML fyrir abstract og interface?", a: "Abstract: <i>skáletur</i> (eða {abstract}). Viðmót: «interface» og brotin lína með ▷ frá útfærsluklasanum." },
  { c: "hrein", q: "default-aðferð?", a: "Aðferð með líkama í viðmóti (Java 8+); útfærsluklasar fá hana nema þeir yfirskrifi." },
  { c: "hrein", q: "Sniðmátsaðferð?", a: "Venjuleg aðferð í hreinum klasa sem kallar á hreina aðferð; undirklasarnir fylla inn í skrefin." },
  { c: "hrein", q: "Má útfærsla viðmótsaðferðar vera án public?", a: "Nei: aðferðir viðmóta eru public og aðgangur má ekki þrengjast." }
); })();

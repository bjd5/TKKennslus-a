/* cards/klasar.js – flashcards fyrir kafla 8: Klasar og hlutir. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "klasar", q: "Klasi vs. hlutur?", a: "<b>Klasi</b>: skilgreining (eigindi + aðferðir), hönnunartími. <b>Hlutur</b>: eintak búið til með <code>new</code> við keyrslu." },
  { c: "klasar", q: "Ástand og hegðun hlutar?", a: "<b>Ástand</b> = gildi eiginda (venjulega hjúpað). <b>Hegðun</b> = aðferðir (þær public mynda viðmót hlutarins)." },
  { c: "klasar", q: "Reglur um smiði?", a: "Sama nafn og klasinn, <b>ekkert skilatag</b>, kallaður með <code>new</code>. Sjálfgefinn smiður aðeins ef enginn smiður er skrifaður." },
  { c: "klasar", q: "<code>this.r = r;</code>?", a: "Eigindið r fær gildi færibreytunnar r, sem skyggir á eigindið." },
  { c: "klasar", q: "<code>this(…)</code>?", a: "Kall á annan smið sama klasa; verður að vera <b>fyrsta</b> setningin í smiðnum." },
  { c: "klasar", q: "Aðgangur og UML-tákn?", a: "<code>+</code> public, <code>-</code> private, <code>#</code> protected, <code>~</code> pakki." },
  { c: "klasar", q: "Hjúpunarreglan?", a: "Eigindi <b>private</b>; public smiður, get-aðferðir (lesa), set-aðferðir (skrifa með staðfestingu) og aðrar aðferðir." },
  { c: "klasar", q: "static vs. hlutbundið eigindi?", a: "static: <b>eitt</b> eintak sem allir hlutir deila. Hlutbundið: hver hlutur hefur sitt." },
  { c: "klasar", q: "„non-static … from a static context“?", a: "Hlutbundið eigindi/aðferð notuð beint í static aðferð (t.d. main). Búðu til hlut fyrst." },
  { c: "klasar", q: "Sjálfgefin gildi eiginda?", a: "<code>0</code>, <code>0.0</code>, <code>false</code>, <code>'\\u0000'</code>, <code>null</code>." },
  { c: "klasar", q: "Hvenær kemur NullPointerException?", a: "Þegar aðferð er kölluð (eða eigindi lesið) í gegnum tilvísun sem er <code>null</code>." },
  { c: "klasar", q: "toString()?", a: "Skilar strengjaframsetningu hlutarins; println og <code>+</code> kalla á hana sjálfkrafa." },
  { c: "klasar", q: "Hlaði (stack)?", a: "LIFO. <code>push</code> setur efst, <code>pop</code> tekur efsta, <code>peek</code> skoðar efsta, <code>isEmpty</code>. Með fylki: <code>cards[++top] = c;</code> / <code>return cards[top--];</code>" },
  { c: "klasar", q: "UML-klasi?", a: "Kassi: nafn / eigindi <code>- number : int</code> / aðferðir <code>+ getNumber() : int</code>. static undirstrikað." }
); })();

/* cards/undantekningar.js – flashcards fyrir kafla 12: Undantekningar og pakkar. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "undantekningar", q: "try / catch / finally?", a: "try: afgangi sleppt eftir kast. catch: fyrsta sem passar keyrir. finally: keyrir <b>alltaf</b>." },
  { c: "undantekningar", q: "throw vs. throws?", a: "<code>throw new X(…);</code> kastar (í líkama). <code>… throws X</code> lýsir yfir (í haus)." },
  { c: "undantekningar", q: "Athugaðar vs. óathugaðar?", a: "Athugaðar (Exception): „catch or declare“, t.d. IOException. Óathugaðar (RuntimeException): engin krafa, t.d. NullPointerException." },
  { c: "undantekningar", q: "Röð catch-blokka?", a: "Sértækt → almennt. Annars er seinni blokk óaðgengileg (þýðingarvilla)." },
  { c: "undantekningar", q: "Eigin undantekning?", a: "<code>class MyException extends Exception { MyException(String m) { super(m); } }</code>" },
  { c: "undantekningar", q: "Þrjár leiðir að bregðast við?", a: "1) Grípa og meðhöndla. 2) Grípa og kasta annarri (sértækari). 3) Láta fljúga upp (throws). Aldrei grípa og gera ekkert." },
  { c: "undantekningar", q: "Algengar óathugaðar undantekningar?", a: "ArithmeticException, NullPointerException, ArrayIndexOutOfBoundsException, StringIndexOutOfBoundsException, ClassCastException, IllegalArgumentException, NumberFormatException, InputMismatchException." },
  { c: "undantekningar", q: "getMessage()?", a: "Skilaboðin sem voru gefin smiðnum (<code>super(message)</code>)." },
  { c: "undantekningar", q: "Ógilt inntak í nextInt()?", a: "<code>InputMismatchException</code>; kalla á <code>input.next()</code> í catch til að fjarlægja ógilda orðið." },
  { c: "undantekningar", q: "Staflarakning (stack trace)?", a: "Það sem JVM prentar ef undantekning er hvergi gripin: tegund, skilaboð og kallhlaðinn með línunúmerum." },
  { c: "undantekningar", q: "package og import?", a: "<code>package uno.game;</code> fyrst (mappa uno/game), svo <code>import uno.game.Card;</code>. java.lang þarf ekki import." },
  { c: "undantekningar", q: "Pakkaaðgangur?", a: "Ekkert aðgangsorð (~ í UML): aðeins klasar í <b>sama pakka</b>." }
); })();

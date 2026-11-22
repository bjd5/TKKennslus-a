/* cards/skilyrdi.js – flashcards fyrir kafla 3: Rökgildi og skilyrði. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "skilyrdi", q: "Samanburðarvirkjarnir sex?", a: "<code>== != &lt; &lt;= &gt; &gt;=</code> (allir skila boolean)." },
  { c: "skilyrdi", q: "Rökvirkjar og forgangur?", a: "<code>!</code> (not) → <code>^</code> (xor) → <code>&amp;&amp;</code> (and) → <code>||</code> (or)." },
  { c: "skilyrdi", q: "Hvað er skammhlaup?", a: "<code>&amp;&amp;</code> metur ekki hægri hlið ef vinstri er false; <code>||</code> ekki ef vinstri er true. <code>n != 0 &amp;&amp; x / n &gt; 1</code> er öruggt." },
  { c: "skilyrdi", q: "De Morgan?", a: "<code>!(a &amp;&amp; b) == !a || !b</code><br><code>!(a || b) == !a &amp;&amp; !b</code>" },
  { c: "skilyrdi", q: "1 ≤ x ≤ 6 í Java?", a: "<code>1 &lt;= x &amp;&amp; x &lt;= 6</code> (ekki <code>1 &lt;= x &lt;= 6</code>, það er þýðingarvilla)." },
  { c: "skilyrdi", q: "Hve margar greinar keyra í else-if-keðju?", a: "Bara sú <b>fyrsta</b> sanna (eða else ef engin er sönn)." },
  { c: "skilyrdi", q: "Hangandi else?", a: "Tilheyrir <b>næsta if-i á undan</b> sem á ekki else, óháð inndrætti." },
  { c: "skilyrdi", q: "<code>if (x &gt; 5);</code>?", a: "if með tómri setningu: blokkin á eftir keyrir <b>alltaf</b>." },
  { c: "skilyrdi", q: "switch án break?", a: "<b>Fall-through</b>: heldur áfram í næstu case (og default) þar til break eða endi kemur." },
  { c: "skilyrdi", q: "Hvaða tög má nota í switch?", a: "int (og byte, short), char, String, enum. Ekki double, long eða boolean." },
  { c: "skilyrdi", q: "Skilyrðisvirkinn?", a: "<code>skilyrði ? efSatt : efÓsatt</code> er segð: <code>int max = a &gt; b ? a : b;</code>" },
  { c: "skilyrdi", q: "Hvernig berðu saman strengi og double?", a: "Strengir: <code>s.equals(t)</code>. double: <code>Math.abs(a - b) &lt; 1e-9</code>. Aldrei <code>==</code>." }
); })();

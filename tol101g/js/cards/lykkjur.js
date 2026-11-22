/* cards/lykkjur.js – flashcards fyrir kafla 5: Lykkjur. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "lykkjur", q: "while vs. do-while?", a: "<code>while</code> prófar fyrst (0+ umferðir). <code>do { } while (…);</code> prófar eftir (1+ umferðir); semíkomma í lokin." },
  { c: "lykkjur", q: "Röð í for-lykkju?", a: "Frumstilling (einu sinni) → skilyrði → líkami → uppfærsla → skilyrði → …" },
  { c: "lykkjur", q: "Fjöldi umferða í <code>for (i = a; i &lt; b; i++)</code>?", a: "<code>b − a</code> (með <code>&lt;=</code>: <code>b − a + 1</code>)." },
  { c: "lykkjur", q: "break vs. continue?", a: "<code>break</code>: hætta í innstu lykkju. <code>continue</code>: sleppa afgangi umferðar (uppfærslan keyrir samt í for)." },
  { c: "lykkjur", q: "Svið breytunnar í for-hausnum?", a: "Aðeins lykkjan sjálf. Eftir lykkjuna er hún óþekkt." },
  { c: "lykkjur", q: "Lesa löglegt kast 1-6?", a: "<code>do { roll = input.nextInt(); } while (roll &lt; 1 || roll &gt; 6);</code>" },
  { c: "lykkjur", q: "Tölustafir tölu í lykkju?", a: "<code>while (n &gt; 0) { int d = n % 10; … n /= 10; }</code>" },
  { c: "lykkjur", q: "Hreiðraðar lykkjur n × m?", a: "Innri lykkjan keyrir m sinnum fyrir <b>hverja</b> af n ytri umferðum: n·m alls." },
  { c: "lykkjur", q: "Þrjár klassískar lykkjuvillur?", a: "Einum of mikið/lítið (<code>&lt;</code> vs <code>&lt;=</code>), <code>;</code> á eftir for/while-haus, gleymd eða röng uppfærsla (endalaus lykkja)." },
  { c: "lykkjur", q: "Hvernig rekurðu lykkju?", a: "Tafla: dálkur fyrir hverja breytu, lína fyrir hverja umferð, og athuga skilyrðið áður en hver umferð byrjar." },
  { c: "lykkjur", q: "Stærsta gildi í lykkju?", a: "Byrja með fyrsta gildið (ekki 0!), svo <code>if (x &gt; max) max = x;</code> fyrir hvert gildi." }
); })();

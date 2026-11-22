/* cards/fylki.js – flashcards fyrir kafla 7: Fylki. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "fylki", q: "Þrjár leiðir að búa til fylki?", a: "<code>int[] a = new int[5];</code><br><code>int[] a = {1, 2, 3};</code><br><code>int[] a = new int[] {1, 2, 3};</code>" },
  { c: "fylki", q: "Sjálfgefin gildi í nýju fylki?", a: "<code>0</code> (tölur), <code>false</code> (boolean), <code>'\\u0000'</code> (char), <code>null</code> (hlutir og String)." },
  { c: "fylki", q: "Vísar fylkis af lengd n?", a: "0 … n − 1. Utan þess: <code>ArrayIndexOutOfBoundsException</code>." },
  { c: "fylki", q: "for vs. for-each?", a: "<code>for (int i = 0; i &lt; a.length; i++)</code> til að skrifa/þarf vísi. <code>for (int x : a)</code> til að lesa (x er afrit)." },
  { c: "fylki", q: "Hvað gerir <code>int[] b = a;</code>?", a: "Afritar <b>tilvísunina</b>: a og b vísa á sama fylkið." },
  { c: "fylki", q: "Afrita fylki?", a: "<code>Arrays.copyOf(a, a.length)</code>, <code>a.clone()</code>, <code>System.arraycopy(a, 0, b, 0, n)</code> eða lykkja." },
  { c: "fylki", q: "Fylki sem færibreyta?", a: "Aðferðin getur breytt <b>innihaldi</b> fylkisins (sami hlutur), en <code>x = new int[…]</code> inni í henni sést ekki úti." },
  { c: "fylki", q: "Prenta fylki?", a: "<code>System.out.println(Arrays.toString(a));</code> → <code>[1, 2, 3]</code>" },
  { c: "fylki", q: "Tvívítt fylki: raðir og dálkar?", a: "<code>m.length</code> raðir, <code>m[r].length</code> dálkar í röð r, stak <code>m[r][c]</code>." },
  { c: "fylki", q: "Bylta (transpose)?", a: "<code>out = new int[in[0].length][in.length]; out[c][r] = in[r][c];</code>" },
  { c: "fylki", q: "Tíðnitalning?", a: "<code>int[] count = new int[MAX + 1]; for (int v : a) count[v]++;</code>" },
  { c: "fylki", q: "Snúa fylki við á staðnum?", a: "Víxla <code>a[i]</code> og <code>a[a.length - 1 - i]</code> fyrir i &lt; <code>a.length / 2</code>." }
); })();

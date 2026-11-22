/* cards/strengir.js – flashcards fyrir kafla 4: Stafir og strengir. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "strengir", q: "Kóðar '0', 'A' og 'a'?", a: "48, 65 og 97. Munur há- og lágstafa er 32." },
  { c: "strengir", q: "<code>'a' + 1</code> vs. <code>(char) ('a' + 1)</code>?", a: "<code>98</code> (int) vs. <code>'b'</code>." },
  { c: "strengir", q: "Tölustafur í tölu?", a: "<code>int d = c - '0';</code>" },
  { c: "strengir", q: "<code>s.substring(b, e)</code>?", a: "Stafir b til <b>e − 1</b> (e − b stafir). <code>substring(b)</code> tekur til enda." },
  { c: "strengir", q: "Síðasti stafur strengs?", a: "<code>s.charAt(s.length() - 1)</code>" },
  { c: "strengir", q: "Hvað skilar indexOf ef ekkert finnst?", a: "<code>-1</code>" },
  { c: "strengir", q: "Af hverju gerir <code>s.toUpperCase();</code> ekkert?", a: "Strengir eru <b>óbreytanlegir</b>; aðferðin skilar nýjum streng. Rétt: <code>s = s.toUpperCase();</code>" },
  { c: "strengir", q: "equals vs. ==?", a: "<code>equals</code> ber saman <b>innihald</b>; <code>==</code> spyr hvort tilvísanirnar séu á <b>sama hlutinn</b>." },
  { c: "strengir", q: "Hvað skilar compareTo?", a: "Mismun kóða við fyrsta ólíka staf, eða mismun lengda ef annar er forskeyti. &lt;0: á undan, 0: eins, &gt;0: á eftir." },
  { c: "strengir", q: "Strengur í tölu og öfugt?", a: "<code>Integer.parseInt(\"42\")</code>, <code>Double.parseDouble(\"2.5\")</code>, <code>String.valueOf(42)</code> eða <code>\"\" + 42</code>." },
  { c: "strengir", q: "printf-tákn?", a: "<code>%d</code> int, <code>%f</code>/<code>%.2f</code> double, <code>%s</code> strengur, <code>%c</code> char, <code>%b</code> boolean, <code>%n</code> lína, <code>%5d</code> breidd, <code>%-5s</code> vinstri." },
  { c: "strengir", q: "length fyrir streng vs. fylki?", a: "Strengur: <code>s.length()</code> (aðferð). Fylki: <code>a.length</code> (eigindi, engir svigar)." },
  { c: "strengir", q: "Gagnlegar Character-aðferðir?", a: "<code>isDigit, isLetter, isLetterOrDigit, isUpperCase, isLowerCase, toUpperCase, toLowerCase, isWhitespace</code>" }
); })();

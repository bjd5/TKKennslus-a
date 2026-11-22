/* q/strengir.js – kafli 4: Stafir og strengir (Liang kafli 4). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, code = B.code;
  var T = "strengir";
  var WORDS = ["Programming", "ComputerScience", "JavaClass", "DiscardPile", "SnakesAndLadders", "HelloWorld", "Reykjavik", "Algorithm", "Polymorphism", "Inheritance", "Exception", "StackOfCards"];
  var jstr = function (s) { return '"' + s + '"'; };
  // Java-compareTo
  function cmp(a, b) {
    for (var i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a.charCodeAt(i) - b.charCodeAt(i);
    return a.length - b.length;
  }

  // 1. String-aðferðir
  B.G.push(function strengjaAdferdir() {
    var w = pick(WORDS), n = w.length, b = rnd(1, n - 4), e = rnd(b + 1, Math.min(n, b + 6));
    var ch = w.charAt(rnd(1, n - 2)), ch2 = pick(["z", "q", "x", w.charAt(rnd(0, n - 1)).toLowerCase()]);
    var src = "String s = " + jstr(w) + ";\nSystem.out.println(s.length());\nSystem.out.println(s.charAt(" + b + "));\nSystem.out.println(s.substring(" + b + ", " + e + "));\nSystem.out.println(s.indexOf('" + ch + "'));\nSystem.out.println(s.indexOf(\"" + ch2 + "\"));\nSystem.out.println(s.charAt(s.length() - 1));";
    var ans = [n, w.charAt(b), w.substring(b, e), w.indexOf(ch), w.indexOf(ch2), w.charAt(n - 1)].join("\n");
    return { topic: T, title: "String-aðferðir", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: ans, multi: true,
      sol: "<p>Vísar byrja í 0. <code>substring(" + b + ", " + e + ")</code> tekur stafi " + b + " til " + (e - 1) + " (" + (e - b) + " stafi). <code>indexOf</code> skilar fyrsta sæti eða −1 ef ekkert finnst (hástafir og lágstafir eru ólíkir stafir). Síðasti stafurinn er í sæti <code>length() - 1</code>.</p>",
      java: { main: src } };
  });

  // 2. Reikningur með char
  B.G.push(function charReikningur() {
    var c = String.fromCharCode(rnd(97, 118)), k = rnd(1, 4), d = rnd(1, 9);
    var cc = c.charCodeAt(0);
    var items = [
      ["c + " + k, String(cc + k)],
      ["(char) (c + " + k + ")", String.fromCharCode(cc + k)],
      ["\"\" + c + " + k, c + k],
      ["c + " + k + " + \"\"", String(cc + k)],
      ["'" + d + "' - '0'", String(d)],
      ["(char) (c - 32)", String.fromCharCode(cc - 32)],
      ["Character.toUpperCase(c)", c.toUpperCase()],
      ["c + 'a'", String(cc + 97)],
      ["(int) c", String(cc)],
    ];
    var f = B.shuffle(items).slice(0, 4);
    var src = "char c = '" + c + "';   // '" + c + "' hefur kóðann " + cc + "\n" + f.map(function (x) { return "System.out.println(" + x[0] + ");"; }).join("\n");
    return { topic: T, title: "Reiknað með char", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: f.map(function (x) { return x[1]; }).join("\n"), multi: true,
      sol: "<p>char + int (eða char + char) er <b>int</b>, svo tala prentast. Kast með <code>(char)</code> breytir aftur í staf. Ef strengur kemur fyrst (<code>\"\" + c</code>) er skeytt saman. Lágstafur − 32 er samsvarandi hástafur og <code>'7' - '0'</code> er talan 7.</p>",
      java: { main: src } };
  });

  // 3. compareTo og equals
  B.G.push(function compareToEquals() {
    var pairs = [["apple", "apricot"], ["Card", "card"], ["uno", "unogame"], ["zebra", "Zebra"], ["java", "javascript"], ["pile", "pole"], ["ab", "b"], ["Snake", "Ladder"]];
    var p = pick(pairs), a = p[0], b = p[1];
    if (Math.random() < 0.5) { a = p[1]; b = p[0]; }
    var src = "String a = " + jstr(a) + ";\nString b = " + jstr(b) + ";\nSystem.out.println(a.compareTo(b));\nSystem.out.println(a.equals(b));\nSystem.out.println(a.equalsIgnoreCase(b));\nSystem.out.println(a.compareTo(b) < 0 ? a : b);";
    var r = cmp(a, b);
    var ans = [r, a === b, a.toLowerCase() === b.toLowerCase(), r < 0 ? a : b].join("\n");
    return { topic: T, title: "compareTo og equals", text: "<p>Hvað prentar kóðinn? (Kóðar: 'A' = 65, 'Z' = 90, 'a' = 97, 'z' = 122.)</p>" + code(src), answer: ans, multi: true,
      sol: "<p><code>compareTo</code> ber saman staf fyrir staf og skilar <b>mismun kóðanna</b> við fyrsta ólíka stafinn; ef annar strengurinn er forskeyti hins skilar hún <b>mismun lengdanna</b>. Hér: " + r + ". Neikvætt þýðir að a kemur á undan b í „orðabókarröð“ Unicode (hástafir á undan lágstöfum).</p>",
      java: { main: src } };
  });

  // 4. Óbreytanleiki
  B.G.push(function obreytanleiki() {
    var w = pick(["uno", "java", "stack", "pile", "card"]), w2 = pick(["Game", "Deck", "Play"]);
    var src = "String s = " + jstr(w) + ";\ns.toUpperCase();\ns.concat(" + jstr(w2) + ");\nSystem.out.println(s);\nString t = s.toUpperCase() + s.length();\ns = s + " + jstr(w2) + ";\nSystem.out.println(t);\nSystem.out.println(s.replace('a', '@'));\nSystem.out.println(s);";
    var s = w + w2;
    var ans = [w, w.toUpperCase() + w.length, s.split("a").join("@"), s].join("\n");
    return { topic: T, title: "Strengir breytast ekki", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: ans, multi: true,
      sol: "<p>String-aðferðir skila <b>nýjum</b> streng og breyta aldrei strengnum sjálfum. Línur 2 og 3 gera því ekkert sem sést. Aðeins gildisveiting (<code>s = …</code>) lætur s vísa á nýjan streng; <code>replace</code> í prentuninni breytir s ekki heldur.</p>",
      java: { main: src } };
  });

  // 5. printf
  B.G.push(function printfSnid() {
    var n = rnd(5, 999), x = rnd(1000, 99999) / 1000, w = pick(["UNO", "Java", "Card", "Pile"]);
    var m = Math.round(x * 1000);
    while (m % 10 === 5 || m % 100 === 50 || m % 10 === 0) m++;   // forðast námundun á mörkum
    x = m / 1000;
    var pad = function (s, k, left) { s = String(s); while (s.length < k) s = left ? s + " " : " " + s; return s; };
    var f2 = x.toFixed(2), f1 = x.toFixed(1);
    var src = "int n = " + n + ";\ndouble x = " + x + ";\nString w = " + jstr(w) + ";\nSystem.out.printf(\"[%5d]%n\", n);\nSystem.out.printf(\"[%.2f]%n\", x);\nSystem.out.printf(\"[%-6s][%8.1f]%n\", w, x);\nSystem.out.println(String.format(\"%s=%d\", w, n));";
    var ans = ["[" + pad(n, 5) + "]", "[" + f2 + "]", "[" + pad(w, 6, true) + "][" + pad(f1, 8) + "]", w + "=" + n].join("\n");
    return { topic: T, title: "printf og format", text: "<p>Hvað prentar kóðinn? Bil skipta máli, en ekki bil aftast í línu.</p>" + code(src), answer: ans, multi: true,
      sol: "<p><code>%5d</code>: heiltala hægrijöfnuð í 5 sæti. <code>%.2f</code>: 2 aukastafir, námundað. <code>%-6s</code>: strengur vinstrijafnaður í 6 sæti. <code>%8.1f</code>: 1 aukastafur, hægrijafnað í 8 sæti. <code>%n</code> er línuskil.</p>",
      java: { main: src } };
  });

  B.MC.push(
    { topic: T, q: "<code>String s = \"UNO\";</code> Hvað skilar <code>s.charAt(3)</code>?", o: ["Kastar StringIndexOutOfBoundsException", "'O'", "' ' (bil)", "null"], c: 0, e: "Vísarnir eru 0, 1 og 2. charAt(3) er utan strengsins. Síðasti stafurinn er charAt(s.length() - 1)." },
    { topic: T, q: "Hvað skilar <code>\"Halló\".substring(1, 3)</code>?", o: ["\"al\"", "\"all\"", "\"Ha\"", "\"alló\""], c: 0, e: "substring(b, e) tekur stafi b til e − 1: sæti 1 ('a') og 2 ('l')." },
    { topic: T, q: "Hvað skilar <code>\"banana\".indexOf(\"x\")</code>?", o: ["-1", "0", "6", "Kastar villu"], c: 0, e: "indexOf skilar −1 þegar ekkert finnst." },
    { topic: T, q: "Hvað skilar <code>\"banana\".lastIndexOf('a')</code>?", o: ["5", "1", "3", "6"], c: 0, e: "b0 a1 n2 a3 n4 a5: síðasta 'a' er í sæti 5." },
    { topic: T, q: "Hvað prentar <code>System.out.println('a' + 1);</code>?", o: ["98", "b", "a1", "Þýðingarvilla"], c: 0, e: "char + int er int: 97 + 1 = 98. (char) ('a' + 1) myndi prenta b." },
    { topic: T, q: "Hvað prentar <code>System.out.println('a' + 'b');</code>?", o: ["195", "ab", "\"ab\"", "Þýðingarvilla"], c: 0, e: "Tveir char eru lagðir saman sem tölur: 97 + 98 = 195. Til að skeyta saman: \"\" + 'a' + 'b'." },
    { topic: T, q: "Hvernig færðu töluna 7 úr stafnum <code>'7'</code>?", o: ["<code>'7' - '0'</code>", "<code>(int) '7'</code>", "<code>Integer.parseInt('7')</code>", "<code>'7' + 0</code>"], c: 0, e: "Tölustafirnir hafa samfellda kóða (48-57), svo '7' − '0' = 55 − 48 = 7. (int) '7' er 55." },
    { topic: T, q: "<code>String s = \"java\"; s.toUpperCase(); System.out.println(s);</code> Hvað prentast?", o: ["java", "JAVA", "Java", "Þýðingarvilla"], c: 0, e: "Strengir eru óbreytanlegir. toUpperCase skilar nýjum streng sem hér glatast. Rétt: s = s.toUpperCase();" },
    { topic: T, q: "Hvers vegna á ekki að bera saman strengi með <code>==</code>?", o: ["== ber saman tilvísanir (sama hlut), ekki innihald", "== er bannað á strengjum (þýðingarvilla)", "== hunsar hástafi", "== ber bara saman fyrsta stafinn"], c: 0, e: "Tveir ólíkir String-hlutir með sömu stöfum gefa false með ==. equals ber saman stafina." },
    { topic: T, q: "Hvað skilar <code>\"Card\".compareTo(\"card\")</code>?", o: ["Neikvæða tölu (-32)", "0", "Jákvæða tölu", "true"], c: 0, e: "'C' (67) − 'c' (99) = −32. Hástafir koma á undan lágstöfum. equalsIgnoreCase væri true." },
    { topic: T, q: "Hvað skilar <code>\"uno\".compareTo(\"unogame\")</code>?", o: ["-4", "0", "4", "-1"], c: 0, e: "Fyrstu þrír stafirnir eru eins og \"uno\" klárast fyrst, svo útkoman er mismunur lengdanna: 3 − 7 = −4." },
    { topic: T, q: "Hvað gerir <code>Integer.parseInt(\"12\") + 1</code>?", o: ["13", "121", "\"121\"", "Þýðingarvilla"], c: 0, e: "parseInt breytir strengnum í töluna 12; svo er lagt saman." },
    { topic: T, q: "Hvað prentar <code>System.out.printf(\"%.1f\", 2.36);</code>?", o: ["2.4", "2.3", "2.36", "2"], c: 0, e: "%.1f námundar að einum aukastaf: 2,36 → 2,4." },
    { topic: T, q: "Hvað prentar <code>System.out.printf(\"[%4d]\", 7);</code>?", o: ["[   7]", "[7   ]", "[0007]", "[7]"], c: 0, e: "Talan er hægrijöfnuð í 4 sæta reit. %-4d væri vinstrijafnað." },
    { topic: T, q: "Hvaða aðferð skilar fjölda stafa í strengnum s?", o: ["<code>s.length()</code>", "<code>s.length</code>", "<code>s.size()</code>", "<code>length(s)</code>"], c: 0, e: "Fyrir strengi er length() aðferð með svigum. Fyrir fylki er length eigindi án sviga (kafli 7)." },
    { topic: T, q: "Hvað skilar <code>Character.isDigit('x')</code>?", o: ["false", "true", "0", "'x'"], c: 0, e: "isDigit er true aðeins fyrir tölustafi '0'-'9' (og aðra Unicode-tölustafi)." },
    { topic: T, q: "<code>char c = 'y'; c++;</code> Hvað er c?", o: ["'z'", "122", "'y'", "Þýðingarvilla"], c: 0, e: "++ og += á char halda tagi char (kastið er innbyggt). c + 1 væri hins vegar int." },
    { topic: T, q: "Hvað skilar <code>\"  UNO \".trim().length()</code>?", o: ["3", "6", "4", "5"], c: 0, e: "trim fjarlægir bil (og önnur auð tákn) í báðum endum: \"UNO\" hefur 3 stafi." },
    { topic: T, q: "Hvað prentar <code>System.out.println(\"abc\".replace('b', 'B') + \"abc\".toUpperCase().charAt(0));</code>?", o: ["aBcA", "aBc65", "ABCA", "aBca"], c: 0, e: "replace gefur \"aBc\" og \"ABC\".charAt(0) er 'A'. Strengur + char er samskeyting." },
    { topic: T, q: "Hver er kóði <code>'A'</code> og <code>'a'</code>?", o: ["65 og 97", "97 og 65", "1 og 27", "0 og 32"], c: 0, e: "Hástafir byrja í 65, lágstafir í 97; munurinn er 32." }
  );
})();

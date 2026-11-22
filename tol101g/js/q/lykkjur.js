/* q/lykkjur.js – kafli 5: Lykkjur (Liang kafli 5). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, code = B.code;
  var T = "lykkjur";

  // 1. for-lykkja með summu
  B.G.push(function forSumma() {
    var a = rnd(0, 5), b = rnd(8, 20), k = rnd(1, 4), le = Math.random() < 0.5;
    var src = "int sum = 0;\nint count = 0;\nfor (int i = " + a + "; i " + (le ? "<=" : "<") + " " + b + "; i += " + k + ") {\n    sum += i;\n    count++;\n}\nSystem.out.println(count + \" \" + sum);";
    var s = 0, c = 0;
    for (var i = a; le ? i <= b : i < b; i += k) { s += i; c++; }
    return { topic: T, title: "for-lykkja", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: c + " " + s,
      sol: "<p>i tekur gildin " + a + ", " + (a + k) + ", " + (a + 2 * k) + " … á meðan i " + (le ? "&le;" : "&lt;") + " " + b + ". Það eru " + c + " umferðir og summan er " + s + ".</p>",
      java: { main: src } };
  });

  // 2. while með tölustöfum
  B.G.push(function whileTolustafir() {
    var n = rnd(100, 99999);
    var src = "int n = " + n + ";\nint sum = 0;\nint rev = 0;\nint steps = 0;\nwhile (n > 0) {\n    int d = n % 10;\n    sum += d;\n    rev = rev * 10 + d;\n    n /= 10;\n    steps++;\n}\nSystem.out.println(sum + \" \" + rev + \" \" + steps + \" \" + n);";
    var m = n, s = 0, r = 0, st = 0;
    while (m > 0) { var d = m % 10; s += d; r = r * 10 + d; m = Math.floor(m / 10); st++; }
    return { topic: T, title: "while og tölustafir", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: s + " " + r + " " + st + " " + m,
      sol: "<p><code>n % 10</code> er síðasti tölustafurinn og <code>n /= 10</code> hendir honum. Lykkjan fer einu sinni fyrir hvern tölustaf (" + st + " sinnum), summan er " + s + ", talan afturábak er " + r + " (núll fremst hverfa) og n er 0 í lokin.</p>",
      java: { main: src } };
  });

  // 3. Hreiðraðar lykkjur (mynstur)
  B.G.push(function hreidradarLykkjur() {
    var n = rnd(3, 5), v = pick([0, 1, 2]), src, out = [];
    if (v === 0) {
      src = "for (int i = 1; i <= " + n + "; i++) {\n    for (int j = 1; j <= i; j++) {\n        System.out.print(j);\n    }\n    System.out.println();\n}";
      for (var i = 1; i <= n; i++) { var l = ""; for (var j = 1; j <= i; j++) l += j; out.push(l); }
    } else if (v === 1) {
      src = "for (int i = " + n + "; i >= 1; i--) {\n    for (int j = 0; j < i; j++) {\n        System.out.print(\"*\");\n    }\n    System.out.println(i);\n}";
      for (var i2 = n; i2 >= 1; i2--) { var l2 = ""; for (var j2 = 0; j2 < i2; j2++) l2 += "*"; out.push(l2 + i2); }
    } else {
      src = "for (int i = 1; i <= " + n + "; i++) {\n    for (int j = 1; j <= " + n + "; j++) {\n        System.out.print(i * j % " + n + " == 0 ? \"#\" : \".\");\n    }\n    System.out.println();\n}";
      for (var i3 = 1; i3 <= n; i3++) { var l3 = ""; for (var j3 = 1; j3 <= n; j3++) l3 += (i3 * j3) % n === 0 ? "#" : "."; out.push(l3); }
    }
    return { topic: T, title: "Hreiðraðar lykkjur", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: out.join("\n"), multi: true,
      sol: "<p>Innri lykkjan keyrir allar sínar umferðir fyrir hverja umferð ytri lykkjunnar. <code>print</code> skrifar í sömu línu og <code>println</code> lokar línunni í lok hverrar ytri umferðar.</p>",
      java: { main: src } };
  });

  // 4. break og continue
  B.G.push(function breakContinue() {
    var n = rnd(10, 16), k = rnd(2, 4), m = rnd(5, n - 2);
    var src = "for (int i = 1; i <= " + n + "; i++) {\n    if (i % " + k + " == 0) {\n        continue;\n    }\n    if (i > " + m + ") {\n        break;\n    }\n    System.out.print(i + \" \");\n}\nSystem.out.println(\"!\");";
    var o = "";
    for (var i = 1; i <= n; i++) { if (i % k === 0) continue; if (i > m) break; o += i + " "; }
    return { topic: T, title: "break og continue", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: o + "!",
      sol: "<p><code>continue</code> sleppir margfeldum af " + k + " (uppfærslan i++ keyrir samt). <code>break</code> hættir í lykkjunni við fyrstu tölu sem er stærri en " + m + " og er ekki margfeldi af " + k + ".</p>",
      java: { main: src } };
  });

  // 5. Margföldun í while
  B.G.push(function whileMargfoldun() {
    var a = rnd(1, 3), f = rnd(2, 3), lim = rnd(20, 120);
    var src = "int a = " + a + ", b = 0;\nwhile (a < " + lim + ") {\n    b += a;\n    a *= " + f + ";\n}\nSystem.out.println(a + \" \" + b);";
    var x = a, y = 0; while (x < lim) { y += x; x *= f; }
    return { topic: T, title: "Rekja while", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: x + " " + y,
      sol: "<p>Gerðu töflu: í hverri umferð bætist a við b og svo er a margfaldað með " + f + ". Lykkjan hættir þegar a er orðið " + lim + " eða meira, svo a = " + x + " og b = " + y + ".</p>",
      java: { main: src } };
  });

  // 6. do-while keyrir einu sinni
  B.G.push(function doWhile() {
    var x = rnd(5, 30), lim = rnd(1, 20);
    var src = "int x = " + x + ";\nint count = 0;\ndo {\n    x -= 4;\n    count++;\n} while (x > " + lim + ");\nSystem.out.println(x + \" \" + count);";
    var v = x, c = 0; do { v -= 4; c++; } while (v > lim);
    return { topic: T, title: "do-while", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: v + " " + c,
      sol: "<p>do-while prófar skilyrðið <b>eftir</b> umferðina, svo hún keyrir minnst einu sinni (líka þótt x &gt; " + lim + " sé ósatt í upphafi).</p>",
      java: { main: src } };
  });

  // 7. Fjöldi umferða (tölulegt svar)
  B.G.push(function fjoldiUmferda() {
    var n = rnd(4, 9), m = rnd(3, 8), v = pick([0, 1, 2]), src, cnt = 0;
    if (v === 0) { src = "int count = 0;\nfor (int i = 0; i < " + n + "; i++) {\n    for (int j = 0; j < " + m + "; j++) {\n        count++;\n    }\n}\nSystem.out.println(count);"; cnt = n * m; }
    else if (v === 1) { src = "int count = 0;\nfor (int i = 0; i < " + n + "; i++) {\n    for (int j = i; j < " + n + "; j++) {\n        count++;\n    }\n}\nSystem.out.println(count);"; for (var i = 0; i < n; i++) for (var j = i; j < n; j++) cnt++; }
    else { var lim = rnd(50, 500); src = "int count = 0;\nfor (int i = 1; i < " + lim + "; i *= 2) {\n    count++;\n}\nSystem.out.println(count);"; for (var k = 1; k < lim; k *= 2) cnt++; }
    return { topic: T, title: "Fjöldi umferða", text: "<p>Hvaða tölu prentar kóðinn?</p>" + code(src), answer: cnt, absTol: 0,
      sol: "<p>" + (v === 0 ? "Innri lykkjan fer " + m + " sinnum fyrir hverja af " + n + " ytri umferðum: " + n + " · " + m + " = " + cnt + "." : v === 1 ? "Innri lykkjan fer " + n + ", " + (n - 1) + ", …, 1 sinnum: summan er " + n + "·" + (n + 1) + "/2 = " + cnt + "." : "i tvöfaldast: 1, 2, 4, 8, … á meðan i er minna en mörkin, svo " + cnt + " umferðir.") + "</p>",
      java: { main: src } };
  });

  B.MC.push(
    { topic: T, q: "Hve oft keyrir <code>for (int i = 0; i &lt; 10; i++)</code>?", o: ["10 sinnum", "9 sinnum", "11 sinnum", "Endalaust"], c: 0, e: "i = 0, 1, …, 9: tíu gildi. Fjöldinn er b − a fyrir i < b." },
    { topic: T, q: "Hve oft keyrir <code>for (int i = 1; i &lt;= 10; i += 3)</code>?", o: ["4 sinnum", "3 sinnum", "10 sinnum", "5 sinnum"], c: 0, e: "i = 1, 4, 7, 10. Næsta gildi, 13, uppfyllir ekki skilyrðið." },
    { topic: T, q: "Hver er munurinn á <code>while</code> og <code>do-while</code>?", o: ["do-while keyrir líkamann að minnsta kosti einu sinni", "while keyrir að minnsta kosti einu sinni", "do-while getur ekki notað break", "Enginn munur"], c: 0, e: "do-while prófar skilyrðið eftir umferðina; while prófar það fyrst og getur því keyrt 0 sinnum." },
    { topic: T, q: "Hvað prentar <code>int i = 5; while (i &lt; 5) { i++; } System.out.println(i);</code>?", o: ["5", "6", "4", "Ekkert, endalaus lykkja"], c: 0, e: "Skilyrðið er ósatt strax, svo lykkjan keyrir aldrei." },
    { topic: T, q: "Hvað gerir <code>continue</code> í for-lykkju?", o: ["Sleppir afganginum af umferðinni; uppfærslan og skilyrðið eru keyrð næst", "Hættir í lykkjunni", "Byrjar lykkjuna upp á nýtt frá i = 0", "Hættir í aðferðinni"], c: 0, e: "continue hoppar í lok líkamans. Í for-lykkju er uppfærslan (i++) svo keyrð og skilyrðið prófað." },
    { topic: T, q: "<code>break</code> er inni í innri lykkju tveggja hreiðraðra lykkja. Hvað gerist?", o: ["Aðeins innri lykkjan hættir; sú ytri heldur áfram", "Báðar lykkjurnar hætta", "Forritið hættir", "Þýðingarvilla"], c: 0, e: "break hættir í innstu lykkjunni (eða switch) sem það er í." },
    { topic: T, q: "Hvað er að <code>for (int i = 0; i &lt; 5; i++); { System.out.println(i); }</code>?", o: ["Semíkomman gerir líkamann tóman og i er óþekkt í blokkinni: þýðingarvilla", "Ekkert, prentar 0-4", "Prentar 5", "Endalaus lykkja"], c: 0, e: "Lykkjan hefur tóma setningu sem líkama. Blokkin á eftir er utan lykkjunnar, þar sem i (lýst í for-hausnum) er ekki til." },
    { topic: T, q: "Hvaða lykkja er endalaus?", o: ["<code>for (int i = 0; i &lt; 10; i--)</code>", "<code>for (int i = 10; i &gt; 0; i--)</code>", "<code>for (int i = 0; i &lt; 10; i += 2)</code>", "<code>for (int i = 0; i != 10; i++)</code>"], c: 0, e: "i minnkar: 0, −1, −2, … og verður aldrei 10 eða meira. (Tæknilega flæðir hún yfir eftir 2 milljarða umferða, en í reynd er hún endalaus.)" },
    { topic: T, q: "Hvaða lykkja hentar best til að lesa tölu þar til notandinn slær inn löglegt gildi?", o: ["do-while", "for", "for-each", "switch"], c: 0, e: "Það þarf alltaf að lesa að minnsta kosti einu sinni og prófa svo: do { roll = input.nextInt(); } while (roll < 1 || roll > 6);" },
    { topic: T, q: "Hvar er breytan <code>i</code> til í <code>for (int i = 0; i &lt; n; i++) { … }</code>?", o: ["Aðeins inni í lykkjunni (haus og líkama)", "Alls staðar í aðferðinni", "Alls staðar í klasanum", "Aðeins í hausnum"], c: 0, e: "Breyta sem lýst er í for-hausnum hefur svið (scope) lykkjunnar. Ef þú þarft gildið eftir lykkjuna skaltu lýsa henni fyrir ofan." },
    { topic: T, q: "Hve oft keyrir innri setningin? <code>for (i = 0; i &lt; 4; i++) for (j = 0; j &lt; 3; j++) x++;</code>", o: ["12", "7", "16", "9"], c: 0, e: "Fyrir hverja af 4 ytri umferðum fer innri lykkjan 3 sinnum: 4 · 3 = 12." },
    { topic: T, q: "Hvað prentar <code>int s = 0; for (int i = 1; i &lt;= 4; i++) s += i; System.out.println(s);</code>?", o: ["10", "4", "6", "15"], c: 0, e: "Án slaufusviga er s += i líkami lykkjunnar: 1 + 2 + 3 + 4 = 10." },
    { topic: T, q: "Lykkja á að fara yfir alla stafi strengsins s. Hvaða haus er réttur?", o: ["<code>for (int i = 0; i &lt; s.length(); i++)</code>", "<code>for (int i = 0; i &lt;= s.length(); i++)</code>", "<code>for (int i = 1; i &lt;= s.length(); i++)</code>", "<code>for (int i = 1; i &lt; s.length(); i++)</code>"], c: 0, e: "Vísarnir eru 0 … length() − 1. <= myndi reyna charAt(length()) og kasta villu; að byrja í 1 sleppir fyrsta stafnum." },
    { topic: T, q: "Hvaða lykkja er venjulega notuð þegar fjöldi umferða er þekktur fyrirfram?", o: ["for", "while", "do-while", "Engin, nota break"], c: 0, e: "for safnar frumstillingu, skilyrði og uppfærslu teljarans á einn stað." },
    { topic: T, q: "Hvað prentar <code>int n = 1; while (n &lt; 100) n *= 3; System.out.println(n);</code>?", o: ["243", "81", "99", "100"], c: 0, e: "n: 1, 3, 9, 27, 81, 243. Þegar n = 243 er skilyrðið ósatt og lykkjan hættir." },
    { topic: T, q: "Hver er tilgangur vaktgildis (sentinel) í inntakslykkju?", o: ["Sérstakt gildi sem merkir að inntakinu sé lokið", "Teljari fyrir fjölda umferða", "Breyta sem geymir stærsta gildið", "Gildi sem kemur í veg fyrir endalausa lykkju í for"], c: 0, e: "Til dæmis: lesa tölur og leggja saman þar til notandinn slær inn 0." },
    { topic: T, q: "Hvað prentar <code>for (int i = 0; i &lt; 3; i++) { for (int j = 0; j &lt; 2; j++) System.out.print(i); }</code>?", o: ["001122", "012012", "010101", "0011"], c: 0, e: "Fyrir hvert i er i prentað tvisvar (j = 0 og j = 1): 00, 11, 22." },
    { topic: T, q: "Hvað gerir <code>do { … } while (true);</code> í Snakes &amp; Ladders?", o: ["Endalaus leikjalykkja sem break rýfur þegar einhver vinnur", "Keyrir einu sinni", "Þýðingarvilla", "Keyrir aldrei"], c: 0, e: "Skilyrðið er alltaf satt; lykkjan endar aðeins á break inni í henni (sigurskilyrðið)." }
  );
})();

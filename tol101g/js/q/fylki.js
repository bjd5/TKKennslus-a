/* q/fylki.js – kafli 7: Fylki (Liang kaflar 7 og 8). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, code = B.code, D = B.dedent;
  var T = "fylki";
  var ts = function (a) { return "[" + a.join(", ") + "]"; };
  var arr = function (n, lo, hi) { var a = []; for (var i = 0; i < n; i++) a.push(rnd(lo, hi)); return a; };
  var lit = function (a) { return "{" + a.join(", ") + "}"; };

  // 1. Lykkja sem breytir fylki
  B.G.push(function lykkjaBreytirFylki() {
    var a = arr(rnd(5, 6), 1, 9), v = pick([0, 1, 2, 3]), src, b = a.slice();
    if (v === 0) { src = "for (int i = 1; i < a.length; i++) {\n    a[i] = a[i] + a[i - 1];\n}"; for (var i = 1; i < b.length; i++) b[i] = b[i] + b[i - 1]; }
    else if (v === 1) { src = "for (int i = a.length - 2; i >= 0; i--) {\n    a[i] = a[i + 1] - a[i];\n}"; for (var j = b.length - 2; j >= 0; j--) b[j] = b[j + 1] - b[j]; }
    else if (v === 2) { src = "int first = a[0];\nfor (int i = 1; i < a.length; i++) {\n    a[i - 1] = a[i];\n}\na[a.length - 1] = first;"; var f = b[0]; for (var k = 1; k < b.length; k++) b[k - 1] = b[k]; b[b.length - 1] = f; }
    else { src = "for (int i = 0; i < a.length / 2; i++) {\n    int t = a[i];\n    a[i] = a[a.length - 1 - i];\n    a[a.length - 1 - i] = t;\n}"; b.reverse(); }
    var main = "int[] a = " + lit(a) + ";\n" + src + "\nSystem.out.println(Arrays.toString(a));";
    return { topic: T, title: "Lykkja yfir fylki", text: "<p>Hvað prentar kóðinn?</p>" + code(main), answer: ts(b),
      sol: "<p>" + ["Hvert stak verður summan af sér og <b>nýja</b> gildinu á undan (uppsöfnuð summa), því a[i − 1] hefur þegar verið uppfært.", "Farið er aftan frá, svo a[i + 1] er þegar uppfært þegar a[i] er reiknað.", "Öllu er hliðrað um eitt sæti til vinstri og fyrsta stakið fer aftast.", "Stökum er víxlað frá endunum inn að miðju, svo fylkinu er snúið við."][v] + "</p>",
      java: { main: main } };
  });

  // 2. Tilvísanir (aliasing)
  B.G.push(function tilvisanir() {
    var a = arr(3, 2, 9), x = rnd(2, 9), k = rnd(2, 3);
    var main = "int[] c = " + lit(a) + ";\nint[] d = c;\nint[] e = Arrays.copyOf(c, c.length);\nd[0] = d[0] * " + k + ";\ne[1] = " + x + ";\nint n = c[2];\nn++;\nSystem.out.println(c[0] + \" \" + c[1] + \" \" + c[2]);\nSystem.out.println(d[0] + \" \" + e[0] + \" \" + e[1]);\nSystem.out.println((c == d) + \" \" + (c == e) + \" \" + Arrays.equals(d, e));";
    var c0 = a[0] * k;
    var ans = [c0 + " " + a[1] + " " + a[2], c0 + " " + a[0] + " " + x, "true false " + (c0 === a[0] && x === a[1] ? "true" : "false")].join("\n");
    return { topic: T, title: "Tilvísanir", text: "<p>Hvað prentar kóðinn?</p>" + code(main), answer: ans, multi: true,
      sol: "<p><code>d = c</code> afritar <b>tilvísunina</b>: c og d eru sama fylkið, svo d[0] = … sést í c. <code>Arrays.copyOf</code> býr til <b>nýtt</b> fylki, svo breyting á e hefur ekki áhrif á c. <code>n</code> er afrit af gildi (int), svo n++ breytir ekki c[2]. <code>==</code> spyr hvort tilvísanirnar séu eins; <code>Arrays.equals</code> ber saman innihaldið.</p>",
      java: { main: main } };
  });

  // 3. Fylki í aðferðum
  B.G.push(function fylkiIAdferdum() {
    var a = arr(3, 1, 9), k = rnd(2, 4);
    var members = D("\n  static void scale(int[] x, int k) {\n      for (int i = 0; i < x.length; i++) {\n          x[i] *= k;\n      }\n      k = 0;\n  }\n  static void reset(int[] x) {\n      x = new int[x.length];\n      x[0] = 99;\n  }\n  static int[] plusOne(int[] x) {\n      int[] y = new int[x.length];\n      for (int i = 0; i < x.length; i++) {\n          y[i] = x[i] + 1;\n      }\n      return y;\n  }\n");
    var main = "int[] a = " + lit(a) + ";\nint k = " + k + ";\nscale(a, k);\nreset(a);\nint[] b = plusOne(a);\nSystem.out.println(Arrays.toString(a) + \" \" + k);\nSystem.out.println(Arrays.toString(b));";
    var s = a.map(function (v) { return v * k; });
    var ans = ts(s) + " " + k + "\n" + ts(s.map(function (v) { return v + 1; }));
    return { topic: T, title: "Fylki sem færibreytur", text: "<p>Hvað prentar kóðinn?</p>" + code(members + "\n// í main:\n" + main), answer: ans, multi: true,
      sol: "<p><code>scale</code> fær tilvísun á sama fylkið og breytir innihaldinu, en <code>k = 0</code> breytir bara afritinu. <code>reset</code> lætur sína færibreytu vísa á <b>nýtt</b> fylki, sem hefur engin áhrif á a í main. <code>plusOne</code> býr til og skilar nýju fylki.</p>",
      java: { main: main, members: members } };
  });

  // 4. for-each breytir ekki fylkinu
  B.G.push(function forEach() {
    var a = arr(4, 1, 9);
    var main = "int[] a = " + lit(a) + ";\nint sum = 0;\nfor (int x : a) {\n    x = x * 2;\n    sum += x;\n}\nint max = a[0];\nfor (int x : a) {\n    if (x > max) max = x;\n}\nSystem.out.println(sum + \" \" + max + \" \" + Arrays.toString(a));";
    var sum = a.reduce(function (s, v) { return s + 2 * v; }, 0);
    return { topic: T, title: "for-each", text: "<p>Hvað prentar kóðinn?</p>" + code(main), answer: sum + " " + Math.max.apply(null, a) + " " + ts(a),
      sol: "<p>Í for-each er <code>x</code> <b>afrit</b> af hverju staki. <code>x = x * 2</code> breytir bara afritinu (summan verður tvöföld), en fylkið sjálft er óbreytt.</p>",
      java: { main: main } };
  });

  // 5. Tvívíð fylki
  B.G.push(function tvividFylki() {
    var R = 3, C = rnd(3, 4), m = [];
    for (var r = 0; r < R; r++) m.push(arr(C, 0, 9));
    var row = rnd(0, R - 1), col = rnd(0, C - 1);
    var main = "int[][] m = {" + m.map(lit).join(",\n             ") + "};\nint rowSum = 0, colSum = 0, diag = 0;\nfor (int c = 0; c < m[" + row + "].length; c++) rowSum += m[" + row + "][c];\nfor (int r = 0; r < m.length; r++) colSum += m[r][" + col + "];\nfor (int i = 0; i < m.length; i++) diag += m[i][i];\nSystem.out.println(m.length + \" \" + m[0].length + \" \" + m[" + (R - 1) + "][" + (C - 1) + "]);\nSystem.out.println(rowSum + \" \" + colSum + \" \" + diag);";
    var rs = m[row].reduce(function (s, v) { return s + v; }, 0), cs = 0, dg = 0;
    for (var i = 0; i < R; i++) { cs += m[i][col]; dg += m[i][i]; }
    return { topic: T, title: "Tvívítt fylki", text: "<p>Hvað prentar kóðinn?</p>" + code(main), answer: R + " " + C + " " + m[R - 1][C - 1] + "\n" + rs + " " + cs + " " + dg, multi: true,
      sol: "<p><code>m.length</code> er fjöldi raða (" + R + ") og <code>m[0].length</code> fjöldi dálka (" + C + "). <code>m[r][c]</code> er röð r, dálkur c, bæði talið frá 0. Summa raðar " + row + " er " + rs + ", summa dálks " + col + " er " + cs + " og hornalínan m[0][0] + m[1][1] + m[2][2] er " + dg + ".</p>",
      java: { main: main } };
  });

  // 6. Talning í fylki
  B.G.push(function talning() {
    var rolls = arr(rnd(8, 12), 1, 6);
    var main = "int[] rolls = " + lit(rolls) + ";\nint[] count = new int[7];\nfor (int r : rolls) {\n    count[r]++;\n}\nint best = 1;\nfor (int f = 2; f <= 6; f++) {\n    if (count[f] > count[best]) best = f;\n}\nSystem.out.println(Arrays.toString(count));\nSystem.out.println(best + \" \" + count[best]);";
    var cnt = [0, 0, 0, 0, 0, 0, 0]; rolls.forEach(function (r) { cnt[r]++; });
    var best = 1; for (var f = 2; f <= 6; f++) if (cnt[f] > cnt[best]) best = f;
    return { topic: T, title: "Tíðnitalning", text: "<p>Hvað prentar kóðinn?</p>" + code(main), answer: ts(cnt) + "\n" + best + " " + cnt[best], multi: true,
      sol: "<p>Gildið sjálft er notað sem vísir: <code>count[r]++</code> telur hversu oft hver tala kemur fyrir. Hólf 0 er aldrei notað. Við jafntefli vinnur minnsta talan því aðeins <code>&gt;</code> (ekki <code>&gt;=</code>) skiptir um.</p>",
      java: { main: main } };
  });

  B.MC.push(
    { topic: T, q: "<code>int[] a = new int[5];</code> Hvaða gildi hefur <code>a[4]</code>?", o: ["0", "null", "Ófrumstillt: þýðingarvilla", "5"], c: 0, e: "Nýtt fylki af tölum fær sjálfgefið gildið 0 í öll hólf. Vísarnir eru 0-4." },
    { topic: T, q: "<code>String[] s = new String[3];</code> Hvað er <code>s[0]</code>?", o: ["null", "\"\"", "\"null\"", "Þýðingarvilla"], c: 0, e: "Fylki af hlutum (t.d. String) fær null í öll hólf. Kall á s[0].length() myndi kasta NullPointerException." },
    { topic: T, q: "Hvernig færðu lengd fylkisins <code>a</code>?", o: ["<code>a.length</code>", "<code>a.length()</code>", "<code>a.size()</code>", "<code>length(a)</code>"], c: 0, e: "Fyrir fylki er length eigindi án sviga. Strengir nota length() aðferð." },
    { topic: T, q: "Hvað gerist við <code>int[] a = {1, 2, 3}; System.out.println(a[3]);</code>?", o: ["ArrayIndexOutOfBoundsException við keyrslu", "Prentar 0", "Þýðingarvilla", "Prentar 3"], c: 0, e: "Vísarnir eru 0, 1, 2. Þýðandinn athugar ekki vísa; villan kemur við keyrslu." },
    { topic: T, q: "<code>int[] a = {1, 2, 3}; int[] b = a; b[0] = 9;</code> Hvað er <code>a[0]</code>?", o: ["9", "1", "0", "Þýðingarvilla"], c: 0, e: "b = a afritar tilvísunina; a og b vísa á sama fylkið." },
    { topic: T, q: "Hvaða lína býr til sjálfstætt afrit af fylkinu <code>a</code>?", o: ["<code>int[] b = Arrays.copyOf(a, a.length);</code>", "<code>int[] b = a;</code>", "<code>int[] b = new int[a.length];</code>", "<code>int[] b = {a};</code>"], c: 0, e: "copyOf (eða clone() eða lykkja yfir nýtt fylki) afritar gildin. b = a afritar bara tilvísunina og new int[…] gefur fylki af núllum." },
    { topic: T, q: "Hvað prentar <code>System.out.println(new int[] {1, 2});</code>?", o: ["Eitthvað eins og [I@1b6d3586", "[1, 2]", "1 2", "12"], c: 0, e: "Fylki hafa ekki læsilegt toString; það prentast tag og kjötkássukóði. Notaðu Arrays.toString(a)." },
    { topic: T, q: "Hvað er rangt við <code>for (int x : a) { x = 0; }</code> ef markmiðið er að núllstilla fylkið?", o: ["x er afrit; fylkið breytist ekki", "Ekkert", "for-each má ekki nota á int[]", "Þýðingarvilla"], c: 0, e: "for-each gefur afrit af hverju staki. Til að skrifa í fylkið þarf vísinn: for (int i = 0; i < a.length; i++) a[i] = 0;" },
    { topic: T, q: "Aðferðin <code>static void f(int[] x) { x[0] = 5; }</code> er kölluð með <code>f(a)</code>. Hvað gerist við <code>a[0]</code>?", o: ["Það verður 5", "Það breytist ekki (gildisfærsla)", "Þýðingarvilla", "Keyrsluvilla"], c: 0, e: "Tilvísunin er afrituð, svo x og a vísa á sama fylkið. Breyting á innihaldi sést hjá þeim sem kallaði." },
    { topic: T, q: "Aðferðin <code>static void g(int[] x) { x = new int[3]; x[0] = 5; }</code> er kölluð með <code>g(a)</code>. Hvað gerist við a?", o: ["Ekkert; a vísar enn á gamla fylkið", "a[0] verður 5", "a verður fylki af núllum", "Þýðingarvilla"], c: 0, e: "x fær að vísa á nýtt fylki, en það er bara staðbundna afritið af tilvísuninni. a í main breytist ekki." },
    { topic: T, q: "<code>int[][] m = new int[3][5];</code> Hvað er <code>m.length</code> og <code>m[0].length</code>?", o: ["3 og 5", "5 og 3", "15 og 5", "3 og 3"], c: 0, e: "Fyrri talan er fjöldi raða (lengd ytra fylkisins), sú seinni fjöldi dálka í hverri röð." },
    { topic: T, q: "<code>int[][] t = {{1, 2, 3}, {4, 5, 6}};</code> Hvað er <code>t[1][0]</code>?", o: ["4", "2", "1", "5"], c: 0, e: "Röð 1 er {4, 5, 6} og dálkur 0 í henni er 4." },
    { topic: T, q: "Hvað er ójafnt fylki (ragged array)?", o: ["Tvívítt fylki þar sem raðirnar eru misstórar", "Fylki sem er ekki raðað", "Fylki með null-gildum", "Fylki af strengjum af mismunandi lengd"], c: 0, e: "Til dæmis int[][] tri = {{1}, {1, 1}, {1, 2, 1}}. Notaðu m[r].length í innri lykkjunni." },
    { topic: T, q: "Hvaða lykkjuhaus fer í gegnum öll stök fylkisins <code>a</code>?", o: ["<code>for (int i = 0; i &lt; a.length; i++)</code>", "<code>for (int i = 1; i &lt;= a.length; i++)</code>", "<code>for (int i = 0; i &lt;= a.length; i++)</code>", "<code>for (int i = 0; i &lt; a.length - 1; i++)</code>"], c: 0, e: "Vísarnir eru 0 … length − 1. Hinir sleppa staki eða fara út fyrir fylkið." },
    { topic: T, q: "Hvað gerir <code>Arrays.sort(a)</code>?", o: ["Raðar a í vaxandi röð (breytir fylkinu)", "Skilar nýju röðuðu fylki og a er óbreytt", "Raðar í minnkandi röð", "Prentar a raðað"], c: 0, e: "sort raðar fylkinu sjálfu á staðnum og skilar engu (void)." },
    { topic: T, q: "Í <code>int[] count = new int[7]; for (int r : rolls) count[r]++;</code>, hvað geymir <code>count[3]</code>?", o: ["Hversu oft 3 kom fyrir í rolls", "Þriðja kastið", "Summu kastanna upp að 3", "Alltaf 0"], c: 0, e: "Gildið r er notað sem vísir, svo hvert hólf telur tíðni sinnar tölu." },
    { topic: T, q: "Hvað skilar <code>c == d</code> fyrir tvö ólík fylki með sama innihaldi?", o: ["false", "true", "Þýðingarvilla", "Fer eftir innihaldinu"], c: 0, e: "== ber saman tilvísanir. Fyrir innihald: Arrays.equals(c, d)." },
    { topic: T, q: "Í Snakes &amp; Ladders er <code>int[] offset = new int[SQUARES + 1];</code>. Af hverju +1?", o: ["Reitirnir eru 1-100 og reitur 0 er byrjunarstaðan, svo þarf vísa 0-100", "Til öryggis ef einhver fer yfir 100", "Fylki í Java eru alltaf einu minni en beðið er um", "Fyrir sigurreitinn"], c: 0, e: "Með SQUARES + 1 = 101 hólfi eru vísarnir 0-100, svo offset[100] er löglegt." }
  );
})();

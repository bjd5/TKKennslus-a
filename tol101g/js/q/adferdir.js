/* q/adferdir.js – kafli 6: Aðferðir (Liang kafli 6). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, code = B.code, jd = B.jd;
  var T = "adferdir";
  var D = B.dedent;

  // 1. Gildisfærsla
  B.G.push(function gildisfaersla() {
    var n = rnd(2, 9), k = rnd(2, 5);
    var members = D("\n  public static int change(int x) {\n      x = x * " + k + ";\n      System.out.println(\"inni: \" + x);\n      return x + 1;\n  }\n");
    var main = "int n = " + n + ";\nint r = change(n);\nSystem.out.println(n + \" \" + r);\nchange(r);\nSystem.out.println(r);";
    var ans = ["inni: " + n * k, n + " " + (n * k + 1), "inni: " + (n * k + 1) * k, n * k + 1].join("\n");
    return { topic: T, title: "Gildisfærsla", text: "<p>Hvað prentar kóðinn?</p>" + code(members + "\n// í main:\n" + main), answer: ans, multi: true,
      sol: "<p>Gildið " + n + " er afritað í x; breytingin á x hefur engin áhrif á n. Skilagildið þarf að geyma (r = …) til að það nýtist; í seinna kallinu er því hent og r er óbreytt.</p>",
      java: { main: main, members: members } };
  });

  // 2. Röð kalla
  B.G.push(function rodKalla() {
    var a = rnd(1, 6), b = rnd(2, 6);
    var members = D("\n  static int f(int x) {\n      System.out.print(\"f\" + x + \" \");\n      return x + " + b + ";\n  }\n  static int g(int x) {\n      System.out.print(\"g\" + x + \" \");\n      return f(x) * 2;\n  }\n");
    var main = "int r = f(g(" + a + "));\nSystem.out.println(\"= \" + r);";
    var fr = function (x) { return x + b; };
    var g1 = fr(a) * 2, r = fr(g1);
    var ans = "g" + a + " f" + a + " f" + g1 + " = " + r;
    return { topic: T, title: "Röð kalla", text: "<p>Hvað prentar kóðinn?</p>" + code(members + "\n// í main:\n" + main), answer: ans,
      sol: "<p>Raungildi eru metin <b>áður</b> en aðferðin er kölluð, svo <code>g(" + a + ")</code> keyrir fyrst. Inni í g er f kölluð (f" + a + "), g skilar " + g1 + " og þá fyrst er ytra f kallað (f" + g1 + ").</p>",
      java: { main: main, members: members } };
  });

  // 3. Yfirhleðsla
  B.G.push(function yfirhledsla() {
    var a = rnd(2, 9), b = rnd(2, 9);
    var members = D("\n  static String show(int x)    { return \"int:\" + x; }\n  static String show(double x) { return \"double:\" + x; }\n  static String show(String x) { return \"String:\" + x; }\n  static String show(int x, int y) { return \"two:\" + (x + y); }\n");
    var calls = [
      ["show(" + a + ")", "int:" + a], ["show(" + a + ".0)", "double:" + jd(a)], ["show(" + a + " / " + b + ")", "int:" + Math.trunc(a / b)],
      ["show(" + a + " / 2.0)", "double:" + jd(a / 2)], ["show(\"" + a + "\")", "String:" + a], ["show(" + a + ", " + b + ")", "two:" + (a + b)],
      ["show(\"\" + " + a + " + " + b + ")", "String:" + a + "" + b], ["show('A' + " + a + ")", "int:" + (65 + a)],
    ];
    var c = B.shuffle(calls).slice(0, 4);
    var main = c.map(function (x) { return "System.out.println(" + x[0] + ");"; }).join("\n");
    return { topic: T, title: "Yfirhleðsla", text: "<p>Hvað prentar kóðinn?</p>" + code(members + "\n// í main:\n" + main), answer: c.map(function (x) { return x[1]; }).join("\n"), multi: true,
      sol: "<p>Þýðandinn velur útgáfuna eftir <b>tagi</b> raungildanna: int/int-deiling er int, deiling með 2.0 er double, <code>'A' + n</code> er int, og strengur + tala er strengur.</p>",
      java: { main: main, members: members } };
  });

  // 4. return hættir strax
  B.G.push(function returnHaettir() {
    var xs = [rnd(-5, 20), rnd(-5, 20), rnd(-5, 20)];
    var lo = rnd(0, 5), hi = rnd(10, 15);
    var members = D("\n  static String classify(int n) {\n      if (n < " + lo + ") {\n          return \"lágt\";\n      }\n      for (int i = " + lo + "; i <= n; i++) {\n          if (i == " + hi + ") {\n              return \"hátt\";\n          }\n      }\n      return \"miðja\";\n  }\n");
    var cl = function (n) { if (n < lo) return "lágt"; for (var i = lo; i <= n; i++) if (i === hi) return "hátt"; return "miðja"; };
    var main = xs.map(function (x) { return "System.out.println(classify(" + x + "));"; }).join("\n");
    return { topic: T, title: "return hættir strax", text: "<p>Hvað prentar kóðinn?</p>" + code(members + "\n// í main:\n" + main), answer: xs.map(cl).join("\n"), multi: true,
      sol: "<p><code>return</code> hættir í aðferðinni strax, líka inni í lykkju. Tölur undir " + lo + " gefa „lágt“; ef lykkjan nær " + hi + " (þ.e. n &ge; " + hi + ") er skilað „hátt“; annars klárast lykkjan og „miðja“ er skilað.</p>",
      java: { main: main, members: members } };
  });

  // 5. Staðværar breytur og víxl
  B.G.push(function vixl() {
    var a = rnd(1, 9), b = rnd(10, 19);
    var members = D("\n  static void swap(int a, int b) {\n      int t = a;\n      a = b;\n      b = t;\n      System.out.println(a + \" \" + b);\n  }\n  static int absDiff(int a, int b) {\n      if (a > b) {\n          int t = a; a = b; b = t;\n      }\n      return b - a;\n  }\n");
    var main = "int a = " + a + ", b = " + b + ";\nswap(a, b);\nSystem.out.println(a + \" \" + b);\nSystem.out.println(absDiff(b, a) + \" \" + b);";
    var ans = [b + " " + a, a + " " + b, (b - a) + " " + b].join("\n");
    return { topic: T, title: "Víxl sem virkar ekki", text: "<p>Hvað prentar kóðinn?</p>" + code(members + "\n// í main:\n" + main), answer: ans, multi: true,
      sol: "<p>Inni í swap víxlast afritin, en a og b í main eru óbreytt (gildisfærsla). absDiff víxlar líka aðeins sínum eigin afritum.</p>",
      java: { main: main, members: members } };
  });

  B.MC.push(
    { topic: T, q: "Hvað er undirskrift (signature) aðferðarinnar <code>public static double pow(double base, int exp)</code>?", o: ["<code>pow(double, int)</code>", "<code>double pow</code>", "<code>public static double pow(double base, int exp)</code>", "<code>pow</code>"], c: 0, e: "Undirskriftin er nafnið og tög færibreytanna í röð. Skilatag og breytunöfn eru ekki hluti af henni." },
    { topic: T, q: "Hvaða skilatag hefur aðferð sem skilar engu gildi?", o: ["void", "null", "int", "Ekkert skilatag er skrifað"], c: 0, e: "void merkir að aðferðin skilar engu. Smiðir (kafli 8) hafa ekkert skilatag, en venjulegar aðferðir þurfa alltaf eitt." },
    { topic: T, q: "Hvað er að þessari aðferð? <code>static int sign(int n) { if (n &gt; 0) return 1; else if (n &lt; 0) return -1; }</code>", o: ["Það vantar return ef n er 0: þýðingarvilla", "Ekkert", "else if má ekki nota í aðferð", "Hún þarf að vera void"], c: 0, e: "Þýðandinn krefst þess að allar leiðir í gegnum aðferð með skilatag endi á return. Ef n == 0 nær keyrslan enda aðferðarinnar." },
    { topic: T, q: "<code>static void inc(int x) { x++; }</code> og í main: <code>int a = 3; inc(a);</code> Hvað er a?", o: ["3", "4", "0", "Þýðingarvilla"], c: 0, e: "Gildisfærsla: x er afrit af a. Til að breyta a þarf að skila gildinu: a = inc2(a);" },
    { topic: T, q: "Hvaða yfirhleðsla er ólögleg ef <code>int f(int x)</code> er þegar til í klasanum?", o: ["<code>double f(int x)</code>", "<code>int f(double x)</code>", "<code>int f(int x, int y)</code>", "<code>void f(String s)</code>"], c: 0, e: "Aðferðir mega ekki vera ólíkar eingöngu í skilatagi; undirskriftin f(int) væri tvítekin." },
    { topic: T, q: "Til eru <code>max(int, int)</code> og <code>max(double, double)</code>. Hvor er kölluð í <code>max(3, 4.5)</code>?", o: ["max(double, double); 3 er víkkað í 3.0", "max(int, int); 4.5 er stýft", "Þýðingarvilla: tvíræðni", "Fyrst er reynt int, svo double"], c: 0, e: "Engin nákvæm samsvörun er til, en int víkkast sjálfkrafa í double, svo double-útgáfan passar. double þrengist aldrei sjálfkrafa í int." },
    { topic: T, q: "Hvenær er staðvær breyta sem er lýst inni í aðferð eytt?", o: ["Þegar blokkin sem hún er í klárast (í síðasta lagi þegar aðferðin skilar)", "Þegar forritið hættir", "Aldrei", "Þegar aðferðin er kölluð næst"], c: 0, e: "Staðværar breytur búa í ramma aðferðarinnar á kallhlaðanum og hverfa þegar blokkin eða aðferðin klárast." },
    { topic: T, q: "Hvað er raungildi (argument)?", o: ["Gildið sem er sent inn í kallinu, t.d. 5 í <code>f(5)</code>", "Breytan í haus aðferðarinnar", "Skilagildi aðferðarinnar", "Nafn aðferðarinnar"], c: 0, e: "Raungildið (argument) er í kallinu; færibreytan (parameter) er í skilgreiningunni og fær afrit af raungildinu." },
    { topic: T, q: "Hvað gerist þegar <code>return</code> er keyrt inni í for-lykkju í aðferð?", o: ["Aðferðin hættir strax og skilar gildinu", "Aðeins lykkjan hættir", "Aðeins umferðin hættir", "Þýðingarvilla"], c: 0, e: "return hættir í allri aðferðinni, sama hversu djúpt í lykkjum það er." },
    { topic: T, q: "Hver er besta útgáfan af <code>isEven</code>?", o: ["<code>return n % 2 == 0;</code>", "<code>if (n % 2 == 0) return true; else return false;</code>", "<code>System.out.println(n % 2 == 0);</code>", "<code>return n / 2 == 0;</code>"], c: 0, e: "Samanburðurinn er sjálfur boolean, svo það má skila honum beint. Prentun skilar engu og n / 2 == 0 er rangt." },
    { topic: T, q: "Verkefnið segir: „skrifaðu aðferð sem <b>skilar</b> summu fylkisins“. Hvað á aðferðin að gera?", o: ["Reikna summuna og return-a henni (ekki prenta)", "Prenta summuna", "Prenta og return-a", "Geyma summuna í static breytu"], c: 0, e: "„Skilar“ = return. Sá sem kallar ákveður hvort gildið er prentað eða notað áfram. Aukaprentun getur ruglað sjálfvirka yfirferð." },
    { topic: T, q: "Hvað prentar <code>System.out.println(f(2) + f(3));</code> ef <code>static int f(int x) { return x * x; }</code>?", o: ["13", "23", "49", "4 9"], c: 0, e: "f(2) = 4 og f(3) = 9; bæði eru int svo þau eru lögð saman: 13." },
    { topic: T, q: "Hvað er kallhlaði (call stack)?", o: ["Hlaði ramma, einn fyrir hvert virkt aðferðarkall, með færibreytum og staðværum breytum", "Listi yfir allar aðferðir klasans", "Svæði í minni fyrir hluti sem búnir eru til með new", "Röð kalla sem þýðandinn hefur athugað"], c: 0, e: "Hvert kall bætir ramma ofan á hlaðann; þegar aðferðin skilar er ramminn fjarlægður og keyrslan heldur áfram í rammanum fyrir neðan." },
    { topic: T, q: "Hvað þýðir <code>static</code> í <code>public static int max(int a, int b)</code>?", o: ["Aðferðin tilheyrir klasanum og er kölluð án hlutar", "Aðferðinni má ekki breyta", "Aðferðin skilar alltaf sama gildi", "Aðferðin er bara sýnileg í sama klasa"], c: 0, e: "static aðferðir eru kallaðar með klasanafni (Math.max) eða beint innan klasans. Aðferðir án static tilheyra hlutum (kafli 8)." },
    { topic: T, q: "<code>static void p(int n) { if (n &lt;= 0) return; System.out.print(n); }</code> Hvað prentar <code>p(0); p(3);</code>?", o: ["3", "03", "0 3", "Þýðingarvilla: void má ekki hafa return"], c: 0, e: "void-aðferð má nota return; (án gildis) til að hætta snemma. p(0) hættir strax og prentar ekkert." },
    { topic: T, q: "Hvað er rangt við <code>static int twice(int x) { x * 2; }</code>?", o: ["Engu er skilað (return vantar) og x * 2 er ekki setning", "Ekkert", "Það má ekki margfalda færibreytu", "Það vantar void"], c: 0, e: "x * 2; ein og sér er ekki lögleg setning í Java, og aðferð með skilatag int þarf return x * 2;" },
    { topic: T, q: "Tvær aðferðir hafa báðar staðværa breytu sem heitir <code>sum</code>. Er það í lagi?", o: ["Já, þær eru óháðar því svið hvorrar er sín aðferð", "Nei, þýðingarvilla", "Já, en þær deila sama gildi", "Bara ef önnur er static"], c: 0, e: "Staðværar breytur eru aðeins til innan sinnar aðferðar (blokkar), svo nöfn mega endurtaka sig á milli aðferða." }
  );
})();

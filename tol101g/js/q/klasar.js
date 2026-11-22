/* q/klasar.js – kafli 8: Klasar og hlutir (Liang kafli 9). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, code = B.code, D = B.dedent, jd = B.jd;
  var T = "klasar";
  var COLORS = ["R", "G", "B", "Y"];
  var CARD = D("\n  class Card {\n      private int number;\n      private char color;\n      public Card(int number, char color) {\n          this.number = number;\n          this.color = color;\n      }\n      public int getNumber() { return number; }\n      public void setNumber(int number) { this.number = number; }\n      public char getColor() { return color; }\n      public String toString() { return \"\" + color + number; }\n  }\n");
  var show = function (classes, main) { return code(classes + "\n// í main:\n" + main); };

  // 1. Tilvísanir á hluti
  B.G.push(function hlutTilvisanir() {
    var n1 = rnd(0, 9), n2 = rnd(0, 9), c1 = pick(COLORS), c2 = pick(COLORS), k = rnd(1, 5);
    var main = "Card a = new Card(" + n1 + ", '" + c1 + "');\nCard b = a;\nCard c = new Card(" + n2 + ", '" + c2 + "');\nb.setNumber(b.getNumber() + " + k + ");\nc = b;\nc.setNumber(c.getNumber() * 2);\nSystem.out.println(a + \" \" + b + \" \" + c);\nSystem.out.println((a == c) + \" \" + (a == new Card(" + n1 + ", '" + c1 + "')));";
    var v = (n1 + k) * 2, s = c1 + v;
    return { topic: T, title: "Tilvísanir á hluti", text: "<p>Hvað prentar kóðinn?</p>" + show(CARD, main), answer: s + " " + s + " " + s + "\ntrue false", multi: true,
      sol: "<p><code>b = a</code> og síðar <code>c = b</code> afrita tilvísanir, svo a, b og c vísa öll á <b>sama</b> spilið (spilið " + c2 + n2 + " er glatað). Breytingarnar safnast upp: (" + n1 + " + " + k + ") · 2 = " + v + ". <code>==</code> ber saman tilvísanir, svo nýtt spil með sömu gildum er ekki <code>==</code>.</p>",
      java: { main: main, classes: CARD } };
  });

  // 2. Hlutur sendur í aðferð
  B.G.push(function hluturIAdferd() {
    var n = rnd(1, 8), k = rnd(1, 4);
    var members = D("\n  static void bump(Card card, int k) {\n      card.setNumber(card.getNumber() + k);\n      k = 0;\n      card = new Card(0, 'X');\n      card.setNumber(99);\n  }\n");
    var main = "Card c = new Card(" + n + ", 'G');\nint k = " + k + ";\nbump(c, k);\nSystem.out.println(c + \" \" + k);\nbump(c, c.getNumber());\nSystem.out.println(c.getNumber());";
    var a = n + k, b2 = a + a;
    return { topic: T, title: "Hlutur sem færibreyta", text: "<p>Hvað prentar kóðinn?</p>" + show(CARD + members.replace(/^/, ""), main), answer: "G" + a + " " + k + "\n" + b2, multi: true,
      sol: "<p>Tilvísunin á spilið er afrituð í <code>card</code>, svo <code>setNumber</code> breytir spilinu í main. <code>k = 0</code> og <code>card = new Card(…)</code> breyta bara staðbundnu afritunum; nýja spilið (X99) hverfur þegar aðferðin skilar.</p>",
      java: { main: main, members: members, classes: CARD } };
  });

  // 3. static teljari
  B.G.push(function staticTeljari() {
    var n = rnd(2, 4), names = B.shuffle(["Anna", "Bjarki", "Dísa", "Gunni", "Ósk"]).slice(0, n);
    var cls = D("\n  class Player {\n      private static int count = 0;\n      private int id;\n      private String name;\n      public Player(String name) {\n          this.name = name;\n          count++;\n          id = count;\n      }\n      public static int getCount() { return count; }\n      public String toString() { return id + \":\" + name + \"/\" + count; }\n  }\n");
    var main = names.map(function (nm, i) { return "Player p" + i + " = new Player(\"" + nm + "\");"; }).join("\n") + "\nSystem.out.println(p0);\nSystem.out.println(p" + (n - 1) + ");\nSystem.out.println(Player.getCount());";
    var ans = ["1:" + names[0] + "/" + n, n + ":" + names[n - 1] + "/" + n, n].join("\n");
    return { topic: T, title: "static eigindi", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: ans, multi: true,
      sol: "<p><code>count</code> er static: eitt eintak sem allir leikmenn deila, svo það er " + n + " þegar prentað er, líka fyrir p0. <code>id</code> er hlutbundið og var sett þegar hver leikmaður var búinn til.</p>",
      java: { main: main, classes: cls } };
  });

  // 4. Smiðir og this
  B.G.push(function smidirOgThis() {
    var x = rnd(1, 9), y = rnd(1, 9), r = rnd(2, 9), neg = Math.random() < 0.5;
    var cls = D("\n  class Circle {\n      private double x, y, r;\n      public Circle(double x, double y, double r) {\n          this.x = x;\n          this.y = y;\n          setR(r);\n          System.out.println(\"3 args\");\n      }\n      public Circle(double r) {\n          this(0, 0, r);\n          System.out.println(\"1 arg\");\n      }\n      public void setR(double r) {\n          if (r < 0) { r = r * -1; }\n          this.r = r;\n      }\n      public double getR() { return r; }\n      public String toString() { return \"Circle at (\" + x + \", \" + y + \") with radius \" + r; }\n  }\n");
    var main = "Circle c1 = new Circle(" + (neg ? "-" : "") + r + ");\nCircle c2 = new Circle(" + x + ", " + y + ", " + r * 2 + ");\nc2.setR(-" + (r + 1) + ");\nSystem.out.println(c1);\nSystem.out.println(c2.getR());";
    var ans = ["3 args", "1 arg", "3 args", "Circle at (0.0, 0.0) with radius " + jd(r), jd(r + 1)].join("\n");
    return { topic: T, title: "Smiðir og this", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: ans, multi: true,
      sol: "<p><code>new Circle(r)</code> kallar fyrst á þriggja færibreytu smiðinn með <code>this(0, 0, r)</code>, sem prentar „3 args“, og svo klárast eins-færibreytu smiðurinn. <code>setR</code> gerir neikvæðan radíus jákvæðan, líka þegar smiðurinn notar hana. double prentast með .0.</p>",
      java: { main: main, classes: cls } };
  });

  // 5. StackOfCards (hlaði)
  B.G.push(function hladi() {
    var ops = [], st = [], out = [], n = 0;
    var lines = ["IntStack s = new IntStack();"];
    for (var i = 0; i < 7; i++) {
      var r = Math.random();
      if (st.length === 0 || r < 0.5) { var v = rnd(1, 9); st.push(v); lines.push("s.push(" + v + ");"); }
      else if (r < 0.8) { lines.push("System.out.print(s.pop() + \" \");"); out.push(st.pop()); }
      else { lines.push("System.out.print(s.peek() + \" \");"); out.push(st[st.length - 1]); }
    }
    lines.push("System.out.println(\"| \" + s);");
    var cls = D("\n  class IntStack {\n      private int[] items = new int[10];\n      private int top = -1;\n      public void push(int x) { items[++top] = x; }\n      public int pop() { return items[top--]; }\n      public int peek() { return items[top]; }\n      public boolean isEmpty() { return top == -1; }\n      public String toString() {\n          String result = \"\";\n          for (int i = 0; i <= top; i++) result += items[i] + \",\";\n          return result;\n      }\n  }\n");
    var main = lines.join("\n");
    var ans = out.map(function (x) { return x + " "; }).join("") + "| " + st.map(function (x) { return x + ","; }).join("");
    return { topic: T, title: "Hlaði (push og pop)", text: "<p>Hvað prentar kóðinn? (Sami hlaði og StackOfCards, nema með int.)</p>" + show(cls, main), answer: ans,
      sol: "<p>Hlaði er „síðast inn, fyrst út“: <code>pop</code> skilar og fjarlægir efsta stakið, <code>peek</code> skilar því án þess að fjarlægja. <code>toString</code> prentar frá botni (vísir 0) upp í top.</p>",
      java: { main: main, classes: cls } };
  });

  B.MC.push(
    { topic: T, q: "Hver er munurinn á klasa og hlut?", o: ["Klasi er skilgreining (teikning); hlutur er eintak sem búið er til eftir henni við keyrslu", "Klasi er búinn til við keyrslu, hlutur við hönnun", "Hlutur getur haft marga klasa", "Enginn munur"], c: 0, e: "Klasi skilgreinir eigindi og aðferðir; new býr til hluti (eintök) sem hver hefur sín gildi á eigindunum." },
    { topic: T, q: "Hvað einkennir smið (constructor)?", o: ["Sama nafn og klasinn og ekkert skilatag", "Heitir init og skilar void", "Er alltaf static", "Verður að hafa færibreytur"], c: 0, e: "Smiður heitir eins og klasinn og hefur ekkert skilatag. Ef þú skrifar void fyrir framan verður hann venjuleg aðferð!" },
    { topic: T, q: "Klasinn Card hefur aðeins smiðinn <code>Card(int number, char color)</code>. Hvað gerir <code>new Card()</code>?", o: ["Þýðingarvilla: enginn smiður án færibreyta er til", "Býr til spil með 0 og ' '", "Býr til null", "Keyrsluvilla"], c: 0, e: "Sjálfgefni smiðurinn er aðeins búinn til ef klasinn hefur engan smið. Um leið og einhver smiður er skrifaður hverfur hann." },
    { topic: T, q: "Hvað gerist í smiðnum <code>public Circle(double r) { r = r; }</code>?", o: ["Færibreytan fær sitt eigið gildi; eigindið r helst 0", "Eigindið r fær gildið", "Þýðingarvilla", "Keyrsluvilla"], c: 0, e: "Færibreytan skyggir á eigindið. Rétt: this.r = r;" },
    { topic: T, q: "Hvað er <code>this</code>?", o: ["Tilvísun á hlutinn sem aðferðin (eða smiðurinn) var kölluð á", "Klasinn sjálfur", "Síðasti hluturinn sem var búinn til", "Fyrsti hluturinn af klasanum"], c: 0, e: "this vísar á núverandi hlut. Það er ekki til í static aðferðum." },
    { topic: T, q: "Hvar má <code>this(…)</code> standa í smið?", o: ["Aðeins í fyrstu setningu smiðsins", "Hvar sem er í smiðnum", "Aðeins í síðustu setningu", "Hvar sem er í klasanum"], c: 0, e: "Kall á annan smið með this(…) verður að vera fyrsta setningin." },
    { topic: T, q: "Hvaða aðgangsorð gerir eigindi sýnilegt aðeins klasanum sjálfum?", o: ["private", "public", "protected", "static"], c: 0, e: "private (í UML: −). Hjúpun: eigindi eru private og aðgangur fer í gegnum public aðferðir." },
    { topic: T, q: "Hvað þýðir <code>+</code>, <code>-</code> og <code>#</code> í UML-klasariti?", o: ["public, private og protected", "static, final og abstract", "Bæta við, eyða og breyta", "Get, set og smiður"], c: 0, e: "Aðgangstáknin: + public, − private, # protected, ~ pakkaaðgangur." },
    { topic: T, q: "Hvers vegna setter frekar en public eigindi?", o: ["Setterinn getur staðfest gildið svo ástand hlutarins sé alltaf gilt", "Setterar eru hraðvirkari", "Public eigindi eru bönnuð í Java", "Setterar spara minni"], c: 0, e: "Hjúpun: t.d. getur setR gert neikvæðan radíus jákvæðan eða hafnað ógildu gildi. Með public eigindi gæti hver sem er sett hvað sem er." },
    { topic: T, q: "Klasinn hefur <code>private static int count;</code>. Hvað er satt?", o: ["Allir hlutir klasans deila einu eintaki af count", "Hver hlutur hefur sitt eigið count", "Ekki má breyta count", "count er bara til í main"], c: 0, e: "static eigindi tilheyrir klasanum; eitt eintak óháð fjölda hluta." },
    { topic: T, q: "Af hverju er þetta þýðingarvilla inni í <code>public static void main</code>: <code>System.out.println(name);</code> þar sem <code>name</code> er hlutbundið eigindi klasans?", o: ["main er static og hefur engan hlut (ekkert this) til að lesa name úr", "name er private", "println tekur ekki strengi", "main má ekki prenta"], c: 0, e: "„non-static variable cannot be referenced from a static context“. Búðu til hlut fyrst: Player p = new Player(); p.name …" },
    { topic: T, q: "<code>Card a = new Card(5, 'R'); Card b = a; b.setNumber(7);</code> Hvað er <code>a.getNumber()</code>?", o: ["7", "5", "0", "Þýðingarvilla"], c: 0, e: "b = a afritar tilvísunina; það er bara eitt spil." },
    { topic: T, q: "<code>Card c = null; c.getNumber();</code> Hvað gerist?", o: ["NullPointerException við keyrslu", "Skilar 0", "Þýðingarvilla", "Skilar null"], c: 0, e: "null vísar ekki á neinn hlut, svo ekki er hægt að kalla á aðferð í gegnum það." },
    { topic: T, q: "Hvaða sjálfgefið gildi fær eigindið <code>private String name;</code> ef smiðurinn setur það ekki?", o: ["null", "\"\"", "Ekkert: þýðingarvilla", "\"name\""], c: 0, e: "Eigindi fá sjálfgefin gildi: 0, false, '\\u0000' eða null. (Staðværar breytur fá engin og verður að frumstilla.)" },
    { topic: T, q: "Hvað prentar <code>System.out.println(card);</code> ef Card hefur <code>toString()</code> sem skilar \"R7\"?", o: ["R7", "Card@1b6d3586", "card", "Þýðingarvilla"], c: 0, e: "println (og strengjasamskeyting) kalla sjálfkrafa á toString(). Án eigin toString prentast klasanafn og kjötkássukóði." },
    { topic: T, q: "Í StackOfCards: hvað gerir <code>cards[++top] = card;</code>?", o: ["Hækkar top um einn og geymir spilið í nýja efsta hólfinu", "Geymir spilið í hólfi top og hækkar top svo", "Hækkar spilið um einn", "Kastar villu ef top er -1"], c: 0, e: "++top hækkar fyrst (frá −1 í 0 fyrir fyrsta spilið) og skilar nýja gildinu." },
    { topic: T, q: "Í StackOfCards: hvað gerir <code>return cards[top--];</code>?", o: ["Skilar efsta spilinu og lækkar top svo", "Lækkar top og skilar svo spilinu fyrir neðan", "Eyðir spilinu úr fylkinu", "Skilar top"], c: 0, e: "top-- skilar gamla gildinu, svo cards[top] með gamla top er skilað. Spilið er enn í fylkinu en telst ekki lengur með." },
    { topic: T, q: "Hver þessara aðferða ætti að vera <code>static</code>?", o: ["Aðferð sem reiknar fjarlægð milli tveggja punkta sem hún fær sem færibreytur, án þess að nota eigindi", "getColor() í Card", "setR(double r) í Circle", "toString() í StackOfCards"], c: 0, e: "Aðferð sem notar engin hlutbundin eigindi (bara færibreytur) getur verið static, eins og Math.max. Hinar lesa eða breyta ástandi hlutar." },
    { topic: T, q: "Hvað þýðir að klasi sé óbreytanlegur (immutable)?", o: ["Ekki er hægt að breyta ástandi hlutanna eftir að þeir eru búnir til", "Ekki er hægt að búa til hluti af honum", "Ekki má erfa frá honum", "Hann hefur bara static aðferðir"], c: 0, e: "Engir setterar og eigindin private (oft final). String og Card (án setNumber) eru dæmi." }
  );
})();

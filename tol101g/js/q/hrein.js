/* q/hrein.js – kafli 11: Hrein klasar og viðmót (Liang kafli 13). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, code = B.code, D = B.dedent, jd = B.jd;
  var T = "hrein";
  var show = function (classes, main) { return code(classes + "\n// í main:\n" + main); };

  // 1. Sniðmátsaðferð í hreinum klasa
  B.G.push(function snidmatsadferd() {
    var w = rnd(2, 6), h = rnd(2, 6), b = rnd(2, 8), t = rnd(2, 6);
    var cls = D("\n  abstract class Shape {\n      private String name;\n      public Shape(String name) { this.name = name; }\n      public abstract double area();\n      public String report() { return name + \": \" + area(); }\n  }\n  class Rect extends Shape {\n      private int w, h;\n      public Rect(int w, int h) { super(\"Rect\"); this.w = w; this.h = h; }\n      public double area() { return w * h; }\n  }\n  class Tri extends Shape {\n      private int b, t;\n      public Tri(int b, int t) { super(\"Tri\"); this.b = b; this.t = t; }\n      public double area() { return b * t / 2; }\n  }\n");
    var main = "Shape[] s = {new Rect(" + w + ", " + h + "), new Tri(" + b + ", " + t + ")};\ndouble total = 0;\nfor (Shape x : s) {\n    System.out.println(x.report());\n    total += x.area();\n}\nSystem.out.println(total);";
    var tri = Math.trunc((b * t) / 2);
    var ans = ["Rect: " + jd(w * h), "Tri: " + jd(tri), jd(w * h + tri)].join("\n");
    return { topic: T, title: "Hrein aðferð í sniðmáti", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: ans, multi: true,
      sol: "<p><code>report()</code> er skilgreind í hreina klasanum en kallar á <code>area()</code>, og útgáfa raunverulega hlutarins keyrir. Gildran: <code>b * t / 2</code> er <b>heiltöludeiling</b> (" + b * t + " / 2 = " + tri + ") áður en henni er breytt í double.</p>",
      java: { main: main, classes: cls } };
  });

  // 2. Comparable og Arrays.sort
  B.G.push(function comparableSort() {
    var cards = [], cols = ["R", "G", "B", "Y"];
    for (var i = 0; i < 4; i++) cards.push([rnd(0, 9), pick(cols)]);
    var byColor = Math.random() < 0.5;
    var cls = D("\n  class Card implements Comparable<Card> {\n      private int number;\n      private char color;\n      public Card(int number, char color) { this.number = number; this.color = color; }\n      @Override\n      public int compareTo(Card o) {\n" + (byColor ? "          if (color != o.color) return color - o.color;\n          return number - o.number;\n" : "          if (number != o.number) return o.number - number;\n          return color - o.color;\n") + "      }\n      public String toString() { return \"\" + color + number; }\n  }\n");
    var main = "Card[] hand = {" + cards.map(function (c) { return "new Card(" + c[0] + ", '" + c[1] + "')"; }).join(", ") + "};\nArrays.sort(hand);\nSystem.out.println(Arrays.toString(hand));";
    var sorted = cards.slice().sort(function (a, b) {
      if (byColor) return a[1] !== b[1] ? a[1].charCodeAt(0) - b[1].charCodeAt(0) : a[0] - b[0];
      return a[0] !== b[0] ? b[0] - a[0] : a[1].charCodeAt(0) - b[1].charCodeAt(0);
    });
    return { topic: T, title: "Comparable", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: "[" + sorted.map(function (c) { return c[1] + c[0]; }).join(", ") + "]",
      sol: "<p>Arrays.sort notar <code>compareTo</code>: neikvætt þýðir „this á undan“. " + (byColor ? "Hér er raðað eftir lit (B &lt; G &lt; R &lt; Y í stafrófsröð kóðanna) og svo eftir tölu í vaxandi röð." : "Hér er <code>o.number - number</code>, svo tölurnar raðast í <b>minnkandi</b> röð; jafnar tölur raðast eftir lit.") + "</p>",
      java: { main: main, classes: cls } };
  });

  // 3. Viðmót og default-aðferðir
  B.G.push(function vidmotDefault() {
    var r = rnd(1, 5), s = rnd(2, 6);
    var cls = D("\n  interface Describable {\n      String name();\n      default String describe() { return \"I am \" + name(); }\n  }\n  interface Scorable {\n      int score();\n  }\n  class Card implements Describable, Scorable {\n      private int n;\n      public Card(int n) { this.n = n; }\n      public String name() { return \"Card\" + n; }\n      public int score() { return n * 2; }\n  }\n  class Joker implements Describable {\n      public String name() { return \"Joker\"; }\n      public String describe() { return \"*** \" + name() + \" ***\"; }\n  }\n");
    var main = "Describable[] ds = {new Card(" + r + "), new Joker(), new Card(" + s + ")};\nint total = 0;\nfor (Describable d : ds) {\n    System.out.println(d.describe());\n    if (d instanceof Scorable) {\n        total += ((Scorable) d).score();\n    }\n}\nSystem.out.println(total);";
    var ans = ["I am Card" + r, "*** Joker ***", "I am Card" + s, 2 * (r + s)].join("\n");
    return { topic: T, title: "Viðmót og default", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: ans, multi: true,
      sol: "<p>Card notar default-útgáfuna af describe() úr viðmótinu, Joker yfirskrifar hana. Aðeins Card útfærir Scorable, og kastið <code>(Scorable) d</code> þarf því Describable hefur ekki score().</p>",
      java: { main: main, classes: cls } };
  });

  // 4. Hreinn klasi með smið og teljara
  B.G.push(function hreinnMedSmid() {
    var n = rnd(2, 3), names = B.shuffle(["Anna", "Kári", "Ósk", "Dísa"]).slice(0, n + 1);
    var cls = D("\n  abstract class Player {\n      private static int count = 0;\n      protected String name;\n      public Player(String name) {\n          this.name = name;\n          count++;\n          System.out.println(\"Player \" + count + \": \" + name);\n      }\n      public abstract String move();\n      public String turn() { return name + \" \" + move(); }\n  }\n  class Human extends Player {\n      public Human(String n) { super(n); }\n      public String move() { return \"velur\"; }\n  }\n  class Computer extends Player {\n      public Computer(String n) { super(n + \"Bot\"); }\n      public String move() { return \"reiknar\"; }\n  }\n");
    var kinds = names.map(function (_, i) { return i === 0 ? "Human" : "Computer"; });
    var main = "Player[] ps = {" + names.map(function (nm, i) { return "new " + kinds[i] + "(\"" + nm + "\")"; }).join(", ") + "};\nSystem.out.println(ps[" + n + "].turn());\nSystem.out.println(ps[0].turn());";
    var out = names.map(function (nm, i) { return "Player " + (i + 1) + ": " + nm + (i ? "Bot" : ""); });
    out.push(names[n] + "Bot reiknar", names[0] + " velur");
    return { topic: T, title: "Hreinn klasi með smið", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: out.join("\n"), multi: true,
      sol: "<p>Ekki má búa til Player beint, en smiður hans keyrir í gegnum <code>super(…)</code> þegar undirklasarnir eru búnir til, og static-teljarinn er sameiginlegur. Computer breytir nafninu áður en það fer upp í super. turn() kallar á útgáfu raunverulega klasans af move().</p>",
      java: { main: main, classes: cls } };
  });

  B.MC.push(
    { topic: T, q: "Hvað er hrein aðferð (abstract method)?", o: ["Aðferð með undirskrift en engan líkama, sem undirklasar verða að útfæra", "Aðferð sem skilar engu", "Static aðferð án færibreyta", "Aðferð sem má ekki yfirskrifa"], c: 0, e: "public abstract double calcArea(); — engir slaufusvigar, bara semíkomma." },
    { topic: T, q: "Hvað gerir <code>new Polygon()</code> ef Polygon er abstract?", o: ["Þýðingarvilla", "Býr til tóman marghyrning", "Keyrsluvilla", "Skilar null"], c: 0, e: "Ekki má búa til hlut af hreinum klasa. Polygon p = new Triangle(…) er hins vegar í lagi." },
    { topic: T, q: "Klasinn Square extends Polygon útfærir ekki <code>calcArea()</code>. Hvað þarf að gera?", o: ["Útfæra calcArea eða merkja Square abstract", "Ekkert, hann erfir hana", "Gera calcArea static", "Kalla á super.calcArea()"], c: 0, e: "Steinsteyptur (concrete) undirklasi verður að útfæra allar hreinar aðferðir yfirklasans. super.calcArea() er ekki til því hún hefur engan líkama." },
    { topic: T, q: "Getur hreinn klasi haft smið?", o: ["Já; hann er kallaður með super(…) úr smiðum undirklasanna", "Nei, aldrei", "Já, og hann er kallaður með new", "Aðeins ef hann hefur engar hreinar aðferðir"], c: 0, e: "Smiðurinn frumstillir eigindi hreina klasans. Hann er ekki kallaður beint með new." },
    { topic: T, q: "Hver þessara fullyrðinga um viðmót (interface) er rétt?", o: ["Klasi má útfæra mörg viðmót", "Viðmót má hafa smiði", "Viðmót má hafa hlutbundin eigindi", "Klasi má bara útfæra eitt viðmót"], c: 0, e: "class A extends B implements C, D, E er löglegt. Viðmót hafa enga smiði og aðeins fasta." },
    { topic: T, q: "Hvaða aðgang hafa aðferðir í viðmóti sjálfkrafa?", o: ["public abstract", "private", "protected", "pakkaaðgang"], c: 0, e: "Þess vegna verður útfærslan í klasanum að vera public; annars er það þýðingarvilla (þrengri aðgangur)." },
    { topic: T, q: "Hvað eru breytur í viðmóti sjálfkrafa?", o: ["public static final (fastar)", "private", "Hlutbundin eigindi", "Ófrumstilltar"], c: 0, e: "Viðmót geyma ekki ástand; breyta eins og double PI_ISH = 3.14; er fasti." },
    { topic: T, q: "Hvaða lykilorð notar klasi til að útfæra viðmót?", o: ["implements", "extends", "uses", "abstract"], c: 0, e: "class Card implements Comparable<Card>. extends er fyrir klasa (og fyrir viðmót sem erfir annað viðmót)." },
    { topic: T, q: "Hvað á <code>a.compareTo(b)</code> að skila ef a á að koma á undan b?", o: ["Neikvæða tölu", "Jákvæða tölu", "0", "true"], c: 0, e: "Neikvætt: a < b; 0: jafnt; jákvætt: a > b. Arrays.sort raðar svo í vaxandi röð samkvæmt því." },
    { topic: T, q: "Hvað gerist við <code>Arrays.sort(hand)</code> ef Card útfærir ekki Comparable?", o: ["ClassCastException við keyrslu", "Spilunum er raðað eftir minnisstað", "Ekkert gerist", "Raðað eftir toString"], c: 0, e: "sort reynir að kasta stökunum í Comparable. (Önnur leið er að gefa sort Comparator.)" },
    { topic: T, q: "Hvernig er hreinn klasi táknaður í UML?", o: ["Nafnið (og hreinu aðferðirnar) í skáletri, eða {abstract}", "Með «interface» fyrir ofan nafnið", "Með brotinni línu umhverfis", "Með fylltum tígli"], c: 0, e: "Viðmót eru merkt «interface». Útfærsla viðmóts er brotin lína með holum þríhyrningi." },
    { topic: T, q: "Hvenær er viðmót betri kostur en hreinn klasi?", o: ["Þegar ólíkir klasar eiga að deila hæfni („getur“) án sameiginlegrar útfærslu eða ástands", "Þegar undirklasarnir deila eigindum", "Þegar þú þarft smið", "Þegar aðeins einn klasi útfærir það"], c: 0, e: "T.d. Comparable: spil, nemendur og dagsetningar geta öll verið samanburðarhæf án þess að eiga sameiginlegan yfirklasa." },
    { topic: T, q: "Hvað er default-aðferð í viðmóti?", o: ["Aðferð með líkama sem útfærsluklasar fá sjálfkrafa en mega yfirskrifa", "Aðferð sem er kölluð í smiðnum", "Hrein aðferð", "Aðferð sem allir klasar verða að yfirskrifa"], c: 0, e: "default String describe() { … } (Java 8+). Klasar sem yfirskrifa hana ekki nota þessa útgáfu." },
    { topic: T, q: "<code>Shape s = new Circle(2);</code> þar sem Shape er viðmót. Hvað er satt?", o: ["Aðeins aðferðir Shape má kalla á í gegnum s; útgáfa Circle keyrir", "s er ógilt því viðmót eru ekki tög", "Allar aðferðir Circle má kalla á", "Þýðingarvilla"], c: 0, e: "Viðmót eru tög eins og klasar. Yfirlýst tag (Shape) ákveður hvað má kalla á, raunverulegt tag (Circle) hvað keyrir." },
    { topic: T, q: "Hvað er rangt við <code>abstract class A { abstract void f() { } }</code>?", o: ["Hrein aðferð má ekki hafa líkama", "Ekkert", "Hreinn klasi má ekki hafa aðferðir", "f verður að vera static"], c: 0, e: "abstract void f(); — annaðhvort er aðferðin hrein (án líkama) eða venjuleg (með líkama)." },
    { topic: T, q: "Hvers vegna er Player hreinn klasi í UNO-dæminu?", o: ["Hver leikmaður er annaðhvort mennskur eða tölva; „almennur“ leikmaður veit ekki hvernig hann á að gera (playTurn)", "Til að spara minni", "Svo enginn geti erft frá honum", "Svo hann hafi enga smiði"], c: 0, e: "Player geymir það sameiginlega (hönd, draw, discard) og lætur undirklasana ákveða playTurn." }
  );
})();

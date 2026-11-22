/* q/erfdir.js – kafli 10: Erfðir og fjölbrigðni (Liang kafli 11). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, code = B.code, D = B.dedent;
  var T = "erfdir";
  var show = function (classes, main) { return code(classes + "\n// í main:\n" + main); };

  // 1. Smiðakeðja
  B.G.push(function smidakedja() {
    var a = rnd(1, 9), callSuper = Math.random() < 0.5, extraThis = Math.random() < 0.5;
    var cls = D("\n  class A {\n      A() { System.out.println(\"A()\"); }\n      A(int x) { System.out.println(\"A(\" + x + \")\"); }\n  }\n  class B extends A {\n      B() {\n          " + (extraThis ? "this(" + a + ");" : "") + "\n          System.out.println(\"B()\");\n      }\n      B(int x) {\n          " + (callSuper ? "super(x * 2);" : "") + "\n          System.out.println(\"B(\" + x + \")\");\n      }\n  }\n  class C extends B {\n      C() {\n          super(" + (a + 1) + ");\n          System.out.println(\"C()\");\n      }\n  }\n").replace(/\n\s*\n/g, "\n");
    var which = pick(["new C()", "new B()", "new B(" + (a + 2) + ")"]);
    var main = "Object o = " + which + ";";
    var Bint = function (x) { return (callSuper ? ["A(" + x * 2 + ")"] : ["A()"]).concat(["B(" + x + ")"]); };
    var out;
    if (which === "new C()") out = Bint(a + 1).concat(["C()"]);
    else if (which === "new B()") out = extraThis ? Bint(a).concat(["B()"]) : ["A()", "B()"];
    else out = Bint(a + 2);
    return { topic: T, title: "Smiðakeðja", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: out.join("\n"), multi: true,
      sol: "<p>Hver smiður kallar <b>fyrst</b> á smið yfirklasans: annaðhvort <code>super(…)</code> sem er skrifað, <code>this(…)</code> (annan smið sama klasa, sem svo kallar á super), eða sjálfkrafa <code>super()</code>. Þess vegna prentast A fyrst og sá undirklasi sem var búinn til síðast.</p>",
      java: { main: main, classes: cls } };
  });

  // 2. Breytileg binding
  B.G.push(function breytilegBinding() {
    var animals = B.shuffle(["new Dog()", "new Cat()", "new Animal()", "new Puppy()"]).slice(0, 3);
    var cls = D("\n  class Animal {\n      String sound() { return \"...\"; }\n      String describe() { return getClass().getSimpleName() + \" says \" + sound(); }\n  }\n  class Dog extends Animal {\n      @Override String sound() { return \"Woof\"; }\n  }\n  class Cat extends Animal {\n      @Override String sound() { return \"Meow\"; }\n      @Override String describe() { return \"The cat: \" + super.describe(); }\n  }\n  class Puppy extends Dog {\n      @Override String sound() { return super.sound() + \"!\"; }\n  }\n");
    var main = "Animal[] zoo = {" + animals.join(", ") + "};\nfor (Animal a : zoo) {\n    System.out.println(a.describe());\n}";
    var d = { "new Dog()": "Dog says Woof", "new Cat()": "The cat: Cat says Meow", "new Animal()": "Animal says ...", "new Puppy()": "Puppy says Woof!" };
    return { topic: T, title: "Fjölbrigðni", text: "<p>Hvað prentar kóðinn? (<code>getClass().getSimpleName()</code> skilar nafni raunverulega klasans.)</p>" + show(cls, main), answer: animals.map(function (x) { return d[x]; }).join("\n"), multi: true,
      sol: "<p>Hver hlutur notar útgáfu <b>síns eigin</b> klasa af sound(), líka þegar kallað er úr describe() í Animal (breytileg binding). Cat yfirskrifar describe og kallar á útgáfu Animal með super. Puppy bætir „!“ við útgáfu Dog.</p>",
      java: { main: main, classes: cls } };
  });

  // 3. Yfirskrifun vs. yfirhleðsla
  B.G.push(function yfirskrifunYfirhledsla() {
    var cls = D("\n  class Base {\n      void show(Object o) { System.out.println(\"Base.Object\"); }\n      void show(String s) { System.out.println(\"Base.String\"); }\n  }\n  class Sub extends Base {\n      @Override void show(Object o) { System.out.println(\"Sub.Object\"); }\n      void show(Integer i) { System.out.println(\"Sub.Integer\"); }\n  }\n");
    var calls = [
      ["Base b = new Sub();\nb.show(\"x\");", "Base.String"], ["Base b = new Sub();\nb.show(42);", "Sub.Object"], ["Sub s = new Sub();\ns.show(42);", "Sub.Integer"],
      ["Sub s = new Sub();\ns.show(\"x\");", "Base.String"], ["Base b = new Base();\nb.show(42);", "Base.Object"], ["Object o = \"x\";\nnew Sub().show(o);", "Sub.Object"],
    ];
    var c = B.shuffle(calls).slice(0, 3);
    var main = c.map(function (x, i) { return "{\n" + x[0].replace(/^/gm, "    ") + "\n}"; }).join("\n");
    return { topic: T, title: "Yfirskrifun eða yfirhleðsla?", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: c.map(function (x) { return x[1]; }).join("\n"), multi: true,
      sol: "<p>Tvö skref: (1) Við <b>þýðingu</b> er undirskrift valin út frá <b>yfirlýstu tagi</b> breytunnar og raungildanna (yfirhleðsla). Base þekkir ekki show(Integer), svo <code>b.show(42)</code> velur show(Object). (2) Við <b>keyrslu</b> er sú undirskrift keyrð í <b>raunverulega</b> klasanum (yfirskrifun), svo Sub.Object keyrir ef hluturinn er Sub.</p>",
      java: { main: main, classes: cls } };
  });

  // 4. super.toString í Polygon
  B.G.push(function superToString() {
    var x1 = rnd(0, 3), y1 = rnd(0, 3), w = rnd(2, 6), h = rnd(2, 6), dx = rnd(1, 9);
    var cls = D("\n  class Shape {\n      protected String name;\n      public Shape(String name) { this.name = name; }\n      public double area() { return 0; }\n      public String toString() { return name + \" area=\" + area(); }\n  }\n  class Rect extends Shape {\n      private int w, h;\n      public Rect(int w, int h) { super(\"Rect\"); this.w = w; this.h = h; }\n      @Override public double area() { return w * h; }\n  }\n  class Square extends Rect {\n      public Square(int s) { super(s, s); name = \"Square\"; }\n      @Override public String toString() { return \"[\" + super.toString() + \"]\"; }\n  }\n");
    var main = "Shape[] shapes = {new Rect(" + w + ", " + h + "), new Square(" + dx + "), new Shape(\"Blob\")};\nfor (Shape s : shapes) {\n    System.out.println(s);\n}";
    var ans = ["Rect area=" + (w * h) + ".0", "[Square area=" + (dx * dx) + ".0]", "Blob area=0.0"].join("\n");
    return { topic: T, title: "super og toString", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: ans, multi: true,
      sol: "<p>toString í Shape kallar á area(), og útgáfa raunverulega hlutarins er notuð (Rect: w·h sem double). Square erfir area frá Rect, breytir protected eigindinu name og vefur útgáfu yfirklasans inn í hornklofa með <code>super.toString()</code>.</p>",
      java: { main: main, classes: cls } };
  });

  // 5. instanceof og kast
  B.G.push(function instanceofKast() {
    var cls = D("\n  class Player { String type() { return \"P\"; } }\n  class Human extends Player { String type() { return \"H\"; } }\n  class Computer extends Player { String type() { return \"C\"; } int level() { return 3; } }\n");
    var arr = B.shuffle(["new Human()", "new Computer()", "new Player()", "new Computer()"]).slice(0, 3);
    var main = "Player[] ps = {" + arr.join(", ") + "};\nint sum = 0;\nfor (Player p : ps) {\n    System.out.print(p.type());\n    System.out.print(p instanceof Player ? \"+\" : \"-\");\n    if (p instanceof Computer) {\n        sum += ((Computer) p).level();\n    }\n}\nSystem.out.println(\" \" + sum);";
    var o = "", s = 0;
    arr.forEach(function (x) { var t = x === "new Human()" ? "H" : x === "new Computer()" ? "C" : "P"; o += t + "+"; if (t === "C") s += 3; });
    return { topic: T, title: "instanceof og kast", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: o + " " + s,
      sol: "<p>Allir hlutirnir eru Player (líka undirklasarnir), svo instanceof Player er alltaf true. Aðeins Computer-hlutir standast seinna prófið, og kastið <code>(Computer) p</code> þarf til að mega kalla á level(), sem Player þekkir ekki.</p>",
      java: { main: main, classes: cls } };
  });

  B.MC.push(
    { topic: T, q: "Hvaða samband lýsa erfðir?", o: ["„er“ (is-a)", "„hefur“ (has-a)", "„notar“ (uses)", "„þekkir“ (knows)"], c: 0, e: "DrawPile er StackOfCards. Ef sambandið er „hefur“ á að nota eigindi í staðinn." },
    { topic: T, q: "Hversu marga yfirklasa getur Java-klasi haft beint?", o: ["Einn", "Engan", "Tvo", "Hve marga sem er"], c: 0, e: "Java leyfir aðeins einfaldar erfðir af klösum (extends einn klasa), en klasi má útfæra mörg viðmót." },
    { topic: T, q: "Yfirklasinn Player hefur aðeins smiðinn <code>Player(String name)</code>. Undirklasinn Human hefur smiðinn <code>Human() { }</code>. Hvað gerist?", o: ["Þýðingarvilla: sjálfvirka super() finnur engan smið án færibreyta", "Það virkar, name verður null", "Keyrsluvilla", "Human fær smið Player sjálfkrafa"], c: 0, e: "Java setur super(); inn í smið Human, en Player() er ekki til. Lausn: super(\"Human\"); í fyrstu línu." },
    { topic: T, q: "Hvar verður <code>super(…)</code> að standa í smið?", o: ["Í fyrstu setningu", "Í síðustu setningu", "Hvar sem er", "Utan smiðsins"], c: 0, e: "Kall á smið yfirklasans (eða this(…)) verður að vera fyrsta setningin." },
    { topic: T, q: "Hvað er yfirskrifun (overriding)?", o: ["Undirklasi skilgreinir aðferð með sömu undirskrift og aðferð í yfirklasanum", "Tvær aðferðir í sama klasa með sama nafni en ólíkar færibreytur", "Að kalla á super.aðferð()", "Að breyta gildi erfðs eigindis"], c: 0, e: "Yfirskrifun er valin við keyrslu eftir raunverulegu tagi. Ólíkar færibreytur = yfirhleðsla." },
    { topic: T, q: "Hvað gerir <code>@Override</code>?", o: ["Lætur þýðandann athuga að aðferðin yfirskrifi aðferð í yfirklasa", "Gerir aðferðina public", "Kallar á aðferð yfirklasans", "Bannar frekari yfirskrifun"], c: 0, e: "Ef undirskriftin passar ekki (t.d. equals(Card) í stað equals(Object)) gefur þýðandinn villu í stað þess að búa hljóðlaust til yfirhleðslu." },
    { topic: T, q: "<code>Player p = new HumanPlayer();</code> Hvaða útgáfa af <code>p.playTurn(c)</code> keyrir ef báðir klasar hafa hana?", o: ["Útgáfa HumanPlayer", "Útgáfa Player", "Báðar", "Þýðingarvilla"], c: 0, e: "Breytileg binding: raunverulegt tag hlutarins (HumanPlayer) ákveður við keyrslu." },
    { topic: T, q: "<code>Player p = new ComputerPlayer();</code> ComputerPlayer hefur aðferðina <code>level()</code> sem Player hefur ekki. Hvað gerir <code>p.level()</code>?", o: ["Þýðingarvilla", "Kallar á level() í ComputerPlayer", "Keyrsluvilla", "Skilar 0"], c: 0, e: "Yfirlýsta tagið (Player) ákveður hvaða aðferðir má kalla á. Lausn: ((ComputerPlayer) p).level()." },
    { topic: T, q: "Hvað gerist við <code>Player p = new Human(); Computer c = (Computer) p;</code>?", o: ["ClassCastException við keyrslu", "Þýðingarvilla", "c verður null", "Það virkar"], c: 0, e: "Þýðandinn leyfir kastið (Computer gæti verið Player), en hluturinn er Human, svo kastið mistekst við keyrslu. Verðu það með instanceof." },
    { topic: T, q: "Hvað skilar <code>new Puppy() instanceof Animal</code> ef Puppy extends Dog og Dog extends Animal?", o: ["true", "false", "Þýðingarvilla", "Fer eftir smiðnum"], c: 0, e: "instanceof er true fyrir klasann sjálfan og alla yfirklasa hans (og viðmót sem hann útfærir)." },
    { topic: T, q: "Undirklasi hefur <code>public boolean equals(Card other)</code>. Hvað er rangt?", o: ["Þetta yfirhleður equals í stað þess að yfirskrifa equals(Object)", "Ekkert", "equals má ekki vera public", "Það vantar static"], c: 0, e: "Object.equals tekur Object. Með Card sem færibreytu verður til ný aðferð, og t.d. kall í gegnum Object-tilvísun notar enn ==-útgáfuna." },
    { topic: T, q: "Hvaða aðgangsorð gerir eigindi aðgengilegt undirklösum en ekki öllum?", o: ["protected", "private", "public", "static"], c: 0, e: "protected (# í UML): klasinn, undirklasar og klasar í sama pakka." },
    { topic: T, q: "Yfirklasinn hefur <code>private int top;</code>. Má undirklasinn skrifa <code>top++</code>?", o: ["Nei, private er aðeins aðgengilegt í klasanum sjálfum", "Já, því hann erfir það", "Já, ef hann er í sama pakka", "Aðeins í smiðnum"], c: 0, e: "Eigindið er til í hlutnum, en undirklasinn má ekki nota það beint. Gerðu það protected eða notaðu aðferðir." },
    { topic: T, q: "Má yfirskrifa <code>public void playTurn(Card c)</code> með <code>private void playTurn(Card c)</code> í undirklasa?", o: ["Nei, aðgangur má ekki þrengjast við yfirskrifun", "Já", "Já, en bara með @Override", "Aðeins ef klasinn er final"], c: 0, e: "Yfirskrifuð aðferð verður að vera að minnsta kosti jafn aðgengileg og upprunalega." },
    { topic: T, q: "Hvað þýðir <code>final</code> á klasa (eins og String)?", o: ["Ekki má erfa frá klasanum", "Ekki má búa til hluti af klasanum", "Allar aðferðir eru static", "Eigindin eru föst"], c: 0, e: "final klasa má ekki extend-a; final aðferð má ekki yfirskrifa; final breytu má ekki breyta." },
    { topic: T, q: "Í hvaða röð keyra smiðir þegar <code>new C()</code> er kallað og C extends B extends A?", o: ["A, svo B, svo C", "C, svo B, svo A", "Aðeins C", "B, svo A, svo C"], c: 0, e: "Smiður C kallar fyrst á smið B, sem kallar fyrst á smið A (sem kallar á Object). Líkamarnir klárast því ofan frá." },
    { topic: T, q: "Hver er kosturinn við fjölbrigðni í UNO-leikjalykkjunni <code>for (Player p : players) p.playTurn(card);</code>?", o: ["Lykkjan virkar fyrir hvaða leikmannategund sem er án breytinga", "Hún er hraðvirkari", "Hún kemur í veg fyrir NullPointerException", "Hún þarf ekki smiði"], c: 0, e: "Nýjum undirklasa af Player má bæta við (t.d. SmartComputerPlayer) án þess að snerta leikjalykkjuna." },
    { topic: T, q: "Hvaða klasi er efstur í öllum erfðastigveldum í Java?", o: ["Object", "Class", "Main", "String"], c: 0, e: "Allir klasar erfa (beint eða óbeint) frá java.lang.Object, sem hefur m.a. toString, equals og hashCode." }
  );
})();

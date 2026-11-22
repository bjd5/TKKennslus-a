/* q/tengsl.js – kafli 9: Tengsl hluta og UML (Liang kafli 10). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, code = B.code, D = B.dedent, jd = B.jd;
  var T = "tengsl";
  var show = function (classes, main) { return code(classes + "\n// í main:\n" + main); };
  var POINT = D("\n  class Point {\n      private double x, y;\n      public Point(double x, double y) { this.x = x; this.y = y; }\n      public double getX() { return x; }\n      public double getY() { return y; }\n      public void shift(double dx, double dy) { x += dx; y += dy; }\n      public String toString() { return \"(\" + x + \",\" + y + \")\"; }\n  }\n");
  var pt = function (x, y) { return "(" + jd(x) + "," + jd(y) + ")"; };

  // 1. Samsetning vs. deildar tilvísanir
  B.G.push(function deildirPunktar() {
    var px = rnd(0, 5), py = rnd(0, 5), qx = rnd(6, 9), qy = rnd(6, 9), dx = rnd(1, 4), dy = rnd(1, 4);
    var cls = POINT + D("\n  class Segment {\n      private Point a, b;\n      public Segment(Point a, Point b) {\n          this.a = a;                            // geymir tilvísunina\n          this.b = new Point(b.getX(), b.getY()); // afritar\n      }\n      public String toString() { return a + \"-\" + b; }\n  }\n");
    var main = "Point p = new Point(" + px + ", " + py + ");\nPoint q = new Point(" + qx + ", " + qy + ");\nSegment s = new Segment(p, q);\np.shift(" + dx + ", " + dy + ");\nq.shift(" + dx + ", " + dy + ");\nSystem.out.println(s);\nSystem.out.println(p + \" \" + q);";
    var ans = pt(px + dx, py + dy) + "-" + pt(qx, qy) + "\n" + pt(px + dx, py + dy) + " " + pt(qx + dx, qy + dy);
    return { topic: T, title: "Tilvísun eða afrit?", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: ans, multi: true,
      sol: "<p>Segment geymir <b>tilvísunina</b> á p, svo þegar p er fært færist endapunktur a líka (safntengsl / deildur hlutur). Punkturinn b er <b>afrit</b> af q (samsetning), svo q.shift hefur engin áhrif á línubútinn.</p>",
      java: { main: main, classes: cls } };
  });

  // 2. Safntengsl: Course og Student
  B.G.push(function courseStudent() {
    var names = B.shuffle(["Anna", "Bjarki", "Dísa", "Gunni", "Ósk", "Kári"]).slice(0, rnd(3, 4));
    var cls = D("\n  class Course {\n      private String name;\n      private String[] students = new String[3];\n      private int count = 0;\n      public Course(String name) { this.name = name; }\n      public boolean add(String s) {\n          if (count == students.length) {\n              return false;\n          }\n          students[count++] = s;\n          return true;\n      }\n      public String toString() {\n          String r = name + \":\";\n          for (int i = 0; i < count; i++) r += \" \" + students[i];\n          return r + \" (\" + count + \")\";\n      }\n  }\n");
    var main = "Course c = new Course(\"TÖL101G\");\n" + names.map(function (n) { return "System.out.print(c.add(\"" + n + "\") + \" \");"; }).join("\n") + "\nSystem.out.println();\nSystem.out.println(c);";
    var res = names.map(function (_, i) { return i < 3; });
    var ans = res.join(" ") + "\nTÖL101G: " + names.slice(0, 3).join(" ") + " (" + Math.min(3, names.length) + ")";
    return { topic: T, title: "Fylki af tilvísunum", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: ans, multi: true,
      sol: "<p>Fylkið hefur pláss fyrir 3. <code>students[count++] = s</code> geymir í hólf count og hækkar svo. Þegar fylkið er fullt skilar add false og nemandanum er ekki bætt við. toString fer aðeins í gegnum notuðu hólfin (i &lt; count).</p>",
      java: { main: main, classes: cls } };
  });

  // 3. Internering og ==
  B.G.push(function internering() {
    var w = pick(["uno", "java", "card", "pile"]), h = w.slice(0, 2), t = w.slice(2);
    var lines = [
      ["a == b", true], ["a == c", false], ["a == d", false], ["a.equals(d)", true], ["c.equals(b)", true], ["a == d.intern()", true], ["d == e", false],
    ];
    var f = B.shuffle(lines).slice(0, 4);
    var main = "String a = \"" + w + "\";\nString b = \"" + w + "\";\nString c = new String(\"" + w + "\");\nString h = \"" + h + "\";\nString d = h + \"" + t + "\";\nString e = h + \"" + t + "\";\n" + f.map(function (x) { return "System.out.println(" + x[0] + ");"; }).join("\n");
    return { topic: T, title: "Strengir og ==", text: "<p>Hvað prentar kóðinn?</p>" + code(main), answer: f.map(function (x) { return String(x[1]); }).join("\n"), multi: true,
      sol: "<p>Strengjabókstafir með sama innihaldi eru interneraðir (sami hlutur), svo <code>a == b</code>. <code>new String</code> og samskeyting með <b>breytu</b> við keyrslu búa til nýja hluti, svo == er false þó innihaldið sé eins. <code>intern()</code> skilar internaða eintakinu. equals ber alltaf saman innihald.</p>",
      java: { main: main } };
  });

  // 4. split
  B.G.push(function splitStrengir() {
    var cards = [], n = rnd(3, 5);
    for (var i = 0; i < n; i++) cards.push(pick(["R", "G", "B", "Y"]) + rnd(0, 9));
    var sep = pick([",", ";"]), extra = Math.random() < 0.5;
    var s = cards.join(sep) + (extra ? sep + sep : "");
    var main = "String s = \"" + s + "\";\nString[] parts = s.split(\"" + sep + "\");\nSystem.out.println(parts.length);\nint sum = 0;\nfor (String p : parts) {\n    sum += p.charAt(1) - '0';\n}\nSystem.out.println(parts[0] + \" \" + parts[parts.length - 1] + \" \" + sum);";
    var sum = cards.reduce(function (a, c) { return a + Number(c[1]); }, 0);
    return { topic: T, title: "split", text: "<p>Hvað prentar kóðinn?</p>" + code(main), answer: n + "\n" + cards[0] + " " + cards[n - 1] + " " + sum, multi: true,
      sol: "<p>split skiptir strengnum við hvert \"" + sep + "\"." + (extra ? " Tómir strengir <b>aftast</b> eru fjarlægðir, svo fylkið hefur " + n + " stök." : "") + " <code>p.charAt(1) - '0'</code> breytir tölustafnum í tölu.</p>",
      java: { main: main } };
  });

  // 5. StringBuilder
  B.G.push(function stringBuilder() {
    var w = pick(["uno", "stack", "card", "java"]), k = rnd(1, 9), c = pick(["X", "Y", "Z"]);
    var main = "StringBuilder sb = new StringBuilder(\"" + w + "\");\nsb.append(" + k + ").append('" + c + "');\nSystem.out.println(sb);\nsb.insert(0, \"[\");\nsb.reverse();\nSystem.out.println(sb + \" \" + sb.length());\nString s = \"" + w + "\";\ns.concat(\"!\");\nsb.setCharAt(0, '!');\nSystem.out.println(s + \" \" + sb);";
    var s1 = w + k + c, s2 = ("[" + s1).split("").reverse().join("");
    var ans = s1 + "\n" + s2 + " " + s2.length + "\n" + w + " !" + s2.slice(1);
    return { topic: T, title: "StringBuilder", text: "<p>Hvað prentar kóðinn?</p>" + code(main), answer: ans, multi: true,
      sol: "<p>StringBuilder er <b>breytanlegur</b>: append, insert, reverse og setCharAt breyta hlutnum sjálfum. String er óbreytanlegur, svo <code>s.concat(\"!\")</code> án gildisveitingar gerir ekkert.</p>",
      java: { main: main } };
  });

  B.MC.push(
    { topic: T, q: "Hvaða UML-tákn táknar samsetningu (composition)?", o: ["Fylltur tígull við heildina", "Holur tígull við heildina", "Holur þríhyrningur við yfirklasann", "Brotin lína með opinni ör"], c: 0, e: "Fylltur tígull: hlutarnir tilheyra aðeins heildinni og lifa og deyja með henni. Holur tígull er safntengsl." },
    { topic: T, q: "Hvaða UML-tákn táknar erfðir (Card extends … / DrawPile extends StackOfCards)?", o: ["Heil lína með holum þríhyrningi sem vísar á yfirklasann", "Heil lína með fylltum tígli", "Brotin lína með holum þríhyrningi", "Heil lína með opinni ör"], c: 0, e: "Erfðir (generalization): heil lína, holur þríhyrningur við yfirklasann. Brotin lína með þríhyrningi er útfærsla viðmóts (implements)." },
    { topic: T, q: "Hvað táknar brotin lína með holum þríhyrningi í UML?", o: ["Klasi útfærir viðmót (implements)", "Erfðir (extends)", "Samsetning", "Háð (dependency)"], c: 0, e: "Realization: klasinn lofar að útfæra aðferðir viðmótsins." },
    { topic: T, q: "Hvað táknar brotin lína með opinni ör?", o: ["Háð (dependency): klasi notar annan tímabundið, t.d. sem færibreytu", "Útfærsla viðmóts", "Safntengsl", "Erfðir"], c: 0, e: "Dependency er veikasta tengslin; enginn eigindi vísar á hinn klasann." },
    { topic: T, q: "Hvað þýðir fjöldatalan <code>0..*</code> við Card í sambandinu Player – Card?", o: ["Leikmaður getur haft engin eða hve mörg spil sem er", "Leikmaður hefur nákvæmlega eitt spil", "Spil tilheyrir 0 eða fleiri leikmönnum samtímis", "Leikmaður hefur að minnsta kosti eitt spil"], c: 0, e: "0..* (eða *) = hve margir sem er, líka enginn. 1..* = einn eða fleiri." },
    { topic: T, q: "Hvernig er sambandið „UnoGame hefur einn DrawPile“ venjulega útfært í Java?", o: ["Með eigindi <code>private DrawPile drawPile;</code> í UnoGame", "Með <code>class UnoGame extends DrawPile</code>", "Með færibreytu í main", "Með static aðferð í DrawPile"], c: 0, e: "„Hefur“ (association/aggregation/composition) verður að eigindi. „Er“ (inheritance) yrði extends." },
    { topic: T, q: "Hver er munurinn á safntengslum og samsetningu?", o: ["Í samsetningu tilheyra hlutarnir aðeins heildinni og lifa ekki án hennar; í safntengslum geta þeir lifað sjálfstætt", "Safntengsl eru alltaf 1 á móti 1", "Samsetning er bara til í viðmótum", "Enginn munur í Java"], c: 0, e: "Dæmi: hornpunktar þríhyrnings (samsetning) vs. nemendur námskeiðs (safntengsl)." },
    { topic: T, q: "<code>Card[] hand = new Card[7];</code> Hversu mörg Card-hlutir eru til eftir þessa línu?", o: ["Enginn; fylkið inniheldur 7 null-tilvísanir", "7", "1", "Fer eftir smiðnum"], c: 0, e: "new Card[7] býr til fylki af tilvísunum, allar null. Hvert spil þarf að búa til með new Card(…)." },
    { topic: T, q: "Triangle geymir tilvísanirnar á punktana sem hann fær í smiðnum. Hvað gerist ef punkturinn p er færður eftir að þríhyrningurinn er búinn til?", o: ["Horn þríhyrningsins færist líka", "Ekkert gerist við þríhyrninginn", "Þýðingarvilla", "NullPointerException"], c: 0, e: "Þríhyrningurinn og p vísa á sama Point-hlutinn. Til að forðast það þarf smiðurinn að afrita punktana (new Point(p.getX(), p.getY()))." },
    { topic: T, q: "<code>String a = \"uno\"; String b = \"uno\";</code> Hvað er <code>a == b</code>?", o: ["true, því strengjabókstafir eru interneraðir", "false, því þetta eru tveir hlutir", "Þýðingarvilla", "Fer eftir JVM"], c: 0, e: "Sami bókstafur vísar á sama internaða hlutinn. En það má ekki treysta á == fyrir strengi almennt; notaðu equals." },
    { topic: T, q: "Hvað skilar <code>\"a,b,,c,,\".split(\",\").length</code>?", o: ["4", "6", "3", "5"], c: 0, e: "Fylkið verður {\"a\", \"b\", \"\", \"c\"}: tómi strengurinn í miðjunni heldur sér, en tómir strengir aftast hverfa." },
    { topic: T, q: "Hvers vegna StringBuilder frekar en String í lykkju sem bætir við texta?", o: ["StringBuilder er breytanlegur, svo ekki þarf að búa til nýjan streng í hverri umferð", "String getur ekki geymt langan texta", "StringBuilder prentast hraðar", "String má ekki nota í lykkjum"], c: 0, e: "result += x býr til nýjan String í hverri umferð því String er óbreytanlegur. StringBuilder.append breytir sama hlutnum." },
    { topic: T, q: "Hvað er autoboxing?", o: ["Sjálfvirk umbreyting frumtags í umbúðaklasa, t.d. int í Integer", "Að setja hlut í fylki", "Að kasta double í int", "Að búa til hlut með new"], c: 0, e: "Integer x = 5; (boxing) og int y = x; (unboxing) gerast sjálfkrafa." },
    { topic: T, q: "Hvað þýðir „sveigjanleg innri útfærsla, fast ytra viðmót“?", o: ["Breyta má því hvernig klasi geymir gögnin sín án þess að aðrir klasar þurfi að breytast, ef public aðferðirnar haldast", "Eigindi eiga að vera public svo hægt sé að breyta þeim", "Viðmót (interface) má aldrei breyta", "Klasar eiga að hafa sem fæstar aðferðir"], c: 0, e: "Hjúpun: aðrir klasar sjá bara public aðferðirnar. StackOfCards gæti skipt úr fylki í lista án þess að UnoGame tæki eftir því." },
    { topic: T, q: "Hvar á klasinn <code>unogame.Card</code> að vera?", o: ["Í skránni Card.java í möppunni unogame, með <code>package unogame;</code> efst", "Í UnoGame.java", "Í hvaða möppu sem er", "Í skránni unogame.java"], c: 0, e: "Hver public klasi er í skrá með sama nafni, og pakkaskipanin endurspeglast í möppuskipaninni." },
    { topic: T, q: "Í Inspera skrifar þú klasana Point og Main í sama glugga. Hvað á að gæta að?", o: ["Klasarnir mega ekki vera public", "Aðeins annar klasinn má hafa smið", "Point verður að vera á undan Main", "Það er ekki leyfilegt"], c: 0, e: "Aðeins einn public klasi má vera í hverri skrá. Á prófinu: ekki skrifa public fyrir framan klasana (public aðferðir eru í lagi)." }
  );
})();

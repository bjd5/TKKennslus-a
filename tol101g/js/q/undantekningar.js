/* q/undantekningar.js – kafli 12: Undantekningar og pakkar (Liang kafli 12, glærur 12.2 og 14.1). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, code = B.code, D = B.dedent;
  var T = "undantekningar";
  var show = function (classes, main) { return code(classes + "\n// í main:\n" + main); };

  // 1. try/catch/finally með return
  B.G.push(function tryCatchFinally() {
    var xs = [rnd(1, 5), 0, rnd(6, 10)];
    if (Math.random() < 0.5) xs = B.shuffle(xs);
    var n = rnd(10, 40);
    var members = D("\n  static int f(int x) {\n      try {\n          System.out.print(\"a\");\n          int y = " + n + " / x;\n          System.out.print(\"b\");\n          return y;\n      } catch (ArithmeticException e) {\n          System.out.print(\"c\");\n          return -1;\n      } finally {\n          System.out.print(\"d\");\n      }\n  }\n");
    var main = xs.map(function (x) { return "System.out.println(\" \" + f(" + x + "));"; }).join("\n");
    var ans = xs.map(function (x) { return x === 0 ? "acd -1" : "abd " + Math.trunc(n / x); }).join("\n");
    return { topic: T, title: "try, catch og finally", text: "<p>Hvað prentar kóðinn?</p>" + show(members, main), answer: ans, multi: true,
      sol: "<p>Ef deilt er með 0 kastast ArithmeticException: afgangi try-blokkarinnar er sleppt (ekkert b) og catch keyrir. <code>finally</code> keyrir <b>alltaf</b>, líka þótt return sé í try eða catch, og áður en aðferðin skilar í raun. f er kölluð áður en strengurinn í main er prentaður.</p>",
      java: { main: main, members: members } };
  });

  // 2. Hvaða catch grípur?
  B.G.push(function hvadaCatch() {
    var vals = B.shuffle([0, 1, 2, 3]).slice(0, 3);
    var members = D("\n  static void risky(int k) {\n      int[] a = new int[2];\n      String s = null;\n      if (k == 0) a[2] = 1;\n      if (k == 1) s.length();\n      if (k == 2) Integer.parseInt(\"x\" + k);\n      System.out.print(\"ok \");\n  }\n");
    var main = "for (int k : new int[] {" + vals.join(", ") + "}) {\n    try {\n        risky(k);\n        System.out.print(\"after \");\n    } catch (ArrayIndexOutOfBoundsException e) {\n        System.out.print(\"AIOOBE \");\n    } catch (IllegalArgumentException e) {\n        System.out.print(\"IAE \");\n    } catch (RuntimeException e) {\n        System.out.print(\"RTE \");\n    }\n}\nSystem.out.println(\"end\");";
    var map = { 0: "AIOOBE ", 1: "RTE ", 2: "IAE ", 3: "ok after " };
    return { topic: T, title: "Hvaða catch grípur?", text: "<p>Hvað prentar kóðinn? (NumberFormatException er undirklasi IllegalArgumentException.)</p>" + show(members, main), answer: vals.map(function (v) { return map[v]; }).join("") + "end",
      sol: "<p>Fyrsta catch-blokkin sem passar við tegundina (eða yfirklasa hennar) grípur. k = 0: vísir 2 í fylki af lengd 2. k = 1: NullPointerException, sem aðeins RuntimeException grípur. k = 2: parseInt kastar NumberFormatException, sem er IllegalArgumentException. k = 3: ekkert kastast. Eftir catch heldur lykkjan áfram.</p>",
      java: { main: main, members: members } };
  });

  // 3. Undantekning flýgur upp
  B.G.push(function flygurUpp() {
    var bad = Math.random() < 0.7, v = bad ? -rnd(1, 9) : rnd(1, 9);
    var members = D("\n  static int c(int x) {\n      System.out.print(\"c1 \");\n      if (x < 0) throw new IllegalArgumentException(\"neg \" + x);\n      System.out.print(\"c2 \");\n      return x * 2;\n  }\n  static int b(int x) {\n      try {\n          System.out.print(\"b1 \");\n          int r = c(x);\n          System.out.print(\"b2 \");\n          return r;\n      } finally {\n          System.out.print(\"bF \");\n      }\n  }\n");
    var main = "try {\n    System.out.print(\"a1 \");\n    int r = b(" + v + ");\n    System.out.print(\"r=\" + r + \" \");\n} catch (IllegalArgumentException e) {\n    System.out.print(\"caught:\" + e.getMessage() + \" \");\n}\nSystem.out.println(\"end\");";
    var ans = bad ? "a1 b1 c1 bF caught:neg " + v + " end" : "a1 b1 c1 c2 b2 bF r=" + v * 2 + " end";
    return { topic: T, title: "Undantekning flýgur upp", text: "<p>Hvað prentar kóðinn?</p>" + show(members, main), answer: ans,
      sol: "<p>" + (bad ? "c kastar; enginn í c eða b grípur, svo undantekningin flýgur upp kallhlaðann. finally í b keyrir á leiðinni upp (bF), og catch í main grípur hana. getMessage() skilar skilaboðunum úr smiðnum." : "Ekkert kastast, svo öll skrefin keyra; finally í b keyrir rétt áður en b skilar.") + "</p>",
      java: { main: main, members: members } };
  });

  // 4. Eigin undantekning
  B.G.push(function eiginUndantekning() {
    var caps = rnd(2, 3), pushes = rnd(caps + 1, caps + 2);
    var cls = D("\n  class FullStackException extends Exception {\n      public FullStackException(String msg) { super(msg); }\n  }\n  class SmallStack {\n      private int[] items;\n      private int top = -1;\n      public SmallStack(int cap) { items = new int[cap]; }\n      public void push(int x) throws FullStackException {\n          if (top == items.length - 1) {\n              throw new FullStackException(\"full at \" + x);\n          }\n          items[++top] = x;\n      }\n      public int size() { return top + 1; }\n  }\n");
    var main = "SmallStack s = new SmallStack(" + caps + ");\ntry {\n    for (int i = 1; i <= " + pushes + "; i++) {\n        s.push(i * 10);\n        System.out.print(i + \" \");\n    }\n    System.out.print(\"done \");\n} catch (FullStackException e) {\n    System.out.print(e.getMessage() + \" \");\n}\nSystem.out.println(s.size());";
    var o = ""; for (var i = 1; i <= caps; i++) o += i + " ";
    o += "full at " + (caps + 1) * 10 + " " + caps;
    return { topic: T, title: "Eigin undantekning", text: "<p>Hvað prentar kóðinn?</p>" + show(cls, main), answer: o,
      sol: "<p>Fyrstu " + caps + " push-köllin takast. Þegar hlaðinn er fullur kastar push FullStackException <b>áður</b> en ástandinu er breytt, svo size helst " + caps + ". Afgangi try-blokkarinnar (líka „done“) er sleppt. FullStackException erfir Exception, svo hún er athuguð og push þarf <code>throws</code>.</p>",
      java: { main: main, classes: cls } };
  });

  // 5. parseInt og NumberFormatException
  B.G.push(function parseIntVillur() {
    var toks = B.shuffle([String(rnd(1, 20)), String(rnd(1, 20)), "abc", "4.5", String(rnd(1, 20)), "", "-" + rnd(1, 9)]).slice(0, 5);
    var main = "String[] in = {" + toks.map(function (t) { return "\"" + t + "\""; }).join(", ") + "};\nint sum = 0, bad = 0;\nfor (String t : in) {\n    try {\n        sum += Integer.parseInt(t);\n    } catch (NumberFormatException e) {\n        bad++;\n    }\n}\nSystem.out.println(sum + \" \" + bad);";
    var s = 0, b = 0;
    toks.forEach(function (t) { if (/^-?\d+$/.test(t)) s += parseInt(t, 10); else b++; });
    return { topic: T, title: "parseInt og villur", text: "<p>Hvað prentar kóðinn?</p>" + code(main), answer: s + " " + b,
      sol: "<p>Integer.parseInt tekur aðeins heiltölur (með mögulegu mínusmerki). „abc“, „4.5“ og tómi strengurinn kasta NumberFormatException, sem er gripin, og lykkjan heldur áfram með næsta streng.</p>",
      java: { main: main } };
  });

  B.MC.push(
    { topic: T, q: "Hvað gerist þegar undantekning kastast í miðri try-blokk?", o: ["Afgangi try-blokkarinnar er sleppt og keyrslan fer í fyrstu catch-blokk sem passar", "try-blokkin klárast og svo er catch keyrð", "Forritið stöðvast alltaf", "Keyrslan fer aftur í byrjun try"], c: 0, e: "Settu því allt sem á ekki að keyra eftir villu inn í try-blokkina." },
    { topic: T, q: "Hvenær keyrir <code>finally</code>-blokk?", o: ["Alltaf, hvort sem undantekning kastast eða ekki", "Aðeins ef undantekning kastast", "Aðeins ef engin undantekning kastast", "Aðeins ef catch-blokk vantar"], c: 0, e: "Líka þegar return er í try eða catch, og þótt undantekningin sé ekki gripin (hún heldur þá áfram upp eftir finally)." },
    { topic: T, q: "Hver er munurinn á <code>throw</code> og <code>throws</code>?", o: ["throw kastar undantekningu (setning); throws lýsir yfir í aðferðarhaus að hún geti kastast", "Enginn munur", "throws kastar mörgum í einu", "throw er fyrir óathugaðar, throws fyrir athugaðar"], c: 0, e: "throw new InvalidYearException(); í líkamanum; public int f() throws InvalidYearException í hausnum." },
    { topic: T, q: "Hvaða undantekningar þarf annaðhvort að grípa eða lýsa yfir með throws?", o: ["Athugaðar (checked): undirklasar Exception sem ekki eru RuntimeException", "Allar undantekningar", "Aðeins RuntimeException", "Engar"], c: 0, e: "„Catch or declare“-reglan gildir um athugaðar undantekningar eins og IOException. Óathugaðar (RuntimeException og undirklasar) eru undanþegnar." },
    { topic: T, q: "Hvaða undantekning er óathuguð (unchecked)?", o: ["NullPointerException", "IOException", "FileNotFoundException", "Eigin klasi sem extends Exception"], c: 0, e: "NullPointerException erfir RuntimeException. Hinar eru athugaðar." },
    { topic: T, q: "Hvað er að þessu? <code>try { … } catch (Exception e) { … } catch (ArithmeticException e) { … }</code>", o: ["Seinni catch-blokkin næst aldrei: þýðingarvilla", "Ekkert", "Það vantar finally", "Báðar blokkirnar keyra"], c: 0, e: "Exception grípur allt, líka ArithmeticException. Raðaðu frá sértæku til almenns." },
    { topic: T, q: "Hvað gerir <code>catch (Exception e) { }</code>?", o: ["Grípur og felur allar villur, sem á nær aldrei að gera", "Ekkert, það er bannað", "Endurræsir forritið", "Prentar staflarakningu"], c: 0, e: "Tóm catch-blokk felur villur. Ef það er óhjákvæmilegt á að skrifa athugasemd sem útskýrir af hverju." },
    { topic: T, q: "Hvað gerist ef undantekning er hvergi gripin?", o: ["Hún flýgur upp í gegnum öll kallin, JVM stöðvar forritið og prentar staflarakningu", "Hún er hunsuð", "Forritið heldur áfram í næstu línu", "Hún breytist í return null"], c: 0, e: "Exception in thread \"main\" java.lang.…: skilaboð, at Klasi.aðferð(Skrá.java:lína) …" },
    { topic: T, q: "Hvernig býrðu til eigin athugaða undantekningu?", o: ["<code>class MyException extends Exception { … }</code>", "<code>class MyException extends RuntimeException { … }</code>", "<code>interface MyException { … }</code>", "<code>class MyException implements Throwable { … }</code>"], c: 0, e: "Exception = athuguð. RuntimeException = óathuguð (eins og EmptyStackException í UNO)." },
    { topic: T, q: "Hvað skilar <code>e.getMessage()</code>?", o: ["Skilaboðin sem voru gefin smið undantekningarinnar", "Nafn klasans", "Línunúmerið", "Alltaf null"], c: 0, e: "new InvalidYearException(\"Engin ár fyrir 1453\") → getMessage() skilar þeim streng (eða null ef engin skilaboð)." },
    { topic: T, q: "Hvaða undantekningu kastar <code>Integer.parseInt(\"4.5\")</code>?", o: ["NumberFormatException", "InputMismatchException", "ArithmeticException", "Enga, skilar 4"], c: 0, e: "parseInt tekur aðeins heiltölur. NumberFormatException er undirklasi IllegalArgumentException." },
    { topic: T, q: "Hvaða undantekningu kastar <code>scanner.nextInt()</code> ef notandinn slær inn „abc“?", o: ["InputMismatchException", "NumberFormatException", "IOException", "NullPointerException"], c: 0, e: "InputMismatchException (java.util). Ógilda orðið situr eftir í inntakinu, svo kalla þarf á next() til að fjarlægja það." },
    { topic: T, q: "Í UNO-spilinu er <code>EmptyStackException extends RuntimeException</code>. Hvað þýðir það fyrir þá sem kalla á pop()?", o: ["Þeir þurfa ekki að grípa hana eða lýsa yfir (óathuguð)", "Þeir verða að grípa hana", "Þeir verða að lýsa henni yfir með throws", "pop() má ekki kasta henni"], c: 0, e: "Tómur bunki er forritunarvilla sem á ekki að gerast í gallalausu forriti, svo óathuguð undantekning hentar." },
    { topic: T, q: "Hvað er kostur undantekninga fram yfir villukóða eins og <code>return -1</code>?", o: ["Sérstök rás fyrir villur, nákvæm tegund og þvinguð meðhöndlun", "Þær eru hraðvirkari", "Þær spara minni", "Þær koma í veg fyrir allar villur"], c: 0, e: "Villan blandast ekki venjulegum skilagildum, merkingin er formleg (klasi) og þýðandinn getur krafist meðhöndlunar." },
    { topic: T, q: "Hvar á <code>package uno.game;</code> að standa?", o: ["Í fyrstu setningu skrárinnar (á undan import)", "Á eftir import", "Inni í klasanum", "Í main"], c: 0, e: "package fyrst, svo import, svo klasinn. Skráin á að vera í möppunni uno/game/." },
    { topic: T, q: "Klasinn <code>class StackOfCards</code> (án aðgangsorðs) er í pakkanum uno.game. Hver má nota hann?", o: ["Aðeins klasar í pakkanum uno.game", "Allir", "Aðeins undirklasar", "Aðeins StackOfCards sjálfur"], c: 0, e: "Enginn aðgangur = pakkaaðgangur (~ í UML). Þannig er hann falinn leikmönnunum í uno.players." },
    { topic: T, q: "Hvaða pakka þarf <b>ekki</b> að flytja inn með import?", o: ["java.lang (String, Math, System, Integer)", "java.util (Scanner, Arrays)", "java.io", "Engan, allt þarf import"], c: 0, e: "java.lang er alltaf aðgengilegur. Scanner og Arrays eru í java.util." },
    { topic: T, q: "Hvenær á að nota athugaða undantekningu?", o: ["Fyrir fyrirsjáanlegar en óhjákvæmilegar aðstæður sem kallandinn getur brugðist við (t.d. skrá vantar)", "Fyrir allar forritunarvillur", "Aldrei", "Fyrir null-tilvísanir"], c: 0, e: "Óathugaðar eru fyrir villur sem eiga ekki að gerast í gallalausu forriti (null, rangur vísir, ógild færibreyta)." }
  );
})();

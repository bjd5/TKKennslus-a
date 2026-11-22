/* w/kafli-5.js – kóðaverkstæði fyrir kafla 5: Lykkjur. */
(function () {
  function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  TK.workshop("kafli-5", [
    { type: "trace", title: "Rekja while-lykkju", prompt: "<p>Fylltu út gildi <code>a</code> og <code>b</code> eftir hverja umferð lykkjunnar.</p>",
      cols: ["a", "b"], gen: function () {
        var a = rnd(1, 4), b = 0, f = rnd(2, 3), lim = rnd(25, 80), rows = [], st = a;
        while (a < lim) { b += a; a *= f; rows.push([String(a), String(b)]); }
        return { code: "int a = " + st + ", b = 0;\nwhile (a < " + lim + ") {\n    b += a;\n    a *= " + f + ";\n}", rows: rows };
      } },
    { type: "parsons", title: "Lesa löglegt teningskast", prompt: "<p>Raðaðu línunum svo forritið spyrji aftur og aftur þar til notandinn slær inn tölu á bilinu 1-6, og prenti hana svo.</p>",
      lines: ["int roll;", "do {", "    System.out.print(\"Kast (1-6)? \");", "    roll = input.nextInt();", "} while (roll < 1 || roll > 6);", "System.out.println(\"Þú kastaðir \" + roll);"],
      extra: ["} while (roll >= 1 && roll <= 6);"] },
    { type: "gaps", title: "Þversumma og frumtala", prompt: "<p>Fyrri hlutinn reiknar þversummu n (summu tölustafanna); seinni hlutinn athugar hvort m sé frumtala.</p>",
      code: "int sum = 0;\nwhile (n [[>]] 0) {\n    sum += n [[%]] 10;\n    n [[/=]] 10;\n}\n\nboolean prime = m > 1;\nfor (int d = 2; d * d <= m; d++) {\n    if (m % d == [[0]]) {\n        prime = [[false]];\n        [[break]];\n    }\n}" },
    { type: "bug", title: "Meðaltal einkunna", prompt: "<p>Forritið les 5 einkunnir og prentar meðaltalið, en það les bara 4. Hvaða lína er röng?</p>",
      code: "Scanner input = new Scanner(System.in);\ndouble sum = 0;\nfor (int i = 1; i < 5; i++) {\n    sum += input.nextDouble();\n}\nSystem.out.println(sum / 5);",
      bug: 2, explain: "Einum of lítið: <code>i = 1, 2, 3, 4</code> eru 4 umferðir. Rétt: <code>for (int i = 0; i &lt; 5; i++)</code> eða <code>for (int i = 1; i &lt;= 5; i++)</code>." },
    { type: "bug", title: "Endalaus lykkja", prompt: "<p>Forritið á að prenta 10, 8, 6, 4, 2 en hættir aldrei. Hvaða lína er röng?</p>",
      code: "int i = 10;\nwhile (i > 0) {\n    System.out.println(i);\n    i += 2;\n}",
      bug: 3, explain: "<code>i += 2</code> hækkar i, svo skilyrðið <code>i &gt; 0</code> verður aldrei ósatt. Rétt: <code>i -= 2;</code>" },
    { type: "match", title: "Hve margar umferðir?", prompt: "<p>Paraðu lykkjuhaus og fjölda umferða.</p>",
      pairs: [["<code>for (int i = 0; i &lt; 10; i++)</code>", "10"], ["<code>for (int i = 1; i &lt;= 10; i += 2)</code>", "5"], ["<code>for (int i = 10; i &gt; 0; i -= 3)</code>", "4"], ["<code>for (int i = 1; i &lt; 64; i *= 2)</code>", "6"], ["<code>for (int i = 5; i &lt; 5; i++)</code>", "0"], ["<code>for (int i = 0; i &lt;= 10; i++)</code>", "11"]] }
  ]);
})();

/* w/kafli-2.js – kóðaverkstæði fyrir kafla 2: Tölur, breytur og segðir. */
(function () {
  function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  TK.workshop("kafli-2", [
    { type: "trace", title: "Rekja gildisveitingar", prompt: "<p>Fylltu út gildi <code>x</code> og <code>y</code> <b>eftir</b> hverja línu (línur 3-6).</p>",
      cols: ["x", "y"], gen: function () {
        var x = rnd(3, 9), y = rnd(2, 6), rows = [], code = ["int x = " + x + ";", "int y = " + y + ";"];
        var steps = [["x = x + y;", function () { x = x + y; }], ["y = x - y;", function () { y = x - y; }], ["x = x * 2 % 7;", function () { x = (x * 2) % 7; }], ["y += x / 2;", function () { y += Math.trunc(x / 2); }], ["x = y++ - x;", function () { var t = y; y++; x = t - x; }], ["y = --x + y;", function () { x--; y = x + y; }]];
        for (var i = 0; i < 4; i++) { var s = steps[rnd(0, steps.length - 1)]; code.push(s[0]); s[1](); rows.push([String(x), String(y)]); }
        return { code: code.join("\n"), rows: rows };
      } },
    { type: "gaps", title: "Mínútur og sekúndur", prompt: "<p>Forritið les fjölda sekúndna og prentar t.d. <code>500 s = 8 mín og 20 s</code>.</p>",
      code: "Scanner input = new Scanner(System.in);\nint total = input.nextInt();\nint min = total [[/]] 60;\nint sec = total [[%]] 60;\nSystem.out.println(total + \" s = \" + [[min]] + \" mín og \" + sec + \" s\");" },
    { type: "bug", title: "Meðaltal sem er alltaf heiltala", prompt: "<p>Forritið á að prenta meðaltal þriggja heiltalna, t.d. 2.3333333333333335 fyrir 1, 2 og 4, en prentar 2.0. Smelltu á línuna sem veldur því.</p>",
      code: "int a = 1;\nint b = 2;\nint c = 4;\nint sum = a + b + c;\ndouble avg = sum / 3;\nSystem.out.println(avg);",
      bug: 4, explain: "<code>sum / 3</code> er heiltöludeiling (7 / 3 = 2) og útkomunni 2 er svo breytt í 2.0. Rétt: <code>sum / 3.0</code> eða <code>(double) sum / 3</code>." },
    { type: "parsons", title: "Flatarmál hrings", prompt: "<p>Raðaðu línunum svo forritið lesi radíus og prenti flatarmál hringsins (π r²).</p>",
      lines: ["Scanner input = new Scanner(System.in);", "System.out.print(\"Radius? \");", "double r = input.nextDouble();", "double area = Math.PI * Math.pow(r, 2);", "System.out.println(\"Area: \" + area);"],
      extra: ["int r = input.nextDouble();"] },
    { type: "match", title: "Hvað prentast?", prompt: "<p>Paraðu saman segð og það sem <code>System.out.println</code> prentar.</p>",
      pairs: [["<code>7 / 2</code>", "3"], ["<code>7 % 2</code>", "1"], ["<code>7.0 / 2</code>", "3.5"], ["<code>(double) (7 / 2)</code>", "3.0"], ["<code>(int) 7.9</code>", "7"], ["<code>Math.pow(2, 3)</code>", "8.0"], ["<code>1 + 2 + \"3\"</code>", "33"]] }
  ]);
})();

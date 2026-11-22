/* w/kafli-7.js – kóðaverkstæði fyrir kafla 7: Fylki. */
(function () {
  function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  TK.workshop("kafli-7", [
    { type: "bug", title: "Mánuðirnir (taskA)", prompt: "<p>Forritið á að prenta alla 12 mánuðina en sleppir Jan og kastar <code>ArrayIndexOutOfBoundsException</code> í lokin. Hvaða lína er röng?</p>",
      code: "String[] months = {\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\",\n                   \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\"};\nfor (int i = 1; i <= months.length; i++) {\n    System.out.println(months[i]);\n}",
      bug: 2, explain: "Vísarnir eru 0-11. Rétt: <code>for (int i = 0; i &lt; months.length; i++)</code>." },
    { type: "trace", title: "Uppsöfnuð summa", prompt: "<p>Fylltu út gildi <code>a[i]</code> og <code>total</code> eftir hverja umferð.</p>",
      cols: ["a[i]", "total"], gen: function () {
        var a = [], n = 5; for (var i = 0; i < n; i++) a.push(rnd(1, 9));
        var rows = [], t = 0, b = a.slice();
        for (var j = 0; j < n; j++) { t += b[j]; b[j] = t; rows.push([String(b[j]), String(t)]); }
        return { code: "int[] a = {" + a.join(", ") + "};\nint total = 0;\nfor (int i = 0; i < a.length; i++) {\n    total += a[i];\n    a[i] = total;\n}", rows: rows };
      } },
    { type: "gaps", title: "Afrita tvívítt fylki", prompt: "<p>Kláraðu <code>copy(int[][] in)</code> úr MultiArrays: aðferðin á að skila nýju fylki með sömu gildum (ferhyrnt fylki).</p>",
      code: "public static int[][] copy(int[][] in) {\n    int[][] out = new int[in.[[length]]][in[0].[[length]]];\n    for (int r = 0; r < in.length; r++) {\n        for (int c = 0; c < in[r].[[length]]; c++) {\n            out[r][c] = [[in]][r][c];\n        }\n    }\n    [[return out]];\n}" },
    { type: "parsons", title: "Stærsta gildi og staðsetning", prompt: "<p>Raðaðu línunum í aðferð sem skilar <b>vísi</b> stærsta staksins.</p>",
      lines: ["public static int indexOfMax(int[] a) {", "    int maxIdx = 0;", "    for (int i = 1; i < a.length; i++) {", "        if (a[i] > a[maxIdx]) {", "            maxIdx = i;", "        }", "    }", "    return maxIdx;", "}"],
      extra: ["            maxIdx = a[i];", "    return a[maxIdx];"] },
    { type: "match", title: "Tilvísanir", prompt: "<p><code>int[] c = {42, 32, 12}; int[] d = c; int[] e = c.clone(); d[0] = 84; e[1] = 0;</code> Paraðu segð og gildi.</p>",
      pairs: [["<code>c[0]</code>", "84"], ["<code>c[1]</code>", "32"], ["<code>e[0]</code>", "42"], ["<code>e[1]</code>", "0"], ["<code>c == d</code>", "true"], ["<code>c == e</code>", "false"]] }
  ]);
})();

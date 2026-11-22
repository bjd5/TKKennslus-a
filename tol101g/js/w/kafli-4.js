/* w/kafli-4.js – kóðaverkstæði fyrir kafla 4: Stafir og strengir. */
(function () {
  function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  var WORDS = ["UNO", "JAVA", "STACK", "LADDER", "POINT", "CARD"];
  TK.workshop("kafli-4", [
    { type: "parsons", title: "Snúa streng við", prompt: "<p>Raðaðu línunum svo forritið prenti strenginn <code>s</code> afturábak.</p>",
      lines: ["String s = input.nextLine();", "String result = \"\";", "for (int i = s.length() - 1; i >= 0; i--) {", "    result += s.charAt(i);", "}", "System.out.println(result);"],
      extra: ["for (int i = s.length(); i >= 0; i--) {"] },
    { type: "gaps", title: "Telja hástafi", prompt: "<p>Forritið telur hástafina í strengnum <code>s</code>.</p>",
      code: "int count = 0;\nfor (int i = 0; i < s.[[length()]]; i++) {\n    char c = s.[[charAt]](i);\n    if (Character.[[isUpperCase]](c)) {\n        count[[++|+= 1]];\n    }\n}\nSystem.out.println(count);" },
    { type: "bug", title: "Fyrsta og síðasta", prompt: "<p>Forritið á að prenta fyrsta og síðasta staf strengsins, en kastar <code>StringIndexOutOfBoundsException</code>.</p>",
      code: "String s = \"Polymorphism\";\nchar first = s.charAt(0);\nchar last = s.charAt(s.length());\nSystem.out.println(first + \"\" + last);",
      bug: 2, explain: "Vísarnir eru 0 til <code>length() - 1</code>. Síðasti stafurinn er <code>s.charAt(s.length() - 1)</code>." },
    { type: "trace", title: "Dulkóðun (Caesar)", prompt: "<p>Hver stafur er færður um 3 sæti í stafrófinu (Z → C). Fylltu út <code>c</code> og <code>result</code> eftir hverja umferð.</p>",
      cols: ["c", "result"], hint: "Skrifaðu stafina án gæsalappa, t.d. X og ABC.", gen: function () {
        var w = WORDS[rnd(0, WORDS.length - 1)], r = "", rows = [];
        for (var i = 0; i < w.length; i++) { var c = String.fromCharCode((w.charCodeAt(i) - 65 + 3) % 26 + 65); r += c; rows.push([c, r]); }
        return { code: "String s = \"" + w + "\";\nString result = \"\";\nfor (int i = 0; i < s.length(); i++) {\n    char c = (char) ((s.charAt(i) - 'A' + 3) % 26 + 'A');\n    result += c;\n}", rows: rows };
      } },
    { type: "match", title: "String-aðferðir", prompt: "<p>Með <code>String s = \"Snakes\";</code>: paraðu segð og gildi.</p>",
      pairs: [["<code>s.length()</code>", "6"], ["<code>s.charAt(1)</code>", "n"], ["<code>s.substring(1, 4)</code>", "nak"], ["<code>s.indexOf('k')</code>", "3"], ["<code>s.indexOf(\"x\")</code>", "-1"], ["<code>s.toUpperCase()</code>", "SNAKES"], ["<code>s.endsWith(\"es\")</code>", "true"]] }
  ]);
})();

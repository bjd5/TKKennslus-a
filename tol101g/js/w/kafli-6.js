/* w/kafli-6.js – kóðaverkstæði fyrir kafla 6: Aðferðir. */
TK.workshop("kafli-6", [
  { type: "parsons", title: "Aðferð sem skilar stærsta gildi", prompt: "<p>Raðaðu línunum í aðferð sem skilar stærstu af þremur heiltölum.</p>",
    lines: ["public static int max3(int a, int b, int c) {", "    int max = a;", "    if (b > max) {", "        max = b;", "    }", "    if (c > max) {", "        max = c;", "    }", "    return max;", "}"],
    alts: [[0, 1, 5, 6, 7, 2, 3, 4, 8, 9]], extra: ["    System.out.println(max);", "public static void max3(int a, int b, int c) {"] },
  { type: "gaps", title: "Veldisaðferð", prompt: "<p>Aðferðin reiknar <code>base<sup>exp</sup></code> og <code>area</code> notar hana til að reikna flatarmál hrings.</p>",
    code: "public static [[double]] pow(double base, [[int]] exp) {\n    double result = 1;\n    while (exp > 0) {\n        result = result * base;\n        exp[[--|-= 1]];\n    }\n    [[return]] result;\n}\n\npublic static double area(double r) {\n    return Math.PI * [[pow]](r, 2);\n}" },
  { type: "bug", title: "Missing return statement", prompt: "<p>Þessi aðferð þýðist ekki. Hvaða lína veldur því (smelltu þar sem eitthvað vantar á eftir)?</p>",
    code: "public static String grade(int score) {\n    if (score >= 90) {\n        return \"A\";\n    } else if (score >= 50) {\n        return \"Staðið\";\n    }\n}",
    bug: 5, explain: "Ef <code>score &lt; 50</code> nær keyrslan enda aðferðarinnar án return. Bættu við <code>return \"Fallið\";</code> á eftir if-keðjunni (eða breyttu síðasta <code>else if</code> í <code>else</code>)." },
  { type: "bug", title: "Víxlið sem virkar ekki", prompt: "<p>Forritarinn býst við að main prenti <code>7 3</code>, en það prentar <code>3 7</code>. Í hvaða línu liggur misskilningurinn?</p>",
    code: "static void swap(int a, int b) {\n    int t = a;\n    a = b;\n    b = t;\n}\n\npublic static void main(String[] args) {\n    int x = 3, y = 7;\n    swap(x, y);\n    System.out.println(x + \" \" + y);\n}",
    bug: 8, explain: "<code>swap(x, y)</code> fær <b>afrit</b> af gildunum (gildisfærsla). Víxlið gerist bara á afritunum a og b. Í Java er ekki hægt að víxla frumtagsbreytum þess sem kallar með aðferð." },
  { type: "match", title: "Hvaða aðferð er kölluð?", prompt: "<p>Klasinn hefur <code>f(int)</code>, <code>f(double)</code>, <code>f(String)</code> og <code>f(int, int)</code>. Paraðu kall og útgáfu.</p>",
    pairs: [["<code>f(7)</code>", "f(int)"], ["<code>f(7.0)</code>", "f(double)"], ["<code>f(7 / 2)</code>", "f(int) með gildið 3"], ["<code>f(7 / 2.0)</code>", "f(double) með gildið 3.5"], ["<code>f(\"7\")</code>", "f(String)"], ["<code>f(3, 4)</code>", "f(int, int)"]] }
]);

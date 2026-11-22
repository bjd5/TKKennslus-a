/* w/kafli-3.js – kóðaverkstæði fyrir kafla 3: Rökgildi og skilyrði. */
TK.workshop("kafli-3", [
  { type: "parsons", title: "Einkunnastigi", prompt: "<p>Raðaðu línunum svo forritið prenti A fyrir 90+, B fyrir 80-89, C fyrir 70-79 og F annars.</p>",
    lines: ["if (score >= 90) {", "    System.out.println(\"A\");", "} else if (score >= 80) {", "    System.out.println(\"B\");", "} else if (score >= 70) {", "    System.out.println(\"C\");", "} else {", "    System.out.println(\"F\");", "}"] },
  { type: "gaps", title: "Inni eða úti?", prompt: "<p>Er punkturinn (px, py) inni í rétthyrningnum með hornin (x1, y1) og (x2, y2)? Hornin geta komið í hvaða röð sem er.</p>",
    code: "if (px >= Math.[[min]](x1, x2) [[&&]] px <= Math.[[max]](x1, x2) &&\n    py >= Math.min(y1, y2) && py [[<=]] Math.max(y1, y2)) {\n    System.out.println(\"inside\");\n} [[else]] {\n    System.out.println(\"outside\");\n}" },
  { type: "bug", title: "Helgi eða virkur dagur", prompt: "<p>Fyrir <code>day = 6</code> prentar forritið bæði „helgi“ og „villa“. Smelltu á línuna þar sem vantar eitthvað.</p>",
    code: "switch (day) {\n    case 1: case 2: case 3: case 4: case 5:\n        System.out.println(\"virkur dagur\");\n        break;\n    case 6: case 7:\n        System.out.println(\"helgi\");\n    default:\n        System.out.println(\"villa\");\n}",
    bug: 5, explain: "Það vantar <code>break;</code> á eftir <code>System.out.println(\"helgi\");</code>. Án þess fellur keyrslan í gegn í default-greinina." },
  { type: "bug", title: "Strengjasamanburður", prompt: "<p>Notandinn slær inn <code>ja</code> en forritið prentar samt „Nei“. Hvaða lína er röng?</p>",
    code: "Scanner input = new Scanner(System.in);\nString svar = input.next();\nif (svar == \"ja\") {\n    System.out.println(\"Já\");\n} else {\n    System.out.println(\"Nei\");\n}",
    bug: 2, explain: "<code>==</code> ber saman <b>tilvísanir</b> (hvort þetta sé sami hluturinn í minni), ekki innihald strengjanna. Strengurinn sem Scanner les er nýr hlutur. Rétt: <code>svar.equals(\"ja\")</code>." },
  { type: "match", title: "Hvað er segðin?", prompt: "<p>Með <code>int a = 2, b = 5;</code>: paraðu segð og gildi.</p>",
    pairs: [["<code>a &lt; b &amp;&amp; b &lt; 4</code>", "false"], ["<code>a &lt; b || b &lt; 4</code>", "true"], ["<code>a &gt; b ? a : b</code>", "5"], ["<code>a + b</code>", "7"], ["<code>b / a</code>", "2"], ["<code>b % a</code>", "1"]] }
]);

/* q/skilyrdi.js – kafli 3: Rökgildi og skilyrði (Liang kafli 3). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, code = B.code;
  var T = "skilyrdi";

  // 1. else-if keðja (röðin skiptir máli)
  B.G.push(function elseIfKedja() {
    var s = rnd(40, 100), wrongOrder = Math.random() < 0.4;
    var th = wrongOrder ? [[70, "C"], [80, "B"], [90, "A"]] : [[90, "A"], [80, "B"], [70, "C"]];
    var src = "int score = " + s + ";\nchar grade;\nif (score >= " + th[0][0] + ") {\n    grade = '" + th[0][1] + "';\n} else if (score >= " + th[1][0] + ") {\n    grade = '" + th[1][1] + "';\n} else if (score >= " + th[2][0] + ") {\n    grade = '" + th[2][1] + "';\n} else {\n    grade = 'F';\n}\nSystem.out.println(score + \": \" + grade);";
    var g = "F"; for (var i = 0; i < 3; i++) if (s >= th[i][0]) { g = th[i][1]; break; }
    return { topic: T, title: "else if-keðja", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: s + ": " + g,
      sol: "<p>Aðeins <b>fyrsta</b> sanna greinin er keyrð." + (wrongOrder ? " Hér eru mörkin í rangri röð (70 fyrst), svo allir með 70 eða meira fá C: B og A nást aldrei." : "") + "</p>",
      java: { main: src } };
  });

  // 2. switch og fall-through
  B.G.push(function switchFallThrough() {
    var n = rnd(1, 5), br = [Math.random() < 0.5, Math.random() < 0.5, true, Math.random() < 0.5];
    var L = ["a", "b", "c", "d"], src = "int n = " + n + ";\nswitch (n) {\n", out = "", on = false;
    for (var i = 0; i < 4; i++) {
      src += "    case " + (i + 1) + ":\n        System.out.print(\"" + L[i] + "\");\n" + (br[i] ? "        break;\n" : "");
    }
    src += "    default:\n        System.out.print(\"x\");\n}\nSystem.out.println(\"!\");";
    for (var j = 0; j < 4; j++) { if (n === j + 1) on = true; if (on) { out += L[j]; if (br[j]) break; } }
    if (n === 5 || (on && !br[3] && out.slice(-1) === "d")) out += "x";
    out += "!";
    return { topic: T, title: "switch og break", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: out,
      sol: "<p>Keyrslan byrjar í <code>case " + n + "</code>" + (n === 5 ? " (engin case passar, svo default)" : "") + " og heldur áfram niður í næstu greinar þar til hún rekst á <code>break</code> eða endi switch-ins. default-greinin er líka „næsta grein“ ef ekkert break stöðvar.</p>",
      java: { main: src } };
  });

  // 3. Rökségðir
  B.G.push(function rokSegdir() {
    var a = rnd(1, 9), b = rnd(1, 9), c = rnd(1, 9);
    var ex = [
      ["a < b && b < c", a < b && b < c], ["a < b || b > c", a < b || b > c], ["!(a == b)", !(a === b)],
      ["a > b || b > c && c > a", a > b || (b > c && c > a)], ["(a > b || b > c) && c > a", (a > b || b > c) && c > a],
      ["a % 2 == 0 ^ b % 2 == 0", (a % 2 === 0) !== (b % 2 === 0)], ["!(a < b) && !(b < c)", !(a < b) && !(b < c)],
      ["a + b > c * 2", a + b > c * 2], ["a != b && a != c", a !== b && a !== c], ["!(a < b || c < b)", !(a < b || c < b)],
    ];
    var f = B.shuffle(ex).slice(0, 3);
    var src = "int a = " + a + ", b = " + b + ", c = " + c + ";\n" + f.map(function (e) { return "System.out.println(" + e[0] + ");"; }).join("\n");
    return { topic: T, title: "Rökségðir", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: f.map(function (e) { return String(e[1]); }).join("\n"), multi: true,
      sol: "<p>Forgangur: <code>!</code>, reiknivirkjar, samanburður, <code>==</code>/<code>!=</code>, <code>^</code>, <code>&amp;&amp;</code> og síðast <code>||</code>. Þess vegna er <code>x || y &amp;&amp; z</code> = <code>x || (y &amp;&amp; z)</code>.</p>",
      java: { main: src } };
  });

  // 4. Hangandi else og slaufusvigalaust if
  B.G.push(function hangandiElse() {
    var a = rnd(0, 4), b = rnd(0, 4);
    var v = pick([0, 1]), src, out;
    if (v === 0) {
      src = "int a = " + a + ", b = " + b + ";\nif (a > 2)\n    if (b > 2)\n        System.out.println(\"X\");\nelse\n    System.out.println(\"Y\");\nSystem.out.println(\"Z\");";
      out = (a > 2 ? (b > 2 ? "X\n" : "Y\n") : "") + "Z";
    } else {
      src = "int a = " + a + ", b = " + b + ";\nif (a > b)\n    System.out.println(\"X\");\n    System.out.println(\"Y\");\nif (a == b);\n    System.out.println(\"Z\");";
      out = (a > b ? "X\n" : "") + "Y\nZ";
    }
    return { topic: T, title: "Inndráttur blekkir", text: "<p>Hvað prentar kóðinn? (Inndrátturinn er villandi.)</p>" + code(src), answer: out, multi: true,
      sol: "<p>Án slaufusviga á if aðeins við <b>næstu setningu</b>; else tilheyrir <b>næsta if-i á undan</b> sem ekki á else; og <code>if (…);</code> hefur tóma setningu, svo línan á eftir keyrir alltaf. Java hunsar inndrátt.</p>",
      java: { main: src } };
  });

  // 5. Skilyrðisvirkinn og skammhlaup
  B.G.push(function skilyrdisvirki() {
    var a = rnd(-5, 12), b = rnd(0, 3);
    var src = "int a = " + a + ", b = " + b + ";\nint m = (a > 5) ? a - 5 : 5 - a;\nString s = (a % 2 == 0) ? \"slétt\" : \"odda\";\nboolean ok = b != 0 && a / b > 2;\nSystem.out.println(m + \" \" + s + \" \" + ok);";
    var ok = b !== 0 && Math.trunc(a / b) > 2;
    var out = ((a > 5) ? a - 5 : 5 - a) + " " + (a % 2 === 0 ? "slétt" : "odda") + " " + ok;
    return { topic: T, title: "?: og skammhlaup", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: out,
      sol: "<p><code>c ? x : y</code> skilar x ef c er satt, annars y. Í <code>b != 0 &amp;&amp; a / b &gt; 2</code> er hægri hliðin aðeins metin ef b er ekki 0 (skammhlaup), svo engin deiling með núlli. Athugaðu að " + a + " % 2 er " + (a % 2) + " í Java.</p>",
      java: { main: src } };
  });

  B.MC.push(
    { topic: T, q: "Hvað er <code>true || false &amp;&amp; false</code>?", o: ["true", "false", "Þýðingarvilla", "Fer eftir röð"], c: 0, e: "&& er sterkara en ||: true || (false && false) = true || false = true." },
    { topic: T, q: "Hvernig skrifarðu „x er á bilinu 1 til 6 (að báðum meðtöldum)“?", o: ["<code>x &gt;= 1 &amp;&amp; x &lt;= 6</code>", "<code>1 &lt;= x &lt;= 6</code>", "<code>x &gt;= 1 || x &lt;= 6</code>", "<code>x &gt; 1 &amp;&amp; x &lt; 6</code>"], c: 0, e: "Java hefur ekki keðjaðan samanburð; 1 <= x <= 6 er þýðingarvilla. || væri alltaf satt og > / < útiloka endapunktana." },
    { topic: T, q: "Hvað er <code>!(a &amp;&amp; b)</code> samkvæmt De Morgan?", o: ["<code>!a || !b</code>", "<code>!a &amp;&amp; !b</code>", "<code>a || b</code>", "<code>!a &amp;&amp; b</code>"], c: 0, e: "Neitun snýr && í || og neitar báðum hliðum." },
    { topic: T, q: "Hvaða skilyrði er jafngilt <code>!(roll &gt;= 1 &amp;&amp; roll &lt;= 6)</code>?", o: ["<code>roll &lt; 1 || roll &gt; 6</code>", "<code>roll &lt; 1 &amp;&amp; roll &gt; 6</code>", "<code>roll &lt;= 1 || roll &gt;= 6</code>", "<code>roll != 1 &amp;&amp; roll != 6</code>"], c: 0, e: "De Morgan: !(A && B) = !A || !B, og !(roll >= 1) er roll < 1. Þetta er skilyrðið í do-while-lykkjunni sem les löglegt kast í Snakes & Ladders." },
    { topic: T, q: "Hvað gerist í <code>if (n != 0 &amp;&amp; 10 / n &gt; 1)</code> ef n er 0?", o: ["Skilyrðið er ósatt og ekki er deilt með 0", "ArithmeticException", "Skilyrðið er satt", "Þýðingarvilla"], c: 0, e: "Skammhlaup: þegar vinstri hlið && er ósönn er hægri hliðin aldrei metin." },
    { topic: T, q: "<code>int x = 3; if (x &gt; 5); { System.out.println(\"A\"); }</code> Hvað prentast?", o: ["A", "Ekkert", "Þýðingarvilla", "Keyrsluvilla"], c: 0, e: "Semíkomman á eftir svigunum er tóm setning sem tilheyrir if-inu. Blokkin á eftir er venjuleg blokk sem keyrir alltaf." },
    { topic: T, q: "Hvað er að <code>if (x = 5)</code>?", o: ["= er gildisveiting; það á að vera ==, og þetta er þýðingarvilla", "Ekkert", "Það ber saman x og 5", "Það er keyrsluvilla"], c: 0, e: "x = 5 skilar int (5), en if þarf boolean. Í Java er þetta þýðingarvilla (í C væri þetta alltaf satt)." },
    { topic: T, q: "Í keðju af <code>if … else if … else if … else</code>, hversu margar greinar geta keyrt?", o: ["Nákvæmlega ein", "Allar sem eru sannar", "Engin eða ein, eftir því hvort else er til", "Að hámarki tvær"], c: 0, e: "Með lokagreininni else er alltaf nákvæmlega ein grein keyrð: sú fyrsta sem er sönn, eða else ef engin er sönn. (Án else gæti engin keyrt.)" },
    { topic: T, q: "Hvaða tög má nota í <code>switch</code>?", o: ["int, char, String og enum (og byte, short)", "Hvaða tag sem er", "Aðeins int", "int, double og boolean"], c: 0, e: "switch virkar ekki á double, float, long eða boolean." },
    { topic: T, q: "Hvað gerist í switch ef <code>break</code> vantar aftast í case-grein?", o: ["Keyrslan heldur áfram í næstu case-grein", "Þýðingarvilla", "switch-ið hættir samt", "Það er hoppað í default"], c: 0, e: "Fall-through: setningar næstu greinar eru keyrðar, óháð gildi hennar, þar til break eða endir switch-ins kemur." },
    { topic: T, q: "Hvenær er <code>default</code>-greinin í switch keyrð?", o: ["Þegar engin case passar (eða fall-through nær þangað)", "Alltaf, á eftir réttu greininni", "Aldrei ef hún er síðust", "Aðeins ef gildið er 0"], c: 0, e: "default grípur öll gildi sem ekki passa við neina case. Hún getur líka náðst með fall-through ef break vantar fyrir ofan." },
    { topic: T, q: "Hvað er <code>int m = (7 &gt; 3) ? 10 : 20;</code>?", o: ["10", "20", "true", "Þýðingarvilla"], c: 0, e: "Skilyrðið er satt, svo segðin skilar fyrra gildinu." },
    { topic: T, q: "Hvaða skilyrði á best við til að athuga hvort tvær double-tölur séu jafnar?", o: ["<code>Math.abs(a - b) &lt; 1e-9</code>", "<code>a == b</code>", "<code>a.equals(b)</code>", "<code>(int) a == (int) b</code>"], c: 0, e: "Kommutölur eru nálganir (0.1 + 0.2 != 0.3), svo berðu saman með litlum skekkjumörkum." },
    { topic: T, q: "<code>else</code> án slaufusviga á eftir tveimur hreiðruðum <code>if</code>. Hvoru tilheyrir það?", o: ["Innra (næsta) if-inu", "Ytra if-inu", "Báðum", "Fer eftir inndrætti"], c: 0, e: "Hangandi else tilheyrir alltaf næsta if-i á undan sem ekki á else. Inndráttur skiptir Java engu máli." },
    { topic: T, q: "Hvað er <code>true ^ true</code>?", o: ["false", "true", "Þýðingarvilla", "1"], c: 0, e: "^ (xor) er satt ef nákvæmlega annað er satt. Báðar hliðar sannar gefur false." },
    { topic: T, q: "Hver af þessum segðum hefur tagið boolean?", o: ["<code>x % 2 == 0</code>", "<code>x % 2</code>", "<code>x = 2</code>", "<code>\"true\"</code>"], c: 0, e: "Samanburðurinn == skilar boolean. x % 2 er int, x = 2 er gildisveiting (int) og \"true\" er String." },
    { topic: T, q: "Í hvaða röð á að prófa mörkin í einkunnakeðju með <code>&gt;=</code>?", o: ["Frá hæsta marki niður í það lægsta", "Frá lægsta marki upp", "Röðin skiptir ekki máli", "Í stafrófsröð einkunna"], c: 0, e: "Með >= þarf hæsta markið fyrst; annars grípur lægra markið (t.d. >= 70) líka þá sem ættu að fá A eða B." },
    { topic: T, q: "Hvað prentar <code>System.out.println(5 &gt; 3 == true);</code>?", o: ["true", "false", "Þýðingarvilla", "1"], c: 0, e: "> er sterkara en ==: (5 > 3) == true er true == true = true." },
    { topic: T, q: "<code>char c = 'm';</code> Hvaða skilyrði segir hvort c sé lágstafur í enska stafrófinu?", o: ["<code>c &gt;= 'a' &amp;&amp; c &lt;= 'z'</code>", "<code>c &gt;= \"a\" &amp;&amp; c &lt;= \"z\"</code>", "<code>c == 'a' || c == 'z'</code>", "<code>c &gt; 'A' &amp;&amp; c &lt; 'z'</code>"], c: 0, e: "char eru tölur (Unicode-kóðar), svo hægt er að bera þá saman við aðra char með < og >. Strengir með \" \" eru annað tag." }
  );
})();

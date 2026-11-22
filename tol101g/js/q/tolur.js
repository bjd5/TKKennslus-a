/* q/tolur.js – kafli 2: Tölur, breytur og segðir (Liang kafli 2). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, code = B.code, idiv = B.idiv, imod = B.imod, jd = B.jd;
  var T = "tolur";

  // 1. Heiltöludeiling og afgangur
  B.G.push(function deilingAfgangur() {
    var a = rnd(7, 60) * (Math.random() < 0.2 ? -1 : 1), b = rnd(2, 9);
    if (a % b === 0) a += 1;
    var src = "int a = " + a + ";\nint b = " + b + ";\nSystem.out.println(a / b);\nSystem.out.println(a % b);\nSystem.out.println((double) a / b);\nSystem.out.println(a / b * b + a % b);";
    var ans = [idiv(a, b), imod(a, b), jd(a / b), a].join("\n");
    return { topic: T, title: "Deiling og afgangur", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: ans, multi: true,
      sol: "<p><code>a / b</code> er heiltöludeiling sem stýfir að núlli: " + a + " / " + b + " = " + idiv(a, b) + ". Afgangurinn hefur formerki vinstri hliðar: " + imod(a, b) + ". Kastið <code>(double)</code> gildir um <code>a</code> einan, svo deilingin verður double-deiling. Síðasta línan sýnir regluna <code>(a / b) * b + a % b == a</code>.</p>",
      java: { main: src } };
  });

  // 2. ++ og -- (forskeyti og viðskeyti)
  B.G.push(function plusPlus() {
    var x = rnd(2, 9), y = rnd(2, 9);
    var ops = [
      ["int a = x++;", function (s) { s.a = s.x; s.x++; }],
      ["int a = ++x;", function (s) { s.x++; s.a = s.x; }],
      ["int a = x-- + y;", function (s) { s.a = s.x + s.y; s.x--; }],
      ["int a = --x * y;", function (s) { s.x--; s.a = s.x * s.y; }],
      ["int a = x++ + ++y;", function (s) { var t = s.x; s.x++; s.y++; s.a = t + s.y; }],
    ];
    var ops2 = [
      ["int b = y++ - x;", function (s) { s.b = s.y - s.x; s.y++; }],
      ["int b = ++y + x--;", function (s) { s.y++; s.b = s.y + s.x; s.x--; }],
      ["int b = x + y++;", function (s) { s.b = s.x + s.y; s.y++; }],
      ["int b = --y - --x;", function (s) { s.y--; s.x--; s.b = s.y - s.x; }],
    ];
    var o1 = pick(ops), o2 = pick(ops2), s = { x: x, y: y };
    o1[1](s); o2[1](s);
    var src = "int x = " + x + ";\nint y = " + y + ";\n" + o1[0] + "\n" + o2[0] + "\nSystem.out.println(x + \" \" + y + \" \" + a + \" \" + b);";
    return { topic: T, title: "++ og --", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: [s.x, s.y, s.a, s.b].join(" "),
      sol: "<p><code>x++</code> skilar gamla gildinu og hækkar svo; <code>++x</code> hækkar fyrst og skilar nýja gildinu. Raktu línurnar eina í einu og skráðu x og y eftir hverja.</p>",
      java: { main: src } };
  });

  // 3. Samsettar gildisveitingar
  B.G.push(function samsettGildisveiting() {
    var x = rnd(3, 20), lines = ["int x = " + x + ";"], v = x, out = [];
    var n = rnd(3, 4);
    for (var i = 0; i < n; i++) {
      var k = rnd(2, 7), op = pick(["+=", "-=", "*=", "/=", "%="]);
      if (op === "%=" && v < k) op = "+=";
      lines.push("x " + op + " " + k + ";");
      v = op === "+=" ? v + k : op === "-=" ? v - k : op === "*=" ? v * k : op === "/=" ? idiv(v, k) : imod(v, k);
      if (i === 1) { lines.push("System.out.println(x);"); out.push(v); }
    }
    lines.push("System.out.println(x);"); out.push(v);
    var src = lines.join("\n");
    return { topic: T, title: "Samsettar gildisveitingar", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: out.join("\n"), multi: true,
      sol: "<p><code>x op= k</code> þýðir <code>x = x op k</code>. <code>/=</code> á int er heiltöludeiling og <code>%=</code> gefur afganginn. Gildin í röð: " + x + " → … → " + v + ".</p>",
      java: { main: src } };
  });

  // 4. Kastanir og Math
  B.G.push(function kastanir() {
    var d = rnd(11, 99) / 10, ds = d.toFixed(1), k = rnd(2, 4), half = rnd(1, 9) + 0.5;
    var items = [
      ["(int) " + ds, String(Math.trunc(d))],
      ["(int) -" + ds, String(-Math.trunc(d))],
      ["(int) " + ds + " * " + k, String(Math.trunc(d) * k)],
      ["(int) (" + ds + " * " + k + ")", String(Math.trunc(d * k))],
      ["Math.round(" + half + ")", String(Math.round(half))],
      ["Math.round(-" + half + ")", String(Math.round(-half))],
      ["(double) " + (k * 3 + 1) + " / " + k, jd((k * 3 + 1) / k)],
      ["(double) (" + (k * 3 + 1) + " / " + k + ")", jd(idiv(k * 3 + 1, k))],
      ["Math.max(" + k + ", " + ds + ")", jd(Math.max(k, d))],
      ["Math.pow(" + k + ", 3)", jd(Math.pow(k, 3))],
      ["Math.sqrt(" + k * k + ")", jd(k)],
      ["Math.abs(-" + k * 7 + ")", String(k * 7)],
      [k + " + 2.0", jd(k + 2)],
    ];
    var chosen = B.shuffle(items).slice(0, 4);
    var src = chosen.map(function (c) { return "System.out.println(" + c[0] + ");"; }).join("\n");
    return { topic: T, title: "Kastanir og Math", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: chosen.map(function (c) { return c[1]; }).join("\n"), multi: true,
      sol: "<p><code>(int)</code> stýfir að núlli og er sterkara en <code>*</code> og <code>/</code>. <code>Math.round</code> námundar .5 upp á við (líka fyrir mínustölur: −2,5 → −2) og skilar long. <code>Math.pow</code>, <code>Math.sqrt</code> og blöndun int og double skila double, sem prentast alltaf með punkti, t.d. <code>8.0</code>.</p>",
      java: { main: src } };
  });

  // 5. Forgangur virkja
  B.G.push(function forgangur() {
    var a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9), d = rnd(10, 30), e = rnd(2, 5);
    var forms = [
      ["a + b * c", a + b * c],
      ["(a + b) * c", (a + b) * c],
      ["d / e * e", idiv(d, e) * e],
      ["d % e + a * b", imod(d, e) + a * b],
      ["a + b * c % e - d / e", a + imod(b * c, e) - idiv(d, e)],
      ["d - a - b", d - a - b],
      ["d / a / b", idiv(idiv(d, a), b)],
      ["(d + a) / (b + 1) % c", imod(idiv(d + a, b + 1), c)],
    ];
    var f = B.shuffle(forms).slice(0, 2);
    var src = "int a = " + a + ", b = " + b + ", c = " + c + ", d = " + d + ", e = " + e + ";\nSystem.out.println(" + f[0][0] + ");\nSystem.out.println(" + f[1][0] + ");";
    return { topic: T, title: "Forgangur virkja", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: f[0][1] + "\n" + f[1][1], multi: true,
      sol: "<p>Svigar fyrst, svo <code>* / %</code> frá vinstri, svo <code>+ -</code> frá vinstri. Allar tölurnar eru int, svo hver deiling er heiltöludeiling.</p>",
      java: { main: src } };
  });

  // 6. Sekúndur, tölustafir
  B.G.push(function tolustafir() {
    var n = rnd(1000, 9999), s = rnd(3700, 9999);
    var src = "int n = " + n + ";\nSystem.out.println(n % 10);\nSystem.out.println(n / 10 % 10);\nSystem.out.println(n / 1000);\nint s = " + s + ";\nSystem.out.println(s / 3600 + \":\" + s % 3600 / 60 + \":\" + s % 60);";
    var ans = [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 1000), Math.floor(s / 3600) + ":" + Math.floor((s % 3600) / 60) + ":" + (s % 60)].join("\n");
    return { topic: T, title: "Tölustafir og tímar", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: ans, multi: true,
      sol: "<p><code>n % 10</code> er síðasti tölustafurinn, <code>n / 10 % 10</code> sá næstsíðasti og <code>n / 1000</code> sá fyrsti í fjögurra stafa tölu. Klukkustundir = s / 3600, mínútur = (s % 3600) / 60, sekúndur = s % 60. Takið eftir að <code>\":\"</code> er strengur, en tölurnar eru reiknaðar fyrst því <code>/</code> og <code>%</code> eru sterkari en <code>+</code>.</p>",
      java: { main: src } };
  });

  B.MC.push(
    { topic: T, q: "Hvað er <code>7 / 2</code> í Java?", o: ["3", "3.5", "4", "3.0"], c: 0, e: "Báðar hliðar eru int, svo þetta er heiltöludeiling: kommuhlutanum er hent. 7.0 / 2 væri 3.5." },
    { topic: T, q: "Hvað er <code>-7 / 2</code>?", o: ["-3", "-4", "-3.5", "3"], c: 0, e: "Heiltöludeiling stýfir að núlli, ekki niður: −3,5 verður −3." },
    { topic: T, q: "Hvað er <code>-7 % 3</code>?", o: ["-1", "2", "1", "-2"], c: 0, e: "Afgangurinn hefur formerki vinstri hliðar: −7 = (−2)·3 + (−1). Reglan (a/b)*b + a%b == a gildir alltaf." },
    { topic: T, q: "Hvaða segð segir til um hvort heiltalan <code>n</code> sé slétt?", o: ["<code>n % 2 == 0</code>", "<code>n / 2 == 0</code>", "<code>n % 2 == 1</code>", "<code>n / 2 * 2 == 1</code>"], c: 0, e: "Slétt tala hefur afganginn 0 við deilingu með 2. Athugaðu að n % 2 == 1 virkar ekki fyrir neikvæðar oddatölur (þá er afgangurinn −1)." },
    { topic: T, q: "Hvaða tag hefur útkoman úr <code>5 + 2.0</code>?", o: ["double", "int", "float", "long"], c: 0, e: "Þegar int og double blandast er int víkkað sjálfkrafa í double. Útkoman er 7.0." },
    { topic: T, q: "Hvað er <code>(int) 9.99</code>?", o: ["9", "10", "9.99", "Þýðingarvilla"], c: 0, e: "Kast í int stýfir (hendir kommuhlutanum). Til að námunda: (int) Math.round(9.99)." },
    { topic: T, q: "Hvað prentar <code>System.out.println((double) (7 / 2));</code>?", o: ["3.0", "3.5", "3", "4.0"], c: 0, e: "Svigarnir láta heiltöludeilinguna 7/2 = 3 klárast fyrst; svo er 3 kastað í 3.0. (double) 7 / 2 væri 3.5." },
    { topic: T, q: "Hvaða lína gefur þýðingarvillu?", o: ["<code>int x = 3.5;</code>", "<code>double x = 3;</code>", "<code>int x = (int) 3.5;</code>", "<code>long x = 3;</code>"], c: 0, e: "Að setja double í int er þrenging sem getur tapað upplýsingum; það þarf kast. Víkkun (int í double eða long) gerist sjálfkrafa." },
    { topic: T, q: "<code>int k = 10; k += 2.7;</code> Hvað er k?", o: ["12", "12.7", "Þýðingarvilla", "13"], c: 0, e: "Samsettar gildisveitingar (+=, *= …) kasta sjálfkrafa í tag vinstri hliðar: k = (int) (10 + 2.7) = 12." },
    { topic: T, q: "<code>int x = 5; int y = x++ * 2;</code> Hvað eru x og y?", o: ["x = 6, y = 10", "x = 6, y = 12", "x = 5, y = 10", "x = 5, y = 12"], c: 0, e: "x++ skilar gamla gildinu 5 (5·2 = 10) og hækkar x svo í 6." },
    { topic: T, q: "<code>int x = 5; int y = ++x * 2;</code> Hvað eru x og y?", o: ["x = 6, y = 12", "x = 6, y = 10", "x = 5, y = 12", "x = 5, y = 10"], c: 0, e: "++x hækkar x í 6 fyrst og skilar nýja gildinu: 6·2 = 12." },
    { topic: T, q: "Hvað er <code>2 + 3 * 4</code>?", o: ["14", "20", "24", "9"], c: 0, e: "Margföldun er á undan samlagningu: 3·4 = 12, svo 2 + 12 = 14." },
    { topic: T, q: "Hvað er <code>10 - 4 - 3</code>?", o: ["3", "9", "-3", "17"], c: 0, e: "Jafnsterkir virkjar eru reiknaðir frá vinstri: (10 − 4) − 3 = 3." },
    { topic: T, q: "Hvað prentar <code>System.out.println(Math.pow(2, 3));</code>?", o: ["8.0", "8", "6", "9.0"], c: 0, e: "Math.pow skilar alltaf double, og heil double prentast með .0." },
    { topic: T, q: "Hvað er <code>Math.round(-2.5)</code>?", o: ["-2", "-3", "-2.5", "-3.0"], c: 0, e: "Math.round námundar að næstu heiltölu og .5 fer upp á við (í átt að +∞): −2,5 → −2. Math.round(2.5) er 3." },
    { topic: T, q: "Hvaða segð gefur heila slembitölu frá 1 til 6 (teningur)?", o: ["<code>(int) (Math.random() * 6) + 1</code>", "<code>(int) Math.random() * 6 + 1</code>", "<code>Math.random() * 6</code>", "<code>(int) (Math.random() * 7)</code>"], c: 0, e: "Math.random() gefur [0, 1). Sinnum 6 gefur [0, 6), kast í int gefur 0-5 og +1 gefur 1-6. Í öðrum möguleikanum er kastið á undan margfölduninni, svo það gefur alltaf 1." },
    { topic: T, q: "Hvað prentar <code>System.out.println(0.1 + 0.2 == 0.3);</code>?", o: ["false", "true", "0.3", "Þýðingarvilla"], c: 0, e: "Kommutölur eru nálganir í tvíundakerfi: 0.1 + 0.2 er 0.30000000000000004. Berðu double saman með Math.abs(a − b) &lt; 1e-9." },
    { topic: T, q: "Hvað gerist við <code>int x = Integer.MAX_VALUE; x++;</code>?", o: ["x verður -2147483648 (yfirflæði, engin villa)", "Keyrsluvilla", "Þýðingarvilla", "x helst óbreytt"], c: 0, e: "Heiltölur í Java „flæða yfir“ án villuboða og fara hringinn yfir í minnsta gildið." },
    { topic: T, q: "Hvað gerir <code>final</code> fyrir framan breytu?", o: ["Gerir hana að fasta sem ekki má breyta eftir fyrstu gildisveitingu", "Eyðir henni í lok aðferðarinnar", "Gerir hana sýnilega öllum klösum", "Gerir hana að heiltölu"], c: 0, e: "final double CAKE_RADIUS = 10; Tilraun til að breyta fastanum síðar er þýðingarvilla." },
    { topic: T, q: "Hvaða frumtag geymir einn staf?", o: ["char", "String", "byte", "boolean"], c: 0, e: "char er 16 bita Unicode-stafur, skrifaður með einföldum gæsalöppum 'A'. String er ekki frumtag heldur klasi." },
    { topic: T, q: "Hvaða tag hefur bókstafurinn <code>42L</code>?", o: ["long", "int", "double", "float"], c: 0, e: "L aftan á heiltölu gerir hana long. f aftan á kommutölu gerir hana float." },
    { topic: T, q: "<code>int sec = 125;</code> Hvaða segð gefur mínúturnar (2)?", o: ["<code>sec / 60</code>", "<code>sec % 60</code>", "<code>sec / 60.0</code>", "<code>(double) sec / 60</code>"], c: 0, e: "Heiltöludeiling 125 / 60 = 2. sec % 60 = 5 sekúndur. Hinir gefa 2.0833…" },
    { topic: T, q: "Hvað er rangt við <code>int x; System.out.println(x);</code> inni í main?", o: ["x hefur ekki verið frumstillt: þýðingarvilla", "Ekkert, það prentar 0", "Það prentar null", "Keyrsluvilla"], c: 0, e: "Staðværar breytur (local variables) fá ekkert sjálfgefið gildi; þýðandinn neitar að lesa breytu sem gæti verið ófrumstillt. (Eigindi í klösum fá hins vegar 0, false eða null.)" },
    { topic: T, q: "Hvað er <code>(int) 3.7 * 2</code>?", o: ["6", "7", "7.4", "8"], c: 0, e: "Kast er sterkara en margföldun: (int) 3.7 = 3, svo 3·2 = 6. (int) (3.7 * 2) væri 7." }
  );
})();

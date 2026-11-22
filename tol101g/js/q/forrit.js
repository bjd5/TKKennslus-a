/* q/forrit.js – kafli 1: Forrit og reiknirit (Liang kafli 1). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, code = B.code, esc = B.esc;
  var T = "forrit";
  var WORDS = ["Java", "kaffi", "UNO", "Halló", "heimur", "forrit", "klasi", "main", "kóði", "Reykjavík", "lykkja", "fylki"];
  var q = function (s) { return '"' + s + '"'; };

  // 1. print og println
  B.G.push(function printOgPrintln() {
    var n = rnd(4, 6), lines = [], out = "", ws = B.shuffle(WORDS.slice());
    for (var i = 0; i < n; i++) {
      var r = Math.random();
      if (r < 0.12 && i > 0) { lines.push("System.out.println();"); out += "\n"; }
      else if (r < 0.55) { lines.push("System.out.print(" + q(ws[i] + (Math.random() < 0.5 ? " " : "")) + ");"); out += ws[i] + (lines[lines.length - 1].indexOf(' ")') !== -1 ? " " : ""); }
      else { lines.push("System.out.println(" + q(ws[i]) + ");"); out += ws[i] + "\n"; }
    }
    var src = lines.join("\n");
    return { topic: T, title: "print og println", text: "<p>Hvað prentar kóðinn? Skrifaðu hverja línu úttaksins í sína línu.</p>" + code(src), answer: out, multi: true,
      sol: "<p><code>print</code> prentar án línuskila, <code>println</code> bætir við línuskilum á eftir og <code>println()</code> eitt og sér prentar bara línuskil (auða línu ef ekkert var komið í línuna).</p>",
      java: { main: src } };
  });

  // 2. Lausnarstafir
  B.G.push(function lausnarstafir() {
    var a = pick(WORDS), b = pick(WORDS), c = pick(WORDS);
    var forms = [
      { s: '"' + a + '\\n' + b + '"', o: a + "\n" + b },
      { s: '"' + a + ' \\"' + b + '\\" ' + c + '"', o: a + ' "' + b + '" ' + c },
      { s: '"' + a + '\\\\' + b + '"', o: a + "\\" + b },
      { s: '"\\"' + a + '\\"\\n' + b + '"', o: '"' + a + '"\n' + b },
      { s: '"' + a + '\\n\\n' + b + '"', o: a + "\n\n" + b },
    ];
    var f = pick(forms), g = pick(forms);
    var src = "System.out.println(" + f.s + ");\nSystem.out.print(" + g.s + ");";
    return { topic: T, title: "Lausnarstafir", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: f.o + "\n" + g.o, multi: true,
      sol: "<p><code>\\n</code> er ný lína, <code>\\\"</code> er gæsalöpp inni í strengnum og <code>\\\\</code> er eitt bakstrik.</p>",
      java: { main: src } };
  });

  // 3. Samskeyting og röð
  B.G.push(function samskeytingRod() {
    var a = rnd(1, 9), b = rnd(1, 9), w = pick(["x", "=", "Svar: ", "kr"]);
    var forms = [
      ["a + b + " + q(w), (a + b) + w],
      [q(w) + " + a + b", w + a + "" + b],
      [q(w) + " + (a + b)", w + (a + b)],
      ["a + " + q(w) + " + b", a + w + b],
      ["a * b + " + q(w) + " + a * b", a * b + w + a * b],
      [q(w) + " + a * b", w + a * b],
    ];
    var f = pick(forms);
    var src = "int a = " + a + ";\nint b = " + b + ";\nSystem.out.println(" + f[0] + ");";
    return { topic: T, title: "Samskeyting strengja", text: "<p>Hvað prentar kóðinn?</p>" + code(src), answer: String(f[1]),
      sol: "<p>Java reiknar <code>+</code> frá vinstri til hægri. Á meðan báðir liðir eru tölur er lagt saman; um leið og annar liðurinn er strengur er skeytt saman. Svigar og <code>*</code> eru reiknuð á undan.</p>",
      java: { main: src } };
  });

  B.MC.push(
    { topic: T, q: "Hvað er reiknirit (algorithm)?", o: ["Endanleg runa af ótvíræðum skrefum sem leysir verkefni", "Forrit sem hefur verið þýtt í vélarmál", "Hluti af örgjörvanum sem reiknar", "Safn af klösum í Java"], c: 0, e: "Reiknirit lýsir skrefunum óháð forritunarmáli; það má skrifa á íslensku, sem flæðirit eða sauðakóða. Forrit er reiknirit skrifað á forritunarmáli." },
    { topic: T, q: "Hvað gerir þýðandinn <code>javac</code>?", o: ["Þýðir frumkóða (.java) í bætikóða (.class)", "Keyrir bætikóða á tölvunni", "Þýðir bætikóða í frumkóða", "Les inntak af lyklaborðinu"], c: 0, e: "javac athugar málfræðina og býr til .class-skrá með bætikóða. Java-sýndarvélin (java) keyrir svo bætikóðann." },
    { topic: T, q: "Hvers vegna getur sama .class-skráin keyrt á Windows, macOS og Linux?", o: ["Hún inniheldur bætikóða sem JVM á hverju kerfi túlkar", "Javac býr til vélarmál fyrir öll kerfi í einu", "Öll stýrikerfin nota sama örgjörva", "Hún er textaskrá sem stýrikerfið les beint"], c: 0, e: "Bætikóðinn er óháður vélbúnaði. Það þarf bara Java-sýndarvél (JVM) fyrir hvert kerfi: „write once, run anywhere“." },
    { topic: T, q: "Klasinn <code>public class Uno</code> er vistaður í skránni. Hvað verður skráin að heita?", o: ["Uno.java", "uno.java", "Uno.class", "main.java"], c: 0, e: "Public klasi verður að vera í skrá með nákvæmlega sama nafni og endingunni .java. Hástafir skipta máli. .class-skráin verður til við þýðingu." },
    { topic: T, q: "Hvar byrjar keyrsla Java-forrits?", o: ["Í aðferðinni <code>public static void main(String[] args)</code>", "Í fyrstu línu skrárinnar", "Í fyrsta klasanum sem er skilgreindur", "Í smið klasans"], c: 0, e: "JVM leitar að main-aðferðinni með nákvæmlega þessari undirskrift og byrjar þar." },
    { topic: T, q: "Hver er munurinn á <code>print</code> og <code>println</code>?", o: ["println fer í nýja línu eftir að hafa prentað; print gerir það ekki", "print prentar bara tölur, println bara strengi", "println prentar á skjáinn en print á prentara", "Enginn munur"], c: 0, e: "System.out.println(x) prentar x og síðan línuskil. System.out.print(x) skilur bendilinn eftir í sömu línu." },
    { topic: T, q: "Hvað prentar <code>System.out.println(\"a\\tb\");</code>?", o: ["a, dálkstopp (tab), b", "a\\tb", "atb", "a og b í sitt hvorri línu"], c: 0, e: "\\t er lausnarstafur fyrir dálkstopp. \\n væri ný lína." },
    { topic: T, q: "Hvernig prentar þú gæsalöpp inni í streng?", o: ["<code>\\\"</code>", "<code>\"\"</code>", "<code>'\"'</code> inni í strengnum", "Það er ekki hægt"], c: 0, e: "Bakstrik á undan gæsalöppinni segir Java að hún tilheyri strengnum en endi hann ekki: \"Hann sagði \\\"hæ\\\"\"." },
    { topic: T, q: "Hvaða villa er þýðingarvilla (compile error)?", o: ["Það vantar semíkommu aftast í setningu", "Notandinn slær inn „abc“ þegar nextInt() bíður eftir tölu", "Forritið reiknar meðaltal sem a + b / 2", "Heiltala er deilt með 0"], c: 0, e: "Vöntun á ; er málfræðivilla sem javac finnur. Rangt inntak og deiling með 0 eru keyrsluvillur; rangur útreikningur er rökvilla." },
    { topic: T, q: "Forritið keyrir án villuboða en reiknar rangt meðaltal. Hvers konar villa er þetta?", o: ["Rökvilla", "Þýðingarvilla", "Keyrsluvilla", "Málfræðivilla"], c: 0, e: "Rökvilla (logic error): forritið gerir nákvæmlega það sem stendur, en það sem stendur er ekki það sem átti að gera. Hana finnurðu bara með prófunum." },
    { topic: T, q: "<code>int x = 10 / 0;</code> þýðist en forritið stöðvast við keyrslu. Hvers konar villa?", o: ["Keyrsluvilla (ArithmeticException)", "Þýðingarvilla", "Rökvilla", "Engin villa, x verður 0"], c: 0, e: "Heiltöludeiling með 0 kastar ArithmeticException við keyrslu. (Með double fæst Infinity í staðinn.)" },
    { topic: T, q: "Hvaða auðkenni (nafn) er <b>ólöglegt</b> í Java?", o: ["<code>2players</code>", "<code>players2</code>", "<code>_count</code>", "<code>$total</code>"], c: 0, e: "Auðkenni mega ekki byrja á tölustaf. Bókstafir, tölustafir, _ og $ eru annars leyfðir." },
    { topic: T, q: "Hvaða auðkenni er frátekið orð og má ekki nota sem breytunafn?", o: ["<code>class</code>", "<code>Class1</code>", "<code>myClass</code>", "<code>klasi</code>"], c: 0, e: "class er frátekið orð (eins og int, if, new, public, static). Hin nöfnin eru í lagi þó þau séu lík." },
    { topic: T, q: "Hvaða nafn fylgir Java-venjum fyrir fasta?", o: ["<code>MAX_PLAYERS</code>", "<code>maxPlayers</code>", "<code>MaxPlayers</code>", "<code>max_players</code>"], c: 0, e: "Fastar (final) eru skrifaðir í ALL_CAPS með undirstriki. Breytur í mixedCase og klasar í MixedCase." },
    { topic: T, q: "Hvaða nafn fylgir Java-venjum fyrir klasa?", o: ["<code>DrawPile</code>", "<code>drawPile</code>", "<code>DRAW_PILE</code>", "<code>draw_piles</code>"], c: 0, e: "Klasar heita nafnorðum í eintölu með stórum fyrsta staf (MixedCase)." },
    { topic: T, q: "Hvaða lína býr til Scanner sem les af lyklaborðinu?", o: ["<code>Scanner input = new Scanner(System.in);</code>", "<code>Scanner input = System.in;</code>", "<code>Scanner input = new Scanner(System.out);</code>", "<code>input = Scanner.read();</code>"], c: 0, e: "Scanner er búinn til með new og fær System.in (staðalinntak). Muna líka import java.util.Scanner; efst." },
    { topic: T, q: "Notandinn slær inn <code>42</code> og ýtir á Enter. Forritið kallar á <code>input.nextInt()</code> og strax á eftir <code>input.nextLine()</code>. Hvað fær nextLine()?", o: ["Tóman streng", "\"42\"", "Næstu línu sem notandinn slær inn", "Villu"], c: 0, e: "nextInt() les 42 en skilur línuskilin eftir. nextLine() les þá afganginn af línunni, sem er tómur. Kallaðu á nextLine() einu sinni til að gleypa línuskilin." },
    { topic: T, q: "Notandinn slær inn <code>Jón Jónsson</code>. Hvað skilar <code>input.next()</code>?", o: ["\"Jón\"", "\"Jón Jónsson\"", "\"Jónsson\"", "Tóman streng"], c: 0, e: "next() les eitt orð, fram að næsta bili. nextLine() myndi skila allri línunni." },
    { topic: T, q: "Hvað af þessu er athugasemd sem nær yfir margar línur?", o: ["<code>/* ... */</code>", "<code>// ...</code>", "<code>&lt;!-- ... --&gt;</code>", "<code># ...</code>"], c: 0, e: "// nær til enda línunnar; /* */ getur spannað margar línur; /** */ er Javadoc-athugasemd." },
    { topic: T, q: "Hvaða þrjár grunnstoðir hefur hvert reiknirit?", o: ["Runu, val og endurtekningu", "Klasa, hluti og erfðir", "Inntak, úttak og geymslu", "Breytur, fasta og athugasemdir"], c: 0, e: "Skref í röð (runa), greiningar eftir skilyrðum (if) og endurtekningar (lykkjur). Úr þessu þrennu má smíða hvaða reiknirit sem er." },
    { topic: T, q: "Hvað er JVM?", o: ["Java-sýndarvélin sem keyrir bætikóða", "Þýðandinn sem býr til .class-skrár", "Ritill fyrir Java-kóða", "Safn af tilbúnum klösum"], c: 0, e: "JVM (Java Virtual Machine) les og keyrir bætikóðann. JDK inniheldur þýðandann og þróunartólin." },
    { topic: T, q: "Hvað prentar <code>System.out.println(1 + 2 + \"3\");</code>?", o: ["33", "123", "6", "15"], c: 0, e: "Frá vinstri: 1 + 2 = 3 (tölur), svo 3 + \"3\" = \"33\" (strengur)." },
    { topic: T, q: "Hvað prentar <code>System.out.println(\"1\" + 2 + 3);</code>?", o: ["123", "15", "6", "33"], c: 0, e: "Fyrsti liðurinn er strengur, svo allt sem kemur á eftir er skeytt saman: \"1\" + 2 = \"12\", \"12\" + 3 = \"123\"." }
  );
})();

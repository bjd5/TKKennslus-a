/* w/kafli-1.js – kóðaverkstæði fyrir kafla 1: Forrit og reiknirit. */
TK.workshop("kafli-1", [
  { type: "parsons", title: "Hello World", prompt: "<p>Raðaðu línunum í heilt Java-forrit sem prentar <code>Hello World!</code>.</p>",
    lines: ["public class HelloWorld {", "    public static void main(String[] args) {", "        System.out.println(\"Hello World!\");", "    }", "}"],
    extra: ["    public void main() {"] },
  { type: "gaps", title: "Lesa inn og prenta", prompt: "<p>Forritið les inn nafn og aldur og prentar t.d. <code>Anna er 20 ára</code>. Fylltu í eyðurnar.</p>",
    code: "import java.util.[[Scanner]];\n\npublic class Kynning {\n    public static void main(String[] args) {\n        Scanner input = [[new]] Scanner([[System.in]]);\n        String nafn = input.[[next()|nextLine()]];\n        int aldur = input.[[nextInt()]];\n        System.out.[[println]](nafn + \" er \" + aldur + \" ára\");\n    }\n}" },
  { type: "bug", title: "Þýðingarvilla", prompt: "<p>Þetta forrit þýðist ekki. Smelltu á línuna með villunni.</p>",
    code: "public class Summa {\n    public static void main(String[] args) {\n        int a = 5;\n        int b = 7\n        System.out.println(a + b);\n    }\n}",
    bug: 3, explain: "Það vantar semíkommu aftast í <code>int b = 7</code>. Þýðandinn kvartar oft um línuna á eftir (\"';' expected\"), en villan er í línu 4." },
  { type: "bug", title: "Rökvilla", prompt: "<p>Forritið á að prenta meðaltal tveggja talna, en fyrir 4 og 8 prentar það 8.0 í stað 6.0. Smelltu á línuna sem er röng.</p>",
    code: "Scanner input = new Scanner(System.in);\ndouble a = input.nextDouble();\ndouble b = input.nextDouble();\ndouble avg = a + b / 2;\nSystem.out.println(avg);",
    bug: 3, explain: "Deiling er reiknuð á undan samlagningu, svo <code>a + b / 2</code> er <code>a + (b / 2)</code>. Rétt: <code>(a + b) / 2</code>. Þetta er rökvilla: forritið keyrir en svarið er rangt." },
  { type: "match", title: "Hugtök", prompt: "<p>Paraðu saman hugtak og lýsingu.</p>",
    pairs: [["Frumkóði", "Það sem þú skrifar í .java-skrá"], ["Bætikóði", "Innihald .class-skrárinnar"], ["javac", "Þýðir .java í .class"], ["JVM", "Keyrir bætikóðann"], ["Keyrsluvilla", "Forritið stöðvast á meðan það keyrir"], ["Rökvilla", "Forritið keyrir en svarið er rangt"]] }
]);

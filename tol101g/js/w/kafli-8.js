/* w/kafli-8.js – kóðaverkstæði fyrir kafla 8: Klasar og hlutir. */
TK.workshop("kafli-8", [
  { type: "parsons", title: "Klasinn Card", prompt: "<p>Raðaðu línunum í klasann Card með tveimur private eigindum, smið og get-aðferð.</p>",
    lines: ["public class Card {", "    private int number;", "    private char color;", "    public Card(int number, char color) {", "        this.number = number;", "        this.color = color;", "    }", "    public int getNumber() {", "        return number;", "    }", "}"],
    alts: [[0, 2, 1, 3, 4, 5, 6, 7, 8, 9, 10], [0, 1, 2, 3, 5, 4, 6, 7, 8, 9, 10], [0, 2, 1, 3, 5, 4, 6, 7, 8, 9, 10]],
    extra: ["    public void Card(int number, char color) {", "        number = number;"] },
  { type: "gaps", title: "Circle með staðfestingu", prompt: "<p>Fylltu í eyðurnar svo radíusinn verði aldrei neikvæður og <code>getCircumference</code> skili ummálinu.</p>",
    code: "public class Circle {\n    [[private]] double r;\n\n    public [[Circle]](double r) {\n        setR(r);\n    }\n    public [[void]] setR(double r) {\n        if (r < 0) {\n            r = r * -1;\n        }\n        [[this]].r = r;\n    }\n    public double getR() {\n        [[return]] r;\n    }\n    public double getCircumference() {\n        return 2 * Math.PI * r;\n    }\n}" },
  { type: "bug", title: "Eigindið sem fær aldrei gildi", prompt: "<p><code>new Player(\"Anna\").getName()</code> skilar <code>null</code>. Hvaða lína er röng?</p>",
    code: "public class Player {\n    private String name;\n    private int score;\n\n    public Player(String name) {\n        name = name;\n        score = 0;\n    }\n    public String getName() {\n        return name;\n    }\n}",
    bug: 5, explain: "Færibreytan <code>name</code> skyggir á eigindið, svo <code>name = name</code> gefur færibreytunni sitt eigið gildi. Rétt: <code>this.name = name;</code>" },
  { type: "bug", title: "static og hlutbundið", prompt: "<p>Þessi kóði þýðist ekki. Smelltu á línuna sem veldur villunni.</p>",
    code: "public class Counter {\n    private int count;\n\n    public void increment() {\n        count++;\n    }\n\n    public static void main(String[] args) {\n        increment();\n        System.out.println(\"Done\");\n    }\n}",
    bug: 8, explain: "<code>increment()</code> er hlutbundin aðferð, en main er static og hefur engan hlut. Rétt: <code>Counter c = new Counter(); c.increment();</code>" },
  { type: "match", title: "UML í Java", prompt: "<p>Paraðu UML-línuna við Java-kóðann.</p>",
    pairs: [["<code>- top : int</code>", "private int top;"], ["<code>+ pop() : Card</code>", "public Card pop()"], ["<code>+ push(c : Card)</code>", "public void push(Card c)"], ["<code>+ StackOfCards()</code>", "public StackOfCards()"], ["<code># cards : Card[]</code>", "protected Card[] cards;"], ["<code>+ isEmpty() : boolean</code>", "public boolean isEmpty()"]] }
]);

/* w/kafli-11.js – kóðaverkstæði fyrir kafla 11: Hrein klasar og viðmót. */
TK.workshop("kafli-11", [
  { type: "gaps", title: "Polygon og Rectangle", prompt: "<p>Fylltu í eyðurnar svo Polygon verði hreinn klasi með hreinu aðferðinni <code>calcArea</code> sem Rectangle útfærir.</p>",
    code: "public [[abstract]] class Polygon {\n    protected Point[] corners;\n    public [[abstract]] double calcArea()[[;]]\n}\n\npublic class Rectangle [[extends]] Polygon {\n    private double w, h;\n    public Rectangle(double w, double h) { this.w = w; this.h = h; }\n    @Override\n    public double [[calcArea]]() {\n        return w * h;\n    }\n}" },
  { type: "parsons", title: "Card útfærir Comparable", prompt: "<p>Raðaðu línunum svo spil raðist fyrst eftir tölu (vaxandi) og svo eftir lit.</p>",
    lines: ["class Card implements Comparable<Card> {", "    private int number;", "    private char color;", "    @Override", "    public int compareTo(Card other) {", "        if (number != other.number) {", "            return number - other.number;", "        }", "        return color - other.color;", "    }", "}"],
    alts: [[0, 2, 1, 3, 4, 5, 6, 7, 8, 9, 10]], extra: ["    public boolean compareTo(Card other) {", "class Card extends Comparable<Card> {"] },
  { type: "bug", title: "Viðmót sem þýðist ekki", prompt: "<p>Klasinn Circle þýðist ekki. Smelltu á línuna sem veldur villunni.</p>",
    code: "interface Shape {\n    double area();\n    double perimeter();\n}\n\nclass Circle implements Shape {\n    private double r;\n    public Circle(double r) { this.r = r; }\n    double area() { return Math.PI * r * r; }\n    public double perimeter() { return 2 * Math.PI * r; }\n}",
    bug: 8, explain: "Aðferðir viðmóts eru sjálfkrafa <b>public</b>. <code>double area()</code> án public hefur pakkaaðgang, sem er þrengri, og það er bannað við útfærslu. Rétt: <code>public double area()</code>." },
  { type: "bug", title: "Hlutur af hreinum klasa", prompt: "<p>Hvaða lína í main er þýðingarvilla?</p>",
    code: "abstract class Player {\n    public abstract void playTurn();\n}\nclass Human extends Player {\n    public void playTurn() { System.out.println(\"Human\"); }\n}\n// í main:\nPlayer a = new Human();\nPlayer[] all = new Player[3];\nPlayer b = new Player();\nall[0] = a;",
    bug: 9, explain: "Ekki má búa til hlut af hreinum klasa. <code>Player a = new Human()</code> er í lagi (breyta af hreinu tagi), og <code>new Player[3]</code> býr til <b>fylki</b> af tilvísunum, ekki Player-hluti, svo það er líka í lagi." },
  { type: "match", title: "Hreinn klasi eða viðmót?", prompt: "<p>Á fullyrðingin við um hreinan klasa, viðmót, bæði eða hvorugt?</p>",
    pairs: [["Má hafa smið", "Aðeins hreinn klasi"], ["Klasi má útfæra/erfa mörg", "Aðeins viðmót"], ["Ekki hægt að búa til hlut með new", "Bæði"], ["Breytur eru sjálfkrafa public static final", "Aðeins viðmót"], ["Má hafa private hlutbundin eigindi", "Aðeins hreinn klasi"], ["Allar aðferðir hafa líkama", "Hvorugt"]] }
]);

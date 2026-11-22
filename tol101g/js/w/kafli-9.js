/* w/kafli-9.js – kóðaverkstæði fyrir kafla 9: Tengsl hluta og UML. */
TK.workshop("kafli-9", [
  { type: "match", title: "UML-örvar", prompt: "<p>Paraðu UML-táknið við merkingu þess.</p>",
    pairs: [["Heil lína, holur þríhyrningur ▷", "Erfðir (extends)"], ["Brotin lína, holur þríhyrningur ▷", "Útfærsla viðmóts (implements)"], ["Fylltur tígull ◆", "Samsetning: hlutarnir deyja með heildinni"], ["Holur tígull ◇", "Safntengsl: hlutarnir lifa sjálfstætt"], ["Brotin lína, opin ör", "Háð: notar tímabundið"], ["Heil lína, opin ör", "Samband: þekkir hinn klasann"]] },
  { type: "match", title: "Fjöldatölur í Java", prompt: "<p>Paraðu UML-sambandið við Java-eigindið sem útfærir það best.</p>",
    pairs: [["UnoGame —1→ DrawPile", "private DrawPile drawPile;"], ["Player —0..*→ Card", "private Card[] hand;"], ["Card —0..1→ Player (eigandi, má vanta)", "private Player owner; // getur verið null"], ["Course —*→ Student", "private Student[] students;"]] },
  { type: "gaps", title: "Samsetning: Rectangle með Point", prompt: "<p>Rectangle á sinn eigin miðpunkt (samsetning). Fylltu í eyðurnar svo smiðurinn <b>afriti</b> punktinn og shift færi rétthyrninginn.</p>",
    code: "class Rectangle {\n    private [[Point]] center;\n    private double width, height;\n\n    public Rectangle(Point c, double width, double height) {\n        this.center = [[new]] Point(c.getX(), c.[[getY()]]);\n        this.width = width;\n        this.height = height;\n    }\n    public void shift(double dx, double dy) {\n        center.[[shift]](dx, dy);\n    }\n    public double calcArea() {\n        return [[width * height|height * width]];\n    }\n}" },
  { type: "bug", title: "NullPointerException í hendinni", prompt: "<p>Forritið kastar <code>NullPointerException</code>. Hvaða lína veldur því?</p>",
    code: "Card[] hand = new Card[7];\nhand[0] = new Card(5, 'R');\nhand[1] = new Card(2, 'G');\nint sum = 0;\nfor (int i = 0; i < hand.length; i++) {\n    sum += hand[i].getNumber();\n}\nSystem.out.println(sum);",
    bug: 5, explain: "Aðeins hand[0] og hand[1] vísa á spil; hin hólfin eru <code>null</code>, og <code>hand[2].getNumber()</code> kastar NullPointerException. Lausn: <code>if (hand[i] != null)</code> eða halda utan um fjölda spila og lykkja aðeins upp að honum." },
  { type: "parsons", title: "Námskeið með nemendum", prompt: "<p>Raðaðu línunum í aðferðina <code>addStudent</code> sem skilar false ef námskeiðið er fullt.</p>",
    lines: ["public boolean addStudent(Student s) {", "    if (count == students.length) {", "        return false;", "    }", "    students[count] = s;", "    count++;", "    return true;", "}"],
    extra: ["    students[count] = new Student();", "    if (count > students.length) {"] }
]);

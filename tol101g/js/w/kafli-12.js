/* w/kafli-12.js – kóðaverkstæði fyrir kafla 12: Undantekningar og pakkar. */
TK.workshop("kafli-12", [
  { type: "parsons", title: "Lesa tölu örugglega", prompt: "<p>Raðaðu línunum svo forritið spyrji aftur ef notandinn slær inn eitthvað annað en heiltölu.</p>",
    lines: ["int n = 0;", "boolean ok = false;", "while (!ok) {", "    try {", "        n = input.nextInt();", "        ok = true;", "    } catch (InputMismatchException e) {", "        System.out.println(\"Ógilt: \" + input.next());", "    }", "}"],
    extra: ["    } finally (InputMismatchException e) {"] },
  { type: "gaps", title: "InvalidYearException", prompt: "<p>Fylltu í eyðurnar: eigin athuguð undantekning sem <code>setYear</code> kastar og main grípur.</p>",
    code: "class InvalidYearException [[extends]] Exception {\n    public InvalidYearException(String msg) {\n        [[super]](msg);\n    }\n}\n\nclass Book {\n    private int year;\n    public void setYear(int year) [[throws]] InvalidYearException {\n        if (year <= 1452) {\n            [[throw]] new InvalidYearException(\"Of snemmt: \" + year);\n        }\n        this.year = year;\n    }\n}\n\n// í main:\n[[try]] {\n    book.setYear(1200);\n} [[catch]] (InvalidYearException e) {\n    System.out.println(e.[[getMessage()]]);\n}" },
  { type: "bug", title: "Óaðgengileg catch-blokk", prompt: "<p>Þessi kóði þýðist ekki. Smelltu á línuna sem veldur villunni.</p>",
    code: "try {\n    int[] a = new int[3];\n    a[5] = 10 / x;\n} catch (RuntimeException e) {\n    System.out.println(\"Keyrsluvilla\");\n} catch (ArithmeticException e) {\n    System.out.println(\"Deilt með 0\");\n}",
    bug: 5, explain: "ArithmeticException er undirklasi RuntimeException, svo fyrri blokkin grípur hana alltaf og sú seinni næst aldrei. Raðaðu frá sértæku til almenns: ArithmeticException fyrst." },
  { type: "bug", title: "Athuguð undantekning", prompt: "<p>Aðferðin <code>load</code> þýðist ekki. Hvaða lína er vandamálið?</p>",
    code: "class SaveException extends Exception {\n    public SaveException(String m) { super(m); }\n}\n\nclass Game {\n    public void load(String file) {\n        if (file.isEmpty()) {\n            throw new SaveException(\"Ekkert skráarnafn\");\n        }\n    }\n}",
    bug: 5, explain: "SaveException erfir Exception og er því <b>athuguð</b>: aðferðin verður annaðhvort að grípa hana eða lýsa yfir í hausnum: <code>public void load(String file) throws SaveException</code>." },
  { type: "match", title: "Hvaða undantekning?", prompt: "<p>Paraðu kóðann við undantekninguna sem hann kastar.</p>",
    pairs: [["<code>int x = 5 / 0;</code>", "ArithmeticException"], ["<code>String s = null; s.length();</code>", "NullPointerException"], ["<code>new int[3][3]</code> og svo <code>a[3][0]</code>", "ArrayIndexOutOfBoundsException"], ["<code>\"uno\".charAt(3)</code>", "StringIndexOutOfBoundsException"], ["<code>Integer.parseInt(\"7a\")</code>", "NumberFormatException"], ["<code>Object o = \"x\"; Integer i = (Integer) o;</code>", "ClassCastException"], ["<code>input.nextInt()</code> fær „abc“", "InputMismatchException"]] }
]);

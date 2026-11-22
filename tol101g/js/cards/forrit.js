/* cards/forrit.js – flashcards fyrir kafla 1: Forrit og reiknirit. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "forrit", q: "Reiknirit vs. forrit?", a: "<b>Reiknirit</b>: endanleg runa ótvíræðra skrefa sem leysir verkefni (óháð máli). <b>Forrit</b>: reiknirit skrifað á forritunarmáli." },
  { c: "forrit", q: "Leiðin frá .java til keyrslu?", a: "Frumkóði <code>X.java</code> → <code>javac</code> (þýðandi) → bætikóði <code>X.class</code> → <code>java X</code> (JVM keyrir)." },
  { c: "forrit", q: "JDK, JRE og JVM?", a: "<b>JVM</b> keyrir bætikóða. <b>JRE</b> = JVM + söfn til keyrslu. <b>JDK</b> = JRE + þýðandi og þróunartól." },
  { c: "forrit", q: "Undirskrift aðalaðferðarinnar?", a: "<code>public static void main(String[] args)</code>" },
  { c: "forrit", q: "Hvað verður skráin að heita ef hún inniheldur <code>public class Card</code>?", a: "<code>Card.java</code> (nákvæmlega sama nafn, hástafir skipta máli)." },
  { c: "forrit", q: "print vs. println?", a: "<code>print</code> prentar án línuskila; <code>println</code> prentar og fer í nýja línu; <code>println()</code> prentar bara línuskil." },
  { c: "forrit", q: "Fjórir algengustu lausnarstafirnir?", a: "<code>\\n</code> ný lína, <code>\\t</code> dálkstopp, <code>\\\"</code> gæsalöpp, <code>\\\\</code> bakstrik." },
  { c: "forrit", q: "Hvernig lestu heiltölu af lyklaborðinu?", a: "<code>import java.util.Scanner;</code><br><code>Scanner input = new Scanner(System.in);</code><br><code>int n = input.nextInt();</code>" },
  { c: "forrit", q: "next() vs. nextLine()?", a: "<code>next()</code> les eitt orð (fram að bili). <code>nextLine()</code> les afganginn af línunni. Eftir <code>nextInt()</code> þarf oft auka <code>nextLine()</code>." },
  { c: "forrit", q: "Þrjár tegundir villna?", a: "<b>Þýðingarvilla</b> (javac finnur, t.d. vantar ;), <b>keyrsluvilla</b> (forritið stöðvast, t.d. / 0), <b>rökvilla</b> (rangt svar, finnst bara með prófunum)." },
  { c: "forrit", q: "Reglur um auðkenni?", a: "Bókstafir, tölustafir, _ og $; mega ekki byrja á tölustaf; ekki frátekin orð; hástafir skipta máli." },
  { c: "forrit", q: "Nafnavenjur í Java?", a: "Klasar <code>MixedCase</code>, breytur og aðferðir <code>mixedCase</code>, fastar <code>ALL_CAPS</code>." },
  { c: "forrit", q: "Þrjár grunnstoðir reiknirita?", a: "<b>Runa</b>, <b>val</b> (if/else) og <b>endurtekning</b> (lykkjur)." },
  { c: "forrit", q: "<code>1 + 2 + \"x\"</code> vs. <code>\"x\" + 1 + 2</code>?", a: "<code>\"3x\"</code> og <code>\"x12\"</code>: reiknað frá vinstri, samlagning þar til strengur birtist." }
); })();

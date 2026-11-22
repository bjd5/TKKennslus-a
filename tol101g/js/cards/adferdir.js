/* cards/adferdir.js – flashcards fyrir kafla 6: Aðferðir. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "adferdir", q: "Hlutar aðferðarhauss?", a: "<code>public static double pow(double base, int exp)</code>: aðgangur, static, skilatag, nafn, færibreytur." },
  { c: "adferdir", q: "Hvað er undirskrift?", a: "Nafn + tög færibreytanna í röð, t.d. <code>pow(double, int)</code>. Skilatag er <b>ekki</b> hluti af henni." },
  { c: "adferdir", q: "Færibreyta vs. raungildi?", a: "<b>Færibreyta</b> (parameter) í skilgreiningunni; <b>raungildi</b> (argument) í kallinu." },
  { c: "adferdir", q: "Gildisfærsla?", a: "Gildi raungildisins er <b>afritað</b>; breyting á færibreytu af frumtagi sést ekki hjá þeim sem kallaði." },
  { c: "adferdir", q: "Fylki sem færibreyta?", a: "Tilvísunin er afrituð: aðferðin getur breytt <b>innihaldi</b> fylkisins, en ekki látið breytu þess sem kallaði vísa á annað fylki." },
  { c: "adferdir", q: "„missing return statement“?", a: "Aðferð með skilatag verður að enda á <code>return</code> á <b>öllum</b> leiðum." },
  { c: "adferdir", q: "return í void-aðferð?", a: "Leyfilegt án gildis: <code>return;</code> hættir strax." },
  { c: "adferdir", q: "Yfirhleðsla?", a: "Sama nafn, <b>ólíkar færibreytur</b> (fjöldi/tög). Ólíkt skilatag eitt og sér er ekki nóg." },
  { c: "adferdir", q: "Hvernig velur þýðandinn yfirhlaðna aðferð?", a: "Eftir tögum raungildanna: nákvæm samsvörun fyrst, svo víkkun (int → double)." },
  { c: "adferdir", q: "Svið staðværrar breytu?", a: "Frá yfirlýsingu til loka blokkarinnar <code>{ }</code> sem hún er í." },
  { c: "adferdir", q: "Kallhlaði?", a: "Hvert kall fær ramma með færibreytum og staðværum breytum; ramminn hverfur þegar aðferðin skilar." },
  { c: "adferdir", q: "„Skilar“ vs. „prentar“?", a: "Skilar = <code>return</code>. Prentar = <code>System.out.println</code>. Lestu verkefnið vel." }
); })();

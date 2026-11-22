/* cards/kafli07.js – flashcards fyrir kafla 7: Hlutföll og tengslatöflur. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "hlutfoll", q: "Eins úrtaks hlutfallspróf?", a: "<code>prop.test(x, n, p = p0)</code>. Sjálfgefið p0 = 0.5." },
  { c: "hlutfoll", q: "Tveggja hlutfalla próf?", a: "<code>prop.test(x = c(x1, x2), n = c(n1, n2))</code>." },
  { c: "hlutfoll", q: "Gildran í prop.test(tafla)?", a: "Fyrsti dálkur töflunnar er „árangur“. Ef hann er „No“ eru hlutföllin hlutföll án útkomu." },
  { c: "hlutfoll", q: "Kí-kvaðrat próf á tengslatöflu?", a: "H₀: breyturnar eru óháðar. <code>chisq.test(tafla)</code>" },
  { c: "hlutfoll", q: "Vænt tíðni?", a: "E = línusumma·dálksumma/heild." },
  { c: "hlutfoll", q: "Kí-kvaðrat prófstærð?", a: "χ² = Σ(séð − vænt)²/vænt." },
  { c: "hlutfoll", q: "Frígráður kí-kvaðrat?", a: "(r − 1)(c − 1)." },
  { c: "hlutfoll", q: "Hvenær Fisher-próf?", a: "Ef væntar tíðnir eru litlar (&lt; 5). <code>fisher.test(tafla)</code>" },
  { c: "hlutfoll", q: "Yates-leiðrétting?", a: "Samfelluleiðrétting sem R notar sjálfgefið á 2×2 töflur." },
  { c: "hlutfoll", q: "Gagnlíkindi (odds)?", a: "p/(1 − p)." },
  { c: "hlutfoll", q: "Gagnlíkindahlutfall (OR)?", a: "(a·d)/(b·c) í 2×2 töflu; hlutfall gagnlíkinda tveggja hópa." },
  { c: "hlutfoll", q: "Áhættuhlutfall (RR)?", a: "[a/(a + b)]/[c/(c + d)]: hlutfall áhættu útsettra og óútsettra." },
  { c: "hlutfoll", q: "OR ≈ RR?", a: "Þegar útkoman er sjaldgæf." },
  { c: "hlutfoll", q: "OR = 1?", a: "Engin tengsl. Bil sem inniheldur 1 → ekki marktækt." },
  { c: "hlutfoll", q: "Hvenær OR en ekki RR?", a: "Í tilfella-viðmiðarannsóknum og í tvíkosta aðhvarfi." },
  { c: "hlutfoll", q: "Viðvörunin „Chi-squared approximation may be incorrect“?", a: "Litlar væntar tíðnir; sameina flokka eða nota Fisher." },
  { c: "hlutfoll", q: "Fitulifur: 75/15 og 26/85?", a: "OR = (75·85)/(15·26) = 16.3." },
  { c: "hlutfoll", q: "table() og prop.table()?", a: "<code>table(x, y)</code> gefur tíðnitöflu, <code>prop.table(tafla, 1)</code> hlutföll innan lína." },
  { c: "hlutfoll", q: "Mismunur hlutfalla, bil inniheldur 0?", a: "Ekki marktækur munur." },
  { c: "hlutfoll", q: "Framingham: sykursýki karla?", a: "59/1944 = 0.030; kvenna 62/2490 = 0.025; p = 0.31." }
); })();

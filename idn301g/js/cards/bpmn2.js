/* cards/bpmn2.js – flashcards fyrir kafla 3: Þróuð ferlalíkön. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "bpmn2", q: "Ferlalíkan vs. ferlatilvik?", a: "Líkan = hönnun (design time). Tilvik (case) = ein keyrsla (run time); tilvikin eru óháð." },
  { c: "bpmn2", q: "Samanbrotið vs. útfellt undirferli?", a: "Samanbrotið: verk með <b>+</b> neðst, innri skref falin. Útfellt: stór rammi sem sýnir innra ferlið." },
  { c: "bpmn2", q: "Kallverk (call activity)?", a: "Verk með <b>þykkri línu</b> sem kallar í sjálfstætt, endurnýtanlegt ferlalíkan." },
  { c: "bpmn2", q: "Líkanastig (F4)?", a: "1: virðiskeðja. 2: helstu ákvarðanir og afhendingar milli brauta. 3+: samhliða hliðar, gögn, frávik, smáatriði sem skipta máli." },
  { c: "bpmn2", q: "Merki á verkum?", a: "↺ lykkja (þar til skilyrði), ⦀ samhliða fjöltilvik (fyrir hvern), ≡ fjöltilvik í röð, ∼ ad-hoc, + undirferli, ⏪ bætur." },
  { c: "bpmn2", q: "Grípandi vs. kastandi atburður?", a: "<b>Grípandi</b>: bíður eftir kveikju, autt tákn. <b>Kastandi</b>: sendir kveikju, fyllt tákn." },
  { c: "bpmn2", q: "Rjúfandi vs. órjúfandi jaðaratburður?", a: "<b>Rjúfandi</b>: heil lína, stöðvar verkið. <b>Órjúfandi</b>: strikuð lína, verkið heldur áfram og nýtt flæði keyrir samhliða." },
  { c: "bpmn2", q: "Upphafstímaatburður vs. millistigstímaatburður?", a: "Upphaf: tilvik hefst á tíma („alla fimmtudaga“). Millistig: töf („bíða 3 klst.“). Báðir grípandi." },
  { c: "bpmn2", q: "Fjórar gerðir skilaboðaatburða?", a: "Upphaf (autt umslag), millistig grípandi (autt), millistig kastandi (fyllt), endir (fyllt, þykk lína)." },
  { c: "bpmn2", q: "Lokunaratburður (terminate)?", a: "Fylltur hringur í þykkum hring; stöðvar <b>allt tilvikið</b> strax, líka samhliða greinar." },
  { c: "bpmn2", q: "Skilaboðaflæði?", a: "Strikalína, opinn hringur við sendanda, opin ör við viðtakanda. <b>Aðeins milli lauga</b>; ekki í hlið." },
  { c: "bpmn2", q: "Gagnadrifin vs. atburðadrifin ákvörðun?", a: "XOR: ákveðið strax út frá gögnum. <b>Atburðahlið</b> (fimmhyrningur): það sem gerist fyrst ræður („kapphlaup“)." },
  { c: "bpmn2", q: "Samsvarandi ákvörðun milli lauga?", a: "Aðili A velur með XOR og sendir skilaboð; aðili B speglar með <b>atburðahlið</b> sem bíður eftir mögulegum skilaboðum." },
  { c: "bpmn2", q: "Sjálfhelda milli lauga?", a: "Ferli bíður eftir skilaboðum sem hinn aðilinn sendir aðeins stundum. Lausn: atburðahlið (eða tímamörk)." },
  { c: "bpmn2", q: "Hvenær OR-samruni?", a: "Þegar sumar greinar sem koma inn geta verið óvirkar; hann bíður eftir öllum <b>virkum</b> greinum." },
  { c: "bpmn2", q: "Þrjár tegundir frávika?", a: "<b>Ytra</b> (skilaboð), <b>innra</b> (villa), <b>tímamörk</b> (tími), sem jaðaratburðir á verki/undirferli." },
  { c: "bpmn2", q: "Villuatburðir?", a: "Kastandi villuendaatburður innan undirferlis + villujaðaratburður á jaðri þess, <b>með sama heiti</b>." },
  { c: "bpmn2", q: "Bætur (compensation)?", a: "Afturkalla <b>lokin</b> verk. Bótajaðaratburður ⏪ + tenging (punktalína) að bótaverki; ræst af kastandi bótaatburði." },
  { c: "bpmn2", q: "Verk sem bara sendir/tekur við skilaboðum?", a: "Má skipta út fyrir kastandi/grípandi skilaboðaatburð." },
  { c: "bpmn2", q: "Millistigstímaatburður á eftir verki setur tímamörk á það?", a: "<b>Nei</b>, hann er bara töf. Tímamörk = rjúfandi tímajaðaratburður á verkinu." }
); })();

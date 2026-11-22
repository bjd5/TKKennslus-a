/* cards/kafli01.js – flashcards fyrir kafla 1: Rannsóknir, breytur og úrtök. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "breytur", q: "Þýði vs. úrtak?", a: "<b>Þýði</b>: allur hópurinn sem álykta á um. <b>Úrtak</b>: sá hluti sem er mældur." },
  { c: "breytur", q: "Stiki vs. lýsistærð?", a: "<b>Stiki</b> lýsir þýði (μ, σ, p), yfirleitt óþekktur. <b>Lýsistærð</b> er reiknuð úr úrtaki (x̄, s, p̂) og metur stikann." },
  { c: "breytur", q: "Fjórar gerðir breyta?", a: "Óröðuð flokkabreyta (blóðflokkur), röðuð flokkabreyta (menntun), strjál talnabreyta (fjöldi), samfelld talnabreyta (hæð)." },
  { c: "breytur", q: "Svarbreyta vs. skýribreyta?", a: "<b>Svarbreyta</b>: útkoman sem er mæld. <b>Skýribreyta</b>: breytan sem talin er hafa áhrif á hana." },
  { c: "breytur", q: "Einfalt slembiúrtak?", a: "Allir í þýðinu hafa sömu líkur á að lenda í úrtakinu og öll úrtök af stærð n eru jafnlíkleg." },
  { c: "breytur", q: "Lagskipt slembiúrtak?", a: "Þýðinu skipt í lög (t.d. aldurshópa) og dregið af handahófi úr hverju lagi." },
  { c: "breytur", q: "Klasaúrtak?", a: "Heilir hópar (klasar, t.d. bekkir) valdir af handahófi og allir í þeim mældir." },
  { c: "breytur", q: "Aðgengisúrtak og sjálfboðaliðaúrtak?", a: "Úrtök sem byggja á því hverjum auðvelt er að ná í eða hverjir bjóða sig fram. Hætta á <b>úrtaksbjaga</b>." },
  { c: "breytur", q: "Bjagi vs. breytileiki?", a: "<b>Bjagi</b>: kerfisbundin skekkja í eina átt; lagast ekki með stærra n. <b>Breytileiki</b>: tilviljanakennd dreifing; minnkar með stærra n." },
  { c: "breytur", q: "Tilraun vs. athugunarrannsókn?", a: "Í <b>tilraun</b> ákveður rannsakandi meðferðina (helst með slembivali). Í <b>athugunarrannsókn</b> er aðeins fylgst með." },
  { c: "breytur", q: "Til hvers er slembival?", a: "Til að hóparnir verði sambærilegir að jafnaði í öllu öðru en meðferðinni, svo álykta megi um orsakasamband." },
  { c: "breytur", q: "Blöndunarbreyta (confounder)?", a: "Breyta sem tengist bæði skýribreytu og svarbreytu og getur skapað falskt samband (t.d. reykingar í sambandi kaffis og lungnakrabbameins)." },
  { c: "breytur", q: "Lyfleysa og lyfleysuáhrif?", a: "<b>Lyfleysa</b>: óvirk meðferð. <b>Lyfleysuáhrif</b>: bati vegna væntinga um meðferð." },
  { c: "breytur", q: "Einblind vs. tvíblind rannsókn?", a: "<b>Einblind</b>: þátttakendur vita ekki hvaða meðferð þeir fá. <b>Tvíblind</b>: hvorki þátttakendur né rannsakendur/matsmenn vita það." },
  { c: "breytur", q: "Rannsakandabjagi?", a: "Væntingar rannsakanda lita mælingar eða mat, t.d. huglægt mat á veikindum þegar vitað er hvaða hópi sjúklingur tilheyrir." },
  { c: "breytur", q: "Ferilrannsókn (cohort)?", a: "Hópi fylgt eftir yfir tíma og skráð hverjir fá útkomuna, t.d. Framingham-rannsóknin." },
  { c: "breytur", q: "Tilfella-viðmiðarannsókn?", a: "Valdir eru einstaklingar með sjúkdóm (tilfelli) og án (viðmið) og fyrri útsetning borin saman. Gefur OR." },
  { c: "breytur", q: "Hvernig er flokkabreyta meðhöndluð í R?", a: "Sem <code>factor</code>: <code>factor(kyn, levels = 1:2, labels = c(\"Kona\", \"Karl\"))</code>." },
  { c: "breytur", q: "Hvað þýðir NA í R?", a: "Gildi vantar. <code>mean(x, na.rm = TRUE)</code> sleppir þeim; <code>na.omit(d)</code> fjarlægir línur með vöntun." },
  { c: "breytur", q: "Fylgni og orsakasamband?", a: "Fylgni sannar ekki orsakasamband. Til þess þarf helst slembaða tilraun." }
); })();

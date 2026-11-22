/* cards/kafli11.js – flashcards fyrir kafla 11: Lifunargreining. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "lifun", q: "Lifunartími?", a: "Tími frá upphafspunkti (t.d. greiningu) að atburði (t.d. dauða)." },
  { c: "lifun", q: "Skerðing (censoring)?", a: "Atburður hefur ekki orðið þegar eftirfylgd lýkur; við vitum að tíminn er lengri en sá sem sást." },
  { c: "lifun", q: "Lifunarfall S(t)?", a: "P(T &gt; t): líkur á að lifa lengur en t." },
  { c: "lifun", q: "Áhættufall h(t)?", a: "Augnabliksáhætta á atburði á tíma t, að því gefnu að hafa lifað fram að t." },
  { c: "lifun", q: "Kaplan–Meier mat?", a: "Ŝ(t) = Π(1 − d<sub>i</sub>/n<sub>i</sub>) yfir atburðatíma ≤ t." },
  { c: "lifun", q: "Surv() í R?", a: "<code>Surv(time, status)</code>, status = 1 fyrir atburð, 0 fyrir skerðingu." },
  { c: "lifun", q: "KM í R?", a: "<code>survfit(Surv(time, status) ~ hopur, data = d)</code>; <code>plot()</code> teiknar." },
  { c: "lifun", q: "Miðgildi lifunar?", a: "Tíminn þegar Ŝ(t) fer niður í 0.5. NA ef ferillinn fer aldrei svo lágt." },
  { c: "lifun", q: "Lesa lifun á tíma t?", a: "<code>summary(km, times = t)</code>, dálkurinn survival." },
  { c: "lifun", q: "n.risk?", a: "Fjöldi enn í áhættu (á lífi og ekki skertur) á þeim tíma." },
  { c: "lifun", q: "Log-rank próf?", a: "Ber saman lifunarferla hópa: <code>survdiff(Surv(time, status) ~ hopur)</code>." },
  { c: "lifun", q: "Cox-líkan?", a: "h(t | x) = h₀(t)·exp(β₁x₁ + …). <code>coxph(Surv(time, status) ~ x, data = d)</code>" },
  { c: "lifun", q: "Áhættuhlutfall (HR)?", a: "exp(coef): hlutfall áhættufalla miðað við viðmiðunarflokk." },
  { c: "lifun", q: "HR &gt; 1 / HR &lt; 1?", a: "Meiri / minni áhætta á atburði (verri / betri lifun)." },
  { c: "lifun", q: "exp(−coef)?", a: "HR séð frá hinum hópnum (1/HR)." },
  { c: "lifun", q: "Forsenda Cox?", a: "Hlutfallsleg áhætta: HR er fast yfir tíma." },
  { c: "lifun", q: "Öryggisbil fyrir HR?", a: "exp(coef ± 1.96·se(coef)); inniheldur 1 → ekki marktækt." },
  { c: "lifun", q: "Framingham, CHD?", a: "HR = 3.76 (3.16–4.46); miðgildi lifunar 14.2 ár." },
  { c: "lifun", q: "Ristilkrabbamein, Lev+5FU?", a: "HR = 0.69 (0.55–0.87): um 31% lægri áhætta en eftirlit." },
  { c: "lifun", q: "Af hverju ekki t-próf á lifunartíma?", a: "Ræður ekki við skerðingu; lifunartími er oft skekktur." }
); })();

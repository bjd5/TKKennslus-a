/* cards/kafli05.js – flashcards fyrir kafla 5: Öryggisbil. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "oryggisbil", q: "Almennt form öryggisbils?", a: "Punktmat ± margfaldari·staðalskekkja." },
  { c: "oryggisbil", q: "Öryggisbil fyrir μ (σ óþekkt)?", a: "x̄ ± t<sub>1−α/2, n−1</sub>·s/√n. <code>t.test(x)$conf.int</code>" },
  { c: "oryggisbil", q: "Öryggisbil fyrir μ (σ þekkt)?", a: "x̄ ± z<sub>1−α/2</sub>·σ/√n." },
  { c: "oryggisbil", q: "Öryggisbil fyrir hlutfall?", a: "p̂ ± 1.96·√(p̂(1 − p̂)/n). <code>prop.test(x, n)</code> gefur aðeins annað (Wilson-)bil." },
  { c: "oryggisbil", q: "Túlkun 95% öryggisbils?", a: "Ef úrtakan væri endurtekin oft myndu um 95% bilanna innihalda sanna stikann." },
  { c: "oryggisbil", q: "Hvað er rangt að segja um bilið?", a: "Að 95% einstaklinga séu á bilinu, eða að líkurnar á að μ sé í þessu tiltekna bili séu 95%." },
  { c: "oryggisbil", q: "Hvað gerir bil breiðara?", a: "Hærra öryggisstig, meiri breytileiki, minna úrtak." },
  { c: "oryggisbil", q: "Breidd og n?", a: "Í hlutfalli við 1/√n: fjórfalda þarf n til að helminga breiddina." },
  { c: "oryggisbil", q: "Úrtaksstærð fyrir vikmörk m?", a: "n = (z·σ/m)², námundað upp." },
  { c: "oryggisbil", q: "Margfaldarar?", a: "90%: 1.645, 95%: 1.96, 99%: 2.576." },
  { c: "oryggisbil", q: "t-margfaldari fyrir n = 10?", a: "<code>qt(0.975, 9)</code> = 2.262." },
  { c: "oryggisbil", q: "Tengsl við tilgátupróf?", a: "Tvíhliða próf hafnar H₀: θ = θ₀ við α ef θ₀ er utan (1 − α) bilsins." },
  { c: "oryggisbil", q: "Bil fyrir mun meðaltala inniheldur 0?", a: "Ekki marktækur munur." },
  { c: "oryggisbil", q: "Bil fyrir OR, RR eða HR inniheldur 1?", a: "Ekki marktæk tengsl." },
  { c: "oryggisbil", q: "Bil fyrir hallatölu inniheldur 0?", a: "Ekki marktækt línulegt samband." },
  { c: "oryggisbil", q: "200 nemendur, 95% bil: hve mörg missa?", a: "200·0.05 = 10." },
  { c: "oryggisbil", q: "Vikmörk?", a: "Hálf breidd bilsins: margfaldari·SE." },
  { c: "oryggisbil", q: "confint(fit)?", a: "95% öryggisbil fyrir stuðla aðhvarfslíkans." },
  { c: "oryggisbil", q: "Forsendur t-bils?", a: "Óháðar mælingar og u.þ.b. normaldreifð gögn eða stórt n." },
  { c: "oryggisbil", q: "Punktmat?", a: "Ein tala sem metur stikann, t.d. x̄ eða p̂ = x/n." }
); })();

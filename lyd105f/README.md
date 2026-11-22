# Líftölfræði I: ferðalag að lokaprófinu

Kennslu- og æfingavefur á íslensku fyrir LÝÐ105F Líftölfræði I. Hann er settur upp sem ferðalag í ellefu köflum, með sömu vél og `idn301g/`. Efnið byggir á fyrirlestrum og sýnikóða áfangans, kennslubókinni *Tölfræði frá grunni*, gagnasettum áfangans og gömlum lokaprófum. Vefurinn er venjuleg HTML, CSS og JavaScript án uppsetningar og virkar beint á GitHub Pages.

## Ferðalagið

Hver kafli (`kafli-N.html`) hefur fjögur skref: **Lesa → Æfa → Gagnvirkt → Kaflapróf**. Næsti kafli opnast við einkunn 6 eða hærra í kaflaprófinu.

- **Gagnvirkt** vinnur með raunverulegt R-úttak úr gögnum áfangans (pulsAll, Framingham, diabetes, plasma og survival::colon). Nemandinn smellir á tölur í úttakinu, reiknar, túlkar og skrifar svör sem eru borin saman við fyrirmyndarsvar.
- Þegar öll kaflapróf eru staðin opnast **lokapróf ferðalagsins** (`lokaprof-aefing.html`): sex hlutar á sniði lokaprófanna 2024 og 2025.
- Þegar það næst opnast **prófhermirinn** (`profhermir.html`): skrifleg dæmi með R-úttaki, fyrirmyndarsvörum og matsblaði.

Framvindan er í localStorage undir `lyd105f-ferd-v1`.

| Kafli | Lesefni (`src/`) | Efni í bankanum |
|---|---|---|
| 1 Rannsóknir, breytur og úrtök | `snid.html` | `breytur` |
| 2 Lýsandi tölfræði og gröf | `lysandi.html` | `lysandi` |
| 3 Líkur: tvíkosta- og Poisson-dreifing | `likur.html` | `binom`, `poisson` |
| 4 Normaldreifing og höfuðsetningin | `normal.html` | `normal`, `clt` |
| 5 Öryggisbil | `oryggisbil.html` | `oryggisbil` |
| 6 Tilgátupróf og t-próf | `tilgatur.html` | `tilgatur`, `ttest` |
| 7 Hlutföll og tengslatöflur | `hlutfoll.html` | `hlutfoll` |
| 8 Fervikagreining (ANOVA) | `anova.html` | `anova` |
| 9 Línulegt aðhvarf | `adhvarf.html` | `adhvarf` |
| 10 Tvíkosta aðhvarf, næmi og sértæki | `tvikosta.html` | `tvikosta`, `naemi` |
| 11 Lifunargreining | `lifun.html` | `lifun` |

Alltaf opið: `aefingar.html` (frjálsar æfingar), `spjold.html` (flashcards), `dreifingar.html` (dreifingaborðið: líkur, prósentumörk og R-skipanir), `profval.html` (hvaða próf á við?), `formulublad.html` og `ordasafn.html`.

## Uppbygging

- `tools/build.py` setur síðurnar saman úr `src/` og skrifar `js/chapters.js` (`CHAPTERS`, `COURSE`, lokaprófsplanið).
- `js/bank.js` er kjarni spurningabankans. `js/q/lyd.js` inniheldur dæmavélarnar og hugtakaspurningarnar, og `js/q/kafliNN.js` aukaspurningar hvers kafla. `js/cards/kafliNN.js` eru flashcards.
- `js/stat.js` hefur pnorm, qnorm, pt, qt, pf, dbinom, pbinom, dpois og ppois í vafranum.
- `js/uttak.js` er R-úttak búið til með `tools/uttak.R` úr gögnunum í `namsefni/`. Ekki breyta því handvirkt.
- `js/lab.js` er verkefnavélin (kross, tala, „smelltu á töluna“, skrifað svar með matsblaði).
- `js/malin-data.js` geymir verkefnin á R-úttakinu og `js/gagnvirkt.js` keyrir gagnvirka skrefið. Hver kafli velur sín verkefni í `js/w/kafli-N.js`.
- `js/journey.js`, `js/examgen.js`, `js/quiz.js`, `js/cards.js` og `js/site.js` eru sama vél og í `idn301g/`.
- `namsefni/` er efni áfangans úr Canvas og er aðeins til á eigin tölvu (í `.gitignore`).

Eftir breytingar:

```sh
cd lyd105f
python3 tools/build.py       # setur síðurnar saman
node tools/check.js          # lögun bankans og spjaldanna
node tools/itemcheck.js      # keyrir dæmavélarnar og ber svörin saman við R
node tools/statcheck.js      # ber tölfræðiföllin saman við R
Rscript tools/uttak.R        # endurgerir js/uttak.js (þarf namsefni/)
```

## Heimildir

Fyrirlestrar og sýnikóði LÝÐ105F (haust 2026), *Tölfræði frá grunni* (Anna Helga Jónsdóttir og Sigrún Helga Lund), gagnasett áfangans og gömul lokapróf. Efnið er endursagt með eigin orðum. Allt R-úttak er keyrt upp á nýtt og allar tölur reiknaðar í R.

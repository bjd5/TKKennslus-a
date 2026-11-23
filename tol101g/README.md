# Tölvunarfræði 1: ferðalag að lokaprófinu

Kennslu- og æfingavefur á íslensku fyrir TÖL101G Tölvunarfræði 1 (Java), settur upp sem ferðalag í tólf köflum eins og `idn303g/` og `idn301g/`. Hann nær yfir kafla 1-13 í kennslubók Liangs (*Introduction to Java Programming and Data Structures*, 13. útg.) og glærur námskeiðsins, með dæmum úr tímunum (Snakes & Ladders, UNO-spilið, circle- og geometry-æfingarnar). Vefurinn er venjuleg HTML, CSS og JavaScript án uppsetningar og virkar beint á GitHub Pages.

## Ferðalagið

Hver kafli (`kafli-N.html`) hefur fjögur skref: **Lesa → Æfa → Kóðaverkstæði → Kaflapróf**. Næsti kafli opnast við einkunn 6 eða hærra í kaflaprófinu. Þegar allir kaflar eru búnir opnast **lokapróf ferðalagsins** (`lokaprof-aefing.html`, sex hlutar úr öllu efninu) og þegar það næst opnast **prófhermirinn** (`profhermir.html`: fjögur stór kóðaverkefni á prófsniði). Framvindan er í localStorage undir `tol101g-ferd-v1`.

- **Æfa**: „hvað prentar forritið?“-dæmi með nýjum tölum í hvert skipti (svarið er úttakið, ein lína á hverja prentaða línu) og krossaspurningar.
- **Kóðaverkstæði**: raða línum í rétt forrit, fylla í eyður, finna villur, rekja breytur í töflu og para saman (t.d. UML-örvar).
- **Kaflapróf**: 10 spurningar, blanda af kóðadæmum og krossaspurningum.

| Kafli | Lesefni (`src/`) | Efni í bankanum | Bók |
|---|---|---|---|
| 1 Fyrsta Java-forritið | `forrit.html` | `forrit` | 1 |
| 2 Breytur, tölur og inntak | `tolur.html` | `tolur` | 2 |
| 3 Ákvarðanir: if og switch | `skilyrdi.html` | `skilyrdi` | 3 |
| 4 Texti: String og char | `strengir.html` | `strengir` | 4 |
| 5 Lykkjur | `lykkjur.html` | `lykkjur` | 5 |
| 6 Aðferðir | `adferdir.html` | `adferdir` | 6 |
| 7 Fylki | `fylki.html` | `fylki` | 7-8 |
| 8 Klasar og hlutir | `klasar.html` | `klasar` | 9 |
| 9 Hlutir sem vinna saman og UML | `tengsl.html` | `tengsl` | 10 |
| 10 Erfðir og fjölbrigðni | `erfdir.html` | `erfdir` | 11 |
| 11 abstract og interface | `hrein.html` | `hrein` | 13 |
| 12 Villur: try, catch og throw | `undantekningar.html` | `undantekningar` | 12 |

Lesefnið er stuttar, verklegar kennslustundir (hvað gerir þetta, kóði og úttak, hvenær á að nota það, algeng mistök). Fyrstu kaflarnir fylgja röð byrjendanámskeiðs (breytur → inntak → lánareiknir → skilyrði → FizzBuzz → lykkjur) og seinni kaflarnir færast nær áfanganum.

Alltaf opið: `uppfletting.html` (uppflettiskrá: „ég vil… → notaðu…“, með leit), `aefingar.html` (frjálsar æfingar), `kodaskrif.html` (skrifa kóða frá grunni og bera saman við fyrirmyndarlausn og matsblað), `spjold.html` (flashcards) og `minnisblad.html` (Java á einu blaði, fyrirmynd að A4-blaðinu sem má hafa í prófinu).

## Uppbygging

- `tools/build.py` setur síðurnar saman úr `src/` og skrifar `js/chapters.js` (kaflarnir, `COURSE`, `PASS`, `PRACTICE_GOAL`, `TEST_N`).
- `js/bank.js` er kjarni spurningabankans; spurningarnar eru í `js/q/<efni>.js`. Kóðadæmi (`TK.bank.G`) skila `answer` sem streng (úttakið) og `java: { main, members, classes }` svo hægt sé að keyra þau í alvöru Java.
- `js/verkstaedi.js` er vél kóðaverkstæðisins og `js/w/kafli-N.js` verkefni hvers kafla (`TK.workshop("kafli-N", [...])`).
- `js/skrif.js` er viðmót kóðaskrifanna; verkefnin eru í `js/skrif-data.js` og `js/profhermir-data.js`.
- `js/journey.js` (ferðalagsvélin, sama og í hinum vefjunum, nú með textasvörum), `js/examgen.js` (lokaprófið eftir `COURSE["finalPlan"]`), `js/quiz.js`, `js/cards.js` og `js/cards/<efni>.js`.
- `js/site.js` sér um þema, valmynd og Java-litun (`code.java` og `pre.code`).
- `namsefni/` er efni áfangans úr Canvas, `namsefni/texti/` texti dreginn úr glærunum og `namsefni/kodi/` afpökkuð kóðadæmi. Mappan er aðeins á eigin tölvu (í `.gitignore`).

Eftir breytingar á efninu:

```sh
cd tol101g
python3 tools/build.py       # setur síðurnar saman
node tools/check.js          # lögun bankans, spjaldanna og verkstæðanna
node tools/javacheck.js 20   # keyrir hvert kóðadæmi 20 sinnum í Java og ber úttakið saman við svarið
node tools/skrifcheck.js     # þýðir og prófar fyrirmyndarlausnir kóðaskrifanna og prófhermisins
node tools/lesacheck.js      # keyrir kóðadæmin í lesefninu (merkt data-run) og ber saman við sýnt úttak
```

`javacheck.js` og `skrifcheck.js` þurfa JDK 17 eða nýrra (`javac` og `java`).

## Heimildir

Glærur TÖL101G (Matthias Book, Háskóli Íslands, haust 2026), kennslubókin *Introduction to Java Programming and Data Structures* (Y. Daniel Liang, 13. útg., Pearson) og kóðadæmi námskeiðsins. Efnið er endursagt á íslensku og öll dæmi eru ný.

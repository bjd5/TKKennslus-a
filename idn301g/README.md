# Greining ferla og kerfa: ferðalag að lokaprófinu

Kennslu- og æfingavefur á íslensku fyrir IÐN301G Greining ferla og kerfa, settur upp sem leikur í níu köflum eins og systurvefurinn `idn303g/`. Hann nær yfir alla fyrirlestrana (F1-F14), Thinking in Systems, orsakalykkjurit og gestafyrirlesturinn, og tengir efnið við verkefnin (EV1, HÓP1, EV2, HÓP2), munnlega prófið og lokaprófið. Vefurinn er ósköp venjuleg vefsíða (HTML, CSS og JavaScript) án uppsetningar, svo hann virkar beint á GitHub Pages.

## Ferðalagið

Hver kafli (`kafli-N.html`) hefur fjögur skref: **Lesa → Æfa → Gagnvirkt → Kaflapróf**. Næsti kafli opnast við einkunn 6 eða hærra í kaflaprófinu (10 spurningar; 8 gefur ★★, 9,5 gefur ★★★). Þegar allir kaflar eru búnir opnast **lokapróf ferðalagsins** (`lokaprof-aefing.html`, sex hlutar úr öllu efninu, nýjar spurningar og tölur í hvert skipti) og þegar það næst opnast **lokaupprifjunin** (`upprifjun.html`: ritgerðarspurningar með fyrirmyndarsvörum og undirbúningur fyrir munnlega prófið). Nemandinn safnar XP-stigum og hækkar í stigum. Framvindan er geymd í localStorage vafrans (lykillinn `gfk-ferd-v1`, aðskilinn frá IÐN303G); á forsíðunni er hægt að byrja upp á nýtt eða opna allt (yfirferðarhamur).

| Kafli | Lesefni (`src/`) | Efni í bankanum | Glærur |
|---|---|---|---|
| 1 Ferlar og ferlaskráning | `ferlar.html` | `ferlar` | F1, F2 |
| 2 Ferlalíkön í BPMN | `ferlalikon.html` | `bpmn` | F3 |
| 3 Þróuð ferlalíkön | `throud-likon.html` | `bpmn2` | F4 |
| 4 Ferlauppgötvun | `uppgotvun.html` | `uppgotvun` | F5 |
| 5 Eigindleg ferlagreining | `eigindleg.html` | `eigindleg` | F6 |
| 6 Megindleg ferlagreining | `megindleg.html` | `megindleg` | F7 |
| 7 Endurhönnun og ferlahugbúnaður | `endurhonnun.html` | `endurhonnun` | F8, F9, F10 |
| 8 Kerfishugsun og orsakalykkjur | `kerfishugsun.html` | `kerfi` | F11, F12, CLD-efni |
| 9 Stjórnun ferla og BPM í starfseminni | `stjornun.html` | `stjornun` | F13, F14, gestafyrirlestur |

Alltaf opið: `aefingar.html` (frjálsar æfingar), `spjold.html` (flashcards), `ordasafn.html` (íslensk og ensk hugtök), `verkfaerakista.html` (SIPOC, RACI, flæðirit, deildarferill, Customer Journey Map o.fl.), `reiknivelar.html` (flæðigreining, Little's law, M/M/1 og M/M/c) og `formulublad.html`.

## Uppbygging

- `namsefni/` er efni áfangans úr Canvas (glærur, sniðmát) og `namsefni/texti/` texti dreginn úr glærunum. Mappan er aðeins á eigin tölvu og ekki í git (sjá README í rótinni).
- `tools/build.py` setur síðurnar saman. Þar eru `CHAPTERS` (kaflarnir), `COURSE` (texti sem er bundinn áfanganum: stig, lokaprófsplan, verðlaun), `PASS` (6), `PRACTICE_GOAL` (5) og `TEST_N` (10). Hún skrifar `js/chapters.js`.
- `tools/check.js` yfirfer spurningabankann og spjöldin í node (lögun, tvítekningar, að hvert reiknidæmi skili endanlegri tölu) og telur spurningar eftir efni.
- `src/*.html` er lesefnið og aðrar síður; `src/gagnvirkt/kafli-N.html` er gagnvirka skrefið og `js/w/kafli-N.js` skriftan á bak við það. Hún skráir sig með `TK.widget("kafli-N", function (root, api) {...})` og kallar á `api.done()` þegar verkefninu er lokið.
- `js/bank.js` er kjarni spurningabankans; spurningarnar eru í `js/q/<efni>.js` (skilningsspurningar `MC` og reiknidæmi `G` með slembitölum). `js/quiz.js` er viðmót frjálsu æfinganna.
- `js/cards/<efni>.js` eru flashcards og `js/cards.js` viðmótið.
- `js/journey.js` er ferðalagsvélin (sama vél og í `idn303g/`, stillt með `TK.COURSE`) og `js/examgen.js` býr til lokaprófið eftir `COURSE["finalPlan"]`.
- `vendor/katex/` er KaTeX og leturgerðirnar eru í `../assets/fonts/`, svo ekkert er sótt af netinu.

Eftir breytingar í `src/`, `js/q/`, `js/cards/` eða `tools/build.py`:

```sh
cd idn301g && python3 tools/build.py && node tools/check.js
python3 -m http.server 8000 --directory ..   # skoða á http://localhost:8000/idn301g/
```

## Heimildir

Efnið er byggt á glærum fyrirlestra F1-F14 og gestafyrirlestrinum í IÐN301G (Háskóli Íslands, haust 2026), kennslubókunum *Fundamentals of Business Process Management* (Dumas, La Rosa, Mendling og Reijers) og *Thinking in Systems* (Donella Meadows), efni um orsakalykkjurit og sniðmátum námskeiðsins. Efnið er endursagt með eigin orðum og tölur í dæmum reiknaðar upp á nýtt.

# Tæknileg kerfi: ferðalag að lokaprófinu

Kennslu- og æfingavefur á íslensku fyrir lokaprófið í IÐN303G Tæknileg kerfi, settur upp sem leikur í átta köflum. Hann nær yfir allan áfangann (kaflar 1-18 í heftinu) með lausnum á lokaprófunum 2024 og 2025 og könnunum. Vefurinn er ósköp venjuleg vefsíða (HTML, CSS og JavaScript) án uppsetningar, svo hann virkar beint á GitHub Pages.

## Ferðalagið

Vefurinn er námsferli í átta köflum. Hver kafli (`kafli-N.html`) hefur fjögur skref: **Lesa → Æfa → Gagnvirkt → Kaflapróf**. Næsti kafli opnast við einkunn 6 eða hærra í kaflaprófinu (8 gefur ★★, 9,5 gefur ★★★). Þegar allir kaflar eru búnir opnast **lokapróf ferðalagsins** (`lokaprof-aefing.html`, sex spurningar á sama sniði og alvöru prófið, nýjar tölur í hvert skipti) og þegar það næst opnast **prófasafnið** (`lokaprof.html` með lokaprófunum 2024 og 2025 og `prof.html` með könnununum). Nemandinn safnar XP-stigum og hækkar í stigum. Framvindan er geymd í localStorage vafrans; á forsíðunni er hægt að byrja upp á nýtt eða opna allt (yfirferðarhamur).

| Kafli | Lesefni (`src/`) | Efni í spurningabanka |
|---|---|---|
| 1 Líkanagerð | `likanagerd.html` | `likan` |
| 2 Laplace og blokkrit | `laplace.html` | `laplace` |
| 3 Tíma- og tíðnisvörun | `svorun.html` | `svorun` |
| 4 Nemar | `nemar.html` | `nemar` |
| 5 Hreyflar | `hreyflar.html` | `hreyflar` |
| 6 Sjálfvirk stýrikerfi | `stjornkerfi.html` | `stjornkerfi` |
| 7 P, PI, PD og PID | `styringar.html` | `styringar` |
| 8 Vinnuferli og hönnun | `honnun.html` | `vinnuferli` |

Alltaf opið: `aefingar.html` (frjálsar æfingar), `spjold.html` (flashcards), `reiknivelar.html` og `formulublad.html` (tvær A4-síður). Gömlu slóðirnar (`likanagerd.html` o.s.frv.) vísa áfram á kaflana.

## Uppbygging

- `namsefni/` er allt efni áfangans úr Canvas (glærur, sýnidæmi, lausnir, próf og myndbönd). Hún er aðeins á eigin tölvu og ekki í git (sjá README í rótinni).
- `tools/build.py` setur síðurnar saman. Þar er listinn `CHAPTERS` (kaflarnir, lesefni og efni í spurningabanka), `PASS` (lágmarkseinkunn, 6) og `PRACTICE_GOAL` (rétt svör í æfingum, 5). Hún skrifar `js/chapters.js`.
- `src/*.html` er lesefnið og aðrar síður; `src/gagnvirkt/kafli-N.html` er gagnvirka skrefið í hverjum kafla.
- `js/journey.js` er ferðalagsvélin: framvinda, lásar, XP, kortið, æfingar, kaflapróf og lokapróf.
- `js/bank.js` er spurningabankinn (reiknidæmi með slembitölum og skilningsspurningar eftir efni); `js/quiz.js` er viðmót frjálsu æfinganna.
- `js/examgen.js` býr til lokapróf ferðalagsins.
- `js/widgets-a.js` (kaflar 1, 2, 4, 5) og `js/widgets-b.js` (kaflar 3, 6, 7, 8) eru gagnvirku hlutarnir. Þeir skrá sig með `TK.widget("kafli-N", function (root, api) {...})` og kalla á `api.done()` þegar verkefninu er lokið.
- `js/ctrl.js` er reiknisafn fyrir yfirfærsluföll (Bode-rit, stöðugleikamörk, þrepasvörun); `js/cards.js` og `js/calc.js` eru flashcards og reiknivélar.
- `vendor/katex/` er KaTeX og leturgerðirnar eru í `../assets/fonts/`, svo ekkert er sótt af netinu.

Eftir breytingar í `src/` eða `tools/build.py`:

```sh
cd idn303g && python3 tools/build.py
python3 -m http.server 8000 --directory ..   # skoða á http://localhost:8000/idn303g/
```

## Heimildir og athugasemdir

Efnið er byggt á kennsluheftinu, glærum, sýnidæmum og gömlum prófum úr námskeiðinu IÐN303G (Háskóli Íslands). Útreikningar voru yfirfarnir með tölulegum forritum. Þar sem handskrifaðar lausnir kennarans námunda eða víkja lítillega frá nákvæmum útreikningi er það tekið fram á viðkomandi stað.

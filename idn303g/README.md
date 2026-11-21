# Tæknileg kerfi: kennsluvefur fyrir lokapróf

Kennsluvefur á íslensku fyrir lokaprófið í IÐN303G Tæknileg kerfi. Hann nær yfir allan áfangann (kaflar 1-18 í heftinu) með lausnum á lokaprófunum 2024 og 2025 og könnunum. Vefurinn er ósköp venjuleg vefsíða (HTML, CSS og JavaScript) án uppsetningar, svo hann virkar beint á GitHub Pages.

## Efni

| Síða | Innihald |
|---|---|
| `index.html` | Hvernig lokaprófið er byggt upp, hvað hefur komið á því og efni eftir vikum, auk gagnvirks dæmis (Bode-rit og þrepasvörun) |
| `lokaprof.html` | Lokaprófin 2024 og 2025 og könnun 1 frá 2020, með fullreiknuðum lausnum |
| `likanagerd.html` | Líkön, vinnupunktur, vélar, rafrásir, straumefni og varmi (kaflar 4-9) |
| `laplace.html` | Diffurjöfnur, Laplace, stofnbrotaliðun, yfirfærsluföll og blokkrit (kaflar 10-11) |
| `svorun.html` | Tímasvörun, pólar og tíðnisvörun, með gagnvirku annarrar gerðar kerfi (kaflar 12-13) |
| `nemar.html` | Nemar: mælisvið, næmni, tímasvörun, stillivíðnám, kóðaskífa og álagsnemi |
| `hreyflar.html` | Jafnstraumshreyflar: jöfnur, upphafsvægi, lausagangur, hámarksafl, tímastuðlar og gír |
| `stjornkerfi.html` | Sjálfvirk stýrikerfi: stöðugleiki, skekkja í jafnvægi, hraði, truflanir, næmni og stýrimerki |
| `styringar.html` | P, PI, PD og PID með hönnunaruppskriftum |
| `honnun.html` | Vinnuferli hönnunar (kafli 14), hönnunarverkefnið og hvernig á að svara spurningum 5 og 6 |
| `prof.html` | Kannanir í hönnun 2021, 2023 og 2025 ásamt tengidæmum, með lausnum sem hægt er að fela |
| `aefingar.html` | Reiknidæmi með slembitölum og skilningsspurningar |
| `spjold.html` | Flashcards með „kunni / kunni ekki“ |
| `reiknivelar.html` | Reiknivélar fyrir hreyfil, nema og lykkjugreiningu |
| `formulublad.html` | Formúlublað á tvær A4-síður (báðum megin) sem hægt er að prenta |

## Uppbygging

- `namsefni/` er allt efni áfangans úr Canvas (glærur, sýnidæmi, lausnir, próf og myndbönd). Hún er aðeins á eigin tölvu og ekki í git (sjá README í rótinni). Opnaðu `namsefni/index.html` til að skoða hana.
- `src/*.html` eru efnissíðurnar (aðeins efnið sjálft).
- `tools/build.py` setur haus, valmynd og skriftur utan um þær og býr til `*.html` í möppu áfangans.
- `js/ctrl.js` er reiknisafn fyrir yfirfærsluföll (Bode-rit, stöðugleikamörk, þrepasvörun).
- `js/quiz.js`, `js/cards.js` og `js/calc.js` eru æfingaspurningar, flashcards og reiknivélar.
- `vendor/katex/` er KaTeX (stærðfræðibirting) og leturgerðirnar eru í `../assets/fonts/` (sameiginlegar öllum kennsluvefjum), svo ekkert er sótt af netinu.

Eftir breytingar í `src/` eða `tools/build.py`:

```sh
cd idn303g && python3 tools/build.py
python3 -m http.server 8000 --directory ..   # skoða á http://localhost:8000/idn303g/
```

## Heimildir og athugasemdir

Efnið er byggt á kennsluheftinu, glærum, sýnidæmum og gömlum prófum úr námskeiðinu IÐN303G (Háskóli Íslands). Útreikningar voru yfirfarnir með tölulegum forritum. Þar sem handskrifaðar lausnir kennarans námunda eða víkja lítillega frá nákvæmum útreikningi er það tekið fram á viðkomandi stað.

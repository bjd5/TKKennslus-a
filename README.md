# Tæknileg kerfi: kennslusíða fyrir hönnunarhlutann (vika 7-9)

Kennslusíða á íslensku fyrir könnun 2 í IÐN303G Tæknileg kerfi. Hún er ósköp venjuleg vefsíða (HTML, CSS og JavaScript) án uppsetningar, svo hún virkar beint á GitHub Pages.

## Efni

| Síða | Innihald |
|---|---|
| `index.html` | Yfirlit, gagnvirkt dæmi (færðu `K` og sjáðu Bode-rit og þrepasvörun) og hvaða dæmi koma oftast á prófum |
| `nemar.html` | Nemar: mælisvið, næmni, tímasvörun, stillivíðnám, kóðaskífa og álagsnemi |
| `hreyflar.html` | Jafnstraumshreyflar: jöfnur, upphafsvægi, lausagangur, hámarksafl, tímastuðlar og gír |
| `stjornkerfi.html` | Sjálfvirk stýrikerfi: stöðugleiki, skekkja í jafnvægi, hraði, truflanir, næmni og stýrimerki |
| `styringar.html` | P, PI, PD og PID með hönnunaruppskriftum |
| `prof.html` | Prófin frá 2021, 2023 og 2025 ásamt tengidæmum, með lausnum sem hægt er að fela |
| `aefingar.html` | Reiknidæmi með slembitölum og skilningsspurningar |
| `spjold.html` | Flashcards með „kunni / kunni ekki“ |
| `reiknivelar.html` | Reiknivélar fyrir hreyfil, nema og lykkjugreiningu |
| `formulublad.html` | Formúlublað sem hægt er að prenta |

## Uppbygging

- `src/*.html` eru efnissíðurnar (aðeins efnið sjálft).
- `tools/build.py` setur haus, valmynd og skriftur utan um þær og býr til `*.html` í rót.
- `js/ctrl.js` er reiknisafn fyrir yfirfærsluföll (Bode-rit, stöðugleikamörk, þrepasvörun).
- `js/quiz.js`, `js/cards.js` og `js/calc.js` eru æfingaspurningar, flashcards og reiknivélar.
- `vendor/katex/` er KaTeX (stærðfræðibirting) og `fonts/` leturgerðir, svo ekkert er sótt af netinu.

Eftir breytingar í `src/` eða `tools/build.py`:

```sh
python3 tools/build.py
python3 -m http.server 8000   # skoða á http://localhost:8000
```

## Birta á GitHub Pages

Settings → Pages → Source: „Deploy from a branch“, veldu greinina (`main`) og möppuna `/ (root)`.

## Heimildir og athugasemdir

Efnið er byggt á glærum, sýnidæmum og gömlum prófum úr námskeiðinu IÐN303G (Háskóli Íslands). Útreikningar voru yfirfarnir með tölulegum forritum. Þar sem handskrifaðar lausnir kennarans námunda eða víkja lítillega frá nákvæmum útreikningi er það tekið fram á viðkomandi stað.

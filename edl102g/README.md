# Eðlisfræði 1V: leiðin að lokaprófinu

Kennsluvefur á íslensku fyrir EÐL102G Eðlisfræði 1V. Hann er með öðru viðmóti en hinir vefirnir: engin hliðarvalmynd og ekkert lesefni, heldur ein síða (`index.html`) með leið í gegnum 16 kafla sem fylgja kennslubókinni (OpenStax University Physics, bindi 1, kaflar 1–17).

## Leiðin

Hver kafli hefur þrjú skref sem opnast hvert á eftir öðru:

1. **Æfingadæmi.** Fimm reiknidæmi með nýjum tölum í hvert skipti. Leysa þarf fjögur. Vísbendingin sýnir jöfnurnar sem þarf og lausnin er sýnd skref fyrir skref; ef nemandinn skoðar lausnina telst dæmið ekki leyst fyrr en hann reiknar það aftur með nýjum tölum.
2. **Jöfnurnar.** Spjald fyrir hverja jöfnu (heiti, jafnan, hvenær hún á við og tafla yfir táknin) og þjálfun með þremur gerðum spurninga: hvaða jafna á við, hvað táknar tákn, og fylltu í eyðuna. Jafna telst lærð eftir 2 rétt svör (rangt svar dregur eitt frá). Hægt er að fela jöfnurnar á spjöldunum.
3. **Kaflapróf.** Öll dæmi kaflans með nýjum tölum, án vísbendinga, og þrjár jöfnuspurningar. Einkunn 6 opnar næsta kafla.

Þegar öll kaflapróf eru staðin opnast **lokaprófið**: fimm dæmi, eitt úr hverjum hluta námsefnisins, á sniði gömlu lokaprófanna 2013–2018 (20% hvert). **Formúlublaðið** (`#/formulur`) er alltaf opið. Framvindan er í localStorage undir `edl102g-ferd-v1`; á forsíðunni má opna alla kafla (yfirferðarhamur) eða byrja upp á nýtt.

| # | Kafli | Bók |
|---|---|---|
| 1 | Einingar og vigrar | 1–2 |
| 2 | Hreyfing í einni vídd | 3 |
| 3 | Hreyfing í tveimur víddum | 4 |
| 4 | Lögmál Newtons | 5 |
| 5 | Núningur og hringhreyfing | 6 |
| 6 | Vinna og hreyfiorka | 7 |
| 7 | Stöðuorka og orkuvarðveisla | 8 |
| 8 | Skriðþungi og árekstrar | 9 |
| 9 | Snúningshreyfing | 10 |
| 10 | Veltuhreyfing og hverfiþungi | 11 |
| 11 | Stöðufræði og fjaðurmagn | 12 |
| 12 | Þyngdarfræði | 13 |
| 13 | Straumfræði | 14 |
| 14 | Sveiflur | 15 |
| 15 | Bylgjur | 16 |
| 16 | Hljóð | 17 |

## Uppbygging

- `js/core.js`: skráning kafla (`EDL.chapter`) og prófdæma (`EDL.examProblem`), slembitölur, framsetning talna (`E.q`, `E.t`, `E.n` með kommu), yfirferð svara (2% frávik), jöfnuspurningar og framvinda. Stillingar: `PASS`, `FINAL_PASS`, `PRACTICE`, `MASTER`, `TOL`.
- `js/kaflar/kNN.js`: einn kafli hver, með `eqs` (jöfnurnar) og `problems` (dæmagjafar sem skila `text`, `parts`, `steps`).
- `js/lokaprof.js`: safn lokaprófsdæma í fimm hlutum.
- `js/app.js`: viðmótið (leiðin, skrefin þrjú, lokapróf, formúlublað) með `#/`-slóðum.
- `vendor/katex/`: KaTeX; leturgerðirnar eru í `../assets/fonts/`.
- `namsefni/`: efni áfangans úr Canvas, aðeins á eigin tölvu (í `.gitignore`).

Eftir breytingar á efninu:

```sh
node tools/check.js   # keyrir hvert dæmi 300 sinnum og athugar svör, TeX og jöfnuspurningar
```

## Heimildir

Efnið er unnið upp úr fyrirlestrum, vinnustofum, vikuprófum, gömlum lokaprófum (2013–2018) og jöfnublaði námskeiðsins, og kennslubókinni OpenStax University Physics. Dæmin eru endursögð með eigin orðum og tölurnar nýjar.

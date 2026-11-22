# Kennsluvefir

Kennsluvefir á íslensku fyrir áfangana í skólanum. Forsíðan (`index.html`) sýnir eina möppu fyrir hvern áfanga og hver áfangi á sína eigin möppu í repo-inu. Allt er venjuleg HTML, CSS og JavaScript án uppsetningar, svo það virkar beint á GitHub Pages.

## Kennsluvefir

| Mappa | Áfangi |
|---|---|
| [`edl102g/`](edl102g/) | EÐL102G Eðlisfræði 1V, leiðin að lokaprófinu: æfingadæmi, jöfnur og kaflapróf í 16 köflum |
| [`idn301g/`](idn301g/) | IÐN301G Greining ferla og kerfa, ferðalag að lokaprófinu (allur áfanginn) |
| [`idn303g/`](idn303g/) | IÐN303G Tæknileg kerfi, undirbúningur fyrir lokapróf (allur áfanginn) |
| [`lyd105f/`](lyd105f/) | LÝÐ105F Líftölfræði I, ferðalag að lokaprófinu: R-úttak, kaflapróf og prófhermir í 11 köflum |
| [`tol101g/`](tol101g/) | TÖL101G Tölvunarfræði 1 (Java), ferðalag að lokaprófinu: kóðadæmi, kóðaverkstæði og kaflapróf í 12 köflum |

## Uppbygging

- `index.html` er forsíðan með möppunum, `assets/forsida.css` og `assets/forsida.js` útlit hennar og þema.
- `assets/fonts/` eru leturgerðir sem allir kennsluvefirnir nota.
- `<áfangi>/` er kennsluvefur eins áfanga, með eigin `index.html`, README og byggingarskriftu.
- `<áfangi>/namsefni/` er allt námsefni áfangans eins og það kom úr Canvas (glærur, sýnidæmi, lausnir, próf og myndbönd). Mappan er bara til á eigin tölvu: hún er í `.gitignore` því hún er um 1 GB, sumar skrár eru stærri en GitHub leyfir og efnið er höfundarréttarvarið. Opnaðu `namsefni/index.html` til að skoða það í Canvas-skoðaranum.

## Nýr kennsluvefur

1. Búðu til möppu með heiti áfangans í lágstöfum og án íslenskra stafa, t.d. `sta203g/`, með `index.html` í.
2. Afpakkaðu zip-skrá áfangans úr Canvas í `<áfangi>/namsefni/` og bættu möppunni við `.gitignore`.
3. Afritaðu eitt `<li>` í `index.html` í rótinni og breyttu tenglinum, flipanum (áfanganúmerinu), heitinu og lýsingunni. Litinn á möppunni má breyta með `style="--f: #b0521d"` á `<a class="folder">`.
4. Settu tengil til baka á forsíðuna (`../index.html`) inn á nýja vefinn, eins og „← Allir kennsluvefir“ í `idn303g/`.

Leitarreitur birtist sjálfkrafa á forsíðunni þegar möppurnar eru orðnar sex eða fleiri.

## Skoða og birta

```sh
python3 -m http.server 8000   # skoða á http://localhost:8000
```

Á GitHub Pages: Settings → Pages → Source: „Deploy from a branch“, veldu greinina (`main`) og möppuna `/ (root)`.

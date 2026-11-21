# Kennsluvefir

Kennsluvefir á íslensku fyrir áfangana í skólanum. Forsíðan (`index.html`) sýnir eina möppu fyrir hvern áfanga og hver áfangi á sína eigin möppu í repo-inu. Allt er venjuleg HTML, CSS og JavaScript án uppsetningar, svo það virkar beint á GitHub Pages.

## Kennsluvefir

| Mappa | Áfangi |
|---|---|
| [`idn303g/`](idn303g/) | IÐN303G Tæknileg kerfi, hönnunarhlutinn (vika 7-9) |

## Uppbygging

- `index.html` er forsíðan með möppunum, `assets/forsida.css` og `assets/forsida.js` útlit hennar og þema.
- `assets/fonts/` eru leturgerðir sem allir kennsluvefirnir nota.
- `<áfangi>/` er kennsluvefur eins áfanga, með eigin `index.html`, README og byggingarskriftu.

## Nýr kennsluvefur

1. Búðu til möppu með heiti áfangans í lágstöfum og án íslenskra stafa, t.d. `sta203g/`, með `index.html` í.
2. Afritaðu eitt `<li>` í `index.html` í rótinni og breyttu tenglinum, flipanum (áfanganúmerinu), heitinu og lýsingunni. Litinn á möppunni má breyta með `style="--f: #b0521d"` á `<a class="folder">`.
3. Settu tengil til baka á forsíðuna (`../index.html`) inn á nýja vefinn, eins og „← Allir kennsluvefir“ í `idn303g/`.

Leitarreitur birtist sjálfkrafa á forsíðunni þegar möppurnar eru orðnar sex eða fleiri.

## Skoða og birta

```sh
python3 -m http.server 8000   # skoða á http://localhost:8000
```

Á GitHub Pages: Settings → Pages → Source: „Deploy from a branch“, veldu greinina (`main`) og möppuna `/ (root)`.

#!/usr/bin/env python3
"""Setur saman síðurnar: src/<nafn>.html (bara efnið) -> <nafn>.html (heil síða).

Keyrsla úr rót repo:  python3 tools/build.py
Skrár í src/ innihalda aðeins <main>-efnið. Haus, valmynd og skriftur eru hér.
Valfrjálst: lína í byrjun src-skrár  <!--scripts: js/a.js js/b.js -->  bætir við skriftum.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# (skrá, valmyndartexti, hópur, titill síðu)
PAGES = [
    ("index", "Yfirlit", "Efni", "Hönnun véleindakerfa"),
    ("nemar", "Nemar", "Efni", "Nemar (vika 7)"),
    ("hreyflar", "Hreyflar", "Efni", "Jafnstraumshreyflar (vika 7-8)"),
    ("stjornkerfi", "Sjálfvirk stýrikerfi", "Efni", "Sjálfvirk stýrikerfi (vika 8-9)"),
    ("styringar", "P, PI, PD og PID", "Efni", "Stýringar (vika 9)"),
    ("prof", "Gömul próf", "Æfa", "Gömul próf með lausnum"),
    ("aefingar", "Æfingaspurningar", "Æfa", "Æfingaspurningar"),
    ("spjold", "Flashcards", "Æfa", "Flashcards"),
    ("reiknivelar", "Reiknivélar", "Verkfæri", "Reiknivélar"),
    ("formulublad", "Formúlublað", "Verkfæri", "Formúlublað"),
]

TEMPLATE = """<!doctype html>
<html lang="is">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · Tæknileg kerfi</title>
<meta name="description" content="Kennslusíða fyrir hönnunarhluta IÐN303G Tæknileg kerfi (vika 7-9): nemar, hreyflar, sjálfvirk stýrikerfi og PID-stýringar.">
<link rel="stylesheet" href="vendor/katex/katex.min.css">
<link rel="stylesheet" href="css/style.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230f1e2b'/%3E%3Cpath d='M4 24 C10 24 10 8 16 8 S24 24 28 24' fill='none' stroke='%23ffe98a' stroke-width='3'/%3E%3C/svg%3E">
<script>try{{var t=localStorage.getItem("tk-theme");if(t)document.documentElement.setAttribute("data-theme",t)}}catch(e){{}}</script>
</head>
<body>
<div class="topbar"><a href="index.html">Tæknileg kerfi</a><div class="topbar-btns"><button type="button" class="theme-btn">Þema</button><button type="button" id="menu-btn" aria-expanded="false" aria-controls="side">Valmynd</button></div></div>
<div class="shell">
<aside class="side" id="side">
<a class="brand" href="index.html">Tæknileg kerfi<small>IÐN303G · Hönnun, vika 7-9</small></a>
<button type="button" class="theme-btn">Þema</button>
<nav aria-label="Efnisyfirlit">
{nav}
</nav>
</aside>
<main id="main">
<div class="{pageclass}">
{content}
{pager}
</div>
</main>
</div>
<script src="vendor/katex/katex.min.js"></script>
<script src="vendor/katex/auto-render.min.js"></script>
<script src="js/site.js"></script>
{scripts}
</body>
</html>
"""


def nav_html(current):
    out, group = [], None
    for name, label, grp, _ in PAGES:
        if grp != group:
            if group is not None:
                out.append("</ul>")
            out.append(f"<h2>{grp}</h2><ul>")
            group = grp
        cur = ' aria-current="page"' if name == current else ""
        out.append(f'<li><a class="nav" href="{name}.html"{cur}>{label}</a></li>')
    out.append("</ul>")
    return "\n".join(out)


def pager_html(idx):
    prev = PAGES[idx - 1] if idx > 0 else None
    nxt = PAGES[idx + 1] if idx < len(PAGES) - 1 else None
    left = f'<a href="{prev[0]}.html"><span>Fyrri</span>{prev[1]}</a>' if prev else "<i></i>"
    right = f'<a href="{nxt[0]}.html" style="text-align:right"><span>Næsta</span>{nxt[1]}</a>' if nxt else "<i></i>"
    return f'<div class="pager noprint">{left}{right}</div>'


def main():
    for idx, (name, label, grp, title) in enumerate(PAGES):
        src = SRC / f"{name}.html"
        if not src.exists():
            print(f"vantar {src}", file=sys.stderr)
            continue
        content = src.read_text(encoding="utf-8")
        scripts = []
        m = re.match(r"\s*<!--scripts:\s*(.*?)\s*-->", content)
        if m:
            scripts = m.group(1).split()
            content = content[m.end():]
        wide = "<!--wide-->" in content
        page = TEMPLATE.format(
            title=title,
            nav=nav_html(name),
            content=content.strip(),
            pager=pager_html(idx) if name != "formulublad" else pager_html(idx),
            pageclass="page wide" if wide else "page",
            scripts="\n".join(f'<script src="{s}"></script>' for s in scripts),
        )
        (ROOT / f"{name}.html").write_text(page, encoding="utf-8")
        print("skrifaði", f"{name}.html")


if __name__ == "__main__":
    main()

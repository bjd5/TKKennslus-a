#!/usr/bin/env python3
"""Setur saman síðurnar: src/<nafn>.html (bara efnið) -> <nafn>.html (heil síða).

Keyrsla úr möppu áfangans:  python3 tools/build.py

Vefurinn er ferðalag í átta köflum. Hver kafli (kafli-N.html) er settur saman úr
  src/<lesefni>.html          skref 1, Lesa
  (æfingar úr js/bank.js)     skref 2, Æfa
  src/gagnvirkt/kafli-N.html  skref 3, Gagnvirkt
  (kaflapróf úr js/bank.js)   skref 4, Kaflapróf
Gömlu slóðirnar (likanagerd.html o.s.frv.) verða að tilvísunum á kaflana.
Lásar, stig og einkunnir eru í js/journey.js; kaflarnir eru skrifaðir í js/chapters.js héðan.
Valfrjálst: lína í byrjun src-skrár  <!--scripts: js/a.js js/b.js -->  bætir við skriftum.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

PASS = 6.0          # lágmarkseinkunn í kaflaprófi og lokaprófi
PRACTICE_GOAL = 5   # rétt svör í æfingum áður en kaflapróf opnast

# (n, lesefni í src/, titill, undirtitill, efni í bank.js, hvar þetta kemur á lokaprófinu)
CHAPTERS = [
    (1, "likanagerd", "Líkanagerð", "Vika 2-3 · kaflar 4-9 í hefti", ["likan"], "Spurning 2: tankur, rafrás eða varmi"),
    (2, "laplace", "Laplace og blokkrit", "Vika 4 · kaflar 10-11", ["laplace"], "Spurningar 1 og 4: yfirfærsluföll og blokkrit"),
    (3, "svorun", "Tíma- og tíðnisvörun", "Vika 4-5 · kaflar 12-13", ["svorun"], "Spurning 1: K, τ, ζ, ωn, Tp og Mp"),
    (4, "nemar", "Nemar", "Vika 7 · kafli 15", ["nemar"], "Spurning 3: val á nema"),
    (5, "hreyflar", "Hreyflar", "Vika 7-8 · kafli 16", ["hreyflar"], "Spurningar 3 og 4: val á hreyfli og G₁, G₂"),
    (6, "stjornkerfi", "Sjálfvirk stýrikerfi", "Vika 8-9 · kafli 17", ["stjornkerfi"], "Spurning 4: skekkja í jafnvægi, stöðugleiki og seinkun"),
    (7, "styringar", "P, PI, PD og PID", "Vika 9 · kafli 18", ["styringar"], "Spurning 6: val á stýringu"),
    (8, "honnun", "Vinnuferli og hönnun", "Kaflar 1-3 og 14 · hönnunarverkefnið", ["vinnuferli"], "Spurningar 5 og 6 (40 % af prófinu)"),
]
REDIRECTS = {src: f"kafli-{n}" for n, src, *_ in CHAPTERS}

# (skrá, valmyndartexti, hópur, titill síðu, læsing)
PAGES = [("index", "Kortið", "Ferðalagið", "Ferðalagið að lokaprófinu", None)]
PAGES += [(f"kafli-{n}", f"{n}. {t}", "Ferðalagið", f"Kafli {n}: {t}", f"ch{n}") for n, _, t, *_ in CHAPTERS]
PAGES += [
    ("lokaprof-aefing", "Lokapróf", "Ferðalagið", "Lokapróf ferðalagsins", "final"),
    ("lokaprof", "Lokapróf 2024 og 2025", "Prófasafn", "Lokapróf 2024 og 2025 með lausnum", "archive"),
    ("prof", "Kannanir í hönnun", "Prófasafn", "Kannanir í hönnun með lausnum", "archive"),
    ("aefingar", "Frjálsar æfingar", "Verkfæri", "Frjálsar æfingar", None),
    ("spjold", "Flashcards", "Verkfæri", "Flashcards", None),
    ("reiknivelar", "Reiknivélar", "Verkfæri", "Reiknivélar", None),
    ("formulublad", "Formúlublað", "Verkfæri", "Formúlublað", None),
]

# Röð skrifta: grunnsöfn fyrst, svo ferðalagsvélin, svo síðusértækar skriftur
SCRIPT_ORDER = ["js/ctrl.js", "js/bank.js", "js/examgen.js", "js/chapters.js", "js/journey.js"]

TEMPLATE = """<!doctype html>
<html lang="is">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · Tæknileg kerfi</title>
<meta name="description" content="Kennsluvefur fyrir lokaprófið í IÐN303G Tæknileg kerfi: líkanagerð, Laplace, tíma- og tíðnisvörun, nemar, hreyflar, sjálfvirk stýrikerfi og PID-stýringar, með lausnum á gömlum prófum.">
<link rel="stylesheet" href="vendor/katex/katex.min.css">
<link rel="stylesheet" href="css/style.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230f1e2b'/%3E%3Cpath d='M4 24 C10 24 10 8 16 8 S24 24 28 24' fill='none' stroke='%23ffe98a' stroke-width='3'/%3E%3C/svg%3E">
<script>try{{var d=document.documentElement,t=localStorage.getItem("tk-theme");if(t)d.setAttribute("data-theme",t);if(localStorage.getItem("tk-side")==="hidden")d.setAttribute("data-side","hidden")}}catch(e){{}}</script>
</head>
<body>
<div class="topbar"><a href="index.html">Tæknileg kerfi</a><div class="topbar-btns"><button type="button" class="theme-btn">Þema</button><button type="button" id="menu-btn" aria-expanded="false" aria-controls="side">Valmynd</button></div></div>
<button type="button" class="side-show" id="side-show" aria-controls="side" title="Sýna valmynd (\\)"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14"/></svg>Valmynd</button>
<div class="shell">
<aside class="side" id="side">
<div class="side-top"><a class="home" href="../index.html">← Allir kennsluvefir</a><button type="button" class="side-hide" id="side-hide" aria-controls="side" aria-label="Fela valmynd" title="Fela valmynd (\\)"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg></button></div>
<a class="brand" href="index.html">Tæknileg kerfi<small>IÐN303G · Ferðalag að lokaprófi</small></a>
<div class="side-xp" id="side-xp" hidden></div>
<nav aria-label="Efnisyfirlit">
{nav}
</nav>
<button type="button" class="theme-btn">Þema</button>
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
    for name, label, grp, _, gate in PAGES:
        if grp != group:
            if group is not None:
                out.append("</ul>")
            out.append(f"<h2>{grp}</h2><ul>")
            group = grp
        cur = ' aria-current="page"' if name == current else ""
        g = f' data-gate="{gate}"' if gate else ""
        out.append(f'<li><a class="nav" href="{name}.html"{cur}{g}>{label}</a></li>')
    out.append("</ul>")
    return "\n".join(out)


def pager_html(idx):
    prev = PAGES[idx - 1] if idx > 0 else None
    nxt = PAGES[idx + 1] if idx < len(PAGES) - 1 else None
    left = f'<a href="{prev[0]}.html"><span>Fyrri</span>{prev[1]}</a>' if prev else "<i></i>"
    right = f'<a href="{nxt[0]}.html" style="text-align:right"><span>Næsta</span>{nxt[1]}</a>' if nxt else "<i></i>"
    return f'<div class="pager noprint">{left}{right}</div>'


def read_src(path):
    """Skilar (efni, skriftur) úr src-skrá."""
    content = path.read_text(encoding="utf-8")
    scripts = []
    m = re.match(r"\s*<!--scripts:\s*(.*?)\s*-->", content)
    if m:
        scripts = m.group(1).split()
        content = content[m.end():]
    return content.strip(), scripts


def fix_links(html):
    """Tenglar á gömlu efnissíðurnar vísa nú á kaflana."""
    def sub(m):
        name, rest = m.group(1), m.group(2) or ""
        return f'href="{REDIRECTS.get(name, name)}.html{rest}"'
    return re.sub(r'href="([a-z0-9-]+)\.html(#[^"]*)?"', sub, html)


GATE_TEXT = {
    "final": ("Lokaprófið er læst", "Kláraðu kaflapróf allra átta kaflanna með einkunn 6 eða hærra til að opna lokaprófið."),
    "archive": ("Prófasafnið er læst", "Náðu lokaprófi ferðalagsins (einkunn 6 eða hærra) til að opna gömlu prófin með lausnum."),
}


def gated(content, gate):
    title, text = GATE_TEXT[gate]
    return (f'<div class="gate" data-gate="{gate}">\n<div class="lockscreen" hidden><div class="lock-ico" aria-hidden="true">🔒</div>'
            f'<h1>{title}</h1><p>{text}</p><p><a class="btn" href="index.html">Aftur á kortið</a></p></div>\n'
            f'<div class="gated">\n{content}\n</div>\n</div>')


STEPS = [("lesa", "Lesa"), ("aefa", "Æfa"), ("gagnvirkt", "Gagnvirkt"), ("prof", "Kaflapróf")]


def chapter_html(n, src, title, sub, topics, exam):
    reading, s1 = read_src(SRC / f"{src}.html")
    reading = reading.replace("<!--wide-->", "")
    reading = re.sub(r"^\s*<h1[^>]*>.*?</h1>\s*", "", reading, count=1, flags=re.S)
    gpath = SRC / "gagnvirkt" / f"kafli-{n}.html"
    if gpath.exists():
        widget, s2 = read_src(gpath)
    else:
        widget, s2 = ('<h2>Gagnvirkt</h2><p class="note">Gagnvirki hlutinn fyrir þennan kafla er í smíðum.</p>', [])
        print(f"vantar {gpath} (bráðabirgðaefni notað)", file=sys.stderr)
    stepper = "".join(
        f'<li><button type="button" class="st" data-step="{k}" aria-controls="step-{k}"><span class="st-n">{i + 1}</span>'
        f'<span class="st-l">{lab}</span><small class="st-s" data-status="{k}"></small></button></li>'
        for i, (k, lab) in enumerate(STEPS))
    nxt = f"kafli {n + 1}" if n < len(CHAPTERS) else "lokaprófið"
    prev = f'<a href="kafli-{n - 1}.html">kafla {n - 1}</a>' if n > 1 else ""
    html = f"""<div class="chapter" data-ch="{n}" data-topics="{' '.join(topics)}">
<div class="lockscreen" hidden><div class="lock-ico" aria-hidden="true">🔒</div><h1>Kafli {n}: {title}</h1>
<p>Þessi kafli opnast þegar þú hefur náð kaflaprófinu í {prev} með einkunn 6 eða hærra.</p><p><a class="btn" href="index.html">Aftur á kortið</a></p></div>
<div class="ch-body">
<header class="ch-head">
<p class="eyebrow">Kafli {n} af {len(CHAPTERS)} · {sub}</p>
<h1>{title}</h1>
<p class="ch-exam"><b>Á lokaprófinu:</b> {exam}</p>
<ol class="stepper" aria-label="Skref kaflans">{stepper}</ol>
</header>
<section class="step" data-step="lesa" id="step-lesa">
{reading}
<div class="step-next"><button type="button" class="btn" data-act="read">Ég hef lesið kaflann · áfram í æfingar →</button></div>
</section>
<section class="step" data-step="aefa" id="step-aefa" hidden>
<h2>Æfingar</h2>
<p>Reiknidæmi með nýjum tölum í hvert skipti og skilningsspurningar úr kaflanum. Náðu <b>{PRACTICE_GOAL} réttum svörum</b> til að ljúka skrefinu. Þú færð lausnina eftir hvert svar og mátt halda áfram eins lengi og þú vilt.</p>
<div class="practice"></div>
</section>
<section class="step" data-step="gagnvirkt" id="step-gagnvirkt" hidden>
{widget}
<p class="w-status" aria-live="polite"></p>
</section>
<section class="step" data-step="prof" id="step-prof" hidden>
<h2>Kaflapróf</h2>
<div class="ctest" data-next="{nxt}"></div>
</section>
</div>
</div>"""
    return html, s1 + s2


def order_scripts(scripts):
    seen, out = set(), []
    for s in SCRIPT_ORDER + scripts:
        if s in scripts and s not in seen:
            seen.add(s); out.append(s)
    for s in scripts:
        if s not in seen:
            seen.add(s); out.append(s)
    return out


def write_chapters_js():
    data = [{"n": n, "src": src, "title": t, "sub": sub, "topics": topics, "exam": exam}
            for n, src, t, sub, topics, exam in CHAPTERS]
    js = ("/* chapters.js – búið til af tools/build.py. Breyttu CHAPTERS þar, ekki hér. */\n"
          "window.TK = window.TK || {};\n"
          f"window.TK.CHAPTERS = {json.dumps(data, ensure_ascii=False, indent=1)};\n"
          f"window.TK.PASS = {PASS};\nwindow.TK.PRACTICE_GOAL = {PRACTICE_GOAL};\n")
    (ROOT / "js" / "chapters.js").write_text(js, encoding="utf-8")


def main():
    write_chapters_js()
    chap = {f"kafli-{c[0]}": c for c in CHAPTERS}
    for idx, (name, label, grp, title, gate) in enumerate(PAGES):
        if name in chap:
            content, scripts = chapter_html(*chap[name])
            scripts += ["js/ctrl.js", "js/bank.js"]
            wide = True
        else:
            src = SRC / f"{name}.html"
            if not src.exists():
                print(f"vantar {src}", file=sys.stderr)
                continue
            content, scripts = read_src(src)
            wide = "<!--wide-->" in content
            if gate in ("final", "archive"):
                content = gated(content, gate)
        scripts = order_scripts(scripts + ["js/chapters.js", "js/journey.js"])
        page = TEMPLATE.format(
            title=title,
            nav=nav_html(name),
            content=fix_links(content),
            pager=pager_html(idx),
            pageclass="page wide" if wide else "page",
            scripts="\n".join(f'<script src="{s}"></script>' for s in scripts),
        )
        (ROOT / f"{name}.html").write_text(page, encoding="utf-8")
        print("skrifaði", f"{name}.html")
    for old, new in REDIRECTS.items():
        (ROOT / f"{old}.html").write_text(
            f'<!doctype html><html lang="is"><head><meta charset="utf-8"><title>Flutt</title>'
            f'<meta http-equiv="refresh" content="0; url={new}.html">'
            f'<script>location.replace("{new}.html" + location.hash)</script></head>'
            f'<body><p>Efnið er nú í <a href="{new}.html">{new}.html</a>.</p></body></html>\n', encoding="utf-8")
        print("tilvísun", f"{old}.html -> {new}.html")


if __name__ == "__main__":
    main()

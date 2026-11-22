#!/usr/bin/env python3
"""Setur saman síðurnar: src/<nafn>.html (bara efnið) -> <nafn>.html (heil síða).

Keyrsla úr möppu áfangans:  python3 tools/build.py

Vefurinn er ferðalag í níu köflum. Hver kafli (kafli-N.html) er settur saman úr
  src/<lesefni>.html          skref 1, Lesa
  (æfingar úr bankanum)       skref 2, Æfa
  src/gagnvirkt/kafli-N.html  skref 3, Gagnvirkt (skriftan er js/w/kafli-N.js)
  (kaflapróf úr bankanum)     skref 4, Kaflapróf
Spurningabankinn er js/bank.js (kjarni) og js/q/*.js (spurningar eftir efni).
Flashcards eru í js/cards/*.js. Lásar, stig og einkunnir eru í js/journey.js;
kaflarnir og textinn sem er bundinn áfanganum eru skrifaðir í js/chapters.js héðan.
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
TEST_N = 10         # spurningar í kaflaprófi

# (n, lesefni í src/, titill, undirtitill, efni í bankanum, tenging við verkefni og próf)
CHAPTERS = [
    (1, "ferlar", "Ferlar og ferlaskráning", "F1-F2 · BPM kaflar 1-2", ["ferlar"],
     "EV1: ferlaskráning, SIPOC og flöskuhálsar"),
    (2, "ferlalikon", "Ferlalíkön í BPMN", "F3 · BPM kafli 3", ["bpmn"],
     "EV1: BPMN-líkan af ferlinu"),
    (3, "throud-likon", "Þróuð ferlalíkön", "F4 · BPM kafli 4", ["bpmn2"],
     "EV1: undirferli, atburðir, skilaboð og frávik"),
    (4, "uppgotvun", "Ferlauppgötvun", "F5 · BPM kafli 5", ["uppgotvun"],
     "EV1 og HÓP1: viðtöl, vinnustofur og atburðaskrár"),
    (5, "eigindleg", "Eigindleg ferlagreining", "F6 · BPM kafli 6", ["eigindleg"],
     "HÓP1: virðisgreining, sóun og rótargreining"),
    (6, "megindleg", "Megindleg ferlagreining", "F7 · BPM kafli 7", ["megindleg"],
     "HÓP1: flæðigreining, biðraðir og hermun"),
    (7, "endurhonnun", "Endurhönnun og ferlahugbúnaður", "F8-F10 · BPM kaflar 8-10", ["endurhonnun"],
     "HÓP1: to-be líkan og keyranleg ferli"),
    (8, "kerfishugsun", "Kerfishugsun og orsakalykkjur", "F11-F12 · Thinking in Systems", ["kerfi"],
     "HÓP2: orsakalykkjurit (CLD) af íslensku kerfi"),
    (9, "stjornun", "Stjórnun ferla og BPM í starfseminni", "F13-F14 · BPM kaflar 11-12 · gestafyrirlestur", ["stjornun"],
     "EV2 og lokapróf: stjórnun, þroski og menning"),
]

# Texti sem er bundinn áfanganum (notaður í js/journey.js)
COURSE = {
    "key": "gfk-ferd-v1",
    "testN": TEST_N,
    "levels": [
        [0, "Nýnemi"], [200, "Ferlaskrásetjari"], [450, "BPMN-teiknari"], [750, "Ferlaspæjari"],
        [1100, "Sóunarveiðari"], [1500, "Biðraðameistari"], [2000, "Ferlahönnuður"], [2600, "Kerfishugsuður"],
        [3300, "Meistari ferla og kerfa"],
    ],
    "finalSub": "Sex hlutar úr öllum köflunum · nýjar spurningar og tölur í hvert skipti",
    "finalOpenText": "Nú er komið að lokaprófi ferðalagsins: sex hlutar úr öllu námsefninu.",
    "finalIntro": ("<p><b>Sex hlutar úr öllu námsefninu.</b> Hver hluti hefur nokkra liði sem vega jafnt innan hlutans. "
                   "Megindlegi hlutinn er reiknidæmi; hinir eru skilnings- og atburðarásarspurningar.</p>"
                   "<p>Alvöru lokaprófið gildir 30 % og nær yfir alla fyrirlestra og öll verkefni. "
                   "Hafðu <a href=\"formulublad.html\">formúlublaðið</a> og vasareikni við höndina.</p>"),
    "finalPlan": [
        {"title": "Ferlar, ferlaskráning og BPMN", "weight": 20, "topics": ["ferlar", "bpmn", "bpmn2"], "nNum": 0, "nMc": 6},
        {"title": "Ferlauppgötvun og eigindleg greining", "weight": 15, "topics": ["uppgotvun", "eigindleg"], "nNum": 0, "nMc": 5},
        {"title": "Megindleg ferlagreining", "weight": 20, "topics": ["megindleg"], "nNum": 4, "nMc": 1},
        {"title": "Endurhönnun, ferlahugbúnaður og ferlaframkvæmd", "weight": 15, "topics": ["endurhonnun"], "nNum": 0, "nMc": 5},
        {"title": "Kerfishugsun og orsakalykkjur", "weight": 15, "topics": ["kerfi"], "nNum": 1, "nMc": 4},
        {"title": "Stjórnun ferla og BPM í starfseminni", "weight": 15, "topics": ["stjornun"], "nNum": 0, "nMc": 5},
    ],
    "rewardTitle": "Lokaupprifjunin",
    "rewardHref": "upprifjun.html",
    "rewardLabel": "Lokaupprifjun: ritgerðarspurningar og munnlega prófið",
    "rewardLocked": "Ritgerðarspurningar með svörum, undirbúningur fyrir munnlega prófið og ótakmörkuð ný lokapróf. Opnast þegar þú nærð lokaprófi ferðalagsins.",
    "rewardWon": "Lokaupprifjunin er opin: ritgerðarspurningar með svörum, undirbúningur fyrir munnlega prófið og ótakmörkuð ný lokapróf.",
    "rewardLinks": [
        ["upprifjun.html", "Ritgerðarspurningar með svörum"],
        ["upprifjun.html#munnlegt", "Munnlega prófið"],
        ["lokaprof-aefing.html", "Ný æfingalokapróf"],
    ],
}

# (skrá, valmyndartexti, hópur, titill síðu, læsing)
PAGES = [("index", "Kortið", "Ferðalagið", "Ferðalagið að lokaprófinu", None)]
PAGES += [(f"kafli-{n}", f"{n}. {t}", "Ferðalagið", f"Kafli {n}: {t}", f"ch{n}") for n, _, t, *_ in CHAPTERS]
PAGES += [
    ("lokaprof-aefing", "Lokapróf", "Ferðalagið", "Lokapróf ferðalagsins", "final"),
    ("upprifjun", "Lokaupprifjun", "Verðlaun", "Lokaupprifjun: ritgerðarspurningar og munnlega prófið", "archive"),
    ("aefingar", "Frjálsar æfingar", "Verkfæri", "Frjálsar æfingar", None),
    ("spjold", "Flashcards", "Verkfæri", "Flashcards", None),
    ("ordasafn", "Orðasafn", "Verkfæri", "Orðasafn: íslensk og ensk hugtök", None),
    ("verkfaerakista", "Verkfærakista", "Verkfæri", "Verkfærakista: sniðmát og greiningartól", None),
    ("reiknivelar", "Reiknivélar", "Verkfæri", "Reiknivélar fyrir megindlega greiningu", None),
    ("formulublad", "Formúlublað", "Verkfæri", "Formúlublað", None),
]

BANK = ["js/bank.js"] + sorted(f"js/q/{p.name}" for p in (ROOT / "js" / "q").glob("*.js"))
CARDS = ["js/bank.js"] + sorted(f"js/cards/{p.name}" for p in (ROOT / "js" / "cards").glob("*.js"))
# Skriftur sem bætast sjálfkrafa við tilteknar síður (auk þeirra sem src-skráin biður um)
PAGE_SCRIPTS = {
    "aefingar": BANK + ["js/quiz.js"],
    "spjold": CARDS + ["js/cards.js"],
    "lokaprof-aefing": BANK + ["js/examgen.js"],
}

# Röð skrifta: grunnsöfn fyrst, svo ferðalagsvélin, svo síðusértækar skriftur
SCRIPT_ORDER = BANK + ["js/cards/"] + ["js/examgen.js", "js/chapters.js", "js/journey.js"]

TEMPLATE = """<!doctype html>
<html lang="is">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · Greining ferla og kerfa</title>
<meta name="description" content="Kennsluvefur fyrir IÐN301G Greining ferla og kerfa: ferlaskráning, BPMN, ferlauppgötvun, eigindleg og megindleg greining, endurhönnun, ferlahugbúnaður, kerfishugsun og stjórnun ferla.">
<link rel="stylesheet" href="vendor/katex/katex.min.css">
<link rel="stylesheet" href="css/style.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23173327'/%3E%3Ccircle cx='7' cy='16' r='3' fill='%23ffe98a'/%3E%3Crect x='12' y='12' width='8' height='8' rx='2' fill='%23ffe98a'/%3E%3Cpath d='M25 11l5 5-5 5-5-5z' fill='%23ffe98a'/%3E%3C/svg%3E">
<script>try{{var d=document.documentElement,t=localStorage.getItem("tk-theme");if(t)d.setAttribute("data-theme",t);if(localStorage.getItem("tk-side")==="hidden")d.setAttribute("data-side","hidden")}}catch(e){{}}</script>
</head>
<body>
<div class="topbar"><a href="index.html">Greining ferla og kerfa</a><div class="topbar-btns"><button type="button" class="theme-btn">Þema</button><button type="button" id="menu-btn" aria-expanded="false" aria-controls="side">Valmynd</button></div></div>
<button type="button" class="side-show" id="side-show" aria-controls="side" title="Sýna valmynd (\\)"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14"/></svg>Valmynd</button>
<div class="shell">
<aside class="side" id="side">
<div class="side-top"><a class="home" href="../index.html">← Allir kennsluvefir</a><button type="button" class="side-hide" id="side-hide" aria-controls="side" aria-label="Fela valmynd" title="Fela valmynd (\\)"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg></button></div>
<a class="brand" href="index.html">Greining ferla og kerfa<small>IÐN301G · Ferðalag að lokaprófi</small></a>
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


GATE_TEXT = {
    "final": ("Lokaprófið er læst", f"Kláraðu kaflapróf allra {len(CHAPTERS)} kaflanna með einkunn 6 eða hærra til að opna lokaprófið."),
    "archive": ("Lokaupprifjunin er læst", "Náðu lokaprófi ferðalagsins (einkunn 6 eða hærra) til að opna ritgerðarspurningarnar og undirbúninginn fyrir munnlega prófið."),
}


def gated(content, gate):
    title, text = GATE_TEXT[gate]
    return (f'<div class="gate" data-gate="{gate}">\n<div class="lockscreen" hidden><div class="lock-ico" aria-hidden="true">🔒</div>'
            f'<h1>{title}</h1><p>{text}</p><p><a class="btn" href="index.html">Aftur á kortið</a></p></div>\n'
            f'<div class="gated">\n{content}\n</div>\n</div>')


STEPS = [("lesa", "Lesa"), ("aefa", "Æfa"), ("gagnvirkt", "Gagnvirkt"), ("prof", "Kaflapróf")]


def chapter_html(n, src, title, sub, topics, exam):
    spath = SRC / f"{src}.html"
    if spath.exists():
        reading, s1 = read_src(spath)
    else:
        reading, s1 = ('<p class="note">Lesefnið fyrir þennan kafla er í smíðum.</p>', [])
        print(f"vantar {spath} (bráðabirgðaefni notað)", file=sys.stderr)
    reading = reading.replace("<!--wide-->", "")
    reading = re.sub(r"^\s*<h1[^>]*>.*?</h1>\s*", "", reading, count=1, flags=re.S)
    gpath = SRC / "gagnvirkt" / f"kafli-{n}.html"
    if gpath.exists():
        widget, s2 = read_src(gpath)
    else:
        widget, s2 = ('<h2>Gagnvirkt</h2><p class="note">Gagnvirki hlutinn fyrir þennan kafla er í smíðum.</p>', [])
        print(f"vantar {gpath} (bráðabirgðaefni notað)", file=sys.stderr)
    wjs = f"js/w/kafli-{n}.js"
    if (ROOT / wjs).exists() and wjs not in s2:
        s2 = s2 + [wjs]
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
<p class="ch-exam"><b>Tengist:</b> {exam}</p>
<ol class="stepper" aria-label="Skref kaflans">{stepper}</ol>
</header>
<section class="step" data-step="lesa" id="step-lesa">
{reading}
<div class="step-next"><button type="button" class="btn" data-act="read">Ég hef lesið kaflann · áfram í æfingar →</button></div>
</section>
<section class="step" data-step="aefa" id="step-aefa" hidden>
<h2>Æfingar</h2>
<p>Skilningsspurningar úr kaflanum og, þar sem við á, reiknidæmi með nýjum tölum í hvert skipti. Náðu <b>{PRACTICE_GOAL} réttum svörum</b> til að ljúka skrefinu. Þú færð skýringu eftir hvert svar og mátt halda áfram eins lengi og þú vilt.</p>
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
    def rank(s):
        for i, p in enumerate(SCRIPT_ORDER):
            if s == p or (p.endswith("/") and s.startswith(p)):
                return i
        return len(SCRIPT_ORDER)
    seen, out = set(), []
    for s in scripts:
        if s not in seen:
            seen.add(s); out.append(s)
    return sorted(out, key=lambda s: (rank(s), out.index(s)))


def write_chapters_js():
    data = [{"n": n, "src": src, "title": t, "sub": sub, "topics": topics, "exam": exam}
            for n, src, t, sub, topics, exam in CHAPTERS]
    js = ("/* chapters.js – búið til af tools/build.py. Breyttu CHAPTERS og COURSE þar, ekki hér. */\n"
          "window.TK = window.TK || {};\n"
          f"window.TK.CHAPTERS = {json.dumps(data, ensure_ascii=False, indent=1)};\n"
          f"window.TK.COURSE = {json.dumps(COURSE, ensure_ascii=False, indent=1)};\n"
          f"window.TK.PASS = {PASS};\nwindow.TK.PRACTICE_GOAL = {PRACTICE_GOAL};\n")
    (ROOT / "js" / "chapters.js").write_text(js, encoding="utf-8")


def main():
    write_chapters_js()
    chap = {f"kafli-{c[0]}": c for c in CHAPTERS}
    for idx, (name, label, grp, title, gate) in enumerate(PAGES):
        if name in chap:
            content, scripts = chapter_html(*chap[name])
            scripts += BANK
            wide = True
        else:
            src = SRC / f"{name}.html"
            if not src.exists():
                print(f"vantar {src}", file=sys.stderr)
                continue
            content, scripts = read_src(src)
            scripts = PAGE_SCRIPTS.get(name, []) + scripts
            wide = "<!--wide-->" in content
            if gate in ("final", "archive"):
                content = gated(content, gate)
        missing = [s for s in scripts if not (ROOT / s).exists()]
        for s in missing:
            print(f"vantar skriftu {s} ({name}.html)", file=sys.stderr)
        scripts = order_scripts([s for s in scripts if s not in missing] + ["js/chapters.js", "js/journey.js"])
        page = TEMPLATE.format(
            title=title,
            nav=nav_html(name),
            content=content,
            pager=pager_html(idx),
            pageclass="page wide" if wide else "page",
            scripts="\n".join(f'<script src="{s}"></script>' for s in scripts),
        )
        (ROOT / f"{name}.html").write_text(page, encoding="utf-8")
        print("skrifaði", f"{name}.html")


if __name__ == "__main__":
    main()

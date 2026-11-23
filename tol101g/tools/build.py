#!/usr/bin/env python3
"""Setur saman síðurnar: src/<nafn>.html (bara efnið) -> <nafn>.html (heil síða).

Keyrsla úr möppu áfangans:  python3 tools/build.py

Vefurinn er ferðalag í tólf köflum. Hver kafli (kafli-N.html) er settur saman úr
  src/<lesefni>.html          skref 1, Lesa
  (æfingar úr bankanum)       skref 2, Æfa
  js/w/kafli-N.js             skref 3, Kóðaverkstæði (verkefnin; vélin er js/verkstaedi.js)
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

# (n, lesefni í src/, titill, undirtitill, efni í bankanum, tenging við próf)
CHAPTERS = [
    (1, "forrit", "Fyrsta Java-forritið", "Vika 1 · Liang kafli 1", ["forrit"],
     "Lokapróf: hugtök, uppbygging Java-forrits og villutegundir"),
    (2, "tolur", "Breytur, tölur og inntak", "Vika 2 · Liang kafli 2", ["tolur"],
     "Miðannarpróf 1 og lokapróf: rekja segðir, heiltöludeiling, kastanir"),
    (3, "skilyrdi", "Ákvarðanir: if og switch", "Vika 3 · Liang kafli 3", ["skilyrdi"],
     "Miðannarpróf 1 og lokapróf: if/else, switch, rökvirkjar"),
    (4, "strengir", "Texti: String og char", "Vika 4 · Liang kafli 4", ["strengir"],
     "Miðannarpróf 1 og lokapróf: char-reikningur og String-aðferðir"),
    (5, "lykkjur", "Lykkjur", "Vika 5 · Liang kafli 5", ["lykkjur"],
     "Miðannarpróf 1 og lokapróf: rekja lykkjur og skrifa þær"),
    (6, "adferdir", "Aðferðir", "Vika 6 · Liang kafli 6", ["adferdir"],
     "Miðannarpróf 1 og lokapróf: færibreytur, skilagildi, yfirhleðsla"),
    (7, "fylki", "Fylki", "Vika 7 · Liang kaflar 7 og 8", ["fylki"],
     "Miðannarpróf 1 og lokapróf: fylki, tilvísanir og tvívíð fylki"),
    (8, "klasar", "Klasar og hlutir", "Vika 9 · Liang kafli 9", ["klasar"],
     "Miðannarpróf 2 og lokapróf: smiðir, get/set, static, UNO-spilið"),
    (9, "tengsl", "Hlutir sem vinna saman og UML", "Vika 10 · Liang kafli 10", ["tengsl"],
     "Miðannarpróf 2 og lokapróf: UML-klasarit og tilvísanir"),
    (10, "erfdir", "Erfðir og fjölbrigðni", "Vika 11 · Liang kafli 11", ["erfdir"],
     "Miðannarpróf 2 og lokapróf: extends, super, yfirskrifun, fjölbrigðni"),
    (11, "hrein", "abstract og interface", "Vika 12 · Liang kafli 13", ["hrein"],
     "Miðannarpróf 2 og lokapróf: abstract, interface, Comparable"),
    (12, "undantekningar", "Villur: try, catch og throw", "Vikur 12-14 · Liang kafli 12", ["undantekningar"],
     "Lokapróf: try/catch/finally, throw, throws, pakkar og aðgangur"),
]

# Texti sem er bundinn áfanganum (notaður í js/journey.js)
COURSE = {
    "key": "tol101g-ferd-v1",
    "testN": TEST_N,
    "levels": [
        [0, "Hello World"], [200, "Breytusmiður"], [450, "Skilyrðasnillingur"], [750, "Strengjahnýtir"],
        [1100, "Lykkjumeistari"], [1500, "Aðferðasmiður"], [2000, "Fylkjafræðingur"], [2600, "Hlutahönnuður"],
        [3300, "Java-meistari"],
    ],
    "finalSub": "Tveir hlutar eins og á lokaprófinu: stefnubundin forritun og hlutbundin forritun",
    "finalOpenText": "Nú er komið að lokaprófi ferðalagsins: allt námsefnið, kaflar 1-13.",
    "finalIntro": ("<p><b>Allt námsefnið í sex hlutum.</b> Eins og á alvöru prófinu þarftu að rekja kóða "
                   "(hvað prentast?) og svara krossaspurningum um hugtök og kóða. Engin hjálpartæki nema eitt A4-blað.</p>"
                   "<p>Á alvöru prófinu skrifarðu líka kóða frá grunni. Það æfir þú í "
                   "<a href=\"kodaskrif.html\">kóðaskrifunum</a> og í prófherminum sem opnast þegar þú nærð þessu prófi.</p>"),
    "finalPlan": [
        {"title": "Tölur, segðir og skilyrði", "weight": 15, "topics": ["forrit", "tolur", "skilyrdi"], "nNum": 3, "nMc": 3},
        {"title": "Strengir og lykkjur", "weight": 20, "topics": ["strengir", "lykkjur"], "nNum": 3, "nMc": 3},
        {"title": "Aðferðir og fylki", "weight": 20, "topics": ["adferdir", "fylki"], "nNum": 3, "nMc": 3},
        {"title": "Klasar, hlutir og UML", "weight": 15, "topics": ["klasar", "tengsl"], "nNum": 2, "nMc": 4},
        {"title": "Erfðir, fjölbrigðni og hrein klasar", "weight": 20, "topics": ["erfdir", "hrein"], "nNum": 3, "nMc": 3},
        {"title": "Undantekningar og pakkar", "weight": 10, "topics": ["undantekningar"], "nNum": 2, "nMc": 2},
    ],
    "rewardTitle": "Prófhermirinn",
    "rewardHref": "profhermir.html",
    "rewardLabel": "Prófhermir: stór kóðaverkefni á prófsniði",
    "rewardLocked": "Stór kóðaverkefni eins og á lokaprófinu (UML í Java, klasar, erfðir og undantekningar) með fyrirmyndarlausnum og matsblaði. Opnast þegar þú nærð lokaprófi ferðalagsins.",
    "rewardWon": "Prófhermirinn er opinn: stór kóðaverkefni á prófsniði með fyrirmyndarlausnum, og ótakmörkuð ný lokapróf.",
    "rewardLinks": [
        ["profhermir.html", "Prófhermir: stór kóðaverkefni"],
        ["lokaprof-aefing.html", "Ný æfingalokapróf"],
    ],
}

# (skrá, valmyndartexti, hópur, titill síðu, læsing)
PAGES = [("index", "Kortið", "Ferðalagið", "Ferðalagið að lokaprófinu", None)]
PAGES += [(f"kafli-{n}", f"{n}. {t}", "Ferðalagið", f"Kafli {n}: {t}", f"ch{n}") for n, _, t, *_ in CHAPTERS]
PAGES += [
    ("lokaprof-aefing", "Lokapróf", "Ferðalagið", "Lokapróf ferðalagsins", "final"),
    ("profhermir", "Prófhermir", "Verðlaun", "Prófhermir: stór kóðaverkefni á prófsniði", "archive"),
    ("aefingar", "Frjálsar æfingar", "Verkfæri", "Frjálsar æfingar", None),
    ("uppfletting", "Hvað nota ég?", "Verkfæri", "Hvað nota ég? Uppflettiskrá", None),
    ("kodaskrif", "Kóðaskrif", "Verkfæri", "Kóðaskrif: skrifaðu kóðann sjálf(ur)", None),
    ("spjold", "Flashcards", "Verkfæri", "Flashcards", None),
    ("minnisblad", "Minnisblað", "Verkfæri", "Minnisblað: Java á einu blaði", None),
]

BANK = ["js/bank.js"] + sorted(f"js/q/{p.name}" for p in (ROOT / "js" / "q").glob("*.js"))
CARDS = ["js/bank.js"] + sorted(f"js/cards/{p.name}" for p in (ROOT / "js" / "cards").glob("*.js"))
# Skriftur sem bætast sjálfkrafa við tilteknar síður (auk þeirra sem src-skráin biður um)
PAGE_SCRIPTS = {
    "aefingar": BANK + ["js/quiz.js"],
    "kodaskrif": ["js/skrif.js", "js/skrif-data.js"],
    "profhermir": ["js/skrif.js", "js/profhermir-data.js"],
    "spjold": CARDS + ["js/cards.js"],
    "lokaprof-aefing": BANK + ["js/examgen.js"],
}

# Röð skrifta: grunnsöfn fyrst, svo ferðalagsvélin, svo síðusértækar skriftur
SCRIPT_ORDER = BANK + ["js/cards/"] + ["js/examgen.js", "js/chapters.js", "js/journey.js", "js/verkstaedi.js", "js/w/", "js/skrif-data.js", "js/profhermir-data.js", "js/skrif.js"]

TEMPLATE = """<!doctype html>
<html lang="is">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · Tölvunarfræði 1</title>
<meta name="description" content="Kennsluvefur fyrir TÖL101G Tölvunarfræði 1: Java frá breytum og lykkjum að klösum, erfðum, viðmótum og undantekningum.">
<link rel="stylesheet" href="css/style.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23a8461a'/%3E%3Cpath d='M12 9l-6 7 6 7M20 9l6 7-6 7' stroke='%23fff' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
<script>try{{var d=document.documentElement,t=localStorage.getItem("tk-theme");if(t)d.setAttribute("data-theme",t);if(localStorage.getItem("tk-side")==="hidden")d.setAttribute("data-side","hidden")}}catch(e){{}}</script>
</head>
<body>
<div class="topbar"><a href="index.html">Tölvunarfræði 1</a><div class="topbar-btns"><button type="button" class="theme-btn">Þema</button><button type="button" id="menu-btn" aria-expanded="false" aria-controls="side">Valmynd</button></div></div>
<button type="button" class="side-show" id="side-show" aria-controls="side" title="Sýna valmynd (\\)"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14"/></svg>Valmynd</button>
<div class="shell">
<aside class="side" id="side">
<div class="side-top"><a class="home" href="../index.html">← Allir kennsluvefir</a><button type="button" class="side-hide" id="side-hide" aria-controls="side" aria-label="Fela valmynd" title="Fela valmynd (\\)"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg></button></div>
<a class="brand" href="index.html">Tölvunarfræði 1<small>TÖL101G · Java · Ferðalag að lokaprófi</small></a>
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
    "archive": ("Prófhermirinn er læstur", "Náðu lokaprófi ferðalagsins (einkunn 6 eða hærra) til að opna stóru kóðaverkefnin á prófsniði."),
}


def gated(content, gate):
    title, text = GATE_TEXT[gate]
    return (f'<div class="gate" data-gate="{gate}">\n<div class="lockscreen" hidden><div class="lock-ico" aria-hidden="true">🔒</div>'
            f'<h1>{title}</h1><p>{text}</p><p><a class="btn" href="index.html">Aftur á kortið</a></p></div>\n'
            f'<div class="gated">\n{content}\n</div>\n</div>')


WORKSHOP_HTML = """<h2>Kóðaverkstæði</h2>
<p>Hér vinnur þú með kóðann sjálfan, eins og á prófinu: raðar línum í rétt forrit, fyllir í eyður, finnur villur og rekur breytur skref fyrir skref. Leystu öll verkefnin til að ljúka skrefinu.</p>
<div class="panel ws-app"><noscript><p>Þessi hluti þarf JavaScript.</p></noscript></div>"""


STEPS = [("lesa", "Lesa"), ("aefa", "Æfa"), ("gagnvirkt", "Verkstæði"), ("prof", "Kaflapróf")]


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
        widget, s2 = (WORKSHOP_HTML, [])
    wjs = f"js/w/kafli-{n}.js"
    if (ROOT / wjs).exists() and wjs not in s2:
        s2 = s2 + ["js/verkstaedi.js", wjs]
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
<p>Kóðadæmi („hvað prentar forritið?“) með nýjum tölum í hvert skipti og skilningsspurningar úr kaflanum. Náðu <b>{PRACTICE_GOAL} réttum svörum</b> til að ljúka skrefinu. Þú færð skýringu eftir hvert svar og mátt halda áfram eins lengi og þú vilt.</p>
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

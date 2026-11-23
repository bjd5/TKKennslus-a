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
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

PASS = 6.0          # lágmarkseinkunn í kaflaprófi og lokaprófi
PRACTICE_GOAL = 5   # rétt svör í æfingum áður en kaflapróf opnast
TEST_N = 10         # spurningar í kaflaprófi

# (n, lesefni í src/, titill, undirtitill, efni í bankanum, tenging við próf og verkefni)
CHAPTERS = [
    (1, "snid", "Rannsóknir, breytur og úrtök", "Fyrirlestrar k1-2 · Tölfræði frá grunni kafli 2", ["breytur"],
     "Krossaspurningar um gerðir breyta, bjaga og rannsóknarsnið"),
    (2, "lysandi", "Lýsandi tölfræði og gröf", "Fyrirlestrar k3-4 · Tölfræði frá grunni kaflar 3-4", ["lysandi"],
     "R verkefni 1 og hlutaprófið: summary(), kassarit og lýsistærðir"),
    (3, "likur", "Líkur: tvíkosta- og Poisson-dreifing", "Fyrirlestrar k5 · Tölfræði frá grunni kafli 5", ["binom", "poisson"],
     "Lokapróf: dbinom, pbinom, dpois og ppois (t.d. bráðamóttakan og bóluefnið)"),
    (4, "normal", "Normaldreifing og höfuðsetningin", "Fyrirlestrar k5-6 · Tölfræði frá grunni kaflar 5-6", ["normal", "clt"],
     "Lokapróf: pnorm, qnorm og dreifing meðaltalsins"),
    (5, "oryggisbil", "Öryggisbil", "Fyrirlestrar k6-7 · Tölfræði frá grunni kaflar 6-7", ["oryggisbil"],
     "Lokapróf: öryggisbil fyrir hlutfall og meðaltal, og túlkun þeirra"),
    (6, "tilgatur", "Tilgátupróf og t-próf", "Fyrirlestrar k7-8 · Tölfræði frá grunni kaflar 7-8", ["tilgatur", "ttest"],
     "Lokapróf: var.test, t.test, parað t-próf og villur af gerð I og II"),
    (7, "hlutfoll", "Hlutföll og tengslatöflur", "Fyrirlestrar k7 og k9 · Tölfræði frá grunni kaflar 7 og 9", ["hlutfoll"],
     "Lokapróf: prop.test, kí-kvaðrat próf og gagnlíkindahlutfall"),
    (8, "anova", "Fervikagreining (ANOVA)", "Fyrirlestrar k8-9 · Tölfræði frá grunni kafli 9", ["anova"],
     "Lokapróf: ANOVA-tafla, F-gildi og forsendur"),
    (9, "adhvarf", "Línulegt aðhvarf", "Fyrirlestrar k10 · Tölfræði frá grunni kafli 10", ["adhvarf"],
     "Lokapróf: summary(lm), confint, forsendur og spár"),
    (10, "tvikosta", "Tvíkosta aðhvarf, næmi og sértæki", "Fyrirlestrar k11 · Tölfræði frá grunni kafli 11", ["tvikosta", "naemi"],
     "Lokapróf: glm, exp(β) sem gagnlíkindahlutfall, næmi, sértæki, PPV og NPV"),
    (11, "lifun", "Lifunargreining", "Fyrirlestur um lifunargreiningu · Kaplan–Meier og Cox", ["lifun"],
     "Lokapróf: Kaplan–Meier gröf, log-rank og Cox-líkan"),
]

# Texti sem er bundinn áfanganum (notaður í js/journey.js)
COURSE = {
    "key": "lyd105f-ferd-v1",
    "testN": TEST_N,
    "levels": [
        [0, "Nýnemi"], [200, "Gagnasafnari"], [450, "Meðaltalsmeistari"], [750, "Líkindareiknir"],
        [1100, "Bilasmiður"], [1500, "p-gilda spæjari"], [2000, "Aðhvarfsrýnir"], [2600, "Lifunargreinir"],
        [3300, "Líftölfræðingur"],
    ],
    "finalSub": "Á sniði lokaprófsins: krossaspurningar og reiknidæmi úr öllum köflunum, nýjar tölur í hvert skipti",
    "finalOpenText": "Nú er komið að æfingalokaprófinu: sex hlutar úr öllu námsefninu, á sama sniði og lokaprófið.",
    "finalIntro": ("<p><b>Sex hlutar úr öllu námsefninu.</b> Hver hluti hefur nokkra liði sem vega jafnt innan hlutans. "
                   "Tölurnar eru nýjar í hvert skipti og R-úttakið kemur úr gögnum áfangans.</p>"
                   "<p>Á alvöru lokaprófinu eru krossaspurningar (30%) og skrifleg dæmi (70%). Öll hjálpargögn á pappír eru leyfð, "
                   "vasareiknir og R á posit.cloud. Hafðu <a href=\"formulublad.html\">formúlublaðið</a> við höndina.</p>"),
    "finalPlan": [
        {"title": "Rannsóknir, breytur og lýsandi tölfræði", "weight": 10, "topics": ["breytur", "lysandi"], "nNum": 1, "nMc": 3},
        {"title": "Líkindadreifingar: tvíkosta, Poisson og normal", "weight": 25, "topics": ["binom", "poisson", "normal", "clt"], "nNum": 5, "nMc": 1},
        {"title": "Öryggisbil og tilgátupróf", "weight": 20, "topics": ["oryggisbil", "tilgatur", "ttest"], "nNum": 3, "nMc": 3},
        {"title": "Hlutföll, tengslatöflur og ANOVA", "weight": 15, "topics": ["hlutfoll", "anova"], "nNum": 2, "nMc": 2},
        {"title": "Línulegt og tvíkosta aðhvarf, næmi og sértæki", "weight": 20, "topics": ["adhvarf", "tvikosta", "naemi"], "nNum": 3, "nMc": 2},
        {"title": "Lifunargreining", "weight": 10, "topics": ["lifun"], "nNum": 1, "nMc": 2},
    ],
    "rewardTitle": "Prófhermirinn",
    "rewardHref": "profhermir.html",
    "rewardLabel": "Prófhermir: skrifleg dæmi með R-úttaki",
    "rewardLocked": "Skrifleg dæmi á sniði lokaprófsins með raunverulegu R-úttaki, fyrirmyndarsvörum og matsblaði. Opnast þegar þú nærð æfingalokaprófinu.",
    "rewardWon": "Prófhermirinn er opinn: skrifleg dæmi á sniði lokaprófsins með R-úttaki, fyrirmyndarsvörum og matsblaði.",
    "rewardLinks": [
        ["profhermir.html", "Skrifleg dæmi á prófsniði"],
        ["lokaprof-aefing.html", "Ný æfingalokapróf"],
    ],
}

# (skrá, valmyndartexti, hópur, titill síðu, læsing)
PAGES = [("index", "Kortið", "Ferðalagið", "Ferðalagið að lokaprófinu", None)]
PAGES += [(f"kafli-{n}", f"{n}. {t}", "Ferðalagið", f"Kafli {n}: {t}", f"ch{n}") for n, _, t, *_ in CHAPTERS]
PAGES += [
    ("lokaprof-aefing", "Lokapróf", "Ferðalagið", "Lokapróf ferðalagsins", "final"),
    ("profhermir", "Prófhermir", "Verðlaun", "Prófhermir: skrifleg dæmi á prófsniði", "archive"),
    ("aefingar", "Frjálsar æfingar", "Verkfæri", "Frjálsar æfingar", None),
    ("spjold", "Flashcards", "Verkfæri", "Flashcards", None),
    ("dreifingar", "Dreifingaborðið", "Verkfæri", "Dreifingaborðið: líkur og prósentumörk", None),
    ("profval", "Hvaða próf?", "Verkfæri", "Hvaða próf á við?", None),
    ("formulublad", "Formúlublað", "Verkfæri", "Formúlublað og R-föll", None),
    ("ordasafn", "Orðasafn", "Verkfæri", "Orðasafn: íslensk og ensk hugtök", None),
]

BANK = ["js/stat.js", "js/bank.js"] + sorted(f"js/q/{p.name}" for p in (ROOT / "js" / "q").glob("*.js"))
CARDS = ["js/stat.js", "js/bank.js"] + sorted(f"js/cards/{p.name}" for p in (ROOT / "js" / "cards").glob("*.js"))
# Skriftur sem bætast sjálfkrafa við tilteknar síður (auk þeirra sem src-skráin biður um)
PAGE_SCRIPTS = {
    "aefingar": BANK + ["js/quiz.js"],
    "spjold": CARDS + ["js/cards.js"],
    "lokaprof-aefing": BANK + ["js/examgen.js"],
    "profhermir": ["js/stat.js", "js/uttak.js", "js/lab.js", "js/profhermir.js"],
    "dreifingar": ["js/stat.js", "js/lab.js", "js/dreifingar.js"],
    "profval": ["js/lab.js", "js/profval.js"],
    "ordasafn": ["js/ordasafn.js"],
}

# Röð skrifta: grunnsöfn fyrst, svo ferðalagsvélin, svo síðusértækar skriftur
SCRIPT_ORDER = BANK + ["js/uttak.js", "js/lab.js", "js/malin-data.js", "js/gagnvirkt.js"] + ["js/cards/"] + ["js/examgen.js", "js/chapters.js", "js/journey.js"]

TEMPLATE = """<!doctype html>
<html lang="is">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · Líftölfræði I</title>
<meta name="description" content="Kennsluvefur fyrir LÝÐ105F Líftölfræði I: breytur, lýsandi tölfræði, líkindadreifingar, öryggisbil, tilgátupróf, t-próf, kí-kvaðrat, ANOVA, aðhvarf, tvíkosta aðhvarf og lifunargreining í R.">
<link rel="stylesheet" href="vendor/katex/katex.min.css">
<link rel="stylesheet" href="css/style.css?v={v_style}">\n<link rel="stylesheet" href="css/lab.css?v={v_lab}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23b45c1e'/%3E%3Cpath d='M5 24c4 0 6-15 11-15s7 15 11 15' stroke='%23fff' stroke-width='2.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E">
<script>try{{var d=document.documentElement,t=localStorage.getItem("tk-theme");if(t)d.setAttribute("data-theme",t);if(localStorage.getItem("tk-side")==="hidden")d.setAttribute("data-side","hidden")}}catch(e){{}}</script>
</head>
<body>
<div class="topbar"><a href="index.html">Líftölfræði I</a><div class="topbar-btns"><button type="button" class="theme-btn">Þema</button><button type="button" id="menu-btn" aria-expanded="false" aria-controls="side">Valmynd</button></div></div>
<button type="button" class="side-show" id="side-show" aria-controls="side" title="Sýna valmynd (\\)"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14"/></svg>Valmynd</button>
<div class="shell">
<aside class="side" id="side">
<div class="side-top"><a class="home" href="../index.html">← Allir kennsluvefir</a><button type="button" class="side-hide" id="side-hide" aria-controls="side" aria-label="Fela valmynd" title="Fela valmynd (\\)"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg></button></div>
<a class="brand" href="index.html">Líftölfræði I<small>LÝÐ105F · Ferðalag að lokaprófi</small></a>
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
<script src="js/site.js?v={v_site}"></script>
{scripts}
</body>
</html>
"""



def ver(rel):
    """Stutt fingrafar skrár, sett aftan á slóðina svo vafrar sæki nýja útgáfu þegar skráin breytist."""
    f = ROOT / rel
    return hashlib.md5(f.read_bytes()).hexdigest()[:8] if f.exists() else "0"


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
    "archive": ("Prófhermirinn er læstur", "Náðu lokaprófi ferðalagsins (einkunn 6 eða hærra) til að opna skriflegu dæmin á prófsniði."),
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
<p>Skilningsspurningar úr kaflanum og reiknidæmi með nýjum tölum í hvert skipti. Náðu <b>{PRACTICE_GOAL} réttum svörum</b> til að ljúka skrefinu. Þú færð skýringu eftir hvert svar og mátt halda áfram eins lengi og þú vilt.</p>
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
            scripts="\n".join(f'<script src="{s}?v={ver(s)}"></script>' for s in scripts),
            v_style=ver("css/style.css"),
            v_lab=ver("css/lab.css"),
            v_site=ver("js/site.js"),
        )
        (ROOT / f"{name}.html").write_text(page, encoding="utf-8")
        print("skrifaði", f"{name}.html")


if __name__ == "__main__":
    main()

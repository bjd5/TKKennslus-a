/* chapters.js – búið til af tools/build.py. Breyttu CHAPTERS og COURSE þar, ekki hér. */
window.TK = window.TK || {};
window.TK.CHAPTERS = [
 {
  "n": 1,
  "src": "snid",
  "title": "Rannsóknir, breytur og úrtök",
  "sub": "Fyrirlestrar k1-2 · Tölfræði frá grunni kafli 2",
  "topics": [
   "breytur"
  ],
  "exam": "Krossaspurningar um gerðir breyta, bjaga og rannsóknarsnið"
 },
 {
  "n": 2,
  "src": "lysandi",
  "title": "Lýsandi tölfræði og gröf",
  "sub": "Fyrirlestrar k3-4 · Tölfræði frá grunni kaflar 3-4",
  "topics": [
   "lysandi"
  ],
  "exam": "R verkefni 1 og hlutaprófið: summary(), kassarit og lýsistærðir"
 },
 {
  "n": 3,
  "src": "likur",
  "title": "Líkur: tvíkosta- og Poisson-dreifing",
  "sub": "Fyrirlestrar k5 · Tölfræði frá grunni kafli 5",
  "topics": [
   "binom",
   "poisson"
  ],
  "exam": "Lokapróf: dbinom, pbinom, dpois og ppois (t.d. bráðamóttakan og bóluefnið)"
 },
 {
  "n": 4,
  "src": "normal",
  "title": "Normaldreifing og höfuðsetningin",
  "sub": "Fyrirlestrar k5-6 · Tölfræði frá grunni kaflar 5-6",
  "topics": [
   "normal",
   "clt"
  ],
  "exam": "Lokapróf: pnorm, qnorm og dreifing meðaltalsins"
 },
 {
  "n": 5,
  "src": "oryggisbil",
  "title": "Öryggisbil",
  "sub": "Fyrirlestrar k6-7 · Tölfræði frá grunni kaflar 6-7",
  "topics": [
   "oryggisbil"
  ],
  "exam": "Lokapróf: öryggisbil fyrir hlutfall og meðaltal, og túlkun þeirra"
 },
 {
  "n": 6,
  "src": "tilgatur",
  "title": "Tilgátupróf og t-próf",
  "sub": "Fyrirlestrar k7-8 · Tölfræði frá grunni kaflar 7-8",
  "topics": [
   "tilgatur",
   "ttest"
  ],
  "exam": "Lokapróf: var.test, t.test, parað t-próf og villur af gerð I og II"
 },
 {
  "n": 7,
  "src": "hlutfoll",
  "title": "Hlutföll og tengslatöflur",
  "sub": "Fyrirlestrar k7 og k9 · Tölfræði frá grunni kaflar 7 og 9",
  "topics": [
   "hlutfoll"
  ],
  "exam": "Lokapróf: prop.test, kí-kvaðrat próf og gagnlíkindahlutfall"
 },
 {
  "n": 8,
  "src": "anova",
  "title": "Fervikagreining (ANOVA)",
  "sub": "Fyrirlestrar k8-9 · Tölfræði frá grunni kafli 9",
  "topics": [
   "anova"
  ],
  "exam": "Lokapróf: ANOVA-tafla, F-gildi og forsendur"
 },
 {
  "n": 9,
  "src": "adhvarf",
  "title": "Línulegt aðhvarf",
  "sub": "Fyrirlestrar k10 · Tölfræði frá grunni kafli 10",
  "topics": [
   "adhvarf"
  ],
  "exam": "Lokapróf: summary(lm), confint, forsendur og spár"
 },
 {
  "n": 10,
  "src": "tvikosta",
  "title": "Tvíkosta aðhvarf, næmi og sértæki",
  "sub": "Fyrirlestrar k11 · Tölfræði frá grunni kafli 11",
  "topics": [
   "tvikosta",
   "naemi"
  ],
  "exam": "Lokapróf: glm, exp(β) sem gagnlíkindahlutfall, næmi, sértæki, PPV og NPV"
 },
 {
  "n": 11,
  "src": "lifun",
  "title": "Lifunargreining",
  "sub": "Fyrirlestur um lifunargreiningu · Kaplan–Meier og Cox",
  "topics": [
   "lifun"
  ],
  "exam": "Lokapróf: Kaplan–Meier gröf, log-rank og Cox-líkan"
 }
];
window.TK.COURSE = {
 "key": "lyd105f-ferd-v1",
 "testN": 10,
 "levels": [
  [
   0,
   "Nýnemi"
  ],
  [
   200,
   "Gagnasafnari"
  ],
  [
   450,
   "Meðaltalsmeistari"
  ],
  [
   750,
   "Líkindareiknir"
  ],
  [
   1100,
   "Bilasmiður"
  ],
  [
   1500,
   "p-gilda spæjari"
  ],
  [
   2000,
   "Aðhvarfsrýnir"
  ],
  [
   2600,
   "Lifunargreinir"
  ],
  [
   3300,
   "Líftölfræðingur"
  ]
 ],
 "finalSub": "Á sniði lokaprófsins: krossaspurningar og reiknidæmi úr öllum köflunum, nýjar tölur í hvert skipti",
 "finalOpenText": "Nú er komið að æfingalokaprófinu: sex hlutar úr öllu námsefninu, á sama sniði og lokaprófið.",
 "finalIntro": "<p><b>Sex hlutar úr öllu námsefninu.</b> Hver hluti hefur nokkra liði sem vega jafnt innan hlutans. Tölurnar eru nýjar í hvert skipti og R-úttakið kemur úr gögnum áfangans.</p><p>Á alvöru lokaprófinu eru krossaspurningar (30%) og skrifleg dæmi (70%). Öll hjálpargögn á pappír eru leyfð, vasareiknir og R á posit.cloud. Hafðu <a href=\"formulublad.html\">formúlublaðið</a> við höndina.</p>",
 "finalPlan": [
  {
   "title": "Rannsóknir, breytur og lýsandi tölfræði",
   "weight": 10,
   "topics": [
    "breytur",
    "lysandi"
   ],
   "nNum": 1,
   "nMc": 3
  },
  {
   "title": "Líkindadreifingar: tvíkosta, Poisson og normal",
   "weight": 25,
   "topics": [
    "binom",
    "poisson",
    "normal",
    "clt"
   ],
   "nNum": 5,
   "nMc": 1
  },
  {
   "title": "Öryggisbil og tilgátupróf",
   "weight": 20,
   "topics": [
    "oryggisbil",
    "tilgatur",
    "ttest"
   ],
   "nNum": 3,
   "nMc": 3
  },
  {
   "title": "Hlutföll, tengslatöflur og ANOVA",
   "weight": 15,
   "topics": [
    "hlutfoll",
    "anova"
   ],
   "nNum": 2,
   "nMc": 2
  },
  {
   "title": "Línulegt og tvíkosta aðhvarf, næmi og sértæki",
   "weight": 20,
   "topics": [
    "adhvarf",
    "tvikosta",
    "naemi"
   ],
   "nNum": 3,
   "nMc": 2
  },
  {
   "title": "Lifunargreining",
   "weight": 10,
   "topics": [
    "lifun"
   ],
   "nNum": 1,
   "nMc": 2
  }
 ],
 "rewardTitle": "Prófhermirinn",
 "rewardHref": "profhermir.html",
 "rewardLabel": "Prófhermir: skrifleg dæmi með R-úttaki",
 "rewardLocked": "Skrifleg dæmi á sniði lokaprófsins með raunverulegu R-úttaki, fyrirmyndarsvörum og matsblaði. Opnast þegar þú nærð æfingalokaprófinu.",
 "rewardWon": "Prófhermirinn er opinn: skrifleg dæmi á sniði lokaprófsins með R-úttaki, fyrirmyndarsvörum og matsblaði.",
 "rewardLinks": [
  [
   "profhermir.html",
   "Skrifleg dæmi á prófsniði"
  ],
  [
   "lokaprof-aefing.html",
   "Ný æfingalokapróf"
  ]
 ]
};
window.TK.PASS = 6.0;
window.TK.PRACTICE_GOAL = 5;

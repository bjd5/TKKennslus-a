/* chapters.js – búið til af tools/build.py. Breyttu CHAPTERS og COURSE þar, ekki hér. */
window.TK = window.TK || {};
window.TK.CHAPTERS = [
 {
  "n": 1,
  "src": "ferlar",
  "title": "Ferlar og ferlaskráning",
  "sub": "F1-F2 · BPM kaflar 1-2",
  "topics": [
   "ferlar"
  ],
  "exam": "EV1: ferlaskráning, SIPOC og flöskuhálsar"
 },
 {
  "n": 2,
  "src": "ferlalikon",
  "title": "Ferlalíkön í BPMN",
  "sub": "F3 · BPM kafli 3",
  "topics": [
   "bpmn"
  ],
  "exam": "EV1: BPMN-líkan af ferlinu"
 },
 {
  "n": 3,
  "src": "throud-likon",
  "title": "Þróuð ferlalíkön",
  "sub": "F4 · BPM kafli 4",
  "topics": [
   "bpmn2"
  ],
  "exam": "EV1: undirferli, atburðir, skilaboð og frávik"
 },
 {
  "n": 4,
  "src": "uppgotvun",
  "title": "Ferlauppgötvun",
  "sub": "F5 · BPM kafli 5",
  "topics": [
   "uppgotvun"
  ],
  "exam": "EV1 og HÓP1: viðtöl, vinnustofur og atburðaskrár"
 },
 {
  "n": 5,
  "src": "eigindleg",
  "title": "Eigindleg ferlagreining",
  "sub": "F6 · BPM kafli 6",
  "topics": [
   "eigindleg"
  ],
  "exam": "HÓP1: virðisgreining, sóun og rótargreining"
 },
 {
  "n": 6,
  "src": "megindleg",
  "title": "Megindleg ferlagreining",
  "sub": "F7 · BPM kafli 7",
  "topics": [
   "megindleg"
  ],
  "exam": "HÓP1: flæðigreining, biðraðir og hermun"
 },
 {
  "n": 7,
  "src": "endurhonnun",
  "title": "Endurhönnun og ferlahugbúnaður",
  "sub": "F8-F10 · BPM kaflar 8-10",
  "topics": [
   "endurhonnun"
  ],
  "exam": "HÓP1: to-be líkan og keyranleg ferli"
 },
 {
  "n": 8,
  "src": "kerfishugsun",
  "title": "Kerfishugsun og orsakalykkjur",
  "sub": "F11-F12 · Thinking in Systems",
  "topics": [
   "kerfi"
  ],
  "exam": "HÓP2: orsakalykkjurit (CLD) af íslensku kerfi"
 },
 {
  "n": 9,
  "src": "stjornun",
  "title": "Stjórnun ferla og BPM í starfseminni",
  "sub": "F13-F14 · BPM kaflar 11-12 · gestafyrirlestur",
  "topics": [
   "stjornun"
  ],
  "exam": "EV2 og lokapróf: stjórnun, þroski og menning"
 }
];
window.TK.COURSE = {
 "key": "gfk-ferd-v1",
 "testN": 10,
 "levels": [
  [
   0,
   "Nýnemi"
  ],
  [
   200,
   "Ferlaskrásetjari"
  ],
  [
   450,
   "BPMN-teiknari"
  ],
  [
   750,
   "Ferlaspæjari"
  ],
  [
   1100,
   "Sóunarveiðari"
  ],
  [
   1500,
   "Biðraðameistari"
  ],
  [
   2000,
   "Ferlahönnuður"
  ],
  [
   2600,
   "Kerfishugsuður"
  ],
  [
   3300,
   "Meistari ferla og kerfa"
  ]
 ],
 "finalSub": "Sex hlutar úr öllum köflunum · nýjar spurningar og tölur í hvert skipti",
 "finalOpenText": "Nú er komið að lokaprófi ferðalagsins: sex hlutar úr öllu námsefninu.",
 "finalIntro": "<p><b>Sex hlutar úr öllu námsefninu.</b> Hver hluti hefur nokkra liði sem vega jafnt innan hlutans. Megindlegi hlutinn er reiknidæmi; hinir eru skilnings- og atburðarásarspurningar.</p><p>Alvöru lokaprófið gildir 30 % og nær yfir alla fyrirlestra og öll verkefni. Hafðu <a href=\"formulublad.html\">formúlublaðið</a> og vasareikni við höndina.</p>",
 "finalPlan": [
  {
   "title": "Ferlar, ferlaskráning og BPMN",
   "weight": 20,
   "topics": [
    "ferlar",
    "bpmn",
    "bpmn2"
   ],
   "nNum": 0,
   "nMc": 6
  },
  {
   "title": "Ferlauppgötvun og eigindleg greining",
   "weight": 15,
   "topics": [
    "uppgotvun",
    "eigindleg"
   ],
   "nNum": 0,
   "nMc": 5
  },
  {
   "title": "Megindleg ferlagreining",
   "weight": 20,
   "topics": [
    "megindleg"
   ],
   "nNum": 4,
   "nMc": 1
  },
  {
   "title": "Endurhönnun, ferlahugbúnaður og ferlaframkvæmd",
   "weight": 15,
   "topics": [
    "endurhonnun"
   ],
   "nNum": 0,
   "nMc": 5
  },
  {
   "title": "Kerfishugsun og orsakalykkjur",
   "weight": 15,
   "topics": [
    "kerfi"
   ],
   "nNum": 1,
   "nMc": 4
  },
  {
   "title": "Stjórnun ferla og BPM í starfseminni",
   "weight": 15,
   "topics": [
    "stjornun"
   ],
   "nNum": 0,
   "nMc": 5
  }
 ],
 "rewardTitle": "Lokaupprifjunin",
 "rewardHref": "upprifjun.html",
 "rewardLabel": "Lokaupprifjun: ritgerðarspurningar og munnlega prófið",
 "rewardLocked": "Ritgerðarspurningar með svörum, undirbúningur fyrir munnlega prófið og ótakmörkuð ný lokapróf. Opnast þegar þú nærð lokaprófi ferðalagsins.",
 "rewardWon": "Lokaupprifjunin er opin: ritgerðarspurningar með svörum, undirbúningur fyrir munnlega prófið og ótakmörkuð ný lokapróf.",
 "rewardLinks": [
  [
   "upprifjun.html",
   "Ritgerðarspurningar með svörum"
  ],
  [
   "upprifjun.html#munnlegt",
   "Munnlega prófið"
  ],
  [
   "lokaprof-aefing.html",
   "Ný æfingalokapróf"
  ]
 ]
};
window.TK.PASS = 6.0;
window.TK.PRACTICE_GOAL = 5;

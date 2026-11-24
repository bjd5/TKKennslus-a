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
 "finalMinutes": 180,
 "finalSub": "Um 80 spurningar á 3 klst. eins og alvöru prófið · nýjar spurningar og tölur í hvert skipti",
 "finalOpenText": "Nú er komið að lokaprófi ferðalagsins: um 80 spurningar á 3 klst. í sama sniði og alvöru prófið.",
 "finalIntro": "<p><b>Um 80 spurningar á 3 klst.</b> Eins og alvöru prófið í Inspera: val, rétt/rangt, fjölsvar, pörun og drag-and-drop, auk fárra einfaldra útreikninga. Engar ritgerðarspurningar. Hver spurning gildir jafnt og ekki er dregið niður fyrir röng svör, svo svaraðu öllu.</p><p><b>Engin hjálpargögn</b> eru leyfð á alvöru prófinu, aðeins vasareiknir. Reyndu því að taka þetta próf án formúlublaðs og glósa.</p>",
 "finalPlan": [
  {
   "title": "Ferlar og ferlaskráning",
   "topics": [
    "ferlar"
   ],
   "n": 9,
   "nNum": 1
  },
  {
   "title": "Ferlalíkön í BPMN (grunn og þróuð)",
   "topics": [
    "bpmn",
    "bpmn2"
   ],
   "n": 14,
   "nNum": 0
  },
  {
   "title": "Ferlauppgötvun",
   "topics": [
    "uppgotvun"
   ],
   "n": 7,
   "nNum": 0
  },
  {
   "title": "Eigindleg ferlagreining",
   "topics": [
    "eigindleg"
   ],
   "n": 8,
   "nNum": 0
  },
  {
   "title": "Megindleg ferlagreining",
   "topics": [
    "megindleg"
   ],
   "n": 10,
   "nNum": 4
  },
  {
   "title": "Endurhönnun, ferlahugbúnaður og ferlaframkvæmd",
   "topics": [
    "endurhonnun"
   ],
   "n": 10,
   "nNum": 0
  },
  {
   "title": "Stjórnun ferla, BPM í starfseminni og stafrænt vinnuafl",
   "topics": [
    "stjornun"
   ],
   "n": 10,
   "nNum": 1
  },
  {
   "title": "Kerfishugsun og orsakalykkjur",
   "topics": [
    "kerfi"
   ],
   "n": 12,
   "nNum": 1
  }
 ],
 "rewardTitle": "Lokaupprifjunin",
 "rewardHref": "upprifjun.html",
 "rewardLabel": "Lokaupprifjun: dýpri spurningar og munnlega prófið",
 "rewardLocked": "Dýpri skýringarspurningar með fyrirmyndarsvörum, undirbúningur fyrir munnlega prófið og ótakmörkuð ný lokapróf. Opnast þegar þú nærð lokaprófi ferðalagsins.",
 "rewardWon": "Lokaupprifjunin er opin: dýpri skýringarspurningar, undirbúningur fyrir munnlega prófið og ótakmörkuð ný lokapróf.",
 "rewardLinks": [
  [
   "upprifjun.html",
   "Dýpri spurningar með svörum"
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

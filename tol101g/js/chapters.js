/* chapters.js – búið til af tools/build.py. Breyttu CHAPTERS og COURSE þar, ekki hér. */
window.TK = window.TK || {};
window.TK.CHAPTERS = [
 {
  "n": 1,
  "src": "forrit",
  "title": "Forrit og reiknirit",
  "sub": "Vika 1 · Liang kafli 1",
  "topics": [
   "forrit"
  ],
  "exam": "Lokapróf: hugtök, uppbygging Java-forrits og villutegundir"
 },
 {
  "n": 2,
  "src": "tolur",
  "title": "Tölur, breytur og segðir",
  "sub": "Vika 2 · Liang kafli 2",
  "topics": [
   "tolur"
  ],
  "exam": "Miðannarpróf 1 og lokapróf: rekja segðir, heiltöludeiling, kastanir"
 },
 {
  "n": 3,
  "src": "skilyrdi",
  "title": "Rökgildi og skilyrði",
  "sub": "Vika 3 · Liang kafli 3",
  "topics": [
   "skilyrdi"
  ],
  "exam": "Miðannarpróf 1 og lokapróf: if/else, switch, rökvirkjar"
 },
 {
  "n": 4,
  "src": "strengir",
  "title": "Stafir og strengir",
  "sub": "Vika 4 · Liang kafli 4",
  "topics": [
   "strengir"
  ],
  "exam": "Miðannarpróf 1 og lokapróf: char-reikningur og String-aðferðir"
 },
 {
  "n": 5,
  "src": "lykkjur",
  "title": "Lykkjur",
  "sub": "Vika 5 · Liang kafli 5",
  "topics": [
   "lykkjur"
  ],
  "exam": "Miðannarpróf 1 og lokapróf: rekja lykkjur og skrifa þær"
 },
 {
  "n": 6,
  "src": "adferdir",
  "title": "Aðferðir",
  "sub": "Vika 6 · Liang kafli 6",
  "topics": [
   "adferdir"
  ],
  "exam": "Miðannarpróf 1 og lokapróf: færibreytur, skilagildi, yfirhleðsla"
 },
 {
  "n": 7,
  "src": "fylki",
  "title": "Fylki",
  "sub": "Vika 7 · Liang kaflar 7 og 8",
  "topics": [
   "fylki"
  ],
  "exam": "Miðannarpróf 1 og lokapróf: fylki, tilvísanir og tvívíð fylki"
 },
 {
  "n": 8,
  "src": "klasar",
  "title": "Klasar og hlutir",
  "sub": "Vika 9 · Liang kafli 9",
  "topics": [
   "klasar"
  ],
  "exam": "Miðannarpróf 2 og lokapróf: smiðir, get/set, static, UNO-spilið"
 },
 {
  "n": 9,
  "src": "tengsl",
  "title": "Tengsl hluta og UML",
  "sub": "Vika 10 · Liang kafli 10",
  "topics": [
   "tengsl"
  ],
  "exam": "Miðannarpróf 2 og lokapróf: UML-klasarit og tilvísanir"
 },
 {
  "n": 10,
  "src": "erfdir",
  "title": "Erfðir og fjölbrigðni",
  "sub": "Vika 11 · Liang kafli 11",
  "topics": [
   "erfdir"
  ],
  "exam": "Miðannarpróf 2 og lokapróf: extends, super, yfirskrifun, fjölbrigðni"
 },
 {
  "n": 11,
  "src": "hrein",
  "title": "Hrein klasar og viðmót",
  "sub": "Vika 12 · Liang kafli 13",
  "topics": [
   "hrein"
  ],
  "exam": "Miðannarpróf 2 og lokapróf: abstract, interface, Comparable"
 },
 {
  "n": 12,
  "src": "undantekningar",
  "title": "Undantekningar og pakkar",
  "sub": "Vikur 12-14 · Liang kafli 12",
  "topics": [
   "undantekningar"
  ],
  "exam": "Lokapróf: try/catch/finally, throw, throws, pakkar og aðgangur"
 }
];
window.TK.COURSE = {
 "key": "tol101g-ferd-v1",
 "testN": 10,
 "levels": [
  [
   0,
   "Hello World"
  ],
  [
   200,
   "Breytusmiður"
  ],
  [
   450,
   "Skilyrðasnillingur"
  ],
  [
   750,
   "Strengjahnýtir"
  ],
  [
   1100,
   "Lykkjumeistari"
  ],
  [
   1500,
   "Aðferðasmiður"
  ],
  [
   2000,
   "Fylkjafræðingur"
  ],
  [
   2600,
   "Hlutahönnuður"
  ],
  [
   3300,
   "Java-meistari"
  ]
 ],
 "finalSub": "Tveir hlutar eins og á lokaprófinu: stefnubundin forritun og hlutbundin forritun",
 "finalOpenText": "Nú er komið að lokaprófi ferðalagsins: allt námsefnið, kaflar 1-13.",
 "finalIntro": "<p><b>Allt námsefnið í sex hlutum.</b> Eins og á alvöru prófinu þarftu að rekja kóða (hvað prentast?) og svara krossaspurningum um hugtök og kóða. Engin hjálpartæki nema eitt A4-blað.</p><p>Á alvöru prófinu skrifarðu líka kóða frá grunni. Það æfir þú í <a href=\"kodaskrif.html\">kóðaskrifunum</a> og í prófherminum sem opnast þegar þú nærð þessu prófi.</p>",
 "finalPlan": [
  {
   "title": "Tölur, segðir og skilyrði",
   "weight": 15,
   "topics": [
    "forrit",
    "tolur",
    "skilyrdi"
   ],
   "nNum": 3,
   "nMc": 3
  },
  {
   "title": "Strengir og lykkjur",
   "weight": 20,
   "topics": [
    "strengir",
    "lykkjur"
   ],
   "nNum": 3,
   "nMc": 3
  },
  {
   "title": "Aðferðir og fylki",
   "weight": 20,
   "topics": [
    "adferdir",
    "fylki"
   ],
   "nNum": 3,
   "nMc": 3
  },
  {
   "title": "Klasar, hlutir og UML",
   "weight": 15,
   "topics": [
    "klasar",
    "tengsl"
   ],
   "nNum": 2,
   "nMc": 4
  },
  {
   "title": "Erfðir, fjölbrigðni og hrein klasar",
   "weight": 20,
   "topics": [
    "erfdir",
    "hrein"
   ],
   "nNum": 3,
   "nMc": 3
  },
  {
   "title": "Undantekningar og pakkar",
   "weight": 10,
   "topics": [
    "undantekningar"
   ],
   "nNum": 2,
   "nMc": 2
  }
 ],
 "rewardTitle": "Prófhermirinn",
 "rewardHref": "profhermir.html",
 "rewardLabel": "Prófhermir: stór kóðaverkefni á prófsniði",
 "rewardLocked": "Stór kóðaverkefni eins og á lokaprófinu (UML í Java, klasar, erfðir og undantekningar) með fyrirmyndarlausnum og matsblaði. Opnast þegar þú nærð lokaprófi ferðalagsins.",
 "rewardWon": "Prófhermirinn er opinn: stór kóðaverkefni á prófsniði með fyrirmyndarlausnum, og ótakmörkuð ný lokapróf.",
 "rewardLinks": [
  [
   "profhermir.html",
   "Prófhermir: stór kóðaverkefni"
  ],
  [
   "lokaprof-aefing.html",
   "Ný æfingalokapróf"
  ]
 ]
};
window.TK.PASS = 6.0;
window.TK.PRACTICE_GOAL = 5;

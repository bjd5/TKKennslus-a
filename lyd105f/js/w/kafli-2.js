/* w/kafli-2.js – gagnvirka skrefið í kafla 2: lestur á summary() og lýsistærðum (vélin er js/gagnvirkt.js). */

(function () {
  "use strict";
  window.TK.lab(2, {
    skills: ["lysandi"],
    tasks: function () {
      return [
        { out: ["p_summary"], type: "pick", tok: "77.00", title: "summary()", q: "Smelltu á <b>miðgildi</b> púls eftir inngrip (<code>seinniPuls</code>).", ex: "<p>Miðgildið (Median) er 77: helmingur mælinganna er undir 77 slögum/mín.</p>" },
        { out: ["p_summary"], type: "num", title: "Fjórðungaspönn", q: "Hver er fjórðungaspönnin (IQR) fyrir <code>fyrriPuls</code>?", a: 16, d: 1, tol: { abs: 0.01 }, r: "80 - 64\nIQR(puls$fyrriPuls, na.rm = TRUE)", ex: "<p>IQR = 3rd Qu. − 1st Qu. = 80 − 64 = 16.</p>" },
        { out: ["p_summary"], type: "num", title: "Útlagamörk", q: "Hvar eru efri útlagamörkin í kassariti af <code>fyrriPuls</code> (Q3 + 1.5·IQR)?", a: 104, d: 1, tol: { abs: 0.01 }, r: "80 + 1.5 * (80 - 64)", ex: "<p>80 + 1.5·16 = 104. Hámarkið 120 er því útlagi og birtist sem punktur í kassaritinu.</p>" },
        { out: ["p_summary"], type: "pick", tok: "25.000", title: "summary()", q: "Smelltu á hæsta gildið á <code>likamsraekt</code>. Er það trúverðugt?", ex: "<p>25 klst. á viku er hátt en mögulegt. Það er langt frá 3rd Qu. = 6, svo það er útlagi sem togar meðaltalið (4.49) upp fyrir miðgildið (4).</p>" },
        { out: ["p_summary"], type: "mc", title: "Skekkja", q: "Hvaða breyta virðist mest <b>hægri-skekkt</b> samkvæmt úttakinu?", opts: ["<code>aldur</code>: meðaltal 24.24, miðgildi 22 og hámark 70", "<code>fyrriPuls</code>: meðaltal 71.98 og miðgildi 71.50", "Engin, því öll meðaltöl eru nálægt miðgildum", "Það er ekki hægt að sjá skekkju í summary()"], a: 0,
          ex: "<p>Flestir eru 20–25 ára en örfáir eldri nemendur toga meðaltalið og hámarkið langt upp. fyrriPuls er nánast samhverfur. Seinni púls og líkamsrækt eru líka hægri-skekkt.</p>" }
      ];
    }
  });
})();

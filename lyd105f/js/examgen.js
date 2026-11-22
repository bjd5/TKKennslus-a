/* examgen.js – býr til lokapróf ferðalagsins úr spurningabankanum (js/bank.js og js/q/*.js).
 * Prófið fylgir TK.COURSE.finalPlan í js/chapters.js: hver hluti dregur reiknidæmi og
 * skilningsspurningar úr sínum efnisflokkum. Nýjar spurningar og nýjar tölur í hvert skipti.
 *
 * TK.examgen(uid) -> { questions: [{ n, weight, title, html, parts }] }
 * part: { label, kind: "num", text, answer, unit, tol, absTol?, sol }
 *    eða { label, kind: "mc", text, o: [rétt, rangt, ...], c: 0, e } */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  var L = function (i) { return "(" + "abcdefghij"[i] + ")"; };

  TK.examgen = function () {
    var B = TK.bank, plan = (TK.COURSE && TK.COURSE.finalPlan) || [];
    var used = {};
    var questions = plan.map(function (sec, si) {
      var has = function (t) { return sec.topics.indexOf(t) !== -1; };
      var gens = B.shuffle(B.G.filter(function (g) { return has(g.topic || (g.topic = g().topic)); }));
      var mcs = B.shuffle(B.MC.filter(function (m) { return has(m.topic) && !used[m.q]; }));
      var parts = [];
      for (var i = 0; i < (sec.nNum || 0) && gens.length; i++) {
        var d = gens[i % gens.length]();
        parts.push({ kind: "num", text: "<b>" + d.title + ".</b> " + d.text, answer: d.answer, unit: d.unit, tol: d.tol, absTol: d.absTol, sol: d.sol });
      }
      for (var j = 0; j < (sec.nMc || 0) && j < mcs.length; j++) {
        var m = mcs[j];
        used[m.q] = true;
        parts.push({ kind: "mc", text: m.q, o: m.o, c: m.c, e: m.e });
      }
      parts.forEach(function (p, k) { p.label = L(k); });
      return { n: si + 1, weight: sec.weight, title: sec.title, html: sec.intro ? "<p>" + sec.intro + "</p>" : "", parts: parts };
    });
    return { questions: questions };
  };
})();

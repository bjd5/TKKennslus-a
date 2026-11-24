/* examgen.js – býr til lokapróf ferðalagsins úr spurningabankanum (js/bank.js og js/q/*.js).
 * Sniðið fylgir alvöru lokaprófinu: um 80 spurningar, allar af gerðunum val, rétt/rangt, fjölsvar, pörun og
 * flokkun (drag-and-drop), auk fárra einfaldra útreikninga. Efnið skiptist eftir TK.COURSE.finalPlan
 * (BPM-efni vegur þyngra en kerfishugsun). Nýjar spurningar og nýjar tölur í hvert skipti.
 *
 * TK.examgen() -> { questions: [{ n, title, first, parts }] }   (questions eru hlutar prófsins)
 * part: sjá js/qui.js (toPart). */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});
  // Líkur á hverri gerð þegar spurning er dregin (ef til er í efninu)
  var MIX = { mc: 0.36, tf: 0.24, multi: 0.16, match: 0.1, drag: 0.14 };

  function wpick(weights) {
    var tot = 0, k;
    for (k in weights) tot += weights[k];
    var r = Math.random() * tot;
    for (k in weights) { r -= weights[k]; if (r <= 0) return k; }
    return Object.keys(weights)[0];
  }

  TK.examgen = function () {
    var B = TK.bank, plan = (TK.COURSE && TK.COURSE.finalPlan) || [];
    var used = {}, first = 1;
    var questions = plan.map(function (sec, si) {
      var has = function (t) { return sec.topics.indexOf(t) !== -1; };
      var gens = B.shuffle(B.G.filter(function (g) { return has(g.topic || (g.topic = g().topic)); }));
      var byKind = {};
      B.shuffle(B.MC.filter(function (m) { return has(m.topic) && !used[m.q]; })).forEach(function (m) {
        var k = m.kind || "mc";
        (byKind[k] = byKind[k] || []).push(m);
      });
      var parts = [];
      for (var i = 0; i < (sec.nNum || 0) && gens.length; i++) {
        var d = gens[i % gens.length]();
        parts.push(TK.qui.toPart({ kind: "num" }, "Útreikningur"));
        var p = parts[parts.length - 1];
        p.kind = "num"; p.text = "<b>" + d.title + ".</b> " + d.text; p.answer = d.answer; p.unit = d.unit; p.tol = d.tol; p.absTol = d.absTol; p.sol = d.sol;
      }
      var want = sec.n - parts.length;
      while (want > 0) {
        var avail = {};
        Object.keys(MIX).forEach(function (k) { if (byKind[k] && byKind[k].length) avail[k] = MIX[k]; });
        if (!Object.keys(avail).length) break;
        var m = byKind[wpick(avail)].shift();
        used[m.q] = true;
        parts.push(TK.qui.toPart(m));
        want--;
      }
      B.shuffle(parts);
      var q = { n: si + 1, title: sec.title, first: first, parts: parts };
      first += parts.length;
      return q;
    });
    return { questions: questions };
  };
})();

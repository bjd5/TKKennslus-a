/* bank.js – kjarni spurningabankans: hjálparföll, efnisflokkar og einkunnagjöf.
 * Spurningarnar sjálfar eru í js/q/<efni>.js og bæta sér við hér með
 *   TK.bank.G.push(function nafn() { return { topic, title, text, answer, unit, tol, absTol?, sol }; })
 *   TK.bank.MC.push({ topic, q, o: [rétt, rangt, ...], c: 0, e: "skýring" }, ...)
 * Í MC er rétta svarið alltaf fyrst í o (c: 0); viðmótið stokkar röðinni.
 * Notaður af frjálsu æfingunum (quiz.js), köflunum og lokaprófinu (journey.js, examgen.js). */
(function () {
  "use strict";

  /* ---------- Hjálparföll ---------- */
  var rnd = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  var round = function (x, d) { var m = Math.pow(10, d); return Math.round(x * m) / m; };
  /** Tala með íslenskri kommu og sig marktækum stöfum. */
  var is = function (x, sig) {
    var v = Number(Number(x).toPrecision(sig || 3));
    var s = v !== 0 && (Math.abs(v) < 1e-3 || Math.abs(v) >= 1e6) ? v.toExponential((sig || 3) - 1) : String(v);
    return s.replace(".", ",");
  };
  var tx = function (x, sig) { return is(x, sig).replace(",", "{,}"); }; // tala inni í KaTeX
  var shuffle = function (a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };

  var G = [];   // reiknidæmi (föll sem skila nýju dæmi í hvert sinn)
  var MC = [];  // skilningsspurningar

  function parseAnswer(str) {
    var s = String(str).replace(/\s+/g, " ").replace(/−/g, "-").replace(/%/g, "").trim();
    var m = s.match(/^([+-]?\d*[.,]?\d+(?:[eE][+-]?\d+)?)(?:\s*\/\s*([+-]?\d*[.,]?\d+))?/);
    if (!m) return NaN;
    var a = parseFloat(m[1].replace(",", "."));
    if (m[2]) a = a / parseFloat(m[2].replace(",", "."));
    return a;
  }

  /** Er tölulegt svar rétt? Skekkjumörk: tol sem hlutfall, absTol sem fast lágmark. */
  function isRight(d, value) {
    var v = typeof value === "number" ? value : parseAnswer(value);
    if (isNaN(v)) return null;
    var tol = Math.max((d.tol || 0.02) * Math.abs(d.answer), d.absTol || 0, 1e-9);
    return Math.abs(v - d.answer) <= tol;
  }

  var TOPICS = [
    { id: "ferlar", label: "Ferlar og ferlaskráning" },
    { id: "bpmn", label: "Ferlalíkön (BPMN)" },
    { id: "bpmn2", label: "Þróuð ferlalíkön" },
    { id: "uppgotvun", label: "Ferlauppgötvun" },
    { id: "eigindleg", label: "Eigindleg greining" },
    { id: "megindleg", label: "Megindleg greining" },
    { id: "endurhonnun", label: "Endurhönnun og ferlahugbúnaður" },
    { id: "kerfi", label: "Kerfishugsun" },
    { id: "stjornun", label: "Stjórnun ferla" },
  ];

  /** Slembispurning úr gefnum efnum. kind: "num", "mc" eða undefined (hvort sem er). */
  function draw(topics, kind) {
    var has = function (t) { return !topics || topics.indexOf(t) !== -1; };
    var gens = G.filter(function (g) { return has(g.topic || (g.topic = g().topic)); });
    var mcs = MC.filter(function (m) { return has(m.topic); });
    if (!kind) kind = gens.length && (!mcs.length || Math.random() < 0.4) ? "num" : "mc";
    if (kind === "num" && !gens.length) kind = "mc";
    if (kind === "mc" && !mcs.length) kind = "num";
    if (kind === "num") return { kind: "num", d: pick(gens)() };
    return { kind: "mc", d: pick(mcs) };
  }

  window.TK = window.TK || {};
  window.TK.bank = { G: G, MC: MC, TOPICS: TOPICS, draw: draw, parseAnswer: parseAnswer, isRight: isRight,
    rnd: rnd, pick: pick, round: round, is: is, tx: tx, shuffle: shuffle };
})();

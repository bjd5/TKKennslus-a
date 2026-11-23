/* bank.js – kjarni spurningabankans: hjálparföll, efnisflokkar og einkunnagjöf.
 * Spurningarnar sjálfar eru í js/q/<efni>.js og bæta sér við hér með
 *   TK.bank.G.push(function nafn() { return { topic, title, text, answer, sol, ... }; })
 *   TK.bank.MC.push({ topic, q, o: [rétt, rangt, ...], c: 0, e: "skýring" }, ...)
 * Í MC er rétta svarið alltaf fyrst í o (c: 0); viðmótið stokkar röðinni.
 *
 * Kóðadæmi (G) eru af tveimur gerðum:
 *  - answer er strengur: nemandinn skrifar nákvæmlega það sem forritið prentar
 *    (bil aftast í línum og auðar línur í lokin skipta ekki máli). alt: fleiri rétt svör.
 *  - answer er tala: tölulegt svar (tol/absTol skekkjumörk).
 * Til að tools/javacheck.js geti keyrt dæmið í alvöru Java skilar dæmið líka
 *   java: { main: "setningar í main", members: "aðferðir og klasar" (valfrjálst) }
 * og þá er prentað úttak forritsins borið saman við answer.
 * Notaður af frjálsu æfingunum (quiz.js), köflunum og lokaprófinu (journey.js, examgen.js). */
(function () {
  "use strict";

  /* ---------- Hjálparföll ---------- */
  var rnd = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  var round = function (x, d) { var m = Math.pow(10, d); return Math.round(x * m) / m; };
  var is = function (x, sig) {
    var v = Number(Number(x).toPrecision(sig || 3));
    var s = v !== 0 && (Math.abs(v) < 1e-3 || Math.abs(v) >= 1e6) ? v.toExponential((sig || 3) - 1) : String(v);
    return s.replace(".", ",");
  };
  var shuffle = function (a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  /** Kóðablokk (Java) sem site.js litar. */
  var code = function (src) { return '<pre class="code"><code class="java">' + esc(src.replace(/^\n+|\s+$/g, "")) + "</code></pre>"; };
  /** Fjarlægir sameiginlegan inndrátt úr margra lína streng. */
  var dedent = function (s) {
    var lines = s.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
    var m = Math.min.apply(null, lines.filter(function (l) { return l.trim(); }).map(function (l) { return l.match(/^ */)[0].length; }));
    return lines.map(function (l) { return l.slice(m); }).join("\n");
  };

  /* ---------- Java-hermun fyrir slembidæmi ---------- */
  // Java-heiltöludeiling og afgangur (stýfir að núlli)
  var idiv = function (a, b) { return Math.trunc(a / b); };
  var imod = function (a, b) { return a % b; };
  // Hvernig Java prentar double (Double.toString) fyrir „venjulegar“ tölur
  var jd = function (x) {
    if (Number.isInteger(x) && Math.abs(x) < 1e7) return x.toFixed(1);
    var s = String(x);
    if (Math.abs(x) >= 1e7 || (Math.abs(x) < 1e-3 && x !== 0)) {
      var e = x.toExponential(); var m = e.split("e");
      var mant = m[0].indexOf(".") === -1 ? m[0] + ".0" : m[0];
      return mant + "E" + String(Number(m[1]));
    }
    return s;
  };

  var G = [];   // kóðadæmi (föll sem skila nýju dæmi í hvert sinn)
  var MC = [];  // skilningsspurningar

  function parseAnswer(str) {
    var s = String(str).replace(/\s+/g, " ").replace(/−/g, "-").trim();
    var m = s.match(/^([+-]?\d*[.,]?\d+(?:[eE][+-]?\d+)?)/);
    return m ? parseFloat(m[1].replace(",", ".")) : NaN;
  }
  /** Staðlar úttak: \r burt, bil aftast í línum burt, auðar línur fremst og aftast burt. */
  function normOut(s) {
    return String(s).replace(/\r/g, "").split("\n").map(function (l) { return l.replace(/\s+$/, ""); }).join("\n").replace(/^\n+|\n+$/g, "");
  }
  function isText(d) { return typeof d.answer === "string"; }

  /** Er svar rétt? null ef ekkert (nothæft) svar. */
  function isRight(d, value) {
    if (isText(d)) {
      var v = normOut(value);
      if (!v) return null;
      var ok = [d.answer].concat(d.alt || []).map(normOut);
      if (d.loose) { v = v.replace(/\s+/g, " "); ok = ok.map(function (o) { return o.replace(/\s+/g, " "); }); }
      return ok.indexOf(v) !== -1;
    }
    var x = typeof value === "number" ? value : parseAnswer(value);
    if (isNaN(x)) return null;
    var tol = Math.max((d.tol || 0) * Math.abs(d.answer), d.absTol || 0, 1e-9);
    return Math.abs(x - d.answer) <= tol;
  }

  /** Innsláttarreitur fyrir svar: textareitur fyrir margra lína úttak, annars lína. */
  function answerInput(id, d) {
    if (isText(d) && (d.multi || d.answer.indexOf("\n") !== -1)) {
      return '<label class="f" for="' + id + '">' + (d.label || "Úttak forritsins (ein lína á hverja línu sem prentast)") + '</label>' +
        '<textarea id="' + id + '" class="out-in" rows="' + Math.min(10, Math.max(3, d.answer.split("\n").length + 1)) + '" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>';
    }
    if (isText(d)) {
      return '<label class="f" for="' + id + '">' + (d.label || "Úttak") + '</label><input id="' + id + '" class="out-in" type="text" spellcheck="false" autocapitalize="off" autocomplete="off">';
    }
    return '<label class="f" for="' + id + '">' + (d.label || "Svar") + (d.unit ? " (" + esc(d.unit) + ")" : "") + '</label><input id="' + id + '" type="text" inputmode="decimal" spellcheck="false" autocomplete="off">';
  }
  /** Rétta svarið til birtingar. */
  function answerHtml(d) {
    if (isText(d)) return '<pre class="out">' + esc(d.answer) + "</pre>";
    return '<span class="ans">' + is(d.answer, 4) + (d.unit ? " " + esc(d.unit) : "") + "</span>";
  }

  var TOPICS = [
    { id: "forrit", label: "Fyrsta forritið" },
    { id: "tolur", label: "Breytur, tölur og inntak" },
    { id: "skilyrdi", label: "if og switch" },
    { id: "strengir", label: "Texti" },
    { id: "lykkjur", label: "Lykkjur" },
    { id: "adferdir", label: "Aðferðir" },
    { id: "fylki", label: "Fylki" },
    { id: "klasar", label: "Klasar og hlutir" },
    { id: "tengsl", label: "Hlutir saman og UML" },
    { id: "erfdir", label: "Erfðir og fjölbrigðni" },
    { id: "hrein", label: "abstract og interface" },
    { id: "undantekningar", label: "Villur (try/catch)" },
  ];

  window.TK = window.TK || {};
  window.TK.bank = { G: G, MC: MC, TOPICS: TOPICS, parseAnswer: parseAnswer, isRight: isRight, normOut: normOut,
    answerInput: answerInput, answerHtml: answerHtml, isText: isText,
    rnd: rnd, pick: pick, round: round, is: is, shuffle: shuffle, esc: esc, code: code, dedent: dedent,
    idiv: idiv, imod: imod, jd: jd };
})();

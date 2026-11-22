/* cards.js – flashcards. Framvinda (kunni / kunni ekki) vistast í localStorage ef það er leyft. */
(function () {
  "use strict";

  /* Spjöldin eru í js/cards/<efni>.js: (window.TK.CARDS = window.TK.CARDS || []).push({ c: efni, q, a }) */
  var CARDS = (window.TK && window.TK.CARDS) || [];
  var CATS = [{ id: "allt", label: "Allt" }].concat(((window.TK && window.TK.bank && window.TK.bank.TOPICS) || []).filter(function (t) {
    return CARDS.some(function (c) { return c.c === t.id; });
  }));
  var CAT_NAME = {};
  CATS.forEach(function (t) { CAT_NAME[t.id] = t.label; });

  var root = document.getElementById("cards");
  if (!root) return;

  var known = window.store.get("tol101g-cards-known", {}); // lykill = spurning, gildi = true/false
  var st = { cat: "allt", onlyUnknown: false, deck: [], i: 0, flipped: false };

  function keyOf(c) { return c.q; }

  function buildDeck(shuffle) {
    var d = CARDS.filter(function (c) {
      if (st.cat !== "allt" && c.c !== st.cat) return false;
      if (st.onlyUnknown && known[keyOf(c)] === true) return false;
      return true;
    });
    if (shuffle) {
      for (var i = d.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = d[i]; d[i] = d[j]; d[j] = t;
      }
    }
    st.deck = d;
    st.i = 0;
    st.flipped = false;
  }

  function countKnown() {
    var n = 0;
    CARDS.forEach(function (c) { if (known[keyOf(c)] === true) n++; });
    return n;
  }

  function frame() {
    var h = '<div class="toolbar"><span class="tl" id="c-tl-cat">Flokkur</span><div class="chips" role="group" aria-labelledby="c-tl-cat">';
    CATS.forEach(function (t) {
      h += '<button type="button" class="chip" data-cat="' + t.id + '" aria-pressed="' + (st.cat === t.id) + '">' + t.label + "</button>";
    });
    h += '</div><span class="tl" id="c-tl-opt">Val</span><div class="chips" role="group" aria-labelledby="c-tl-opt">';
    h += '<button type="button" class="chip" id="c-unknown" aria-pressed="' + st.onlyUnknown + '">Bara þau sem ég kann ekki</button>';
    h += '<button type="button" class="chip" id="c-shuffle">Stokka</button>';
    h += '<button type="button" class="chip" id="c-reset">Núllstilla framvindu</button></div></div>';
    h += '<div class="scorebar" id="c-stat" aria-live="polite"></div>';
    h += '<div class="progress" aria-hidden="true"><i id="c-bar"></i></div>';
    h += '<div class="card-stage" id="c-stage"></div>';
    h += '<div class="row noprint" style="margin-top:0.2rem"><div class="fixed"><button type="button" class="btn ghost" id="c-prev">Fyrra</button></div><div class="fixed"><button type="button" class="btn ghost" id="c-flip">Snúa</button></div><div class="fixed"><button type="button" class="btn" id="c-ok">Kunni</button></div><div class="fixed"><button type="button" class="btn ghost" id="c-no">Kunni ekki</button></div><div class="fixed"><button type="button" class="btn ghost" id="c-next">Næsta</button></div></div>';
    h += '<p class="small" style="color:var(--muted);margin-top:0.8rem">Flýtilyklar: bilslá eða Enter snýr spjaldinu, örvar fara fram og til baka, <b>K</b> merkir „kunni“ og <b>E</b> „kunni ekki“.</p>';
    root.innerHTML = h;

    root.querySelectorAll("[data-cat]").forEach(function (b) {
      b.addEventListener("click", function () { st.cat = b.getAttribute("data-cat"); frame(); buildDeck(true); show(); });
    });
    document.getElementById("c-unknown").addEventListener("click", function () { st.onlyUnknown = !st.onlyUnknown; frame(); buildDeck(true); show(); });
    document.getElementById("c-shuffle").addEventListener("click", function () { buildDeck(true); show(); });
    document.getElementById("c-reset").addEventListener("click", function () { known = {}; window.store.set("tol101g-cards-known", known); frame(); buildDeck(true); show(); });
    document.getElementById("c-prev").addEventListener("click", function () { go(-1); });
    document.getElementById("c-next").addEventListener("click", function () { go(1); });
    document.getElementById("c-flip").addEventListener("click", flip);
    document.getElementById("c-ok").addEventListener("click", function () { mark(true); });
    document.getElementById("c-no").addEventListener("click", function () { mark(false); });
  }
  function show() {
    var stage = document.getElementById("c-stage");
    var stat = document.getElementById("c-stat");
    var bar = document.getElementById("c-bar");
    var total = CARDS.length, k = countKnown();
    bar.style.width = (100 * k / total) + "%";
    if (!st.deck.length) {
      stage.innerHTML = '<div class="panel"><p style="margin:0">' + (st.onlyUnknown ? "Þú kannt öll spjöldin í þessum flokki. Slökktu á „Bara þau sem ég kann ekki“ til að fara yfir þau aftur." : "Engin spjöld í þessum flokki.") + "</p></div>";
      stat.innerHTML = "<span>Kann: <b>" + k + "</b> af " + total + "</span>";
      return;
    }
    var c = st.deck[st.i];
    var isK = known[keyOf(c)];
    stat.innerHTML = "<span>Spjald <b>" + (st.i + 1) + "</b> af " + st.deck.length + "</span><span>Kann: <b>" + k + "</b> af " + total + "</span>" + (isK === true ? "<span>Þetta spjald: kann</span>" : isK === false ? "<span>Þetta spjald: kann ekki</span>" : "");
    var face = st.flipped
      ? '<div class="face back"><div class="cat">Svar</div><div class="a">' + c.a + '</div><div class="hint">Smelltu til að snúa aftur</div></div>'
      : '<div class="face"><div class="cat">' + CAT_NAME[c.c] + '</div><div class="q">' + c.q + '</div><div class="hint">Smelltu til að sjá svarið</div></div>';
    stage.innerHTML = '<button type="button" class="fcard" id="c-card" aria-label="' + (st.flipped ? "Svar. Snúa spjaldi" : "Spurning. Sýna svar") + '">' + face + "</button>";
    document.getElementById("c-card").addEventListener("click", flip);
    window.renderMath(stage);
  }

  function flip() { if (!st.deck.length) return; st.flipped = !st.flipped; show(); }
  function go(d) {
    if (!st.deck.length) return;
    st.i = (st.i + d + st.deck.length) % st.deck.length;
    st.flipped = false;
    show();
  }
  function mark(ok) {
    if (!st.deck.length) return;
    known[keyOf(st.deck[st.i])] = ok;
    window.store.set("tol101g-cards-known", known);
    if (st.onlyUnknown && ok) { // taka út úr bunkanum
      st.deck.splice(st.i, 1);
      if (st.i >= st.deck.length) st.i = 0;
      st.flipped = false;
      show();
    } else go(1);
  }

  document.addEventListener("keydown", function (e) {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === " " || e.key === "Enter") {
      if (e.target && e.target.tagName === "BUTTON" && e.target.id !== "c-card") return; // láta hnappa virka eðlilega
      e.preventDefault(); flip();
    }
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "k" || e.key === "K") mark(true);
    else if (e.key === "e" || e.key === "E") mark(false);
  });

  frame();
  buildDeck(true);
  show();
})();

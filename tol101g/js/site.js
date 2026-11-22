/* site.js – þema, valmynd á síma og stærðfræðibirting (KaTeX). */
(function () {
  "use strict";
  var doc = document.documentElement;

  /* ---------- Java-litun ----------
   * Litar <code class="java"> (og <pre class="code">) sem ekki hafa verið litaðir.
   * Kallað á renderMath eftir hverja birtingu (nafnið er arfur frá hinum vefjunum). */
  var KW = "abstract assert boolean break byte case catch char class continue default do double else enum extends final finally float for if implements import instanceof int interface long native new package private protected public return short static super switch this throw throws try void while var null true false";
  var KWS = {}; KW.split(" ").forEach(function (k) { KWS[k] = 1; });
  var TYPES = { String: 1, Scanner: 1, Math: 1, System: 1, Integer: 1, Double: 1, Character: 1, Object: 1, ArrayList: 1, Exception: 1, Arrays: 1 };
  function escH(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function highlight(src) {
    var re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*")|('(?:\\.|[^'\\\n])+')|(@\w+)|\b(\d+(?:\.\d+)?[dDfFlL]?)\b|\b([A-Za-z_]\w*)\b/g;
    var out = "", last = 0, m;
    while ((m = re.exec(src))) {
      out += escH(src.slice(last, m.index));
      var t = escH(m[0]);
      if (m[1]) out += '<span class="tk-c">' + t + "</span>";
      else if (m[2] || m[3]) out += '<span class="tk-s">' + t + "</span>";
      else if (m[4]) out += '<span class="tk-a">' + t + "</span>";
      else if (m[5]) out += '<span class="tk-n">' + t + "</span>";
      else if (KWS[m[6]]) out += '<span class="tk-k">' + t + "</span>";
      else if (TYPES[m[6]] || /^[A-Z][a-z]\w*$/.test(m[6])) out += '<span class="tk-t">' + t + "</span>";
      else out += t;
      last = re.lastIndex;
    }
    return out + escH(src.slice(last));
  }
  window.highlightJava = highlight;
  window.renderMath = function (el) {
    var root = el || document.body;
    root.querySelectorAll("code.java:not([data-hl]), pre.code > code:not([data-hl])").forEach(function (c) {
      c.setAttribute("data-hl", "");
      c.innerHTML = highlight(c.textContent);
    });
  };

  function currentTheme() {
    var t = doc.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var themeBtns = document.querySelectorAll(".theme-btn");

  function labelThemeBtns() {
    var dark = currentTheme() === "dark";
    for (var i = 0; i < themeBtns.length; i++) {
      themeBtns[i].textContent = dark ? "\u2600 Ljóst" : "\u263E Dökkt";
      themeBtns[i].setAttribute("aria-label", dark ? "Skipta yfir í ljóst þema" : "Skipta yfir í dökkt þema");
    }
  }

  for (var i = 0; i < themeBtns.length; i++) {
    themeBtns[i].addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      doc.setAttribute("data-theme", next);
      try { localStorage.setItem("tk-theme", next); } catch (e) {}
      labelThemeBtns();
      window.dispatchEvent(new Event("themechange"));
    });
  }
  if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", labelThemeBtns);
  labelThemeBtns();

  var mb = document.getElementById("menu-btn");
  var side = document.getElementById("side");
  if (mb && side) {
    mb.addEventListener("click", function () {
      var open = side.classList.toggle("open");
      mb.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Fela og sýna valmyndina á breiðum skjá. Flýtilykill: \ (backslash)
  var hideBtn = document.getElementById("side-hide");
  var showBtn = document.getElementById("side-show");
  function setSide(hidden, focusEl) {
    if (hidden) doc.setAttribute("data-side", "hidden"); else doc.removeAttribute("data-side");
    try { localStorage.setItem("tk-side", hidden ? "hidden" : "shown"); } catch (e) {}
    if (showBtn) showBtn.setAttribute("aria-expanded", hidden ? "false" : "true");
    if (focusEl) focusEl.focus();
    window.dispatchEvent(new Event("resize")); // gröf teiknast aftur í nýrri breidd
  }
  if (hideBtn && showBtn) {
    showBtn.setAttribute("aria-expanded", doc.getAttribute("data-side") === "hidden" ? "false" : "true");
    hideBtn.addEventListener("click", function () { setSide(true, showBtn); });
    showBtn.addEventListener("click", function () { setSide(false, hideBtn); });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "\\" || e.ctrlKey || e.metaKey || e.altKey) return;
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (window.matchMedia && !window.matchMedia("(min-width: 881px)").matches) return;
      e.preventDefault();
      setSide(doc.getAttribute("data-side") !== "hidden");
    });
  }

  window.store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
    },
  };

  window.renderMath(document.body);
})();

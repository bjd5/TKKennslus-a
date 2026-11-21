/* site.js – þema, valmynd á síma og stærðfræðibirting (KaTeX). */
(function () {
  "use strict";
  var doc = document.documentElement;

  window.renderMath = function (el) {
    if (typeof renderMathInElement !== "function") return;
    renderMathInElement(el || document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      throwOnError: false,
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
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

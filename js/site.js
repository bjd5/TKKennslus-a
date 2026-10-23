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

  var tb = document.getElementById("theme-btn");
  if (tb) {
    tb.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      doc.setAttribute("data-theme", next);
      try { localStorage.setItem("tk-theme", next); } catch (e) {}
      window.dispatchEvent(new Event("themechange"));
    });
  }

  var mb = document.getElementById("menu-btn");
  var side = document.getElementById("side");
  if (mb && side) {
    mb.addEventListener("click", function () {
      var open = side.classList.toggle("open");
      mb.setAttribute("aria-expanded", open ? "true" : "false");
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

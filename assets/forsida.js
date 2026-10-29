/* forsida.js – þema og leit í möppunum. Þemað er geymt undir sama lykli og á áfangavefjunum. */
(function () {
  "use strict";
  var doc = document.documentElement;

  function currentTheme() {
    var t = doc.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var btn = document.querySelector(".theme-btn");
  function labelBtn() {
    var dark = currentTheme() === "dark";
    btn.textContent = dark ? "☀ Ljóst" : "☾ Dökkt";
    btn.setAttribute("aria-label", dark ? "Skipta yfir í ljóst þema" : "Skipta yfir í dökkt þema");
  }
  btn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    doc.setAttribute("data-theme", next);
    try { localStorage.setItem("tk-theme", next); } catch (e) {}
    labelBtn();
  });
  if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", labelBtn);
  labelBtn();

  // Telja möppurnar og sýna leit þegar þær eru orðnar nokkrar
  var items = Array.prototype.slice.call(document.querySelectorAll(".folders > li:not(.soon)"));
  var count = document.getElementById("count");
  var search = document.getElementById("search");
  var nohits = document.getElementById("nohits");
  count.textContent = items.length === 1 ? "1 kennsluvefur" : items.length + " kennsluvefir";
  if (items.length < 6) return;

  // „staer“ finnur „Stærðfræði“ og „idn“ finnur „IÐN303G“
  function norm(s) {
    return s.toLowerCase().replace(/æ/g, "ae").replace(/ð/g, "d").replace(/þ/g, "th")
      .normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  var texts = items.map(function (li) { return norm(li.textContent); });
  search.hidden = false;
  search.addEventListener("input", function () {
    var q = norm(search.value.trim()), hits = 0;
    items.forEach(function (li, i) {
      var show = !q || texts[i].indexOf(q) !== -1;
      li.hidden = !show;
      if (show) hits++;
    });
    nohits.hidden = hits > 0;
  });
})();

/* q/megindleg.js – spurningar fyrir kafla 6: Megindleg ferlagreining (F7, BPM kafli 7).
 * Reiknidæmi: flæðigreining (röð, XOR, AND, endursending), CTE, kostnaður, Little,
 * framleiðslugeta og nýting, M/M/1 og M/M/c (Erlang C). */
(function () {
  "use strict";
  var B = window.TK.bank, rnd = B.rnd, pick = B.pick, tx = B.tx, is = B.is;

  /* ---------- Hjálparföll ---------- */
  // Samhengi úr sviðunum í EV1. chk = aðgerð sem getur þurft endursendingu, pa/pb = samhliða,
  // xa/xb = XOR-greinar (xaL = hvaða mál fara í xa), last = lokaaðgerð.
  var CTX = [
    { p: "tjónaferli tryggingafélags", u: "klst", chk: "Yfirfara tjónstilkynningu", loop: "gögn vantar", pa: "Sækja lögregluskýrslu", pb: "Fá mat á viðgerðarkostnaði",
      xa: "Skoðun matsmanns", xaL: "stór tjón", xb: "Einföld afgreiðsla", last: "Greiða bætur" },
    { p: "umsóknarferli um námsstyrk", u: "dagar", chk: "Fara yfir umsókn", loop: "fylgiskjöl vantar", pa: "Staðfesta skólavist", pb: "Sækja tekjuupplýsingar",
      xa: "Mat úthlutunarnefndar", xaL: "umsóknir utan reglna", xb: "Stöðluð afgreiðsla", last: "Tilkynna niðurstöðu" },
    { p: "ferli viðhaldsbeiðna í fasteignafélagi", u: "klst", chk: "Greina beiðni", loop: "lýsingin er ófullnægjandi", pa: "Panta varahlut", pb: "Bóka iðnaðarmann",
      xa: "Viðgerð á staðnum", xaL: "beiðnir sem krefjast heimsóknar", xb: "Leiðbeina í síma", last: "Loka beiðni" },
    { p: "nýskráningu viðskiptavina í banka", u: "mín", chk: "Yfirfara skilríki", loop: "skilríkin eru ógild", pa: "Áreiðanleikakönnun", pb: "Stofna reikning",
      xa: "Handvirk skoðun", xaL: "áhættumál", xb: "Sjálfvirkt samþykki", last: "Senda móttökuskilaboð" },
    { p: "ferli vegna týnds farangurs hjá flugfélagi", u: "klst", chk: "Skrá tilkynningu", loop: "upplýsingar vantar", pa: "Leita í farangurskerfi", pb: "Hafa samband við flugvöll",
      xa: "Senda tösku heim", xaL: "töskur sem finnast", xb: "Greiða bætur", last: "Loka máli" },
    { p: "útflutningsferli á ferskum fiski", u: "klst", chk: "Gæðaskoða afla", loop: "lotan stenst ekki skoðun", pa: "Útbúa útflutningsskjöl", pb: "Pakka og merkja",
      xa: "Senda með flugi", xaL: "hraðsendingar", xb: "Senda með skipi", last: "Afhenda flutningsaðila" },
    { p: "móttökuferli heilsugæslu", u: "mín", chk: "Skrá komu", loop: "upplýsingar eru rangar", pa: "Taka blóðprufu", pb: "Mæla blóðþrýsting",
      xa: "Viðtal við lækni", xaL: "sjúklingar sem þurfa lækni", xb: "Ráðgjöf hjúkrunarfræðings", last: "Útskrift" },
    { p: "pöntunarferli byggingavöruverslunar", u: "klst", chk: "Yfirfara pöntun", loop: "pöntunin er röng", pa: "Taka saman vörur", pb: "Útbúa reikning",
      xa: "Senda með bíl", xaL: "stórar pantanir", xb: "Sótt í verslun", last: "Staðfesta afhendingu" },
  ];
  // tímalengd sem hentar einingunni
  function tv(u) { return u === "mín" ? rnd(3, 30) : u === "dagar" ? rnd(1, 6) : rnd(1, 12) / 2; }
  // texti: tala + eining (íslenskt eintölu-/fleirtöluform fyrir daga)
  function U(x, u) {
    if (u === "dagar") { var n = Math.round(x * 100) / 100; return is(x, 4) + (n % 10 === 1 && n % 100 !== 11 ? " dagur" : " dagar"); }
    return is(x, 4) + " " + u;
  }
  var pct = function (p) { return is(p * 100, 3) + " %"; };
  var b = function (s) { return "<b>" + s + "</b>"; };

  function mm1(lam, mu) {
    var rho = lam / mu, Lq = (rho * rho) / (1 - rho), Wq = Lq / lam, W = Wq + 1 / mu;
    return { rho: rho, Lq: Lq, Wq: Wq, W: W, L: lam * W };
  }
  // M/M/c (formúla 7.13): ρ = λ/(cμ)
  function mmc(lam, mu, c) {
    var a = lam / mu, rho = a / c, sum = 0, t = 1, n;
    for (n = 0; n < c; n++) { if (n > 0) t *= a / n; sum += t; }
    var ac = t * a / c;                    // a^c / c!
    var top = ac / (1 - rho);
    var P0 = 1 / (sum + top);
    var Lq = (ac * rho * P0) / ((1 - rho) * (1 - rho));
    var Wq = Lq / lam, W = Wq + 1 / mu;
    return { a: a, rho: rho, sum: sum, ac: ac, top: top, P0: P0, Pw: top * P0, Lq: Lq, Wq: Wq, W: W, L: lam * W };
  }
  var fact = function (n) { var f = 1; for (var i = 2; i <= n; i++) f *= i; return f; };

  /* =====================================================================
   * Reiknidæmi
   * ===================================================================== */

  // 1. Röð + XOR
  B.G.push(function megCtXor() {
    var c = pick(CTX), u = c.u, T0 = tv(u), T1 = tv(u), T2 = tv(u), T3 = tv(u), p = rnd(2, 8) / 10;
    var ct = T0 + p * T1 + (1 - p) * T2 + T3;
    return { topic: "megindleg", title: "Hringrásartími með XOR-vali", unit: u, tol: 0.02, answer: ct,
      text: "<p>Í " + c.p + " fer hvert mál í gegnum eftirfarandi skref:</p><ol><li>" + b(c.chk) + " (" + U(T0, u) + ").</li><li>XOR-val: " + c.xaL + " (" + pct(p) + ") fara í " + b(c.xa) + " (" + U(T1, u) +
        "), hin (" + pct(1 - p) + ") í " + b(c.xb) + " (" + U(T2, u) + ").</li><li>" + b(c.last) + " (" + U(T3, u) + ").</li></ol><p>Reiknaðu meðal hringrásartímann (CT) eins máls með flæðigreiningu.</p>",
      sol: "<p>Línuleg blokk: leggja saman. Valkvæð blokk (XOR): vegið meðaltal með líkum, $\\sum p_i T_i$.</p>" +
        "$$CT = " + tx(T0) + " + (" + tx(p) + "\\cdot " + tx(T1) + " + " + tx(1 - p) + "\\cdot " + tx(T2) + ") + " + tx(T3) + " = " + tx(T0) + " + " + tx(p * T1 + (1 - p) * T2, 4) + " + " + tx(T3) + " = " + tx(ct, 4) + "\\text{ " + u + "}$$" };
  });

  // 2. Röð + AND
  B.G.push(function megCtAnd() {
    var c = pick(CTX), u = c.u, T0 = tv(u), T1 = tv(u), T2 = tv(u), T3 = tv(u);
    if (T1 === T2) T2 = T2 + (u === "klst" ? 0.5 : 1);
    var ct = T0 + Math.max(T1, T2) + T3;
    return { topic: "megindleg", title: "Hringrásartími með samhliða blokk", unit: u, tol: 0.02, answer: ct,
      text: "<p>Í " + c.p + " er fyrst " + b(c.chk) + " (" + U(T0, u) + "). Síðan opnar AND-hlið tvær samhliða aðgerðir: " + b(c.pa) + " (" + U(T1, u) + ") og " + b(c.pb) + " (" + U(T2, u) +
        "). Þegar báðum er lokið (AND-samruni) er " + b(c.last) + " (" + U(T3, u) + ").</p><p>Hver er hringrásartími ferlisins?</p>",
      sol: "<p>Samhliða blokk (AND): ferlið bíður eftir lengstu greininni, $CT = \\max(T_1, T_2)$. Hinar blokkirnar eru línulegar.</p>" +
        "$$CT = " + tx(T0) + " + \\max(" + tx(T1) + ", " + tx(T2) + ") + " + tx(T3) + " = " + tx(ct, 4) + "\\text{ " + u + "}$$" +
        "<p>Algeng mistök eru að leggja samhliða greinarnar saman. Það á bara við um kostnað og einingaálag, ekki tíma.</p>" };
  });

  // 3. Endursending
  B.G.push(function megCtLoop() {
    var c = pick(CTX), u = c.u, T0 = tv(u), T1 = tv(u), r = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
    var ct = T0 / (1 - r) + T1;
    return { topic: "megindleg", title: "Hringrásartími með endursendingu", unit: u, tol: 0.02, answer: ct,
      text: "<p>Í " + c.p + " tekur " + b(c.chk) + " að meðaltali " + U(T0, u) + ". Í " + pct(r) + " tilvika kemur í ljós að " + c.loop + " og aðgerðin er endurtekin (endursending, e. rework). " +
        "Síðan kemur " + b(c.last) + " (" + U(T1, u) + ").</p><p>Hver er meðal hringrásartíminn?</p>",
      sol: "<p>Endursendingarblokk: $CT = \\dfrac{T}{1-r}$, því að meðaltali er aðgerðin unnin $1/(1-r)$ sinnum.</p>" +
        "$$CT = \\frac{" + tx(T0) + "}{1-" + tx(r) + "} + " + tx(T1) + " = " + tx(T0 / (1 - r), 4) + " + " + tx(T1) + " = " + tx(ct, 4) + "\\text{ " + u + "}$$" };
  });

  // 4. Samsett ferli eins og á glæru 7
  B.G.push(function megCtComposite() {
    var c = pick(CTX), u = c.u, T0 = tv(u), T1 = tv(u), T2 = tv(u), T3 = tv(u), T4 = tv(u), T5 = tv(u);
    var r = pick([0.1, 0.2, 0.25, 0.3]), p = rnd(2, 8) / 10;
    var a = T0 / (1 - r), m = Math.max(T1, T2), x = p * T4 + (1 - p) * T5, ct = a + m + T3 + x;
    return { topic: "megindleg", title: "Flæðigreining á samsettu ferli", unit: u, tol: 0.02, answer: ct,
      text: "<p>Í " + c.p + " eru eftirfarandi skref:</p><ol><li>" + b(c.chk) + " (" + U(T0, u) + "). Í " + pct(r) + " tilvika kemur í ljós að " + c.loop + " og aðgerðin er endurtekin.</li>" +
        "<li>Samhliða (AND): " + b(c.pa) + " (" + U(T1, u) + ") og " + b(c.pb) + " (" + U(T2, u) + ").</li><li>" + b("Meta málið") + " (" + U(T3, u) + ").</li>" +
        "<li>XOR: " + c.xaL + " (" + pct(p) + ") fara í " + b(c.xa) + " (" + U(T4, u) + "), hin í " + b(c.xb) + " (" + U(T5, u) + ").</li></ol><p>Reiknaðu hringrásartímann (CT).</p>",
      sol: "<p>Skiptu ferlinu í blokkir og leggðu saman (eins og dæmið á glæru 7):</p><ul>" +
        "<li>Endursending: $\\dfrac{" + tx(T0) + "}{1-" + tx(r) + "} = " + tx(a, 4) + "$</li>" +
        "<li>Samhliða: $\\max(" + tx(T1) + ", " + tx(T2) + ") = " + tx(m) + "$</li>" +
        "<li>Línuleg: $" + tx(T3) + "$</li>" +
        "<li>Valkvæð: $" + tx(p) + "\\cdot " + tx(T4) + " + " + tx(1 - p) + "\\cdot " + tx(T5) + " = " + tx(x, 4) + "$</li></ul>" +
        "$$CT = " + tx(a, 4) + " + " + tx(m) + " + " + tx(T3) + " + " + tx(x, 4) + " = " + tx(ct, 4) + "\\text{ " + u + "}$$" };
  });

  // 5. CTE
  B.G.push(function megCte() {
    var c = pick(CTX);
    // vinnslutímar í klst, biðtímar í klst
    var v0 = rnd(1, 6) / 2, w0 = rnd(2, 16), v1 = rnd(2, 8) / 2, w1 = rnd(4, 24), v2 = rnd(1, 4) / 2, w2 = rnd(1, 8), v3 = rnd(1, 4) / 2, w3 = rnd(2, 12), p = rnd(2, 8) / 10;
    var tct = v0 + p * v1 + (1 - p) * v2 + v3;
    var ct = (v0 + w0) + p * (v1 + w1) + (1 - p) * (v2 + w2) + (v3 + w3);
    var cte = 100 * tct / ct;
    var row = function (n, v, w) { return "<tr><td>" + n + "</td><td>" + is(v) + "</td><td>" + is(w) + "</td></tr>"; };
    return { topic: "megindleg", title: "Nýtni ferils (CTE)", unit: "%", tol: 0.02, answer: cte,
      text: "<p>Í " + c.p + " er fyrst " + b(c.chk) + ", síðan XOR-val þar sem " + pct(p) + " mála fara í " + b(c.xa) + " en hin í " + b(c.xb) + ", og loks " + b(c.last) + ". Biðtíminn er bið málsins á undan aðgerðinni.</p>" +
        '<div class="tablewrap"><table><thead><tr><th>Aðgerð</th><th>Vinnslutími (klst)</th><th>Biðtími (klst)</th></tr></thead><tbody>' +
        row(c.chk, v0, w0) + row(c.xa, v1, w1) + row(c.xb, v2, w2) + row(c.last, v3, w3) + "</tbody></table></div><p>Hver er nýtni ferilsins, $CTE = TCT/CT$, í %?</p>",
      sol: "<p>Fræðilegur hringrásartími $TCT$ notar bara vinnslutímana; $CT$ notar vinnslutíma + biðtíma. Sömu blokkareglur gilda (XOR = vegið meðaltal).</p>" +
        "$$TCT = " + tx(v0) + " + " + tx(p) + "\\cdot " + tx(v1) + " + " + tx(1 - p) + "\\cdot " + tx(v2) + " + " + tx(v3) + " = " + tx(tct, 4) + "\\text{ klst}$$" +
        "$$CT = " + tx(v0 + w0) + " + " + tx(p) + "\\cdot " + tx(v1 + w1) + " + " + tx(1 - p) + "\\cdot " + tx(v2 + w2) + " + " + tx(v3 + w3) + " = " + tx(ct, 4) + "\\text{ klst}$$" +
        "$$CTE = \\frac{" + tx(tct, 4) + "}{" + tx(ct, 4) + "} = " + tx(cte / 100, 3) + " = " + tx(cte, 3) + "\\,\\%$$<p>Mestur hluti hringrásartímans er bið, sem er dæmigert (glæra 8).</p>" };
  });

  // 6. Kostnaður með flæðigreiningu
  B.G.push(function megCost() {
    var c = pick(CTX), k0 = rnd(4, 30) * 100, k1 = rnd(4, 40) * 100, k2 = rnd(4, 40) * 100, k3 = rnd(10, 80) * 100, k4 = rnd(2, 20) * 100, k5 = rnd(4, 30) * 100;
    var r = pick([0.1, 0.2, 0.25, 0.3]), p = rnd(2, 8) / 10;
    var a = k0 / (1 - r), s = k1 + k2, x = p * k3 + (1 - p) * k4, cost = a + s + x + k5;
    var kr = function (v) { return is(v, 6) + " kr."; };
    return { topic: "megindleg", title: "Kostnaður ferlis með flæðigreiningu", unit: "kr.", tol: 0.02, answer: cost,
      text: "<p>Kostnaður hverrar aðgerðar í " + c.p + " er:</p><ol><li>" + b(c.chk) + ": " + kr(k0) + ". Í " + pct(r) + " tilvika er aðgerðin endurtekin.</li>" +
        "<li>Samhliða (AND): " + b(c.pa) + " (" + kr(k1) + ") og " + b(c.pb) + " (" + kr(k2) + ").</li>" +
        "<li>XOR: " + pct(p) + " mála fara í " + b(c.xa) + " (" + kr(k3) + "), hin í " + b(c.xb) + " (" + kr(k4) + ").</li><li>" + b(c.last) + ": " + kr(k5) + ".</li></ol>" +
        "<p>Hver er meðalkostnaður á hvert mál (instance)?</p>",
      sol: "<p>Sömu blokkareglur og fyrir tíma, <b>nema samhliða blokk: þar er lagt saman</b>, því báðar aðgerðirnar eru unnar og greiddar (glæra 20).</p><ul>" +
        "<li>Endursending: $\\dfrac{" + tx(k0, 6) + "}{1-" + tx(r) + "} = " + tx(a, 6) + "$</li>" +
        "<li>Samhliða: $" + tx(k1, 6) + " + " + tx(k2, 6) + " = " + tx(s, 6) + "$</li>" +
        "<li>Valkvæð: $" + tx(p) + "\\cdot " + tx(k3, 6) + " + " + tx(1 - p) + "\\cdot " + tx(k4, 6) + " = " + tx(x, 6) + "$</li>" +
        "<li>Línuleg: $" + tx(k5, 6) + "$</li></ul>$$\\text{Kostnaður} = " + tx(cost, 6) + "\\text{ kr. á mál}$$" };
  });

  // 7. Kostnaður út frá tímakaupi
  B.G.push(function megCostRate() {
    var c = pick(CTX), w1 = rnd(5, 9) * 1000, w2 = rnd(10, 16) * 1000, t0 = rnd(2, 8) * 5, t1 = rnd(3, 12) * 5, t2 = rnd(1, 4) * 5, t3 = rnd(1, 4) * 5, p = rnd(2, 6) / 10;
    var c0 = w1 * t0 / 60, c1 = w2 * t1 / 60, c2 = w1 * t2 / 60, c3 = w1 * t3 / 60;
    var cost = c0 + p * c1 + (1 - p) * c2 + c3;
    return { topic: "megindleg", title: "Kostnaður út frá vinnutíma og tímakaupi", unit: "kr.", tol: 0.02, answer: cost,
      text: "<p>Í " + c.p + " kostar almennur starfsmaður " + is(w1, 6) + " kr./klst og sérfræðingur " + is(w2, 6) + " kr./klst.</p><ol>" +
        "<li>" + b(c.chk) + ": starfsmaður, " + t0 + " mín.</li><li>XOR: " + c.xaL + " (" + pct(p) + ") fara í " + b(c.xa) + " hjá sérfræðingi, " + t1 + " mín; hin í " + b(c.xb) + " hjá starfsmanni, " + t2 + " mín.</li>" +
        "<li>" + b(c.last) + ": starfsmaður, " + t3 + " mín.</li></ol><p>Hver er meðal launakostnaður á hvert mál?</p>",
      sol: "<p>Kostnaður aðgerðar = vinnslutími × tímakaup auðlindarinnar. Svo flæðigreining með kostnaði (XOR = vegið meðaltal).</p><ul>" +
        "<li>$" + t0 + "/60 \\cdot " + tx(w1, 6) + " = " + tx(c0, 5) + "$ kr.</li><li>$" + t1 + "/60 \\cdot " + tx(w2, 6) + " = " + tx(c1, 5) + "$ kr.</li>" +
        "<li>$" + t2 + "/60 \\cdot " + tx(w1, 6) + " = " + tx(c2, 5) + "$ kr.</li><li>$" + t3 + "/60 \\cdot " + tx(w1, 6) + " = " + tx(c3, 5) + "$ kr.</li></ul>" +
        "$$" + tx(c0, 5) + " + " + tx(p) + "\\cdot " + tx(c1, 5) + " + " + tx(1 - p) + "\\cdot " + tx(c2, 5) + " + " + tx(c3, 5) + " = " + tx(cost, 5) + "\\text{ kr.}$$" };
  });

  // 8. Little: WIP (með einingabreytingu)
  B.G.push(function megLittleWip() {
    var c = pick(CTX), lam = rnd(6, 40), ctm = rnd(4, 24) * 5, wip = lam * ctm / 60;
    return { topic: "megindleg", title: "Lögmál Little: verk í vinnslu", unit: "mál", tol: 0.02, answer: wip,
      text: "<p>Í " + c.p + " berast að meðaltali $\\lambda = " + lam + "$ mál á klukkustund og hvert mál er að meðaltali $" + ctm + "$ mínútur í ferlinu. Ferlið er stöðugt.</p><p>Hve mörg mál eru að meðaltali í vinnslu (WIP) á hverjum tíma?</p>",
      sol: "<p>Lögmál Little: $WIP = \\lambda \\cdot CT$. Hafðu sömu tímaeiningu: $CT = " + ctm + "/60 = " + tx(ctm / 60, 4) + "$ klst.</p>" +
        "$$WIP = " + lam + "\\cdot " + tx(ctm / 60, 4) + " = " + tx(wip, 4) + "\\text{ mál}$$" };
  });

  // 9. Little: CT (veitingastaðurinn, æfing 7.5)
  B.G.push(function megLittleCt() {
    var h = pick([3, 4, 5, 6]), lamh = rnd(2, 15) * 12, N = lamh * h, ct = rnd(2, 12) * 5, wip = lamh * ct / 60;
    var place = pick(["Veitingastaður", "Mötuneyti", "Sundlaug", "Heilsugæsla", "Afgreiðsla bílaleigu"]);
    return { topic: "megindleg", title: "Lögmál Little: tími í kerfinu", unit: "mín", tol: 0.02, answer: ct,
      text: "<p>" + place + " fær " + N + " viðskiptavini á " + h + " klukkustunda álagstíma. Að meðaltali eru " + is(wip, 4) + " viðskiptavinir inni á hverjum tíma.</p><p>Hve margar mínútur er hver viðskiptavinur að meðaltali á staðnum (CT)?</p>",
      sol: "<p>Eins og í æfingu 7.5: $CT = WIP/\\lambda$. Komutaktur: $\\lambda = " + N + "/" + h + " = " + lamh + "$ á klst.</p>" +
        "$$CT = \\frac{" + tx(wip, 4) + "}{" + lamh + "} = " + tx(ct / 60, 4) + "\\text{ klst} = " + ct + "\\text{ mín}$$" };
  });

  // 10. Little: λ
  B.G.push(function megLittleLambda() {
    var c = pick(CTX), ct = rnd(2, 15), lam = rnd(3, 25), wip = lam * ct;
    return { topic: "megindleg", title: "Lögmál Little: komutaktur", unit: "mál/dag", tol: 0.02, answer: lam,
      text: "<p>Talning sýnir að í " + c.p + " eru að jafnaði " + wip + " opin mál (WIP) og meðal hringrásartími er " + ct + " dagar. Ferlið er stöðugt.</p><p>Hver er komutakturinn $\\lambda$ (mál á dag)?</p>",
      sol: "$$\\lambda = \\frac{WIP}{CT} = \\frac{" + wip + "}{" + ct + "} = " + lam + "\\text{ mál á dag}$$<p>Í stöðugu ferli er komutaktur jafn brottfarartakti (afköstum).</p>" };
  });

  // 11. Fræðileg framleiðslugeta auðlindahóps
  B.G.push(function megCapacity() {
    var c = pick(CTX), t0 = rnd(2, 8) / 2, r = pick([0.1, 0.2, 0.25]), t1 = rnd(1, 8) / 2, t2 = rnd(1, 4) / 2, n = rnd(2, 6), h = pick([7, 7.5, 8]);
    var ul = t0 / (1 - r) + t1 + t2, uc = n * h, mu = uc / ul;
    return { topic: "megindleg", title: "Fræðileg framleiðslugeta", unit: "mál/dag", tol: 0.02, answer: mu,
      text: "<p>Í " + c.p + " sinnir auðlindahópur " + n + " starfsmanna þremur aðgerðum á hverju máli: " + b(c.chk) + " (" + is(t0) + " klst, endurtekin í " + pct(r) + " tilvika), og síðan samhliða " +
        b(c.pa) + " (" + is(t1) + " klst) og " + b(c.pb) + " (" + is(t2) + " klst). Hver starfsmaður vinnur " + is(h) + " klst á dag.</p><p>Hver er fræðileg framleiðslugeta hópsins, $\\mu_p$, í málum á dag?</p>",
      sol: "<p>Einingaálag $ul$: sömu reglur og fyrir CT, en <b>samhliða blokk er lögð saman</b> því sami hópurinn vinnur báðar aðgerðirnar (glæra 15).</p>" +
        "$$ul = \\frac{" + tx(t0) + "}{1-" + tx(r) + "} + " + tx(t1) + " + " + tx(t2) + " = " + tx(ul, 4) + "\\text{ klst á mál}$$" +
        "$$uc = " + n + "\\cdot " + tx(h) + " = " + tx(uc) + "\\text{ klst á dag},\\qquad \\mu_p = \\frac{uc}{ul} = \\frac{" + tx(uc) + "}{" + tx(ul, 4) + "} = " + tx(mu, 4) + "\\text{ mál á dag}$$" };
  });

  // 12. Flöskuháls: framleiðslugeta ferlisins (tveir hópar, eins og glæra 17)
  B.G.push(function megBottleneck() {
    var t0 = rnd(2, 6) / 2, r = pick([0.1, 0.2, 0.25]), t1 = rnd(1, 4) / 2, t2 = rnd(2, 8) / 2;
    var s0 = rnd(2, 6) / 2, s1 = rnd(2, 6) / 2, s2 = rnd(1, 2) / 2, p = rnd(4, 8) / 10, n1 = rnd(2, 5), n2 = rnd(1, 3), h = 8;
    var ul1 = t0 / (1 - r) + t1 + t2, ul2 = s0 + p * s1 + (1 - p) * s2, mu1 = n1 * h / ul1, mu2 = n2 * h / ul2, mu = Math.min(mu1, mu2);
    if (Math.abs(mu1 - mu2) < 0.05) { n2 = n2 + 1; mu2 = n2 * h / ul2; mu = Math.min(mu1, mu2); }
    return { topic: "megindleg", title: "Flöskuháls og framleiðslugeta ferlis", unit: "mál/dag", tol: 0.02, answer: mu,
      text: "<p>Lánsumsóknir (eins og á glæru 17). " + b("Fulltrúar") + " (" + n1 + " manns): yfirfara umsókn " + is(t0) + " klst (endurtekið í " + pct(r) + " tilvika), og síðan samhliða athuga lánasögu " + is(t1) +
        " klst og athuga tekjur " + is(t2) + " klst. " + b("Lánafulltrúar") + " (" + n2 + "): meta umsókn " + is(s0) + " klst; " + pct(p) + " fá lánstilboð (" + is(s1) + " klst), hinum er hafnað (" + is(s2) + " klst). Allir vinna 8 klst á dag.</p>" +
        "<p>Hver er fræðileg framleiðslugeta ferlisins í heild (umsóknir á dag)?</p>",
      sol: "<p>Reiknaðu $\\mu_p = uc/ul$ fyrir hvorn hóp; ferlið afkastar ekki meira en hópurinn með <b>minnstu</b> getuna (flöskuhálsinn).</p>" +
        "$$ul_F = \\frac{" + tx(t0) + "}{1-" + tx(r) + "} + " + tx(t1) + " + " + tx(t2) + " = " + tx(ul1, 4) + ",\\quad \\mu_F = \\frac{" + n1 + "\\cdot 8}{" + tx(ul1, 4) + "} = " + tx(mu1, 4) + "$$" +
        "$$ul_L = " + tx(s0) + " + " + tx(p) + "\\cdot " + tx(s1) + " + " + tx(1 - p) + "\\cdot " + tx(s2) + " = " + tx(ul2, 4) + ",\\quad \\mu_L = \\frac{" + n2 + "\\cdot 8}{" + tx(ul2, 4) + "} = " + tx(mu2, 4) + "$$" +
        "<p>Flöskuhálsinn er " + (mu1 < mu2 ? "fulltrúarnir" : "lánafulltrúarnir") + ": $\\mu_p = " + tx(mu, 4) + "$ umsóknir á dag.</p>" };
  });

  // 13. Nýting auðlinda
  B.G.push(function megUtil() {
    var c = pick(CTX), ul = rnd(3, 12) / 2, n = rnd(2, 8), h = 8, mu = n * h / ul, lam = Math.max(1, Math.floor(mu * (0.5 + Math.random() * 0.45)));
    var rho = lam / mu;
    return { topic: "megindleg", title: "Nýting auðlinda", unit: "%", tol: 0.02, answer: 100 * rho,
      text: "<p>Í " + c.p + " er einingaálag starfsmannahópsins $ul = " + tx(ul) + "$ klst á mál. Í hópnum eru " + n + " starfsmenn sem vinna 8 klst á dag, og að meðaltali berast " + lam + " mál á dag.</p><p>Hver er nýting hópsins, $\\rho_p$, í %?</p>",
      sol: "$$\\mu_p = \\frac{uc}{ul} = \\frac{" + n + "\\cdot 8}{" + tx(ul) + "} = " + tx(mu, 4) + "\\text{ mál á dag}$$$$\\rho_p = \\frac{\\lambda}{\\mu_p} = \\frac{" + lam + "}{" + tx(mu, 4) + "} = " + tx(rho, 3) + " = " + tx(100 * rho, 3) + "\\,\\%$$" +
        "<p>Ef $\\rho_p \\geq 1$ er ferlið óstöðugt: biðröðin vex án takmarka og lögmál Little gildir ekki.</p>" };
  });

  // 14. M/M/1: Lq
  B.G.push(function megMm1Lq() {
    var mu = rnd(6, 20), lam = rnd(Math.ceil(mu * 0.5), mu - 1), q = mm1(lam, mu);
    var place = pick(["Þjónustuborð tryggingafélags", "Afgreiðsla byggingavöruverslunar", "Símaver banka", "Innritunarborð flugfélags"]);
    return { topic: "megindleg", title: "M/M/1: meðalfjöldi í biðröð", unit: "viðskiptavinir", tol: 0.02, answer: q.Lq,
      text: "<p>" + place + " er með einn starfsmann. Viðskiptavinir koma af handahófi (Poisson) með $\\lambda = " + lam + "$ á klst og þjónustutíminn er veldisdreifður með þjónustutakt $\\mu = " + mu + "$ á klst.</p><p>Hve margir bíða að meðaltali í röðinni ($L_q$)?</p>",
      sol: "$$\\rho = \\frac{\\lambda}{\\mu} = \\frac{" + lam + "}{" + mu + "} = " + tx(q.rho, 4) + "$$$$L_q = \\frac{\\rho^2}{1-\\rho} = \\frac{" + tx(q.rho, 4) + "^2}{1-" + tx(q.rho, 4) + "} = " + tx(q.Lq, 4) + "$$" };
  });

  // 15. M/M/1: Wq
  B.G.push(function megMm1Wq() {
    var st = pick([2, 3, 4, 5, 6, 8, 10, 12]), mu = 60 / st, lam = Math.round(mu * (0.55 + Math.random() * 0.4) * 2) / 2;
    if (lam >= mu) lam = mu - 0.5;
    var q = mm1(lam, mu);
    return { topic: "megindleg", title: "M/M/1: biðtími í röð", unit: "mín", tol: 0.02, answer: q.Wq * 60,
      text: "<p>Á heilsugæslu sinnir einn hjúkrunarfræðingur símaráðgjöf. Að meðaltali berast $" + tx(lam) + "$ símtöl á klst og hvert símtal tekur að meðaltali " + st + " mínútur (veldisdreift). Gerðu ráð fyrir M/M/1-röð.</p><p>Hve margar mínútur bíður sá sem hringir að meðaltali áður en svarað er ($W_q$)?</p>",
      sol: "<p>Þjónustutaktur: $\\mu = 60/" + st + " = " + tx(mu, 4) + "$ á klst. Nýting: $\\rho = " + tx(lam) + "/" + tx(mu, 4) + " = " + tx(q.rho, 4) + "$.</p>" +
        "$$L_q = \\frac{\\rho^2}{1-\\rho} = " + tx(q.Lq, 4) + ",\\qquad W_q = \\frac{L_q}{\\lambda} = \\frac{" + tx(q.Lq, 4) + "}{" + tx(lam) + "} = " + tx(q.Wq, 4) + "\\text{ klst} = " + tx(q.Wq * 60, 4) + "\\text{ mín}$$" };
  });

  // 16. M/M/1: W
  B.G.push(function megMm1W() {
    var st = pick([3, 4, 5, 6, 10, 12, 15]), mu = 60 / st, lam = Math.round(mu * (0.5 + Math.random() * 0.4));
    if (lam < 1) lam = 1;
    if (lam >= mu) lam = Math.ceil(mu) - 1;
    var q = mm1(lam, mu);
    return { topic: "megindleg", title: "M/M/1: heildartími í kerfinu", unit: "mín", tol: 0.02, answer: q.W * 60,
      text: "<p>Í útflutningsfyrirtæki fara öll tollskjöl í gegnum einn starfsmann. Að meðaltali berast " + lam + " skjöl á klst og afgreiðsla tekur að meðaltali " + st + " mínútur (M/M/1).</p><p>Hve lengi er hvert skjal að meðaltali í kerfinu, bið + afgreiðsla ($W$), í mínútum?</p>",
      sol: "<p>$\\mu = 60/" + st + " = " + tx(mu, 4) + "$ á klst, $\\rho = " + lam + "/" + tx(mu, 4) + " = " + tx(q.rho, 4) + "$.</p>" +
        "$$L_q = \\frac{\\rho^2}{1-\\rho} = " + tx(q.Lq, 4) + ",\\quad W_q = \\frac{L_q}{\\lambda} = " + tx(q.Wq * 60, 4) + "\\text{ mín}$$" +
        "$$W = W_q + \\frac{1}{\\mu} = " + tx(q.Wq * 60, 4) + " + " + st + " = " + tx(q.W * 60, 4) + "\\text{ mín}$$" };
  });

  // 17. M/M/1: L
  B.G.push(function megMm1L() {
    var mu = rnd(5, 15), lam = rnd(Math.ceil(mu * 0.4), mu - 1), q = mm1(lam, mu);
    return { topic: "megindleg", title: "M/M/1: meðalfjöldi í kerfinu", unit: "mál", tol: 0.02, answer: q.L,
      text: "<p>Viðhaldsbeiðnir berast einum verkstjóra með $\\lambda = " + lam + "$ á dag og hann afgreiðir að meðaltali $\\mu = " + mu + "$ á dag (M/M/1).</p><p>Hve margar beiðnir eru að meðaltali í kerfinu, í bið eða í vinnslu ($L$)?</p>",
      sol: "$$\\rho = " + lam + "/" + mu + " = " + tx(q.rho, 4) + ",\\quad L_q = \\frac{\\rho^2}{1-\\rho} = " + tx(q.Lq, 4) + ",\\quad W_q = \\frac{L_q}{\\lambda} = " + tx(q.Wq, 4) + "\\text{ dagar}$$" +
        "$$W = W_q + \\frac1\\mu = " + tx(q.W, 4) + "\\text{ dagar},\\qquad L = \\lambda W = " + lam + "\\cdot " + tx(q.W, 4) + " = " + tx(q.L, 4) + "$$" +
        "<p>Til athugunar: fyrir M/M/1 er líka $L = \\rho/(1-\\rho)$.</p>" };
  });

  // 18. M/M/c: Wq
  B.G.push(function megMmcWq() {
    var c = pick([2, 2, 3, 3, 4]), st = pick([4, 5, 6, 8, 10, 12, 15]), mu = 60 / st;
    var lam = Math.round(c * mu * (0.6 + Math.random() * 0.3));
    if (lam >= c * mu) lam = Math.ceil(c * mu) - 1;
    var q = mmc(lam, mu, c);
    var place = pick(["Símaver tryggingafélags", "Afgreiðsla týnds farangurs í Keflavík", "Móttaka heilsugæslu", "Þjónustuborð bankans"]);
    return { topic: "megindleg", title: "M/M/c: biðtími með mörgum þjónum", unit: "mín", tol: 0.02, answer: q.Wq * 60,
      text: "<p>" + place + " hefur $c = " + c + "$ starfsmenn sem afgreiða úr einni sameiginlegri röð. Að meðaltali koma $\\lambda = " + lam + "$ viðskiptavinir á klst og afgreiðsla tekur að meðaltali " + st + " mínútur (M/M/" + c + ").</p>" +
        "<p>Hver er meðalbiðtími í röð ($W_q$) í mínútum?</p>",
      sol: "<p>$\\mu = 60/" + st + " = " + tx(mu, 4) + "$ á klst, $\\lambda/\\mu = " + tx(q.a, 4) + "$, $\\rho = \\dfrac{\\lambda}{c\\mu} = " + tx(q.rho, 4) + "$.</p>" +
        "<p>Summan í nefnaranum: $\\sum_{n=0}^{" + (c - 1) + "} \\frac{(\\lambda/\\mu)^n}{n!} = " + tx(q.sum, 4) + "$ og $\\dfrac{(\\lambda/\\mu)^c}{c!(1-\\rho)} = \\dfrac{" + tx(Math.pow(q.a, c), 4) + "}{" + fact(c) + "\\cdot " + tx(1 - q.rho, 4) + "} = " + tx(q.top, 4) + "$.</p>" +
        "$$L_q = \\frac{(\\lambda/\\mu)^c\\rho}{c!(1-\\rho)^2\\,(" + tx(q.top, 4) + " + " + tx(q.sum, 4) + ")} = \\frac{" + tx(Math.pow(q.a, c) * q.rho, 4) + "}{" + fact(c) + "\\cdot " + tx(Math.pow(1 - q.rho, 2), 4) + "\\cdot " + tx(q.top + q.sum, 4) + "} = " + tx(q.Lq, 4) + "$$" +
        "$$W_q = \\frac{L_q}{\\lambda} = \\frac{" + tx(q.Lq, 4) + "}{" + lam + "} = " + tx(q.Wq, 4) + "\\text{ klst} = " + tx(q.Wq * 60, 4) + "\\text{ mín}$$" };
  });

  // 19. M/M/c: Lq
  B.G.push(function megMmcLq() {
    var c = pick([2, 3]), mu = rnd(3, 8), lam = rnd(Math.ceil(c * mu * 0.55), c * mu - 1), q = mmc(lam, mu, c);
    return { topic: "megindleg", title: "M/M/c: meðalfjöldi í biðröð", unit: "mál", tol: 0.02, answer: q.Lq,
      text: "<p>Í umsóknarferli um námsstyrki vinna $c = " + c + "$ ráðgjafar úr sameiginlegri röð. Umsóknir berast með $\\lambda = " + lam + "$ á dag og hver ráðgjafi afgreiðir $\\mu = " + mu + "$ á dag (M/M/" + c + ").</p><p>Hve margar umsóknir bíða að meðaltali ($L_q$)?</p>",
      sol: "<p>$\\lambda/\\mu = " + tx(q.a, 4) + "$, $\\rho = \\lambda/(c\\mu) = " + lam + "/" + (c * mu) + " = " + tx(q.rho, 4) + "$.</p>" +
        "<p>$\\sum_{n=0}^{" + (c - 1) + "} \\frac{(\\lambda/\\mu)^n}{n!} = " + tx(q.sum, 4) + "$, &nbsp; $\\dfrac{(\\lambda/\\mu)^c}{c!(1-\\rho)} = " + tx(q.top, 4) + "$.</p>" +
        "$$L_q = \\frac{(\\lambda/\\mu)^c\\,\\rho}{c!\\,(1-\\rho)^2\\left(" + tx(q.top, 4) + " + " + tx(q.sum, 4) + "\\right)} = " + tx(q.Lq, 4) + "$$" +
        "<p>Til samanburðar: líkurnar á að umsókn þurfi að bíða (Erlang C) eru $P_w = " + tx(q.Pw, 3) + "$, og $L_q = P_w\\,\\rho/(1-\\rho)$ gefur sama svar.</p>" };
  });

  // 20. M/M/1: hve hratt þarf að þjóna?
  B.G.push(function megMm1Mu() {
    var lam = rnd(4, 20), wqm = pick([2, 3, 4, 5, 6, 10, 12, 15]), wq = wqm / 60;
    var mu = (lam + Math.sqrt(lam * lam + 4 * lam / wq)) / 2;
    return { topic: "megindleg", title: "M/M/1: nauðsynlegur þjónustutaktur", unit: "á klst", tol: 0.02, answer: mu,
      text: "<p>Í afgreiðslu bílaleigu berast $\\lambda = " + lam + "$ viðskiptavinir á klst og einn starfsmaður er á vakt (M/M/1). Markmiðið er að meðalbiðtími í röð verði $W_q = " + wqm + "$ mínútur.</p>" +
        "<p>Hver þarf þjónustutakturinn $\\mu$ að vera (viðskiptavinir á klst)?</p>",
      sol: "<p>Fyrir M/M/1 er $W_q = \\dfrac{L_q}{\\lambda} = \\dfrac{\\rho^2}{\\lambda(1-\\rho)} = \\dfrac{\\lambda}{\\mu(\\mu-\\lambda)}$. Með $W_q = " + wqm + "/60 = " + tx(wq, 4) + "$ klst fæst annars stigs jafna:</p>" +
        "$$\\mu^2 - \\lambda\\mu - \\frac{\\lambda}{W_q} = 0 \\;\\Rightarrow\\; \\mu = \\frac{\\lambda + \\sqrt{\\lambda^2 + 4\\lambda/W_q}}{2} = \\frac{" + lam + " + \\sqrt{" + (lam * lam) + " + " + tx(4 * lam / wq, 5) + "}}{2} = " + tx(mu, 4) + "$$" +
        "<p>Meðal afgreiðslutími má því vera um $60/" + tx(mu, 4) + " = " + tx(60 / mu, 3) + "$ mín.</p>" };
  });

  // 21. M/M/c: lágmarksfjöldi starfsmanna fyrir biðtímamarkmið
  B.G.push(function megMmcStaff() {
    var st = pick([5, 6, 8, 10, 12]), mu = 60 / st, lam = rnd(Math.ceil(mu * 1.3), Math.floor(mu * 3.6)), target = pick([1, 2, 3, 5]);
    var c = Math.floor(lam / mu) + 1, q = mmc(lam, mu, c), rows = [];
    while (q.Wq * 60 > target) { rows.push([c, q.Wq * 60]); c++; q = mmc(lam, mu, c); }
    rows.push([c, q.Wq * 60]);
    return { topic: "megindleg", title: "M/M/c: hve marga starfsmenn þarf?", unit: "starfsmenn", tol: 0.001, absTol: 0.2, answer: c,
      text: "<p>Í símaveri banka berast $\\lambda = " + lam + "$ símtöl á klst og hvert símtal tekur að meðaltali " + st + " mínútur (M/M/c, ein sameiginleg röð).</p><p>Hver er minnsti fjöldi starfsmanna $c$ svo að meðalbiðtíminn $W_q$ verði " + target + (target === 1 ? " mínúta" : " mínútur") + " eða minna?</p>",
      sol: "<p>$\\mu = 60/" + st + " = " + tx(mu, 4) + "$ á klst og $\\lambda/\\mu = " + tx(lam / mu, 4) + "$. Kerfið er bara stöðugt ef $\\rho = \\lambda/(c\\mu) \\lt 1$, þ.e. $c > " + tx(lam / mu, 4) + "$. Reiknaðu $W_q$ með M/M/c-formúlunni fyrir hvert $c$:</p>" +
        '<div class="tablewrap"><table><thead><tr><th>$c$</th><th>$\\rho$</th><th>$W_q$ (mín)</th></tr></thead><tbody>' +
        rows.map(function (x) { return "<tr><td>" + x[0] + "</td><td>" + is(lam / (x[0] * mu), 3) + "</td><td>" + is(x[1], 3) + "</td></tr>"; }).join("") +
        "</tbody></table></div><p>Minnsti fjöldinn er $c = " + c + "$. Taktu eftir hve hratt biðtíminn fellur þegar einum starfsmanni er bætt við nálægt $\\rho \\approx 1$.</p>" };
  });

  /* =====================================================================
   * Skilningsspurningar
   * ===================================================================== */
  B.MC.push(
    { topic: "megindleg", q: "Hvernig er hringrásartími samhliða blokkar (AND) reiknaður í flæðigreiningu?",
      o: ["Hæsta gildið, $\\max(T_1, \\dots, T_n)$", "Summa allra greina, $\\sum T_i$", "Vegið meðaltal, $\\sum p_i T_i$", "Meðaltal greinanna, $\\frac1n\\sum T_i$"], c: 0,
      e: "Í samhliða blokk eru allar greinarnar unnar á sama tíma og AND-samruninn bíður eftir þeirri síðustu, svo lengsta greinin ræður (glæra 5). Summa á við um kostnað og einingaálag, vegið meðaltal um XOR." },
    { topic: "megindleg", q: "Hvernig er hringrásartími valkvæðrar blokkar (XOR) reiknaður?",
      o: ["$CT = \\sum p_i T_i$", "$CT = \\max(T_i)$", "$CT = \\sum T_i$", "$CT = T/(1-r)$"], c: 0,
      e: "Hvert mál fer bara eina leið, svo meðaltíminn er vegið meðaltal tíma greinanna með líkum hverrar leiðar (glæra 4)." },
    { topic: "megindleg", q: "Aðgerð tekur $T$ og í hlutfalli $r$ tilvika þarf að endurtaka hana. Hver er hringrásartími endursendingarblokkarinnar?",
      o: ["$T/(1-r)$", "$T\\,(1+r)$", "$T/r$", "$T\\,(1-r)$"], c: 0,
      e: "Fjöldi skipta sem aðgerðin er unnin er að meðaltali $1/(1-r)$ (geómetrísk dreifing), svo $CT = T/(1-r)$ (glæra 5). $T(1+r)$ á bara við ef aðgerðin er endurtekin <i>í mesta lagi einu sinni</i>." },
    { topic: "megindleg", q: "Á glæru 7 er $CT = \\frac{1}{1-0{,}2} + \\max(1,3) + 3 + (0{,}6\\cdot1 + 0{,}4\\cdot2)$. Hver er niðurstaðan?",
      o: ["8,65 dagar", "8,4 dagar", "9,65 dagar", "7,65 dagar"], c: 0,
      e: "$1{,}25 + 3 + 3 + 1{,}4 = 8{,}65$ dagar. Endursendingin gefur 1,25, samhliða blokkin 3 (hámarkið), línulega blokkin 3 og XOR-blokkin 1,4." },
    { topic: "megindleg", q: "Hvað mælir nýtni ferils (cycle time efficiency, CTE)?",
      o: ["Hlutfall vinnslutíma af heildar hringrásartíma, $TCT/CT$", "Hlutfall komutakts af framleiðslugetu, $\\lambda/\\mu_p$", "Hlutfall mála sem klárast án endursendingar", "Hlutfall hringrásartíma af vinnutíma starfsmanna"], c: 0,
      e: "$CTE = TCT/CT$, þar sem fræðilegur hringrásartími TCT er hringrásartíminn án biðtíma (glæra 8). $\\lambda/\\mu_p$ er nýting auðlinda, ekki nýtni ferils." },
    { topic: "megindleg", q: "Hvað er fræðilegur hringrásartími (theoretical cycle time, TCT)?",
      o: ["Hringrásartíminn ef engin bið væri, reiknaður út frá vinnslutímum einum", "Hringrásartími lengstu leiðarinnar í gegnum ferlið", "Hringrásartíminn þegar allar auðlindir eru fullnýttar", "Markmið um hringrásartíma sem stjórnendur setja"], c: 0,
      e: "TCT notar meðalvinnslutíma hverrar aðgerðar án biðtíma (glæra 8), og er reiknaður með sömu blokkareglum og CT." },
    { topic: "megindleg", q: "Mál í umsóknarferli um námsstyrk er 12 daga í ferlinu en unnið er í því samtals í 0,6 daga. Hver er CTE?",
      o: ["5 %", "20 %", "0,6 %", "95 %"], c: 0,
      e: "$CTE = 0{,}6/12 = 0{,}05 = 5\\,\\%$. 95 % tímans er málið í bið, sem er dæmigert þegar mál fara á milli deilda (glæra 8)." },
    { topic: "megindleg", q: "Hvar liggur oftast mestur hluti hringrásartímans í þjónustuferlum?",
      o: ["Í biðtíma, sérstaklega við afhendingu milli sviða", "Í vinnslutíma sérfræðinga", "Í flutningi gagna á milli upplýsingakerfa", "Í gæðaeftirliti í lok ferlisins"], c: 0,
      e: "Glæra 8: iðulega er mestur tími í bið, t.d. við lotuvinnslu, eftir samþykki eða upplýsingum, og við afhendingu milli sviða. Þess vegna er CTE oft lágt." },
    { topic: "megindleg", q: "Hvað segir lögmál Little?",
      o: ["$WIP = \\lambda \\cdot CT$", "$CT = \\lambda \\cdot WIP$", "$\\lambda = WIP \\cdot CT$", "$WIP = CT/\\lambda$"], c: 0,
      e: "Meðalfjöldi mála í vinnslu er komutaktur sinnum meðal hringrásartími (glæra 10). Því má líka skrifa $CT = WIP/\\lambda$." },
    { topic: "megindleg", q: "Tryggingafélag fær 40 tjónstilkynningar á dag og vill halda fjölda opinna mála (WIP) óbreyttum þótt tilkynningum fjölgi í 50 á dag. Hvað segir lögmál Little?",
      o: ["Hringrásartíminn þarf að styttast um 20 %", "Hringrásartíminn þarf að lengjast um 25 %", "Hringrásartíminn má haldast óbreyttur", "Hringrásartíminn þarf að styttast um 25 %"], c: 0,
      e: "$CT = WIP/\\lambda$. Ef $\\lambda$ fer úr 40 í 50 verður nýi tíminn $40/50 = 0{,}8$ af þeim gamla, þ.e. 20 % styttri (glæra 10)." },
    { topic: "megindleg", q: "Hvenær gildir lögmál Little?",
      o: ["Þegar ferlið er stöðugt, þ.e. komutaktur er minni en framleiðslugeta", "Bara þegar komutímar eru Poisson-dreifðir", "Bara þegar einn þjónn er í kerfinu", "Bara þegar engin endursending er í ferlinu"], c: 0,
      e: "Lögmál Little gildir einungis ef ferlið er stöðugt (glæra 14). Það krefst engra forsendna um dreifingar eða fjölda þjóna, en ef $\\lambda \\geq \\mu_p$ vex biðröðin án takmarka." },
    { topic: "megindleg", q: "Hvað er fræðileg framleiðslugeta (theoretical capacity) ferlis?",
      o: ["Mesti fjöldi mála sem ferlið getur lokið á tímaeiningu ef auðlindir eru fullnýttar", "Meðalfjöldi mála sem ferlið lýkur í raun á dag", "Fjöldi mála sem eru í vinnslu á hverjum tíma", "Fjöldi starfsmanna sem þarf til að ljúka ferlinu"], c: 0,
      e: "Glæra 14: fræðileg framleiðslugeta er mesta magn mála sem ferlið getur framkvæmt og lokið yfir tímabil, og næst bara með fullnýttum auðlindum án biðtíma." },
    { topic: "megindleg", q: "Hvernig er fræðileg framleiðslugeta auðlindahóps $\\mu_p$ reiknuð?",
      o: ["$\\mu_p = uc/ul$, einingaafköst deilt með einingaálagi", "$\\mu_p = ul/uc$, einingaálag deilt með einingaafköstum", "$\\mu_p = \\lambda \\cdot CT$", "$\\mu_p = TCT/CT$"], c: 0,
      e: "Glæra 15: $\\mu_p = uc/ul$. $uc$ er vinnustundir hópsins á tímaeiningu (t.d. 8 klst × fjöldi á dag) og $ul$ vinnustundir hópsins á hvert mál." },
    { topic: "megindleg", q: "Hvernig er samhliða blokk (AND) meðhöndluð þegar einingaálag ($ul$) auðlindahóps er reiknað?",
      o: ["Lögð saman eins og línuleg blokk", "Tekið hæsta gildið eins og fyrir hringrásartíma", "Vegið meðaltal með líkum", "Henni er sleppt"], c: 0,
      e: "Glæra 15: allar samhliða aðgerðirnar eru unnar og taka vinnutíma hópsins, svo þær eru lagðar saman. Max á bara við um tíma, því þar skarast greinarnar." },
    { topic: "megindleg", q: "Hvað er flöskuháls (bottleneck) samkvæmt flæðigreiningu á framleiðslugetu?",
      o: ["Auðlindahópurinn með minnsta fræðilega framleiðslugetu", "Aðgerðin með lengsta vinnslutímann", "Aðgerðin sem flest mál fara í gegnum", "Auðlindahópurinn með flesta starfsmenn"], c: 0,
      e: "Glæra 18: fræðileg framleiðslugeta ferlisins er framleiðslugeta þess hóps sem hefur minnstu getuna. Lengsta aðgerðin er ekki endilega flöskuháls ef margir sinna henni." },
    { topic: "megindleg", q: "Fulltrúar geta afgreitt 4 umsóknir á dag og lánafulltrúar 3 á dag. Hver er framleiðslugeta ferlisins?",
      o: ["3 umsóknir á dag", "4 umsóknir á dag", "7 umsóknir á dag", "3,5 umsóknir á dag"], c: 0,
      e: "Ferlið kemst ekki hraðar en hægasti hópurinn: $\\min(4, 3) = 3$ umsóknir á dag. Lánafulltrúarnir eru flöskuhálsinn." },
    { topic: "megindleg", q: "Hvað er nýting auðlinda (resource utilization) $\\rho_p$?",
      o: ["Hlutfall komutakts og fræðilegrar framleiðslugetu, $\\lambda/\\mu_p$", "Hlutfall vinnslutíma og hringrásartíma", "Hlutfall starfsmanna sem eru við vinnu", "Fjöldi mála í vinnslu á hvern starfsmann"], c: 0,
      e: "Glæra 18: $\\rho_p = \\lambda/\\mu_p$. Ef $\\rho_p$ nálgast 1 lengist bið mjög hratt; ef $\\rho_p \\geq 1$ er ferlið óstöðugt." },
    { topic: "megindleg", q: "Flæðigreining með kostnaði notar sömu blokkareglur og tímagreining, með einni undantekningu. Hverri?",
      o: ["Samhliða blokk: kostnaður greinanna er lagður saman", "Valkvæð blokk: kostnaður greinanna er lagður saman", "Endursending: kostnaði er deilt með $r$", "Línuleg blokk: tekið er hæsta gildið"], c: 0,
      e: "Glæra 20: í samhliða blokk eru allar aðgerðirnar unnar og greitt fyrir þær allar, svo kostnaðurinn er summa, þó að tíminn sé max." },
    { topic: "megindleg", q: "Hvað er bundin leið (critical path) í ferli?",
      o: ["Lengsta röð háðra aðgerða í gegnum ferlið, sem ákvarðar hringrásartímann", "Leiðin sem flest mál fara í gegnum", "Leiðin með dýrustu aðgerðunum", "Stysta leiðin frá upphafi til enda ferlisins"], c: 0,
      e: "Glæra 9: bundin leið (CPM) er lengsta röð verkþátta; aðgerðir á henni hafa engan slaka. Til að stytta CT þarf að stytta aðgerðir á bundnu leiðinni." },
    { topic: "megindleg", q: "Í CPM-dæminu á glæru 9 er „Check credit history“ með ES = 2, EF = 2,5, LS = 4,5 og LF = 5. Hvað segir það?",
      o: ["Aðgerðin hefur 2,5 klst slaka og er ekki á bundnu leiðinni", "Aðgerðin er á bundnu leiðinni", "Aðgerðin tekur 4,5 klst", "Aðgerðin getur ekki hafist fyrr en eftir 4,5 klst"], c: 0,
      e: "Slaki = LS − ES = 4,5 − 2 = 2,5 klst. Aðgerðin má seinka um það án þess að ferlið lengist. Aðgerðir á bundinni leið hafa slaka 0." },
    { topic: "megindleg", q: "Í biðraðafræði, hvað táknar $\\lambda$?",
      o: ["Komutakt: meðalfjöldi koma á tímaeiningu", "Þjónustutakt: meðalfjölda afgreiddra á tímaeiningu", "Meðaltíma í biðröð", "Nýtingu þjónsins"], c: 0,
      e: "Glæra 21: $\\lambda$ er komutaktur (arrival rate) og $\\mu$ er þjónustutaktur (service rate)." },
    { topic: "megindleg", q: "Hvað þýðir táknið M/M/1?",
      o: ["Poisson-komur (veldisdreifðir millikomutímar), veldisdreifður þjónustutími og einn þjónn", "Meðalkomur, meðalþjónusta og ein biðröð", "Margar biðraðir, margir þjónar og ein þjónustustöð", "Markov-komur, föst þjónusta og einn þjónn"], c: 0,
      e: "Kendall-táknun: fyrsta M = komur eru Poisson (millikomutímar veldisdreifðir), annað M = þjónustutími veldisdreifður, 1 = einn þjónn (glæra 24)." },
    { topic: "megindleg", q: "Í M/M/1-röð er $\\lambda = 8$ á klst og $\\mu = 10$ á klst. Hver er $L_q$?",
      o: ["3,2", "4", "0,8", "1,6"], c: 0,
      e: "$\\rho = 0{,}8$ og $L_q = \\rho^2/(1-\\rho) = 0{,}64/0{,}2 = 3{,}2$. Svarið 4 er $L = \\rho/(1-\\rho)$, fjöldinn í öllu kerfinu." },
    { topic: "megindleg", q: "Hvernig fæst heildartími í kerfi $W$ út frá biðtíma í röð $W_q$?",
      o: ["$W = W_q + 1/\\mu$", "$W = W_q + 1/\\lambda$", "$W = W_q \\cdot \\rho$", "$W = W_q/(1-\\rho)$"], c: 0,
      e: "Formúla 7.11: heildartími = bið í röð + meðalþjónustutími, og meðalþjónustutími er $1/\\mu$. Hún gildir bæði fyrir M/M/1 og M/M/c." },
    { topic: "megindleg", q: "Hvað gerist við biðtíma í M/M/1-röð þegar nýting $\\rho$ nálgast 1?",
      o: ["Hann vex mjög hratt og stefnir á óendanlegt", "Hann vex línulega með $\\rho$", "Hann helst nánast óbreyttur", "Hann minnkar, því þjónninn er alltaf upptekinn"], c: 0,
      e: "$L_q = \\rho^2/(1-\\rho)$ hefur $(1-\\rho)$ í nefnara. Við $\\rho = 0{,}9$ er $L_q = 8{,}1$ en við $\\rho = 0{,}99$ er hún 98. Þess vegna er 100 % nýting óraunhæft markmið." },
    { topic: "megindleg", q: "Hvernig er nýting $\\rho$ skilgreind í M/M/c-röð með $c$ þjónum?",
      o: ["$\\rho = \\lambda/(c\\mu)$", "$\\rho = \\lambda/\\mu$", "$\\rho = c\\lambda/\\mu$", "$\\rho = \\mu/(c\\lambda)$"], c: 0,
      e: "Heildarafköst $c$ þjóna eru $c\\mu$, svo $\\rho = \\lambda/(c\\mu)$, sem verður að vera < 1. Stærðin $\\lambda/\\mu$ kemur líka fyrir í formúlu 7.13 og segir hve margir þjónar eru uppteknir að meðaltali." },
    { topic: "megindleg", q: "Hvaða M/M/1-formúla þarf að breytast þegar farið er yfir í M/M/c?",
      o: ["Bara $L_q$; $W_q = L_q/\\lambda$, $W = W_q + 1/\\mu$ og $L = \\lambda W$ gilda áfram", "Allar formúlurnar breytast", "Bara $W = W_q + 1/\\mu$", "Engin, M/M/c er reiknuð eins og M/M/1 með $c\\mu$"], c: 0,
      e: "Samkvæmt ítarefninu (kafli 7.2) gilda formúlur 7.10-7.12 líka fyrir M/M/c; aðeins $L_q$ er reiknað öðruvísi, með formúlu 7.13 (Erlang C)." },
    { topic: "megindleg", q: "Banki er með tvo gjaldkera, hvorn með sína röð (tvær M/M/1-raðir), og íhugar eina sameiginlega röð (M/M/2) með sama álagi. Hvað gerist?",
      o: ["Meðalbiðtíminn styttist, því enginn gjaldkeri er aðgerðalaus meðan einhver bíður", "Meðalbiðtíminn lengist, því röðin verður tvöfalt lengri", "Meðalbiðtíminn helst óbreyttur, því afköstin eru þau sömu", "Nýting gjaldkeranna eykst upp í 100 %"], c: 0,
      e: "Sameining raða (pooling) styttir bið: með sérröðum getur einn þjónn verið laus meðan biðröð er hjá hinum. Nýtingin $\\lambda/(c\\mu)$ er sú sama í báðum tilvikum." },
    { topic: "megindleg", q: "Hver er helsti kosturinn við hermun (simulation) umfram flæðigreiningu og biðraðaformúlur?",
      o: ["Hún ræður við flókin ferli með mörgum auðlindum, dreifingum og biðtíma vegna samkeppni um auðlindir", "Hún gefur nákvæma lausn án nokkurrar óvissu", "Hún þarf engin inntaksgögn um ferlið", "Hún er alltaf fljótlegri en að reikna í höndunum"], c: 0,
      e: "Hermun (t.d. BIMP, glæra 25) líkir eftir mörgum málum í gegnum BPMN-líkan og nær biðtíma sem flæðigreining sér ekki. Niðurstöðurnar eru þó slembnar og jafngóðar inntaksgögnunum." },
    { topic: "megindleg", q: "Hvaða inntak þarf hermilíkan (t.d. í BIMP) til viðbótar við BPMN-líkanið?",
      o: ["Komutakt, dreifingu vinnslutíma, líkur á XOR-greinum og auðlindir með fjölda og kostnaði", "Bara fjölda starfsmanna í hverri deild", "Bara meðal hringrásartíma ferlisins", "Lista yfir sóun og rótarástæður"], c: 0,
      e: "Hermun þarf að vita hvernig mál koma inn, hve lengi hver aðgerð tekur (dreifing), hvaða leið þau fara og hvaða auðlindir vinna verkin, á hvaða tímum og hvað þær kosta." },
    { topic: "megindleg", q: "Hver er helsta takmörkun einfaldrar flæðigreiningar?",
      o: ["Hún tekur ekki tillit til biðtíma sem myndast þegar auðlindir eru uppteknar", "Hún getur ekki reiknað XOR-blokkir", "Hún gildir bara fyrir ferli án samhliða aðgerða", "Hún þarf alltaf hermiforrit"], c: 0,
      e: "Flæðigreining notar meðaltöl og gerir ráð fyrir að tímarnir séu þekktir. Hún sér ekki biðraðir sem myndast við álag; til þess þarf biðraðafræði eða hermun (BPM kafli 7.2.5)." },
    { topic: "megindleg", q: "Hvaða fjórir mælikvarðar á frammistöðu ferla mynda „Devil's quadrangle“ í kennslubókinni?",
      o: ["Tími, kostnaður, gæði og sveigjanleiki", "Tími, kostnaður, áhætta og ánægja", "Afköst, nýting, biðtími og WIP", "Virðisauki, sóun, gæði og tími"], c: 0,
      e: "Dumas o.fl. (kafli 7.1): umbætur á einum mælikvarða kosta oft á öðrum, t.d. hraðari afgreiðsla á kostnað gæða. Þess vegna „djöfullegi ferhyrningurinn“." },
    { topic: "megindleg", q: "Hvaða áhrif hefur lotuvinnsla (batching) yfirleitt á hringrásartíma, borið saman við samfellt flæði (flow)?",
      o: ["Hann lengist, því hver eining bíður eftir að lotan fyllist og klárist", "Hann styttist, því uppsetningartími dreifist á fleiri einingar", "Hann helst óbreyttur, því vinnslutíminn er sá sami", "Hann styttist, því WIP minnkar"], c: 0,
      e: "Glæra 19: lotuvinnsla eykur bið og WIP; samkvæmt Little lengist þá CT. Samfellt flæði (flow) styttir biðina, eins og rúllustigi í stað lyftu." },
    { topic: "megindleg", q: "Viðhaldsbeiðnir: XOR-val þar sem 70 % fara í „leiðbeina í síma“ (0,5 klst) og 30 % í „viðgerð á staðnum“ (4 klst). Hver er meðaltími blokkarinnar?",
      o: ["1,55 klst", "2,25 klst", "4 klst", "4,5 klst"], c: 0,
      e: "$0{,}7 \\cdot 0{,}5 + 0{,}3 \\cdot 4 = 0{,}35 + 1{,}2 = 1{,}55$ klst. 2,25 er einfalt meðaltal og 4,5 summa, hvorugt tekur tillit til líkanna." },
    { topic: "megindleg", q: "Útflutningur á fiski: „útbúa skjöl“ (3 klst) og „pakka og merkja“ (2 klst) eru unnin samhliða af sama starfsmanninum. Hver er tíminn ef hann getur bara gert eitt í einu?",
      o: ["5 klst, því samhliða í líkani er ekki samhliða í raun ef sama auðlindin vinnur bæði", "3 klst, því AND-blokk tekur alltaf hæsta gildið", "2,5 klst, meðaltal greinanna", "6 klst, því aðgerðirnar trufla hvor aðra"], c: 0,
      e: "Max-reglan gerir ráð fyrir að greinarnar séu raunverulega unnar á sama tíma. Ef ein auðlind vinnur báðar verður tíminn summa. Þetta er dæmi um biðtíma vegna auðlinda sem einföld flæðigreining sér ekki." },
    { topic: "megindleg", q: "Í heilsugæslu eru að jafnaði 12 sjúklingar á staðnum og 30 koma á klukkustund. Hve lengi er hver sjúklingur að meðaltali?",
      o: ["24 mínútur", "2,5 mínútur", "36 mínútur", "6 mínútur"], c: 0,
      e: "Little: $CT = WIP/\\lambda = 12/30 = 0{,}4$ klst = 24 mín. 2,5 fæst ef deilt er öfugt ($30/12$)." },
    { topic: "megindleg", q: "Hvers vegna þarf að skoða dreifingu (ekki bara meðaltal) biðtíma í þjónustuferlum?",
      o: ["Viðskiptavinir upplifa langar biðir; mesta bið og hlutfall yfir markmiði skipta máli þótt meðaltalið sé gott", "Af því að meðaltal biðtíma er alltaf rangt reiknað", "Af því að lögmál Little gildir ekki um meðaltöl", "Af því að M/M/1 gefur bara hámarksbiðtíma"], c: 0,
      e: "Glæra 23 nefnir mælistikur eins og mestu lengd raðar og mestu bið í röð, auk meðaltala. Meðaltal getur falið að sumir bíða mjög lengi." },
    { topic: "megindleg", q: "Hvað af eftirfarandi er <b>ekki</b> dæmigerð mælistika í biðraðakerfi samkvæmt glæru 23?",
      o: ["Fjöldi aðgerða í BPMN-líkaninu", "Meðallengd raðar", "Mesta bið í röð", "Nýtni þjóns eða vinnustöðvar"], c: 0,
      e: "Glæra 23 telur upp meðallengd og mestu lengd raðar, meðalbið og mestu bið, meðal- og mesta CT og nýtni þjóns. Fjöldi aðgerða í líkani er ekki frammistöðumælikvarði." },
    { topic: "megindleg", q: "Ein auðlind vinnur 8 klst á dag. Auðlindahópurinn er 3 manns. Hver eru einingaafköst hópsins, $uc$?",
      o: ["24 klst á dag", "8 klst á dag", "3 mál á dag", "2,67 klst á dag"], c: 0,
      e: "Glæra 16: $uc$ = vinnustundir á auðlind × fjöldi auðlinda = $8 \\cdot 3 = 24$ klst á dag. $uc$ er mælt í tíma, ekki málum; málin fást með $uc/ul$." },
    { topic: "megindleg", q: "Í M/M/1 eru $\\lambda = 6$ á klst og $\\mu = 4$ á klst. Hvað er rétt?",
      o: ["Kerfið er óstöðugt; röðin vex án takmarka og formúlurnar gilda ekki", "$L_q = \\rho^2/(1-\\rho) = -4{,}5$ viðskiptavinir", "Nýtingin er 67 %", "Meðalbiðtíminn er 1,5 klst"], c: 0,
      e: "$\\rho = 6/4 = 1{,}5 > 1$. Fleiri koma en hægt er að afgreiða, svo biðröðin lengist stöðugt. Neikvætt $L_q$ er merki um að formúlan sé notuð utan gildissviðs. Lausnin er að fjölga þjónum ($c \\geq 2$) eða auka $\\mu$." },
    { topic: "megindleg", q: "Hver er tengingin milli $L$ og $W$ í biðraðakerfi?",
      o: ["$L = \\lambda W$, sem er lögmál Little beitt á biðraðakerfið", "$L = \\mu W$", "$L = W/\\lambda$", "$L = W + 1/\\mu$"], c: 0,
      e: "Formúla 7.12, $L = \\lambda W$, er lögmál Little ($WIP = \\lambda \\cdot CT$). Á sama hátt er $L_q = \\lambda W_q$." },
  );
})();

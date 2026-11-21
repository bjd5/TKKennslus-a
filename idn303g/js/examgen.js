/* examgen.js – býr til lokapróf ferðalagsins með sama sniði og raunverulega lokaprófið:
 * sex spurningar, 1-4 gilda 15 % hver (útreikningar) og 5-6 gilda 20 % hvor.
 * Nýjar tölur og ný afbrigði í hvert skipti.
 *
 * TK.examgen(uid) -> { questions: [{ n, weight, title, html, parts, setup? }] }
 * part: { label, kind: "num", text, answer, unit, tol, absTol?, sol }
 *    eða { label, kind: "mc", text, o: [rétt, rangt, ...], c: 0, e }
 * Þarf js/bank.js (hjálparföll) og, fyrir gröfin í setup(), js/ctrl.js. */
(function () {
  "use strict";
  var TK = (window.TK = window.TK || {});

  var B = function () { return TK.bank; };
  var rnd = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  var uni = function (a, b) { return a + Math.random() * (b - a); };
  var is = function (x, sig) { return B().is(x, sig); };
  var tx = function (x, sig) { return B().tx(x, sig); };
  var RPM2RAD = (2 * Math.PI) / 60;
  var deg = function (r) { return (r * 180) / Math.PI; };
  var rad = function (d) { return (d * Math.PI) / 180; };
  var nice = function (x) { return Number(x.toPrecision(2)); };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function bisect(f, a, b) {
    var fa = f(a);
    for (var i = 0; i < 100; i++) {
      var m = 0.5 * (a + b), fm = f(m);
      if ((fa <= 0) === (fm <= 0)) { a = m; fa = fm; } else b = m;
    }
    return 0.5 * (a + b);
  }
  function num(label, text, answer, unit, sol, tol, absTol) {
    var p = { label: label, kind: "num", text: text, answer: answer, unit: unit || "", tol: tol || 0.02, sol: sol };
    if (absTol !== undefined) p.absTol = absTol;
    return p;
  }
  function mc(label, text, o, e) { return { label: label, kind: "mc", text: text, o: o, c: 0, e: e }; }
  var L = function (i) { return "(" + "abcdefgh"[i] + ")"; };
  function labelParts(parts) { parts.forEach(function (p, i) { p.label = L(i); }); return parts; }
  // Stuðull fyrir framan breytu í diffurjöfnu: 1 er sleppt
  var coef = function (x, v) { return x === 1 ? v : tx(x) + v; };

  /* ---------- SVG-hjálp: blokkrit með afturvirkni ---------- */
  function lbl(b) {
    if (typeof b === "string") return esc(b);
    return esc(b.t) + '<tspan class="sub" dy="4">' + esc(b.sub) + "</tspan>" + (b.tail ? '<tspan dy="-4">' + esc(b.tail) + "</tspan>" : "");
  }
  /** o: { inp, out, blocks: [label], sig: [merki á milli blokka], fb: label|null, fbSig, dist: { after, label } } */
  function loopSvg(o, aria) {
    var y = 70, h = [], bw = 96, gap = 46;
    var ahR = function (x) { return '<path class="ah" d="M' + x + " " + y + ' l-9 -4.5 v9z"/>'; };
    h.push('<text x="6" y="' + (y + 5) + '" font-weight="700">' + lbl(o.inp) + "</text>");
    h.push('<line class="ln" x1="26" y1="' + y + '" x2="64" y2="' + y + '"/>' + ahR(66));
    h.push('<circle class="sum" cx="80" cy="' + y + '" r="14"/><text x="60" y="' + (y - 10) + '" class="small">+</text><text x="86" y="' + (y + 28) + '" class="small">−</text>');
    var x = 94;
    o.blocks.forEach(function (b, i) {
      var sig = o.sig && o.sig[i];
      h.push('<line class="ln" x1="' + x + '" y1="' + y + '" x2="' + (x + gap - 2) + '" y2="' + y + '"/>' + ahR(x + gap));
      if (sig) h.push('<text x="' + (x + 8) + '" y="' + (y - 8) + '">' + lbl(sig) + "</text>");
      x += gap;
      h.push('<rect class="box" x="' + x + '" y="' + (y - 25) + '" width="' + bw + '" height="50"/><text x="' + (x + bw / 2) + '" y="' + (y + 5) + '" text-anchor="middle">' + lbl(b) + "</text>");
      x += bw;
      if (o.dist && o.dist.after === i) {
        h.push('<line class="ln" x1="' + x + '" y1="' + y + '" x2="' + (x + 30) + '" y2="' + y + '"/>' + ahR(x + 32));
        var cx = x + 46;
        h.push('<circle class="sum" cx="' + cx + '" cy="' + y + '" r="14"/><text x="' + (cx - 22) + '" y="' + (y - 10) + '" class="small">+</text><text x="' + (cx + 10) + '" y="' + (y - 16) + '" class="small">' + (o.dist.sign || "+") + "</text>");
        h.push('<line class="ln dis" x1="' + cx + '" y1="14" x2="' + cx + '" y2="' + (y - 18) + '"/><path class="ah dis" d="M' + cx + " " + (y - 16) + ' l-4.5 -9 h9z"/><text x="' + (cx + 10) + '" y="26" class="lbl-dis">' + lbl(o.dist.label) + "</text>");
        x = cx + 14;
      }
    });
    var xo = x + 110, xp = x + 60;
    h.push('<line class="ln" x1="' + x + '" y1="' + y + '" x2="' + (xo - 2) + '" y2="' + y + '"/>' + ahR(xo));
    h.push('<text x="' + (xo + 8) + '" y="' + (y + 5) + '" font-weight="700">' + lbl(o.out) + "</text>");
    h.push('<circle class="dot" cx="' + xp + '" cy="' + y + '" r="3.5"/>');
    var yb = y + 92;
    h.push('<line class="ln" x1="' + xp + '" y1="' + y + '" x2="' + xp + '" y2="' + yb + '"/>');
    if (o.fb) {
      var mid = (80 + xp) / 2, fw = 96;
      h.push('<line class="ln" x1="' + xp + '" y1="' + yb + '" x2="' + (mid + fw / 2 + 2) + '" y2="' + yb + '"/><path class="ah" d="M' + (mid + fw / 2) + " " + yb + ' l9 -4.5 v9z"/>');
      h.push('<rect class="box" x="' + (mid - fw / 2) + '" y="' + (yb - 22) + '" width="' + fw + '" height="44"/><text x="' + mid + '" y="' + (yb + 5) + '" text-anchor="middle">' + lbl(o.fb) + "</text>");
      h.push('<line class="ln" x1="' + (mid - fw / 2) + '" y1="' + yb + '" x2="80" y2="' + yb + '"/>');
    } else {
      h.push('<line class="ln" x1="' + xp + '" y1="' + yb + '" x2="80" y2="' + yb + '"/>');
    }
    h.push('<line class="ln" x1="80" y1="' + yb + '" x2="80" y2="' + (y + 18) + '"/><path class="ah" d="M80 ' + (y + 16) + ' l-4.5 9 h9z"/>');
    if (o.fbSig) h.push('<text x="90" y="' + (yb - 10) + '">' + lbl(o.fbSig) + "</text>");
    var W = xo + 40;
    return '<svg class="diagram" viewBox="0 0 ' + W + ' 190" role="img" aria-label="' + esc(aria) + '">' + h.join("") + "</svg>";
  }

  /* ---------- Spurning 1: diffurjafna og þrepasvörun ---------- */
  function q1() {
    if (Math.random() < 0.45) {
      var a = pick([0.5, 2, 3, 4, 5]), b = pick([1, 2, 4, 5, 8, 10]), c = pick([1, 2, 3, 5]);
      if (a === b) b = b === 10 ? 8 : b * 2;
      var K = c / b, tau = a / b;
      var html = "<p>Kerfi er lýst með diffurjöfnunni $" + coef(a, "y'") + " + " + coef(b, "y") + " = " + coef(c, "u") + "$, þar sem $u$ er inntak og $y$ úttak, og $y(0) = 0$. Inntakið er einingarþrepfall.</p>";
      var G = "$G(s) = \\dfrac{" + tx(c) + "}{" + coef(a, "s") + " + " + tx(b) + "} = \\dfrac{" + tx(K, 4) + "}{" + tx(tau, 4) + "s + 1}$";
      return {
        n: 1, weight: 15, title: "Diffurjafna og þrepasvörun", html: html,
        parts: labelParts([
          num("", "Finnið yfirfærslufallið og gefið jafnvægisgildi þrepasvörunarinnar $K$.", K, "",
            "<p>Laplace með $y(0)=0$: " + G + ". Lokagildisreglan: $y(\\infty) = G(0) = " + tx(c) + "/" + tx(b) + " = " + tx(K, 4) + "$.</p>"),
          num("", "Hver er tímastuðullinn $\\tau$?", tau, "s",
            "<p>Á staðalforminu $K/(\\tau s+1)$ er $\\tau = " + tx(a) + "/" + tx(b) + " = " + tx(tau, 4) + "$ s. Póllinn er í $s = -" + tx(1 / tau, 4) + "$.</p>"),
          num("", "Eftir hve langan tíma hefur svörunin náð 98 % af jafnvægisgildinu?", 4 * tau, "s",
            "<p>$1 - e^{-t/\\tau} = 0{,}98$ gefur $t = -\\tau\\ln 0{,}02 = 3{,}9\\tau \\approx 4\\tau = " + tx(4 * tau, 4) + "$ s.</p>", 0.035),
          mc("", "Hvað á við um dempunarhlutfall, náttúrulega tíðni, tíma hæsta yfirskots og yfirskot?",
            ["Þeir stikar eiga ekki við: kerfið er fyrstu gerðar með eina raunrót og ekkert yfirskot",
             "$\\zeta = 0{,}5$ svo yfirskotið er um 16 %",
             "Kerfið sveiflast með horntíðni $\\omega_n = " + tx(b / a, 3) + "$ rad/s",
             "Kerfið er óstöðugt því póllinn er í $s = +" + tx(b / a, 3) + "$"],
            "Diffurjafna fyrstu gerðar hefur eina raunrót í $s = -" + tx(b / a, 3) + "$ (vinstra hálfplani). Svörunin er $K(1-e^{-t/\\tau})$: hún nálgast jafnvægið án þess að fara yfir það. Í svarinu á prófi á að taka þetta fram, því spurt er „ef við á“."),
        ]),
      };
    }
    // Annarrar gerðar, undirdempað
    var a2, a1, wn, z;
    do {
      a2 = pick([1, 2, 4, 5, 8, 9, 10, 13, 16, 25]);
      wn = Math.sqrt(a2);
      a1 = rnd(1, Math.max(1, Math.floor(1.5 * wn)));
      z = a1 / (2 * wn);
    } while (z < 0.15 || z > 0.75);
    var b2 = pick([1, 2, 3, 4, 5, 10]);
    var K2 = b2 / a2, tau2 = 1 / (z * wn), wd = wn * Math.sqrt(1 - z * z), Tp = Math.PI / wd, Mp = 100 * Math.exp((-z * Math.PI) / Math.sqrt(1 - z * z));
    var G2 = "$G(s) = \\dfrac{" + tx(b2) + "}{s^2 + " + coef(a1, "s") + " + " + tx(a2) + "}$";
    var std = "Berum saman við $\\dfrac{K\\omega_n^2}{s^2 + 2\\zeta\\omega_ns + \\omega_n^2}$: ";
    return {
      n: 1, weight: 15, title: "Diffurjafna og þrepasvörun",
      html: "<p>Kerfi er lýst með $y'' + " + coef(a1, "y'") + " + " + coef(a2, "y") + " = " + coef(b2, "u") + "$ og $y(0) = y'(0) = 0$. Inntakið er einingarþrepfall. Gerið grein fyrir svörun kerfisins.</p>",
      parts: labelParts([
        num("", "Jafnvægisgildi $K$ þrepasvörunarinnar?", K2, "", "<p>" + G2 + ", svo $K = G(0) = " + tx(b2) + "/" + tx(a2) + " = " + tx(K2, 4) + "$.</p>"),
        num("", "Náttúruleg tíðni $\\omega_n$?", wn, "rad/s", "<p>" + std + "$\\omega_n^2 = " + tx(a2) + " \\Rightarrow \\omega_n = " + tx(wn, 4) + "$ rad/s.</p>"),
        num("", "Dempunarhlutfall $\\zeta$?", z, "", "<p>$2\\zeta\\omega_n = " + tx(a1) + " \\Rightarrow \\zeta = \\dfrac{" + tx(a1) + "}{2\\cdot" + tx(wn, 4) + "} = " + tx(z, 4) + "$ (undirdempað, $0<\\zeta<1$).</p>"),
        num("", "Tímastuðull $\\tau$?", tau2, "s", "<p>Pólarnir eru $s = -\\zeta\\omega_n \\pm j\\omega_n\\sqrt{1-\\zeta^2} = -" + tx(z * wn, 4) + " \\pm " + tx(wd, 4) + "j$, svo $\\tau = \\dfrac{1}{\\zeta\\omega_n} = " + tx(tau2, 4) + "$ s.</p>"),
        num("", "Tími hæsta yfirskots $T_p$?", Tp, "s", "<p>$T_p = \\dfrac{\\pi}{\\omega_n\\sqrt{1-\\zeta^2}} = \\dfrac{\\pi}{" + tx(wd, 4) + "} = " + tx(Tp, 4) + "$ s.</p>"),
        num("", "Hæsta yfirskot sem hlutfall af jafnvægisgildi?", Mp, "%", "<p>$M_p = e^{-\\zeta\\pi/\\sqrt{1-\\zeta^2}} = " + tx(Mp / 100, 4) + "$, þ.e. $" + tx(Mp, 3) + "\\,\\%$. Hámarksgildið er $" + tx(K2 * (1 + Mp / 100), 4) + "$.</p>", 0.03, 0.3),
      ]),
    };
  }

  /* ---------- Spurning 2: líkanagerð ---------- */
  function rcSvg(R1, R2, C, V1, V2) {
    return '<svg class="diagram" viewBox="0 0 600 210" role="img" aria-label="Rafrás: V1 og R1 að hnút, R2 og C niður í jörð, rofi S að V2">' +
      '<line class="ln" x1="50" y1="40" x2="120" y2="40"/><rect class="box" x="120" y="28" width="80" height="24"/><text x="160" y="22" text-anchor="middle">R₁ = ' + is(R1) + ' kΩ</text>' +
      '<line class="ln" x1="200" y1="40" x2="420" y2="40"/><circle class="dot" cx="260" cy="40" r="3.5"/><circle class="dot" cx="350" cy="40" r="3.5"/>' +
      '<line class="ln" x1="420" y1="40" x2="458" y2="22"/><circle class="sum" cx="420" cy="40" r="3"/><circle class="sum" cx="462" cy="40" r="3"/><text x="440" y="16" text-anchor="middle">S (opnast t = 0)</text>' +
      '<line class="ln" x1="465" y1="40" x2="540" y2="40"/>' +
      '<line class="ln" x1="50" y1="40" x2="50" y2="85"/><circle class="sum" cx="50" cy="105" r="20"/><text x="50" y="100" text-anchor="middle" class="small">+</text><text x="50" y="118" text-anchor="middle" class="small">−</text><text x="78" y="110">' + is(V1) + ' V</text><line class="ln" x1="50" y1="125" x2="50" y2="180"/>' +
      '<line class="ln" x1="260" y1="40" x2="260" y2="80"/><rect class="box" x="248" y="80" width="24" height="56"/><text x="236" y="113" text-anchor="end">R₂ = ' + is(R2) + ' kΩ</text><line class="ln" x1="260" y1="136" x2="260" y2="180"/>' +
      '<line class="ln" x1="350" y1="40" x2="350" y2="100"/><line class="ln" x1="330" y1="100" x2="370" y2="100"/><line class="ln" x1="330" y1="112" x2="370" y2="112"/><line class="ln" x1="350" y1="112" x2="350" y2="180"/><text x="382" y="98">+</text><text x="382" y="112">u</text><text x="382" y="128">−</text><text x="312" y="111" text-anchor="end">' + is(C) + ' µF</text>' +
      '<line class="ln" x1="540" y1="40" x2="540" y2="85"/><circle class="sum" cx="540" cy="105" r="20"/><text x="540" y="100" text-anchor="middle" class="small">+</text><text x="540" y="118" text-anchor="middle" class="small">−</text><text x="512" y="110" text-anchor="end">' + is(V2) + ' V</text><line class="ln" x1="540" y1="125" x2="540" y2="180"/>' +
      '<line class="ln" x1="50" y1="180" x2="540" y2="180"/></svg>';
  }

  function q2() {
    var v = pick(["tankur", "rc", "varmi"]);
    if (v === "tankur") {
      var A = pick([10, 20, 25, 30, 40, 50]), R = pick([5, 8, 10, 12, 15, 20]), h0 = pick([1, 2, 2.5, 3, 4]), dq = pick([0.02, 0.04, 0.05, 0.1]);
      var tau = A * R, h1 = h0 + R * dq;
      return {
        n: 2, weight: 15, title: "Líkan af vatnstanki",
        html: "<p>Vatn rennur inn í tank með innflæði $q_1(t)$ og út um þrengingu með útflæði $q_2(t)$. Vatnshæðin er $h(t)$ og jafnvægishæðin er $h_0 = " + tx(h0) + "$ m. Nálægt henni gildir $q_2 = h/R$ með $R = " + tx(R) + "\\ \\mathrm{s/m^2}$. Botnflötur tanksins er $A = " + tx(A) + "\\ \\mathrm{m^2}$ og vökvatregða er óveruleg. Innflæðið er skyndilega aukið um $" + tx(dq) + "\\ \\mathrm{m^3/s}$.</p>",
        parts: labelParts([
          mc("", "Hvaða diffurjafna lýsir sambandi $q_1$ og $h$ nálægt jafnvægishæðinni?",
            ["$AR\\,\\dot h + h = R\\,q_1$", "$A\\,\\dot h + R\\,h = q_1$", "$AR\\,\\dot h + h = q_1/R$", "$A\\,\\dot h + h = R\\,q_1$"],
            "Massajafnvægi: $A\\dot h = q_1 - q_2 = q_1 - h/R$. Margföldum með $R$: $AR\\,\\dot h + h = R\\,q_1$. Fyrstu gerðar með $\\tau = AR$ og mögnun $R$."),
          num("", "Hver er tímastuðull kerfisins?", tau, "s", "<p>$\\tau = AR = " + tx(A) + "\\cdot" + tx(R) + " = " + tx(tau) + "$ s.</p>"),
          num("", "Hver verður hæðin í nýju jafnvægi?", h1, "m", "<p>Í jafnvægi er $\\dot h = 0$: $\\Delta h = R\\,\\Delta q_1 = " + tx(R) + "\\cdot" + tx(dq) + " = " + tx(R * dq, 3) + "$ m, svo $h = " + tx(h0) + " + " + tx(R * dq, 3) + " = " + tx(h1, 4) + "$ m.</p>"),
          num("", "Eftir hve margar mínútur nær hæðin jafnvægi ($4\\tau$)?", (4 * tau) / 60, "mín", "<p>$4\\tau = " + tx(4 * tau) + "$ s $= " + tx((4 * tau) / 60, 4) + "$ mín.</p>"),
        ]),
      };
    }
    if (v === "rc") {
      var R1 = pick([2, 4, 5, 8, 10]), R2 = pick([1, 2, 3, 5, 10]), Cu = pick([0.5, 1, 2, 4.7, 10]), V1 = pick([10, 12, 20, 24, 30]), V2 = pick([5, 10, 15, 20, 30]);
      if (V1 === V2) V2 = V2 === 30 ? 15 : V2 + 5;
      var Rth = (R1 * R2) / (R1 + R2), tauMs = Rth * Cu, uInf = (V1 * R2) / (R1 + R2);
      return {
        n: 2, weight: 15, title: "RC-rás með rofa",
        html: "<p>Spennulindin $V_1 = " + tx(V1) + "$ V tengist efri hnútnum um $R_1 = " + tx(R1) + "\\ \\mathrm{k\\Omega}$. Frá hnútnum liggja $R_2 = " + tx(R2) + "\\ \\mathrm{k\\Omega}$ og þéttirinn $C = " + tx(Cu) + "\\ \\mu\\mathrm F$ niður í jörð, og spennulindin $V_2 = " + tx(V2) + "$ V tengist hnútnum beint í gegnum rofann S. Í upphafi er rofinn lokaður og rásin í jafnvægi. Við $t = 0$ er hann opnaður. Spennan yfir þéttinn er $u(t)$.</p>" + rcSvg(R1, R2, Cu, V1, V2),
        parts: labelParts([
          num("", "Hver er spennan yfir þéttinn áður en rofinn er opnaður?", V2, "V", "<p>Hugsjón spennulind $V_2$ liggur beint yfir þéttinn meðan rofinn er lokaður, svo $u(0^-) = V_2 = " + tx(V2) + "$ V. Í jafnvægi rennur enginn straumur í þéttinum.</p>"),
          mc("", "Hvaða diffurjafna gildir fyrir $u(t)$ eftir að rofinn er opnaður?",
            ["$\\dfrac{V_1 - u}{R_1} = \\dfrac{u}{R_2} + C\\dot u$", "$\\dfrac{V_1 - u}{R_1 + R_2} = C\\dot u$", "$R_1C\\,\\dot u + u = V_1$", "$\\dfrac{V_1 - u}{R_1} + \\dfrac{u}{R_2} = C\\dot u$"],
            "Straumur inn í hnútinn um $R_1$ jafngildir straumi út um $R_2$ og þéttinn. Það jafngildir $R_{th}C\\,\\dot u + u = \\frac{R_2}{R_1+R_2}V_1$ með $R_{th} = R_1\\parallel R_2$."),
          num("", "Hver er tímastuðullinn eftir að rofinn er opnaður?", tauMs, "ms", "<p>$\\tau = (R_1\\parallel R_2)\\,C = \\dfrac{" + tx(R1) + "\\cdot" + tx(R2) + "}{" + tx(R1) + "+" + tx(R2) + "}\\ \\mathrm{k\\Omega}\\cdot" + tx(Cu) + "\\ \\mu\\mathrm F = " + tx(Rth, 4) + "\\ \\mathrm{k\\Omega}\\cdot" + tx(Cu) + "\\ \\mu\\mathrm F = " + tx(tauMs, 4) + "$ ms.</p>"),
          num("", "Hvert er jafnvægisgildi $u(t)$ eftir að rofinn er opnaður?", uInf, "V", "<p>Í jafnvægi er $\\dot u = 0$ og spennudeilirinn gefur $u_\\infty = \\dfrac{R_2}{R_1+R_2}V_1 = \\dfrac{" + tx(R2) + "}{" + tx(R1 + R2) + "}\\cdot" + tx(V1) + " = " + tx(uInf, 4) + "$ V.</p>"),
        ]),
      };
    }
    // Varmi: ofn
    var Rt = pick([0.02, 0.05, 0.1, 0.2]), Ct = pick([2000, 5000, 10000, 20000]), P = pick([100, 200, 500, 1000]), T2 = pick([15, 20]);
    var tauT = Rt * Ct, Tinf = T2 + Rt * P;
    return {
      n: 2, weight: 15, title: "Varmalíkan af ofni",
      html: "<p>Ofn með varmarýmd $C = " + tx(Ct) + "$ J/°C er hitaður með hitaeiningu sem gefur varmaflæðið $P = " + tx(P) + "$ W. Veggir ofnsins hafa varmaviðnám $R = " + tx(Rt) + "$ °C/W og hitinn fyrir utan er fastur, $T_2 = " + tx(T2) + "$ °C. Í upphafi er ofninn kaldur ($T_1 = T_2$) og kveikt er á hitaranum við $t = 0$. Hitinn inni í ofninum er $T_1$.</p>",
      parts: labelParts([
        mc("", "Hvaða diffurjafna lýsir $T_1$?",
          ["$RC\\,\\dot T_1 + T_1 = RP + T_2$", "$C\\,\\dot T_1 + RT_1 = P + T_2$", "$RC\\,\\dot T_1 + T_1 = P/R + T_2$", "$RC\\,\\ddot T_1 + \\dot T_1 + T_1 = RP$"],
          "Orkujafnvægi: $P - \\dfrac{T_1 - T_2}{R} = C\\dot T_1$. Margföldum með $R$. Varmakerfi hafa enga tregðu og eru því fyrstu gerðar."),
        num("", "Hver er tímastuðullinn?", tauT, "s", "<p>$\\tau = RC = " + tx(Rt) + "\\cdot" + tx(Ct) + " = " + tx(tauT) + "$ s.</p>"),
        num("", "Hver verður hitinn í ofninum í jafnvægi?", Tinf, "°C", "<p>$\\dot T_1 = 0$: $T_1 = T_2 + RP = " + tx(T2) + " + " + tx(Rt) + "\\cdot" + tx(P) + " = " + tx(Tinf, 4) + "$ °C.</p>"),
        num("", "Eftir hve margar mínútur er ofninn kominn í jafnvægi ($4\\tau$)?", (4 * tauT) / 60, "mín", "<p>$4\\tau = " + tx(4 * tauT) + "$ s $= " + tx((4 * tauT) / 60, 4) + "$ mín.</p>"),
      ]),
    };
  }

  /* ---------- Spurning 3: val á hreyfli og nema ---------- */
  function motor(va) {
    var m = { kt: pick([0.05, 0.08, 0.1, 0.12, 0.15, 0.2]), kfk: pick([5, 8, 10, 12, 15, 20]), R: pick([0.5, 1, 1.5, 2, 2.5, 3]) };
    m.kf = m.kfk / (1000 * RPM2RAD);
    m.ts = (m.kt / m.R) * va;
    m.w0 = va / m.kf;
    m.rpm0 = m.w0 / RPM2RAD;
    m.P = (m.ts * m.w0) / 4;
    return m;
  }

  function q3() {
    for (var tries = 0; tries < 500; tries++) {
      var va = pick([10, 12, 24]);
      var type = pick(["ts", "P"]);
      var mA = motor(va), mB = motor(va);
      var vAm = type === "ts" ? mA.ts : mA.P, vBm = type === "ts" ? mB.ts : mB.P;
      var lo = Math.min(vAm, vBm), hi = Math.max(vAm, vBm);
      if (hi / lo < 1.3) continue;
      var X = nice(Math.sqrt(lo * hi));
      if (!(X > lo * 1.05 && X < hi * 0.95)) continue;
      var goodM = vAm >= X ? "A" : "B", chosen = goodM === "A" ? mA : mB;
      // Nemar
      var Tmax = pick([50, 100, 200]), D = pick([10, 15, 20, 25, 30]);
      var ranges = [1000, 1500, 2000, 3000, 5000].filter(function (r) { return r >= chosen.rpm0 * 1.05; });
      if (!ranges.length) continue;
      var gRange = pick(ranges);
      var gTaus = [5, 10, 15, 20, 25, 40].filter(function (t) { return 4 * t < Tmax; });
      var gLins = [0.25, 0.5, 1, 1.5, 2].filter(function (l) { return (l / 100) * gRange < D; });
      if (!gTaus.length || !gLins.length) continue;
      var good = { range: gRange, tau: pick(gTaus), lin: pick(gLins) };
      var fail = pick(["tid", "lin", "svid"]);
      var bad;
      if (fail === "tid") {
        var bt = [10, 15, 20, 25, 40, 50, 60, 80].filter(function (t) { return 4 * t > Tmax * 1.1; });
        var br = pick(ranges);
        var bl = [0.25, 0.5, 1, 1.5, 2].filter(function (l) { return (l / 100) * br < D; });
        if (!bt.length || !bl.length) continue;
        bad = { range: br, tau: pick(bt), lin: pick(bl) };
      } else if (fail === "lin") {
        var br2 = pick(ranges);
        var bl2 = [0.5, 1, 1.5, 2, 3].filter(function (l) { return (l / 100) * br2 > D * 1.1; });
        if (!bl2.length) continue;
        bad = { range: br2, tau: pick(gTaus), lin: pick(bl2) };
      } else {
        var low = [500, 750, 1000, 1500, 2000].filter(function (r) { return r < chosen.rpm0 * 0.95; });
        if (!low.length) continue;
        var br3 = pick(low);
        var bl3 = [0.25, 0.5, 1].filter(function (l) { return (l / 100) * br3 < D; });
        bad = { range: br3, tau: pick(gTaus), lin: pick(bl3) };
      }
      var ok = function (s) { return 4 * s.tau <= Tmax && (s.lin / 100) * s.range <= D && s.range >= chosen.rpm0; };
      if (!ok(good) || ok(bad)) continue;
      var goodS = Math.random() < 0.5 ? "A" : "B";
      var sA = goodS === "A" ? good : bad, sB = goodS === "A" ? bad : good;
      var badM = goodM === "A" ? "B" : "A", badS = goodS === "A" ? "B" : "A";
      var reqTxt = type === "ts" ? "Upphafsvægi hreyfilsins þarf að vera a.m.k. $" + tx(X) + "$ Nm" : "Hámarksafl hreyfilsins þarf að vera a.m.k. $" + tx(X) + "$ W";
      var row = function (lab, a, b) { return "<tr><td>" + lab + '</td><td class="num">' + a + '</td><td class="num">' + b + "</td></tr>"; };
      var html = "<p>Stýra á hraða færibands. Velja þarf jafnstraumshreyfil og snúningshraðanema. " + reqTxt + ". Neminn þarf að komast í jafnvægi ($4\\tau$) á innan við " + Tmax + " ms, frávik frá línuleika má ekki vera meira en " + D + " RPM og mælisviðið þarf að ná upp í lausagangshraða hreyfilsins sem verður fyrir valinu.</p>" +
        '<div class="tablewrap"><table><thead><tr><th></th><th class="num">Hreyfill A</th><th class="num">Hreyfill B</th></tr></thead><tbody>' +
        row("Innspenna $v_a$", va + " V", va + " V") + row("Vægisstuðull $K_\\tau$", is(mA.kt) + " Nm/A", is(mB.kt) + " Nm/A") +
        row("Spennustuðull $K_f$", mA.kfk + " V/1000 RPM", mB.kfk + " V/1000 RPM") + row("Viðnám akkerisrásar $R$", is(mA.R) + " Ω", is(mB.R) + " Ω") + row("Span $L$", "óverulegt", "óverulegt") +
        '</tbody></table></div><div class="tablewrap"><table><thead><tr><th></th><th class="num">Nemi A</th><th class="num">Nemi B</th></tr></thead><tbody>' +
        row("Mælisvið", "0-" + sA.range + " RPM", "0-" + sB.range + " RPM") + row("Úttak", "0-5 V", "0-5 V") + row("Tímastuðull", sA.tau + " ms", sB.tau + " ms") + row("Frávik frá línuleika", is(sA.lin) + " %", is(sB.lin) + " %") +
        "</tbody></table></div>";
      var mtxt = function (lab, m) { return "Hreyfill " + lab + ": $\\tau_s = " + tx(m.ts, 3) + "$ Nm, $\\omega_0 = " + tx(m.w0, 3) + "$ rad/s ($" + tx(m.rpm0, 3) + "$ RPM), $P_{max} = " + tx(m.P, 3) + "$ W."; };
      var stxt = function (lab, s) { return "Nemi " + lab + ": $4\\tau = " + 4 * s.tau + "$ ms, frávik $" + tx(s.lin / 100) + "\\cdot" + s.range + " = " + tx((s.lin / 100) * s.range, 3) + "$ RPM, mælisvið " + s.range + " RPM."; };
      var failTxt = fail === "tid" ? "er of hægur" : fail === "lin" ? "hefur of mikið frávik frá línuleika" : "hefur of þröngt mælisvið fyrir lausagangshraðann";
      var metricName = type === "ts" ? "upphafsvægi $\\tau_s$" : "hámarksafl $P_{max}$";
      return {
        n: 3, weight: 15, title: "Val á hreyfli og nema",
        html: html,
        meta: { motorOk: [vAm >= X, vBm >= X], sensorOk: [ok(sA), ok(sB)] },
        parts: labelParts([
          mc("", "Hvorn hreyfilinn veljið þið?", ["Hreyfil " + goodM, "Hreyfil " + badM, "Hvorugan, hvorugur uppfyllir kröfuna"],
            "$\\tau_s = \\frac{K_\\tau}{R}v_a$, $\\omega_0 = v_a/K_f$ ($K_f$ deilt með 104,72 til að fá V·s/rad) og $P_{max} = \\tau_s\\omega_0/4$. " + mtxt("A", mA) + " " + mtxt("B", mB) + " Aðeins hreyfill " + goodM + " nær kröfunni."),
          mc("", "Hvorn nemann veljið þið?", ["Nema " + goodS, "Nema " + badS, "Hvorn sem er, báðir uppfylla kröfurnar"],
            stxt("A", sA) + " " + stxt("B", sB) + " Lausagangshraði hreyfils " + goodM + " er um $" + tx(chosen.rpm0, 3) + "$ RPM. Nemi " + badS + " " + failTxt + "."),
          num("", "Hvert er " + metricName + " hreyfilsins sem þið völduð?", type === "ts" ? chosen.ts : chosen.P, type === "ts" ? "Nm" : "W",
            "<p>" + mtxt(goodM, chosen) + "</p>"),
        ]),
      };
    }
    throw new Error("q3: fann ekki gildar töflur");
  }

  /* ---------- Spurning 4: blokkrit og P-stýring ---------- */
  function q4() {
    var v = pick(["tankur", "hreyfill", "ferli"]);
    if (v === "tankur") {
      var KL = pick([1 / 60, 1 / 50, 1 / 40, 1 / 30]), tl = pick([10, 20, 30, 40]), A = pick([0.5, 1, 2]), K = pick([2, 3, 5, 8]);
      var g = (K * KL) / A;
      var x = (-1 + Math.sqrt(1 + 4 * tl * tl * g * g)) / (2 * tl * tl), wc = Math.sqrt(x);
      var pm = 90 - deg(Math.atan(tl * wc)), Lmax = rad(pm) / wc;
      var KLt = "\\tfrac{1}{" + Math.round(1 / KL) + "}";
      return {
        n: 4, weight: 15, title: "Vatnshæð með P-stýringu",
        html: "<p>Inntakið $U$ stýrir loka sem gefur innflæðið $Q_{inn}$ inn í tank með botnflöt $A = " + tx(A) + "\\ \\mathrm{m^2}$. Útflæðið $Q_{ut}$ dregst frá. Hæðinni $H$ er stýrt með P-stýringu $K = " + K + "$ og afturvirkni með nema $G_N = 1$:</p>" +
          "$$G_L(s) = \\frac{K_L}{\\tau_Ls+1},\\quad G_P(s) = \\frac{1}{As},\\qquad K_L = " + KLt + ",\\ \\tau_L = " + tl + "\\ \\mathrm s$$" +
          loopSvg({ inp: "R", out: "H", blocks: ["K", { t: "G", sub: "L" }, { t: "G", sub: "P" }], sig: ["E", "U", { t: "Q", sub: "inn" }], dist: { after: 1, label: { t: "Q", sub: "ut" }, sign: "−" }, fb: { t: "G", sub: "N" } }, "Blokkrit: óskgildi, P-stýring, loki, tankur og afturvirkni"),
        parts: labelParts([
          num("", "Hver er skekkjan í jafnvægi (í m) eftir þrepabreytingu í óskgildi um 1 m?", 0, "m",
            "<p>$G_K = \\dfrac{K K_L}{s(\\tau_Ls+1)A}$ inniheldur heildi (tankurinn), svo lykkjan er af tegund 1 og $e_{ss} = \\lim_{s\\to0}\\dfrac{1}{1+G_K} = 0$. Lokaða kerfið er stöðugt (annarrar gerðar með jákvæðum stuðlum).</p>", 0, 0.005),
          num("", "Hver er skurðtíðni lykkjunnar $\\omega_c$?", wc, "rad/s",
            "<p>$|G_K(j\\omega_c)| = 1$: $\\omega_c\\sqrt{1+\\tau_L^2\\omega_c^2} = \\dfrac{KK_L}{A} = " + tx(g, 4) + "$. Með $x = \\omega_c^2$ fæst $\\tau_L^2x^2 + x - " + tx(g * g, 4) + " = 0$, svo $\\omega_c = " + tx(wc, 4) + "$ rad/s.</p>", 0.03),
          num("", "Hvert er fasaöryggið?", pm, "°",
            "<p>Fasinn við $\\omega_c$ er $-90^\\circ - \\arctan(\\tau_L\\omega_c) = " + tx(-90 - deg(Math.atan(tl * wc)), 4) + "^\\circ$, svo $\\varphi_m = " + tx(pm, 3) + "^\\circ$.</p>", 0.03, 1.5),
          num("", "Í ljós kemur hrein seinkun $e^{-Ls}$ í lokanum. Hversu löng má hún mest vera (í s) áður en kerfið verður óstöðugt?", Lmax, "s",
            "<p>Seinkunin breytir ekki mögnuninni en dregur $\\omega L$ frá fasanum. Óstöðugt þegar $\\omega_cL > \\varphi_m$: $L_{max} = \\dfrac{" + tx(rad(pm), 3) + "}{" + tx(wc, 3) + "} = " + tx(Lmax, 3) + "$ s.</p>", 0.05),
        ]),
      };
    }
    if (v === "hreyfill") {
      var kt = pick([0.1, 0.12, 0.15, 0.2]), R = pick([1, 1.5, 2, 2.5]), kfk = pick([8, 10, 12, 15]), c = pick([0.01, 0.05, 0.1, 0.2, 0.5]), Kp = pick([2, 5, 10, 20]), dr = pick([5, 10, 20]);
      var kf = kfk / (1000 * RPM2RAD), G1 = kt / R, KM = G1 / (c + G1 * kf), ess = dr / (1 + Kp * KM);
      return {
        n: 4, weight: 15, title: "Hraðastýring jafnstraumshreyfils",
        html: "<p>Blokkrit jafnstraumshreyfils: $U$ innspenna, $V_f$ spanspenna, $T$ vægi og $\\Theta$ snúningsfærsla. $K_\\tau = " + tx(kt) + "$ Nm/A, $K_f = " + kfk + "$ V/1000 RPM, $R = " + tx(R) + "\\ \\Omega$, span óverulegt. Álagið hefur tregðu $I$ og deyfingu $c = " + tx(c) + "$ Nms/rad. Sett er upp P-stýring með $K = " + Kp + "$ á <b>snúningshraða</b> ($H(s) = 1$).</p>" +
          loopSvg({ inp: "U", out: "Θ", blocks: [{ t: "G", sub: "1" }, { t: "G", sub: "2" }], sig: [null, "T"], fb: { t: "K", sub: "f", tail: "s" }, fbSig: { t: "V", sub: "f" } }, "Blokkrit hreyfils: G1, G2 og Kf s í afturvirkni"),
        parts: labelParts([
          num("", "Hvert er $G_1(s) = T/(U - V_f)$?", G1, "Nm/V", "<p>Með $L = 0$: $u - v_f = Ri$ og $T = K_\\tau i$, svo $G_1 = K_\\tau/R = " + tx(kt) + "/" + tx(R) + " = " + tx(G1, 4) + "$. ($G_2 = 1/(Is^2 + cs)$.)</p>"),
          num("", "Hver er stöðug mögnun hreyfilsins frá spennu til hraða, $G_M(0) = \\Omega/U$ við $s = 0$?", KM, "(rad/s)/V",
            "<p>$K_f = " + kfk + "/104{,}72 = " + tx(kf, 4) + "$ V·s/rad. $G_M(s) = \\dfrac{K_\\tau/R}{Is + c + K_\\tau K_f/R}$, svo $G_M(0) = \\dfrac{" + tx(G1, 4) + "}{" + tx(c) + " + " + tx(G1 * kf, 4) + "} = " + tx(KM, 4) + "$.</p>"),
          num("", "Hver er skekkjan í jafnvægi við breytingu á óskgildi um " + dr + " rad/s?", ess, "rad/s",
            "<p>Lykkjan er af tegund 0 (ekkert heildi frá spennu til hraða): $e_{ss} = \\dfrac{\\Delta r}{1 + KG_M(0)} = \\dfrac{" + dr + "}{1 + " + Kp + "\\cdot" + tx(KM, 4) + "} = " + tx(ess, 4) + "$ rad/s.</p>"),
          mc("", "Hvernig má eyða skekkjunni alveg?", ["Bæta I-lið (heildun) í stýringuna, t.d. PI", "Hækka $K$ nógu mikið", "Bæta D-lið í stýringuna", "Nota nákvæmari nema"],
            "Hærra $K$ minnkar skekkjuna en eyðir henni aldrei í lykkju af tegund 0. Heildun í stýringunni gerir lykkjuna að tegund 1, og þá verður $e_{ss} = 0$ við þrep."),
        ]),
      };
    }
    // Almennt ferli annarrar gerðar
    var Kpl = pick([1, 2, 2.5, 4]), T1 = pick([1, 2, 4, 5]), T2 = pick([0.2, 0.25, 0.5]), Kc = pick([2, 3, 4, 5, 8]);
    var Lg = function (w) { return (Kc * Kpl) / (Math.sqrt(1 + T1 * T1 * w * w) * Math.sqrt(1 + T2 * T2 * w * w)); };
    var wc2 = Kc * Kpl > 1 ? bisect(function (w) { return Lg(w) - 1 > 0 ? -1 : 1; }, 1e-4, 1e3) : 0;
    var pm2 = 180 - deg(Math.atan(T1 * wc2)) - deg(Math.atan(T2 * wc2));
    var e2 = 1 / (1 + Kc * Kpl);
    return {
      n: 4, weight: 15, title: "P-stýring á ferli annarrar gerðar",
      html: "<p>Ferli með yfirfærslufallið $G_P(s) = \\dfrac{" + tx(Kpl) + "}{(1+" + tx(T1) + "s)(1+" + tx(T2) + "s)}$ er stýrt með P-stýringu $K = " + Kc + "$ og afturvirkni með nema $G_N = 1$.</p>" +
        loopSvg({ inp: "R", out: "Y", blocks: ["K", { t: "G", sub: "P" }], sig: ["E", "U"], fb: { t: "G", sub: "N" } }, "Blokkrit: P-stýring og ferli með afturvirkni"),
      parts: labelParts([
        num("", "Hver er skekkjan í jafnvægi við einingarþrep í óskgildi?", e2, "",
          "<p>Tegund 0: $K_p = KG_P(0) = " + Kc + "\\cdot" + tx(Kpl) + " = " + tx(Kc * Kpl) + "$ og $e_{ss} = \\dfrac{1}{1+K_p} = " + tx(e2, 4) + "$.</p>"),
        num("", "Hver er skurðtíðni lykkjunnar $\\omega_c$?", wc2, "rad/s",
          "<p>$|G_K(j\\omega_c)| = \\dfrac{" + tx(Kc * Kpl) + "}{\\sqrt{1+" + tx(T1 * T1, 3) + "\\omega^2}\\sqrt{1+" + tx(T2 * T2, 3) + "\\omega^2}} = 1$ gefur $\\omega_c = " + tx(wc2, 4) + "$ rad/s.</p>", 0.03),
        num("", "Hvert er fasaöryggið?", pm2, "°",
          "<p>$\\varphi_m = 180^\\circ - \\arctan(" + tx(T1) + "\\omega_c) - \\arctan(" + tx(T2) + "\\omega_c) = " + tx(pm2, 3) + "^\\circ$.</p>", 0.03, 1.5),
        mc("", "Hvað gerist ef $K$ er tvöfaldað?", ["Skekkjan minnkar og svörunin verður hraðari, en fasaöryggið minnkar", "Skekkjan hverfur alveg", "Fasaöryggið eykst og yfirskotið minnkar", "Kerfið verður óstöðugt, því fasinn fer undir $-180^\\circ$"],
          "Hærra $K$ færir $\\omega_c$ til hægri þar sem fasinn er lægri. Kerfi annarrar gerðar fer þó aldrei undir $-180^\\circ$, svo það verður ekki óstöðugt, en sveiflur aukast. Skekkjan $1/(1+K_p)$ minnkar en hverfur ekki."),
      ]),
    };
  }

  /* ---------- Spurning 5: vinnuferli (skilningur) ---------- */
  var POOL5 = [
    { q: "Hver er munurinn á <b>þörfum</b> og <b>kröfum</b> í hönnun?",
      o: ["Þarfir eru markmið notenda á þeirra máli; kröfur eru þau markmið þýdd á mál hönnuðar og eiga að vera mælanlegar", "Þarfir eru tæknilegar og mælanlegar; kröfur eru óskir notenda", "Þarfir eiga við heildarkerfið en kröfur aðeins um einstakar einingar", "Enginn munur, orðin eru samheiti"],
      e: "Kafli 14: þarfir eru settar fram frá sjónarhóli notenda og eru óháðar tæknilausn. Kröfur (hönnunarforsendur) eru frá sjónarhóli hönnuðar og skulu allar vera mælanlegar." },
    { q: "Hvað er <b>sannprófun</b> (verification) hönnunar?",
      o: ["Að staðfesta að útfærslan uppfylli kröfurnar", "Að staðfesta að útfærslan uppfylli þarfir notenda", "Að herma líkanið einu sinni", "Að skrifa skýrslu um verkefnið"],
      e: "Sannprófun mælir hönnunina við kröfur hönnuðar. Réttmæti (validation) mælir hana við þarfir notenda." },
    { q: "Af hverju tryggir sannprófun ekki að hönnun sé <b>réttmæt</b>?",
      o: ["Kröfurnar endurspegla ekki endilega þarfirnar, sem geta líka verið huglægar og óljósar", "Af því að sannprófun er aðeins gerð á líkaninu", "Af því að réttmæti er aðeins metið af kennara", "Hún tryggir það alltaf ef allar kröfur standast"],
      e: "Kafli 14: ekki er öruggt að kröfur endurspegli þarfir og notandi getur ekki alltaf tjáð allar þarfir sínar á mælanlegan hátt." },
    { q: "Hvenær á að ákveða <b>hvernig</b> kerfið verður sannprófað?",
      o: ["Strax þegar kröfurnar eru skilgreindar, áður en hönnun hefst", "Eftir að stýringin hefur verið útfærð", "Eftir að líkanið hefur verið smíðað", "Aðeins ef kerfið stenst ekki prófanir"],
      e: "Í ferlinu í kafla 14 er skilgreint samhliða kröfunum hvernig þær skuli sannprófaðar (fyrsta skref einfaldaða ferlisins fyrir véleindakerfi)." },
    { q: "Hver er rétt röð einfaldaða hönnunarferlisins fyrir véleindakerfi (kafli 14)?",
      o: ["Skilgreina sannprófun → velja vélbúnað (nemi, hreyfill, tölva) → líkan og hönnun stýringar → útfæra og sannprófa, endurbæta", "Velja stýringu → smíða kerfið → gera líkan → skilgreina kröfur", "Gera líkan → velja vélbúnað → skilgreina kröfur → útfæra", "Útfæra stýringu → prófa → skilgreina kröfur → velja nema"],
      e: "Fyrst kröfur og hvernig á að sannprófa, svo val á einingum, svo líkan og stýringarhönnun, og loks útfærsla og sannprófun þar til kröfur standast." },
    { q: "Hvers vegna eru líkön notuð við hönnun?",
      o: ["Til að bera saman marga valkosti hratt og ódýrt án tilrauna á raunkerfinu", "Því líkön eru alltaf nákvæmari en mælingar", "Til að sleppa við að prófa raunkerfið", "Því kennslubókin krefst þess"],
      e: "Með líkönum má svara spurningum um hegðun án tilrauna og meta marga valkosti. Niðurstöðuna þarf samt að staðfesta með mælingum á útfærslunni." },
    { q: "Hver er helsti <b>takmarkandi</b> þáttur línulegra líkana í námskeiðinu?",
      o: ["Þau lýsa frávikum frá vinnupunkti og verða ónákvæmari eftir því sem frávikið er stærra", "Þau gilda aðeins fyrir rafrásir", "Þau geta ekki lýst kerfum annarrar gerðar", "Þau eru alltaf óstöðug"],
      e: "Kafli 4: stikarnir eru háðir vinnupunktinum og Taylor-nálgunin verður verri fjær honum. Mettun stýrimerkis og önnur ólínuleg áhrif eru ekki í líkaninu." },
    { q: "Hvað gerir þú ef útfærslan stenst ekki sannprófun?",
      o: ["Endurbæta líkanið eða stýringuna og sannprófa aftur þar til kröfur standast", "Lækka kröfurnar svo þær standist", "Skila samt, því líkanið stóðst", "Hætta við að nota afturvirkni"],
      e: "Hönnun er ekki lokið fyrr en útfærsla stenst sannprófun. Ferlið er ítrun: endurbæta hönnun eða líkan og prófa aftur." },
    { q: "Í heftinu er mælt með að byrja á <b>einfaldri</b> stýringu. Af hverju?",
      o: ["Til að kynnast kerfinu og samsvörun líkans og raunveruleika áður en flóknari stýringar eru reyndar", "Því einfaldar stýringar eru alltaf bestar", "Því PID-stýringar eru bannaðar í verkefninu", "Því einföld stýring þarf enga sannprófun"],
      e: "Kafli 14: misræmi milli líkans og raunveruleika eykst með flóknari stýringum, sem þurfa nákvæmari (og dýrari) líkön." },
    { q: "Hvernig tengjast <b>verklegu æfingarnar</b> (V1-V3) hönnunarverkefninu?",
      o: ["Þær kenndu að lesa nema og stýra hreyflum (lampa, viftu með PWM) með kóða á raunverulega vélbúnaðinum", "Þær kenndu Laplace-varpanir", "Þær voru eingöngu um Bode-rit", "Þær tengjast ekki hönnunarverkefninu"],
      e: "Verklegu æfingarnar voru á Raspberry Pi með LED, lampa, hita- og ljósnemum og viftu með PWM, þ.e. sami vélbúnaður og útfærsla stýringarinnar byggði á." },
    { q: "Hvernig tengjast <b>skilaverkefnin</b> (S1-S3) hönnunarverkefninu?",
      o: ["Þau þjálfuðu líkanagerð, svörun og hönnun stýringa í fræðilega heiminum (Colab), sem var notað til að hanna stýringuna", "Þau voru um að tengja víra", "Þau komu í stað hönnunarverkefnisins", "Þau fjölluðu aðeins um forritun án tengsla við kerfi"],
      e: "Skilaverkefnin voru unnin í Colab: diffurjöfnur, yfirfærsluföll, svörun og stýringar. Þau gáfu verkfærin til að hanna stýringuna á líkaninu." },
    { q: "Í hönnunarverkefninu var hitastigi stýrt með hitagjafa og viftu. Hvernig er eðlilegast að fá líkan af kerfinu?",
      o: ["Mæla þrepasvörun hitastigs við breytingu á duty cycle viftunnar og meta $K$, $\\tau$ (og seinkun) út frá henni", "Leiða það út frá Maxwell-jöfnunum", "Gera ráð fyrir að kerfið sé annarrar gerðar með $\\zeta = 0{,}7$", "Líkan er óþarft, nóg er að prófa $K$-gildi"],
      e: "Kerfisgreining út frá mælingum (kafli 4): koma kerfinu í vinnupunkt, breyta inntaki og mæla úttakið þar til nýtt jafnvægi næst." },
    { q: "Hvað er <b>vinnupunktur</b> og af hverju skiptir hann máli í hönnunarverkefninu?",
      o: ["Jafnvægisástand sem líkanið er línulegað um; hegðunin (t.d. $K$ og $\\tau$) getur verið önnur við 20 % og 80 % duty cycle", "Sá tími sem stýringin keyrir", "Hæsta hitastig sem kerfið þolir", "Gildið á $K$ sem gefur 45° fasaöryggi"],
      e: "Línulegt líkan lýsir frávikum frá jafnvægi. Því þarf að sannprófa við fleiri en einn vinnupunkt." },
    { q: "Hvaða mælikvarðar henta best til að meta frammistöðu stýringar sem á að fylgja breytingum í óskgildi?",
      o: ["Mælikvarðar sem tengjast kröfunum beint, t.d. rístími, yfirskot, skekkja í jafnvægi og stærð stýrimerkis", "Fjöldi lína í kóðanum", "Hversu oft forritið var keyrt", "Litur grafanna"],
      e: "Mælikvarðar eiga að vera valdir og rökstuddir út frá hönnunarkröfum (eins og beðið var um í hönnunarverkefninu)." },
    { q: "Sinuslaga truflun var bætt við hitamælinguna. Hvaða eiginleiki stýrikerfisins skiptir þá mestu máli?",
      o: ["Deyfing truflana í mælingunni: lykkjan má ekki elta suðið, svo lægri mögnun við tíðni truflunarinnar er betri", "Skekkja í jafnvægi við fláa", "Stöðugleiki hreyfilsins án afturvirkni", "Upphafsvægi viftunnar"],
      e: "Truflun í mælingu fer beint inn í lykkjuna. Há mögnun lykkjunnar við tíðni truflunarinnar lætur kerfið bregðast við suðinu í stað raunverulegs hitastigs (kafli 17)." },
    { q: "Hvað einkennir <b>véleindakerfi</b> (kafli 3)?",
      o: ["Vélrænt kerfi, nemi, hreyfill og tölva sem stýrir með afturvirkni", "Eingöngu rafrásir", "Kerfi þar sem fólk er hluti af kerfinu", "Kerfi án skynjara"],
      e: "Dæmigerðar einingar: vélrænt kerfi sem á að stýra, nemi, hreyfill og tölva sem les mælingar og stýrir hreyflinum." },
    { q: "Hvers vegna mynda kröfur oft <b>stigveldi</b>?",
      o: ["Kröfur heildarkerfisins skilgreina kröfur til eininganna, sem geta sjálfar verið kerfi úr mörgum einingum", "Því sumar kröfur eru mikilvægari en aðrar", "Því kennarinn raðar þeim eftir vægi", "Kröfur mynda aldrei stigveldi"],
      e: "Kafli 2 og 14: tæknileg kerfi eru samsett úr einingum sem eru sjálfar tæknileg kerfi, og kröfurnar fylgja sama stigveldi." },
  ];

  function q5() {
    var items = shuffle(POOL5.slice()).slice(0, 5);
    return {
      n: 5, weight: 20, title: "Vinnuferli og hönnunarverkefnið",
      html: "<p>Spurningarnar hér byggja á vinnuferli hönnunar (kafli 14), hlutverki líkana og því hvernig hlutar námskeiðsins tengjast hönnunarverkefninu.</p>" +
        '<div class="note"><p><b class="t">Á raunverulega prófinu</b> er þessi spurning skrifleg og á að rökstyðja með efni úr heftinu og eigin reynslu. Hér eru skilningsspurningar úr sama efni. Æfðu skriflega svarið með <a href="honnun.html#s5">beinagrindinni og undirbúningsblaðinu</a>.</p></div>',
      parts: labelParts(items.map(function (it) { return mc("", it.q, it.o.slice(), it.e); })),
    };
  }

  /* ---------- Spurning 6: val á stýringu ---------- */
  var VERIFY = function () { return mc("", "Hvernig er best að sannprófa að kerfið uppfylli hönnunarforsendurnar?",
    ["Á líkaninu (Bode-rit $G_CG_K$ fyrir stöðugleika og hermd þrepasvörun fyrir rístíma, yfirskot og skekkju), og svo með þrepaprófunum á raunkerfinu við fleiri en einn vinnupunkt, borið saman við kröfurnar",
     "Nóg er að Bode-rit líkansins uppfylli kröfurnar, því líkanið lýsir kerfinu nákvæmlega",
     "Spyrja notendur hvort þeir séu sáttir við kerfið",
     "Hækka $K$ þar til kerfið sveiflast og lækka það svo um helming"],
    "Sannprófun (kafli 14) ber útfærsluna saman við kröfurnar. Líkanið er línuleg nálgun um vinnupunkt, svo prófa þarf raunkerfið líka og við fleiri vinnupunkta, og athuga stýrimerkið (mettun) og suð. Að spyrja notendur er réttmæti, ekki sannprófun."); };

  function q6(uid) {
    var id = uid + "-q6";
    if (Math.random() < 0.5) {
      // (A) Bode-rit lykkju með heildi
      for (var tries = 0; tries < 400; tries++) {
        var T1 = pick([0.4, 0.5, 1, 2]), T2 = T1 * pick([0.2, 0.25, 0.4, 0.5]);
        var ph = function (w) { return -90 - deg(Math.atan(w * T1)) - deg(Math.atan(w * T2)); };
        var pmTarget = uni(45, 62);
        var w0 = bisect(function (w) { return 180 + ph(w) - pmTarget > 0 ? -1 : 1; }, 1e-4, 1e3);
        var K = nice(w0 * Math.sqrt(1 + w0 * w0 * T1 * T1) * Math.sqrt(1 + w0 * w0 * T2 * T2));
        var mag = function (w) { return K / (w * Math.sqrt(1 + w * w * T1 * T1) * Math.sqrt(1 + w * w * T2 * T2)); };
        var wc0 = bisect(function (w) { return mag(w) - 1 > 0 ? -1 : 1; }, 1e-4, 1e3);
        var pm0 = 180 + ph(wc0), gm0 = (T1 + T2) / (K * T1 * T2);
        var variant = Math.random() < 0.6 ? "PD" : "P";
        var f = variant === "PD" ? uni(2.5, 3.6) : uni(1.2, 1.6);
        var Y = nice(1.4 / (wc0 * f)), wcReq = 1.4 / Y, pmP = 180 + ph(wcReq);
        var X;
        if (variant === "PD") {
          X = pick([55, 60]);
          if (pmP > X - 15 || X - pmP > 75) continue;
        } else {
          X = Math.floor((pmP - 5) / 5) * 5;
          if (X < 30 || X > pm0) continue;
        }
        var tfStr = nice(K) + "/(s(1+" + T1 + "s)(1+" + nice(T2) + "s))";
        var specs = "fasaöryggi a.m.k. $" + X + "^\\circ$, rístími undir $" + tx(Y) + "$ s og engin skekkja í jafnvægi við þrepabreytingu í óskgildi";
        var lead = X - pmP;
        var expl = variant === "PD"
          ? "Fasinn byrjar í $-90^\\circ$, svo lykkjan inniheldur heildi (tegund 1) og skekkjan er þegar 0; enginn I-liður þarf. Til að ná rístímakröfunni þarf $\\omega_c \\approx 1{,}4/" + tx(Y) + " = " + tx(wcReq, 3) + "$ rad/s, en þar er fasinn $" + tx(ph(wcReq), 3) + "^\\circ$ og P-stýring gæfi aðeins $\\varphi_m \\approx " + tx(pmP, 3) + "^\\circ$. Það vantar um $" + tx(lead, 2) + "^\\circ$ fasahækkun: PD-stýring."
          : "Fasinn byrjar í $-90^\\circ$ (heildi, tegund 1), svo skekkjan er þegar 0. Þarf $\\omega_c \\approx 1{,}4/" + tx(Y) + " = " + tx(wcReq, 3) + "$ rad/s; þar er fasinn $" + tx(ph(wcReq), 3) + "^\\circ$ svo $\\varphi_m \\approx " + tx(pmP, 3) + "^\\circ \\ge " + X + "^\\circ$. Nóg er að hækka mögnunina: P-stýring. Hafðu stýringuna eins einfalda og hægt er.";
        var parts = [
          mc("", "Hvaða gerð af stýringu mynduð þið hanna (P, PD, PI eða PID)?", variant === "PD" ? ["PD", "P", "PI", "PID"] : ["P", "PD", "PI", "PID"], expl),
          num("", "Hvaða skurðtíðni $\\omega_c$ þarf lykkjan um það bil að fá til að ná rístímakröfunni?", wcReq, "rad/s",
            "<p>Þumalputtareglan $t_r \\approx 1{,}4/\\omega_c$ gefur $\\omega_c \\approx 1{,}4/" + tx(Y) + " = " + tx(wcReq, 3) + "$ rad/s, um $" + tx(wcReq / wc0, 2) + "$ sinnum hærri en nú.</p>", 0.03),
        ];
        if (variant === "PD") parts.push(num("", "Hversu mikla fasahækkun (°) þarf stýringin að gefa við þá skurðtíðni til að ná fasaöryggiskröfunni?", lead, "°",
          "<p>Fasi lykkjunnar við $" + tx(wcReq, 3) + "$ rad/s: $-90^\\circ - \\arctan(" + T1 + "\\omega) - \\arctan(" + tx(T2, 3) + "\\omega) = " + tx(ph(wcReq), 3) + "^\\circ$. P-stýring gæfi $\\varphi_m = " + tx(pmP, 3) + "^\\circ$, svo það vantar $" + X + " - " + tx(pmP, 3) + " = " + tx(lead, 3) + "^\\circ$.</p>", 0.05, 2.5));
        else parts.push(num("", "Hvert verður fasaöryggið (°) ef $K$ er hækkað svo $\\omega_c$ verði sú tíðni?", pmP, "°",
          "<p>Fasinn við $" + tx(wcReq, 3) + "$ rad/s er $" + tx(ph(wcReq), 3) + "^\\circ$, svo $\\varphi_m = 180^\\circ + (" + tx(ph(wcReq), 3) + "^\\circ) = " + tx(pmP, 3) + "^\\circ$.</p>", 0.04, 2));
        parts.push(VERIFY());
        return {
          n: 6, weight: 20, title: "Val á stýringu út frá Bode-riti",
          html: "<p>Þið hafið smíðað líkan af einingum kerfisins (hreyfill, vélrænt kerfi, nemi). Myndin sýnir Bode-rit lykkjunnar $G_K$ <b>án stýringar</b>. Af því má lesa mögnunaröryggi $" + tx(gm0, 2) + "$, fasaöryggi $" + tx(pm0, 2) + "^\\circ$ og $\\omega_c = " + tx(wc0, 2) + "$ rad/s, sem gefur rístíma um $" + tx(1.4 / wc0, 2) + "$ s. Hönnunarforsendur: " + specs + ".</p>" +
            '<canvas class="plot" id="' + id + '" role="img" aria-label="Bode-rit lykkjunnar án stýringar"></canvas>',
          parts: labelParts(parts),
          setup: function (el) {
            var C = window.Ctrl, cv = document.getElementById(id);
            if (!C || !cv) return;
            var G = C.tfFrom(tfStr);
            var draw = function () {
              var m = C.margins(G.at, 1e-2, 1e3);
              C.drawBode(cv, m.data, { lo: Math.min(0.1, wc0 / 20), hi: Math.max(100, wc0 * 100), wc: m.wc, pm: m.pm, wpi: m.wpi, aspect: 0.72 });
            };
            draw();
            C.onRedraw(cv, draw);
          },
        };
      }
    }
    // (B) Opin þrepasvörun ferlis af tegund 0
    var z = pick([0.45, 0.5, 0.55, 0.6, 0.65]), wn = pick([0.8, 1, 1.25, 1.5, 2]), Kpl = pick([1, 1, 2]);
    var wd = wn * Math.sqrt(1 - z * z);
    var y = function (t) { return Kpl * (1 - Math.exp(-z * wn * t) * (Math.cos(wd * t) + (z / Math.sqrt(1 - z * z)) * Math.sin(wd * t))); };
    var t10 = 0, t90 = 0;
    for (var t = 0; t < 50; t += 0.001) { var yy = y(t) / Kpl; if (!t10 && yy >= 0.1) t10 = t; if (yy >= 0.9) { t90 = t; break; } }
    var tr0 = t90 - t10, Mp0 = 100 * Math.exp((-z * Math.PI) / Math.sqrt(1 - z * z));
    var variant2 = Math.random() < 0.65 ? "PID" : "PI";
    var Kt = pick([2, 4, 5, 9]), ess = 1 / (1 + Kt * Kpl);
    var specs2, expl2;
    if (variant2 === "PID") {
      var Yr = nice(tr0 / pick([2.5, 3]));
      specs2 = "kerfið sé stöðugt, rístími undir $" + tx(Yr) + "$ s við þrepabreytingar í óskgildi, yfirskot undir 10 % og engin skekkja í jafnvægi eftir þrepabreytingu í óskgildi";
      expl2 = "Ferlið nær föstu gildi (tegund 0), svo P-stýring skilur eftir skekkju $1/(1+KK_p)$: það þarf I-lið. Rístíminn er nú um $" + tx(tr0, 2) + "$ s og á að fara undir $" + tx(Yr) + "$ s, sem krefst hærri skurðtíðni og mögnunar. Það lækkar fasaöryggið og eykur yfirskotið (sem er þegar $" + tx(Mp0, 2) + "\\,\\%$), og I-liðurinn lækkar fasann enn frekar. D-liðurinn gefur fasahækkunina sem þarf: PID-stýring.";
    } else {
      var Ys = nice(tr0 * pick([1.5, 2]));
      specs2 = "kerfið sé stöðugt og engin skekkja í jafnvægi eftir þrepabreytingu í óskgildi. Hraðinn má vera svipaður og nú (rístími undir $" + tx(Ys) + "$ s) og yfirskot má vera allt að 30 %";
      expl2 = "Ferlið er tegund 0, svo það þarf heildun (I-lið) til að eyða skekkjunni. Engin krafa er um meiri hraða eða minna yfirskot, svo D-liður er óþarfur: PI-stýring. Hafðu stýringuna eins einfalda og hægt er.";
    }
    var tmax = Math.min(20, Math.max(6, Math.ceil((10 / (z * wn)) / 2) * 2));
    var num2 = Kpl === 1 ? "" : tx(Kpl) + "\\cdot";
    return {
      n: 6, weight: 20, title: "Val á stýringu út frá þrepasvörun",
      html: "<p>Þið hafið smíðað líkan af einingum kerfisins. Myndin sýnir tímasvörun úttaksins eftir einingarþrepfall í óskgildi, <b>án stýringar</b>. Hönnunarforsendur: " + specs2 + ".</p>" +
        '<canvas class="plot" id="' + id + '" role="img" aria-label="Þrepasvörun ferlisins án stýringar"></canvas>',
      parts: labelParts([
        mc("", "Hvaða gerð af stýringu mynduð þið hanna (P, PD, PI eða PID)?", variant2 === "PID" ? ["PID", "PI", "PD", "P"] : ["PI", "PID", "PD", "P"], expl2),
        num("", "Ferlið hefur stöðuga mögnun $K_p = " + tx(Kpl) + "$. Hver yrði skekkjan í jafnvægi við einingarþrep með P-stýringu, $K = " + Kt + "$?", ess, "",
          "<p>Tegund 0: $e_{ss} = \\dfrac{1}{1 + KK_p} = \\dfrac{1}{1 + " + Kt + "\\cdot" + tx(Kpl) + "} = " + tx(ess, 4) + "$. Hún hverfur aldrei með P-stýringu.</p>", 0.02),
        num("", "Lestu af myndinni: hvert er yfirskot ferlisins án stýringar, sem hlutfall af jafnvægisgildi?", Mp0, "%",
          "<p>Ferlið svarar eins og kerfi annarrar gerðar með $\\zeta \\approx " + tx(z) + "$ og $\\omega_n \\approx " + tx(wn) + "$ rad/s: $M_p = e^{-\\zeta\\pi/\\sqrt{1-\\zeta^2}} = " + tx(Mp0, 3) + "\\,\\%$ (hámarkið er við $T_p = " + tx(Math.PI / wd, 3) + "$ s). Aflestur af mynd innan um 3 prósentustiga telst réttur.</p>", 0, 3),
        VERIFY(),
      ]),
      setup: function (el) {
        var C = window.Ctrl, cv = document.getElementById(id);
        if (!C || !cv) return;
        var ts = [], ys = [];
        for (var i = 0; i <= 240; i++) { var tt = (i / 240) * tmax; ts.push(tt); ys.push(y(tt)); }
        var col = getComputedStyle(document.documentElement).getPropertyValue("--mag").trim();
        var draw = function () {
          C.drawLines(cv, [{ x: ts, y: ys, color: col }], { aspect: 0.45, xmin: 0, xmax: tmax, ymin: 0, ymax: Math.ceil(Kpl * (1 + Mp0 / 100) * 5 + 0.5) / 5, hlines: [Kpl], xlabel: "t [s]" });
        };
        draw();
        C.onRedraw(cv, draw);
      },
    };
  }

  TK.examgen = function (uid) {
    uid = uid || "ex" + Math.random().toString(36).slice(2, 8);
    return { questions: [q1(), q2(), q3(), q4(), q5(), q6(uid)] };
  };
})();

/* synisprof.js – Sample Questions for the Final Exam, frá kennaranum.
   Dæmin eru orðrétt eins og í skjalinu (á ensku, með sömu tölum og myndum); lausnirnar eru okkar. */
(function () {
  var E = EDL;
  function fixed(o) { return function () { return o; }; }

  // 1. 2014, dæmi 1
  var a1 = 2 * 12.0 / (5.30 * 5.30), m1 = 72.0 / a1, v1 = a1 * 5.30, d1 = v1 * 5.50;
  // 2. 2017, dæmi 2
  var V2 = 3.00 * (8.00 + 2.00) / 15.0, x2 = V2 * Math.sqrt(15.0 / 525);
  // 3. 2013, dæmi 2
  var TA = 165 / 2 + 185 / 4, TB = 165 / 2 + 185 * 3 / 4, mu = 0.0055 / 0.75;
  var vA = Math.sqrt(TA / mu), vB = Math.sqrt(TB / mu), fA = vA / (2 * 0.75), fB = vB / (2 * 0.75);
  // 4. 2010, dæmi 4
  var p2 = 1.0e5 + 1000 * 9.8 * 40, T1 = 37 + 273.15, T2 = 7 + 273.15, V4 = 410 * (1.0e5 / p2) * (T2 / T1);

  E.samples = {
    id: "synis", samples: true, title: "Sample Questions for the Final Exam", eqs: [],
    problems: [
      { id: "s2014", title: "2014 final exam / Physics 1V / Problem 1", src: "prof1V2014.pdf · page 2", img: "img/synis-1.png",
        alt: "Ísklumpur með óþekktan massa m á sléttu gólfi, láréttur kraftur F = 72,0 N; klumpurinn byrjar kyrr og fer 12,0 m á 5,30 s.",
        gen: fixed({
          text: "A dockworker applies a constant horizontal force of <b>72.0 N</b> to a block of ice on a smooth horizontal floor. The frictional force is negligible. The block starts from rest and moves a distance <b>12.0 m</b> in a time of <b>5.30 s</b>.",
          parts: [
            { label: "What is the mass of the block of ice?", ans: m1, unit: "kg" },
            { label: "If the worker stops pushing after 5.30 s, how far does the block move in the next 5.50 s?", ans: d1, unit: "m" }
          ],
          steps: [
            "Föst hröðun úr kyrrstöðu: $x = \\tfrac12 a t^2 \\Rightarrow a = \\dfrac{2x}{t^2} = \\dfrac{2\\cdot 12{,}0}{5{,}30^2} = " + E.t(a1, "m/s^2") + "$",
            "(a) Annað lögmál Newtons: $m = \\dfrac{F}{a} = \\dfrac{72{,}0}{" + E.n(a1, 4) + "} = " + E.t(m1, "kg") + "$",
            "Hraðinn þegar hætt er að ýta: $v = a t = " + E.n(a1, 4) + "\\cdot 5{,}30 = " + E.t(v1, "m/s") + "$",
            "(b) Enginn núningur og enginn kraftur, svo klumpurinn heldur jöfnum hraða: $x = v t = " + E.n(v1, 4) + "\\cdot 5{,}50 = " + E.t(d1, "m") + "$"
          ]
        }) },
      { id: "s2017", title: "2017 final exam / Physics 1V / Problem 2", src: "prof1V2017.pdf · page 3", img: "img/synis-2.png",
        alt: "Fyrir árekstur: 3,00 kg steinn á 8,00 m/s til hægri að kyrrum 15,0 kg kubbi sem er festur við gorm. Rétt eftir árekstur: steinninn fer 2,00 m/s til vinstri.",
        gen: fixed({
          text: "A block of mass <b>M = 15.0 kg</b> is attached to a very light horizontal spring of force constant <b>k = 525 N/m</b> and is resting on a smooth horizontal table. Suddenly it is struck by a stone of mass <b>m = 3.00 kg</b> traveling horizontally at <b>$v_m$ = 8.00 m/s</b> to the right, whereupon the stone rebounds at <b>$u_m$ = 2.00 m/s</b> horizontally to the left.",
          parts: [{ label: "<b>Find the maximum distance that the block will compress the spring after the collision.</b>", ans: x2, unit: "m" }],
          after: "<i>Hint: Break this problem into two parts - the collision and the behavior after the collision - and apply the appropriate conservation law to each part.</i>",
          steps: [
            "Árekstur, skriðþungi varðveitist (hægri jákvætt): $m v_m = -m u_m + M V$",
            "$V = \\dfrac{m(v_m + u_m)}{M} = \\dfrac{3{,}00\\,(8{,}00 + 2{,}00)}{15{,}0} = " + E.t(V2, "m/s") + "$",
            "Eftir áreksturinn varðveitist orkan (slétt borð): $\\tfrac12 M V^2 = \\tfrac12 k x^2$",
            "$x = V\\sqrt{\\dfrac{M}{k}} = " + E.n(V2) + "\\sqrt{\\dfrac{15{,}0}{525}} = " + E.t(x2, "m") + "$"
          ]
        }) },
      { id: "s2013", title: "2013 final exam / Physics 1V / Problem 2", src: "prof1V2013.pdf · page 3", img: "img/synis-3.png",
        alt: "Láréttur 165 N biti hangir í vírum A og B, hvor 75 cm og 5,5 g. 185 N blýkubbur er 3L/4 frá A og L/4 frá B.",
        gen: fixed({
          text: "A uniform <b>165 N</b> bar is supported horizontally by two identical wires <b>A</b> and <b>B</b> (see figure). A small <b>185 N</b> cube of lead is placed three quarters of the way from A to B. The wires are each <b>75 cm</b> long and have a mass of <b>5.5 g</b>. If both of them are simultaneously plucked at the center, what is the frequency of the beats that they will produce when vibrating in their fundamental?<br>g = 9.8 m/s<sup>2</sup>",
          parts: [{ label: "Frequency of the beats", ans: fB - fA, unit: "Hz" }],
          steps: [
            "Kraftvægi um $A$ (lengd bitans $L$): $T_B L = 165\\cdot\\tfrac{L}{2} + 185\\cdot\\tfrac{3L}{4} \\Rightarrow T_B = " + E.t(TB, "N", 4) + "$",
            "Kraftajafnvægi: $T_A = 165 + 185 - T_B = " + E.t(TA, "N", 4) + "$",
            "Massi á lengdareiningu vírs: $\\mu = \\dfrac{0{,}0055}{0{,}75} = " + E.t(mu, "kg/m", 4) + "$",
            "Bylgjuhraði $v = \\sqrt{T/\\mu}$: $v_A = " + E.t(vA, "m/s", 4) + "$, $v_B = " + E.t(vB, "m/s", 4) + "$",
            "Grunntónn, festur í báða enda: $f_1 = \\dfrac{v}{2L_{\\text{vír}}}$, svo $f_A = " + E.t(fA, "Hz", 4) + "$ og $f_B = " + E.t(fB, "Hz", 4) + "$",
            "Sláttartíðni: $f_{\\text{slátt}} = f_B - f_A = " + E.t(fB - fA, "Hz") + "$"
          ]
        }) },
      { id: "s2010", title: "2010 final exam / Physics 1V/R / Problem 4", src: "prof2010.pdf · page 6", img: "img/synis-4.png",
        alt: "Við yfirborð: loftvasi efst í lóðréttu röri, 410 cm³ við 37°C. Á 40 m dýpi við 7°C: rúmmál loftsins V = ?",
        gen: fixed({
          text: "An air pocket at the top of a vertical tube, closed at the upper end and open at the lower, occupies a volume of <b>410 cm<sup>3</sup></b> at the surface of a lake where the air pressure is <b>$P_0$ = 1.0 × 10<sup>5</sup> Pa</b> and the temperature is <b>37°C</b>. What is the volume of the air in the pocket if the tube is taken to a depth of <b>40 m</b>, where the temperature is <b>7°C</b>?<br><br>Assume that none of the air escapes from the tube. The density of the water in the lake is constant at <b>1000 kg/m<sup>3</sup></b>.",
          parts: [{ label: "Volume of the air at 40 m depth", ans: V4, unit: "cm^3" }],
          steps: [
            "Loftið í rörinu hefur sama þrýsting og vatnið við opið. Á 40 m dýpi: $p_2 = p_0 + \\rho g h = 1{,}0\\times10^5 + 1000\\cdot 9{,}8\\cdot 40 = " + E.t(p2, "Pa") + "$",
            "Hitastig í kelvin: $T_1 = 37 + 273 = " + E.t(T1, "K", 4) + "$, $T_2 = 7 + 273 = " + E.t(T2, "K", 4) + "$",
            "Sama magn af lofti ($n$ fast), kjörgasjafnan $pV = nRT$ gefur $\\dfrac{p_1V_1}{T_1} = \\dfrac{p_2V_2}{T_2}$",
            "$V_2 = V_1\\,\\dfrac{p_1}{p_2}\\,\\dfrac{T_2}{T_1} = 410\\cdot\\dfrac{1{,}0\\times10^5}{" + E.n(p2) + "}\\cdot\\dfrac{" + E.n(T2, 4) + "}{" + E.n(T1, 4) + "} = " + E.t(V4, "cm^3") + "$",
            "Rúmmálið minnkar bæði vegna þrýstingsins og kólnunarinnar. Í dæminu er $g$ ekki gefið; hér er notað $9{,}8\\,\\mathrm{m/s^2}$."
          ]
        }) }
    ]
  };
})();

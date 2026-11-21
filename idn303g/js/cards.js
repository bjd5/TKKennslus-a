/* cards.js – flashcards. Framvinda (kunni / kunni ekki) vistast í localStorage ef það er leyft. */
(function () {
  "use strict";

  var CARDS = [
    /* ---------- Tæknileg kerfi og vinnuferli (kaflar 2, 3 og 14) ---------- */
    { c: "vinnuferli", q: "Hvernig skilgreinir heftið tæknileg kerfi?", a: "Afmarkað safn af samtengdum einingum sem eru notaðar sem leið að gefnu markmiði. A.m.k. ein eining er efnisleg og fólk er <b>ekki</b> hluti af kerfinu (það er hluti af umhverfinu)." },
    { c: "vinnuferli", q: "Tveir almennir eiginleikar tæknilegra kerfa (kafli 2.2)?", a: "1. Þau eru samsett úr einingum sem sjálfar eru tæknileg kerfi (<b>stigveldi</b>).<br>2. Þau nýta sér <b>náttúrufyrirbæri</b> í ákveðnum tilgangi." },
    { c: "vinnuferli", q: "Fjórar dæmigerðar einingar véleindakerfis?", a: "<b>Vélrænt kerfi</b> sem á að stýra, <b>nemi</b> (mælir og breytir í rafmerki), <b>hreyfill</b> (rafmerki → vélræn aðgerð) og <b>tölva</b> (les mælingar, stýrir hreyflinum). Samanburður inntaks og mælds úttaks = afturvirkni." },
    { c: "vinnuferli", q: "Þarfir gegn kröfum?", a: "<b>Þarfir</b>: markmið notenda, á þeirra máli, óháð tæknilausn, ekki endilega mælanlegar.<br><b>Kröfur</b> (hönnunarforsendur): markmið séð frá hönnuði, <b>allar mælanlegar</b>." },
    { c: "vinnuferli", q: "Sannprófun gegn réttmæti?", a: "<b>Sannprófun</b> (verification): uppfyllir hönnunin <i>kröfurnar</i>?<br><b>Réttmæti</b> (validation): uppfyllir hún <i>þarfir notenda</i>? Kerfi getur staðist sannprófun en samt ekki uppfyllt þarfirnar." },
    { c: "vinnuferli", q: "Vinnuferli hönnunar véleindakerfis (kafli 14, fjögur skref)?", a: "1. Út frá kröfum: skilgreina hvernig heildarkerfið er sannprófað.<br>2. Kröfur fyrir hverja vélbúnaðareiningu (tölva, nemi, hreyfill) og val á einingum.<br>3. Líkan af hreyfli, kerfi og nema; hanna stýringu með líkaninu.<br>4. Útfæra stýringu í tölvu og sannprófa; endurbæta þar til kröfur standast." },
    { c: "vinnuferli", q: "Af hverju að byrja á einfaldri stýringu?", a: "Erfitt er að tengja fræðilega heiminn (Laplace) við raunheiminn. Flóknari stýringar krefjast nákvæmari (dýrari) líkana. Einföld stýring kennir manni á kerfið og samsvörun líkans og raunveruleika." },
    { c: "vinnuferli", q: "Hvað er málamiðlun (trade-off) í hönnun?", a: "Góðir eiginleikar vinna oft hver gegn öðrum (t.d. ending rafhlöðu gegn stærð og þyngd; hraði gegn stöðugleika og stýrimerki). Hönnun sem uppfyllir þarfir best finnur heppilegustu málamiðlunina." },
    { c: "vinnuferli", q: "Hvað þarf (I eða D) til að uppfylla kröfu um: enga skekkju / meiri hraða og minna yfirskot?", a: "<b>Engin skekkja</b> við þrep: heildi í lykkjunni (I-liður, nema ferlið hafi það þegar).<br><b>Meiri hraði</b>: hærra $\\omega_c$ (hærra $K$).<br><b>Halda fasaöryggi/yfirskoti</b> við hærra $\\omega_c$: D-liður (fasahækkun)." },

    /* ---------- Líkanagerð (kaflar 4-9) ---------- */
    { c: "likan", q: "Hvaða eiginleika hafa líkönin í námskeiðinu?", a: "Löggeng, kvik, samfelld, þjöppuð, línuleg og tímaóháð. Þau eru línulegar diffurjöfnur með fastastuðlum." },
    { c: "likan", q: "Tvær leiðir að líkani?", a: "<b>Út frá náttúrulögmálum</b>: afmörkun og uppskipting → grunnjöfnur → diffurjafna fyrir heildina.<br><b>Út frá mælingum</b> (system identification): afmörkun → kerfið í vinnupunkt, breyta inntaki og mæla → meta jöfnu og stika." },
    { c: "likan", q: "Línuleg nálgun um vinnupunkt?", a: "Taylor: $\\hat f(x) = f(x_0) + f'(x_0)(x - x_0)$. Líkanið lýsir <b>frávikum</b> frá jafnvægi; stikarnir eru háðir vinnupunktinum og nákvæmnin minnkar með stærra fráviki." },
    { c: "likan", q: "Grunneiningar véla (lína)?", a: "Fjöður $F = kx$, dempari $F = c\\dot x$, massi $F = m\\ddot x$." },
    { c: "likan", q: "Massi, fjöður og dempari: diffurjafna?", a: "$$m\\ddot x + c\\dot x + kx = F$$ $\\omega_n = \\sqrt{k/m}$, $\\zeta = \\dfrac{c}{2\\sqrt{km}}$." },
    { c: "likan", q: "Raðtengdar og hliðtengdar fjaðrir?", a: "Raðtengdar: $\\dfrac1k = \\dfrac1{k_1} + \\dfrac1{k_2}$ (sami kraftur).<br>Hliðtengdar: $k = k_1 + k_2$ (sama færsla). Demparar eins." },
    { c: "likan", q: "Grunneiningar rafrása?", a: "$v = Ri$, $i = C\\,\\dfrac{dv}{dt}$, $v = L\\,\\dfrac{di}{dt}$. Kirchhoff: straumur inn = straumur út í hnút; spennufall í lykkju = fæðispenna." },
    { c: "likan", q: "RC-rás (R í röð, úttak yfir C)?", a: "$$RC\\,\\dot y + y = u,\\qquad \\tau = RC$$" },
    { c: "likan", q: "Þéttir og spóla í jafnvægi?", a: "Þéttir: enginn straumur, eins og <b>opin rás</b>. Spóla: engin spenna, eins og <b>leiðari</b>." },
    { c: "likan", q: "Þéttar raðtengdir og hliðtengdir?", a: "Öfugt við viðnám: raðtengdir $\\dfrac1C = \\dfrac1{C_1} + \\dfrac1{C_2}$, hliðtengdir $C = C_1 + C_2$." },
    { c: "likan", q: "Tímastuðull RC-rásar með spennudeili ($R_1$ í röð, $R_2 \\parallel C$)?", a: "$\\tau = (R_1 \\parallel R_2)\\,C = \\dfrac{R_1R_2}{R_1+R_2}C$ og jafnvægi $u_\\infty = \\dfrac{R_2}{R_1+R_2}V$ (lokapróf 2025 S2)." },
    { c: "likan", q: "Grunneiningar vökvakerfa?", a: "Viðnám $p_1 - p_2 = Rq$; rýmd (tankur) $q_1 - q_2 = A\\dot h = C\\dot p$ með $C = A/(\\rho g)$; tregða $p_1 - p_2 = I\\dot q$ með $I = L\\rho/A$." },
    { c: "likan", q: "Tankur með $q_2 = h/R$: diffurjafna?", a: "$$AR\\,\\dot h + h = R\\,q_1,\\qquad \\tau = AR$$ Jafnvægisbreyting: $\\Delta h = R\\,\\Delta q_1$." },
    { c: "likan", q: "Grunneiningar varmakerfa?", a: "Viðnám $q = \\dfrac{T_1 - T_2}{R}$ ($R = L/(Ak)$ leiðni, $1/(Ah)$ burður); rýmd $q_1 - q_2 = C\\dot T$, $C = mc$. <b>Engin tregða.</b>" },
    { c: "likan", q: "Hitamælir í vökva með hita $T_L$?", a: "$$RC\\,\\dot T + T = T_L$$ Fyrstu gerðar nemi með $\\tau = RC$." },
    { c: "likan", q: "Áreynslu- og flæðisbreytur (tafla 9.1)?", a: "Áreynsla: kraftur, vægi, spenna, þrýstingur, hitastig.<br>Flæði: hraði, hornhraði, straumur, rúmmáls-/massaflæði, varmaflæði." },
    { c: "likan", q: "Hvað jafngildir hverju í véla- og rafkerfum?", a: "$m \\leftrightarrow L$ (tregða), $c \\leftrightarrow R$ (viðnám), $k \\leftrightarrow 1/C$ (rýmd), $F \\leftrightarrow v$, $\\dot x \\leftrightarrow i$." },

    /* ---------- Laplace og blokkrit (kaflar 10-11) ---------- */
    { c: "laplace", q: "Laplace-varpanir: $\\delta(t)$, þrep, flái, $e^{-at}$?", a: "$1$, $\\dfrac1s$, $\\dfrac1{s^2}$, $\\dfrac{1}{s+a}$." },
    { c: "laplace", q: "$e^{-at}\\cos bt$ og $e^{-at}\\sin bt$?", a: "$$\\frac{s+a}{(s+a)^2+b^2}\\quad\\text{og}\\quad\\frac{b}{(s+a)^2+b^2}$$" },
    { c: "laplace", q: "Laplace af afleiðu og tegri?", a: "$\\mathcal L[f'] = sF(s) - f(0)$, $\\mathcal L[f''] = s^2F - sf(0) - f'(0)$, $\\mathcal L\\left[\\int_0^t f\\right] = F(s)/s$." },
    { c: "laplace", q: "Hliðrun og dempun?", a: "Seinkun: $\\mathcal L[f(t-T)] = F(s)e^{-Ts}$.<br>Dempun: $\\mathcal L[f(t)e^{-at}] = F(s+a)$." },
    { c: "laplace", q: "Upphafs- og lokagildisreglur?", a: "$f(0^+) = \\lim_{s\\to\\infty} sF(s)$ og $f(\\infty) = \\lim_{s\\to0} sF(s)$ (ef markgildið er til, þ.e. kerfið stöðugt)." },
    { c: "laplace", q: "Stofnbrotaliðun með einföldum rótum?", a: "$Y = \\sum \\dfrac{k_i}{s - p_i}$ með $k_i = (s - p_i)\\,Y(s)\\big|_{s=p_i}$." },
    { c: "laplace", q: "Yfirfærslufall út frá diffurjöfnu?", a: "Laplace með öll upphafsgildi 0: $G(s) = \\dfrac{Y(s)}{U(s)}$. Dæmi: $y'' + 2y' + 2y = u \\Rightarrow G = \\dfrac{1}{s^2+2s+2}$." },
    { c: "laplace", q: "Þrjár grunnreglur blokkrita?", a: "Röð: $G_1G_2$. Hliðtengt: $G_1 \\pm G_2$. Afturvirkni: $\\dfrac{G}{1 \\pm GH}$ (mínus í afturvirkni gefur plús í nefnara)." },
    { c: "laplace", q: "Truflun $R$ milli hreyfils $H$ og kerfis $V$ (stýring $S$, nemi $N$): yfirfærslufall að úttaki?", a: "$$G_R = \\frac{V}{1 + SHVN},\\qquad Y = G\\,U + G_R\\,R$$ (samlagningarreglan: áhrifin eru reiknuð sitt í hvoru lagi)." },

    /* ---------- Svörun kerfa (kaflar 12-13) ---------- */
    { c: "svorun", q: "Fyrstu gerðar kerfi: staðalform og þrepasvörun?", a: "$$G = \\frac{K}{\\tau s+1},\\qquad y(t) = K\\bigl(1 - e^{-t/\\tau}\\bigr)$$ 63 % við $\\tau$, 86 % við $2\\tau$, 95 % við $3\\tau$, 98 % við $4\\tau$." },
    { c: "svorun", q: "Annarrar gerðar staðalform?", a: "$$G = \\frac{K\\omega_n^2}{s^2 + 2\\zeta\\omega_ns + \\omega_n^2}$$ $K = G(0)$, $\\omega_n$ náttúruleg tíðni, $\\zeta$ dempunarhlutfall." },
    { c: "svorun", q: "$T_p$, $M_p$ og $\\tau$ fyrir annarrar gerðar kerfi?", a: "$T_p = \\dfrac{\\pi}{\\omega_n\\sqrt{1-\\zeta^2}}$, $M_p = e^{-\\zeta\\pi/\\sqrt{1-\\zeta^2}}$, $\\tau = \\dfrac{1}{\\zeta\\omega_n}$ (jafnvægi eftir $4\\tau$)." },
    { c: "svorun", q: "Fimm tilfelli $\\zeta$?", a: "$\\zeta &lt; 0$ óstöðugt; $\\zeta = 0$ ódempuð sveifla; $0 &lt; \\zeta &lt; 1$ undirdempað (yfirskot); $\\zeta = 1$ markdempað (tvöföld rót); $\\zeta &gt; 1$ yfirdempað (tvær raunrætur)." },
    { c: "svorun", q: "Hvað segir staðsetning póla í s-planinu?", a: "Vinstra hálfplan = stöðugt. Fjarlægð frá $j\\omega$-ás = dempun (hraði). Fjarlægð frá raunás = sveiflutíðni. Ein rót í hægra hálfplani nægir fyrir óstöðugleika." },
    { c: "svorun", q: "Kerfi hærri gerðar?", a: "Svörunin er summa svarana fyrstu og annarrar gerðar. Lengsti tímastuðullinn ræður hversu lengi svipula svörunin varir (ríkjandi pólar). Núll geta valdið yfirskoti." },
    { c: "svorun", q: "Tíðnisvörun: hvað gerist við $u = A\\cos\\omega t$?", a: "Í sístæðu ástandi: $y = A\\,|G(j\\omega)|\\cos(\\omega t + \\varphi)$, $\\varphi = \\angle G(j\\omega)$. Sama tíðni, mögnuð og hliðruð." },
    { c: "svorun", q: "Tíðnisvörun fyrstu gerðar kerfis?", a: "$|G| = \\dfrac{K}{\\sqrt{1+\\tau^2\\omega^2}}$, $\\varphi = -\\arctan(\\tau\\omega)$. Bandvídd $\\omega_B = 1/\\tau$ (−3 dB, −45°); −20 dB/dec fyrir ofan." },
    { c: "svorun", q: "Tíðnisvörun annarrar gerðar kerfis?", a: "Toppur $M_r = \\dfrac{K}{2\\zeta\\sqrt{1-\\zeta^2}}$ við $\\omega_r = \\omega_n\\sqrt{1-2\\zeta^2}$ (ef $\\zeta \\le 1/\\sqrt2$). −40 dB/dec fyrir ofan $\\omega_n$; fasinn fer í −180°, −90° við $\\omega_n$." },
    { c: "svorun", q: "Bode: heildi $1/s$ og seinkun $e^{-Ls}$?", a: "$1/s$: −20 dB/dec og fastur fasi −90°.<br>$e^{-Ls}$: mögnun 1 (0 dB), fasi $-\\omega L$ rad, vex með tíðni." },

    /* ---------- Nemar ---------- */
    { c: "nemar", q: "Hvað er næmni nema?", a: "Breyting í úttaki fyrir hverja einingu í breytingu á inntaki: $S = \\dfrac{\\Delta y}{\\Delta x}$ (t.d. V/°C). Fyrir línulegan nema er hún hallatala línunnar." },
    { c: "nemar", q: "Línulegur nemi með mælisvið $[x_{min}, x_{max}]$ og úttak $[y_{min}, y_{max}]$. Hvert er úttakið fyrir $x$?", a: "$$y = y_{min} + \\frac{y_{max}-y_{min}}{x_{max}-x_{min}}\\,(x - x_{min})$$" },
    { c: "nemar", q: "4-20 mA nemi, mælisvið 100-200 °C. Hvert er úttakið við 100 °C og 150 °C?", a: "4 mA og 12 mA. Neðri mörk mælisviðs gefa 4 mA (ekki 0). Næmnin er $16/100 = 0{,}16$ mA/°C." },
    { c: "nemar", q: "Hvað segir tímastuðull fyrstu gerðar nema?", a: "Eftir $\\tau$: 63,2 % af lokagildi. Eftir $4\\tau$: 98,2 %. Þrepasvörun: $y(t) = \\Delta x\\,(1 - e^{-t/\\tau})$." },
    { c: "nemar", q: "Frávik frá línuleika er gefið sem 1,5 %. Af hverju?", a: "Það er % af <b>mælisviðinu</b> (ekki af mældu gildi). Dæmi: mælisvið 0-200 °C gefur hámarksfrávik $0{,}015\\cdot200 = 3\\,^\\circ$C." },
    { c: "nemar", q: "Munurinn á nákvæmni og endurtekningarhæfni?", a: "<b>Nákvæmni</b>: hversu nálægt mælt gildi er því rétta. <b>Endurtekningarhæfni</b>: hvort sama mæling gefur sömu niðurstöðu aftur og aftur. Nemi getur verið endurtekningarhæfur en ónákvæmur." },
    { c: "nemar", q: "Hvað er deyðubil (dead band) og hvað er upplausn?", a: "<b>Deyðubil</b>: bil þar sem inntaksbreyting veldur engri úttaksbreytingu. <b>Upplausn</b>: minnsta breyting á inntaki sem veldur greinanlegri breytingu á úttaki." },
    { c: "nemar", q: "Virkur eða óvirkur nemi?", a: "<b>Virkur</b> nemi þarf utanaðkomandi orkugjafa (spennu). <b>Óvirkur</b> nemi fær orkuna frá mælistærðinni sjálfri." },
    { c: "nemar", q: "Hvernig breytist viðnám álagsnema við aflögun?", a: "$$\\frac{\\Delta R}{R} = G\\,\\varepsilon \;\\Rightarrow\; \\Delta R = R\\,G\\,\\varepsilon$$ þar sem $G$ er næmnistuðullinn (um 2) og $\\varepsilon$ aflögunin." },
    { c: "nemar", q: "Upplausn kóðaskífu með $N$ raufar og radíus $r$?", a: "Ummál deilt með fjölda raufa við jaðarinn: $\\dfrac{2\\pi r}{N}$." },
    { c: "nemar", q: "Skekkja vegna álags á stillivíðnám ($R_P$, fæðispenna $V_s$, álag $R_L$, staða $x$)?", a: "$$e = V_s\\,\\frac{R_P}{R_L}\\,(x^2 - x^3)$$ Skekkjan minnkar þegar $R_L \\gg R_P$." },
    { c: "nemar", q: "Hvenær þarf stafsetjara (A/D)?", a: "Þegar nemi gefur <b>hliðrænt</b> merki sem tölva á að lesa. Stafrænir nemar (púlsar frá kóðaskífu) þurfa hann ekki." },

    /* ---------- Hreyflar ---------- */
    { c: "hreyflar", q: "Rafjafna jafnstraumshreyfils?", a: "$$v_a = L\\frac{di_a}{dt} + R\\,i_a + v_f,\\qquad v_f = K_f\\,\\omega$$ ($v_f$ er bakspennan)." },
    { c: "hreyflar", q: "Vélræna jafna jafnstraumshreyfils?", a: "$$\\tau = K_\\tau\\, i_a,\\qquad I\\frac{d\\omega}{dt} + c\\,\\omega = \\tau$$" },
    { c: "hreyflar", q: "Upphafsvægi $\\tau_s$ við spennu $v_a$?", a: "Í kyrrstöðu er $v_f = 0$ og $i = v_a/R$, svo $\\tau_s = \\dfrac{K_\\tau}{R}\\,v_a$." },
    { c: "hreyflar", q: "Lausagangshraði $\\omega_0$?", a: "Vægi 0, enginn straumur: $v_a = K_f\\omega_0$, svo $\\omega_0 = \\dfrac{v_a}{K_f}$." },
    { c: "hreyflar", q: "Hvernig er vægi hreyfils háð hraða?", a: "Línulega fallandi: $\\tau = \\tau_s\\,\\Bigl(1 - \\dfrac{\\omega}{\\omega_0}\\Bigr)$. Bakspennan minnkar strauminn." },
    { c: "hreyflar", q: "Hámarksafl hreyfils og við hvaða hraða?", a: "$P_{max} = \\dfrac{\\tau_s\\,\\omega_0}{4}$ við $\\omega = \\omega_0/2$ (og $\\tau = \\tau_s/2$)." },
    { c: "hreyflar", q: "Hvernig breytirðu $K_f$ úr V/1000 RPM í V·s/rad?", a: "Deila með $1000\\cdot2\\pi/60 = 104{,}72$. Dæmi: $11/104{,}72 = 0{,}105$ V·s/rad." },
    { c: "hreyflar", q: "Rafrænn tímastuðull hreyfils?", a: "$\\tau_e = \\dfrac{L}{R}$ (ms-svið). Hann er oftast mun styttri en sá vélræni, svo oft er hægt að láta $L \\approx 0$." },
    { c: "hreyflar", q: "Yfirfærslufall frá $v_a$ til $\\omega$ þegar $L = 0$?", a: "$$G_P = \\frac{K_\\tau/R}{I s + c + K_\\tau K_f/R}$$ Fyrstu gerðar kerfi með tímastuðul $\\dfrac{I}{c + K_\\tau K_f/R}$." },
    { c: "hreyflar", q: "Hreyfill knýr álag með tregðu $I_2$ í gegnum gír með hlutfall $N$. Hver er heildartregðan séð frá hreyfilsásnum?", a: "$$I_{eff} = I_1 + \\frac{I_2}{N^2}$$" },
    { c: "hreyflar", q: "Hreyfill lyftir massa $m$ með trissu (radíus $r$) og núningsvægi $\\tau_n$. Hvaða vægi þarf í jafnvægi?", a: "$\\tau = \\tau_n + m\\,g\\,r$. Með hröðun $a$ bætist við $m\\,a\\,r$." },

    /* ---------- Sjálfvirk stýrikerfi ---------- */
    { c: "stýrikerfi", q: "Lykkjan (open loop) $G_K$ er samsett úr hverju?", a: "$$G_K = G_C\\,G_P\\,G_S$$ stýring, ferli og nemi. Allir inntakar hafa sama nefnara $1 + G_K$." },
    { c: "stýrikerfi", q: "Yfirfærslufall lokaða kerfisins frá óskgildi til úttaks ($G_S = 1$)?", a: "$$G_T = \\frac{G_C\\,G_P}{1 + G_K}$$" },
    { c: "stýrikerfi", q: "Hvaða sex eiginleika er þetta kerfi dæmt eftir?", a: "Stöðugleiki, skekkja í jafnvægi, hraði, deyfing truflana, næmni og stærð stýrimerkis." },
    { c: "stýrikerfi", q: "Skilgreining á skurðtíðni $\\omega_c$ og $\\omega_\\pi$?", a: "$\\omega_c$: $|G_K(j\\omega_c)| = 1$ (0 dB). $\\omega_\\pi$: $\\angle G_K(j\\omega_\\pi) = -180^\\circ$." },
    { c: "stýrikerfi", q: "Fasaöryggi og mögnunaröryggi?", a: "$\\varphi_m = 180^\\circ + \\angle G_K(j\\omega_c)$. $A_m = \\dfrac{1}{|G_K(j\\omega_\\pi)|}$ (í dB: $-20\\log_{10}|G_K(j\\omega_\\pi)|$)." },
    { c: "stýrikerfi", q: "Hvaða gildi á $\\varphi_m$ og $A_m$ teljast heppileg?", a: "$\\varphi_m$: 30°-60°. $A_m$: 2-5 (6-14 dB)." },
    { c: "stýrikerfi", q: "Hvenær er lokaða kerfið óstöðugt út frá Bode-riti?", a: "Þegar $|G_K(j\\omega_\\pi)| \\ge 1$, þ.e. mögnunaröryggi $\\le 1$ og fasaöryggi neikvætt ($\\omega_c \\ge \\omega_\\pi$)." },
    { c: "stýrikerfi", q: "Hvað er tegund kerfis $N$?", a: "Fjöldi heildunarþátta ($1/s$) í $G_K$ (í þeim hluta sem er á undan truflun, hvað varðar skekkju vegna truflana)." },
    { c: "stýrikerfi", q: "Skekkja í jafnvægi: tegund 0, 1, 2 með þrep og flái í óskgildi?", a: "Tegund 0: þrep $\\dfrac{1}{1+K_p}$, flái $\\infty$.<br>Tegund 1: þrep 0, flái $\\dfrac{1}{K_v}$.<br>Tegund 2: þrep 0, flái 0." },
    { c: "stýrikerfi", q: "Hvernig eru $K_p$ og $K_v$ reiknuð?", a: "$K_p = \\lim_{s\\to0}G_K(s)$ og $K_v = \\lim_{s\\to0}s\\,G_K(s)$." },
    { c: "stýrikerfi", q: "Hvenær má nota lokagildissetninguna?", a: "Aðeins ef lokaða kerfið er <b>stöðugt</b>. Annars er svarið ómarktækt." },
    { c: "stýrikerfi", q: "Þumalputtaregla fyrir rístíma?", a: "$t_r \\approx \\dfrac{1{,}4}{\\omega_c}$" },
    { c: "stýrikerfi", q: "Hvernig reiknarðu áhrif truflunar $v$ sem kemur inn á undan ferlinu?", a: "Mögnun truflunar: $\\left|\\dfrac{G_P}{1+G_K}\\right|$ við tíðni truflunarinnar. Án afturvirkni væri hún $|G_P|$. Afturvirkni deyfir þar sem $|G_K|\\gg1$." },
    { c: "stýrikerfi", q: "Áhrif hreinnar seinkunar $e^{-Ls}$?", a: "Mögnun óbreytt ($|e^{-j\\omega L}|=1$), fasi $-\\omega L$. Mesta seinkun: $L_{max} = \\dfrac{\\varphi_m}{\\omega_c}$ (með $\\varphi_m$ í rad)." },
    { c: "stýrikerfi", q: "Dæmi um dB-tölur sem gott er að kunna?", a: "$0\\ \\mathrm{dB} = 1$, $20\\ \\mathrm{dB} = 10$, $6\\ \\mathrm{dB}\\approx2$, $3\\ \\mathrm{dB}\\approx\\sqrt2$, $-3\\ \\mathrm{dB} = 1/\\sqrt2$. $\\mathrm{dB} = 20\\log_{10}|G|$." },
    { c: "stýrikerfi", q: "Næmni heildarkerfisins fyrir ferli og nema?", a: "$S^{G_T}_{G_P} = \\dfrac{1}{1+G_K}$ (minnkar með hærra $|G_C|$). $S^{G_T}_{G_S} = \\dfrac{-G_K}{1+G_K}\\approx-1$ þegar $|G_K|\\gg1$: nemi þarf að vera nákvæmur." },
    { c: "stýrikerfi", q: "Hvað ræður stærð stýrimerkis $U$ við háar tíðnir?", a: "Hátíðnihegðun stýringarinnar, $|G_C(j\\omega)|$ fyrir stórt $\\omega$. P/PI: $\\to K$. PD/PID: hærri (PID með síu: $K\\,T_D/T_F$)." },

    /* ---------- Stýringar ---------- */
    { c: "stýringar", q: "P-stýring: formúla og áhrif hækkandi $K$?", a: "$G_C = K$. Hækkandi $K$: $\\omega_c$ til hægri, hraðari svörun, minni skekkja (tegund 0), betri truflanadeyfing, <b>en minna fasaöryggi</b> og sterkara stýrimerki." },
    { c: "stýringar", q: "PI-stýring: formúla og helstu áhrif?", a: "$G_C = K\\Bigl(1 + \\dfrac{1}{T_Is}\\Bigr)$. Eyðir skekkju í jafnvægi (lykkjan hækkar um eina gerð), bætir deyfingu lágtíðnitruflana ($K/T_I$), en lækkar fasann á lágum tíðnum." },
    { c: "stýringar", q: "Hönnunaruppskrift PI-stýringar?", a: "1. Skoðaðu $K\\,G_P$.<br>2. $K$ þannig að $\\varphi_m = \\varphi_{min} + 0{,}06\\pi$ (≈ 11° umfram lágmark).<br>3. $\\omega_I = 0{,}2\\,\\omega_c$, þ.e. $T_I = \\dfrac{1}{0{,}2\\,\\omega_c}$." },
    { c: "stýringar", q: "PD-stýring: formúla og helstu áhrif?", a: "$G_C = K(1 + T_Ds)$. Jákvæð fasahliðrun (eykur stöðugleika), getur fært $\\omega_c$ til hægri (hraðari), <b>en</b> sterkara stýrimerki á háum tíðnum." },
    { c: "stýringar", q: "Hönnunaruppskrift PD-stýringar?", a: "1. Skoðaðu $G_P$ ($\\omega_c$, $\\omega_\\pi$).<br>2. $0{,}8\\,\\omega_\\pi < \\omega_D < 1{,}5\\,\\omega_\\pi$, þ.e. $T_D = 1/\\omega_D$.<br>3. Skoðaðu $G_CG_P$.<br>4. $K$ sem gefur viðunandi fasaöryggi." },
    { c: "stýringar", q: "PID-stýring með síu: formúla?", a: "$$G_C = K\\,\\frac{1+T_Is}{T_Is}\\cdot\\frac{1+T_Ds}{1+T_Fs}$$ Sían $T_F$ kemur í veg fyrir óendanlega mögnun á hátíðnisuði." },
    { c: "stýringar", q: "Hönnunaruppskrift PID-stýringar?", a: "$T_D$ eins og PD. $0{,}2\\,T_D < T_F < 0{,}4\\,T_D$. Skoðaðu $\\dfrac{1+T_Ds}{1+T_Fs}\\,G_P$. Veldu síðan $T_I$ og $K$ eins og fyrir PI." },
    { c: "stýringar", q: "Hver er hátíðnimögnun PID-stýringar með síu?", a: "$|G_C(j\\omega)| \\to K\\,\\dfrac{T_D}{T_F}$ þegar $\\omega\\to\\infty$." },
    { c: "stýringar", q: "Hvað gerir PD-hlutinn og hvað PI-hlutinn í PID, í einni setningu hvor?", a: "PI eyðir skekkju í jafnvægi og deyfir lágtíðnitruflanir, PD bætir fasaöryggið og leyfir hærra $\\omega_c$. Hafðu stýringuna eins einfalda og hægt er." },
  ];

  var CATS = [
    { id: "allt", label: "Öll spjöld" },
    { id: "likan", label: "Líkanagerð" },
    { id: "laplace", label: "Laplace og blokkrit" },
    { id: "svorun", label: "Svörun kerfa" },
    { id: "nemar", label: "Nemar" },
    { id: "hreyflar", label: "Hreyflar" },
    { id: "stýrikerfi", label: "Sjálfvirk stýrikerfi" },
    { id: "stýringar", label: "Stýringar" },
    { id: "vinnuferli", label: "Vinnuferli" },
  ];
  var CAT_NAME = {};
  CATS.forEach(function (t) { CAT_NAME[t.id] = t.label; });

  var root = document.getElementById("cards");
  if (!root) return;

  var known = window.store.get("tk-cards-known", {}); // lykill = spurning, gildi = true/false
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
    document.getElementById("c-reset").addEventListener("click", function () { known = {}; window.store.set("tk-cards-known", known); frame(); buildDeck(true); show(); });
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
    window.store.set("tk-cards-known", known);
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

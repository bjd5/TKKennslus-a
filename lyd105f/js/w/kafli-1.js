/* w/kafli-1.js – gagnvirka skrefið í kafla 1: breytur og rannsóknarsnið í raunverulegum gögnum (vélin er js/gagnvirkt.js). */

(function () {
  "use strict";
  var TYPES = ["Samfelld talnabreyta", "Strjál talnabreyta", "Röðuð flokkabreyta", "Óröðuð flokkabreyta"];
  function v(name, desc, a, ex) { return { type: "mc", keep: true, title: "Gerð breytu", q: "Breytan <code>" + name + "</code>: " + desc + ". Af hvaða gerð er hún?", opts: TYPES, a: a, ex: "<p>" + ex + "</p>" }; }
  window.TK.lab(1, {
    need: 0.7,
    tasks: function () {
      return [
        v("haed", "hæð nemanda í cm (pulsAll)", 0, "Hæð getur tekið hvaða gildi sem er á bili, svo hún er samfelld talnabreyta, þótt hún sé skráð í heilum cm."),
        v("fyrriPuls", "slög á mínútu, talin í eina mínútu (pulsAll)", 1, "Púls er talning (heil tala slaga), svo hann er strjál talnabreyta. Í reynd er hann oft meðhöndlaður eins og samfelld breyta, því gildin eru mörg."),
        v("reykir", "„ja“ eða „nei“ (pulsAll)", 3, "Tveir flokkar án röðunar: óröðuð flokkabreyta (tvíkosta breyta)."),
        v("inngrip", "„hljop“ eða „sat_kyrr“, ákveðið með krónukasti", 3, "Flokkar án röðunar. Þetta er líka skýribreytan í tilrauninni."),
        v("likamsraekt", "klukkustundir af líkamsrækt á viku", 0, "Tími er samfelld talnabreyta."),
        v("educ", "menntun í Framingham, 1 = grunnskóli … 4 = háskólapróf", 2, "Kóðuð sem tölur en flokkarnir hafa röð og bilin eru ekki jöfn: röðuð flokkabreyta. Meðaltal af henni er vafasamt."),
        v("CIGPDAY", "fjöldi sígaretta á dag (Framingham)", 1, "Talning: strjál talnabreyta."),
        v("SEX", "1 = karl, 2 = kona (Framingham)", 3, "Talan er bara merki. Breytan er óröðuð flokkabreyta og á að vera <code>factor</code> í R."),
        v("frame", "líkamsbygging: small, medium, large (diabetes)", 2, "Lítil < miðlungs < stór: röðuð flokkabreyta."),
        { type: "mc", title: "Rannsóknarsnið", q: "Í púlsrannsókninni ákvað krónukast hvort nemandi hljóp eða sat. Hvað leyfir það okkur að álykta?",
          opts: ["Að munur á púlsbreytingu milli hópanna sé <b>af völdum</b> hlaupsins, því slembival jafnar aðra þætti milli hópa", "Að niðurstöðurnar gildi fyrir alla Íslendinga", "Ekkert, því úrtakið er aðgengisúrtak", "Að púls sé normaldreifður"], a: 0,
          ex: "<p>Slembival gerir tilraunina að stýrðri tilraun, svo hægt er að álykta um orsakasamband. Hins vegar eru þátttakendur nemendur í tilteknum námskeiðum (aðgengisúrtak), svo alhæfing á allt þýðið er varhugaverð.</p>" },
        { type: "mc", title: "Rannsóknarsnið", q: "Framingham-rannsóknin fylgdi íbúum bæjar eftir í áratugi án þess að úthluta meðferð. Hvers konar rannsókn er það?",
          opts: ["Ferilrannsókn (athugunarrannsókn)", "Stýrð slembirannsókn", "Tvíblind tilraun", "Tilfella-viðmiðarannsókn"], a: 0,
          ex: "<p>Engin meðferð er ákveðin af rannsakanda, svo þetta er athugunarrannsókn (ferilrannsókn, cohort). Tengsl, t.d. milli BMI og blóðþrýstings, geta stafað af blöndun (confounding).</p>" },
        { type: "mc", title: "Bjagi", q: "Í púlsrannsókninni hlupu 183 af 469 (39%) þótt krónan ætti að gefa um 50%. Hver er líklegasta skýringin?",
          opts: ["Ekki var farið eftir krónukastinu eða þeir sem hlupu skiluðu síður mælingum, sem getur valdið bjaga", "Krónan var heiðarleg og þetta er eðlilegt", "Of fáir tóku þátt", "Mælitækið var bilað"], a: 0,
          ex: "<p><code>prop.test(183, 469)</code> gefur p = 2.5·10⁻⁶, svo frávikið er ekki tilviljun. Ef nemendur velja sjálfir hvort þeir hlaupa er slembivalið farið, og hóparnir geta verið ólíkir (t.d. í hvíldarpúlsi).</p>", out: ["p_inngrip"] }
      ];
    }
  });
})();

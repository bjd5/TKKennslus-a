/* cards/kafli10.js – flashcards fyrir kafla 10: Tvíkosta aðhvarf, næmi og sértæki. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "tvikosta", q: "Tvíkosta aðhvarfslíkan?", a: "logit(p) = log(p/(1 − p)) = β₀ + β₁x." },
  { c: "tvikosta", q: "Úr logit í líkur?", a: "p = 1/(1 + e<sup>−(β₀ + β₁x)</sup>) = <code>plogis(eta)</code>." },
  { c: "tvikosta", q: "Túlkun exp(β)?", a: "Gagnlíkindahlutfall (OR) fyrir einnar einingar aukningu í x, að öðru óbreyttu." },
  { c: "tvikosta", q: "OR fyrir k einingar?", a: "exp(k·β)." },
  { c: "tvikosta", q: "glm í R?", a: "<code>glm(y ~ x, data = d, family = \"binomial\")</code>" },
  { c: "tvikosta", q: "Spá um líkur?", a: "<code>predict(fit, nyr, type = \"response\")</code>" },
  { c: "tvikosta", q: "z value í glm?", a: "Estimate/Std. Error; Wald-próf á H₀: β = 0." },
  { c: "tvikosta", q: "Öryggisbil fyrir OR?", a: "<code>exp(confint.default(fit))</code>: exp(β ± 1.96·SE)." },
  { c: "tvikosta", q: "β = 0?", a: "OR = 1: engin tengsl." },
  { c: "tvikosta", q: "Af hverju ekki lm fyrir 0/1?", a: "Spár geta farið út fyrir [0, 1]; leifar hvorki normaldreifðar né með jafna dreifni." },
  { c: "naemi", q: "Næmi?", a: "P(T+ | D+) = TP/(TP + FN)." },
  { c: "naemi", q: "Sértæki?", a: "P(T− | D−) = TN/(TN + FP)." },
  { c: "naemi", q: "PPV?", a: "P(D+ | T+) = TP/(TP + FP)." },
  { c: "naemi", q: "NPV?", a: "P(D− | T−) = TN/(TN + FN)." },
  { c: "naemi", q: "Hvað ræðst af algengi?", a: "PPV og NPV. Næmi og sértæki eru eiginleikar prófsins." },
  { c: "naemi", q: "Falskt jákvætt / neikvætt?", a: "FP: jákvætt próf hjá heilbrigðum. FN: neikvætt próf hjá veikum." },
  { c: "naemi", q: "ROC-ferill?", a: "Næmi á móti 1 − sértæki fyrir öll skurðgildi." },
  { c: "naemi", q: "AUC?", a: "Flatarmál undir ROC: 0.5 = hending, 1 = fullkomin aðgreining." },
  { c: "naemi", q: "Lægra skurðgildi?", a: "Hærra næmi, lægra sértæki." },
  { c: "naemi", q: "PPV með Bayes?", a: "næmi·algengi/[næmi·algengi + (1 − sértæki)(1 − algengi)]." }
); })();

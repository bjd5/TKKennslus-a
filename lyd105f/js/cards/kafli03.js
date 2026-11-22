/* cards/kafli03.js – flashcards fyrir kafla 3: Líkur: tvíkosta og Poisson. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "binom", q: "Skilyrði tvíkostadreifingar?", a: "Fastur fjöldi n óháðra tilrauna, tvær útkomur, sömu líkur p á árangri í hverri." },
  { c: "binom", q: "Massafall Bin(n, p)?", a: "P(X = k) = (n yfir k)·p<sup>k</sup>(1 − p)<sup>n−k</sup>. <code>dbinom(k, n, p)</code>" },
  { c: "binom", q: "Væntigildi og dreifni Bin(n, p)?", a: "E[X] = np, Var[X] = np(1 − p)." },
  { c: "binom", q: "P(X ≤ k) í R?", a: "<code>pbinom(k, n, p)</code>" },
  { c: "binom", q: "P(X ≥ k) í R?", a: "<code>1 - pbinom(k - 1, n, p)</code> eða <code>pbinom(k - 1, n, p, lower.tail = FALSE)</code>" },
  { c: "binom", q: "Gildran með lower.tail = FALSE?", a: "Fyrir strjálar dreifingar gefur <code>pbinom(k, …, lower.tail = FALSE)</code> P(X &gt; k), ekki P(X ≥ k)." },
  { c: "binom", q: "„Færri en k“?", a: "P(X &lt; k) = P(X ≤ k − 1) = <code>pbinom(k - 1, n, p)</code>" },
  { c: "binom", q: "„Að minnsta kosti k“?", a: "P(X ≥ k) = 1 − P(X ≤ k − 1)." },
  { c: "binom", q: "Tvíliðustuðullinn?", a: "(n yfir k) = n!/(k!(n − k)!): fjöldi leiða til að velja k af n. <code>choose(n, k)</code>" },
  { c: "binom", q: "Normalnálgun á Bin(n, p)?", a: "Ef np og n(1 − p) eru nógu stór: X ≈ N(np, np(1 − p))." },
  { c: "poisson", q: "Hvenær Poisson-dreifing?", a: "Talning atburða á föstu tímabili (eða svæði) með föstum meðalhraða λ, atburðir óháðir." },
  { c: "poisson", q: "Massafall Poisson(λ)?", a: "P(X = k) = e<sup>−λ</sup>λ<sup>k</sup>/k!. <code>dpois(k, λ)</code>" },
  { c: "poisson", q: "Væntigildi og dreifni Poisson(λ)?", a: "Bæði jöfn λ." },
  { c: "poisson", q: "P(X ≤ k) í R?", a: "<code>ppois(k, λ)</code>" },
  { c: "poisson", q: "Lengra tímabil?", a: "λ skalast: 4 á dag → 8 á tveimur dögum → 28 á viku." },
  { c: "poisson", q: "P(X = 0)?", a: "e<sup>−λ</sup>" },
  { c: "poisson", q: "Poisson sem nálgun á tvíkosta?", a: "Ef n er stórt og p lítið: Bin(n, p) ≈ Poisson(np)." },
  { c: "poisson", q: "Bráðamóttakan, λ = 4: P(X ≤ 3)?", a: "<code>ppois(3, 4)</code> = 0.433" },
  { c: "binom", q: "d, p, q og r föll í R?", a: "<code>d</code>: massa-/þéttifall, <code>p</code>: P(X ≤ x), <code>q</code>: prósentumark, <code>r</code>: slembitölur." },
  { c: "binom", q: "Bóluefni 70%, 10 manns: P(X = 7)?", a: "<code>dbinom(7, 10, 0.7)</code> = 0.267" }
); })();

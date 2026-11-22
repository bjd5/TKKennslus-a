/* cards/kafli04.js – flashcards fyrir kafla 4: Normaldreifing og höfuðsetningin. */
(function () { var TK = (window.TK = window.TK || {}); (TK.CARDS = TK.CARDS || []).push(
  { c: "normal", q: "Normaldreifing N(μ, σ²)?", a: "Samhverf, bjöllulaga samfelld dreifing með meðaltal μ og dreifni σ²." },
  { c: "normal", q: "Stöðlun?", a: "Z = (X − μ)/σ ~ N(0, 1)." },
  { c: "normal", q: "P(X &lt; x) í R?", a: "<code>pnorm(x, mean = μ, sd = σ)</code> (athugaðu: sd, ekki dreifni!)" },
  { c: "normal", q: "P(X &gt; x) í R?", a: "<code>pnorm(x, μ, σ, lower.tail = FALSE)</code> eða <code>1 - pnorm(x, μ, σ)</code>" },
  { c: "normal", q: "P(a &lt; X &lt; b)?", a: "<code>pnorm(b, μ, σ) - pnorm(a, μ, σ)</code>" },
  { c: "normal", q: "Prósentumark: x með P(X &lt; x) = p?", a: "<code>qnorm(p, μ, σ)</code> = μ + z<sub>p</sub>·σ" },
  { c: "normal", q: "Mikilvæg z-gildi?", a: "z<sub>0.95</sub> = 1.645, z<sub>0.975</sub> = 1.96, z<sub>0.995</sub> = 2.576, z<sub>0.90</sub> = 1.282." },
  { c: "normal", q: "Væntanlegur fjöldi yfir mörkum?", a: "n·P(X &gt; c), t.d. 150·0.027 = 4.1 með yfirslátt." },
  { c: "normal", q: "Normaldreifingarrit (QQ)?", a: "Punktarnir eiga að falla á beina línu ef gögnin eru normaldreifð. <code>qqnorm(x); qqline(x)</code>" },
  { c: "normal", q: "dnorm?", a: "Hæð þéttifallsins, ekki líkur. Fyrir samfellda breytu er P(X = x) = 0." },
  { c: "clt", q: "Höfuðsetning tölfræðinnar (CLT)?", a: "Fyrir stórt n er X̄ ≈ N(μ, σ²/n), óháð lögun upphaflegu dreifingarinnar." },
  { c: "clt", q: "Staðalskekkja meðaltals?", a: "SE = σ/√n (metin með s/√n)." },
  { c: "clt", q: "Dreifing meðaltals úr N(μ, σ²)?", a: "X̄ ~ N(μ, σ²/n) nákvæmlega, fyrir hvaða n sem er." },
  { c: "clt", q: "Dreifing meðaltals úr Poisson(λ)?", a: "X̄ ≈ N(λ, λ/n)." },
  { c: "clt", q: "Úrtaksdreifing hlutfalls?", a: "p̂ ≈ N(p, p(1 − p)/n)." },
  { c: "clt", q: "Lögmál mikils fjölda?", a: "x̄ nálgast μ þegar n stækkar." },
  { c: "clt", q: "Fjórföldun n?", a: "Helmingar staðalskekkjuna." },
  { c: "clt", q: "P(X̄ &gt; c) í R?", a: "<code>pnorm(c, μ, σ / sqrt(n), lower.tail = FALSE)</code>" },
  { c: "clt", q: "Dreifni 912.02, n = 100?", a: "Var(X̄) = 9.1202, SE = 3.02." },
  { c: "normal", q: "BP ~ N(120, 10²): efstu 5%?", a: "<code>qnorm(0.95, 120, 10)</code> = 136.4 mmHg." }
); })();

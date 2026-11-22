# Býr til js/uttak.js: raunverulegt R-úttak úr gagnasettum áfangans.
# Keyrt úr möppunni lyd105f/:   Rscript tools/uttak.R
# Þarf namsefni/viewer/files/ (gögnin úr Canvas) og pakkana survival, jsonlite.

suppressPackageStartupMessages({ library(survival); library(jsonlite) })
options(width = 82, digits = 7, scipen = 0)
F <- function(x) file.path("namsefni/viewer/files", x)

U <- list()
# chunk(): keyrir kóðann í umhverfinu E og geymir kóðann og úttakið eins og í Rmd
E <- new.env()
chunk <- function(key, code) {
  out <- character(0)
  exprs <- parse(text = code, keep.source = TRUE)
  for (e in exprs) {
    v <- withVisible(eval(e, E))
    if (v$visible) out <- c(out, capture.output(print(v$value)))
  }
  U[[key]] <<- list(code = code, out = paste(sub("\\s+$", "", out), collapse = "\n"))
}

# ---------------------------------------------------------------- Púlsinn
puls <- read.csv2(F("pulsAll.csv"), stringsAsFactors = FALSE)
puls$likamsraekt <- as.numeric(puls$likamsraekt)
assign("puls", puls, E)

chunk("p_summary", 'summary(puls[, c("aldur", "fyrriPuls", "seinniPuls", "likamsraekt")])')
chunk("p_inngrip", 'table(puls$inngrip)
prop.test(x = 183, n = 469)')
chunk("p_var_kyn", 'var.test(fyrriPuls ~ kyn, data = puls)')
chunk("p_t_kyn", 't.test(fyrriPuls ~ kyn, data = puls, var.equal = TRUE)')
chunk("p_parad", 'hlupu <- subset(puls, inngrip == "hljop")
t.test(hlupu$seinniPuls, hlupu$fyrriPuls, paired = TRUE)')
chunk("p_delta", 'puls$delta <- puls$seinniPuls - puls$fyrriPuls
t.test(delta ~ inngrip, data = puls)')
chunk("p_chisq", 'tafla <- table(puls$kyn, puls$reykir)
tafla
chisq.test(tafla)')
chunk("p_lm", 'fit <- lm(seinniPuls ~ fyrriPuls, data = subset(puls, inngrip == "hljop"))
summary(fit)')
chunk("p_glm", 'glm1 <- glm(reykir == "ja" ~ likamsraekt, data = puls, family = "binomial")
summary(glm1)
exp(coef(glm1))')

# ---------------------------------------------------------------- Framingham
fr <- read.csv(F("frmgham2.csv"))
fr <- subset(fr, PERIOD == 1)
fr$kyn <- factor(fr$SEX, 1:2, c("Male", "Female"))
fr$sykursyki <- factor(fr$DIABETES, 0:1, c("No", "Yes"))
fr$aldursflokkur <- cut(fr$AGE, c(30, 40, 50, 60, 70), right = TRUE)
fr$hjarta <- factor(fr$PREVCHD, 0:1, c("No CHD", "CHD"))
assign("fr", fr, E)

chunk("f_tafla", 'tafla <- table(fr$kyn, fr$sykursyki)
tafla
prop.test(tafla)')
chunk("f_var", 'var.test(SYSBP ~ sykursyki, data = fr)')
chunk("f_t_eq", 't.test(SYSBP ~ sykursyki, data = fr, var.equal = TRUE)')
chunk("f_t_welch", 't.test(SYSBP ~ sykursyki, data = fr, var.equal = FALSE)')
chunk("f_aov", 'tapply(fr$TOTCHOL, fr$aldursflokkur, mean, na.rm = TRUE)
summary(aov(TOTCHOL ~ aldursflokkur, data = fr))')
chunk("f_lm", 'fit <- lm(SYSBP ~ BMI, data = fr)
summary(fit)
confint(fit)')
chunk("f_cox", 'cox <- coxph(Surv(TIMEDTH / 365.25, DEATH) ~ hjarta, data = fr)
summary(cox)')
chunk("f_km", 'km <- survfit(Surv(TIMEDTH / 365.25, DEATH) ~ hjarta, data = fr)
km
summary(km, times = c(5, 10, 20))')

# Kaplan–Meier ferlar fyrir teikningu í vafranum
kmcurve <- function(sf) {
  s <- summary(sf, censored = FALSE)
  st <- if (is.null(s$strata)) rep("all", length(s$time)) else as.character(s$strata)
  lapply(split(data.frame(t = round(s$time, 3), s = round(s$surv, 4)), st), function(d) d)
}
KM <- list()
KM$fram <- kmcurve(E$km)

# ---------------------------------------------------------------- Sykursýki
load(F("diabetes.sav"))
diabetes <- as.data.frame(lapply(diabetes, function(x) { attributes(x)[c("label", "units", "comment")] <- NULL; if (inherits(x, "labelled")) unclass(x) else x }))
diabetes$bmi <- 703 * diabetes$weight / diabetes$height^2
diabetes$sykursyki <- as.numeric(diabetes$glyhb >= 7)
diabetes$bmi_group <- cut(diabetes$bmi, c(-Inf, 18, 25, 30, 35, Inf))
assign("diabetes", diabetes, E)

chunk("d_glm", 'fit <- glm(sykursyki ~ age + bmi, data = diabetes, family = "binomial")
summary(fit)
exp(coef(fit))
exp(confint.default(fit))')
chunk("d_naemi", 'diabetes$profun <- ifelse(diabetes$stab.glu >= 126, "T+", "T-")
diabetes$sjukd <- ifelse(diabetes$sykursyki == 1, "D+", "D-")
table(Prof = diabetes$profun, Sjukdomur = diabetes$sjukd)')
chunk("d_chisq", 'table(diabetes$bmi_group, diabetes$sykursyki)
chisq.test(table(diabetes$bmi_group, diabetes$sykursyki))')

# ---------------------------------------------------------------- Plasma
plasma <- read.csv2(F("plasma.csv"))
assign("plasma", plasma, E)
chunk("pl_aov", 'tapply(plasma$betaplasma, plasma$smokstat, mean)
summary(aov(betaplasma ~ smokstat, data = plasma))')
chunk("pl_lm", 'fit <- lm(betaplasma ~ fiber, data = plasma)
summary(fit)')

# ---------------------------------------------------------------- Ristilkrabbamein
colon2 <- transform(subset(survival::colon, etype == 2),
  Lev = ifelse(rx == "Lev", 1, 0), Lev_5FU = ifelse(rx == "Lev+5FU", 1, 0))
assign("colon2", colon2, E)
chunk("c_km", 'km <- survfit(Surv(time, status) ~ rx, data = colon2)
km
summary(km, times = c(365, 1000, 2000))')
chunk("c_cox", 'fit <- coxph(Surv(time, status) ~ Lev + Lev_5FU + age, data = colon2)
summary(fit)')
KM$colon <- kmcurve(E$km)

js <- paste0("// Búið til með tools/uttak.R – ekki breyta handvirkt.\nwindow.UTTAK = ",
  toJSON(U, auto_unbox = TRUE, pretty = FALSE), ";\nwindow.KM = ",
  toJSON(KM, auto_unbox = TRUE, dataframe = "columns"), ";\n")
writeLines(js, "js/uttak.js", useBytes = TRUE)
cat("Skrifaði js/uttak.js með", length(U), "úttökum\n")

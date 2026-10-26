"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  ChevronDown,
  CircleHelp,
  CircleSlash,
  PauseCircle,
  SearchX,
  ShieldAlert,
  TimerOff,
  type LucideIcon,
} from "lucide-react"
import { Header } from "@/components/header"
import { useHydratedTranslation } from "@/hooks/use-hydrated-translation"

type Step = { title: string; desc: string }
type FaqItem = { question: string; answer: string }

const STATUSES: { key: string; icon: LucideIcon; tone: string }[] = [
  { key: "valide", icon: BadgeCheck, tone: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400" },
  { key: "expiree", icon: TimerOff, tone: "text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-400" },
  { key: "suspendue", icon: PauseCircle, tone: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400" },
  { key: "annulee", icon: CircleSlash, tone: "text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-400" },
  { key: "a_venir", icon: CalendarClock, tone: "text-sky-600 bg-sky-500/10 border-sky-500/20 dark:text-sky-400" },
  { key: "introuvable", icon: SearchX, tone: "text-slate-600 bg-slate-500/10 border-slate-500/20 dark:text-slate-400" },
]

export function HelpContent() {
  const { t } = useHydratedTranslation()
  const steps = t("help.steps", { returnObjects: true }) as Step[]
  const faq = t("help.faq", { returnObjects: true }) as FaqItem[]

  return (
    <div className="flex min-h-svh flex-col bg-background font-sans transition-colors duration-300">
      {/* Brand Header */}
      <Header />

      <main className="mx-auto flex w-full max-w-4xl grow flex-col space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("help.back")}</span>
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative space-y-4 overflow-hidden rounded-3xl border border-primary/10 bg-linear-to-br from-primary/5 via-transparent to-emerald-500/5 p-6 text-center shadow-md sm:p-10"
        >
          <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <CircleHelp className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {t("help.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("help.subtitle")}
          </p>
        </motion.div>

        {/* How-to steps */}
        <section aria-labelledby="how-title" className="space-y-5">
          <h2 id="how-title" className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            {t("help.howTitle")}
          </h2>
          <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="space-y-2 rounded-2xl border border-border bg-card p-5 shadow-xs">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-extrabold text-primary">
                  {index + 1}
                </span>
                <h3 className="text-sm font-bold text-foreground sm:text-base">{step.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Statuses */}
        <section aria-labelledby="status-title" className="space-y-5">
          <div className="space-y-1">
            <h2 id="status-title" className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              {t("help.statusTitle")}
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">{t("help.statusIntro")}</p>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STATUSES.map(({ key, icon: Icon, tone }) => (
              <li key={key} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{t(`status.${key}`)}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{t(`status.${key}Desc`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className="space-y-5">
          <h2 id="faq-title" className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            {t("help.faqTitle")}
          </h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-border bg-card px-5 py-4 shadow-xs">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-foreground">
                  <h3>{item.question}</h3>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="pt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Calls to action */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5"
          >
            <span>{t("help.cta")}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/security"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5"
          >
            <ShieldAlert className="h-4 w-4 text-rose-500" />
            <span>{t("nav.security")}</span>
          </Link>
        </div>
      </main>

      {/* Footer details */}
      <footer className="mt-auto border-t border-border bg-muted/30 py-8 text-center">
        <p className="text-[11px] font-semibold text-muted-foreground">{t("app.footer")}</p>
      </footer>
    </div>
  )
}

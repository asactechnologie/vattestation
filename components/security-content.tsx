"use client"

import { useHydratedTranslation } from "@/hooks/use-hydrated-translation"
import { Header } from "@/components/header"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ShieldAlert,
  ShieldCheck,
  Globe,
  Droplets,
  Building2,
  MessageSquare,
  ArrowLeft,
  AlertTriangle,
  Lock,
  Eye,
  CheckCircle,
} from "lucide-react"

export function SecurityContent() {
  const { t, isFr } = useHydratedTranslation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  }


  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans transition-colors duration-300 dark:bg-slate-950">
      {/* Brand Header */}
      <Header />

      <main className="mx-auto flex w-full max-w-4xl flex-grow flex-col space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:scale-102 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("security.back")}</span>
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative space-y-4 overflow-hidden rounded-3xl border border-rose-500/10 bg-linear-to-br from-rose-500/5 via-transparent to-primary/5 p-6 text-center shadow-md sm:p-10 dark:border-rose-500/20"
        >
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 shadow-inner">
            <ShieldAlert className="h-10 w-10 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl md:text-4xl dark:text-slate-100">
            {t("security.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            {t("security.subtitle")}
          </p>
        </motion.div>

        {/* Warning Statement */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3"
        >
          <div className="flex flex-col justify-center space-y-4 md:col-span-2">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
              <Lock className="h-5 w-5 text-primary" />
              {t("security.whyTitle")}
            </h2>
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-400">
              {t("security.whyDesc")}
            </p>
          </div>
          <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span className="text-xs font-extrabold tracking-wider uppercase">
                {t("security.warning")}
              </span>
            </div>
            <p className="text-xs leading-relaxed font-semibold text-slate-600 dark:text-slate-400">
              {isFr
                ? "Ne faites jamais confiance aux résultats de vérification provenant d'URL suspectes ou de SMS envoyés par des numéros mobiles classiques."
                : "Never trust verification results loaded from unrecognized domain URLs or SMS sent by standard phone numbers."}
            </p>
          </div>
        </motion.div>

        {/* The 4 Security Pillars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {/* Rule 1: URL Check */}
          <motion.div
            variants={itemVariants}
            className="group relative flex flex-col space-y-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xs transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 transition-colors group-hover:text-primary sm:text-base dark:text-slate-100">
              {t("security.rules.urlTitle")}
            </h3>
            <p className="flex-grow text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {t("security.rules.urlDesc")}
            </p>
            <div className="pt-2">
              <div className="flex items-center justify-between rounded-lg border border-slate-200/50 bg-slate-100 p-2.5 font-mono text-[10px] break-all text-primary select-all sm:text-[11px] dark:border-slate-800 dark:bg-slate-950">
                <span>https://vattestation.cm</span>
                <Globe className="ml-2 h-3.5 w-3.5 shrink-0 opacity-60" />
              </div>
            </div>
          </motion.div>

          {/* Rule 2: Watermark Check */}
          <motion.div
            variants={itemVariants}
            className="group relative flex flex-col space-y-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xs transition-all duration-300 hover:border-emerald-500/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-110 dark:text-emerald-400">
              <Droplets className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 transition-colors group-hover:text-emerald-600 sm:text-base dark:text-slate-100 dark:group-hover:text-emerald-400">
              {t("security.rules.watermarkTitle")}
            </h3>
            <p className="flex-grow text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {t("security.rules.watermarkDesc")}
            </p>
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-2 pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>{t("security.visibleInBackground")}</span>
            </div>
          </motion.div>

          {/* Rule 3: Company Logo */}
          <motion.div
            variants={itemVariants}
            className="group relative flex flex-col space-y-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xs transition-all duration-300 hover:border-amber-500/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-transform group-hover:scale-110 dark:text-amber-400">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 transition-colors group-hover:text-amber-600 sm:text-base dark:text-slate-100 dark:group-hover:text-amber-400">
              {t("security.rules.logoTitle")}
            </h3>
            <p className="flex-grow text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {t("security.rules.logoDesc")}
            </p>
            <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/10 bg-amber-500/5 p-2 pt-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Eye className="h-4 w-4 shrink-0" />
              <span>{t("security.loadedFromAsac")}</span>
            </div>
          </motion.div>

          {/* Rule 4: Official WhatsApp ChatBot */}
          <motion.div
            variants={itemVariants}
            className="group relative flex flex-col space-y-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xs transition-all duration-300 hover:border-emerald-500/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-110 dark:text-emerald-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 transition-colors group-hover:text-emerald-600 sm:text-base dark:text-slate-100 dark:group-hover:text-emerald-400">
              {t("security.rules.whatsappTitle")}
            </h3>
            <p className="grow text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {t("security.rules.whatsappDesc")}
            </p>
            <div className="pt-2">
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {t("security.officialBot")}: +
                  {process.env.NEXT_PUBLIC_WHATSAPP_BOT_NUMBER || "237 600 000 000"}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Warning Detail Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-r-2xl border-l-4 border-rose-500 bg-rose-500/5 p-5 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
            <div className="space-y-1">
              <p className="text-xs font-bold tracking-wider text-rose-700 uppercase dark:text-rose-400">
                {isFr
                  ? "Comment repérer une tentative d'hameçonnage"
                  : "How to spot a phishing attempt"}
              </p>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                {isFr
                  ? "Pour votre sécurité, privilégiez toujours la vérification directe via notre portail officiel ou notre ChatBot WhatsApp officiel. ASAC ne vous demandera jamais d'argent pour vérifier l'authenticité d'une attestation. Signalez immédiatement tout numéro suspect à votre compagnie d'assurance."
                  : "For your security, always use direct verification via our official portal or our official WhatsApp ChatBot. ASAC will never charge fees for verifying certificate authenticity. Report any suspicious number immediately to your insurer."}
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer details */}
      <footer className="mt-auto border-t border-slate-200/60 bg-slate-100/50 py-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
        <p className="text-[11px] font-semibold text-muted-foreground">
          {t("app.footer")}
        </p>
      </footer>
    </div>
  )
}

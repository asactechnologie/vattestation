"use client"

import { useTranslation } from "react-i18next"
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

export default function SecurityPage() {
  const { t, i18n } = useTranslation()
  const isFr = i18n.language?.startsWith("fr")

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      {/* Brand Header */}
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col space-y-10">
        {/* Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline cursor-pointer bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 transition-all hover:scale-102"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("security.back")}</span>
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-rose-500/10 dark:border-rose-500/20 bg-linear-to-br from-rose-500/5 via-transparent to-primary/5 p-6 sm:p-10 shadow-md text-center space-y-4"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-inner">
            <ShieldAlert className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            {t("security.title")}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t("security.subtitle")}
          </p>
        </motion.div>

        {/* Warning Statement */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
        >
          <div className="md:col-span-2 space-y-4 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              {t("security.whyTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t("security.whyDesc")}
            </p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span className="text-xs font-extrabold uppercase tracking-wider">Warning / Alerte</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Rule 1: URL Check */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:border-primary/30 flex flex-col space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
              {t("security.rules.urlTitle")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">
              {t("security.rules.urlDesc")}
            </p>
            <div className="pt-2">
              <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800 text-[10px] sm:text-[11px] font-mono text-primary break-all select-all flex items-center justify-between">
                <span>https://vattestation.asac-cameroun.org</span>
                <Globe className="w-3.5 h-3.5 opacity-60 ml-2 shrink-0" />
              </div>
            </div>
          </motion.div>

          {/* Rule 2: Watermark Check */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:border-emerald-500/30 flex flex-col space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {t("security.rules.watermarkTitle")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">
              {t("security.rules.watermarkDesc")}
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-500/5 rounded-lg p-2 border border-emerald-500/10">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Visible in results background / Arrière-plan filigrane</span>
            </div>
          </motion.div>

          {/* Rule 3: Company Logo */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:border-amber-500/30 flex flex-col space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {t("security.rules.logoTitle")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">
              {t("security.rules.logoDesc")}
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold bg-amber-500/5 rounded-lg p-2 border border-amber-500/10">
              <Eye className="w-4 h-4 shrink-0" />
              <span>Loaded from ASAC member registry / Flux ASAC officiel</span>
            </div>
          </motion.div>

          {/* Rule 4: SMS Sender ID */}
          <motion.div
            variants={itemVariants}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:border-rose-500/30 flex flex-col space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-rose-500 transition-colors">
              {t("security.rules.smsTitle")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">
              {t("security.rules.smsDesc")}
            </p>
            <div className="pt-2">
              <div className="bg-rose-500/10 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-2.5 rounded-lg border border-rose-500/20 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Sender ID: "ASAC" (Only / Uniquement)</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Warning Detail Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border-l-4 border-rose-500 bg-rose-500/5 rounded-r-2xl p-5 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                {isFr ? "Comment repérer une tentative d'hameçonnage" : "How to spot a phishing attempt"}
              </p>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                {isFr
                  ? "Si vous recevez un SMS de confirmation d'attestation avec un numéro à 9 chiffres classique (ex: +237 6xx xx xx xx) au lieu de l'expéditeur Alphanumérique 'ASAC', cela signifie que l'attestation provient d'un système tiers contrefait. Veuillez signaler immédiatement l'incident à votre assureur."
                  : "If you receive an attestation validation SMS from a normal 9-digit telephone number (e.g. +237 6xx xx xx xx) instead of the Alphanumeric Sender ID 'ASAC', it indicates that the certificate validation page is a fake or counterfeit mirror. Report this event immediately to your insurer."}
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer details */}
      <footer className="py-8 text-center border-t border-slate-200/60 dark:border-slate-800 mt-auto bg-slate-100/50 dark:bg-slate-900/30">
        <p className="text-[11px] text-muted-foreground font-semibold">
          {t("app.footer")}
        </p>
      </footer>
    </div>
  )
}

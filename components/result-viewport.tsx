"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { VerificationResult } from "@/components/verification-result"
import {
  Shield,
  Search,
  QrCode,
  Sparkles,
  CheckCircle2,
  FileSearch,
  Database,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Zap,
  Car,
} from "lucide-react"

interface ResultViewportProps {
  isVerifying: boolean
  apiResponse: any
  apiError: string | null
  wasScanned?: boolean
  searchQuery?: string
  onReset: () => void
  onSelectExample?: (query: string) => void
}

export function ResultViewport({
  isVerifying,
  apiResponse,
  apiError,
  wasScanned = false,
  searchQuery = "",
  onReset,
  onSelectExample,
}: ResultViewportProps) {
  const { t, i18n } = useTranslation()
  const isFr = i18n.language?.startsWith("fr")

  // Animated loader steps state simulation
  const [loaderStep, setLoaderStep] = useState(0)

  // Rotating empty state prompts index for dynamic UX
  const [promptIndex, setPromptIndex] = useState(0)

  useEffect(() => {
    if (isVerifying) {
      setLoaderStep(0)
      const t1 = setTimeout(() => setLoaderStep(1), 600)
      const t2 = setTimeout(() => setLoaderStep(2), 1400)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [isVerifying])

  // Repeatedly cycle through empty state prompts with animation every 3.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % 3)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const hasResult = Boolean(apiResponse || apiError)

  const activeStateKey = isVerifying
    ? "loading"
    : hasResult
      ? "result"
      : "empty"

  const dynamicPromptsFr = [
    {
      text: "Lancez une recherche par immatriculation",
      sub: "Entrez la plaque du véhicule (ex: CE 723 PE) pour vérifier instantanément la validité.",
      icon: Car,
    },
    {
      text: "Recherchez par numéro de châssis (VIN)",
      sub: "Fournissez le numéro de châssis pour interroger la base des attestations liées.",
      icon: ShieldCheck,
    },
    {
      text: "Scannez directement le Code QR",
      sub: "Utilisez votre caméra pour lire automatiquement l'attestation d'assurance.",
      icon: QrCode,
    },
  ]

  const dynamicPromptsEn = [
    {
      text: "Start a search by plate number",
      sub: "Enter the vehicle plate number (e.g. CE 723 PE) to check validity.",
      icon: Car,
    },
    {
      text: "Search by vehicle chassis number",
      sub: "Enter the VIN chassis number to check the associated insurance policy.",
      icon: ShieldCheck,
    },
    {
      text: "Scan the certificate QR Code",
      sub: "Use your camera to instantly decode and verify the certificate.",
      icon: QrCode,
    },
  ]

  const currentPromptList = isFr ? dynamicPromptsFr : dynamicPromptsEn
  const currentPrompt = currentPromptList[promptIndex]
  const PromptIcon = currentPrompt.icon

  return (
    <div className="relative w-full h-full min-h-[440px] flex flex-col justify-start">
      <AnimatePresence mode="wait">
        {/* STATE 1: LOADING ANIMATION */}
        {activeStateKey === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full flex-1 flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl glass-panel border border-primary/20 shadow-xl relative overflow-hidden"
          >
            {/* Glowing top line accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 animate-pulse" />

            {/* Glowing radar pulses */}
            <div className="relative flex items-center justify-center my-6">
              <span className="absolute w-28 h-28 rounded-full bg-primary/10 animate-ping duration-1000" />
              <span className="absolute w-20 h-20 rounded-full bg-primary/20 animate-pulse" />
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
                <Cpu className="w-8 h-8 animate-spin" style={{ animationDuration: "4s" }} />
              </div>
            </div>

            <div className="text-center space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {t("result.checking") || (isFr ? "Vérification en cours..." : "Verifying certificate...")}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                {isFr
                  ? "Interrogation sécurisée de la base de données ASAC"
                  : "Securely querying the ASAC database"}
              </p>
            </div>

            {/* Dynamic Verification Progress Steps */}
            <div className="w-full max-w-xs mt-6 space-y-2.5">
              {/* Step 1 */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-border/50 text-xs transition-all duration-300">
                <Database className={`w-4 h-4 shrink-0 ${loaderStep >= 0 ? "text-primary animate-bounce" : "text-muted-foreground"}`} />
                <span className={`font-semibold ${loaderStep >= 0 ? "text-foreground" : "text-muted-foreground"}`}>
                  {isFr ? "Connexion au registre central..." : "Connecting to central registry..."}
                </span>
                {loaderStep >= 0 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto shrink-0 animate-in zoom-in" />
                )}
              </div>

              {/* Step 2 */}
              <div className={`flex items-center gap-3 p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-border/50 text-xs transition-all duration-300 ${loaderStep < 1 ? "opacity-40" : "opacity-100"}`}>
                <ShieldCheck className={`w-4 h-4 shrink-0 ${loaderStep >= 1 ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`font-semibold ${loaderStep >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
                  {isFr ? "Contrôle de la signature numérique..." : "Checking digital signature..."}
                </span>
                {loaderStep >= 1 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto shrink-0 animate-in zoom-in" />
                )}
              </div>

              {/* Step 3 */}
              <div className={`flex items-center gap-3 p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-border/50 text-xs transition-all duration-300 ${loaderStep < 2 ? "opacity-40" : "opacity-100"}`}>
                <Zap className={`w-4 h-4 shrink-0 ${loaderStep >= 2 ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`font-semibold ${loaderStep >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                  {isFr ? "Extraction des informations de police..." : "Extracting policy details..."}
                </span>
                {loaderStep >= 2 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto shrink-0 animate-in zoom-in" />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* STATE 2: FULL / MINIMALIST RESULT */}
        {activeStateKey === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full flex-1"
          >
            <VerificationResult
              apiResponse={apiResponse}
              apiError={apiError}
              wasScanned={wasScanned}
              searchQuery={searchQuery}
              onReset={onReset}
            />
          </motion.div>
        )}

        {/* STATE 3: DYNAMIC EMPTY VIEW WITH ROTATING PROMPT ANIMATIONS */}
        {activeStateKey === "empty" && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full flex-1 flex flex-col justify-between p-6 md:p-8 rounded-3xl glass-panel border border-border/80 shadow-md relative overflow-hidden"
          >
            {/* Ambient background glow gradient */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-primary animated-icon" />
                <span>{isFr ? "Zone de Résultat" : "Result Viewport"}</span>
              </div>
              <Shield className="w-5 h-5 text-slate-400 dark:text-slate-600" />
            </div>

            {/* Central Animated Rotating Prompts */}
            <div className="my-auto py-6 text-center space-y-4 max-w-sm mx-auto flex flex-col items-center justify-center min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={promptIndex}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col items-center space-y-3"
                >
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-slate-100 to-slate-200/80 dark:from-slate-800 dark:to-slate-900 border border-border shadow-inner flex items-center justify-center">
                      <PromptIcon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-emerald-100 dark:bg-background text-white flex items-center justify-center shadow-md">
                      <Sparkles className="w-4 h-4 animated-icon" />
                    </div>
                  </div>

                  <div className="space-y-1.5 px-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
                      {currentPrompt.text}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {currentPrompt.sub}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Dots Indicator */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setPromptIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${promptIndex === idx ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-slate-400"
                      }`}
                    aria-label={`Go to prompt ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Clickable Quick Examples */}
              {onSelectExample && (
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    {isFr ? "Exemples de test rapide :" : "Quick test examples:"}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => onSelectExample("CE 723 PE")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary border border-border text-xs font-semibold text-foreground transition-all cursor-pointer group"
                    >
                      <span>CE 723 PE</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </button>

                    <button
                      onClick={() => onSelectExample("LT 990 AA")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary border border-border text-xs font-semibold text-foreground transition-all cursor-pointer group"
                    >
                      <span>LT 990 AA</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Security Notice */}
            <div className="pt-4 border-t border-border/50 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                {isFr
                  ? "Plateforme officielle certifiée ASAC"
                  : "Official ASAC Certified Platform"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n" // Initialize i18n
import { useLocalStorageHistory } from "@/hooks/use-local-storage-history"
import { useVerification } from "@/hooks/use-verification"
import { QrScanner } from "@/components/qr-scanner"
import { Header } from "@/components/header"
import { ManualSearch } from "@/components/manual-search"
import { VerificationHistory } from "@/components/verification-history"
import { ResultViewport } from "@/components/result-viewport"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

import {
  QrCode,
  Search,
  History,
  Sparkles,
  ArrowLeft,
  SlidersHorizontal,
  FileCheck,
} from "lucide-react"


export function Dashboard() {
  const { t, i18n } = useTranslation()
  const isFr = i18n.language?.startsWith("fr")

  const {
    history,
    historyReady,
    addToHistory,
    removeFromHistory,
    clearHistory,
  } = useLocalStorageHistory()

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<"scan" | "manual" | "history">("manual")
  const [mobileView, setMobileView] = useState<"form" | "result">("form")
  const [queryInput, setQueryInput] = useState("")
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined)

  // Destructure verification hook
  const {
    isVerifying,
    apiResponse,
    apiError,
    wasScanned,
    searchQuery,
    performVerification,
    resetSearch,
  } = useVerification({ addToHistory })

  const hasResult = Boolean(apiResponse || apiError)

  // Handle URL query parameters on mount (q & redirectUrl)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const qParam = params.get("q")
      const redirectUrlParam = params.get("redirectUrl")

      if (redirectUrlParam) {
        setRedirectUrl(redirectUrlParam)
      }

      if (qParam && qParam.trim().length > 0) {
        const sanitized = qParam.trim().toUpperCase().replace(/[\s-]+/g, "")
        setQueryInput(sanitized)
        setActiveTab("manual")
        setMobileView("result")
        performVerification(sanitized, false)
      }
    }
  }, [])

  // Auto-switch to result view on mobile when verification starts or results arrive
  useEffect(() => {
    if (isVerifying || hasResult) {
      setMobileView("result")
    }
  }, [isVerifying, hasResult])

  // Callback: QR Scanner successfully decoded a string
  const handleQrScanSuccess = (decodedText: string) => {
    setActiveTab("manual")
    const truncated = decodedText.split("|")
    setQueryInput(truncated[0])
    setMobileView("result")
    performVerification(truncated[0], true)
  }

  // Callback: Re-verify an item from history tab
  const handleReverifyHistory = (queryValue: string, itemWasScanned?: boolean) => {
    setQueryInput(queryValue)
    setActiveTab("manual")
    setMobileView("result")
    performVerification(queryValue, !!itemWasScanned)
  }

  // Callback: Search from manual tab or quick example click
  const handleSearch = (val: string) => {
    setQueryInput(val)
    setMobileView("result")
    performVerification(val, false)
  }

  // Callback: Reset current search state
  const handleResetSearch = () => {
    resetSearch()
  }

  return (
    <div className="min-h-svh bg-background transition-colors duration-300 flex flex-col font-sans pb-12 overflow-x-hidden">
      {/* Brand Header */}
      <Header />

      {/* Main Core Viewport Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col items-center space-y-8">
        
        {/* Intro Branding Header (Centered above the 50/50 split layout for premium symmetry) */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="moving-border-badge">
            <div className="moving-border-badge-inner">
              <Sparkles className="w-3.5 h-3.5 animated-icon" />
              <span>Cameroon Public Verification Hub</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {t("app.title")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {t("app.subtitle")}
          </p>
        </div>

        {/* Mobile View Selector Bar (visible only on small screens < lg) */}
        <div className="lg:hidden w-full max-w-md flex items-center justify-between bg-card border border-border p-1.5 rounded-2xl shadow-xs">
          <button
            onClick={() => setMobileView("form")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileView === "form"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{isFr ? "Formulaire" : "Search Form"}</span>
          </button>

          <button
            onClick={() => setMobileView("result")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
              mobileView === "result"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>{isFr ? "Résultats" : "Results"}</span>
            {(isVerifying || hasResult) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-2 right-3" />
            )}
          </button>
        </div>

        {/* 50/50 Symmetric Layout Grid with Center Vertical Divider */}
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14 items-stretch justify-center">
          
          {/* Desktop Central Vertical Divider Line */}
          <div className="hidden lg:flex absolute left-1/2 top-6 bottom-6 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-border/80 to-transparent pointer-events-none z-10 items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-card border border-border/80 shadow-xs flex items-center justify-center text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary/70 animated-icon" />
            </div>
          </div>

          {/* LEFT COLUMN (50% width): FORM & NAVIGATION */}
          <div
            className={`w-full flex flex-col ${
              mobileView === "form" ? "block" : "hidden lg:flex"
            }`}
          >
            {/* Form Panel Container */}
            <div className="bg-card rounded-3xl shadow-xs border border-border p-5 sm:p-7 flex flex-col justify-between h-full min-h-[460px] transition-all duration-300">
              <div>
                {/* Tabs Navigation Controls */}
                <div className="grid grid-cols-3 gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1.5 rounded-2xl mb-6">
                  <button
                    onClick={() => setActiveTab("scan")}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      activeTab === "scan"
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <QrCode className="w-4 h-4 shrink-0" />
                    <span>{t("app.scanQr")}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("manual")}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      activeTab === "manual"
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Search className="w-4 h-4 shrink-0" />
                    <span>{t("app.manualEntry")}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("history")}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      activeTab === "history"
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <History className="w-4 h-4 shrink-0" />
                    <span>{t("app.history")}</span>
                  </button>
                </div>

                {/* Tab Content with Framer Motion Transition */}
                <div className="flex-1 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {activeTab === "scan" && (
                      <motion.div
                        key="scan"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        <QrScanner
                          onScanSuccess={handleQrScanSuccess}
                          onScanError={(err) => console.log("Scan Err:", err)}
                        />
                      </motion.div>
                    )}

                    {activeTab === "manual" && (
                      <motion.div
                        key="manual"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        <ManualSearch
                          queryInput={queryInput}
                          setQueryInput={setQueryInput}
                          isVerifying={isVerifying}
                          onSearch={handleSearch}
                          onReset={handleResetSearch}
                        />
                      </motion.div>
                    )}

                    {activeTab === "history" && (
                      <motion.div
                        key="history"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        <VerificationHistory
                          history={history}
                          historyReady={historyReady}
                          onReverify={handleReverifyHistory}
                          onRemove={removeFromHistory}
                          onClearAll={clearHistory}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (50% width): DYNAMIC RESULT VIEWPORT */}
          <div
            className={`w-full flex flex-col ${
              mobileView === "result" ? "block" : "hidden lg:flex"
            }`}
          >
            {/* Mobile Back Button (only visible on mobile result view) */}
            <div className="lg:hidden flex items-center justify-between pb-3">
              <button
                onClick={() => setMobileView("form")}
                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline cursor-pointer bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isFr ? "Retour au formulaire" : "Back to search form"}</span>
              </button>
            </div>

            {/* Dynamic Result Viewport */}
            <div className="w-full h-full min-h-[460px] flex flex-col">
              <ResultViewport
                isVerifying={isVerifying}
                apiResponse={apiResponse}
                apiError={apiError}
                wasScanned={wasScanned}
                searchQuery={searchQuery}
                redirectUrl={redirectUrl}
                onReset={handleResetSearch}
                onSelectExample={(ex) => {
                  setActiveTab("manual")
                  handleSearch(ex)
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Details */}
      <footer className="mt-auto pt-12 text-center space-y-1">
        <p className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center gap-1.5 flex-wrap">
          <span>{t("app.footer")}</span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          <Link
            href="/security"
            className="text-primary hover:underline font-bold transition-all text-[11px]"
          >
            {isFr ? "Centre de Sécurité & Anti-Fraude" : "Security & Anti-Fraud Center"}
          </Link>
        </p>
        <p className="text-[10px] text-muted-foreground/60 hidden md:block">
          {t("app.pressD")}
        </p>
      </footer>

    </div>
  )
}

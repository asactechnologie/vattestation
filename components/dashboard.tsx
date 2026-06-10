"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n" // Initialize i18n
import { useLocalStorageHistory } from "@/hooks/use-local-storage-history"
import { QrScanner } from "@/components/qr-scanner"
import { Header } from "@/components/header"
import { ManualSearch } from "@/components/manual-search"
import { VerificationHistory } from "@/components/verification-history"
import { VerificationResult } from "@/components/verification-result"

import {
  QrCode,
  Search,
  History,
  Sparkles
} from "lucide-react"

export function Dashboard() {
  const { t } = useTranslation()
  const {
    history,
    historyReady,
    addToHistory,
    removeFromHistory,
    clearHistory
  } = useLocalStorageHistory()

  // Tabs Navigation State
  const [activeTab, setActiveTab] = useState<"scan" | "manual" | "history">("manual")
  
  // Input queries
  const [queryInput, setQueryInput] = useState("")

  // Loading and API states
  const [isVerifying, setIsVerifying] = useState(false)
  const [apiResponse, setApiResponse] = useState<unknown | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  // Action: Trigger certificate verification
  const performVerification = async (infoValue: string) => {
    if (!infoValue.trim()) return

    setIsVerifying(true)
    setApiError(null)
    setApiResponse(null)

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ info: infoValue.trim() }),
      })

      const result = await res.json()

      if (res.ok && result.status) {
        setApiResponse(result)
        addToHistory(infoValue.trim(), true, result.message || "Valide", result.data)
      } else {
        setApiResponse(result)
        setApiError(result.message || t("result.invalidMessage"))
        addToHistory(infoValue.trim(), false, result.message || "Invalide")
      }
    } catch (err: unknown) {
      console.error(err)
      setApiError(t("result.networkError"))
      addToHistory(infoValue.trim(), false, t("result.networkError"))
    } finally {
      setIsVerifying(false)
    }
  }

  // Callback: QR Scanner successfully decoded a string
  const handleQrScanSuccess = (decodedText: string) => {
    setActiveTab("manual")
    const truncated = decodedText.split("|")
    setQueryInput(truncated[0])
    performVerification(decodedText)
  }

  // Callback: Re-verify an item from history tab
  const handleReverifyHistory = (queryValue: string) => {
    setQueryInput(queryValue)
    setActiveTab("manual")
    performVerification(queryValue)
  }

  // Callback: Clear/Reset current API search state
  const handleResetSearch = () => {
    setApiResponse(null)
    setApiError(null)
  }

  return (
    <div className="min-h-svh bg-linear-to-br from-slate-50 via-sky-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 transition-colors duration-300 flex flex-col font-sans pb-12">
      {/* Brand Header */}
      <Header />

      {/* Main Core Viewport */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 mt-8 flex flex-col space-y-6">
        
        {/* Intro branding badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium dark:bg-primary/20 dark:text-sky-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cameroon Public Verification Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            {t("app.title")}
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {t("app.subtitle")}
          </p>
        </div>

        {/* Dashboard Content Panel */}
        <div className="glass-panel rounded-2xl shadow-xs border p-4 md:p-6 transition-all duration-300">
          
          {/* Navigation Controls */}
          <div className="grid grid-cols-3 gap-1 bg-slate-200/50 dark:bg-gray-700 p-1 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab("scan")}
              className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "scan"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>{t("app.scanQr")}</span>
            </button>

            <button
              onClick={() => setActiveTab("manual")}
              className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "manual"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{t("app.manualEntry")}</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "history"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <History className="w-4 h-4" />
              <span>{t("app.history")}</span>
            </button>
          </div>

          {/* Active Tab rendering */}
          <div className="min-h-65 flex items-center justify-center">
            {activeTab === "scan" && (
              <div className="w-full">
                <QrScanner
                  onScanSuccess={handleQrScanSuccess}
                  onScanError={(err) => console.log("Scan Err:", err)}
                />
              </div>
            )}

            {activeTab === "manual" && (
              <ManualSearch
                queryInput={queryInput}
                setQueryInput={setQueryInput}
                isVerifying={isVerifying}
                onSearch={performVerification}
                onReset={handleResetSearch}
              />
            )}

            {activeTab === "history" && (
              <VerificationHistory
                history={history}
                historyReady={historyReady}
                onReverify={handleReverifyHistory}
                onRemove={removeFromHistory}
                onClearAll={clearHistory}
              />
            )}
          </div>
        </div>

        {/* LOADING ANIMATION STATE */}
        {isVerifying && (
          <div className="glass-panel border-t-4 border-primary rounded-2xl p-6 shadow-lg space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20" />
              <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
          </div>
        )}

        {/* RESULTS CARD VIEW */}
        {!isVerifying && (
          <VerificationResult
            apiResponse={apiResponse}
            apiError={apiError}
          />
        )}
      </main>

      {/* Footer Details */}
      <footer className="mt-auto pt-10 text-center space-y-1">
        <p className="text-[10px] text-muted-foreground font-semibold">
          {t("app.footer")}
        </p>
        <p className="text-[9px] text-muted-foreground/60 hidden md:block">
          {t("app.pressD")}
        </p>
      </footer>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"
import { Download, X, Smartphone, Monitor } from "lucide-react"

export function PwaInitializer() {
  const { t } = useTranslation()
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [showIosTip, setShowIosTip] = useState(false)

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully with scope:", registration.scope)
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })
    }

    // 2. Detect if already standalone PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true

    if (isStandalone) return

    // 3. Detect iOS
    const userAgent = navigator.userAgent || ""
    const isAppleMobile = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
    setIsIOS(isAppleMobile)

    // 4. Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // If prompt not dismissed before, show it after a small delay
      const dismissed = localStorage.getItem("asac_pwa_prompt_dismissed")
      if (dismissed !== "true") {
        const timer = setTimeout(() => {
          setShowPrompt(true)
        }, 2500)
        return () => clearTimeout(timer)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // 5. Fallback for iOS
    const dismissed = localStorage.getItem("asac_pwa_prompt_dismissed")
    if (dismissed !== "true" && isAppleMobile) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 2500)
      return () => clearTimeout(timer)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`PWA install prompt outcome: ${outcome}`)
      setDeferredPrompt(null)
      setShowPrompt(false)
      localStorage.setItem("asac_pwa_prompt_dismissed", "true")
    } else if (isIOS) {
      setShowIosTip(true)
    } else {
      // General fallback
      alert(t("pwa.iosTip"))
      setShowPrompt(false)
      localStorage.setItem("asac_pwa_prompt_dismissed", "true")
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("asac_pwa_prompt_dismissed", "true")
  }

  if (!showPrompt) return null

  return (
    <div className="fixed right-5 bottom-5 z-50 flex w-[90%] max-w-87.5 animate-in flex-col gap-3 rounded-2xl border  bg-linear-to-br from-primary/10 to-background/30 backdrop-blur-md p-4 shadow-2xl transition-all duration-300 slide-in-from-bottom-5 slide-in-from-right-5 fade-in sm:w-full dark:border-slate-800/50">
      {/* Toast Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <img
              src="/asac_icon_512.png"
              alt="Logo"
              className={"h-full w-auto object-center"}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide">
              {"ASAC vAttestation"}
            </span>
            <span className="text-xs tracking-wide text-muted-foreground">
              {t("pwa.promptTitle")}
            </span>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="cursor-pointer rounded-full p-2 transition-colors hover:bg-slate-800/20"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Toast Content */}
      <div className="space-y-2">
        <p className="text-xs leading-relaxed">{t("pwa.promptMessage")}</p>

        {showIosTip && (
          <div className="animate-in rounded-xl border border-sky-500/20 bg-sky-500/10 p-2.5 text-[10px] leading-relaxed font-semibold text-sky-300 duration-200 fade-in">
            {t("pwa.iosTip")}
          </div>
        )}
      </div>

      {/* Toast Actions */}
      <div className="mt-1 flex flex-col items-center justify-end gap-1">
        <button
          onClick={handleInstall}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-linear-to-r from-primary to-primary/70 px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:scale-105"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{t("pwa.installButton")}</span>
        </button>
      </div>
      <div
        className={
          "flex items-center justify-center gap-2 text-[10px] text-muted-foreground"
        }
      >
        <span className={"flex gap-1"}>
          <Monitor className={"h-4 w-4"} />
          {"Supports Mac/Windows"}
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
        <span className={"flex gap-1"}>
          <Smartphone className={"h-4 w-4"} />
          {"Supports iOS/Android"}
        </span>
      </div>
    </div>
  )
}

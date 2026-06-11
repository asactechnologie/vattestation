"use client"

import { useTranslation } from "react-i18next"
import { useTheme as useNextTheme } from "next-themes"
import { Languages, Sun, Moon } from "lucide-react"

export function Header() {
  const { t, i18n } = useTranslation()
  const { resolvedTheme, setTheme } = useNextTheme()

  const toggleLanguage = () => {
    const nextLang = i18n.language === "fr" ? "en" : "fr"
    i18n.changeLanguage(nextLang)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center">
            <img
              src="/assets/logo_asac.png"
              alt="Logo ASAC"
              className={"h-full w-auto object-center dark:brightness-0 dark:invert"}
            />
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-100 tracking-tight text-base">
              ASAC
            </span>
            <span className="text-[10px] block text-primary font-semibold tracking-widest -mt-1 uppercase">
              vAttestation
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-850 border border-border text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            aria-label={t("app.language")}
          >
            <Languages className="w-4 h-4 text-primary" />
            <span className="tracking-wide">{i18n.language === "fr" ? "EN" : "FR"}</span>
          </button>

          {/* Theme Selector */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-850 border border-border text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label={t("app.toggleTheme")}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

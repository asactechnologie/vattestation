"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Search, Shield, Loader2, AlertCircle } from "lucide-react"
import { Button } from "./ui/button"

interface ManualSearchProps {
  queryInput: string
  setQueryInput: (val: string) => void
  isVerifying: boolean
  onSearch: (val: string) => void
  onReset: () => void
}

export function ManualSearch({
  queryInput,
  setQueryInput,
  isVerifying,
  onSearch,
  onReset,
}: ManualSearchProps) {
  const { t } = useTranslation()
  const [validationError, setValidationError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!queryInput.trim()) {
      setValidationError(t("manual.validationError"))
      return
    }
    setValidationError("")
    onSearch(queryInput)
  }

  const handleClear = () => {
    setQueryInput("")
    setValidationError("")
    onReset()
  }

  return (
    <div className="w-full space-y-4 py-2">
      {/* Information text */}
      <div className="space-y-1.5 text-center md:text-left">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          {t("manual.title")}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("manual.description")}
        </p>
      </div>

      {/* Verification Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div>
            <label
              htmlFor="info-input"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5"
            >
              {t("manual.immatriculationLabel")} / {t("manual.chassisLabel")}
            </label>
            <div className="relative">
              <input
                id="info-input"
                type="text"
                className="w-full bg-slate-100/50 dark:bg-slate-950/50 border border-border rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-650"
                placeholder={t("manual.searchPlaceholder")}
                value={queryInput}
                onChange={(e) => {
                  setQueryInput(e.target.value)
                  if (e.target.value) setValidationError("")
                }}
              />
              <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
            </div>
            {validationError && (
              <p className="text-xs text-destructive mt-1.5 flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {validationError}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            type="submit"
            disabled={isVerifying}
            className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-primary/15 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t("result.checking")}</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>{t("manual.submit")}</span>
              </>
            )}
          </Button>

          {queryInput && (
            <button
              type="button"
              onClick={handleClear}
              className="h-11 px-4 border border-border hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors cursor-pointer shrink-0"
            >
              {t("manual.clear")}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

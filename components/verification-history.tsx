"use client"

import { useTranslation } from "react-i18next"
import { History, Trash2, Loader2 } from "lucide-react"
import { HistoryItem } from "@/hooks/use-local-storage-history"

interface VerificationHistoryProps {
  history: HistoryItem[]
  historyReady: boolean
  onReverify: (query: string) => void
  onRemove: (id: string) => void
  onClearAll: () => void
}

export function VerificationHistory({
  history,
  historyReady,
  onReverify,
  onRemove,
  onClearAll,
}: VerificationHistoryProps) {
  const { t, i18n } = useTranslation()

  // Helper date formatter
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(i18n.language === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return dateString
    }
  }

  const handleClearAll = () => {
    if (confirm(t("history.clearConfirm"))) {
      onClearAll()
    }
  }

  return (
    <div className="w-full space-y-4 py-2">
      {/* List Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            {t("history.title")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("history.description")}
          </p>
        </div>
        {historyReady && history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-destructive hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t("history.clearAll")}</span>
          </button>
        )}
      </div>

      {/* List content */}
      {!historyReady ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 bg-slate-550/5 dark:bg-slate-400/5 rounded-xl border border-dashed border-border p-6">
          <History className="w-8 h-8 text-muted-foreground/55 mb-2" />
          <p className="text-xs text-muted-foreground font-semibold">
            {t("history.empty")}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-100/40 dark:bg-slate-900/30 border border-border rounded-xl flex items-center justify-between gap-3 hover:border-primary/20 dark:hover:border-primary/30 transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {item.status ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block max-w-[150px] md:max-w-[240px]">
                    {item.query}
                  </span>
                </div>
                {item.numeroAttestation && (
                  <p className="text-[10px] text-muted-foreground font-semibold truncate block">
                    {item.numeroAttestation} | {item.nomAssure}
                  </p>
                )}
                <p className="text-[9px] text-muted-foreground">
                  {t("history.date")}: {formatDate(new Date(item.timestamp).toISOString())}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onReverify(item.query)}
                  className="text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  {t("history.reverify")}
                </button>
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

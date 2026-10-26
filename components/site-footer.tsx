"use client"

import Link from "next/link"
import { useHydratedTranslation } from "@/hooks/use-hydrated-translation"

export function SiteFooter() {
  const { t } = useHydratedTranslation()

  return (
    <footer className="mt-auto pt-4 text-center space-y-1">
      <p className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center gap-1.5 flex-wrap">
        <span>{t("app.footer")}</span>
        <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
        <Link
          href="/security"
          className="text-primary hover:underline font-bold transition-all text-[11px]"
        >
          {t("nav.security")}
        </Link>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <Link
          href="/help"
          className="text-primary hover:underline font-bold transition-all text-[11px]"
        >
          {t("nav.help")}
        </Link>
      </p>
      <p className="text-[10px] text-muted-foreground/60 hidden md:block">
        {t("app.pressD")}
      </p>
    </footer>
  )
}

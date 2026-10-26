"use client"

import { Sparkles } from "lucide-react"
import { useHydratedTranslation } from "@/hooks/use-hydrated-translation"

// Server-rendered intro so crawlers get the page's <h1> without running the dashboard.
export function HomeIntro() {
  const { t } = useHydratedTranslation()

  return (
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
  )
}

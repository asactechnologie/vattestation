"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import {
  Home,
  ArrowLeft,
  Search,
  Compass,
  CircleHelp,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Building2,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHydratedTranslation } from "@/hooks/use-hydrated-translation"
import { ASAC_URL } from "@/lib/seo"
import { cn } from "@/lib/utils"

export function NotFoundContent() {
  const router = useRouter()
  const { t } = useHydratedTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const prefersReducedMotion = useReducedMotion()

  // Hand the plate/chassis over to the dashboard, which verifies the `q` param on mount
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim().toUpperCase().replace(/[\s-]+/g, "")
    if (!query) return
    router.push(`/?q=${encodeURIComponent(query)}`)
  }

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const destinations = [
    {
      title: t("notFound.verifyTitle"),
      description: t("notFound.verifyDesc"),
      href: "/",
      icon: Home,
      gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
      iconColor: "text-blue-500 dark:text-blue-400",
      borderColor: "group-hover:border-blue-500/40",
    },
    {
      title: t("notFound.helpTitle"),
      description: t("notFound.helpDesc"),
      href: "/help",
      icon: CircleHelp,
      gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
      iconColor: "text-emerald-500 dark:text-emerald-400",
      borderColor: "group-hover:border-emerald-500/40",
    },
    {
      title: t("notFound.securityTitle"),
      description: t("notFound.securityDesc"),
      href: "/security",
      icon: ShieldAlert,
      gradient: "from-rose-500/20 via-rose-500/10 to-transparent",
      iconColor: "text-rose-500 dark:text-rose-400",
      borderColor: "group-hover:border-rose-500/40",
    },
    {
      title: t("notFound.asacTitle"),
      description: t("notFound.asacDesc"),
      href: ASAC_URL,
      external: true,
      icon: Building2,
      gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
      iconColor: "text-amber-500 dark:text-amber-400",
      borderColor: "group-hover:border-amber-500/40",
    },
  ]

  return (
    <div className="relative min-h-[calc(100svh-4rem)] w-full overflow-hidden bg-background py-12 md:py-16">
      {/* Atmospheric ambient glows & grid pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient glow orbs (Cameroon tricolor & ASAC navy accents) */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-[120px] dark:bg-emerald-500/10" />
        <div className="absolute top-1/4 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[150px] dark:bg-primary/25" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-rose-500/15 blur-[130px] dark:bg-rose-500/10" />
        <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-amber-400/15 blur-[120px] dark:bg-amber-400/10" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary shadow-sm backdrop-blur-md select-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
          </span>
          <span className="uppercase">{t("notFound.badge")}</span>
        </motion.div>

        {/* Hero centerpiece: 4 - [radar portal] - 4 */}
        <div className="relative my-6 flex items-center justify-center gap-2 select-none sm:my-8 sm:gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -30 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: prefersReducedMotion ? 0 : [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.7, delay: 0.1 },
              scale: { duration: 0.7, delay: 0.1 },
              x: { duration: 0.7, delay: 0.1 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
            className="bg-gradient-to-b from-foreground via-foreground/80 to-foreground/30 bg-clip-text text-7xl font-black tracking-tighter text-transparent drop-shadow-sm sm:text-9xl md:text-[11rem]"
          >
            4
          </motion.div>

          {/* Central holographic radar / compass "0" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute inset-0 scale-125 rounded-full bg-primary/30 blur-2xl dark:bg-primary/40" />

            <motion.div
              animate={{ rotate: prefersReducedMotion ? 0 : 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              className="absolute size-28 rounded-full border-2 border-dashed border-primary/40 sm:size-36 md:size-44 dark:border-primary/60"
            />
            <motion.div
              animate={{ rotate: prefersReducedMotion ? 0 : -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute size-32 rounded-full border border-dotted border-border/60 sm:size-40 md:size-48"
            />

            {/* Pulsing sonar waves */}
            <motion.div
              animate={prefersReducedMotion ? {} : { scale: [1, 1.4, 1.6], opacity: [0.6, 0.2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
              className="absolute size-24 rounded-full border border-primary/50 sm:size-32 md:size-40"
            />
            <motion.div
              animate={prefersReducedMotion ? {} : { scale: [1, 1.4, 1.6], opacity: [0.6, 0.2, 0] }}
              transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute size-24 rounded-full border border-secondary/50 sm:size-32 md:size-40"
            />

            {/* Center lens / compass orb */}
            <div className="relative flex size-24 items-center justify-center rounded-full border border-white/20 bg-gradient-to-tr from-card/80 via-background/90 to-card/90 shadow-2xl backdrop-blur-xl sm:size-32 md:size-40">
              <div className="absolute inset-1 rounded-full bg-gradient-to-b from-primary/10 via-transparent to-secondary/10" />

              <div className="absolute top-1.5 flex items-center gap-1 font-mono text-[8px] tracking-widest text-muted-foreground/80 uppercase sm:text-[9px]">
                <MapPin className="size-2 text-rose-500" />
                <span>DLA 4.05°N</span>
              </div>

              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: [0, 8, -6, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex flex-col items-center justify-center"
              >
                <div className="relative flex items-center justify-center">
                  <Compass className="size-10 text-primary drop-shadow-[0_0_15px_rgba(28,119,184,0.4)] sm:size-14 md:size-16" />
                  <ShieldCheck className="absolute size-5 text-secondary drop-shadow-[0_0_8px_rgba(206,17,38,0.5)] sm:size-7 md:size-8" />
                </div>
              </motion.div>

              <div className="absolute bottom-1.5 font-mono text-[8px] tracking-wider text-muted-foreground/80 uppercase sm:text-[9px]">
                ASAC • 404
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: prefersReducedMotion ? 0 : [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.7, delay: 0.1 },
              scale: { duration: 0.7, delay: 0.1 },
              x: { duration: 0.7, delay: 0.1 },
              y: { duration: 6, delay: 0.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="bg-gradient-to-b from-foreground via-foreground/80 to-foreground/30 bg-clip-text text-7xl font-black tracking-tighter text-transparent drop-shadow-sm sm:text-9xl md:text-[11rem]"
          >
            4
          </motion.div>
        </div>

        {/* Title & subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl"
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {t("notFound.title")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("notFound.subtitle")}
          </p>
          <p className="mt-1 text-xs leading-relaxed font-light text-muted-foreground/80 sm:text-sm">
            {t("notFound.description")}
          </p>
        </motion.div>

        {/* Quick verification bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 w-full max-w-xl"
        >
          <form
            onSubmit={handleSearch}
            className="group relative flex items-center rounded-2xl border border-border/70 bg-card/70 p-1.5 shadow-lg backdrop-blur-xl transition-all duration-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 dark:bg-card/40"
          >
            <div className="flex items-center pr-2 pl-3.5 text-muted-foreground transition-colors group-focus-within:text-primary">
              <Search className="size-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("notFound.searchPlaceholder")}
              aria-label={t("notFound.searchPlaceholder")}
              autoCapitalize="characters"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:outline-none"
            />
            <Button
              type="submit"
              size="sm"
              className="rounded-xl px-4 font-semibold shadow-md transition-all hover:shadow-primary/30"
            >
              <span>{t("notFound.searchButton")}</span>
            </Button>
          </form>
        </motion.div>

        {/* Primary action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden rounded-xl px-6 font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="size-4 transition-transform group-hover:scale-110" />
              <span>{t("notFound.backHome")}</span>
            </Link>
          </Button>

          <Button
            onClick={handleGoBack}
            variant="outline"
            size="lg"
            className="group rounded-xl border-border/80 bg-background/60 px-6 font-medium backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/80"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>{t("notFound.previousPage")}</span>
          </Button>
        </motion.div>

        {/* Useful destinations grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 w-full"
        >
          <div className="mb-6 flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase select-none">
            <Sparkles className="size-3.5 text-primary" />
            <span>{t("notFound.popularLinks")}</span>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={cn(
                    "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-card/80 hover:shadow-xl dark:bg-card/25 dark:hover:bg-card/50",
                    item.borderColor
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                      item.gradient
                    )}
                  />

                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-background/80 shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <Icon className={cn("size-5", item.iconColor)} />
                    </div>
                    {item.external ? (
                      <ExternalLink className="size-4 text-muted-foreground/60 transition-all duration-300 group-hover:text-foreground" />
                    ) : (
                      <ArrowRight className="size-4 text-muted-foreground/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground" />
                    )}
                  </div>

                  <div className="relative z-10 mt-4">
                    <h2 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* Assistance footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted-foreground/75"
        >
          <span>{t("notFound.needHelp")}</span>
          <Link
            href="/help"
            className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            <span>{t("notFound.contactSupport")}</span>
            <ArrowRight className="size-3" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

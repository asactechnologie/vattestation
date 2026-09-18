"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { generateSlug } from "@/lib/services/slug"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Download,
  FileText,
  Shield,
  Car,
  User,
  Building2,
  Calendar,
  Sparkles,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  X,
  Eye,
  MessageCircle,
} from "lucide-react"
import { AsacWatermark } from "@/components/AsacWatermark"
import CmrFlag from "@/components/CmrFlag"
import {
  AttestationStatusCode,
  AttestationStatusInfo,
  CertificateData,
  ChildCertificate,
  VerificationResponse,
} from "@/lib/strategies/types"

interface VerificationResultProps {
  apiResponse: VerificationResponse | null | undefined
  apiError: string | null
  wasScanned?: boolean
  searchQuery?: string
  redirectUrl?: string
  onReset?: () => void
}

export function VerificationResult({
  apiResponse,
  apiError,
  wasScanned = false,
  searchQuery = "",
  redirectUrl,
  onReset,
}: VerificationResultProps) {
  const { t, i18n } = useTranslation()
  const [showChildCert, setShowChildCert] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [showWhatsappInput, setShowWhatsappInput] = useState(false)

  const getWhatsAppBotNumber = () => {
    const envVal = process.env.NEXT_PUBLIC_WHATSAPP_BOT_NUMBER
    return envVal ? envVal.replace(/\D/g, "") : "237600000000"
  }

  const getWhatsAppUrl = (queryText: string) => {
    const botNumber = getWhatsAppBotNumber()
    const text = `${queryText}`
    return `https://wa.me/${botNumber}?text=${encodeURIComponent(text)}`
  }

  const isCovered = Boolean(apiResponse?.est_couvert ?? apiResponse?.status)
  const certificateData: CertificateData | undefined = apiResponse?.data?.[0]
  const statusCode: AttestationStatusCode =
    apiResponse?.statut?.code ||
    certificateData?.statut?.code ||
    (isCovered ? "VALIDE" : "INTROUVABLE")
  const statusInfo: AttestationStatusInfo | undefined =
    apiResponse?.statut || certificateData?.statut
  const hasData = Boolean(certificateData)

  // Date formatter
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString
      return date.toLocaleDateString(i18n.language === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  useEffect(() => {
    let isMounted = true

    if (!certificateData || !certificateData.nom_compagnie) {
      Promise.resolve().then(() => {
        if (isMounted) setLogoUrl(null)
      })
      return
    }

    const companyName = certificateData.nom_compagnie
    const slug = generateSlug(companyName)

    fetch(`/api/member/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((data) => {
        if (isMounted && data && data.logo && data.logo.url) {
          setLogoUrl(data.logo.url)
        } else {
          if (isMounted) setLogoUrl(null)
        }
      })
      .catch((err) => {
        console.error("Failed to load member logo:", err)
        if (isMounted) setLogoUrl(null)
      })

    return () => {
      isMounted = false
    }
  }, [certificateData])

  const isImageUrl = (url?: string | null) => {
    if (!url) return false
    const cleanUrl = url.split("?")[0].split("#")[0]

    // If it explicitly ends with .pdf, it's not an image
    if (/\.pdf$/i.test(cleanUrl)) return false

    return (
      /^(https?:\/\/|\/|data:image\/)/i.test(url) &&
      (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanUrl) ||
        url.startsWith("data:image/") ||
        cleanUrl.endsWith("/download") ||
        url.includes("/certificates/"))
    )
  }

  const getStatusBadge = (code: AttestationStatusCode) => {
    switch (code) {
      case "VALIDE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            {t("status.valide")}
          </span>
        )
      case "SUSPENDUE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
            {t("status.suspendue")}
          </span>
        )
      case "ANNULEE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
            {t("status.annulee")}
          </span>
        )
      case "EXPIREE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_#fb7185]" />
            {t("status.expiree")}
          </span>
        )
      case "A_VENIR":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-xs font-bold text-sky-700 dark:text-sky-300">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shadow-[0_0_6px_#0ea5e9]" />
            {t("status.a_venir")}
          </span>
        )
      case "INTROUVABLE":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
            {t("status.introuvable")}
          </span>
        )
    }
  }

  const getHeaderTitle = (code: AttestationStatusCode) => {
    switch (code) {
      case "VALIDE":
        return t("result.valid")
      case "SUSPENDUE":
        return t("result.suspended")
      case "ANNULEE":
        return t("result.cancelled")
      case "EXPIREE":
        return t("result.expired")
      case "A_VENIR":
        return t("result.upcoming")
      case "INTROUVABLE":
      default:
        return t("result.invalid")
    }
  }

  const getHeaderTextColor = (code: AttestationStatusCode) => {
    switch (code) {
      case "VALIDE":
        return "text-emerald-800 dark:text-emerald-400"
      case "SUSPENDUE":
        return "text-amber-800 dark:text-amber-400"
      case "A_VENIR":
        return "text-sky-800 dark:text-sky-400"
      case "ANNULEE":
      case "EXPIREE":
      case "INTROUVABLE":
      default:
        return "text-rose-800 dark:text-rose-400"
    }
  }

  const getBorderColor = (code: AttestationStatusCode) => {
    switch (code) {
      case "VALIDE":
        return "border-emerald-500"
      case "SUSPENDUE":
        return "border-amber-500"
      case "A_VENIR":
        return "border-sky-500"
      case "ANNULEE":
      case "EXPIREE":
      case "INTROUVABLE":
      default:
        return "border-rose-500"
    }
  }

  const renderHeaderIcon = (
    code: AttestationStatusCode,
    logo: string | null,
    companyName?: string,
    size: "sm" | "lg" = "sm"
  ) => {
    const iconSizeClass = size === "lg" ? "h-9 w-9" : "h-6 w-6"
    const containerSizeClass = size === "lg" ? "h-16 w-16" : "h-10 w-10"
    const logoBoxClass =
      size === "lg"
        ? "h-20 w-20 p-2.5 rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800"
        : "h-12 w-12 p-1.5 rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-700 dark:bg-slate-800"
    const badgePosClass = size === "lg" ? "-right-1.5 -bottom-1.5 p-1" : "-right-1 -bottom-1 p-0.5"
    const miniIconClass = size === "lg" ? "h-5 w-5" : "h-4 w-4"

    let IconComponent = CheckCircle2
    let iconCol = "text-emerald-500"
    let bgCol = "bg-emerald-500/10 border-emerald-500/25"

    if (code === "SUSPENDUE") {
      IconComponent = AlertTriangle
      iconCol = "text-amber-500"
      bgCol = "bg-amber-500/10 border-amber-500/25"
    } else if (code === "ANNULEE" || code === "INTROUVABLE") {
      IconComponent = XCircle
      iconCol = "text-rose-500"
      bgCol = "bg-rose-500/10 border-rose-500/25"
    } else if (code === "EXPIREE") {
      IconComponent = AlertTriangle
      iconCol = "text-rose-500"
      bgCol = "bg-rose-500/10 border-rose-500/25"
    } else if (code === "A_VENIR") {
      IconComponent = Sparkles
      iconCol = "text-sky-500"
      bgCol = "bg-sky-500/10 border-sky-500/25"
    }

    return (
      <div className="relative shrink-0">
        {logo ? (
          <div className={`flex items-center justify-center ${logoBoxClass}`}>
            <img
              src={logo}
              alt={companyName || "Logo"}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div
            className={`flex items-center justify-center rounded-full border ${bgCol} ${containerSizeClass}`}
          >
            <IconComponent
              className={`${iconSizeClass} ${iconCol} ${
                code === "VALIDE" ? "animate-pulse" : ""
              }`}
            />
          </div>
        )}
        {logo && (
          <div
            className={`absolute rounded-full border border-slate-100 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 ${badgePosClass}`}
          >
            <IconComponent className={`${miniIconClass} ${iconCol}`} />
          </div>
        )}
      </div>
    )
  }

  const renderChildStateBadge = (childCert: ChildCertificate) => {
    const name = childCert.state?.name?.toLowerCase() || ""
    const label = childCert.state?.label || childCert.state?.name || "Statut"
    if (name.includes("cancel") || name.includes("annul") || name.includes("resili")) {
      return (
        <span className="mt-0.5 inline-flex max-w-max items-center rounded border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 capitalize">
          {label}
        </span>
      )
    }
    if (name.includes("suspend")) {
      return (
        <span className="mt-0.5 inline-flex max-w-max items-center rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 capitalize">
          {label}
        </span>
      )
    }
    return (
      <span className="mt-0.5 inline-flex max-w-max items-center rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 capitalize">
        {label}
      </span>
    )
  }

  if (!apiResponse) return null

  const isMinimalist =
    hasData && !wasScanned && !!searchQuery && searchQuery.trim().length <= 10

  /* MINIMALIST POPUP / MODAL VIEW */
  if (isMinimalist && certificateData) {
    const modalBorderColor =
      statusCode === "VALIDE"
        ? "border-emerald-500/20"
        : statusCode === "SUSPENDUE"
        ? "border-amber-500/20"
        : statusCode === "A_VENIR"
        ? "border-sky-500/20"
        : "border-rose-500/20"

    const actionButtonBg =
      statusCode === "VALIDE"
        ? "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
        : statusCode === "SUSPENDUE"
        ? "bg-amber-600 hover:bg-amber-700 active:bg-amber-800"
        : statusCode === "A_VENIR"
        ? "bg-sky-600 hover:bg-sky-700 active:bg-sky-800"
        : "bg-rose-600 hover:bg-rose-700 active:bg-rose-800"

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        onClick={() => onReset?.()}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-md space-y-6 overflow-hidden rounded-2xl border ${modalBorderColor} bg-white p-6 shadow-2xl max-sm:fixed max-sm:inset-0 max-sm:m-0 max-sm:flex max-sm:h-full max-sm:w-full max-sm:flex-col max-sm:justify-between max-sm:rounded-none md:p-8 dark:bg-slate-900`}
          onClick={(e) => e.stopPropagation()}
        >
          {isCovered && (
            <>
              <AsacWatermark />
              <CmrFlag />
            </>
          )}

          {/* Top close button */}
          <button
            onClick={() => onReset?.()}
            className="absolute top-4 right-4 cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            title={t("result.close")}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-1 flex-col justify-center space-y-6 max-sm:py-8">
            {/* Header Status Section */}
            <div className="flex flex-col items-center space-y-3 text-center">
              {renderHeaderIcon(
                statusCode,
                logoUrl,
                certificateData.nom_compagnie,
                "lg"
              )}

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <h4 className={`text-xl font-extrabold ${getHeaderTextColor(statusCode)}`}>
                    {getHeaderTitle(statusCode)}
                  </h4>
                  {getStatusBadge(statusCode)}
                </div>
                <p className="text-sm font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                  {statusInfo?.motif ||
                    apiResponse.message ||
                    (isCovered ? t("result.validMessage") : t("result.invalidMessage"))}
                </p>
              </div>

              {!isCovered && (
                <div
                  className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold ${
                    statusCode === "SUSPENDUE"
                      ? "border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                      : statusCode === "A_VENIR"
                      ? "border-sky-500/20 bg-sky-500/10 text-sky-800 dark:text-sky-300"
                      : "border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-300"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>
                    {statusCode === "SUSPENDUE" && t("status.suspendueDesc")}
                    {statusCode === "ANNULEE" && t("status.annuleeDesc")}
                    {statusCode === "EXPIREE" && t("status.expireeDesc")}
                    {statusCode === "A_VENIR" && t("status.a_venirDesc")}
                    {statusCode === "INTROUVABLE" && t("status.introuvableDesc")}
                  </span>
                </div>
              )}
            </div>

            {/* Minimalist Details Card */}
            <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/40">
              {/* Item: Number */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Shield className="h-3.5 w-3.5 text-slate-400" />
                  {t("result.attestationNumber")}
                </span>
                <span className="text-sm font-bold select-all text-slate-800 dark:text-slate-100">
                  {certificateData.numero_attestation}
                </span>
              </div>

              {/* Item: Company */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {t("result.company")}
                </span>
                <div className="flex items-center gap-2 text-right">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {certificateData.nom_compagnie}
                  </span>
                  {logoUrl && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200/50 bg-white p-0.5 dark:bg-slate-800">
                      <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Item: Date start */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {t("result.effectiveDate")}
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {formatDate(certificateData.date_effet)}
                </span>
              </div>

              {/* Item: Date end */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {t("result.expiryDate")}
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {formatDate(certificateData.date_expiration)}
                </span>
              </div>
            </div>

            {/* Quick Actions (WhatsApp & Download) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowWhatsappInput(!showWhatsappInput)}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* WhatsApp Verification Panel in modal */}
            <AnimatePresence>
              {showWhatsappInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 dark:bg-slate-950/60"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 dark:text-emerald-400">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                      {t("result.whatsappDialogTitle")}
                    </h5>
                    <button
                      onClick={() => setShowWhatsappInput(false)}
                      className="cursor-pointer rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {t("result.whatsappHelpText")}
                  </p>

                  <a
                    href={getWhatsAppUrl(
                      certificateData?.numero_immatriculation ||
                        certificateData?.numero_attestation ||
                        searchQuery
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:bg-emerald-800"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{t("result.openWhatsapp")}</span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Action Button */}
          <div className="flex w-full flex-col items-center gap-2 pt-2 max-sm:pb-6">
            <button
              onClick={() => onReset?.()}
              className={`w-full cursor-pointer rounded-xl py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg focus:outline-hidden ${actionButtonBg}`}
            >
              {t("result.close")}
            </button>
            {redirectUrl && (
              <div className="mb-4">
                <a
                  href={redirectUrl}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-primary underline transition-all hover:scale-105"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t("result.backToApp")}</span>
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )
  }

  /* STANDARD DETAILED VIEW */
  return (
    <div className="transition-all duration-300">
      {redirectUrl && (
        <div className="mb-4">
          <a
            href={redirectUrl}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-primary underline transition-all hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("result.backToApp")}</span>
          </a>
        </div>
      )}

      {hasData && certificateData ? (
        /* CERTIFICATE FOUND RESPONSE (VALIDE, SUSPENDUE, ANNULEE, EXPIREE, A_VENIR) */
        <div
          className={`relative animate-in space-y-5 overflow-hidden rounded-2xl border-l-4 ${getBorderColor(
            statusCode
          )} p-5 shadow-lg duration-300 fade-in-50 slide-in-from-bottom-5 md:p-6 ${
            statusCode === "VALIDE"
              ? "glass-card-valid"
              : statusCode === "SUSPENDUE"
              ? "glass-card-suspended bg-amber-500/5 dark:bg-amber-950/10 border-amber-500/30"
              : statusCode === "A_VENIR"
              ? "glass-card-info bg-sky-500/5 dark:bg-sky-950/10 border-sky-500/30"
              : "glass-card-invalid bg-rose-500/5 dark:bg-rose-950/10 border-rose-500/30"
          }`}
        >
          {isCovered && (
            <>
              <AsacWatermark />
              <CmrFlag />
            </>
          )}

          {/* Header Status & Download button */}
          <div className="flex flex-col gap-4 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2.5">
              {renderHeaderIcon(
                statusCode,
                logoUrl,
                certificateData.nom_compagnie,
                "sm"
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className={`text-base font-extrabold ${getHeaderTextColor(statusCode)}`}>
                    {getHeaderTitle(statusCode)}
                  </h4>
                  {getStatusBadge(statusCode)}
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {statusInfo?.motif ||
                    apiResponse.message ||
                    (isCovered ? t("result.validMessage") : t("result.invalidMessage"))}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setShowWhatsappInput(!showWhatsappInput)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 shadow-xs transition-all hover:bg-emerald-500/20 dark:text-emerald-400"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("result.verifyViaWhatsapp")}</span>
                <span className="sm:hidden">WhatsApp</span>
              </button>

              {certificateData.download_link && (
                <a
                  href={certificateData.download_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300/80 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs transition-all hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    {t("result.downloadCertificate")}
                  </span>
                  <span className="sm:hidden">FILE</span>
                </a>
              )}
            </div>
          </div>

          {/* Contextual Alert Banner for non-valid certificates */}
          {!isCovered && (
            <div
              className={`flex items-start gap-3 rounded-xl border p-4 ${
                statusCode === "SUSPENDUE"
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-200"
                  : statusCode === "A_VENIR"
                  ? "border-sky-500/20 bg-sky-500/10 text-sky-900 dark:text-sky-200"
                  : "border-rose-500/20 bg-rose-500/10 text-rose-900 dark:text-rose-200"
              }`}
            >
              <AlertTriangle
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  statusCode === "SUSPENDUE"
                    ? "text-amber-600 dark:text-amber-400"
                    : statusCode === "A_VENIR"
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              />
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-sm">
                  {statusCode === "SUSPENDUE" && t("status.suspendueDesc")}
                  {statusCode === "ANNULEE" && t("status.annuleeDesc")}
                  {statusCode === "EXPIREE" && t("status.expireeDesc")}
                  {statusCode === "A_VENIR" && t("status.a_venirDesc")}
                </p>
                {statusInfo?.motif && (
                  <p className="mt-1 text-xs opacity-90">
                    {t("result.statusNotice", { status: statusInfo.motif })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* WhatsApp Verification Panel */}
          <AnimatePresence>
            {showWhatsappInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 dark:bg-slate-950/60"
              >
                <div className="flex items-center justify-between">
                  <h5 className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-400">
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    {t("result.whatsappDialogTitle")}
                  </h5>
                  <button
                    onClick={() => setShowWhatsappInput(false)}
                    className="cursor-pointer rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {t("result.whatsappHelpText")}
                  </p>

                  <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-white/80 p-3 font-mono text-xs dark:bg-slate-900/80">
                    <span className="text-slate-500 dark:text-slate-400">Message template:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {certificateData?.numero_immatriculation ||
                        certificateData?.numero_attestation ||
                        searchQuery}
                    </span>
                  </div>

                  <a
                    href={getWhatsAppUrl(
                      certificateData?.numero_immatriculation ||
                        certificateData?.numero_attestation ||
                        searchQuery
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:bg-emerald-800"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{t("result.openWhatsapp")}</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Certificate Details */}
          <div className="space-y-3">
            <h5 className="flex items-center gap-2 text-xs font-extrabold text-slate-600 dark:text-slate-300">
              <FileText className="h-4 w-4" />
              <span>{t("result.details")}</span>
            </h5>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="grid flex-1 grid-cols-1 gap-2.5 text-xs sm:grid-cols-2">
                <div className="flex flex-col rounded-lg bg-slate-100/50 p-2.5 dark:bg-slate-800/40">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    {t("result.attestationNumber")}
                  </span>
                  <span className="font-bold select-all text-slate-800 dark:text-slate-100">
                    {certificateData.numero_attestation}
                  </span>
                </div>

                <div className="flex flex-col rounded-lg bg-slate-100/50 p-2.5 dark:bg-slate-800/40">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                    <Car className="h-3 w-3" />
                    {t("result.immatriculation")}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {certificateData.numero_immatriculation || "N/A"}
                  </span>
                </div>

                <div className="col-span-1 flex flex-col rounded-lg bg-slate-100/50 p-2.5 sm:col-span-2 dark:bg-slate-800/40">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                    <User className="h-3 w-3" />
                    {t("result.insuredName")}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {certificateData.nom_assure}
                  </span>
                </div>

                <div className="flex flex-col rounded-lg bg-slate-100/50 p-2.5 dark:bg-slate-800/40">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                    <Car className="h-3 w-3" />
                    {t("result.vehicleBrand")}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {certificateData.marque_vehicule} {certificateData.modele_vehicule}
                  </span>
                </div>

                <div className="flex flex-col rounded-lg bg-slate-100/50 p-2.5 dark:bg-slate-800/40">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    {t("result.company")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {certificateData.nom_compagnie}
                    </span>
                    {logoUrl && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-white p-0.5 shadow-xs dark:bg-slate-700">
                        <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col rounded-lg bg-slate-100/50 p-2.5 dark:bg-slate-800/40">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {t("result.effectiveDate")}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {formatDate(certificateData.date_effet)}
                  </span>
                </div>

                <div className="flex flex-col rounded-lg bg-slate-100/50 p-2.5 dark:bg-slate-800/40">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {t("result.expiryDate")}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {formatDate(certificateData.date_expiration)}
                  </span>
                </div>
              </div>

              {/* Document Image Preview if downloadable */}
              {isImageUrl(certificateData.download_link) &&
                !imageError[certificateData.download_link || ""] && (
                  <div className="flex shrink-0 flex-col space-y-1.5 sm:w-36">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                      <Eye className="h-3 w-3" /> Preview
                    </span>
                    <div
                      onClick={() => setSelectedImage(certificateData.download_link)}
                      className="group relative flex aspect-3/4 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-border bg-slate-100 transition-all hover:ring-2 hover:ring-primary/40 dark:bg-slate-800"
                    >
                      <img
                        src={certificateData.download_link || ""}
                        alt="Attestation Preview"
                        onError={() => {
                          if (certificateData.download_link) {
                            setImageError((prev) => ({
                              ...prev,
                              [certificateData.download_link!]: true,
                            }))
                          }
                        }}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="flex items-center gap-1 rounded bg-slate-900/70 px-2 py-1 text-[10px] font-bold text-white shadow-md">
                          <Eye className="h-3 w-3" /> Zoom
                        </span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Child Certificate Card */}
          {certificateData.child_certificate && (
            <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 dark:bg-pink-950/20">
              <div
                onClick={() => setShowChildCert(!showChildCert)}
                className="flex cursor-pointer items-center justify-between p-3.5 select-none"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  <span className="text-xs font-bold text-pink-800 dark:text-pink-300">
                    {t("result.childCertificate")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {renderChildStateBadge(certificateData.child_certificate)}
                  {showChildCert ? (
                    <ChevronUp className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  )}
                </div>
              </div>

              {showChildCert && (
                <div className="space-y-3 border-t border-pink-500/10 p-4 text-xs">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2.5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-pink-700/60 dark:text-pink-400/60">
                          {t("result.childRef")}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {certificateData.child_certificate.reference}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-pink-700/60 dark:text-pink-400/60">
                          {t("result.childState")}
                        </span>
                        {renderChildStateBadge(certificateData.child_certificate)}
                      </div>

                      <div className="col-span-2 flex flex-col">
                        <span className="text-[10px] font-semibold text-pink-700/60 dark:text-pink-400/60">
                          {t("result.childValidity")}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {formatDate(certificateData.child_certificate.starts_at)} -{" "}
                          {formatDate(certificateData.child_certificate.ends_at)}
                        </span>
                      </div>
                    </div>

                    {isImageUrl(certificateData.child_certificate.download_link) &&
                      !imageError[certificateData.child_certificate.download_link || ""] && (
                        <div className="flex shrink-0 flex-col space-y-1.5 sm:w-32">
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-pink-700/60 dark:text-pink-400/60">
                            <Eye className="h-3 w-3" /> Preview
                          </span>
                          <div
                            onClick={() =>
                              setSelectedImage(
                                certificateData.child_certificate?.download_link || null
                              )
                            }
                            className="group relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-pink-500/20 bg-pink-500/5 transition-all hover:ring-2 hover:ring-pink-500/40"
                          >
                            <img
                              src={certificateData.child_certificate.download_link || ""}
                              alt="Secondary Card Preview"
                              onError={() => {
                                if (certificateData.child_certificate?.download_link) {
                                  setImageError((prev) => ({
                                    ...prev,
                                    [certificateData.child_certificate!.download_link!]: true,
                                  }))
                                }
                              }}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="flex items-center gap-1 rounded bg-slate-900/70 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-md">
                                <Eye className="h-2.5 w-2.5" /> Zoom
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  {certificateData.child_certificate.download_link && (
                    <a
                      href={certificateData.child_certificate.download_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-pink-700 bg-pink-600 py-2 text-center font-bold text-white shadow-xs transition-colors hover:bg-pink-700"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{t("result.downloadChild")}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* INVALID / NOT FOUND CERTIFICATE RESPONSE */
        <div className="glass-card-invalid animate-in space-y-4 rounded-2xl border-l-4 border-rose-500 p-5 shadow-lg duration-300 fade-in-50 slide-in-from-bottom-5 md:p-6">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-rose-500" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-rose-800 dark:text-rose-400">
                  {t("result.invalid")}
                </h4>
                {getStatusBadge("INTROUVABLE")}
              </div>
              <p className="mt-1 text-xs font-semibold text-rose-700/80 dark:text-rose-400/80">
                {apiError || apiResponse?.message || t("result.invalidMessage")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-rose-500/10 bg-rose-500/5 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
            <div className="text-[10px] leading-relaxed font-semibold text-rose-600/90 dark:text-rose-400/90">
              {t("status.introuvableDesc")}. Veuillez vérifier l&apos;immatriculation saisie ou vous assurer
              que le QR code scanné correspond à une attestation enregistrée auprès de l&apos;ASAC.
            </div>
          </div>
        </div>
      )}

      {/* Zoomed Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-2xl bg-white p-2 shadow-2xl dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 cursor-pointer rounded-full bg-slate-900/60 p-2 text-white transition-colors hover:bg-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={selectedImage}
                alt="Document Preview Full"
                className="max-h-[85vh] w-full rounded-xl object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

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
  Star,
  StarIcon,
} from "lucide-react"
import { AsacWatermark } from "@/components/AsacWatermark"

interface VerificationResultProps {
  apiResponse: any
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
  const [loadingLogo, setLoadingLogo] = useState(false)

  const isSuccess = apiResponse?.status
  const certificateData = apiResponse?.data?.[0]

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

    Promise.resolve().then(() => {
      if (isMounted) setLoadingLogo(true)
    })

    fetch(`/api/member/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then(data => {
        if (isMounted && data && data.logo && data.logo.url) {
          setLogoUrl(data.logo.url)
        } else {
          if (isMounted) setLogoUrl(null)
        }
      })
      .catch(err => {
        console.error("Failed to load member logo:", err)
        if (isMounted) setLogoUrl(null)
      })
      .finally(() => {
        if (isMounted) setLoadingLogo(false)
      })

    return () => {
      isMounted = false
    }
  }, [certificateData])

  const isImageUrl = (url?: string) => {
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

  if (!apiResponse) return null

  // Date formatter
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

  const isMinimalist = isSuccess && !wasScanned && !!searchQuery && searchQuery.trim().length <= 10

  if (isMinimalist && certificateData) {
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
          className="relative w-full max-w-md space-y-6 overflow-hidden rounded-2xl border border-emerald-500/20 bg-white p-6 shadow-2xl max-sm:fixed max-sm:inset-0 max-sm:m-0 max-sm:flex max-sm:h-full max-sm:w-full max-sm:flex-col max-sm:justify-between max-sm:rounded-none md:p-8 dark:bg-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          <AsacWatermark />
          <div className={"absolute top-0 left-0 grid h-2 w-full grid-cols-3"}>
            <div className={"h-full bg-green-800"}></div>
            <div
              className={"flex h-full items-center justify-center bg-red-600"}
            >
              <Star
                fill={"#fcc800"}
                className={"h-1.5 w-1.5 text-yellow-400"}
              />
            </div>
            <div className={"h-full bg-yellow-400"}></div>
          </div>
          {/* Top close button */}
          <button
            onClick={() => onReset?.()}
            className="absolute top-4 right-4 cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            title={t("result.close")}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-1 flex-col justify-center space-y-6 max-sm:py-8">
            {/* Header Success Section */}
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="relative shrink-0">
                {logoUrl ? (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2.5 shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <img
                      src={logoUrl}
                      alt={certificateData.nom_compagnie}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10">
                    <CheckCircle2 className="h-9 w-9 animate-pulse text-emerald-500" />
                  </div>
                )}
                {logoUrl && (
                  <div className="absolute -right-1.5 -bottom-1.5 rounded-full bg-white p-1 shadow-md dark:bg-slate-900">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-emerald-800 dark:text-emerald-400">
                  {t("result.valid")}
                </h4>
                <p className="text-sm leading-relaxed font-semibold text-slate-500 dark:text-slate-400">
                  {apiResponse.message || t("result.validMessage")}
                </p>
              </div>
            </div>

            {/* Minimalist Details Card */}
            <div className="space-y-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5">
              {/* Item: Number */}
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Shield className="h-3.5 w-3.5 text-slate-400" />
                  {t("result.attestationNumber")}
                </span>
                <span className="text-sm font-bold text-slate-800 select-all dark:text-slate-100">
                  {certificateData.numero_attestation}
                </span>
              </div>

              {/* Item: Company */}
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
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
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Item: Date start */}
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {t("result.effectiveDate")}
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {formatDate(certificateData.date_effet)}
                </span>
              </div>

              {/* Item: Expiry Date */}
              <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {t("result.expiryDate")}
                </span>
                <span className="dark:text-rose-455 text-sm font-bold text-rose-600">
                  {formatDate(certificateData.date_expiration)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Action Button */}
          <div className="flex flex-col gap-2 items-center pt-2 max-sm:pb-6">
            <button
              onClick={() => onReset?.()}
              className="w-full cursor-pointer rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg focus:outline-hidden active:bg-emerald-800"
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
      {isSuccess && certificateData ? (
        /* VALID CERTIFICATE RESPONSE */
        <div className="glass-card-valid relative animate-in space-y-5 rounded-2xl border-l-4 border-emerald-500 p-5 shadow-lg duration-300 fade-in-50 slide-in-from-bottom-5 md:p-6">
          <AsacWatermark />
          {/* Header Status & Download button */}
          <div className="flex items-center justify-between gap-4 border-b border-emerald-500/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                {logoUrl ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs dark:border-slate-700 dark:bg-slate-800">
                    <img
                      src={logoUrl}
                      alt={certificateData.nom_compagnie}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10">
                    <CheckCircle2 className="h-6 w-6 animate-pulse text-emerald-500" />
                  </div>
                )}
                {logoUrl && (
                  <div className="absolute -right-1 -bottom-1 rounded-full border border-slate-100 bg-white p-0.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-emerald-800 dark:text-emerald-400">
                  {t("result.valid")}
                </h4>
                <p className="text-xs font-semibold text-emerald-700/80 dark:text-emerald-400/80">
                  {apiResponse.message || t("result.validMessage")}
                </p>
              </div>
            </div>
            {certificateData.download_link && (
              <a
                href={certificateData.download_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 shadow-xs transition-all hover:bg-emerald-500/20 hover:text-emerald-700 dark:text-emerald-400"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {t("result.downloadCertificate")}
                </span>
                <span className="sm:hidden">FILE</span>
              </a>
            )}
          </div>

          {/* Certificate Specifications Details & Preview Grid */}
          <div className="flex flex-col gap-5 md:flex-row">
            {/* Left side/Full-width: Specifications Details */}
            <div className="flex-1 space-y-3">
              <h5 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                <FileText className="h-3.5 w-3.5 text-primary" />
                {t("result.details")}
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl border border-emerald-500/5 bg-white/45 p-4 text-xs sm:grid-cols-2 dark:bg-slate-900/35">
                {/* Item: Number */}
                <div className="flex flex-col space-y-0.5">
                  <span className="flex items-center gap-1 font-semibold text-muted-foreground">
                    <Shield className="h-3 w-3 shrink-0 text-slate-400" />
                    {t("result.attestationNumber")}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {certificateData.numero_attestation}
                  </span>
                </div>

                {/* Item: Plate */}
                <div className="flex flex-col space-y-0.5">
                  <span className="flex items-center gap-1 font-semibold text-muted-foreground">
                    <Car className="h-3 w-3 shrink-0 text-slate-400" />
                    {t("result.immatriculation")}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {certificateData.numero_immatriculation || "N/A"}
                  </span>
                </div>

                {/* Item: Insured Name */}
                <div className="flex flex-col space-y-0.5">
                  <span className="flex items-center gap-1 font-semibold text-muted-foreground">
                    <User className="h-3 w-3 shrink-0 text-slate-400" />
                    {t("result.insuredName")}
                  </span>
                  <span className="font-bold text-slate-800 capitalize dark:text-slate-200">
                    {certificateData.nom_assure}
                  </span>
                </div>

                {/* Item: Company */}
                <div className="flex flex-col space-y-0.5">
                  <span className="flex items-center gap-1 font-semibold text-muted-foreground">
                    <Building2 className="h-3 w-3 shrink-0 text-slate-400" />
                    {t("result.company")}
                  </span>
                  <div className="flex items-center gap-2">
                    {logoUrl && (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200/50 bg-white p-0.5 dark:bg-slate-800">
                        <img
                          src={logoUrl}
                          alt="Logo"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {certificateData.nom_compagnie}
                    </span>
                  </div>
                </div>

                {/* Item: Vehicle */}
                <div className="flex flex-col space-y-0.5">
                  <span className="flex items-center gap-1 font-semibold text-muted-foreground">
                    <Car className="h-3 w-3 shrink-0 text-slate-400" />
                    Vehicle Specifications
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {certificateData.marque_vehicule}{" "}
                    {certificateData.modele_vehicule}
                  </span>
                </div>

                {/* Item: Date start */}
                <div className="flex flex-col space-y-0.5">
                  <span className="flex items-center gap-1 font-semibold text-muted-foreground">
                    <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
                    {t("result.effectiveDate")}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatDate(certificateData.date_effet)}
                  </span>
                </div>

                {/* Item: Expiry Date */}
                <div className="col-span-1 flex flex-col space-y-0.5 sm:col-span-2">
                  <span className="flex items-center gap-1 font-semibold text-muted-foreground">
                    <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
                    {t("result.expiryDate")}
                  </span>
                  <span className="dark:text-rose-455 font-bold text-rose-600">
                    {formatDate(certificateData.date_expiration)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Preview Image if download_link is image */}
            {isImageUrl(certificateData.download_link) &&
              !imageError[certificateData.download_link] && (
                <div className="flex shrink-0 flex-col space-y-3 md:w-48">
                  <h5 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    Preview
                  </h5>
                  <div
                    onClick={() =>
                      setSelectedImage(certificateData.download_link)
                    }
                    className="group relative flex aspect-[3/4] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-emerald-500/10 bg-slate-100 transition-all hover:ring-2 hover:ring-emerald-500/40 md:h-44 dark:bg-slate-900/50"
                  >
                    <img
                      src={certificateData.download_link}
                      alt="Certificate Preview"
                      onError={() => {
                        setImageError((prev) => ({
                          ...prev,
                          [certificateData.download_link]: true,
                        }))
                      }}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex items-center gap-1 rounded-md bg-slate-900/70 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                        <Eye className="h-3.5 w-3.5" /> Zoom
                      </span>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Child Attestation (Carte Rose) */}
          {certificateData.child_certificate && (
            <div className="overflow-hidden rounded-xl border border-pink-500/20 bg-pink-500/5 shadow-sm">
              <button
                onClick={() => setShowChildCert(!showChildCert)}
                className="flex w-full cursor-pointer items-center justify-between bg-pink-500/10 px-4 py-3 text-xs font-bold text-pink-700 hover:bg-pink-500/15 dark:text-pink-400"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-pink-500" />
                  {t("result.childCertificate")} (
                  {certificateData.child_certificate.certificate_type?.name ||
                    "Carte Rose"}
                  )
                </span>
                {showChildCert ? (
                  <ChevronUp className="h-4 w-4 text-pink-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-pink-500" />
                )}
              </button>

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
                        <span className="mt-0.5 inline-flex max-w-max items-center rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 capitalize">
                          {certificateData.child_certificate.state?.label ||
                            certificateData.child_certificate.state?.name}
                        </span>
                      </div>

                      <div className="col-span-2 flex flex-col">
                        <span className="text-[10px] font-semibold text-pink-700/60 dark:text-pink-400/60">
                          {t("result.childValidity")}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {certificateData.child_certificate.starts_at} -{" "}
                          {certificateData.child_certificate.ends_at}
                        </span>
                      </div>
                    </div>

                    {isImageUrl(
                      certificateData.child_certificate.download_link
                    ) &&
                      !imageError[
                        certificateData.child_certificate.download_link
                      ] && (
                        <div className="flex shrink-0 flex-col space-y-1.5 sm:w-32">
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-pink-700/60 dark:text-pink-400/60">
                            <Eye className="h-3 w-3" /> Preview
                          </span>
                          <div
                            onClick={() =>
                              setSelectedImage(
                                certificateData.child_certificate.download_link
                              )
                            }
                            className="hover:ring-pink-550/40 group relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-pink-500/20 bg-pink-500/5 transition-all hover:ring-2"
                          >
                            <img
                              src={
                                certificateData.child_certificate.download_link
                              }
                              alt="Secondary Card Preview"
                              onError={() => {
                                setImageError((prev) => ({
                                  ...prev,
                                  [certificateData.child_certificate
                                    .download_link]: true,
                                }))
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
                      className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-pink-700 bg-pink-600 py-2 text-center font-bold text-white shadow-sm transition-colors hover:bg-pink-700"
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
        /* INVALID CERTIFICATE RESPONSE */
        <div className="glass-card-invalid animate-in space-y-4 rounded-2xl border-l-4 border-rose-500 p-5 shadow-lg duration-300 fade-in-50 slide-in-from-bottom-5 md:p-6">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-rose-500" />
            <div>
              <h4 className="text-base font-extrabold text-rose-800 dark:text-rose-400">
                {t("result.invalid")}
              </h4>
              <p className="mt-1 text-xs font-semibold text-rose-700/80 dark:text-rose-400/80">
                {apiError || t("result.invalidMessage")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-rose-500/10 bg-rose-500/5 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
            <div className="text-[10px] leading-relaxed font-semibold text-rose-600/90 dark:text-rose-400/90">
              Please double-check the immatriculation format or ensure the QR
              code corresponds to a registered ASAC certificate. Contact your
              broker if this persists.
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative mx-4 max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-transparent p-1"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header Controls */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <a
                  href={selectedImage}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer rounded-full bg-slate-800/80 p-2 text-white transition-colors hover:bg-slate-700"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="cursor-pointer rounded-full bg-slate-800/80 p-2 text-white transition-colors hover:bg-slate-700"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Image display */}
              <div className="flex h-full w-full items-center justify-center p-4">
                <img
                  src={selectedImage}
                  alt="Enlarged Certificate Preview"
                  className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

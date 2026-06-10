"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
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
  AlertTriangle
} from "lucide-react"

interface VerificationResultProps {
  apiResponse: any
  apiError: string | null
}

export function VerificationResult({ apiResponse, apiError }: VerificationResultProps) {
  const { t, i18n } = useTranslation()
  const [showChildCert, setShowChildCert] = useState(true)

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

  const isSuccess = apiResponse.status
  const certificateData = apiResponse.data?.[0]

  return (
    <div className="transition-all duration-300">
      {isSuccess && certificateData ? (
        
        /* VALID CERTIFICATE RESPONSE */
        <div className="glass-card-valid rounded-2xl shadow-lg border-l-4 border-emerald-500 p-5 md:p-6 space-y-5 animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
          {/* Header Status & Download button */}
          <div className="flex items-center justify-between gap-4 border-b border-emerald-500/10 pb-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <h4 className="text-base font-extrabold text-emerald-800 dark:text-emerald-400">
                  {t("result.valid")}
                </h4>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 font-semibold">
                  {apiResponse.message || t("result.validMessage")}
                </p>
              </div>
            </div>
            {certificateData.download_link && (
              <a
                href={certificateData.download_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all shadow-xs cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("result.downloadCertificate")}</span>
                <span className="sm:hidden">PDF</span>
              </a>
            )}
          </div>

          {/* Certificate Specifications Grid */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              {t("result.details")}
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 bg-white/45 dark:bg-slate-900/35 border border-emerald-500/5 p-4 rounded-xl text-xs">
              {/* Item: Number */}
              <div className="flex flex-col space-y-0.5">
                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3 text-slate-400 shrink-0" />
                  {t("result.attestationNumber")}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {certificateData.numero_attestation}
                </span>
              </div>

              {/* Item: Plate */}
              <div className="flex flex-col space-y-0.5">
                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                  <Car className="w-3 h-3 text-slate-400 shrink-0" />
                  {t("result.immatriculation")}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {certificateData.numero_immatriculation || "N/A"}
                </span>
              </div>

              {/* Item: Insured Name */}
              <div className="flex flex-col space-y-0.5">
                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400 shrink-0" />
                  {t("result.insuredName")}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {certificateData.nom_assure}
                </span>
              </div>

              {/* Item: Company */}
              <div className="flex flex-col space-y-0.5">
                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                  {t("result.company")}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {certificateData.nom_compagnie}
                </span>
              </div>

              {/* Item: Vehicle */}
              <div className="flex flex-col space-y-0.5">
                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                  <Car className="w-3 h-3 text-slate-400 shrink-0" />
                  Vehicle Specifications
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {certificateData.marque_vehicule} {certificateData.modele_vehicule}
                </span>
              </div>

              {/* Item: Date start */}
              <div className="flex flex-col space-y-0.5">
                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                  {t("result.effectiveDate")}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatDate(certificateData.date_effet)}
                </span>
              </div>

              {/* Item: Expiry Date */}
              <div className="flex flex-col space-y-0.5 col-span-1 md:col-span-2">
                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                  {t("result.expiryDate")}
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-455">
                  {formatDate(certificateData.date_expiration)}
                </span>
              </div>
            </div>
          </div>

          {/* Child Attestation (Carte Rose) */}
          {certificateData.child_certificate && (
            <div className="border border-pink-500/20 rounded-xl overflow-hidden shadow-sm bg-pink-500/5">
              <button
                onClick={() => setShowChildCert(!showChildCert)}
                className="w-full px-4 py-3 bg-pink-500/10 hover:bg-pink-500/15 flex items-center justify-between text-xs font-bold text-pink-700 dark:text-pink-400 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
                  {t("result.childCertificate")} ({certificateData.child_certificate.certificate_type?.name || "Carte Rose"})
                </span>
                {showChildCert ? (
                  <ChevronUp className="w-4 h-4 text-pink-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-pink-500" />
                )}
              </button>

              {showChildCert && (
                <div className="p-4 border-t border-pink-500/10 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-pink-700/60 dark:text-pink-400/60 font-semibold">
                        {t("result.childRef")}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {certificateData.child_certificate.reference}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-pink-700/60 dark:text-pink-400/60 font-semibold">
                        {t("result.childState")}
                      </span>
                      <span className="inline-flex items-center max-w-max bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 capitalize">
                        {certificateData.child_certificate.state?.label || certificateData.child_certificate.state?.name}
                      </span>
                    </div>

                    <div className="flex flex-col col-span-2">
                      <span className="text-[10px] text-pink-700/60 dark:text-pink-400/60 font-semibold">
                        {t("result.childValidity")}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {certificateData.child_certificate.starts_at} - {certificateData.child_certificate.ends_at}
                      </span>
                    </div>
                  </div>

                  {certificateData.child_certificate.download_link && (
                    <a
                      href={certificateData.child_certificate.download_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold text-center border border-pink-700 transition-colors shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
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
        <div className="glass-card-invalid rounded-2xl shadow-lg border-l-4 border-rose-500 p-5 md:p-6 space-y-4 animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-extrabold text-rose-800 dark:text-rose-400">
                {t("result.invalid")}
              </h4>
              <p className="text-xs text-rose-700/80 dark:text-rose-400/80 font-semibold mt-1">
                {apiError || t("result.invalidMessage")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-[10px] text-rose-600/90 dark:text-rose-400/90 leading-relaxed font-semibold">
              Please double-check the immatriculation format or ensure the QR code corresponds to a registered ASAC certificate. Contact your broker if this persists.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

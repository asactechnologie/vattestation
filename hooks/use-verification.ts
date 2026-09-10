import { useState } from "react"
import { useTranslation } from "react-i18next"
import { AttestationStatusCode, VerificationResponse } from "@/lib/strategies/types"

interface UseVerificationOptions {
  addToHistory: (
    infoValue: string,
    success: boolean,
    message: string,
    data?: any,
    fromScan?: boolean,
    statusCode?: AttestationStatusCode
  ) => void
}

/**
 * Sanitizes input before verification:
 * Converts to uppercase and strips all whitespace and hyphens.
 * E.g., "CE 723 PE", "ce 723Pe", "CE-723-PE" -> "CE723PE"
 */
export function sanitizeVerificationInput(input: string): string {
  if (!input) return ""
  return input.toUpperCase().replace(/[\s-]+/g, "")
}

export function useVerification({ addToHistory }: UseVerificationOptions) {
  const { t } = useTranslation()
  const [isVerifying, setIsVerifying] = useState(false)
  const [apiResponse, setApiResponse] = useState<VerificationResponse | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [wasScanned, setWasScanned] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const performVerification = async (infoValue: string, fromScan = false) => {
    const sanitized = sanitizeVerificationInput(infoValue)
    if (!sanitized) return

    setIsVerifying(true)
    setApiError(null)
    setApiResponse(null)
    setWasScanned(fromScan)
    setSearchQuery(sanitized)

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ info: sanitized }),
      })

      const result: VerificationResponse = await res.json()
      setApiResponse(result)

      const isCovered = result.est_couvert ?? result.status ?? false
      const statusCode: AttestationStatusCode = result.statut?.code || (isCovered ? "VALIDE" : "INTROUVABLE")
      const message = result.message || (isCovered ? t("result.valid") : t("result.invalidMessage"))

      if (!isCovered && statusCode === "INTROUVABLE" && (!result.data || result.data.length === 0)) {
        setApiError(message)
      } else {
        setApiError(null)
      }

      addToHistory(sanitized, isCovered, message, result.data, fromScan, statusCode)
    } catch (err: unknown) {
      console.error(err)
      setApiError(t("result.networkError"))
      addToHistory(sanitized, false, t("result.networkError"), undefined, fromScan, "INTROUVABLE")
    } finally {
      setIsVerifying(false)
    }
  }

  const resetSearch = () => {
    setApiResponse(null)
    setApiError(null)
    setSearchQuery("")
  }

  return {
    isVerifying,
    apiResponse,
    apiError,
    wasScanned,
    searchQuery,
    performVerification,
    resetSearch,
  }
}

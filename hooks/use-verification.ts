import { useState } from "react"
import { useTranslation } from "react-i18next"

interface UseVerificationOptions {
  addToHistory: (infoValue: string, success: boolean, message: string, data?: any, fromScan?: boolean) => void
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
  const [apiResponse, setApiResponse] = useState<any | null>(null)
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

      const result = await res.json()

      if (res.ok && result.status) {
        setApiResponse(result)
        addToHistory(sanitized, true, result.message || "Valide", result.data, fromScan)
      } else {
        setApiResponse(result)
        setApiError(result.message || t("result.invalidMessage"))
        addToHistory(sanitized, false, result.message || "Invalide", undefined, fromScan)
      }
    } catch (err: unknown) {
      console.error(err)
      setApiError(t("result.networkError"))
      addToHistory(sanitized, false, t("result.networkError"), undefined, fromScan)
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

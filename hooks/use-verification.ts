import { useState } from "react"
import { useTranslation } from "react-i18next"

interface UseVerificationOptions {
  addToHistory: (infoValue: string, success: boolean, message: string, data?: any, fromScan?: boolean) => void
}

export function useVerification({ addToHistory }: UseVerificationOptions) {
  const { t } = useTranslation()
  const [isVerifying, setIsVerifying] = useState(false)
  const [apiResponse, setApiResponse] = useState<any | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [wasScanned, setWasScanned] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const performVerification = async (infoValue: string, fromScan = false) => {
    if (!infoValue.trim()) return

    setIsVerifying(true)
    setApiError(null)
    setApiResponse(null)
    setWasScanned(fromScan)
    setSearchQuery(infoValue.trim())

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ info: infoValue.trim() }),
      })

      const result = await res.json()

      if (res.ok && result.status) {
        setApiResponse(result)
        addToHistory(infoValue.trim(), true, result.message || "Valide", result.data, fromScan)
      } else {
        setApiResponse(result)
        setApiError(result.message || t("result.invalidMessage"))
        addToHistory(infoValue.trim(), false, result.message || "Invalide", undefined, fromScan)
      }
    } catch (err: unknown) {
      console.error(err)
      setApiError(t("result.networkError"))
      addToHistory(infoValue.trim(), false, t("result.networkError"), undefined, fromScan)
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

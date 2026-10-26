"use client"

import { useSyncExternalStore } from "react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n" // Initialize i18n (also during server rendering)

const subscribe = () => () => {}

/**
 * Like useTranslation, but always renders French on the server and during hydration,
 * so crawlers get French HTML and there is no hydration mismatch.
 * Switches to the detected/selected language right after hydration.
 */
export function useHydratedTranslation() {
  const { t, i18n } = useTranslation()
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false)

  if (!hydrated) {
    return { t: i18n.getFixedT("fr"), i18n, isFr: true }
  }
  return { t, i18n, isFr: Boolean(i18n.language?.startsWith("fr")) }
}

"use client"

import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import enTranslation from "../public/locales/en/common.json"
import frTranslation from "../public/locales/fr/common.json"

// Initialize i18next on the client
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { common: enTranslation },
        fr: { common: frTranslation },
      },
      fallbackLng: "fr",
      ns: ["common"],
      defaultNS: "common",
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "i18nextLng",
      },
    })
}

export default i18n

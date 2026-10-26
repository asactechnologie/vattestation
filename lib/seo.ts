import type { Metadata } from "next"

// Canonical production origin. vattestation.asac-cameroun.org redirects here (see next.config.ts).
export const SITE_URL = "https://vattestation.cm"
export const SITE_NAME = "ASAC V-Attestation"
export const ASAC_URL = "https://asac-cameroun.org"

export const DEFAULT_TITLE =
  "Vérifier une attestation d'assurance automobile au Cameroun | ASAC V-Attestation"
export const DEFAULT_DESCRIPTION =
  "Vérifiez gratuitement et instantanément la validité d'une attestation d'assurance automobile au Cameroun : scannez le QR code ou saisissez l'immatriculation ou le numéro de châssis."

export const KEYWORDS = [
  "vérifier attestation assurance",
  "attestation d'assurance Cameroun",
  "vérification attestation automobile",
  "attestation digitale",
  "e-attestation",
  "v-attestation",
  "v attestation",
  "carte rose",
  "ASAC",
  "ASAC Cameroun",
  "assurance auto Cameroun",
  "fausse attestation",
  "QR code attestation",
  "immatriculation",
]

type JsonLdObject = Record<string, unknown>

// Escapes "<" so a value can never close the surrounding <script> tag.
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export const organizationJsonLd: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "ASAC – Association des Sociétés d'Assurances du Cameroun",
  alternateName: "ASAC",
  url: ASAC_URL,
  logo: `${SITE_URL}/asac_icon_512.png`,
  areaServed: { "@type": "Country", name: "Cameroun" },
}

export const websiteJsonLd: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "fr-CM",
  publisher: { "@id": `${SITE_URL}/#organization` },
}

export const webApplicationJsonLd: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web, Android, iOS",
  inLanguage: ["fr", "en"],
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "XAF" },
  areaServed: { "@type": "Country", name: "Cameroun" },
  publisher: { "@id": `${SITE_URL}/#organization` },
}

export function faqJsonLd(items: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${SITE_URL}${path}`,
    })),
  }
}

// Shared Open Graph defaults; pages spreading this keep siteName/locale when overriding fields
// (metadata objects are merged shallowly). The image comes from app/opengraph-image.tsx.
export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  siteName: SITE_NAME,
  locale: "fr_CM",
  alternateLocale: ["en_CM"],
}

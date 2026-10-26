import type { Metadata } from "next"

import { HelpContent } from "@/components/help-content"
import { JsonLd } from "@/components/json-ld"
import { baseOpenGraph, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo"
import fr from "@/public/locales/fr/common.json"

const title = "Aide : comment vérifier une attestation d'assurance"
const description =
  "Comment vérifier une attestation d'assurance automobile au Cameroun : scan du QR code, saisie de l'immatriculation ou du châssis, signification des statuts et questions fréquentes."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/help" },
  openGraph: { ...baseOpenGraph, title, description, url: "/help" },
}

export default function HelpPage() {
  return (
    <>
      <JsonLd
        data={[
          faqJsonLd(fr.help.faq),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: fr.help.title, path: "/help" },
          ]),
        ]}
      />
      <HelpContent />
    </>
  )
}

import type { Metadata } from "next"

import { SecurityContent } from "@/components/security-content"
import { JsonLd } from "@/components/json-ld"
import { baseOpenGraph, breadcrumbJsonLd } from "@/lib/seo"

const title = "Centre de Sécurité & Anti-Fraude"
const description =
  "Apprenez à reconnaître une fausse attestation d'assurance automobile et un faux site de vérification : adresse officielle, filigrane ASAC, logo de la compagnie et ChatBot WhatsApp officiel."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/security" },
  openGraph: { ...baseOpenGraph, title, description, url: "/security" },
}

export default function SecurityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Centre de Sécurité & Anti-Fraude", path: "/security" },
        ])}
      />
      <SecurityContent />
    </>
  )
}

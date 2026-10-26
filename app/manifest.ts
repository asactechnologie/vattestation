import type { MetadataRoute } from "next"

import { DEFAULT_DESCRIPTION } from "@/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ASAC V-Attestation – Vérification d'attestation d'assurance",
    short_name: "ASAC vAttestation",
    description: DEFAULT_DESCRIPTION,
    lang: "fr",
    categories: ["utilities", "finance"],
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0a568c",
    icons: [
      {
        src: "/asac_icon_192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/asac_icon_512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/asac_icon_maskable_192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/asac_icon_maskable_512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}

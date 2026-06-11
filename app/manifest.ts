import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ASAC Insurance Verifier",
    short_name: "ASAC vAttestation",
    description: "Check the validity of your insurance certificate (attestation) instantly.",
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
        src: "/asac_icon_192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/asac_icon_512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}

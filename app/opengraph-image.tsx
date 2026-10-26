import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt = "ASAC V-Attestation – Vérifiez votre attestation d'assurance automobile au Cameroun"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/assets/logo_asac.png"), "base64")
  const logoSrc = `data:image/png;base64,${logoData}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 80px",
          background: "linear-gradient(135deg, #ffffff 0%, #e8f1f8 100%)",
          color: "#0f172a",
        }}
      >
        <img src={logoSrc} width={260} height={260} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#0a568c", letterSpacing: 4 }}>
            V-ATTESTATION
          </div>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1 }}>
            Vérifiez votre attestation d&apos;assurance automobile
          </div>
          <div style={{ fontSize: 28, color: "#475569" }}>
            QR code · Immatriculation · Châssis
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#0a568c" }}>vattestation.cm</div>
        </div>
      </div>
    ),
    { ...size }
  )
}

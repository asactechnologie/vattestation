import { NextResponse } from "next/server"
import { VerificationContext } from "@/lib/strategies/verification-context"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { info } = body

    if (!info || typeof info !== "string") {
      return NextResponse.json(
        {
          status: false,
          success: false,
          est_couvert: false,
          statut: {
            code: "INTROUVABLE",
            libelle: "Paramètre manquant",
            motif: "Paramètre 'info' requis et doit être une chaîne.",
          },
          message: "Paramètre 'info' requis et doit être une chaîne.",
          data: [],
        },
        { status: 400 }
      )
    }

    // Sanitize input: convert to uppercase and strip all spaces and hyphens
    const sanitizedInfo = info.toUpperCase().replace(/[\s-]+/g, "")

    const context = new VerificationContext()
    const result = await context.verify(sanitizedInfo)

    console.log("[Result] Data:::", result);

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Proxy verification error:", error)
    return NextResponse.json(
      {
        status: false,
        success: false,
        est_couvert: false,
        statut: {
          code: "INTROUVABLE",
          libelle: "Erreur serveur",
          motif: error.message || "Erreur lors de la communication avec le serveur d'ASAC.",
        },
        message: error.message || "Erreur lors de la communication avec le serveur d'ASAC.",
        data: [],
      },
      { status: 500 }
    )
  }
}

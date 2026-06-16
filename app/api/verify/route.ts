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
          message: "Paramètre 'info' requis et doit être une chaîne.",
          data: [],
        },
        { status: 400 }
      )
    }

    const context = new VerificationContext()
    const result = await context.verify(info)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Proxy verification error:", error)
    return NextResponse.json(
      {
        status: false,
        message: error.message || "Erreur lors de la communication avec le serveur d'ASAC.",
        data: [],
      },
      { status: 500 }
    )
  }
}

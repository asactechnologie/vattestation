import { NextResponse } from "next/server"

const PUBLIC_API_URL = "https://ppama-api.asac.cm/api/verifications/public"

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

    // Set up request to public API
    const response = await fetch(PUBLIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ info }),
      // Optional: set a cache setting or keep-alive if desired
      cache: "no-store",
    })

    if (!response.ok) {
      // API returned a non-200 state, e.g. 500 or 404
      const text = await response.text()
      try {
        const parsed = JSON.parse(text)
        return NextResponse.json(parsed, { status: response.status })
      } catch {
        return NextResponse.json(
          {
            status: false,
            message: `Erreur API (${response.status}): ${text || "Erreur de serveur"}`,
            data: [],
          },
          { status: response.status }
        )
      }
    }

    const data = await response.json()
    return NextResponse.json(data)
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

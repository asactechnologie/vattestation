import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return new Response(JSON.stringify({ error: "Slug manquant" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    const websiteUrl = process.env.ASAC_WEBSITE_URL || "https://asac.cm"
    const response = await fetch(`${websiteUrl}/api/public/members/${slug}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Membre non trouvé ou erreur (${response.status})` }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
    }

    const result = await response.json()
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error: any) {
    console.error("Proxy verification error:", error)
    return new Response(
      JSON.stringify({
        status: false,
        message:
          error.message ||
          "Erreur lors de la communication avec le serveur de l'ASAC.",
        data: [],
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  }
}


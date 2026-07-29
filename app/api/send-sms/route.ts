import { NextResponse } from "next/server"
import crypto from "node:crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, message } = body

    if (!to || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Parameters 'to' and 'message' are required.",
        },
        { status: 400 }
      )
    }

    const smsApiUrl = process.env.SMS_API_URL
    const clientId = process.env.SMS_API_CLIENT_ID
    const clientSecret = process.env.SMS_API_CLIENT_SECRET

    if (!smsApiUrl || !clientId || !clientSecret) {
      console.error("SMS API configurations missing in environment.")
      return NextResponse.json(
        {
          success: false,
          error: "Internal configurations error.",
        },
        { status: 500 }
      )
    }

    // 1. Prepare HMAC authorization variables
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const nonce = crypto.randomUUID()
    const path = "/send-sms"
    const method = "POST"

    // 2. Build signing payload: Method + "\n" + Path + "\n" + Timestamp + "\n" + Nonce + "\n" + ClientID
    const signingPayload = [method, path, timestamp, nonce, clientId].join("\n")

    // 3. Generate HMAC SHA256 signature
    const signature = crypto
      .createHmac("sha256", clientSecret)
      .update(signingPayload)
      .digest("hex")

    // 4. Dispatch proxy request to the SMS API
    const response = await fetch(`${smsApiUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": clientId,
        "X-Timestamp": timestamp,
        "X-Nonce": nonce,
        "X-Signature": signature,
      },
      body: JSON.stringify({
        to,
        message,
        from: "ASAC",
      }),
    })

    let responseData: any = {}
    try {
      responseData = await response.json()
    } catch (e) {
      console.warn("Failed to parse JSON response from SMS gateway.")
    }

    if (!response.ok) {
      console.error("SMS API responded with error status:", response.status, responseData)
      return NextResponse.json(
        {
          success: false,
          error: responseData.error || "Failed to deliver SMS via gateway.",
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error: any) {
    console.error("BFF SMS routing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during SMS routing.",
      },
      { status: 500 }
    )
  }
}

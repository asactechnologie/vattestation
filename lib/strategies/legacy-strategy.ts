import { AttestationVerificationStrategy, VerificationResponse } from "./types"

export class LegacyAsacStrategy implements AttestationVerificationStrategy {
  private apiUrl: string

  constructor() {
    this.apiUrl = process.env.ASAC_API_URL || "https://ppama-api.asac.cm/api/verifications/public"
  }

  async verify(info: string): Promise<VerificationResponse> {
    console.log("[Legacy API] Verifying...")

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ info }),
      cache: "no-store",
    })

    if (!response.ok) {
      const text = await response.text()
      try {
        const parsed = JSON.parse(text)
        return {
          status: false,
          message: parsed.message || `Erreur API (${response.status})`,
          data: [],
        }
      } catch {
        return {
          status: false,
          message: `Erreur API (${response.status}): ${text || "Erreur de serveur"}`,
          data: [],
        }
      }
    }

    const data = await response.json()
    return data as VerificationResponse
  }
}

import { AttestationVerificationStrategy, VerificationResponse, CertificateData, ChildCertificate } from "./types"

export class NewPpeattStrategy implements AttestationVerificationStrategy {
  private apiUrl: string
  private token: string

  constructor() {
    this.apiUrl = process.env.PPEATT_API_URL || "https://ppeatt-api.asac.cm/api/v1/certificates"
    this.token = process.env.PPEATT_BEARER_TOKEN || "230512|gLgpJWS1aMk5EM6mP8DZpSD86rJNhhiowFuYVRosb40bd2fb"
  }

  private normalizeDate(dateStr?: string): string {
    if (!dateStr) return ""
    const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (match) {
      const [_, day, month, year] = match
      return `${year}-${month}-${day}T00:00:00.000000Z`
    }
    return dateStr
  }

  async verify(info: string): Promise<VerificationResponse> {
    const encodedValue = encodeURIComponent(info.trim())
    const url = `${this.apiUrl}/${encodedValue}/check`

    console.log("[New API] Verifying...")

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({}),
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

    const resData = await response.json()
    
    // Check if the data array is empty (invalid)
    if (!resData.data || resData.data.length === 0) {
      return {
        status: false,
        message: resData.message || "L'attestation d'assurance n'est pas valide ou est introuvable.",
        data: [],
      }
    }

    // Map new API data format to the legacy format
    const mappedData: CertificateData[] = resData.data.map((item: any): CertificateData => {
      let childCert: ChildCertificate | null = null
      if (item.child_certificate) {
        const cc = item.child_certificate
        childCert = {
          reference: cc.reference || "",
          certificate_type: cc.certificate_type ? {
            id: cc.certificate_type.id || "",
            code: cc.certificate_type.code || "",
            name: cc.certificate_type.name || "",
          } : null,
          state: cc.state ? {
            name: cc.state.name || "",
            label: cc.state.label || "",
          } : null,
          download_link: cc.download_link || null,
          starts_at: this.normalizeDate(cc.starts_at),
          ends_at: this.normalizeDate(cc.ends_at),
        }
      }

      return {
        numero_attestation: item.reference || "",
        numero_immatriculation: item.licence_plate || "",
        nom_assure: item.insured_name || "",
        nom_compagnie: item.organization_name || "",
        marque_vehicule: item.vehicle_brand || "",
        modele_vehicule: item.vehicle_model || "",
        date_effet: this.normalizeDate(item.starts_at),
        date_expiration: this.normalizeDate(item.ends_at),
        download_link: item.download_link || null,
        child_certificate: childCert,
      }
    })

    return {
      status: true,
      message: resData.message || null,
      data: mappedData,
    }
  }
}

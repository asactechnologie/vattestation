import {
  AttestationVerificationStrategy,
  VerificationResponse,
  CertificateData,
  ChildCertificate,
  AttestationStatusCode,
  AttestationStatusInfo,
} from "./types"

function parseDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null
  const dStr = dateStr.trim()
  const dmyMatch = dStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch
    const date = new Date(Date.UTC(+y, +m - 1, +d, 0, 0, 0))
    return isNaN(date.getTime()) ? null : date
  }
  const date = new Date(dStr)
  return isNaN(date.getTime()) ? null : date
}

function isStateCancelled(state: unknown): boolean {
  if (!state) return false
  if (typeof state === "object" && state !== null) {
    const s = state as { name?: string; label?: string; code?: string }
    const str = `${s.name || ""} ${s.label || ""} ${s.code || ""}`.toLowerCase()
    return str.includes("cancel") || str.includes("annul") || str.includes("resili")
  }
  const str = String(state).toLowerCase()
  return str.includes("cancel") || str.includes("annul") || str.includes("resili")
}

function isStateSuspended(state: unknown): boolean {
  if (!state) return false
  if (typeof state === "object" && state !== null) {
    const s = state as { name?: string; label?: string; code?: string }
    const str = `${s.name || ""} ${s.label || ""} ${s.code || ""}`.toLowerCase()
    return str.includes("suspend")
  }
  const str = String(state).toLowerCase()
  return str.includes("suspend")
}

function resolveCertificateStatus(
  itemState: unknown,
  childState: unknown,
  startsAtStr?: string,
  endsAtStr?: string,
  now: Date = new Date()
): AttestationStatusInfo {
  // 1. Check Cancellation (Contract or Child Certificate)
  if (isStateCancelled(itemState) || isStateCancelled(childState)) {
    return {
      code: "ANNULEE",
      libelle: "Attestation annulée",
      motif: "Contrat résilié ou annulé",
    }
  }

  // 2. Check Suspension (Contract or Child Certificate)
  if (isStateSuspended(itemState) || isStateSuspended(childState)) {
    return {
      code: "SUSPENDUE",
      libelle: "Attestation suspendue",
      motif: "Suspendue par la compagnie d'assurance",
    }
  }

  // 3. Check Temporal Validity
  const startDate = parseDate(startsAtStr)
  const endDate = parseDate(endsAtStr)

  if (endDate) {
    const endOfDay = new Date(endDate)
    if (endOfDay.getUTCHours() === 0 && endOfDay.getUTCMinutes() === 0 && endOfDay.getUTCSeconds() === 0) {
      endOfDay.setUTCHours(23, 59, 59, 999)
    }
    if (now.getTime() > endOfDay.getTime()) {
      return {
        code: "EXPIREE",
        libelle: "Attestation expirée",
        motif: "Date d'échéance dépassée",
      }
    }
  }

  if (startDate) {
    if (now.getTime() < startDate.getTime()) {
      return {
        code: "A_VENIR",
        libelle: "Attestation pas encore en vigueur",
        motif: "Date d'effet future",
      }
    }
  }

  return {
    code: "VALIDE",
    libelle: "Attestation valide",
    motif: null,
  }
}

function getStatusPriority(code: AttestationStatusCode): number {
  switch (code) {
    case "VALIDE":
      return 1
    case "SUSPENDUE":
      return 2
    case "ANNULEE":
      return 3
    case "A_VENIR":
      return 4
    case "EXPIREE":
      return 5
    case "INTROUVABLE":
      return 6
    default:
      return 99
  }
}

export class NewPpeattStrategy implements AttestationVerificationStrategy {
  private readonly apiUrl: string
  private readonly token: string

  constructor() {
    this.apiUrl = process.env.PPEATT_API_URL || "https://ppeatt-api.asac.cm/api/v1/certificates"
    this.token = process.env.PPEATT_BEARER_TOKEN || "230512|gLgpJWS1aMk5EM6mP8DZpSD86rJNhhiowFuYVRosb40bd2fb"
  }

  private normalizeDate(dateStr?: string): string {
    if (!dateStr) return ""
    const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (match) {
      const [, day, month, year] = match
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
          success: false,
          est_couvert: false,
          statut: {
            code: "INTROUVABLE",
            libelle: "Erreur de vérification",
            motif: parsed.message || `Erreur API (${response.status})`,
          },
          message: parsed.message || `Erreur API (${response.status})`,
          data: [],
        }
      } catch {
        return {
          status: false,
          success: false,
          est_couvert: false,
          statut: {
            code: "INTROUVABLE",
            libelle: "Erreur de vérification",
            motif: `Erreur API (${response.status})`,
          },
          message: `Erreur API (${response.status}): ${text || "Erreur de serveur"}`,
          data: [],
        }
      }
    }

    const resData = await response.json()
    
    // Check if the data array is empty (invalid / not found)
    if (!resData.data || resData.data.length === 0) {
      return {
        status: false,
        success: true,
        est_couvert: false,
        statut: {
          code: "INTROUVABLE",
          libelle: "Véhicule non répertorié ou non assuré",
          motif: null,
        },
        message: resData.message || "L'attestation d'assurance n'est pas valide ou est introuvable.",
        data: [],
      }
    }

    const now = new Date()

    // Map new API data format to the CertificateData structure with evaluated status
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

      const normStartsAt = item.date_effet || this.normalizeDate(item.starts_at)
      const normEndsAt = item.date_expiration || this.normalizeDate(item.ends_at)

      const statusInfo: AttestationStatusInfo = (item.statut && item.statut.code)
        ? {
            code: item.statut.code as AttestationStatusCode,
            libelle: item.statut.libelle || item.statut.code,
            motif: item.statut.motif || null,
          }
        : resolveCertificateStatus(
            item.state,
            item.child_certificate?.state,
            normStartsAt,
            normEndsAt,
            now
          )

      const isItemCovered = item.est_couvert !== undefined
        ? Boolean(item.est_couvert)
        : statusInfo.code === "VALIDE"

      return {
        numero_attestation: item.numero_attestation || item.reference || "",
        numero_immatriculation: item.numero_immatriculation || item.licence_plate || "",
        nom_assure: item.nom_assure || item.insured_name || "",
        nom_compagnie: item.nom_compagnie || item.organization_name || "",
        marque_vehicule: item.marque_vehicule || item.vehicle_brand || "",
        modele_vehicule: item.modele_vehicule || item.vehicle_model || "",
        date_effet: normStartsAt,
        date_expiration: normEndsAt,
        download_link: item.download_link || null,
        child_certificate: childCert,
        statut: statusInfo,
        est_couvert: isItemCovered,
        state: item.state ? {
          name: typeof item.state === "object" ? item.state.name || "" : item.state,
          label: typeof item.state === "object" ? item.state.label || "" : item.state,
        } : null,
      }
    })

    // Sort certificates by arbitration priority
    mappedData.sort((a, b) => {
      const rankA = getStatusPriority(a.statut?.code || "INTROUVABLE")
      const rankB = getStatusPriority(b.statut?.code || "INTROUVABLE")

      if (rankA !== rankB) {
        return rankA - rankB
      }

      // Tie-breaker: sort descending by expiration date (newest first)
      const dateA = parseDate(a.date_expiration)?.getTime() || 0
      const dateB = parseDate(b.date_expiration)?.getTime() || 0
      return dateB - dateA
    })

    const selected = mappedData[0]
    const isCovered = resData.est_couvert !== undefined
      ? Boolean(resData.est_couvert)
      : selected.est_couvert === true

    const rootStatut: AttestationStatusInfo = (resData.statut && resData.statut.code)
      ? {
          code: resData.statut.code as AttestationStatusCode,
          libelle: resData.statut.libelle || resData.statut.code,
          motif: resData.statut.motif || null,
        }
      : (selected.statut || {
          code: isCovered ? "VALIDE" : "INTROUVABLE",
          libelle: isCovered ? "Attestation valide" : "Statut indéterminé",
          motif: null,
        })

    return {
      status: resData.status !== undefined ? Boolean(resData.status) : isCovered,
      success: resData.success !== undefined ? Boolean(resData.success) : true,
      est_couvert: isCovered,
      statut: rootStatut,
      message: resData.message || (isCovered ? "Attestation valide et en cours" : (rootStatut.motif || rootStatut.libelle || null)),
      data: mappedData,
    }
  }
}

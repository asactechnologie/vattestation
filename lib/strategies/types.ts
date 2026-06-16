export interface ChildCertificate {
  reference: string;
  certificate_type: {
    id: string;
    code: string;
    name: string;
  } | null;
  state: {
    name: string;
    label: string;
  } | null;
  download_link: string | null;
  starts_at: string;
  ends_at: string;
}

export interface CertificateData {
  numero_attestation: string;
  numero_immatriculation: string;
  nom_assure: string;
  nom_compagnie: string;
  marque_vehicule: string;
  modele_vehicule: string;
  date_effet: string;
  date_expiration: string;
  download_link: string | null;
  child_certificate: ChildCertificate | null;
}

export interface VerificationResponse {
  status: boolean;
  message: string | null;
  data: CertificateData[];
}

export interface AttestationVerificationStrategy {
  verify(info: string): Promise<VerificationResponse>;
}

# Guide d'Utilisation Directe de l'API pour l'Intégration USSD (Vérification d'Attestation)

Ce document décrit comment interroger directement l'API de vérification des attestations (PPEATT) pour le canal USSD, en fournissant les détails de requêtes HTTP, de réponses et le traitement minimaliste requis.

## 1. URL de l'API et Authentification

Pour effectuer une vérification, vous devez envoyer une requête HTTP **POST** à l'endpoint de vérification.

* **URL de base** : `https://ppeatt-api.asac.cm/api/v1/certificates`
* **Point d'accès (Endpoint)** : `POST {URL_de_base}/{valeur_de_recherche}/check`
  * `{valeur_de_recherche}` correspond au numéro d'attestation ou à la plaque d'immatriculation (encodé pour l'URL).
* **En-têtes requis** :
  * `Authorization: Bearer <TOKEN_D_ACCES>`
  * `Content-Type: application/json`
  * `Accept: application/json`

---

## 2. Exemple de Requête (cURL)

```bash
curl -X POST "https://ppeatt-api.asac.cm/api/v1/certificates/REF-12345/check" \
     -H "Authorization: Bearer 230512|gLgpJWS1aMk5EM6mP8DZpSD86rJNhhiowFuYVRosb40bd2fb" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{}'
```

---

## 3. Structure des Réponses de l'API

### Cas A : Attestation Valide (HTTP 200)
L'API retourne un objet JSON contenant un tableau `data` avec les détails de l'attestation trouvée.

```json
{
  "status": true,
  "message": "Certificat trouvé",
  "data": [
    {
      "reference": "ATT-2026-88392",
      "licence_plate": "LT-123-AA",
      "insured_name": "D. Sakou",
      "organization_name": "AXA Cameroon",
      "vehicle_brand": "TOYOTA",
      "vehicle_model": "RAV4",
      "starts_at": "16/06/2026",
      "ends_at": "15/12/2026",
      "download_link": null,
      "child_certificate": null
    }
  ]
}
```

### Cas B : Attestation Invalide ou Introuvable (HTTP 200 ou 404)
Si aucune attestation ne correspond, le tableau `data` est vide ou absent.

```json
{
  "status": false,
  "message": "L'attestation d'assurance n'est pas valide ou est introuvable.",
  "data": []
}
```

---

## 4. Formatage Minimaliste pour Écran USSD (Max 160 Caractères)

Le protocole USSD limite l'affichage à **160 caractères** sans accent pour maximiser la compatibilité avec tous les terminaux mobiles.

### Règle d'extraction et de formatage des données :

1. **Si valide (`status` est `true` et `data` non vide) :**
   Extraire les champs suivants du premier objet de `data` :
   * `reference` (ex: `ATT-2026-88392`)
   * `insured_name` (ex: `D. Sakou`)
   * `organization_name` (ex: `AXA Cameroon`)
   * `ends_at` (ex: `15/12/2026`)

   **Format du message à renvoyer sur l'écran USSD (environ 110-130 caractères) :**
   ```text
   ASAC: VALIDE
   Ref: {reference}
   Assure: {insured_name}
   Compagnie: {organization_name}
   Expire le: {ends_at}
   ```

   *Rendu écran réel :*
   ```text
   ASAC: VALIDE
   Ref: ATT-2026-88392
   Assure: D. Sakou
   Compagnie: AXA Cameroon
   Expire le: 15/12/2026
   ```

2. **Si invalide ou introuvable :**
   **Message écran USSD :**
   ```text
   ASAC: INVALIDE ou introuvable.
   Veuillez verifier la saisie ou contacter votre assureur.
   ```

3. **Si erreur système (HTTP 500 / Timeout) :**
   **Message écran USSD :**
   ```text
   ASAC: Service temporairement indisponible.
   Veuillez reessayer plus tard.
   ```

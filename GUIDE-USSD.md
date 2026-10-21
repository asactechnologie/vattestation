# Guide d'Intégration de l'API de Vérification d'Attestation (Canal USSD)

Ce document est destiné au **prestataire technique en charge du service USSD**. Il décrit comment interroger l'API de vérification des attestations automobiles (E-Attestation / ASAC), comment **déterminer avec précision le statut de validité** d'une attestation, arbitrer les résultats multiples, et formater la réponse pour l'affichage sur écran USSD (limite stricte de 160 caractères).

---

## 1. Vue d'Ensemble & Nouvelle Logique de Statut

### ⚠️ Ce qui change par rapport à la version précédente :
1. **La présence d'un résultat ne vaut plus "Valide" automatique** : Auparavant, le simple fait que l'API renvoie des données (`data` non vide) était interprété comme une attestation valide. **Ce n'est plus le cas.** L'API renvoie également des attestations expirées, suspendues, annulées ou dont la date de prise d'effet est future.
2. **Gestion des 6 statuts normalisés** : Le véhicule est classé selon 6 statuts précis : `VALIDE`, `SUSPENDUE`, `ANNULEE`, `EXPIREE`, `A_VENIR`, `INTROUVABLE`.
3. **Décision binaire de couverture (`COUVERT` vs `NON COUVERT`)** : Un véhicule n'est considéré comme **COUVERT** que si son statut est strictement `VALIDE`. Pour tous les autres statuts, le véhicule est **NON COUVERT**.
4. **Arbitrage des résultats multiples** : Pour une même plaque d'immatriculation, l'API peut renvoyer plusieurs attestations (historique des contrats, renouvellements). Le prestataire doit appliquer une **règle de priorité stricte** pour retenir l'attestation active.

---

## 2. Point d'Accès API et Authentification

* **Méthode HTTP** : `POST`
* **URL de base** : `https://eattestation-api.asac.cm/api/v1/certificates`
* **Endpoint** : `POST {URL_de_base}/{valeur_de_recherche}/check`
* **En-têtes requis** :
  * `Authorization: Bearer <TOKEN_D_ACCES>`
  * `Content-Type: application/json`
  * `Accept: application/json`
* **Corps (Body)** : `{}` (JSON vide)

### 💡 Nettoyage obligatoire de la saisie utilisateur (Input Sanitization)
Sur un clavier de téléphone (USSD), l'utilisateur peut saisir des espaces ou des tirets (ex: `LT 123 AA`, `lt-123-aa`).
Avant d'envoyer la requête à l'API :
1. Convertir en **majuscules**.
2. Supprimer tous les **espaces** et **tirets**.
3. Encoder la valeur pour l'URL (`encodeURIComponent`).

> **Exemple** : `"lt 123-aa"` → `"LT123AA"` → `POST .../certificates/LT123AA/check`

---

## 3. Exemple de Requête (cURL)

```bash
curl -X POST "https://eattestation-api.asac.cm/api/v1/certificates/LT123AA/check" \
     -H "Authorization: Bearer 230512|gLgpJWS1aMk5EM6mP8DZpSD86fJNhhiowFuYTRosb40bd2fb" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{}'
```

---

## 4. Référentiel des 6 Statuts Métier

| Code Statut | État Couverture | Libellé Métier | Condition de Détection |
| :--- | :---: | :--- | :--- |
| **`VALIDE`** | **COUVERT** | Attestation valide | Non suspendue, non annulée, et `date_effet <= aujourd'hui <= date_expiration`. |
| **`SUSPENDUE`** | **NON COUVERT** | Attestation suspendue | État contrat ou carte rose (`child_certificate`) contient `"suspend"`. |
| **`ANNULEE`** | **NON COUVERT** | Attestation annulée / résiliée | État contrat ou carte rose (`child_certificate`) contient `"cancel"`, `"annul"` ou `"resili"`. |
| **`EXPIREE`** | **NON COUVERT** | Attestation expirée | Date de fin (`ends_at`) dépassée (`aujourd'hui > ends_at` à 23:59:59). |
| **`A_VENIR`** | **NON COUVERT** | Prise d'effet future | Date de début (`starts_at`) dans le futur (`aujourd'hui < starts_at`). |
| **`INTROUVABLE`**| **NON COUVERT** | Véhicule non répertorié | Tableau `data` vide ou `status: false` / `404`. |

---

## 5. Algorithme de Résolution et d'Arbitrage (Obligatoire)

Lorsque l'API retourne une réponse HTTP 200, vous devez appliquer l'algorithme suivant :

### Étape 1 : Vérifier la présence de données
* Si `data` est vide (`[]`), `null`, ou si la réponse HTTP est une 404 → Statut = **`INTROUVABLE`**.

### Étape 2 : Évaluer le statut de chaque attestation du tableau `data`
Pour chaque élément `item` du tableau :

1. **Vérification d'un statut déjà calculé** :
   * Si `item.statut.code` existe déjà, utiliser directement ce code (`VALIDE`, `SUSPENDUE`, `ANNULEE`, `EXPIREE`, `A_VENIR`).
2. **Vérification d'Annulation** :
   * Si l'état de l'attestation (`item.state`) ou de sa carte rose (`item.child_certificate.state`) contient `"cancel"`, `"annul"` ou `"resili"` → Statut = **`ANNULEE`**.
3. **Vérification de Suspension** :
   * Si l'état de l'attestation (`item.state`) ou de sa carte rose (`item.child_certificate.state`) contient `"suspend"` → Statut = **`SUSPENDUE`**.
4. **Vérification Temporelle (Dates)** :
   * Convertir la date d'échéance (`item.ends_at` ou `item.date_expiration`).
     * Si `date_actuelle > date_echeance` (prise à 23:59:59) → Statut = **`EXPIREE`**.
   * Convertir la date de prise d'effet (`item.starts_at` ou `item.date_effet`).
     * Si `date_actuelle < date_prise_effet` → Statut = **`A_VENIR`**.
5. **Validation** :
   * Si aucune condition précédente n'est remplie → Statut = **`VALIDE`**.

### Étape 3 : Arbitrage en cas d'attestations multiples (Tri par Priorité)
Si plusieurs attestations sont retournées pour une même immatriculation, trier la liste selon l'ordre de priorité strict suivant :

1. **`VALIDE`** (Priorité 1 - Prime toujours sur tout le reste)
2. **`SUSPENDUE`** (Priorité 2)
3. **`ANNULEE`** (Priorité 3)
4. **`A_VENIR`** (Priorité 4)
5. **`EXPIREE`** (Priorité 5)
6. **`INTROUVABLE`** (Priorité 6)

> **Départage (Tie-breaker)** : En cas d'égalité de priorité (ex: deux attestations expirées de deux années différentes), retenir celle dont la date d'échéance (`ends_at`) est la plus récente (tri décroissant par date d'expiration).

👉 **L'attestation en tête de liste après ce tri est l'attestation active à afficher.**

---

## 6. Formatage pour Écran USSD (Max 160 Caractères)

### ⚠️ Règles strictes d'affichage :
* **Limite stricte** : Maximum **160 caractères** (norme GSM 7-bit standard).
* **Zéro accent** : Ne pas utiliser de caractères accentués (`é`, `è`, `ê`, `à`, `ç`, etc.) afin de garantir la compatibilité universelle sur tous les téléphones (y compris les téléphones basiques 2G) et d'empêcher le basculement en encodage UCS-2 (qui réduirait la limite à 70 caractères).
* **Format des dates** : `JJ/MM/AAAA` (10 caractères).

---

### Modèles de Messages USSD par Statut

#### 1. Véhicule Valide (`VALIDE` - COUVERT)
```text
ASAC: COUVERT (VALIDE)
Ref: {reference}
Assure: {insured_name}
Cie: {organization_name}
Expire le: {ends_at}
```
*Exemple réel (~105 caractères) :*
```text
ASAC: COUVERT (VALIDE)
Ref: ATT-2026-88392
Assure: D. SAKOU
Cie: AXA CAMEROON
Expire le: 15/12/2026
```

---

#### 2. Véhicule Expiré (`EXPIREE` - NON COUVERT)
```text
ASAC: NON COUVERT (EXPIREE)
Ref: {reference}
Cie: {organization_name}
Echue le: {ends_at}
Veuillez renouveler votre contrat.
```
*Exemple réel (~125 caractères) :*
```text
ASAC: NON COUVERT (EXPIREE)
Ref: ATT-2025-10492
Cie: CHANAS ASSURANCES
Echue le: 31/01/2026
Veuillez renouveler votre contrat.
```

---

#### 3. Véhicule Suspendu (`SUSPENDUE` - NON COUVERT)
```text
ASAC: NON COUVERT (SUSPENDUE)
Ref: {reference}
Cie: {organization_name}
Motif: Attestation suspendue.
Contactez votre assureur.
```
*Exemple réel (~125 caractères) :*
```text
ASAC: NON COUVERT (SUSPENDUE)
Ref: ATD-8FD81DE057
Cie: ACTIVA ASSURANCES
Motif: Attestation suspendue.
Contactez votre assureur.
```

---

#### 4. Véhicule Annulé ou Résilié (`ANNULEE` - NON COUVERT)
```text
ASAC: NON COUVERT (ANNULEE)
Ref: {reference}
Cie: {organization_name}
Motif: Contrat resilie ou annule.
Contactez votre assureur.
```
*Exemple réel (~126 caractères) :*
```text
ASAC: NON COUVERT (ANNULEE)
Ref: ATD-4C9720D1EB
Cie: PRUDENTIAL BENEFICIAL
Motif: Contrat resilie ou annule.
Contactez votre assureur.
```

---

#### 5. Véhicule avec Prise d'Effet Future (`A_VENIR` - NON COUVERT)
```text
ASAC: NON COUVERT (A VENIR)
Ref: {reference}
Cie: {organization_name}
Effet le: {starts_at}
Expire le: {ends_at}
```
*Exemple réel (~115 caractères) :*
```text
ASAC: NON COUVERT (A VENIR)
Ref: ATT-2027-00124
Cie: SAHAM ASSURANCES
Effet le: 01/10/2026
Expire le: 30/09/2027
```

---

#### 6. Véhicule Introuvable ou Inconnu (`INTROUVABLE` - NON COUVERT)
```text
ASAC: NON COUVERT
Aucune attestation trouvee pour ce vehicule.
Verifiez la saisie ou contactez votre assureur.
```
*(Longueur : ~110 caractères)*

---

#### 7. Erreur Technique ou Timeout Réseau
```text
ASAC: Service temporairement indisponible.
Veuillez reessayer plus tard.
```
*(Longueur : ~71 caractères)*

---

## 7. Exemples de Payloads JSON Retournés par l'API

### A. Cas d'une Attestation Valide
```json
{
  "status": true,
  "message": "Certificat trouvé",
  "data": [
    {
      "reference": "ATT-2026-88392",
      "licence_plate": "LT123AA",
      "insured_name": "D. Sakou",
      "organization_name": "AXA Cameroon",
      "vehicle_brand": "TOYOTA",
      "vehicle_model": "RAV4",
      "starts_at": "16/06/2026",
      "ends_at": "15/12/2026",
      "state": {
        "name": "active",
        "label": "Actif"
      },
      "child_certificate": {
        "reference": "CR-2026-99120",
        "state": {
          "name": "active",
          "label": "Actif"
        }
      }
    }
  ]
}
```

### B. Cas d'une Attestation Suspendue
```json
{
  "status": true,
  "message": "Certificat trouvé",
  "data": [
    {
      "reference": "ATD-8FD81DE057",
      "licence_plate": "LT9002BD",
      "insured_name": "BATTERIE SARL",
      "organization_name": "ACTIVA ASSURANCES",
      "starts_at": "03/09/2026",
      "ends_at": "02/09/2027",
      "state": {
        "name": "active",
        "label": "Actif"
      },
      "child_certificate": {
        "reference": "ATD-A9B1BFD321",
        "state": {
          "name": "suspended",
          "label": "Suspendue"
        }
      }
    }
  ]
}
```
*(Remarque : la suspension de la carte rose entraîne automatiquement le statut `SUSPENDUE`).*

### C. Cas d'une Attestation Expirée
```json
{
  "status": true,
  "message": "Certificat trouvé",
  "data": [
    {
      "reference": "ATT-2025-10492",
      "licence_plate": "CE980AB",
      "insured_name": "KAMGA PIERRE",
      "organization_name": "CHANAS ASSURANCES",
      "starts_at": "01/01/2025",
      "ends_at": "31/01/2026",
      "state": {
        "name": "active",
        "label": "Actif"
      },
      "child_certificate": null
    }
  ]
}
```

### D. Cas d'un Véhicule Introuvable ou Non Répertorié
```json
{
  "status": false,
  "message": "L'attestation d'assurance n'est pas valide ou est introuvable.",
  "data": []
}
```

---

## 8. Recommandations d'Intégration & Performance

1. **Timeout HTTP** : Configurer un timeout strict de **5 à 7 secondes** côté passerelle USSD pour éviter que la session USSD ne soit coupée par l'opérateur télécom (timeout opérateur généralement à 15-20 secondes).
2. **Troncature défensive** : Si le nom de l'assuré ou de la compagnie est exceptionnellement long, tronquer le champ à 20-25 caractères pour garantir que la longueur totale reste sous la barre des 160 caractères.
3. **Journalisation (Logs)** : Enregistrer la référence, l'immatriculation et le statut résolu pour chaque requête USSD afin de faciliter les réconciliations avec l'ASAC.

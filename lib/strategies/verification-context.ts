import { AttestationVerificationStrategy, VerificationResponse } from "./types"
import { LegacyAsacStrategy } from "./legacy-strategy"
import { NewPpeattStrategy } from "./new-ppeatt-strategy"

export class VerificationContext {
  private strategy: AttestationVerificationStrategy

  constructor() {
    const provider = process.env.VERIFICATION_PROVIDER || "new_ppeatt"
    if (provider === "legacy") {
      this.strategy = new LegacyAsacStrategy()
    } else {
      this.strategy = new NewPpeattStrategy()
    }
  }

  async verify(info: string): Promise<VerificationResponse> {
    return this.strategy.verify(info)
  }
}

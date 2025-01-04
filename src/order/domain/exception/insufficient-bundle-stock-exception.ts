import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InsufficientBundleStockException extends DomainException {
    constructor(bundleId: string, bundleName: string, requestedQuantity: number, availableStock: number) {
      super(
        `Insufficient stock for bundle ${bundleName} (ID: ${bundleId}). Requested: ${requestedQuantity}, Available: ${availableStock}`);
    }
  }
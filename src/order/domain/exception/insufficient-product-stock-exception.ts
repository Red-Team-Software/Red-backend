import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InsufficientProductStockException extends DomainException {
    constructor(
      productId: string,
      productName: string,
      requestedQuantity: number,
      availableStock: number
    ) {
      super(
        `Insufficient stock for product ${productName} (ID: ${productId}). Requested: ${requestedQuantity}, Available: ${availableStock}`);
    }
  }
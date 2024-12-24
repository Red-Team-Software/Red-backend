import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidPaymentMethodIdException extends DomainException {
  constructor() {
    super('The provided id is not a Uuid');
  }
}
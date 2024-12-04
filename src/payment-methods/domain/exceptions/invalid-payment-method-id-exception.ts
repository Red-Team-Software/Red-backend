import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class InvalidPaymentMethodIdException extends DomainException {
  constructor() {
    super('The provided id is not a Uuid');
  }
}
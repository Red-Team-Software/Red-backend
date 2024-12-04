import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class InvalidPaymentMethodStateException extends DomainException {
  constructor() {
    super('The provided state is not valid');
  }
}
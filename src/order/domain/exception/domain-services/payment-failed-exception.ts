import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class PaymentFailedException extends DomainException {
    constructor() {
        super(`The payment failed please try again`);
    }
}
import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class MissingPaymentMethodAtributes extends DomainException {
    constructor() {
        super('The payment method is missing atributes');
    }
}
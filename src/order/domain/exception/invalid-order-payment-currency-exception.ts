import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class InvalidPaymentCurrencyException extends DomainException {
    constructor() {
        super("The payment currency is not valid");
    }
}
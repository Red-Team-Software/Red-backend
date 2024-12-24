import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class NegativePaymentAmountException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}
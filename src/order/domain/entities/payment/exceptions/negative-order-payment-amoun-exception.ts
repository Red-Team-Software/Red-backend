import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class NegativePaymentAmountException extends DomainException {
    constructor() {
        super("The payment amount can not be negative");
    }
}
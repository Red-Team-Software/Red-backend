import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class InvalidCurrencyOrderTotalAmountException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}
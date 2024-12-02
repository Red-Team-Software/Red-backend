import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class NegativeOrderTotalAmountException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}
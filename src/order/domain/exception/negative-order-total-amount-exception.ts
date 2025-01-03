import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class NegativeOrderTotalAmountException extends DomainException {
    constructor() {
        super('The amount cannot be negative');
    }
}
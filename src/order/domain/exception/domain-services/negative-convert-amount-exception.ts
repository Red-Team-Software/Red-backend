import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class NegativeConvertAmountException extends DomainException {
    constructor() {
        super('The amount cannot be negative');
    }
}
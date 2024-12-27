import { DomainException } from "src/common/domain/domain-exception/domain-exception";


export class NegativeConvertAmountException extends DomainException {
    constructor() {
        super('The amount cannot be negative');
    }
}
import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class InvalidConvertAmountException extends DomainException {
    constructor() {
        super('The currency is not in the list of valid currencies');
    }
}
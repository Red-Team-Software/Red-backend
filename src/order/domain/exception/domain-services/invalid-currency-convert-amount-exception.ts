import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidConvertAmountException extends DomainException {
    constructor() {
        super('The currency is not in the list of valid currencies');
    }
}
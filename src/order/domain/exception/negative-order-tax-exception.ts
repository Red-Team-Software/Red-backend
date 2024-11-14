import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class NegativeOrderTaxException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}
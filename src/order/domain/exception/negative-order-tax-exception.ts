import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class NegativeOrderTaxException extends DomainException {
    constructor() {
        super('The tax must be positive');
    }
}
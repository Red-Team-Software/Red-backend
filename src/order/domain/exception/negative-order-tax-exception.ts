import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class NegativeOrderTaxException extends DomainException {
    constructor() {
        super('The tax must be positive');
    }
}
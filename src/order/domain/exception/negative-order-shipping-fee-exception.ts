import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class NegativeOrderShippingFeeException extends DomainException {
    constructor() {
        super('The order shipping must be positive');
    }
}
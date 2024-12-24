import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class NegativeOrderShippingFeeException extends DomainException {
    constructor() {
        super('The order shipping must be positive');
    }
}
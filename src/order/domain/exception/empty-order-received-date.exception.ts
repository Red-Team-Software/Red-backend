import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class EmptyOrderReceivedDateException extends DomainException {
    constructor() {
        super('The order received date cannot be empty');
    }
}
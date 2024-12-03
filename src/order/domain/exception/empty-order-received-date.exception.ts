import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class EmptyOrderReceivedDateException extends DomainException {
    constructor() {
        super('The order received date cannot be empty');
    }
}
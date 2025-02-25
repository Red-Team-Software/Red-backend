import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class EmptyOrderDirectionLatitudeException extends DomainException {
    constructor() {
        super('The latitude is empty');
    }
}
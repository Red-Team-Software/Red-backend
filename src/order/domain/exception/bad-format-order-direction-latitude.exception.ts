import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class BadFormatOrderDirectionLatitudeException extends DomainException {
    constructor() {
        super('The latitude of the order direction is in a bad format, must be a number');
    }
}
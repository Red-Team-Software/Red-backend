import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class BadFormatOrderDirectionLongitudeException extends DomainException {
    constructor() {
        super('The longitude of the order direction is in a bad format, must be a number');
    }
}
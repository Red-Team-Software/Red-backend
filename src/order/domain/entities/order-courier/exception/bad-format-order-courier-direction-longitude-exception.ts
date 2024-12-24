import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class BadFormatOrderCourierDirectionLongitudeException extends DomainException {
    constructor() {
        super('The longitude of the courier direction is in a bad format, must be a number');
    }
}
import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class BadFormatOrderCourierDirectionLatitudeException extends DomainException {
    constructor() {
        super('The latitude of the courier direction is in a bad format, must be a number');
    }
}
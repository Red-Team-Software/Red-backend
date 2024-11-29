import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class EmptyOrderDirectionLongitudeException extends DomainException {
    constructor() {
        super('The longitude is empty');
    }
}
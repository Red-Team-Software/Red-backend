import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class EmptyOrderDirectionLatitudeException extends DomainException {
    constructor() {
        super('The latitude is empty');
    }
}
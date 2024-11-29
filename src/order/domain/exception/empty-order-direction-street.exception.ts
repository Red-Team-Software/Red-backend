import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class EmptyOrderDirectionStreetException extends DomainException {
    constructor() {
        super('The adreess is empty');
    }
}
import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class EmptyOrderDirectionStreetException extends DomainException {
    constructor() {
        super('The adreess is empty');
    }
}
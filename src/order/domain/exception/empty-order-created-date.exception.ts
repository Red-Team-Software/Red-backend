import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class EmptyOrderCreatedDateException extends DomainException {
    constructor() {
        super('The order created date is empty');
    }
}
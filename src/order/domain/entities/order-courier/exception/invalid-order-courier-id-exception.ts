import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidOrderCourierIdException extends DomainException {
    constructor() {
        super('The provided courier ID is not a valid UUID.');
    }
}
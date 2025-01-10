import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidOrderCourierIdException extends DomainException {
    constructor() {
        super('The provided courier ID is not a valid UUID.');
    }
}
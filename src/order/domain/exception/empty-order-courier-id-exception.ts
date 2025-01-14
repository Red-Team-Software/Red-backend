import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class EmptyOrderCourierIdException extends DomainException {
    constructor() {
        super('The Order Courier Id is empty');
    }
}
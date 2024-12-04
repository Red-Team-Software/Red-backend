import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class EmptyOrderCourierIdException extends DomainException {
    constructor() {
        super('The Order Courier Id is empty');
    }
}
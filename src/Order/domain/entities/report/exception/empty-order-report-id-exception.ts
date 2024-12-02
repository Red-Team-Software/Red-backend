import { DomainException } from "src/common/domain/domain-exeption/domain-exception";


export class EmptyOrderReportIdException extends DomainException {
    constructor() {
        super('The Order Report Id is empty');
    }
}
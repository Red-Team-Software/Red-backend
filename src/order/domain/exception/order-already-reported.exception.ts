import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class OrderAlreadyReportedException extends DomainException {
    constructor() {
        super('The order already has already been reported');
    }
}
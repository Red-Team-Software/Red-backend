import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class EmptyOrderCuponIdException extends DomainException {
    constructor() {
        super('The Order Cupon Id is empty');
    }
}
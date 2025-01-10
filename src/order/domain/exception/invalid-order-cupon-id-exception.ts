import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidOrderCuponIdException extends DomainException {
    constructor() {
        super('The provided cupon ID is not a valid UUID.');
    }
}
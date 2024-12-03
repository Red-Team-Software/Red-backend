import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidCuponIdException extends DomainException {
    constructor() {
        super("The provided Cupon ID is invalid.");
    }
}

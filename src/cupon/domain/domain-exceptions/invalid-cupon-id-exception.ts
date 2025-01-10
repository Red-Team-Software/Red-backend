import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidCuponIdException extends DomainException {
    constructor() {
        super("The provided Cupon ID is invalid.");
    }
}

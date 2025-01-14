import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidCuponException extends DomainException {
    constructor() {
        super("The provided Cupon is invalid.");
    }
}

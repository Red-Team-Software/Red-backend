import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidCuponNameException extends DomainException {
    constructor() {
        super("The provided Cupon Name is invalid.");
    }
}

import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidCuponStateException extends DomainException {
    constructor() {
        super("The provided Cupon State is invalid.");
    }
}

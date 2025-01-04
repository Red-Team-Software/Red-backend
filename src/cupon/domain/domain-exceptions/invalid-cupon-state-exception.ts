import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidCuponStateException extends DomainException {
    constructor() {
        super("The provided Cupon State is invalid.");
    }
}

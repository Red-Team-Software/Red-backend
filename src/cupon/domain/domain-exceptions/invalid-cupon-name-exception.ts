import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidCuponNameException extends DomainException {
    constructor() {
        super("The provided Cupon Name is invalid.");
    }
}

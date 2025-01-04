import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidCuponCodeException extends DomainException {
    constructor() {
        super("The provided Cupon Code is invalid.");
    }
}

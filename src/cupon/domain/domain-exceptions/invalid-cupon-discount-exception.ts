import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidCuponDiscountException extends DomainException {
    constructor() {
        super("The provided Cupon Discount is invalid.");
    }
}

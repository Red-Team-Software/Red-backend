import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidCuponDiscountException extends DomainException {
    constructor() {
        super("The provided Cupon Discount is invalid.");
    }
}

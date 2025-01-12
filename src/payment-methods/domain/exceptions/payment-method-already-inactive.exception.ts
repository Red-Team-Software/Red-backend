import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class PaymentMethodAlreadyInactiveException extends DomainException{
    constructor(){super("Payment method is already inactive")}
}